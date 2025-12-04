/**
 * Sidebar_v2_explicit.jsx
 * 
 * TIC-TAC-TOE ARKITEKTUR - EXPLICIT VERSION
 * 
 * Precis som i tutorialen:
 *   <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
 *   <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
 *   ...
 * 
 * Här skriver vi ut varje slide explicit:
 *   <SlideButton slideKey="uppdragsval" onClick={() => handleClick('uppdragsval')} />
 *   <SlideButton slideKey="riskfragor" onClick={() => handleClick('riskfragor')} />
 *   ...
 * 
 * PROPS:
 *   - handleClick(slideKey) - navigera till slide
 *   - handleLock(slideKey)  - lås/validera slide innan navigation
 */

import React, { useState } from 'react';

// =============================================================================
// SlideButton - motsvarar Square i tic-tac-toe
// =============================================================================
function SlideButton({ label, isActive, isCompleted, isLocked, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={isLocked}
      className={`
        w-full text-left px-3 py-2 rounded-lg text-sm
        transition-colors duration-150
        ${isActive 
          ? 'bg-brand-100 text-brand-900 font-medium' 
          : isCompleted
            ? 'text-brand-700 hover:bg-brand-50'
            : isLocked
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-600 hover:bg-gray-100'
        }
      `}
    >
      <span className="flex items-center gap-2">
        {isCompleted && <span className="text-green-500">✓</span>}
        {isLocked && <span className="text-gray-400">🔒</span>}
        {label}
      </span>
    </button>
  );
}

// =============================================================================
// GroupHeader - rubrik för slide-grupp
// =============================================================================
function GroupHeader({ title, isExpanded }) {
  if (!isExpanded) return null;
  return (
    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
      {title}
    </div>
  );
}

// =============================================================================
// Sidebar_v2 - motsvarar Board i tic-tac-toe
// =============================================================================
export default function Sidebar_v2({ 
  // State från useMasterState (som squares i tic-tac-toe)
  currentSlideKey,
  completedSlides = [],
  activeCase,
  
  // Handlers från useMasterState (som handleClick i tic-tac-toe)
  handleClick,
  handleLock,
}) {
  // Lokal UI-state (OK - bara visuellt)
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Helper: kolla om slide är completed
  const isCompleted = (key) => completedSlides.includes(key);
  
  // Helper: kolla om slide är aktiv
  const isActive = (key) => currentSlideKey === key;
  
  // Helper: kolla om slide är låst (kan inte nås ännu)
  // I tic-tac-toe: en ruta kan inte klickas om spelet är över
  // Här: en slide kan inte nås om föregående inte är klar
  const isLocked = (key) => {
    if (handleLock) {
      return handleLock(key);
    }
    return false;
  };

  return (
    <aside 
      className={`
        ${isExpanded ? 'w-64' : 'w-16'} 
        bg-white border-r border-gray-200 flex flex-col
        transition-all duration-300 ease-in-out
      `}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {isExpanded && (
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-brand-900 truncate">
              Onboarding
            </h2>
            {activeCase && (
              <p className="text-sm text-gray-600 truncate mt-1">
                {activeCase.companyName}
              </p>
            )}
          </div>
        )}
        
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
      
      {/* Navigation - EXPLICIT som i tic-tac-toe! */}
      <nav className="flex-1 overflow-y-auto p-2">
        
        {/* ============= GRUNDINFO ============= */}
        <GroupHeader title="Grundinfo" isExpanded={isExpanded} />
        <SlideButton 
          label="Uppdragsval" 
          isActive={isActive('uppdragsval')}
          isCompleted={isCompleted('uppdragsval')}
          isLocked={isLocked('uppdragsval')}
          onClick={() => handleClick('uppdragsval')}
        />
        
        {/* ============= RISKBEDÖMNING ============= */}
        <GroupHeader title="Riskbedömning" isExpanded={isExpanded} />
        <SlideButton 
          label="Riskfrågor" 
          isActive={isActive('riskfragor')}
          isCompleted={isCompleted('riskfragor')}
          isLocked={isLocked('riskfragor')}
          onClick={() => handleClick('riskfragor')}
        />
        <SlideButton 
          label="Riskfrågor steg 2" 
          isActive={isActive('riskfragor-steg2')}
          isCompleted={isCompleted('riskfragor-steg2')}
          isLocked={isLocked('riskfragor-steg2')}
          onClick={() => handleClick('riskfragor-steg2')}
        />
        <SlideButton 
          label="Riskfrågor steg 3" 
          isActive={isActive('riskfragor-steg3')}
          isCompleted={isCompleted('riskfragor-steg3')}
          isLocked={isLocked('riskfragor-steg3')}
          onClick={() => handleClick('riskfragor-steg3')}
        />
        <SlideButton 
          label="Riskfrågor steg 4" 
          isActive={isActive('riskfragor-steg4')}
          isCompleted={isCompleted('riskfragor-steg4')}
          isLocked={isLocked('riskfragor-steg4')}
          onClick={() => handleClick('riskfragor-steg4')}
        />
        
        {/* ============= FÖRETAGSDATA ============= */}
        <GroupHeader title="Företagsdata" isExpanded={isExpanded} />
        <SlideButton 
          label="Verksamhet" 
          isActive={isActive('verksamhet')}
          isCompleted={isCompleted('verksamhet')}
          isLocked={isLocked('verksamhet')}
          onClick={() => handleClick('verksamhet')}
        />
        <SlideButton 
          label="Ägarstruktur" 
          isActive={isActive('agarstruktur')}
          isCompleted={isCompleted('agarstruktur')}
          isLocked={isLocked('agarstruktur')}
          onClick={() => handleClick('agarstruktur')}
        />
        <SlideButton 
          label="Styrelse" 
          isActive={isActive('styrelse')}
          isCompleted={isCompleted('styrelse')}
          isLocked={isLocked('styrelse')}
          onClick={() => handleClick('styrelse')}
        />
        <SlideButton 
          label="Övriga data" 
          isActive={isActive('ovriga-data')}
          isCompleted={isCompleted('ovriga-data')}
          isLocked={isLocked('ovriga-data')}
          onClick={() => handleClick('ovriga-data')}
        />
        
        {/* ============= DOKUMENT ============= */}
        <GroupHeader title="Dokument" isExpanded={isExpanded} />
        <SlideButton 
          label="Bokföringsdata" 
          isActive={isActive('bokforing-data')}
          isCompleted={isCompleted('bokforing-data')}
          isLocked={isLocked('bokforing-data')}
          onClick={() => handleClick('bokforing-data')}
        />
        <SlideButton 
          label="Företagsdokumentation" 
          isActive={isActive('foretagsdokumentation')}
          isCompleted={isCompleted('foretagsdokumentation')}
          isLocked={isLocked('foretagsdokumentation')}
          onClick={() => handleClick('foretagsdokumentation')}
        />
        <SlideButton 
          label="Bokföringsunderlag" 
          isActive={isActive('bokforingsunderlag')}
          isCompleted={isCompleted('bokforingsunderlag')}
          isLocked={isLocked('bokforingsunderlag')}
          onClick={() => handleClick('bokforingsunderlag')}
        />
        
        {/* ============= ANALYS ============= */}
        <GroupHeader title="Analys" isExpanded={isExpanded} />
        <SlideButton 
          label="Resultatanalys" 
          isActive={isActive('resultatanalys')}
          isCompleted={isCompleted('resultatanalys')}
          isLocked={isLocked('resultatanalys')}
          onClick={() => handleClick('resultatanalys')}
        />
        <SlideButton 
          label="Likviditetsanalys" 
          isActive={isActive('likviditetsanalys')}
          isCompleted={isCompleted('likviditetsanalys')}
          isLocked={isLocked('likviditetsanalys')}
          onClick={() => handleClick('likviditetsanalys')}
        />
        <SlideButton 
          label="Omsättningsanalys" 
          isActive={isActive('omsattningsanalys')}
          isCompleted={isCompleted('omsattningsanalys')}
          isLocked={isLocked('omsattningsanalys')}
          onClick={() => handleClick('omsattningsanalys')}
        />
        
        {/* ============= SLUTFÖR ============= */}
        <GroupHeader title="Slutför" isExpanded={isExpanded} />
        <SlideButton 
          label="Riskbedömning" 
          isActive={isActive('riskbedomning')}
          isCompleted={isCompleted('riskbedomning')}
          isLocked={isLocked('riskbedomning')}
          onClick={() => handleClick('riskbedomning')}
        />
        <SlideButton 
          label="Avtal" 
          isActive={isActive('avtal')}
          isCompleted={isCompleted('avtal')}
          isLocked={isLocked('avtal')}
          onClick={() => handleClick('avtal')}
        />
        <SlideButton 
          label="Betalning klar" 
          isActive={isActive('payment-success')}
          isCompleted={isCompleted('payment-success')}
          isLocked={isLocked('payment-success')}
          onClick={() => handleClick('payment-success')}
        />
        <SlideButton 
          label="Support" 
          isActive={isActive('support')}
          isCompleted={isCompleted('support')}
          isLocked={isLocked('support')}
          onClick={() => handleClick('support')}
        />
        
      </nav>
      
      {/* Footer med progress */}
      {isExpanded && (
        <div className="p-4 border-t border-gray-200">
          <div className="text-sm text-gray-600 mb-2">
            Progress: {completedSlides.length} / 18 slides
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-brand-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedSlides.length / 18) * 100}%` }}
            />
          </div>
        </div>
      )}
    </aside>
  );
}
