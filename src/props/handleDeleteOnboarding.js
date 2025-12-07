/**
 * handleDeleteOnboarding
 * Radera en pågående onboarding
 *
 * ANROPAS FRÅN: OnboardingResumeDialog_v2 (via onDelete prop)
 * EFFEKT:
 *   1. Anropar DELETE endpoint på server
 *   2. Uppdaterar pendingOnboardings state (tar bort den raderade)
 *   3. Om listan blir tom → handleStartNew()
 */
export const createHandleDeleteOnboarding = ({
  api,
  pendingOnboardings,
  setPendingOnboardings,
  handleStartNew
}) => {
  return async (companyId, caseId) => {
    console.log(`[DELETE] Deleting onboarding: company=${companyId}, case=${caseId}`);

    try {
      const response = await api.fetch(`/onboarding/delete/${companyId}?onboarding_id=${caseId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${response.status}`);
      }

      // Uppdatera listan (immutably)
      const newPendingOnboardings = pendingOnboardings.filter(
        o => !(o.company_id === companyId && (o.case_id === caseId || o.onboarding_id === caseId))
      );
      setPendingOnboardings(newPendingOnboardings);

      // Logga för audit trail
      await api.logPersonal('Onboarding raderad', { companyId, caseId });

      console.log(`[DELETE] Success. Remaining onboardings: ${newPendingOnboardings.length}`);

      // Om listan är tom → gå direkt till ny session
      if (newPendingOnboardings.length === 0) {
        console.log('[DELETE] No more pending onboardings → starting new session');
        handleStartNew();
      }

    } catch (err) {
      console.error('[DELETE] Error:', err);
      throw err;  // Låt dialogen visa felmeddelandet
    }
  };
};
