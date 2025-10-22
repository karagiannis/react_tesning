import { useState } from 'react';

export default function BokforingDataSlide({ onNext, onBack }) {
  const [formData, setFormData] = useState({
    bank: '',
    iban: '',
    sieFile: null,
    skattekontoFile: null,
    selectedProvider: null, // 'fortnox', 'visma', 'bokio'
  });

  const [uploadStatus, setUploadStatus] = useState('');
  const [skattekontoStatus, setSkattekontoStatus] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isSkattekontoHovered, setIsSkattekontoHovered] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProviderClick = (provider) => {
    setFormData(prev => ({ ...prev, selectedProvider: provider }));
    // Här skulle OAuth-flödet startas
    alert(`OAuth-integration med ${provider} startas här (implementeras senare)`);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file) => {
    // Validera filtyp
    const validExtensions = ['.se', '.si', '.sie'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
      setUploadStatus('❌ Fel filtyp. Endast SIE-filer (.se, .si, .sie) accepteras.');
      return;
    }

    setFormData(prev => ({ ...prev, sieFile: file }));
    setUploadStatus(`✅ Fil uppladdad: ${file.name}`);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  // Hantering för Skattekonto CSV
  const handleSkattekontoFile = (file) => {
    if (!file) return;

    // Validera filtyp
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (fileExtension !== '.csv') {
      setSkattekontoStatus('❌ Fel filtyp. Endast CSV-filer (.csv) accepteras.');
      return;
    }

    setFormData(prev => ({ ...prev, skattekontoFile: file }));
    setSkattekontoStatus(`✅ Fil uppladdad: ${file.name}`);
  };

  const handleSkattekontoFileSelect = (e) => {
    const file = e.target.files[0];
    handleSkattekontoFile(file);
  };

  const handleSkattekontoDragOver = (e) => {
    e.preventDefault();
    setIsSkattekontoHovered(true);
  };

  const handleSkattekontoDragLeave = (e) => {
    e.preventDefault();
    setIsSkattekontoHovered(false);
  };

  const handleSkattekontoDrop = (e) => {
    e.preventDefault();
    setIsSkattekontoHovered(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleSkattekontoFile(file);
    }
  };

  const isFormValid = () => {
    // Kräver antingen bank+IBAN, eller SIE-fil, eller vald provider
    const hasManualUpload = formData.sieFile !== null;
    const hasProvider = formData.selectedProvider !== null;
    const hasBankInfo = formData.bank.trim() && formData.iban.trim();
    
    return hasBankInfo && (hasManualUpload || hasProvider);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl p-10">
        <h1 className="text-3xl font-bold text-brand-900 mb-6">
          Bokföringsdata och bankkonto
        </h1>
        
        <p className="text-sm text-brand-700 mb-6">
          För att göra en fullständig riskbedömning behöver vi tillgång till företagets bokföringsunderlag och bankkonto.
        </p>

        <div className="space-y-8">
          {/* Bank information */}
          <div className="p-6 bg-brand-50 rounded-xl border border-brand-200">
            <h2 className="text-xl font-semibold text-brand-900 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Bankinformation
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-brand-800 mb-2">
                  Bank *
                </label>
                <input
                  type="text"
                  value={formData.bank}
                  onChange={(e) => handleChange('bank', e.target.value)}
                  className="w-full px-4 py-2 border border-brand-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  placeholder="T.ex. Swedbank, SEB, Nordea..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-800 mb-2">
                  Bankkontonummer (IBAN) *
                </label>
                <input
                  type="text"
                  value={formData.iban}
                  onChange={(e) => handleChange('iban', e.target.value)}
                  className="w-full px-4 py-2 border border-brand-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent font-mono"
                  placeholder="SE00 0000 0000 0000 0000 0000"
                />
                <p className="text-xs text-brand-600 mt-1">
                  IBAN-nummer används för att verifiera bankuppgifter och analysera transaktionsmönster.
                </p>
              </div>
            </div>
          </div>

          {/* Bokföringsprogram integration */}
          <div className="p-6 bg-white rounded-xl border border-brand-200">
            <h2 className="text-xl font-semibold text-brand-900 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Hämta bokföringsdata
            </h2>
            
            <p className="text-sm text-brand-700 mb-4">
              Välj ditt bokföringsprogram för att automatiskt hämta SIE-filer:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Fortnox */}
              <button
                onClick={() => handleProviderClick('fortnox')}
                className={`group p-6 border-2 rounded-lg transition-all ${
                  formData.selectedProvider === 'fortnox'
                    ? 'border-brand-500 bg-brand-50 shadow-lg'
                    : 'border-gray-300 hover:border-brand-400 hover:shadow-md'
                }`}
              >
                <div className="flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-lg flex items-center justify-center mb-3 transition-opacity ${
                    formData.selectedProvider === 'fortnox'
                      ? 'bg-[#3C8C4A] opacity-100'
                      : 'bg-[#3C8C4A] opacity-40 group-hover:opacity-100'
                  }`}>
                    <span className="text-2xl font-bold text-white">F</span>
                  </div>
                  <span className="font-semibold text-gray-800">Fortnox</span>
                  {formData.selectedProvider === 'fortnox' && (
                    <span className="text-xs text-brand-600 mt-1 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Vald
                    </span>
                  )}
                </div>
              </button>

              {/* Visma */}
              <button
                onClick={() => handleProviderClick('visma')}
                className={`group p-6 border-2 rounded-lg transition-all ${
                  formData.selectedProvider === 'visma'
                    ? 'border-brand-500 bg-brand-50 shadow-lg'
                    : 'border-gray-300 hover:border-brand-400 hover:shadow-md'
                }`}
              >
                <div className="flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-lg flex items-center justify-center mb-3 transition-opacity ${
                    formData.selectedProvider === 'visma'
                      ? 'bg-[#E4003A] opacity-100'
                      : 'bg-[#E4003A] opacity-40 group-hover:opacity-100'
                  }`}>
                    <span className="text-2xl font-bold text-white">V</span>
                  </div>
                  <span className="font-semibold text-gray-800">Visma eEkonomi</span>
                  {formData.selectedProvider === 'visma' && (
                    <span className="text-xs text-brand-600 mt-1 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Vald
                    </span>
                  )}
                </div>
              </button>

              {/* Bokio */}
              <button
                onClick={() => handleProviderClick('bokio')}
                className={`group p-6 border-2 rounded-lg transition-all ${
                  formData.selectedProvider === 'bokio'
                    ? 'border-brand-500 bg-brand-50 shadow-lg'
                    : 'border-gray-300 hover:border-brand-400 hover:shadow-md'
                }`}
              >
                <div className="flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-lg flex items-center justify-center mb-3 transition-opacity ${
                    formData.selectedProvider === 'bokio'
                      ? 'bg-[#0066FF] opacity-100'
                      : 'bg-[#0066FF] opacity-40 group-hover:opacity-100'
                  }`}>
                    <span className="text-2xl font-bold text-white">B</span>
                  </div>
                  <span className="font-semibold text-gray-800">Bokio</span>
                  {formData.selectedProvider === 'bokio' && (
                    <span className="text-xs text-brand-600 mt-1 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Vald
                    </span>
                  )}
                </div>
              </button>
            </div>

            <div className="mt-4 p-3 bg-brand-50 border border-brand-200 rounded-lg">
              <p className="text-xs text-brand-800">
                <strong>ℹ️ Info:</strong> När du klickar på ditt bokföringsprogram öppnas en säker inloggningssida 
                där du godkänner åtkomst. Vi hämtar endast bokföringsdata (SIE-filer) för de senaste 7 åren.
              </p>
            </div>
          </div>

          {/* Manuell uppladdning */}
          <div className="p-6 bg-white rounded-xl border border-brand-200">
            <h2 className="text-xl font-semibold text-brand-900 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              eller ladda upp SIE-fil manuellt
            </h2>
            
            <p className="text-sm text-brand-700 mb-4">
              Om ditt bokföringsprogram inte finns med ovan, exportera en SIE-fil och ladda upp den här:
            </p>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                isDragging
                  ? 'border-brand-500 bg-brand-50'
                  : 'border-brand-300 hover:border-brand-400'
              }`}
            >
              <input
                type="file"
                accept=".se,.si,.sie"
                onChange={handleFileSelect}
                className="hidden"
                id="sie-file-input"
              />
              <label htmlFor="sie-file-input" className="cursor-pointer">
                <svg className="w-12 h-12 mx-auto mb-4 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-brand-800 font-medium mb-2">
                  Dra och släpp SIE-fil här
                </p>
                <p className="text-sm text-brand-600 mb-2">eller</p>
                <span className="inline-block px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors">
                  Välj fil från datorn
                </span>
              </label>
            </div>

            {uploadStatus && (
              <div className={`mt-4 p-3 rounded-lg ${
                uploadStatus.includes('✅')
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                <p className="text-sm">{uploadStatus}</p>
              </div>
            )}

            <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-xs text-gray-700">
                <strong>Hur exporterar jag SIE-fil?</strong><br />
                De flesta bokföringsprogram har en funktion under "Exportera" eller "Rapporter" → "SIE-fil". 
                Välj helårsfil (Type 4) för bäst resultat.
              </p>
            </div>
          </div>
        </div>

        {/* Skattekonto & Deklarationer från Skatteverket */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2 text-brand-900 flex items-center">
            <svg className="w-6 h-6 mr-2 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Skattekonto & Deklarationer
          </h3>
          <p className="text-gray-700 mb-4">
            För att validera momsrapporter enligt <span className="font-semibold">Test 3.3</span> och kontrollera inkomstdeklarationer 
            behöver vi jämföra bokförd moms mot Skattekontots transaktioner samt hämta deklarationer (7 år tillbaka).
          </p>

          {/* Skatteverket OAuth2-knapp */}
          <div className="mb-4">
            <button
              onClick={() => {
                // TODO: Implementera OAuth2-flöde mot Skatteverket
                // Redirect till: https://peroauth2.skatteverket.se/oauth2/v1/per/authorize
                // med scope: "skattekonto:read inkomstdeklaration:read"
                alert('OAuth2-flöde mot Skatteverket startas här:\n\n1. Redirect till Skatteverkets BankID-inloggning\n2. Användaren loggar in med BankID (Skatteverket betalar)\n3. Användaren godkänner åtkomst till Skattekonto + Deklarationer (7 år)\n4. Vi får access token och hämtar data via API\n\nIngen kostnad för appen - Skatteverket sköter BankID-integration!');
              }}
              className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-[#005AA0] to-[#0078D4] text-white rounded-lg hover:from-[#004080] hover:to-[#005AA0] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 font-semibold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              Hämta via Skatteverket (BankID)
            </button>
            <p className="text-xs text-gray-600 mt-2">
              Klicka för att logga in med BankID och godkänna åtkomst till Skattekonto + Deklarationer (7 år). 
              <span className="font-semibold">Ingen kostnad för dig</span> – Skatteverket betalar för BankID-integration.
            </p>
          </div>

          {/* Info om OAuth2-flödet */}
          <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-900 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <strong>Säkert OAuth2-flöde:</strong>
            </p>
            <ol className="text-xs text-gray-700 space-y-1 ml-4 list-decimal">
              <li>Du redirectas till Skatteverkets inloggningssida</li>
              <li>Du loggar in med BankID (Skatteverket betalar för BankID-tjänsten)</li>
              <li>Du godkänner att vi får läsa Skattekonto + Inkomstdeklarationer (7 år)</li>
              <li>Skatteverket redirectar tillbaka med auktorisationskod</li>
              <li>Vi hämtar data via Skatteverkets API</li>
            </ol>
            <p className="text-xs text-gray-700 mt-2">
              <strong>Scopes:</strong> <code className="bg-gray-200 px-1 rounded">skattekonto:read inkomstdeklaration:read</code>
            </p>
          </div>

          <p className="text-sm text-gray-700 mb-3 font-semibold">
            eller ladda upp CSV manuellt:
          </p>

          <div>
            <div
              onDragOver={handleSkattekontoDragOver}
              onDragLeave={handleSkattekontoDragLeave}
              onDrop={handleSkattekontoDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isSkattekontoHovered
                  ? 'border-brand-500 bg-brand-50'
                  : 'border-brand-300 hover:border-brand-400'
              }`}
            >
              <input
                type="file"
                accept=".csv"
                onChange={handleSkattekontoFileSelect}
                className="hidden"
                id="skattekonto-file-input"
              />
              <label htmlFor="skattekonto-file-input" className="cursor-pointer">
                <svg className="w-12 h-12 mx-auto mb-4 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-brand-800 font-medium mb-2">
                  Dra och släpp Skattekonto CSV-fil här
                </p>
                <p className="text-sm text-brand-600 mb-2">eller</p>
                <span className="inline-block px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors">
                  Välj CSV-fil från datorn
                </span>
              </label>
            </div>

            {skattekontoStatus && (
              <div className={`mt-4 p-3 rounded-lg ${
                skattekontoStatus.includes('✅')
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                <p className="text-sm">{skattekontoStatus}</p>
              </div>
            )}

            <div className="mt-4 p-3 bg-brand-50 border border-brand-200 rounded-lg">
              <p className="text-xs text-brand-900">
                <strong>Hur laddar jag ner Skattekonto CSV?</strong><br />
                1. Logga in på <a href="https://www.skatteverket.se" target="_blank" rel="noopener noreferrer" className="underline hover:text-brand-700">skatteverket.se</a><br />
                2. Gå till <strong>Transaktioner och kontoutdrag</strong><br />
                3. Välj fliken <strong>Bokförda transaktioner</strong><br />
                4. Under "Valfri period" – välj datumintervall (max 8 år, rekommenderat: från {new Date().getFullYear() - 7}-01-01 till idag)<br />
                5. Klicka på <strong>Sök</strong><br />
                6. Klicka på <strong>Ladda ner csv-fil Excel</strong>
              </p>
            </div>

            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
              <p className="text-xs text-yellow-900">
                <strong>ℹ️ OBS:</strong> Denna fil är <em>valfri</em> för icke-momsregistrerade företag. 
                För momsregistrerade företag rekommenderas starkt för att validera momsredovisning enligt penningtvättslagen.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={onBack}
            className="w-1/3 px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
          >
            Tillbaka
          </button>
          <button
            onClick={onNext}
            disabled={!isFormValid()}
            className={`w-2/3 px-8 py-3 rounded-lg font-semibold transition-all ${
              isFormValid()
                ? 'bg-brand-600 hover:bg-brand-700 text-white cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Nästa
          </button>
        </div>
        
        {!isFormValid() && (
          <p className="text-center text-sm text-brand-600 mt-2">
            Fyll i bankinformation och välj ett bokföringsprogram eller ladda upp en SIE-fil
          </p>
        )}
      </div>
    </div>
  );
}
