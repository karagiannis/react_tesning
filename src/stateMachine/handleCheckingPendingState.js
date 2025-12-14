/**
 * handleCheckingPendingState.js
 * 
 * STATE: CHECKING_PENDING
 * 
 * NÄR: Efter INITIALIZING (användaren är autentiserad)
 * 
 * VAD: Fråga servern om användaren har påbörjade men inte avslutade onboardings
 * 
 * UTGÅNGAR:
 *   → VERIFYING_PAYMENT  (om på /payment-success + har pending)
 *   → SHOWING_RESUME     (om pending onboardings finns)
 *   → READY              (om inga pending finns - starta ny)
 *   → CONNECTION_ERROR   (om backend inte svarar - timeout/nätverksfel)
 */

import { ApiConnectionError } from '../utils/createApi';

export function createHandleCheckingPendingState(getState, getActions, services) {
  return async function handleCheckingPendingState() {
    const { api, storage, AppState } = services;
    const { tempCaseId, user } = getState();
    const { 
      setIsLoading, 
      setAppState, 
      setPendingOnboardings,
      setActiveCase,
      setIsDraftMode,
      setCurrentSlideKey,
      setError,
      setConnectionError
    } = getActions();

    console.log('[CHECKING_PENDING] 🔍 Starting...');
    setIsLoading(true);

    // ─────────────────────────────────────────────────────────────────
    // Steg 1: Kolla om vi är på payment-success sidan
    // ─────────────────────────────────────────────────────────────────
    const isPaymentSuccessPage = window.location.pathname === '/payment-success' ||
                                 window.location.search.includes('session_id');

    // ─────────────────────────────────────────────────────────────────
    // Steg 2: Hämta pending onboardings från API (med try-catch!)
    // ─────────────────────────────────────────────────────────────────
    let onboardings = [];
    try {
      console.log('[CHECKING_PENDING] 📡 Calling api.fetchPendingOnboardings()...');
      onboardings = await api.fetchPendingOnboardings();
      console.log('[CHECKING_PENDING] ✅ API response:', onboardings);
    } catch (error) {
      console.error('[CHECKING_PENDING] ❌ API call failed:', error);
      setIsLoading(false);
      
      // Hantera anslutningsfel separat
      if (error instanceof ApiConnectionError) {
        console.log('[CHECKING_PENDING] 🔌 Connection error - going to CONNECTION_ERROR state');
        setConnectionError({
          message: error.message,
          isTimeout: error.isTimeout,
          isNetworkError: error.isNetworkError,
          retryState: AppState.CHECKING_PENDING,
        });
        setAppState(AppState.CONNECTION_ERROR);
        return;
      }
      
      // Andra fel - visa generiskt felmeddelande
      setError(`Kunde inte hämta ärenden: ${error.message}`);
      setAppState(AppState.ERROR);
      return;
    }

    setIsLoading(false);
    console.log('[CHECKING_PENDING] ⚖️ Deciding next state, onboardings.length =', onboardings.length);

    // ─────────────────────────────────────────────────────────────────
    // Steg 3: SPECIAL CASE - Payment Success
    // ─────────────────────────────────────────────────────────────────
    if (isPaymentSuccessPage && onboardings.length > 0) {
      console.log('[CHECKING_PENDING] 💳 On payment-success page - going to VERIFYING_PAYMENT');
      // Sätt activeCase från den pending onboardingen
      const pendingCase = onboardings[0];
      setActiveCase(pendingCase);
      setPendingOnboardings(onboardings);
      setCurrentSlideKey('payment-success');  // Sync debug panel with actual route
      setAppState(AppState.VERIFYING_PAYMENT);
      console.log('[CHECKING_PENDING] 🏁 Case finished');
      return;
    }

    // ─────────────────────────────────────────────────────────────────
    // Steg 4: Beslut - SHOWING_RESUME eller READY?
    // ─────────────────────────────────────────────────────────────────
    if (onboardings.length > 0) {
      // ═══════════════════════════════════════════════════════════════
      // UTGÅNG 1: SHOWING_RESUME (har pending onboardings)
      // ═══════════════════════════════════════════════════════════════
      console.log('[CHECKING_PENDING] ➡️ Going to SHOWING_RESUME (found pending onboardings)');

      // 🔥 KRITISKT: Sätt pendingOnboardings INNAN state-övergång
      // Annars får modal tom array vid första render!
      setPendingOnboardings(onboardings);

      // Logga att användaren har pending onboardings
      await api.logPersonal('Pending onboardings funna', {
        count: onboardings.length,
        companies: onboardings.map(o => o.company_name),
      });

      // I DEBUG-läge: logga även centralt
      if (import.meta.env.DEV) {
        await api.log(`[DEBUG] Användare ${user?.name} har ${onboardings.length} pågående onboardings`, {
          userId: user?.id,
          pendingCount: onboardings.length,
        });
      }

      // Gå till SHOWING_RESUME - nu har pendingOnboardings redan rätt data
      setAppState(AppState.SHOWING_RESUME);

    } else {
      // ═══════════════════════════════════════════════════════════════
      // UTGÅNG 2: READY (inga pending - starta ny session)
      // ═══════════════════════════════════════════════════════════════
      console.log('[CHECKING_PENDING] ➡️ No pending onboardings - going to READY');
      
      // 🔒 KRITISKT: Sätt isDraftMode = true för ny session
      // localStorage kan ha gammalt värde från tidigare session
      setIsDraftMode(true);
      storage.setIsDraftMode(true);
      console.log('[CHECKING_PENDING] 🔓 Set isDraftMode = true for new draft session');
      
      // Sätt initial tab session (draft mode)
      const session_id = `onboarding::draft::${tempCaseId}::${user?.id}`;
      console.log('[CHECKING_PENDING] 💾 Setting tab session:', session_id);
      storage.setCurrentTabSession({
        session_id,
        current_slide: 'uppdragsval',
      });

      console.log('[CHECKING_PENDING] 📝 Logging to server...');
      // Logga ny session till personlig logg
      await api.logPersonal('Startar ny onboarding-session', {
        session_id,
        startSlide: 'uppdragsval',
        tempCaseId,
      });

      // I DEBUG-läge: logga även centralt
      if (import.meta.env.DEV) {
        await api.log(`[DEBUG] Användare ${user?.name} startar ny onboarding-session på Uppdragsval`, {
          userId: user?.id,
          session_id,
          tempCaseId,
        });
      }

      console.log('[CHECKING_PENDING] ✅ Going to READY state');
      setAppState(AppState.READY);
    }

    console.log('[CHECKING_PENDING] 🏁 Case finished');
  };
}
