// Unauthorized Page (401/403)
// Displayed when user tries to access protected content without authentication or proper permissions

import { useNavigate } from 'react-router-dom';

export default function UnauthorizedPage({ errorCode = 401 }) {
  const navigate = useNavigate();

  const errorMessages = {
    401: {
      title: "Åtkomst nekad",
      message: "Du måste logga in för att se denna sida",
      icon: "🔒",
      action: "Logga in"
    },
    403: {
      title: "Otillräckliga behörigheter",
      message: "Du har inte behörighet att komma åt denna resurs",
      icon: "⛔",
      action: "Tillbaka till startsidan"
    }
  };

  const error = errorMessages[errorCode] || errorMessages[401];

  const handleAction = () => {
    if (errorCode === 401) {
      navigate('/login');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-white flex items-center justify-center p-8">
      <div className="max-w-md w-full">
        
        {/* Error Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6">
            <span className="text-5xl">{error.icon}</span>
          </div>
          
          {/* Error Code Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-full font-bold mb-4">
            Fel {errorCode}
          </div>
          
          <h1 className="text-page-title text-brand-900 mb-4">
            {error.title}
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            {error.message}
          </p>
        </div>

        {/* Error Details Card */}
        <div className="bg-white rounded-card shadow-lg border-2 border-red-200 p-6 mb-6">
          <div className="flex items-start gap-3 mb-4">
            <svg className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h3 className="font-semibold text-brand-900 mb-2">Vad hände?</h3>
              <p className="text-sm text-gray-600">
                {errorCode === 401 
                  ? "Din session har gått ut eller så har du inte loggat in ännu. Vänligen logga in för att fortsätta."
                  : "Ditt användarkonto har inte tillräckliga rättigheter för att visa denna sida. Kontakta din administratör om du tror att detta är fel."
                }
              </p>
            </div>
          </div>

          {errorCode === 401 && (
            <div className="bg-brand-50 rounded-box p-4 mt-4">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-brand-900 mb-1">Tips:</p>
                  <p className="text-sm text-brand-700">
                    Använd BankID för att logga in säkert. Ingen session sparas längre än 24 timmar av säkerhetsskäl.
                  </p>
                </div>
              </div>
            </div>
          )}

          {errorCode === 403 && (
            <div className="bg-brand-50 rounded-box p-4 mt-4">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-brand-900 mb-1">Behöver du åtkomst?</p>
                  <p className="text-sm text-brand-700">
                    Kontakta din byråadministratör för att få utökade behörigheter om du tror att du borde ha tillgång till denna sida.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleAction}
            className="w-full bg-gradient-to-r from-brand-600 to-brand-700 text-white px-6 py-4 rounded-box hover:from-brand-700 hover:to-brand-800 transition-all font-bold text-lg shadow-lg flex items-center justify-center gap-2"
          >
            {errorCode === 401 ? (
              <>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                {error.action}
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {error.action}
              </>
            )}
          </button>

          <button
            onClick={() => window.history.back()}
            className="w-full bg-white border-2 border-brand-300 text-brand-700 px-6 py-3 rounded-box hover:bg-brand-50 transition-colors font-semibold flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Gå tillbaka
          </button>
        </div>

        {/* Support Contact */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-2">Behöver du hjälp?</p>
          <a 
            href="mailto:support@dinbyra.se" 
            className="text-brand-600 hover:text-brand-700 font-semibold text-sm hover:underline"
          >
            Kontakta support →
          </a>
        </div>

      </div>
    </div>
  );
}
