/**
 * handleRestoringSession.js
 * 
 * State Machine Handler: RESTORING_SESSION
 * 
 * NÄR: Page reload under aktiv session (tabSession finns i sessionStorage)
 * VAD:
 *   1. Läs tabSession för sessionInfo
 *   2. Hydrate från localStorage (formData, completedSlides, activeCase)
 *   3. Validera inkonsistent state (isDraftMode vs activeCase)
 *   4. Om permanent läge - synka med server
 *   5. Navigera till där användaren var
 * 
 * → READY (eller CHECKING_PENDING vid fel/inkonsistens)
 */

/**
 * Factory function som skapar handleRestoringSession handler.
 * 
 * @param {Function} getState - Callback som returnerar aktuellt state
 * @param {Function} getActions - Callback som returnerar setters och actions
 * @param {Object} services - Objekt med api, storage, navigate, SLIDE_ORDER, AppState
 * @returns {Function} - Handler-funktion som kan anropas av state machine
 */
export function createHandleRestoringSession(getState, getActions, services) {
  return async function handleRestoringSession() {
    const { isDraftMode } = getState();
    
    const {
      setIsLoading,
      setAppState,
      setFormData,
      setCompletedSlides,
      setActiveCase,
      setIsDraftMode,
      setIsPaymentConfirmed,
      setCurrentSlideKey,
    } = getActions();
    
    const { storage, api, navigate, SLIDE_ORDER, AppState } = services;
    
    setIsLoading(true);
    
    // ─────────────────────────────────────────────────────────────────
    // Steg 1: Läs currentTabSession för sessionInfo
    // ─────────────────────────────────────────────────────────────────
    const tabSession = storage.getCurrentTabSession();
    
    if (!tabSession || !tabSession.sessionId) {
      console.warn('[RESTORE] No tab session found - falling back to CHECKING_PENDING');
      setIsLoading(false);
      setAppState(AppState.CHECKING_PENDING);
      return;
    }
    
    console.log('[RESTORE] Restoring tab session:', tabSession);
    
    // ─────────────────────────────────────────────────────────────────
    // Steg 2: Hydrate från localStorage
    // ─────────────────────────────────────────────────────────────────
    const savedFormData = storage.getFormData();
    const savedCompletedSlides = storage.getCompletedSlides();
    const savedActiveCase = storage.getActiveCase();
    
    setFormData(savedFormData);
    setCompletedSlides(savedCompletedSlides);
    if (savedActiveCase) {
      setActiveCase(savedActiveCase);
    }
    
    console.log('[RESTORE] Hydrated from localStorage:', {
      formDataKeys: Object.keys(savedFormData),
      completedSlides: savedCompletedSlides,
      activeCase: savedActiveCase,
    });
    
    // ─────────────────────────────────────────────────────────────────
    // Steg 2.5: Validera inkonsistent state (isDraftMode=false men inget activeCase)
    // ─────────────────────────────────────────────────────────────────
    if (!isDraftMode && !savedActiveCase) {
      console.warn('[RESTORE] ⚠️ Inconsistent state: isDraftMode=false but no activeCase - resetting to draft mode');
      setIsDraftMode(true);
      storage.setIsDraftMode(true);
      
      // Rensa alla onboarding-nycklar från localStorage
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.includes('onboarding')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      // Rensa sessionStorage
      storage.clearCurrentTabSession();
      
      // Återställ state
      setActiveCase(null);
      setFormData({});
      setCompletedSlides([]);
      
      console.log('[RESTORE] ✅ Reset to draft mode - redirecting to CHECKING_PENDING');
      setIsLoading(false);
      setAppState(AppState.CHECKING_PENDING);
      return;
    }
    
    // ─────────────────────────────────────────────────────────────────
    // Steg 3: Om permanent läge - synka med server
    // ─────────────────────────────────────────────────────────────────
    if (!isDraftMode && savedActiveCase?.companyId) {
      try {
        console.log('[RESTORE] Fetching metadata from server for sync...');
        const metadata = await api.fetchMetadata(
          savedActiveCase.companyId,
          savedActiveCase.caseId || savedActiveCase.onboardingId
        );
        
        // Synka completedSlides från server (servern har auktoritet)
        if (metadata.completedSlides) {
          setCompletedSlides(metadata.completedSlides);
          storage.setCompletedSlides(metadata.completedSlides);
        }
        
        // 📌 SPARA SERVER VERSION för conflict detection
        const serverVersion = metadata?.metadata?.version || metadata?.version || 0;
        const caseId = savedActiveCase.caseId || savedActiveCase.onboardingId;
        const versionStorageKey = `case_${savedActiveCase.companyId}_${caseId}_version`;
        localStorage.setItem(versionStorageKey, JSON.stringify({
          version: serverVersion,
          timestamp: new Date().toISOString(),
          syncedFromServer: true
        }));
        console.log('[RESTORE] 📌 Sparade server version:', serverVersion);
        
        // 🔓 Synka betalningsstatus för att låsa upp företagsdata-slides
        const paymentConfirmed = metadata.subscription?.payment_confirmed_at ||
                                  metadata.metadata?.subscription?.payment_confirmed_at;
        if (paymentConfirmed) {
          console.log('[RESTORE] 🔓 Payment confirmed - unlocking företagsdata slides');
          setIsPaymentConfirmed(true);
        }
        
        console.log('[RESTORE] Synced with server metadata');
      } catch (e) {
        console.error('[RESTORE] ❌ Failed to sync with server:', e);
        console.log('[RESTORE] Error status:', e.status);
        
        if (e.status === 404 || e.message?.includes('404') || e.message?.includes('not found') || e.message?.includes('Not Found')) {
          console.warn('[RESTORE] 🗑️ Company/case not found on server (404) - clearing localStorage and resetting state');
          
          // STEG 1: Sätt isDraftMode=true OMEDELBART
          setIsDraftMode(true);
          localStorage.setItem('is_draft_mode', 'true');
          
          // STEG 2: Rensa all localStorage-data relaterad till onboarding
          const keysToRemove = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.includes('onboarding')) {
              keysToRemove.push(key);
            }
          }
          keysToRemove.forEach(key => localStorage.removeItem(key));
          
          // STEG 3: Rensa även sessionStorage (tab session)
          storage.clearCurrentTabSession();
          
          // STEG 4: Återställ state
          setActiveCase(null);
          setFormData({});
          setCompletedSlides([]);
          
          console.log('[RESTORE] 🔄 State reset complete, going to CHECKING_PENDING');
          
          // STEG 5: Gå till CHECKING_PENDING för fresh start
          setIsLoading(false);
          setAppState(AppState.CHECKING_PENDING);
          return;
        }
        
        // För andra fel, fortsätt med localStorage-data
        console.warn('[RESTORE] Using localStorage data despite server sync failure');
      }
    }
    
    // ─────────────────────────────────────────────────────────────────
    // Steg 4: Navigera till där användaren var
    // ─────────────────────────────────────────────────────────────────
    const targetSlide = tabSession.currentSlide || 'uppdragsval';
    setCurrentSlideKey(targetSlide);
    
    const slide = SLIDE_ORDER.find(s => s.key === targetSlide);
    if (slide) {
      navigate(slide.path);
      console.log(`[RESTORE] Navigated to: ${slide.path}`);
    }
    
    // Logga för audit trail
    await api.logPersonal('Session restored after page reload', {
      sessionId: tabSession.sessionId,
      currentSlide: targetSlide,
      isDraftMode,
    });
    
    setIsLoading(false);
    setAppState(AppState.READY);
  };
}
