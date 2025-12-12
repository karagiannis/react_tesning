/**
 * handleRiskfragorSubState.js
 * 
 * Hanterar PROCESSING_NEXT för 'riskfragor-1' slide.
 * 
 * Special-logik: Om användaren inte har betalat ännu:
 * 1. Spara slide data till servern FÖRST (viktigt innan Stripe-redirect!)
 * 2. Visa betalningsmodalen
 * 3. Användaren betalar via Stripe
 * 4. Vid återkomst fortsätter normal navigation
 * 
 * Om redan betalt: Standard save & navigate
 */

/**
 * Factory: Skapa handler för riskfragor-1 substate
 * 
 * @param {Function} getState - Returns { hasAgreement, isDraftMode, activeCase, formData, currentSlideKey }
 * @param {Function} getActions - Returns { setIsLoading, setSyncStatus, setShowAgreementModal, setAppState, setError }
 * @param {Object} services - { api, saveSlideAndNavigate, AppState }
 * @returns {Function} async (currentIndex) => void
 */
export function createHandleRiskfragorSubState(getState, getActions, services) {
  const { api, saveSlideAndNavigate, AppState } = services;
  const { setIsLoading, setSyncStatus, setShowAgreementModal, setAppState, setError, setConflictInfo, setShowConflictModal } = getActions();
  
  return async (currentIndex) => {
    const { hasAgreement, isDraftMode, activeCase, formData, currentSlideKey } = getState();
    
    // Har redan betalat eller är i draft mode - standard save & navigate
    if (hasAgreement || isDraftMode) {
      console.log('[PROCESSING_NEXT] riskfragor: Has agreement or draft - save and navigate');
      await saveSlideAndNavigate(currentSlideKey, currentIndex);
      return;
    }
    
    // Spara först till servern INNAN vi visar betalningsmodalen
    console.log('[PROCESSING_NEXT] riskfragor: No agreement - saving before showing modal');
    
    try {
      setIsLoading(true);
      setSyncStatus('saving');
      
      const { company_id, case_id } = activeCase || {};
      const slideData = formData[currentSlideKey] || {};
      
      if (company_id && case_id) {
        const versionKey = `case_${company_id}_${case_id}_version`;
        const localVersionObj = JSON.parse(localStorage.getItem(versionKey) || '{"version":0}');
        
        const response = await api.post(`/onboarding/${company_id}/${currentSlideKey}`, {
          data: slideData,
          case_id,
          expected_version: localVersionObj.version || 0,
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          
          // Handle 409 version conflict
          if (response.status === 409) {
            console.log('[PROCESSING_NEXT] riskfragor: ⚠️ Version conflict (409)');
            setConflictInfo(errorData);
            setShowConflictModal(true);
            setIsLoading(false);
            setSyncStatus('conflict');
            setAppState(AppState.READY);
            return;
          }
          
          const errorMsg = Array.isArray(errorData.detail) 
            ? errorData.detail.map(e => e.msg).join(', ')
            : (errorData.detail || 'Kunde inte spara till servern');
          throw new Error(errorMsg);
        }
        
        const result = await response.json();
        console.log('[PROCESSING_NEXT] riskfragor: ✅ Saved, version:', result.version);
        localStorage.setItem(versionKey, JSON.stringify({
          version: result.version, timestamp: new Date().toISOString(), current_slide: currentSlideKey,
        }));
        setSyncStatus('saved');
      }
      
      setIsLoading(false);
      setShowAgreementModal(true);
      setAppState(AppState.READY);
      
    } catch (err) {
      console.error('[PROCESSING_NEXT] riskfragor: ❌ Save error:', err);
      setError(err.message);
      setIsLoading(false);
      setSyncStatus('idle');
      setAppState(AppState.ERROR);
    }
  };
}
