/**
 * handleProcessingNext.js
 * 
 * State Machine Handler: PROCESSING_NEXT
 * 
 * NÄR: Användaren klickade "Nästa" på en slide
 * VAD:
 *   1. Hitta nuvarande index i SLIDE_ORDER
 *   2. Kör slide-specifik logik (t.ex. payment check för riskfragor)
 *   3. Spara slide data till server (om permanent mode)
 *   4. Navigera till nästa slide
 * 
 * Special cases:
 *   - uppdragsval: Hanteras av wrapper-komponent
 *   - riskfragor: Kräver betalning om !hasAgreement && !isDraftMode
 *   - default: Standard save & navigate
 * 
 * → READY (eller ERROR vid fel)
 */

/**
 * Factory function som skapar handleProcessingNext handler.
 * 
 * @param {Function} getState - Callback som returnerar aktuellt state
 * @param {Function} getActions - Callback som returnerar setters och actions
 * @param {Object} services - Objekt med api, storage, navigate, SLIDE_ORDER, AppState
 * @returns {Function} - Handler-funktion som kan anropas av state machine
 */
export function createHandleProcessingNext(getState, getActions, services) {
  return async function handleProcessingNext() {
    const { 
      currentSlideKey, 
      hasAgreement, 
      isDraftMode, 
      activeCase, 
      formData,
      completedSlides,
      tempCaseId,
      user,
    } = getState();
    
    const {
      setAppState,
      setIsLoading,
      setSyncStatus,
      setError,
      setShowAgreementModal,
      setCompletedSlides,
      setCurrentSlideKey,
      setNavigationHistory,
      setConflictInfo,
      setShowConflictModal,
    } = getActions();
    
    const { storage, api, navigate, SLIDE_ORDER, AppState, checkVersionConflict } = services;
    
    console.log(`[PROCESSING_NEXT] Processing Next from slide: ${currentSlideKey}`);
    
    const currentIndex = SLIDE_ORDER.findIndex(s => s.key === currentSlideKey);
    if (currentIndex >= SLIDE_ORDER.length - 1) {
      console.log('[PROCESSING_NEXT] Already at last slide');
      setAppState(AppState.READY);
      return;
    }
    
    // Switch baserat på nuvarande slide
    switch (currentSlideKey) {
      
      // ───────────────────────────────────────────────────────────────
      // UPPDRAGSVAL - Special case, hanteras av wrapper
      // ───────────────────────────────────────────────────────────────
      case 'uppdragsval':
        console.log('[PROCESSING_NEXT] uppdragsval - handled by UppdragsvalsSlide wrapper');
        setAppState(AppState.READY);
        break;
      
      // ───────────────────────────────────────────────────────────────
      // RISKFRÅGOR (steg 1) - Payment check
      // ───────────────────────────────────────────────────────────────
      case 'riskfragor':
        if (!hasAgreement && !isDraftMode) {
          // VIKTIGT: Spara först till servern INNAN vi visar betalningsmodalen!
          console.log('[PROCESSING_NEXT] riskfragor: No agreement - saving before showing modal');
          
          try {
            setIsLoading(true);
            setSyncStatus('saving');
            
            const company_id = activeCase?.company_id;
            const case_id = activeCase?.case_id;
            const slideData = formData[currentSlideKey] || {};
            
            if (company_id && case_id) {
              const response = await api.post(
                `/onboarding/${company_id}/${currentSlideKey}`,
                {
                  data: slideData,
                  case_id: case_id,
                }
              );
              
              if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                
                let errorMsg = 'Kunde inte spara till servern';
                if (errorData.detail) {
                  if (Array.isArray(errorData.detail)) {
                    errorMsg = errorData.detail.map(err => err.msg || JSON.stringify(err)).join(', ');
                  } else if (typeof errorData.detail === 'string') {
                    errorMsg = errorData.detail;
                  } else {
                    errorMsg = JSON.stringify(errorData.detail);
                  }
                }
                
                console.error('[PROCESSING_NEXT] riskfragor: Server error:', errorData);
                throw new Error(errorMsg);
              }
              
              const result = await response.json();
              console.log('[PROCESSING_NEXT] riskfragor: ✅ Saved to server, version:', result.version);
              
              const versionKey = `case_${company_id}_${case_id}_version`;
              localStorage.setItem(versionKey, JSON.stringify({
                version: result.version,
                timestamp: new Date().toISOString(),
                current_slide: currentSlideKey,
              }));
              
              setSyncStatus('saved');
            } else {
              console.warn('[PROCESSING_NEXT] riskfragor: No company_id/case_id, skipping server save');
            }
            
            setIsLoading(false);
            
            // Nu är det säkert att visa betalningsmodalen
            console.log('[PROCESSING_NEXT] riskfragor: Showing payment modal');
            setShowAgreementModal(true);
            setAppState(AppState.READY);
            
          } catch (err) {
            console.error('[PROCESSING_NEXT] riskfragor: ❌ Save error:', err);
            setError(err.message);
            setIsLoading(false);
            setSyncStatus('idle');
            setAppState(AppState.ERROR);
          }
        } else {
          // Har redan betalat eller är i draft mode
          console.log('[PROCESSING_NEXT] riskfragor: Has agreement or draft - save and navigate');
          await saveSlideAndNavigateInternal();
        }
        break;
      
      // ───────────────────────────────────────────────────────────────
      // ALLA ANDRA SLIDES - Standard save & navigate
      // ───────────────────────────────────────────────────────────────
      default:
        console.log(`[PROCESSING_NEXT] ${currentSlideKey}: Standard save and navigate`);
        await saveSlideAndNavigateInternal();
        break;
    }
    
    // ═══════════════════════════════════════════════════════════════════
    // INTERNAL HELPER: Save slide and navigate to next
    // ═══════════════════════════════════════════════════════════════════
    async function saveSlideAndNavigateInternal() {
      setIsLoading(true);
      setSyncStatus('saving');
      setError(null);
      
      try {
        const slideData = formData[currentSlideKey] || {};
        
        // Steg 1: Kolla version conflict (om permanent mode)
        if (!isDraftMode && checkVersionConflict) {
          const hasConflict = await checkVersionConflict();
          if (hasConflict) {
            console.log('[SAVE] ⚠️ Konflikt - blockerar navigation');
            setIsLoading(false);
            setSyncStatus('conflict');
            setAppState(AppState.READY);
            return;
          }
        }
        
        // Steg 2: Push till server (om permanent mode)
        if (!isDraftMode && activeCase?.case_id) {
          console.log(`[SAVE] 📤 Pushing slide data: ${currentSlideKey}`);
          
          const response = await api.post(
            `/onboarding/${activeCase.company_id}/${currentSlideKey}`,
            {
              data: slideData,
              case_id: activeCase.case_id,
            }
          );
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            
            if (response.status === 409) {
              console.log('[SAVE] ⚠️ Server returnerade 409 - version conflict');
              setConflictInfo(errorData);
              setShowConflictModal(true);
              setIsLoading(false);
              setSyncStatus('conflict');
              setAppState(AppState.READY);
              return;
            }
            
            throw new Error(errorData.detail || `HTTP ${response.status}`);
          }
          
          const result = await response.json();
          console.log(`[SAVE] ✅ Server saved slide, new version: ${result.version}`);
          
          const versionKey = `case_${activeCase.company_id}_${activeCase.case_id}_version`;
          localStorage.setItem(versionKey, JSON.stringify({
            version: result.version,
            timestamp: new Date().toISOString(),
            current_slide: currentSlideKey,
          }));
        } else {
          console.log(`[SAVE] 📝 Draft mode - only saving to localStorage`);
        }
        
        setSyncStatus('saved');
        
        // Steg 3: Uppdatera state och navigera
        const newCompleted = [...completedSlides, currentSlideKey];
        setCompletedSlides(newCompleted);
        storage.setCompletedSlides(newCompleted);
        
        storage.setFormData(formData);
        
        const nextSlide = SLIDE_ORDER[currentIndex + 1];
        console.log(`[SAVE] ✅ Navigating to: ${nextSlide.key}`);
        
        setNavigationHistory(prev => [...prev, {
          slideKey: nextSlide.key,
          timestamp: Date.now(),
          action: 'next',
          fromSlide: currentSlideKey,
        }]);
        
        // Uppdatera session
        const caseOrOnboardingId = activeCase?.case_id || activeCase?.case_id;
        const sessionId = isDraftMode
          ? `onboarding::draft::${tempCaseId}::${user?.id}`
          : storage.buildSessionId(activeCase?.company_id, caseOrOnboardingId, user?.id);
        storage.setCurrentTabSession({
          sessionId,
          current_slide: nextSlide.key,
        });
        
        setCurrentSlideKey(nextSlide.key);
        navigate(nextSlide.path);
        
        setIsLoading(false);
        setTimeout(() => setSyncStatus('idle'), 1500);
        setAppState(AppState.READY);
        
      } catch (err) {
        console.error('[SAVE] Error:', err);
        setError(`Kunde inte spara: ${err.message}`);
        setSyncStatus('idle');
        setIsLoading(false);
        setAppState(AppState.READY);
      }
    }
  };
}
