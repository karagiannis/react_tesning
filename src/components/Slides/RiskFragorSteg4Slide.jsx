import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { legalTexts } from '../../data/legalTexts';
import StepIndicator from '../Shared/StepIndicator';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export default function RiskFragorSteg4Slide({ onNext }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useLocalStorage('onboarding-wizard-steg4', {
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

  const handleNext = () => {
    if (onNext) {
      onNext({ steg4: formData });
    }
    // Navigate to next slide (identitetskontroll based on spec)
    navigate('/identitetskontroll');
  };

  const handleBack = () => {
    navigate('/riskfragor/steg3');
  };

  const showKontanterFollowUp = formData.betalmetoder.kontanter;
  const showKontanterWarning = formData.kontanterAndel && ['20-50%', '>50%'].includes(formData.kontanterAndel);

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center p-8">
      <div className="max-w-3xl w-full bg-white rounded-card shadow-2xl p-10">
        <h1 className="text-page-title text-brand-900 mb-2">
          Riskfrågor – Betalningar & Transaktioner
        </h1>
        
        {/* Step Indicator */}
        <StepIndicator currentStep={4} completedSteps={3} />

        <div className="space-y-6">
          {/* 1. Betalmetoder */}
          <div>
            <label className="block text-sm font-medium text-brand-800 mb-2">
              1. Hur tar företaget betalt från kunder? *
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.betalmetoder.bankoverföring}
                  onChange={(e) => handleCheckboxChange('bankoverföring', e.target.checked)}
                  className="w-4 h-4 text-brand-600 border-brand-300 rounded focus:ring-brand-500"
                />
                <span className="text-brand-800">Banköverföring/Swish</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.betalmetoder.kortbetalning}
                  onChange={(e) => handleCheckboxChange('kortbetalning', e.target.checked)}
                  className="w-4 h-4 text-brand-600 border-brand-300 rounded focus:ring-brand-500"
                />
                <span className="text-brand-800">Kortbetalning</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.betalmetoder.faktura}
                  onChange={(e) => handleCheckboxChange('faktura', e.target.checked)}
                  className="w-4 h-4 text-brand-600 border-brand-300 rounded focus:ring-brand-500"
                />
                <span className="text-brand-800">Faktura</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.betalmetoder.kontanter}
                  onChange={(e) => handleCheckboxChange('kontanter', e.target.checked)}
                  className="w-4 h-4 text-brand-600 border-brand-300 rounded focus:ring-brand-500"
                />
                <span className="text-brand-800">Kontanter</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.betalmetoder.kryptovaluta}
                  onChange={(e) => handleCheckboxChange('kryptovaluta', e.target.checked)}
                  className="w-4 h-4 text-brand-600 border-brand-300 rounded focus:ring-brand-500"
                />
                <span className="text-brand-800">Kryptovaluta</span>
              </label>
            </div>
            {(formData.betalmetoder.kontanter || formData.betalmetoder.kryptovaluta) && (
              <p className="text-xs text-red-600 mt-2 bg-red-50 p-2 rounded">
                ⚠️ <strong>Hög risk:</strong> Kontanter och kryptovaluta innebär ökad risk för penningtvätt
              </p>
            )}
          </div>

          {/* 2. Kontanterandel (conditional) */}
          {showKontanterFollowUp && (
            <div>
              <label className="block text-sm font-medium text-brand-800 mb-2">
                2. Om kontanter: Ungefär hur stor andel av omsättningen?
              </label>
              <select
                value={formData.kontanterAndel}
                onChange={(e) => handleChange('kontanterAndel', e.target.value)}
                className="w-full px-4 py-2 border border-brand-300 rounded-box focus:ring-2 focus:ring-brand-500 focus:border-transparent"
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
            </div>
          )}

          {/* 3. Stora transaktioner */}
          <div>
            <label className="block text-sm font-medium text-brand-800 mb-2">
              3. Förekommer transaktioner över 150 000 kr?
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="storaTransaktioner"
                  value="ja"
                  checked={formData.storaTransaktioner === 'ja'}
                  onChange={(e) => handleChange('storaTransaktioner', e.target.value)}
                  className="w-4 h-4 text-brand-600 border-brand-300 focus:ring-brand-500"
                />
                <span className="text-brand-800">Ja</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="storaTransaktioner"
                  value="ibland"
                  checked={formData.storaTransaktioner === 'ibland'}
                  onChange={(e) => handleChange('storaTransaktioner', e.target.value)}
                  className="w-4 h-4 text-brand-600 border-brand-300 focus:ring-brand-500"
                />
                <span className="text-brand-800">Ibland</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="storaTransaktioner"
                  value="nej"
                  checked={formData.storaTransaktioner === 'nej'}
                  onChange={(e) => handleChange('storaTransaktioner', e.target.value)}
                  className="w-4 h-4 text-brand-600 border-brand-300 focus:ring-brand-500"
                />
                <span className="text-brand-800">Nej</span>
              </label>
            </div>
            <p className="text-xs text-brand-600 mt-1">
              PTL kräver förstärkt kundkännedom vid stora transaktioner
            </p>
          </div>

          {/* 4. Tredjepartsbetalningar */}
          <div>
            <label className="block text-sm font-medium text-brand-800 mb-2">
              4. Tar företaget emot betalningar från tredje part?
            </label>
            <p className="text-xs text-brand-600 mb-2">
              Exempel: Kund A betalar för Kund B:s tjänst
            </p>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="tredjepartsbetalningar"
                  value="ja"
                  checked={formData.tredjepartsbetalningar === 'ja'}
                  onChange={(e) => handleChange('tredjepartsbetalningar', e.target.value)}
                  className="w-4 h-4 text-brand-600 border-brand-300 focus:ring-brand-500"
                />
                <span className="text-brand-800">Ja</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="tredjepartsbetalningar"
                  value="nej"
                  checked={formData.tredjepartsbetalningar === 'nej'}
                  onChange={(e) => handleChange('tredjepartsbetalningar', e.target.value)}
                  className="w-4 h-4 text-brand-600 border-brand-300 focus:ring-brand-500"
                />
                <span className="text-brand-800">Nej</span>
              </label>
            </div>
            {formData.tredjepartsbetalningar === 'ja' && (
              <p className="text-xs text-red-600 mt-2 bg-red-50 p-2 rounded">
                ⚠️ <strong>Högrisk:</strong> Tredjepartsbetalningar innebär ökad risk för penningtvätt
              </p>
            )}
          </div>

          {/* 5. Utländska överföringar */}
          <div>
            <label className="block text-sm font-medium text-brand-800 mb-2">
              5. Förekommer överföringar till/från utländska bankkonton?
            </label>
            <div className="space-y-2 mb-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="utlandskaOverforingar"
                  value="ja-regelbundet"
                  checked={formData.utlandskaOverforingar === 'ja-regelbundet'}
                  onChange={(e) => handleChange('utlandskaOverforingar', e.target.value)}
                  className="w-4 h-4 text-brand-600 border-brand-300 focus:ring-brand-500"
                />
                <span className="text-brand-800">Ja, regelbundet</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="utlandskaOverforingar"
                  value="ja-ibland"
                  checked={formData.utlandskaOverforingar === 'ja-ibland'}
                  onChange={(e) => handleChange('utlandskaOverforingar', e.target.value)}
                  className="w-4 h-4 text-brand-600 border-brand-300 focus:ring-brand-500"
                />
                <span className="text-brand-800">Ja, ibland</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="utlandskaOverforingar"
                  value="nej"
                  checked={formData.utlandskaOverforingar === 'nej'}
                  onChange={(e) => handleChange('utlandskaOverforingar', e.target.value)}
                  className="w-4 h-4 text-brand-600 border-brand-300 focus:ring-brand-500"
                />
                <span className="text-brand-800">Nej</span>
              </label>
            </div>
            {(formData.utlandskaOverforingar === 'ja-regelbundet' || formData.utlandskaOverforingar === 'ja-ibland') && (
              <input
                type="text"
                value={formData.utlandskaLander}
                onChange={(e) => handleChange('utlandskaLander', e.target.value)}
                className="w-full px-4 py-2 border border-brand-300 rounded-box focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                placeholder="Vilka länder?"
              />
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
