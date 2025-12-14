/**
 * handleConflictForceSave
 * Skriver över serverns data vid merge conflict
 */
export const createHandleConflictForceSave = ({
  setShowConflictModal,
  conflictInfo,
  activeCase,
  setConflictInfo,
  storage,
  user
}) => {
  return async () => {
    console.log('[CONFLICT] Användaren valde: Skriv över server');
    setShowConflictModal(false);

    const server_version = conflictInfo?.server?.version || conflictInfo?.server_version || 0;

    // Uppdatera local version till server+1 (vi "tar ägandeskap")
    // Använder nya storage-metoder (1:1 med server metadata.json)
    storage.setVersion(server_version + 1);
    storage.setUpdatedBy(user?.id);
    storage.setUpdatedAt(new Date().toISOString());

    setConflictInfo(null);

    // TODO: Push till server med force-flagga
    console.log('[CONFLICT] ✅ Lokal version uppdaterad till', server_version + 1, '(force overwrite)');
  };
};
