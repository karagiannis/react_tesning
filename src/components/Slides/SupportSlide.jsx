// Slide 30: Support & Kontakt
// How to get help, escalation procedures, compliance questions

export default function SupportSlide({ onNext, onBack }) {
  
  const supportCategories = [
    {
      id: 'technical',
      icon: '💻',
      title: 'Teknisk support',
      description: 'Problem med inloggning, systemet eller filuppladdning',
      color: 'blue',
      contact: {
        email: 'support@dinbyra.se',
        phone: '08-123 45 67',
        hours: 'Mån-Fre 08:00-17:00'
      },
      responseTime: 'Svar inom 4 timmar',
      examples: [
        'Kan inte logga in med BankID',
        'Filer laddas inte upp korrekt',
        'Felmeddelande i systemet',
        'Problem med molnlagringstjänst',
        'Tekniska frågor om integrationer'
      ]
    },
    {
      id: 'accounting',
      icon: '📊',
      title: 'Bokföringsfrågor',
      description: 'Frågor om bokföring, verifikationer och rapporter',
      color: 'green',
      contact: {
        email: 'Din tilldelade redovisningskonsult',
        phone: 'Se kontaktinformation i välkomstbrevet',
        hours: 'Enligt överenskommen tid'
      },
      responseTime: 'Svar inom 24 timmar',
      examples: [
        'Frågor om specifika verifikationer',
        'Tolkningar av ekonomiska rapporter',
        'Råd om kontoplaner och kontering',
        'Budget och prognos-frågor',
        'Ekonomisk rådgivning'
      ]
    },
    {
      id: 'compliance',
      icon: '⚖️',
      title: 'Regelverksfrågor (AML/Compliance)',
      description: 'Penningtvätt, KYC, sanktioner och regelefterlevnad',
      color: 'purple',
      contact: {
        email: 'compliance@dinbyra.se',
        phone: '08-123 45 68',
        hours: 'Mån-Fre 09:00-16:00'
      },
      responseTime: 'Svar inom 24 timmar (akut: inom 2 timmar)',
      examples: [
        'Frågor om penningtvättslagen',
        'KYC-uppdateringar och ändringar',
        'Rapportering av misstänkta transaktioner',
        'Sanktionslistor och PEP-kontroll',
        'Dokumentation av verkliga huvudmän'
      ]
    },
    {
      id: 'tax',
      icon: '🏛️',
      title: 'Skattefrågor',
      description: 'Deklarationer, moms, skatt och Skatteverket',
      color: 'orange',
      contact: {
        email: 'skatt@dinbyra.se',
        phone: '08-123 45 69',
        hours: 'Mån-Fre 08:00-17:00'
      },
      responseTime: 'Svar inom 24 timmar (deadline: samma dag)',
      examples: [
        'Momsredovisning och VAT-frågor',
        'Inkomstdeklarationer',
        'F-skatt och preliminärskatt',
        'Kontakt med Skatteverket',
        'Skatteplanering och optimering'
      ]
    },
    {
      id: 'urgent',
      icon: '🚨',
      title: 'Akuta ärenden',
      description: 'Brådskande situationer som kräver omedelbar åtgärd',
      color: 'red',
      contact: {
        email: 'akut@dinbyra.se',
        phone: '08-123 45 70 (Ring alltid)',
        hours: 'Helgfria vardagar 08:00-17:00'
      },
      responseTime: 'Omedelbar hantering',
      examples: [
        'Skatteverket/Bolagsverket kontaktar företaget',
        'Misstänkta bedrägerier eller penningtvätt',
        'Polisanmälan eller brottsutredning',
        'Förelägganden med kort svarstid',
        'Kritiska systemfel som stoppar verksamheten'
      ]
    }
  ];

  const colorClasses = {
    blue: {
      bg: 'bg-brand-50',
      border: 'border-brand-200',
      icon: 'bg-brand-100',
      text: 'text-brand-800',
      badge: 'bg-brand-500'
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: 'bg-green-100',
      text: 'text-green-800',
      badge: 'bg-green-500'
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      icon: 'bg-purple-100',
      text: 'text-purple-800',
      badge: 'bg-purple-500'
    },
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      icon: 'bg-orange-100',
      text: 'text-orange-800',
      badge: 'bg-orange-500'
    },
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'bg-red-100',
      text: 'text-red-800',
      badge: 'bg-red-500'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-white p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-brand-500 to-brand-600 rounded-full mb-6 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-brand-900 mb-4">
            Support & Kontakt
          </h1>
          <p className="text-xl text-gray-600">
            Vi finns här för att hjälpa dig – välj rätt kanal för snabbast svar
          </p>
        </div>

        {/* Support Categories Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {supportCategories.map((category) => {
            const colors = colorClasses[category.color];

            return (
              <div
                key={category.id}
                className={`bg-white rounded-xl shadow-lg border-2 ${colors.border} p-6 hover:shadow-xl transition-shadow`}
              >
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-14 h-14 ${colors.icon} rounded-lg flex items-center justify-center text-2xl flex-shrink-0`}>
                    {category.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-brand-900 mb-1">
                      {category.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {category.description}
                    </p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className={`${colors.bg} rounded-lg p-4 mb-4 space-y-2`}>
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="font-medium text-gray-700">{category.contact.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="font-medium text-gray-700">{category.contact.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-600">{category.contact.hours}</span>
                  </div>
                </div>

                {/* Response Time Badge */}
                <div className="flex items-center gap-2 mb-4">
                  <div className={`${colors.badge} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
                    ⏱️ {category.responseTime}
                  </div>
                </div>

                {/* Examples */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Exempel på frågor:
                  </p>
                  <ul className="space-y-1">
                    {category.examples.slice(0, 3).map((example, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-gray-400 text-xs mt-0.5">•</span>
                        <span>{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Escalation Flow */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border-2 border-brand-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center">
              <svg className="w-7 h-7 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-brand-900">Eskaleringsprocess</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-brand-600 text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-3">
                1
              </div>
              <h3 className="font-semibold text-brand-900 mb-2">Första kontakt</h3>
              <p className="text-sm text-gray-600">
                Kontakta rätt supportkanal enligt kategori ovan
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-brand-600 text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-3">
                2
              </div>
              <h3 className="font-semibold text-brand-900 mb-2">Får inget svar?</h3>
              <p className="text-sm text-gray-600">
                Skicka påminnelse efter 24h eller ring direkt för snabbare hjälp
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-3">
                3
              </div>
              <h3 className="font-semibold text-brand-900 mb-2">Akut eskalering</h3>
              <p className="text-sm text-gray-600">
                Vid brådska: Ring <strong>08-123 45 70</strong> (akutlinje)
              </p>
            </div>
          </div>
        </div>

        {/* FAQ & Resources */}
        <div className="bg-gradient-to-r from-brand-600 to-brand-700 rounded-xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Självhjälpsresurser</h2>
              <p className="text-white/90">
                Många vanliga frågor har vi redan besvarat i vår kunskapsbas
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <a
              href="/faq"
              className="flex items-center gap-3 p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold">Vanliga frågor (FAQ)</p>
                <p className="text-sm text-white/80">Snabba svar på vanliga frågor</p>
              </div>
            </a>

            <a
              href="/guides"
              className="flex items-center gap-3 p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div>
                <p className="font-semibold">Användarguider</p>
                <p className="text-sm text-white/80">Steg-för-steg-instruktioner</p>
              </div>
            </a>

            <a
              href="/videos"
              className="flex items-center gap-3 p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold">Videotutorials</p>
                <p className="text-sm text-white/80">Lär dig genom att se</p>
              </div>
            </a>

            <a
              href="/compliance-docs"
              className="flex items-center gap-3 p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div>
                <p className="font-semibold">Regelverksdokumentation</p>
                <p className="text-sm text-white/80">AML, GDPR, bokföringslag</p>
              </div>
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center gap-4">
          <button
            onClick={onBack}
            className="px-6 py-3 border-2 border-brand-300 text-brand-700 rounded-lg hover:bg-brand-50 transition-colors font-semibold flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Tillbaka
          </button>

          <button
            onClick={onNext}
            className="px-8 py-4 bg-gradient-to-r from-brand-600 to-brand-700 text-white rounded-lg hover:from-brand-700 hover:to-brand-800 transition-all font-bold text-lg shadow-lg flex items-center gap-2"
          >
            Klar med onboarding! 🎉
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
}
