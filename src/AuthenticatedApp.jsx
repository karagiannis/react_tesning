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
import OnboardingResumeDialog from './components/Modals/OnboardingResumeDialogV2';
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
import { createHandleBack } from './props/handleBack';
import { createHandleNext } from './props/handleNext';
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
    getFormData: () => {
      const key = storage._buildKey('formData');
      const data = localStorage.getItem(key);
      console.log(`[STORAGE] getFormData from key: ${key}`);
      return data ? JSON.parse(data) : {};
    },
    setFormData: (data) => {
      const key = storage._buildKey('formData');
      console.log(`[STORAGE] setFormData to key: ${key}`);
      localStorage.setItem(key, JSON.stringify(data));
    },
    clearFormData: () => {
      const key = storage._buildKey('formData');
      console.log(`[STORAGE] clearFormData from key: ${key}`);
      localStorage.removeItem(key);
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
  // Använder debounce (300ms) för att undvika för många skrivningar.
  // Uppdaterar också localVersion timestamp för version conflict detection.
  //
  const { lastSaved, isSaving, forceSave } = useAutoSave({
    formData,
    storage,
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
        setPendingOnboardings(onboardings);
        
        setIsLoading(false);
        console.log('[CHECKING_PENDING] ⚖️ Deciding next state, onboardings.length =', onboardings.length);
        
        // Beslut: Visa resume-modal eller gå till normal drift?
        if (onboardings.length > 0) {
          console.log('[CHECKING_PENDING] ➡️ Going to SHOWING_RESUME (found pending onboardings)');
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
          const metadata = await api.fetchMetadata(
            activeCase.companyId, 
            activeCase.onboardingId
          );
          
          // Spara till localStorage (så det överlever refresh)
          storage.setFormData(metadata.formData || {});
          storage.setCompletedSlides(metadata.completedSlides || []);
          storage.setActiveCase(activeCase);
          
          // 📌 SPARA SERVER VERSION för conflict detection
          const serverVersion = metadata?.metadata?.version || metadata?.version || 0;
          const versionStorageKey = `case_${activeCase.companyId}_${activeCase.onboardingId}_version`;
          localStorage.setItem(versionStorageKey, JSON.stringify({
            version: serverVersion,
            timestamp: new Date().toISOString(),
            syncedFromServer: true
          }));
          console.log('[RESUMING] 📌 Sparade server version:', serverVersion);
          
          // Uppdatera React state
          setFormData(metadata.formData || {});
          setCompletedSlides(metadata.completedSlides || []);
          
          // ─────────────────────────────────────────────────────────────────
          // 🔓 ROARING DATA - Lås upp företagsdata-slides om data finns
          // ─────────────────────────────────────────────────────────────────
          //
          // Om användaren har betalat för extern API-anrop (Roaring.io) så
          // finns roaring_data i metadata. Sätt state så att sidebar-slides
          // för 'verksamhet', 'agarstruktur', 'styrelse', 'ovriga-data' låses upp.
          //
          // OBS: Server returnerar snake_case (roaring_data), vi konverterar till camelCase
          //
          if (metadata.roaring_data) {
            console.log('[RESUMING] 🔓 Roaring data found - unlocking företagsdata slides');
            setRoaringData(metadata.roaring_data);
          } else if (metadata.has_roaring_data) {
            // Fallback: Om bara boolean finns, sätt ett truthy objekt
            console.log('[RESUMING] 🔓 has_roaring_data=true - unlocking företagsdata slides');
            setRoaringData({ _unlocked: true });
          }
          
          // Navigera till där användaren var senast
          const lastSlide = metadata.lastSlide || 'uppdragsval';
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
      // VAD: Ingenting! Vi väntar på att användaren interagerar.
      //      Handlers (handleNext, handleFieldChange, etc.) tar över härifrån.
      //
      case AppState.READY:
        console.log('[READY] ✅ App is ready! Waiting for user interaction...');
        console.log('[READY] Current slide:', currentSlideKey);
        console.log('[READY] Draft mode:', isDraftMode);
        console.log('[READY] Active case:', activeCase);
        // Normal drift - väntar på användarinteraktion
        // Alla handlers är aktiva, användaren kan:
        // - Navigera med sidebar
        // - Fylla i formulär
        // - Klicka Nästa/Tillbaka
        break;
        
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
  
  // handleNext - Gå till nästa slide med server-push (se props/handleNext.js)
  // VIKTIGT: Måste definieras före handleConfirmCompanySelection som beror på den!
  const handleNext = createHandleNext({
    SLIDE_ORDER,
    currentSlideKey,
    isDraftMode,
    checkVersionConflict,
    hasAgreement,
    setShowAgreementModal,
    setIsLoading,
    setSyncStatus,
    setError,
    formData,
    activeCase,
    api,
    setConflictInfo,
    setShowConflictModal,
    storage,
    completedSlides,
    setCompletedSlides,
    tempCaseId,
    user,
    setNavigationHistory,
    setCurrentSlideKey,
    navigate
  });
  
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
    activeCase,
    formData,
    api,
    setPaymentStatus,
    setError
  });
  
  // 🏢 handleSelectFöretagsavtal - Enterprise (se props/handleSelectFöretagsavtal.js)
  const handleSelectFöretagsavtal = createHandleSelectFöretagsavtal({
    setShowAgreementModal
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
  const handleSidebarLock = createHandleSidebarLock({ roaringData });
  
  // handleBack - Gå tillbaka till föregående slide (se props/handleBack.js)
  const handleBack = createHandleBack({
    SLIDE_ORDER,
    currentSlideKey,
    setNavigationHistory,
    activeCase,
    isDraftMode,
    tempCaseId,
    user,
    storage,
    setCurrentSlideKey,
    navigate
  });
  
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
                roaringData={roaringData}
                onNext={handleNext}
                onBack={handleBack}
              />
            } />
            
            <Route path="/agarstruktur" element={
              <AgarstrukturSlide 
                roaringData={roaringData}
                onNext={handleNext}
                onBack={handleBack}
              />
            } />
            
            <Route path="/styrelse" element={
              <StyrelseSlide 
                roaringData={roaringData}
                onNext={handleNext}
                onBack={handleBack}
              />
            } />
            
            <Route path="/ovriga-data" element={
              <OvrigaDataSlide 
                roaringData={roaringData}
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
                roaringData={roaringData}
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
                activeCase={activeCase}
                onNext={handleNext}
                onBack={handleBack}
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
            <div className="truncate">Case: {activeCase.companyName} ({activeCase.caseId || 'no case_id'})</div>
          )}
        </div>
      )}
    </div>
  );
}
