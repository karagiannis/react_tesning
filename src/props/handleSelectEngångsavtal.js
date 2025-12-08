/**
 * handleSelectEngångsavtal
 * 
 * 💳 Rapporterar user intent: "Användaren valde Engångsavtal"
 *
 * ============================================================================
 * ANROPAS FRÅN: AgreementModal när användaren klickar "Teckna engångsavtal"
 * ============================================================================
 *
 * TIC-TAC-TOE PATTERN:
 * - Modal (Square) rapporterar bara: "användaren klickade här"
 * - State Machine (Board) gör all business logic
 *
 * FLÖDE:
 * 1. Stäng modal
 * 2. Sätt state till INITIATING_PAYMENT
 * 3. State machine tar över och:
 *    - Anropar POST /subscription
 *    - Sparar pending_payment till localStorage
 *    - Backend uppdaterar metadata automatiskt
 *    - Redirectar till Stripe
 *
 * VID FEL:
 * - State machine sätter ERROR state
 * - Användaren ser felmeddelande från ErrorModal
 */
export const createHandleSelectEngångsavtal = ({
  setShowAgreementModal,
  setAppState,
  AppState
}) => {
  return () => {
    console.log('[PAYMENT] User selected Engångsavtal - triggering INITIATING_PAYMENT');
    
    // Stäng modalen
    setShowAgreementModal(false);
    
    // Låt state machine hantera resten
    setAppState(AppState.INITIATING_PAYMENT);
  };
};
