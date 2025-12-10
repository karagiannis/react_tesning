import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Info, Lock } from 'lucide-react';
import { searchCompanies } from '../../data/companySearchAPI';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * UppdragsvalsSlide - "DUM" PRESENTATIONSKOMPONENT
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * REFAKTORERAD: 2025-12-04
 * 
 * Denna slide är nu en REN presentationskomponent enligt Tic-Tac-Toe-mönstret:
 * 
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  AuthenticatedApp.jsx (GAME)                                           │
 * │  ─────────────────────────────────────────────────────────────────────  │
 * │  • Håller ALL state (formData, activeCase, etc.)                       │
 * │  • Hanterar ALLA API-anrop                                             │
 * │  • Hanterar ALL localStorage                                           │
 * │  • Skickar props NER till slides                                       │
 * └───────────────────────────────────┬─────────────────────────────────────┘
 *                                     │
 *                                     │ Props: formData, onFieldChange, onNext
 *                                     ▼
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  UppdragsvalsSlide (SQUARE)                                            │
 * │  ─────────────────────────────────────────────────────────────────────  │
 * │  • Tar emot formData via props                                         │
 * │  • Anropar onFieldChange() vid varje ändring                          │
 * │  • Anropar onNext() vid "Fortsätt"                                    │
 * │  • INGEN egen state för data                                          │
 * │  • INGA API-anrop                                                      │
 * │  • INGEN localStorage                                                  │
 * └─────────────────────────────────────────────────────────────────────────┘
 * 
 * Props:
 *   @param {Object} formData - Slide-data från AuthenticatedApp
 *   @param {Function} onFieldChange - (field, value) => void
 *   @param {Function} onNext - () => void (navigerar till nästa slide)
 *   @param {Function} onBack - () => void (navigerar bakåt)
 *   @param {boolean} isLocked - Om orgnr är låst (efter onboarding startats)
 *   @param {boolean} isLoading - Visar loading-state
 *   @param {string} error - Felmeddelande att visa
 *   @param {string} syncStatus - 'idle' | 'saving' | 'saved' | 'conflict' | 'offline'
 */

// Service options configuration
const SERVICE_OPTIONS = [
  { key: 'lopandeBokforing', label: 'Löpande bokföring', price: '5000 kr/år' },
  { key: 'arsbokslut', label: 'Årsbokslut', price: '8000 kr/år' },
  { key: 'deklarationer', label: 'Deklarationer (moms, arbetsgivardeklaration, inkomstdeklaration)', price: '3000 kr/år' },
  { key: 'loneadministration', label: 'Löneadministration', price: '4000 kr/år' },
  { key: 'ekonomiskRadgivning', label: 'Ekonomisk rådgivning', price: '10000 kr/år' },
  { key: 'foretagsregistrering', label: 'Företagsregistrering (nystartad verksamhet)', price: '15000 kr (engångsavgift)' },
  { key: 'finansiellRapportering', label: 'Finansiell rapportering och analys', price: '6000 kr/år' },
  { key: 'foretagsforsaljning', label: 'Företagsförsäljning/succession', price: 'Offert' },
];

// Default form state
const DEFAULT_FORM_STATE = {
  services: {
    lopandeBokforing: false,
    arsbokslut: false,
    deklarationer: false,
    loneadministration: false,
    ekonomiskRadgivning: false,
    foretagsregistrering: false,
    finansiellRapportering: false,
    foretagsforsaljning: false,
    annat: '',
  },
  orgnr: '',
  company_name: ''
};

export default function UppdragsvalsSlide({ 
  formData = DEFAULT_FORM_STATE,
  onFieldChange,
  onNext,
  onBack,
  isLocked = false,
  isLoading = false,
  error = null,
  syncStatus = 'idle'
}) {
  // ═══════════════════════════════════════════════════════════════════════
  // LOKAL UI-STATE (endast för presentation, inte data)
  // ═══════════════════════════════════════════════════════════════════════
  
  // Expanderbara sektioner
  const [expandedSections, setExpandedSections] = useState({
    intro: false,
    sanctions: false,
    orgnr: false,
  });

  // Autocomplete för företagssök (UI-only)
  const [companyQuery, setCompanyQuery] = useState(formData.company_name || '');
  const [companySuggestions, setCompanySuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const autocompleteRef = useRef(null);

  // Lokal validering för submit-knapp
  const [localError, setLocalError] = useState(null);

  // ═══════════════════════════════════════════════════════════════════════
  // EFFECTS - Synka UI med props
  // ═══════════════════════════════════════════════════════════════════════

  // Stäng suggestions vid klick utanför
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Synka companyQuery med formData (om ändras utifrån)
  useEffect(() => {
    setCompanyQuery(formData.company_name || '');
  }, [formData.company_name]);

  // ═══════════════════════════════════════════════════════════════════════
  // HANDLERS - Anropar onFieldChange uppåt
  // ═══════════════════════════════════════════════════════════════════════

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleServiceChange = (serviceKey, checked) => {
    const updatedServices = { 
      ...formData.services, 
      [serviceKey]: checked 
    };
    onFieldChange('services', updatedServices);
  };

  const handleAnnatChange = (value) => {
    const updatedServices = { 
      ...formData.services, 
      annat: value 
    };
    onFieldChange('services', updatedServices);
  };

  const handleOrgnrChange = (value) => {
    onFieldChange('orgnr', value);
  };

  const handleCompanyNameChange = (value) => {
    onFieldChange('company_name', value);
  };

  // Företagssök med autocomplete
  const handleCompanySearch = async (query) => {
    setCompanyQuery(query);
    
    if (query.trim() === '') {
      setCompanySuggestions([]);
      setShowSuggestions(false);
      onFieldChange('company_name', '');
      onFieldChange('orgnr', '');
      return;
    }
    
    if (query.length >= 2) {
      setSearchLoading(true);
      try {
        const results = await searchCompanies(query, 10);
        setCompanySuggestions(results);
        setShowSuggestions(true);
      } catch (err) {
        console.error('Company search failed:', err);
        setCompanySuggestions([]);
      } finally {
        setSearchLoading(false);
      }
    } else {
      setCompanySuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleCompanySelect = (company) => {
    console.log('[AUTOCOMPLETE] Selected company:', company);
    setCompanyQuery(company.name);
    
    console.log('[AUTOCOMPLETE] Calling onFieldChange for company_name:', company.name);
    onFieldChange('company_name', company.name);
    
    console.log('[AUTOCOMPLETE] Calling onFieldChange for orgnr:', company.orgnr);
    onFieldChange('orgnr', company.orgnr);
    
    setShowSuggestions(false);
    console.log('[AUTOCOMPLETE] Company selection complete');
  };

  // ═══════════════════════════════════════════════════════════════════════
  // SUBMIT - Validera lokalt och anropa onNext
  // ═══════════════════════════════════════════════════════════════════════

  const handleSubmit = () => {
    setLocalError(null);

    // Validera: minst en tjänst vald
    const services = formData.services || {};
    const hasService = Object.entries(services)
      .filter(([key]) => key !== 'annat')
      .some(([_, value]) => value === true) || (services.annat || '').trim() !== '';

    if (!hasService) {
      setLocalError('Vänligen välj minst en tjänst');
      return;
    }

    // Validera: orgnr måste finnas
    if (!formData.orgnr || formData.orgnr.trim() === '') {
      setLocalError('Vänligen ange organisationsnummer');
      return;
    }

    // Allt OK - låt GAME hantera resten
    onNext();
  };

  // ═══════════════════════════════════════════════════════════════════════
  // DERIVED VALUES
  // ═══════════════════════════════════════════════════════════════════════

  const services = formData.services || DEFAULT_FORM_STATE.services;
  const orgnr = formData.orgnr || '';
  const company_name = formData.company_name || '';
  const displayError = error || localError;
  const canEditOrgnr = !isLocked;

  // ═══════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════

  return (
    <div className="max-w-5xl mx-auto p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-brand-900 mb-3">
          Välkommen – Låt oss börja med det viktigaste
        </h1>
        <p className="text-lg text-gray-600">
          Vilka tjänster behöver ditt företag? Vi skapar ett skräddarsytt förslag baserat på dina val.
        </p>
        
        {/* Sync Status Indicator */}
        {syncStatus === 'saving' && (
          <div className="mt-4 p-3 bg-brand-50 border border-brand-200 rounded-lg flex items-center gap-2">
            <svg className="w-4 h-4 text-brand-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <p className="text-sm text-brand-700">Sparar...</p>
          </div>
        )}
        {syncStatus === 'saved' && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-sm text-green-700">Sparat</p>
          </div>
        )}
        {syncStatus === 'conflict' && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
            <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm text-amber-700">Data har uppdaterats från servern</p>
          </div>
        )}
        {syncStatus === 'offline' && (
          <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-700">📴 Arbetar offline – data sparas lokalt</p>
          </div>
        )}
      </div>

      {/* Section 1: Service Selection */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-5">
          <span className="flex items-center justify-center w-8 h-8 bg-brand-600 text-white rounded-full font-bold text-sm">
            1
          </span>
          <h2 className="text-xl font-semibold text-gray-900">
            Vilka tjänster behöver ditt företag?
          </h2>
        </div>

        <p className="text-gray-600 mb-6 ml-11">
          Välj de tjänster som passar ditt företags behov. Vi beräknar en uppskattad kostnad baserat på dina val.
        </p>

        {/* Service checkboxes grid */}
        <div className="ml-11 grid grid-cols-1 md:grid-cols-2 gap-4">
          {SERVICE_OPTIONS.map((service) => (
            <label
              key={service.key}
              className="flex items-start gap-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={services[service.key] || false}
                onChange={(e) => handleServiceChange(service.key, e.target.checked)}
                className="mt-1 w-5 h-5 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
              />
              <div className="flex-1">
                <span className="block font-medium text-gray-900">{service.label}</span>
                <span className="text-sm text-gray-500">{service.price}</span>
              </div>
            </label>
          ))}
        </div>

        {/* Other services textarea */}
        <div className="ml-11 mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Annat (specificera andra tjänster):
          </label>
          <textarea
            value={services.annat || ''}
            onChange={(e) => handleAnnatChange(e.target.value)}
            placeholder="T.ex. Succession till nästa generation, företagsanalys, etc."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>
      </div>

      {/* Section 1B: Organisationsnummer */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex items-center justify-center w-8 h-8 bg-brand-600 text-white rounded-full font-bold text-sm">
                1B
              </span>
              <h2 className="text-xl font-semibold text-gray-900">
                Företagets organisationsnummer
              </h2>
            </div>
            <p className="text-gray-600 mb-6 ml-11">
              Ange ditt företags organisationsnummer för att vi ska kunna hämta företagsdata från offentliga register.
            </p>

            {/* Company name search (autocomplete) */}
            <div className="ml-11 mb-4" ref={autocompleteRef}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sök företagsnamn: <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={companyQuery}
                  onChange={(e) => handleCompanySearch(e.target.value)}
                  placeholder="Börja skriva företagsnamn..."
                  disabled={!canEditOrgnr}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 ${!canEditOrgnr ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  autoComplete="off"
                />
                {searchLoading && (
                  <div className="absolute right-3 top-2.5">
                    <div className="animate-spin h-5 w-5 border-2 border-brand-500 border-t-transparent rounded-full"></div>
                  </div>
                )}
                
                {/* Autocomplete suggestions */}
                {showSuggestions && companySuggestions.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {companySuggestions.map((company, index) => (
                      <button
                        key={index}
                        onClick={() => handleCompanySelect(company)}
                        className="w-full text-left px-4 py-3 hover:bg-brand-50 border-b border-gray-100 last:border-b-0 transition-colors"
                      >
                        <div className="font-medium text-gray-900">{company.name}</div>
                        <div className="text-sm text-gray-600 mt-0.5">
                          {company.orgnr} • {company.city || 'Okänd stad'} • {company.org_form}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                
                {showSuggestions && companySuggestions.length === 0 && !searchLoading && companyQuery.length >= 2 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center text-gray-500">
                    Inga företag hittades
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                ✅ Söker i 2.9 miljoner företag från Bolagsverket
              </p>
            </div>

            {/* Organisationsnummer input */}
            <div className="ml-11">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organisationsnummer: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={orgnr}
                onChange={(e) => handleOrgnrChange(e.target.value)}
                placeholder="NNNNNN-NNNN"
                maxLength={11}
                readOnly={company_name !== '' || !canEditOrgnr}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 ${
                  (company_name !== '' || !canEditOrgnr) ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
              />
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                {!canEditOrgnr ? (
                  <><Lock className="w-4 h-4 text-gray-500" /> Organisationsnummer är låst efter att onboardingen startats</>
                ) : company_name !== '' ? (
                  <>✅ Fylls i automatiskt från valt företag</>
                ) : (
                  'Format: 556903-8671 (bindestreck valfritt)'
                )}
              </p>
            </div>
          </div>

          {/* Info button */}
          <button
            onClick={() => toggleSection('orgnr')}
            className="flex-shrink-0 ml-4 p-2 text-brand-600 hover:bg-brand-50 rounded-full transition-colors"
            title="Varför samlar vi in detta?"
          >
            <Info className="w-5 h-5" />
          </button>
        </div>

        {/* Expandable explanation */}
        {expandedSections.orgnr && (
          <div className="mt-4 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-lg ml-11">
            <h3 className="font-semibold text-gray-900 mb-2">Varför behöver vi detta?</h3>
            <p className="text-sm text-gray-700 mb-3">
              Organisationsnummer krävs för att identifiera ditt företag och hämta data från offentliga register.
            </p>
            <h3 className="font-semibold text-gray-900 mt-4 mb-2">Juridisk grund (Penningtvättslagen):</h3>
            <p className="text-sm text-gray-700">
              Organisationsnummer är grunden för identifiering av juridisk person enligt 
              <strong> 3 kap. 7 § PTL</strong>.
            </p>
          </div>
        )}
      </div>

      {/* Section 2: Why tough questions */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex items-center justify-center w-8 h-8 bg-brand-600 text-white rounded-full font-bold text-sm">
                2
              </span>
              <h2 className="text-xl font-semibold text-gray-900">
                Varför kommer vi att ställa vissa fördjupade frågor?
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed ml-11">
              För att vi ska kunna ta oss an ditt uppdrag måste vi säkerställa att byrån uppfyller <strong>penningtvättslagstiftningens krav</strong>.
            </p>
          </div>
          
          <button
            onClick={() => toggleSection('intro')}
            className="ml-4 flex-shrink-0 w-10 h-10 flex items-center justify-center transition-colors group"
          >
            <Info className="w-6 h-6 text-brand-600 group-hover:text-brand-700" />
          </button>
        </div>

        {expandedSections.intro && (
          <div className="ml-11 mt-4 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg">
            <p className="text-sm italic text-gray-700 mb-3">
              <strong>Viktiga juridiska aspekter:</strong>
            </p>
            <ul className="text-sm italic text-gray-600 space-y-2 list-disc list-inside">
              <li>Även ageranden som inte sker i syfte att tvätta pengar kan bestraffas</li>
              <li>Brottet näringspenningtvätt enligt 1 kap. 7§ innebär att risktagande gjorts straffbart</li>
            </ul>
          </div>
        )}
      </div>

      {/* Section 3: Sanctions */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex items-center justify-center w-8 h-8 bg-brand-600 text-white rounded-full font-bold text-sm">
                3
              </span>
              <h2 className="text-xl font-semibold text-gray-900">
                Sanktioner vid bristande efterlevnad
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed ml-11">
              Länsstyrelserna kan utfärda <strong>sanktionsavgifter</strong> upp till <span className="text-red-600 font-semibold">en miljon euro</span>.
            </p>
          </div>
          
          <button
            onClick={() => toggleSection('sanctions')}
            className="ml-4 flex-shrink-0 w-10 h-10 flex items-center justify-center transition-colors group"
          >
            <Info className="w-6 h-6 text-brand-600 group-hover:text-brand-700" />
          </button>
        </div>

        {expandedSections.sanctions && (
          <div className="ml-11 mt-4 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg">
            <p className="text-sm font-semibold text-gray-800 mb-3">
              7 kap. 14-16 §§ PTL (2017:630) – Sanktionsavgift
            </p>
            <p className="text-sm text-gray-700">
              Sanktionsavgiften för en juridisk person ska som högst fastställas till 
              <strong className="text-red-600"> en miljon euro</strong> eller två gånger vinsten.
            </p>
          </div>
        )}
      </div>

      {/* Error message */}
      {displayError && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
          <p className="text-red-800 font-medium">{displayError}</p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          Steg 1 av 7 – Uppdragsval
        </p>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="px-8 py-3 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-400 text-white font-semibold rounded-lg shadow-md transition-colors"
        >
          {isLoading ? 'Sparar...' : 'Fortsätt →'}
        </button>
      </div>

      {/* Footer note */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>
          Alla uppgifter sparas säkert och följer <strong>GDPR</strong> och <strong>penningtvättslagen (PTL 2017:630)</strong>
        </p>
      </div>
    </div>
  );
}
