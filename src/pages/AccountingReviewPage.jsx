import { useState, useEffect } from 'react';
import { generateReport } from '../utils/reportGenerator';

/**
 * Bokföringsanalys - Fortnox-stil med klickbar navigation
 * Balansrapport → Huvudbok → Verifikation → Underlag
 */
function AccountingReviewPage() {
  const [reportHtml, setReportHtml] = useState('');
  const [viewMode, setViewMode] = useState('screen'); // 'screen' eller 'pdf'
  const [currentUrl, setCurrentUrl] = useState('');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Default: visa balansrapport
    const defaultParams = new URLSearchParams({
      fid: 'hyrupstars_ab',
      type: 'balance',
      fromdate: '2025-01-01',
      todate: '2025-12-31',
      output: 'htm'
    });
    
    loadReport(defaultParams);
  }, []);
  
  /**
   * Ladda rapport baserat på URL-parametrar
   */
  const loadReport = (searchParams) => {
    setLoading(true);
    setCurrentUrl(`?${searchParams.toString()}`);
    
    try {
      const result = generateReport(searchParams);
      
      if (result?.isPdf) {
        // För PDF-läge: visa placeholder
        setReportHtml(`
          <div style="padding: 40px; text-align: center; font-family: Arial;">
            <h2>📄 PDF-visning</h2>
            <p style="margin: 20px 0;">I produktionsläget genereras en klickbar PDF här.</p>
            <p style="color: #666; font-size: 14px;">
              PDF skulle innehålla samma data som HTML-versionen men med professionell formatering<br>
              och inbäddade hyperlänkar för navigation mellan rapporter.
            </p>
            <a href="${currentUrl.replace('output=pdf', 'output=htm')}" 
               style="display: inline-block; margin-top: 20px; padding: 10px 20px; 
                      background-color: #00704a; color: white; text-decoration: none; 
                      border-radius: 6px;">
              🖥️ Visa som HTML istället
            </a>
          </div>
        `);
      } else {
        setReportHtml(result);
      }
    } catch (error) {
      console.error('Fel vid rapportgenerering:', error);
      setReportHtml(`
        <div style="padding: 40px; color: #dc3545; font-family: Arial;">
          <h2>⚠️ Rapportfel</h2>
          <p>Kunde inte generera rapporten. Kontrollera URL-parametrarna.</p>
          <pre style="background: #f5f5f5; padding: 15px; margin-top: 20px; border-radius: 6px;">
            ${error.message}
          </pre>
        </div>
      `);
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Hantera iframe-navigering (när användaren klickar länkar i rapporten)
   */
  const handleIframeLoad = (event) => {
    try {
      const iframe = event.target;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      const iframeUrl = iframeDoc.location.search;
      
      if (iframeUrl && iframeUrl !== currentUrl) {
        // Användaren navigerade via klick i rapporten
        const params = new URLSearchParams(iframeUrl);
        setCurrentUrl(iframeUrl);
        
        // Uppdatera view mode om output-parametern ändrades
        const outputParam = params.get('output');
        if (outputParam === 'pdf') {
          setViewMode('pdf');
        } else if (outputParam === 'htm') {
          setViewMode('screen');
        }
      }
    } catch (e) {
      // Cross-origin eller annat iframe-fel, ignorera
      console.log('Iframe navigation detected, but cannot read URL (expected)');
    }
  };
  
  /**
   * Hantera view mode toggle (skärm/PDF)
   */
  const toggleViewMode = (mode) => {
    setViewMode(mode);
    
    const params = new URLSearchParams(currentUrl.substring(1));
    params.set('output', mode === 'screen' ? 'htm' : 'pdf');
    
    loadReport(params);
  };
  
  return (
    <div className="min-h-screen bg-brandLight-50">
      {/* Header med navigation och view mode toggle */}
      <div className="bg-brandGreen-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-page-title">Bokföringsanalys</h1>
              <p className="text-brandLight-100 mt-1">
                Interaktiv rapportvisning med drill-down navigation
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => toggleViewMode('screen')}
                className={`px-4 py-2 rounded-box font-medium transition-all ${
                  viewMode === 'screen'
                    ? 'bg-white text-brandGreen-600'
                    : 'bg-brandGreen-700 text-white hover:bg-brandGreen-800'
                }`}
              >
                🖥️ Visa på skärm
              </button>
              <button
                onClick={() => toggleViewMode('pdf')}
                className={`px-4 py-2 rounded-box font-medium transition-all ${
                  viewMode === 'pdf'
                    ? 'bg-white text-brandGreen-600'
                    : 'bg-brandGreen-700 text-white hover:bg-brandGreen-800'
                }`}
              >
                📄 Visa som PDF
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Breadcrumb / Status */}
      <div className="bg-white border-b border-brandLight-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between text-sm">
            <div className="text-brandText-600">
              <span className="font-medium">Nuvarande rapport:</span>
              <code className="ml-2 px-2 py-1 bg-brandLight-100 rounded text-xs">
                {currentUrl || 'Laddar...'}
              </code>
            </div>
            
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></span>
              <span className="text-brandText-500">
                {loading ? 'Laddar rapport...' : 'Klar'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Rapport iframe/container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-box shadow-xl overflow-hidden">
          {reportHtml ? (
            <iframe
              srcDoc={reportHtml}
              onLoad={handleIframeLoad}
              className="w-full border-0"
              style={{ minHeight: '800px', height: '85vh' }}
              title="Bokföringsrapport"
              sandbox="allow-same-origin allow-scripts allow-popups"
            />
          ) : (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brandGreen-600 mx-auto mb-4"></div>
                <p className="text-brandText-600">Förbereder rapport...</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Info-panel */}
        <div className="mt-6 bg-brandLight-50 border border-brandLight-200 rounded-box p-6">
          <h3 className="text-lg font-semibold text-brandGreen-600 mb-3">
            💡 Hur navigeringen fungerar
          </h3>
          <ul className="space-y-2 text-sm text-brandText-600">
            <li className="flex items-start gap-2">
              <span className="text-brandGreen-600 font-bold">1.</span>
              <span>
                <strong>Balansrapport:</strong> Klicka på ett kontonummer för att se huvudboken för det kontot
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brandGreen-600 font-bold">2.</span>
              <span>
                <strong>Huvudbok:</strong> Klicka på ett verifikationsnummer för att se verifikationsdetaljer
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brandGreen-600 font-bold">3.</span>
              <span>
                <strong>Verifikation:</strong> Se bokföringsposter och bifogade underlagsdokument med OCR-matchning
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brandGreen-600 font-bold">4.</span>
              <span>
                <strong>Forensisk analys:</strong> Verifikation B123 visar exempel på automatisk detektion av privata inköp
              </span>
            </li>
          </ul>
          
          <div className="mt-4 pt-4 border-t border-brandLight-200">
            <p className="text-xs text-brandText-500">
              <strong>Testexempel:</strong> Navigera från Balansrapport → Konto 2510 (Skatteskulder) → Verifikation A3 
              för normal post, eller → Verifikation B123 för fraudexempel med 49 dokument.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountingReviewPage;
