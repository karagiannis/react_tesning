import { useState } from 'react';

export default function Header({ onPanelToggle }) {
  const [activePanel, setActivePanel] = useState(null);

  const handlePanelClick = (panel) => {
    const newPanel = activePanel === panel ? null : panel;
    setActivePanel(newPanel);
    onPanelToggle(newPanel);
  };

  return (
    <header className="bg-white border-b border-amber-200 px-6 py-3 flex items-center justify-between">
      {/* Logo/Title */}
      <div className="flex items-center gap-3">
        <span className="text-2xl">🏢</span>
        <h1 className="text-xl font-bold text-amber-900">Kundonboarding</h1>
      </div>

      {/* Icon Menu */}
      <div className="flex items-center gap-4">
        {/* LLM Icon */}
        <button
          onClick={() => handlePanelClick('llm')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            activePanel === 'llm'
              ? 'bg-orange-600 text-white'
              : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
          }`}
          title="LLM Assistent - Få hjälp med frågor baserat på insamlad data"
        >
          <span className="text-xl">🤖</span>
          <span className="text-sm font-medium">LLM</span>
        </button>

        {/* Documentation Icon */}
        <button
          onClick={() => handlePanelClick('documentation')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            activePanel === 'documentation'
              ? 'bg-orange-600 text-white'
              : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
          }`}
          title="Dokumentation - Hur programmet används och vilka tester som körs"
        >
          <span className="text-xl">📚</span>
          <span className="text-sm font-medium">Dokumentation</span>
        </button>

        {/* Support Icon */}
        <button
          onClick={() => handlePanelClick('support')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            activePanel === 'support'
              ? 'bg-orange-600 text-white'
              : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
          }`}
          title="Support - Chatt och skärmdelning (likt Fortnox)"
        >
          <span className="text-xl">❓</span>
          <span className="text-sm font-medium">Support</span>
        </button>
      </div>
    </header>
  );
}
