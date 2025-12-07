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

    const serverVersion = conflictInfo?.server_version || 0;

    // Uppdatera local version till server+1 (vi "tar ägandeskap")
    const storageKey = `case_${activeCase.companyId}_${activeCase.caseId}_version`;
    localStorage.setItem(storageKey, JSON.stringify({
      version: serverVersion + 1,
      timestamp: new Date().toISOString(),
      forcedOverwrite: true
    }));

    setConflictInfo(null);

    // TODO: Push till server med force-flagga
    console.log('[CONFLICT] ✅ Lokal version uppdaterad till', serverVersion + 1, '(force overwrite)');
  };
};
