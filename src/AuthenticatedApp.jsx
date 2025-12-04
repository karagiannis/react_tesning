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
// 🔑 STORAGE KEY BUILDER - localStorage nycklar
// =============================================================================
//
// VIKTIGT: temp_case_id sparas ALDRIG på servern!
// 
// FLÖDE:
// 1. Login → Frontend genererar temp_case_id (t.ex. "temp_1701234567890_abc123")
// 2. Användaren fyller i UppdragsvalsSlide → Data sparas i localStorage med draft-nyckel
// 3. Användaren klickar "Fortsätt" → POINT OF NO RETURN
//    a) Frontend skickar temp_case_id till server (/onboarding/commit)
//    b) Server tar bort "temp_" prefix och skapar riktigt case_id
//    c) Server skapar: data/companies/{company_id}/onboarding/case_{case_id}/
//    d) Frontend konverterar localStorage från draft → permanent nyckel
// 4. Om användaren loggar ut INNAN "Fortsätt":
//    - "Logga ut" → localStorage rensas, ingenting sparas (temp försvinner)
//    - Nästa login → Nytt temp_case_id genereras
//
// PREAMBLE-FORMAT:
// - Draft:     onboarding::draft::temp_abc123::user_456::formData
// - Permanent: onboarding::556677-8899::case_789::user_456::formData
//
const StorageKeyBuilder = {
  // ─────────────────────────────────────────────────────────────────────────
  // Generera temporärt case_id
  // ─────────────────────────────────────────────────────────────────────────
  //
  // Format: "temp_" + timestamp + "_" + random suffix
  // Exempel: "temp_1701234567890_abc123"
  //
  // OBS: "temp_" prefix är signifikant! Servern använder det för att:
  // - Identifiera nya sessions
  // - Ta bort prefixet när riktigt case skapas
  //
  generateTempCaseId: () => {
    return `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // Bygg draft-nyckel (innan företag valts)
  // ─────────────────────────────────────────────────────────────────────────
  //
  // Exempel: "onboarding::draft::temp_1701234567890_abc123::user_456::formData"
  //
  // Används för att spara data INNAN användaren har valt företag.
  // Denna data försvinner om användaren loggar ut utan att klicka "Fortsätt".
  //
  buildDraftKey: (tempCaseId, userId, dataType) => {
    return `onboarding::draft::${tempCaseId}::${userId}::${dataType}`;
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // Bygg permanent nyckel (efter företag valts)
  // ─────────────────────────────────────────────────────────────────────────
  //
  // Exempel: "onboarding::556677-8899::case_789::user_456::formData"
  //
  // Används EFTER "point of no return" - data är nu kopplad till ett
  // specifikt företag och case på servern.
  //
  buildPermanentKey: (companyId, caseId, userId, dataType) => {
    return `onboarding::${companyId}::${caseId}::${userId}::${dataType}`;
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // Parsa en nyckel för att extrahera komponenter
  // ─────────────────────────────────────────────────────────────────────────
  //
  // Input:  "onboarding::draft::temp_123::user_456::formData"
  // Output: { type: 'onboarding', companyId: 'draft', caseId: 'temp_123', 
  //           userId: 'user_456', dataType: 'formData', isDraft: true }
  //
  parseKey: (key) => {
    const parts = key.split('::');
    if (parts.length !== 5 || parts[0] !== 'onboarding') {
      return null;
    }
    return {
      type: parts[0],
      companyId: parts[1],
      caseId: parts[2],
      userId: parts[3],
      dataType: parts[4],
      isDraft: parts[1] === 'draft',
    };
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // Hitta alla draft-nycklar för en användare
  // ─────────────────────────────────────────────────────────────────────────
  findDraftKeys: (userId) => {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`onboarding::draft::`) && key.includes(`::${userId}::`)) {
        keys.push(key);
      }
    }
    return keys;
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // Hitta alla nycklar för ett specifikt temp_case_id
  // ─────────────────────────────────────────────────────────────────────────
  findKeysByTempCaseId: (tempCaseId) => {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes(`::${tempCaseId}::`)) {
        keys.push(key);
      }
    }
    return keys;
  },
};

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
    // Generell fetch med autentisering
    // ─────────────────────────────────────────────────────────────────────
    fetch: async (endpoint, options = {}) => {
      const token = storage.getToken();
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
          ...options.headers,
        },
      });
      return response;
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
      // Använd /onboarding/active-cases som returnerar:
      // { success: true, active_cases: [...], count: N }
      const response = await api.fetch('/onboarding/active-cases');
      if (response.ok) {
        const data = await response.json();
        // Transformera till det format som frontend förväntar sig
        // active-cases returnerar: { case_id, company_id, company_name, orgnr, current_slide, ... }
        // Frontend förväntar sig: { company_id, company_name, onboarding_id (=case_id), ... }
        const activeCases = data.active_cases || [];
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
      throw new Error('Kunde inte hämta metadata');
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
        setIsLoading(true);
        
        // Fråga API om pågående onboardings
        const onboardings = await api.fetchPendingOnboardings();
        setPendingOnboardings(onboardings);
        
        setIsLoading(false);
        
        // Beslut: Visa resume-modal eller gå till normal drift?
        if (onboardings.length > 0) {
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
          // Ingen pending onboarding - sätt initial tab session (draft mode)
          const sessionId = `onboarding::draft::${tempCaseId}::${user?.id}`;
          storage.setCurrentTabSession({
            sessionId,
            currentSlide: 'uppdragsval',
          });
          
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
          
          setAppState(AppState.READY);
        }
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
            // Om det misslyckas, fortsätt ändå med localStorage-data
            console.warn('[RESTORE] Failed to sync with server, using localStorage data:', e);
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
        // Felmeddelande visas via render (se JSX nedan)
        // Väntar på att användaren klickar bort felet
        break;
        
      default:
        console.warn(`Okänt state: ${appState}`);
    }
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
  // 🎮 HANDLERS - Explicit, inga abstraktioner!
  // ===========================================================================
  //
  // JÄMFÖR MED TIC-TAC-TOE:
  //
  // I tic-tac-toe har vi:
  //   function handleClick(i) {
  //     const nextSquares = squares.slice();
  //     nextSquares[i] = 'X';
  //     setSquares(nextSquares);
  //   }
  //
  // Här har vi:
  //   function handleNext() {
  //     const newCompleted = [...completedSlides, currentSlideKey];
  //     setCompletedSlides(newCompleted);
  //     storage.setCompletedSlides(newCompleted);
  //     ...
  //   }
  //
  // SAMMA MÖNSTER:
  // 1. Skapa ny data (immutably)
  // 2. Uppdatera state
  // 3. (Extra för oss: Spara till localStorage)
  //
  
  // ─────────────────────────────────────────────────────────────────────────
  // handleResumeChoice - Användaren valde att återuppta en onboarding
  // ─────────────────────────────────────────────────────────────────────────
  //
  // ANROPAS FRÅN: OnboardingResumeDialog-modalen
  // EFFEKT: Sätter activeCase och byter till RESUMING-state
  //
  const handleResumeChoice = (companyId, onboardingId, companyName) => {
    setActiveCase({ companyId, onboardingId, companyName });
    setAppState(AppState.RESUMING);  // → State machine tar över
  };
  
  // ─────────────────────────────────────────────────────────────────────────
  // handleStartNew - Användaren vill börja ny onboarding
  // ─────────────────────────────────────────────────────────────────────────
  //
  // ANROPAS FRÅN: OnboardingResumeDialog-modalen
  // EFFEKT: Rensar allt och navigerar till första sliden
  //
  const handleStartNew = () => {
    // 1. Rensa localStorage
    storage.clearFormData();
    storage.clearActiveCase();
    
    // 2. Rensa React state
    setFormData({});
    setActiveCase(null);
    setCompletedSlides([]);
    
    // 3. Sätt initial tab session (draft mode)
    const sessionId = `onboarding::draft::${tempCaseId}::${user?.id}`;
    storage.setCurrentTabSession({
      sessionId,
      currentSlide: 'uppdragsval',
    });
    
    // 4. Navigera till första sliden
    setCurrentSlideKey('uppdragsval');
    navigate('/uppdragsval');
    
    // 5. Gå till normal drift
    setAppState(AppState.READY);
  };
  
  // ─────────────────────────────────────────────────────────────────────────
  // handleDeleteOnboarding - Radera en pågående onboarding
  // ─────────────────────────────────────────────────────────────────────────
  //
  // ANROPAS FRÅN: OnboardingResumeDialog_v2 (via onDelete prop)
  // EFFEKT: 
  //   1. Anropar DELETE endpoint på server
  //   2. Uppdaterar pendingOnboardings state (tar bort den raderade)
  //   3. Om listan blir tom → handleStartNew()
  //
  const handleDeleteOnboarding = async (companyId, caseId) => {
    console.log(`[DELETE] Deleting onboarding: company=${companyId}, case=${caseId}`);
    
    try {
      const response = await api.fetch(`/onboarding/delete/${companyId}?onboarding_id=${caseId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${response.status}`);
      }
      
      // Uppdatera listan (immutably)
      const newPendingOnboardings = pendingOnboardings.filter(
        o => !(o.company_id === companyId && (o.case_id === caseId || o.onboarding_id === caseId))
      );
      setPendingOnboardings(newPendingOnboardings);
      
      // Logga för audit trail
      await api.logPersonal('Onboarding raderad', { companyId, caseId });
      
      console.log(`[DELETE] Success. Remaining onboardings: ${newPendingOnboardings.length}`);
      
      // Om listan är tom → gå direkt till ny session
      if (newPendingOnboardings.length === 0) {
        console.log('[DELETE] No more pending onboardings → starting new session');
        handleStartNew();
      }
      
    } catch (err) {
      console.error('[DELETE] Error:', err);
      throw err;  // Låt dialogen visa felmeddelandet
    }
  };
  
  // ─────────────────────────────────────────────────────────────────────────
  // handleRetryPending - Försök hämta pending onboardings igen
  // ─────────────────────────────────────────────────────────────────────────
  //
  // ANROPAS FRÅN: OnboardingResumeDialog_v2 (via onRetry prop)
  // EFFEKT: Går tillbaka till CHECKING_PENDING för att försöka igen
  //
  const handleRetryPending = () => {
    console.log('[RETRY] Retrying fetchPendingOnboardings...');
    setError(null);
    setAppState(AppState.CHECKING_PENDING);
  };
  
  // ─────────────────────────────────────────────────────────────────────────
  // 🎯 handleConfirmCompanySelection - POINT OF NO RETURN
  // ─────────────────────────────────────────────────────────────────────────
  //
  // ANROPAS FRÅN: UppdragsvalsSlide när användaren klickar "Fortsätt"
  //               efter att ha valt ett företag
  //
  // FLÖDE:
  // 1. Frontend skickar temp_case_id (t.ex. "temp_1701234567890_abc123") till server
  // 2. Server tar bort "temp_" prefix → case_id = "1701234567890_abc123"
  // 3. Server skapar: data/companies/{company_id}/onboarding/case_{case_id}/
  // 4. Server returnerar { case_id, company_id, ... }
  // 5. Frontend konverterar localStorage: draft::temp_xxx → permanent::company::case
  // 6. isDraftMode = false
  //
  // OBS: temp_case_id genereras av FRONTEND vid login.
  //      Servern transformerar det genom att ta bort "temp_" prefix.
  //
  const handleConfirmCompanySelection = async (companyId, companyName, orgnr) => {
    console.log(`[POINT OF NO RETURN] Company selected: ${companyName} (${orgnr})`);
    console.log(`[POINT OF NO RETURN] Sending temp_case_id: ${tempCaseId}`);
    
    setIsLoading(true);
    
    try {
      // ─────────────────────────────────────────────────────────────────
      // Steg 1: Skicka till /onboarding/commit
      // ─────────────────────────────────────────────────────────────────
      //
      // Servern förväntar sig:
      // - case_id: "temp_xxx" (vi skickar vårt temp_case_id)
      // - company_id: Om känt (kan vara tomt för nya företag)
      // - orgnr: Organisationsnummer
      // - company_name: Företagsnamn
      // - form_data: All formulärdata (opak dict)
      //
      const response = await api.fetch('/onboarding/commit', {
        method: 'POST',
        body: JSON.stringify({
          case_id: tempCaseId,           // "temp_1701234567890_abc123"
          company_id: companyId || '',    // Om vi redan har company_id
          orgnr: orgnr,
          company_name: companyName,
          form_data: formData['uppdragsval'] || {},  // Formulärdata från Uppdragsval
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Kunde inte skapa ärende på server');
      }
      
      const result = await response.json();
      
      // Servern returnerar:
      // - case_id: "1701234567890_abc123" (utan "temp_" prefix)
      // - company_id: "5566778899_abc123" (genererat eller befintligt)
      // - was_temp: true (om det var en temp-session)
      
      const serverCaseId = result.case_id || result.onboarding_id;
      const serverCompanyId = result.company_id;
      
      console.log(`[POINT OF NO RETURN] Server created case: ${serverCaseId}`);
      console.log(`[POINT OF NO RETURN] Company ID: ${serverCompanyId}`);
      console.log(`[POINT OF NO RETURN] Was temp: ${result.was_temp}`);
      
      // ─────────────────────────────────────────────────────────────────
      // Steg 2: Konvertera localStorage från draft till permanent
      // ─────────────────────────────────────────────────────────────────
      //
      // Innan: onboarding::draft::temp_xxx::user_456::formData
      // Efter:  onboarding::5566778899_abc::case_xxx::user_456::formData
      //
      storage.convertDraftToPermanent(serverCompanyId, serverCaseId, user.id);
      
      // ─────────────────────────────────────────────────────────────────
      // Steg 3: Uppdatera React state
      // ─────────────────────────────────────────────────────────────────
      setIsDraftMode(false);
      setActiveCase({
        companyId: serverCompanyId,
        caseId: serverCaseId,
        companyName: result.company_name || companyName,
        orgnr: result.orgnr || orgnr,
      });
      
      // ─────────────────────────────────────────────────────────────────
      // Steg 4: Logga för audit trail
      // ─────────────────────────────────────────────────────────────────
      await api.log(`POINT OF NO RETURN: ${user.name} bekräftade företagsval`, {
        companyId: serverCompanyId,
        companyName: result.company_name || companyName,
        orgnr: result.orgnr || orgnr,
        caseId: serverCaseId,
        previousTempCaseId: tempCaseId,
        wasTemp: result.was_temp,
      });
      
      // ─────────────────────────────────────────────────────────────────
      // Steg 5: Navigera till nästa slide
      // ─────────────────────────────────────────────────────────────────
      handleNext();  // Går till riskfragor
      
    } catch (e) {
      console.error('[POINT OF NO RETURN] Error:', e);
      setError(`Kunde inte bekräfta företagsval: ${e.message}`);
    }
    
    setIsLoading(false);
  };
  
  // ─────────────────────────────────────────────────────────────────────────
  // 🚪 handleLogout - Normal utloggning
  // ─────────────────────────────────────────────────────────────────────────
  //
  // ANROPAS FRÅN: Header "Logga ut"-knapp
  //
  // BETEENDE BEROENDE PÅ LÄGE:
  //
  // isDraftMode=true (INNAN "Fortsätt" klickats):
  //   → RENSA all draft-data! Ingenting har sparats på servern.
  //   → Nästa login = helt ny session med nytt temp_case_id
  //
  // isDraftMode=false (EFTER "Fortsätt" klickats):
  //   → BEHÅLL localStorage-data (den är kopplad till riktigt case på server)
  //   → Användaren kan fortsätta vid nästa login
  //
  const handleLogout = async () => {
    console.log(`[LOGOUT] Normal logout initiated. isDraftMode=${isDraftMode}`);
    
    // Logga för audit trail
    await api.log(`Användare ${user?.name} loggade ut`, {
      isDraftMode,
      tempCaseId,
      activeCase,
    });
    
    if (isDraftMode) {
      // ═══════════════════════════════════════════════════════════════════
      // DRAFT MODE: Rensa allt! Ingenting har sparats på servern.
      // ═══════════════════════════════════════════════════════════════════
      console.log('[LOGOUT] Draft mode - clearing all draft data');
      storage.clearAllDraftData();
    } else {
      // ═══════════════════════════════════════════════════════════════════
      // PERMANENT MODE: Behåll data! Det finns ett riktigt case på servern.
      // ═══════════════════════════════════════════════════════════════════
      console.log('[LOGOUT] Permanent mode - keeping localStorage data');
      // Rensa bara temp_case_id och is_draft_mode (inte formData etc.)
      storage.clearTempCaseId();
    }
    
    // Rensa tab session (sessionStorage)
    storage.clearCurrentTabSession();
    
    // Rensa token (alltid)
    storage.clearToken();
    storage.clearRefreshToken();
    
    // Navigera till login
    navigate('/login');
  };
  
  // ─────────────────────────────────────────────────────────────────────────
  // 🗑️ handleLogoutAndReset - Avsluta & rensa (explicit reset)
  // ─────────────────────────────────────────────────────────────────────────
  //
  // ANROPAS FRÅN: Header "Avsluta & rensa"-knapp
  //
  // BETEENDE: Rensar ALLT oavsett läge
  //   - Rensa all localStorage-data (draft OCH permanent)
  //   - Rensa token
  //   - Navigera till login
  //
  // VARNING: Detta tar bort allt användaren har fyllt i, även om det
  //          finns ett riktigt case på servern!
  //
  const handleLogoutAndReset = async () => {
    console.log('[LOGOUT] Logout with RESET initiated');
    
    // Logga för audit trail INNAN vi rensar
    await api.log(`Användare ${user?.name} valde "Avsluta & rensa"`, {
      tempCaseId,
      isDraftMode,
      activeCase,
    });
    
    // Rensa ALL data (draft + permanent)
    storage.clearAllDraftData();
    
    // Om vi är i permanent mode, rensa även permanent data
    if (!isDraftMode && activeCase?.companyId) {
      // Hitta och rensa permanent-nycklar
      const permanentPrefix = `onboarding::${activeCase.companyId}::`;
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith(permanentPrefix)) {
          localStorage.removeItem(key);
          console.log(`[LOGOUT] Removed permanent key: ${key}`);
        }
      }
    }
    
    // Rensa tab session (sessionStorage)
    storage.clearCurrentTabSession();
    
    // Rensa token
    storage.clearToken();
    storage.clearRefreshToken();
    
    // Navigera till login
    navigate('/login');
  };
  
  // ─────────────────────────────────────────────────────────────────────────
  // AGREEMENT/PAYMENT HANDLERS - Stripe integration
  // ─────────────────────────────────────────────────────────────────────────
  //
  // Dessa handlers anropas av AgreementModal (som är en dum komponent)
  // All logik för att initiera Stripe-betalning finns här.
  //
  
  /**
   * handleSelectEngångsavtal - Initiera Stripe checkout
   * 
   * Anropas av AgreementModal när användaren klickar "Teckna engångsavtal"
   * 
   * FLÖDE:
   * 1. POST /onboarding/{company_id}/subscription
   * 2. Få tillbaka payment_url
   * 3. Spara pending_payment i localStorage
   * 4. Redirect till Stripe checkout
   * 5. Stripe redirectar tillbaka till /payment-callback (server)
   * 6. Server redirectar till /riskfragor-steg2
   */
  const handleSelectEngångsavtal = async () => {
    console.log('[PAYMENT] Initiating Stripe checkout...');
    setPaymentStatus('initiating');
    
    try {
      const companyId = activeCase?.companyId;
      const caseId = activeCase?.caseId;
      const personnummer = formData['riskfragor']?.personnummer || '';
      
      if (!companyId || !caseId) {
        throw new Error('Saknar company_id eller case_id. Gå tillbaka till Uppdragsval.');
      }
      
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
      console.log('[PAYMENT] Stripe session created:', data);
      
      if (!data.payment_url) {
        throw new Error('Ingen betalnings-URL returnerades från servern');
      }
      
      // Spara info för return från Stripe
      localStorage.setItem('pending_payment', JSON.stringify({
        companyId,
        caseId,
        slideKey: 'riskfragor',
        initiatedAt: new Date().toISOString()
      }));
      
      setPaymentStatus('redirecting');
      
      // Redirect till Stripe checkout
      window.location.href = data.payment_url;
      
    } catch (err) {
      console.error('[PAYMENT] Error:', err);
      setPaymentStatus('error');
      setError(err.message);
      // Stäng INTE modalen vid fel så användaren kan försöka igen
    }
  };
  
  /**
   * handleSelectFöretagsavtal - För framtida implementation
   * 
   * Enterprise-avtal faktureras separat och behöver ingen Stripe checkout.
   */
  const handleSelectFöretagsavtal = async () => {
    console.log('[PAYMENT] Enterprise agreement selected');
    // TODO: Implementera enterprise-flöde
    // För nu, stäng modalen och visa ett meddelande
    setShowAgreementModal(false);
    alert('Företagsavtal kräver kontakt med säljteamet. Vi kontaktar dig inom kort!');
  };
  
  /**
   * handleCancelOnboarding - Avbryt och rensa allt
   * 
   * Anropas av AgreementModal när användaren klickar "Avsluta och rensa"
   */
  const handleCancelOnboarding = async () => {
    console.log('[PAYMENT] User cancelled - cleaning up...');
    setShowAgreementModal(false);
    
    try {
      const companyId = activeCase?.companyId;
      const caseId = activeCase?.caseId;
      
      if (companyId && caseId) {
        // Soft-delete case på server
        await api.delete(`/onboarding/delete/${companyId}?onboarding_id=${caseId}`);
        console.log('[PAYMENT] Case soft-deleted on server');
      }
    } catch (err) {
      console.warn('[PAYMENT] Failed to delete case on server:', err);
      // Fortsätt med cleanup ändå
    }
    
    // Använd befintlig logout-funktion
    await handleLogoutAndReset();
  };
  
  // ─────────────────────────────────────────────────────────────────────────
  // checkVersionConflict - Kolla om server har nyare version
  // ─────────────────────────────────────────────────────────────────────────
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
  
  // ─────────────────────────────────────────────────────────────────────────
  // handleConflictReload - Ladda om från server
  // ─────────────────────────────────────────────────────────────────────────
  const handleConflictReload = async () => {
    console.log('[CONFLICT] Användaren valde: Ladda om från server');
    setShowConflictModal(false);
    setConflictInfo(null);
    
    try {
      // Hämta färsk data från server
      const serverMeta = await api.fetchMetadata(activeCase.companyId, activeCase.caseId);
      const serverVersion = serverMeta?.metadata?.version || serverMeta?.version || 0;
      
      // Uppdatera lokal state med server-data
      if (serverMeta?.form_data) {
        setFormData(serverMeta.form_data);
        storage.setFormData(serverMeta.form_data);
      }
      
      if (serverMeta?.completed_slides) {
        setCompletedSlides(serverMeta.completed_slides);
        storage.setCompletedSlides(serverMeta.completed_slides);
      }
      
      // Uppdatera local version (samma key som checkVersionConflict använder)
      const storageKey = `case_${activeCase.companyId}_${activeCase.caseId}_version`;
      localStorage.setItem(storageKey, JSON.stringify({
        version: serverVersion,
        timestamp: new Date().toISOString(),
        syncedFromServer: true
      }));
      
      console.log('[CONFLICT] ✅ Data laddad från server, version:', serverVersion);
      
    } catch (err) {
      console.error('[CONFLICT] ❌ Fel vid reload:', err);
      setError('Kunde inte ladda om från server');
    }
  };
  
  // ─────────────────────────────────────────────────────────────────────────
  // handleConflictForceSave - Skriv över serverns data
  // ─────────────────────────────────────────────────────────────────────────
  const handleConflictForceSave = async () => {
    console.log('[CONFLICT] Användaren valde: Skriv över server');
    setShowConflictModal(false);
    
    const serverVersion = conflictInfo?.server_version || 0;
    
    // Uppdatera local version till server+1 (vi "tar ägandeskap")
    const storageKey = `case_${activeCase.companyId}_${activeCase.caseId}_version`;
    localStorage.setItem(storageKey, JSON.stringify({
      version: serverVersion + 1,
      timestamp: new Date().toISOString(),
      forcedOverwrite: true
    }));
    
    setConflictInfo(null);
    
    // TODO: Push till server med force-flagga
    console.log('[CONFLICT] ✅ Lokal version uppdaterad till', serverVersion + 1, '(force overwrite)');
  };
  
  // ─────────────────────────────────────────────────────────────────────────
  // handleConflictCancel - Avbryt
  // ─────────────────────────────────────────────────────────────────────────
  const handleConflictCancel = () => {
    console.log('[CONFLICT] Användaren valde: Avbryt');
    setShowConflictModal(false);
    setConflictInfo(null);
  };
  
  // ─────────────────────────────────────────────────────────────────────────
  // handleSidebarClick - Navigering via sidebar
  // ─────────────────────────────────────────────────────────────────────────
  //
  // ANROPAS FRÅN: Sidebar_v2 (SlideButton onClick)
  // EFFEKT: Navigerar till vald slide, loggar i history
  //
  // JÄMFÖR MED TIC-TAC-TOE:
  // I tic-tac-toe har vi history för att "gå tillbaka" till tidigare drag.
  // Här har vi navigationHistory för att se hur användaren navigerade.
  //
  // 🔒 VERSION-CHECK: Kontrollerar server-version INNAN navigation!
  //
  const handleSidebarClick = async (slideKey) => {
    const slide = SLIDE_ORDER.find(s => s.key === slideKey);
    if (!slide) return;
    
    // ─────────────────────────────────────────────────────────────────────
    // 🔒 STEG 1: Kolla om server har nyare version
    // ─────────────────────────────────────────────────────────────────────
    const hasConflict = await checkVersionConflict();
    if (hasConflict) {
      console.log('[SIDEBAR] ⚠️ Konflikt - blockerar navigation till', slideKey);
      return; // Modal visas automatiskt av checkVersionConflict
    }
    
    // ─────────────────────────────────────────────────────────────────────
    // STEG 2: Lägg till i historik (för audit trail och eventuell undo)
    // ─────────────────────────────────────────────────────────────────────
    setNavigationHistory(prev => [...prev, {
      slideKey,
      timestamp: Date.now(),
      action: 'sidebar_click',
      fromSlide: currentSlideKey,
    }]);
    
    // Uppdatera tab session (för page reload)
    // OBS: activeCase kan ha antingen caseId (från handleConfirmCompanySelection)
    // eller onboardingId (från handleResumeChoice) - hantera båda!
    const caseOrOnboardingId = activeCase?.caseId || activeCase?.onboardingId;
    const sessionId = isDraftMode 
      ? `onboarding::draft::${tempCaseId}::${user?.id}`
      : storage.buildSessionId(activeCase?.companyId, caseOrOnboardingId, user?.id);
    storage.setCurrentTabSession({
      sessionId,
      currentSlide: slideKey,
    });
    
    setCurrentSlideKey(slideKey);
    navigate(slide.path);
  };
  
  // ─────────────────────────────────────────────────────────────────────────
  // handleSidebarLock - Avgör om en slide ska vara låst
  // ─────────────────────────────────────────────────────────────────────────
  //
  // ANROPAS FRÅN: Sidebar_v2 för varje SlideButton
  // RETURNERAR: true om sliden är låst, false om tillgänglig
  //
  // REGLER (UPPDATERADE 2025-01-XX):
  // 1. Alla vanliga slides (GRUNDINFO, RISKBEDÖMNING, DOKUMENT) är ALLTID ÖPPNA
  // 2. ENDAST FÖRETAGSDATA-slides är låsta - dessa kräver roaringData
  //    (användaren måste ha betalat för extern API-anrop till Skatteverket/Bolagsverket)
  //
  // FÖRKLARING:
  // Tidigare var slides låsta tills föregående slide var klar. Detta ändrades
  // för att ge användaren frihet att hoppa mellan sektioner. Bara extern data
  // (som kostar pengar att hämta) kräver betalning först.
  //
  const handleSidebarLock = (slideKey) => {
    // ─────────────────────────────────────────────────────────────────────
    // 🔒 ENDAST FÖRETAGSDATA-SLIDES: Kräver roaringData (betalat API-anrop)
    // ─────────────────────────────────────────────────────────────────────
    const ROARING_DEPENDENT_SLIDES = ['verksamhet', 'agarstruktur', 'styrelse', 'ovriga-data'];
    
    if (ROARING_DEPENDENT_SLIDES.includes(slideKey)) {
      // Om roaringData saknas → LÅST
      return !roaringData;
    }
    
    // Alla andra slides är ALLTID tillgängliga
    return false;
  };
  
  // ─────────────────────────────────────────────────────────────────────────
  // handleNext - Gå till nästa slide
  // ─────────────────────────────────────────────────────────────────────────
  //
  // ANROPAS FRÅN: Varje slide's "Nästa"-knapp
  // EFFEKT: 
  //   1. Markera nuvarande slide som klar
  //   2. Spara till localStorage
  //   3. Navigera till nästa slide
  //
  // JÄMFÖR MED TIC-TAC-TOE:
  // Detta är som att lägga ett drag - vi uppdaterar state och "går vidare"
  //
  // 🔒 VERSION-CHECK: Kontrollerar server-version INNAN navigation!
  //
  // 🆕 2025-12-04: handleNext gör nu API-anrop baserat på currentSlideKey!
  //
  // SLIDE → ENDPOINT MAPPNING:
  //   uppdragsval     → /onboarding/commit (skapar case på server)
  //   riskfragor      → /onboarding/slide/riskfragor
  //   riskfragor-steg2→ /onboarding/slide/riskfragor-steg2
  //   ... etc
  //
  // FLÖDE:
  //   1. Kolla version conflict
  //   2. POST slide-data till server
  //   3. Uppdatera localStorage + state
  //   4. Navigera till nästa slide
  //
  const handleNext = async () => {
    const currentIndex = SLIDE_ORDER.findIndex(s => s.key === currentSlideKey);
    
    // Kolla att det finns en nästa slide
    if (currentIndex >= SLIDE_ORDER.length - 1) return;
    
    // ─────────────────────────────────────────────────────────────────────
    // 🔒 STEG 0: Kolla om server har nyare version (om inte draft mode)
    // ─────────────────────────────────────────────────────────────────────
    if (!isDraftMode) {
      const hasConflict = await checkVersionConflict();
      if (hasConflict) {
        console.log('[NEXT] ⚠️ Konflikt - blockerar navigation');
        return; // Modal visas automatiskt av checkVersionConflict
      }
    }
    
    // ─────────────────────────────────────────────────────────────────────
    // 💳 STEG 0.5: Agreement check för riskfragor (Steg 1)
    // ─────────────────────────────────────────────────────────────────────
    //
    // När användaren trycker "Nästa" på riskfragor slide:
    // - Om de inte har betalat (hasAgreement = false), visa AgreementModal
    // - Användaren väljer betalningsmetod → Stripe → callback → fortsätt
    // - Om de HAR betalat (hasAgreement = true), fortsätt normalt
    //
    if (currentSlideKey === 'riskfragor' && !hasAgreement && !isDraftMode) {
      console.log('[NEXT] 💳 Riskfrågor utan avtal - visar AgreementModal');
      setShowAgreementModal(true);
      return; // Blockera navigation tills betalning är klar
    }
    
    // ─────────────────────────────────────────────────────────────────────
    // 📤 STEG 1: PUSH TILL SERVER
    // ─────────────────────────────────────────────────────────────────────
    //
    // Varje slide har sin egen endpoint. AuthenticatedApp vet vilken slide
    // som är aktiv och anropar rätt endpoint.
    //
    setIsLoading(true);
    setSyncStatus('saving');
    setError(null);
    
    try {
      const slideData = formData[currentSlideKey] || {};
      
      // ═══════════════════════════════════════════════════════════════════
      // SPECIAL CASE: uppdragsval (POINT OF NO RETURN)
      // ═══════════════════════════════════════════════════════════════════
      if (currentSlideKey === 'uppdragsval') {
        // Detta hanteras av wrappern i Route - den anropar handleConfirmCompanySelection
        // Se Route path="/uppdragsval" nedan
        console.log('[NEXT] uppdragsval - handled by wrapper, should not reach here');
        setIsLoading(false);
        setSyncStatus('idle');
        return;
      }
      
      // ═══════════════════════════════════════════════════════════════════
      // NORMAL CASE: Alla andra slides
      // ═══════════════════════════════════════════════════════════════════
      //
      // POST /api/onboarding/slide/{slide_key}
      //
      // Body:
      // {
      //   case_id: "uuid",
      //   company_id: "orgnr_prefix",
      //   slide_data: { ... all form data for this slide ... }
      // }
      //
      // Response:
      // {
      //   success: true,
      //   version: 5,  // New server version
      //   slide_key: "riskfragor"
      // }
      //
      if (!isDraftMode && activeCase?.caseId) {
        console.log(`[NEXT] 📤 Pushing slide data: ${currentSlideKey}`);
        
        const response = await api.fetch(`/onboarding/slide/${currentSlideKey}`, {
          method: 'POST',
          body: JSON.stringify({
            case_id: activeCase.caseId,
            company_id: activeCase.companyId,
            slide_data: slideData,
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          
          // Hantera version conflict
          if (response.status === 409) {
            console.log('[NEXT] ⚠️ Server returnerade 409 - version conflict');
            setConflictInfo(errorData);
            setShowConflictModal(true);
            setIsLoading(false);
            setSyncStatus('conflict');
            return;
          }
          
          throw new Error(errorData.detail || `HTTP ${response.status}`);
        }
        
        const result = await response.json();
        console.log(`[NEXT] ✅ Server saved slide, new version: ${result.version}`);
        
        // Uppdatera lokal version
        const versionKey = `case_${activeCase.companyId}_${activeCase.caseId}_version`;
        localStorage.setItem(versionKey, JSON.stringify({
          version: result.version,
          timestamp: new Date().toISOString(),
          lastSlide: currentSlideKey,
        }));
        
      } else {
        // Draft mode - bara spara lokalt
        console.log(`[NEXT] 📝 Draft mode - only saving to localStorage`);
      }
      
      setSyncStatus('saved');
      
    } catch (err) {
      console.error('[NEXT] Error pushing to server:', err);
      setError(`Kunde inte spara: ${err.message}`);
      setSyncStatus('idle');
      setIsLoading(false);
      return; // Avbryt navigation vid fel
    }
    
    // ─────────────────────────────────────────────────────────────────────
    // ✅ STEG 2: Uppdatera state och navigera
    // ─────────────────────────────────────────────────────────────────────
    
    // 1. Markera nuvarande som klar (immutable update!)
    const newCompleted = [...completedSlides, currentSlideKey];
    setCompletedSlides(newCompleted);
    storage.setCompletedSlides(newCompleted);
    
    // 2. Spara formData till localStorage
    storage.setFormData(formData);
    
    // 3. Uppdatera local version timestamp
    localStorage.setItem('localVersion', JSON.stringify({
      version: (JSON.parse(localStorage.getItem('localVersion') || '{}')?.version || 0) + 1,
      timestamp: new Date().toISOString(),
      lastSlide: currentSlideKey
    }));
    
    // 4. Lägg till i navigation history
    const nextSlide = SLIDE_ORDER[currentIndex + 1];
    setNavigationHistory(prev => [...prev, {
      slideKey: nextSlide.key,
      timestamp: Date.now(),
      action: 'next',
      fromSlide: currentSlideKey,
    }]);
    
    // 5. Uppdatera tab session (för page reload)
    // OBS: activeCase kan ha antingen caseId (från handleConfirmCompanySelection)
    // eller onboardingId (från handleResumeChoice) - hantera båda!
    const caseOrOnboardingId = activeCase?.caseId || activeCase?.onboardingId;
    const sessionId = isDraftMode 
      ? `onboarding::draft::${tempCaseId}::${user?.id}`
      : storage.buildSessionId(activeCase?.companyId, caseOrOnboardingId, user?.id);
    storage.setCurrentTabSession({
      sessionId,
      currentSlide: nextSlide.key,
    });
    
    // 6. Navigera
    setCurrentSlideKey(nextSlide.key);
    navigate(nextSlide.path);
    
    // 7. Reset loading state
    setIsLoading(false);
    
    // 8. Reset sync status efter kort delay (så användaren ser "Saved")
    setTimeout(() => setSyncStatus('idle'), 1500);
  };
  
  // ─────────────────────────────────────────────────────────────────────────
  // handleBack - Gå tillbaka till föregående slide
  // ─────────────────────────────────────────────────────────────────────────
  //
  // ANROPAS FRÅN: Varje slide's "Tillbaka"-knapp
  // EFFEKT: Navigerar bakåt (ändrar INTE completedSlides)
  //
  const handleBack = () => {
    const currentIndex = SLIDE_ORDER.findIndex(s => s.key === currentSlideKey);
    
    // Kolla att det finns en föregående slide
    if (currentIndex > 0) {
      const prevSlide = SLIDE_ORDER[currentIndex - 1];
      
      // Lägg till i history
      setNavigationHistory(prev => [...prev, {
        slideKey: prevSlide.key,
        timestamp: Date.now(),
        action: 'back',
        fromSlide: currentSlideKey,
      }]);
      
      // Uppdatera tab session (för page reload)
      // OBS: activeCase kan ha antingen caseId (från handleConfirmCompanySelection)
      // eller onboardingId (från handleResumeChoice) - hantera båda!
      const caseOrOnboardingId = activeCase?.caseId || activeCase?.onboardingId;
      const sessionId = isDraftMode 
        ? `onboarding::draft::${tempCaseId}::${user?.id}`
        : storage.buildSessionId(activeCase?.companyId, caseOrOnboardingId, user?.id);
      storage.setCurrentTabSession({
        sessionId,
        currentSlide: prevSlide.key,
      });
      
      // Navigera
      setCurrentSlideKey(prevSlide.key);
      navigate(prevSlide.path);
    }
  };
  
  // ─────────────────────────────────────────────────────────────────────────
  // handleFieldChange - Uppdatera ett fält i ett formulär
  // ─────────────────────────────────────────────────────────────────────────
  //
  // ANROPAS FRÅN: Alla formulärfält i alla slides
  // PARAMETERS:
  //   slideKey - vilken slide (t.ex. 'uppdragsval')
  //   field    - vilket fält (t.ex. 'orgnr')
  //   value    - det nya värdet
  //
  // JÄMFÖR MED TIC-TAC-TOE:
  // Detta är som handleClick - vi uppdaterar ett värde immutably
  //
  // I tic-tac-toe:
  //   const nextSquares = squares.slice();  // Kopiera
  //   nextSquares[i] = 'X';                  // Uppdatera
  //   setSquares(nextSquares);              // Spara
  //
  // Här:
  //   const newFormData = { ...formData };   // Kopiera
  //   newFormData[slideKey][field] = value;  // Uppdatera
  //   setFormData(newFormData);              // Spara
  //
  // OBS: localStorage-sparning hanteras av useAutoSave (debounced!)
  //
  const handleFieldChange = (slideKey, field, value) => {
    // 1. Lägg till i form history (för audit trail och undo)
    setFormHistory(prev => [...prev, {
      slideKey,
      field,
      oldValue: formData[slideKey]?.[field],  // Spara gamla värdet!
      newValue: value,
      timestamp: Date.now(),
    }]);
    
    // 2. Skapa ny formData (immutably!)
    const newFormData = {
      ...formData,
      [slideKey]: {
        ...formData[slideKey],
        [field]: value,
      },
    };
    
    // 3. Uppdatera React state
    //    (localStorage-sparning sker automatiskt via useAutoSave med debounce)
    setFormData(newFormData);
  };
  
  // ─────────────────────────────────────────────────────────────────────────
  // handleClearError - Rensa felmeddelande
  // ─────────────────────────────────────────────────────────────────────────
  //
  // ANROPAS FRÅN: Error-komponent eller stäng-knapp på error-toast
  // EFFEKT: Rensar error och återgår till READY om vi var i ERROR-state
  //
  const handleClearError = () => {
    setError(null);
    if (appState === AppState.ERROR) {
      setAppState(AppState.READY);
    }
  };

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
                onNext={() => {
                  // WRAPPER: När sliden kallar onNext(), 
                  // triggar vi /commit med data från formData
                  const uppdragsvalsData = formData['uppdragsval'] || {};
                  const orgnr = uppdragsvalsData.orgnr || '';
                  const companyName = uppdragsvalsData.companyName || '';
                  
                  if (!orgnr) {
                    console.error('[UPPDRAGSVAL] Ingen orgnr i formData!');
                    setError('Organisationsnummer saknas');
                    return;
                  }
                  
                  // Anropa /commit - den navigerar vidare efter success
                  handleConfirmCompanySelection(null, companyName, orgnr);
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
