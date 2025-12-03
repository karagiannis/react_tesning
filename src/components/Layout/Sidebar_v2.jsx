/**
 * Sidebar_v2.jsx
 * 
 * Enkel sidebar som använder useMasterContext()
 * Visar slide-ordningen och markerar completed/current
 */

import React from 'react';
import { useMasterContext } from '../../context/MasterStateContext_v2';
import { SLIDE_ORDER } from '../../hooks/useMasterState_v2';

export default function Sidebar_v2() {
  const { state, actions, helpers } = useMasterContext();
  
  // Filtrera till bara auth-required slides för sidebaren
  const onboardingSlides = SLIDE_ORDER.filter(s => s.requiresAuth);
  
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-brand-900">Onboarding</h2>
        {state.activeCase && (
          <p className="text-sm text-gray-600 mt-1">
            {state.activeCase.companyName}
          </p>
        )}
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {onboardingSlides.map((slide, index) => {
            const isCompleted = state.completedSlides.includes(slide.key);
            const isCurrent = state.currentSlideKey === slide.key;
            const canAccess = helpers.canAccessSlide(slide.key);
            
            return (
              <li key={slide.key}>
                <button
                  onClick={() => canAccess && actions.goTo(slide.key)}
                  disabled={!canAccess}
                  className={`
                    w-full text-left px-3 py-2 rounded-lg text-sm flex items-center
                    ${isCurrent 
                      ? 'bg-brand-100 text-brand-900 font-medium' 
                      : isCompleted 
                        ? 'text-gray-700 hover:bg-gray-100' 
                        : canAccess 
                          ? 'text-gray-500 hover:bg-gray-50'
                          : 'text-gray-300 cursor-not-allowed'
                    }
                  `}
                >
                  {/* Status indicator */}
                  <span className={`
                    w-5 h-5 rounded-full mr-3 flex items-center justify-center text-xs
                    ${isCompleted 
                      ? 'bg-green-500 text-white' 
                      : isCurrent 
                        ? 'bg-brand-500 text-white' 
                        : 'bg-gray-200 text-gray-500'
                    }
                  `}>
                    {isCompleted ? '✓' : index + 1}
                  </span>
                  
                  {/* Slide name */}
                  <span className="truncate">
                    {formatSlideName(slide.key)}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          {state.completedSlides.length} / {onboardingSlides.length} steg klara
        </div>
        <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-brand-500 transition-all duration-300"
            style={{ 
              width: `${(state.completedSlides.length / onboardingSlides.length) * 100}%` 
            }}
          />
        </div>
      </div>
    </aside>
  );
}

// Helper för att göra slide-key till läsbar text
function formatSlideName(key) {
  const nameMap = {
    'welcome': 'Välkommen',
    'intro': 'Introduktion',
    'uppdragsval': 'Uppdragsval',
    'riskfragor': 'Riskfrågor 1',
    'riskfragor-steg2': 'Riskfrågor 2',
    'riskfragor-steg3': 'Riskfrågor 3',
    'riskfragor-steg4': 'Riskfrågor 4',
    'verksamhet': 'Verksamhet',
    'agarstruktur': 'Ägarstruktur',
    'styrelse': 'Styrelse',
    'ovriga-data': 'Övriga data',
    'bokforing-data': 'Bokföringsdata',
    'foretagsdokumentation': 'Dokumentation',
    'bokforingsunderlag': 'Underlag',
    'resultatanalys': 'Resultatanalys',
    'likviditetsanalys': 'Likviditetsanalys',
    'omsattningsanalys': 'Omsättningsanalys',
    'riskbedomning': 'Riskbedömning',
    'avtal': 'Avtal',
    'payment-success': 'Betalning',
    'support': 'Support',
  };
  
  return nameMap[key] || key.replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase());
}
