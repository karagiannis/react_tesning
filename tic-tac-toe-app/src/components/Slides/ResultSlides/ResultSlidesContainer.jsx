import React, { useState } from 'react';
import ResultsTabNavigation from '../../Shared/ResultsTabNavigation';
import VerksamhetSlide from './VerksamhetSlide';
import AgarstrukturSlide from './AgarstrukturSlide';
import StyrelseSlide from './StyrelseSlide';
import RiskindikatorerSlide from './RiskindikatorerSlide';
import OvrigaDataSlide from './OvrigaDataSlide';

export default function ResultSlidesContainer({ onNext, onBack }) {
  const [activeTab, setActiveTab] = useState('verksamhet');

  const renderContent = () => {
    // Dummy handlers för interna slides - tabs ersätter navigation
    const dummyNext = () => {};
    const dummyBack = () => {};

    switch (activeTab) {
      case 'verksamhet':
        return <VerksamhetSlide onNext={dummyNext} onBack={dummyBack} hideNavigation={true} />;
      case 'agarstruktur':
        return <AgarstrukturSlide onNext={dummyNext} onBack={dummyBack} hideNavigation={true} />;
      case 'styrelse':
        return <StyrelseSlide onNext={dummyNext} onBack={dummyBack} hideNavigation={true} />;
      case 'riskindikatorer':
        return <RiskindikatorerSlide onNext={dummyNext} onBack={dummyBack} hideNavigation={true} />;
      case 'ovrigaData':
        return <OvrigaDataSlide onNext={dummyNext} onBack={dummyBack} hideNavigation={true} />;
      default:
        return <VerksamhetSlide onNext={dummyNext} onBack={dummyBack} hideNavigation={true} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex flex-col">
      {/* Tab Navigation */}
      <div className="sticky top-0 z-40">
        <ResultsTabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
      
      {/* Content Area with padding for fixed nav */}
      <div className="flex-1 pb-24">
        {renderContent()}
      </div>
      
      {/* Global Navigation - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-300 shadow-2xl p-4 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={onBack}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium flex items-center shadow-md"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Tillbaka
          </button>
          <div className="text-center">
            <div className="text-sm text-gray-600 font-medium">Resultat från Roaring.io API</div>
            <div className="text-xs text-gray-500">Bläddra mellan flikarna ovan</div>
          </div>
          <button
            onClick={onNext}
            className="px-6 py-3 bg-gradient-to-r from-brand-500 to-brand-500 text-white rounded-lg hover:from-brand-600 hover:to-brand-600 transition-colors font-medium flex items-center shadow-md"
          >
            Fortsätt
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
