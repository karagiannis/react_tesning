import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAgreements } from '../../contexts/AgreementContext';

export default function AgreementModal({ show, onClose }) {
  const navigate = useNavigate();
  const { oneTimeAgreement, setOneTimeAgreement } = useAgreements();
  const [isSigningOneTime, setIsSigningOneTime] = useState(false);

  const handleSignOneTimeAgreement = () => {
    setIsSigningOneTime(true);
    
    // Mock BankID signing (3 seconds)
    setTimeout(() => {
      setOneTimeAgreement({
        isSigned: true,
        agreementNumber: 'ONETIME-2025-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        signedAt: new Date().toISOString(),
        signerName: 'Testanvändare',
        signerPersonnr: '19XXXXXX-XXXX',
        totalCost: 0, // Räknas ut efter API-anrop
        isSigningInProgress: false
      });
      setIsSigningOneTime(false);
      onClose(); // Stäng modal
    }, 3000);
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
            <p className="text-xs text-yellow-800 font-semibold mt-2">
              ⚠️ OBS: Engångsavtal erbjuds endast en gång.
            </p>
          </div>
        </div>

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
              className="w-full px-6 py-3 bg-yellow-600 text-white rounded-box hover:bg-yellow-700 font-semibold flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Teckna engångsavtal (endast testa)
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-box hover:bg-gray-300 font-semibold"
            >
              Avbryt onboarding
            </button>
          </div>
        ) : (
          /* BankID Signing in progress */
          <div className="text-center py-6">
            <div className="mb-4 flex justify-center">
              <svg className="animate-spin h-12 w-12 text-brand-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="text-gray-900 font-semibold text-lg mb-2">
              Signerar engångsavtal med BankID...
            </p>
            <p className="text-gray-600 text-sm">
              Mock BankID-process (3 sekunder)
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
