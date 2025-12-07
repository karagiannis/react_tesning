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
      const serverMeta = await api.fetchMetadata(activeCase.companyId, activeCase.caseId);
      const serverVersion = serverMeta?.metadata?.version || serverMeta?.version || 0;

      // Uppdatera lokal state med server-data
      if (serverMeta?.form_data) {
        setFormData(serverMeta.form_data);
        storage.setFormData(serverMeta.form_data);
      }

      if (serverMeta?.completed_slides) {
        setCompletedSlides(serverMeta.completed_slides);
        storage.setCompletedSlides(serverMeta.completed_slides);
      }

      // Uppdatera local version (samma key som checkVersionConflict använder)
      const storageKey = `case_${activeCase.companyId}_${activeCase.caseId}_version`;
      localStorage.setItem(storageKey, JSON.stringify({
        version: serverVersion,
        timestamp: new Date().toISOString(),
        syncedFromServer: true
      }));

      console.log('[CONFLICT] ✅ Data laddad från server, version:', serverVersion);

    } catch (err) {
      console.error('[CONFLICT] ❌ Fel vid reload:', err);
      setError('Kunde inte ladda om från server');
    }
  };
};
