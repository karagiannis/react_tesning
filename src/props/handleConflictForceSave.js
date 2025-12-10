/**
 * handleConflictForceSave
 * Skriver över serverns data vid merge conflict
 */
export const createHandleConflictForceSave = ({
  setShowConflictModal,
  conflictInfo,
  activeCase,
  setConflictInfo
}) => {
  return async () => {
    console.log('[CONFLICT] Användaren valde: Skriv över server');
    setShowConflictModal(false);

    const server_version = conflictInfo?.server_version || 0;

    // Uppdatera local version till server+1 (vi "tar ägandeskap")
    const storageKey = `case_${activeCase.company_id}_${activeCase.case_id}_version`;
    localStorage.setItem(storageKey, JSON.stringify({
      version: server_version + 1,
      timestamp: new Date().toISOString(),
      forcedOverwrite: true
    }));

    setConflictInfo(null);

    // TODO: Push till server med force-flagga
    console.log('[CONFLICT] ✅ Lokal version uppdaterad till', server_version + 1, '(force overwrite)');
  };
};
