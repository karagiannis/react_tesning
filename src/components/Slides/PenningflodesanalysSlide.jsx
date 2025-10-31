import React from 'react';
import SlideLayout from './SlideLayout';
import MoneyFlowMapWidget from './MoneyFlowMapWidget';

const PenningflodesanalysSlide = ({ onNext, onBack }) => {
  return (
    <SlideLayout
      title="Penningflödesanalys"
      subtitle="Geografisk visualisering av transaktioner och mottagare"
      onNext={onNext}
      onBack={onBack}
    >
      <div className="space-y-6">
        {/* Intro text */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Forensisk Bokföringsanalys
          </h3>
          <p className="text-sm text-blue-800">
            Baserat på IBAN-numret och SIE-filerna har vi analyserat penningflöden och mottagare.
            Kartan visar geografisk fördelning av leverantörer, kunder och potentiella varningsflaggningar.
          </p>
        </div>

        {/* Alert om misstänkta transaktioner */}
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-red-500 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="text-sm font-bold text-red-800 mb-1">Varningar upptäckta</h4>
              <p className="text-sm text-red-700">
                Vi har identifierat <strong>2 misstänkta hyresbetalningar</strong> till bostadsfastigheter.
                Detta kan indikera privata levnadskostnader som felaktigt bokförts på företaget.
              </p>
            </div>
          </div>
        </div>

        {/* Map Widget */}
        <MoneyFlowMapWidget />

        {/* Info om nästa steg */}
        <div className="bg-gray-50 border border-gray-200 p-4 rounded">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Nästa steg</h4>
          <p className="text-sm text-gray-700">
            Granska de flaggade transaktionerna i detalj. Diskutera eventuella avvikelser med klienten
            innan ni fortsätter med onboarding-processen.
          </p>
        </div>
      </div>
    </SlideLayout>
  );
};

export default PenningflodesanalysSlide;
