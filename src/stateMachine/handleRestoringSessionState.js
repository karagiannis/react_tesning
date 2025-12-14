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
    
    if (!tabSession || !tabSession.session_id) {
      console.warn('[RESTORE] No tab session found - falling back to CHECKING_PENDING');
      setIsLoading(false);
      setAppState(AppState.CHECKING_PENDING);
      return;
    }
    
    console.log('[RESTORE] Restoring tab session:', tabSession);
    
    // ─────────────────────────────────────────────────────────────────
    // Steg 1.5: Parsa sessionId för att avgöra om det är draft eller permanent
    // Format: onboarding::company_id::case_id::user_id (permanent)
    // Format: onboarding::draft::temp_xxx::user_id (draft)
    // ─────────────────────────────────────────────────────────────────
    const sessionParts = tabSession.session_id.split('::');
    const isPermanentSession = sessionParts.length >= 4 && sessionParts[1] !== 'draft';
    
    console.log('[RESTORE] Session type:', isPermanentSession ? 'PERMANENT' : 'DRAFT');
    console.log('[RESTORE] Session parts:', sessionParts);
    
    let savedActiveCase = null;
    let savedFormData = {};
    let savedCompletedSlides = [];
    
    if (isPermanentSession) {
      // ═══════════════════════════════════════════════════════════════
      // PERMANENT CASE: Läs från permanent nycklar
      // ═══════════════════════════════════════════════════════════════
      const [, company_id, case_id, user_id] = sessionParts;
      console.log('[RESTORE] Permanent case detected:', { company_id, case_id, user_id });
      
      // Bygg activeCase objekt från sessionId
      savedActiveCase = {
        company_id,
        case_id,
        // Dessa kan vara null, men fylls i från server om vi behöver synka
        company_name: null,
      };
      
      // Läs slide-data från permanenta nycklar
      const permanentPrefix = `onboarding::${company_id}::${case_id}::${user_id}::`;
      console.log('[RESTORE] Looking for permanent keys with prefix:', permanentPrefix);
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(permanentPrefix)) {
          let slideKey = key.replace(permanentPrefix, '');
          try {
            const value = JSON.parse(localStorage.getItem(key));
            if (slideKey === 'completedSlides') {
              savedCompletedSlides = value || [];
            } else if (slideKey === 'activeCase') {
              savedActiveCase = value;
            } else if (slideKey.startsWith('pages::')) {
              // 🔧 FIX: Nycklar har ::pages:: prefix - extrahera bara slide-namnet
              const actualSlideKey = slideKey.replace('pages::', '');
              savedFormData[actualSlideKey] = value;
              console.log('[RESTORE]   Found page:', actualSlideKey);
            } else {
              // Metadata-nycklar (version, modified_by, etc.) - ignorera
              console.log('[RESTORE]   Found metadata:', slideKey);
            }
          } catch (e) {
            console.warn('[RESTORE]   Failed to parse:', key, e);
          }
        }
      }
      
      // Sätt isDraftMode=false för permanent case
      setIsDraftMode(false);
      storage.setIsDraftMode(false);
      
    } else {
      // ═══════════════════════════════════════════════════════════════
      // DRAFT CASE: Läs från draft-nycklar (befintlig logik)
      // ═══════════════════════════════════════════════════════════════
      savedFormData = storage.getFormData();
      savedCompletedSlides = storage.getCompletedSlides();
      savedActiveCase = storage.getActiveCase();
    }
    
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
    // Steg 2.5: Validera inkonsistent state
    // Om permanent session men ingen data hittades → gå till CHECKING_PENDING
    // (servern har datan, vi behöver bara hämta den via resume-flödet)
    // ─────────────────────────────────────────────────────────────────
    if (isPermanentSession && Object.keys(savedFormData).length === 0) {
      console.warn('[RESTORE] ⚠️ Permanent session but no local data - fetching from server');
      // Rensa tab session så vi inte hamnar i loop
      storage.clearCurrentTabSession();
      setIsLoading(false);
      setAppState(AppState.CHECKING_PENDING);
      return;
    }
    
    if (!isPermanentSession && !savedActiveCase) {
      console.warn('[RESTORE] ⚠️ Draft session but no activeCase - resetting to draft mode');
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
    if (isPermanentSession && savedActiveCase?.company_id) {
      try {
        console.log('[RESTORE] Fetching metadata from server for sync...');
        const metadata = await api.fetchMetadata(
          savedActiveCase.company_id,
          savedActiveCase.case_id || savedActiveCase.case_id
        );
        
        // Synka completedSlides från server (servern har auktoritet)
        if (metadata.completedSlides) {
          setCompletedSlides(metadata.completedSlides);
          storage.setCompletedSlides(metadata.completedSlides);
        }
        
        // 📌 SPARA SERVER VERSION för conflict detection (1:1 med server)
        // Backend returnerar fält direkt på roten (inte under .metadata)
        const server_version = metadata?.version || 0;
        storage.setVersion(server_version);
        storage.setUpdatedBy(metadata?.updated_by || '');
        storage.setUpdatedAt(metadata?.updated_at || metadata?.last_modified || new Date().toISOString());
        console.log('[RESTORE] 📌 Sparade server metadata: version =', server_version);
        
        // 🔓 Synka betalningsstatus för att låsa upp företagsdata-slides
        const paymentConfirmed = metadata.subscription?.payment_confirmed_at;
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
    const targetSlide = tabSession.current_slide || 'uppdragsval';
    setCurrentSlideKey(targetSlide);
    
    const slide = SLIDE_ORDER.find(s => s.key === targetSlide);
    if (slide) {
      navigate(slide.path);
      console.log(`[RESTORE] Navigated to: ${slide.path}`);
    }
    
    // Logga för audit trail
    await api.logPersonal('Session restored after page reload', {
      session_id: tabSession.session_id,
      current_slide: targetSlide,
      isDraftMode,
    });
    
    setIsLoading(false);
    setAppState(AppState.READY);
  };
}
