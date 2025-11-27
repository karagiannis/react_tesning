/**
 * ONBOARDING STATE MACHINE
 * Created: 2025-11-27
 * 
 * Centralized state machine for onboarding flow.
 * Reads state from metadata.json, determines allowed actions,
 * and transitions to next state.
 * 
 * REF: docs/STATE_MACHINE.md
 */

/**
 * State definitions and transitions
 */
export const STATES = {
  NEW: 'new',                    // No metadata exists yet
  DRAFT: 'draft',                // User filling in data (editable)
  SUBMITTED: 'submitted',        // User submitted, awaiting review
  LOCKED: 'locked',              // Locked after API calls (Roaring.io)
  COMPLETED: 'completed',        // Onboarding finished and approved
  ARCHIVED: 'archived'           // Old/cancelled onboarding
};

/**
 * State transition rules
 * Format: { [currentState]: { allowedActions: [...], nextStates: [...] } }
 */
export const STATE_TRANSITIONS = {
  [STATES.NEW]: {
    allowedActions: ['CREATE', 'EDIT'],
    nextStates: [STATES.DRAFT],
    canEdit: true,
    canDelete: true,
    description: 'Ny onboarding - inget sparat ännu'
  },
  
  [STATES.DRAFT]: {
    allowedActions: ['EDIT', 'SAVE', 'SUBMIT', 'DELETE'],
    nextStates: [STATES.SUBMITTED, STATES.LOCKED],
    canEdit: true,
    canDelete: true,
    description: 'Pågående onboarding - kan redigeras'
  },
  
  [STATES.SUBMITTED]: {
    allowedActions: ['VIEW', 'APPROVE', 'REJECT'],
    nextStates: [STATES.COMPLETED, STATES.DRAFT],
    canEdit: false,
    canDelete: false,
    description: 'Inskickad - väntar på granskning'
  },
  
  [STATES.LOCKED]: {
    allowedActions: ['VIEW', 'SUBMIT'],
    nextStates: [STATES.SUBMITTED],
    canEdit: false,
    canDelete: false,
    description: 'Låst efter API-anrop - kan ej raderas'
  },
  
  [STATES.COMPLETED]: {
    allowedActions: ['VIEW', 'ARCHIVE'],
    nextStates: [STATES.ARCHIVED],
    canEdit: false,
    canDelete: false,
    description: 'Klar och godkänd'
  },
  
  [STATES.ARCHIVED]: {
    allowedActions: ['VIEW'],
    nextStates: [],
    canEdit: false,
    canDelete: false,
    description: 'Arkiverad'
  }
};

/**
 * State Machine Hook
 * @param {string} currentState - Current state from metadata.json
 * @param {Function} onStateChange - Callback when state changes
 * @returns {Object} - { state, canEdit, canDelete, allowedActions, transitionTo }
 */
export const useOnboardingStateMachine = (currentState, onStateChange) => {
  // Default to NEW if no state
  const state = currentState || STATES.NEW;
  
  // Get state definition
  const stateConfig = STATE_TRANSITIONS[state] || STATE_TRANSITIONS[STATES.NEW];
  
  /**
   * Transition to next state
   * @param {string} action - Action that triggers transition (e.g., 'SUBMIT')
   * @param {string} targetState - Target state (must be in nextStates)
   * @returns {boolean} - true if transition allowed, false otherwise
   */
  const transitionTo = async (action, targetState) => {
    // Validate action
    if (!stateConfig.allowedActions.includes(action)) {
      console.error(`❌ Action '${action}' not allowed in state '${state}'`);
      return false;
    }
    
    // Validate target state
    if (!stateConfig.nextStates.includes(targetState)) {
      console.error(`❌ Cannot transition from '${state}' to '${targetState}'`);
      return false;
    }
    
    console.log(`✅ State transition: ${state} --[${action}]--> ${targetState}`);
    
    // Call callback to update backend
    if (onStateChange) {
      await onStateChange(targetState, action);
    }
    
    return true;
  };
  
  /**
   * Check if action is allowed
   */
  const canPerformAction = (action) => {
    return stateConfig.allowedActions.includes(action);
  };
  
  return {
    state,
    canEdit: stateConfig.canEdit,
    canDelete: stateConfig.canDelete,
    allowedActions: stateConfig.allowedActions,
    nextStates: stateConfig.nextStates,
    description: stateConfig.description,
    transitionTo,
    canPerformAction
  };
};

/**
 * State machine logic for determining behavior
 * @param {Object} metadata - Case metadata from server
 * @param {string} slideKey - Current slide
 * @returns {Object} - { shouldLoadFromServer, shouldLoadFromCache, canEdit, state }
 */
export const getStateMachineBehavior = (metadata, slideKey) => {
  const state = metadata?.state || STATES.NEW;
  const stateConfig = STATE_TRANSITIONS[state];
  
  switch (state) {
    case STATES.NEW:
      return {
        shouldLoadFromServer: false,
        shouldLoadFromCache: true,
        canEdit: true,
        state: STATES.NEW,
        message: 'Ny onboarding - använder localStorage'
      };
    
    case STATES.DRAFT:
      return {
        shouldLoadFromServer: true,
        shouldLoadFromCache: true,  // Cache has priority
        canEdit: true,
        state: STATES.DRAFT,
        message: 'Draft mode - localStorage prioriteras över server'
      };
    
    case STATES.SUBMITTED:
      return {
        shouldLoadFromServer: true,
        shouldLoadFromCache: false,  // Server is source of truth
        canEdit: false,
        state: STATES.SUBMITTED,
        message: 'Submitted - server är source of truth (read-only)'
      };
    
    case STATES.LOCKED:
      return {
        shouldLoadFromServer: true,
        shouldLoadFromCache: false,
        canEdit: false,
        state: STATES.LOCKED,
        message: `Locked - kan ej redigeras (${metadata.locked_reason || 'API cost incurred'})`
      };
    
    case STATES.COMPLETED:
      return {
        shouldLoadFromServer: true,
        shouldLoadFromCache: false,
        canEdit: false,
        state: STATES.COMPLETED,
        message: 'Completed - arkiverad (read-only)'
      };
    
    case STATES.ARCHIVED:
      return {
        shouldLoadFromServer: true,
        shouldLoadFromCache: false,
        canEdit: false,
        state: STATES.ARCHIVED,
        message: 'Archived - historisk data'
      };
    
    default:
      console.warn(`⚠️ Unknown state: ${state}, falling back to NEW`);
      return {
        shouldLoadFromServer: false,
        shouldLoadFromCache: true,
        canEdit: true,
        state: STATES.NEW,
        message: 'Unknown state - fallback to NEW'
      };
  }
};
