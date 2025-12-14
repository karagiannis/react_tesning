/**
 * handleRetryConnection
 * 
 * Factory för retry-callback när CONNECTION_ERROR state uppstår.
 * Rensar connectionError och går tillbaka till det state där felet uppstod.
 */
export const createHandleRetryConnection = ({ 
  connectionError, 
  setConnectionError, 
  setAppState, 
  AppState 
}) => {
  return () => {
    console.log('[RETRY] Retrying connection, going back to:', connectionError?.retryState);
    const retryState = connectionError?.retryState || AppState.INITIALIZING;
    setConnectionError(null);
    setAppState(retryState);
  };
};
