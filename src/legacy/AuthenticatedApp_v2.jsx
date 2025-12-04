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
import Sidebar_v2 from './components/Layout/Sidebar_v2_explicit';  // EXPLICIT version
import Header_v2 from './components/Layout/Header_v2';

// =============================================================================
// SLIDES - Explicit import av de som används
// =============================================================================
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
import RiskbedomningSlide from './components/Slides/RiskbedomningSlide';
import AvtalSlide from './components/Slides/AvtalSlide';
import PaymentSuccessSlide from './components/Slides/PaymentSuccessSlide';
import SupportSlide from './components/Slides/SupportSlide';

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
  
  // =============================================================================
  // INITIALISERING - Körs EN gång när användaren först når AuthenticatedApp
  // =============================================================================
  // 
  // PSEUDO-KOD (state-maskin):
  // 
  // 1. LOGGA INLOGGNING
  //    - Hämta: användarnamn, IP, webbläsare, tid
  //    - Anropa: POST /api/logger { message: "Användare X inloggad...", metadata }
  //    - Skriv till usermap på server
  //
  // 2. HÄMTA PÅGÅENDE ONBOARDINGS
  //    - Anropa: GET /api/onboardings/pending
  //    - Logga: "Användare X har N pågående onboardings"
  //
  // 3. SET INITIAL STATE
  //    state = {
  //      user: { name, email, loginTime, browser, ip },
  //      pendingOnboardings: [...],
  //      currentSlide: 'uppdragsval',
  //      showResumeModal: pendingOnboardings.length > 0
  //    }
  //
  // 4. CASE: RESUME MODAL
  //    if (showResumeModal) {
  //      - Visa ResumeDialog
  //      - if (user väljer resume) {
  //          - Hämta metadata.json från server
  //          - Skriv till localStorage
  //          - Populera Uppdragsval med content
  //          - if (metadata.lastSlide !== 'uppdragsval') {
  //              navigate(metadata.lastSlide)
  //          }
  //      }
  //      - if (user väljer starta ny) {
  //          - Rensa localStorage
  //          - navigate('/uppdragsval')
  //      }
  //    }
  //
  // =============================================================================
  
  React.useEffect(() => {
    // Kör initialisering
    actions.initialize();
  }, []);  // Tom dependency = körs EN gång

  // =============================================================================
  // HANDLERS - Explicit, inga wrappers!
  // =============================================================================
  
  // Sidebar click - navigera till slide
  const handleSidebarClick = (slideKey) => {
    actions.goTo(slideKey);
  };
  
  // Sidebar lock - kolla om slide är låst
  const handleSidebarLock = (slideKey) => {
    // TODO: Implementera i useMasterState
    return false;
  };

  // =============================================================================
  // RENDER
  // =============================================================================
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - EXPLICIT PROPS */}
      <Sidebar_v2 
        currentSlideKey={state.currentSlideKey}
        completedSlides={state.completedSlides}
        activeCase={state.activeCase}
        handleClick={handleSidebarClick}
        handleLock={handleSidebarLock}
      />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header_v2 />
        
        {/* Content - EXPLICIT ROUTES utan wrapper! */}
        <main className="flex-1 overflow-auto">
          <Routes>
            {/* ============================================================= */}
            {/* SLIDES - Varje slide får EXPLICIT props                       */}
            {/* Precis som: <Square value={squares[0]} onClick={...} />       */}
            {/* ============================================================= */}
            
            {/* Första slide efter login */}
            <Route path="/uppdragsval" element={
              <UppdragsvalsSlide 
                formData={state.formData['uppdragsval']}
                onNext={() => actions.next()}
                onBack={() => actions.back()}
                onFieldChange={(field, value) => actions.updateField('uppdragsval', field, value)}
              />
            } />
            
            {/* Riskfrågor */}
            <Route path="/riskfragor" element={
              <RiskFragorSlide 
                formData={state.formData['riskfragor']}
                onNext={() => actions.next()}
                onBack={() => actions.back()}
                onFieldChange={(field, value) => actions.updateField('riskfragor', field, value)}
              />
            } />
            <Route path="/riskfragor-steg2" element={
              <RiskFragorSteg2Slide 
                formData={state.formData['riskfragor-steg2']}
                onNext={() => actions.next()}
                onBack={() => actions.back()}
                onFieldChange={(field, value) => actions.updateField('riskfragor-steg2', field, value)}
              />
            } />
            <Route path="/riskfragor-steg3" element={
              <RiskFragorSteg3Slide 
                formData={state.formData['riskfragor-steg3']}
                onNext={() => actions.next()}
                onBack={() => actions.back()}
                onFieldChange={(field, value) => actions.updateField('riskfragor-steg3', field, value)}
              />
            } />
            <Route path="/riskfragor-steg4" element={
              <RiskFragorSteg4Slide 
                formData={state.formData['riskfragor-steg4']}
                onNext={() => actions.next()}
                onBack={() => actions.back()}
                onFieldChange={(field, value) => actions.updateField('riskfragor-steg4', field, value)}
              />
            } />
            
            {/* Företagsdata (Roaring) */}
            <Route path="/verksamhet" element={
              <VerksamhetSlide 
                roaringData={state.serverData?.roaring}
                onNext={() => actions.next()}
                onBack={() => actions.back()}
              />
            } />
            <Route path="/agarstruktur" element={
              <AgarstrukturSlide 
                roaringData={state.serverData?.roaring}
                onNext={() => actions.next()}
                onBack={() => actions.back()}
              />
            } />
            <Route path="/styrelse" element={
              <StyrelseSlide 
                roaringData={state.serverData?.roaring}
                onNext={() => actions.next()}
                onBack={() => actions.back()}
              />
            } />
            <Route path="/ovriga-data" element={
              <OvrigaDataSlide 
                roaringData={state.serverData?.roaring}
                onNext={() => actions.next()}
                onBack={() => actions.back()}
              />
            } />
            
            {/* Dokument */}
            <Route path="/bokforing-data" element={
              <BokforingDataSlide 
                formData={state.formData['bokforing-data']}
                onNext={() => actions.next()}
                onBack={() => actions.back()}
                onFieldChange={(field, value) => actions.updateField('bokforing-data', field, value)}
              />
            } />
            <Route path="/foretagsdokumentation" element={
              <ForetagsdokumentationSlide 
                formData={state.formData['foretagsdokumentation']}
                onNext={() => actions.next()}
                onBack={() => actions.back()}
                onFieldChange={(field, value) => actions.updateField('foretagsdokumentation', field, value)}
              />
            } />
            <Route path="/bokforingsunderlag" element={
              <BokforingsunderlagSlide 
                formData={state.formData['bokforingsunderlag']}
                onNext={() => actions.next()}
                onBack={() => actions.back()}
                onFieldChange={(field, value) => actions.updateField('bokforingsunderlag', field, value)}
              />
            } />
            
            {/* Analys */}
            <Route path="/resultatanalys" element={
              <ResultatanalysSlide 
                sieData={state.serverData?.sie}
                onNext={() => actions.next()}
                onBack={() => actions.back()}
              />
            } />
            <Route path="/likviditetsanalys" element={
              <LikviditetsanalysSlide 
                sieData={state.serverData?.sie}
                onNext={() => actions.next()}
                onBack={() => actions.back()}
              />
            } />
            <Route path="/omsattningsanalys" element={
              <OmsattningsanalysSlide 
                sieData={state.serverData?.sie}
                onNext={() => actions.next()}
                onBack={() => actions.back()}
              />
            } />
            
            {/* Slutför */}
            <Route path="/riskbedomning" element={
              <RiskbedomningSlide 
                formData={state.formData}
                roaringData={state.serverData?.roaring}
                onNext={() => actions.next()}
                onBack={() => actions.back()}
              />
            } />
            <Route path="/avtal" element={
              <AvtalSlide 
                activeCase={state.activeCase}
                onNext={() => actions.next()}
                onBack={() => actions.back()}
              />
            } />
            <Route path="/payment-success" element={
              <PaymentSuccessSlide 
                activeCase={state.activeCase}
                onNext={() => actions.next()}
                onBack={() => actions.back()}
              />
            } />
            <Route path="/support" element={
              <SupportSlide 
                onBack={() => actions.back()}
              />
            } />
            
            {/* Test slide */}
            <Route path="/example-v2" element={<ExampleSlide_v2 />} />
            
            {/* Default */}
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
