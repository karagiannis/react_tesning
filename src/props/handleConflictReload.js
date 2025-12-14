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
        // Spara varje slide separat med ::pages:: prefix
        Object.entries(serverMeta.pages).forEach(([slideKey, slideData]) => {
          storage.setSlideData(slideKey, slideData);
        });
      }

      if (serverMeta?.completed_slides) {
        setCompletedSlides(serverMeta.completed_slides);
        storage.setCompletedSlides(serverMeta.completed_slides);
      }

      // Uppdatera local metadata (1:1 med server metadata.json)
      storage.setVersion(server_version);
      storage.setModifiedBy(serverMeta?.modified_by || serverMeta?.updated_by || '');
      storage.setUpdatedAt(serverMeta?.updated_at || serverMeta?.last_modified || new Date().toISOString());

      console.log('[CONFLICT] ✅ Data laddad från server, version:', server_version);

    } catch (err) {
      console.error('[CONFLICT] ❌ Fel vid reload:', err);
      setError('Kunde inte ladda om från server');
    }
  };
};
