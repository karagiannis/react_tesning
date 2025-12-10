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

import React, { useState, useEffect, useCallback } from 'react';
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

// =============================================================================
// PROPS/HANDLERS
// =============================================================================
import { createHandleClearError } from './props/handleClearError';
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

// =============================================================================
// SLIDE ORDER - Explicit lista
// =============================================================================
const SLIDE_ORDER = [
  { key: 'uppdragsval', path: '/uppdragsval' },
  { key: 'riskfragor', path: '/riskfragor' },
  { key: 'riskfragor-steg2', path: '/riskfragor-steg2' },
  { key: 'riskfragor-steg3', path: '/riskfragor-steg3' },
  { key: 'riskfragor-steg4', path: '/riskfragor-steg4' },
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
  { key: 'riskbedomning', path: '/riskbedomning' },
  { key: 'avtal', path: '/avtal' },
  { key: 'payment-success', path: '/payment-success' },
  { key: 'support', path: '/support' },
];

// =============================================================================
// APP STATES - Tillståndsmaskin
// =============================================================================
// 
// Varje state representerar VAR i flödet vi befinner oss.
// State machine garanterar att vi alltid vet exakt vad som händer.
//
// Fördelar med state machine:
// 1. Tydligt flöde - lätt att följa vad som händer
// 2. Inga race conditions - en sak i taget
// 3. Lätt att debugga - bara titta på appState
// 4. Lätt att lägga till nya states
//
const AppState = {
  // ─────────────────────────────────────────────────────────────────────────
  // INITIAL STATES (körs automatiskt vid mount)
  // ─────────────────────────────────────────────────────────────────────────
  UNINITIALIZED: 'UNINITIALIZED',   // Komponenten har precis mountats
                                     // → Går automatiskt till INITIALIZING
  
  INITIALIZING: 'INITIALIZING',     // Laddar token, user, localStorage
                                     // → Går till CHECKING_PENDING när klart
  
  CHECKING_PENDING: 'CHECKING_PENDING', // Frågar API om pågående onboardings
                                         // → SHOWING_RESUME om finns, annars READY
  
  // ─────────────────────────────────────────────────────────────────────────
  // RESUME STATES (användaren har pågående onboardings)
  // ─────────────────────────────────────────────────────────────────────────
  SHOWING_RESUME: 'SHOWING_RESUME', // Visar modal "Vill du fortsätta?"
                                     // → Väntar på handleResumeChoice() eller handleStartNew()
  
  RESUMING: 'RESUMING',             // Hämtar metadata från server
                                     // → Går till READY när klart
  
  RESTORING_SESSION: 'RESTORING_SESSION', // Page reload under aktiv session
                                           // → Hydrate från localStorage + server
                                           // → Skippar resume-modal!
  
  // ─────────────────────────────────────────────────────────────────────────
  // NORMAL DRIFT
  // ─────────────────────────────────────────────────────────────────────────
  READY: 'READY',                   // Normal drift - väntar på användarinteraktion
                                     // Användaren kan navigera, fylla i formulär, etc.
  
  PROCESSING_NEXT: 'PROCESSING_NEXT', // Användaren klickade "Nästa" - processar logik
  PROCESSING_BACK: 'PROCESSING_BACK', // Användaren klickade "Tillbaka" - processar logik
  
  INITIATING_PAYMENT: 'INITIATING_PAYMENT', // Skapar Stripe session och redirectar
                                             // → Anropar POST /subscription
                                             // → Sparar pending_payment till localStorage
                                             // → window.location.href = stripe_url
  
  VERIFYING_PAYMENT: 'VERIFYING_PAYMENT', // Verifierar betalning efter Stripe redirect
                                           // → Anropar /subscription/status
                                           // → Går till READY när klart
  
  NAVIGATING: 'NAVIGATING',         // (Framtida) Byter slide
  SAVING: 'SAVING',                 // (Framtida) Sparar till server
  
  // ─────────────────────────────────────────────────────────────────────────
  // ERROR
  // ─────────────────────────────────────────────────────────────────────────
  ERROR: 'ERROR',                   // Något gick fel
                                     // → Visar felmeddelande, väntar på handleClearError()
};

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
  // pendingOnboardings = [{ companyId: 123, companyName: "AB Test", ... }, ...]
  
  // ─────────────────────────────────────────────────────────────────────────
  // Aktivt ärende
  // ─────────────────────────────────────────────────────────────────────────
  const [activeCase, setActiveCase] = useState(null);
  // activeCase = { companyId: 123, onboardingId: 456, companyName: "AB Test" }
  
  // ─────────────────────────────────────────────────────────────────────────
  // Extern data (från Roaring.io och SIE-fil)
  // ─────────────────────────────────────────────────────────────────────────
  const [roaringData, setRoaringData] = useState(null);
  // roaringData = { company: {...}, owners: [...], board: [...] }
  
  const [sieData, setSieData] = useState(null);
  // sieData = { accounts: [...], transactions: [...] }
  
  // ─────────────────────────────────────────────────────────────────────────
  // UI State
  // ─────────────────────────────────────────────────────────────────────────
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState('idle');
  // syncStatus: 'idle' | 'saving' | 'saved' | 'conflict' | 'offline'
  
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
  // LOCALSTORAGE - Endast här!
  // ===========================================================================
  //
  // REGEL: Slides får ALDRIG anropa localStorage direkt!
  //        Allt går via detta storage-objekt.
  //
  // Varför?
  // 1. En enda källa till sanning (single source of truth)
  // 2. Lätt att debugga - alla localStorage-anrop på ett ställe
  // 3. Lätt att byta ut (t.ex. till sessionStorage eller IndexedDB)
  // 4. Konsekvent felhantering
  //
  // NYCKELFORMAT:
  // - Draft:     onboarding::draft::temp_123::user_456::formData
  // - Permanent: onboarding::556677-8899::case_789::user_456::formData
  //
  const storage = {
    // ─────────────────────────────────────────────────────────────────────
    // HJÄLPFUNKTION: Bygg rätt nyckel baserat på läge
    // ─────────────────────────────────────────────────────────────────────
    //
    // Denna funktion väljer automatiskt rätt nyckelformat beroende på
    // om vi är i draft-läge eller permanent läge.
    //
    _buildKey: (dataType) => {
      if (isDraftMode || !activeCase?.companyId) {
        // Draft-läge: använd temp_case_id
        return StorageKeyBuilder.buildDraftKey(tempCaseId, user?.id || 'anonymous', dataType);
      } else {
        // Permanent läge: använd riktigt company_id och case_id
        return StorageKeyBuilder.buildPermanentKey(
          activeCase.companyId,
          activeCase.caseId || activeCase.onboardingId,
          user?.id || 'anonymous',
          dataType
        );
      }
    },
    
    // ─────────────────────────────────────────────────────────────────────
    // Token (JWT från login) - GLOBAL, ingen preamble
    // ─────────────────────────────────────────────────────────────────────
    // OBS: camelCase för att matcha serverns konvention
    getToken: () => localStorage.getItem('accessToken'),
    setToken: (token) => localStorage.setItem('accessToken', token),
    clearToken: () => localStorage.removeItem('accessToken'),
    
    getRefreshToken: () => localStorage.getItem('refreshToken'),
    setRefreshToken: (token) => localStorage.setItem('refreshToken', token),
    clearRefreshToken: () => localStorage.removeItem('refreshToken'),
    
    // ─────────────────────────────────────────────────────────────────────
    // Temp Case ID - Sparas separat för att överleva page refresh
    // ─────────────────────────────────────────────────────────────────────
    getTempCaseId: () => localStorage.getItem('temp_case_id'),
    setTempCaseId: (id) => localStorage.setItem('temp_case_id', id),
    clearTempCaseId: () => localStorage.removeItem('temp_case_id'),
    
    // ─────────────────────────────────────────────────────────────────────
    // Tab Session - Vilken session denna FLIK arbetar med
    // ─────────────────────────────────────────────────────────────────────
    //
    // ANVÄNDER sessionStorage (unik per flik!) istället för localStorage
    //
    // Vid page reload:
    // 1. Läs sessionStorage.getItem('currentTabSession') → session-ID
    // 2. Om finns → RESTORING_SESSION (skippa resume-modal)
    // 3. Om inte finns → CHECKING_PENDING (ny login-flow)
    //
    // Detta möjliggör att användaren kan ha FLERA onboardings öppna
    // i olika flikar, t.ex.:
    //   Tab 1: onboarding::556677::case_001::user_42
    //   Tab 2: onboarding::889900::case_002::user_42
    //
    getCurrentTabSession: () => {
      const data = sessionStorage.getItem('currentTabSession');
      console.log('[STORAGE] getCurrentTabSession:', data);
      return data ? JSON.parse(data) : null;
    },
    setCurrentTabSession: (sessionData) => {
      console.log('[STORAGE] setCurrentTabSession:', sessionData);
      sessionStorage.setItem('currentTabSession', JSON.stringify({
        ...sessionData,
        lastActivity: new Date().toISOString(),
      }));
    },
    clearCurrentTabSession: () => {
      console.log('[STORAGE] clearCurrentTabSession');
      sessionStorage.removeItem('currentTabSession');
    },
    
    // ─────────────────────────────────────────────────────────────────────
    // Session Data - Data för en specifik session (i localStorage)
    // ─────────────────────────────────────────────────────────────────────
    //
    // SESSION-ID FORMAT:
    //   onboarding::{company_id}::{case_id}::{user_id}
    //
    // Exempel:
    //   onboarding::556677::case_001::user_42
    //
    // Data lagras som:
    //   session::onboarding::556677::case_001::user_42 → { currentSlide, formData, ... }
    //
    buildSessionId: (companyId, caseId, userId) => {
      return `onboarding::${companyId}::${caseId}::${userId}`;
    },
    getSessionData: (sessionId) => {
      const key = `session::${sessionId}`;
      const data = localStorage.getItem(key);
      console.log(`[STORAGE] getSessionData from key: ${key}`);
      return data ? JSON.parse(data) : null;
    },
    setSessionData: (sessionId, sessionData) => {
      const key = `session::${sessionId}`;
      console.log(`[STORAGE] setSessionData to key: ${key}`);
      localStorage.setItem(key, JSON.stringify({
        ...sessionData,
        lastActivity: new Date().toISOString(),
      }));
    },
    clearSessionData: (sessionId) => {
      const key = `session::${sessionId}`;
      console.log(`[STORAGE] clearSessionData from key: ${key}`);
      localStorage.removeItem(key);
    },
    
    // ─────────────────────────────────────────────────────────────────────
    // Draft Mode - Sparas för att veta läge efter refresh
    // ─────────────────────────────────────────────────────────────────────
    getIsDraftMode: () => {
      const value = localStorage.getItem('is_draft_mode');
      return value === null ? true : value === 'true';
    },
    setIsDraftMode: (isDraft) => localStorage.setItem('is_draft_mode', String(isDraft)),
    
    // ─────────────────────────────────────────────────────────────────────
    // Aktivt ärende - Använder preamble
    // ─────────────────────────────────────────────────────────────────────
    getActiveCase: () => {
      const key = storage._buildKey('activeCase');
      const data = localStorage.getItem(key);
      console.log(`[STORAGE] getActiveCase from key: ${key}`);
      return data ? JSON.parse(data) : null;
    },
    setActiveCase: (caseData) => {
      const key = storage._buildKey('activeCase');
      console.log(`[STORAGE] setActiveCase to key: ${key}`);
      localStorage.setItem(key, JSON.stringify(caseData));
    },
    clearActiveCase: () => {
      const key = storage._buildKey('activeCase');
      console.log(`[STORAGE] clearActiveCase from key: ${key}`);
      localStorage.removeItem(key);
    },
    
    // ─────────────────────────────────────────────────────────────────────
    // Formulärdata (alla slides) - Använder preamble
    // ─────────────────────────────────────────────────────────────────────
    // DEPRECATED: Använd getSlideData/setSlideData istället!
    // Behålls för bakåtkompatibilitet under migration.
    getFormData: () => {
      const key = storage._buildKey('formData');
      const data = localStorage.getItem(key);
      console.log(`[STORAGE] getFormData from key: ${key} (DEPRECATED)`);
      return data ? JSON.parse(data) : {};
    },
    setFormData: (data) => {
      const key = storage._buildKey('formData');
      console.log(`[STORAGE] setFormData to key: ${key} (DEPRECATED)`);
      localStorage.setItem(key, JSON.stringify(data));
    },
    clearFormData: () => {
      const key = storage._buildKey('formData');
      console.log(`[STORAGE] clearFormData from key: ${key}`);
      localStorage.removeItem(key);
    },
    
    // ─────────────────────────────────────────────────────────────────────
    // Per-slide data storage - NY ARKITEKTUR (URL-aware)
    // ─────────────────────────────────────────────────────────────────────
    // Sparar varje sida separat med slideKey som identifierare.
    // Detta matchar exakt samma struktur som metadata.json på backend.
    //
    // Exempel:
    //   localStorage['onboarding::556677::case_001::user_42::uppdragsval']
    //   localStorage['onboarding::556677::case_001::user_42::riskfragor-steg-1']
    //
    getSlideData: (slideKey) => {
      const key = storage._buildKey(slideKey);
      const data = localStorage.getItem(key);
      console.log(`[STORAGE] getSlideData(${slideKey}) from key: ${key}`);
      return data ? JSON.parse(data) : null;
    },
    setSlideData: (slideKey, data) => {
      const key = storage._buildKey(slideKey);
      console.log(`[STORAGE] setSlideData(${slideKey}) to key: ${key}`, data);
      localStorage.setItem(key, JSON.stringify(data));
    },
    clearSlideData: (slideKey) => {
      const key = storage._buildKey(slideKey);
      console.log(`[STORAGE] clearSlideData(${slideKey}) from key: ${key}`);
      localStorage.removeItem(key);
    },
    
    // Hämta alla slides som ett objekt (för bakåtkompatibilitet)
    getAllSlidesData: () => {
      const allSlides = {};
      const prefix = isDraftMode 
        ? `onboarding::draft::${tempCaseId}::${user?.id || 'anonymous'}::`
        : `onboarding::${activeCase?.companyId}::${activeCase?.caseId || activeCase?.onboardingId}::${user?.id || 'anonymous'}::`;
      
      // Iterera genom localStorage och hitta alla keys med rätt prefix
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          const slideKey = key.replace(prefix, '');
          // Skippa metadata-nycklar (activeCase, completedSlides, etc.)
          if (!['activeCase', 'completedSlides', 'formData'].includes(slideKey)) {
            try {
              allSlides[slideKey] = JSON.parse(localStorage.getItem(key));
            } catch (e) {
              console.error(`[STORAGE] Failed to parse ${key}:`, e);
            }
          }
        }
      }
      console.log(`[STORAGE] getAllSlidesData:`, Object.keys(allSlides));
      return allSlides;
    },
    
    // ─────────────────────────────────────────────────────────────────────
    // Completed slides - Använder preamble
    // ─────────────────────────────────────────────────────────────────────
    getCompletedSlides: () => {
      const key = storage._buildKey('completedSlides');
      const data = localStorage.getItem(key);
      console.log(`[STORAGE] getCompletedSlides from key: ${key}`);
      return data ? JSON.parse(data) : [];
    },
    setCompletedSlides: (slides) => {
      const key = storage._buildKey('completedSlides');
      console.log(`[STORAGE] setCompletedSlides to key: ${key}`);
      localStorage.setItem(key, JSON.stringify(slides));
    },
    
    // ─────────────────────────────────────────────────────────────────────
    // 🔄 KONVERTERA DRAFT TILL PERMANENT
    // ─────────────────────────────────────────────────────────────────────
    //
    // Anropas vid "point of no return" - när användaren bekräftar företagsval
    //
    // Steg:
    // 1. Hitta alla nycklar med tempCaseId
    // 2. Läs data från varje draft-nyckel
    // 3. Skriv till ny permanent nyckel
    // 4. Ta bort draft-nyckeln
    //
    convertDraftToPermanent: (companyId, caseId, userId) => {
      console.log(`[STORAGE] 🔄 Converting draft to permanent: company=${companyId}, case=${caseId}`);
      
      const currentTempCaseId = storage.getTempCaseId();
      if (!currentTempCaseId) {
        console.warn('[STORAGE] No temp_case_id found, nothing to convert');
        return;
      }
      
      // Hitta alla draft-nycklar för detta temp_case_id
      const draftKeys = StorageKeyBuilder.findKeysByTempCaseId(currentTempCaseId);
      console.log(`[STORAGE] Found ${draftKeys.length} draft keys to convert:`, draftKeys);
      
      // Konvertera varje nyckel
      for (const oldKey of draftKeys) {
        const parsed = StorageKeyBuilder.parseKey(oldKey);
        if (!parsed) continue;
        
        // Bygg ny permanent nyckel
        const newKey = StorageKeyBuilder.buildPermanentKey(
          companyId,
          caseId,
          userId,
          parsed.dataType
        );
        
        // Flytta data
        const data = localStorage.getItem(oldKey);
        if (data) {
          localStorage.setItem(newKey, data);
          console.log(`[STORAGE] Moved: ${oldKey} → ${newKey}`);
        }
        
        // Ta bort gamla nyckeln
        localStorage.removeItem(oldKey);
      }
      
      // Uppdatera läge
      storage.setIsDraftMode(false);
      console.log('[STORAGE] ✅ Conversion complete, isDraftMode = false');
    },
    
    // ─────────────────────────────────────────────────────────────────────
    // 🗑️ RENSA DRAFT (Avsluta & rensa)
    // ─────────────────────────────────────────────────────────────────────
    //
    // Anropas när användaren väljer "Avsluta & rensa" istället för vanlig logout
    //
    clearAllDraftData: () => {
      console.log('[STORAGE] 🗑️ Clearing all draft data');
      
      const currentTempCaseId = storage.getTempCaseId();
      if (!currentTempCaseId) {
        console.warn('[STORAGE] No temp_case_id found');
        return;
      }
      
      // Hitta och ta bort alla draft-nycklar
      const draftKeys = StorageKeyBuilder.findKeysByTempCaseId(currentTempCaseId);
      for (const key of draftKeys) {
        localStorage.removeItem(key);
        console.log(`[STORAGE] Removed: ${key}`);
      }
      
      // Rensa temp_case_id och reset draft mode
      storage.clearTempCaseId();
      storage.setIsDraftMode(true);
      
      console.log('[STORAGE] ✅ All draft data cleared');
    },
  };

  // ===========================================================================
  // API - Endast här!
  // ===========================================================================
  //
  // REGEL: Slides får ALDRIG göra fetch() direkt!
  //        Allt går via detta api-objekt.
  //
  // Varför?
  // 1. Centraliserad autentisering (token läggs till automatiskt)
  // 2. Konsekvent felhantering
  // 3. Lätt att mocka för tester
  // 4. Lätt att lägga till logging, retry-logik, etc.
  //
  const api = {
    // ─────────────────────────────────────────────────────────────────────
    // Generell fetch med autentisering + automatisk token refresh
    // ─────────────────────────────────────────────────────────────────────
    fetch: async (endpoint, options = {}) => {
      const token = storage.getToken();
      let response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
          ...options.headers,
        },
      });
      
      // Om 401 Unauthorized → försök refresha token
      if (response.status === 401 && storage.getRefreshToken()) {
        console.log('[AUTH] Access token expired, refreshing...');
        
        const refreshResponse = await fetch(`${API_BASE}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            refresh_token: storage.getRefreshToken()
          })
        });
        
        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          storage.setToken(data.access_token);
          if (data.refresh_token) {
            storage.setRefreshToken(data.refresh_token);
          }
          console.log('[AUTH] Token refreshed successfully');
          
          // Försök originalanropet igen med ny token
          response = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${data.access_token}`,
              ...options.headers,
            },
          });
        } else {
          // Refresh token är också invalid → logga ut
          console.error('[AUTH] Refresh token invalid, logging out');
          storage.clearToken();
          storage.clearRefreshToken();
          window.location.href = '/login';
        }
      }
      
      return response;
    },
    
    // ─────────────────────────────────────────────────────────────────────
    // POST shorthand (använder fetch under huven)
    // ─────────────────────────────────────────────────────────────────────
    post: async (endpoint, body) => {
      return api.fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(body),
      });
    },
    
    // ─────────────────────────────────────────────────────────────────────
    // Hämta användarinfo från JWT (dekoderad på server)
    // ─────────────────────────────────────────────────────────────────────
    //
    // GET /api/me returnerar:
    // {
    //   id: "uuid",
    //   email: "user@example.com",
    //   name: "Display Name",
    //   role: "user" | "admin",
    //   org_id: "orgid" | null,
    //   created_at: "iso-timestamp",
    //   login_time: "iso-timestamp",
    //   browser: "user-agent"
    // }
    //
    fetchMe: async () => {
      const response = await api.fetch('/me');
      if (response.ok) {
        return await response.json();
      }
      throw new Error('Kunde inte hämta användarinfo');
    },
    
    // ─────────────────────────────────────────────────────────────────────
    // Central logging (för audit trail - admins kan se)
    // ─────────────────────────────────────────────────────────────────────
    //
    // Skriver till central audit_log.jsonl
    // Används för viktiga händelser som ska vara synliga för admins.
    //
    log: async (message, metadata = {}) => {
      try {
        await api.fetch('/logger', {
          method: 'POST',
          body: JSON.stringify({ message, metadata, timestamp: new Date().toISOString() }),
        });
      } catch (e) {
        console.error('Central logger error:', e);
        // Logga lokalt om server-loggning misslyckas
      }
    },
    
    // ─────────────────────────────────────────────────────────────────────
    // Personlig logging (skriver till användarens mapp)
    // ─────────────────────────────────────────────────────────────────────
    //
    // Skriver till data/users/{user_id}/activity.jsonl
    // Används för navigering, formändringar, etc.
    // Privat för användaren - kan raderas vid GDPR-request.
    //
    logPersonal: async (message, metadata = {}) => {
      try {
        await api.fetch('/logger/me', {
          method: 'POST',
          body: JSON.stringify({ message, metadata, timestamp: new Date().toISOString() }),
        });
      } catch (e) {
        console.error('Personal logger error:', e);
        // Logga lokalt om server-loggning misslyckas
      }
    },
    
    // ─────────────────────────────────────────────────────────────────────
    // Hämta pågående onboardings för denna användare
    // ─────────────────────────────────────────────────────────────────────
    //
    // GET /api/onboarding/pending
    //
    // OBS: Ingen user_id i URL! Servern läser user_id från JWT-token
    //      som skickas i Authorization-headern.
    //
    // Returnerar:
    // [
    //   {
    //     company_id: "556677",
    //     case_id: "case_001",
    //     company_name: "Test AB",
    //     orgnr: "556677-8899",
    //     last_slide: "riskfragor",
    //     last_activity: "2024-12-04T10:30:00Z",
    //     progress_percent: 35
    //   },
    //   ...
    // ]
    //
    fetchPendingOnboardings: async () => {
      console.log('[API] fetchPendingOnboardings: Starting...');
      // Använd /onboarding/active-cases som returnerar:
      // { success: true, active_cases: [...], count: N }
      console.log('[API] fetchPendingOnboardings: Calling /onboarding/active-cases');
      const response = await api.fetch('/onboarding/active-cases');
      console.log('[API] fetchPendingOnboardings: Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('[API] fetchPendingOnboardings: Data received:', data);
        // Transformera till det format som frontend förväntar sig
        // active-cases returnerar: { case_id, company_id, company_name, orgnr, current_slide, ... }
        // Frontend förväntar sig: { company_id, company_name, onboarding_id (=case_id), ... }
        const activeCases = data.active_cases || [];
        console.log('[API] fetchPendingOnboardings: Returning', activeCases.length, 'active cases');
        return activeCases.map(c => ({
          company_id: c.company_id,
          company_name: c.company_name,
          orgnr: c.orgnr,
          case_id: c.case_id,        // Behåll original case_id
          onboarding_id: c.case_id,  // Frontend använder onboarding_id
          current_slide: c.current_slide,
          updated_at: c.updated_at,
          services: c.services,
        }));
      }
      console.log('[API] fetchPendingOnboardings: Response not OK, returning empty array');
      return [];
    },
    
    // ─────────────────────────────────────────────────────────────────────
    // Hämta metadata för ett specifikt onboarding-ärende
    // ─────────────────────────────────────────────────────────────────────
    fetchMetadata: async (companyId, onboardingId) => {
      const response = await api.fetch(`/onboarding/resume/${companyId}?onboarding_id=${onboardingId}`);
      if (response.ok) {
        return await response.json();
      }
      // Kasta ett fel med statuskoden så vi kan känna igen 404
      const error = new Error('Kunde inte hämta metadata');
      error.status = response.status;
      throw error;
    },
  };

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
  
  // ===========================================================================
  // saveSlideAndNavigate - Helper för standard slide save & navigate
  // ===========================================================================
  //
  // Används av PROCESSING_NEXT för alla slides som inte har special-logik
  //
  const saveSlideAndNavigate = async (slideKey, currentIndex) => {
    setIsLoading(true);
    setSyncStatus('saving');
    setError(null);
    
    try {
      const slideData = formData[slideKey] || {};
      
      // ─────────────────────────────────────────────────────────────────
      // Steg 1: Kolla version conflict (om permanent mode)
      // ─────────────────────────────────────────────────────────────────
      if (!isDraftMode) {
        const hasConflict = await checkVersionConflict();
        if (hasConflict) {
          console.log('[SAVE] ⚠️ Konflikt - blockerar navigation');
          setIsLoading(false);
          setSyncStatus('conflict');
          setAppState(AppState.READY);
          return;
        }
      }
      
      // ─────────────────────────────────────────────────────────────────
      // Steg 2: Push till server (om permanent mode)
      // ─────────────────────────────────────────────────────────────────
      if (!isDraftMode && activeCase?.caseId) {
        console.log(`[SAVE] 📤 Pushing slide data: ${slideKey}`);
        
        // 🎯 Generisk endpoint: POST /onboarding/{company_id}/{slide_key}
        const response = await api.post(
          `/onboarding/${activeCase.companyId}/${slideKey}`,
          {
            data: slideData,
            onboarding_id: activeCase.caseId,
            // expected_version hämtas från localStorage
          }
        );
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          
          if (response.status === 409) {
            console.log('[SAVE] ⚠️ Server returnerade 409 - version conflict');
            setConflictInfo(errorData);
            setShowConflictModal(true);
            setIsLoading(false);
            setSyncStatus('conflict');
            setAppState(AppState.READY);
            return;
          }
          
          throw new Error(errorData.detail || `HTTP ${response.status}`);
        }
        
        const result = await response.json();
        console.log(`[SAVE] ✅ Server saved slide, new version: ${result.version}`);
        
        // Uppdatera lokal version
        const versionKey = `case_${activeCase.companyId}_${activeCase.caseId}_version`;
        localStorage.setItem(versionKey, JSON.stringify({
          version: result.version,
          timestamp: new Date().toISOString(),
          lastSlide: slideKey,
        }));
      } else {
        console.log(`[SAVE] 📝 Draft mode - only saving to localStorage`);
      }
      
      setSyncStatus('saved');
      
      // ─────────────────────────────────────────────────────────────────
      // Steg 3: Uppdatera state och navigera
      // ─────────────────────────────────────────────────────────────────
      
      // Markera som klar
      const newCompleted = [...completedSlides, slideKey];
      setCompletedSlides(newCompleted);
      storage.setCompletedSlides(newCompleted);
      
      // Spara formData
      storage.setFormData(formData);
      
      // Navigera till nästa slide
      const nextSlide = SLIDE_ORDER[currentIndex + 1];
      console.log(`[SAVE] ✅ Navigating to: ${nextSlide.key}`);
      
      setNavigationHistory(prev => [...prev, {
        slideKey: nextSlide.key,
        timestamp: Date.now(),
        action: 'next',
        fromSlide: slideKey,
      }]);
      
      // Uppdatera session
      const caseOrOnboardingId = activeCase?.caseId || activeCase?.onboardingId;
      const sessionId = isDraftMode
        ? `onboarding::draft::${tempCaseId}::${user?.id}`
        : storage.buildSessionId(activeCase?.companyId, caseOrOnboardingId, user?.id);
      storage.setCurrentTabSession({
        sessionId,
        currentSlide: nextSlide.key,
      });
      
      setCurrentSlideKey(nextSlide.key);
      navigate(nextSlide.path);
      
      setIsLoading(false);
      setTimeout(() => setSyncStatus('idle'), 1500);
      setAppState(AppState.READY);
      
    } catch (err) {
      console.error('[SAVE] Error:', err);
      setError(`Kunde inte spara: ${err.message}`);
      setSyncStatus('idle');
      setIsLoading(false);
      setAppState(AppState.READY);
    }
  };
  
  const processState = useCallback(async () => {
    console.log(`[STATE MACHINE] Processing: ${appState}`);
    
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
      // INITIALIZING - Ladda allt vi behöver
      // =========================================================================
      //
      // NÄR: Direkt efter UNINITIALIZED
      // VAD: 
      //   1. Kolla att token finns (annars ERROR)
      //   2. Hämta/generera tempCaseId för draft-läge
      //   3. Hämta användarinfo
      //   4. Logga inloggning till server
      //   5. Kolla om vi har en pågående session i denna flik
      // OM PÅGÅENDE SESSION:
      //   → Gå till RESTORING_SESSION
      // ANNARS:    
      //    → Gå till CHECKING_PENDING
      case AppState.INITIALIZING: {
        setIsLoading(true);
        
        // ─────────────────────────────────────────────────────────────────
        // Steg 1: Verifiera att vi har en token
        // ─────────────────────────────────────────────────────────────────
        const token = storage.getToken();
        if (!token) {
          setError('Ingen token hittad - du måste logga in igen');
          setAppState(AppState.ERROR);
          break;  // VIKTIGT: Avbryt här, gå inte vidare!
        }
        
        // ─────────────────────────────────────────────────────────────────
        // Steg 2: Hantera tempCaseId och draft-läge
        // ─────────────────────────────────────────────────────────────────
        //
        // Om användaren refreshar sidan behöver vi behålla tempCaseId
        // så att vi kan hitta rätt data i localStorage.
        //
        // Om det är första gången (ny session) genererar vi ett nytt.
        //
        let currentTempCaseId = storage.getTempCaseId();
        const currentIsDraftMode = storage.getIsDraftMode();
        
        if (!currentTempCaseId) {
          // Första gången - generera nytt tempCaseId
          currentTempCaseId = StorageKeyBuilder.generateTempCaseId();
          storage.setTempCaseId(currentTempCaseId);
          console.log(`[INIT] Generated new tempCaseId: ${currentTempCaseId}`);
        } else {
          console.log(`[INIT] Using existing tempCaseId: ${currentTempCaseId}`);
        }
        
        setTempCaseId(currentTempCaseId);
        setIsDraftMode(currentIsDraftMode);
        console.log(`[INIT] isDraftMode: ${currentIsDraftMode}`);
        
        // ─────────────────────────────────────────────────────────────────
        // Steg 3: Hämta användarinfo från /api/me
        // ─────────────────────────────────────────────────────────────────
        //
        // GET /api/me dekoderar JWT på servern och returnerar:
        // - id: user UUID
        // - email: från JWT
        // - name: display_name från profile.json
        // - role: user | admin
        // - org_id: organisation ID om tilldelad
        // - login_time: aktuell tid (server)
        // - browser: user-agent (server läser från request)
        //
        let userInfo;
        try {
          userInfo = await api.fetchMe();
          console.log('[INIT] Fetched user info from /api/me:', userInfo);
        } catch (e) {
          console.error('[INIT] Failed to fetch /api/me:', e);
          setError('Kunde inte hämta användarinfo - försök logga in igen');
          setAppState(AppState.ERROR);
          break;
        }
        setUser(userInfo);
        
        // ─────────────────────────────────────────────────────────────────
        // Steg 4: Logga inloggning till server (audit trail)
        // ─────────────────────────────────────────────────────────────────
        //
        // Två typer av loggning:
        // - api.log() = central audit log (admins ser)
        // - api.logPersonal() = användarens personliga logg
        //
        await api.log(`Användare ${userInfo.name} är inloggad`, {
          userId: userInfo.id,
          email: userInfo.email,
          role: userInfo.role,
          tempCaseId: currentTempCaseId,
          isDraftMode: currentIsDraftMode,
        });
        
        // Logga också till personlig logg
        await api.logPersonal('Session startad', {
          tempCaseId: currentTempCaseId,
          isDraftMode: currentIsDraftMode,
        });
        
        // ─────────────────────────────────────────────────────────────────
        // Steg 5: Kolla om vi har en AKTIV SESSION i denna flik (page reload)
        // ─────────────────────────────────────────────────────────────────
        //
        // SYFTE: Avgöra om detta är:
        //   A) Page reload under pågående session → RESTORING_SESSION
        //   B) Ny login (eller efter logout) → CHECKING_PENDING
        //
        // VIKTIGT: Vi använder sessionStorage (unik per flik!) för att
        //          identifiera vilken session DENNA FLIK arbetar med.
        //
        // SESSION-ID FORMAT:
        //   onboarding::{company_id}::{case_id}::{user_id}
        //   Exempel: onboarding::556677::case_001::user_42
        //
        // TAB SESSION innehåller:
        //   - sessionId: Den fullständiga session-ID:n
        //   - currentSlide: Vilken slide användaren var på
        //   - lastActivity: Tidsstämpel för senaste aktivitet
        //
        // FLÖDE:
        //   Om currentTabSession finns → RESTORING_SESSION (skippa resume-modal!)
        //   Om currentTabSession INTE finns → CHECKING_PENDING (normal flow)
        //
        const currentTabSession = storage.getCurrentTabSession();
        
        setIsLoading(false);
        
        // ─────────────────────────────────────────────────────────────────
        // VIKTIG VALIDERING: Kontrollera att sessionen tillhör DENNA användare!
        // ─────────────────────────────────────────────────────────────────
        // SessionID har formatet: onboarding::{companyId}::{caseId}::{userId}
        // eller: onboarding::draft::{tempCaseId}::{userId}
        // Vi måste verifiera att userId i sessionId matchar den inloggade användaren.
        //
        let sessionBelongsToUser = false;
        if (currentTabSession && currentTabSession.sessionId && user?.id) {
          const sessionParts = currentTabSession.sessionId.split('::');
          const sessionUserId = sessionParts[sessionParts.length - 1];
          sessionBelongsToUser = (sessionUserId === user.id);
          
          if (!sessionBelongsToUser) {
            console.warn('[INIT] ⚠️ Session belongs to different user!');
            console.warn(`[INIT]   Session user: ${sessionUserId}`);
            console.warn(`[INIT]   Current user: ${user.id}`);
            console.log('[INIT] Clearing stale tab session...');
            storage.clearCurrentTabSession();
          }
        }
        
        if (currentTabSession && currentTabSession.sessionId && sessionBelongsToUser) {
          // ═══════════════════════════════════════════════════════════════
          // PAGE RELOAD: Användaren var mitt i en session i denna flik
          // ═══════════════════════════════════════════════════════════════
          console.log('[INIT] 🔄 Tab session found:', currentTabSession);
          console.log('[INIT] → Going to RESTORING_SESSION (skipping resume modal)');
          setAppState(AppState.RESTORING_SESSION);
        } else {
          // ═══════════════════════════════════════════════════════════════
          // NY LOGIN/NY FLIK: Ingen aktiv session - kolla pending på servern
          // ═══════════════════════════════════════════════════════════════
          console.log('[INIT] No valid tab session found for this user');
          console.log('[INIT] → Going to CHECKING_PENDING');
          setAppState(AppState.CHECKING_PENDING);
        }
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
        console.log('[CHECKING_PENDING] 🔍 Starting...');
        setIsLoading(true);
        
        console.log('[CHECKING_PENDING] 📡 Calling api.fetchPendingOnboardings()...');
        // Fråga API om pågående onboardings
        const onboardings = await api.fetchPendingOnboardings();
        console.log('[CHECKING_PENDING] ✅ API response:', onboardings);
        
        setIsLoading(false);
        console.log('[CHECKING_PENDING] ⚖️ Deciding next state, onboardings.length =', onboardings.length);
        
        // Beslut: Visa resume-modal eller gå till normal drift?
        if (onboardings.length > 0) {
          console.log('[CHECKING_PENDING] ➡️ Going to SHOWING_RESUME (found pending onboardings)');
          
          // 🔥 KRITISKT: Sätt pendingOnboardings INNAN state-övergång
          // Annars får modal tom array vid första render!
          setPendingOnboardings(onboardings);
          
          // Logga att användaren har pending onboardings
          await api.logPersonal('Pending onboardings funna', {
            count: onboardings.length,
            companies: onboardings.map(o => o.company_name),
          });
          
          // I DEBUG-läge: logga även centralt
          if (import.meta.env.DEV) {
            await api.log(`[DEBUG] Användare ${user?.name} har ${onboardings.length} pågående onboardings`, {
              userId: user?.id,
              pendingCount: onboardings.length,
            });
          }
          
          // Gå till SHOWING_RESUME - nu har pendingOnboardings redan rätt data
          setAppState(AppState.SHOWING_RESUME);
        } else {
          console.log('[CHECKING_PENDING] ➡️ No pending onboardings - going to READY');
          // Ingen pending onboarding - sätt initial tab session (draft mode)
          const sessionId = `onboarding::draft::${tempCaseId}::${user?.id}`;
          console.log('[CHECKING_PENDING] 💾 Setting tab session:', sessionId);
          storage.setCurrentTabSession({
            sessionId,
            currentSlide: 'uppdragsval',
          });
          
          console.log('[CHECKING_PENDING] 📝 Logging to server...');
          // Logga ny session till personlig logg
          await api.logPersonal('Startar ny onboarding-session', {
            sessionId,
            startSlide: 'uppdragsval',
            tempCaseId,
          });
          
          // I DEBUG-läge: logga även centralt
          if (import.meta.env.DEV) {
            await api.log(`[DEBUG] Användare ${user?.name} startar ny onboarding-session på Uppdragsval`, {
              userId: user?.id,
              sessionId,
              tempCaseId,
            });
          }
          
          console.log('[CHECKING_PENDING] ✅ Going to READY state');
          setAppState(AppState.READY);
        }
        console.log('[CHECKING_PENDING] 🏁 Case finished');
        break;
      }
        
      // =========================================================================
      // SHOWING_RESUME - Visar modal med pågående onboardings
      // =========================================================================
      //
      // NÄR: pendingOnboardings.length > 0 (från CHECKING_PENDING)
      // 
      // VAD HÄNDER HÄR:
      //   - pendingOnboardings är REDAN hämtat (i CHECKING_PENDING)
      //   - Modal renderas via JSX (conditional rendering nedan)
      //   - Modal tar emot data via props (slav-pattern)
      //   - Alla API-anrop görs via handlers här i AuthenticatedApp
      //
      // VÄNTAR PÅ CALLBACK FRÅN MODAL:
      //   - onResume(id, caseId, name) → handleResumeChoice() → RESUMING
      //   - onDelete(id, caseId) → handleDeleteOnboarding() → uppdaterar lista
      //   - onStartNew() → handleStartNew() → READY
      //
      // TIC-TAC-TOE PATTERN:
      //   Precis som i tic-tac-toe där Board tar emot squares via props
      //   och anropar onPlay callback uppåt - så tar OnboardingResumeDialog
      //   emot pendingOnboardings via props och anropar callbacks uppåt.
      //   
      //   STATE MACHINE HAR FULL KONTROLL:
      //   - Data hämtas centralt (CHECKING_PENDING)
      //   - Data lagras centralt (pendingOnboardings state)
      //   - API-anrop görs centralt (handleDeleteOnboarding)
      //   - State-övergångar sker centralt (setAppState)
      //
      case AppState.SHOWING_RESUME:
        // Ingen kod här - modalen renderas via JSX nedan
        // State machine väntar på att en callback triggas
        console.log('[SHOWING_RESUME] 🎭 State entered!');
        console.log('[SHOWING_RESUME] pendingOnboardings:', pendingOnboardings);
        console.log('[SHOWING_RESUME] pendingOnboardings.length:', pendingOnboardings?.length);
        break;
        
      // =========================================================================
      // RESUMING - Användaren valde att återuppta
      // =========================================================================
      //
      // NÄR: Användaren klickade "Fortsätt" i resume-modalen
      // VAD:
      //   1. Hämta metadata från server (formData, completedSlides, lastSlide)
      //   2. Spara till localStorage
      //   3. Uppdatera state
      //   4. Navigera till senaste slide
      // SEDAN: Gå till READY
      //
      case AppState.RESUMING: {
        setIsLoading(true);
        
        try {
          // Hämta all data från server
          console.log('[RESUMING] 📡 Fetching metadata for:', activeCase);
          const metadata = await api.fetchMetadata(
            activeCase.companyId, 
            activeCase.onboardingId
          );
          console.log('[RESUMING] ✅ Metadata received:', metadata);
          console.log('[RESUMING]   - version:', metadata.version);
          console.log('[RESUMING]   - lastModified:', metadata.lastModified);
          console.log('[RESUMING]   - modifiedBy:', metadata.modifiedBy);
          console.log('[RESUMING]   - pages:', Object.keys(metadata.pages || {}));
          
          // 🆕 NEW: Extract pages directly (no unwrapping needed!)
          const pagesData = metadata.pages || {};
          console.log('[RESUMING] 📦 Pages data:', pagesData);
          
          console.log('[RESUMING] 🧹 Clearing localStorage for THIS case only...');
          // Selektiv rensning: endast nycklar för detta specifika case
          const prefix = `onboarding::${activeCase.companyId}::${activeCase.onboardingId}::${user?.id}::`;
          Object.keys(localStorage).forEach(key => {
            if (key.startsWith(prefix)) {
              console.log(`[RESUMING]   🗑️ Removing: ${key}`);
              localStorage.removeItem(key);
            }
          });
          
          console.log('[RESUMING] 🔄 Setting isDraftMode=false (permanent case)');
          setIsDraftMode(false);
          storage.setIsDraftMode(false);
          
          // 🆕 NEW: Save each page SEPARATELY to PERMANENT localStorage keys
          console.log('[RESUMING] 💾 Saving pages to PERMANENT localStorage keys...');
          Object.entries(pagesData).forEach(([slideKey, slideData]) => {
            storage.setSlideData(slideKey, slideData);
            console.log(`[RESUMING]   ✓ Saved ${slideKey}:`, slideData);
          });
          
          // Save activeCase and completedSlides
          const permanentCompletedSlidesKey = StorageKeyBuilder.buildPermanentKey(
            activeCase.companyId,
            activeCase.onboardingId,
            user?.id,
            'completedSlides'
          );
          const permanentActiveCaseKey = StorageKeyBuilder.buildPermanentKey(
            activeCase.companyId,
            activeCase.onboardingId,
            user?.id,
            'activeCase'
          );
          
          localStorage.setItem(permanentCompletedSlidesKey, JSON.stringify(metadata.completedSlides || []));
          localStorage.setItem(permanentActiveCaseKey, JSON.stringify(activeCase));
          console.log('[RESUMING] ✅ Saved metadata to permanent keys');
          
          // 📌 SPARA SERVER VERSION för conflict detection
          const serverVersion = metadata.version || 0;
          const versionStorageKey = `case_${activeCase.companyId}_${activeCase.onboardingId}_version`;
          localStorage.setItem(versionStorageKey, JSON.stringify({
            version: serverVersion,
            timestamp: metadata.lastModified || new Date().toISOString(),
            syncedFromServer: true
          }));
          console.log('[RESUMING] 📌 Sparade server version:', serverVersion);
          
          // Uppdatera React state med rätt data
          console.log('[RESUMING] 🔄 Updating React state...');
          setFormData(pagesData);
          setCompletedSlides(metadata.completedSlides || []);
          console.log('[RESUMING] ✅ React state updated with pages data');
          
          // ─────────────────────────────────────────────────────────────────
          // 🔓 ROARING DATA - Lås upp företagsdata-slides om data finns
          // ─────────────────────────────────────────────────────────────────
          //
          // Om användaren har betalat för Roaring.io-data, finns minst en av
          // result-slides i pages. Kolla om någon av dessa finns:
          // - verksamhet
          // - agarstruktur
          // - styrelse
          // - ovriga-data
          //
          const resultSlides = ['verksamhet', 'agarstruktur', 'styrelse', 'ovriga-data'];
          const hasRoaringData = resultSlides.some(slideKey => pagesData[slideKey]);
          
          if (hasRoaringData) {
            console.log('[RESUMING] 🔓 Result slides found in pages - unlocking företagsdata slides');
            setRoaringData({ _unlocked: true });
          }
          
          // Navigera till där användaren var senast
          // Server returnerar current_slide (snake_case), inte lastSlide
          const lastSlide = metadata.current_slide || metadata.lastSlide || 'uppdragsval';
          console.log('[RESUMING] 🧭 Navigating to slide:', lastSlide);
          setCurrentSlideKey(lastSlide);
          
          const slide = SLIDE_ORDER.find(s => s.key === lastSlide);
          if (slide) {
            navigate(slide.path);
          }
          
          // Sätt tab session för denna flik
          // OBS: activeCase kan ha antingen caseId (från handleConfirmCompanySelection)
          // eller onboardingId (från handleResumeChoice) - hantera båda!
          const caseOrOnboardingId = activeCase.caseId || activeCase.onboardingId;
          const sessionId = storage.buildSessionId(
            activeCase.companyId,
            caseOrOnboardingId,
            user?.id
          );
          storage.setCurrentTabSession({
            sessionId,
            currentSlide: lastSlide,
          });
          
          // Logga för audit trail
          await api.log(`Användare ${user?.name} återupptog onboarding för ${activeCase.companyName}`);
          
        } catch (e) {
          setError(e.message);
          // OBS: Vi går ändå till READY, men visar felmeddelande
        }
        
        setIsLoading(false);
        setAppState(AppState.READY);
        break;
      }
      
      // =========================================================================
      // RESTORING_SESSION - Page reload under aktiv session
      // =========================================================================
      //
      // NÄR: Användaren refreshade sidan MITT I en pågående session
      // VAD:
      //   1. Läs currentTabSession (från sessionStorage) för sessionId och currentSlide
      //   2. Hydrate formData, completedSlides, activeCase från localStorage
      //   3. Om INTE draft-läge: Hämta även metadata från server (för synkronisering)
      //   4. Navigera till currentSlide
      // SEDAN: Gå direkt till READY (INGEN resume-modal!)
      //
      // SKILLNAD MOT RESUMING:
      // - RESUMING: Användaren klickade på resume-modal (ny login)
      // - RESTORING_SESSION: Page reload (samma session fortsätter i samma flik)
      //
      case AppState.RESTORING_SESSION: {
        setIsLoading(true);
        
        // ─────────────────────────────────────────────────────────────────
        // Steg 1: Läs currentTabSession för sessionInfo
        // ─────────────────────────────────────────────────────────────────
        const tabSession = storage.getCurrentTabSession();
        
        if (!tabSession || !tabSession.sessionId) {
          // Något gick fel - gå till CHECKING_PENDING som fallback
          console.warn('[RESTORE] No tab session found - falling back to CHECKING_PENDING');
          setIsLoading(false);
          setAppState(AppState.CHECKING_PENDING);
          break;
        }
        
        console.log('[RESTORE] Restoring tab session:', tabSession);
        
        // ─────────────────────────────────────────────────────────────────
        // Steg 2: Hydrate från localStorage
        // ─────────────────────────────────────────────────────────────────
        const savedFormData = storage.getFormData();
        const savedCompletedSlides = storage.getCompletedSlides();
        const savedActiveCase = storage.getActiveCase();
        
        setFormData(savedFormData);
        setCompletedSlides(savedCompletedSlides);
        if (savedActiveCase) {
          setActiveCase(savedActiveCase);
        }
        
        console.log('[RESTORE] Hydrated from localStorage:', {
          formDataKeys: Object.keys(savedFormData),
          completedSlides: savedCompletedSlides,
          activeCase: savedActiveCase,
        });
        
        // ─────────────────────────────────────────────────────────────────
        // Steg 2.5: Validera inkonsistent state (isDraftMode=false men inget activeCase)
        // ─────────────────────────────────────────────────────────────────
        //
        // Om is_draft_mode=false men det inte finns något activeCase,
        // då är localStorage inkonsistent (t.ex. backend-företaget raderat).
        // Återställ då till draft mode.
        //
        if (!isDraftMode && !savedActiveCase) {
          console.warn('[RESTORE] ⚠️ Inconsistent state: isDraftMode=false but no activeCase - resetting to draft mode');
          setIsDraftMode(true);
          storage.setIsDraftMode(true);
          
          // Rensa alla onboarding-nycklar från localStorage
          const keysToRemove = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.includes('onboarding')) {
              keysToRemove.push(key);
            }
          }
          keysToRemove.forEach(key => localStorage.removeItem(key));
          
          // Rensa sessionStorage
          storage.clearCurrentTabSession();
          
          // Återställ state
          setActiveCase(null);
          setFormData({});
          setCompletedSlides([]);
          
          console.log('[RESTORE] ✅ Reset to draft mode - redirecting to CHECKING_PENDING');
          setIsLoading(false);
          setAppState(AppState.CHECKING_PENDING);
          break;
        }
        
        // ─────────────────────────────────────────────────────────────────
        // Steg 3: Om permanent läge - synka med server
        // ─────────────────────────────────────────────────────────────────
        //
        // Om vi har ett riktigt case (isDraftMode=false), hämta metadata
        // från servern för att säkerställa att vi är synkade.
        //
        if (!isDraftMode && savedActiveCase?.companyId) {
          try {
            console.log('[RESTORE] Fetching metadata from server for sync...');
            const metadata = await api.fetchMetadata(
              savedActiveCase.companyId,
              savedActiveCase.caseId || savedActiveCase.onboardingId
            );
            
            // Synka completedSlides från server (servern har auktoritet)
            if (metadata.completedSlides) {
              setCompletedSlides(metadata.completedSlides);
              storage.setCompletedSlides(metadata.completedSlides);
            }
            
            // 📌 SPARA SERVER VERSION för conflict detection
            const serverVersion = metadata?.metadata?.version || metadata?.version || 0;
            const caseId = savedActiveCase.caseId || savedActiveCase.onboardingId;
            const versionStorageKey = `case_${savedActiveCase.companyId}_${caseId}_version`;
            localStorage.setItem(versionStorageKey, JSON.stringify({
              version: serverVersion,
              timestamp: new Date().toISOString(),
              syncedFromServer: true
            }));
            console.log('[RESTORE] 📌 Sparade server version:', serverVersion);
            
            // 🔓 Synka roaring_data för att låsa upp företagsdata-slides
            if (metadata.roaring_data) {
              console.log('[RESTORE] 🔓 Roaring data found - unlocking företagsdata slides');
              setRoaringData(metadata.roaring_data);
            } else if (metadata.has_roaring_data) {
              console.log('[RESTORE] 🔓 has_roaring_data=true - unlocking företagsdata slides');
              setRoaringData({ _unlocked: true });
            }
            
            console.log('[RESTORE] Synced with server metadata');
          } catch (e) {
            // Om backend returnerar 404 = företaget finns inte längre
            // Då måste vi rensa localStorage och börja om från början
            console.error('[RESTORE] ❌ Failed to sync with server:', e);
            console.log('[RESTORE] Error status:', e.status);
            
            if (e.status === 404 || e.message?.includes('404') || e.message?.includes('not found') || e.message?.includes('Not Found')) {
              console.warn('[RESTORE] 🗑️ Company/case not found on server (404) - clearing localStorage and resetting state');
              
              // STEG 1: Sätt isDraftMode=true OMEDELBART
              setIsDraftMode(true);
              localStorage.setItem('is_draft_mode', 'true');
              
              // STEG 2: Rensa all localStorage-data relaterad till onboarding
              const keysToRemove = [];
              for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.includes('onboarding')) {
                  keysToRemove.push(key);
                }
              }
              keysToRemove.forEach(key => localStorage.removeItem(key));
              
              // STEG 3: Rensa även sessionStorage (tab session)
              storage.clearCurrentTabSession();
              
              // STEG 4: Återställ state
              setActiveCase(null);
              setFormData({});
              setCompletedSlides([]);
              
              console.log('[RESTORE] 🔄 State reset complete, going to CHECKING_PENDING');
              
              // STEG 5: Gå till CHECKING_PENDING för fresh start
              setIsLoading(false);
              setAppState(AppState.CHECKING_PENDING);
              break;
            }
            
            // För andra fel, fortsätt med localStorage-data
            console.warn('[RESTORE] Using localStorage data despite server sync failure');
          }
        }
        
        // ─────────────────────────────────────────────────────────────────
        // Steg 4: Navigera till där användaren var
        // ─────────────────────────────────────────────────────────────────
        const targetSlide = tabSession.currentSlide || 'uppdragsval';
        setCurrentSlideKey(targetSlide);
        
        const slide = SLIDE_ORDER.find(s => s.key === targetSlide);
        if (slide) {
          navigate(slide.path);
          console.log(`[RESTORE] Navigated to: ${slide.path}`);
        }
        
        // Logga för audit trail
        await api.logPersonal('Session restored after page reload', {
          sessionId: tabSession.sessionId,
          currentSlide: targetSlide,
          isDraftMode,
        });
        
        setIsLoading(false);
        setAppState(AppState.READY);
        break;
      }
        
      // =========================================================================
      // READY - Normal drift
      // =========================================================================
      //
      // NÄR: Allt är laddat och klart
      // VAD: Väntar på användarinteraktion (formulär, navigation)
      //
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
        
        // Switch baserat på nuvarande slide
        switch (currentSlideKey) {
          
          // ───────────────────────────────────────────────────────────────
          // UPPDRAGSVAL - Special case, hanteras av wrapper
          // ───────────────────────────────────────────────────────────────
          case 'uppdragsval':
            console.log('[PROCESSING_NEXT] uppdragsval - handled by UppdragsvalsSlide wrapper');
            setAppState(AppState.READY);
            break;
          
          // ───────────────────────────────────────────────────────────────
          // RISKFRÅGOR (steg 1) - Payment check
          // ───────────────────────────────────────────────────────────────
          case 'riskfragor':
            if (!hasAgreement && !isDraftMode) {
              // VIKTIGT: Spara först till servern INNAN vi visar betalningsmodalen!
              // Annars försvinner datan när användaren återvänder från Stripe.
              console.log('[PROCESSING_NEXT] riskfragor: No agreement - saving before showing modal');
              
              try {
                setIsLoading(true);
                setSyncStatus('saving');
                
                // Spara till server - använd generiska endpoint (samma som alla andra slides)
                const companyId = activeCase?.companyId;
                const caseId = activeCase?.caseId;
                const slideData = formData[currentSlideKey] || {};
                
                if (companyId && caseId) {
                  // Generiskt endpoint: POST /onboarding/{company_id}/{slide_key}
                  const response = await api.post(
                    `/onboarding/${companyId}/${currentSlideKey}`,
                    {
                      data: slideData,
                      onboarding_id: caseId,
                      // expected_version: currentVersion  // TODO: Hämta från localStorage
                    }
                  );
                  
                  if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    
                    // FastAPI validation errors returnerar detail som array av objekt
                    let errorMsg = 'Kunde inte spara till servern';
                    if (errorData.detail) {
                      if (Array.isArray(errorData.detail)) {
                        // Pydantic validation errors: [{loc: [...], msg: "...", type: "..."}]
                        errorMsg = errorData.detail.map(err => err.msg || JSON.stringify(err)).join(', ');
                      } else if (typeof errorData.detail === 'string') {
                        errorMsg = errorData.detail;
                      } else {
                        errorMsg = JSON.stringify(errorData.detail);
                      }
                    }
                    
                    console.error('[PROCESSING_NEXT] riskfragor: Server error:', errorData);
                    throw new Error(errorMsg);
                  }
                  
                  const result = await response.json();
                  console.log('[PROCESSING_NEXT] riskfragor: ✅ Saved to server, version:', result.version);
                  
                  // Uppdatera lokal version
                  const versionKey = `case_${companyId}_${caseId}_version`;
                  localStorage.setItem(versionKey, JSON.stringify({
                    version: result.version,
                    timestamp: new Date().toISOString(),
                    lastSlide: currentSlideKey,
                  }));
                  
                  setSyncStatus('saved');
                } else {
                  console.warn('[PROCESSING_NEXT] riskfragor: No companyId/caseId, skipping server save');
                }
                
                setIsLoading(false);
                
                // Nu är det säkert att visa betalningsmodalen
                console.log('[PROCESSING_NEXT] riskfragor: Showing payment modal');
                setShowAgreementModal(true);
                setAppState(AppState.READY); // Stay in READY - modal handles Stripe redirect
                
              } catch (err) {
                console.error('[PROCESSING_NEXT] riskfragor: ❌ Save error:', err);
                setError(err.message);
                setIsLoading(false);
                setSyncStatus('idle');
                setAppState(AppState.ERROR);
              }
            } else {
              // Har redan betalat eller är i draft mode
              console.log('[PROCESSING_NEXT] riskfragor: Has agreement or draft - save and navigate');
              await saveSlideAndNavigate(currentSlideKey, currentIndex);
            }
            break;
          
          // ───────────────────────────────────────────────────────────────
          // ALLA ANDRA SLIDES - Standard save & navigate
          // ───────────────────────────────────────────────────────────────
          default:
            console.log(`[PROCESSING_NEXT] ${currentSlideKey}: Standard save and navigate`);
            await saveSlideAndNavigate(currentSlideKey, currentIndex);
            break;
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
      // INITIATING_PAYMENT - Skapar Stripe session och redirectar
      // =========================================================================
      //
      // NÄR: Användaren klickade "Engångsavtal" i AgreementModal
      // VAD: 
      //   1. Anropa POST /subscription för att skapa Stripe session
      //   2. Spara pending_payment till localStorage (backup)
      //   3. Backend uppdaterar metadata.pending_payment automatiskt
      //   4. Redirect till Stripe checkout
      // SEDAN: Användaren kommer tillbaka via backend callback till /payment-success
      //
      case AppState.INITIATING_PAYMENT: {
        console.log('[INITIATING_PAYMENT] 💳 Creating Stripe session...');
        setIsLoading(true);
        
        // 📝 Logga till server (överlever page reload)
        await api.logPersonal('Initierar betalning', {
          companyId: activeCase?.companyId,
          caseId: activeCase?.caseId,
          slideKey: 'riskfragor',
          timestamp: new Date().toISOString()
        });
        
        try {
          const companyId = activeCase?.companyId;
          const caseId = activeCase?.caseId;
          const personnummer = formData['riskfragor']?.personnummer || '';
          
          if (!companyId || !caseId) {
            throw new Error('Saknar company_id eller case_id. Gå tillbaka till Uppdragsval.');
          }
          
          console.log('[INITIATING_PAYMENT] Calling POST /subscription...');
          const response = await api.post(
            `/onboarding/${companyId}/subscription?onboarding_id=${caseId}`,
            {
              type: 'trial',
              personnummer: personnummer
            }
          );
          
          if (!response.ok) {
            const errorData = await response.json();
            
            // Kolla om trial-limit är nådd (402)
            if (response.status === 402) {
              throw new Error(errorData.detail?.message || 'Du har använt alla gratistester. Uppgradera till Enterprise.');
            }
            throw new Error(errorData.detail || 'Kunde inte initiera betalning');
          }
          
          const data = await response.json();
          console.log('[INITIATING_PAYMENT] ✅ Stripe session created:', data);
          
          if (!data.payment_url) {
            throw new Error('Ingen betalnings-URL returnerades från servern');
          }
          
          // 📌 Spara till localStorage som backup (om användaren kommer tillbaka)
          localStorage.setItem('pending_payment', JSON.stringify({
            companyId,
            caseId,
            slideKey: 'riskfragor',
            initiatedAt: new Date().toISOString()
          }));
          console.log('[INITIATING_PAYMENT] 💾 Saved pending_payment to localStorage');
          
          // Backend uppdaterar metadata.pending_payment automatiskt när session skapas
          // Ingen extra API-anrop behövs här!
          
          console.log('[INITIATING_PAYMENT] 🔄 Redirecting to Stripe checkout...');
          
          // 📝 Logga innan redirect (sista chansen!)
          await api.logPersonal('Redirectar till Stripe', {
            paymentUrl: data.payment_url,
            companyId,
            caseId,
            timestamp: new Date().toISOString()
          });
          
          // Redirect till Stripe checkout
          window.location.href = data.payment_url;
          
        } catch (err) {
          console.error('[INITIATING_PAYMENT] ❌ Error:', err);
          setError(err.message);
          setIsLoading(false);
          setAppState(AppState.ERROR);
        }
        
        // OBS: Vi kommer inte hit om redirect lyckas (sidan lämnas)
        // Men om något går fel innan redirect, går vi till ERROR state
        break;
      }
      
      // =========================================================================
      // VERIFYING_PAYMENT - Verifierar betalning efter Stripe redirect
      // =========================================================================
      //
      // NÄR: Användaren redirectas från Stripe till /payment-success?session_id=xxx
      // VAD: Anropa /subscription/status endpoint för att verifiera betalning
      // SEDAN: Sätt paymentVerificationStatus till 'success' eller 'error'
      //        PaymentSuccessSlide renderar baserat på denna status
      //
      case AppState.VERIFYING_PAYMENT: {
        console.log('[VERIFYING_PAYMENT] 💳 Verifying payment...');
        
        // 📝 Logga till server (vi är tillbaka från Stripe!)
        const urlParams = new URLSearchParams(window.location.search);
        await api.logPersonal('Tillbaka från Stripe - verifierar betalning', {
          pathname: window.location.pathname,
          sessionId: urlParams.get('session_id'),
          hasPaymentParam: urlParams.get('payment'),
          companyId: activeCase?.companyId,
          caseId: activeCase?.caseId,
          timestamp: new Date().toISOString()
        });
        
        try {
          // Hämta session_id från URL
          const params = new URLSearchParams(window.location.search);
          const sessionId = params.get('session_id');
          
          if (!sessionId) {
            throw new Error('Ingen session ID i URL');
          }
          
          if (!activeCase?.companyId || !activeCase?.caseId) {
            throw new Error('Saknar företagsinformation');
          }
          
          console.log('[VERIFYING_PAYMENT]   Session ID:', sessionId);
          console.log('[VERIFYING_PAYMENT]   Company ID:', activeCase.companyId);
          console.log('[VERIFYING_PAYMENT]   Case ID:', activeCase.caseId);
          
          // Anropa backend endpoint
          const response = await api.fetch(
            `/onboarding/${activeCase.companyId}/subscription/status?onboarding_id=${activeCase.caseId}&session_id=${sessionId}`
          );
          
          if (!response.ok) {
            throw new Error('Kunde inte bekräfta betalning');
          }
          
          const data = await response.json();
          
          if (!data.success || data.subscription?.status !== 'active') {
            throw new Error('Betalning ej genomförd');
          }
          
          console.log('[VERIFYING_PAYMENT] ✅ Payment verified successfully!');
          
          // 📝 Logga lyckad betalning
          await api.logPersonal('Betalning verifierad - SUCCESS!', {
            sessionId,
            companyId: activeCase.companyId,
            caseId: activeCase.caseId,
            subscriptionStatus: data.subscription?.status,
            timestamp: new Date().toISOString()
          });
          
          // Uppdatera status så PaymentSuccessSlide visar success
          setPaymentVerificationStatus('success');
          setPaymentVerificationMessage('');
          
          // 📌 VIKTIGT: Rensa pending_payment från localStorage
          localStorage.removeItem('pending_payment');
          
          // 📌 VIKTIGT: Uppdatera server metadata - ta bort pending_payment flag
          try {
            await api.post(
              `/onboarding/${activeCase.companyId}/save?onboarding_id=${activeCase.caseId}`,
              {
                pending_payment: false,
                payment_completed_at: new Date().toISOString()
              }
            );
            console.log('[VERIFYING_PAYMENT] ✅ Cleared pending_payment from server metadata');
          } catch (metadataErr) {
            console.warn('[VERIFYING_PAYMENT] ⚠️ Could not clear pending_payment from server:', metadataErr);
            // Fortsätt ändå - betalningen är bekräftad
          }
          
        } catch (err) {
          console.error('[VERIFYING_PAYMENT] ❌ Error:', err);
          
          // 📝 Logga fel vid verifiering
          await api.logPersonal('Betalningsverifiering MISSLYCKADES', {
            error: err.message,
            companyId: activeCase?.companyId,
            caseId: activeCase?.caseId,
            timestamp: new Date().toISOString()
          });
          
          // Uppdatera status så PaymentSuccessSlide visar error
          setPaymentVerificationStatus('error');
          setPaymentVerificationMessage(err.message);
        }
        
        // Gå till READY (PaymentSuccessSlide tar över UI)
        setAppState(AppState.READY);
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
        
      default:
        console.error(`[STATE MACHINE] ⚠️ Unknown state: ${appState}`);
    }
    console.log(`[STATE MACHINE] 🏁 Finished processing state: ${appState}`);
  }, [appState, user, activeCase, navigate]);

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
  // VIKTIGT: Konfliktdetektering sker endast vid SAVE (checkVersionConflict).
  // Need-to-know: Användaren informeras ENDAST om ändringar som påverkar DENNA slide.
  //
  // Exempel:
  // - Användare A har version 5 lokalt
  // - Användare B uppdaterar riskfragor → server version 6
  // - A navigerar till verksamhet:
  //   * Server verksamhet-data === localStorage verksamhet-data
  //   * → INGEN MODAL (same content, need-to-know: A behöver inte veta om riskfragor)
  // - A navigerar till riskfragor:
  //   * Server riskfragor-data ≠ localStorage riskfragor-data
  //   * OCH modified_by = "user_b@example.com" ≠ A
  //   * → MODAL VISAS (different content AND different user)
  // - A klickar "Nästa" på verksamhet:
  //   * POST med expected_version: 5, server har version: 6
  //   * → 409 Conflict → MODAL VISAS (save-time conflict)
  //
  useEffect(() => {
    // Skippa under initialisering/resuming (appState hanterar laddning då)
    // Men tillåt under READY, PROCESSING_NEXT, PROCESSING_BACK (normal drift)
    const isNormalOperation = [
      AppState.READY,
      AppState.PROCESSING_NEXT,
      AppState.PROCESSING_BACK
    ].includes(appState);
    
    if (!isNormalOperation) return;
    
    // Skippa om ingen slide är vald
    if (!currentSlideKey) return;
    
    // Skippa om vi är i draft mode (ingen server-data ännu)
    if (isDraftMode) {
      console.log(`[SLIDE-LOAD] 📝 Draft mode - using localStorage only`);
      const localData = storage.getSlideData(currentSlideKey);
      if (localData && Object.keys(localData).length > 0) {
        setFormData(prev => {
          // Checka om redan satt för att undvika loop
          if (prev[currentSlideKey] && Object.keys(prev[currentSlideKey]).length > 0) {
            return prev; // Data redan där, gör inget
          }
          return { ...prev, [currentSlideKey]: localData };
        });
      }
      return;
    }
    
    // ASYNC per-slide konfliktdetektering
    const loadSlideData = async () => {
      console.log(`[SLIDE-LOAD] 🔄 Loading '${currentSlideKey}' (need-to-know check)...`);
      
      if (!activeCase?.companyId || !activeCase?.caseId) {
        console.log(`[SLIDE-LOAD] ⚠️ No active case, skipping`);
        return;
      }
      
      // ─────────────────────────────────────────────────────────────────
      // Steg 1: Hämta localStorage data för DENNA slide
      // ─────────────────────────────────────────────────────────────────
      const localSlideData = storage.getSlideData(currentSlideKey);
      const hasLocalData = localSlideData && Object.keys(localSlideData).length > 0;
      
      console.log(`[SLIDE-LOAD] localStorage['${currentSlideKey}']: ${hasLocalData ? '✅ HAS DATA' : '❌ NO DATA'}`);
      
      // ─────────────────────────────────────────────────────────────────
      // Steg 2: Hämta server data för DENNA slide
      // ─────────────────────────────────────────────────────────────────
      let serverMeta = null;
      let serverSlideData = null;
      let serverGlobalVersion = 0;
      
      try {
        console.log(`[SLIDE-LOAD] 🌐 Fetching metadata from server...`);
        serverMeta = await api.fetchMetadata(activeCase.companyId, activeCase.caseId);
        serverSlideData = serverMeta?.metadata?.pages?.[currentSlideKey];
        serverGlobalVersion = serverMeta?.metadata?.version || 0;
        
        const hasServerData = serverSlideData && Object.keys(serverSlideData).length > 0;
        console.log(`[SLIDE-LOAD] Server['${currentSlideKey}']: ${hasServerData ? '✅ HAS DATA' : '❌ NO DATA'} (global version: ${serverGlobalVersion})`);
      } catch (err) {
        console.warn(`[SLIDE-LOAD] ⚠️ Failed to fetch from server:`, err.message);
        // Om server fetch misslyckas, använd localStorage
        if (hasLocalData) {
          setFormData(prev => ({ ...prev, [currentSlideKey]: localSlideData }));
          console.log(`[SLIDE-LOAD] 🏁 Using localStorage (server unavailable)`);
        }
        return;
      }
      
      // ─────────────────────────────────────────────────────────────────
      // Steg 3: Hantera olika datakällor
      // ─────────────────────────────────────────────────────────────────
      const hasServerData = serverSlideData && Object.keys(serverSlideData).length > 0;
      
      if (!hasServerData && !hasLocalData) {
        // Ingen data finns - init tom
        console.log(`[SLIDE-LOAD] 📝 Initializing empty slide`);
        setFormData(prev => ({ ...prev, [currentSlideKey]: {} }));
        return;
      }
      
      if (!hasServerData && hasLocalData) {
        // Bara localStorage har data - använd den
        console.log(`[SLIDE-LOAD] ✅ Using localStorage (only source)`);
        setFormData(prev => ({ ...prev, [currentSlideKey]: localSlideData }));
        return;
      }
      
      if (hasServerData && !hasLocalData) {
        // Bara server har data - använd den
        console.log(`[SLIDE-LOAD] ✅ Using server (only source)`);
        setFormData(prev => ({ ...prev, [currentSlideKey]: serverSlideData }));
        return;
      }
      
      // ─────────────────────────────────────────────────────────────────
      // Båda källor har data - jämför INNEHÅLL (need-to-know!)
      // ─────────────────────────────────────────────────────────────────
      const localStr = JSON.stringify(localSlideData);
      const serverStr = JSON.stringify(serverSlideData);
      
      if (localStr === serverStr) {
        // ✅ SAMMA INNEHÅLL - ladda tyst (spelar ingen roll om global version skiljer)
        console.log(`[SLIDE-LOAD] ✅ Same content - using SERVER (no conflict, need-to-know: not affected)`);
        setFormData(prev => ({ ...prev, [currentSlideKey]: serverSlideData }));
        return;
      }
      
      // ⚠️ OLIKA INNEHÅLL - kolla vem som ändrade
      console.log(`[SLIDE-LOAD] ⚠️ Different content detected - checking who modified...`);
      
      // Vi behöver veta VEM som senast uppdaterade DENNA slide
      // Detta kräver per-slide metadata som backend inte har ännu
      // WORKAROUND: Använd global modified_by (förutsätter att senaste ändringen på ärende = senaste ändring på slide)
      const serverModifiedBy = serverMeta?.metadata?.updated_by || serverMeta?.updated_by;
      const currentUserEmail = user?.email;
      
      console.log(`[SLIDE-LOAD]   Server modified by: ${serverModifiedBy}`);
      console.log(`[SLIDE-LOAD]   Current user: ${currentUserEmail}`);
      
      const isDifferentUser = serverModifiedBy && 
                             currentUserEmail && 
                             serverModifiedBy !== currentUserEmail;
      
      if (isDifferentUser) {
        // ⚠️ KONFLIKT! Annan användare har ändrat DENNA slide
        console.log(`[SLIDE-LOAD] 🛑 CONFLICT! User '${serverModifiedBy}' modified this slide`);
        
        // Spara konflikt-info för modal
        setConflictInfo({
          slide_key: currentSlideKey,
          your_version: 0, // Vi har inget per-slide version ännu
          server_version: serverGlobalVersion,
          server_last_modified: serverMeta?.metadata?.lastModified,
          modified_by: serverModifiedBy,
          conflicting_slides: [{
            slide_id: currentSlideKey,
            modified_by: serverModifiedBy,
            modified_at: serverMeta?.metadata?.lastModified
          }],
          message: `Användare '${serverModifiedBy}' har uppdaterat sidan '${currentSlideKey}'.`,
          local_data: localSlideData,
          server_data: serverSlideData
        });
        setShowConflictModal(true);
        
        // Ladda INTE data - vänta på användarens val
        console.log(`[SLIDE-LOAD] 🛑 Blocking load - waiting for user decision`);
        return;
      } else {
        // ═══════════════════════════════════════════════════════════════
        // Samma användare - men kolla VILKEN data som är nyast!
        // ═══════════════════════════════════════════════════════════════
        // 
        // MULTI-TAB/MULTI-BROWSER SCENARIO:
        // User kan ha 2 flikar öppna:
        //   Tab A: Laddade data kl 10:00 (version 5)
        //   Tab B: Jobbade vidare till kl 10:30 (version 12)
        //   Tab A: Återvänder kl 10:31 (har fortfarande version 5 i localStorage)
        // 
        // Regel: Använd NYASTE data (högsta version)
        // 
        console.log(`[SLIDE-LOAD] ⚙️ Same user, different content - checking versions...`);
        
        // Hämta local version från localStorage
        const storageKey = `case_${activeCase.companyId}_${activeCase.caseId}_version`;
        const localVersionStr = localStorage.getItem(storageKey);
        const localVersionObj = localVersionStr ? JSON.parse(localVersionStr) : { version: 0 };
        const localVersion = localVersionObj.version || 0;
        
        console.log(`[SLIDE-LOAD]   Local version: ${localVersion}`);
        console.log(`[SLIDE-LOAD]   Server version: ${serverGlobalVersion}`);
        
        if (serverGlobalVersion > localVersion) {
          // Server har nyare data - använd den (även om det är samma user!)
          // Detta händer när user jobbar i annan flik/browser
          console.log(`[SLIDE-LOAD] ✅ Server is NEWER (v${serverGlobalVersion} > v${localVersion}) - using SERVER (multi-tab sync)`);
          setFormData(prev => ({ ...prev, [currentSlideKey]: serverSlideData }));
          
          // 🔄 Uppdatera även localStorage så vi är synkad
          storage.setSlideData(currentSlideKey, serverSlideData);
          
          // 🔄 Uppdatera local version till server version
          localStorage.setItem(storageKey, JSON.stringify({
            version: serverGlobalVersion,
            timestamp: new Date().toISOString()
          }));
          
          console.log(`[SLIDE-LOAD] 🔄 Synced localStorage with server data (v${serverGlobalVersion})`);
          return;
        } else {
          // localStorage har lika eller nyare data - använd den (osparade ändringar)
          console.log(`[SLIDE-LOAD] ✅ Local is CURRENT (v${localVersion} >= v${serverGlobalVersion}) - using LOCALSTORAGE (unsaved changes)`);
          setFormData(prev => ({ ...prev, [currentSlideKey]: localSlideData }));
          return;
        }
      }
    };
    
    loadSlideData();
  }, [currentSlideKey]); // Kör bara när användaren navigerar till ny slide

  // ===========================================================================
  // PAYMENT VERIFICATION - Trigger när URL är /payment-success
  // ===========================================================================
  // PAYMENT VERIFICATION - Trigger när URL är /payment-success
  // ===========================================================================
  //
  // När användaren redirectas från Stripe till /payment-success?session_id=xxx
  // → Sätt state till VERIFYING_PAYMENT
  // → State machine anropar /subscription/status endpoint
  //
  // DEFENSIV: Hanterar både:
  //   1. /payment-success?session_id=xxx (primärt format)
  //   2. ?payment=success (legacy format, om backend inte uppdaterat än)
  //
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hasSessionId = params.get('session_id');
    const hasPaymentSuccess = params.get('payment') === 'success';
    
    // Kolla om vi är på payment-success sidan ELLER har payment=success parameter
    const isPaymentCallback = window.location.pathname.includes('/payment-success') || hasPaymentSuccess;
    
    if (isPaymentCallback && appState === AppState.READY) {
      console.log('[PAYMENT-CALLBACK] 🔔 Detected payment callback!');
      console.log('[PAYMENT-CALLBACK]   pathname:', window.location.pathname);
      console.log('[PAYMENT-CALLBACK]   hasSessionId:', hasSessionId);
      console.log('[PAYMENT-CALLBACK]   hasPaymentSuccess:', hasPaymentSuccess);
      
      // 📝 Logga till server (viktigt för debugging efter page reload!)
      api.logPersonal('Payment callback detekterad i useEffect', {
        pathname: window.location.pathname,
        hasSessionId: !!hasSessionId,
        hasPaymentSuccess: hasPaymentSuccess,
        appState: appState,
        timestamp: new Date().toISOString()
      }).catch(err => console.error('[PAYMENT-CALLBACK] Failed to log:', err));
      
      setAppState(AppState.VERIFYING_PAYMENT);
    }
  }, [window.location.pathname, window.location.search, appState, api]);

  // ===========================================================================
  // PAYMENT CALLBACK HANTERAS I PaymentSuccessSlide VIA CALLBACK
  // ===========================================================================
  //
  // State machine (VERIFYING_PAYMENT) anropar /subscription/status
  // PaymentSuccessSlide visar UI baserat på paymentVerificationStatus
  // Användaren klickar "OK" → onPaymentConfirmed() callback
  //
  // Backend redirectar till:
  //   Success: /payment-success?session_id=cs_xxx
  //

  // ===========================================================================
  // 🎮 HANDLERS - Factory-anrop till props/ (se respektive fil för detaljer)
  // ===========================================================================
  
  // handleResumeChoice - Återuppta pågående onboarding (se props/handleResumeChoice.js)
  const handleResumeChoice = createHandleResumeChoice({
    setActiveCase,
    setAppState,
    AppState
  });
  
  // handleStartNew - Börja ny onboarding (se props/handleStartNew.js)
  const handleStartNew = createHandleStartNew({
    storage,
    setFormData,
    setActiveCase,
    setCompletedSlides,
    tempCaseId,
    user,
    setCurrentSlideKey,
    navigate,
    setAppState,
    AppState
  });
  
  // handleDeleteOnboarding - Radera pågående onboarding (se props/handleDeleteOnboarding.js)
  const handleDeleteOnboarding = createHandleDeleteOnboarding({
    api,
    pendingOnboardings,
    setPendingOnboardings,
    handleStartNew
  });
  
  // handleRetryPending - Försök hämta pending igen (se props/handleRetryPending.js)
  const handleRetryPending = createHandleRetryPending({
    setError,
    setAppState,
    AppState
  });
  
  // ─────────────────────────────────────────────────────────────────────────
  // checkVersionConflict - Kolla om server har nyare version
  // ─────────────────────────────────────────────────────────────────────────
  //
  // VIKTIGT: Måste definieras FÖRE handleNext som beror på den!
  //
  // ANROPAS FRÅN: handleSidebarClick, handleNext (vid slide-navigation)
  // RETURNERAR: true om konflikt finns (visa modal), false om OK att fortsätta
  //
  // STRATEGI:
  //   1. Hämta metadata.version från server
  //   2. Jämför med localStorage localVersion
  //   3. Om server > local → setShowConflictModal(true)
  //   4. Returnera true (blockera navigation)
  //
  const checkVersionConflict = async () => {
    // Skippa check om vi inte har ett aktivt ärende
    if (!activeCase?.companyId || !activeCase?.caseId) {
      console.log('[VERSION-CHECK] Ingen aktiv case, skippar conflict check');
      return false;
    }
    
    // Skippa check om vi är i draft-mode (ingen server-data ännu)
    if (isDraftMode) {
      console.log('[VERSION-CHECK] Draft mode, skippar conflict check');
      return false;
    }
    
    try {
      console.log('[VERSION-CHECK] Kontrollerar server-version...');
      
      // 1. Hämta server metadata
      const serverMeta = await api.fetchMetadata(activeCase.companyId, activeCase.caseId);
      const serverVersion = serverMeta?.metadata?.version || serverMeta?.version || 0;
      const serverLastModified = serverMeta?.metadata?.lastModified || serverMeta?.metadata?.last_modified || serverMeta?.lastModified;
      const serverModifiedBy = serverMeta?.metadata?.updated_by || serverMeta?.updated_by || 'Annan användare';
      
      // 2. Hämta local version från localStorage
      // Format: { version: N, timestamp: ISO-string }
      const storageKey = `case_${activeCase.companyId}_${activeCase.caseId}_version`;
      const localVersionStr = localStorage.getItem(storageKey);
      const localVersionObj = localVersionStr ? JSON.parse(localVersionStr) : { version: 0 };
      const localVersion = localVersionObj.version || 0;
      
      console.log('[VERSION-CHECK] Server version:', serverVersion, 'Local version:', localVersion);
      console.log('[VERSION-CHECK] Server lastModified:', serverLastModified, 'by:', serverModifiedBy);
      
      // 3. Jämför version integers (Git-liknande!)
      // Server > Local = någon annan har sparat efter att vi laddade
      if (serverVersion > localVersion) {
        console.log('[VERSION-CHECK] ⚠️ KONFLIKT! Server version', serverVersion, '> Local version', localVersion);
        
        // Hämta conflicting_slides info (vilka slides ändrades)
        const services = serverMeta?.metadata?.services || serverMeta?.services || {};
        const conflictingSlides = Object.entries(services)
          .filter(([_, data]) => data?.modified_at)
          .map(([slideId, data]) => ({
            slide_id: slideId,
            modified_by: data.modified_by || 'unknown',
            modified_at: data.modified_at
          }));
        
        // Spara konflikt-info för modal
        setConflictInfo({
          your_version: localVersion,
          server_version: serverVersion,
          server_last_modified: serverLastModified,
          modified_by: serverModifiedBy,
          conflicting_slides: conflictingSlides,
          message: `Servern har version ${serverVersion}, du har version ${localVersion}. Ändrad av ${serverModifiedBy}.`
        });
        setShowConflictModal(true);
        
        return true; // Konflikt hittad - blockera navigation
      }
      
      console.log('[VERSION-CHECK] ✅ Ingen konflikt (server:', serverVersion, 'local:', localVersion, ')');
      return false;
      
    } catch (err) {
      console.error('[VERSION-CHECK] ❌ Fel vid version-check:', err);
      // Vid nätverksfel, fortsätt utan att blockera
      return false;
    }
  };
  
  // ===========================================================================
  // handleNext - Enkel event dispatcher till state machine
  // ===========================================================================
  //
  // TIDIGARE: handleNext gjorde allt (validering, server-push, navigation)
  // NU: Bara rapporterar "användaren klickade Nästa" till state-maskinen
  //
  const handleNext = () => {
    console.log(`[HANDLE_NEXT] User clicked Next on slide: ${currentSlideKey}`);
    setAppState(AppState.PROCESSING_NEXT);
  };
  
  // ===========================================================================
  // handleBack - Enkel event dispatcher till state machine
  // ===========================================================================
  const handleBack = () => {
    console.log(`[HANDLE_BACK] User clicked Back on slide: ${currentSlideKey}`);
    setAppState(AppState.PROCESSING_BACK);
  };
  
  // 🎯 handleConfirmCompanySelection - POINT OF NO RETURN (se props/handleConfirmCompanySelection.js)
  const handleConfirmCompanySelection = createHandleConfirmCompanySelection({
    tempCaseId,
    formData,
    api,
    storage,
    user,
    setIsLoading,
    setError,
    setIsDraftMode,
    setActiveCase,
    SLIDE_ORDER,
  });
  
  // 🚪 handleLogout - Normal utloggning (se props/handleLogout.js)
  const handleLogout = createHandleLogout({
    api,
    user,
    isDraftMode,
    tempCaseId,
    activeCase,
    storage,
    navigate
  });
  
  // 🗑️ handleLogoutAndReset - Avsluta & rensa (rensar ALLT, se props/handleLogoutAndReset.js)
  const handleLogoutAndReset = createHandleLogoutAndReset({
    api,
    user,
    tempCaseId,
    isDraftMode,
    activeCase,
    storage,
    navigate
  });
  
  // 💳 handleSelectEngångsavtal - Stripe checkout (se props/handleSelectEngångsavtal.js)
  const handleSelectEngångsavtal = createHandleSelectEngångsavtal({
    setShowAgreementModal,
    setAppState,
    AppState
  });
  
  // 🏢 handleSelectFöretagsavtal - Enterprise (se props/handleSelectFöretagsavtal.js)
  const handleSelectFöretagsavtal = createHandleSelectFöretagsavtal({
    setShowAgreementModal,
    navigate,
    setAppState,
    AppState
  });
  
  // 💳 handlePaymentConfirmed - Callback från PaymentSuccessSlide (se props/handlePaymentConfirmed.js)
  const handlePaymentConfirmed = createHandlePaymentConfirmed({
    setHasAgreement,
    setPaymentPending,
    setShowAgreementModal,
    setCurrentSlideKey,
    navigate,
    setAppState,
    AppState,
    SLIDE_ORDER
  });
  
  // ❌ handleCancelOnboarding - Avbryt och rensa (se props/handleCancelOnboarding.js)
  const handleCancelOnboarding = createHandleCancelOnboarding({
    activeCase,
    api,
    setShowAgreementModal,
    handleLogoutAndReset
  });
  
  // handleConflictReload - Ladda om från server (se props/handleConflictReload.js)
  const handleConflictReload = createHandleConflictReload({
    setShowConflictModal,
    setConflictInfo,
    api,
    activeCase,
    setFormData,
    storage,
    setCompletedSlides,
    setError
  });
  
  // handleConflictForceSave - Skriv över server (se props/handleConflictForceSave.js)
  const handleConflictForceSave = createHandleConflictForceSave({
    setShowConflictModal,
    conflictInfo,
    activeCase,
    setConflictInfo
  });
  
  // handleConflictCancel - Avbryt konflikthantering (se props/handleConflictCancel.js)
  const handleConflictCancel = createHandleConflictCancel({
    setShowConflictModal,
    setConflictInfo
  });
  
  // handleSidebarClick - Navigera via sidebar (se props/handleSidebarClick.js)
  const handleSidebarClick = createHandleSidebarClick({
    SLIDE_ORDER,
    checkVersionConflict,
    setNavigationHistory,
    currentSlideKey,
    activeCase,
    isDraftMode,
    tempCaseId,
    user,
    storage,
    setCurrentSlideKey,
    navigate
  });
  
  // handleSidebarLock - Avgör om slide är låst (se props/handleSidebarLock.js)
  const handleSidebarLock = createHandleSidebarLock({ formData });
  
  // handleFieldChange - Uppdatera formulärfält (se props/handleFieldChange.js)
  const handleFieldChange = createHandleFieldChange({
    setFormHistory,
    formData,
    setFormData
  });
  
  // handleClearError - Rensa felmeddelande (se props/handleClearError.js)
  const handleClearError = createHandleClearError({
    setError,
    appState,
    AppState,
    setAppState
  });

  // ===========================================================================
  // 🎨 RENDER - JSX
  // ===========================================================================
  //
  // JÄMFÖR MED TIC-TAC-TOE:
  //
  // I tic-tac-toe:
  //   return (
  //     <div className="game">
  //       <div className="game-board">
  //         <Board squares={squares} onSquareClick={handleClick} />
  //       </div>
  //       <div className="game-info">...</div>
  //     </div>
  //   );
  //
  // Här:
  //   return (
  //     <div className="flex h-screen">
  //       <Sidebar ... />
  //       <main>
  //         <Routes>
  //           <Route ... />
  //         </Routes>
  //       </main>
  //     </div>
  //   );
  //
  // SAMMA MÖNSTER:
  // - Data flödar NER via props (squares → Board, formData → UppdragsvalsSlide)
  // - Events flödar UPP via callbacks (onSquareClick, onFieldChange)
  //
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
            - activeCase: Case-info { companyName, orgnr }
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
                
                Denna slide har en extra callback: onConfirmCompanySelection
                
                NÄR användaren klickar "Fortsätt" efter att ha valt företag:
                → handleConfirmCompanySelection anropas
                → Draft konverteras till permanent
                → isDraftMode = false
                
                Detta är "point of no return" - efter detta sparas all data
                permanent under company_id istället för draft.
                
                🆕 REFAKTORERAD 2025-12-04:
                - Sliden är nu "dum" och anropar bara onNext()
                - onNext för DENNA slide är handleUppdragsvalsNext som:
                  1. Hämtar companyName/orgnr från formData['uppdragsval']
                  2. Anropar handleConfirmCompanySelection()
                  3. Den i sin tur navigerar vidare efter commit
            */}
            <Route path="/uppdragsval" element={
              <UppdragsvalsSlide 
                formData={formData['uppdragsval'] || {}}
                onNext={async () => {
                  // WRAPPER: När sliden kallar onNext(), 
                  // triggar vi /commit med data från formData
                  const uppdragsvalsData = formData['uppdragsval'] || {};
                  const orgnr = uppdragsvalsData.orgnr || '';
                  const companyName = uppdragsvalsData.companyName || uppdragsvalsData.company_name || '';
                  
                  console.log('[UPPDRAGSVAL WRAPPER] formData:', uppdragsvalsData);
                  console.log('[UPPDRAGSVAL WRAPPER] companyName:', companyName);
                  console.log('[UPPDRAGSVAL WRAPPER] orgnr:', orgnr);
                  
                  if (!orgnr) {
                    console.error('[UPPDRAGSVAL] Ingen orgnr i formData!');
                    setError('Organisationsnummer saknas');
                    return;
                  }
                  
                  // Anropa /commit - får tillbaka { success, companyId, caseId, nextSlide }
                  const result = await handleConfirmCompanySelection(null, companyName, orgnr);
                  
                  if (!result || !result.success) {
                    console.error('[UPPDRAGSVAL WRAPPER] Commit failed:', result?.error);
                    return; // Error redan satt av handleConfirmCompanySelection
                  }
                  
                  // ✅ SUCCESS - Nu hanterar VI routing här i AuthenticatedApp!
                  console.log('[UPPDRAGSVAL WRAPPER] ✅ Commit successful, handling navigation...');
                  
                  const { companyId, caseId, nextSlide } = result;
                  
                  if (nextSlide) {
                    console.log(`[UPPDRAGSVAL WRAPPER] Navigating to: ${nextSlide.path}`);
                    setCurrentSlideKey(nextSlide.key);
                    
                    // Uppdatera tab session
                    const sessionId = storage.buildSessionId(companyId, caseId, user.id);
                    storage.setCurrentTabSession({
                      sessionId,
                      currentSlide: nextSlide.key,
                    });
                    
                    navigate(nextSlide.path);
                  } else {
                    console.warn('[UPPDRAGSVAL WRAPPER] No next slide found!');
                  }
                }}
                onBack={handleBack}
                onFieldChange={(field, value) => handleFieldChange('uppdragsval', field, value)}
                isLocked={!isDraftMode}
                isLoading={isLoading}
                error={error}
                syncStatus={syncStatus}
              />
            } />
            
            <Route path="/riskfragor" element={
              <RiskFragorSlide 
                formData={formData['riskfragor']}
                onNext={handleNext}
                onBack={handleBack}
                onFieldChange={(field, value) => handleFieldChange('riskfragor', field, value)}
                isValid={(() => {
                  const data = formData['riskfragor'] || {};
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
                formData={formData['riskfragor-steg2']}
                onNext={handleNext}
                onBack={handleBack}
                onFieldChange={(field, value) => handleFieldChange('riskfragor-steg2', field, value)}
              />
            } />
            
            <Route path="/riskfragor-steg3" element={
              <RiskFragorSteg3Slide 
                formData={formData['riskfragor-steg3']}
                onNext={handleNext}
                onBack={handleBack}
                onFieldChange={(field, value) => handleFieldChange('riskfragor-steg3', field, value)}
              />
            } />
            
            <Route path="/riskfragor-steg4" element={
              <RiskFragorSteg4Slide 
                formData={formData['riskfragor-steg4']}
                onNext={handleNext}
                onBack={handleBack}
                onFieldChange={(field, value) => handleFieldChange('riskfragor-steg4', field, value)}
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
                onRetry={() => setAppState(AppState.VERIFYING_PAYMENT)}
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
            - onResume(companyId, caseId, name) → handleResumeChoice → RESUMING
            - onDelete(companyId, caseId) → handleDeleteOnboarding → uppdaterar listan
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
          conflictInfo={conflictInfo}
          onReload={handleConflictReload}
          onForceSave={handleConflictForceSave}
          onCancel={handleConflictCancel}
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
            - trialsUsed/trialsMax: Visar hur många gratis onboardings som är kvar
            - isLoading: Visar spinner under paymentStatus === 'initiating'
            - error: Visar felmeddelande om Stripe-anrop misslyckas
      */}
      {showAgreementModal && (
        <AgreementModal
          onSelectEngångsavtal={handleSelectEngångsavtal}
          onSelectFöretagsavtal={handleSelectFöretagsavtal}
          onCancel={handleCancelOnboarding}
          trialsUsed={user?.trialsUsed || 0}
          trialsMax={user?.trialsMax || 3}
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
            - currentSlide: Vilken slide användaren är på
            - formData: All insamlad data för kontextmedvetna svar
            - companyInfo: Företagsinfo { companyName, orgnr }
            - onClose: Stäng panelen
          
          POSITIONERING: top-16 = börjar under header, z-40 = under modaler
      */}
      {activePanel === 'llm' && (
        <LLMPanel
          currentSlide={currentSlideKey}
          formData={formData}
          companyInfo={{
            companyName: activeCase?.companyName,
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
            <div className="truncate">Case: {activeCase.companyName} ({activeCase.onboardingId || activeCase.caseId || 'no case_id'})</div>
          )}
        </div>
      )}
    </div>
  );
}
