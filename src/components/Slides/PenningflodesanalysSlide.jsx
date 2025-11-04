import React from 'react';
import MoneyFlowMapWidget from '../Admin/MoneyFlowMapWidget';

export default function PenningflodesanalysSlide({ onNext, onBack }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <h1 className="text-3xl font-bold text-gray-900">Penningflödesanalys</h1>
        <p className="text-gray-600 mt-2">Geografisk visualisering av transaktioner och mottagare</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-8 py-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Intro text */}
          <div className="bg-brand-50 border-l-4 border-brand-500 p-4 rounded">
            <h3 className="text-lg font-semibold text-brand-900 mb-2">
              Forensisk Bokföringsanalys
            </h3>
            <p className="text-sm text-brand-800">
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
      </div>

      {/* Navigation Footer */}
      <div className="bg-white border-t border-gray-200 px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={onBack}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            ← Tillbaka
          </button>
          <button
            onClick={onNext}
            className="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
          >
            Nästa →
          </button>
        </div>
      </div>
    </div>
  );
}
