import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Info } from 'lucide-react';
import { getLegalTextsForQuestion } from '../../data/legalTexts';
import StepIndicator from '../Shared/StepIndicator';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export default function RiskFragorSteg2Slide({ onNext, formDataFromSteg1 }) {
  const navigate = useNavigate();
  const [expandedInfo, setExpandedInfo] = useState({});
  
  const [formData, setFormData] = useLocalStorage('onboarding-wizard-steg2', {
    // BLOCK A: Allmän geografisk exponering
    harUtlandskaKunder: '',
    utlandskaLander: '',
    andelOmsattning: '',
    typSamarbete: {
      import: false,
      export: false,
      konsult: false,
      licens: false,
    },
    // BLOCK B: Konkreta affärspartners
    leverantorer: [
      { namn: '', land: '' },
      { namn: '', land: '' },
      { namn: '', land: '' }
    ],
    kunder: [
      { namn: '', land: '' },
      { namn: '', land: '' },
      { namn: '', land: '' }
    ],
    kundTyp: '',
    // BLOCK C: Gränsöverskridande transaktioner
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

  const handleArrayChange = (arrayName, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const toggleInfo = (questionId) => {
    setExpandedInfo(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
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
      <div className="max-w-4xl w-full bg-white rounded-card shadow-2xl p-10">
        <h1 className="text-page-title text-brand-900 mb-2">
          Steg 2: Geografisk risk & Affärsrelationer
        </h1>
        
        {/* Step Indicator */}
        <StepIndicator currentStep={2} completedSteps={1} />

        <div className="space-y-8">
          {/* ============================================================ */}
          {/* BLOCK A: ALLMÄN GEOGRAFISK EXPONERING */}
          {/* ============================================================ */}
          <div className="border-l-4 border-brand-500 pl-4">
            <h2 className="text-section-title text-brand-800 mb-4">
              BLOCK A: Allmän geografisk exponering
            </h2>

            {/* Fråga 1: Har företaget utländska kunder? */}
            <div className="mb-6 p-4 bg-gray-50 rounded-box border border-gray-200 relative">
              {/* Info button - övre höger */}
              <button
                onClick={() => toggleInfo('blockA_question1')}
                className="absolute top-4 right-4 text-brand-600 hover:text-brand-700 transition-colors"
                title="Varför frågar vi detta?"
              >
                <Info className="w-5 h-5" />
              </button>

              <label className="block text-section-title text-brand-800 mb-2 pr-8">
                1. Har företaget utländska kunder? *
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="harUtlandskaKunder"
                    value="ja"
                    checked={formData.harUtlandskaKunder === 'ja'}
                    onChange={(e) => handleChange('harUtlandskaKunder', e.target.value)}
                    className="w-4 h-4 text-brand-600 border-brand-300 rounded focus:ring-brand-500"
                  />
                  <span className="text-sm">Ja</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="harUtlandskaKunder"
                    value="nej"
                    checked={formData.harUtlandskaKunder === 'nej'}
                    onChange={(e) => handleChange('harUtlandskaKunder', e.target.value)}
                    className="w-4 h-4 text-brand-600 border-brand-300 rounded focus:ring-brand-500"
                  />
                  <span className="text-sm">Nej</span>
                </label>
              </div>
              {formData.harUtlandskaKunder === 'ja' && (
                <input
                  type="text"
                  value={formData.utlandskaLander}
                  onChange={(e) => handleChange('utlandskaLander', e.target.value)}
                  className="mt-2 w-full px-4 py-2 border border-brand-300 rounded-box-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm focus:ring-brand-500"
                  placeholder="Vilka länder? (T.ex. Norge, Tyskland, Polen)"
                />
              )}
              
              {/* Expandable info */}
              {expandedInfo.blockA_question1 && (
                <div className="mt-4 p-3 bg-white border border-brand-300 rounded-box">
                  <p className="text-xs text-brand-700 mb-2">
                    För att bedöma geografisk risk enligt PTL 2 kap. Högriskländer enligt EU-kommissionen och FATF kräver skärpta åtgärder.
                  </p>
                  {getLegalTextsForQuestion('steg2', 'blockA_question1').map((legal, idx) => (
                    <div key={idx} className="mt-2 text-xs">
                      <p className="font-semibold text-brand-800">{legal.law}</p>
                      <p className="text-brand-600 mt-1">{legal.fullText}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Fråga 2: Omsättningsandel */}
            <div className="mb-6 p-4 bg-gray-50 rounded-box border border-gray-200 relative">
              <button
                onClick={() => toggleInfo('blockA_question2')}
                className="absolute top-4 right-4 text-brand-600 hover:text-brand-700 transition-colors"
                title="Varför frågar vi detta?"
              >
                <Info className="w-5 h-5" />
              </button>

              <label className="block text-section-title text-brand-800 mb-2 pr-8">
                2. Ungefär hur stor andel av omsättningen kommer från utländska kunder? *
              </label>
              <select
                value={formData.andelOmsattning}
                onChange={(e) => handleChange('andelOmsattning', e.target.value)}
                className="w-full px-4 py-2 border border-brand-300 rounded-box-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm focus:ring-brand-500"
              >
                <option value="">Välj...</option>
                <option value="<10%">Mindre än 10%</option>
                <option value="10-30%">10-30%</option>
                <option value="30-50%">30-50%</option>
                <option value=">50%">Över 50%</option>
              </select>

              {expandedInfo.blockA_question2 && (
                <div className="mt-4 p-3 bg-white border border-brand-300 rounded-box text-xs">
                  <p className="font-semibold text-brand-900 mb-2">Varför frågar vi detta?</p>
                  <p className="text-gray-700 mb-3">
                    För att kvantifiera geografisk exponering och avgöra om skärpta åtgärder krävs enligt PTL 3 kap. 16 §.
                  </p>
                  <div className="space-y-2">
                    {getLegalTextsForQuestion('steg2', 'blockA_question2').map((legal, idx) => (
                      <div key={idx} className="border-l-2 border-brand-400 pl-2">
                        <p className="font-bold text-gray-900">{legal.law}</p>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                          {legal.fullText}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Fråga 3: Typ av samarbete */}
            <div className="mb-6 p-4 bg-gray-50 rounded-box border border-gray-200 relative">
              <button
                onClick={() => toggleInfo('blockA_question3')}
                className="absolute top-4 right-4 text-brand-600 hover:text-brand-700 transition-colors"
                title="Varför frågar vi detta?"
              >
                <Info className="w-5 h-5" />
              </button>

              <label className="block text-section-title text-brand-800 mb-2 pr-8">
                3. Typ av internationellt samarbete
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.typSamarbete.import}
                    onChange={(e) => handleCheckboxChange('import', e.target.checked)}
                    className="w-4 h-4 text-brand-600 border-brand-300 rounded focus:ring-brand-500"
                  />
                  <span className="text-sm">Import (köper varor/tjänster från utlandet)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.typSamarbete.export}
                    onChange={(e) => handleCheckboxChange('export', e.target.checked)}
                    className="w-4 h-4 text-brand-600 border-brand-300 rounded focus:ring-brand-500"
                  />
                  <span className="text-sm">Export (säljer varor/tjänster till utlandet)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.typSamarbete.konsult}
                    onChange={(e) => handleCheckboxChange('konsult', e.target.checked)}
                    className="w-4 h-4 text-brand-600 border-brand-300 rounded focus:ring-brand-500"
                  />
                  <span className="text-sm">Konsulttjänster (svårvärderade tjänster)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.typSamarbete.licens}
                    onChange={(e) => handleCheckboxChange('licens', e.target.checked)}
                    className="w-4 h-4 text-brand-600 border-brand-300 rounded focus:ring-brand-500"
                  />
                  <span className="text-sm">Licensavtal (royaltybetalningar)</span>
                </label>
              </div>

              {expandedInfo.blockA_question3 && (
                <div className="mt-4 p-3 bg-white border border-brand-300 rounded-box text-xs">
                  <p className="font-semibold text-brand-900 mb-2">Varför frågar vi detta?</p>
                  <p className="text-gray-700 mb-3">
                    Olika typer av samarbete har olika riskprofiler. Import/Export kan innebära trade-based money laundering, konsulttjänster är svårvärderade, och licensavtal kan användas för värdeöverföring.
                  </p>
                  <div className="space-y-2">
                    {getLegalTextsForQuestion('steg2', 'blockA_question3').map((legal, idx) => (
                      <div key={idx} className="border-l-2 border-brand-400 pl-2">
                        <p className="font-bold text-gray-900">{legal.law}</p>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                          {legal.fullText}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ============================================================ */}
          {/* BLOCK B: KONKRETA AFFÄRSPARTNERS */}
          {/* ============================================================ */}
          <div className="border-l-4 border-brand-500 pl-4">
            <h2 className="text-section-title text-brand-800 mb-4">
              BLOCK B: Konkreta affärspartners (Progressiv verifikation)
            </h2>

            {/* Fråga 4: Leverantörer */}
            <div className="mb-6 p-4 bg-gray-50 rounded-box border border-gray-200 relative">
              <button
                onClick={() => toggleInfo('blockB_question4')}
                className="absolute top-4 right-4 text-brand-600 hover:text-brand-700 transition-colors"
                title="Varför frågar vi detta?"
              >
                <Info className="w-5 h-5" />
              </button>

              <label className="block text-section-title text-brand-800 mb-2 pr-8">
                4. Vilka är företagets tre största leverantörer?
              </label>
              {formData.leverantorer.map((lev, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={lev.namn}
                    onChange={(e) => handleArrayChange('leverantorer', index, 'namn', e.target.value)}
                    className="flex-1 px-4 py-2 border border-brand-300 rounded-box-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm focus:ring-brand-500"
                    placeholder={`Leverantör ${index + 1} (namn)`}
                  />
                  <input
                    type="text"
                    value={lev.land}
                    onChange={(e) => handleArrayChange('leverantorer', index, 'land', e.target.value)}
                    className="w-32 px-4 py-2 border border-brand-300 rounded-box-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm focus:ring-brand-500"
                    placeholder="Land"
                  />
                </div>
              ))}

              {expandedInfo.blockB_question4 && (
                <div className="mt-4 p-3 bg-white border border-brand-300 rounded-box text-xs">
                  <p className="font-semibold text-brand-900 mb-2">Varför frågar vi detta?</p>
                  <p className="text-gray-700 mb-3">
                    Progressiv verifikation: Jämför svar från BLOCK A med konkreta leverantörsnamn här. Leverantörer från högriskländer kan indikera förhöjd risk.
                  </p>
                  <div className="space-y-2">
                    {getLegalTextsForQuestion('steg2', 'blockB_question4').map((legal, idx) => (
                      <div key={idx} className="border-l-2 border-brand-400 pl-2">
                        <p className="font-bold text-gray-900">{legal.law}</p>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                          {legal.fullText}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Fråga 5: Kunder */}
            <div className="mb-6 p-4 bg-gray-50 rounded-box border border-gray-200 relative">
              <button
                onClick={() => toggleInfo('blockC_question5')}
                className="absolute top-4 right-4 text-brand-600 hover:text-brand-700 transition-colors"
                title="Varför frågar vi detta?"
              >
                <Info className="w-5 h-5" />
              </button>

              <label className="block text-section-title text-brand-800 mb-2 pr-8">
                5. Vilka är företagets tre största kunder? *
              </label>
              <div className="mb-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="kundTyp"
                    value="b2b"
                    checked={formData.kundTyp === 'b2b'}
                    onChange={(e) => handleChange('kundTyp', e.target.value)}
                    className="w-4 h-4 text-brand-600 border-brand-300 rounded focus:ring-brand-500"
                  />
                  <span className="text-sm">B2B (företagskunder)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="kundTyp"
                    value="b2c"
                    checked={formData.kundTyp === 'b2c'}
                    onChange={(e) => handleChange('kundTyp', e.target.value)}
                    className="w-4 h-4 text-brand-600 border-brand-300 rounded focus:ring-brand-500"
                  />
                  <span className="text-sm">B2C (privatkonsumenter)</span>
                </label>
              </div>
              {formData.kundTyp === 'b2b' && formData.kunder.map((kund, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={kund.namn}
                    onChange={(e) => handleArrayChange('kunder', index, 'namn', e.target.value)}
                    className="flex-1 px-4 py-2 border border-brand-300 rounded-box-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm focus:ring-brand-500"
                    placeholder={`Kund ${index + 1} (namn)`}
                  />
                  <input
                    type="text"
                    value={kund.land}
                    onChange={(e) => handleArrayChange('kunder', index, 'land', e.target.value)}
                    className="w-32 px-4 py-2 border border-brand-300 rounded-box-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm focus:ring-brand-500"
                    placeholder="Land"
                  />
                </div>
              ))}
              {formData.kundTyp === 'b2c' && (
                <p className="text-sm text-gray-600 italic">Ej tillämpligt för B2C</p>
              )}

              {expandedInfo.blockC_question5 && (
                <div className="mt-4 p-3 bg-white border border-brand-300 rounded-box text-xs">
                  <p className="font-semibold text-brand-900 mb-2">Varför frågar vi detta?</p>
                  <p className="text-gray-700 mb-3">
                    Samma logik som för leverantörer: Vi måste förstå era affärsrelationer och kunna förklara transaktionsmönster.
                  </p>
                  <div className="space-y-2">
                    {getLegalTextsForQuestion('steg2', 'blockC_question5').map((legal, idx) => (
                      <div key={idx} className="border-l-2 border-brand-400 pl-2">
                        <p className="font-bold text-gray-900">{legal.law}</p>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                          {legal.fullText}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ============================================================ */}
          {/* BLOCK C: GRÄNSÖVERSKRIDANDE TRANSAKTIONER */}
          {/* ============================================================ */}
          <div className="border-l-4 border-brand-500 pl-4">
            <h2 className="text-section-title text-brand-800 mb-4">
              BLOCK C: Gränsöverskridande transaktioner
            </h2>

            {/* Fråga 6: Utländska bankkonton */}
            <div className="mb-6 p-4 bg-gray-50 rounded-box border border-gray-200 relative">
              <button
                onClick={() => toggleInfo('blockC_question6')}
                className="absolute top-4 right-4 text-brand-600 hover:text-brand-700 transition-colors"
                title="Varför frågar vi detta?"
              >
                <Info className="w-5 h-5" />
              </button>

              <label className="block text-section-title text-brand-800 mb-2 pr-8">
                6. Förekommer överföringar till/från utländska bankkonton?
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="utlandskaBankkonton"
                    value="ja-regelbundet"
                    checked={formData.utlandskaBankkonton === 'ja-regelbundet'}
                    onChange={(e) => handleChange('utlandskaBankkonton', e.target.value)}
                    className="w-4 h-4 text-brand-600 border-brand-300 rounded focus:ring-brand-500"
                  />
                  <span className="text-sm">Ja, regelbundet</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="utlandskaBankkonton"
                    value="ja-ibland"
                    checked={formData.utlandskaBankkonton === 'ja-ibland'}
                    onChange={(e) => handleChange('utlandskaBankkonton', e.target.value)}
                    className="w-4 h-4 text-brand-600 border-brand-300 rounded focus:ring-brand-500"
                  />
                  <span className="text-sm">Ja, ibland</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="utlandskaBankkonton"
                    value="nej"
                    checked={formData.utlandskaBankkonton === 'nej'}
                    onChange={(e) => handleChange('utlandskaBankkonton', e.target.value)}
                    className="w-4 h-4 text-brand-600 border-brand-300 rounded focus:ring-brand-500"
                  />
                  <span className="text-sm">Nej</span>
                </label>
              </div>
              {(formData.utlandskaBankkonton === 'ja-regelbundet' || formData.utlandskaBankkonton === 'ja-ibland') && (
                <input
                  type="text"
                  value={formData.bankkontosLander}
                  onChange={(e) => handleChange('bankkontosLander', e.target.value)}
                  className="mt-2 w-full px-4 py-2 border border-brand-300 rounded-box-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm focus:ring-brand-500"
                  placeholder="Vilka länder?"
                />
              )}

              {expandedInfo.blockC_question6 && (
                <div className="mt-4 p-3 bg-white border border-brand-300 rounded-box text-xs">
                  <p className="font-semibold text-brand-900 mb-2">Varför frågar vi detta?</p>
                  <p className="text-gray-700 mb-3">
                    Transaktioner via banker i högriskländer utgör förhöjd risk och kräver skärpta åtgärder enligt PTL 3 kap. 16 §.
                  </p>
                  <div className="space-y-2">
                    {getLegalTextsForQuestion('steg2', 'blockC_question6').map((legal, idx) => (
                      <div key={idx} className="border-l-2 border-brand-400 pl-2">
                        <p className="font-bold text-gray-900">{legal.law}</p>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                          {legal.fullText}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
            Nästa
          </button>
        </div>
      </div>
    </div>
  );
}
