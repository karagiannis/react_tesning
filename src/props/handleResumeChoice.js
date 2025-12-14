/**
 * handleResumeChoice - Prop-callback för OnboardingResumeDialog
 * 
 * FLÖDE:
 *   SHOWING_RESUME (modal visas)
 *        │
 *        │ Användaren klickar "Fortsätt" på en onboarding
 *        ▼
 *   onResume(company_id, case_id, company_name)  ← Denna callback
 *        │
 *        │ 1. Sätter activeCase (vilken onboarding vi jobbar med)
 *        │ 2. setAppState(RESUMING) → State machine tar över
 *        ▼
 *   RESUMING state hämtar full metadata från server
 *        │
 *        ▼
 *   READY (användaren kan fortsätta där de slutade)
 * 
 * PROPS-PATTERN:
 *   - Denna funktion skapas i AuthenticatedApp
 *   - Skickas ner till OnboardingResumeDialog som prop
 *   - Modalen anropar den när användaren gör ett val
 *   - Data flödar uppåt via callback (tic-tac-toe pattern)
 */
export const createHandleResumeChoice = ({ setActiveCase, setAppState, AppState }) => {
  return (company_id, case_id, company_name, orgnr) => {
    console.log(`[handleResumeChoice] 🔄 Resuming: ${company_name} (${orgnr}) - ${company_id}/${case_id}`);
    
    // Sätt vilken case vi ska arbeta med (inkl orgnr för Header)
    setActiveCase({ company_id, case_id, company_name, orgnr });
    
    // Trigga state machine → RESUMING hämtar full data
    setAppState(AppState.RESUMING);
  };
};
