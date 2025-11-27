import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useQuestionnaireForm from '../../hooks/useQuestionnaireForm';

export default function DeklarationsombudSlide({ onNext, onBack }) {
  const { companyId } = useParams();
  
  const QUESTIONS_CONFIG = {
    entireForm: { type: 'object', required: false }
  };

  const { formData: savedFormData, updateQuestion, pushToServer } = useQuestionnaireForm(
    'deklarationsombud',
    QUESTIONS_CONFIG
  );

  const [hasAddedOmbud, setHasAddedOmbud] = useState(savedFormData?.entireForm?.hasAddedOmbud || false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(savedFormData?.entireForm?.isVerified || false);
  const [verificationError, setVerificationError] = useState('');

  // Sync state changes
  useEffect(() => {
    updateQuestion('entireForm', { hasAddedOmbud, isVerified });
  }, [hasAddedOmbud, isVerified]);

  // Mock byrå data (should come from config in production)
  const byraOrgNr = customerData.byraOrgNr || '556XXX-XXXX';
  const byraName = customerData.byraName || 'Redovisningsbyrån AB';

  const requiredPermissions = [
    { id: 'fskatt', label: 'Deklarationsombud (F-skatt)', required: true },
    { id: 'moms', label: 'Momsdeklaration', required: true },
    { id: 'arbetsgivare', label: 'Arbetsgivardeklaration', required: true },
    { id: 'inkomst', label: 'Inkomstdeklaration för företag', required: true }
  ];

  const steps = [
    {
      number: 1,
      text: 'Gå till skatteverket.se/etjanster',
      link: 'https://skatteverket.se/etjanster'
    },
    {
      number: 2,
      text: 'Logga in med BankID'
    },
    {
      number: 3,
      text: 'Välj "Mina sidor" → "Fullmakter" → "Lägg till ombud"'
    },
    {
      number: 4,
      text: `Ange vårt organisationsnummer: ${byraOrgNr}`
    },
    {
      number: 5,
      text: 'Välj alla fyra behörigheter nedan'
    },
    {
      number: 6,
      text: 'Bekräfta med BankID'
    }
  ];

  const handleVerify = async () => {
    if (!hasAddedOmbud) {
      alert('Vänligen bekräfta att du lagt till oss som ombud först');
      return;
    }

    setIsVerifying(true);
    setVerificationError('');

    // Mock API call to Skatteverket
    setTimeout(() => {
      // Simulate 80% success rate
      const success = Math.random() > 0.2;
      
      if (success) {
        setIsVerified(true);
        setIsVerifying(false);
      } else {
        setVerificationError('Kunde inte verifiera ombudet ännu. Det kan ta några minuter innan det syns i systemet. Prova igen om en stund.');
        setIsVerifying(false);
      }
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-page-title text-gray-900 mb-3 flex items-center gap-3">
          <svg className="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Steg 2: Lägg till oss som deklarationsombud
        </h1>
        <p className="text-brand-700">
          För att vi ska kunna hantera dina deklarationer behöver du lägga till oss som ombud hos Skatteverket.
        </p>
      </div>

      {/* Why is this needed */}
      <div className="mb-6 p-5 bg-brand-50 border-l-4 border-brand-500 rounded-r-lg">
        <h3 className="font-bold text-brand-900 mb-2">Varför behövs detta?</h3>
        <p className="text-sm text-brand-800">
          För att vi ska kunna deklarera F-skatt, moms och arbetsgivaravgifter åt dig behöver du lägga till oss
          som deklarationsombud hos Skatteverket. Detta gör att vi kan hantera alla dina skatteärenden professionellt och i tid.
        </p>
      </div>

      {!isVerified && (
        <>
          {/* Instructions */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-900 mb-4">Så här gör du:</h3>
            <div className="bg-gray-50 border-2 border-gray-300 rounded-box p-5">
              <ol className="space-y-4">
                {steps.map((step) => (
                  <li key={step.number} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-brand-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {step.number}
                    </span>
                    <div className="pt-1 flex-1">
                      {step.link ? (
                        <a
                          href={step.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-600 hover:text-brand-700 font-semibold underline"
                        >
                          {step.text} →
                        </a>
                      ) : (
                        <span className="text-gray-800">{step.text}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ol>

              {/* Required permissions box */}
              <div className="mt-6 p-4 bg-white border-2 border-brand-300 rounded-box">
                <h4 className="font-bold text-brand-900 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Välj dessa fyra behörigheter:
                </h4>
                <ul className="space-y-2">
                  {requiredPermissions.map((permission) => (
                    <li key={permission.id} className="flex items-center gap-2 text-sm">
                      <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-800 font-medium">{permission.label}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Copy org number button */}
              <div className="mt-4 p-3 bg-white border border-gray-300 rounded-box">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Vårt organisationsnummer:</div>
                    <div className="font-mono font-bold text-lg text-gray-900">{byraOrgNr}</div>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(byraOrgNr);
                      alert('Organisationsnummer kopierat till urklipp!');
                    }}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-box text-sm font-semibold transition-colors"
                  >
                    📋 Kopiera
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Confirmation checkbox */}
          <div className="mb-6 p-4 bg-green-50 border-2 border-green-300 rounded-box">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={hasAddedOmbud}
                onChange={(e) => setHasAddedOmbud(e.target.checked)}
                className="w-5 h-5 text-brand-600 border-gray-300 rounded focus:ring-brand-500 mt-1 flex-shrink-0"
              />
              <span className="text-sm text-gray-800">
                <strong className="text-green-900">Jag bekräftar att jag har lagt till {byraName}</strong>
                {' '}(org.nr {byraOrgNr}) som deklarationsombud hos Skatteverket med alla fyra behörigheterna ovan.
              </span>
            </label>
          </div>

          {/* Verify button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={handleVerify}
              disabled={!hasAddedOmbud || isVerifying}
              className={`px-8 py-3 rounded-box font-semibold text-lg transition-all ${
                hasAddedOmbud && !isVerifying
                  ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isVerifying ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifierar...
                </span>
              ) : (
                '✓ Verifiera att jag lagt till ombud'
              )}
            </button>
          </div>

          {/* Verification error */}
          {verificationError && (
            <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div className="text-sm text-yellow-800">
                  <strong className="text-yellow-900">Kunde inte verifiera ännu</strong>
                  <p className="mt-1">{verificationError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Info about verification */}
          <div className="mb-6 p-4 bg-gray-50 border-l-4 border-gray-400 rounded-r-lg">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-gray-700">
                <strong>Om verifiering:</strong> När du klickar på "Verifiera" kontrollerar vi via Skatteverkets API
                att behörigheten är registrerad. Det kan ta några minuter innan ändringen syns i systemet.
              </div>
            </div>
          </div>
        </>
      )}

      {/* Verification success */}
      {isVerified && (
        <div className="mb-6">
          <div className="p-6 bg-green-50 border-2 border-green-500 rounded-box mb-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-green-900 text-xl mb-2">Verifierat! Ombudet är registrerat</h3>
                <p className="text-green-800 mb-3">
                  Vi har verifierat att {byraName} är registrerat som deklarationsombud för ditt företag hos Skatteverket.
                </p>
                <div className="text-sm text-green-700 space-y-1">
                  <div><strong>Byrå:</strong> {byraName}</div>
                  <div><strong>Org.nr:</strong> {byraOrgNr}</div>
                  <div><strong>Behörigheter:</strong> F-skatt, Moms, Arbetsgivare, Inkomstdeklaration</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-brand-50 border-l-4 border-brand-500 rounded-r-lg mb-6">
            <h4 className="font-semibold text-brand-900 mb-2">Vad händer nu?</h4>
            <ul className="text-sm text-brand-800 space-y-1">
              <li>✓ Vi kan nu hantera alla dina skattedeklarationer</li>
              <li>✓ Du får påminnelser via e-post innan deklarationsdeadlines</li>
              <li>✓ Vi ser till att alla deklarationer lämnas in i tid</li>
            </ul>
          </div>

          <div className="text-center text-sm text-gray-600 mb-6">
            Nästa steg: Sätt upp digital dokumenthantering för underlag
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        <button
          onClick={onBack}
          className="px-6 py-2 text-gray-700 hover:text-gray-900 font-semibold transition-colors"
        >
          ← Tillbaka
        </button>
        
        <button
          onClick={async () => {
            await pushToServer();
            onNext();
          }}
          disabled={!isVerified}
          className={`px-8 py-3 rounded-box font-semibold transition-all ${
            isVerified
              ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-md hover:shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Nästa: Dokumenthantering →
        </button>
      </div>
    </div>
  );
}
