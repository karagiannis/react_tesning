// Server Error Page (500)
// Displayed when backend errors or system crashes occur

import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function ServerErrorPage({ error = null, errorId = null }) {
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);

  // Generate a unique error tracking ID if not provided
  const trackingId = errorId || `ERR-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  const handleRetry = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleReportError = () => {
    const subject = `Felrapport: ${trackingId}`;
    const body = `
Hej support,

Jag stötte på ett serverfel i onboarding-appen.

Spårnings-ID: ${trackingId}
Tidpunkt: ${new Date().toLocaleString('sv-SE')}
Sida: ${window.location.pathname}

${error ? `Felmeddelande: ${error.message || error}` : ''}

Beskriv vad du gjorde när felet uppstod:
[Beskriv här]

Mvh
    `.trim();

    window.location.href = `mailto:support@dinbyra.se?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        
        {/* Error Icon & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6 animate-pulse">
            <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          {/* Error Code Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-full font-bold mb-4">
            Serverfel 500
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Oj! Något gick fel
          </h1>
          
          <p className="text-lg text-gray-600 mb-2">
            Vårt system stötte på ett oväntat problem
          </p>
          
          <p className="text-sm text-gray-500">
            Vi har automatiskt loggat detta fel och arbetar på att lösa det
          </p>
        </div>

        {/* Error Tracking Card */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-red-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div>
                <p className="text-sm text-gray-500">Spårnings-ID</p>
                <p className="font-mono font-bold text-brand-900">{trackingId}</p>
              </div>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(trackingId)}
              className="px-3 py-1 bg-brand-100 text-brand-700 rounded hover:bg-brand-200 transition-colors text-sm font-semibold"
              title="Kopiera spårnings-ID"
            >
              Kopiera
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm text-gray-600">
                  Ange detta ID när du kontaktar support så kan vi snabbt hitta och lösa problemet.
                </p>
              </div>
            </div>
          </div>

          {/* Error Details (Collapsible) */}
          {error && (
            <div className="mt-4">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="w-full flex items-center justify-between p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <span className="text-sm font-semibold text-gray-700">Teknisk information</span>
                <svg 
                  className={`w-5 h-5 text-gray-500 transition-transform ${showDetails ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showDetails && (
                <div className="mt-2 p-3 bg-gray-900 rounded-lg overflow-auto">
                  <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap">
                    {error.stack || error.message || JSON.stringify(error, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Suggestions */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-brand-200 p-6 mb-6">
          <h3 className="font-bold text-brand-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Försök med följande:
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-brand-600 mt-1">1.</span>
              <div>
                <p className="font-semibold text-gray-900">Ladda om sidan</p>
                <p className="text-sm text-gray-600">Ibland är det ett tillfälligt problem som löser sig</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-brand-600 mt-1">2.</span>
              <div>
                <p className="font-semibold text-gray-900">Kontrollera din internetanslutning</p>
                <p className="text-sm text-gray-600">Se till att du är ansluten till internet</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-brand-600 mt-1">3.</span>
              <div>
                <p className="font-semibold text-gray-900">Vänta några minuter</p>
                <p className="text-sm text-gray-600">Om våra servrar är överbelastade kan det ta lite tid</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-brand-600 mt-1">4.</span>
              <div>
                <p className="font-semibold text-gray-900">Kontakta support</p>
                <p className="text-sm text-gray-600">Om problemet kvarstår, skicka en felrapport</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={handleRetry}
            className="bg-gradient-to-r from-brand-600 to-brand-700 text-white px-6 py-4 rounded-lg hover:from-brand-700 hover:to-brand-800 transition-all font-bold shadow-lg flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Försök igen
          </button>

          <button
            onClick={handleGoHome}
            className="bg-white border-2 border-brand-300 text-brand-700 px-6 py-4 rounded-lg hover:bg-brand-50 transition-colors font-semibold flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Tillbaka till startsidan
          </button>
        </div>

        {/* Report Error Button */}
        <button
          onClick={handleReportError}
          className="w-full bg-red-50 border-2 border-red-200 text-red-700 px-6 py-3 rounded-lg hover:bg-red-100 transition-colors font-semibold flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Skicka felrapport till support
        </button>

        {/* Support Contact */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-2">Behöver du omedelbar hjälp?</p>
          <div className="flex items-center justify-center gap-6">
            <a 
              href="mailto:support@dinbyra.se" 
              className="text-brand-600 hover:text-brand-700 font-semibold text-sm hover:underline flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              support@dinbyra.se
            </a>
            <a 
              href="tel:08-123-45-67" 
              className="text-brand-600 hover:text-brand-700 font-semibold text-sm hover:underline flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              08-123 45 67
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
