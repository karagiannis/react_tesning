import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';

const SettingsPageV2 = () => {
  const navigate = useNavigate();
  
  // Active section state
  const [activeSection, setActiveSection] = useState('users');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showRemoteSessionModal, setShowRemoteSessionModal] = useState(false);
  const [showShadowLoginModal, setShowShadowLoginModal] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  
  // Mock data för firmakonfiguration
  const [firmConfig, setFirmConfig] = useState({
    companyName: 'Exempel Redovisningsbyrå AB',
    orgNumber: '556123-4567',
    supportEmail: 'support@exempel.se',
    supportPhone: '08-123 45 67',
    complianceOfficer: 'Anna Andersson',
    complianceEmail: 'anna.andersson@exempel.se',
    taxOffice: 'Skatteverket Stockholm',
    auditor: 'PwC Sverige'
  });

  // Mock data för användare
  const [users] = useState([
    { id: 1, email: 'anna.andersson@exempel.se', role: 'Administratör', lastLogin: '2025-10-20 14:32' },
    { id: 2, email: 'johan.svensson@exempel.se', role: 'Användare', lastLogin: '2025-10-19 09:15' },
    { id: 3, email: 'maria.karlsson@exempel.se', role: 'Användare', lastLogin: '2025-10-18 16:45' }
  ]);

  // Mock data för prenumeration
  const subscription = {
    status: 'active',
    plan: 'Professional',
    nextPayment: '2025-11-15',
    amount: 5000,
    paymentMethod: 'Faktura'
  };

  // Mock data för avtal (NY!)
  const agreements = {
    trial: {
      agreementNumber: "TRIAL-2025-1102-A4F7",
      signedAt: "2025-11-02 14:32",
      signerName: "Lasse Andersson",
      signerPersonnr: "19850315-XXXX",
      costs: {
        staticKyc: 18,
        layering: { "2024": 60, "2023": 1000, "2022": 200 },
        total: 1278
      },
      status: "Genomförd",
      paidAt: "2025-11-02 14:35"
    },
    subscription: {
      agreementNumber: "SUB-2025-1105-B9E2",
      signedAt: "2025-11-05 10:15",
      signerName: "Lasse Andersson",
      signerPersonnr: "19850315-XXXX",
      monthlyPrice: 1995,
      startDate: "2025-11-05",
      nextBilling: "2025-12-05",
      status: "Aktiv"
    },
    assignments: [
      {
        agreementNumber: "ASSIGN-2025-1110-C3D8",
        signedAt: "2025-11-10 09:45",
        signerName: "Erik Johansson",
        signerPersonnr: "19920520-XXXX",
        companyName: "Johanssons Bygg AB",
        companyOrgnr: "556123-4567",
        costs: { staticKyc: 18, layering: { "2024": 90, "2023": 1600, "2022": 400 }, total: 2108 },
        status: "Genomförd"
      },
      {
        agreementNumber: "ASSIGN-2025-1108-F1A9",
        signedAt: "2025-11-08 14:20",
        signerName: "Maria Svensson",
        signerPersonnr: "19880712-XXXX",
        companyName: "Svenssons Handel AB",
        companyOrgnr: "559876-5432",
        costs: { staticKyc: 18, layering: { "2024": 50, "2023": 800, "2022": 200 }, total: 1068 },
        status: "Genomförd"
      },
      {
        agreementNumber: "ASSIGN-2025-1105-A2B1",
        signedAt: "2025-11-05 11:30",
        signerName: "Anders Berg",
        signerPersonnr: "19750422-XXXX",
        companyName: "Bergströms Consulting AB",
        companyOrgnr: "556234-7890",
        costs: { staticKyc: 18, layering: { "2024": 120 }, total: 138 },
        status: "Genomförd"
      }
    ]
  };

  // Notifications state
  const [notifications, setNotifications] = useState({
    emailNewOnboarding: true,
    emailRiskAlert: true,
    emailWeeklyReport: false,
    emailMonthlyInvoice: true,
    systemMaintenanceAlerts: true
  });

  // Dropzone för logotyp
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.svg']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setLogoFile(Object.assign(file, {
          preview: URL.createObjectURL(file)
        }));
      }
    }
  });

  // Mock data för fakturahistorik
  const invoices = [
    { id: 'INV-2025-009', date: '2025-09-15', amount: 5000, status: 'paid', fortnoxUrl: 'https://fortnox.se/invoices/123456' },
    { id: 'INV-2025-008', date: '2025-08-15', amount: 5000, status: 'paid', fortnoxUrl: 'https://fortnox.se/invoices/123455' },
    { id: 'INV-2025-007', date: '2025-07-15', amount: 5000, status: 'paid', fortnoxUrl: 'https://fortnox.se/invoices/123454' }
  ];

  // Mock data för prislista (Byråinställningar)
  const [priceList, setPriceList] = useState({
    lopandeBokforing: 5000,
    arsbokslut: 8000,
    deklarationer: 3000,
    loneadministration: 4000,
    ekonomiskRadgivning: 10000,
    foretagsregistrering: 15000,
    finansiellRapportering: 6000,
    foretagsforsaljning: null // Offert
  });

  // Mock data för avtalsmall (Byråinställningar)
  const [contractTemplate, setContractTemplate] = useState({
    hasCustomTemplate: false,
    customTemplateFile: null,
    useDefaultTemplate: true
  });

  // Mock data för fjärronboarding-sessioner
  const [remoteSessions] = useState([
    {
      id: 1,
      accessCode: 'tiger-3847',
      companyName: 'Acme AB',
      orgNr: '556123-4567',
      contactPerson: 'Erik Johansson',
      contactEmail: 'erik@acmeab.se',
      clientLink: 'https://app.celestial.se/o/tiger-3847',
      accountantLink: 'https://app.celestial.se/session/tiger-3847?token=JWT_ABC',
      status: 'Aktiv',
      createdAt: '2025-11-01 09:15',
      expiresAt: '2025-11-08 09:15'
    },
    {
      id: 2,
      accessCode: 'lion-1234',
      companyName: 'Beta Corp AB',
      orgNr: '559876-5432',
      contactPerson: 'Maria Svensson',
      contactEmail: 'maria@betacorp.se',
      clientLink: 'https://app.celestial.se/o/lion-1234',
      accountantLink: 'https://app.celestial.se/session/lion-1234?token=JWT_DEF',
      status: 'Genomförd',
      createdAt: '2025-10-25 14:20',
      expiresAt: '2025-11-01 14:20'
    }
  ]);

  // Mock data för shadow-logins
  const [shadowLogins] = useState([
    {
      id: 1,
      sessionCode: 'tiger-3847',
      shadowType: 'colleague',
      name: 'Johan Svensson',
      email: 'johan@exempel.se',
      accessCode: 'wolf-5621',
      accessLink: 'https://app.celestial.se/shadow/wolf-5621?token=JWT_GHI',
      permissions: 'Läsvy (kan ej ändra)',
      status: 'Aktiv',
      createdAt: '2025-11-01 10:30',
      expiresAt: 'Till sessionens slut'
    }
  ]);

  const handleSaveFirmConfig = () => {
    alert('Firmakonfiguration sparad!');
  };

  const handleInviteUser = (email) => {
    alert(`Inbjudan skickad till ${email}`);
    setShowUserModal(false);
  };

  const handleDeleteAccount = () => {
    alert('Konto raderat. Du kommer nu loggas ut.');
    navigate('/');
  };

  // Sidebar navigation items
  const sidebarSections = [
    {
      id: 'users',
      label: 'Användare',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      subsections: []
    },
    {
      id: 'access',
      label: 'Åtkomst',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
      subsections: []
    },
    {
      id: 'firm',
      label: 'Byråinställningar',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      subsections: [
        { id: 'firm-info', label: 'Kontaktuppgifter' },
        { id: 'firm-pricing', label: 'Prislista' },
        { id: 'firm-contract', label: 'Avtalsmall' },
        { id: 'firm-questions', label: 'Egna frågor' }
      ]
    },
    {
      id: 'subscription',
      label: 'Prenumeration',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      subsections: [
        { id: 'subscription-overview', label: 'Översikt' },
        { id: 'subscription-invoices', label: 'Fakturor' }
      ]
    },
    {
      id: 'agreements',
      label: 'Avtal',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      subsections: [] // Ingen subsections - visar allt på en sida
    },
    {
      id: 'danger',
      label: 'Danger Zone',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      subsections: []
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-white">
      <div className="flex h-screen">
        
        {/* SIDEBAR */}
        <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-6">
            <h2 className="text-xl font-bold text-brand-900 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Inställningar
            </h2>
            
            {sidebarSections.map(section => (
              <div key={section.id} className="mb-4">
                {/* Main section */}
                <button
                  onClick={() => setActiveSection(section.subsections.length > 0 ? section.subsections[0].id : section.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    activeSection.startsWith(section.id) || activeSection === section.id
                      ? 'bg-brand-100 text-brand-900'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {section.icon}
                  {section.label}
                </button>
                
                {/* Subsections */}
                {section.subsections.length > 0 && (
                  <div className="ml-4 mt-1 space-y-1">
                    {section.subsections.map(sub => (
                      <button
                        key={sub.id}
                        onClick={() => setActiveSection(sub.id)}
                        className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${
                          activeSection === sub.id
                            ? 'bg-brand-50 text-brand-900 font-medium'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8">
            
            {/* Header med back-knapp */}
            <div className="mb-6 flex items-center justify-between">
              <button
                onClick={() => navigate('/uppdragsval')}
                className="text-brand-600 hover:text-brand-700 font-medium flex items-center gap-2"
              >
                ← Tillbaka till Onboarding
              </button>
            </div>

            {/* CONTENT SECTIONS */}
            
            {/* FIRMAKONFIGURATION - Kontaktuppgifter */}
            {activeSection === 'firm-info' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-brand-900 mb-4">Kontaktuppgifter</h2>
                <p className="text-brand-700 mb-6">
                  Dessa uppgifter används för att automatiskt fylla i kontaktinformation i avtal, rapporter och kommunikation med klienter.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-brand-900 mb-2">Företagsnamn</label>
                    <input
                      type="text"
                      value={firmConfig.companyName}
                      onChange={(e) => setFirmConfig({...firmConfig, companyName: e.target.value})}
                      className="w-full px-4 py-2 border border-brand-200 rounded-lg"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-brand-900 mb-2">Organisationsnummer</label>
                    <input
                      type="text"
                      value={firmConfig.orgNumber}
                      onChange={(e) => setFirmConfig({...firmConfig, orgNumber: e.target.value})}
                      className="w-full px-4 py-2 border border-brand-200 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-900 mb-2">Support Email</label>
                    <input
                      type="email"
                      value={firmConfig.supportEmail}
                      onChange={(e) => setFirmConfig({...firmConfig, supportEmail: e.target.value})}
                      className="w-full px-4 py-2 border border-brand-200 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-900 mb-2">Support Telefon</label>
                    <input
                      type="tel"
                      value={firmConfig.supportPhone}
                      onChange={(e) => setFirmConfig({...firmConfig, supportPhone: e.target.value})}
                      className="w-full px-4 py-2 border border-brand-200 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-900 mb-2">Compliance Officer</label>
                    <input
                      type="text"
                      value={firmConfig.complianceOfficer}
                      onChange={(e) => setFirmConfig({...firmConfig, complianceOfficer: e.target.value})}
                      className="w-full px-4 py-2 border border-brand-200 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-900 mb-2">Skattekontor</label>
                    <input
                      type="text"
                      value={firmConfig.taxOffice}
                      onChange={(e) => setFirmConfig({...firmConfig, taxOffice: e.target.value})}
                      className="w-full px-4 py-2 border border-brand-200 rounded-lg"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleSaveFirmConfig}
                    className="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 font-medium"
                  >
                    Spara ändringar
                  </button>
                </div>
              </div>
            )}

            {/* ÅTKOMST - Fjärronboarding + Skuggning */}
            {activeSection === 'access' && (
              <div className="space-y-6">
                {/* Fjärronboarding */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-brand-900 mb-2 flex items-center gap-2">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Fjärronboarding
                      </h2>
                      <p className="text-gray-600">
                        Skapa klientinlogg som gäller endast under onboardingen. Klienten ser inte resultatanalysen. 
                        Fritt att skapa fler inlogg för styrelsemedlemmar som vill följa sessionen.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowRemoteSessionModal(true)}
                      className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 font-medium flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Skapa ny session
                    </button>
                  </div>

                  {/* Tabell med aktiva sessioner */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-brand-50">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold text-brand-900">Access-kod</th>
                          <th className="px-4 py-3 text-left font-semibold text-brand-900">Företag</th>
                          <th className="px-4 py-3 text-left font-semibold text-brand-900">Kontaktperson</th>
                          <th className="px-4 py-3 text-left font-semibold text-brand-900">Status</th>
                          <th className="px-4 py-3 text-left font-semibold text-brand-900">Skapad</th>
                          <th className="px-4 py-3 text-center font-semibold text-brand-900">Åtgärder</th>
                        </tr>
                      </thead>
                      <tbody>
                        {remoteSessions.map((session) => (
                          <tr key={session.id} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <code className="font-mono font-semibold text-brand-700">{session.accessCode}</code>
                            </td>
                            <td className="px-4 py-3">
                              <div>
                                <p className="font-medium">{session.companyName}</p>
                                <p className="text-gray-500 text-xs">{session.orgNr}</p>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div>
                                <p>{session.contactPerson}</p>
                                <p className="text-gray-500 text-xs">{session.contactEmail}</p>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                session.status === 'Aktiv' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {session.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-gray-600">{session.createdAt}</td>
                            <td className="px-4 py-3 text-center">
                              <button 
                                onClick={() => {
                                  navigator.clipboard.writeText(session.clientLink);
                                  alert('Session-länk kopierad!');
                                }}
                                className="text-brand-600 hover:text-brand-700 text-sm inline-flex items-center gap-1"
                                title="Kopiera session-länk"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                Kopiera länk
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Skuggning */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-brand-900 mb-2 flex items-center gap-2">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Skuggning / Shadow-login
                      </h2>
                      <p className="text-gray-600">
                        Låt en kollega eller support se samma vy som dig under en onboarding-session.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowShadowLoginModal(true)}
                      className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 font-medium flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Generera skuggnings-inlogg
                    </button>
                  </div>

                  {/* Tabell med aktiva shadow-logins */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-brand-50">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold text-brand-900">Session</th>
                          <th className="px-4 py-3 text-left font-semibold text-brand-900">Typ</th>
                          <th className="px-4 py-3 text-left font-semibold text-brand-900">Person</th>
                          <th className="px-4 py-3 text-left font-semibold text-brand-900">Behörigheter</th>
                          <th className="px-4 py-3 text-left font-semibold text-brand-900">Status</th>
                          <th className="px-4 py-3 text-center font-semibold text-brand-900">Åtgärder</th>
                        </tr>
                      </thead>
                      <tbody>
                        {shadowLogins.map((shadow) => (
                          <tr key={shadow.id} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <code className="font-mono font-semibold text-brand-700">{shadow.sessionCode}</code>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                shadow.shadowType === 'colleague' ? 'bg-blue-100 text-blue-800' :
                                shadow.shadowType === 'support' ? 'bg-purple-100 text-purple-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {shadow.shadowType === 'colleague' ? 'Kollega' : 
                                 shadow.shadowType === 'support' ? 'Support' : 'Celestial Admin'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div>
                                <p>{shadow.name}</p>
                                <p className="text-gray-500 text-xs">{shadow.email}</p>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-gray-600">{shadow.permissions}</td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                                {shadow.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center space-x-2">
                              <button 
                                onClick={() => {
                                  navigator.clipboard.writeText(shadow.accessLink);
                                  alert('Shadow-länk kopierad!');
                                }}
                                className="text-brand-600 hover:text-brand-700 text-sm inline-flex items-center gap-1"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                Kopiera länk
                              </button>
                              <button className="text-red-600 hover:text-red-700 text-sm">
                                Avsluta
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ANVÄNDARE - Alla användare */}
            {activeSection === 'users' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-brand-900">Alla användare</h2>
                  <button
                    onClick={() => setShowUserModal(true)}
                    className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 font-medium"
                  >
                    + Lägg till användare
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-brand-100">
                        <th className="px-4 py-3 text-left text-sm font-medium text-brand-900">Email</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-brand-900">Roll</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-brand-900">Senaste inloggning</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-brand-900">Åtgärder</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user.id} className="border-b border-gray-200">
                          <td className="px-4 py-3 text-sm">{user.email}</td>
                          <td className="px-4 py-3 text-sm">{user.role}</td>
                          <td className="px-4 py-3 text-sm">{user.lastLogin}</td>
                          <td className="px-4 py-3 text-sm">
                            <button className="text-red-600 hover:text-red-700">Ta bort</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* PRENUMERATION - Översikt */}
            {activeSection === 'subscription-overview' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-brand-900 mb-6">Prenumeration</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-brand-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Status</p>
                    <p className="text-lg font-bold text-green-600 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {subscription.status === 'active' ? 'Aktiv' : 'Inaktiv'}
                    </p>
                  </div>

                  <div className="border border-brand-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Plan</p>
                    <p className="text-lg font-bold text-brand-900">{subscription.plan}</p>
                  </div>

                  <div className="border border-brand-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Nästa betalning</p>
                    <p className="text-lg font-bold text-brand-900">{subscription.nextPayment}</p>
                  </div>

                  <div className="border border-brand-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Belopp</p>
                    <p className="text-lg font-bold text-brand-900">{subscription.amount} kr</p>
                  </div>
                </div>
              </div>
            )}

            {/* PRENUMERATION - Fakturor */}
            {activeSection === 'subscription-invoices' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-brand-900 mb-6">Fakturahistorik</h2>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-brand-100">
                        <th className="px-4 py-3 text-left text-sm font-medium text-brand-900">Fakturanr</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-brand-900">Datum</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-brand-900">Belopp</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-brand-900">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-brand-900">PDF</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map(invoice => (
                        <tr key={invoice.id} className="border-b border-gray-200">
                          <td className="px-4 py-3 text-sm">{invoice.id}</td>
                          <td className="px-4 py-3 text-sm">{invoice.date}</td>
                          <td className="px-4 py-3 text-sm">{invoice.amount} kr</td>
                          <td className="px-4 py-3 text-sm">
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                              Betald
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <a href={invoice.fortnoxUrl} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:text-brand-700 inline-flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Ladda ner
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* AVTAL - Alla tre typer på EN sida */}
            {activeSection === 'agreements' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-bold text-brand-900 mb-2 flex items-center gap-2">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Avtal
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Här hittar du alla BankID-signerade avtal för din byrå. Prova-på-avtal gäller endast för första onboarding-sessionen. 
                    Företagsavtal gäller löpande prenumeration. Uppdragsavtal genereras per kund-onboarding.
                  </p>

                  {/* Prova-på-avtal */}
                  <div className="mb-8 border-l-4 border-brand-500 bg-brand-50 p-6 rounded-r-lg">
                    <h3 className="text-xl font-bold text-brand-900 mb-4 flex items-center gap-2">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Prova-på-avtal
                    </h3>
                    
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Avtalsnummer</p>
                          <p className="font-semibold">{agreements.trial.agreementNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Signerat</p>
                          <p className="font-semibold">{agreements.trial.signedAt}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Signatär</p>
                          <p className="font-semibold">{agreements.trial.signerName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Personnummer</p>
                          <p className="font-semibold text-gray-500">{agreements.trial.signerPersonnr}</p>
                        </div>
                      </div>

                      <div className="border-t pt-4 mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Kostnad:</p>
                        <div className="space-y-1 text-sm">
                          <p>• Statisk KYC: {agreements.trial.costs.staticKyc} kr</p>
                          <p>• Forensisk analys:</p>
                          <div className="ml-4 text-gray-600">
                            {Object.entries(agreements.trial.costs.layering).map(([year, cost]) => (
                              <p key={year}>- År {year}: {cost} kr</p>
                            ))}
                          </div>
                          <p className="font-bold mt-2">Totalt: {agreements.trial.costs.total} kr (betalt {agreements.trial.paidAt})</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium inline-flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {agreements.trial.status}
                        </span>
                        <div className="space-x-2">
                          <button className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 text-sm flex items-center gap-1 inline-flex">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Ladda ner PDF
                          </button>
                          <button className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm flex items-center gap-1 inline-flex">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            Visa BankID-kvitto
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Företagsavtal */}
                  <div className="mb-8 border-l-4 border-brand-600 bg-brand-100 p-6 rounded-r-lg">
                    <h3 className="text-xl font-bold text-brand-900 mb-4 flex items-center gap-2">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      Företagsavtal
                    </h3>
                    
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Avtalsnummer</p>
                          <p className="font-semibold">{agreements.subscription.agreementNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Signerat</p>
                          <p className="font-semibold">{agreements.subscription.signedAt}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Signatär</p>
                          <p className="font-semibold">{agreements.subscription.signerName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Personnummer</p>
                          <p className="font-semibold text-gray-500">{agreements.subscription.signerPersonnr}</p>
                        </div>
                      </div>

                      <div className="border-t pt-4 mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Prenumeration:</p>
                        <div className="space-y-1 text-sm">
                          <p>• Fast pris: {agreements.subscription.monthlyPrice} kr/mån</p>
                          <p>• Rörliga API-kostnader faktureras månadsvis</p>
                          <p>• Startdatum: {agreements.subscription.startDate}</p>
                          <p>• Nästa faktura: {agreements.subscription.nextBilling}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium inline-flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {agreements.subscription.status}
                        </span>
                        <div className="space-x-2">
                          <button className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 text-sm flex items-center gap-1 inline-flex">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Ladda ner PDF
                          </button>
                          <button className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm flex items-center gap-1 inline-flex">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            Visa BankID-kvitto
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Uppdragsavtal */}
                  <div className="border-l-4 border-brand-500 bg-brand-50 p-6 rounded-r-lg">
                    <h3 className="text-xl font-bold text-brand-900 mb-4 flex items-center gap-2">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Uppdragsavtal ({agreements.assignments.length} st)
                    </h3>
                    
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-4 py-3 text-left font-semibold">Avtalsnr</th>
                              <th className="px-4 py-3 text-left font-semibold">Företag</th>
                              <th className="px-4 py-3 text-left font-semibold">Signatär</th>
                              <th className="px-4 py-3 text-left font-semibold">Datum</th>
                              <th className="px-4 py-3 text-right font-semibold">Kostnad</th>
                              <th className="px-4 py-3 text-center font-semibold">Status</th>
                              <th className="px-4 py-3 text-center font-semibold">Åtgärder</th>
                            </tr>
                          </thead>
                          <tbody>
                            {agreements.assignments.map((assignment, idx) => (
                              <tr key={idx} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-3">{assignment.agreementNumber}</td>
                                <td className="px-4 py-3">
                                  <div>
                                    <p className="font-medium">{assignment.companyName}</p>
                                    <p className="text-gray-500 text-xs">{assignment.companyOrgnr}</p>
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <div>
                                    <p>{assignment.signerName}</p>
                                    <p className="text-gray-500 text-xs">{assignment.signerPersonnr}</p>
                                  </div>
                                </td>
                                <td className="px-4 py-3">{assignment.signedAt}</td>
                                <td className="px-4 py-3 text-right font-semibold">{assignment.costs.total} kr</td>
                                <td className="px-4 py-3 text-center">
                                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs inline-flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    {assignment.status}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <button className="text-brand-600 hover:text-brand-700 text-sm mr-2 inline-flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    PDF
                                  </button>
                                  <button className="text-gray-600 hover:text-gray-700 text-sm inline-flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    BankID
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* DANGER ZONE */}
            {activeSection === 'danger' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-red-600 mb-4 flex items-center gap-2">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Danger Zone
                </h2>
                <p className="text-gray-700 mb-6">
                  Radering av konto är permanent och kan inte ångras. All data raderas omedelbart.
                </p>

                <div className="border-2 border-red-200 rounded-lg p-6 bg-red-50">
                  <h3 className="font-bold text-red-900 mb-2">Ta bort konto permanent</h3>
                  <p className="text-sm text-red-700 mb-4">
                    Detta kommer radera all data inklusive användare, klienter, onboarding-sessioner och rapporter.
                  </p>
                  
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                  >
                    Ta bort konto
                  </button>
                </div>
              </div>
            )}

            {/* Byråinställningar - Prislista */}
            {activeSection === 'firm-pricing' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-brand-900 mb-2 flex items-center gap-2">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Prislista
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Ange standardpriser för dina tjänster. Dessa används som utgångspunkt i Uppdragsval-steget. 
                    Du kan alltid justera priserna individuellt i Riskbedömning-steget.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Löpande bokföring */}
                  <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-gray-900 mb-1">
                        Löpande bokföring
                      </label>
                      <p className="text-xs text-gray-500">Per år</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={priceList.lopandeBokforing}
                        onChange={(e) => setPriceList({...priceList, lopandeBokforing: parseInt(e.target.value) || 0})}
                        className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-right"
                      />
                      <span className="text-gray-600 font-medium">kr/år</span>
                    </div>
                  </div>

                  {/* Årsbokslut */}
                  <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-gray-900 mb-1">
                        Årsbokslut
                      </label>
                      <p className="text-xs text-gray-500">Per år</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={priceList.arsbokslut}
                        onChange={(e) => setPriceList({...priceList, arsbokslut: parseInt(e.target.value) || 0})}
                        className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-right"
                      />
                      <span className="text-gray-600 font-medium">kr/år</span>
                    </div>
                  </div>

                  {/* Deklarationer */}
                  <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-gray-900 mb-1">
                        Deklarationer
                      </label>
                      <p className="text-xs text-gray-500">Moms, arbetsgivardeklaration, inkomstdeklaration - Per år</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={priceList.deklarationer}
                        onChange={(e) => setPriceList({...priceList, deklarationer: parseInt(e.target.value) || 0})}
                        className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-right"
                      />
                      <span className="text-gray-600 font-medium">kr/år</span>
                    </div>
                  </div>

                  {/* Löneadministration */}
                  <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-gray-900 mb-1">
                        Löneadministration
                      </label>
                      <p className="text-xs text-gray-500">Per år</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={priceList.loneadministration}
                        onChange={(e) => setPriceList({...priceList, loneadministration: parseInt(e.target.value) || 0})}
                        className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-right"
                      />
                      <span className="text-gray-600 font-medium">kr/år</span>
                    </div>
                  </div>

                  {/* Ekonomisk rådgivning */}
                  <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-gray-900 mb-1">
                        Ekonomisk rådgivning
                      </label>
                      <p className="text-xs text-gray-500">Per år</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={priceList.ekonomiskRadgivning}
                        onChange={(e) => setPriceList({...priceList, ekonomiskRadgivning: parseInt(e.target.value) || 0})}
                        className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-right"
                      />
                      <span className="text-gray-600 font-medium">kr/år</span>
                    </div>
                  </div>

                  {/* Företagsregistrering */}
                  <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-gray-900 mb-1">
                        Företagsregistrering
                      </label>
                      <p className="text-xs text-gray-500">Nystartad verksamhet - Engångsavgift</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={priceList.foretagsregistrering}
                        onChange={(e) => setPriceList({...priceList, foretagsregistrering: parseInt(e.target.value) || 0})}
                        className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-right"
                      />
                      <span className="text-gray-600 font-medium">kr (engång)</span>
                    </div>
                  </div>

                  {/* Finansiell rapportering och analys */}
                  <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-gray-900 mb-1">
                        Finansiell rapportering och analys
                      </label>
                      <p className="text-xs text-gray-500">Per år</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={priceList.finansiellRapportering}
                        onChange={(e) => setPriceList({...priceList, finansiellRapportering: parseInt(e.target.value) || 0})}
                        className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-right"
                      />
                      <span className="text-gray-600 font-medium">kr/år</span>
                    </div>
                  </div>

                  {/* Företagsförsäljning/succession */}
                  <div className="flex items-center justify-between pb-4">
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-gray-900 mb-1">
                        Företagsförsäljning/succession
                      </label>
                      <p className="text-xs text-gray-500">Prissätts individuellt - Offert krävs</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 italic text-sm">Offert</span>
                    </div>
                  </div>
                </div>

                {/* Info-box */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm text-blue-900">
                      <p className="font-semibold mb-1">Prissättning i onboarding-flödet</p>
                      <ul className="list-disc list-inside space-y-1 text-blue-800">
                        <li><strong>Uppdragsval:</strong> Klienten väljer tjänster och ser automatiskt beräknat pris från denna prislista</li>
                        <li><strong>Riskbedömning:</strong> Du kan justera och överrida priserna individuellt per kund baserat på riskanalys</li>
                        <li><strong>Företagsförsäljning/succession:</strong> Visas som "Offert" och kräver individuell prissättning</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Spara-knapp */}
                <div className="mt-6 flex justify-end">
                  <button className="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 font-medium flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Spara prislista
                  </button>
                </div>
              </div>
            )}

            {/* Byråinställningar - Avtalsmall */}
            {activeSection === 'firm-contract' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-brand-900 mb-2 flex items-center gap-2">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Avtalsmall
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Ladda upp din egen avtalsmall med placeholders som fylls i automatiskt vid onboarding, 
                    eller använd vår standardmall.
                  </p>
                </div>

                {/* Val: Egen mall eller standard */}
                <div className="mb-6 space-y-4">
                  <label className={`flex items-start gap-4 p-5 rounded-lg border-2 cursor-pointer transition-all ${
                    contractTemplate.useDefaultTemplate ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-brand-300'
                  }`}>
                    <input
                      type="radio"
                      name="templateChoice"
                      checked={contractTemplate.useDefaultTemplate}
                      onChange={() => setContractTemplate({...contractTemplate, useDefaultTemplate: true, hasCustomTemplate: false})}
                      className="w-5 h-5 mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 mb-1">Använd standardmall</div>
                      <p className="text-sm text-gray-600 mb-3">
                        Vår färdiga uppdragsavtalsmall med alla nödvändiga placeholders. 
                        Fylls automatiskt med data från onboardingen.
                      </p>
                      <a 
                        href="/uppdragsavtal_exempel.pdf" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-brand-600 hover:text-brand-700 text-sm inline-flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Förhandsgranska standardmall
                      </a>
                    </div>
                  </label>

                  <label className={`flex items-start gap-4 p-5 rounded-lg border-2 cursor-pointer transition-all ${
                    contractTemplate.hasCustomTemplate ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-brand-300'
                  }`}>
                    <input
                      type="radio"
                      name="templateChoice"
                      checked={contractTemplate.hasCustomTemplate}
                      onChange={() => setContractTemplate({...contractTemplate, useDefaultTemplate: false, hasCustomTemplate: true})}
                      className="w-5 h-5 mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 mb-1">Ladda upp egen mall</div>
                      <p className="text-sm text-gray-600">
                        Använd din egen avtalsmall med anpassade villkor och placeholders.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Upload-sektion för egen mall */}
                {contractTemplate.hasCustomTemplate && (
                  <div className="mb-6 p-5 bg-blue-50 border-2 border-blue-200 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-3">Ladda upp din avtalsmall</h3>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Avtalsmall (PDF eller DOCX) <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="file"
                        accept=".pdf,.docx"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setContractTemplate({
                              ...contractTemplate,
                              customTemplateFile: e.target.files[0]
                            });
                          }
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      />
                      {contractTemplate.customTemplateFile && (
                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-sm text-green-800">{contractTemplate.customTemplateFile.name} uppladdad</span>
                        </div>
                      )}
                    </div>

                    {/* Info om placeholders */}
                    <div className="bg-white border border-blue-300 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Placeholders för dynamisk data
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Använd följande placeholders i din mall (omgivna av dubbla klammerparenteser):
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-gray-50 p-3 rounded">
                        <div><code className="text-brand-600">{`{{FÖRETAGSNAMN}}`}</code></div>
                        <div><code className="text-brand-600">{`{{ORGNUMMER}}`}</code></div>
                        <div><code className="text-brand-600">{`{{KONTAKTPERSON}}`}</code></div>
                        <div><code className="text-brand-600">{`{{EMAIL}}`}</code></div>
                        <div><code className="text-brand-600">{`{{TELEFON}}`}</code></div>
                        <div><code className="text-brand-600">{`{{ADRESS}}`}</code></div>
                        <div><code className="text-brand-600">{`{{MÅNADSPRIS}}`}</code></div>
                        <div><code className="text-brand-600">{`{{STARTDATUM}}`}</code></div>
                        <div><code className="text-brand-600">{`{{BYRÅNAMN}}`}</code></div>
                        <div><code className="text-brand-600">{`{{BYRÅ_ORGNR}}`}</code></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-3">
                        Om en placeholder inte fylls i dynamiskt ersätts den automatiskt med whitespace.
                      </p>
                    </div>
                  </div>
                )}

                {/* Spara-knapp */}
                <div className="mt-6 flex justify-end">
                  <button className="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 font-medium flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Spara avtalsmall
                  </button>
                </div>
              </div>
            )}

            {/* Placeholder för andra sektioner */}
            {!['firm-info', 'users', 'access', 'subscription-overview', 'subscription-invoices', 'agreements', 'danger', 'firm-pricing', 'firm-contract'].includes(activeSection) && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-brand-900 mb-4">
                  {sidebarSections.find(s => s.id === activeSection || s.subsections.some(sub => sub.id === activeSection))?.label || 'Section'}
                </h2>
                <p className="text-gray-600">
                  Innehåll för denna sektion kommer implementeras i nästa iteration.
                </p>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Modaler (behålls från Iteration 1) */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md">
            <h3 className="text-xl font-bold text-red-600 mb-4">Bekräfta radering</h3>
            <p className="text-gray-700 mb-6">
              Är du säker på att du vill radera kontot? Detta kan inte ångras.
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleDeleteAccount}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                Ja, radera
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium"
              >
                Avbryt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Skapa fjärronboarding-session */}
      {showRemoteSessionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-brand-900">Skapa fjärronboarding-session</h3>
              <button
                onClick={() => setShowRemoteSessionModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Företagsnamn */}
              <div>
                <label className="block text-sm font-medium text-brand-900 mb-2">
                  Företagsnamn *
                </label>
                <input
                  type="text"
                  id="remoteCompanyName"
                  className="w-full px-4 py-2 border border-brand-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  placeholder="Acme AB"
                />
              </div>

              {/* Organisationsnummer */}
              <div>
                <label className="block text-sm font-medium text-brand-900 mb-2">
                  Organisationsnummer *
                </label>
                <input
                  type="text"
                  id="remoteOrgNr"
                  className="w-full px-4 py-2 border border-brand-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  placeholder="556123-4567"
                />
              </div>

              {/* Kontaktperson */}
              <div>
                <label className="block text-sm font-medium text-brand-900 mb-2">
                  Kontaktperson *
                </label>
                <input
                  type="text"
                  id="remoteContactName"
                  className="w-full px-4 py-2 border border-brand-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  placeholder="Erik Johansson"
                />
              </div>

              {/* E-postadress */}
              <div>
                <label className="block text-sm font-medium text-brand-900 mb-2">
                  E-postadress * (för att skicka inbjudan)
                </label>
                <input
                  type="email"
                  id="remoteEmail"
                  className="w-full px-4 py-2 border border-brand-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  placeholder="erik@acmeab.se"
                />
              </div>

              {/* Telefon (valfritt) */}
              <div>
                <label className="block text-sm font-medium text-brand-900 mb-2">
                  Telefon (valfritt)
                </label>
                <input
                  type="tel"
                  id="remotePhone"
                  className="w-full px-4 py-2 border border-brand-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  placeholder="070-123 45 67"
                />
              </div>

              {/* Info-box */}
              <div className="bg-brand-50 border border-brand-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div className="text-sm text-brand-800">
                    <p className="font-medium mb-1">Ett email skickas automatiskt till klienten med:</p>
                    <ul className="text-brand-700 space-y-1">
                      <li>• Länk till onboarding (app.celestial.se/o/XXX)</li>
                      <li>• Access-kod (t.ex. tiger-3847)</li>
                      <li>• Instruktioner för hur man kommer igång</li>
                      <li>• Giltighet: 7 dagar</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Knappar */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowRemoteSessionModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
              >
                Avbryt
              </button>
              <button
                onClick={() => {
                  const companyName = document.getElementById('remoteCompanyName').value;
                  const email = document.getElementById('remoteEmail').value;
                  if (companyName && email) {
                    alert(`Session skapad för ${companyName}! Email skickat till ${email}`);
                    setShowRemoteSessionModal(false);
                  } else {
                    alert('Vänligen fyll i företagsnamn och e-postadress');
                  }
                }}
                className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 font-medium transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Skapa och skicka inbjudan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Generera skuggnings-inlogg */}
      {showShadowLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-brand-900">Generera skuggnings-inlogg</h3>
              <button
                onClick={() => setShowShadowLoginModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Typ av åtkomst */}
              <div>
                <label className="block text-sm font-medium text-brand-900 mb-2">
                  Typ av åtkomst *
                </label>
                <select 
                  id="shadowType"
                  className="w-full px-4 py-2 border border-brand-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                >
                  <option value="colleague">Kollega (läsvy - utbildning)</option>
                  <option value="support">Support (läsvy - telefonsupport)</option>
                  <option value="admin">Celestial Admin (full kontroll - akut support)</option>
                </select>
              </div>

              {/* Välj session */}
              <div>
                <label className="block text-sm font-medium text-brand-900 mb-2">
                  Välj aktiv session *
                </label>
                <select 
                  id="shadowSession"
                  className="w-full px-4 py-2 border border-brand-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                >
                  {remoteSessions.filter(s => s.status === 'Aktiv').map(session => (
                    <option key={session.id} value={session.accessCode}>
                      {session.companyName} ({session.accessCode})
                    </option>
                  ))}
                </select>
              </div>

              {/* Namn */}
              <div>
                <label className="block text-sm font-medium text-brand-900 mb-2">
                  Namn *
                </label>
                <input
                  type="text"
                  id="shadowName"
                  className="w-full px-4 py-2 border border-brand-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  placeholder="Erik Eriksson"
                />
              </div>

              {/* E-post */}
              <div>
                <label className="block text-sm font-medium text-brand-900 mb-2">
                  E-postadress *
                </label>
                <input
                  type="email"
                  id="shadowEmail"
                  className="w-full px-4 py-2 border border-brand-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  placeholder="erik@exempel.se"
                />
              </div>

              {/* Giltighetstid */}
              <div>
                <label className="block text-sm font-medium text-brand-900 mb-2">
                  Giltighetstid
                </label>
                <select 
                  id="shadowExpiry"
                  className="w-full px-4 py-2 border border-brand-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                >
                  <option value="session-end">Till sessionens slut (standard)</option>
                  <option value="24">24 timmar</option>
                  <option value="168">7 dagar</option>
                </select>
              </div>

              {/* Info-box */}
              <div className="bg-brand-50 border border-brand-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm text-brand-800">
                    <p className="font-medium mb-1">Permissions baserat på typ:</p>
                    <ul className="text-brand-700 space-y-1">
                      <li>• <strong>Kollega/Support:</strong> Läsvy, kan EJ ändra</li>
                      <li>• <strong>Celestial Admin:</strong> Full kontroll, kan ändra åt kunden</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Knappar */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowShadowLoginModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
              >
                Avbryt
              </button>
              <button
                onClick={() => {
                  const name = document.getElementById('shadowName').value;
                  const email = document.getElementById('shadowEmail').value;
                  if (name && email) {
                    alert(`Skuggnings-inlogg skapad för ${name}! Email skickat till ${email}`);
                    setShowShadowLoginModal(false);
                  } else {
                    alert('Vänligen fyll i namn och e-postadress');
                  }
                }}
                className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 font-medium transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Generera inlogg
              </button>
            </div>
          </div>
        </div>
      )}

      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-brand-900">Lägg till ny användare</h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Förnamn */}
              <div>
                <label className="block text-sm font-medium text-brand-900 mb-2">
                  Förnamn *
                </label>
                <input
                  type="text"
                  id="firstName"
                  className="w-full px-4 py-2 border border-brand-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  placeholder="Erik"
                />
              </div>

              {/* Efternamn */}
              <div>
                <label className="block text-sm font-medium text-brand-900 mb-2">
                  Efternamn *
                </label>
                <input
                  type="text"
                  id="lastName"
                  className="w-full px-4 py-2 border border-brand-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  placeholder="Eriksson"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-brand-900 mb-2">
                  E-postadress *
                </label>
                <input
                  type="email"
                  id="userEmail"
                  className="w-full px-4 py-2 border border-brand-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  placeholder="erik@exempel.se"
                />
              </div>

              {/* Roll */}
              <div>
                <label className="block text-sm font-medium text-brand-900 mb-2">
                  Roll *
                </label>
                <select 
                  id="userRole"
                  className="w-full px-4 py-2 border border-brand-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                >
                  <option value="user">Användare (onboarding + klienter)</option>
                  <option value="admin">Administratör (full åtkomst)</option>
                  <option value="viewer">Granskning (endast läsrättigheter)</option>
                </select>
              </div>

              {/* Info-box */}
              <div className="bg-brand-50 border border-brand-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm text-brand-800">
                    <p className="font-medium mb-1">En inbjudan kommer skickas via e-post</p>
                    <p className="text-brand-700">
                      Användaren får en länk och en 8-siffrig kod som är giltig i 7 dagar. 
                      De kan välja att antingen klicka på länken eller manuellt ange koden.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Knappar */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowUserModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
              >
                Avbryt
              </button>
              <button
                onClick={() => {
                  const firstName = document.getElementById('firstName').value;
                  const lastName = document.getElementById('lastName').value;
                  const email = document.getElementById('userEmail').value;
                  const role = document.getElementById('userRole').value;
                  if (firstName && lastName && email) {
                    handleInviteUser(email);
                  } else {
                    alert('Vänligen fyll i alla obligatoriska fält');
                  }
                }}
                className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 font-medium transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Skicka inbjudan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPageV2;
