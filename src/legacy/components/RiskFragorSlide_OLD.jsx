import { useState, useEffect } from 'react';
import { fetchWithAuth } from '../../utils/auth';
import { useParams, useNavigate } from 'react-router-dom';
import StepIndicator from '../Shared/StepIndicator';
import useSlideStateController from '../../legacy/hooks/useSlideStateController';
import useQuestionnaireForm from '../../legacy/hooks/useQuestionnaireForm';
import { useAgreements } from '../../contexts/AgreementContext';
import AgreementModal from '../Modals/AgreementModal';

// BRUTE FORCE CONFIG: Single field stores entire complex object
const QUESTIONS_CONFIG = {
  entireForm: { type: 'object', required: false }
};

/**
 * UPDATED: 2025-11-30 - MASTER/SLAVE pattern för race condition fix
 */
export default function RiskFragorSlide({ onNext, onSkipPEP, onFormDataChange }) {
  const { companyId, caseId } = useParams();
  const navigate = useNavigate();
  const { hasAnyAgreement } = useAgreements();
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  
  // 🆕 MASTER/SLAVE Pattern: MASTER fetches and decides data source
  const { 
    initialData, 
    isReady, 
    source, 
    metadata 
  } = useSlideStateController('riskfragor_steg1');

  // 🆕 SLAVE receives data - auto-save blocked until initialData is applied
  const {
    formData: hookFormData,
    updateQuestion,
    isLoading: syncLoading,
    syncStatus,
    pushToServer,
    initialDataApplied,
  } = useQuestionnaireForm(
    'riskfragor_steg1',
    QUESTIONS_CONFIG,
    { initialData, isReady, source, caseMetadata: metadata }
  );

  // Extract from brute force field (simplified: no wrapping)
  // Use deep merge to ensure all nested objects have defaults
  const defaultFormData = {
    affarsIde: '',
    kundTyper: {
      privatpersoner: false,
      foretag: false,
      offentligSektor: false
    },
    utlandskaPartners: '',
    storaLeverantorer: '',
    verksamhetAndrad: '',
    personnummer: '',
    isPEP: false
  };
  
  const formData = {
    ...defaultFormData,
    ...hookFormData.entireForm,
    // Ensure nested objects are properly merged
    kundTyper: {
      ...defaultFormData.kundTyper,
      ...(hookFormData.entireForm?.kundTyper || {})
    }
  };

  // Setter updates entire form object (simplified: no wrapping)
  const setFormData = (updater) => {
    const newData = typeof updater === 'function' ? updater(formData) : updater;
    updateQuestion('entireForm', newData);
  };

  // Get företagsnamn and orgnr from localStorage (set by Uppdragsval or handleResume)
  // These are NOT stored in q1-q7, just displayed for confirmation
  const [companyNameDisplay, setCompanyNameDisplay] = useState('');
  const [orgnrDisplay, setOrgnrDisplay] = useState('');

  // Initialize entireForm with default data if null
  useEffect(() => {
    if (hookFormData.entireForm === null) {
      updateQuestion('entireForm', formData);
    }
  }, []);

  useEffect(() => {
    const savedCompanyName = localStorage.getItem('current_company_name');
    const savedOrgnr = localStorage.getItem('current_orgnr');
    
    if (savedCompanyName) {
      console.log('📋 Loading company info from localStorage:', savedCompanyName, savedOrgnr);
      setCompanyNameDisplay(savedCompanyName);
      setOrgnrDisplay(savedOrgnr || '');
    }
  }, []); // Run only once on mount

  // 🆕 2025-12-01: Borttagen useEffect som auto-visade modalen vid varje keystroke
  // Modalen visas nu ENDAST när användaren klickar Nästa (se onClick nedan)

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Notify parent immediately when personnummer changes
    if (field === 'personnummer' && onFormDataChange) {
      onFormDataChange({
        organisationsnummer: orgnrDisplay,
        personnummer: value
      });
    }
  };

  const handleCheckboxChange = (field, checked) => {
    const newKundTyper = { ...formData.kundTyper, [field]: checked };
    setFormData(prev => ({ ...prev, kundTyper: newKundTyper }));
  };

  const isFormValid = () => {
    // Personnummer ska vara minst 12 tecken (YYYYMMDD-XXXX format)
    const personnummerValid = formData.personnummer.replace(/\D/g, '').length >= 12;
    
    return formData.affarsIde.trim() && 
           orgnrDisplay.trim() &&  // Use display value from localStorage
           personnummerValid;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center p-8">
      <div className="max-w-3xl w-full bg-white rounded-card shadow-2xl p-8">
        <h1 className="text-page-title text-brand-900 mb-4">
          Frågor som stödjer riskbedömning
        </h1>
        
        {/* Sync Status Indicator */}
        {syncLoading && (
          <div className="mb-4 p-3 bg-brand-50 border border-brand-200 rounded-box flex items-center gap-2">
            <svg className="w-4 h-4 text-brand-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <p className="text-sm text-brand-700">Synkroniserar data...</p>
          </div>
        )}
        {syncStatus === 'conflict' && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-box flex items-center gap-2">
            <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm text-amber-700">Data har uppdaterats från servern</p>
          </div>
        )}
        
        {/* Step Indicator */}
        <StepIndicator currentStep={1} completedSteps={0} />
        
        <p className="text-sm text-brand-700 mb-6">
          Flera av dessa frågor har lagstöd och hjälper oss att bedöma risken:
        </p>

        <div className="space-y-4">
          {/* Q1: Affärsidé */}
          <div>
            <label className="block text-section-title text-brand-800 mb-2">
              Vad är företagets huvudsakliga affärsidé? *
            </label>
            <textarea
              value={formData.affarsIde}
              onChange={(e) => handleChange('affarsIde', e.target.value)}
              className="w-full px-4 py-2 border border-brand-300 rounded-box-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
              rows={3}
              placeholder="Beskriv kort företagets verksamhet..."
            />
          </div>

          {/* Q2: Kundtyper */}
          <div>
            <label className="block text-section-title text-brand-800 mb-2">
              Vilka typer av kunder har företaget?
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.kundTyper.privatpersoner}
                  onChange={(e) => handleCheckboxChange('privatpersoner', e.target.checked)}
                  className="w-4 h-4 text-brand-600 border-brand-300 rounded focus:ring-brand-500"
                />
                <span className="text-brand-800">Privatpersoner</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.kundTyper.foretag}
                  onChange={(e) => handleCheckboxChange('foretag', e.target.checked)}
                  className="w-4 h-4 text-brand-600 border-brand-300 rounded focus:ring-brand-500"
                />
                <span className="text-brand-800">Företag</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.kundTyper.offentligSektor}
                  onChange={(e) => handleCheckboxChange('offentligSektor', e.target.checked)}
                  className="w-4 h-4 text-brand-600 border-brand-300 rounded focus:ring-brand-500"
                />
                <span className="text-brand-800">Offentlig sektor</span>
              </label>
            </div>
          </div>

          {/* Q3: Utländska partners */}
          <div>
            <label className="block text-sm font-medium text-brand-800 mb-2">
              Har företaget återkommande utländska affärspartners?
            </label>
            <textarea
              value={formData.utlandskaPartners}
              onChange={(e) => handleChange('utlandskaPartners', e.target.value)}
              className="w-full px-4 py-2 border border-brand-300 rounded-box-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
              rows={2}
              placeholder="Beskriv vilka länder och typ av samarbete..."
            />
          </div>

          {/* Q4: Största leverantörer */}
          <div>
            <label className="block text-sm font-medium text-brand-800 mb-2">
              Vilka är de största leverantörerna, och var är de etablerade?
            </label>
            <textarea
              value={formData.storaLeverantorer}
              onChange={(e) => handleChange('storaLeverantorer', e.target.value)}
              className="w-full px-4 py-2 border border-brand-300 rounded-box-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
              rows={2}
              placeholder="Lista de viktigaste leverantörerna..."
            />
          </div>

          {/* Q5: Verksamhetsändring */}
          <div>
            <label className="block text-sm font-medium text-brand-800 mb-2">
              Har verksamheten ändrats på senare tid?
            </label>
            <textarea
              value={formData.verksamhetAndrad}
              onChange={(e) => handleChange('verksamhetAndrad', e.target.value)}
              className="w-full px-4 py-2 border border-brand-300 rounded-box-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
              rows={2}
              placeholder="Beskriv eventuella förändringar..."
            />
          </div>

          {/* Q6: Personnummer */}
          <div>
            <label className="block text-sm font-medium text-brand-800 mb-2">
              Personnummer *
            </label>
            <input
              type="text"
              value={formData.personnummer}
              onChange={(e) => handleChange('personnummer', e.target.value)}
              className="w-full px-4 py-2 border border-brand-300 rounded-box-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
              placeholder="YYYYMMDD-XXXX"
            />
            <p className="text-xs text-brand-600 mt-1">
              Personnumret används för att hämta officiell information från Bolagsverket eller Roaring.io.
            </p>
          </div>

          {/* Q7: PEP-fråga */}
          <div className="bg-brand-50 border-l-4 border-brand-500 p-4 rounded-box">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={formData.isPEP}
                onChange={(e) => handleChange('isPEP', e.target.checked)}
                className="mt-1 w-5 h-5 text-brand-600 border-brand-300 rounded focus:ring-brand-500"
              />
              <div>
                <span className="block text-section-title text-brand-900">
                  Är du eller någon i företaget en PEP (person i politiskt utsatt ställning)?
                </span>
                <span className="text-xs text-brand-700">
                  Detta inkluderar personer som innehar eller har innehaft höga offentliga ämbeten.
                </span>
              </div>
            </label>
          </div>
        </div>

        <button
          onClick={async () => {
            if (!isFormValid()) return;
            
            try {
              // Get required data from localStorage
              const onboardingId = localStorage.getItem('onboarding_id');
              if (!onboardingId) {
                alert('⚠️ onboarding_id saknas. Gå tillbaka till Uppdragsval.');
                return;
              }
              
              // 🆕 Validera att companyId finns (kan saknas om URL är fel)
              if (!companyId) {
                console.error('❌ companyId saknas i URL params!');
                alert('⚠️ Företags-ID saknas. Gå tillbaka till Uppdragsval.');
                return;
              }
              
              // 🆕 2025-12-02: SPARA DATA FÖRST innan agreement-check!
              // Så att data finns när användaren kommer tillbaka från Stripe
              const requestBody = {
                ...formData,
                orgnr: orgnrDisplay,
                company_name: companyNameDisplay
              };
              
              console.log('📤 Pre-saving risk assessment:', { companyId, onboardingId, requestBody });
              
              const API_BASE = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_BASE_URL}/api`;
              const url = `${API_BASE}/onboarding/${companyId}/risk-assessment?onboarding_id=${onboardingId}`;
              console.log('📤 POST URL:', url);
              
              const preSaveResponse = await fetchWithAuth(
                url,
                {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(requestBody)
                }
              );
              
              if (!preSaveResponse.ok) {
                const errorData = await preSaveResponse.json();
                throw new Error(errorData.detail || 'Kunde inte spara riskbedömning');
              }
              
              console.log('✅ Riskfrågor Steg 1 pre-saved successfully');
              
              // 🆕 Nu när data är sparad, kolla agreement
              if (!hasAnyAgreement()) {
                setShowAgreementModal(true);
                return; // Data är redan sparad - säkert att gå till Stripe!
              }
              
              // Om agreement redan finns, fortsätt direkt till nästa steg
              // (data redan sparad ovan)
              if (formData.isPEP) {
                onSkipPEP(companyId, caseId);
              } else {
                onNext(companyId, caseId);
              }
            } catch (err) {
              console.error('❌ Error saving:', err);
              alert('Fel vid sparande: ' + err.message);
            }
          }}
          disabled={!isFormValid()}
          className={`w-full mt-8 px-4 py-2 rounded-box font-semibold transition-all ${
            isFormValid()
              ? 'bg-brand-600 hover:bg-brand-700 text-white cursor-pointer'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Nästa
        </button>
      </div>
      
      {/* Agreement Modal */}
      <AgreementModal 
        show={showAgreementModal} 
        onClose={() => setShowAgreementModal(false)} 
      />
    </div>
  );
}
