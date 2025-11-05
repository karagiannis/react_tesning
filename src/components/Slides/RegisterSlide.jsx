import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// DEV MODE: Skip API calls and mock responses
const DEV_MODE = true;

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'; // Test key

export default function RegisterSlide({ onNext, onLogin }) {
  const navigate = useNavigate();
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({ valid: false, messages: [] });
  
  // Cloudflare Turnstile ref
  const turnstileRef = useRef(null);
  const turnstileWidgetId = useRef(null);

  // Load Cloudflare Turnstile script
  useEffect(() => {
    // Check if script already loaded
    if (window.turnstile) {
      renderTurnstile();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => renderTurnstile();
    document.body.appendChild(script);

    return () => {
      if (turnstileWidgetId.current && window.turnstile) {
        window.turnstile.remove(turnstileWidgetId.current);
      }
    };
  }, []);

  // Render Turnstile widget
  const renderTurnstile = () => {
    if (turnstileRef.current && window.turnstile) {
      // Remove existing widget if already rendered (prevents duplicates from HMR)
      if (turnstileWidgetId.current !== null) {
        try {
          window.turnstile.remove(turnstileWidgetId.current);
        } catch {
          // Widget might not exist, ignore error
        }
      }
      
      turnstileWidgetId.current = window.turnstile.render(turnstileRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: (token) => {
          setTurnstileToken(token);
          setError(''); // Clear any previous errors
        },
        'error-callback': () => {
          setError('Bot-verifiering misslyckades. Försök igen.');
        },
      });
    }
  };

  // Check for Google OAuth callback (code in URL)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    
    if (code) {
      handleGoogleCallback(code);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Validate password strength in real-time
  useEffect(() => {
    if (!password) {
      setPasswordStrength({ valid: false, messages: [] });
      return;
    }

    const messages = [];
    let valid = true;

    if (password.length < 12) {
      messages.push('Minst 12 tecken');
      valid = false;
    }
    if (!/\d/.test(password)) {
      messages.push('Minst en siffra');
      valid = false;
    }
    if (!/[A-Z]/.test(password)) {
      messages.push('Minst en versal');
      valid = false;
    }

    setPasswordStrength({ valid, messages });
  }, [password]);

  // Validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle Email/Password registration
  const handleEmailRegistration = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email || !password || !confirmPassword) {
      setError('Vänligen fyll i alla fält.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Ogiltig e-postadress.');
      return;
    }

    if (!passwordStrength.valid) {
      setError('Lösenordet uppfyller inte kraven.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Lösenorden matchar inte.');
      return;
    }

    if (!turnstileToken) {
      setError('Vänligen slutför bot-verifieringen.');
      return;
    }

    setLoading(true);

    // DEV MODE: Mock successful registration
    if (DEV_MODE) {
      setTimeout(() => {
        setLoading(false);
        // Navigate to /verify with email in state
        navigate('/verify', { state: { email } });
      }, 1000);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          turnstileToken,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success: Navigate to /verify with email in state (NOT localStorage)
        navigate('/verify', { state: { email } });
      } else {
        // Handle errors
        handleRegistrationError(response.status, data);
      }
    } catch (err) {
      setError('Nätverksfel. Kontrollera din internetanslutning.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
      // Reset Turnstile widget
      if (turnstileWidgetId.current && window.turnstile) {
        window.turnstile.reset(turnstileWidgetId.current);
      }
      setTurnstileToken('');
    }
  };

  // Handle registration errors based on status code
  const handleRegistrationError = (status, data) => {
    switch (status) {
      case 400:
        if (data.error === 'weak_password') {
          setError('Lösenordet är för svagt. Använd minst 12 tecken, en siffra och en versal.');
        } else if (data.error === 'invalid_email') {
          setError('Ogiltig e-postadress.');
        } else {
          setError('Ogiltig inmatning. Kontrollera dina uppgifter.');
        }
        break;
      case 409:
        setError(
          <>
            E-postadressen är redan registrerad.{' '}
            <button 
              onClick={onLogin}
              className="underline text-terracotta-700 hover:text-terracotta-800 font-medium"
            >
              Logga in här
            </button>
            .
          </>
        );
        break;
      case 429: {
        const retryAfter = data.retryAfter || 60;
        setError(`För många registreringsförsök. Försök igen om ${retryAfter} sekunder.`);
        break;
      }
      default:
        setError(data.message || 'Ett fel uppstod. Försök igen senare.');
    }
  };

  // Handle Google OAuth registration
  const handleGoogleRegistration = () => {
    const redirectUri = `${window.location.origin}/register`;
    const scope = 'email profile';
    
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${GOOGLE_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent(scope)}` +
      `&access_type=online`;
    
    window.location.href = googleAuthUrl;
  };

  // Handle Google OAuth callback
  const handleGoogleCallback = async (code) => {
    setLoading(true);
    setError('');

    // DEV MODE: Mock successful Google OAuth registration
    if (DEV_MODE) {
      setTimeout(() => {
        const mockAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock.google.access.token';
        const mockRefreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock.google.refresh.token';
        
        localStorage.setItem('accessToken', mockAccessToken);
        localStorage.setItem('refreshToken', mockRefreshToken);
        
        // Clean URL
        window.history.replaceState({}, document.title, '/register');
        
        setLoading(false);
        
        // Google users skip email verification
        if (onNext) {
          onNext();
        } else {
          navigate('/inledning');
        }
      }, 1000);
      return;
    }

    try {
      const redirectUri = `${window.location.origin}/register`;
      
      const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          redirectUri,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success: Save tokens to localStorage
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        
        // Clean URL (remove code parameter)
        window.history.replaceState({}, document.title, '/register');
        
        // Navigate to /inledning (Google users skip email verification)
        if (onNext) {
          onNext();
        } else {
          navigate('/inledning');
        }
      } else {
        setError(data.message || 'Google-registrering misslyckades. Försök igen.');
        // Clean URL on error too
        window.history.replaceState({}, document.title, '/register');
      }
    } catch (err) {
      setError('Nätverksfel vid Google-registrering.');
      console.error('Google OAuth error:', err);
      window.history.replaceState({}, document.title, '/register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-card shadow-2xl p-10">
        <h1 className="text-page-title text-brand-900 mb-6 text-center">
          Skapa konto
        </h1>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-box text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailRegistration} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-800 mb-1">E-post</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-brand-300 rounded-box focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              placeholder="din.email@example.com"
              disabled={loading}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-brand-800 mb-1">Lösenord</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-brand-300 rounded-box focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              placeholder="Minst 12 tecken, en siffra, en versal"
              disabled={loading}
              required
            />
            {password && passwordStrength.messages.length > 0 && (
              <div className="mt-1 text-xs text-red-600">
                Saknas: {passwordStrength.messages.join(', ')}
              </div>
            )}
            {password && passwordStrength.valid && (
              <div className="mt-1 text-xs text-green-600">
                ✓ Lösenordet uppfyller kraven
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-800 mb-1">Bekräfta lösenord</label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-brand-300 rounded-box focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              placeholder="••••••••"
              disabled={loading}
              required
            />
            {confirmPassword && password !== confirmPassword && (
              <div className="mt-1 text-xs text-red-600">
                Lösenorden matchar inte
              </div>
            )}
          </div>

          {/* Cloudflare Turnstile Widget */}
          <div className="flex justify-center py-2">
            <div ref={turnstileRef}></div>
          </div>
          <p className="text-xs text-center text-brand-600">
            Vi använder Cloudflare Turnstile för att förhindra missbruk och spam.
          </p>

          <button
            type="submit"
            disabled={loading || !turnstileToken || !passwordStrength.valid}
            className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-brand-300 disabled:cursor-not-allowed text-white px-8 py-3 rounded-box font-semibold transition-all"
          >
            {loading ? 'Skapar konto...' : 'Skapa konto'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-brand-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-brand-600 font-medium">eller</span>
          </div>
        </div>

        {/* Google OAuth Button */}
        <button
          onClick={handleGoogleRegistration}
          disabled={loading}
          className="w-full bg-white border-2 border-brand-300 hover:border-brand-400 hover:bg-brand-50 text-brand-800 px-8 py-3 rounded-box font-semibold transition-all flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Fortsätt med Google
        </button>

        <div className="mt-6 text-center">
          <p className="text-sm text-brand-700">
            Har du redan ett konto?{' '}
            <button 
              onClick={onLogin}
              className="text-brand-600 hover:text-brand-700 font-semibold"
              disabled={loading}
            >
              Logga in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}