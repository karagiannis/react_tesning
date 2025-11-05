import { useState } from 'react';

export default function ResetPasswordSlide({ onNext, onResendCode }) {
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validatePassword = (pwd) => {
    if (pwd.length < 12) return 'Lösenordet måste vara minst 12 tecken';
    if (!/\d/.test(pwd)) return 'Lösenordet måste innehålla minst en siffra';
    if (!/[A-Z]/.test(pwd)) return 'Lösenordet måste innehålla minst en versal';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validera kod
    if (code.length !== 6 || !/^\d+$/.test(code)) {
      setError('Verifieringskoden måste vara 6 siffror');
      return;
    }

    // Validera lösenord
    const pwdError = validatePassword(password);
    if (pwdError) {
      setError(pwdError);
      return;
    }

    // Kontrollera att lösenorden matchar
    if (password !== confirmPassword) {
      setError('Lösenorden matchar inte');
      return;
    }

    setLoading(true);

    // Simulera API-anrop
    setTimeout(() => {
      setLoading(false);
      // Navigera till login efter lyckad återställning
      onNext();
    }, 1000);
  };

  const handleResendCode = () => {
    onResendCode();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-card shadow-2xl p-10">
        <h1 className="text-page-title text-brand-900 mb-2 text-center">
          Ange nytt lösenord
        </h1>
        
        <p className="text-sm text-gray-600 mb-6 text-center">
          Ange den 6-siffriga koden från din e-post och välj ett nytt lösenord
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-box p-3 mb-4">
            <p className="text-red-800 text-sm"><strong>✗</strong> {error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-800 mb-1">
              Verifieringskod (6 siffror)
            </label>
            <input 
              type="text" 
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
              maxLength={6}
              className="w-full px-4 py-2 border border-brand-300 rounded-box focus:ring-2 focus:ring-brand-500 focus:border-transparent text-center text-2xl tracking-widest font-mono"
              placeholder="000000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-800 mb-1">
              Nytt lösenord
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-brand-300 rounded-box focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              placeholder="••••••••••••"
            />
            <p className="text-xs text-gray-500 mt-1">
              Minst 12 tecken, en siffra, en versal
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-800 mb-1">
              Bekräfta lösenord
            </label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-brand-300 rounded-box focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              placeholder="••••••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !code || !password || !confirmPassword}
            className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-box font-semibold transition-all"
          >
            {loading ? 'Återställer...' : 'Återställ lösenord'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Fick du inte koden?{' '}
            <button 
              onClick={handleResendCode}
              className="text-terracotta-600 hover:text-terracotta-700 font-semibold"
            >
              Skicka ny kod
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
