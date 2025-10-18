import { useNavigate } from 'react-router-dom';
import Icon from '../Shared/Icon';

export default function Sidebar({ currentPath, hasRoaringData = false }) {
  const navigate = useNavigate();

  const slides = [
    { path: '/', title: 'Hem', icon: 'home' },
    { path: '/login', title: 'Logga in', icon: 'login' },
    { path: '/register', title: 'Registrera', icon: 'register' },
    { path: '/verify', title: 'Verifiera', icon: 'verify' },
    { path: '/inledning', title: 'Inledning', icon: 'info' },
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
  ];

  const handleNavigation = (path, isLocked) => {
    if (!isLocked) {
      navigate(path);
    }
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-brand-50 to-brand-50 border-r border-brand-200 flex-shrink-0 overflow-y-auto">
      <div className="p-6">
        <h2 className="text-lg font-bold text-brand-900 mb-4">Navigation</h2>
        <nav className="space-y-2">
          {slides.map((slide) => {
            const isActive = currentPath === slide.path;
            const isLocked = slide.locked;

            return (
              <button
                key={slide.path}
                onClick={() => handleNavigation(slide.path, isLocked)}
                disabled={isLocked}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all
                  ${isActive
                    ? 'bg-gradient-to-r from-brand-500 to-brand-500 text-white shadow-md'
                    : isLocked
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-brand-900 hover:bg-brand-100 hover:shadow-sm'
                  }
                `}
              >
                <span className="flex-shrink-0">
                  {isLocked ? (
                    <Icon name="lock" className="w-5 h-5" />
                  ) : (
                    <Icon name={slide.icon} className="w-5 h-5" />
                  )}
                </span>
                <span className="text-sm font-medium truncate">{slide.title}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
