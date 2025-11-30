/**
 * FÖRENKLAD STATE MACHINE
 * 
 * Frontend formState har ENDAST 2 värden:
 * - 'loading' = laddar data
 * - 'ready' = kan redigera och spara (ALLTID efter loading)
 * 
 * Server-sidan har ENDAST is_locked (boolean):
 * - is_locked = false → orgnr KAN ändras
 * - is_locked = true  → orgnr KAN EJ ändras
 * 
 * VIKTIGT: 
 * - is_locked påverkar ENDAST orgnr-fältet!
 * - Formulär kan ALLTID redigeras
 * - Case kan ALLTID raderas (användarens data, användarens ansvar)
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
 * @returns {boolean} - ALLTID true (användarens data, användarens ansvar)
 */
export const canDelete = (metadata) => {
  return true;  // Case kan ALLTID raderas
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
// FÖRENKLAD STATE - endast 2 states för formulär
// ============================================================================
export const FORM_STATES = {
  LOADING: 'loading',  // Laddar data
  READY: 'ready'       // Kan redigera och spara (ALLTID efter loading)
};

/**
 * FÖRENKLAD STATE MACHINE
 * 
 * Formulär kan ALLTID redigeras (state = 'ready')
 * Case kan ALLTID raderas (användarens data)
 * is_locked påverkar ENDAST orgnr-fältet
 */
export const getStateMachineBehavior = (metadata, slideKey) => {
  const locked = isLocked(metadata);
  
  return {
    shouldLoadFromServer: true,
    shouldLoadFromCache: true,
    canEdit: true,           // Formulär kan ALLTID redigeras
    isLocked: locked,        // Endast för orgnr-fältet
    canDelete: true,         // Case kan ALLTID raderas
    canEditOrgnr: !locked,   // DETTA är vad is_locked påverkar
    state: 'ready',          // Formulär är ALLTID ready efter loading
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
