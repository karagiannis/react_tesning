// Slide 28: Välkommen som kund! 🎉
// Final onboarding slide with summary, next steps, and contact information

import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function WelcomeSlide({ onBack }) {
  const navigate = useNavigate();
  
  // Mock config data - TODO: Replace with API call to GET /api/settings/firm-config
  // eslint-disable-next-line no-unused-vars
  const [config, setConfig] = useState({
    firm: {
      name: "Din Redovisningsbyrå AB",
      supportEmail: "support@dinbyra.se",
      supportPhone: "08-123 45 67",
      businessHours: "helgfria vardagar 08:00-17:00"
    },
    assignedConsultant: {
      name: "Anna Svensson",
      email: "anna.svensson@dinbyra.se",
      phone: "070-123 45 67",
      photo: null // Optional: URL to consultant photo
    }
  });

  useEffect(() => {
    // TODO: Fetch config from API
    // fetch('/api/settings/firm-config')
    //   .then(res => res.json())
    //   .then(data => setConfig(data));
  }, []);

  const completedSteps = [
    { label: "Onboarding-process genomförd", icon: "✓" },
    { label: "Riskbedömning godkänd", icon: "✓" },
    { label: "Avtal signerat med BankID", icon: "✓" },
    { label: "Bankkoppling uppsatt", icon: "✓" },
    { label: "Deklarationsombud registrerat", icon: "✓" },
    { label: "Digital dokumenthantering konfigurerad", icon: "✓" }
  ];

  const nextSteps = [
    {
      step: "1",
      title: "Inom 24 timmar",
      description: "Din personliga redovisningskonsult kontaktar dig för att boka uppstartsmöte"
    },
    {
      step: "2",
      title: "Uppstartsmöte",
      description: "Vi går igenom din verksamhet, förväntningar och bokföringsrutiner (30-45 min)"
    },
    {
      step: "3",
      title: "Första bokföringen",
      description: "Vi påbörjar arbetet med din löpande bokföring"
    },
    {
      step: "4",
      title: "Månadsmöte",
      description: "Varje månad får du en ekonomisk rapport och rådgivning"
    }
  ];

  const handleGoToDashboard = () => {
    // Navigate to main dashboard / "Min Sida"
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-white p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header with celebration */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-brand-500 to-brand-600 rounded-full mb-6 shadow-lg">
            <span className="text-4xl">🎉</span>
          </div>
          <h1 className="text-4xl font-bold text-brand-900 mb-4">
            Välkommen som kund!
          </h1>
          <p className="text-xl text-gray-600">
            Grattis – du är nu redo att börja!
          </p>
        </div>

        {/* Completed Steps Summary */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-brand-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-brand-900">Genomförda steg</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {completedSteps.map((step, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-brand-50 rounded-lg">
                <span className="text-green-600 font-bold text-xl">{step.icon}</span>
                <span className="text-brand-900 font-medium">{step.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-brand-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center">
              <svg className="w-7 h-7 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-brand-900">Nästa steg</h2>
          </div>

          <div className="space-y-6">
            {nextSteps.map((item, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                    {item.step}
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-lg font-semibold text-brand-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold">Kontaktinformation</h2>
          </div>

          <div className="space-y-6">
            {/* Assigned Consultant */}
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <div className="flex items-center gap-4 mb-3">
                {config.assignedConsultant.photo ? (
                  <img 
                    src={config.assignedConsultant.photo} 
                    alt={config.assignedConsultant.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white/30"
                  />
                ) : (
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                    {config.assignedConsultant.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-white/80 mb-1">Din redovisningskonsult:</p>
                  <p className="text-xl font-bold">{config.assignedConsultant.name}</p>
                </div>
              </div>
              <div className="space-y-2 ml-20">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href={`mailto:${config.assignedConsultant.email}`} className="hover:underline">
                    {config.assignedConsultant.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href={`tel:${config.assignedConsultant.phone.replace(/\s/g, '')}`} className="hover:underline">
                    {config.assignedConsultant.phone}
                  </a>
                </div>
              </div>
            </div>

            {/* Firm Support */}
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <p className="font-semibold mb-3 text-lg">Byråns support:</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href={`mailto:${config.firm.supportEmail}`} className="hover:underline">
                    {config.firm.supportEmail}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{config.firm.supportPhone}</span>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-yellow-500/20 border-2 border-yellow-300/50 rounded-lg p-6 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-yellow-300 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="font-semibold mb-1">⚡ Akuta ärenden:</p>
                  <p className="text-sm">Ring alltid – vi svarar {config.firm.businessHours}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Closing Message */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-brand-900 mb-3">
            Tack för ditt förtroende!
          </h3>
          <p className="text-lg text-gray-600 italic">
            Vi ser fram emot ett långt och framgångsrikt samarbete.
          </p>
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
            onClick={handleGoToDashboard}
            className="px-8 py-4 bg-gradient-to-r from-brand-600 to-brand-700 text-white rounded-lg hover:from-brand-700 hover:to-brand-800 transition-all font-bold text-lg shadow-lg flex items-center gap-2"
          >
            Gå till Min Sida
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
}
