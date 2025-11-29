/**
 * FÖRENKLAD STATE MACHINE
 * 
 * ENDAST is_locked behövs:
 * - is_locked = false → orgnr kan ändras, case kan raderas
 * - is_locked = true  → orgnr KAN EJ ändras, case KAN EJ raderas
 * 
 * Inget behov av: NEW, DRAFT, SUBMITTED, LOCKED, COMPLETED, ARCHIVED
 */

/**
 * Check if case is locked (orgnr cannot be changed)
 * @param {Object} metadata - Case metadata from server
 * @returns {boolean} - true if locked
 */
export const isLocked = (metadata) => {
  return metadata?.is_locked === true;
};

/**
 * Check if case can be deleted
 * @param {Object} metadata - Case metadata from server
 * @returns {boolean} - true if can delete
 */
export const canDelete = (metadata) => {
  return !isLocked(metadata);
};

/**
 * Check if orgnr can be edited
 * @param {Object} metadata - Case metadata from server
 * @returns {boolean} - true if can edit orgnr
 */
export const canEditOrgnr = (metadata) => {
  return !isLocked(metadata);
};

// ============================================================================
// BACKWARD COMPATIBILITY EXPORTS (for existing code that imports STATES)
// These are deprecated - use isLocked() instead
// ============================================================================
export const STATES = {
  NEW: 'new',           // DEPRECATED
  DRAFT: 'draft',       // DEPRECATED
  SUBMITTED: 'submitted', // DEPRECATED  
  LOCKED: 'locked',     // DEPRECATED
  COMPLETED: 'completed', // DEPRECATED
  ARCHIVED: 'archived'  // DEPRECATED
};

/**
 * DEPRECATED: Use isLocked() instead
 * Kept for backward compatibility with useQuestionnaireForm
 */
export const getStateMachineBehavior = (metadata, slideKey) => {
  const locked = isLocked(metadata);
  
  return {
    shouldLoadFromServer: true,
    shouldLoadFromCache: true,
    canEdit: true,  // Forms can always be edited (only orgnr is locked)
    isLocked: locked,
    canDelete: !locked,
    canEditOrgnr: !locked,
    message: locked 
      ? 'Orgnr låst - kan ej ändras'
      : 'Kan redigeras'
  };
};

/**
 * DEPRECATED: Use isLocked() instead
 */
export const useOnboardingStateMachine = (currentState, onStateChange) => {
  // Ignore currentState - always use is_locked from metadata
  return {
    state: currentState || 'active',  // Simplified
    canEdit: true,
    canDelete: true,  // Will be checked against is_locked on server
    canEditOrgnr: true,
    allowedActions: ['EDIT', 'SAVE', 'DELETE'],
    transitionTo: async () => true,
    canPerformAction: () => true
  };
};
