/**
 * handleConflictReload
 * Laddar om data från server vid merge conflict
 */
export const createHandleConflictReload = ({
  setShowConflictModal,
  setConflictInfo,
  api,
  activeCase,
  setFormData,
  storage,
  setCompletedSlides,
  setError
}) => {
  return async () => {
    console.log('[CONFLICT] Användaren valde: Ladda om från server');
    setShowConflictModal(false);
    setConflictInfo(null);

    try {
      // Hämta färsk data från server
      const serverMeta = await api.fetchMetadata(activeCase.company_id, activeCase.case_id);
      // 📌 Backend returnerar fält direkt på roten (inte under .metadata)
      const server_version = serverMeta?.version || 0;

      // Uppdatera lokal state med server-data (pages innehåller slide-data)
      if (serverMeta?.pages) {
        setFormData(serverMeta.pages);
        storage.setFormData(serverMeta.pages);
      }

      if (serverMeta?.completed_slides) {
        setCompletedSlides(serverMeta.completed_slides);
        storage.setCompletedSlides(serverMeta.completed_slides);
      }

      // Uppdatera local version (samma key som checkVersionConflict använder)
      const storageKey = `case_${activeCase.company_id}_${activeCase.case_id}_version`;
      localStorage.setItem(storageKey, JSON.stringify({
        version: server_version,
        timestamp: new Date().toISOString(),
        syncedFromServer: true
      }));

      console.log('[CONFLICT] ✅ Data laddad från server, version:', server_version);

    } catch (err) {
      console.error('[CONFLICT] ❌ Fel vid reload:', err);
      setError('Kunde inte ladda om från server');
    }
  };
};
