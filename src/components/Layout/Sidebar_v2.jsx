/**
 * Sidebar_v2.jsx
 * 
 * TIC-TAC-TOE ARKITEKTUR
 * 
 * Sidebar som använder useMasterContext()
 * - Navigation-knappar → actions.goTo(slideKey)
 * - Expand/retract → lokal useState (OK - bara UI)
 * - Progress → läser från state.completedSlides
 * 
 * REGEL: Ingen egen logik för navigation, API, localStorage
 *        Allt går via actions.xxx()
 */

import React, { useState } from 'react';
import { useMasterContext } from '../../context/MasterStateContext_v2';
import { SLIDE_ORDER } from '../../hooks/useMasterState_v2';

export default function Sidebar_v2() {
  const { state, actions, helpers } = useMasterContext();
  
  // Lokal UI-state för expand/retract (OK - påverkar inte app-logik)
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Filtrera till bara auth-required slides för sidebaren
  const onboardingSlides = SLIDE_ORDER.filter(s => s.requiresAuth);
  
  // Gruppera slides för bättre UX
  const slideGroups = [
    {
      title: 'Grundinfo',
      slides: ['uppdragsval'],  // Första sidan efter login
    },
    {
      title: 'Riskbedömning',
      slides: ['riskfragor', 'riskfragor-steg2', 'riskfragor-steg3', 'riskfragor-steg4'],
    },
    {
      title: 'Företagsdata',
      slides: ['verksamhet', 'agarstruktur', 'styrelse', 'ovriga-data'],
    },
    {
      title: 'Dokument',
      slides: ['bokforing-data', 'foretagsdokumentation', 'bokforingsunderlag'],
    },
    {
      title: 'Analys',
      slides: ['resultatanalys', 'likviditetsanalys', 'omsattningsanalys'],
    },
    {
      title: 'Slutför',
      slides: ['riskbedomning', 'avtal', 'payment-success', 'support'],
    },
  ];
  
  return (
    <aside 
      className={`
        ${isExpanded ? 'w-64' : 'w-16'} 
        bg-white border-r border-gray-200 flex flex-col
        transition-all duration-300 ease-in-out
      `}
    >
      {/* Header med expand/retract knapp */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {isExpanded && (
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-brand-900 truncate">
              Onboarding
            </h2>
            {state.activeCase && (
              <p className="text-sm text-gray-600 truncate mt-1">
                {state.activeCase.companyName}
              </p>
            )}
          </div>
        )}
        
        {/* Expand/Retract knapp */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          title={isExpanded ? 'Minimera' : 'Expandera'}
        >
          <svg 
            className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isExpanded ? '' : 'rotate-180'}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        {slideGroups.map((group) => {
          const groupSlides = group.slides
            .map(key => onboardingSlides.find(s => s.key === key))
            .filter(Boolean);
          
          if (groupSlides.length === 0) return null;
          
          return (
            <div key={group.title} className="mb-4">
              {/* Group title */}
              {isExpanded && (
                <h3 className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {group.title}
                </h3>
              )}
              
              {/* Group slides */}
              <ul className="space-y-1">
                {groupSlides.map((slide) => {
                  const globalIndex = onboardingSlides.findIndex(s => s.key === slide.key);
                  const isCompleted = state.completedSlides.includes(slide.key);
                  const isCurrent = state.currentSlideKey === slide.key;
                  const canAccess = helpers.canAccessSlide(slide.key);
                  
                  return (
                    <li key={slide.key}>
                      <button
                        onClick={() => {
                          if (canAccess) {
                            // 🎯 TIC-TAC-TOE: Klick skickas till actions
                            actions.goTo(slide.key);
                          }
                        }}
                        disabled={!canAccess}
                        className={`
                          w-full text-left px-3 py-2 rounded-lg text-sm flex items-center
                          transition-colors duration-150
                          ${isCurrent 
                            ? 'bg-brand-100 text-brand-900 font-medium' 
                            : isCompleted 
                              ? 'text-gray-700 hover:bg-gray-100' 
                              : canAccess 
                                ? 'text-gray-500 hover:bg-gray-50'
                                : 'text-gray-300 cursor-not-allowed'
                          }
                        `}
                        title={!isExpanded ? formatSlideName(slide.key) : undefined}
                      >
                        {/* Status indicator */}
                        <span className={`
                          w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0
                          ${isCompleted 
                            ? 'bg-green-500 text-white' 
                            : isCurrent 
                              ? 'bg-brand-500 text-white' 
                              : 'bg-gray-200 text-gray-500'
                          }
                        `}>
                          {isCompleted ? '✓' : globalIndex + 1}
                        </span>
                        
                        {/* Slide name - visa bara om expanded */}
                        {isExpanded && (
                          <span className="ml-3 truncate">
                            {formatSlideName(slide.key)}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>
      
      {/* Footer med progress */}
      <div className="p-4 border-t border-gray-200">
        {isExpanded ? (
          <>
            <div className="text-xs text-gray-500 mb-2">
              {state.completedSlides.length} / {onboardingSlides.length} steg klara
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand-500 transition-all duration-300"
                style={{ 
                  width: `${(state.completedSlides.length / onboardingSlides.length) * 100}%` 
                }}
              />
            </div>
          </>
        ) : (
          <div className="text-center">
            <span className="text-xs text-gray-500">
              {state.completedSlides.length}/{onboardingSlides.length}
            </span>
          </div>
        )}
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
