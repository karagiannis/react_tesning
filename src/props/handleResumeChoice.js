/**
 * handleResumeChoice
 * Användaren valde att återuppta en pågående onboarding
 *
 * ANROPAS FRÅN: OnboardingResumeDialog-modalen
 * EFFEKT: Sätter activeCase och triggar RESUMING state
 */
export const createHandleResumeChoice = ({ setActiveCase, setAppState, AppState }) => {
  return (companyId, onboardingId, companyName) => {
    setActiveCase({ companyId, onboardingId, companyName });
    setAppState(AppState.RESUMING);  // → State machine tar över
  };
};
