// ===========================================================================
// handlePaymentConfirmed - Callback när användaren bekräftat betalning
// ===========================================================================
//
// ANROPAS FRÅN: PaymentSuccessSlide (när användaren klickar "OK")
// SYFTE: Uppdatera state machine efter bekräftad betalning
//
// TIC-TAC-TOE PATTERN:
//   PaymentSuccessSlide är en "dumb component" som anropar callback uppåt.
//   Precis som Square anropar onSquareClick() i tic-tac-toe.
//
// FLÖDE:
//   1. PaymentSuccessSlide anropar /subscription/status endpoint
//   2. Visar ✅ success meddelande
//   3. Användaren klickar "OK" → onPaymentConfirmed() anropas
//   4. Denna handler uppdaterar state och navigerar vidare
//
// PARAMETRAR:
//   - setHasAgreement: Låser upp betalvägg
//   - setPaymentPending: Stänger modal
//   - setShowAgreementModal: Stänger modal
//   - setCurrentSlideKey: Uppdaterar nuvarande slide
//   - navigate: React Router navigate
//   - setAppState: State machine övergång
//   - AppState: Enum med states
//   - SLIDE_ORDER: Array med slides
//

export function createHandlePaymentConfirmed({
  setHasAgreement,
  setPaymentPending,
  setShowAgreementModal,
  setCurrentSlideKey,
  navigate,
  setAppState,
  AppState,
  SLIDE_ORDER
}) {
  return () => {
    console.log('[PAYMENT_CONFIRMED] ✅ User confirmed payment success');
    
    // ─────────────────────────────────────────────────────────────────────
    // Steg 1: Uppdatera state (låser upp betalvägg)
    // ─────────────────────────────────────────────────────────────────────
    console.log('[PAYMENT_CONFIRMED] 🔓 Unlocking payment wall...');
    setHasAgreement(true);
    setPaymentPending(false);
    setShowAgreementModal(false);
    
    // ─────────────────────────────────────────────────────────────────────
    // Steg 2: Hitta nästa slide (riskfragor-steg2)
    // ─────────────────────────────────────────────────────────────────────
    const riskfragorIndex = SLIDE_ORDER.findIndex(s => s.key === 'riskfragor');
    const nextSlide = SLIDE_ORDER[riskfragorIndex + 1];
    
    if (!nextSlide) {
      console.error('[PAYMENT_CONFIRMED] ❌ Could not find next slide after riskfragor');
      setAppState(AppState.READY);
      return;
    }
    
    // ─────────────────────────────────────────────────────────────────────
    // Steg 3: Navigera till nästa slide
    // ─────────────────────────────────────────────────────────────────────
    console.log(`[PAYMENT_CONFIRMED] 🚀 Navigating to: ${nextSlide.key} (${nextSlide.path})`);
    setCurrentSlideKey(nextSlide.key);
    navigate(nextSlide.path);
    
    // ─────────────────────────────────────────────────────────────────────
    // Steg 4: Sätt state machine till READY (normal drift)
    // ─────────────────────────────────────────────────────────────────────
    console.log('[PAYMENT_CONFIRMED] ✓ Setting state to READY');
    setAppState(AppState.READY);
  };
}
