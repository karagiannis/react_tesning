// Slide 29: Löpande rutiner
// Ongoing processes for KYC updates, risk reassessment, document submission schedules

import { useState } from 'react';

export default function OngoingRoutinesSlide({ onNext, onBack }) {
  const [expandedSection, setExpandedSection] = useState(null);

  const routines = [
    {
      id: 'kyc-updates',
      icon: '🔄',
      title: 'KYC-uppdateringar',
      frequency: 'Årligen',
      color: 'blue',
      description: 'Vi kontrollerar och uppdaterar kundinformation regelbundet enligt regelverket.',
      details: [
        'Bekräfta ägarstruktur (förändringar i ägande över 25%)',
        'Uppdatera kontaktinformation för verkliga huvudmän',
        'Verifiera verksamhetsbeskrivning och SNI-kod',
        'Granska eventuella förändringar i styrelsens sammansättning',
        'Dokumentera ändringar i företagets riskprofil'
      ],
      timeline: 'Vi skickar ut formulär via e-post 30 dagar innan årsdagen'
    },
    {
      id: 'risk-assessment',
      icon: '🛡️',
      title: 'Årlig riskbedömning',
      frequency: 'Årligen',
      color: 'green',
      description: 'Återkommande bedömning av företagets riskprofil enligt penningtvättslagen.',
      details: [
        'Genomgång av transaktionsmönster från det senaste året',
        'Analys av nya affärsrelationer och jurisdiktioner',
        'Kontroll mot uppdaterade sanktionslistor (EU, UN, OFAC)',
        'Bedömning av PEP-status (Politically Exposed Persons)',
        'Dokumentation av riskklassificering (låg/medel/hög)'
      ],
      timeline: 'Automatisk körning varje år + vid väsentliga förändringar'
    },
    {
      id: 'document-submission',
      icon: '📄',
      title: 'Dokumentinlämning',
      frequency: 'Månatligen',
      color: 'purple',
      description: 'Schema för regelbunden inlämning av bokföringsunderlag.',
      details: [
        '📅 Senast den 10:e varje månad: Leverantörsfakturor för föregående månad',
        '📅 Senast den 10:e varje månad: Kvitton och utlägg',
        '📅 Senast den 15:e varje månad: Bankkontoutdrag (om ej automatisk hämtning)',
        '📅 Vid löneperiod: Löneunderlag senast 5 dagar före utbetalning',
        '📅 Årligen (februari): Inköpsnotor för materiella anläggningstillgångar'
      ],
      timeline: 'Automatiska påminnelser via e-post 3 dagar innan deadline'
    },
    {
      id: 'compliance-calendar',
      icon: '📅',
      title: 'Compliance-kalender',
      frequency: 'Enligt schema',
      color: 'orange',
      description: 'Viktiga datum för deklarationer och rapportering.',
      details: [
        '🗓️ Månatligen (senast den 12:e): Momsredovisning (vid månadsredovisning)',
        '🗓️ Kvartalsvis (månaden efter kvartal): Arbetsgivardeklaration',
        '🗓️ Maj varje år: Inkomstdeklaration och årsredovisning',
        '🗓️ Augusti/september: Preliminär skatt för kommande år',
        '🗓️ Vid behov: EU-försäljningslistor (VIES-rapporter)'
      ],
      timeline: 'Vi sköter alla inlämningar automatiskt – du får kopia för din kännedom'
    },
    {
      id: 'monthly-meetings',
      icon: '💼',
      title: 'Månadsmöten',
      frequency: 'Månatligen',
      color: 'teal',
      description: 'Ekonomisk uppföljning och rådgivning.',
      details: [
        '📊 Genomgång av månadens ekonomiska resultat',
        '📈 Jämförelse mot budget och föregående år',
        '💡 Råd för förbättrad lönsamhet och kassaflöde',
        '⚠️ Identifiering av avvikelser och risker',
        '🎯 Strategisk planering för kommande perioder'
      ],
      timeline: 'Bokad tid första veckan efter att bokföringen är klar (ca dag 15-20)'
    },
    {
      id: 'annual-review',
      icon: '📋',
      title: 'Årlig genomgång',
      frequency: 'Årligen (Q1)',
      color: 'red',
      description: 'Omfattande årlig översyn av verksamheten.',
      details: [
        '✅ Bokslut och årsredovisning',
        '✅ Skattedeklaration och skatteoptimering',
        '✅ Budget för kommande verksamhetsår',
        '✅ Uppdatering av rutiner och processer',
        '✅ Genomgång av avtalet och tjänstepaket'
      ],
      timeline: 'Januari-februari varje år – omfattande möte (1-2 timmar)'
    }
  ];

  const colorClasses = {
    blue: {
      bg: 'bg-brand-50',
      border: 'border-brand-200',
      icon: 'bg-brand-100',
      text: 'text-brand-800',
      badge: 'bg-brand-100 text-brand-800'
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: 'bg-green-100',
      text: 'text-green-800',
      badge: 'bg-green-100 text-green-800'
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      icon: 'bg-purple-100',
      text: 'text-purple-800',
      badge: 'bg-purple-100 text-purple-800'
    },
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      icon: 'bg-orange-100',
      text: 'text-orange-800',
      badge: 'bg-orange-100 text-orange-800'
    },
    teal: {
      bg: 'bg-teal-50',
      border: 'border-teal-200',
      icon: 'bg-teal-100',
      text: 'text-teal-800',
      badge: 'bg-teal-100 text-teal-800'
    },
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'bg-red-100',
      text: 'text-red-800',
      badge: 'bg-red-100 text-red-800'
    }
  };

  const toggleSection = (id) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-white p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-brand-500 to-brand-600 rounded-full mb-6 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-brand-900 mb-4">
            Löpande rutiner
          </h1>
          <p className="text-xl text-gray-600">
            Så här håller vi din verksamhet uppdaterad och regelkonform
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-brand-50 border-l-4 border-brand-400 p-6 mb-8 rounded-r-lg">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-brand-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-brand-900 font-semibold mb-2">
                Du behöver inte komma ihåg alla dessa datum
              </p>
              <p className="text-brand-700 text-sm">
                Vi skickar automatiska påminnelser och sköter de flesta rutinerna åt dig. 
                Din enda uppgift är att leverera underlag enligt överenskommen tidsplan.
              </p>
            </div>
          </div>
        </div>

        {/* Routines List */}
        <div className="space-y-4 mb-12">
          {routines.map((routine) => {
            const colors = colorClasses[routine.color];
            const isExpanded = expandedSection === routine.id;

            return (
              <div
                key={routine.id}
                className={`bg-white rounded-card shadow-md border-2 transition-all ${
                  isExpanded ? colors.border : 'border-gray-200'
                }`}
              >
                {/* Header - Always Visible */}
                <button
                  onClick={() => toggleSection(routine.id)}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-card"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-14 h-14 ${colors.icon} rounded-box flex items-center justify-center text-2xl flex-shrink-0`}>
                      {routine.icon}
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="text-section-title text-brand-900 mb-1">
                        {routine.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {routine.description}
                      </p>
                    </div>
                    <div className={`px-4 py-2 ${colors.badge} rounded-full font-semibold text-sm whitespace-nowrap`}>
                      {routine.frequency}
                    </div>
                  </div>
                  <svg
                    className={`w-6 h-6 text-gray-400 transition-transform ml-4 flex-shrink-0 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className={`px-6 pb-6 border-t-2 ${colors.border} pt-6`}>
                    <div className="space-y-4">
                      {/* Details List */}
                      <div>
                        <h4 className="font-semibold text-brand-900 mb-3">Vad ingår:</h4>
                        <ul className="space-y-2">
                          {routine.details.map((detail, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <span className="text-green-500 mt-1 flex-shrink-0">✓</span>
                              <span className="text-gray-700">{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Timeline */}
                      <div className={`${colors.bg} p-4 rounded-box`}>
                        <div className="flex items-start gap-2">
                          <svg className={`w-5 h-5 ${colors.text} mt-0.5 flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div>
                            <p className={`font-semibold ${colors.text} mb-1`}>Tidsplan:</p>
                            <p className="text-sm text-gray-700">{routine.timeline}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="bg-gradient-to-r from-brand-600 to-brand-700 rounded-card shadow-xl p-8 mb-8 text-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-box flex items-center justify-center flex-shrink-0">
              <svg className="w-icon-md h-icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-section-title mb-2">Vi håller koll på allt detta åt dig</h3>
              <p className="text-white/90">
                Du får automatiska påminnelser via e-post innan varje deadline. 
                Fokusera på din verksamhet – vi sköter administrationen.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center gap-4">
          <button
            onClick={onBack}
            className="px-6 py-3 border-2 border-brand-300 text-brand-700 rounded-box hover:bg-brand-50 transition-colors font-semibold flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Tillbaka
          </button>

          <button
            onClick={onNext}
            className="px-6 py-3 bg-brand-600 text-white rounded-box hover:bg-brand-700 transition-colors font-semibold flex items-center gap-2"
          >
            Nästa: Support & kontakt
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
}
