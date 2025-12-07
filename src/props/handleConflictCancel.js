/**
 * handleConflictCancel
 * Avbryter merge conflict resolution - stänger modal
 */
export const createHandleConflictCancel = ({ setShowConflictModal, setConflictInfo }) => {
  return () => {
    console.log('[CONFLICT] Användaren valde: Avbryt');
    setShowConflictModal(false);
    setConflictInfo(null);
  };
};
