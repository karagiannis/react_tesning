/**
 * OnboardingPage.jsx
 * 
 * CREATED: 2025-11-30
 * PURPOSE: Wrapper-komponent som använder useOnboardingSession för att hantera
 *          resume-modalen och session-val INNAN någon slide renderas.
 * 
 * ARKITEKTUR:
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │  OnboardingPage                                                          │
 * │  ─────────────────────────────────────────────────────────────────────── │
 * │                                                                          │
 * │  1. Använder useOnboardingSession hook                                   │
 * │  2. Renderar baserat på phase:                                           │
 * │     - 'checking'         → Loading spinner                               │
 * │     - 'show_resume_modal'→ OnboardingResumeDialogV2                      │
 * │     - 'ready'            → UppdragsvalsSlide                             │
 * │                                                                          │
 * │  Session-data (companyId, caseId, metadata) skickas som props/context    │
 * │  till child components.                                                  │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 * 
 * REF: CHANGELOG_2025-11-30.md - Section 12: State Controller äger Resume-modalen
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useOnboardingSession from '../../hooks/useOnboardingSession';
import OnboardingResumeDialogV2 from '../Modals/OnboardingResumeDialogV2';
import UppdragsvalsSlide from '../Slides/UppdragsvalsSlide';
import { useAgreements } from '../../contexts/AgreementContext';

export default function OnboardingPage({ onNext }) {
  const navigate = useNavigate();
  const { clearSubscription, loadSubscriptionFromServer } = useAgreements();
  
  const {
    phase,
    onboardings,
    session,
    error,
    onSelectOnboarding,
    onNewSession,
    onDelete,
    isChecking,
    showResumeModal,
    isReady
  } = useOnboardingSession();
  
  // Synka subscription från session metadata
  useEffect(() => {
    if (isReady && session) {
      if (session.subscription) {
        console.log('📥 OnboardingPage: Loading subscription from session', session.subscription);
        loadSubscriptionFromServer(session.subscription);
      } else if (session.isNewSession) {
        // Ny session - rensa eventuell gammal subscription
        clearSubscription();
      }
    }
  }, [isReady, session, loadSubscriptionFromServer, clearSubscription]);
  
  // Navigera till rätt steg om det finns currentStep i session
  useEffect(() => {
    if (isReady && session && !session.isNewSession && session.currentStep) {
      // Resuming - navigera till rätt step
      const step = session.currentStep;
      const companyId = session.companyId;
      const caseId = session.caseId;
      
      // Om inte på uppdragsval, navigera dit
      if (step !== 'uppdragsval') {
        console.log(`🔄 OnboardingPage: Navigating to ${step}/${companyId}/${caseId}`);
        
        // Navigera med companyId/caseId i URL
        if (step.startsWith('riskfragor')) {
          navigate(`/${step}/${companyId}/${caseId}`);
        } else {
          navigate(`/${step}/${companyId}`);
        }
      }
    }
  }, [isReady, session, navigate]);

  // ══════════════════════════════════════════════════════════════════
  // RENDER: Loading
  // ══════════════════════════════════════════════════════════════════
  if (isChecking) {
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
  if (showResumeModal) {
    return (
      <>
        {/* Bakgrund (Uppdragsval) - synlig men disabled */}
        <div className="pointer-events-none opacity-50">
          <UppdragsvalsSlide onNext={onNext} />
        </div>
        
        {/* Modal overlay */}
        <OnboardingResumeDialogV2
          companies={onboardings}
          onSelect={onSelectOnboarding}
          onDelete={onDelete}
          onNewSession={onNewSession}
          onClearSubscription={clearSubscription}
        />
      </>
    );
  }
  
  // ══════════════════════════════════════════════════════════════════
  // RENDER: Error
  // ══════════════════════════════════════════════════════════════════
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center p-8">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <h2 className="text-xl font-bold text-red-600 mb-3">Fel vid laddning</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
          >
            Ladda om sidan
          </button>
        </div>
      </div>
    );
  }
  
  // ══════════════════════════════════════════════════════════════════
  // RENDER: Ready - Show UppdragsvalsSlide
  // ══════════════════════════════════════════════════════════════════
  if (isReady) {
    return <UppdragsvalsSlide onNext={onNext} />;
  }
  
  // Fallback (should never happen)
  return null;
}
