import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Info } from 'lucide-react';
import { searchCompanies, getCompanyByOrgNr } from '../../data/mockCompanyAutocomplete';
import StepIndicator from '../Shared/StepIndicator';
import useQuestionnaireForm from '../../hooks/useQuestionnaireForm';
import { useAgreements } from '../../contexts/AgreementContext';
import AgreementModal from '../Modals/AgreementModal';

// BRUTE FORCE CONFIG: Single question that stores entire complex formData object
const QUESTIONS_CONFIG = {
  entireForm: { type: 'object', required: false }
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
    pushToServer,
  } = useQuestionnaireForm(
    'riskfragor_steg1',
    QUESTIONS_CONFIG
  );

  // Extract actual form data from hook (brute force: everything in entireForm.selected)
  const formData = hookFormData.entireForm?.selected || {
    affarsIde: '',
    kundTyper: {
      privatpersoner: false,
      foretag: false,
      offentligSektor: false,
    },
    utlandskaPartners: '',
    storaLeverantorer: '',
    verksamhetAndrad: '',
    foretagsnamn: '',
    organisationsnummer: '',
    personnummer: '',
    isPEP: false,
  };

  // Setter that updates the brute force field
  const setFormData = (updater) => {
    const newData = typeof updater === 'function' ? updater(formData) : updater;
    updateQuestion('entireForm', newData);
  };

  // Autocomplete state
  const [companyQuery, setCompanyQuery] = useState(formData.foretagsnamn || '');
  const [companySuggestions, setCompanySuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const autocompleteRef = useRef(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Kolla om agreement krävs när kritisk data finns
  useEffect(() => {
    const hasCompanyName = formData.foretagsnamn && formData.foretagsnamn.trim() !== '';
    const hasOrgNr = formData.organisationsnummer && formData.organisationsnummer.trim() !== '';
    const hasPersonNr = formData.personnummer && formData.personnummer.trim() !== '';
    const hasBusinessDescription = formData.affarsIde && formData.affarsIde.trim() !== '';
    
    // Alla 3 kritiska fält är ifyllda
    const allCriticalDataFilled = hasCompanyName && hasOrgNr && hasPersonNr && hasBusinessDescription;
    
    if (allCriticalDataFilled && !hasAnyAgreement()) {
      setShowAgreementModal(true);
    } else {
      setShowAgreementModal(false);
    }
  }, [formData.foretagsnamn, formData.organisationsnummer, formData.personnummer, formData.affarsIde, hasAnyAgreement]);

  const handleChange = (field, value) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    
    // Om användaren manuellt ändrar org.nr → ta bort selectedCompany (manuell override)
    if (field === 'organisationsnummer' && selectedCompany) {
      setSelectedCompany(null);
    }
    
    // Notify parent immediately when org/pers nummer changes
    if ((field === 'organisationsnummer' || field === 'personnummer') && onFormDataChange) {
      onFormDataChange({
        organisationsnummer: field === 'organisationsnummer' ? value : formData.organisationsnummer,
        personnummer: field === 'personnummer' ? value : formData.personnummer
      });
    }
  };

  const handleCheckboxChange = (field, checked) => {
    setFormData(prev => ({
      ...prev,
      kundTyper: { ...prev.kundTyper, [field]: checked }
    }));
  };

  const handleCompanySearch = (query) => {
    setCompanyQuery(query);
    
    // Om användaren raderar företagsnamnet → rensa även org.nr och selectedCompany
    if (query.trim() === '') {
      setSelectedCompany(null);
      setFormData(prev => ({
        ...prev,
        foretagsnamn: '',
        organisationsnummer: ''
      }));
      setCompanySuggestions([]);
      setShowSuggestions(false);
      return;
    }
    
    if (query.length >= 2) {
      const results = searchCompanies(query);
      setCompanySuggestions(results);
      setShowSuggestions(true);
    } else {
      setCompanySuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleCompanySelect = (company) => {
    setSelectedCompany(company);
    setCompanyQuery(company.name);
    setFormData(prev => ({
      ...prev,
      foretagsnamn: company.name,
      organisationsnummer: company.orgNr
    }));
    setShowSuggestions(false);
    
    // Notify parent
    if (onFormDataChange) {
      onFormDataChange({
        organisationsnummer: company.orgNr,
        personnummer: formData.personnummer
      });
    }
  };

  const isFormValid = () => {
    // Personnummer ska vara minst 12 tecken (YYYYMMDD-XXXX format)
    const personnummerValid = formData.personnummer.replace(/\D/g, '').length >= 12;
    
    return formData.affarsIde.trim() && 
           formData.organisationsnummer.trim() && 
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
          {/* Affärsidé */}
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

          {/* Företagsnamn och Organisationsnummer (READ-ONLY - förifyllt från Uppdragsval) */}
          <div className="bg-amber-50 border-l-4 border-amber-400 rounded-box p-4 mb-4">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Info className="w-5 h-5 text-amber-600" />
              Organisationsnummer anges nu i Uppdragsval (första steget)
            </h3>
            <p className="text-sm text-gray-700 mb-3">
              <strong>ARKITEKTONISK ÄNDRING (2025-11-21):</strong> Organisationsnummer har flyttats 
              till Uppdragsval för att möjliggöra "Parkera och Avsluta"-funktionalitet. 
              Fälten nedan är förifyllda från Uppdragsval och visas endast för bekräftelse.
            </p>
            <p className="text-sm text-gray-700">
              <strong>Om fel företag valts:</strong> Gå tillbaka till Uppdragsval via sidebar för att ändra organisationsnummer.
            </p>
          </div>

          {/* Företagsnamn (READ-ONLY) */}
          <div>
            <label className="block text-section-title text-brand-800 mb-2 flex items-center gap-2">
              Företagsnamn (förifyllt från Uppdragsval)
            </label>
            <input
              type="text"
              value={companyQuery || formData.foretagsnamn}
              readOnly
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-box-sm bg-gray-100 text-gray-600 cursor-not-allowed text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              Detta fält kan inte redigeras här. Ändra i Uppdragsval om behov finns.
            </p>
          </div>

          {/* Organisationsnummer (READ-ONLY) */}
          <div>
            <label className="block text-section-title text-brand-800 mb-2">
              Organisationsnummer (förifyllt från Uppdragsval)
            </label>
            <input
              type="text"
              value={formData.organisationsnummer}
              readOnly
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-box-sm bg-gray-100 text-gray-600 cursor-not-allowed text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              Detta fält kan inte redigeras här. Ändra i Uppdragsval om behov finns.
            </p>
          </div>

          {/* Kundtyper */}
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

          {/* Utländska partners */}
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

          {/* Största leverantörer */}
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

          {/* Verksamhetsändring */}
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
              // Save to server
              const success = await pushToServer();
              
              if (success) {
                console.log('✅ Riskfrågor Steg 1 saved');
                
                // Pass companyId to parent callback
                if (formData.isPEP) {
                  onSkipPEP(companyId);
                } else {
                  onNext(companyId);
                }
              } else {
                alert('⚠️ Kunde inte spara till server');
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
