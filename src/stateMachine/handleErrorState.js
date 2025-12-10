/**
 * handleErrorState.js
 * 
 * STATE: ERROR
 * 
 * ANSVAR: Visar felmeddelande
 * 
 * INGÅNG: Från vilken state som helst vid fel
 * 
 * UTGÅNGAR:
 *   → READY  (användaren klickade bort felet via handleClearError)
 * 
 * OBS: Denna state gör INGET - felmeddelande visas via JSX.
 */

export function createHandleErrorState(getState, getActions, services) {
  return async function handleErrorState() {
    const { error } = getState();

    // ─────────────────────────────────────────────────────────────────
    // Ingen logik här - felmeddelande visas via JSX
    // State machine väntar på callback:
    //   - handleClearError() → READY
    // ─────────────────────────────────────────────────────────────────
    console.error('[ERROR] ❌ App is in ERROR state');
    console.error('[ERROR] Error message:', error);

    // Gör inget - väntar på user interaction
  };
}
