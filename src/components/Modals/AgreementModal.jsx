import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAgreements } from '../../contexts/AgreementContext';
import { fetchWithAuth } from '../../utils/auth';

export default function AgreementModal({ show, onClose }) {
  const navigate = useNavigate();
  const { oneTimeAgreement, setOneTimeAgreement } = useAgreements();
  const [isSigningOneTime, setIsSigningOneTime] = useState(false);
  const [error, setError] = useState(null);
  const [trialInfo, setTrialInfo] = useState(null);

  const handleSignOneTimeAgreement = async () => {
    setIsSigningOneTime(true);
    setError(null);
    
    try {
      // Get IDs from localStorage
      const companyId = localStorage.getItem('currentCompanyId');
      const onboardingId = localStorage.getItem('onboardingId');
      const personnummer = localStorage.getItem('currentPersonnummer') || '19XXXXXX-XXXX';
      
      if (!companyId || !onboardingId) {
        throw new Error('Saknar company_id eller onboarding_id. Gå tillbaka till Uppdragsval.');
      }
      
      // Call backend to initiate subscription
      const API_BASE = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_BASE_URL}/api`;
      const response = await fetchWithAuth(
        `${API_BASE}/onboarding/${companyId}/subscription?onboarding_id=${onboardingId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'trial',
            personnummer: personnummer
          })
        }
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        // Check for trial limit reached (402)
        if (response.status === 402) {
          const detail = data.detail;
          setTrialInfo({
            limitReached: true,
            used: detail.trials_used,
            max: detail.trials_max,
            message: detail.message
          });
          throw new Error(detail.message);
        }
        throw new Error(data.detail || 'Kunde inte initiera betalning');
      }
      
      console.log('✅ Betalning initierad:', data);
      
      // Store trial info for UI
      if (data.trial_info) {
        setTrialInfo(data.trial_info);
      }
      
      // Redirect to Stripe payment
      if (data.payment_url) {
        // Store company/case info for return from Stripe
        localStorage.setItem('pendingPayment', JSON.stringify({
          companyId,
          onboardingId,
          initiatedAt: new Date().toISOString()
        }));
        
        // Redirect to Stripe checkout
        window.location.href = data.payment_url;
        return;
      }
      
      // If no payment URL, something went wrong
      throw new Error('Ingen betalnings-URL returnerades');
      
    } catch (err) {
      console.error('❌ Error initiating payment:', err);
      setError(err.message);
      setIsSigningOneTime(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-card shadow-2xl p-8 max-w-2xl w-full mx-4">
        <div className="mb-6">
          <h2 className="text-page-title text-brand-900 mb-2 flex items-center gap-2">
            <svg className="w-icon-md h-icon-md text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Betalning krävs för att fortsätta
          </h2>
          <p className="text-gray-600 text-sm">
            För att göra externa API-anrop (Skatteverket, Bolagsverket, etc.) måste ett avtal finnas.
          </p>
        </div>

        {/* Info boxes */}
        <div className="space-y-4 mb-6">
          <div className="p-4 bg-brand-50 border-2 border-brand-200 rounded-box">
            <p className="text-sm text-brand-900 mb-2">
              <strong>Företagsanvändare betalar i efterskott efter signerat avtal</strong>
            </p>
            <p className="text-sm text-brand-800 mb-1">
              • Med godkänt avtal: 30 dagars betalningsvillkor, faktura i efterskott
            </p>
            <p className="text-sm text-brand-800">
              • Tills avtalet är godkänt måste enskild användare betala direkt för API-anrop via Stripe
            </p>
          </div>

          <div className="p-4 bg-yellow-50 border-2 border-yellow-300 rounded-box">
            <p className="text-sm text-yellow-900 mb-2">
              <strong>Vill endast testa?</strong>
            </p>
            <p className="text-sm text-yellow-800 mb-1">
              Om du endast vill testa, teckna engångsavtal med oss till en kostnad av API-anrop + avtalsteckning till ett självkostnadspris.
            </p>
            <p className="text-sm text-yellow-800 font-semibold">
              💰 Pris: 2 495 kr (inkl. moms)
            </p>
            <p className="text-xs text-yellow-800 mt-2">
              ⚠️ OBS: Max 3 engångstester per användare.
            </p>
          </div>
        </div>

        {/* Trial limit warning */}
        {trialInfo?.limitReached && (
          <div className="mb-4 p-4 bg-orange-50 border-2 border-orange-300 rounded-box">
            <p className="text-sm text-orange-900 font-semibold mb-1">
              ⚠️ Du har använt alla dina {trialInfo.max} gratistester
            </p>
            <p className="text-sm text-orange-800">
              Uppgradera till Enterprise för obegränsade onboardings.
            </p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-box">
            <p className="text-sm text-red-800">
              <strong>❌ Fel:</strong> {error}
            </p>
          </div>
        )}

        {/* Action buttons */}
        {!isSigningOneTime ? (
          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                navigate('/settings?section=firm-sign-agreement');
                onClose();
              }}
              className="w-full px-6 py-3 bg-brand-600 text-white rounded-box hover:bg-brand-700 font-semibold flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Gå till Inställningar → Teckna företagsavtal
            </button>

            <button
              onClick={handleSignOneTimeAgreement}
              disabled={trialInfo?.limitReached}
              className={`w-full px-6 py-3 rounded-box font-semibold flex items-center justify-center gap-2 ${
                trialInfo?.limitReached 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-yellow-600 text-white hover:bg-yellow-700'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              {trialInfo?.limitReached 
                ? 'Inga fler gratistester tillgängliga'
                : 'Betala 2 495 kr → Teckna engångsavtal'
              }
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-box hover:bg-gray-300 font-semibold"
            >
              Avbryt onboarding
            </button>
          </div>
        ) : (
          /* Redirecting to Stripe */
          <div className="text-center py-6">
            <div className="mb-4 flex justify-center">
              <svg className="animate-spin h-12 w-12 text-brand-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="text-gray-900 font-semibold text-lg mb-2">
              Omdirigerar till Stripe betalning...
            </p>
            <p className="text-gray-600 text-sm">
              Du kommer strax till en säker betalningssida
            </p>
          </div>
        )}

        {/* Info footer */}
        <div className="mt-6 p-3 bg-brand-50 border border-brand-200 rounded-box">
          <p className="text-xs text-brand-900">
            <strong>ℹ️ Varför krävs detta?</strong> Externa API-anrop (Skatteverket, Bolagsverket, etc.) kostar pengar. 
            Med företagsavtal faktureras byrån i efterskott. Utan avtal måste enskild användare betala direkt via Stripe.
          </p>
        </div>
      </div>
    </div>
  );
}
