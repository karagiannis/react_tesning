/**
 * CREATED: 2025-11-30
 * PURPOSE: MASTER hook för onboarding-session - äger resume-modalen och session-val
 * 
 * ARKITEKTUR:
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │  useOnboardingSession (MASTER över ALLT)                                 │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  STEG 1: Vid mount                                                       │
 * │  ┌────────────────────────────────────────────────────────────────┐      │
 * │  │  const [phase, setPhase] = useState('checking');               │      │
 * │  │  // 'checking' → 'show_resume_modal' → 'ready'                 │      │
 * │  │  // eller: 'checking' → 'ready' (om inga pågående)             │      │
 * │  └────────────────────────────────────────────────────────────────┘      │
 * │                                                                          │
 * │  STEG 2: Fetch pågående onboardings                                      │
 * │  ┌────────────────────────────────────────────────────────────────┐      │
 * │  │  GET /api/onboarding/list → [{company_id, case_id, ...}, ...]  │      │
 * │  │                                                                 │      │
 * │  │  if (list.length > 0) {                                        │      │
 * │  │    setPhase('show_resume_modal');                              │      │
 * │  │    setOnboardings(list);                                       │      │
 * │  │  } else {                                                      │      │
 * │  │    setPhase('ready');  // Ny tom session                       │      │
 * │  │    setSession({ companyId: null, caseId: null });              │      │
 * │  │  }                                                              │      │
 * │  └────────────────────────────────────────────────────────────────┘      │
 * │                                                                          │
 * │  STEG 3: User väljer i modal                                             │
 * │  ┌────────────────────────────────────────────────────────────────┐      │
 * │  │  onSelectOnboarding(selected) → fetch full data → setSession   │      │
 * │  │  onNewSession() → setSession({ companyId: null, caseId: null })│      │
 * │  │  onDelete(selected) → DELETE → refetch list                    │      │
 * │  └────────────────────────────────────────────────────────────────┘      │
 * │                                                                          │
 * │  RETURNERAR:                                                             │
 * │  {                                                                       │
 * │    phase,           // 'checking' | 'show_resume_modal' | 'ready'        │
 * │    onboardings,     // Lista för modal                                   │
 * │    session,         // { companyId, caseId, initialData, metadata }      │
 * │    error,           // Error message                                     │
 * │    onSelectOnboarding,                                                   │
 * │    onNewSession,                                                         │
 * │    onDelete                                                              │
 * │  }                                                                       │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 * 
 * VARFÖR DENNA HOOK?
 * ─────────────────────────
 * BUG: Resume-flödet navigerade till /uppdragsval UTAN companyId/caseId params
 *      → useSlideStateController fick inte rätt IDs
 *      → Data laddades inte korrekt
 *      → Auto-save skrev över befintlig data med tom data
 * 
 * LÖSNING: State Controller äger BÅDE modalen OCH sessionen
 *          Slide renderas INTE förrän session är vald och data laddad
 * 
 * REF: CHANGELOG_2025-11-30.md - Section 12: State Controller äger Resume-modalen
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { API_URL as API_BASE } from '../config/api';
import { debugLog } from '../utils/debugLogger';
import { buildStorageKey, clearStorageKeys } from '../utils/storageKeys';

/**
 * Phase state machine:
 * 
 * 'checking'         → Initial state, fetching /api/onboarding/list
 * 'show_resume_modal'→ Har pågående onboardings, väntar på user-val
 * 'ready'            → Session vald (ny eller befintlig), redo att rendera slide
 * 'error'            → Något gick fel
 */
const PHASES = {
  CHECKING: 'checking',
  SHOW_RESUME_MODAL: 'show_resume_modal',
  READY: 'ready',
  ERROR: 'error'
};

/**
 * MASTER hook för onboarding-session
 * 
 * Äger:
 * - Resume modal state
 * - Session selection
 * - Initial data loading
 * 
 * @returns {Object}
 */
export const useOnboardingSession = () => {
  // ══════════════════════════════════════════════════════════════════
  // STATE
  // ══════════════════════════════════════════════════════════════════
  const [phase, setPhase] = useState(PHASES.CHECKING);
  const [onboardings, setOnboardings] = useState([]);
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);
  
  // Prevent double-fetching
  const hasFetched = useRef(false);
  const isMounted = useRef(true);
  
  // ══════════════════════════════════════════════════════════════════
  // HELPERS
  // ══════════════════════════════════════════════════════════════════
  const getToken = useCallback(() => {
    return localStorage.getItem('accessToken') || '';
  }, []);
  
  const getUserId = useCallback(() => {
    const token = getToken();
    if (!token) return 'anonymous';
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded.sub || decoded.user_id || decoded.email || 'anonymous';
    } catch {
      return 'anonymous';
    }
  }, [getToken]);
  
  // ══════════════════════════════════════════════════════════════════
  // FETCH LIST OF ONBOARDINGS
  // ══════════════════════════════════════════════════════════════════
  const fetchOnboardingList = useCallback(async () => {
    const token = getToken();
    if (!token) {
      console.log('⚠️ useOnboardingSession: No token, skipping fetch');
      setPhase(PHASES.READY);
      setSession({ companyId: null, caseId: null, isNewSession: true });
      return;
    }
    
    try {
      debugLog.thought('session', '🔍 MASTER SESSION: Fetching onboarding list...');
      
      const response = await fetch(`${API_BASE}/onboarding/list`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      const companies = data.companies || [];
      
      debugLog.thought('session', `✅ MASTER SESSION: Found ${companies.length} onboarding(s)`, {
        companies: companies.map(c => ({ 
          company_id: c.company_id, 
          company_name: c.company_name,
          current_step: c.current_step 
        }))
      });
      
      if (!isMounted.current) return;
      
      if (companies.length > 0) {
        // Har pågående onboardings - visa modal
        setOnboardings(companies);
        setPhase(PHASES.SHOW_RESUME_MODAL);
      } else {
        // Inga pågående - redo för ny session
        setSession({ companyId: null, caseId: null, isNewSession: true });
        setPhase(PHASES.READY);
      }
      
    } catch (err) {
      console.error('❌ useOnboardingSession: Failed to fetch list:', err);
      debugLog.thought('session', '❌ MASTER SESSION: Fetch failed', { error: err.message });
      
      if (!isMounted.current) return;
      
      setError(err.message);
      // Fallback: gå till ready med ny session
      setSession({ companyId: null, caseId: null, isNewSession: true });
      setPhase(PHASES.READY);
    }
  }, [getToken]);
  
  // ══════════════════════════════════════════════════════════════════
  // SELECT ONBOARDING (User klickar "Fortsätt")
  // ══════════════════════════════════════════════════════════════════
  const onSelectOnboarding = useCallback(async (selected) => {
    const token = getToken();
    const userId = getUserId();
    
    debugLog.thought('session', '🎯 MASTER SESSION: User selected onboarding', {
      company_id: selected.company_id,
      case_id: selected.case_id,
      company_name: selected.company_name
    });
    
    try {
      // Fetch full data for selected onboarding
      const companyId = selected.company_id;
      const caseId = selected.case_id || selected.onboardingId;
      
      const response = await fetch(
        `${API_BASE}/onboarding/resume/${companyId}?onboarding_id=${caseId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      debugLog.thought('session', '✅ MASTER SESSION: Loaded full data', {
        version: data.version,
        current_step: data.current_step,
        is_locked: data.is_locked,
        hasStaticKyc: !!data.static_kyc
      });
      
      // Cache ALL slide data from resume response
      // So useSlideStateController doesn't need to refetch
      if (data.static_kyc) {
        Object.entries(data.static_kyc).forEach(([slideKey, slideData]) => {
          const cacheKey = buildStorageKey({
            userId,
            companyId,
            caseId,
            slideKey,
            type: 'data'
          });
          const wrapped = {
            value: slideData.entireForm ? slideData : { entireForm: slideData },
            version: data.version || 0,
            timestamp: new Date().toISOString()
          };
          localStorage.setItem(cacheKey, JSON.stringify(wrapped));
          debugLog.thought('session', `💾 Cached ${slideKey}`, { cacheKey });
        });
      }
      
      // Also cache from legacy data format
      if (data.data) {
        Object.entries(data.data).forEach(([slideKey, slideData]) => {
          const cacheKey = buildStorageKey({
            userId,
            companyId,
            caseId,
            slideKey,
            type: 'data'
          });
          const wrapped = {
            value: slideData,
            version: data.version || 0,
            timestamp: new Date().toISOString()
          };
          localStorage.setItem(cacheKey, JSON.stringify(wrapped));
          debugLog.thought('session', `💾 Cached ${slideKey} (legacy)`, { cacheKey });
        });
      }
      
      // Set localStorage IDs for backwards compatibility
      localStorage.setItem('onboarding_id', caseId);
      localStorage.setItem('current_company_id', companyId);
      localStorage.setItem('current_company_name', data.company_name || selected.company_name);
      localStorage.setItem('current_orgnr', data.orgnr || selected.orgnr);
      
      if (!isMounted.current) return;
      
      // Set session with full data
      setSession({
        companyId,
        caseId,
        orgnr: data.orgnr || selected.orgnr,
        companyName: data.company_name || selected.company_name,
        currentStep: data.current_step,
        isNewSession: false,
        metadata: data,
        // Include subscription data for AgreementContext
        subscription: data.subscription || null
      });
      
      setPhase(PHASES.READY);
      
    } catch (err) {
      console.error('❌ useOnboardingSession: Failed to load onboarding:', err);
      debugLog.thought('session', '❌ MASTER SESSION: Failed to load', { error: err.message });
      setError(`Kunde inte ladda onboarding: ${err.message}`);
    }
  }, [getToken, getUserId]);
  
  // ══════════════════════════════════════════════════════════════════
  // NEW SESSION (User klickar "Ny Onboarding Session")
  // ══════════════════════════════════════════════════════════════════
  const onNewSession = useCallback(() => {
    debugLog.thought('session', '✨ MASTER SESSION: User chose new session');
    
    // Clear old localStorage IDs
    localStorage.removeItem('onboarding_id');
    localStorage.removeItem('current_company_id');
    localStorage.removeItem('current_company_name');
    localStorage.removeItem('current_orgnr');
    localStorage.removeItem('resume_mode');
    
    setSession({
      companyId: null,
      caseId: null,
      isNewSession: true
    });
    
    setPhase(PHASES.READY);
  }, []);
  
  // ══════════════════════════════════════════════════════════════════
  // DISMISS MODAL (User klickar X eller ESC) - Same as new session
  // ══════════════════════════════════════════════════════════════════
  const onDismissModal = useCallback(() => {
    debugLog.thought('session', '❌ MASTER SESSION: User dismissed modal → starting new session');
    onNewSession();
  }, [onNewSession]);
  
  // ══════════════════════════════════════════════════════════════════
  // DELETE ONBOARDING (User klickar "Radera")
  // ══════════════════════════════════════════════════════════════════
  const onDelete = useCallback(async (selected) => {
    const token = getToken();
    const userId = getUserId();
    
    debugLog.thought('session', '🗑️ MASTER SESSION: User deleting onboarding', {
      company_id: selected.company_id,
      case_id: selected.case_id
    });
    
    try {
      const companyId = selected.company_id;
      const caseId = selected.case_id || selected.onboardingId;
      
      const response = await fetch(
        `${API_BASE}/onboarding/delete/${companyId}?onboarding_id=${caseId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      debugLog.thought('session', '✅ MASTER SESSION: Deleted successfully');
      
      // Clear cached data for this case
      clearStorageKeys({ userId, companyId, caseId });
      
      if (!isMounted.current) return;
      
      // Remove from list
      setOnboardings(prev => {
        const updated = prev.filter(c => 
          c.company_id !== companyId || c.case_id !== caseId
        );
        
        // If no more onboardings, go to new session
        if (updated.length === 0) {
          setSession({ companyId: null, caseId: null, isNewSession: true });
          setPhase(PHASES.READY);
        }
        
        return updated;
      });
      
      return true;
    } catch (err) {
      console.error('❌ useOnboardingSession: Failed to delete:', err);
      debugLog.thought('session', '❌ MASTER SESSION: Delete failed', { error: err.message });
      throw err; // Re-throw so caller can show error
    }
  }, [getToken, getUserId]);
  
  // ══════════════════════════════════════════════════════════════════
  // INITIAL FETCH ON MOUNT
  // ══════════════════════════════════════════════════════════════════
  useEffect(() => {
    isMounted.current = true;
    
    // Prevent double-fetch (React Strict Mode)
    if (hasFetched.current) return;
    hasFetched.current = true;
    
    // CHECK 1: Om det redan finns en aktiv session i localStorage, hoppa över modal
    const existingCompanyId = localStorage.getItem('current_company_id');
    const existingCaseId = localStorage.getItem('onboarding_id');
    
    if (existingCompanyId && existingCaseId) {
      debugLog.thought('session', '🔄 MASTER SESSION: Active session found in localStorage, skipping modal', {
        companyId: existingCompanyId,
        caseId: existingCaseId
      });
      
      // Hämta metadata från localStorage om det finns
      const savedStep = localStorage.getItem('current_step');
      const savedCompanyName = localStorage.getItem('current_company_name');
      
      setSession({
        companyId: existingCompanyId,
        caseId: existingCaseId,
        currentStep: savedStep || 'uppdragsval',
        companyName: savedCompanyName || '',
        isNewSession: false
      });
      setPhase(PHASES.READY);
      return;
    }
    
    // CHECK 2: Om URL har companyId/caseId params, hoppa över modal
    // (Hanteras av URL-routing, men vi kan kolla pathname här för extra säkerhet)
    const pathname = window.location.pathname;
    const urlMatch = pathname.match(/\/(uppdragsval|riskfragor|identitetskontroll|verksamhet|agarstruktur|styrelse|riskindikatorer|ovriga-data)\/([^/]+)(?:\/([^/]+))?/);
    
    if (urlMatch && urlMatch[2]) {
      debugLog.thought('session', '🔄 MASTER SESSION: Session in URL, skipping modal', {
        step: urlMatch[1],
        companyId: urlMatch[2],
        caseId: urlMatch[3]
      });
      
      setSession({
        companyId: urlMatch[2],
        caseId: urlMatch[3] || null,
        currentStep: urlMatch[1],
        isNewSession: false
      });
      setPhase(PHASES.READY);
      return;
    }
    
    // Ingen aktiv session - hämta lista och visa modal om det finns pågående
    fetchOnboardingList();
    
    return () => {
      isMounted.current = false;
    };
  }, [fetchOnboardingList]);
  
  // ══════════════════════════════════════════════════════════════════
  // RETURN
  // ══════════════════════════════════════════════════════════════════
  return {
    // Phase state machine
    phase,
    
    // Data
    onboardings,      // List for modal
    session,          // Selected session (or new session)
    error,
    
    // Actions
    onSelectOnboarding,
    onNewSession,
    onDelete,
    onDismissModal,   // Close modal without selection
    
    // Helpers
    isChecking: phase === PHASES.CHECKING,
    showResumeModal: phase === PHASES.SHOW_RESUME_MODAL,
    isReady: phase === PHASES.READY,
    
    // Re-fetch (if needed)
    refetch: () => {
      hasFetched.current = false;
      setPhase(PHASES.CHECKING);
      fetchOnboardingList();
    }
  };
};

export default useOnboardingSession;
