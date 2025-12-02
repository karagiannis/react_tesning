import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../Shared/Icon';

export default function Sidebar({ currentPath, hasRoaringData = false }) {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem('sidebarWidth');
    return saved ? parseInt(saved) : 256; // 256px = w-64 default
  });
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef(null);

  const slides = [
    // Hem-ikon removed - was duplicate of Uppdragsval causing both to be highlighted
    // User enters onboarding flow directly at Uppdragsval after login
    { path: '/uppdragsval', title: 'Uppdragsval', icon: 'checkList' },
    { path: '/riskfragor/:companyId/:caseId', title: 'Riskfrågor', icon: 'question', requiresCompanyId: true, requiresCaseId: true },
    { path: '/identitetskontroll/:companyId', title: 'Identitetskontroll', icon: 'idCard', requiresCompanyId: true },
    { path: '/kontrolltabell/:companyId', title: 'Kontrolltabell', icon: 'checkList', requiresCompanyId: true },
    // Result slides - locked until API data available
    { path: '/verksamhet/:companyId', title: 'Verksamhet', icon: 'chart', locked: !hasRoaringData, requiresCompanyId: true },
    { path: '/agarstruktur/:companyId', title: 'Ägarstruktur', icon: 'users', locked: !hasRoaringData, requiresCompanyId: true },
    { path: '/styrelse/:companyId', title: 'Styrelse', icon: 'building', locked: !hasRoaringData, requiresCompanyId: true },
    { path: '/riskindikatorer/:companyId', title: 'Riskindikatorer', icon: 'shield', locked: !hasRoaringData, requiresCompanyId: true },
    { path: '/ovrigadata/:companyId', title: 'Övriga data', icon: 'collection', locked: !hasRoaringData, requiresCompanyId: true },
    // Company documentation (slide 13.5)
    { path: '/dokumentation/:companyId', title: 'Företagsdokumentation', icon: 'document', requiresCompanyId: true },
    // Accounting documents (slide 14.5)
    { path: '/underlag/:companyId', title: 'Bokföringsunderlag', icon: 'collection', requiresCompanyId: true },
    // Accounting data slide (Skattekonto OAuth)
    { path: '/bokforing/:companyId', title: 'Bokföringsdata', icon: 'document', requiresCompanyId: true },
    // Economic advisory slides (11-14)
    { path: '/likviditet/:companyId', title: 'Likviditetsanalys', icon: 'chart', requiresCompanyId: true },
    { path: '/omsattning/:companyId', title: 'Omsättningsanalys', icon: 'trendingUp', requiresCompanyId: true },
    { path: '/resultat/:companyId', title: 'Resultatanalys', icon: 'pieChart', requiresCompanyId: true },
    { path: '/bransch/:companyId', title: 'Branschjämförelse', icon: 'comparison', requiresCompanyId: true },
    // Deep dive analysis (slides 19-20)
    { path: '/bokanalys/:companyId', title: 'Bokföringsanalys', icon: 'documentSearch', requiresCompanyId: true },
    { path: '/penningflodes/:companyId', title: 'Penningflödesanalys', icon: 'map', requiresCompanyId: true },
    // Risk assessment and decision (slide 20)
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

  const handleNavigation = (path, isLocked, requiresCompanyId, requiresCaseId) => {
    if (isLocked) return;
    
    // If path requires companyId or caseId, get them from localStorage
    if (requiresCompanyId || requiresCaseId) {
      const companyId = localStorage.getItem('current_company_id');
      const caseId = localStorage.getItem('onboarding_id');
      
      if (requiresCompanyId && !companyId) {
        console.error('❌ No current_company_id found in localStorage for navigation to', path);
        alert('Inget pågående onboarding-ärende hittat. Börja om från Uppdragsval.');
        return;
      }
      
      if (requiresCaseId && !caseId) {
        console.error('❌ No onboardingId found in localStorage for navigation to', path);
        alert('Inget pågående onboarding-ärende hittat. Börja om från Uppdragsval.');
        return;
      }
      
      // Replace placeholders with actual values
      let resolvedPath = path;
      if (requiresCompanyId) {
        resolvedPath = resolvedPath.replace(':companyId', companyId);
      }
      if (requiresCaseId) {
        resolvedPath = resolvedPath.replace(':caseId', caseId);
      }
      
      navigate(resolvedPath);
    } else {
      navigate(path);
    }
  };

  // Resize handlers
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;

      const newWidth = e.clientX;
      // Constrain between 200px (min) and 400px (max)
      if (newWidth >= 200 && newWidth <= 400) {
        setSidebarWidth(newWidth);
        localStorage.setItem('sidebarWidth', newWidth.toString());
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  return (
    <aside
      ref={sidebarRef}
      style={{ width: isExpanded ? `${sidebarWidth}px` : '80px' }}
      className={`
        scrollbar-hide-until-hover
        bg-gradient-to-b from-brand-50 to-brand-50 border-r border-brand-200 
        flex-shrink-0 overflow-y-auto transition-all duration-300 ease-in-out
        relative
      `}
    >
      {/* Resize handle - vertical bar on right edge */}
      {isExpanded && (
        <div
          onMouseDown={handleMouseDown}
          className={`
            absolute top-0 right-0 w-1 h-full cursor-ew-resize
            hover:bg-brand-400 transition-colors z-50
            ${isResizing ? 'bg-brand-500' : 'bg-transparent'}
          `}
        >
          {/* Visible indicator on hover */}
          <div className="absolute top-1/2 -translate-y-1/2 right-0 w-1 h-12 bg-brand-300 opacity-0 hover:opacity-100 transition-opacity" />
        </div>
      )}

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
            // Handle path matching for dynamic routes
            let isActive;
            if (slide.requiresCompanyId) {
              // Match /riskfragor/:companyId pattern with actual /riskfragor/5569...
              const basePattern = slide.path.split('/:')[0];
              isActive = currentPath.startsWith(basePattern);
            } else {
              isActive = currentPath === slide.path;
            }
            
            const isLocked = slide.locked;

            return (
              <button
                key={slide.path}
                onClick={() => handleNavigation(slide.path, isLocked, slide.requiresCompanyId, slide.requiresCaseId)}
                disabled={isLocked}
                title={!isExpanded ? slide.title : ''}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-box text-left transition-all
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
