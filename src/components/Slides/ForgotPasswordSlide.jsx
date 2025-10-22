import { useState } from 'react';

export default function ForgotPasswordSlide({ onNext, onBack }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulera API-anrop
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      // Efter 2 sekunder, navigera till reset-password sidan
      setTimeout(() => {
        onNext();
      }, 2000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-10">
        <h1 className="text-3xl font-bold text-brand-900 mb-2 text-center">
          Återställ lösenord
        </h1>
        
        <p className="text-sm text-gray-600 mb-6 text-center">
          Ange din e-postadress så skickar vi en 6-siffrig återställningskod
        </p>

        {success ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800 text-sm text-center">
              <strong>✓</strong> En 6-siffrig kod har skickats till din e-post!
              <br />
              <span className="text-xs text-green-600">Vidarebefordrar om ett ögonblick...</span>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-800 mb-1">E-post</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-brand-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                placeholder="din.email@example.com"
              />
            </div>

            <div className="bg-white border border-blue-300 rounded-lg p-4">
              <p className="text-xs text-gray-700">
                <strong>Information:</strong><br />
                En 6-siffrig kod kommer skickas till din e-post. 
                Koden är giltig i <strong>15 minuter</strong>.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition-all"
            >
              {loading ? 'Skickar...' : 'Skicka återställningskod'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <button 
            onClick={onBack}
            className="text-sm text-brand-600 hover:text-brand-700 font-semibold"
          >
            ← Tillbaka till login
          </button>
        </div>
      </div>
    </div>
  );
}
