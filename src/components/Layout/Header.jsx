import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../Shared/Icon';

export default function Header({ onPanelToggle }) {
  const [activePanel, setActivePanel] = useState(null);
  const navigate = useNavigate();

  const handlePanelClick = (panel) => {
    const newPanel = activePanel === panel ? null : panel;
    setActivePanel(newPanel);
    onPanelToggle(newPanel);
  };

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

        {/* Admin Icon (endast för administratörer) */}
        <button
          onClick={() => navigate('/admin')}
          className="p-2 rounded-box bg-purple-100 text-purple-800 hover:bg-purple-200 transition-all"
          title="Administratörspanel - Övervaka användare, fraud detection, support"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
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
      </div>
    </header>
  );
}
