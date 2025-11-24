import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useQuestionnaireForm from '../../hooks/useQuestionnaireForm';

export default function DocumentDeliverySlide({ onNext, onBack }) {
  const { companyId } = useParams();
  
  const QUESTIONS_CONFIG = {
    entireForm: { type: 'object', required: false }
  };

  const { formData: savedFormData, updateQuestion, pushToServer } = useQuestionnaireForm(
    'dokumentleverans',
    QUESTIONS_CONFIG
  );

  const [email, setEmail] = useState(formData?.entireForm?.email || customerData.email || '');
  const [confirmEmail, setConfirmEmail] = useState(formData?.entireForm?.confirmEmail || '');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(formData?.entireForm?.isSent || false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Sync state changes
  useEffect(() => {
    updateQuestion('entireForm', { email, confirmEmail, isSent });
  }, [email, confirmEmail, isSent]);

  // Mock customer data
  const mockCustomerData = {
    companyName: customerData.companyName || 'Företagsnamn AB',
    signatoryName: customerData.signatoryName || 'Anna Andersson'
  };

  const documents = [
    {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
        </svg>
      ),
      title: 'Avtal (PDF med BankID-signatur)',
      description: 'Signerat uppdragsavtal med digital BankID-signatur',
      size: '~100 KB'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
        </svg>
      ),
      title: 'Riskanalys och grafisk rapport (PDF)',
      description: 'Komplett sammanställning av företagets riskbedömning och ekonomiska analys',
      size: '~250 KB'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      ),
      title: 'Sammanställning av dina svar',
      description: 'All information du lämnat under onboarding-processen',
      size: '~50 KB'
    }
  ];

  const validateEmail = (emailAddress) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(emailAddress);
  };

  const handleSendDocuments = async () => {
    setShowError(false);
    setErrorMessage('');

    // Validation
    if (!email || !confirmEmail) {
      setShowError(true);
      setErrorMessage('Vänligen fyll i båda e-postfälten');
      return;
    }

    if (!validateEmail(email)) {
      setShowError(true);
      setErrorMessage('Vänligen ange en giltig e-postadress');
      return;
    }

    if (email !== confirmEmail) {
      setShowError(true);
      setErrorMessage('E-postadresserna matchar inte');
      return;
    }

    setIsSending(true);

    // Simulate sending emails
    // In production, this would call a backend API
    setTimeout(() => {
      setIsSent(true);
      setIsSending(false);
    }, 2500);
  };

  const handleContinue = async () => {
    if (isSent) {
      await pushToServer();
      onNext();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center p-8">
      <div className="max-w-5xl w-full bg-white rounded-card shadow-2xl p-10">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-page-title text-brand-900 mb-2 flex items-center gap-3">
            <svg className="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Bekräftelse och leverans av material
          </h1>
          <p className="text-brand-700">
            För din dokumentation skickas en kopia av alla relevanta filer till den e-postadress du anger nedan.
          </p>
        </div>

        {/* Welcome message for signed customer */}
        <div className="mb-6 p-5 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-green-900 text-lg mb-1">Välkommen som kund, {mockCustomerData.signatoryName}! 🎉</h3>
              <p className="text-sm text-green-800">
                Ditt avtal med {mockCustomerData.companyName} är nu signerat och giltigt. Vi ser fram emot att arbeta tillsammans!
              </p>
            </div>
          </div>
        </div>

        {/* Documents list */}
        {!isSent && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="font-semibold text-gray-900">Följande dokument kommer att skickas:</h3>
            </div>
            <div className="space-y-3">
              {documents.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-gray-50 border border-gray-300 rounded-box hover:shadow-md transition-all"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-brand-600 text-white rounded-box flex items-center justify-center">
                    {doc.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">{doc.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                    <p className="text-xs text-gray-500 mt-1">Filstorlek: {doc.size}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Email input section */}
        {!isSent ? (
          <div className="mb-6 p-5 bg-gray-50 border-2 border-gray-300 rounded-box">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3 className="font-bold text-gray-900">Ange e-postadress</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  E-postadress <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="din.epost@foretagets.se"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-box focus:border-brand-600 focus:outline-none"
                  disabled={isSending}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Bekräfta e-postadress <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  value={confirmEmail}
                  onChange={(e) => setConfirmEmail(e.target.value)}
                  placeholder="Ange e-postadressen igen"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-box focus:border-brand-600 focus:outline-none"
                  disabled={isSending}
                />
              </div>
            </div>

            {showError && (
              <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-r">
                <p className="text-sm text-red-800">⚠️ {errorMessage}</p>
              </div>
            )}

            <button
              onClick={handleSendDocuments}
              disabled={isSending}
              className={`w-full mt-4 flex items-center justify-center gap-3 px-6 py-4 rounded-box transition-all font-semibold text-lg ${
                isSending
                  ? 'bg-gray-400 text-gray-200 cursor-wait'
                  : 'bg-brand-600 text-white hover:bg-brand-700 shadow-lg'
              }`}
            >
              {isSending ? (
                <>
                  <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Skickar material...</span>
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Skicka material till min e-post
                </>
              )}
            </button>
          </div>
        ) : (
          /* Success confirmation */
          <div className="mb-6 p-6 bg-green-100 border-2 border-green-500 rounded-box">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-green-900 text-xl mb-2">✓ Dokumenten är skickade!</h3>
                <p className="text-green-800 mb-3">
                  All information har skickats krypterat till: <strong>{email}</strong>
                </p>
                <div className="bg-white p-4 rounded border border-green-300">
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Du har fått:</strong>
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>✓ Signerat avtal (PDF)</li>
                    <li>✓ Riskanalys och rapport (PDF)</li>
                    <li>✓ Sammanställning av dina uppgifter</li>
                  </ul>
                  <p className="text-xs text-gray-600 mt-3 italic">
                    Kontrollera även din skräppost-mapp om du inte ser e-posten inom några minuter.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security note */}
        <div className="mb-6 p-4 bg-gray-100 rounded-box border border-gray-300">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-gray-700">
              <strong>Säkerhet:</strong> All information skickas krypterat via säker anslutning (TLS 1.3). 
              Dokumenten innehåller känslig information och bör hanteras konfidentiellt.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-box hover:bg-gray-300 transition-all font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Tillbaka
          </button>

          <button
            onClick={handleContinue}
            disabled={!isSent}
            className={`flex items-center gap-2 px-6 py-3 rounded-box transition-all font-semibold shadow-lg ${
              isSent
                ? 'bg-brand-600 text-white hover:bg-brand-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Fortsätt till Fortnox-setup
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
