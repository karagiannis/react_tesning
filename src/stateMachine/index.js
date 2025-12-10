/**
 * stateMachine/index.js
 * 
 * Central export för alla state machine handlers.
 * 
 * NAMNKONVENTION: handle{StateName}State.js
 * 
 * Varje handler är en factory function som tar:
 *   - getState: Callback för att hämta aktuellt state
 *   - getActions: Callback för att hämta setters
 *   - services: Statiska objekt (api, storage, navigate, etc.)
 * 
 * Och returnerar en async function som kan anropas av state machine.
 */

// ═══════════════════════════════════════════════════════════════════════════
// STATE HANDLERS (alfabetisk ordning)
// ═══════════════════════════════════════════════════════════════════════════

export { createHandleCheckingPendingState } from './handleCheckingPendingState';
export { createHandleErrorState } from './handleErrorState';
export { createHandleInitializing } from './handleInitializingState';
export { createHandleInitiatingPaymentState } from './handleInitiatingPaymentState';
export { createHandleProcessingBackState } from './handleProcessingBackState';
export { createHandleProcessingNext } from './handleProcessingNextState';
export { createHandleReadyState } from './handleReadyState';
export { createHandleRestoringSession } from './handleRestoringSessionState';
export { createHandleResuming } from './handleResumingState';
export { createHandleShowingResumeState } from './handleShowingResumeState';
export { createHandleVerifyingPaymentState } from './handleVerifyingPaymentState';

// ═══════════════════════════════════════════════════════════════════════════
// AppState enum
// ═══════════════════════════════════════════════════════════════════════════

export { default as AppState } from './AppState';
