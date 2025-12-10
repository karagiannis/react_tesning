/**
 * handleLogout
 * Rensar localStorage selektivt för detta case - server är source of truth
 */
export const createHandleLogout = ({
  api,
  user,
  isDraftMode,
  tempCaseId,
  activeCase,
  storage,
  navigate
}) => {
  return async () => {
    console.log(`[LOGOUT] Logout initiated. isDraftMode=${isDraftMode}`);

    // Logga för audit trail
    await api.log(`Användare ${user?.name} loggade ut`, {
      isDraftMode,
      tempCaseId,
      activeCase,
    });

    // ═══════════════════════════════════════════════════════════════════
    // RENSA localStorage SELEKTIVT för detta specifika case
    // Server är source of truth - vid nästa login hämtas allt via RESUMING
    // ═══════════════════════════════════════════════════════════════════
    console.log('[LOGOUT] Clearing localStorage for THIS case only...');
    
    let prefix;
    if (isDraftMode) {
      // Draft mode: rensa alla draft-nycklar för denna user
      prefix = `onboarding::draft::${tempCaseId}::${user?.id}::`;
    } else if (activeCase) {
      // Permanent mode: rensa nycklar för detta specifika case
      prefix = `onboarding::${activeCase.company_id}::${activeCase.case_id}::${user?.id}::`;
    }
    
    if (prefix) {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(prefix)) {
          console.log(`[LOGOUT]   🗑️ Removing: ${key}`);
          localStorage.removeItem(key);
        }
      });
    }

    // Rensa tab session (sessionStorage)
    storage.clearCurrentTabSession();

    // Rensa token (alltid)
    storage.clearToken();
    storage.clearRefreshToken();

    // Navigera till login
    navigate('/login');
  };
};
