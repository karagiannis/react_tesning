/**
 * handleLogout
 * Normal logout - rensar draft eller behåller permanent data
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
    console.log(`[LOGOUT] Normal logout initiated. isDraftMode=${isDraftMode}`);

    // Logga för audit trail
    await api.log(`Användare ${user?.name} loggade ut`, {
      isDraftMode,
      tempCaseId,
      activeCase,
    });

    if (isDraftMode) {
      // ═══════════════════════════════════════════════════════════════════
      // DRAFT MODE: Rensa allt! Ingenting har sparats på servern.
      // ═══════════════════════════════════════════════════════════════════
      console.log('[LOGOUT] Draft mode - clearing all draft data');
      storage.clearAllDraftData();
    } else {
      // ═══════════════════════════════════════════════════════════════════
      // PERMANENT MODE: Behåll data! Det finns ett riktigt case på servern.
      // ═══════════════════════════════════════════════════════════════════
      console.log('[LOGOUT] Permanent mode - keeping localStorage data');
      // Rensa bara temp_case_id och is_draft_mode (inte formData etc.)
      storage.clearTempCaseId();
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
