/**
 * handleResumeChoice
 * Användaren valde att återuppta en pågående onboarding
 *
 * ANROPAS FRÅN: OnboardingResumeDialog-modalen
 * EFFEKT: Sätter activeCase och triggar RESUMING state
 */
export const createHandleResumeChoice = ({ setActiveCase, setAppState, AppState }) => {
  return (company_id, case_id, company_name) => {
    setActiveCase({ company_id, case_id, company_name });
    setAppState(AppState.RESUMING);  // → State machine tar över
  };
};
