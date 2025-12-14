/**
 * handleConnectionErrorLogout
 * 
 * Factory för logout-callback när CONNECTION_ERROR state uppstår.
 * Rensar connectionError och anropar handleLogoutAndReset.
 */
export const createHandleConnectionErrorLogout = ({ 
  setConnectionError, 
  handleLogoutAndReset 
}) => {
  return () => {
    console.log('[LOGOUT] User chose to logout after connection error');
    setConnectionError(null);
    handleLogoutAndReset();
  };
};
