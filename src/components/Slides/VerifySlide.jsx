import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export default function VerifySlide({ onNext }) {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    // Ta bara sista tecknet om användaren klistrar in flera
    const newValue = value.slice(-1);
    
    if (!/^\d*$/.test(newValue)) return; // Endast siffror

    const newCode = [...code];
    newCode[index] = newValue;
    setCode(newCode);

    // Flytta fokus till nästa ruta automatiskt
    if (newValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Gå tillbaka vid Backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const digits = pastedData.match(/\d/g) || [];
    
    const newCode = [...code];
    digits.forEach((digit, index) => {
      if (index < 6) newCode[index] = digit;
    });
    setCode(newCode);

    // Fokusera på nästa tomma fält eller sista fältet
    const nextEmptyIndex = newCode.findIndex(val => !val);
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[5]?.focus();
    }
  };

  const isCodeComplete = code.every(digit => digit !== '');

  const handleVerify = async () => {
    if (!isCodeComplete) return;
    
    setError('');
    setLoading(true);

    try {
      const verificationCode = code.join('');
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          code: verificationCode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save tokens
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        
        // Call onNext or navigate based on user role
        if (data.user && data.user.role === 'admin') {
          navigate('/admin');
        } else if (onNext) {
          onNext();
        } else {
          navigate('/inledning');
        }
      } else {
        // Handle errors
        if (response.status === 400) {
          if (data.detail.includes('expired')) {
            setError('Koden har gått ut. Begär en ny kod.');
          } else if (data.detail.includes('Invalid')) {
            setError('Ogiltig kod. Kontrollera att du angett rätt kod.');
          } else {
            setError(data.detail || 'Verifiering misslyckades.');
          }
        } else {
          setError('Ett fel uppstod. Försök igen.');
        }
      }
    } catch (err) {
      setError('Nätverksfel. Kontrollera din internetanslutning.');
      console.error('Verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      setError('Email saknas. Vänligen registrera igen.');
      return;
    }

    setError('');
    setResendLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password: 'dummy', // Won't be used, just triggers new code
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setError('');
        alert('Ny kod skickad till din email!');
        // Reset code inputs
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      } else {
        setError(data.detail || 'Kunde inte skicka ny kod.');
      }
    } catch (err) {
      setError('Nätverksfel. Försök igen.');
      console.error('Resend code error:', err);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-card shadow-2xl p-10">
        <h1 className="text-page-title text-brand-900 mb-6 text-center">
          Verifiera din registrering
        </h1>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-brand-800 mb-4 text-center">
            Ange den registreringskod du fått via e-post eller SMS
          </label>
          
          <div className="flex gap-2 justify-center mb-6">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-14 text-center text-page-title border-2 border-brand-300 rounded-box focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            ))}
          </div>

          <div className="bg-brand-50 border-l-4 border-brand-500 p-4 rounded">
            <p className="text-sm text-brand-800">
              <strong>Info:</strong> Av säkerhetsskäl och på grund av problem med e-postlänkar (t.ex. Sendgrid) används nu registreringskoder istället för klickbara länkar.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-box text-red-700 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleVerify}
          disabled={!isCodeComplete || loading}
          className={`w-full px-8 py-3 rounded-box font-semibold transition-all ${
            isCodeComplete && !loading
              ? 'bg-brand-600 hover:bg-brand-700 text-white cursor-pointer'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {loading ? 'Verifierar...' : 'Verifiera kod'}
        </button>

        <div className="mt-6 text-center">
          <p className="text-sm text-brand-700 mb-2">eller</p>
          <button 
            onClick={handleResendCode}
            disabled={resendLoading}
            className="text-brand-600 hover:text-brand-700 font-semibold text-sm disabled:opacity-50"
          >
            {resendLoading ? 'Skickar...' : 'Skicka ny kod'}
          </button>
        </div>
      </div>
    </div>
  );
}
