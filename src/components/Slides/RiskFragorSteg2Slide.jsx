import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RiskFragorSteg2Slide({ onNext, formDataFromSteg1 }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    lander: '',
    typSamarbete: {
      import: false,
      export: false,
      konsult: false,
      licens: false,
    },
    andelOmsattning: '',
    utlandskValuta: '',
    valutor: '',
    utlandskaBankkonton: '',
    bankkontosLander: '',
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field, checked) => {
    setFormData(prev => ({
      ...prev,
      typSamarbete: { ...prev.typSamarbete, [field]: checked }
    }));
  };

  const handleNext = () => {
    if (onNext) {
      onNext({ steg2: formData });
    }
    navigate('/riskfragor/steg3');
  };

  const handleBack = () => {
    navigate('/riskfragor');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center p-8">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl p-10">
        {/* Progress indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-brand-600"></div>
            <div className="w-3 h-3 rounded-full bg-brand-600"></div>
            <div className="w-3 h-3 rounded-full bg-brand-300"></div>
            <div className="w-3 h-3 rounded-full bg-brand-300"></div>
          </div>
          <p className="text-center text-sm text-brand-600 font-medium">Steg 2 av 4</p>
        </div>

        <h1 className="text-3xl font-bold text-brand-900 mb-6">
          Riskfrågor – Utländska transaktioner
        </h1>

        <div className="space-y-6">
          {/* 1. Vilka länder */}
          <div>
            <label className="block text-sm font-medium text-brand-800 mb-2">
              1. Vilka länder har företaget affärspartners/kunder i? *
            </label>
            <textarea
              value={formData.lander}
              onChange={(e) => handleChange('lander', e.target.value)}
              className="w-full px-4 py-2 border border-brand-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              rows={2}
              placeholder="T.ex. Norge, Tyskland, Polen..."
            />
            <p className="text-xs text-brand-600 mt-1">
              ⚠️ Högriskländer enligt FATF-listan flaggas automatiskt
            </p>
          </div>

          {/* 2. Typ av samarbete */}
          <div>
            <label className="block text-sm font-medium text-brand-800 mb-2">
              2. Typ av samarbete
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.typSamarbete.import}
                  onChange={(e) => handleCheckboxChange('import', e.target.checked)}
                  className="w-4 h-4 text-brand-600 border-brand-300 rounded focus:ring-brand-500"
                />
                <span className="text-brand-800">Import</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.typSamarbete.export}
                  onChange={(e) => handleCheckboxChange('export', e.target.checked)}
                  className="w-4 h-4 text-brand-600 border-brand-300 rounded focus:ring-brand-500"
                />
                <span className="text-brand-800">Export</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.typSamarbete.konsult}
                  onChange={(e) => handleCheckboxChange('konsult', e.target.checked)}
                  className="w-4 h-4 text-brand-600 border-brand-300 rounded focus:ring-brand-500"
                />
                <span className="text-brand-800">Konsulttjänster</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.typSamarbete.licens}
                  onChange={(e) => handleCheckboxChange('licens', e.target.checked)}
                  className="w-4 h-4 text-brand-600 border-brand-300 rounded focus:ring-brand-500"
                />
                <span className="text-brand-800">Licensavtal</span>
              </label>
            </div>
          </div>

          {/* 3. Andel omsättning från utland */}
          <div>
            <label className="block text-sm font-medium text-brand-800 mb-2">
              3. Ungefär hur stor andel av omsättningen kommer från utländska kunder? *
            </label>
            <select
              value={formData.andelOmsattning}
              onChange={(e) => handleChange('andelOmsattning', e.target.value)}
              className="w-full px-4 py-2 border border-brand-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            >
              <option value="">Välj...</option>
              <option value="<10%">Mindre än 10%</option>
              <option value="10-30%">10-30%</option>
              <option value="30-50%">30-50%</option>
              <option value=">50%">Över 50%</option>
            </select>
            <p className="text-xs text-brand-600 mt-1">
              ⚠️ Över 50% från högriskländer kräver Enhanced Due Diligence (EDD)
            </p>
          </div>

          {/* 4. Betalningar i utländsk valuta */}
          <div>
            <label className="block text-sm font-medium text-brand-800 mb-2">
              4. Tar företaget emot betalningar i utländsk valuta?
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="utlandskValuta"
                  value="ja"
                  checked={formData.utlandskValuta === 'ja'}
                  onChange={(e) => handleChange('utlandskValuta', e.target.value)}
                  className="w-4 h-4 text-brand-600 border-brand-300 focus:ring-brand-500"
                />
                <span className="text-brand-800">Ja</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="utlandskValuta"
                  value="nej"
                  checked={formData.utlandskValuta === 'nej'}
                  onChange={(e) => handleChange('utlandskValuta', e.target.value)}
                  className="w-4 h-4 text-brand-600 border-brand-300 focus:ring-brand-500"
                />
                <span className="text-brand-800">Nej</span>
              </label>
            </div>
            {formData.utlandskValuta === 'ja' && (
              <input
                type="text"
                value={formData.valutor}
                onChange={(e) => handleChange('valutor', e.target.value)}
                className="mt-2 w-full px-4 py-2 border border-brand-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                placeholder="Vilka valutor? (t.ex. EUR, USD, GBP)"
              />
            )}
          </div>

          {/* 5. Utländska bankkonton */}
          <div>
            <label className="block text-sm font-medium text-brand-800 mb-2">
              5. Förekommer överföringar till/från utländska bankkonton?
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="utlandskaBankkonton"
                  value="ja-regelbundet"
                  checked={formData.utlandskaBankkonton === 'ja-regelbundet'}
                  onChange={(e) => handleChange('utlandskaBankkonton', e.target.value)}
                  className="w-4 h-4 text-brand-600 border-brand-300 focus:ring-brand-500"
                />
                <span className="text-brand-800">Ja, regelbundet</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="utlandskaBankkonton"
                  value="ja-ibland"
                  checked={formData.utlandskaBankkonton === 'ja-ibland'}
                  onChange={(e) => handleChange('utlandskaBankkonton', e.target.value)}
                  className="w-4 h-4 text-brand-600 border-brand-300 focus:ring-brand-500"
                />
                <span className="text-brand-800">Ja, ibland</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="utlandskaBankkonton"
                  value="nej"
                  checked={formData.utlandskaBankkonton === 'nej'}
                  onChange={(e) => handleChange('utlandskaBankkonton', e.target.value)}
                  className="w-4 h-4 text-brand-600 border-brand-300 focus:ring-brand-500"
                />
                <span className="text-brand-800">Nej</span>
              </label>
            </div>
            {(formData.utlandskaBankkonton === 'ja-regelbundet' || formData.utlandskaBankkonton === 'ja-ibland') && (
              <input
                type="text"
                value={formData.bankkontosLander}
                onChange={(e) => handleChange('bankkontosLander', e.target.value)}
                className="mt-2 w-full px-4 py-2 border border-brand-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                placeholder="Vilka länder?"
              />
            )}
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
