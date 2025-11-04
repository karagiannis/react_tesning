import { useState, useEffect, useRef } from 'react';
import { Info } from 'lucide-react';
import { searchCompanies, getCompanyByOrgNr } from '../../data/mockCompanyAutocomplete';
import StepIndicator from '../Shared/StepIndicator';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useAgreements } from '../../contexts/AgreementContext';
import AgreementModal from '../Modals/AgreementModal';

export default function RiskFragorSlide({ onNext, onSkipPEP, onFormDataChange }) {
  const { hasAnyAgreement } = useAgreements();
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  
  const [formData, setFormData] = useLocalStorage('onboarding-wizard-steg1', {
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
  });

  // Autocomplete state
  const [companyQuery, setCompanyQuery] = useState('');
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
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl p-10">
        <h1 className="text-3xl font-bold text-brand-900 mb-6">
          Frågor som stödjer riskbedömning
        </h1>
        
        {/* Step Indicator */}
        <StepIndicator currentStep={1} completedSteps={0} />
        
        <p className="text-sm text-brand-700 mb-6">
          Flera av dessa frågor har lagstöd och hjälper oss att bedöma risken:
        </p>

        <div className="space-y-6">
          {/* Affärsidé */}
          <div>
            <label className="block text-sm font-medium text-brand-800 mb-2">
              Vad är företagets huvudsakliga affärsidé? *
            </label>
            <textarea
              value={formData.affarsIde}
              onChange={(e) => handleChange('affarsIde', e.target.value)}
              className="w-full px-4 py-2 border border-brand-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              rows={3}
              placeholder="Beskriv kort företagets verksamhet..."
            />
          </div>

          {/* Företagsnamn med Autocomplete */}
          <div ref={autocompleteRef} className="relative">
            <label className="block text-sm font-medium text-brand-800 mb-2 flex items-center gap-2">
              Vilket företag representerar du? *
              <Info className="w-4 h-4 text-brand-600 cursor-help" title="Sök efter ditt företag så hämtar vi automatiskt organisationsnummer från Bolagsverket" />
            </label>
            <input
              type="text"
              value={companyQuery}
              onChange={(e) => handleCompanySearch(e.target.value)}
              onFocus={() => companyQuery.length >= 2 && setShowSuggestions(true)}
              className="w-full px-4 py-2 border border-brand-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              placeholder="Börja skriva företagsnamn..."
            />
            {showSuggestions && companySuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-brand-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {companySuggestions.map((company) => (
                  <button
                    key={company.id}
                    onClick={() => handleCompanySelect(company)}
                    className="w-full px-4 py-2 text-left hover:bg-brand-50 transition-colors border-b border-brand-100 last:border-b-0"
                  >
                    <div className="font-medium text-brand-900">{company.name}</div>
                    <div className="text-xs text-brand-600">
                      Org.nr: {company.orgNr} • {company.stad}, {company.lan}
                    </div>
                  </button>
                ))}
              </div>
            )}
            <p className="text-xs text-brand-600 mt-1">
              Autocomplete söker i Bolagsverkets register (600 000+ företag)
            </p>
          </div>

          {/* Organisationsnummer */}
          <div>
            <label className="block text-sm font-medium text-brand-800 mb-2">
              Organisationsnummer *
            </label>
            <input
              type="text"
              value={formData.organisationsnummer}
              onChange={(e) => handleChange('organisationsnummer', e.target.value)}
              className="w-full px-4 py-2 border border-brand-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-brand-50"
              placeholder="XXXXXX-XXXX"
            />
            <p className="text-xs text-brand-600 mt-1">
              {selectedCompany 
                ? '✓ Förifyllt från Bolagsverket (kan redigeras manuellt)' 
                : 'Välj företag ovan eller skriv in organisationsnummer manuellt'}
            </p>
          </div>

          {/* Kundtyper */}
          <div>
            <label className="block text-sm font-medium text-brand-800 mb-2">
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
              className="w-full px-4 py-2 border border-brand-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
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
              className="w-full px-4 py-2 border border-brand-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
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
              className="w-full px-4 py-2 border border-brand-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
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
              className="w-full px-4 py-2 border border-brand-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              placeholder="YYYYMMDD-XXXX"
            />
            <p className="text-xs text-brand-600 mt-1">
              Personnumret används för att hämta officiell information från Bolagsverket eller Roaring.io.
            </p>
          </div>

          {/* PEP-fråga */}
          <div className="bg-brand-50 border-l-4 border-brand-500 p-4 rounded">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={formData.isPEP}
                onChange={(e) => handleChange('isPEP', e.target.checked)}
                className="mt-1 w-5 h-5 text-brand-600 border-brand-300 rounded focus:ring-brand-500"
              />
              <div>
                <span className="block font-medium text-brand-900">
                  Är du eller någon i företaget en PEP (person i politiskt utsatt ställning)?
                </span>
                <span className="text-sm text-brand-700">
                  Detta inkluderar personer som innehar eller har innehaft höga offentliga ämbeten.
                </span>
              </div>
            </label>
          </div>
        </div>

        <button
          onClick={() => {
            if (formData.isPEP) {
              onNext();
            } else {
              onSkipPEP();
            }
          }}
          disabled={!isFormValid()}
          className={`w-full mt-8 px-8 py-3 rounded-lg font-semibold transition-all ${
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
