/**
 * handleInitiatingPaymentState.js
 * 
 * STATE: INITIATING_PAYMENT
 * 
 * ANSVAR: Skapa Stripe session och redirecta till checkout
 * 
 * INGÅNG: Användaren klickade "Engångsavtal" i AgreementModal
 * 
 * UTGÅNGAR:
 *   → (redirect till Stripe)  - normal flow
 *   → ERROR                   - om något går fel
 * 
 * OBS: Användaren kommer tillbaka via /payment-success efter Stripe
 */

import AppState from './AppState';

export function createHandleInitiatingPaymentState(getState, getActions, services) {
  return async function handleInitiatingPaymentState() {
    const { api } = services;
    const { activeCase, formData } = getState();
    const { 
      setIsLoading, 
      setError, 
      setAppState 
    } = getActions();

    console.log('[INITIATING_PAYMENT] 💳 Creating Stripe session...');
    setIsLoading(true);

    try {
      // ─────────────────────────────────────────────────────────────────
      // Steg 1: Validera att vi har nödvändig data
      // ─────────────────────────────────────────────────────────────────
      const company_id = activeCase?.company_id;
      const case_id = activeCase?.case_id;
      const personnummer = formData['riskfragor']?.personnummer || '';

      if (!company_id || !case_id) {
        throw new Error('Saknar company_id eller case_id. Gå tillbaka till Uppdragsval.');
      }

      // Logga till server (överlever page reload)
      await api.logPersonal('Initierar betalning', {
        company_id,
        case_id,
        slideKey: 'riskfragor',
        timestamp: new Date().toISOString()
      });

      // ─────────────────────────────────────────────────────────────────
      // Steg 2: Skapa Stripe session via API
      // ─────────────────────────────────────────────────────────────────
      console.log('[INITIATING_PAYMENT] Calling POST /subscription...');
      const response = await api.post(
        `/onboarding/${company_id}/subscription?case_id=${case_id}`,
        {
          type: 'trial',
          personnummer: personnummer
        }
      );

      if (!response.ok) {
        const errorData = await response.json();

        // Kolla om trial-limit är nådd (402)
        if (response.status === 402) {
          throw new Error(errorData.detail?.message || 'Du har använt alla gratistester. Uppgradera till Enterprise.');
        }
        throw new Error(errorData.detail || 'Kunde inte initiera betalning');
      }

      const data = await response.json();
      console.log('[INITIATING_PAYMENT] ✅ Stripe session created:', data);

      if (!data.payment_url) {
        throw new Error('Ingen betalnings-URL returnerades från servern');
      }

      // ─────────────────────────────────────────────────────────────────
      // Steg 3: Spara pending_payment som backup
      // ─────────────────────────────────────────────────────────────────
      localStorage.setItem('pending_payment', JSON.stringify({
        company_id,
        case_id,
        slideKey: 'riskfragor',
        initiatedAt: new Date().toISOString()
      }));
      console.log('[INITIATING_PAYMENT] 💾 Saved pending_payment to localStorage');

      // ─────────────────────────────────────────────────────────────────
      // Steg 4: Logga och redirecta till Stripe
      // ─────────────────────────────────────────────────────────────────
      console.log('[INITIATING_PAYMENT] 🔄 Redirecting to Stripe checkout...');
      await api.logPersonal('Redirectar till Stripe', {
        paymentUrl: data.payment_url,
        company_id,
        case_id,
        timestamp: new Date().toISOString()
      });

      // Redirect till Stripe checkout
      window.location.href = data.payment_url;

      // OBS: Vi kommer inte hit om redirect lyckas

    } catch (err) {
      // ─────────────────────────────────────────────────────────────────
      // UTGÅNG: ERROR
      // ─────────────────────────────────────────────────────────────────
      console.error('[INITIATING_PAYMENT] ❌ Error:', err);
      setError(err.message);
      setIsLoading(false);
      setAppState(AppState.ERROR);
    }
  };
}
