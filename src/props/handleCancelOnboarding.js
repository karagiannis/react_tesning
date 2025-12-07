/**
 * handleCancelOnboarding
 * 
 * ❌ Avbryt och rensa allt
 *
 * ============================================================================
 * ANROPAS FRÅN: AgreementModal när användaren klickar "Avsluta och rensa"
 * ============================================================================
 *
 * FLÖDE:
 * 1. Stäng AgreementModal
 * 2. Soft-delete case på server (om det finns)
 * 3. Anropa handleLogoutAndReset för att rensa all lokal data
 *
 * VARNING: Detta tar bort allt - både server-data och lokal data!
 */
export const createHandleCancelOnboarding = ({
  activeCase,
  api,
  setShowAgreementModal,
  handleLogoutAndReset
}) => {
  return async () => {
    console.log('[PAYMENT] User cancelled - cleaning up...');
    setShowAgreementModal(false);
    
    try {
      const companyId = activeCase?.companyId;
      const caseId = activeCase?.caseId;
      
      if (companyId && caseId) {
        // Soft-delete case på server
        await api.delete(`/onboarding/delete/${companyId}?onboarding_id=${caseId}`);
        console.log('[PAYMENT] Case soft-deleted on server');
      }
    } catch (err) {
      console.warn('[PAYMENT] Failed to delete case on server:', err);
      // Fortsätt med cleanup ändå
    }
    
    // Använd befintlig logout-funktion
    await handleLogoutAndReset();
  };
};
