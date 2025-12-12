/**
 * handleUppdragsvalsSubState.js
 * 
 * Hanterar PROCESSING_NEXT för 'uppdragsval' slide.
 * 
 * Detta är "point of no return" - anropar /commit endpoint som:
 * 1. Skapar permanent case_id
 * 2. Skapar company/case-mappar på servern
 * 3. Övergår från draft-mode till permanent-mode
 */

/**
 * Factory: Skapa handler för uppdragsval substate
 * 
 * @param {Function} getState - Returns { formData, user }
 * @param {Function} getActions - Returns { setCurrentSlideKey, setNavigationHistory, setAppState, setError }
 * @param {Object} services - { storage, navigate, handleConfirmCompanySelection, AppState }
 * @returns {Function} async () => void
 */
export function createHandleUppdragsvalsSubState(getState, getActions, services) {
  const { storage, navigate, handleConfirmCompanySelection, AppState } = services;
  const { setCurrentSlideKey, setNavigationHistory, setAppState, setError } = getActions();
  
  return async () => {
    const { formData, user } = getState();
    
    console.log('[PROCESSING_NEXT] uppdragsval - committing to server');
    
    const uppdragsvalsData = formData['uppdragsval'] || {};
    const orgnr = uppdragsvalsData.orgnr || '';
    const company_name = uppdragsvalsData.company_name || '';
    
    if (!orgnr) {
      console.error('[PROCESSING_NEXT] uppdragsval: Ingen orgnr i formData!');
      setError('Organisationsnummer saknas');
      setAppState(AppState.ERROR);
      return;
    }
    
    // Anropa /commit - får tillbaka { success, company_id, case_id, nextSlide }
    const result = await handleConfirmCompanySelection(null, company_name, orgnr);
    
    if (!result || !result.success) {
      console.error('[PROCESSING_NEXT] uppdragsval: Commit failed:', result?.error);
      
      // 🆕 Handle version conflict - don't go to ERROR state, stay on current slide
      if (result?.conflict) {
        console.log('[PROCESSING_NEXT] uppdragsval: Version conflict detected - staying on slide');
        setAppState(AppState.READY);  // Stay ready, conflict modal will show
        return;
      }
      
      setAppState(AppState.ERROR);
      return;
    }
    
    console.log('[PROCESSING_NEXT] uppdragsval: ✅ Commit successful');
    const { company_id, case_id, nextSlide } = result;
    
    if (nextSlide) {
      setCurrentSlideKey(nextSlide.key);
      storage.setCurrentTabSession({
        session_id: storage.buildSessionId(company_id, case_id, user.id),
        current_slide: nextSlide.key,
      });
      setNavigationHistory(prev => [...prev, {
        slideKey: nextSlide.key, timestamp: Date.now(), action: 'next', fromSlide: 'uppdragsval',
      }]);
      navigate(nextSlide.path);
    }
    
    setAppState(AppState.READY);
  };
}
