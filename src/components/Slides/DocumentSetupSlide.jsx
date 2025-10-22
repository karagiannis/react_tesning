import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * DocumentSetupSlide - Steg 3: Digital dokumenthantering
 * 
 * VIKTIGT FÖR FORTNOX MARKETPLACE-APP:
 * - Denna onboarding-app: Dropbox primärt (LIA-handledaren använder Dropbox)
 * - Fortnox marketplace-app: Google Drive ENDAST (inbyggd OCR, ingen Tesseract behövs)
 * 
 * Google Drive-fördelar för Fortnox-app:
 * 1. Gratis OCR via Google's ML-modeller (sparar 500-1000 kr/mån i serverkostand)
 * 2. Automatisk textigenkänning från skannade fakturor/kvitton
 * 3. Full-text search i PDF:er (sök "Faktura 123" inuti dokument)
 * 4. Ingen CPU/disk-belastning på vår infrastruktur
 * 5. Världsledande kvalitet (Google Lens-teknologi)
 * 
 * Tesseract-alternativet:
 * - Kräver ~500 MB disk space (binaries + språkfiler)
 * - Kräver 50-70% CPU för OCR-jobb (5-30 sek/PDF)
 * - Skalningsproblem vid många samtidiga användare
 * - Behöver större server = högre kostnad
 */

const DocumentSetupSlide = () => {
  const navigate = useNavigate();
  const [selectedProvider, setSelectedProvider] = useState('dropbox'); // 'dropbox' | 'gdrive' | 'onedrive'
  const [authStatus, setAuthStatus] = useState('not_started'); // 'not_started' | 'authenticating' | 'success' | 'error'
  const [folderPath, setFolderPath] = useState('');
  const [testStatus, setTestStatus] = useState('pending'); // 'pending' | 'testing' | 'success' | 'failed'

  // Simulera att vi redan har företagsnamn från tidigare steg
  const companyName = "Acme AB"; // TODO: Hämta från formData state

  const handleOAuthCallback = async (code, state) => {
    setAuthStatus('authenticating');
    
    try {
      // Exchange authorization code for access token
      const response = await fetch('/api/cloud/oauth/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: state, // State innehåller provider name
          code: code
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setFolderPath(data.folder_path);
        setAuthStatus('success');
        
        // Test connection automatically
        testConnection();
      } else {
        setAuthStatus('error');
      }
    } catch (error) {
      console.error('OAuth callback error:', error);
      setAuthStatus('error');
    }
  };

  useEffect(() => {
    // Check if user just returned from OAuth redirect
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    
    if (code && state) {
      handleOAuthCallback(code, state);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDropboxAuth = async () => {
    setAuthStatus('authenticating');
    
    try {
      // Get Dropbox OAuth URL
      const response = await fetch('/api/cloud/dropbox/auth-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name: companyName,
          redirect_uri: `${window.location.origin}/dokument-setup`
        })
      });
      
      const data = await response.json();
      
      // Redirect to Dropbox OAuth page
      window.location.href = data.auth_url;
    } catch (error) {
      console.error('Dropbox auth error:', error);
      setAuthStatus('error');
    }
  };

  const handleGoogleDriveAuth = async () => {
    setAuthStatus('authenticating');
    
    try {
      // Get Google OAuth URL
      const response = await fetch('/api/cloud/gdrive/auth-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name: companyName,
          redirect_uri: `${window.location.origin}/dokument-setup`
        })
      });
      
      const data = await response.json();
      
      // Redirect to Google OAuth page
      window.location.href = data.auth_url;
    } catch (error) {
      console.error('Google Drive auth error:', error);
      setAuthStatus('error');
    }
  };

  const handleOneDriveAuth = async () => {
    setAuthStatus('authenticating');
    
    try {
      // Get OneDrive OAuth URL
      const response = await fetch('/api/cloud/onedrive/auth-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name: companyName,
          redirect_uri: `${window.location.origin}/dokument-setup`
        })
      });
      
      const data = await response.json();
      
      // Redirect to Microsoft OAuth page
      window.location.href = data.auth_url;
    } catch (error) {
      console.error('OneDrive auth error:', error);
      setAuthStatus('error');
    }
  };

  const testConnection = async () => {
    setTestStatus('testing');
    
    try {
      // Test if we can access the folder
      const response = await fetch(`/api/cloud/${selectedProvider}/test-connection`, {
        method: 'GET'
      });
      
      if (response.ok) {
        setTestStatus('success');
      } else {
        setTestStatus('failed');
      }
    } catch (error) {
      console.error('Connection test error:', error);
      setTestStatus('failed');
    }
  };

  const handleContinue = () => {
    // Navigate to next slide (e.g., ongoing routines)
    navigate('/rutiner'); // TODO: Skapa denna slide
  };

  const handleSkip = () => {
    // Allow skip but warn user
    if (window.confirm('Är du säker på att du vill hoppa över detta steg? Du kan alltid konfigurera dokumenthantering senare.')) {
      navigate('/rutiner');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <span>Steg 3 av 3</span>
            <span>•</span>
            <span>Post-kontrakt setup</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Digital dokumenthantering
          </h1>
          <p className="text-lg text-gray-600">
            För snabb och korrekt bokföring behöver vi få dina underlag digitalt.
            Välj din föredragna molnlagringstjänst nedan.
          </p>
        </div>

        {/* Info box */}
        <div className="bg-brand-50 border-l-4 border-brand-400 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-brand-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm text-brand-700">
                <strong>Varför behövs detta?</strong> Med rätt setup behöver du bara lägga fakturor 
                och kvitton i skannern – resten sker automatiskt! Vi får tillgång till dina dokument 
                direkt och kan påbörja bokföringen samma dag.
              </p>
            </div>
          </div>
        </div>

        {/* Provider Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Välj molnlagringstjänst</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Dropbox */}
            <button
              onClick={() => setSelectedProvider('dropbox')}
              className={`p-6 border-2 rounded-lg transition-all ${
                selectedProvider === 'dropbox'
                  ? 'border-brand-600 bg-brand-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 mb-4 flex items-center justify-center">
                  {/* Dropbox logo placeholder */}
                  <div className="w-full h-full bg-brand-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold">
                    D
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Dropbox</h3>
                <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full mb-2">
                  Rekommenderas
                </span>
                <p className="text-sm text-gray-600 text-center">
                  Enklast att använda. Perfekt för de flesta användare.
                </p>
              </div>
            </button>

            {/* Google Drive */}
            <button
              onClick={() => setSelectedProvider('google')}
              className={`p-6 border-2 rounded-lg transition-all ${
                selectedProvider === 'google'
                  ? 'border-brand-600 bg-brand-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 mb-4 flex items-center justify-center">
                  {/* Google Drive logo placeholder */}
                  <div className="w-full h-full bg-gradient-to-br from-brand-500 via-green-500 to-yellow-500 rounded-lg flex items-center justify-center text-white text-2xl font-bold">
                    G
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Google Drive</h3>
                <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full mb-2">
                  AI-Kraftfull
                </span>
                <p className="text-sm text-gray-600 text-center">
                  Inbyggd OCR. Söker inuti PDF:er. Bäst för automatisering.
                </p>
              </div>
            </button>

            {/* OneDrive */}
            <button
              onClick={() => setSelectedProvider('onedrive')}
              className={`p-6 border-2 rounded-lg transition-all ${
                selectedProvider === 'onedrive'
                  ? 'border-brand-600 bg-brand-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 mb-4 flex items-center justify-center">
                  {/* OneDrive logo placeholder */}
                  <div className="w-full h-full bg-brand-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold">
                    O
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">OneDrive</h3>
                <span className="inline-block px-3 py-1 bg-brand-100 text-brand-800 text-xs font-semibold rounded-full mb-2">
                  Microsoft 365
                </span>
                <p className="text-sm text-gray-600 text-center">
                  Perfekt om ni redan har Microsoft 365-abonnemang.
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Setup Instructions based on selected provider */}
        <div className="bg-white border rounded-lg shadow-sm p-6 mb-8">
          {selectedProvider === 'dropbox' && (
            <>
              <h3 className="text-xl font-semibold mb-4">Dropbox-setup</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded">
                  <h4 className="font-semibold text-sm mb-2">Så här funkar det:</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                    <li>Du klickar på "Anslut till Dropbox" nedan</li>
                    <li>Du loggar in på Dropbox (om inte redan inloggad)</li>
                    <li>Du godkänner att vi får läsåtkomst till en mapp som heter:<br/>
                      <code className="bg-white px-2 py-1 rounded text-xs mt-1 inline-block">
                        /{companyName}_Underlag
                      </code>
                    </li>
                    <li>Du återvänder hit automatiskt när det är klart</li>
                    <li>Vi testar anslutningen och bekräftar att allt fungerar ✓</li>
                  </ol>
                </div>

                <div className="bg-brand-50 p-4 rounded">
                  <p className="text-sm text-brand-800">
                    <strong>💡 Tips:</strong> Efter setup kan du enkelt släppa filer i mappen 
                    från din telefon, dator eller skanner. Skapa gärna undermappar som 
                    "Leverantörsfakturor", "Kvitton", "Avtal" för bättre struktur.
                  </p>
                </div>

                {authStatus === 'not_started' && (
                  <button
                    onClick={handleDropboxAuth}
                    className="w-full bg-brand-600 text-white px-6 py-3 rounded-lg hover:bg-brand-700 transition-colors font-semibold flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 10.5v-2a.5.5 0 01.5-.5h3a.5.5 0 010 1h-2.5v1.5a.5.5 0 01-1 0z"/>
                    </svg>
                    Anslut till Dropbox
                  </button>
                )}

                {authStatus === 'authenticating' && (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Autentiserar med Dropbox...</p>
                  </div>
                )}

                {authStatus === 'success' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <div>
                        <h4 className="text-green-800 font-semibold">Anslutning lyckades!</h4>
                        <p className="text-sm text-green-700 mt-1">
                          Vi har nu åtkomst till mappen: <code className="bg-white px-2 py-0.5 rounded text-xs">{folderPath}</code>
                        </p>
                        
                        {testStatus === 'testing' && (
                          <p className="text-sm text-green-700 mt-2">Testar anslutning...</p>
                        )}
                        
                        {testStatus === 'success' && (
                          <p className="text-sm text-green-700 mt-2 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                            </svg>
                            Anslutning verifierad!
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {authStatus === 'error' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <svg className="w-6 h-6 text-red-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                      </svg>
                      <div>
                        <h4 className="text-red-800 font-semibold">Något gick fel</h4>
                        <p className="text-sm text-red-700 mt-1">
                          Vi kunde inte ansluta till Dropbox. Försök igen eller kontakta support om problemet kvarstår.
                        </p>
                        <button
                          onClick={handleDropboxAuth}
                          className="mt-3 text-sm text-red-700 underline hover:text-red-800"
                        >
                          Försök igen
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {selectedProvider === 'gdrive' && (
            <>
              <h3 className="text-xl font-semibold mb-4">Google Drive-setup</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded">
                  <h4 className="font-semibold text-sm mb-2">Så här funkar det:</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                    <li>Du klickar på "Anslut till Google Drive" nedan</li>
                    <li>Du loggar in med ditt Google-konto</li>
                    <li>Du godkänner att vi får läsåtkomst till en mapp</li>
                    <li>Vi skapar automatiskt en mapp: <code className="bg-white px-2 py-1 rounded text-xs">{companyName}_Underlag</code></li>
                    <li>Du återvänder hit automatiskt när det är klart ✓</li>
                  </ol>
                </div>

                <div className="bg-purple-50 p-4 rounded border border-purple-200">
                  <h4 className="font-semibold text-sm text-purple-900 mb-2">🤖 AI-funktioner (Google Drive)</h4>
                  <ul className="text-sm text-purple-800 space-y-1">
                    <li>✅ <strong>Automatisk OCR:</strong> Skannade kvitton blir sökbara text</li>
                    <li>✅ <strong>Full-text search:</strong> Sök "Faktura 123" inuti alla PDF:er</li>
                    <li>✅ <strong>Smart kategorisering:</strong> AI känner igen dokumenttyper</li>
                    <li>✅ <strong>Ingen extra kostnad:</strong> Allt ingår i Google Drive API</li>
                  </ul>
                </div>

                <div className="bg-brand-50 p-4 rounded">
                  <p className="text-sm text-brand-800">
                    <strong>💡 För Fortnox marketplace-appen:</strong> Vi rekommenderar Google Drive 
                    för maximal automatisering. OCR-funktionen sparar oss hundratals timmar manuellt arbete 
                    och eliminerar behovet av lokala OCR-verktyg som Tesseract.
                  </p>
                </div>

                {authStatus === 'not_started' && (
                  <button
                    onClick={handleGoogleDriveAuth}
                    className="w-full bg-gradient-to-r from-brand-600 to-green-600 text-white px-6 py-3 rounded-lg hover:from-brand-700 hover:to-green-700 transition-all font-semibold flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 10.5v-2a.5.5 0 01.5-.5h3a.5.5 0 010 1h-2.5v1.5a.5.5 0 01-1 0z"/>
                    </svg>
                    Anslut till Google Drive
                  </button>
                )}

                {/* Similar success/error states as Dropbox */}
              </div>
            </>
          )}

          {selectedProvider === 'onedrive' && (
            <>
              <h3 className="text-xl font-semibold mb-4">OneDrive-setup</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded">
                  <h4 className="font-semibold text-sm mb-2">Så här funkar det:</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                    <li>Du klickar på "Anslut till OneDrive" nedan</li>
                    <li>Du loggar in med ditt Microsoft-konto</li>
                    <li>Du godkänner att vi får läsåtkomst till en mapp</li>
                    <li>Vi skapar automatiskt en mapp: <code className="bg-white px-2 py-1 rounded text-xs">{companyName}_Underlag</code></li>
                    <li>Du återvänder hit automatiskt när det är klart ✓</li>
                  </ol>
                </div>

                <div className="bg-brand-50 p-4 rounded">
                  <p className="text-sm text-brand-800">
                    <strong>💼 Microsoft 365-integration:</strong> Om ni redan har Microsoft 365 
                    för företaget så fungerar OneDrive perfekt. Alla dokument sparas i ert befintliga 
                    system och ni behöver inte hantera ännu ett molnlagringskonto.
                  </p>
                </div>

                {authStatus === 'not_started' && (
                  <button
                    onClick={handleOneDriveAuth}
                    className="w-full bg-brand-600 text-white px-6 py-3 rounded-lg hover:bg-brand-700 transition-colors font-semibold flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 10.5v-2a.5.5 0 01.5-.5h3a.5.5 0 010 1h-2.5v1.5a.5.5 0 01-1 0z"/>
                    </svg>
                    Anslut till OneDrive
                  </button>
                )}

                {/* Similar success/error states as Dropbox */}
              </div>
            </>
          )}
        </div>

        {/* Scanner setup guide (collapsible) */}
        {authStatus === 'success' && (
          <div className="bg-gray-50 border rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">📱 Bonus: Konfigurera din skanner (valfritt)</h3>
            <p className="text-sm text-gray-600 mb-4">
              Vill du att din skanner automatiskt sparar dokument till molnet? Här är snabbguider för populära skannermärken:
            </p>
            
            <details className="mb-3">
              <summary className="cursor-pointer font-semibold text-sm text-gray-700 hover:text-gray-900 p-2 bg-white rounded border">
                Fujitsu ScanSnap (iX-serien, S1300, etc.)
              </summary>
              <div className="mt-3 pl-4 text-sm text-gray-700 space-y-2">
                <ol className="list-decimal list-inside space-y-1">
                  <li>Öppna <strong>ScanSnap Manager</strong></li>
                  <li>Högerklicka på ikonen → <strong>Settings</strong></li>
                  <li>Under "Save" välj <strong>"Specify a folder"</strong></li>
                  <li>Bläddra till din {selectedProvider === 'dropbox' ? 'Dropbox' : selectedProvider === 'gdrive' ? 'Google Drive' : 'OneDrive'}-mapp</li>
                  <li>Klart! Testa genom att scanna ett dokument</li>
                </ol>
              </div>
            </details>

            <details className="mb-3">
              <summary className="cursor-pointer font-semibold text-sm text-gray-700 hover:text-gray-900 p-2 bg-white rounded border">
                Brother (ADS-serien, MFC-serien)
              </summary>
              <div className="mt-3 pl-4 text-sm text-gray-700 space-y-2">
                <ol className="list-decimal list-inside space-y-1">
                  <li>Tryck på <strong>Scan</strong> på skannerns display</li>
                  <li>Välj <strong>"to Network"</strong></li>
                  <li>Konfigurera mål till din molnmapp</li>
                  <li>Spara som favorit (t.ex. "Bokföring")</li>
                  <li>Framöver: Tryck bara på favoriten och scanna!</li>
                </ol>
              </div>
            </details>

            <details>
              <summary className="cursor-pointer font-semibold text-sm text-gray-700 hover:text-gray-900 p-2 bg-white rounded border">
                HP OfficeJet / LaserJet (med ADF)
              </summary>
              <div className="mt-3 pl-4 text-sm text-gray-700 space-y-2">
                <ol className="list-decimal list-inside space-y-1">
                  <li>Gå till skannerns webbgränssnitt (skriv IP-adressen i webbläsare)</li>
                  <li>Välj <strong>Scan/Digital Send</strong></li>
                  <li>Konfigurera destination till din molnmapp</li>
                  <li>Spara som snabbval</li>
                </ol>
              </div>
            </details>

            <p className="text-xs text-gray-500 mt-4 italic">
              💡 Behöver du hjälp med scanner-setup? Kontakta oss så går vi igenom det tillsammans (5-10 min)
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleSkip}
            className="text-gray-600 hover:text-gray-800 underline"
          >
            Hoppa över (konfigurera senare)
          </button>

          {authStatus === 'success' && testStatus === 'success' && (
            <button
              onClick={handleContinue}
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center gap-2"
            >
              Fortsätt
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentSetupSlide;
