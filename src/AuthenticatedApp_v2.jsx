/**
 * AuthenticatedApp_v2.jsx
 * 
 * Alla routes efter inloggning.
 * Denna komponent är INUTI MasterStateProvider.
 * 
 * Alla slides här är "dumma" - de använder useMasterContext()
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useMasterContext } from './context/MasterStateContext_v2';

// =============================================================================
// LAYOUT
// =============================================================================
import Sidebar_v2 from './components/Layout/Sidebar_v2';
import Header_v2 from './components/Layout/Header_v2';

// =============================================================================
// SLIDES - Alla använder useMasterContext()
// =============================================================================
// TODO: Migrera dessa till v2-versioner en i taget
import WelcomeSlide from './components/Slides/WelcomeSlide';
import UppdragsvalsSlide from './components/Slides/UppdragsvalsSlide';
import RiskFragorSlide from './components/Slides/RiskFragorSlide';
import RiskFragorSteg2Slide from './components/Slides/RiskFragorSteg2Slide';
import RiskFragorSteg3Slide from './components/Slides/RiskFragorSteg3Slide';
import RiskFragorSteg4Slide from './components/Slides/RiskFragorSteg4Slide';
import VerksamhetSlide from './components/Slides/ResultSlides/VerksamhetSlide';
import AgarstrukturSlide from './components/Slides/ResultSlides/AgarstrukturSlide';
import StyrelseSlide from './components/Slides/ResultSlides/StyrelseSlide';
import OvrigaDataSlide from './components/Slides/ResultSlides/OvrigaDataSlide';
import BokforingDataSlide from './components/Slides/BokforingDataSlide';
import ForetagsdokumentationSlide from './components/Slides/ForetagsdokumentationSlide';
import BokforingsunderlagSlide from './components/Slides/BokforingsunderlagSlide';
import ResultatanalysSlide from './components/Slides/ResultatanalysSlide';
import LikviditetsanalysSlide from './components/Slides/LikviditetsanalysSlide';
import OmsattningsanalysSlide from './components/Slides/OmsattningsanalysSlide';
import BokforingsanalysSlide from './components/Slides/BokforingsanalysSlide';
import PenningflodesanalysSlide from './components/Slides/PenningflodesanalysSlide';
import BranschjamforelseSlide from './components/Slides/BranschjamforelseSlide';
import RiskbedomningSlide from './components/Slides/RiskbedomningSlide';
import AvtalSlide from './components/Slides/AvtalSlide';
import PaymentSuccessSlide from './components/Slides/PaymentSuccessSlide';
import SupportSlide from './components/Slides/SupportSlide';
import FortnoxPackageSlide from './components/Slides/FortnoxPackageSlide';
import DeklarationsombudSlide from './components/Slides/DeklarationsombudSlide';
import SkyldigheterSlide from './components/Slides/SkyldigheterSlide';
import DocumentSetupSlide from './components/Slides/DocumentSetupSlide';
import BankRattigheterSlide from './components/Slides/BankRattigheterSlide';
import DocumentDeliverySlide from './components/Slides/DocumentDeliverySlide';
import IdentitetskontrollSlide from './components/Slides/IdentitetskontrollSlide';
import KontrolltabellSlide from './components/Slides/KontrolltabellSlide';
import OngoingRoutinesSlide from './components/Slides/OngoingRoutinesSlide';
import PEPSlide from './components/Slides/PEPSlide';

// =============================================================================
// MODALS
// =============================================================================
import OnboardingResumeDialog from './components/Modals/OnboardingResumeDialog';
import MergeConflictModal from './components/Modals/MergeConflictModal';

// =============================================================================
// EXAMPLE V2 SLIDE (för test)
// =============================================================================
import ExampleSlide_v2 from './components/Slides/ExampleSlide_v2';

// =============================================================================
// AUTHENTICATED APP COMPONENT
// =============================================================================
export default function AuthenticatedApp() {
  const { state, actions } = useMasterContext();
  
  // Wrapper som ger onNext/onBack till gamla slides under migrering
  const withNavigation = (SlideComponent) => {
    return (props) => (
      <SlideComponent 
        {...props}
        onNext={actions.next}
        onBack={actions.back}
      />
    );
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar_v2 />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header_v2 />
        
        {/* Content */}
        <main className="flex-1 overflow-auto">
          <Routes>
            {/* Onboarding flow */}
            <Route path="/inledning" element={withNavigation(WelcomeSlide)({})} />
            <Route path="/uppdragsval" element={withNavigation(UppdragsvalsSlide)({})} />
            <Route path="/riskfragor" element={withNavigation(RiskFragorSlide)({})} />
            <Route path="/riskfragor-steg2" element={withNavigation(RiskFragorSteg2Slide)({})} />
            <Route path="/riskfragor-steg3" element={withNavigation(RiskFragorSteg3Slide)({})} />
            <Route path="/riskfragor-steg4" element={withNavigation(RiskFragorSteg4Slide)({})} />
            
            {/* Result slides (Roaring data) */}
            <Route path="/verksamhet" element={withNavigation(VerksamhetSlide)({})} />
            <Route path="/agarstruktur" element={withNavigation(AgarstrukturSlide)({})} />
            <Route path="/styrelse" element={withNavigation(StyrelseSlide)({})} />
            <Route path="/ovriga-data" element={withNavigation(OvrigaDataSlide)({})} />
            
            {/* Document & data collection */}
            <Route path="/bokforing-data" element={withNavigation(BokforingDataSlide)({})} />
            <Route path="/foretagsdokumentation" element={withNavigation(ForetagsdokumentationSlide)({})} />
            <Route path="/bokforingsunderlag" element={withNavigation(BokforingsunderlagSlide)({})} />
            
            {/* Analysis slides */}
            <Route path="/resultatanalys" element={withNavigation(ResultatanalysSlide)({})} />
            <Route path="/likviditetsanalys" element={withNavigation(LikviditetsanalysSlide)({})} />
            <Route path="/omsattningsanalys" element={withNavigation(OmsattningsanalysSlide)({})} />
            <Route path="/bokforingsanalys" element={withNavigation(BokforingsanalysSlide)({})} />
            <Route path="/penningflodesanalys" element={withNavigation(PenningflodesanalysSlide)({})} />
            <Route path="/branschjamforelse" element={withNavigation(BranschjamforelseSlide)({})} />
            
            {/* Final steps */}
            <Route path="/riskbedomning" element={withNavigation(RiskbedomningSlide)({})} />
            <Route path="/avtal" element={withNavigation(AvtalSlide)({})} />
            <Route path="/payment-success" element={withNavigation(PaymentSuccessSlide)({})} />
            <Route path="/support" element={withNavigation(SupportSlide)({})} />
            
            {/* Additional slides */}
            <Route path="/fortnox-paket" element={withNavigation(FortnoxPackageSlide)({})} />
            <Route path="/deklarationsombud" element={withNavigation(DeklarationsombudSlide)({})} />
            <Route path="/skyldigheter" element={withNavigation(SkyldigheterSlide)({})} />
            <Route path="/dokument-setup" element={withNavigation(DocumentSetupSlide)({})} />
            <Route path="/bank-rattigheter" element={withNavigation(BankRattigheterSlide)({})} />
            <Route path="/dokument-leverans" element={withNavigation(DocumentDeliverySlide)({})} />
            <Route path="/identitetskontroll" element={withNavigation(IdentitetskontrollSlide)({})} />
            <Route path="/kontrolltabell" element={withNavigation(KontrolltabellSlide)({})} />
            <Route path="/lopande-rutiner" element={withNavigation(OngoingRoutinesSlide)({})} />
            <Route path="/pep" element={withNavigation(PEPSlide)({})} />
            
            {/* Test slide */}
            <Route path="/example-v2" element={<ExampleSlide_v2 />} />
            
            {/* Default redirect */}
            <Route path="*" element={<div className="p-8">404 - Sidan hittades inte</div>} />
          </Routes>
        </main>
      </div>
      
      {/* ================================================================== */}
      {/* MODALS - Kontrollerade av useMasterState                          */}
      {/* ================================================================== */}
      
      {/* Resume Modal */}
      {state.showResumeModal && (
        <OnboardingResumeDialog
          onClose={actions.hideResumeModal}
          onResume={(companyId, onboardingId) => {
            actions.resumeCase(companyId, onboardingId);
            actions.hideResumeModal();
          }}
          onStartNew={() => {
            actions.clearActiveCase();
            actions.hideResumeModal();
            actions.goTo('uppdragsval');
          }}
          onDelete={async (companyId, onboardingId) => {
            await actions.deleteCase(companyId, onboardingId);
          }}
        />
      )}
      
      {/* Merge Conflict Modal */}
      {state.showMergeConflictModal && (
        <MergeConflictModal
          data={state.mergeConflictData}
          onKeepTheirs={() => actions.resolveMergeConflict('keep-theirs')}
          onKeepMine={() => actions.resolveMergeConflict('keep-mine')}
          onMerge={() => actions.resolveMergeConflict('merge')}
          onClose={actions.hideMergeConflict}
        />
      )}
      
      {/* Loading overlay */}
      {state.isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
              <span className="text-lg">{state.loadingMessage || 'Laddar...'}</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Error toast */}
      {state.error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-lg z-50">
          <div className="flex items-center justify-between">
            <span>{state.error}</span>
            <button 
              onClick={() => actions.clearError?.()}
              className="ml-4 text-red-700 hover:text-red-900"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
