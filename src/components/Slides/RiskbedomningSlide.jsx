import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useQuestionnaireForm from '../../hooks/useQuestionnaireForm';

export default function RiskbedomningSlide({ onNext, onBack }) {
  const { companyId } = useParams();
  
  const QUESTIONS_CONFIG = {
    entireForm: { type: 'object', required: false }
  };

  const { formData: savedFormData, updateQuestion, pushToServer } = useQuestionnaireForm(
    'riskbedomning',
    QUESTIONS_CONFIG
  );

  const [decision, setDecision] = useState(savedFormData?.decision || '');
  const [monthlyPrice, setMonthlyPrice] = useState(savedFormData?.monthlyPrice || '');
  const [showError, setShowError] = useState(false);

  // Sync state changes
  useEffect(() => {
    updateQuestion('entireForm', { decision, monthlyPrice });
  }, [decision, monthlyPrice]);

  // AI-rekommenderat pris baserat på komplexitet (mock)
  const aiRecommendedPrice = 4500;

  // Sammanfattning av analysen (skulle komma från tidigare slides)
  const riskSummary = {
    companyData: 'Godkänd',
    economicAnalysis: 'Godkänd',
    accountingAnalysis: '4 flaggade poster',
    riskIndicators: 'Inga träffar'
  };

  const handleContinue = async () => {
    if (decision === '') {
      setShowError(true);
      return;
    }
    
    if (decision === 'accept' && !monthlyPrice) {
      setShowError(true);
      return;
    }

    if (decision === 'reject') {
      await pushToServer();
      alert('Avslag registrerat. Kunden kommer att informeras.');
      return;
    }

    if (decision === 'review') {
      await pushToServer();
      alert('Fördjupad kontroll markerad. Ytterligare dokumentation kommer att begäras.');
      return;
    }

    await pushToServer();
    onNext();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center p-8">
      <div className="max-w-5xl w-full bg-white rounded-card shadow-2xl p-10">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-page-title text-brand-900 mb-2 flex items-center gap-3">
            <svg className="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Riskbedömning och besked
          </h1>
          <p className="text-brand-700">
            Efter analys av insamlad data görs en samlad riskbedömning.
          </p>
        </div>

        {/* Risk Summary */}
        <div className="mb-6 p-4 bg-brand-50 rounded-box border border-brand-200">
          <h3 className="font-semibold text-brand-900 mb-3">Sammanfattning av analysen:</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-gray-700"><strong>Företagsdata:</strong> {riskSummary.companyData}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-gray-700"><strong>Ekonomisk analys:</strong> {riskSummary.economicAnalysis}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-gray-700"><strong>Bokföringsanalys:</strong> {riskSummary.accountingAnalysis}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-gray-700"><strong>Riskindikatorer:</strong> {riskSummary.riskIndicators}</span>
            </div>
          </div>
        </div>

        {/* Decision */}
        <div className="mb-6 p-5 bg-gray-50 rounded-box border-2 border-gray-300">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Beslut (Endast för byråchef)
          </h3>
          <div className="space-y-3">
            <label className={`flex items-center gap-3 p-4 rounded-box border-2 cursor-pointer transition-all ${
              decision === 'accept' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'
            }`}>
              <input
                type="radio"
                name="decision"
                value="accept"
                checked={decision === 'accept'}
                onChange={(e) => setDecision(e.target.value)}
                className="w-5 h-5"
              />
              <div className="flex-1">
                <div className="font-semibold text-gray-900">✓ Acceptera kund</div>
                <div className="text-sm text-gray-600">Gå vidare till avtal och prissättning</div>
              </div>
            </label>

            <label className={`flex items-center gap-3 p-4 rounded-box border-2 cursor-pointer transition-all ${
              decision === 'review' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 hover:border-yellow-300'
            }`}>
              <input
                type="radio"
                name="decision"
                value="review"
                checked={decision === 'review'}
                onChange={(e) => setDecision(e.target.value)}
                className="w-5 h-5"
              />
              <div className="flex-1">
                <div className="font-semibold text-gray-900">⚠ Fördjupad kontroll</div>
                <div className="text-sm text-gray-600">Begär ytterligare dokumentation</div>
              </div>
            </label>

            <label className={`flex items-center gap-3 p-4 rounded-box border-2 cursor-pointer transition-all ${
              decision === 'reject' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-red-300'
            }`}>
              <input
                type="radio"
                name="decision"
                value="reject"
                checked={decision === 'reject'}
                onChange={(e) => setDecision(e.target.value)}
                className="w-5 h-5"
              />
              <div className="flex-1">
                <div className="font-semibold text-gray-900">✗ Avslag</div>
                <div className="text-sm text-gray-600">Kunden accepteras ej</div>
              </div>
            </label>
          </div>
        </div>

        {/* Pricing (only show if accepted) */}
        {decision === 'accept' && (
          <div className="mb-6 p-5 bg-green-50 rounded-box border-2 border-green-300">
            <h3 className="font-bold text-green-900 mb-3">Prissättning</h3>
            <p className="text-sm text-green-800 mb-4">
              Baserat på kundens valda tjänster och behov från tidigare steg.
            </p>

            {/* AI Recommendation */}
            <div className="mb-4 p-3 bg-green-100 rounded border border-green-300">
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-5 h-5 text-green-700" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 7H7v6h6V7z" />
                  <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold text-green-900">AI-rekommendation</span>
              </div>
              <p className="text-sm text-green-800">
                Rekommenderat pris: <strong>{aiRecommendedPrice.toLocaleString('sv-SE')} SEK/mån</strong> (exkl. moms)
              </p>
              <p className="text-xs text-green-700 mt-1">
                Baserat på: Löpande bokföring, deklarationshjälp, fakturering, rådgivning
              </p>
            </div>

            {/* Price Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Månadspris <span className="text-red-600">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={monthlyPrice}
                  onChange={(e) => setMonthlyPrice(e.target.value)}
                  placeholder={aiRecommendedPrice.toString()}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-box focus:border-brand-600 focus:outline-none text-lg font-semibold"
                />
                <span className="text-gray-700 font-medium">SEK/mån</span>
              </div>
              <p className="text-xs text-gray-600 mt-1 italic">
                (exklusive moms) - Detta pris kommer att framgå i avtalet
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {showError && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
            <p className="text-sm text-red-800">
              {decision === '' && '⚠ Vänligen välj ett beslut innan du fortsätter.'}
              {decision === 'accept' && !monthlyPrice && '⚠ Vänligen ange månadspris för att generera avtal.'}
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-box hover:bg-gray-300 transition-all font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Tillbaka
          </button>

          <button
            onClick={handleContinue}
            className={`flex items-center gap-2 px-6 py-3 rounded-box transition-all font-semibold shadow-lg ${
              decision === 'accept' && monthlyPrice
                ? 'bg-green-600 text-white hover:bg-green-700'
                : decision === 'reject' || decision === 'review'
                ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            }`}
          >
            {decision === 'accept' ? 'Generera avtal & Gå vidare' : 
             decision === 'reject' ? 'Registrera avslag' :
             decision === 'review' ? 'Markera för granskning' : 
             'Välj beslut'}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
