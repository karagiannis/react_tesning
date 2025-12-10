/**
 * stateMachine/index.js
 * 
 * Central export för alla state machine handlers.
 * 
 * Varje handler är en factory function som tar:
 *   - getState: Callback för att hämta aktuellt state
 *   - getActions: Callback för att hämta setters
 *   - services: Statiska objekt (api, storage, navigate, etc.)
 * 
 * Och returnerar en async function som kan anropas av state machine.
 * 
 * CLOSURE/FACTORY PATTERN:
 * ════════════════════════
 * 
 * Problemet med att skicka state/actions direkt:
 *   const handler = createHandler(currentState, setters);  // ← STALE!
 *   // Om currentState ändras, har handler fortfarande gamla värdet
 * 
 * Lösningen - getter callbacks:
 *   const handler = createHandler(
 *     () => ({ currentSlideKey, formData, ... }),  // ← Hämtas vid anrop!
 *     () => ({ setFormData, setAppState, ... }),
 *     { api, storage }
 *   );
 *   // Nu hämtar handler AKTUELLA värden varje gång den körs
 */

// State handlers
export { createHandleInitializing } from './handleInitializing';
export { createHandleRestoringSession } from './handleRestoringSession';
export { createHandleResuming } from './handleResuming';
export { createHandleProcessingNext } from './handleProcessingNext';

// AppState enum (re-export för convenience)
export { default as AppState } from './AppState';
