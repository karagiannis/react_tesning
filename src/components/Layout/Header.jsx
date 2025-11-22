import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../Shared/Icon';

export default function Header({ onPanelToggle }) {
  const [activePanel, setActivePanel] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handlePanelClick = (panel) => {
    const newPanel = activePanel === panel ? null : panel;
    setActivePanel(newPanel);
    onPanelToggle(newPanel);
  };

  const handleLogout = () => {
    // Clear all auth data
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isDemoMode');
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('temp_orgnr');
    
    // Redirect to Hero page
    navigate('/');
  };

  const handleClearAll = async () => {
    const confirmed = window.confirm(
      '⚠️ Är du säker på att du vill radera ALLA pågående onboardings?\n\n' +
      'Detta kommer att:\n' +
      '• Radera all sparad företagsdata från backend\n' +
      '• Rensa localStorage helt\n' +
      '• Logga ut dig från systemet\n\n' +
      'Denna åtgärd kan INTE ångras!'
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.warn('Ingen token finns - kan inte radera från backend');
        localStorage.clear();
        navigate('/login');
        return;
      }

      const API_BASE = import.meta.env.VITE_API_URL || 'https://celestial.se/tic-tac-toe-api/api';

      // Hämta alla företag
      const listResponse = await fetch(`${API_BASE}/onboarding/list`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (listResponse.ok) {
        const data = await listResponse.json();
        
        // Radera alla företag
        const deletePromises = (data.companies || []).map(company =>
          fetch(`${API_BASE}/onboarding/delete/${company.orgnr}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
        );

        await Promise.all(deletePromises);
        console.log('✅ Alla företag raderade från backend');
      } else {
        console.warn('Kunde inte hämta företag från backend:', listResponse.status);
      }

      // Rensa localStorage
      localStorage.clear();
      console.log('✅ localStorage rensat');

      // Logga ut
      navigate('/login');
    } catch (error) {
      console.error('Error clearing all onboardings:', error);
      alert(`Kunde inte radera alla onboardings: ${error.message}\n\nFörsök igen eller kontakta support.`);
    }
  };

  // Get user info from localStorage or JWT
  const getUserInfo = () => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      try {
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        return {
          email: payload.email || 'Användare',
          role: payload.role || 'user'
        };
      } catch {
        return { email: 'Användare', role: 'user' };
      }
    }
    return { email: 'Användare', role: 'user' };
  };

  const userInfo = getUserInfo();

  return (
    <header className="bg-white border-b border-brand-200 px-6 py-3 flex items-center justify-between">
      {/* Logo/Title */}
      <div className="flex items-center gap-3">
        <Icon name="building" className="w-icon-md h-icon-md text-brand-600" />
        <h1 className="text-section-title text-brand-900">Kundonboarding</h1>
      </div>

      {/* Icon Menu */}
      <div className="flex items-center gap-4">
        {/* LLM - Commented out until Fortnox API keys obtained */}
        {/* <button
          onClick={() => handlePanelClick('llm')}
          className={`px-4 py-2 rounded-box transition-all font-mono font-bold text-base tracking-tight ${
            activePanel === 'llm'
              ? 'bg-brand-600 text-white'
              : 'bg-brand-100 text-brand-800 hover:bg-brand-200'
          }`}
          title="LLM Assistent - Få hjälp med frågor baserat på insamlad data"
        >
          LLM
        </button> */}

        {/* Documentation Icon */}
        <button
          onClick={() => handlePanelClick('documentation')}
          className={`flex items-center gap-2 px-4 py-2 rounded-box transition-all ${
            activePanel === 'documentation'
              ? 'bg-brand-600 text-white'
              : 'bg-brand-100 text-brand-800 hover:bg-brand-200'
          }`}
          title="Dokumentation - Hur programmet används och vilka tester som körs"
        >
          <Icon name="document" className="w-5 h-5" />
          <span className="text-sm font-medium">Dokumentation</span>
        </button>

        {/* Support Icon */}
        <button
          onClick={() => handlePanelClick('support')}
          className={`flex items-center gap-2 px-4 py-2 rounded-box transition-all ${
            activePanel === 'support'
              ? 'bg-brand-600 text-white'
              : 'bg-brand-100 text-brand-800 hover:bg-brand-200'
          }`}
          title="Support - Chatt och skärmdelning (likt Fortnox)"
        >
          <Icon name="question" className="w-5 h-5" />
          <span className="text-sm font-medium">Support</span>
        </button>

        {/* Settings Icon */}
        <button
          onClick={() => navigate('/settings')}
          className="p-2 rounded-box bg-brand-100 text-brand-800 hover:bg-brand-200 transition-all"
          title="Inställningar - Firmakonfiguration, användare, prenumeration"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        {/* User Profile Dropdown */}
        <div className="relative ml-4 border-l border-brand-200 pl-4">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 px-3 py-2 rounded-box hover:bg-brand-50 transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center font-semibold">
              {userInfo.email.charAt(0).toUpperCase()}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-sm font-medium text-brand-900">{userInfo.email}</div>
              {userInfo.role === 'admin' && (
                <div className="text-xs text-brand-600 font-semibold">Administratör</div>
              )}
            </div>
            <svg 
              className={`w-4 h-4 text-brand-600 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-box shadow-lg border border-brand-200 py-1 z-50">
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  navigate('/settings');
                }}
                className="w-full text-left px-4 py-2 text-sm text-brand-800 hover:bg-brand-50 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profil
              </button>
              {userInfo.role === 'admin' && (
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate('/admin');
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-brand-800 hover:bg-brand-50 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Admin Dashboard
                </button>
              )}
              <hr className="my-1 border-brand-200" />
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  handleClearAll();
                }}
                className="w-full text-left px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Avsluta (rensar)
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logga ut
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
