import { useState, useRef } from 'react';

export default function VerifySlide({ onNext }) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-10">
        <h1 className="text-3xl font-bold text-brand-900 mb-6 text-center">
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
                className="w-12 h-14 text-center text-2xl font-bold border-2 border-brand-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            ))}
          </div>

          <div className="bg-brand-50 border-l-4 border-brand-500 p-4 rounded">
            <p className="text-sm text-brand-800">
              <strong>Info:</strong> Av säkerhetsskäl och på grund av problem med e-postlänkar (t.ex. Sendgrid) används nu registreringskoder istället för klickbara länkar.
            </p>
          </div>
        </div>

        <button
          onClick={onNext}
          disabled={!isCodeComplete}
          className={`w-full px-8 py-3 rounded-lg font-semibold transition-all ${
            isCodeComplete
              ? 'bg-brand-600 hover:bg-brand-700 text-white cursor-pointer'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Verifiera kod
        </button>

        <div className="mt-6 text-center">
          <p className="text-sm text-brand-700 mb-2">eller</p>
          <button className="text-brand-600 hover:text-brand-700 font-semibold text-sm">
            Skicka ny kod
          </button>
        </div>
      </div>
    </div>
  );
}
