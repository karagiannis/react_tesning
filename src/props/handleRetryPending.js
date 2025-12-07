/**
 * handleRetryPending
 * Försöker igen att hämta pågående onboardings från server
 */
export const createHandleRetryPending = ({ setError, setAppState, AppState }) => {
  return () => {
    console.log('[RETRY] Retrying fetchPendingOnboardings...');
    setError(null);
    setAppState(AppState.CHECKING_PENDING);
  };
};
