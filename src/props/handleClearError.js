/**
 * handleClearError
 * Rensar error-state och återställer till READY om vi var i ERROR-läge
 */
export const createHandleClearError = ({ setError, appState, AppState, setAppState }) => {
  return () => {
    setError(null);
    if (appState === AppState.ERROR) {
      setAppState(AppState.READY);
    }
  };
};
