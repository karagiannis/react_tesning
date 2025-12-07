/**
 * handleSelectEngångsavtal
 * 
 * 💳 Initiera Stripe checkout för engångsavtal
 *
 * ============================================================================
 * ANROPAS FRÅN: AgreementModal när användaren klickar "Teckna engångsavtal"
 * ============================================================================
 *
 * FLÖDE:
 * 1. POST /onboarding/{company_id}/subscription
 * 2. Få tillbaka payment_url
 * 3. Spara pending_payment i localStorage
 * 4. Redirect till Stripe checkout
 * 5. Stripe redirectar tillbaka till /payment-callback (server)
 * 6. Server redirectar till /riskfragor-steg2
 *
 * VID FEL:
 * - Visar felmeddelande men stänger INTE modalen
 * - Användaren kan försöka igen
 *
 * SPECIELLT:
 * - 402-status = trial-limit nådd → uppmana till Enterprise
 */
export const createHandleSelectEngångsavtal = ({
  activeCase,
  formData,
  api,
  setPaymentStatus,
  setError
}) => {
  return async () => {
    console.log('[PAYMENT] Initiating Stripe checkout...');
    setPaymentStatus('initiating');
    
    try {
      const companyId = activeCase?.companyId;
      const caseId = activeCase?.caseId;
      const personnummer = formData['riskfragor']?.personnummer || '';
      
      if (!companyId || !caseId) {
        throw new Error('Saknar company_id eller case_id. Gå tillbaka till Uppdragsval.');
      }
      
      const response = await api.post(
        `/onboarding/${companyId}/subscription?onboarding_id=${caseId}`,
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
      console.log('[PAYMENT] Stripe session created:', data);
      
      if (!data.payment_url) {
        throw new Error('Ingen betalnings-URL returnerades från servern');
      }
      
      // Spara info för return från Stripe
      localStorage.setItem('pending_payment', JSON.stringify({
        companyId,
        caseId,
        slideKey: 'riskfragor',
        initiatedAt: new Date().toISOString()
      }));
      
      setPaymentStatus('redirecting');
      
      // Redirect till Stripe checkout
      window.location.href = data.payment_url;
      
    } catch (err) {
      console.error('[PAYMENT] Error:', err);
      setPaymentStatus('error');
      setError(err.message);
      // Stäng INTE modalen vid fel så användaren kan försöka igen
    }
  };
};
