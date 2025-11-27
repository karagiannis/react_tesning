import { useState, useEffect } from 'react';
import { fetchWithAuth } from '../../utils/auth';
import { useParams, useNavigate } from 'react-router-dom';
import StepIndicator from '../Shared/StepIndicator';
import useQuestionnaireForm from '../../hooks/useQuestionnaireForm';
import { useAgreements } from '../../contexts/AgreementContext';
import AgreementModal from '../Modals/AgreementModal';

// UNIFIED DATA PROTOCOL: Structured q1-q7 config
const QUESTIONS_CONFIG = {
  q1: { type: 'textarea', required: true },   // Affärsidé
  q2: { type: 'checkbox', required: true },   // Kundtyper
  q3: { type: 'textarea', required: false },  // Utländska partners
  q4: { type: 'textarea', required: false },  // Största leverantörer
  q5: { type: 'textarea', required: false },  // Verksamhetsändring
  q6: { type: 'text', required: true },       // Personnummer
  q7: { type: 'boolean', required: true }     // PEP
};

export default function RiskFragorSlide({ onNext, onSkipPEP, onFormDataChange }) {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const { hasAnyAgreement } = useAgreements();
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  
  // Use new hook with company_id from URL
  const {
    formData: hookFormData,
    updateQuestion,
    isLoading: syncLoading,
    syncStatus,
    pushToServer
  } = useQuestionnaireForm(
    'riskfragor_steg1',
    QUESTIONS_CONFIG
  );

  // Extract form data using new q1-q7 structure
  const formData = {
    affarsIde: hookFormData.q1?.value || '',
    kundTyper: hookFormData.q2?.value || {
      privatpersoner: false,
      foretag: false,
      offentligSektor: false
    },
    utlandskaPartners: hookFormData.q3?.value || '',
    storaLeverantorer: hookFormData.q4?.value || '',
    verksamhetAndrad: hookFormData.q5?.value || '',
    personnummer: hookFormData.q6?.value || '',
    isPEP: hookFormData.q7?.value || false
  };

  // Setters for each question
  const setFormData = (updater) => {
    const newData = typeof updater === 'function' ? updater(formData) : updater;
    
    // Map back to q1-q7 structure
    updateQuestion('q1', newData.affarsIde);
    updateQuestion('q2', newData.kundTyper);
    updateQuestion('q3', newData.utlandskaPartners);
    updateQuestion('q4', newData.storaLeverantorer);
    updateQuestion('q5', newData.verksamhetAndrad);
    updateQuestion('q6', newData.personnummer);
    updateQuestion('q7', newData.isPEP);
  };

  // Get företagsnamn and orgnr from localStorage (set by Uppdragsval or handleResume)
  // These are NOT stored in q1-q7, just displayed for confirmation
  const [companyNameDisplay, setCompanyNameDisplay] = useState('');
  const [orgnrDisplay, setOrgnrDisplay] = useState('');

  useEffect(() => {
    const savedCompanyName = localStorage.getItem('currentCompanyName');
    const savedOrgnr = localStorage.getItem('currentOrgnr');
    
    if (savedCompanyName) {
      console.log('📋 Loading company info from localStorage:', savedCompanyName, savedOrgnr);
      setCompanyNameDisplay(savedCompanyName);
      setOrgnrDisplay(savedOrgnr || '');
    }
  }, []); // Run only once on mount

  // Kolla om agreement krävs när kritisk data finns
  useEffect(() => {
    const hasCompanyName = companyNameDisplay && companyNameDisplay.trim() !== '';
    const hasOrgNr = orgnrDisplay && orgnrDisplay.trim() !== '';
    const hasPersonNr = formData.personnummer && formData.personnummer.trim() !== '';
    const hasBusinessDescription = formData.affarsIde && formData.affarsIde.trim() !== '';
    
    // Alla 3 kritiska fält är ifyllda
    const allCriticalDataFilled = hasCompanyName && hasOrgNr && hasPersonNr && hasBusinessDescription;
    
    if (allCriticalDataFilled && !hasAnyAgreement()) {
      setShowAgreementModal(true);
    } else {
      setShowAgreementModal(false);
    }
  }, [companyNameDisplay, orgnrDisplay, formData.personnummer, formData.affarsIde, hasAnyAgreement]);

  const handleChange = (questionId, value) => {
    updateQuestion(questionId, value);
    
    // Notify parent immediately when personnummer changes
    if (questionId === 'q6' && onFormDataChange) {
      onFormDataChange({
        organisationsnummer: orgnrDisplay,
        personnummer: value
      });
    }
  };

  const handleCheckboxChange = (field, checked) => {
    const newKundTyper = { ...formData.kundTyper, [field]: checked };
    updateQuestion('q2', newKundTyper);
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
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-box">
            <p className="text-sm text-blue-700">🔄 Synkroniserar data...</p>
          </div>
        )}
        {syncStatus === 'conflict' && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-box">
            <p className="text-sm text-amber-700">⚠️ Data har uppdaterats från servern</p>
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
              onChange={(e) => handleChange('q1', e.target.value)}
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
              onChange={(e) => handleChange('q3', e.target.value)}
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
              onChange={(e) => handleChange('q4', e.target.value)}
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
              onChange={(e) => handleChange('q5', e.target.value)}
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
              onChange={(e) => handleChange('q6', e.target.value)}
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
                onChange={(e) => handleChange('q7', e.target.checked)}
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
              rows={2}
              placeholder="Beskriv eventuella förändringar..."
            />
          </div>

          {/* Personnummer */}
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

          {/* PEP-fråga */}
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
              const onboardingId = localStorage.getItem('onboardingId');
if (!onboardingId) {
                alert('⚠️ onboardingId saknas. Gå tillbaka till Uppdragsval.');
                return;
              }
              
              // Map checkbox keys to Swedish display names for backend
              const customerTypeMap = {
                privatpersoner: 'Privatpersoner',
                foretag: 'Företag',
                offentligSektor: 'Offentlig sektor'
              };

              // Prepare request body matching backend RiskAssessmentRequest
              const requestBody = {
                orgnr: orgnrDisplay,  // From localStorage (set by Uppdragsval)
                company_name: companyNameDisplay,  // From localStorage
                business_idea: formData.affarsIde,
                customer_types: Object.entries(formData.kundTyper)
                  .filter(([_, checked]) => checked)
                  .map(([key]) => customerTypeMap[key]),  // Map to Swedish names
                foreign_partners: formData.utlandskaPartners || '',
                main_suppliers: formData.storaLeverantorer || '',
                recent_changes: formData.verksamhetAndrad || '',
                personal_number: formData.personnummer,
                is_pep: formData.isPEP
              };
              
              console.log('📤 Submitting risk assessment:', requestBody);
              
              // Submit to backend with onboarding_id query parameter
              const response = await fetchWithAuth(
                `https://celestial.se/tic-tac-toe-api/api/onboarding/risk-assessment?onboarding_id=${onboardingId}`,
                {
                  method: 'POST',
                  headers: {'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(requestBody)
                }
              );
              
              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Kunde inte spara riskbedömning');
              }
              
              const data = await response.json();
              console.log('✅ Riskfrågor Steg 1 saved:', data);
              
              // Data already saved via useQuestionnaireForm auto-save (q1-q7)
              
              // Pass companyId to parent callback
              if (formData.isPEP) {
                onSkipPEP(companyId);
              } else {
                onNext(companyId);
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
