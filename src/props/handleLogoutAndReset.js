/**
 * handleLogoutAndReset
 * 
 * 🗑️ Avsluta & rensa (explicit reset)
 *
 * ============================================================================
 * ANROPAS FRÅN: Header "Avsluta & rensa"-knapp
 * ============================================================================
 *
 * BETEENDE: Rensar ALLT oavsett läge
 *   - Rensa all localStorage-data (draft OCH permanent)
 *   - Rensa token
 *   - Navigera till login
 *
 * VARNING: Detta tar bort allt användaren har fyllt i, även om det
 *          finns ett riktigt case på servern!
 *
 * SKILLNAD MOT handleLogout:
 *   - handleLogout: Behåller permanent data om isDraftMode=false
 *   - handleLogoutAndReset: Rensar ALLT oavsett läge
 */
export const createHandleLogoutAndReset = ({
  api,
  user,
  tempCaseId,
  isDraftMode,
  activeCase,
  storage,
  navigate
}) => {
  return async () => {
    console.log('[LOGOUT] Logout with RESET initiated');
    
    // Logga för audit trail INNAN vi rensar
    await api.log(`Användare ${user?.name} valde "Avsluta & rensa"`, {
      tempCaseId,
      isDraftMode,
      activeCase,
    });
    
    // Rensa ALL data (draft + permanent)
    storage.clearAllDraftData();
    
    // Om vi är i permanent mode, rensa även permanent data
    if (!isDraftMode && activeCase?.company_id) {
      // Hitta och rensa permanent-nycklar
      const permanentPrefix = `onboarding::${activeCase.company_id}::`;
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith(permanentPrefix)) {
          localStorage.removeItem(key);
          console.log(`[LOGOUT] Removed permanent key: ${key}`);
        }
      }
    }
    
    // Rensa tab session (sessionStorage)
    storage.clearCurrentTabSession();
    
    // Rensa token
    storage.clearToken();
    storage.clearRefreshToken();
    
    // Navigera till login
    navigate('/login');
  };
};
