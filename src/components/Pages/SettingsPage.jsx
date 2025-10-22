import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const navigate = useNavigate();
  
  // State för olika sektioner
  const [activeSection, setActiveSection] = useState('firm');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  
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

  // Mock data för fakturahistorik
  const invoices = [
    { id: 'INV-2025-009', date: '2025-09-15', amount: 5000, status: 'paid', fortnoxUrl: 'https://fortnox.se/invoices/123456' },
    { id: 'INV-2025-008', date: '2025-08-15', amount: 5000, status: 'paid', fortnoxUrl: 'https://fortnox.se/invoices/123455' },
    { id: 'INV-2025-007', date: '2025-07-15', amount: 5000, status: 'paid', fortnoxUrl: 'https://fortnox.se/invoices/123454' }
  ];

  const handleSaveFirmConfig = () => {
    // TODO: API call till backend
    alert('Firmakonfiguration sparad!');
  };

  const handleInviteUser = (email) => {
    // TODO: API call till backend
    alert(`Inbjudan skickad till ${email}`);
    setShowUserModal(false);
  };

  const handleDeleteAccount = () => {
    // TODO: API call till backend
    alert('Konto raderat. Du kommer nu loggas ut.');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brand-900">Inställningar</h1>
          <p className="text-brand-700 mt-2">Hantera ditt konto och firmans grundinformation</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-2 flex gap-2 overflow-x-auto">
          {[
            { id: 'firm', label: 'Firmakonfiguration' },
            { id: 'users', label: 'Användare' },
            { id: 'tests', label: 'Risktester' },
            { id: 'subscription', label: 'Prenumeration' },
            { id: 'danger', label: 'Ta bort konto' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeSection === tab.id
                  ? 'bg-brand-600 text-white'
                  : 'text-brand-700 hover:bg-brand-100'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          
          {/* FIRMAKONFIGURATION */}
          {activeSection === 'firm' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-brand-900 mb-4">Firmakonfiguration</h2>
              <p className="text-brand-700 mb-6">
                Dessa uppgifter används för att automatiskt fylla i kontaktinformation i avtal, rapporter och kommunikation med klienter.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-brand-900 mb-2">
                    Firmanamn *
                  </label>
                  <input
                    type="text"
                    value={firmConfig.companyName}
                    onChange={(e) => setFirmConfig({...firmConfig, companyName: e.target.value})}
                    className="w-full px-4 py-2 border border-brand-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-900 mb-2">
                    Organisationsnummer *
                  </label>
                  <input
                    type="text"
                    value={firmConfig.orgNumber}
                    onChange={(e) => setFirmConfig({...firmConfig, orgNumber: e.target.value})}
                    className="w-full px-4 py-2 border border-brand-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-900 mb-2">
                    Support e-post *
                  </label>
                  <input
                    type="email"
                    value={firmConfig.supportEmail}
                    onChange={(e) => setFirmConfig({...firmConfig, supportEmail: e.target.value})}
                    className="w-full px-4 py-2 border border-brand-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-900 mb-2">
                    Support telefon
                  </label>
                  <input
                    type="tel"
                    value={firmConfig.supportPhone}
                    onChange={(e) => setFirmConfig({...firmConfig, supportPhone: e.target.value})}
                    className="w-full px-4 py-2 border border-brand-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-900 mb-2">
                    Ansvarig för efterlevnad (Compliance Officer) *
                  </label>
                  <input
                    type="text"
                    value={firmConfig.complianceOfficer}
                    onChange={(e) => setFirmConfig({...firmConfig, complianceOfficer: e.target.value})}
                    className="w-full px-4 py-2 border border-brand-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-900 mb-2">
                    Compliance e-post *
                  </label>
                  <input
                    type="email"
                    value={firmConfig.complianceEmail}
                    onChange={(e) => setFirmConfig({...firmConfig, complianceEmail: e.target.value})}
                    className="w-full px-4 py-2 border border-brand-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-900 mb-2">
                    Skattekontor
                  </label>
                  <input
                    type="text"
                    value={firmConfig.taxOffice}
                    onChange={(e) => setFirmConfig({...firmConfig, taxOffice: e.target.value})}
                    className="w-full px-4 py-2 border border-brand-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-900 mb-2">
                    Revisor
                  </label>
                  <input
                    type="text"
                    value={firmConfig.auditor}
                    onChange={(e) => setFirmConfig({...firmConfig, auditor: e.target.value})}
                    className="w-full px-4 py-2 border border-brand-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleSaveFirmConfig}
                  className="bg-gradient-to-r from-brand-600 to-brand-700 text-white px-6 py-3 rounded-lg font-medium hover:from-brand-700 hover:to-brand-800 transition-all shadow-md hover:shadow-lg"
                >
                  Spara ändringar
                </button>
              </div>
            </div>
          )}

          {/* ANVÄNDARHANTERING */}
          {activeSection === 'users' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-brand-900">Användarhantering</h2>
                  <p className="text-brand-700 mt-1">Hantera åtkomst till systemet</p>
                </div>
                <button
                  onClick={() => setShowUserModal(true)}
                  className="bg-gradient-to-r from-brand-600 to-brand-700 text-white px-4 py-2 rounded-lg font-medium hover:from-brand-700 hover:to-brand-800 transition-all"
                >
                  + Bjud in användare
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-brand-200">
                      <th className="text-left py-3 px-4 text-brand-900 font-semibold">E-post</th>
                      <th className="text-left py-3 px-4 text-brand-900 font-semibold">Roll</th>
                      <th className="text-left py-3 px-4 text-brand-900 font-semibold">Senaste inloggning</th>
                      <th className="text-right py-3 px-4 text-brand-900 font-semibold">Åtgärder</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id} className="border-b border-brand-100 hover:bg-brand-50">
                        <td className="py-3 px-4 text-brand-900">{user.email}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                            user.role === 'Administratör' 
                              ? 'bg-brand-100 text-brand-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-brand-700 text-sm">{user.lastLogin}</td>
                        <td className="py-3 px-4 text-right">
                          <button className="text-red-600 hover:text-red-800 font-medium text-sm">
                            Ta bort
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 bg-brand-50 rounded-lg border-l-4 border-brand-500">
                <h3 className="font-semibold text-brand-900 mb-2">Glömt lösenord</h3>
                <p className="text-brand-700 text-sm">
                  Användare kan återställa sitt lösenord via inloggningssidan. En säker återställningslänk skickas till deras e-post.
                </p>
              </div>
            </div>
          )}

          {/* RISKTESTER */}
          {activeSection === 'tests' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-brand-900 mb-4">Risktester och validering</h2>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div>
                  <h3 className="font-bold text-yellow-900 mb-1">Testerna kan INTE stängas av</h3>
                  <p className="text-yellow-800">
                    Systemet "tjuter och plingar" vid avvikelser – detta är enligt lag obligatoriskt. 
                    Du måste acceptera att alla valideringskontroller körs på all bokföringsdata.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-brand-50 rounded-lg">
                  <h3 className="font-semibold text-brand-900 mb-2">
                    SIE-filintegritet
                  </h3>
                  <p className="text-brand-700 text-sm">
                    Teknisk validering av bokföringsfilerna (KSUMMA, debet/kredit-balans, IB+transaktioner=UB)
                  </p>
                </div>

                <div className="p-4 bg-brand-50 rounded-lg">
                  <h3 className="font-semibold text-brand-900 mb-2">
                    Bokföringskompetens
                  </h3>
                  <p className="text-brand-700 text-sm">
                    Identifierar okunniga bokförare utan illvilja (gamla balanssaldon, okonventionell preliminärskatt)
                  </p>
                </div>

                <div className="p-4 bg-brand-50 rounded-lg">
                  <h3 className="font-semibold text-brand-900 mb-2">
                    Fuskindikationer
                  </h3>
                  <p className="text-brand-700 text-sm">
                    Upptäcker medvetna försök att manipulera bokföringen (långa poster, saknade underlag, momsavvikelser)
                  </p>
                </div>

                <div className="p-4 bg-brand-50 rounded-lg">
                  <h3 className="font-semibold text-brand-900 mb-2">
                    Penningtvätt & Bedrägeri
                  </h3>
                  <p className="text-brand-700 text-sm">
                    AML-kontroller enligt penningtvättslagen (layering, smurfing, högriskländer, skalbolag, m.m.)
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => alert('Fullständig dokumentation kommer snart!')}
                  className="inline-flex items-center gap-2 text-brand-700 hover:text-brand-900 font-medium"
                >
                  Läs fullständig dokumentation
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* PRENUMERATION */}
          {activeSection === 'subscription' && (
            <div className="space-y-6">
              {/* Prenumerationsstatus */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-brand-900 mb-6">Prenumeration</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <div className="text-sm text-brand-700 mb-1">Status</div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                        subscription.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {subscription.status === 'active' ? '✓ Aktiv' : '✗ Inaktiv'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-brand-700 mb-1">Plan</div>
                    <div className="text-lg font-semibold text-brand-900">{subscription.plan}</div>
                  </div>

                  <div>
                    <div className="text-sm text-brand-700 mb-1">Nästa betalning</div>
                    <div className="text-lg font-semibold text-brand-900">{subscription.nextPayment}</div>
                  </div>

                  <div>
                    <div className="text-sm text-brand-700 mb-1">Belopp</div>
                    <div className="text-lg font-semibold text-brand-900">{subscription.amount.toLocaleString('sv-SE')} kr</div>
                  </div>

                  <div>
                    <div className="text-sm text-brand-700 mb-1">Betalningsmetod</div>
                    <div className="text-lg font-semibold text-brand-900">{subscription.paymentMethod}</div>
                  </div>

                  <div>
                    <div className="text-sm text-brand-700 mb-1">Dagar kvar</div>
                    <div className="text-lg font-semibold text-brand-900">25 dagar</div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button className="bg-gradient-to-r from-brand-600 to-brand-700 text-white px-6 py-3 rounded-lg font-medium hover:from-brand-700 hover:to-brand-800 transition-all">
                    Förnya nu
                  </button>
                  <button className="border-2 border-red-600 text-red-600 px-6 py-3 rounded-lg font-medium hover:bg-red-50 transition-all">
                    Avsluta prenumeration
                  </button>
                </div>
              </div>

              {/* Fakturahistorik */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-brand-900 mb-4">Fakturahistorik</h2>
                <p className="text-brand-700 mb-6">
                  Fakturor skickas per e-post till företagets inkorg och arkiveras hos Fortnox.
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-brand-200">
                        <th className="text-left py-3 px-4 text-brand-900 font-semibold">Fakturanummer</th>
                        <th className="text-left py-3 px-4 text-brand-900 font-semibold">Datum</th>
                        <th className="text-left py-3 px-4 text-brand-900 font-semibold">Belopp</th>
                        <th className="text-left py-3 px-4 text-brand-900 font-semibold">Status</th>
                        <th className="text-right py-3 px-4 text-brand-900 font-semibold">Åtgärd</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map(invoice => (
                        <tr key={invoice.id} className="border-b border-brand-100 hover:bg-brand-50">
                          <td className="py-3 px-4 text-brand-900 font-medium">{invoice.id}</td>
                          <td className="py-3 px-4 text-brand-700">{invoice.date}</td>
                          <td className="py-3 px-4 text-brand-900">{invoice.amount.toLocaleString('sv-SE')} kr</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                              invoice.status === 'paid' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {invoice.status === 'paid' ? 'Betald' : 'Obetald'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <a
                              href={invoice.fortnoxUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-brand-700 hover:text-brand-900 font-medium text-sm"
                            >
                              Ladda ner
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 p-4 bg-brand-50 rounded-lg border-l-4 border-brand-500">
                  <p className="text-brand-800 text-sm">
                    <strong>OBS:</strong> Fakturor skickas automatiskt per e-post från noreply@celestial.se. PDF-filer lagras inte lokalt hos oss utan arkiveras hos Fortnox.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TA BORT KONTO */}
          {activeSection === 'danger' && (
            <div className="bg-white rounded-lg shadow-md p-6 border-2 border-red-300">
              <h2 className="text-2xl font-bold text-red-900 mb-4">Danger Zone - Ta bort konto</h2>
              
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <div className="flex items-start">
                  <span className="text-2xl mr-3">⚠️</span>
                  <div>
                    <h3 className="font-bold text-red-900 mb-2">VARNING: Denna åtgärd kan inte ångras!</h3>
                    <ul className="text-red-800 space-y-1 text-sm">
                      <li>• All kunddata och bokföringsunderlag raderas permanent</li>
                      <li>• Alla användarkonton och åtkomst tas bort omedelbart</li>
                      <li>• Prenumeration avslutas och ingen återbetalning sker</li>
                      <li>• Data kan <strong>INTE</strong> återställas efter radering</li>
                    </ul>
                  </div>
                </div>
              </div>

              <p className="text-brand-700 mb-6">
                Om du är säker på att du vill ta bort ditt konto permanent, bekräfta genom att klicka på knappen nedan.
              </p>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-all"
              >
                Radera mitt konto permanent
              </button>
            </div>
          )}
        </div>

        {/* Modal: Bjud in användare */}
        {showUserModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-brand-900 mb-4">Bjud in ny användare</h3>
              <input
                type="email"
                placeholder="E-postadress"
                className="w-full px-4 py-2 border border-brand-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent mb-4"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.target.value) {
                    handleInviteUser(e.target.value);
                  }
                }}
              />
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2 border border-brand-300 rounded-lg text-brand-700 hover:bg-brand-50"
                >
                  Avbryt
                </button>
                <button
                  onClick={() => {
                    const email = document.querySelector('input[type="email"]').value;
                    if (email) handleInviteUser(email);
                  }}
                  className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700"
                >
                  Skicka inbjudan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Bekräfta radering */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-red-900 mb-4">Bekräfta kontoradering</h3>
              <p className="text-brand-700 mb-6">
                Är du helt säker? Skriv "<strong>RADERA</strong>" för att bekräfta.
              </p>
              <input
                type="text"
                placeholder="Skriv RADERA"
                className="w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mb-4"
                id="deleteConfirmInput"
              />
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-brand-300 rounded-lg text-brand-700 hover:bg-brand-50"
                >
                  Avbryt
                </button>
                <button
                  onClick={() => {
                    const input = document.getElementById('deleteConfirmInput');
                    if (input.value === 'RADERA') {
                      handleDeleteAccount();
                    } else {
                      alert('Du måste skriva exakt "RADERA" för att bekräfta.');
                    }
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Radera permanent
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
