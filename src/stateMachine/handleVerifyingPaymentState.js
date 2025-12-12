/**
 * handleVerifyingPaymentState.js
 * 
 * STATE: VERIFYING_PAYMENT
 * 
 * ANSVAR: Polla webhook-bekräftelse (max 20 sekunder)
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * INGÅNG: Från CHECKING_PENDING (när URL är /payment-success)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * handleCheckingPendingState.js rad 48-55:
 *   if (isPaymentSuccessPage && onboardings.length > 0) {
 *     setActiveCase(onboardings[0]);
 *     setAppState(AppState.VERIFYING_PAYMENT);  ← HIT!
 *   }
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * UTGÅNGAR:
 * ═══════════════════════════════════════════════════════════════════════════
 *   → READY  (betalning bekräftad eller timeout)
 *   → ERROR  (saknar activeCase)
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * FLÖDE:
 * ═══════════════════════════════════════════════════════════════════════════
 *   1. Stripe Checkout → redirect till /payment-success?session_id=xxx
 *   2. App startar om → UNINITIALIZED → INITIALIZING → CHECKING_PENDING
 *   3. CHECKING_PENDING detekterar payment-success URL → VERIFYING_PAYMENT
 *   4. Stripe webhook → POST /stripe-webhook (asynkront, kan redan ha kört)
 *   5. Webhook sätter metadata.subscription.payment_confirmed_at
 *   6. Denna handler pollar GET /subscription/status var 2 sek (max 20s)
 *   7. När confirmed=true → READY
 */

import AppState from './AppState';

export function createHandleVerifyingPaymentState(getState, getActions, services) {
  return async function handleVerifyingPaymentState() {
    const { api } = services;
    const { activeCase } = getState();
    const { 
      setError, 
      setAppState,
      setPaymentVerificationStatus,
      setPaymentVerificationMessage,
      setIsPaymentConfirmed
    } = getActions();

    console.log('[VERIFYING_PAYMENT] 🔄 Starting webhook polling...');

    // ─────────────────────────────────────────────────────────────────
    // GUARD: Måste ha activeCase
    // ─────────────────────────────────────────────────────────────────
    if (!activeCase?.company_id || !activeCase?.case_id) {
      console.error('[VERIFYING_PAYMENT] ❌ ERROR: No activeCase!');
      setError('Kunde inte verifiera betalning - saknar case-information');
      setAppState(AppState.ERROR);
      return;
    }

    // Visa "Verifierar..." status
    setPaymentVerificationStatus('verifying');
    setPaymentVerificationMessage('Verifierar betalning...');

    // ─────────────────────────────────────────────────────────────────
    // Polling-loop
    // ─────────────────────────────────────────────────────────────────
    // Stripe sandbox webhook tar typiskt 10-15 sekunder.
    // Produktion är oftast snabbare (1-5 sek).
    // Vid timeout visas retry-knapp i PaymentSuccessSlide.
    //
    const POLL_INTERVAL_MS = 2000;  // 2 sekunder
    const MAX_POLL_TIME_MS = 30000; // Max 30 sekunder (ökad från 20s)
    const startTime = Date.now();

    let pollCount = 0;
    let confirmed = false;

    while (!confirmed && (Date.now() - startTime) < MAX_POLL_TIME_MS) {
      pollCount++;
      console.log(`[VERIFYING_PAYMENT] 📡 Poll #${pollCount}...`);

      try {
        const status = await api.getSubscriptionStatus(
          activeCase.company_id,
          activeCase.case_id
        );

        console.log(`[VERIFYING_PAYMENT] 📡 Poll #${pollCount} result:`, status);

        if (status.confirmed) {
          confirmed = true;
          console.log('[VERIFYING_PAYMENT] ✅ Payment confirmed via webhook!');
          break;
        }
      } catch (pollError) {
        console.warn(`[VERIFYING_PAYMENT] ⚠️ Poll #${pollCount} error:`, pollError.message);
        // Fortsätt polla trots fel
      }

      // Vänta innan nästa poll
      if (!confirmed) {
        await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL_MS));
      }
    }

    // ─────────────────────────────────────────────────────────────────
    // Resultat
    // ─────────────────────────────────────────────────────────────────
    if (confirmed) {
      console.log('[VERIFYING_PAYMENT] 🎉 Payment verified - going to READY');
      setPaymentVerificationStatus('success');
      setPaymentVerificationMessage('Betalning bekräftad!');
      setIsPaymentConfirmed(true);

      await api.logPersonal('Payment confirmed via webhook polling', {
        company_id: activeCase.company_id,
        case_id: activeCase.case_id,
        poll_count: pollCount,
        elapsed_ms: Date.now() - startTime
      });

    } else {
      console.log('[VERIFYING_PAYMENT] ⏱️ Timeout - webhook not received yet');
      setPaymentVerificationStatus('timeout');
      setPaymentVerificationMessage(
        'Betalningen behandlas fortfarande. ' +
        'Detta kan ta upp till en minut. ' +
        'Klicka "Försök igen" eller kontakta support om problemet kvarstår.'
      );

      await api.logPersonal('Payment verification timeout', {
        company_id: activeCase.company_id,
        case_id: activeCase.case_id,
        poll_count: pollCount,
        elapsed_ms: Date.now() - startTime
      });
    }

    // ─────────────────────────────────────────────────────────────────
    // UTGÅNG: READY (oavsett om confirmed eller timeout)
    // ─────────────────────────────────────────────────────────────────
    setAppState(AppState.READY);
  };
}
