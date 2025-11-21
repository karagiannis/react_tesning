import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, ChevronRight } from 'lucide-react';
import { getLegalTextsForQuestion, legalTexts } from '../../data/legalTexts';
import StepIndicator from '../Shared/StepIndicator';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export default function RiskFragorSteg3Slide({ onNext }) {
  const navigate = useNavigate();
  const [expandedInfo, setExpandedInfo] = useState({});
  
  const [formData, setFormData] = useLocalStorage('onboarding-wizard-steg3', {
    betalmetoder: {
      bankoverföring: false,
      kortbetalning: false,
      faktura: false,
      kontanter: false,
      kryptovaluta: false,
    },
    kontanterAndel: '',
    kontanthanteringstillstand: '',
    storaTransaktioner: '',
    tredjepartsbetalningar: '',
    utlandskaOverforingar: '',
    utlandskaLander: '',
  });

  const handleCheckboxChange = (field, checked) => {
    setFormData(prev => ({
      ...prev,
      betalmetoder: { ...prev.betalmetoder, [field]: checked }
    }));
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleInfo = (questionId) => {
    setExpandedInfo(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const handleNext = async () => {
    if (onNext) {
      onNext({ steg3: formData });
    }

    // Send data to backend via PATCH
    const token = localStorage.getItem('accessToken');
    const onboardingId = localStorage.getItem('onboardingId');

    if (token && onboardingId) {
      try {
        const response = await fetch(
          `https://celestial.se/tic-tac-toe-api/api/onboarding/risk-assessment-extended?onboarding_id=${onboardingId}`,
          {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ steg3: formData })
          }
        );

        if (!response.ok) {
          console.error('Failed to save steg3 data:', await response.text());
        }
      } catch (error) {
        console.error('Error saving steg3 data:', error);
      }
    }
    
    // Check if user is PEP or has high risk from localStorage
    const steg1Data = JSON.parse(localStorage.getItem('onboarding-wizard-steg1') || '{}');
    const isPEP = steg1Data.isPEP === true;
    
    // TODO: Calculate risk score from steg1-3 data
    // For now, go to steg4 if PEP, otherwise skip to identitetskontroll
    if (isPEP) {
      navigate('/riskfragor/steg4');
    } else {
      navigate('/identitetskontroll');
    }
  };

  const handleBack = () => {
    navigate('/riskfragor/steg2');
  };

  const showKontanterFollowUp = formData.betalmetoder.kontanter;
  const showKontanterWarning = formData.kontanterAndel && ['20-50%', '>50%'].includes(formData.kontanterAndel);

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center p-8">
      <div className="max-w-3xl w-full bg-white rounded-card shadow-2xl p-10">
        <h1 className="text-page-title text-brand-900 mb-2">
          Steg 3: Betalningsflöden & Transaktionsmönster
        </h1>
        
        {/* Step Indicator */}
        <StepIndicator currentStep={3} completedSteps={2} />

        <p className="text-sm text-brand-700 mb-6">
          PTL kräver att vi bedömer risker förknippade med olika betalningsmetoder (3 kap. 4-6 §§) och övervakar transaktionsmönster (4 kap. 1 §).
        </p>

        <div className="space-y-6">
          {/* 1. Betalmetoder */}
          <div className="p-4 bg-gray-50 rounded-box border border-gray-200 relative">
            <button
              onClick={() => toggleInfo('question1')}
              className="absolute top-4 right-4 text-brand-600 hover:text-brand-700 transition-colors"
              aria-label="Visa lagtext"
            >
              <Info className="w-5 h-5" />
            </button>

            <label className="block text-section-title text-brand-800 mb-2">
              1. Hur tar företaget betalt från kunder? *
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 rounded-box border border-brand-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.betalmetoder.bankoverföring}
                  onChange={(e) => handleCheckboxChange('bankoverföring', e.target.checked)}
                  className="w-4 h-4 text-brand-600 border-brand-300 rounded focus:ring-brand-500"
                />
                <span className="text-sm text-brand-800">Banköverföring/Swish</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-box border border-brand-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.betalmetoder.kortbetalning}
                  onChange={(e) => handleCheckboxChange('kortbetalning', e.target.checked)}
                  className="w-4 h-4 text-brand-600 border-brand-300 rounded focus:ring-brand-500"
                />
                <span className="text-sm text-brand-800">Kortbetalning</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-box border border-brand-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.betalmetoder.faktura}
                  onChange={(e) => handleCheckboxChange('faktura', e.target.checked)}
                  className="w-4 h-4 text-brand-600 border-brand-300 rounded focus:ring-brand-500"
                />
                <span className="text-sm text-brand-800">Faktura</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-box border border-brand-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.betalmetoder.kontanter}
                  onChange={(e) => handleCheckboxChange('kontanter', e.target.checked)}
                  className="w-4 h-4 text-brand-600 border-brand-300 rounded focus:ring-brand-500"
                />
                <span className="text-sm text-brand-800">Kontanter</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-box border border-brand-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.betalmetoder.kryptovaluta}
                  onChange={(e) => handleCheckboxChange('kryptovaluta', e.target.checked)}
                  className="w-4 h-4 text-brand-600 border-brand-300 rounded focus:ring-brand-500"
                />
                <span className="text-sm text-brand-800">Kryptovaluta</span>
              </label>
            </div>
            {(formData.betalmetoder.kontanter || formData.betalmetoder.kryptovaluta) && (
              <p className="text-xs text-red-600 mt-2 bg-red-50 p-2 rounded">
                ⚠️ <strong>Hög risk:</strong> Kontanter och kryptovaluta innebär ökad risk för penningtvätt
              </p>
            )}

            {expandedInfo.question1 && (
              <div className="mt-4 p-3 bg-white border border-brand-300 rounded-box text-xs space-y-2">
                {getLegalTextsForQuestion('steg3', 'question1').map((lagtext, idx) => (
                  <div key={idx}>
                    <p className="font-semibold text-brand-900">{lagtext.law}</p>
                    <p className="text-gray-700 mt-1">{lagtext.shortText}</p>
                    <p className="text-gray-500 italic mt-1">Referens: [{lagtext.id}]</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. Kontanterandel (conditional) */}
          {showKontanterFollowUp && (
            <div className="p-4 bg-gray-50 rounded-box border border-gray-200 relative">
              <button
                onClick={() => toggleInfo('question2')}
                className="absolute top-4 right-4 text-brand-600 hover:text-brand-700 transition-colors"
                aria-label="Visa lagtext"
              >
                <Info className="w-5 h-5" />
              </button>

              <label className="block text-section-title text-brand-800 mb-2">
                2. Om kontanter: Ungefär hur stor andel av omsättningen?
              </label>
              <select
                value={formData.kontanterAndel}
                onChange={(e) => handleChange('kontanterAndel', e.target.value)}
                className="w-full px-4 py-2 border border-brand-300 rounded-box-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              >
                <option value="">Välj...</option>
                <option value="<5%">Mindre än 5%</option>
                <option value="5-20%">5-20%</option>
                <option value="20-50%">20-50%</option>
                <option value=">50%">Över 50%</option>
              </select>
              
              {showKontanterWarning && (
                <div className="mt-3 bg-yellow-50 border border-yellow-300 rounded-box p-4">
                  <p className="text-sm text-yellow-800 font-medium mb-2">
                    ⚠️ {legalTexts.kontanttransaktioner.law}
                  </p>
                  <p className="text-xs text-yellow-700 mb-2">
                    {legalTexts.kontanttransaktioner.shortText}
                  </p>
                  <p className="text-xs text-yellow-600 italic mt-1">
                    Referens: [{legalTexts.kontanttransaktioner.id}] - Se Appendix för fullständig lagtext
                  </p>
                  <p className="text-xs text-yellow-700 mt-2 bg-yellow-100 p-2 rounded">
                    💡 <strong>Observera:</strong> Kontanthantering kräver särskild dokumentation för riskbedömning enligt 01FS 2024:20, 2 kap. 4 §.
                    Vi kommer att behöva fördjupad information om affärsmodellen och transaktionsmönster.
                  </p>
                </div>
              )}

              {expandedInfo.question2 && (
                <div className="mt-4 p-3 bg-white border border-brand-300 rounded-box text-xs space-y-2">
                  {getLegalTextsForQuestion('steg3', 'question2').map((lagtext, idx) => (
                    <div key={idx}>
                      <p className="font-semibold text-brand-900">{lagtext.law}</p>
                      <p className="text-gray-700 mt-1">{lagtext.shortText}</p>
                      <p className="text-gray-500 italic mt-1">Referens: [{lagtext.id}]</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. Stora transaktioner */}
          <div className="p-4 bg-gray-50 rounded-box border border-gray-200 relative">
            <button
              onClick={() => toggleInfo('question3')}
              className="absolute top-4 right-4 text-brand-600 hover:text-brand-700 transition-colors"
              aria-label="Visa lagtext"
            >
              <Info className="w-5 h-5" />
            </button>

            <label className="block text-section-title text-brand-800 mb-2">
              3. Förekommer transaktioner över 150 000 kr?
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 rounded-box border border-brand-200 cursor-pointer">
                <input
                  type="radio"
                  name="storaTransaktioner"
                  value="ja"
                  checked={formData.storaTransaktioner === 'ja'}
                  onChange={(e) => handleChange('storaTransaktioner', e.target.value)}
                  className="w-4 h-4 text-brand-600 border-brand-300 focus:ring-brand-500"
                />
                <span className="text-sm text-brand-800">Ja</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-box border border-brand-200 cursor-pointer">
                <input
                  type="radio"
                  name="storaTransaktioner"
                  value="ibland"
                  checked={formData.storaTransaktioner === 'ibland'}
                  onChange={(e) => handleChange('storaTransaktioner', e.target.value)}
                  className="w-4 h-4 text-brand-600 border-brand-300 focus:ring-brand-500"
                />
                <span className="text-sm text-brand-800">Ibland</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-box border border-brand-200 cursor-pointer">
                <input
                  type="radio"
                  name="storaTransaktioner"
                  value="nej"
                  checked={formData.storaTransaktioner === 'nej'}
                  onChange={(e) => handleChange('storaTransaktioner', e.target.value)}
                  className="w-4 h-4 text-brand-600 border-brand-300 focus:ring-brand-500"
                />
                <span className="text-sm text-brand-800">Nej</span>
              </label>
            </div>
            <p className="text-xs text-brand-600 mt-1">
              PTL kräver förstärkt kundkännedom vid stora transaktioner
            </p>

            {expandedInfo.question3 && (
              <div className="mt-4 p-3 bg-white border border-brand-300 rounded-box text-xs space-y-2">
                {getLegalTextsForQuestion('steg3', 'question3').map((lagtext, idx) => (
                  <div key={idx}>
                    <p className="font-semibold text-brand-900">{lagtext.law}</p>
                    <p className="text-gray-700 mt-1">{lagtext.shortText}</p>
                    <p className="text-gray-500 italic mt-1">Referens: [{lagtext.id}]</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 4. Tredjepartsbetalningar */}
          <div className="p-4 bg-gray-50 rounded-box border border-gray-200 relative">
            <button
              onClick={() => toggleInfo('question4')}
              className="absolute top-4 right-4 text-brand-600 hover:text-brand-700 transition-colors"
              aria-label="Visa lagtext"
            >
              <Info className="w-5 h-5" />
            </button>

            <label className="block text-section-title text-brand-800 mb-2">
              4. Tar företaget emot betalningar från tredje part?
            </label>
            <p className="text-xs text-brand-600 mb-2">
              Exempel: Kund A betalar för Kund B:s tjänst
            </p>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 rounded-box border border-brand-200 cursor-pointer">
                <input
                  type="radio"
                  name="tredjepartsbetalningar"
                  value="ja"
                  checked={formData.tredjepartsbetalningar === 'ja'}
                  onChange={(e) => handleChange('tredjepartsbetalningar', e.target.value)}
                  className="w-4 h-4 text-brand-600 border-brand-300 focus:ring-brand-500"
                />
                <span className="text-sm text-brand-800">Ja</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-box border border-brand-200 cursor-pointer">
                <input
                  type="radio"
                  name="tredjepartsbetalningar"
                  value="nej"
                  checked={formData.tredjepartsbetalningar === 'nej'}
                  onChange={(e) => handleChange('tredjepartsbetalningar', e.target.value)}
                  className="w-4 h-4 text-brand-600 border-brand-300 focus:ring-brand-500"
                />
                <span className="text-sm text-brand-800">Nej</span>
              </label>
            </div>
            {formData.tredjepartsbetalningar === 'ja' && (
              <p className="text-xs text-red-600 mt-2 bg-red-50 p-2 rounded">
                ⚠️ <strong>Högrisk:</strong> Tredjepartsbetalningar innebär ökad risk för penningtvätt
              </p>
            )}

            {expandedInfo.question4 && (
              <div className="mt-4 p-3 bg-white border border-brand-300 rounded-box text-xs space-y-2">
                {getLegalTextsForQuestion('steg3', 'question4').map((lagtext, idx) => (
                  <div key={idx}>
                    <p className="font-semibold text-brand-900">{lagtext.law}</p>
                    <p className="text-gray-700 mt-1">{lagtext.shortText}</p>
                    <p className="text-gray-500 italic mt-1">Referens: [{lagtext.id}]</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 5. Utländska överföringar */}
          <div className="p-4 bg-gray-50 rounded-box border border-gray-200 relative">
            <button
              onClick={() => toggleInfo('question5')}
              className="absolute top-4 right-4 text-brand-600 hover:text-brand-700 transition-colors"
              aria-label="Visa lagtext"
            >
              <Info className="w-5 h-5" />
            </button>

            <label className="block text-section-title text-brand-800 mb-2">
              5. Förekommer överföringar till/från utländska bankkonton?
            </label>
            <div className="space-y-2 mb-2">
              <label className="flex items-center gap-3 p-3 rounded-box border border-brand-200 cursor-pointer">
                <input
                  type="radio"
                  name="utlandskaOverforingar"
                  value="ja-regelbundet"
                  checked={formData.utlandskaOverforingar === 'ja-regelbundet'}
                  onChange={(e) => handleChange('utlandskaOverforingar', e.target.value)}
                  className="w-4 h-4 text-brand-600 border-brand-300 focus:ring-brand-500"
                />
                <span className="text-sm text-brand-800">Ja, regelbundet</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-box border border-brand-200 cursor-pointer">
                <input
                  type="radio"
                  name="utlandskaOverforingar"
                  value="ja-ibland"
                  checked={formData.utlandskaOverforingar === 'ja-ibland'}
                  onChange={(e) => handleChange('utlandskaOverforingar', e.target.value)}
                  className="w-4 h-4 text-brand-600 border-brand-300 focus:ring-brand-500"
                />
                <span className="text-sm text-brand-800">Ja, ibland</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-box border border-brand-200 cursor-pointer">
                <input
                  type="radio"
                  name="utlandskaOverforingar"
                  value="nej"
                  checked={formData.utlandskaOverforingar === 'nej'}
                  onChange={(e) => handleChange('utlandskaOverforingar', e.target.value)}
                  className="w-4 h-4 text-brand-600 border-brand-300 focus:ring-brand-500"
                />
                <span className="text-sm text-brand-800">Nej</span>
              </label>
            </div>
            {(formData.utlandskaOverforingar === 'ja-regelbundet' || formData.utlandskaOverforingar === 'ja-ibland') && (
              <div className="ml-8 mt-3 pl-4 border-l-2 border-brand-300">
                <div className="flex items-center gap-2 text-xs text-brand-600 mb-2">
                  <ChevronRight className="w-3 h-3" />
                  <span>Följdfråga</span>
                </div>
                <input
                  type="text"
                  value={formData.utlandskaLander}
                  onChange={(e) => handleChange('utlandskaLander', e.target.value)}
                  className="w-full px-4 py-2 border border-brand-300 rounded-box-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                  placeholder="Vilka länder?"
                />
              </div>
            )}

            {expandedInfo.question5 && (
              <div className="mt-4 p-3 bg-white border border-brand-300 rounded-box text-xs space-y-2">
                {getLegalTextsForQuestion('steg3', 'question5').map((lagtext, idx) => (
                  <div key={idx}>
                    <p className="font-semibold text-brand-900">{lagtext.law}</p>
                    <p className="text-gray-700 mt-1">{lagtext.shortText}</p>
                    <p className="text-gray-500 italic mt-1">Referens: [{lagtext.id}]</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={handleBack}
            className="flex-1 px-6 py-3 bg-brand-100 text-brand-800 rounded-box hover:bg-brand-200 transition-colors font-medium"
          >
            Tillbaka
          </button>
          <button
            onClick={handleNext}
            className="flex-1 px-6 py-3 bg-brand-600 text-white rounded-box hover:bg-brand-700 transition-colors font-medium"
          >
            Slutför & Nästa
          </button>
        </div>
      </div>
    </div>
  );
}
