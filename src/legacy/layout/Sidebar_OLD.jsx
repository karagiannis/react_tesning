import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/Shared/Icon';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable Slide Item Component
function SortableSlideItem({ slide, isActive, isExpanded, handleNavigation }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: slide.path });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    scale: isDragging ? 1.05 : 1,
  };

  const isLocked = slide.locked;

  return (
    <div ref={setNodeRef} style={style}>
      <button
        {...(isLocked ? {} : { ...attributes, ...listeners })}
        onClick={() => handleNavigation(slide.path, isLocked)}
        disabled={isLocked}
        title={!isExpanded ? slide.title : ''}
        className={`
          w-full flex items-center gap-3 px-4 py-3 rounded-box text-left transition-all relative
          ${isActive
            ? 'bg-gradient-to-r from-brand-500 to-brand-500 text-white shadow-md'
            : isLocked
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-brand-900 hover:bg-brand-100 hover:shadow-sm cursor-grab active:cursor-grabbing'
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
    </div>
  );
}

export default function Sidebar({ currentPath, hasRoaringData = false }) {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);

  const defaultSlides = [
    // Hem-ikon tar användaren tillbaka till hero-sektionen (landing page)
    { path: '/', title: 'Hem', icon: 'home' },
    // Autentiseringssidor (login, register, verify) visas INTE i sidebar
    // eftersom de inte har sidebar överhuvudtaget
    { path: '/uppdragsval', title: 'Uppdragsval', icon: 'checkList' },
    { path: '/riskfragor', title: 'Riskfrågor', icon: 'question' },
    { path: '/identitetskontroll', title: 'Identitetskontroll', icon: 'idCard' },
    { path: '/kontrolltabell', title: 'Kontrolltabell', icon: 'checkList' },
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
    // Deep dive analysis (slides 19-20)
    { path: '/bokanalys', title: 'Bokföringsanalys', icon: 'documentSearch' },
    { path: '/penningflodes', title: 'Penningflödesanalys', icon: 'map' },
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

  // Load custom order from localStorage, or use default
  const [slides, setSlides] = useState(() => {
    const savedOrder = localStorage.getItem('sidebarOrder');
    if (savedOrder) {
      try {
        const orderMap = JSON.parse(savedOrder);
        // Merge saved order with current slides (in case new slides added)
        const orderedSlides = [];
        const slideMap = new Map(defaultSlides.map(s => [s.path, s]));
        
        // Add slides in saved order
        orderMap.forEach(path => {
          if (slideMap.has(path)) {
            orderedSlides.push(slideMap.get(path));
            slideMap.delete(path);
          }
        });
        
        // Add any new slides not in saved order
        slideMap.forEach(slide => orderedSlides.push(slide));
        
        return orderedSlides;
      } catch (e) {
        return defaultSlides;
      }
    }
    return defaultSlides;
  });

  // Update locked status when hasRoaringData changes
  useEffect(() => {
    setSlides(prevSlides => 
      prevSlides.map(slide => ({
        ...slide,
        locked: slide.path === '/verksamhet' || 
                slide.path === '/agarstruktur' || 
                slide.path === '/styrelse' || 
                slide.path === '/riskindikatorer' || 
                slide.path === '/ovrigadata' 
                ? !hasRoaringData 
                : slide.locked
      }))
    );
  }, [hasRoaringData]);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setSlides((items) => {
        const oldIndex = items.findIndex(item => item.path === active.id);
        const newIndex = items.findIndex(item => item.path === over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);
        
        // Save to localStorage
        localStorage.setItem('sidebarOrder', JSON.stringify(newOrder.map(s => s.path)));
        
        return newOrder;
      });
    }
  };

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
        {isExpanded && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-brand-900">Navigation</h2>
            <button
              onClick={() => {
                setSlides(defaultSlides);
                localStorage.removeItem('sidebarOrder');
              }}
              className="text-xs text-brand-600 hover:text-brand-800 underline"
              title="Återställ ordning"
            >
              Återställ
            </button>
          </div>
        )}
        
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={slides.map(s => s.path)}
            strategy={verticalListSortingStrategy}
          >
            <nav className="space-y-2">
              {slides.map((slide) => {
                const isActive = currentPath === slide.path;
                return (
                  <SortableSlideItem
                    key={slide.path}
                    slide={slide}
                    isActive={isActive}
                    isExpanded={isExpanded}
                    handleNavigation={handleNavigation}
                  />
                );
              })}
            </nav>
          </SortableContext>
        </DndContext>
      </div>
    </aside>
  );
}
