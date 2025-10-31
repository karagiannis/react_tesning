import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StepIndicator from '../Shared/StepIndicator';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export default function RiskFragorSteg3Slide({ onNext }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useLocalStorage('onboarding-wizard-steg3', {
    aterkommandePartners: '',
    partnersLander: '',
    leverantorer: [
      { namn: '', land: '' },
      { namn: '', land: '' },
      { namn: '', land: '' },
    ],
    kunder: [
      { namn: '', land: '' },
      { namn: '', land: '' },
      { namn: '', land: '' },
    ],
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLeverantorChange = (index, field, value) => {
    const newLeverantorer = [...formData.leverantorer];
    newLeverantorer[index][field] = value;
    setFormData(prev => ({ ...prev, leverantorer: newLeverantorer }));
  };

  const handleKundChange = (index, field, value) => {
    const newKunder = [...formData.kunder];
    newKunder[index][field] = value;
    setFormData(prev => ({ ...prev, kunder: newKunder }));
  };

  const handleNext = () => {
    if (onNext) {
      onNext({ steg3: formData });
    }
    navigate('/riskfragor/steg4');
  };

  const handleBack = () => {
    navigate('/riskfragor/steg2');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center p-8">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl p-10">
        <h1 className="text-3xl font-bold text-brand-900 mb-2">
          Riskfrågor – Kunder & Affärspartners
        </h1>
        
        {/* Step Indicator */}
        <StepIndicator currentStep={3} completedSteps={2} />

        <div className="space-y-6">
          {/* 1. Återkommande affärspartners */}
          <div>
            <label className="block text-sm font-medium text-brand-800 mb-2">
              1. Har företaget återkommande affärspartners utanför Sverige?
            </label>
            <div className="space-y-2 mb-3">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="aterkommandePartners"
                  value="ja"
                  checked={formData.aterkommandePartners === 'ja'}
                  onChange={(e) => handleChange('aterkommandePartners', e.target.value)}
                  className="w-4 h-4 text-brand-600 border-brand-300 focus:ring-brand-500"
                />
                <span className="text-brand-800">Ja</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="aterkommandePartners"
                  value="nej"
                  checked={formData.aterkommandePartners === 'nej'}
                  onChange={(e) => handleChange('aterkommandePartners', e.target.value)}
                  className="w-4 h-4 text-brand-600 border-brand-300 focus:ring-brand-500"
                />
                <span className="text-brand-800">Nej</span>
              </label>
            </div>
            {formData.aterkommandePartners === 'ja' && (
              <textarea
                value={formData.partnersLander}
                onChange={(e) => handleChange('partnersLander', e.target.value)}
                className="w-full px-4 py-2 border border-brand-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                rows={2}
                placeholder="Beskriv: Vilka länder? Typ av samarbete? Ungefär hur stor andel av omsättningen?"
              />
            )}
          </div>

          {/* 2. Största leverantörer */}
          <div>
            <label className="block text-sm font-medium text-brand-800 mb-2">
              2. Vilka är företagets tre största leverantörer?
            </label>
            <p className="text-xs text-brand-600 mb-3">
              ⚠️ Leverantörer från högriskländer flaggas automatiskt
            </p>
            <div className="space-y-3">
              {formData.leverantorer.map((lev, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="text"
                    value={lev.namn}
                    onChange={(e) => handleLeverantorChange(index, 'namn', e.target.value)}
                    className="flex-1 px-4 py-2 border border-brand-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    placeholder={`Leverantör ${index + 1}`}
                  />
                  <input
                    type="text"
                    value={lev.land}
                    onChange={(e) => handleLeverantorChange(index, 'land', e.target.value)}
                    className="w-40 px-4 py-2 border border-brand-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    placeholder="Land"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 3. Största kunder (om B2B) */}
          <div>
            <label className="block text-sm font-medium text-brand-800 mb-2">
              3. Vilka är företagets tre största kunder? <span className="text-brand-500">(om B2B)</span>
            </label>
            <p className="text-xs text-brand-600 mb-3">
              Lämna tomt om ni endast har privatpersoner som kunder
            </p>
            <div className="space-y-3">
              {formData.kunder.map((kund, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="text"
                    value={kund.namn}
                    onChange={(e) => handleKundChange(index, 'namn', e.target.value)}
                    className="flex-1 px-4 py-2 border border-brand-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    placeholder={`Kund ${index + 1}`}
                  />
                  <input
                    type="text"
                    value={kund.land}
                    onChange={(e) => handleKundChange(index, 'land', e.target.value)}
                    className="w-40 px-4 py-2 border border-brand-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    placeholder="Land"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={handleBack}
            className="flex-1 px-6 py-3 bg-brand-100 text-brand-800 rounded-lg hover:bg-brand-200 transition-colors font-medium"
          >
            Tillbaka
          </button>
          <button
            onClick={handleNext}
            className="flex-1 px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium"
          >
            Nästa
          </button>
        </div>
      </div>
    </div>
  );
}
