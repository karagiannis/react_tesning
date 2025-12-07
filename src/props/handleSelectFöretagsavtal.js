/**
 * handleSelectFöretagsavtal
 * 
 * 🏢 Enterprise-avtal (för framtida implementation)
 *
 * ============================================================================
 * ANROPAS FRÅN: AgreementModal när användaren klickar "Teckna företagsavtal"
 * ============================================================================
 *
 * NUVARANDE BETEENDE:
 * - Stänger modalen
 * - Visar meddelande att säljteamet kontaktar användaren
 *
 * FRAMTIDA IMPLEMENTATION:
 * - Enterprise-avtal faktureras separat
 * - Behöver ingen Stripe checkout
 * - Kan kräva godkännande av admin
 */
export const createHandleSelectFöretagsavtal = ({
  setShowAgreementModal
}) => {
  return async () => {
    console.log('[PAYMENT] Enterprise agreement selected');
    // TODO: Implementera enterprise-flöde
    // För nu, stäng modalen och visa ett meddelande
    setShowAgreementModal(false);
    alert('Företagsavtal kräver kontakt med säljteamet. Vi kontaktar dig inom kort!');
  };
};
