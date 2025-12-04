import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useSlideStateController from '../../legacy/hooks/useSlideStateController';
import useQuestionnaireForm from '../../legacy/hooks/useQuestionnaireForm';

export default function BankRattigheterSlide({ onNext, onBack }) {
  const { companyId } = useParams();
  
  const QUESTIONS_CONFIG = {
    entireForm: { type: 'object', required: false }
  };

  // 🆕 MASTER/SLAVE Pattern: MASTER fetches and decides data source
  const { 
    initialData, 
    isReady, 
    source, 
    metadata 
  } = useSlideStateController('bank_rattigheter');

  // 🆕 SLAVE receives data - auto-save blocked until initialData is applied
  const { formData: savedFormData, updateQuestion, pushToServer, initialDataApplied } = useQuestionnaireForm(
    'bank_rattigheter',
    QUESTIONS_CONFIG,
    { initialData, isReady, source, caseMetadata: metadata }
  );

  const [selectedBank, setSelectedBank] = useState(savedFormData?.entireForm?.selectedBank || '');
  const [hasGrantedAccess, setHasGrantedAccess] = useState(savedFormData?.entireForm?.hasGrantedAccess || false);
  const [showConfirmation, setShowConfirmation] = useState(savedFormData?.entireForm?.showConfirmation || false);

  // Sync state changes
  useEffect(() => {
    updateQuestion('entireForm', { selectedBank, hasGrantedAccess, showConfirmation });
  }, [selectedBank, hasGrantedAccess, showConfirmation]);

  // Mock byrå data (should come from config in production)
  const byraOrgNr = customerData.byraOrgNr || '556XXX-XXXX';
  const byraName = customerData.byraName || 'Redovisningsbyrån AB';

  const banks = [
    {
      id: 'seb',
      name: 'SEB',
      icon: (
        <svg className="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
        </svg>
      ),
      instructions: [
        'Logga in på företag.seb.se',
        'Gå till Inställningar → Behörigheter',
        'Välj "Lägg till läsrättighet"',
        `Ange vårt org.nr: ${byraOrgNr}`,
        'Bekräfta med BankID'
      ]
    },
    {
      id: 'handelsbanken',
      name: 'Handelsbanken',
      icon: (
        <svg className="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
        </svg>
      ),
      instructions: [
        'Logga in på företag.handelsbanken.se',
        'Gå till Behörigheter → Kontoåtkomst',
        'Välj "Lägg till extern part"',
        `Ange org.nr: ${byraOrgNr}`,
        'Bekräfta med BankID'
      ]
    },
    {
      id: 'nordea',
      name: 'Nordea',
      icon: (
        <svg className="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
        </svg>
      ),
      instructions: [
        'Logga in på företag.nordea.se',
        'Gå till Administrera → Behörigheter',
        'Välj "Open Banking"',
        'Välj "Ge läsrättighet"',
        `Ange org.nr: ${byraOrgNr}`,
        'Bekräfta med BankID'
      ]
    },
    {
      id: 'swedbank',
      name: 'Swedbank',
      icon: (
        <svg className="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
        </svg>
      ),
      instructions: [
        'Logga in på företag.swedbank.se',
        'Gå till Inställningar → Företagsbehörigheter',
        'Välj "Lägg till mottagare"',
        `Ange org.nr: ${byraOrgNr}`,
        'Bekräfta med BankID'
      ]
    },
    {
      id: 'other',
      name: 'Annan bank',
      icon: (
        <svg className="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
        </svg>
      ),
      instructions: [
        'Kontakta din banks företagsrådgivare',
        'Be om läsrättighet enligt PSD2/Open Banking',
        `Uppge org.nr: ${byraOrgNr}`,
        `Uppge företagsnamn: ${byraName}`,
        'Följ bankens instruktioner för att bevilja åtkomst'
      ]
    }
  ];

  const handleConfirmAccess = () => {
    if (!selectedBank) {
      alert('Vänligen välj din bank först');
      return;
    }
    if (!hasGrantedAccess) {
      alert('Vänligen bekräfta att du gett läsrättighet');
      return;
    }
    setShowConfirmation(true);
  };

  const selectedBankData = banks.find(b => b.id === selectedBank);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-page-title text-gray-900 mb-3 flex items-center gap-3">
          <svg className="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
          </svg>
          Steg 1: Läsrättigheter till företagsbankkontonet
        </h1>
        <p className="text-brand-700">
          För att vi ska kunna hjälpa dig med löpande bokföring behöver vi läsrättigheter till ditt företagsbankkonto.
        </p>
      </div>

      {/* Why is this needed */}
      <div className="mb-6 p-5 bg-brand-50 border-l-4 border-brand-500 rounded-r-lg">
        <h3 className="font-bold text-brand-900 mb-2">Varför behövs detta?</h3>
        <p className="text-sm text-brand-800 mb-3">
          Med läsrättigheter kan vi automatiskt hämta kontoutdrag och matcha betalningar mot fakturor. 
          Detta ger dig en mer korrekt och uppdaterad bokföring utan extra manuellt arbete.
        </p>
        <div className="flex items-start gap-2 p-3 bg-brand-100 rounded-box">
          <svg className="w-5 h-5 text-brand-700 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="text-sm">
            <strong className="text-brand-900">OBS:</strong>
            <span className="text-brand-800"> Vi får ENDAST läsrättigheter – vi kan aldrig göra betalningar eller överföringar från ditt konto.</span>
          </div>
        </div>
      </div>

      {/* Bank selection */}
      {!showConfirmation && (
        <>
          <div className="mb-6">
            <h3 className="font-bold text-gray-900 mb-4">Välj din bank:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {banks.map((bank) => (
                <button
                  key={bank.id}
                  onClick={() => setSelectedBank(bank.id)}
                  className={`p-4 border-2 rounded-box text-left transition-all ${
                    selectedBank === bank.id
                      ? 'border-brand-600 bg-brand-50 shadow-md'
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">{bank.icon}</div>
                    <div>
                      <div className="font-bold text-gray-900">{bank.name}</div>
                      {selectedBank === bank.id && (
                        <div className="text-xs text-brand-600 mt-1">✓ Vald</div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Instructions for selected bank */}
          {selectedBankData && (
            <div className="mb-6 p-5 bg-gray-50 border-2 border-gray-300 rounded-box">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Så här ger du läsrättighet på {selectedBankData.name}:
              </h3>
              <ol className="space-y-2">
                {selectedBankData.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-brand-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <span className="text-gray-800 pt-0.5">{instruction}</span>
                  </li>
                ))}
              </ol>

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
          )}

          {/* Confirmation checkbox */}
          {selectedBankData && (
            <div className="mb-6 p-4 bg-green-50 border-2 border-green-300 rounded-box">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasGrantedAccess}
                  onChange={(e) => setHasGrantedAccess(e.target.checked)}
                  className="w-5 h-5 text-brand-600 border-gray-300 rounded focus:ring-brand-500 mt-1 flex-shrink-0"
                />
                <span className="text-sm text-gray-800">
                  <strong className="text-green-900">Jag bekräftar att jag har gett läsrättighet</strong>
                  {' '}till {byraName} (org.nr {byraOrgNr}) på mitt företagsbankkonto hos {selectedBankData.name}.
                </span>
              </label>
            </div>
          )}

          {/* Tips section */}
          <div className="mb-6 p-4 bg-gray-50 border-l-4 border-gray-400 rounded-r-lg">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-gray-700">
                <strong>Tips:</strong> Ta en skärmdump när du givit behörigheten – då har du ett kvitto för framtida referens.
              </div>
            </div>
          </div>

          {/* Confirm button */}
          <div className="flex justify-center">
            <button
              onClick={handleConfirmAccess}
              disabled={!selectedBank || !hasGrantedAccess}
              className={`px-8 py-3 rounded-box font-semibold text-lg transition-all ${
                selectedBank && hasGrantedAccess
                  ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              ✓ Klart – jag har gett läsrättighet
            </button>
          </div>
        </>
      )}

      {/* Confirmation screen */}
      {showConfirmation && (
        <div className="mb-6">
          <div className="p-6 bg-green-50 border-2 border-green-500 rounded-box mb-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-green-900 text-xl mb-2">Tack! Läsrättighet bekräftad</h3>
                <p className="text-green-800 mb-3">
                  Du har bekräftat att du gett oss läsrättighet till ditt företagsbankkonto hos {selectedBankData.name}.
                </p>
                <div className="text-sm text-green-700 space-y-1">
                  <div><strong>Bank:</strong> {selectedBankData.name}</div>
                  <div><strong>Byrå:</strong> {byraName}</div>
                  <div><strong>Org.nr:</strong> {byraOrgNr}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-brand-50 border-l-4 border-brand-500 rounded-r-lg mb-6">
            <h4 className="font-semibold text-brand-900 mb-2">Vad händer nu?</h4>
            <ul className="text-sm text-brand-800 space-y-1">
              <li>✓ Vi kommer att ansluta till din bank inom 1-2 arbetsdagar</li>
              <li>✓ Du får en bekräftelse via e-post när anslutningen är klar</li>
              <li>✓ Därefter börjar vi automatiskt hämta kontoutdrag för löpande bokföring</li>
            </ul>
          </div>

          <div className="text-center text-sm text-gray-600 mb-6">
            Nästa steg: Lägg till oss som deklarationsombud hos Skatteverket
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
          disabled={!showConfirmation}
          className={`px-8 py-3 rounded-box font-semibold transition-all ${
            showConfirmation
              ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-md hover:shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Nästa: Deklarationsombud →
        </button>
      </div>
    </div>
  );
}
