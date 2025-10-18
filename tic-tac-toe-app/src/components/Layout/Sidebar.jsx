import { useState } from 'react';

export default function Sidebar({ currentSlide, onSlideChange }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const slides = [
    { id: 'hero', label: 'Start', icon: '🏠' },
    { id: 'login', label: 'Logga in', icon: '🔐' },
    { id: 'register', label: 'Registrera', icon: '📝' },
    { id: 'verify', label: 'Verifiera', icon: '✉️' },
    { id: 'intro', label: 'Inledning', icon: '📋' },
    { id: 'riskFragor', label: 'Riskfrågor', icon: '❓' },
    { id: 'identitetskontroll', label: 'ID-kontroll', icon: '🆔' },
    { id: 'pepFordjupning', label: 'PEP (om ja)', icon: '⚠️' },
    { id: 'resultSlides', label: 'Resultat', icon: '📊' },
    { id: 'ekoRad', label: 'Ekonomi', icon: '💰' },
    { id: 'layering', label: 'Bokföring', icon: '📁' },
    { id: 'avtal', label: 'Avtal', icon: '📄' },
  ];

  return (
    <aside
      className={`bg-amber-900 text-white transition-all duration-300 flex flex-col ${
        isExpanded ? 'w-64' : 'w-16'
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 hover:bg-amber-800 transition-colors text-2xl"
        title={isExpanded ? 'Minimera sidebar' : 'Expandera sidebar'}
      >
        {isExpanded ? '◀' : '▶'}
      </button>

      {/* Slide Thumbnails */}
      <nav className="flex-1 overflow-y-auto py-4">
        {slides.map((slide) => (
          <button
            key={slide.id}
            onClick={() => onSlideChange(slide.id)}
            className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-amber-800 transition-colors ${
              currentSlide === slide.id ? 'bg-amber-700 border-l-4 border-orange-400' : ''
            }`}
            title={slide.label}
          >
            <span className="text-2xl">{slide.icon}</span>
            {isExpanded && (
              <span className="text-sm font-medium truncate">{slide.label}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Settings at bottom */}
      <button
        className="p-4 hover:bg-amber-800 transition-colors border-t border-amber-700 flex items-center gap-3"
        title="Inställningar"
      >
        <span className="text-2xl">⚙️</span>
        {isExpanded && <span className="text-sm font-medium">Inställningar</span>}
      </button>
    </aside>
  );
}
