import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAgreements } from '../../contexts/AgreementContext';
import { fetchWithAuth } from '../../utils/auth';

/**
 * PaymentSuccessSlide - Visas efter lyckad Stripe-betalning
 * 
 * URL: /payment-success?payment_intent=pi_xxx
 * 
 * Flöde:
 * 1. Stripe redirectar hit efter lyckad betalning
 * 2. Vi anropar backend för att bekräfta betalningen
 * 3. Backend uppdaterar case metadata + users_org trial_usage
 * 4. Användaren redirectas tillbaka till riskfrågor
 */
export default function PaymentSuccessSlide() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setOneTimeAgreement } = useAgreements();
  
  const [status, setStatus] = useState('confirming'); // 'confirming' | 'success' | 'error'
  const [message, setMessage] = useState('Bekräftar betalning...');
  const [trialsRemaining, setTrialsRemaining] = useState(null);

  useEffect(() => {
    confirmPayment();
  }, []);

  const confirmPayment = async () => {
    try {
      // Hämta payment info från URL och localStorage
      // Stripe Checkout Session returnerar session_id
      const sessionId = searchParams.get('session_id');
      const pendingPayment = JSON.parse(localStorage.getItem('pendingPayment') || '{}');
      
      const { companyId, onboardingId } = pendingPayment;
      
      if (!companyId || !onboardingId) {
        throw new Error('Kunde inte hitta betalningsinformation. Försök igen.');
      }
      
      // Anropa backend för att bekräfta
      const API_BASE = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_BASE_URL}/api`;
      const response = await fetchWithAuth(
        `${API_BASE}/onboarding/${companyId}/subscription/confirm?onboarding_id=${onboardingId}&session_id=${sessionId || ''}`,
        { method: 'POST' }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Kunde inte bekräfta betalning');
      }
      
      const data = await response.json();
      console.log('✅ Betalning bekräftad:', data);
      
      // Uppdatera AgreementContext
      setOneTimeAgreement({
        isSigned: true,
        agreementNumber: data.trial_id,
        signedAt: data.subscription.signed_at,
        signerName: 'Via Stripe',
        signerPersonnr: data.subscription.personnummer,
        totalCost: 2495,
        isSigningInProgress: false
      });
      
      // Rensa pending payment
      localStorage.removeItem('pendingPayment');
      
      setStatus('success');
      setMessage('Betalning genomförd!');
      setTrialsRemaining(data.trials_remaining);
      
      // Redirect tillbaka efter 3 sekunder
      setTimeout(() => {
        navigate(`/riskfragor/${companyId}`);
      }, 3000);
      
    } catch (err) {
      console.error('❌ Error confirming payment:', err);
      setStatus('error');
      setMessage(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-card shadow-2xl p-8 text-center">
        
        {status === 'confirming' && (
          <>
            <div className="mb-6">
              <svg className="animate-spin h-16 w-16 text-brand-600 mx-auto" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-brand-900 mb-2">
              Bekräftar betalning...
            </h1>
            <p className="text-gray-600">
              Vänligen vänta medan vi verifierar din betalning
            </p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="mb-6">
              <svg className="h-16 w-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-green-700 mb-2">
              Betalning genomförd! ✅
            </h1>
            <p className="text-gray-600 mb-4">
              Ditt engångsavtal är nu aktiverat.
            </p>
            
            {trialsRemaining !== null && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                <p className="text-sm text-blue-800">
                  Du har <strong>{trialsRemaining}</strong> engångstester kvar.
                </p>
              </div>
            )}
            
            <p className="text-sm text-gray-500">
              Du omdirigeras automatiskt om 3 sekunder...
            </p>
            
            <button
              onClick={() => {
                const pendingPayment = JSON.parse(localStorage.getItem('pendingPayment') || '{}');
                navigate(`/riskfragor/${pendingPayment.companyId || ''}`);
              }}
              className="mt-4 px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700"
            >
              Fortsätt till Riskfrågor →
            </button>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="mb-6">
              <svg className="h-16 w-16 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-red-700 mb-2">
              Något gick fel
            </h1>
            <p className="text-gray-600 mb-4">
              {message}
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700"
              >
                Försök igen
              </button>
              <button
                onClick={() => navigate('/uppdragsval')}
                className="w-full px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Tillbaka till Uppdragsval
              </button>
            </div>
          </>
        )}
        
      </div>
    </div>
  );
}
