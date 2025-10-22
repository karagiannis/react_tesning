import { useState } from 'react';

export default function AvtalSlide({ onNext, onBack, customerData = {} }) {
  const [hasReadContract, setHasReadContract] = useState(false);
  const [isSigningInProgress, setIsSigningInProgress] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [signatureData, setSignatureData] = useState(null);

  // Mock customer data
  const mockCustomerData = {
    companyName: customerData.companyName || 'Företagsnamn AB',
    orgNumber: customerData.orgNumber || '556XXX-XXXX',
    signatoryName: customerData.signatoryName || 'Anna Andersson',
    monthlyPrice: customerData.monthlyPrice || '4 500'
  };

  const handleBankIDSign = async () => {
    setIsSigningInProgress(true);
    
    // Simulate BankID process
    // In production, this would call a backend API that initiates BankID signing
    setTimeout(() => {
      // Mock successful signing
      const mockSignature = {
        personalNumber: 'XXXXXX-XXXX',
        name: mockCustomerData.signatoryName,
        signedAt: new Date().toISOString(),
        documentHash: 'SHA256:a3f2b1...' // Mock hash
      };
      
      setSignatureData(mockSignature);
      setIsSigned(true);
      setIsSigningInProgress(false);
    }, 3000); // 3 second delay to simulate BankID app interaction
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center p-8">
      <div className="max-w-6xl w-full bg-white rounded-2xl shadow-2xl p-10">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-brand-900 mb-2 flex items-center gap-3">
            <svg className="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Avtalsvillkor och godkännande
          </h1>
          <p className="text-brand-700">
            Granska avtalet noggrant och bekräfta att du har läst det innan du signerar med BankID.
          </p>
        </div>

        {/* Contract Info */}
        <div className="mb-4 p-4 bg-gray-50 border border-gray-300 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-700"><strong>Företag:</strong> {mockCustomerData.companyName}</p>
              <p className="text-sm text-gray-700"><strong>Org.nr:</strong> {mockCustomerData.orgNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-700"><strong>Firmatecknare:</strong> {mockCustomerData.signatoryName}</p>
              <p className="text-sm text-gray-700"><strong>Månadspris:</strong> {mockCustomerData.monthlyPrice} SEK (exkl. moms)</p>
            </div>
          </div>
        </div>

        {/* PDF Container */}
        <div className="mb-6 border-2 border-gray-300 rounded-lg overflow-hidden">
          <div className="bg-gray-100 p-3 border-b border-gray-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-semibold text-gray-700">uppdragsavtal_exempel.pdf</span>
            </div>
            <a 
              href="/uppdragsavtal_exempel.pdf" 
              download
              className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Ladda ner
            </a>
          </div>
          
          {/* Embedded PDF */}
          <div 
            className="bg-white"
            style={{ height: '500px', overflowY: 'auto' }}
          >
            <iframe
              src="/uppdragsavtal_exempel.pdf"
              className="w-full h-full"
              title="Uppdragsavtal"
            />
          </div>
          
          {/* Read confirmation - replaced scroll indicator */}
          <div className="bg-gray-50 border-t-2 border-gray-300 p-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={hasReadContract}
                onChange={(e) => setHasReadContract(e.target.checked)}
                className="w-5 h-5 text-brand-600 rounded focus:ring-brand-500"
              />
              <span className="text-sm text-gray-700">
                Jag har granskat avtalet och är redo att signera
              </span>
            </label>
          </div>
        </div>

        {/* Signature Section */}
        {!isSigned ? (
          <div className={`mb-6 p-5 rounded-lg border-2 transition-all ${
            hasReadContract 
              ? 'bg-green-50 border-green-400' 
              : 'bg-gray-100 border-gray-300'
          }`}>
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <svg className="w-6 h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Signera med BankID
            </h3>
            
            {!hasReadContract ? (
              <p className="text-sm text-gray-600 mb-4">
                Du måste bekräfta att du har granskat avtalet innan du kan signera.
              </p>
            ) : (
              <div>
                <p className="text-sm text-gray-700 mb-4">
                  Genom att signera med BankID godkänner du villkoren i uppdragsavtalet och bekräftar att uppgifterna är korrekta.
                </p>
                
                <div className="flex items-center gap-3 mb-4 p-3 bg-white rounded border border-gray-300">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">Säker elektronisk signering</p>
                    <p className="text-xs text-gray-600">BankID är en godkänd metod för elektroniska signaturer enligt eIDAS</p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleBankIDSign}
              disabled={!hasReadContract || isSigningInProgress}
              className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-lg transition-all font-semibold text-lg ${
                hasReadContract && !isSigningInProgress
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSigningInProgress ? (
                <>
                  <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Väntar på BankID...</span>
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Signera med BankID
                </>
              )}
            </button>
          </div>
        ) : (
          /* Signature Confirmation */
          <div className="mb-6 p-5 bg-green-100 border-2 border-green-500 rounded-lg">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-green-900 text-lg mb-2">✓ Avtalet är signerat!</h3>
                <p className="text-sm text-green-800 mb-3">
                  Avtalet har signerats digitalt med BankID och är nu juridiskt bindande.
                </p>
                <div className="bg-white p-3 rounded border border-green-300 text-sm">
                  <p className="text-gray-700"><strong>Signerad av:</strong> {signatureData?.name}</p>
                  <p className="text-gray-700"><strong>Personnummer:</strong> {signatureData?.personalNumber}</p>
                  <p className="text-gray-700"><strong>Tidpunkt:</strong> {new Date(signatureData?.signedAt).toLocaleString('sv-SE')}</p>
                  <p className="text-gray-700"><strong>Dokumenthash:</strong> <span className="font-mono text-xs">{signatureData?.documentHash}</span></p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info Box */}
        {isSigned && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-300">
            <p className="text-sm text-blue-900">
              📧 En kopia av det signerade avtalet har skickats till er registrerade e-postadress. 
              Nästa steg är att koppla ihop ert Fortnox-konto med vår byrå.
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Tillbaka
          </button>

          <button
            onClick={onNext}
            disabled={!isSigned}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all font-semibold shadow-lg ${
              isSigned
                ? 'bg-brand-600 text-white hover:bg-brand-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Fortsätt till Fortnox-koppling
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
