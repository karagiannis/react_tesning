// ===========================================================================
// handlePaymentConfirmed - Callback när användaren bekräftat betalning
// ===========================================================================
//
// ANROPAS FRÅN: PaymentSuccessSlide (när användaren klickar "OK")
// SYFTE: Navigera vidare till nästa slide efter bekräftad betalning
//
// TIC-TAC-TOE PATTERN:
//   PaymentSuccessSlide är en "dumb component" som anropar callback uppåt.
//   Precis som Square anropar onSquareClick() i tic-tac-toe.
//
// FLÖDE (2025-01-13):
//   1. GET /payment-callback (backend) verifierade betalning + satte metadata
//   2. handleResuming såg payment_confirmed_at → READY + visade PaymentSuccessSlide
//   3. Användaren klickar "OK" → onPaymentConfirmed() anropas
//   4. Denna handler navigerar till nästa slide (riskfragor-2)
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
  setIsPaymentConfirmed,
  navigate,
  setAppState,
  AppState,
  SLIDE_ORDER
}) {
  return () => {
    console.log('[PAYMENT_CONFIRMED] ✅ User confirmed payment success');
    
    // ─────────────────────────────────────────────────────────────────────
    // Steg 1: Uppdatera state (låser upp betalvägg och företagsdata)
    // ─────────────────────────────────────────────────────────────────────
    console.log('[PAYMENT_CONFIRMED] 🔓 Unlocking payment wall and företagsdata slides...');
    setHasAgreement(true);
    setIsPaymentConfirmed(true);  // 🔓 Låser upp företagsdata-slides i sidebar
    setPaymentPending(false);
    setShowAgreementModal(false);
    
    // ─────────────────────────────────────────────────────────────────────
    // Steg 2: Hitta nästa slide (riskfragor-steg2)
    // ─────────────────────────────────────────────────────────────────────
    const riskfragorIndex = SLIDE_ORDER.findIndex(s => s.key === 'riskfragor-1');
    const nextSlide = SLIDE_ORDER[riskfragorIndex + 1];
    
    if (!nextSlide) {
      console.error('[PAYMENT_CONFIRMED] ❌ Could not find next slide after riskfragor-1');
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
