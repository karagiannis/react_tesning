/**
 * OnboardingPage.jsx
 * 
 * CREATED: 2025-11-30
 * UPDATED: 2025-12-03 - Refactored to use useMasterStateContext instead of legacy hook
 * 
 * PURPOSE: Wrapper-komponent som hanterar resume-modalen och session-val.
 *          Nu använder den centrala useMasterStateContext för all state.
 * 
 * ARKITEKTUR:
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │  OnboardingPage                                                          │
 * │  ─────────────────────────────────────────────────────────────────────── │
 * │                                                                          │
 * │  1. Konsumerar useMasterStateContext (central state)                     │
 * │  2. Renderar baserat på state:                                           │
 * │     - isInitializing     → Loading spinner                               │
 * │     - showResumeModal    → OnboardingResumeDialogV2                      │
 * │     - else               → UppdragsvalsSlide                             │
 * │                                                                          │
 * │  Session-data (companyId, caseId, metadata) hämtas från context.         │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 * 
 * REF: CHANGELOG_2025-12-03.md - Migrated to useMasterStateContext
 */

import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMasterStateContext } from '../../contexts/MasterStateContext';
import OnboardingResumeDialogV2 from '../Modals/OnboardingResumeDialogV2';
import UppdragsvalsSlide from '../Slides/UppdragsvalsSlide';
import { useAgreements } from '../../contexts/AgreementContext';

const API_BASE = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_BASE_URL}/api`;

export default function OnboardingPage({ onNext }) {
  const navigate = useNavigate();
  const { clearSubscription, loadSubscriptionFromServer } = useAgreements();
  
  // 🆕 2025-12-03: Använd centrala context istället för legacy hook
  const {
    isInitializing,
    isLoggedIn,
    showResumeModal,
    setShowResumeModal,
    pendingOnboardings,
    setActiveCase,
    caseMetadata,
    companyId,
    caseId,
    currentStep,
    hasActiveCase,
    refreshPendingOnboardings,
    deleteOnboarding,
  } = useMasterStateContext();
  
  // ══════════════════════════════════════════════════════════════════
  // Handlers
  // ══════════════════════════════════════════════════════════════════
  
  /**
   * När användaren väljer en onboarding att återuppta
   */
  const handleSelectOnboarding = useCallback(async (selected) => {
    const selectedCompanyId = selected.company_id;
    const selectedCaseId = selected.case_id || selected.onboardingId;
    
    // Sätt aktivt case (stänger automatiskt modalen)
    await setActiveCase(selectedCompanyId, selectedCaseId);
    
    // Ladda subscription om det finns
    if (selected.subscription) {
      loadSubscriptionFromServer(selected.subscription);
    }
    
    // Navigera till rätt steg om vi har ett currentStep
    const step = selected.current_step || 'uppdragsval';
    if (step !== 'uppdragsval') {
      if (step.startsWith('riskfragor')) {
        navigate(`/${step}/${selectedCompanyId}/${selectedCaseId}`);
      } else {
        navigate(`/${step}/${selectedCompanyId}`);
      }
    }
  }, [setActiveCase, loadSubscriptionFromServer, navigate]);
  
  /**
   * Starta ny session (avbryt resume)
   */
  const handleNewSession = useCallback(() => {
    clearSubscription();
    setShowResumeModal(false);
  }, [clearSubscription, setShowResumeModal]);
  
  /**
   * Radera en onboarding
   */
  const handleDelete = useCallback(async (selected) => {
    if (deleteOnboarding) {
      await deleteOnboarding(selected);
    } else {
      // Fallback: Manuellt DELETE-anrop
      const token = localStorage.getItem('accessToken');
      const companyIdToDelete = selected.company_id;
      const caseIdToDelete = selected.case_id || selected.onboardingId;
      
      await fetch(
        `${API_BASE}/onboarding/delete/${companyIdToDelete}?onboarding_id=${caseIdToDelete}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Refresh listan
      if (refreshPendingOnboardings) {
        await refreshPendingOnboardings();
      }
    }
  }, [deleteOnboarding, refreshPendingOnboardings]);
  
  /**
   * Stäng modalen
   */
  const handleDismissModal = useCallback(() => {
    setShowResumeModal(false);
  }, [setShowResumeModal]);
  
  // ══════════════════════════════════════════════════════════════════
  // Synka subscription från caseMetadata
  // ══════════════════════════════════════════════════════════════════
  useEffect(() => {
    if (!isInitializing && hasActiveCase && caseMetadata) {
      if (caseMetadata.subscription) {
        console.log('📥 OnboardingPage: Loading subscription from caseMetadata', caseMetadata.subscription);
        loadSubscriptionFromServer(caseMetadata.subscription);
      }
    }
  }, [isInitializing, hasActiveCase, caseMetadata, loadSubscriptionFromServer]);
  
  // ══════════════════════════════════════════════════════════════════
  // Navigera till rätt steg vid resume (om currentStep finns)
  // ══════════════════════════════════════════════════════════════════
  useEffect(() => {
    if (!isInitializing && hasActiveCase && currentStep && currentStep !== 'uppdragsval') {
      console.log(`🔄 OnboardingPage: Navigating to ${currentStep}/${companyId}/${caseId}`);
      
      // Navigera med companyId/caseId i URL
      if (currentStep.startsWith('riskfragor')) {
        navigate(`/${currentStep}/${companyId}/${caseId}`);
      } else {
        navigate(`/${currentStep}/${companyId}`);
      }
    }
  }, [isInitializing, hasActiveCase, currentStep, companyId, caseId, navigate]);

  // ══════════════════════════════════════════════════════════════════
  // RENDER: Loading
  // ══════════════════════════════════════════════════════════════════
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Kontrollerar pågående onboardings...</p>
        </div>
      </div>
    );
  }
  
  // ══════════════════════════════════════════════════════════════════
  // RENDER: Resume Modal
  // ══════════════════════════════════════════════════════════════════
  if (showResumeModal && pendingOnboardings.length > 0) {
    return (
      <>
        {/* Bakgrund (Uppdragsval) - synlig men disabled */}
        <div className="pointer-events-none opacity-50">
          <UppdragsvalsSlide onNext={onNext} />
        </div>
        
        {/* Modal overlay */}
        <OnboardingResumeDialogV2
          companies={pendingOnboardings}
          onSelect={handleSelectOnboarding}
          onDelete={handleDelete}
          onNewSession={handleNewSession}
          onClearSubscription={clearSubscription}
          onClose={handleDismissModal}
        />
      </>
    );
  }
  
  // ══════════════════════════════════════════════════════════════════
  // RENDER: Ready - Show UppdragsvalsSlide
  // ══════════════════════════════════════════════════════════════════
  return <UppdragsvalsSlide onNext={onNext} />;
}
