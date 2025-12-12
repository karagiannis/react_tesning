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
// 
// OBS: Endast handlers som faktiskt ANROPAS av state machine exporteras här.
// States som hanteras INLINE i switch-case (READY, PROCESSING_BACK, ERROR, etc.)
// eller via JSX-callbacks (SHOWING_RESUME) har INGA handler-filer.
//

export { createHandleCheckingPendingState } from './handleCheckingPendingState';
export { createHandleInitializing } from './handleInitializingState';
export { createHandleInitiatingPaymentState } from './handleInitiatingPaymentState';
export { createHandleRestoringSession } from './handleRestoringSessionState';
export { createHandleResuming } from './handleResumingState';
export { createHandleVerifyingPaymentState } from './handleVerifyingPaymentState';

// ═══════════════════════════════════════════════════════════════════════════
// SUB-STATE HANDLERS (extracted from PROCESSING_NEXT switch)
// ═══════════════════════════════════════════════════════════════════════════
//
// Dessa hanterar specifika slides i PROCESSING_NEXT som har special-logik.
// Default-beteende är saveSlideAndNavigate() i slideNavigation.js
//

export { createHandleUppdragsvalsSubState } from './handleUppdragsvalsSubState';
export { createHandleRiskfragorSubState } from './handleRiskfragorSubState';

// ═══════════════════════════════════════════════════════════════════════════
// AppState enum
// ═══════════════════════════════════════════════════════════════════════════

export { default as AppState } from './AppState';
