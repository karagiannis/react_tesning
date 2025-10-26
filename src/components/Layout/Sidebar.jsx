import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../Shared/Icon';

export default function Sidebar({ currentPath, hasRoaringData = false }) {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);

  const slides = [
    // Hem-ikon tar användaren tillbaka till hero-sektionen (landing page)
    { path: '/', title: 'Hem', icon: 'home' },
    // Autentiseringssidor (login, register, verify) visas INTE i sidebar
    // eftersom de inte har sidebar överhuvudtaget
    { path: '/uppdragsval', title: 'Uppdragsval', icon: 'checkList' },
    { path: '/riskfragor', title: 'Riskfrågor', icon: 'question' },
    { path: '/identitetskontroll', title: 'Identitetskontroll', icon: 'idCard' },
    { path: '/kontrolltabell', title: 'Kontrolltabell', icon: 'checkList' },
    { path: '/pepfordjupning', title: 'PEP-kontroll', icon: 'alert' },
    // Result slides - locked until API data available
    { path: '/verksamhet', title: 'Verksamhet', icon: 'chart', locked: !hasRoaringData },
    { path: '/agarstruktur', title: 'Ägarstruktur', icon: 'users', locked: !hasRoaringData },
    { path: '/styrelse', title: 'Styrelse', icon: 'building', locked: !hasRoaringData },
    { path: '/riskindikatorer', title: 'Riskindikatorer', icon: 'shield', locked: !hasRoaringData },
    { path: '/ovrigadata', title: 'Övriga data', icon: 'collection', locked: !hasRoaringData },
    // Company documentation (slide 13.5)
    { path: '/dokumentation', title: 'Företagsdokumentation', icon: 'document' },
    // Accounting documents (slide 14.5)
    { path: '/underlag', title: 'Bokföringsunderlag', icon: 'collection' },
    // Accounting data slide (Skattekonto OAuth)
    { path: '/bokforing', title: 'Bokföringsdata', icon: 'document' },
    // Economic advisory slides (11-14)
    { path: '/likviditet', title: 'Likviditetsanalys', icon: 'chart' },
    { path: '/omsattning', title: 'Omsättningsanalys', icon: 'trendingUp' },
    { path: '/resultat', title: 'Resultatanalys', icon: 'pieChart' },
    { path: '/bransch', title: 'Branschjämförelse', icon: 'comparison' },
    // Deep dive analysis (slide 15)
    { path: '/bokanalys', title: 'Bokföringsanalys', icon: 'documentSearch' },
    // Risk assessment and decision (slide 17)
    { path: '/riskbedomning', title: 'Riskbedömning', icon: 'shield' },
    // Customer obligations (slide 18)
    { path: '/skyldigheter', title: 'Skyldigheter', icon: 'checkList' },
    // Contract signing (slide 19)
    { path: '/avtal', title: 'Avtal & Signering', icon: 'document' },
    // Document delivery (slide 20)
    { path: '/dokument', title: 'Dokumentleverans', icon: 'mail' },
    // Post-contract setup (slides 21-30)
    { path: '/fortnox', title: 'Fortnox-paket', icon: 'settings' },
    { path: '/bank', title: 'Bankkoppling', icon: 'building' },
    { path: '/ombud', title: 'Deklarationsombud', icon: 'document' },
    { path: '/dokument-setup', title: 'Digital dokumenthantering', icon: 'collection' },
    // Final onboarding slides
    { path: '/welcome', title: 'Välkommen!', icon: 'check' },
    { path: '/rutiner', title: 'Löpande rutiner', icon: 'refresh' },
    { path: '/support', title: 'Support & kontakt', icon: 'support' },
  ];

  const handleNavigation = (path, isLocked) => {
    if (!isLocked) {
      navigate(path);
    }
  };

  return (
    <aside className={`
      ${isExpanded ? 'w-64' : 'w-20'} 
      bg-gradient-to-b from-brand-50 to-brand-50 border-r border-brand-200 
      flex-shrink-0 overflow-y-auto transition-all duration-300 ease-in-out
      relative
    `}>
      {/* Toggle button - centered when collapsed, top-right when expanded */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`absolute bg-brand-600 hover:bg-brand-700 text-white rounded-full p-1.5 shadow-lg z-50 transition-all ${
          isExpanded 
            ? 'right-2 top-6' 
            : 'left-1/2 -translate-x-1/2 top-6'
        }`}
        aria-label={isExpanded ? "Kollapsa sidebar" : "Expandera sidebar"}
      >
        <svg 
          className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? '' : 'rotate-180'}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Add top padding when collapsed to make room for centered button */}
      <div className={isExpanded ? 'p-6' : 'pt-20 px-2 pb-6'}>
        {isExpanded && <h2 className="text-lg font-bold text-brand-900 mb-4">Navigation</h2>}
        <nav className="space-y-2">
          {slides.map((slide) => {
            const isActive = currentPath === slide.path;
            const isLocked = slide.locked;

            return (
              <button
                key={slide.path}
                onClick={() => handleNavigation(slide.path, isLocked)}
                disabled={isLocked}
                title={!isExpanded ? slide.title : ''}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all
                  ${isActive
                    ? 'bg-gradient-to-r from-brand-500 to-brand-500 text-white shadow-md'
                    : isLocked
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-brand-900 hover:bg-brand-100 hover:shadow-sm'
                  }
                  ${!isExpanded ? 'justify-center' : ''}
                `}
              >
                <span className="flex-shrink-0">
                  {isLocked ? (
                    <Icon name="lock" className="w-5 h-5" />
                  ) : (
                    <Icon name={slide.icon} className="w-5 h-5" />
                  )}
                </span>
                {isExpanded && (
                  <span className="text-sm font-medium truncate">{slide.title}</span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
