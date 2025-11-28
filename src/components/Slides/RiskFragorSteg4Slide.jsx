import { useState } from 'react';
import { fetchWithAuth } from '../../utils/auth';
import { useParams, useNavigate } from 'react-router-dom';
import { Info, ChevronRight } from 'lucide-react';
import { getLegalTextsForQuestion, legalTexts } from '../../data/legalTexts';
import StepIndicator from '../Shared/StepIndicator';
import useQuestionnaireForm from '../../hooks/useQuestionnaireForm';

// BRUTE FORCE CONFIG
const QUESTIONS_CONFIG = {
  entireForm: { type: 'object', required: false }
};

export default function RiskFragorSteg4Slide({ onNext }) {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [expandedInfo, setExpandedInfo] = useState({});
  
  const {
    formData: hookFormData,
    updateQuestion,
    isLoading: syncLoading,
    syncStatus,
    pushToServer
  } = useQuestionnaireForm(
    'riskfragor_steg4',
    QUESTIONS_CONFIG
  );

  const formData = hookFormData.entireForm || {
    medelsUrsprung: '',
    förväntadOmsättning: '',
    affärsförbindelseSyfte: '',
    pepRoll: '',
    pepLand: '',
    pepTidPeriod: '',
    politiskaKopplingar: '',
    mediaExponering: '',
    familjemedlemmarPEP: false,
    familjemedlemmarDetaljer: '',
    källorTillFörmögenhet: '',
    dokumentation: {
      inkomstdeklarationer: false,
      årsredovisningar: false,
      kontrakt: false,
      bankutdrag: false,
      annat: false,
      annatBeskrivning: ''
    }
  };

  const setFormData = (updater) => {
    const newData = typeof updater === 'function' ? updater(formData) : updater;
    updateQuestion('entireForm', newData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDokumentationChange = (field, checked) => {
    setFormData(prev => ({
      ...prev,
      dokumentation: { ...prev.dokumentation, [field]: checked }
    }));
  };

  const toggleInfo = (questionId) => {
    setExpandedInfo(prev => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const handleNext = async () => {
    // Push to server with version control
    await pushToServer();
    
    if (onNext) {
      onNext({ steg4: formData });
    }

    // Send data to backend via PATCH
const onboardingId = localStorage.getItem('onboardingId');

    if (token && onboardingId) {
      try {
        const response = await fetchWithAuth(
          `https://celestial.se/tic-tac-toe-api/api/onboarding/risk-assessment-extended?onboarding_id=${onboardingId}`,
          {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'
            },
            body: JSON.stringify({ steg4: formData })
          }
        );

        if (!response.ok) {
          console.error('Failed to save steg4 data:', await response.text());
        }
      } catch (error) {
        console.error('Error saving steg4 data:', error);
      }
    }

    // Navigate to next slide (identitetskontroll based on spec)
    navigate('/identitetskontroll');
  };

  const handleBack = () => {
    navigate(`/riskfragor/steg3/${companyId}/${caseId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center p-8">
      <div className="max-w-3xl w-full bg-white rounded-card shadow-2xl p-10">
        <h1 className="text-page-title text-brand-900 mb-2">
          Fördjupad Kundkännedom (EDD)
        </h1>
        <p className="text-sm text-brand-600 mb-4">
          För kunder som är PEP eller har hög riskprofil krävs fördjupad kontroll enligt PML 3 kap. 16-17 §§
        </p>
        
        {/* Step Indicator */}
        <StepIndicator currentStep={4} completedSteps={3} />

        <div className="space-y-6">
          {/* 1. Ekonomiska medels ursprung */}
          <div className="p-4 bg-gray-50 rounded-box border border-gray-200 relative">
            <button
              onClick={() => toggleInfo('question1')}
              className="absolute top-4 right-4 text-brand-600 hover:text-brand-700 transition-colors"
              title="Varför frågar vi detta?"
            >
              <Info className="w-5 h-5" />
            </button>

            <label className="block text-section-title text-brand-800 mb-2 pr-8">
              1. Vad är ursprunget till företagets ekonomiska medel? *
            </label>
            <p className="text-xs text-brand-600 mb-2">
              Beskriv varifrån företagets startkapital och löpande intäkter kommer
            </p>
            <textarea
              value={formData.medelsUrsprung}
              onChange={(e) => handleChange('medelsUrsprung', e.target.value)}
              className="w-full px-4 py-2 border border-brand-300 rounded-box-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
              rows={4}
              placeholder="T.ex. 'Egenfinansiering från grundare, lån från bank, investeringar från änglar...'"
            />

            {expandedInfo.question1 && (
              <div className="mt-4 p-3 bg-white border border-brand-300 rounded-box text-xs space-y-2">
                <p className="font-semibold text-brand-900">PML 3 kap. 16 § - Skärpta åtgärder</p>
                <p className="text-gray-700">Fördjupad kontroll av kundens ekonomiska situation och ekonomiska medel genom inhämtning av information från flera tillförlitliga och oberoende källor.</p>
              </div>
            )}
          </div>

          {/* 2. Förväntad omsättning */}
          <div className="p-4 bg-gray-50 rounded-box border border-gray-200 relative">
            <button
              onClick={() => toggleInfo('question2')}
              className="absolute top-4 right-4 text-brand-600 hover:text-brand-700 transition-colors"
              title="Varför frågar vi detta?"
            >
              <Info className="w-5 h-5" />
            </button>

            <label className="block text-section-title text-brand-800 mb-2 pr-8">
              2. Vad är förväntad årlig omsättning? *
            </label>
            <select
              value={formData.förväntadOmsättning}
              onChange={(e) => handleChange('förväntadOmsättning', e.target.value)}
              className="w-full px-4 py-2 border border-brand-300 rounded-box-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
            >
              <option value="">Välj intervall...</option>
              <option value="0-500k">0-500 000 kr</option>
              <option value="500k-2M">500 000 - 2 miljoner kr</option>
              <option value="2M-10M">2-10 miljoner kr</option>
              <option value="10M+">Över 10 miljoner kr</option>
            </select>

            {expandedInfo.question2 && (
              <div className="mt-4 p-3 bg-white border border-brand-300 rounded-box text-xs space-y-2">
                <p className="font-semibold text-brand-900">01FS 2024:20, 2 kap. 6 § punkt 2</p>
                <p className="text-gray-700">Inhämta ytterligare information om affärsförbindelsens avsedda syfte och art genom att ställa fler frågor till kunden och kontrollera svaren.</p>
              </div>
            )}
          </div>

          {/* 3. Affärsförbindelsens syfte */}
          <div className="p-4 bg-gray-50 rounded-box border border-gray-200 relative">
            <button
              onClick={() => toggleInfo('question3')}
              className="absolute top-4 right-4 text-brand-600 hover:text-brand-700 transition-colors"
              title="Varför frågar vi detta?"
            >
              <Info className="w-5 h-5" />
            </button>

            <label className="block text-section-title text-brand-800 mb-2 pr-8">
              3. Beskriv syftet med affärsförbindelsen med Celestial *
            </label>
            <p className="text-xs text-brand-600 mb-2">
              Varför behöver företaget en redovisningsbyrå just nu?
            </p>
            <textarea
              value={formData.affärsförbindelseSyfte}
              onChange={(e) => handleChange('affärsförbindelseSyfte', e.target.value)}
              className="w-full px-4 py-2 border border-brand-300 rounded-box-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
              rows={3}
              placeholder="T.ex. 'Löpande bokföring, årsredovisning, rådgivning...'"
            />

            {expandedInfo.question3 && (
              <div className="mt-4 p-3 bg-white border border-brand-300 rounded-box text-xs space-y-2">
                <p className="font-semibold text-brand-900">PML 2 kap. 6 § punkt 3</p>
                <p className="text-gray-700">Kontrollera och dokumentera affärsförbindelsens eller den enstaka transaktionens avsedda syfte och art.</p>
              </div>
            )}
          </div>

          {/* 4. PEP-roll (om PEP) */}
          <div className="p-4 bg-brand-50 border-l-4 border-brand-500 rounded-box">
            <h3 className="text-section-title text-brand-900 mb-3">PEP-specifika frågor</h3>
            <p className="text-xs text-brand-700 mb-4">
              Eftersom kunden är PEP eller har hög riskprofil behöver vi extra information
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-section-title text-brand-800 mb-2">
                  4a. Beskriv den politiskt utsatta rollen *
                </label>
                <textarea
                  value={formData.pepRoll}
                  onChange={(e) => handleChange('pepRoll', e.target.value)}
                  className="w-full px-4 py-2 border border-brand-300 rounded-box-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                  rows={3}
                  placeholder="T.ex. 'Tidigare kommunalråd i X kommun', 'Styrelseledamot i statligt bolag'..."
                />
              </div>

              <div>
                <label className="block text-section-title text-brand-800 mb-2">
                  4b. I vilket land hade personen denna roll? *
                </label>
                <input
                  type="text"
                  value={formData.pepLand}
                  onChange={(e) => handleChange('pepLand', e.target.value)}
                  className="w-full px-4 py-2 border border-brand-300 rounded-box-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                  placeholder="Land"
                />
              </div>

              <div>
                <label className="block text-section-title text-brand-800 mb-2">
                  4c. Tidsperiod för rollen *
                </label>
                <input
                  type="text"
                  value={formData.pepTidPeriod}
                  onChange={(e) => handleChange('pepTidPeriod', e.target.value)}
                  className="w-full px-4 py-2 border border-brand-300 rounded-box-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                  placeholder="T.ex. '2015-2019' eller 'Pågående'"
                />
              </div>
            </div>
          </div>

          {/* 5. Politiska kopplingar */}
          <div className="p-4 bg-gray-50 rounded-box border border-gray-200 relative">
            <button
              onClick={() => toggleInfo('question5')}
              className="absolute top-4 right-4 text-brand-600 hover:text-brand-700 transition-colors"
              title="Varför frågar vi detta?"
            >
              <Info className="w-5 h-5" />
            </button>

            <label className="block text-section-title text-brand-800 mb-2 pr-8">
              5. Finns några pågående eller tidigare politiska kopplingar i verksamheten? *
            </label>
            <textarea
              value={formData.politiskaKopplingar}
              onChange={(e) => handleChange('politiskaKopplingar', e.target.value)}
              className="w-full px-4 py-2 border border-brand-300 rounded-box-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
              rows={3}
              placeholder="Beskriv eventuella kopplingar till politiska organisationer, statliga kontrakt, etc."
            />

            {expandedInfo.question5 && (
              <div className="mt-4 p-3 bg-white border border-brand-300 rounded-box text-xs space-y-2">
                <p className="font-semibold text-brand-900">PML 2 kap. 5 § - Verklig huvudman</p>
                <p className="text-gray-700">Särskild kontroll krävs för att identifiera och verifiera verklig huvudman och politiska kopplingar.</p>
              </div>
            )}
          </div>

          {/* 6. Mediaexponering */}
          <div className="p-4 bg-gray-50 rounded-box border border-gray-200 relative">
            <button
              onClick={() => toggleInfo('question6')}
              className="absolute top-4 right-4 text-brand-600 hover:text-brand-700 transition-colors"
              title="Varför frågar vi detta?"
            >
              <Info className="w-5 h-5" />
            </button>

            <label className="block text-section-title text-brand-800 mb-2 pr-8">
              6. Har företaget eller dess representanter haft negativ mediaexponering? *
            </label>
            <p className="text-xs text-brand-600 mb-2">
              T.ex. utredningar, skandaler, juridiska tvister
            </p>
            <textarea
              value={formData.mediaExponering}
              onChange={(e) => handleChange('mediaExponering', e.target.value)}
              className="w-full px-4 py-2 border border-brand-300 rounded-box-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
              rows={3}
              placeholder="Ange 'Nej' om ingen exponering, annars beskriv"
            />

            {expandedInfo.question6 && (
              <div className="mt-4 p-3 bg-white border border-brand-300 rounded-box text-xs space-y-2">
                <p className="font-semibold text-brand-900">01FS 2024:20, 2 kap. 6 § punkt 1</p>
                <p className="text-gray-700">Inhämta information om kunden och kundens historik från flera tillförlitliga och oberoende källor, inklusive media.</p>
              </div>
            )}
          </div>

          {/* 7. Familjemedlemmar som är PEP */}
          <div className="p-4 bg-gray-50 rounded-box border border-gray-200 relative">
            <label className="block text-section-title text-brand-800 mb-3">
              7. Är någon familjemedlem eller nära affärspartner också PEP? *
            </label>
            <label className="flex items-center gap-3 p-3 rounded-box border border-brand-100 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.familjemedlemmarPEP}
                onChange={(e) => handleChange('familjemedlemmarPEP', e.target.checked)}
                className="w-4 h-4 text-brand-600 border-brand-300 rounded focus:ring-brand-500"
              />
              <span className="text-sm text-brand-800">Ja, det finns familjemedlemmar eller nära partners som är PEP</span>
            </label>

            {formData.familjemedlemmarPEP && (
              <div className="ml-8 mt-3 pl-4 border-l-2 border-brand-300">
                <div className="flex items-center gap-2 text-xs text-brand-600 mb-2">
                  <ChevronRight className="w-3 h-3" />
                  <span>Följdfråga</span>
                </div>
                <textarea
                  value={formData.familjemedlemmarDetaljer}
                  onChange={(e) => handleChange('familjemedlemmarDetaljer', e.target.value)}
                  className="w-full px-4 py-2 border border-brand-300 rounded-box-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                  rows={3}
                  placeholder="Beskriv relationen och personens roll"
                />
              </div>
            )}
          </div>

          {/* 8. Källor till förmögenhet */}
          <div className="p-4 bg-gray-50 rounded-box border border-gray-200 relative">
            <button
              onClick={() => toggleInfo('question8')}
              className="absolute top-4 right-4 text-brand-600 hover:text-brand-700 transition-colors"
              title="Varför frågar vi detta?"
            >
              <Info className="w-5 h-5" />
            </button>

            <label className="block text-section-title text-brand-800 mb-2 pr-8">
              8. Beskriv källorna till företagets förmögenhet *
            </label>
            <p className="text-xs text-brand-600 mb-2">
              Hur har företaget byggt upp sina tillgångar?
            </p>
            <textarea
              value={formData.källorTillFörmögenhet}
              onChange={(e) => handleChange('källorTillFörmögenhet', e.target.value)}
              className="w-full px-4 py-2 border border-brand-300 rounded-box-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
              rows={4}
              placeholder="T.ex. 'Vinst från försäljning, reinvesterade intäkter, lån...'"
            />

            {expandedInfo.question8 && (
              <div className="mt-4 p-3 bg-white border border-brand-300 rounded-box text-xs space-y-2">
                <p className="font-semibold text-brand-900">Source of Wealth (SOW)</p>
                <p className="text-gray-700">Dokumentera hur kunden har förvärvat sin förmögenhet - kritiskt för PEP och högrisk-kunder.</p>
              </div>
            )}
          </div>

          {/* 9. Dokumentation som kan tillhandahållas */}
          <div className="p-4 bg-gray-50 rounded-box border border-gray-200">
            <h3 className="text-section-title text-brand-800 mb-3">
              9. Vilken dokumentation kan ni tillhandahålla för verifiering? *
            </h3>
            <p className="text-xs text-brand-600 mb-3">
              Välj alla dokument som kan lämnas in
            </p>
            
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 rounded-box border border-brand-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.dokumentation.inkomstdeklarationer}
                  onChange={(e) => handleDokumentationChange('inkomstdeklarationer', e.target.checked)}
                  className="w-4 h-4 text-brand-600 border-brand-300 rounded focus:ring-brand-500"
                />
                <span className="text-sm text-brand-800">Inkomstdeklarationer (senaste 2-3 åren)</span>
              </label>
              
              <label className="flex items-center gap-3 p-3 rounded-box border border-brand-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.dokumentation.årsredovisningar}
                  onChange={(e) => handleDokumentationChange('årsredovisningar', e.target.checked)}
                  className="w-4 h-4 text-brand-600 border-brand-300 rounded focus:ring-brand-500"
                />
                <span className="text-sm text-brand-800">Årsredovisningar</span>
              </label>
              
              <label className="flex items-center gap-3 p-3 rounded-box border border-brand-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.dokumentation.kontrakt}
                  onChange={(e) => handleDokumentationChange('kontrakt', e.target.checked)}
                  className="w-4 h-4 text-brand-600 border-brand-300 rounded focus:ring-brand-500"
                />
                <span className="text-sm text-brand-800">Kontrakt/avtal med större kunder</span>
              </label>
              
              <label className="flex items-center gap-3 p-3 rounded-box border border-brand-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.dokumentation.bankutdrag}
                  onChange={(e) => handleDokumentationChange('bankutdrag', e.target.checked)}
                  className="w-4 h-4 text-brand-600 border-brand-300 rounded focus:ring-brand-500"
                />
                <span className="text-sm text-brand-800">Bankutdrag (senaste 3-6 månaderna)</span>
              </label>
              
              <label className="flex items-center gap-3 p-3 rounded-box border border-brand-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.dokumentation.annat}
                  onChange={(e) => handleDokumentationChange('annat', e.target.checked)}
                  className="w-4 h-4 text-brand-600 border-brand-300 rounded focus:ring-brand-500"
                />
                <span className="text-sm text-brand-800">Annat (beskriv nedan)</span>
              </label>
            </div>

            {formData.dokumentation.annat && (
              <div className="ml-8 mt-3 pl-4 border-l-2 border-brand-300">
                <input
                  type="text"
                  value={formData.dokumentation.annatBeskrivning}
                  onChange={(e) => handleDokumentationChange('annatBeskrivning', e.target.value)}
                  className="w-full px-4 py-2 border border-brand-300 rounded-box-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                  placeholder="Beskriv övrig dokumentation"
                />
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
