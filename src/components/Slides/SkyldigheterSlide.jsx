import { useState, useEffect } from 'react';
import { legalTexts } from '../../data/legalTexts';
import useQuestionnaireForm from '../../legacy/hooks/useQuestionnaireForm';

export default function SkyldigheterSlide({ onNext, onBack }) {
  const { companyId } = useParams();
  
  const QUESTIONS_CONFIG = {
    entireForm: { type: 'object', required: false }
  };

  const { formData: savedFormData, updateQuestion, pushToServer } = useQuestionnaireForm(
    'skyldigheter',
    QUESTIONS_CONFIG
  );

  // Load from formData or use defaults
  const [acknowledged, setAcknowledged] = useState(savedFormData?.entireForm?.acknowledged || false);
  const [showComplianceModal, setShowComplianceModal] = useState(false);
  const [complianceChecks, setComplianceChecks] = useState(
    savedFormData?.entireForm?.complianceChecks || {
      kontanter: false,
      vinstmarginal: false,
      betalningUtanFaktura: false,
      fakturaSpecifikation: false,
      agarlån: false
    }
  );

  // Sync state changes to formData
  useEffect(() => {
    updateQuestion('entireForm', { acknowledged, complianceChecks });
  }, [acknowledged, complianceChecks]);

  // Check if all compliance items are checked
  const allComplianceChecked = Object.values(complianceChecks).every(v => v);

  const skyldigheter = [
    {
      title: 'Faktura och förenklad faktura',
      description: 'Korrekt utseende enligt Skatteverkets regler',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      title: 'Arkivering av bokföringsmaterial',
      description: 'Minst sju år enligt bokföringslagen',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      )
    },
    {
      title: 'Korrekta och fullständiga uppgifter',
      description: 'Lämna aktuella uppgifter till byrån',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Underlag i tid',
      description: 'Inkomma med begärda underlag enligt överenskomna tidsfrister',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Rapportera förändringar omgående',
      description: 'Verksamhetsförändringar eller annan relevant information',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      )
    },
    {
      title: 'Samarbeta vid kundkännedomsfrågor',
      description: 'Svara på frågor om verksamhetens art och struktur',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      title: 'Grundläggande redovisningsskyldigheter',
      description: 'Förstå och följa bokföringslagen och skatteregler',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      title: 'Medvetenhet om avtalets giltighet',
      description: 'Samarbetet kan avslutas vid avtalsbrott eller bristande efterlevnad',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center p-8">
      <div className="max-w-6xl w-full bg-white rounded-card shadow-2xl p-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-page-title text-brand-900 mb-2 flex items-center gap-3">
            <svg className="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Kundens förväntade skyldigheter
          </h1>
          <p className="text-brand-700 text-lg">
            Efter att kunden godkänts i riskbedömningen informeras om vilka skyldigheter som gäller under samarbetet.
          </p>
        </div>

        {/* Info Banner */}
        <div className="mb-6 p-4 bg-brand-50 border-l-4 border-brand-500 rounded-r-lg">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-brand-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-brand-900 font-semibold">Viktigt att veta</p>
              <p className="text-brand-800 text-sm mt-1">
                Dessa skyldigheter regleras i uppdragsavtalet och enligt lag. De säkerställer ett smidigt samarbete och efterlevnad av redovisningskrav.
              </p>
            </div>
          </div>
        </div>

        {/* Obligations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {skyldigheter.map((skyldig, index) => (
            <div
              key={index}
              className="p-5 bg-gradient-to-br from-white to-brand-50 border border-brand-200 rounded-box hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-brand-600 text-white rounded-box flex items-center justify-center">
                  {skyldig.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">{skyldig.title}</h3>
                  <p className="text-sm text-gray-600">{skyldig.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Faktura Information Highlight */}
        <div className="mb-6 p-5 bg-yellow-50 border-2 border-yellow-400 rounded-box">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <h4 className="font-bold text-yellow-900 mb-2">Särskilt om fakturor</h4>
              <p className="text-sm text-yellow-800 mb-2">
                Fakturor och förenklade fakturor måste uppfylla Skatteverkets krav för att vara giltiga. Byrån kommer att hjälpa till med korrekta mallar och rutiner.
              </p>
              <a 
                href="https://www.skatteverket.se/foretagochorganisationer/drivaforetag/bokforingochbokslut/fakturaochkvitto.4.18e1b10334ebe8bc80003690.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-yellow-900 hover:text-yellow-700 font-semibold underline"
              >
                Läs mer på Skatteverket
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Critical Compliance Requirements - ALWAYS MANDATORY */}
        <div className="mb-6 p-6 bg-red-50 border-2 border-red-400 rounded-box">
          <div className="flex items-start gap-3 mb-4">
            <svg className="w-icon-md h-icon-md text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <h4 className="font-bold text-red-900 text-lg mb-2">⚠️ KRITISKA FÖRBUD - DETTA ÄR OLAGLIGT</h4>
              <p className="text-red-800 text-sm mb-4">
                Följande handlingar är <strong>förbjudna enligt lag</strong> och kan leda till skattetillägg, företagsbot eller till och med fängelse. 
                Redovisningsbyrån kan <strong>inte</strong> hjälpa dig om du bryter mot dessa regler.
              </p>
            </div>
          </div>

          <div className="space-y-3 pl-10">
            <div className="flex items-start gap-3 p-3 bg-white rounded border-l-4 border-red-600">
              <input
                type="checkbox"
                checked={complianceChecks.kontanter}
                onChange={(e) => setComplianceChecks({...complianceChecks, kontanter: e.target.checked})}
                className="mt-1 w-5 h-5 text-red-600 rounded focus:ring-red-500"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Kontanttransaktioner kräver kundkännedom</p>
                <p className="text-sm text-gray-700 mt-1">
                  {legalTexts.kontanttransaktioner.shortText} Redovisningsbyrån måste dokumentera och övervaka
                  kontanttransaktioner enligt <strong>01FS 2024:20, 2 kap. 4-5 §§</strong> för att kunna förklara
                  transaktionsmönster vid tillsyn från Länsstyrelsen.
                </p>
                <p className="text-xs text-red-700 mt-1 italic">
                  Lag: {legalTexts.kontanttransaktioner.law} [{legalTexts.kontanttransaktioner.id}]
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white rounded border-l-4 border-red-600">
              <input
                type="checkbox"
                checked={complianceChecks.vinstmarginal}
                onChange={(e) => setComplianceChecks({...complianceChecks, vinstmarginal: e.target.checked})}
                className="mt-1 w-5 h-5 text-red-600 rounded focus:ring-red-500"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Vinstmarginalbeskattning utan medgivande</p>
                <p className="text-sm text-gray-700 mt-1">
                  Det är <strong>OTILLÅTET att tillämpa vinstmarginalbeskattning</strong> (t.ex. vid begagnathandel) utan Skatteverkets medgivande.
                </p>
                <p className="text-xs text-red-700 mt-1 italic">Lag: Mervärdesskattelagen 9a kap</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white rounded border-l-4 border-red-600">
              <input
                type="checkbox"
                checked={complianceChecks.betalningUtanFaktura}
                onChange={(e) => setComplianceChecks({...complianceChecks, betalningUtanFaktura: e.target.checked})}
                className="mt-1 w-5 h-5 text-red-600 rounded focus:ring-red-500"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Ta emot betalning utan faktura</p>
                <p className="text-sm text-gray-700 mt-1">
                  Det är <strong>OTILLÅTET att ta emot betalning</strong> (kontant, Swish, bankgiro) <strong>utan att utfärda faktura</strong>. 
                  Alla intäkter måste dokumenteras.
                </p>
                <p className="text-xs text-red-700 mt-1 italic">Lag: Bokföringslagen 5 kap, Brottsbalken 11 kap (ekonomiska brott)</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white rounded border-l-4 border-red-600">
              <input
                type="checkbox"
                checked={complianceChecks.fakturaSpecifikation}
                onChange={(e) => setComplianceChecks({...complianceChecks, fakturaSpecifikation: e.target.checked})}
                className="mt-1 w-5 h-5 text-red-600 rounded focus:ring-red-500"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Faktura utan fullständig specifikation</p>
                <p className="text-sm text-gray-700 mt-1">
                  Fakturor <strong>MÅSTE specificera</strong>: vad som gjorts, vad som levererats, antal, pris per enhet, timmar, moms.
                  Vaga beskrivningar som "Diverse arbete" är <strong>inte godkända</strong>.
                </p>
                <p className="text-xs text-red-700 mt-1 italic">Lag: Mervärdesskattelagen 11 kap 1 §, Bokföringslagen 5 kap</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white rounded border-l-4 border-red-600">
              <input
                type="checkbox"
                checked={complianceChecks.agarlån}
                onChange={(e) => setComplianceChecks({...complianceChecks, agarlån: e.target.checked})}
                className="mt-1 w-5 h-5 text-red-600 rounded focus:ring-red-500"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Otillåtna lån från företaget</p>
                <p className="text-sm text-gray-700 mt-1">
                  Det är <strong>FÖRBJUDET</strong> för företaget att låna ut pengar till ägare, styrelseledamöter, VD eller närstående. 
                  Privata uttag måste bokföras som lön/utdelning (med skatt) eller som återbetalning av tidigare aktieägartillskott.
                </p>
                <p className="text-xs text-red-700 mt-1 italic">Lag: Aktiebolagslagen 21 kap 1 § (straffbart med böter eller fängelse)</p>
              </div>
            </div>
          </div>

          {!allComplianceChecked && (
            <div className="mt-4 p-3 bg-red-100 rounded-box border border-red-300">
              <p className="text-sm text-red-900 font-semibold text-center">
                ⚠️ Du måste bekräfta alla punkter ovan för att kunna fortsätta
              </p>
            </div>
          )}
        </div>

        {/* Button: Custom Compliance Questions (from config.json) */}
        <div className="mb-6">
          <button
            onClick={() => setShowComplianceModal(true)}
            className="w-full flex items-center justify-between gap-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 border-2 border-purple-300 rounded-box hover:from-purple-100 hover:to-purple-200 transition-all"
          >
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div className="text-left">
                <p className="font-semibold text-purple-900">Byråns egna kontrollfrågor</p>
                <p className="text-sm text-purple-700">Klicka för att se branschspecifika regler och varningar</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Acknowledgement Checkbox */}
        <div className="mb-6 p-5 bg-gray-50 rounded-box border border-gray-300">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
              className="mt-1 w-5 h-5 text-brand-600 rounded focus:ring-brand-500"
            />
            <span className="text-gray-800">
              Jag har tagit del av och förstår mina skyldigheter som kund enligt uppdragsavtalet och gällande lagstiftning. 
              Jag har läst och förstått de <strong>kritiska förbuden</strong> ovan och förbinder mig att <strong>ALDRIG</strong> bryta mot dessa regler.
              Jag är medveten om att brott mot dessa regler kan leda till uppsägning av avtal och juridiska konsekvenser.
            </span>
          </label>
        </div>

        {/* Legal Note */}
        <div className="mb-6 p-4 bg-gray-100 rounded-box border border-gray-300">
          <p className="text-sm text-gray-700 italic text-center">
            📋 Dessa skyldigheter regleras i uppdragsavtalet och enligt lag (t.ex. bokföringslagen 1999:1078)
          </p>
        </div>

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
            onClick={async () => {
              await pushToServer();
              onNext();
            }}
            disabled={!acknowledged || !allComplianceChecked}
            className={`flex items-center gap-2 px-6 py-3 rounded-box transition-all font-semibold shadow-lg ${
              acknowledged && allComplianceChecked
                ? 'bg-brand-600 text-white hover:bg-brand-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            title={!allComplianceChecked ? "Du måste bekräfta alla kritiska förbud först" : ""}
          >
            Gå vidare till avtal
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Modal: Custom Compliance Questions */}
      {showComplianceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-card shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <h2 className="text-page-title text-gray-900 flex items-center gap-2">
                  <svg className="w-icon-md h-icon-md text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Byråns egna kontrollfrågor
                </h2>
                <button
                  onClick={() => setShowComplianceModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Info about config.json */}
              <div className="mb-6 p-4 bg-brand-50 border-l-4 border-brand-500 rounded-r-lg">
                <p className="text-brand-900 font-semibold mb-2">💡 Funktionalitet under utveckling</p>
                <p className="text-sm text-brand-800">
                  Denna funktion låter redovisningsbyrån lägga till egna branschspecifika kontrollfrågor via <code className="bg-brand-100 px-1 rounded">config.json</code>.
                  Kunden måste bekräfta alla frågor innan onboarding kan slutföras.
                </p>
              </div>

              {/* Example questions (will be loaded from config.json later) */}
              <div className="space-y-4">
                <h3 className="font-bold text-gray-900 text-lg mb-3">Exempel på egna kontrollfrågor:</h3>
                
                <div className="p-4 bg-gray-50 border border-gray-300 rounded-box">
                  <p className="text-sm text-gray-600 italic">
                    📋 <strong>Restaurangbranschen:</strong> "Har du kassaregister som uppfyller Skatteverkets krav? (Obligatoriskt sedan 2010)"
                  </p>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-300 rounded-box">
                  <p className="text-sm text-gray-600 italic">
                    📋 <strong>Byggsektorn:</strong> "Är du medveten om F-skattsedel och RUT/ROT-regler vid arbete på privatbostäder?"
                  </p>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-300 rounded-box">
                  <p className="text-sm text-gray-600 italic">
                    📋 <strong>E-handel:</strong> "Säljer du till andra EU-länder? (MOSS/OSS-registrering kan krävas)"
                  </p>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-300 rounded-box">
                  <p className="text-sm text-gray-600 italic">
                    📋 <strong>Fordonshandel:</strong> "Tillämpar du vinstmarginalbeskattning vid begagnathandel? (Kräver Skatteverkets medgivande)"
                  </p>
                </div>
              </div>

              {/* Technical info */}
              <div className="mt-6 p-4 bg-purple-50 border border-purple-300 rounded-box">
                <h4 className="font-semibold text-purple-900 mb-2">🛠️ Teknisk implementation (v2.0)</h4>
                <p className="text-sm text-purple-800 mb-2">
                  Redovisningsbyrån kan konfigurera egna frågor i <code className="bg-purple-100 px-1 rounded">config.json</code>:
                </p>
                <pre className="text-xs bg-purple-100 p-3 rounded overflow-x-auto">
{`{
  "customComplianceQuestions": [
    {
      "id": "cash-handling-2025",
      "question": "Otillåtet hantera kontanter...",
      "category": "payment-methods",
      "severity": "critical",
      "legalReference": "Skatteförfarandelagen 39 kap"
    }
  ]
}`}
                </pre>
              </div>

              {/* Close button */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowComplianceModal(false)}
                  className="px-6 py-3 bg-purple-600 text-white rounded-box hover:bg-purple-700 transition-all font-semibold"
                >
                  Stäng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
