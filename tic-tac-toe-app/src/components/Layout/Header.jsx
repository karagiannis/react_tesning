import { useState } from 'react';
import Icon from '../Shared/Icon';

export default function Header({ onPanelToggle }) {
  const [activePanel, setActivePanel] = useState(null);

  const handlePanelClick = (panel) => {
    const newPanel = activePanel === panel ? null : panel;
    setActivePanel(newPanel);
    onPanelToggle(newPanel);
  };

  return (
    <header className="bg-white border-b border-brand-200 px-6 py-3 flex items-center justify-between">
      {/* Logo/Title */}
      <div className="flex items-center gap-3">
        <Icon name="building" className="w-7 h-7 text-brand-600" />
        <h1 className="text-xl font-bold text-brand-900">Kundonboarding</h1>
      </div>

      {/* Icon Menu */}
      <div className="flex items-center gap-4">
        {/* LLM - Stripe-style text only */}
        <button
          onClick={() => handlePanelClick('llm')}
          className={`px-4 py-2 rounded-lg transition-all font-mono font-bold text-base tracking-tight ${
            activePanel === 'llm'
              ? 'bg-brand-600 text-white'
              : 'bg-brand-100 text-brand-800 hover:bg-brand-200'
          }`}
          title="LLM Assistent - Få hjälp med frågor baserat på insamlad data"
        >
          LLM
        </button>

        {/* Documentation Icon */}
        <button
          onClick={() => handlePanelClick('documentation')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
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
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            activePanel === 'support'
              ? 'bg-brand-600 text-white'
              : 'bg-brand-100 text-brand-800 hover:bg-brand-200'
          }`}
          title="Support - Chatt och skärmdelning (likt Fortnox)"
        >
          <Icon name="question" className="w-5 h-5" />
          <span className="text-sm font-medium">Support</span>
        </button>
      </div>
    </header>
  );
}
