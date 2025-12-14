/**
 * AuthenticatedApp_v3.jsx
 * 
 * 🎯 TIC-TAC-TOE ARKITEKTUR - "GAME" KOMPONENTEN
 * 
 * ============================================================================
 * FILOSOFI:
 * ============================================================================
 * Precis som i React tic-tac-toe-tutorialen där Game-komponenten har ALL logik
 * och Square bara är en dum knapp, så har AuthenticatedApp ALL logik och
 * slides är bara dumma formulär.
 * 
 * I tic-tac-toe:
 *   - Game har: squares[], history[], handleClick()
 *   - Square får: value, onClick (inga egna beslut)
 * 
 * Här:
 *   - AuthenticatedApp har: formData, navigationHistory, handleNext(), etc.
 *   - Slides får: formData, onNext, onFieldChange (inga egna beslut)
 * 
 * ============================================================================
 * STRUKTUR:
 * ============================================================================
 * 1. STATE         - Alla useState på ett ställe
 * 2. STORAGE       - Alla localStorage-operationer
 * 3. API           - Alla fetch-anrop
 * 4. STATE MACHINE - switch-case som styr flödet
 * 5. HANDLERS      - Funktioner som slides anropar
 * 6. RENDER        - JSX med explicit props till varje slide
 * 
 * ============================================================================
 * FLÖDE EFTER LOGIN:
 * ============================================================================
 * 
 *   LoginSlide (utanför denna komponent)
 *        │
 *        │ navigate('/uppdragsval')
 *        ▼
 *   AuthenticatedApp mountas
 *        │
 *        │ useState(UNINITIALIZED)  ← Startvärde sätts
 *        │
 *        │ useEffect körs
 *        ▼
 *   processState() → switch(UNINITIALIZED)
 *        │
 *        │ setAppState(INITIALIZING)
 *        ▼
 *   useEffect triggas igen (appState ändrades)
 *        │
 *   processState() → switch(INITIALIZING)
 *        │
 *        │ Hämta token, user, localStorage
 *        │ setAppState(CHECKING_PENDING)
 *        ▼
 *   processState() → switch(CHECKING_PENDING)
 *        │
 *        │ Hämta pågående onboardings från API
 *        │
 *        ├─── Om pågående finns → setAppState(SHOWING_RESUME)
 *        │                              │
 *        │                              ▼
 *        │                        Visa ResumeModal
 *        │                              │
 *        │                    ┌─────────┴─────────┐
 *        │                    ▼                   ▼
 *        │              handleResume()      handleStartNew()
 *        │                    │                   │
 *        │                    ▼                   ▼
 *        │              RESUMING → READY      READY
 *        │
 *        └─── Om inga finns → setAppState(READY)
 *                                   │
 *                                   ▼
 *                            Normal drift
 *                            Väntar på användarinteraktion
 */

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

// =============================================================================
// LAYOUT
// =============================================================================
import Sidebar_v2 from './components/Layout/Sidebar';
import Header from './components/Layout/Header';

// =============================================================================
// SLIDES
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
import PenningflodesanalysSlide from './components/Slides/PenningflodesanalysSlide';
import AccountingAnalysisWizard from './pages/AccountingAnalysisWizard';
import RiskbedomningSlide from './components/Slides/RiskbedomningSlide';
import AvtalSlide from './components/Slides/AvtalSlide';
import PaymentSuccessSlide from './components/Slides/PaymentSuccessSlide';
import SupportSlide from './components/Slides/SupportSlide';

// =============================================================================
// MODALS
// =============================================================================
import OnboardingResumeDialog from './components/Modals/OnboardingResumeDialog';
import MergeConflictModal from './components/Modals/MergeConflictModal';
import AgreementModal from './components/Modals/AgreementModal';

// =============================================================================
// PANELS
// =============================================================================
import LLMPanel from './components/Panels/LLMPanel';

// =============================================================================
// HOOKS
// =============================================================================
import useVersionSync from './hooks/useVersionSync';
import useAutoSave from './hooks/useAutoSave';
import { useSlideDataLoader } from './hooks/useSlideDataLoader';

// =============================================================================
// PROPS/HANDLERS
// =============================================================================
import { createHandleClearError } from './props/handleClearError';
import { createHandleRetryConnection } from './props/handleRetryConnection';
import { createHandleConnectionErrorLogout } from './props/handleConnectionErrorLogout';
import { createHandleFieldChange } from './props/handleFieldChange';
import { createHandleSidebarLock } from './props/handleSidebarLock';
import { createHandleSidebarClick } from './props/handleSidebarClick';
import { createHandleConflictCancel } from './props/handleConflictCancel';
import { createHandleConflictReload } from './props/handleConflictReload';
import { createHandleConflictForceSave } from './props/handleConflictForceSave';
import { createHandleRetryPending } from './props/handleRetryPending';
import { createHandleLogout } from './props/handleLogout';
import { createHandleResumeChoice } from './props/handleResumeChoice';
import { createHandleStartNew } from './props/handleStartNew';
import { createHandleDeleteOnboarding } from './props/handleDeleteOnboarding';
import { createHandleConfirmCompanySelection } from './props/handleConfirmCompanySelection';
import { createHandleLogoutAndReset } from './props/handleLogoutAndReset';
import { createHandleCancelOnboarding } from './props/handleCancelOnboarding';
import { createHandleSelectEngångsavtal } from './props/handleSelectEngångsavtal';
import { createHandleSelectFöretagsavtal } from './props/handleSelectFöretagsavtal';
import { createHandlePaymentConfirmed } from './props/handlePaymentConfirmed';

// =============================================================================
// UTILS
// =============================================================================
import StorageKeyBuilder from './utils/StorageKeyBuilder';
import { createStorage } from './utils/createStorage';
import { createApi } from './utils/createApi';
import { createCheckVersionConflict, createSaveSlideAndNavigate } from './utils/slideNavigation';

// =============================================================================
// STATE MACHINE HANDLERS
// =============================================================================
import AppState from './stateMachine/AppState';
import { createHandleUppdragsvalsSubState } from './stateMachine/handleUppdragsvalsSubState';
import { createHandleRiskfragorSubState } from './stateMachine/handleRiskfragorSubState';
import { 
  createHandleInitializing,
  createHandleRestoringSession,
  createHandleResuming,
  createHandleCheckingPendingState,
  createHandleInitiatingPaymentState,
  createHandleVerifyingPaymentState,
} from './stateMachine';

// =============================================================================
// SLIDE ORDER - Explicit lista
// =============================================================================
const SLIDE_ORDER = [
  { key: 'uppdragsval', path: '/uppdragsval' },
  { key: 'riskfragor-1', path: '/riskfragor' },
  { key: 'riskfragor-2', path: '/riskfragor-steg2' },
  { key: 'riskfragor-3', path: '/riskfragor-steg3' },
  { key: 'riskfragor-4', path: '/riskfragor-steg4' },
  { key: 'verksamhet', path: '/verksamhet' },
  { key: 'agarstruktur', path: '/agarstruktur' },
  { key: 'styrelse', path: '/styrelse' },
  { key: 'ovriga-data', path: '/ovriga-data' },
  { key: 'bokforing-data', path: '/bokforing-data' },
  { key: 'foretagsdokumentation', path: '/foretagsdokumentation' },
  { key: 'bokforingsunderlag', path: '/bokforingsunderlag' },
  { key: 'resultatanalys', path: '/resultatanalys' },
  { key: 'likviditetsanalys', path: '/likviditetsanalys' },
  { key: 'omsattningsanalys', path: '/omsattningsanalys' },
  { key: 'penningflodes', path: '/penningflodes' },
  { key: 'bokanalys', path: '/bokanalys' },
  { key: 'riskbedomning', path: '/riskbedomning' },
  { key: 'avtal', path: '/avtal' },
  { key: 'payment-success', path: '/payment-success' },
  { key: 'support', path: '/support' },
];

// =============================================================================
// API BASE URL
// =============================================================================
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// =============================================================================
// 🎯 GAME COMPONENT - ALLT HÄR!
// =============================================================================
export default function AuthenticatedApp() {
  const navigate = useNavigate();
  
  // ===========================================================================
  // STATE - Allt state på ett ställe
  // ===========================================================================
  // 
  // Precis som i tic-tac-toe där Game har:
  //   const [history, setHistory] = useState([...]);
  //   const [currentMove, setCurrentMove] = useState(0);
  //
  // Så har vi ALLT state här. Slides får ALDRIG ha eget state för data.
  // (Slides kan ha UI-state som "är dropdown öppen" - det är OK)
  //
  
  // ─────────────────────────────────────────────────────────────────────────
  // State Machine - VAR i flödet är vi?
  // ─────────────────────────────────────────────────────────────────────────
  const [appState, setAppState] = useState(AppState.UNINITIALIZED);
  // ↑ VIKTIGT: useState() körs EN gång när komponenten mountas.
  //            Därför börjar vi ALLTID i UNINITIALIZED efter login.
  
  // ─────────────────────────────────────────────────────────────────────────
  // Användarinfo
  // ─────────────────────────────────────────────────────────────────────────
  const [user, setUser] = useState(null);
  // user = { name: "Lasse", email: "lasse@example.com", loginTime: "...", browser: "..." }
  
  // ─────────────────────────────────────────────────────────────────────────
  // Navigation - vilken slide är aktiv?
  // ─────────────────────────────────────────────────────────────────────────
  const [currentSlideKey, setCurrentSlideKey] = useState('uppdragsval');
  // currentSlideKey = 'uppdragsval' | 'riskfragor' | 'verksamhet' | ...
  
  const [completedSlides, setCompletedSlides] = useState([]);
  // completedSlides = ['uppdragsval', 'riskfragor'] - slides som är klara
  
  // ─────────────────────────────────────────────────────────────────────────
  // Formulärdata - allt användaren fyller i
  // ─────────────────────────────────────────────────────────────────────────
  const [formData, setFormData] = useState({});
  // formData = {
  //   'uppdragsval': { companyType: 'AB', orgnr: '556677-8899' },
  //   'riskfragor': { question1: 'yes', question2: 'no' },
  //   ...
  // }
  
  // ─────────────────────────────────────────────────────────────────────────
  // Pågående onboardings (från API)
  // ─────────────────────────────────────────────────────────────────────────
  const [pendingOnboardings, setPendingOnboardings] = useState([]);
  // pendingOnboardings = [{ company_id: 123, company_name: "AB Test", ... }, ...]
  
  // ─────────────────────────────────────────────────────────────────────────
  // State Machine Transition History (för debugging och duplicate-guard)
  // ─────────────────────────────────────────────────────────────────────────
  const [transitionHistory, setTransitionHistory] = useState([]);
  // transitionHistory = [
  //   { from: null, to: 'INITIALIZING', timestamp: 1733900000000 },
  //   { from: 'INITIALIZING', to: 'CHECKING_PENDING', timestamp: 1733900001000 },
  //   ...
  // ]
  // → Möjliggör "time travel" debugging och förhindrar dubbelkörningar
  
  const lastProcessedStateRef = useRef(null);
  // Guard: Förhindrar att samma state processas flera gånger (StrictMode-skydd)
  
  // ─────────────────────────────────────────────────────────────────────────
  // Aktivt ärende
  // ─────────────────────────────────────────────────────────────────────────
  const [activeCase, setActiveCase] = useState(null);
  // activeCase = { company_id: 123, case_id: 456, company_name: "AB Test" }
  
  // ─────────────────────────────────────────────────────────────────────────
  // Extern data (från Roaring.io och SIE-fil)
  // ─────────────────────────────────────────────────────────────────────────
  // 🔓 isPaymentConfirmed - Låser upp företagsdata-slides (Verksamhet, Ägarstruktur, etc.)
  //    Sätts till true när subscription.payment_confirmed_at finns i metadata
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);
  
  const [sieData, setSieData] = useState(null);
  // sieData = { accounts: [...], transactions: [...] }
  
  // ─────────────────────────────────────────────────────────────────────────
  // UI State
  // ─────────────────────────────────────────────────────────────────────────
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState('idle');
  // syncStatus: 'idle' | 'saving' | 'saved' | 'conflict' | 'offline'
  
  // Connection Error State - för när backend inte svarar
  // ─────────────────────────────────────────────────────────────────────────
  const [connectionError, setConnectionError] = useState(null);
  // connectionError = { message, isTimeout, isNetworkError, retryState }
  // retryState = vilket AppState vi ska gå till vid retry
  
  const [activePanel, setActivePanel] = useState(null);
  // activePanel: null | 'llm' | 'documentation'
  
  // ─────────────────────────────────────────────────────────────────────────
  // Agreement/Payment State - Stripe integration
  // ─────────────────────────────────────────────────────────────────────────
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('idle');
  // paymentStatus: 'idle' | 'initiating' | 'redirecting' | 'confirmed' | 'error'
  const [hasAgreement, setHasAgreement] = useState(false);
  const [paymentPending, setPaymentPending] = useState(false);
  // paymentPending: true när vi väntar på betalning från Stripe
  
  // Payment Verification State (för PaymentSuccessSlide)
  const [paymentVerificationStatus, setPaymentVerificationStatus] = useState('verifying');
  // 'verifying' | 'success' | 'error'
  const [paymentVerificationMessage, setPaymentVerificationMessage] = useState('');
  
  // ─────────────────────────────────────────────────────────────────────────
  // Version Conflict State (multi-user editing)
  // ─────────────────────────────────────────────────────────────────────────
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [conflictInfo, setConflictInfo] = useState(null);
  // conflictInfo = { your_version, server_version, conflicting_slides, message }
  
  // ─────────────────────────────────────────────────────────────────────────
  // Draft/Permanent Mode - Hanterar localStorage-nycklar
  // ─────────────────────────────────────────────────────────────────────────
  //
  // isDraftMode: true = användaren har inte valt företag än
  //              false = företag är valt, data är "permanent"
  //
  // tempCaseId: Temporärt ID som genereras vid login
  //             Används i draft-nycklar: onboarding::draft::temp_123::user_456
  //
  // LIVSCYKEL:
  // 1. Login → isDraftMode=true, tempCaseId genereras
  // 2. Användaren fyller i UppdragsvalsSlide
  // 3. Klickar "Fortsätt" → POINT OF NO RETURN
  // 4. isDraftMode=false, draft-data konverteras till permanent
  //
  const [isDraftMode, setIsDraftMode] = useState(true);
  const [tempCaseId, setTempCaseId] = useState(null);
  // tempCaseId = "temp_1701234567890_abc123" (genereras i INITIALIZING)
  
  // ─────────────────────────────────────────────────────────────────────────
  // History - som tic-tac-toe! Sparar alla navigeringar och ändringar
  // ─────────────────────────────────────────────────────────────────────────
  const [navigationHistory, setNavigationHistory] = useState([]);
  // navigationHistory = [
  //   { slideKey: 'uppdragsval', timestamp: 1234567890, action: 'next', fromSlide: null },
  //   { slideKey: 'riskfragor', timestamp: 1234567891, action: 'next', fromSlide: 'uppdragsval' },
  //   ...
  // ]
  // → Möjliggör "time travel" debugging och undo-funktionalitet
  
  const [formHistory, setFormHistory] = useState([]);
  // formHistory = [
  //   { slideKey: 'uppdragsval', field: 'orgnr', oldValue: '', newValue: '556677', timestamp: ... },
  //   ...
  // ]
  // → Möjliggör audit trail och undo-funktionalitet

  // ===========================================================================
  // LOCALSTORAGE - Skapad via factory (se utils/createStorage.js)
  // ===========================================================================
  // NYCKELFORMAT (med ::pages:: prefix för slides, 1:1 med server metadata.json):
  // - Draft:     onboarding::draft::temp_123::user_456::pages::uppdragsval
  // - Permanent: onboarding::5566778899_abc::abc123-def456::user_456::pages::uppdragsval
  // - Version:   onboarding::5566778899_abc::abc123-def456::user_456::version
  //
  // OBS: case_id i localStorage är UUID (abc123-def456), UTAN "case_" prefix!
  // Servern lägger till "case_" i mappnamnet: case_{case_id}/
  //
  // VIKTIGT: useRef för att behålla samma getStorageState-referens mellan renders
  // Detta undviker att storage och api återskapas vid varje render
  const stateRef = useRef({ isDraftMode, activeCase, tempCaseId, user });
  stateRef.current = { isDraftMode, activeCase, tempCaseId, user };
  
  const getStorageState = useCallback(() => stateRef.current, []);
  const storage = useMemo(() => createStorage(getStorageState), [getStorageState]);

  // ===========================================================================
  // API - Skapad via factory (se utils/createApi.js)
  // ===========================================================================
  const api = useMemo(() => createApi(storage), [storage]);

  // ===========================================================================
  // STATE MACHINE HANDLERS - Factory-instantiering
  // ===========================================================================
  // Getter callbacks för att alltid hämta AKTUELLA värden (closure pattern)
  
  const getState = () => ({ currentSlideKey, hasAgreement, isDraftMode, activeCase, formData, completedSlides, tempCaseId, user, pendingOnboardings, error });
  const getActions = () => ({ setIsLoading, setError, setAppState, setTempCaseId, setIsDraftMode, setUser, setFormData, setCompletedSlides, setActiveCase, setIsPaymentConfirmed, setHasAgreement, setCurrentSlideKey, setSyncStatus, setShowAgreementModal, setNavigationHistory, setConflictInfo, setShowConflictModal, setPaymentVerificationStatus, setPaymentVerificationMessage, setPendingOnboardings, setConnectionError });
  const services = { storage, api, navigate, SLIDE_ORDER, AppState };

  // ===========================================================================
  // Navigation Utilities - Skapade via factory (se utils/slideNavigation.js)
  // ===========================================================================
  const checkVersionConflict = createCheckVersionConflict(getState, getActions, services);
  const saveSlideAndNavigate = createSaveSlideAndNavigate(getState, getActions, services, checkVersionConflict);
  
  // Instantiera handlers (de skapas en gång, men hämtar state vid varje anrop)
  const handleInitializingAction = createHandleInitializing(getState, getActions, services);
  const handleCheckingPendingAction = createHandleCheckingPendingState(getState, getActions, services);
  const handleRestoringSessionAction = createHandleRestoringSession(getState, getActions, services);
  const handleResumingAction = createHandleResuming(getState, getActions, services);
  const handleInitiatingPaymentAction = createHandleInitiatingPaymentState(getState, getActions, services);
  const handleVerifyingPaymentAction = createHandleVerifyingPaymentState(getState, getActions, services);
  
  // ─── Form Props (declared early for substate handlers) ─────────────────────
  const handleConfirmCompanySelection = createHandleConfirmCompanySelection({ 
    tempCaseId, formData, api, storage, user, setIsLoading, setError, setIsDraftMode, 
    setActiveCase, SLIDE_ORDER, activeCase,
    // 🆕 Version conflict callbacks
    setShowConflictModal, setConflictInfo,
  });
  
  // Sub-state handlers för PROCESSING_NEXT special cases
  const handleUppdragsvalsNext = createHandleUppdragsvalsSubState(getState, getActions, {
    ...services, handleConfirmCompanySelection, AppState,
  });
  const handleRiskfragorNext = createHandleRiskfragorSubState(getState, getActions, {
    ...services, saveSlideAndNavigate, AppState,
  });

  // ===========================================================================
  // 🔄 AUTO-SAVE HOOK - Sparar till localStorage vid varje formData-ändring
  // ===========================================================================
  //
  // NYTT: Sparar varje slide SEPARAT (URL-aware).
  // currentSlideKey identifierar vilken sida som ska sparas.
  // Resultsidor (utan inputs) triggar INTE autosave.
  //
  const { lastSaved, isSaving, forceSave } = useAutoSave({
    formData,
    storage,
    currentSlideKey: currentSlideKey,  // NY: URL-identifierare för nuvarande slide
    debounceMs: 300,
    enabled: appState === AppState.READY, // Bara i READY state
  });

  // ===========================================================================
  // 🎯 STATE MACHINE - switch-case!
  // ===========================================================================
  //
  // HJÄRTAT av applikationen!
  //
  // Hur det fungerar:
  // 1. useEffect() lyssnar på appState
  // 2. När appState ändras → processState() körs
  // 3. processState() kollar switch(appState) och utför rätt åtgärder
  // 4. I slutet av varje case: setAppState(NÄSTA_STATE)
  // 5. → useEffect() triggas igen → processState() körs igen
  //
  // Detta ger en DETERMINISTISK loop som är lätt att följa och debugga.
  //
  
  const processState = useCallback(async () => {
    // ═══════════════════════════════════════════════════════════════════════
    // GUARD: Förhindra dubbelkörning av samma state (StrictMode-skydd)
    // ═══════════════════════════════════════════════════════════════════════
    if (lastProcessedStateRef.current === appState) {
      console.log(`[STATE MACHINE] ⚠️ Duplicate ${appState}, skipping (already processed)`);
      return;
    }
    
    // Spara i historik INNAN vi processar
    const previousState = lastProcessedStateRef.current;
    lastProcessedStateRef.current = appState;
    
    setTransitionHistory(prev => [
      ...prev,
      {
        from: previousState,
        to: appState,
        timestamp: Date.now(),
      }
    ]);
    
    console.log(`[STATE MACHINE] Processing: ${appState}`);
    console.log(`[STATE MACHINE] 📜 Transition: ${previousState || 'null'} → ${appState}`);
    
    switch (appState) {
      // =========================================================================
      // UNINITIALIZED - Startpunkt direkt efter mount
      // =========================================================================
      // 
      // NÄR: Komponenten har precis mountats (användaren navigerade hit efter login)
      // VAD: Gör ingenting, gå direkt till INITIALIZING
      // VARFÖR: Separerar "mount" från "initialisering" för tydlighet
      //
      case AppState.UNINITIALIZED:
        setAppState(AppState.INITIALIZING);
        break;
        
      // =========================================================================
      // INITIALIZING - Delegerat till handleInitializingAction
      // =========================================================================
      case AppState.INITIALIZING: {
        await handleInitializingAction();
        break;
      }
        
      // =========================================================================
      // CHECKING_PENDING - Kolla om det finns pågående onboardings
      // =========================================================================
      //
      // NÄR: Efter INITIALIZING
      // VAD: Fråga servern om användaren har påbörjade men inte avslutade onboardings
      // SEDAN:
      //   - Om ja → SHOWING_RESUME (visa "Vill du fortsätta?"-modal)
      //   - Om nej → READY (gå direkt till normal drift)
      //
      case AppState.CHECKING_PENDING: {
        // Delegera till extern handler (se stateMachine/handleCheckingPendingState.js)
        await handleCheckingPendingAction();
        break;
      }
        
      // =========================================================================
      // SHOWING_RESUME - Väntar på användarval i OnboardingResumeDialog
      // =========================================================================
      // Data redan hämtad (CHECKING_PENDING). Modal renderas via JSX.
      // Callbacks: onResume→RESUMING, onDelete→uppdatera lista, onStartNew→READY
      //
      case AppState.SHOWING_RESUME:
        console.log('[SHOWING_RESUME] 🎭 Waiting for user choice...');
        break;
        
      // =========================================================================
      // RESUMING - Delegerat till handleResumingAction
      // =========================================================================
      case AppState.RESUMING: {
        await handleResumingAction();
        break;
      }
      
      // =========================================================================
      // RESTORING_SESSION - Delegerat till handleRestoringSessionAction
      // =========================================================================
      case AppState.RESTORING_SESSION: {
        await handleRestoringSessionAction();
        break;
      }

      case AppState.READY:
        console.log('[READY] ✅ App is ready! Waiting for user interaction...');
        console.log('[READY] Current slide:', currentSlideKey);
        console.log('[READY] Draft mode:', isDraftMode);
        console.log('[READY] Active case:', activeCase);
        // Normal drift - användaren kan interagera fritt
        break;
      
      // =========================================================================
      // PROCESSING_NEXT - Användaren klickade "Nästa"
      // =========================================================================
      //
      // State machine avgör vad som händer baserat på vilken slide vi är på
      //
      case AppState.PROCESSING_NEXT: {
        console.log(`[PROCESSING_NEXT] Processing Next from slide: ${currentSlideKey}`);
        
        const currentIndex = SLIDE_ORDER.findIndex(s => s.key === currentSlideKey);
        if (currentIndex >= SLIDE_ORDER.length - 1) {
          console.log('[PROCESSING_NEXT] Already at last slide');
          setAppState(AppState.READY);
          break;
        }
        
        // Switch baserat på nuvarande slide - special cases extraherade till egna filer
        switch (currentSlideKey) {
          case 'uppdragsval':  await handleUppdragsvalsNext(); break;
          case 'riskfragor-1': await handleRiskfragorNext(currentIndex); break;
          default:
            await saveSlideAndNavigate(currentSlideKey, currentIndex);
        }
        break;
      }
      
      // =========================================================================
      // =========================================================================
      // PROCESSING_BACK - Användaren klickade "Tillbaka"
      // =========================================================================
      //
      case AppState.PROCESSING_BACK: {
        console.log(`[PROCESSING_BACK] Processing Back from slide: ${currentSlideKey}`);
        
        const currentIndex = SLIDE_ORDER.findIndex(s => s.key === currentSlideKey);
        if (currentIndex <= 0) {
          console.log('[PROCESSING_BACK] Already at first slide');
          setAppState(AppState.READY);
          break;
        }
        
        const prevSlide = SLIDE_ORDER[currentIndex - 1];
        
        // Navigera bakåt (ingen server-save vid bakåt-navigation)
        console.log(`[PROCESSING_BACK] Navigating back to: ${prevSlide.key}`);
        setCurrentSlideKey(prevSlide.key);
        navigate(prevSlide.path);
        
        // Logga navigation history
        setNavigationHistory(prev => [...prev, {
          slideKey: prevSlide.key,
          timestamp: Date.now(),
          action: 'back',
          fromSlide: currentSlideKey,
        }]);
        
        setAppState(AppState.READY);
        break;
      }
      
      // =========================================================================
      // INITIATING_PAYMENT - Delegerat till handleInitiatingPaymentAction
      // =========================================================================
      case AppState.INITIATING_PAYMENT: {
        await handleInitiatingPaymentAction();
        break;
      }
      
      // =========================================================================
      // VERIFYING_PAYMENT - Delegerat till handleVerifyingPaymentAction
      // =========================================================================
      case AppState.VERIFYING_PAYMENT: {
        await handleVerifyingPaymentAction();
        break;
      }
        
      // =========================================================================
      // ERROR - Något gick fel
      // =========================================================================
      //
      // NÄR: Ett fel uppstod någonstans
      // VAD: Visar felmeddelande (via render)
      // VÄNTAR PÅ: handleClearError() → går till READY
      //
      case AppState.ERROR:
        console.error('[ERROR] ❌ App is in ERROR state');
        console.error('[ERROR] Error message:', error);
        // Felmeddelande visas via render (se JSX nedan)
        // Väntar på att användaren klickar bort felet
        break;
      
      // =========================================================================
      // CONNECTION_ERROR - Backend svarar inte
      // =========================================================================
      //
      // NÄR: Timeout eller nätverksfel vid API-anrop
      // VAD: Visar "Servern svarar inte" med retry-knapp
      // VÄNTAR PÅ: handleRetryConnection() → går tillbaka till retryState
      //
      case AppState.CONNECTION_ERROR:
        console.error('[CONNECTION_ERROR] 🔌 Backend unavailable');
        console.error('[CONNECTION_ERROR] Details:', connectionError);
        // UI visas via render (se JSX nedan)
        // Väntar på retry eller avbryt
        break;
        
      default:
        console.error(`[STATE MACHINE] ⚠️ Unknown state: ${appState}`);
    }
    console.log(`[STATE MACHINE] 🏁 Finished processing state: ${appState}`);
  }, [appState, user, activeCase, navigate, connectionError]);

  // ===========================================================================
  // useEffect - Kör state machine vid state-ändring
  // ===========================================================================
  //
  // DETTA ÄR KOPPLINGEN mellan useState och state machine!
  //
  // När setAppState(X) anropas:
  // 1. React uppdaterar appState till X
  // 2. useEffect ser att [appState] ändrades
  // 3. useEffect anropar processState()
  // 4. processState() gör switch(appState) och matchar case X
  //
  // → Resultatet är en reaktiv state machine som körs automatiskt!
  //
  useEffect(() => {
    processState();
  }, [appState, processState]);

  // ===========================================================================
  // 🔄 LOAD SLIDE DATA - Per-slide konfliktdetektering (need-to-know basis)
  // ===========================================================================
  //
  // När användaren navigerar till en slide:
  // 1. Hämta localStorage data för DENNA slide
  // 2. Hämta server metadata.pages[slideKey] för DENNA slide
  // 3. Jämför innehåll (JSON.stringify)
  //    - Om samma innehåll → Ladda tyst (ingen modal, även om global version skiljer)
  //    - Om olika innehåll OCH annan användare → Visa modal
  //    - Om olika innehåll men samma användare → Ladda tyst (användarens egna ändringar)
  //
  // Se hooks/useSlideDataLoader.js för implementation.
  //
  useSlideDataLoader({appState,AppState,currentSlideKey,isDraftMode,activeCase,user,storage,api,setFormData,setConflictInfo,
    setShowConflictModal,
  });

  // ===========================================================================
  // STRIPE WEBHOOK-FLÖDE (2025-01-13, uppdaterat 2025-12-11)
  // ===========================================================================
  //
  // 1. Användaren → Stripe Checkout → betalar
  // 2. Stripe → POST /stripe-webhook (asynkront, signaturverifierat)
  //    - Sätter metadata.subscription.payment_confirmed_at
  //    - Sätter confirmed_via: "webhook"
  //    - Hämtar Roaring-data
  // 3. Stripe → Redirectar till /payment-success
  // 4. Frontend pollar GET /subscription/status tills confirmed=true
  // 5. → READY + navigerar till riskfragor-2
  //

  // ===========================================================================
  // 📦 PROPS - Handler-funktioner som skickas ner till child-komponenter
  // ===========================================================================
  // 
  // Dessa är "props" i React-bemärkelse: funktioner som parent skapar och
  // skickar ner till children via props. Children anropar dem som callbacks.
  //
  // PATTERN: createHandle*() är factory-funktioner som skapar handlers.
  // Se respektive fil i props/ för implementation.
  //
  
  // ─── Resume Modal Props ────────────────────────────────────────────────────
  const handleResumeChoice = createHandleResumeChoice({ setActiveCase, setAppState, AppState });
  const handleStartNew = createHandleStartNew({ storage, setFormData, setActiveCase, setCompletedSlides, tempCaseId, user, setCurrentSlideKey, navigate, setAppState, AppState });
  const handleDeleteOnboarding = createHandleDeleteOnboarding({ api, pendingOnboardings, setPendingOnboardings, handleStartNew });
  const handleRetryPending = createHandleRetryPending({ setError, setAppState, AppState });
  
  // ─── Navigation Props ──────────────────────────────────────────────────────
  const handleNext = () => { console.log(`[HANDLE_NEXT] ${currentSlideKey}`); setAppState(AppState.PROCESSING_NEXT); };
  const handleBack = () => { console.log(`[HANDLE_BACK] ${currentSlideKey}`); setAppState(AppState.PROCESSING_BACK); };
  const handleSidebarClick = createHandleSidebarClick({ SLIDE_ORDER, setNavigationHistory, currentSlideKey, activeCase, isDraftMode, tempCaseId, user, storage, setCurrentSlideKey, navigate });
  const handleSidebarLock = createHandleSidebarLock({ isPaymentConfirmed });
  
  // ─── Form Props ────────────────────────────────────────────────────────────
  const handleFieldChange = createHandleFieldChange({ setFormHistory, formData, setFormData });
  // NOTE: handleConfirmCompanySelection declared earlier (before substate handlers)
  
  // ─── Auth/Session Props ────────────────────────────────────────────────────
  const handleLogout = createHandleLogout({ api, user, isDraftMode, tempCaseId, activeCase, storage, navigate });
  const handleLogoutAndReset = createHandleLogoutAndReset({ api, user, tempCaseId, isDraftMode, activeCase, storage, navigate });
  
  // ─── Payment/Agreement Props ───────────────────────────────────────────────
  const handleSelectEngångsavtal = createHandleSelectEngångsavtal({ setShowAgreementModal, setAppState, AppState });
  const handleSelectFöretagsavtal = createHandleSelectFöretagsavtal({ setShowAgreementModal, navigate, setAppState, AppState });
  const handlePaymentConfirmed = createHandlePaymentConfirmed({ setHasAgreement, setPaymentPending, setShowAgreementModal, setCurrentSlideKey, setIsPaymentConfirmed, navigate, setAppState, AppState, SLIDE_ORDER });
  const handleCancelOnboarding = createHandleCancelOnboarding({ activeCase, api, setShowAgreementModal, handleLogoutAndReset });
  
  // ─── Conflict Modal Props ──────────────────────────────────────────────────
  const handleConflictReload = createHandleConflictReload({ setShowConflictModal, setConflictInfo, api, activeCase, setFormData, storage, setCompletedSlides, setError });
  const handleConflictForceSave = createHandleConflictForceSave({ setShowConflictModal, conflictInfo, activeCase, setConflictInfo, storage, user });
  const handleConflictCancel = createHandleConflictCancel({ setShowConflictModal, setConflictInfo });
  
  // ─── Error Props ───────────────────────────────────────────────────────────
  const handleClearError = createHandleClearError({ setError, appState, AppState, setAppState });
  
  // ─── Connection Error Props ────────────────────────────────────────────────
  const handleRetryConnection = createHandleRetryConnection({ connectionError, setConnectionError, setAppState, AppState });
  const handleConnectionErrorLogout = createHandleConnectionErrorLogout({ setConnectionError, handleLogoutAndReset });

  // ===========================================================================
  // 🎨 RENDER - JSX (tic-tac-toe pattern: data ↓, events ↑)
  // ===========================================================================
  return (
    <div className="flex h-screen bg-gray-100">
      {/* ─────────────────────────────────────────────────────────────────────
          SIDEBAR - Navigeringsmeny
          ─────────────────────────────────────────────────────────────────────
          
          Props:
          - currentSlideKey: Vilken slide som är aktiv (för highlighting)
          - completedSlides: Vilka slides är klara (för checkmarks)
          - activeCase: Info om valt företag (för att visa namn)
          - handleClick: Callback när användaren klickar på en slide
          - handleLock: Funktion som avgör om en slide är låst
      */}
      <Sidebar_v2 
        currentSlideKey={currentSlideKey}
        completedSlides={completedSlides}
        activeCase={activeCase}
        handleClick={handleSidebarClick}
        handleLock={handleSidebarLock}
      />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* ─────────────────────────────────────────────────────────────────
            HEADER - Med LLM, Dokumentation, Settings, Logout, Cancel
            ─────────────────────────────────────────────────────────────────
            
            Props:
            - user: Användarinfo { email, role }
            - activeCase: Case-info { company_name, orgnr }
            - isLoading: Visa spinner
            - onLogout: Logout callback
            - onCancelAndReset: Soft delete + logout callback
            - isDraftMode: Visar "Utkast" badge
            - activePanel: Vilken panel som är aktiv (llm/documentation)
            - onPanelToggle: Toggle panel callback
            - syncStatus: Spara-status (idle/saving/saved/conflict)
        */}
        <Header 
          user={user}
          activeCase={activeCase}
          isLoading={isLoading}
          loadingMessage="Laddar..."
          onLogout={handleLogout}
          onCancelAndReset={handleCancelOnboarding}
          isDraftMode={isDraftMode}
          activePanel={activePanel}
          onPanelToggle={(panel) => setActivePanel(activePanel === panel ? null : panel)}
          syncStatus={syncStatus}
        />
        
        {/* Main content area - skjuts åt vänster när panel är öppen */}
        <main className={`flex-1 overflow-auto transition-all duration-300 ${
          activePanel ? 'mr-96' : ''
        }`}>
          {/* ─────────────────────────────────────────────────────────────────
              ROUTES - Explicit, varje slide får sina props
              ─────────────────────────────────────────────────────────────────
              
              VIKTIGT: Inga abstraktioner här!
              
              JÄMFÖR MED ALTERNATIV (som vi INTE gör):
              
              // ❌ FEL - Map över slides (döljer vad som händer)
              {SLIDE_ORDER.map(slide => (
                <Route key={slide.key} path={slide.path} element={
                  <slide.Component {...getPropsForSlide(slide)} />
                } />
              ))}
              
              // ❌ FEL - HOC wrapper (döljer vad som händer)
              <Route path="/uppdragsval" element={
                <withNavigation(UppdragsvalsSlide) />
              } />
              
              // ✅ RÄTT - Explicit, man ser precis vad varje slide får
              <Route path="/uppdragsval" element={
                <UppdragsvalsSlide 
                  formData={formData['uppdragsval']}
                  onNext={handleNext}
                  onBack={handleBack}
                  onFieldChange={(field, value) => handleFieldChange('uppdragsval', field, value)}
                />
              } />
          */}
          <Routes>
            
            {/* ─────────────────────────────────────────────────────────────
                UppdragsvalsSlide - POINT OF NO RETURN slide
                ─────────────────────────────────────────────────────────────
                
            */}
            <Route path="/uppdragsval" element={
              <UppdragsvalsSlide 
                formData={formData['uppdragsval'] || {}}
                onNext={handleNext}  // ✅ TIC-TAC-TOE: Bara informera om klick!
                onFieldChange={(field, value) => handleFieldChange('uppdragsval', field, value)}
                isLocked={!isDraftMode}
                isLoading={isLoading}
                error={error}
                syncStatus={syncStatus}
              />
            } />
            
            <Route path="/riskfragor" element={
              <RiskFragorSlide 
                formData={formData['riskfragor-1']}
                onNext={handleNext}
                onBack={handleBack}
                onFieldChange={(field, value) => handleFieldChange('riskfragor-1', field, value)}
                isValid={(() => {
                  const data = formData['riskfragor-1'] || {};
                  const affarsIde = data.affarsIde || '';
                  const personnummer = data.personnummer || '';
                  
                  // Validera verksamhet (minst 10 tecken)
                  const hasValidAffarsIde = affarsIde.trim().length >= 10;
                  
                  // Validera personnummer format (YYYYMMDD-XXXX)
                  const personnummerRegex = /^\d{8}-\d{4}$/;
                  const hasValidPersonnummer = personnummerRegex.test(personnummer);
                  
                  return hasValidAffarsIde && hasValidPersonnummer;
                })()}
              />
            } />
            
            <Route path="/riskfragor-steg2" element={
              <RiskFragorSteg2Slide 
                formData={formData['riskfragor-2']}
                onNext={handleNext}
                onBack={handleBack}
                onFieldChange={(field, value) => handleFieldChange('riskfragor-2', field, value)}
              />
            } />
            
            <Route path="/riskfragor-steg3" element={
              <RiskFragorSteg3Slide 
                formData={formData['riskfragor-3']}
                onNext={handleNext}
                onBack={handleBack}
                onFieldChange={(field, value) => handleFieldChange('riskfragor-3', field, value)}
              />
            } />
            
            <Route path="/riskfragor-steg4" element={
              <RiskFragorSteg4Slide 
                formData={formData['riskfragor-4']}
                onNext={handleNext}
                onBack={handleBack}
                onFieldChange={(field, value) => handleFieldChange('riskfragor-4', field, value)}
              />
            } />
            
            <Route path="/verksamhet" element={
              <VerksamhetSlide 
                formData={formData['verksamhet'] || {}}
                onNext={handleNext}
                onBack={handleBack}
              />
            } />
            
            <Route path="/agarstruktur" element={
              <AgarstrukturSlide 
                formData={formData['agarstruktur'] || {}}
                onNext={handleNext}
                onBack={handleBack}
              />
            } />
            
            <Route path="/styrelse" element={
              <StyrelseSlide 
                formData={formData['styrelse'] || {}}
                onNext={handleNext}
                onBack={handleBack}
              />
            } />
            
            <Route path="/ovriga-data" element={
              <OvrigaDataSlide 
                formData={formData['ovriga-data'] || {}}
                onNext={handleNext}
                onBack={handleBack}
              />
            } />
            
            <Route path="/bokforing-data" element={
              <BokforingDataSlide 
                formData={formData['bokforing-data']}
                onNext={handleNext}
                onBack={handleBack}
                onFieldChange={(field, value) => handleFieldChange('bokforing-data', field, value)}
              />
            } />
            
            <Route path="/foretagsdokumentation" element={
              <ForetagsdokumentationSlide 
                formData={formData['foretagsdokumentation']}
                onNext={handleNext}
                onBack={handleBack}
                onFieldChange={(field, value) => handleFieldChange('foretagsdokumentation', field, value)}
              />
            } />
            
            <Route path="/bokforingsunderlag" element={
              <BokforingsunderlagSlide 
                formData={formData['bokforingsunderlag']}
                onNext={handleNext}
                onBack={handleBack}
                onFieldChange={(field, value) => handleFieldChange('bokforingsunderlag', field, value)}
              />
            } />
            
            <Route path="/resultatanalys" element={
              <ResultatanalysSlide 
                sieData={sieData}
                onNext={handleNext}
                onBack={handleBack}
              />
            } />
            
            <Route path="/likviditetsanalys" element={
              <LikviditetsanalysSlide 
                sieData={sieData}
                onNext={handleNext}
                onBack={handleBack}
              />
            } />
            
            <Route path="/omsattningsanalys" element={
              <OmsattningsanalysSlide 
                sieData={sieData}
                onNext={handleNext}
                onBack={handleBack}
              />
            } />
            
            <Route path="/penningflodes" element={
              <PenningflodesanalysSlide 
                onNext={handleNext}
                onBack={handleBack}
              />
            } />
            
            <Route path="/bokanalys" element={
              <AccountingAnalysisWizard 
                onNext={handleNext}
                onBack={handleBack}
              />
            } />
            
            <Route path="/riskbedomning" element={
              <RiskbedomningSlide 
                formData={formData}
                onNext={handleNext}
                onBack={handleBack}
              />
            } />
            
            <Route path="/avtal" element={
              <AvtalSlide 
                activeCase={activeCase}
                onNext={handleNext}
                onBack={handleBack}
              />
            } />
            
            <Route path="/payment-success" element={
              <PaymentSuccessSlide 
                status={paymentVerificationStatus}
                message={paymentVerificationMessage}
                onPaymentConfirmed={handlePaymentConfirmed}
                onRetry={() => {
                  // Full reload - kör handleResuming igen som laddar färsk metadata
                  // Om payment-callback faktiskt lyckades (race condition) kommer
                  // payment_confirmed_at vara satt → READY direkt
                  window.location.reload();
                }}
              />
            } />
            
            <Route path="/support" element={
              <SupportSlide 
                onBack={handleBack}
              />
            } />
            
            <Route path="*" element={<div className="p-8">404 - Sidan hittades inte</div>} />
          </Routes>
        </main>
      </div>
      
      {/* ================================================================== */}
      {/* MODALS och OVERLAYS                                               */}
      {/* ================================================================== */}
      {/*
          Dessa renderas UTANFÖR huvudlayouten men INUTI komponenten.
          De är conditionally rendered baserat på appState och isLoading/error.
          
          MÖNSTRET:
          {condition && <Component />}
          
          Detta renderar Component ENDAST om condition är truthy.
      */}
      
      {/* ─────────────────────────────────────────────────────────────────────
          OnboardingResumeDialog - Visas när det finns pågående onboardings
          ─────────────────────────────────────────────────────────────────────
          
          NÄR: appState === SHOWING_RESUME
          VAD: Modal med lista på pågående onboardings (SLAV-PATTERN)
          
          PROPS:
            - pendingOnboardings: Lista hämtad i CHECKING_PENDING
            - isLoading: false (laddning sker i CHECKING_PENDING)
            - error: null (hanteras i state machine)
            
          CALLBACKS:
            - onResume(company_id, case_id, name) → handleResumeChoice → RESUMING
            - onDelete(company_id, case_id) → handleDeleteOnboarding → uppdaterar listan
            - onStartNew() → handleStartNew → READY (rensar allt)
            - onRetry() → handleRetryPending → CHECKING_PENDING
      */}
      {appState === AppState.SHOWING_RESUME && (
        <OnboardingResumeDialog
          pendingOnboardings={pendingOnboardings}
          isLoading={false}
          error={null}
          onResume={handleResumeChoice}
          onDelete={handleDeleteOnboarding}
          onStartNew={handleStartNew}
          onRetry={handleRetryPending}
        />
      )}
      
      {/* ─────────────────────────────────────────────────────────────────────
          MergeConflictModal - Visas vid versionskonflikter (multi-user editing)
          ─────────────────────────────────────────────────────────────────────
          
          NÄR: showConflictModal === true (sätts i checkVersionConflict)
          VAD: Modal med val: ladda om från server / skriv över / avbryt
          
          CALLBACKS:
            - onReload() → handleConflictReload → Hämta data från server
            - onForceSave() → handleConflictForceSave → Markera lokal som auktoritativ
            - onCancel() → handleConflictCancel → Stäng modal
      */}
      {showConflictModal && (
        <MergeConflictModal
          data={conflictInfo}
          onKeepTheirs={handleConflictReload}
          onKeepMine={handleConflictForceSave}
          onMerge={handleConflictForceSave}
          onClose={handleConflictCancel}
        />
      )}
      
      {/* ─────────────────────────────────────────────────────────────────────
          AgreementModal - Visas när användaren ska välja betalningsmetod
          ─────────────────────────────────────────────────────────────────────
          
          NÄR: showAgreementModal === true (sätts i handleNext för riskfragor)
          VAD: Modal med val: Engångsavtal / Företagsavtal / Avbryt
          
          CALLBACKS:
            - onSelectEngångsavtal() → handleSelectEngångsavtal → Stripe checkout
            - onSelectFöretagsavtal() → handleSelectFöretagsavtal → Enterprise flow
            - onCancel() → handleCancelOnboarding → Stäng modal, gå tillbaka
          
          PROPS:
            - trials_used/trials_max: Visar hur många gratis onboardings som är kvar (snake_case från backend)
            - isLoading: Visar spinner under paymentStatus === 'initiating'
            - error: Visar felmeddelande om Stripe-anrop misslyckas
      */}
      {showAgreementModal && (
        <AgreementModal
          onSelectEngångsavtal={handleSelectEngångsavtal}
          onSelectFöretagsavtal={handleSelectFöretagsavtal}
          onCancel={handleCancelOnboarding}
          trialsUsed={user?.trials_used || 0}
          trialsMax={user?.trials_max || 3}
          isLoading={paymentStatus === 'initiating'}
          error={error}
        />
      )}
      
      {/* ─────────────────────────────────────────────────────────────────────
          LLMPanel - Kontextmedveten AI-assistent
          ─────────────────────────────────────────────────────────────────────
          
          NÄR: activePanel === 'llm'
          VAD: Sidopanel med AI-chatt som har tillgång till all insamlad data
          
          PROPS:
            - current_slide: Vilken slide användaren är på
            - formData: All insamlad data för kontextmedvetna svar
            - companyInfo: Företagsinfo { company_name, orgnr }
            - onClose: Stäng panelen
          
          POSITIONERING: top-16 = börjar under header, z-40 = under modaler
      */}
      {activePanel === 'llm' && (
        <LLMPanel
          current_slide={currentSlideKey}
          formData={formData}
          companyInfo={{
            company_name: activeCase?.company_name,
            orgnr: activeCase?.orgnr
          }}
          onClose={() => setActivePanel(null)}
        />
      )}
      
      {/* ─────────────────────────────────────────────────────────────────────
          Loading overlay - Blockerar UI under laddning
          ─────────────────────────────────────────────────────────────────────
          
          NÄR: isLoading === true (sätts i state machine under async-operationer)
          VAD: Halvtransparent overlay med spinner
          
          z-50 = Högt z-index så det hamnar ovanpå allt
      */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
              <span className="text-lg">Laddar...</span>
            </div>
          </div>
        </div>
      )}
      
      {/* ─────────────────────────────────────────────────────────────────────
          Connection Error Modal - Visar när backend inte svarar
          ─────────────────────────────────────────────────────────────────────
          
          NÄR: appState === CONNECTION_ERROR
          VAD: Fullskärmsmodal med felinfo och retry-knapp
          CALLBACKS: 
            - "Försök igen" → handleRetryConnection()
            - "Logga ut" → handleLogout()
      */}
      {appState === AppState.CONNECTION_ERROR && connectionError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 shadow-xl max-w-md w-full mx-4">
            <div className="text-center">
              {/* Icon */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                {connectionError.isTimeout ? (
                  <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3" />
                  </svg>
                )}
              </div>
              
              {/* Title */}
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {connectionError.isTimeout ? 'Servern svarar inte' : 'Anslutningsfel'}
              </h3>
              
              {/* Message */}
              <p className="text-gray-600 mb-6">
                {connectionError.message}
              </p>
              
              {/* Helpful hint */}
              <p className="text-sm text-gray-500 mb-6">
                {connectionError.isTimeout 
                  ? 'Det kan bero på hög belastning. Vänta en stund och försök igen.'
                  : 'Kontrollera din internetanslutning och att servern är igång.'}
              </p>
              
              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleRetryConnection}
                  className="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Försök igen
                </button>
                <button
                  onClick={handleConnectionErrorLogout}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Logga ut
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* ─────────────────────────────────────────────────────────────────────
          Error toast - Visar felmeddelanden
          ─────────────────────────────────────────────────────────────────────
          
          NÄR: error !== null
          VAD: Röd toast i nedre högra hörnet med felmeddelande
          CALLBACK: ✕-knappen → handleClearError()
          
          POSITIONERING: fixed bottom-4 right-4 = Alltid i hörnet oavsett scroll
      */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-lg z-50">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <button onClick={handleClearError} className="ml-4 text-red-700 hover:text-red-900">
              ✕
            </button>
          </div>
        </div>
      )}
      
      {/* ─────────────────────────────────────────────────────────────────────
          Debug panel - Endast i utvecklingsläge
          ─────────────────────────────────────────────────────────────────────
          
          NÄR: import.meta.env.DEV === true (Vite's dev mode)
          VAD: Liten panel som visar aktuellt state och slide
          SYFTE: Hjälper utvecklare att debugga state machine
          
          OBS: Denna finns INTE i produktionsbygget!
      */}
      {import.meta.env.DEV && (
        <div className="fixed bottom-4 left-4 bg-gray-800 text-white text-xs p-2 rounded opacity-75 max-w-md">
          <div>State: {appState} | Slide: {currentSlideKey}</div>
          <div>Mode: {isDraftMode ? '📝 DRAFT' : '✅ PERMANENT'}</div>
          <div className="truncate">TempID: {tempCaseId || 'none'}</div>
          {activeCase && (
            <div className="truncate">Case: {activeCase.company_name} ({activeCase.case_id || activeCase.case_id || 'no case_id'})</div>
          )}
        </div>
      )}
    </div>
  );
}
