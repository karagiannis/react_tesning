/**
 * handleShowingResumeState.js
 * 
 * STATE: SHOWING_RESUME
 * 
 * ANSVAR: Visar ResumeModal med pågående onboardings
 * 
 * INGÅNG: Från CHECKING_PENDING (pendingOnboardings redan satt)
 * 
 * UTGÅNGAR:
 *   → RESUMING  (användaren klickade "Fortsätt" på en onboarding)
 *   → READY     (användaren klickade "Starta ny")
 * 
 * OBS: Denna state gör INGET - den väntar på callback från modal.
 * Modal renderas i JSX baserat på appState === SHOWING_RESUME.
 */

export function createHandleShowingResumeState(getState, getActions, services) {
  return async function handleShowingResumeState() {
    const { pendingOnboardings } = getState();

    // ─────────────────────────────────────────────────────────────────
    // Ingen logik här - modal renderas via JSX
    // State machine väntar på callback:
    //   - onResume() → handleResumeChoice() → RESUMING
    //   - onStartNew() → handleStartNew() → READY
    // ─────────────────────────────────────────────────────────────────
    console.log('[SHOWING_RESUME] 🎭 State entered!');
    console.log('[SHOWING_RESUME] pendingOnboardings:', pendingOnboardings);
    console.log('[SHOWING_RESUME] pendingOnboardings.length:', pendingOnboardings?.length);

    // Gör inget - väntar på user interaction
  };
}
