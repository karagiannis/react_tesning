import { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';

/**
 * Content Slide 1: Uppdragsval och introduktion
 * 
 * Skapar ny onboarding-process och returnerar UUID.
 * API: POST /api/onboarding/uppdrag
 * 
 * Features:
 * - Sektionsbaserad layout med numrerade steg
 * - Runda info-knappar (ⓘ) med utfällbar lagtext
 * - 9 tjänsteval som checkboxes
 * - Beräknar uppskattad kostnad
 * - Returnerar onboardingId (UUID) från backend
 */

export default function UppdragsvalsSlide({ onNext }) {
  // Expandable sections state
  const [expandedSections, setExpandedSections] = useState({
    intro: false,
    sanctions: false,
  });

  // Service selections
  const [services, setServices] = useState({
    lopandeBokforing: false,
    arsbokslut: false,
    deklarationer: false,
    loneadministration: false,
    ekonomiskRadgivning: false,
    foretagsregistrering: false,
    finansiellRapportering: false,
    foretagsforsaljning: false,
    annat: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleServiceChange = (service, value) => {
    setServices(prev => ({
      ...prev,
      [service]: value
    }));
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

    setLoading(true);
    setError(null);

    try {
      // Get JWT token from localStorage
      const token = localStorage.getItem('access_token');
      
      const response = await fetch('http://localhost:8000/api/onboarding/uppdrag', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(services),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Något gick fel');
      }

      const data = await response.json();
      
      // Store onboardingId in localStorage for subsequent API calls
      localStorage.setItem('onboardingId', data.onboardingId);
      
      console.log('✅ Onboarding-process skapad:', data);
      console.log('📋 onboardingId:', data.onboardingId);
      console.log('💰 Uppskattad kostnad:', data.uppskattadKostnad);
      
      // Navigate to next step
      onNext(data);
    } catch (err) {
      console.error('❌ Error:', err);
      setError(err.message);
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
      </div>

      {/* Section 1: Service Selection (FIRST - Customer-centric!) */}
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
              className="flex items-start gap-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>
      </div>

      {/* Section 2: Why we need to ask tough questions */}
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
          className="px-8 py-3 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-400 text-white font-semibold rounded-lg shadow-md transition-colors"
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
