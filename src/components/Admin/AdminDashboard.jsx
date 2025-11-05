import React, { useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Icon from '../Shared/Icon';
import MoneyFlowMapWidget from './MoneyFlowMapWidget';

const MySwal = withReactContent(Swal.mixin({
  customClass: {
    confirmButton: 'bg-brand-600 text-white px-4 py-2 rounded-box font-medium hover:bg-brand-700 mr-2',
    cancelButton: 'bg-gray-300 text-gray-700 px-4 py-2 rounded-box font-medium hover:bg-gray-400'
  },
  buttonsStyling: false
}));

// Mock data för demonstration
const mockStats = {
  totalUsers: 450,
  activeOnboardings: 23,
  flaggedCases: 127,
  newApplications: 8,
  fraudDetectionRate: 28.2, // procent
};

const mockFraudAlerts = [
  {
    id: 1,
    company: 'Anonymiserat företag A',
    orgNr: '559XXX-XXXX',
    category: 'Verksamhetskongruens',
    description: 'Cykelförsäljare köper fiskeredskap',
    riskScore: 85,
    date: '2025-10-15',
    status: 'under_granskning',
    byrå: 'Revision Stockholm AB',
  },
  {
    id: 2,
    company: 'Anonymiserat företag B',
    orgNr: '556XXX-XXXX',
    category: 'Privatkonsumtion',
    description: 'ICA-inköp bokförda på företaget',
    riskScore: 78,
    date: '2025-10-18',
    status: 'under_granskning',
    byrå: 'Ekonomibyrån Väst',
  },
  {
    id: 3,
    company: 'Anonymiserat företag C',
    orgNr: '559XXX-XXXX',
    category: 'Cirkulära betalningar',
    description: 'Betalningar mellan närstående företag',
    riskScore: 92,
    date: '2025-10-20',
    status: 'ny',
    byrå: 'Revision Stockholm AB',
  },
  {
    id: 4,
    company: 'Anonymiserat företag D',
    orgNr: '556XXX-XXXX',
    category: 'Konkurskontroll',
    description: 'Betalning till avregistrerat företag',
    riskScore: 65,
    date: '2025-10-21',
    status: 'avslutad',
    byrå: 'Nordisk Revision',
  },
];

const mockSupportTickets = [
  {
    id: 1,
    company: 'Revision Stockholm AB',
    contact: 'Anna Andersson',
    email: 'anna@revisionstockholm.se',
    subject: 'Fråga om fraud alert - företag A',
    message: 'Vi behöver mer information om varför företag A flaggades...',
    priority: 'hög',
    status: 'ny',
    created: '2025-10-22 09:15',
  },
  {
    id: 2,
    company: 'Ekonomibyrån Väst',
    contact: 'Erik Eriksson',
    email: 'erik@ekonomibyran.se',
    subject: 'Problem med uppladdning av SIE-filer',
    message: 'Får felmeddelande när jag försöker ladda upp SIE-fil...',
    priority: 'medium',
    status: 'under_behandling',
    created: '2025-10-21 14:30',
  },
  {
    id: 3,
    company: 'Nordisk Revision',
    contact: 'Maria Nilsson',
    email: 'maria@nordiskrevision.se',
    subject: 'Fakturafråga',
    message: 'När kommer nästa faktura?',
    priority: 'låg',
    status: 'avslutad',
    created: '2025-10-20 11:20',
  },
];

const mockInvoices = [
  {
    id: 'INV-2025-001',
    company: 'Revision Stockholm AB',
    amount: 2950,
    period: '2025-10',
    users: 3,
    status: 'betald',
    dueDate: '2025-11-15',
    paidDate: '2025-11-10',
  },
  {
    id: 'INV-2025-002',
    company: 'Ekonomibyrån Väst',
    amount: 1950,
    period: '2025-10',
    users: 2,
    status: 'betald',
    dueDate: '2025-11-15',
    paidDate: '2025-11-12',
  },
  {
    id: 'INV-2025-003',
    company: 'Nordisk Revision',
    amount: 4950,
    period: '2025-10',
    users: 5,
    status: 'obetald',
    dueDate: '2025-11-15',
    paidDate: null,
  },
];

const mockAllUsers = [
  { id: 1, name: 'Anna Andersson', email: 'anna@revisionstockholm.se', company: 'Revision Stockholm AB', role: 'Admin', status: 'active', lastLogin: '2025-10-30 14:23' },
  { id: 2, name: 'Johan Svensson', email: 'johan@revisionstockholm.se', company: 'Revision Stockholm AB', role: 'User', status: 'active', lastLogin: '2025-10-29 09:45' },
  { id: 3, name: 'Maria Karlsson', email: 'maria@revisionstockholm.se', company: 'Revision Stockholm AB', role: 'User', status: 'active', lastLogin: '2025-10-28 16:12' },
  { id: 4, name: 'Erik Eriksson', email: 'erik@ekonomibyran.se', company: 'Ekonomibyrån Väst', role: 'Admin', status: 'active', lastLogin: '2025-10-30 11:34' },
  { id: 5, name: 'Sofia Andersson', email: 'sofia@ekonomibyran.se', company: 'Ekonomibyrån Väst', role: 'User', status: 'inactive', lastLogin: '2025-09-15 08:20' },
  { id: 6, name: 'Karin Berg', email: 'karin@nordiskrevision.se', company: 'Nordisk Revision', role: 'Admin', status: 'active', lastLogin: '2025-10-30 13:56' },
  { id: 7, name: 'Per Nilsson', email: 'per@nordiskrevision.se', company: 'Nordisk Revision', role: 'User', status: 'pending', lastLogin: null },
  { id: 8, name: 'Lisa Johansson', email: 'lisa@nordiskrevision.se', company: 'Nordisk Revision', role: 'User', status: 'suspended', lastLogin: '2025-10-10 19:45' },
];

const fraudCategories = [
  { name: 'Verksamhetskongruens', count: 38, percent: 30, color: 'bg-red-500' },
  { name: 'Privatkonsumtion', count: 57, percent: 45, color: 'bg-orange-500' },
  { name: 'Cirkulära betalningar', count: 19, percent: 15, color: 'bg-yellow-500' },
  { name: 'Konkurskontroll', count: 8, percent: 6, color: 'bg-brand-500' },
  { name: 'Leveransadress', count: 5, percent: 4, color: 'bg-purple-500' },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); // overview, fraud, support, invoices, email, users
  const [emailForm, setEmailForm] = useState({
    to: '',
    subject: '',
    message: '',
    type: 'single', // single or mass
  });

  // User management state
  const [users, setUsers] = useState(mockAllUsers.map(u => ({ ...u, isSelected: false, show: true })));
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const selectedUsersIds = users.filter(u => u.isSelected).map(u => u.id);
  const totalUsers = users.length;
  const allSelected = selectedUsersIds.length === totalUsers;

  const getRiskColor = (score) => {
    if (score >= 80) return 'text-red-600 bg-red-50';
    if (score >= 60) return 'text-orange-600 bg-orange-50';
    return 'text-yellow-600 bg-yellow-50';
  };

  const getStatusBadge = (status) => {
    const styles = {
      ny: 'bg-brand-100 text-brand-800',
      under_granskning: 'bg-yellow-100 text-yellow-800',
      under_behandling: 'bg-yellow-100 text-yellow-800',
      avslutad: 'bg-green-100 text-green-800',
      betald: 'bg-green-100 text-green-800',
      obetald: 'bg-red-100 text-red-800',
    };
    const labels = {
      ny: 'Ny',
      under_granskning: 'Under granskning',
      under_behandling: 'Under behandling',
      avslutad: 'Avslutad',
      betald: 'Betald',
      obetald: 'Obetald',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      hög: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      låg: 'bg-green-100 text-green-800',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[priority]}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  // User management functions (from Themesberg)
  const changeSearchValue = (e) => {
    const newSearchValue = e.target.value;
    const newUsers = users.map(u => ({
      ...u,
      show: u.name.toLowerCase().includes(newSearchValue.toLowerCase()) ||
            u.email.toLowerCase().includes(newSearchValue.toLowerCase()) ||
            u.company.toLowerCase().includes(newSearchValue.toLowerCase())
    }));
    setSearchValue(newSearchValue);
    setUsers(newUsers);
  };

  const changeStatusFilter = (e) => {
    const newStatusFilter = e.target.value;
    const newUsers = users.map(u => ({
      ...u,
      show: u.status === newStatusFilter || newStatusFilter === 'all'
    }));
    setStatusFilter(newStatusFilter);
    setUsers(newUsers);
  };

  const selectAllUsers = () => {
    const newUsers = selectedUsersIds.length === totalUsers
      ? users.map(u => ({ ...u, isSelected: false }))
      : users.map(u => ({ ...u, isSelected: true }));
    setUsers(newUsers);
  };

  const selectUser = (id) => {
    const newUsers = users.map(u => u.id === id ? ({ ...u, isSelected: !u.isSelected }) : u);
    setUsers(newUsers);
  };

  const deleteUsers = async (ids) => {
    const usersToBeDeleted = ids ? ids : selectedUsersIds;
    const usersNr = usersToBeDeleted.length;
    const textMessage = usersNr === 1
      ? 'Är du säker på att du vill radera denna användare?'
      : `Är du säker på att du vill radera dessa ${usersNr} användare?`;

    const result = await MySwal.fire({
      icon: 'error',
      title: 'Bekräfta radering',
      text: textMessage,
      showCancelButton: true,
      confirmButtonText: 'Ja, radera',
      cancelButtonText: 'Avbryt'
    });

    if (result.isConfirmed) {
      const newUsers = users.filter(f => !usersToBeDeleted.includes(f.id));
      const confirmMessage = usersNr === 1
        ? 'Användaren har raderats.'
        : 'Användarna har raderats.';

      setUsers(newUsers);
      await MySwal.fire('Raderad!', confirmMessage, 'success');
    }
  };

  const handleSendEmail = (e) => {
    e.preventDefault();
    alert(`Email skickat till: ${emailForm.to}\nÄmne: ${emailForm.subject}`);
    setEmailForm({ to: '', subject: '', message: '', type: 'single' });
  };

  const handleExportReport = () => {
    alert('Genererar PDF-rapport för Finanspolisen...\n\nRapporten kommer att innehålla:\n- Aggregerad statistik\n- Anonymiserade case studies\n- Detektionskategorier\n- Trendanalys');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-page-title text-gray-900">Administratörspanel</h1>
            <p className="mt-2 text-sm text-gray-600">
              Övervaka användare, fraud detection, support och fakturering
            </p>
          </div>

          {/* Tabs */}
          <div className="flex space-x-8 border-t border-gray-200 overflow-x-auto">
            {[
              { id: 'overview', label: 'Översikt', icon: 'chart' },
              { id: 'users', label: 'Användare', icon: 'users' },
              { id: 'fraud', label: 'Fraud Detection', icon: 'alert' },
              { id: 'support', label: 'Support', icon: 'help' },
              { id: 'invoices', label: 'Fakturering', icon: 'document' },
              { id: 'email', label: 'Email', icon: 'mail' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-brand-600 text-brand-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon name={tab.icon} className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-box shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Totalt Användare</p>
                    <p className="text-page-title text-gray-900 mt-2">{mockStats.totalUsers}</p>
                  </div>
                  <div className="bg-brand-100 rounded-full p-3">
                    <Icon name="users" className="w-6 h-6 text-brand-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-box shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Aktiva Onboardings</p>
                    <p className="text-page-title text-gray-900 mt-2">{mockStats.activeOnboardings}</p>
                  </div>
                  <div className="bg-brand-100 rounded-full p-3">
                    <Icon name="clock" className="w-6 h-6 text-brand-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-box shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Flaggade Ärenden</p>
                    <p className="text-page-title text-gray-900 mt-2">{mockStats.flaggedCases}</p>
                  </div>
                  <div className="bg-red-100 rounded-full p-3">
                    <Icon name="alert" className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-box shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Nya Ansökningar</p>
                    <p className="text-page-title text-gray-900 mt-2">{mockStats.newApplications}</p>
                  </div>
                  <div className="bg-green-100 rounded-full p-3">
                    <Icon name="checkList" className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Fraud Alerts */}
              <div className="bg-white rounded-box shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Senaste Fraud Alerts</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {mockFraudAlerts.slice(0, 3).map((alert) => (
                      <div key={alert.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-box">
                        <div className="flex-shrink-0">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${getRiskColor(alert.riskScore)}`}>
                            {alert.riskScore}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{alert.company}</p>
                          <p className="text-xs text-gray-600 mt-1">{alert.description}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="text-xs text-gray-500">{alert.date}</span>
                            {getStatusBadge(alert.status)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setActiveTab('fraud')}
                    className="mt-4 w-full text-center text-sm font-medium text-brand-600 hover:text-brand-700"
                  >
                    Visa alla fraud alerts →
                  </button>
                </div>
              </div>

              {/* Recent Support Tickets */}
              <div className="bg-white rounded-box shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Senaste Support-ärenden</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {mockSupportTickets.slice(0, 3).map((ticket) => (
                      <div key={ticket.id} className="p-3 bg-gray-50 rounded-box">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{ticket.subject}</p>
                            <p className="text-xs text-gray-600 mt-1">{ticket.company} - {ticket.contact}</p>
                          </div>
                          {getPriorityBadge(ticket.priority)}
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-xs text-gray-500">{ticket.created}</span>
                          {getStatusBadge(ticket.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setActiveTab('support')}
                    className="mt-4 w-full text-center text-sm font-medium text-brand-600 hover:text-brand-700"
                  >
                    Visa alla support-ärenden →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Users Header with Actions */}
            <div className="bg-white rounded-box shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-page-title text-gray-900">Användarhantering</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Hantera alla användare i systemet
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => alert('Lägg till ny användare')}
                    className="bg-brand-600 text-white px-4 py-2 rounded-box font-medium hover:bg-brand-700 transition-colors flex items-center space-x-2"
                  >
                    <span>+</span>
                    <span>Ny användare</span>
                  </button>
                  {selectedUsersIds.length > 0 && (
                    <button
                      onClick={() => deleteUsers()}
                      className="bg-red-600 text-white px-4 py-2 rounded-box font-medium hover:bg-red-700 transition-colors flex items-center space-x-2"
                    >
                      <span>Radera ({selectedUsersIds.length})</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Sök användare (namn, e-post, företag)..."
                      value={searchValue}
                      onChange={changeSearchValue}
                      className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-box focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    />
                    <svg
                      className="absolute left-3 top-3 h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="w-full md:w-48">
                  <select
                    value={statusFilter}
                    onChange={changeStatusFilter}
                    className="w-full px-4 py-2 border border-gray-300 rounded-box focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  >
                    <option value="all">Alla statusar</option>
                    <option value="active">Aktiv</option>
                    <option value="inactive">Inaktiv</option>
                    <option value="pending">Väntande</option>
                    <option value="suspended">Avstängd</option>
                  </select>
                </div>
              </div>

              {/* Users Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={allSelected}
                          onChange={selectAllUsers}
                          className="h-4 w-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Användare
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Företag
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Roll
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Senaste inloggning
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Åtgärder
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.filter(u => u.show).map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={user.isSelected}
                            onChange={() => selectUser(user.id)}
                            className="h-4 w-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-xs text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{user.company}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            user.role === 'Admin'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(user.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.lastLogin || 'Aldrig'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => alert(`Redigera ${user.name}`)}
                            className="text-brand-600 hover:text-brand-900 mr-4"
                          >
                            Redigera
                          </button>
                          <button
                            onClick={() => deleteUsers([user.id])}
                            className="text-red-600 hover:text-red-900"
                          >
                            Radera
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Stats Footer */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>
                    Visar {users.filter(u => u.show).length} av {totalUsers} användare
                  </span>
                  {selectedUsersIds.length > 0 && (
                    <span className="text-brand-600 font-medium">
                      {selectedUsersIds.length} användare valda
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fraud Detection Tab */}
        {activeTab === 'fraud' && (
          <div className="space-y-6">
            {/* Fraud Stats */}
            <div className="bg-white rounded-box shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Fraud Detection Översikt</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-gray-900">{mockStats.flaggedCases}</p>
                  <p className="text-sm text-gray-600 mt-1">Totalt alerts (30 dagar)</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-red-600">
                    {mockFraudAlerts.filter(a => a.riskScore >= 80).length}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Hög risk (&gt;80)</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-brand-600">{mockStats.fraudDetectionRate}%</p>
                  <p className="text-sm text-gray-600 mt-1">Detektionsgrad</p>
                </div>
              </div>

              {/* Categories Chart */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Detektionskategorier</h3>
                <div className="space-y-3">
                  {fraudCategories.map((cat) => (
                    <div key={cat.name}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">{cat.name}</span>
                        <span className="text-gray-600">{cat.count} ({cat.percent}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${cat.color} h-2 rounded-full`}
                          style={{ width: `${cat.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Export Button */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleExportReport}
                  className="w-full bg-brand-600 text-white py-3 px-4 rounded-box font-semibold hover:bg-brand-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Icon name="document" className="w-5 h-5" />
                  <span>Generera Rapport för Finanspolisen (PDF)</span>
                </button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Rapporten innehåller anonymiserad statistik och case studies
                </p>
              </div>
            </div>

            {/* Money Flow Map */}
            <MoneyFlowMapWidget />

            {/* Fraud Alerts List */}
            <div className="bg-white rounded-box shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Alla Fraud Alerts</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Företag
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kategori
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Beskrivning
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Risk
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Datum
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockFraudAlerts.map((alert) => (
                      <tr key={alert.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{alert.company}</div>
                            <div className="text-xs text-gray-500">{alert.orgNr}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{alert.category}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">{alert.description}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full font-bold ${getRiskColor(alert.riskScore)}`}>
                            {alert.riskScore}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {alert.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(alert.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Support Tab */}
        {activeTab === 'support' && (
          <div className="space-y-6">
            <div className="bg-white rounded-box shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Support-ärenden</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {mockSupportTickets.map((ticket) => (
                    <div key={ticket.id} className="border border-gray-200 rounded-box p-4 hover:border-brand-300 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-sm font-semibold text-gray-900">{ticket.subject}</h3>
                            {getPriorityBadge(ticket.priority)}
                            {getStatusBadge(ticket.status)}
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{ticket.message}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>📧 {ticket.email}</span>
                            <span>🏢 {ticket.company}</span>
                            <span>👤 {ticket.contact}</span>
                            <span>🕐 {ticket.created}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => setActiveTab('email')}
                          className="ml-4 px-4 py-2 bg-brand-600 text-white text-sm rounded-box hover:bg-brand-700 transition-colors"
                        >
                          Svara
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Invoices Tab */}
        {activeTab === 'invoices' && (
          <div className="space-y-6">
            <div className="bg-white rounded-box shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Fakturering</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Faktura-ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Företag
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Period
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Användare
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Belopp
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Förfallodatum
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockInvoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {invoice.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {invoice.company}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {invoice.period}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {invoice.users}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {invoice.amount.toLocaleString('sv-SE')} kr
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {invoice.dueDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(invoice.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    Totalt: <span className="font-semibold text-gray-900">
                      {mockInvoices.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString('sv-SE')} kr
                    </span>
                  </p>
                  <button className="px-4 py-2 bg-brand-600 text-white text-sm rounded-box hover:bg-brand-700 transition-colors">
                    Exportera till Excel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Email Tab */}
        {activeTab === 'email' && (
          <div className="space-y-6">
            <div className="bg-white rounded-box shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Skicka Email</h2>
              </div>
              <div className="p-6">
                <form onSubmit={handleSendEmail} className="space-y-4">
                  {/* Email Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email-typ
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="emailType"
                          value="single"
                          checked={emailForm.type === 'single'}
                          onChange={(e) => setEmailForm({ ...emailForm, type: e.target.value })}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Enskild användare</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="emailType"
                          value="mass"
                          checked={emailForm.type === 'mass'}
                          onChange={(e) => setEmailForm({ ...emailForm, type: e.target.value })}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Massutskick (alla användare)</span>
                      </label>
                    </div>
                  </div>

                  {/* To Field */}
                  {emailForm.type === 'single' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Till
                      </label>
                      <input
                        type="email"
                        value={emailForm.to}
                        onChange={(e) => setEmailForm({ ...emailForm, to: e.target.value })}
                        placeholder="mottagare@example.com"
                        className="w-full px-4 py-2 border border-gray-300 rounded-box focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                        required
                      />
                    </div>
                  )}

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ämne
                    </label>
                    <input
                      type="text"
                      value={emailForm.subject}
                      onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                      placeholder="Email-ämne"
                      className="w-full px-4 py-2 border border-gray-300 rounded-box focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meddelande
                    </label>
                    <textarea
                      value={emailForm.message}
                      onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
                      placeholder="Skriv ditt meddelande här..."
                      rows={8}
                      className="w-full px-4 py-2 border border-gray-300 rounded-box focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="flex-1 bg-brand-600 text-white py-3 px-4 rounded-box font-semibold hover:bg-brand-700 transition-colors"
                    >
                      Skicka Email
                    </button>
                    <button
                      type="button"
                      onClick={() => setEmailForm({ to: '', subject: '', message: '', type: 'single' })}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-box font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Rensa
                    </button>
                  </div>
                </form>

                {/* Info Box */}
                <div className="mt-6 p-4 bg-brand-50 border border-brand-200 rounded-box">
                  <p className="text-sm text-brand-800">
                    <strong>OBS:</strong> För produktionsmiljö kommer detta att integreras med SendGrid API.
                    Massutskick skickas till alla {mockStats.totalUsers} användare.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
