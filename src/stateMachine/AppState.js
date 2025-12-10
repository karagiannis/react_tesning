/**
 * AppState.js
 * 
 * State Machine States - Enum för alla möjliga tillstånd i appen.
 * 
 * Separerad från AuthenticatedApp för att:
 * 1. Möjliggöra import i handlers utan cirkulärt beroende
 * 2. Dokumentation av varje state på ett ställe
 * 3. Enklare testning
 */

const AppState = {
  // ─────────────────────────────────────────────────────────────────────────
  // INITIAL STATES (körs automatiskt vid mount)
  // ─────────────────────────────────────────────────────────────────────────
  UNINITIALIZED: 'UNINITIALIZED',   // Komponenten har precis mountats
                                     // → Går automatiskt till INITIALIZING
  
  INITIALIZING: 'INITIALIZING',     // Laddar token, user, localStorage
                                     // → Går till CHECKING_PENDING när klart
  
  CHECKING_PENDING: 'CHECKING_PENDING', // Frågar API om pågående onboardings
                                         // → SHOWING_RESUME om finns, annars READY
  
  // ─────────────────────────────────────────────────────────────────────────
  // RESUME STATES (användaren har pågående onboardings)
  // ─────────────────────────────────────────────────────────────────────────
  SHOWING_RESUME: 'SHOWING_RESUME', // Visar modal "Vill du fortsätta?"
                                     // → Väntar på handleResumeChoice() eller handleStartNew()
  
  RESUMING: 'RESUMING',             // Hämtar metadata från server
                                     // → Går till READY när klart
  
  RESTORING_SESSION: 'RESTORING_SESSION', // Page reload under aktiv session
                                           // → Hydrate från localStorage + server
                                           // → Skippar resume-modal!
  
  // ─────────────────────────────────────────────────────────────────────────
  // NORMAL DRIFT
  // ─────────────────────────────────────────────────────────────────────────
  READY: 'READY',                   // Normal drift - väntar på användarinteraktion
                                     // Användaren kan navigera, fylla i formulär, etc.
  
  PROCESSING_NEXT: 'PROCESSING_NEXT', // Användaren klickade "Nästa" - processar logik
  PROCESSING_BACK: 'PROCESSING_BACK', // Användaren klickade "Tillbaka" - processar logik
  
  INITIATING_PAYMENT: 'INITIATING_PAYMENT', // Skapar Stripe session och redirectar
                                             // → Anropar POST /subscription
                                             // → Sparar pending_payment till localStorage
                                             // → window.location.href = stripe_url
  
  VERIFYING_PAYMENT: 'VERIFYING_PAYMENT', // Edge case: payment-callback misslyckades
                                           // → Visar fel-UI med "Försök igen"
                                           // → Retry = reload → handleResuming körs igen
  
  NAVIGATING: 'NAVIGATING',         // (Framtida) Byter slide
  SAVING: 'SAVING',                 // (Framtida) Sparar till server
  
  // ─────────────────────────────────────────────────────────────────────────
  // ERROR
  // ─────────────────────────────────────────────────────────────────────────
  ERROR: 'ERROR',                   // Något gick fel
                                     // → Visar felmeddelande, väntar på handleClearError()
};

export default AppState;
