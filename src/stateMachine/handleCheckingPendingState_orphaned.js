/**
 * handleCheckingPendingState.js
 * 
 * STATE: CHECKING_PENDING
 * 
 * ANSVAR: Kolla om användaren har pågående onboardings
 * 
 * INGÅNG: Från INITIALIZING (efter user är autentiserad)
 * 
 * UTGÅNGAR:
 *   → SHOWING_RESUME  (om pending onboardings finns)
 *   → READY           (om inga pending finns)
 */

import AppState from './AppState';

export function createHandleCheckingPendingState(getState, getActions, services) {
  return async function handleCheckingPendingState() {
    const { api, storage } = services;
    const { user, tempCaseId } = getState();
    const { 
      setIsLoading, 
      setAppState, 
      setPendingOnboardings 
    } = getActions();

    console.log('[CHECKING_PENDING] 🔍 Starting...');
    setIsLoading(true);

    try {
      // ─────────────────────────────────────────────────────────────────
      // Steg 1: Hämta pending onboardings från API
      // ─────────────────────────────────────────────────────────────────
      console.log('[CHECKING_PENDING] 📡 Calling api.fetchPendingOnboardings()...');
      const onboardings = await api.fetchPendingOnboardings();
      console.log('[CHECKING_PENDING] ✅ API response:', onboardings);

      setIsLoading(false);

      // ─────────────────────────────────────────────────────────────────
      // Steg 2: Beslut - vilken state går vi till?
      // ─────────────────────────────────────────────────────────────────
      console.log('[CHECKING_PENDING] ⚖️ Deciding next state, onboardings.length =', onboardings.length);

      if (onboardings.length > 0) {
        // ─────────────────────────────────────────────────────────────────
        // SPECIAL CASE: /payment-success → Skip modal, gå direkt till RESUMING
        // ─────────────────────────────────────────────────────────────────
        const isPaymentSuccessPage = window.location.pathname === '/payment-success' ||
                                     window.location.search.includes('session_id');
        
        if (isPaymentSuccessPage) {
          console.log('[CHECKING_PENDING] 💳 On payment-success page - skipping resume modal');
          
          // Välj första onboarding (eller matcha mot session_id om möjligt)
          const targetCase = onboardings[0];
          console.log('[CHECKING_PENDING] 💳 Auto-selecting case:', targetCase.company_name);
          
          // Sätt pendingOnboardings för reference
          setPendingOnboardings(onboardings);
          
          // Sätt activeCase direkt och gå till RESUMING
          const { setActiveCase } = getActions();
          setActiveCase(targetCase);
          
          setAppState(AppState.RESUMING);
          console.log('[CHECKING_PENDING] 🏁 Case finished');
          return;
        }
        
        // ─────────────────────────────────────────────────────────────────
        // NORMAL CASE: SHOWING_RESUME (har pending onboardings)
        // ─────────────────────────────────────────────────────────────────
        console.log('[CHECKING_PENDING] ➡️ Going to SHOWING_RESUME (found pending onboardings)');

        // KRITISKT: Sätt pendingOnboardings INNAN state-övergång
        setPendingOnboardings(onboardings);

        // Logga för audit trail
        await api.logPersonal('Pending onboardings funna', {
          count: onboardings.length,
          companies: onboardings.map(o => o.company_name),
        });

        setAppState(AppState.SHOWING_RESUME);

      } else {
        // ─────────────────────────────────────────────────────────────────
        // UTGÅNG 2: READY (inga pending - starta ny session)
        // ─────────────────────────────────────────────────────────────────
        console.log('[CHECKING_PENDING] ➡️ No pending onboardings - going to READY');

        // Sätt initial tab session (draft mode)
        const sessionId = `onboarding::draft::${tempCaseId}::${user?.id}`;
        console.log('[CHECKING_PENDING] 💾 Setting tab session:', sessionId);
        storage.setCurrentTabSession({
          sessionId,
          current_slide: 'uppdragsval',
        });

        // Logga ny session
        await api.logPersonal('Startar ny onboarding-session', {
          sessionId,
          startSlide: 'uppdragsval',
          tempCaseId,
        });

        setAppState(AppState.READY);
      }

    } catch (err) {
      console.error('[CHECKING_PENDING] ❌ Error:', err);
      setIsLoading(false);
      // Vid fel, gå till READY ändå (bättre än att fastna)
      setAppState(AppState.READY);
    }

    console.log('[CHECKING_PENDING] 🏁 Case finished');
  };
}
