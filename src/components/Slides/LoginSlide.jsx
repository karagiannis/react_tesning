import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// DEV MODE: Set to false to use real API calls (required for debugging)
const DEV_MODE = false;

// DEV MODE: Bypass Turnstile i development
const SKIP_TURNSTILE = import.meta.env.DEV;

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'; // Cloudflare test key

export default function LoginSlide({ onNext, onRegister }) {
  const navigate = useNavigate();
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  
  // Cloudflare Turnstile ref
  const turnstileRef = useRef(null);
  const turnstileWidgetId = useRef(null);

  // NOTE: Vi rensar INTE auth state här längre!
  // Om användaren har en giltig token borde de inte komma till login-sidan alls
  // (App.jsx ProtectedRoute hanterar redirect)
  // Tidigare rensades accessToken/refreshToken här, vilket orsakade buggar
  // där inloggade användare fick sina tokens raderade vid page reload.
  // useEffect(() => {
  //   console.log('🧹 LoginSlide mounted - clearing old auth state');
  //   localStorage.removeItem('accessToken');
  //   localStorage.removeItem('refreshToken');
  // }, []);

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

  // Handle Email/Password login
  const handleEmailPasswordLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Vänligen fyll i både e-post och lösenord.');
      return;
    }

    if (!turnstileToken && !SKIP_TURNSTILE) {
      setError('Vänligen slutför bot-verifieringen.');
      return;
    }

    // Clear old onboarding data before login
    localStorage.removeItem('onboarding_id');
    localStorage.removeItem('onboarding-wizard-steg1');
    localStorage.removeItem('uppdragsval-services');

    setLoading(true);    // DEV MODE: Mock successful login
    if (DEV_MODE) {
      setTimeout(() => {
        // Mock JWT tokens
        const mockAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock.access.token';
        const mockRefreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock.refresh.token';
        
        localStorage.setItem('accessToken', mockAccessToken);
        localStorage.setItem('refreshToken', mockRefreshToken);
        
        setLoading(false);
        
        // Navigate to /inledning
        if (onNext) {
          onNext();
        } else {
          navigate('/inledning');
        }
      }, 1000); // Simulate network delay
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/email-password-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          turnstile_token: turnstileToken,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success: Save tokens to localStorage
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        
        // 🆕 Save temp_case_id for new onboarding session
        if (data.tempCaseId) {
          localStorage.setItem('temp_case_id', data.tempCaseId);
          console.log('🆕 Temp case ID saved:', data.tempCaseId);
        }
        
        // Navigate based on user role
        if (data.user && data.user.role === 'admin') {
          navigate('/admin');
        } else if (onNext) {
          onNext();
        } else {
          navigate('/inledning');
        }
      } else {
        // Handle errors
        handleLoginError(response.status, data);
      }
    } catch (err) {
      setError('Nätverksfel. Kontrollera din internetanslutning.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
      // Reset Turnstile widget
      if (turnstileWidgetId.current && window.turnstile) {
        window.turnstile.reset(turnstileWidgetId.current);
      }
      setTurnstileToken('');
    }
  };

  // Handle login errors based on status code
  const handleLoginError = (status, data) => {
    switch (status) {
      case 400:
        setError('Ogiltig inmatning. Kontrollera e-post och lösenord.');
        break;
      case 401:
        setError('Fel e-post eller lösenord.');
        break;
      case 403: {
        if (data.error === 'unverified_email') {
          setError(
            <>
              Din e-post är inte verifierad.{' '}
              <a 
                href="/verify" 
                className="underline text-terracotta-700 hover:text-terracotta-800"
              >
                Verifiera din e-post här
              </a>
              .
            </>
          );
        } else {
          setError('Åtkomst nekad.');
        }
        break;
      }
      case 429: {
        const retryAfter = data.retryAfter || 60;
        setError(`För många inloggningsförsök. Försök igen om ${retryAfter} sekunder.`);
        break;
      }
      default:
        setError(data.message || 'Ett fel uppstod. Försök igen senare.');
    }
  };

  // Handle Google OAuth login
  const handleGoogleLogin = () => {
    const redirectUri = `${window.location.origin}/login`;
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
    // Clear old onboarding data before Google OAuth login
    localStorage.removeItem('onboarding_id');
    localStorage.removeItem('onboarding-wizard-steg1');
    localStorage.removeItem('uppdragsval-services');

    setLoading(true);
    setError('');

    // DEV MODE: Mock successful Google OAuth
    if (DEV_MODE) {
      setTimeout(() => {
        const mockAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock.google.access.token';
        const mockRefreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock.google.refresh.token';
        
        localStorage.setItem('accessToken', mockAccessToken);
        localStorage.setItem('refreshToken', mockRefreshToken);
        
        // Clean URL
        window.history.replaceState({}, document.title, '/login');
        
        setLoading(false);
        
        if (onNext) {
          onNext();
        } else {
          navigate('/inledning');
        }
      }, 1000);
      return;
    }

    try {
      const redirectUri = `${window.location.origin}/login`;
      
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
        
        // 🆕 Save temp_case_id for new onboarding session
        if (data.tempCaseId) {
          localStorage.setItem('temp_case_id', data.tempCaseId);
          console.log('🆕 Google OAuth: Temp case ID saved:', data.tempCaseId);
        }
        
        // Clean URL (remove code parameter)
        window.history.replaceState({}, document.title, '/login');
        
        // Navigate based on user role
        if (data.user && data.user.role === 'admin') {
          navigate('/admin');
        } else if (onNext) {
          onNext();
        } else {
          navigate('/inledning');
        }
      } else {
        setError(data.message || 'Google-inloggning misslyckades. Försök igen.');
        // Clean URL on error too
        window.history.replaceState({}, document.title, '/login');
      }
    } catch (err) {
      setError('Nätverksfel vid Google-inloggning.');
      console.error('Google OAuth error:', err);
      window.history.replaceState({}, document.title, '/login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-card shadow-2xl p-10">
        <h1 className="text-page-title text-brand-900 mb-6 text-center">
          Logga in
        </h1>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-box text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailPasswordLogin} className="space-y-4">
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
              placeholder="••••••••"
              disabled={loading}
              required
            />
            <div className="mt-2 text-right">
              <a 
                href="/forgot-password" 
                className="text-sm text-terracotta-600 hover:text-terracotta-700 font-semibold"
              >
                Glömt lösenord?
              </a>
            </div>
          </div>

          {/* Cloudflare Turnstile Widget - hidden in dev mode */}
          {!SKIP_TURNSTILE && (
            <div className="flex justify-center py-2">
              <div ref={turnstileRef}></div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email || !password || (!turnstileToken && !SKIP_TURNSTILE)}
            className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-brand-300 disabled:cursor-not-allowed text-white px-8 py-3 rounded-box font-semibold transition-all"
          >
            {loading ? 'Loggar in...' : 'Logga in'}
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
          onClick={handleGoogleLogin}
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
            Har du inget konto?{' '}
            <button 
              onClick={onRegister}
              className="text-brand-600 hover:text-brand-700 font-semibold"
              disabled={loading}
            >
              Registrera
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}