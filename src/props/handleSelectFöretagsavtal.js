/**
 * handleSelectFöretagsavtal
 * 
 * 🏢 Rapporterar user intent: "Användaren valde Företagsavtal"
 *
 * ============================================================================
 * ANROPAS FRÅN: AgreementModal när användaren klickar "Teckna företagsavtal"
 * ============================================================================
 *
 * TIC-TAC-TOE PATTERN:
 * - Modal (Square) rapporterar bara: "användaren klickade här"
 * - State Machine (Board) bestämmer vad som händer
 *
 * FLÖDE:
 * 1. Stäng modal
 * 2. Navigera till /settings/subscription
 * 3. Sätt state till READY
 *
 * FRAMTIDA IMPLEMENTATION:
 * - Enterprise-avtal faktureras separat
 * - Inställningssidan kan visa kontaktformulär
 * - Kan kräva godkännande av admin
 */
export const createHandleSelectFöretagsavtal = ({
  setShowAgreementModal,
  navigate,
  setAppState,
  AppState
}) => {
  return () => {
    console.log('[PAYMENT] User selected Företagsavtal - navigating to settings');
    
    // Stäng modalen
    setShowAgreementModal(false);
    
    // Navigera till inställningar för subscription
    navigate('/settings/subscription');
    
    // Sätt state till READY
    setAppState(AppState.READY);
  };
};
