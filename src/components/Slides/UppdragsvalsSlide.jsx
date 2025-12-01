import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import useSlideStateController from '../../hooks/useSlideStateController';
import useQuestionnaireForm from '../../hooks/useQuestionnaireForm';
import { searchCompanies } from '../../data/companySearchAPI';
import { fetchWithAuth } from '../../utils/auth';
import { migrateTempToRealCaseId } from '../../utils/storageKeys';
import { API_URL as API_BASE } from '../../config/api';

/**
 * Content Slide 1: Uppdragsval och introduktion
 * 
 * Skapar/uppdaterar onboarding-process via /commit endpoint.
 * API: POST /api/onboarding/commit
 * 
 * 🆕 2025-12-01: Migrerat från /uppdrag till /commit
 * /commit hanterar BÅDA scenarion automatiskt:
 *   A) temp_case_id (från login) → skapar company + case
 *   B) befintligt case_id → uppdaterar services
 * 
 * Features:
 * - Sektionsbaserad layout med numrerade steg
 * - Runda info-knappar (ⓘ) med utfällbar lagtext
 * - 9 tjänsteval som checkboxes
 * - Beräknar uppskattad kostnad
 * - Returnerar onboardingId (UUID) från backend
 * - Sparar och laddar tillbaka val från localStorage (USER-SCOPED)
 * 
 * UPDATED: 2025-12-01 - Använder /commit istället för /uppdrag
 */

// Question configuration for useQuestionnaireForm
const QUESTIONS_CONFIG = {
  entireForm: { type: 'object', required: false }
};

export default function UppdragsvalsSlide({ onNext }) {
  // 🆕 MASTER/SLAVE Pattern: MASTER fetches and decides data source
  const { 
    initialData, 
    isReady, 
    source, 
    metadata 
  } = useSlideStateController('uppdragsval');

  // 🆕 SLAVE receives data - auto-save blocked until initialData is applied
  const {
    formData,
    updateQuestion,
    isValid,
    errors,
    isLoading: syncLoading,
    syncStatus,
    pushToServer,
    canEditOrgnr,  // NEW: From state machine - false when is_locked=true
    initialDataApplied,
  } = useQuestionnaireForm(
    'uppdragsval',
    QUESTIONS_CONFIG,
    { initialData, isReady, source, caseMetadata: metadata }
  );

  // Expandable sections state
  const [expandedSections, setExpandedSections] = useState({
    intro: false,
    sanctions: false,
    orgnr: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Extract values from entireForm (simplified: no wrapping)
  const formState = formData.entireForm || {
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
    companyName: ''
  };
  const services = formState.services;
  const orgnr = formState.orgnr;
  const companyName = formState.companyName;

  // Autocomplete state (now companyName is defined)
  const [companyQuery, setCompanyQuery] = useState(companyName || '');
  const [companySuggestions, setCompanySuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
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

  // Sync companyQuery with formData
  useEffect(() => {
    setCompanyQuery(companyName || '');
  }, [companyName]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleServiceChange = (service, value) => {
    const updatedServices = { ...services, [service]: value };
    updateQuestion('entireForm', { ...formState, services: updatedServices });
  };

  const handleOrgnrChange = (value) => {
    updateQuestion('entireForm', { ...formState, orgnr: value });
  };

  const handleCompanyNameChange = (value) => {
    updateQuestion('entireForm', { ...formState, companyName: value });
  };

  const handleCompanySearch = async (query) => {
    setCompanyQuery(query);
    
    if (query.trim() === '') {
      setCompanySuggestions([]);
      setShowSuggestions(false);
      updateQuestion('entireForm', { ...formState, companyName: '', orgnr: '' });
      return;
    }
    
    if (query.length >= 2) {
      setSearchLoading(true);
      try {
        const results = await searchCompanies(query, 10);
        setCompanySuggestions(results);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Company search failed:', error);
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
    setCompanyQuery(company.name);
    updateQuestion('entireForm', { ...formState, companyName: company.name, orgnr: company.orgnr });
    setShowSuggestions(false);
  };

  const handleSubmit = async () => {
    // Validate at least one service selected
    const hasService = Object.entries(services)
      .filter(([key]) => key !== 'annat')
      .some(([_, value]) => value === true) || services.annat.trim() !== '';

    if (!hasService) {
      setError('Vänligen välj minst en tjänst');
      return;
    }

    // Hook validation for orgnr
    if (!isValid) {
      setError(errors.orgnr || 'Vänligen fyll i alla obligatoriska fält');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Push to server with version control
      await pushToServer();

      // 🆕 2025-12-01: Använd /commit endpoint istället för /uppdrag
      // /commit hanterar BÅDA scenarion:
      //   A) temp_case_id → skapa ny company + case
      //   B) befintligt case_id → uppdatera services
      const tempCaseId = localStorage.getItem('temp_case_id');
      const existingOnboardingId = localStorage.getItem('onboarding_id');
      
      // Bestäm case_id att skicka
      // Prioritet: 1) Befintligt permanent case, 2) Temp case från login
      const caseIdToSend = existingOnboardingId || tempCaseId || '';
      
      // 🚗 Bil-principen: Skicka form_data som opak dict
      // Backend behandlar det utan att decomponera
      const requestBody = {
        company_id: localStorage.getItem('current_company_id') || '',  // 👑 KING
        case_id: caseIdToSend,
        orgnr: orgnr.replace('-', ''),
        company_name: companyName || '',  // snake_case!
        form_data: {  // 🚗 Opak form data
          ...services,
          orgnr: orgnr.replace('-', ''),
          companyName: companyName || '',  // Behåll originalt format i form_data
        }
      };
      
      console.log('📤 POST /onboarding/commit with case_id:', caseIdToSend);
      console.log('   Is temp:', caseIdToSend.startsWith('temp_'));
      console.log('   company_id (KING):', requestBody.company_id || '(not set - will be generated)');
      console.log('   form_data:', requestBody.form_data);
      
      const response = await fetchWithAuth(`${API_BASE}/onboarding/commit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.error || 'Något gick fel');
      }

      const data = await response.json();
      
      // Log om case var nytt eller återanvänt (snake_case from API)
      if (data.was_temp) {
        console.log('✨ Transformerade temp → permanent case:', data.onboarding_id);
      } else if (data.is_new_case === false) {
        console.log('♻️ Uppdaterade befintligt case:', data.onboarding_id);
      } else {
        console.log('✨ Skapade nytt case:', data.onboarding_id);
      }
      
      // 🆕 2025-12-01: Migrera temp-nycklar till permanent case_id
      if (tempCaseId && data.onboarding_id && tempCaseId !== data.onboarding_id) {
        const migratedCount = migrateTempToRealCaseId(tempCaseId, data.onboarding_id);
        console.log(`🔄 Migrated ${migratedCount} temp keys to permanent case: ${data.onboarding_id}`);
        // Rensa temp_case_id från localStorage - vi har nu permanent case
        localStorage.removeItem('temp_case_id');
      }
      
      // Store critical data in localStorage for subsequent API calls and UI display
      localStorage.setItem('onboarding_id', data.onboarding_id);
      localStorage.setItem('current_company_id', data.company_id);
      localStorage.setItem('current_company_name', data.company_name || '');
      localStorage.setItem('current_orgnr', data.orgnr || '');
      
      console.log('✅ Uppdragsval sparat:', data);
      console.log('📋 onboarding_id:', data.onboarding_id);
      console.log('🏢 company_id:', data.company_id);
      console.log('🏷️ company_name:', data.company_name);
      console.log('🔢 orgnr:', data.orgnr);
      console.log('💰 Uppskattad kostnad:', data.uppskattad_kostnad);
      console.log('📝 Valda tjänster:', data.selected_services);
      
      // Navigate to next step
      onNext(data);
    } catch (err) {
      console.error('❌ Error:', err);
      // 🆕 Användarvänliga felmeddelanden för vanliga fel
      if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
        setError('Ingen internetanslutning. Kontrollera din nätverksanslutning och försök igen.');
      } else if (err.message.includes('NetworkError') || err.message.includes('network')) {
        setError('Nätverksfel uppstod. Kontrollera din internetanslutning.');
      } else if (err.message.includes('timeout') || err.message.includes('Timeout')) {
        setError('Servern svarar inte. Försök igen om en stund.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

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
        {syncLoading && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-box">
            <p className="text-sm text-blue-700">🔄 Synkroniserar data...</p>
          </div>
        )}
        {syncStatus === 'conflict' && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-box">
            <p className="text-sm text-amber-700">⚠️ Data har uppdaterats från servern (nyare version)</p>
          </div>
        )}
        {syncStatus === 'restored' && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-box">
            <p className="text-sm text-green-700">♻️ Data återställd från servern</p>
          </div>
        )}
        {syncStatus === 'offline' && (
          <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-box">
            <p className="text-sm text-gray-700">📴 Arbetar offline – data sparas lokalt</p>
          </div>
        )}
      </div>

      {/* Section 1: Service Selection (FIRST - Customer-centric!) */}
      <div className="bg-white rounded-box shadow-md border border-gray-200 p-6 mb-6">
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
          {[
            { key: 'lopandeBokforing', label: 'Löpande bokföring', price: '5000 kr/år' },
            { key: 'arsbokslut', label: 'Årsbokslut', price: '8000 kr/år' },
            { key: 'deklarationer', label: 'Deklarationer (moms, arbetsgivardeklaration, inkomstdeklaration)', price: '3000 kr/år' },
            { key: 'loneadministration', label: 'Löneadministration', price: '4000 kr/år' },
            { key: 'ekonomiskRadgivning', label: 'Ekonomisk rådgivning', price: '10000 kr/år' },
            { key: 'foretagsregistrering', label: 'Företagsregistrering (nystartad verksamhet)', price: '15000 kr (engångsavgift)' },
            { key: 'finansiellRapportering', label: 'Finansiell rapportering och analys', price: '6000 kr/år' },
            { key: 'foretagsforsaljning', label: 'Företagsförsäljning/succession', price: 'Offert' },
          ].map((service) => (
            <label
              key={service.key}
              className="flex items-start gap-3 p-4 border border-gray-300 rounded-box hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={services[service.key]}
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
            value={services.annat}
            onChange={(e) => handleServiceChange('annat', e.target.value)}
            placeholder="T.ex. Succession till nästa generation, företagsanalys, etc."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-box focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>
      </div>

      {/* NEW SECTION 1B: Organisationsnummer (moved from Riskfrågor steg 1) */}
      <div className="bg-white rounded-box shadow-md border border-gray-200 p-6 mb-6">
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

            {/* Company name search (autocomplete from Bolagsverket) */}
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
                  className={`w-full px-4 py-2 border border-gray-300 rounded-box focus:ring-2 focus:ring-brand-500 focus:border-brand-500 ${!canEditOrgnr ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  autoComplete="off"
                />
                {searchLoading && (
                  <div className="absolute right-3 top-2.5">
                    <div className="animate-spin h-5 w-5 border-2 border-brand-500 border-t-transparent rounded-full"></div>
                  </div>
                )}
                
                {/* Autocomplete suggestions */}
                {showSuggestions && companySuggestions.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-box shadow-lg max-h-60 overflow-y-auto">
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
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-box shadow-lg p-4 text-center text-gray-500">
                    Inga företag hittades
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                ✅ Söker i 2.9 miljoner företag från Bolagsverket (uppdateras veckovis)
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
                readOnly={companyName !== '' || !canEditOrgnr}
                className={`w-full px-4 py-2 border border-gray-300 rounded-box focus:ring-2 focus:ring-brand-500 focus:border-brand-500 ${
                  (companyName !== '' || !canEditOrgnr) ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
              />
              <p className="text-sm text-gray-500 mt-1">
                {!canEditOrgnr
                  ? '🔒 Organisationsnummer är låst efter att onboardingen startats'
                  : companyName !== '' 
                    ? '✅ Fylls i automatiskt från valt företag' 
                    : 'Format: 556903-8671 (bindestreck valfritt)'}
              </p>
              {errors.orgnr && (
                <p className="text-sm text-red-500 mt-1">{errors.orgnr}</p>
              )}
            </div>
          </div>

          {/* Info button - Why we collect this */}
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
          <div className="mt-4 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-box ml-11">
            <h3 className="font-semibold text-gray-900 mb-2">Arkitektonisk anledning:</h3>
            <p className="text-sm text-gray-700 mb-3">
              Organisationsnummer krävs för att skapa företagsmappen i backend-systemet 
              (<code className="bg-gray-100 px-1 py-0.5 rounded">data/{'{user_id}'}/{'{orgnr}'}/</code>). 
              Detta möjliggör:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-4">
              <li><strong>"Parkera och Avsluta"</strong> – Spara onboarding-session för senare</li>
              <li><strong>Partiell datainsamling</strong> – Spara progress även om användaren avbryter</li>
              <li><strong>Strukturerad datalagring</strong> – Alla företagsdata organiseras per orgnr</li>
            </ul>
            
            <h3 className="font-semibold text-gray-900 mt-4 mb-2">Juridisk grund (Penningtvättslagen):</h3>
            <p className="text-sm text-gray-700">
              Organisationsnummer är grunden för identifiering av juridisk person enligt 
              <strong> 3 kap. 7 § PTL</strong> och <strong>01FS 2024:20, 3 kap. 3 §</strong>.
            </p>
            <p className="text-sm text-gray-700 mt-2">
              Vi måste kontrollera identiteten genom oberoende källor (Bolagsverket = 
              offentligt register = tillförlitlig källa). Denna kontroll måste dokumenteras 
              och sparas, oavsett om vi känner kunden sedan tidigare.
            </p>
          </div>
        )}
      </div>

      {/* Section 2: Why we need to ask tough questions */}
      <div className="bg-white rounded-box shadow-md border border-gray-200 p-6 mb-6">
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
              För att vi ska kunna ta oss an ditt uppdrag måste vi säkerställa att byrån uppfyller <strong>penningtvättslagstiftningens krav</strong> vid 
              antagandet av nya kunder. Processen efterlever tillsynsmyndighetens krav där verksamhetsutövaren (byrån) 
              är skyldig att redovisa hur man säkerställt att byrån inte gör sig skyldig till penningtvätt.
            </p>
            <p className="text-gray-700 leading-relaxed ml-11 mt-3">
              <strong>Länsstyrelserna</strong>, som ansvarar för tillsynen, har skärpt kraven på redovisningsbyråer 
              och utfärdar <span className="text-red-600 font-semibold">sanktionsavgifter på hundratusentals kronor</span> vid 
              bristande efterlevnad.
            </p>
          </div>
          
          {/* Info button - Fortnox style (no background, brand colors) */}
          <button
            onClick={() => toggleSection('intro')}
            className="ml-4 flex-shrink-0 w-10 h-10 flex items-center justify-center transition-colors group"
            aria-label="Visa lagtext"
          >
            <Info className="w-6 h-6 text-brand-600 group-hover:text-brand-700" />
          </button>
        </div>

        {/* Expandable legal text - YELLOW/AMBER consistently */}
        {expandedSections.intro && (
          <div className="ml-11 mt-4 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg">
            <p className="text-sm italic text-gray-700 mb-3">
              <strong>Viktiga juridiska aspekter:</strong>
            </p>
            <ul className="text-sm italic text-gray-600 space-y-2 list-disc list-inside">
              <li>
                Även ageranden som <strong>inte sker i ett bevisat syfte att tvätta pengar</strong> kan bestraffas
              </li>
              <li>
                Även agerande som <strong>inte har med illegal egendom att göra</strong> kan bestraffas enligt lagen, 
                om de anses vara tillräckligt riskfyllda
              </li>
              <li>
                Brottet <strong>näringspenningtvätt enligt 1 kap. 7§ penningtvättsbrottlagen</strong> innebär att ett 
                så kallat klandervärt risktagande gjorts straffbart
              </li>
            </ul>
            <p className="text-xs text-gray-500 mt-3">
              Källa: <em>Penningtvätt och Straffrätten - EN HANDBOK</em>, sid. 44<br />
              Marie Wallin, jurist, tidigare kammaråklagare och specialist inom finansiell brottslighet
            </p>
          </div>
        )}
      </div>

      {/* Section 3: Sanctions */}
      <div className="bg-white rounded-box shadow-md border border-gray-200 p-6 mb-8">
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
              Länsstyrelserna har möjlighet att utfärda <strong>sanktionsavgifter</strong> som kan uppgå till 
              mycket stora belopp för både företag och enskilda personer.
            </p>
          </div>
          
          {/* Info button - Fortnox style (no background, brand colors) */}
          <button
            onClick={() => toggleSection('sanctions')}
            className="ml-4 flex-shrink-0 w-10 h-10 flex items-center justify-center transition-colors group"
            aria-label="Visa lagtext"
          >
            <Info className="w-6 h-6 text-brand-600 group-hover:text-brand-700" />
          </button>
        </div>

        {/* Expandable legal text - YELLOW/AMBER consistently */}
        {expandedSections.sanctions && (
          <div className="ml-11 mt-4 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg">
            <p className="text-sm font-semibold text-gray-800 mb-3">
              7 kap. 14-16 §§ PTL (2017:630) – Sanktionsavgift
            </p>
            
            <div className="space-y-4 text-sm italic text-gray-700">
              <div>
                <p className="font-semibold text-gray-800 not-italic mb-1">14 § Juridisk person</p>
                <p>
                  Sanktionsavgiften för en verksamhetsutövare som är en juridisk person ska som högst fastställas till det högsta av:
                </p>
                <ol className="list-decimal list-inside ml-4 mt-2 space-y-1">
                  <li>två gånger den vinst som verksamhetsutövaren gjort till följd av överträdelsen, om beloppet går att fastställa, eller</li>
                  <li>ett belopp i kronor motsvarande <strong className="text-red-600 not-italic">en miljon euro</strong>.</li>
                </ol>
                <p className="mt-2">
                  Sanktionsavgiften får inte bestämmas till ett lägre belopp än <strong className="not-italic">5 000 kronor</strong>.
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-800 not-italic mb-1">15 § Fysisk person</p>
                <p>
                  Sanktionsavgiften för en fysisk person ska som högst fastställas till det högsta av:
                </p>
                <ol className="list-decimal list-inside ml-4 mt-2 space-y-1">
                  <li>två gånger den vinst som den fysiska personen gjort till följd av överträdelsen, om beloppet går att fastställa, eller</li>
                  <li>ett belopp i kronor motsvarande <strong className="text-red-600 not-italic">en miljon euro</strong>.</li>
                </ol>
              </div>

              <div>
                <p className="font-semibold text-gray-800 not-italic mb-1">16 § Bedömning av avgiftens storlek</p>
                <p>
                  När sanktionsavgiftens storlek fastställs, ska särskild hänsyn tas till sådana omständigheter som anges i 13 § 
                  samt till den juridiska eller fysiska personens <strong className="not-italic">finansiella ställning</strong> och, 
                  om det går att fastställa, den vinst som gjorts till följd av överträdelsen.
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-3 not-italic">
              Avgiften tillfaller staten.
            </p>
          </div>
        )}
      </div>
      

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
          <p className="text-red-800 font-medium">{error}</p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          Steg 1 av 7 – Uppdragsval
        </p>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-8 py-3 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-400 text-white font-semibold rounded-box shadow-md transition-colors"
        >
          {loading ? 'Sparar...' : 'Fortsätt →'}
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
