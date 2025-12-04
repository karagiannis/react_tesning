/**
 * useMasterState Hook
 * 
 * Central state management hook för hela onboarding-applikationen.
 * Körs EN gång i App.jsx och distribuerar state via MasterStateContext.
 * 
 * Ansvar:
 * - Session state (userId, companyId, caseId)
 * - Status flags (hasRoaringData, hasPaid, isLoggedIn)
 * - Asynkron roaring-fetch med polling
 * - Synk med localStorage som backup
 * - Resume modal kontroll
 * 
 * @see /docs/CHANGELOG_2025-12-03.md för arkitektur-dokumentation
 */

import { useState, useEffect, useCallback, useRef } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_BASE_URL}/api`;

/**
 * Hämta userId från JWT token
 */
function getUserIdFromToken() {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;
  
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded.sub || decoded.user_id || decoded.email;
  } catch (e) {
    console.error('Failed to decode token:', e);
    return null;
  }
}

/**
 * Authenticated fetch helper
 */
async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem('accessToken');
  
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      ...options.headers,
    },
  });
}

/**
 * Initial state
 */
const INITIAL_STATE = {
  // Session identifiers
  userId: null,
  companyId: null,
  caseId: null,
  
  // Status flags
  isLoggedIn: false,
  hasActiveCase: false,
  hasRoaringData: false,
  hasPaid: false,
  
  // Roaring fetch status: 'none', 'fetching', 'ready', 'error'
  roaringStatus: 'none',
  
  // Cached data
  caseMetadata: null,
  companyName: null,
  orgnr: null,
  currentStep: null,
  
  // UI state
  showResumeModal: false,
  pendingOnboardings: [],
  
  // Loading states
  isInitializing: true,
  isRefreshing: false,
};

/**
 * useMasterState Hook
 * 
 * @returns {Object} State och actions för master state management
 */
export function useMasterState() {
  const [state, setState] = useState(INITIAL_STATE);
  const pollingRef = useRef(null);
  const timeoutRef = useRef(null);

  // ============================================================
  // INITIALIZATION - Körs vid mount
  // ============================================================
  
  useEffect(() => {
    const initializeState = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        
        if (!token) {
          setState(prev => ({
            ...prev,
            isInitializing: false,
            isLoggedIn: false,
          }));
          return;
        }
        
        const userId = getUserIdFromToken();
        const cachedCompanyId = localStorage.getItem('current_company_id');
        const cachedCaseId = localStorage.getItem('onboarding_id');
        
        setState(prev => ({
          ...prev,
          userId,
          isLoggedIn: true,
          companyId: cachedCompanyId,
          caseId: cachedCaseId,
          hasActiveCase: !!(cachedCompanyId && cachedCaseId),
        }));
        
        // 🆕 2025-12-03: ALLTID kolla pending onboardings vid login
        // Men skicka med current case så vi inte visar modal om vi redan är i det caset
        const hasPending = await checkPendingOnboardings(cachedCompanyId, cachedCaseId);
        
        // Om vi har ett aktivt case OCH inga pending onboardings att visa, refresha case-data
        if (cachedCompanyId && cachedCaseId && !hasPending) {
          await refreshFromServerInternal(cachedCompanyId, cachedCaseId);
        }
      } catch (err) {
        console.error('❌ useMasterState initialization error:', err);
      } finally {
        // ALLTID sätt isInitializing = false
        setState(prev => ({ ...prev, isInitializing: false }));
      }
    };
    
    initializeState();
    
    // Cleanup polling vid unmount
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // ============================================================
  // INTERNAL HELPERS
  // ============================================================
  
  const refreshFromServerInternal = async (companyId, caseId) => {
    try {
      const response = await fetchWithAuth(
        `${API_BASE}/onboarding/resume/${companyId}?onboarding_id=${caseId}`
      );
      
      if (!response.ok) {
        console.warn('Failed to fetch resume data:', response.status);
        return;
      }
      
      const data = await response.json();
      const caseMetadata = data.case_metadata || data;
      
      // 🆕 2025-12-03: Backend now returns has_roaring_data directly
      const hasRoaringData = data.has_roaring_data ?? !!caseMetadata.roaring_data;
      
      setState(prev => ({
        ...prev,
        companyId,
        caseId,
        hasActiveCase: true,
        hasRoaringData,
        hasPaid: caseMetadata.subscription?.status === 'active',
        roaringStatus: hasRoaringData ? 'ready' : prev.roaringStatus,
        caseMetadata,
        companyName: caseMetadata.company_name || data.company_name,
        orgnr: caseMetadata.orgnr || data.orgnr,
        currentStep: caseMetadata.current_step || data.current_step,
      }));
      
      // Synka till localStorage
      localStorage.setItem('current_company_id', companyId);
      localStorage.setItem('onboarding_id', caseId);
      
      // Cache metadata för snabb access
      localStorage.setItem(
        `case-metadata-${caseId}`,
        JSON.stringify(caseMetadata)
      );
      
    } catch (err) {
      console.error('Failed to refresh from server:', err);
    }
  };

  const checkPendingOnboardings = async (currentCompanyId, currentCaseId) => {
    try {
      const response = await fetchWithAuth(`${API_BASE}/onboarding/list`);
      
      if (!response.ok) return false;
      
      const data = await response.json();
      const companies = data.companies || [];
      
      console.log('📋 checkPendingOnboardings: Found', companies.length, 'pending onboardings');
      
      if (companies.length > 0) {
        // 🆕 2025-12-03: Visa INTE modal om vi redan har ett aktivt case som matchar
        // en av de pending onboardings
        const hasMatchingActiveCase = currentCompanyId && currentCaseId && 
          companies.some(c => 
            c.company_id === currentCompanyId && 
            (c.case_id === currentCaseId || c.onboardingId === currentCaseId)
          );
        
        if (hasMatchingActiveCase) {
          console.log('📋 checkPendingOnboardings: Active case matches pending - no modal needed');
          setState(prev => ({
            ...prev,
            pendingOnboardings: companies,
            showResumeModal: false,  // VIKTIGT: Visa INTE modalen
          }));
          return false;
        }
        
        setState(prev => ({
          ...prev,
          pendingOnboardings: companies,
          showResumeModal: true,
        }));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to check pending onboardings:', err);
      return false;
    }
  };

  // ============================================================
  // PUBLIC ACTIONS
  // ============================================================

  /**
   * Hämta senaste state från server
   */
  const refreshFromServer = useCallback(async () => {
    const { companyId, caseId } = state;
    
    if (!companyId || !caseId) {
      console.warn('Cannot refresh: no active case');
      return;
    }
    
    setState(prev => ({ ...prev, isRefreshing: true }));
    await refreshFromServerInternal(companyId, caseId);
    setState(prev => ({ ...prev, isRefreshing: false }));
  }, [state.companyId, state.caseId]);

  /**
   * Sätt aktivt case (anropas från OnboardingResumeDialog)
   */
  const setActiveCase = useCallback(async (companyId, caseId) => {
    setState(prev => ({
      ...prev,
      companyId,
      caseId,
      hasActiveCase: true,
      showResumeModal: false,
    }));
    
    localStorage.setItem('current_company_id', companyId);
    localStorage.setItem('onboarding_id', caseId);
    
    await refreshFromServerInternal(companyId, caseId);
  }, []);

  /**
   * Bekräfta betalning och starta asynkron roaring-fetch
   * Anropas från PaymentSuccessSlide efter Stripe redirect
   */
  const confirmPaymentAndFetchRoaring = useCallback(async (paymentIntentId) => {
    const { companyId, caseId } = state;
    
    if (!companyId || !caseId) {
      console.error('Cannot confirm payment: no active case');
      return;
    }
    
    try {
      // 1. Bekräfta betalning mot backend
      const confirmResponse = await fetchWithAuth(
        `${API_BASE}/onboarding/${companyId}/confirm-payment`,
        {
          method: 'POST',
          body: JSON.stringify({
            case_id: caseId,
            payment_intent_id: paymentIntentId,
          }),
        }
      );
      
      if (!confirmResponse.ok) {
        console.error('Payment confirmation failed');
        return;
      }
      
      // 2. Uppdatera state
      setState(prev => ({
        ...prev,
        hasPaid: true,
        roaringStatus: 'fetching',
      }));
      
      // 3. Starta polling för roaring-data
      startRoaringPolling(companyId, caseId);
      
    } catch (err) {
      console.error('Failed to confirm payment:', err);
      setState(prev => ({ ...prev, roaringStatus: 'error' }));
    }
  }, [state.companyId, state.caseId]);

  /**
   * Polling för roaring-data (körs i bakgrunden)
   */
  const startRoaringPolling = useCallback((companyId, caseId) => {
    // Rensa eventuell befintlig polling
    if (pollingRef.current) clearInterval(pollingRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    console.log('🔄 Starting roaring data polling...');
    
    pollingRef.current = setInterval(async () => {
      try {
        const response = await fetchWithAuth(
          `${API_BASE}/onboarding/resume/${companyId}?onboarding_id=${caseId}`
        );
        
        if (!response.ok) return;
        
        const data = await response.json();
        const caseMetadata = data.case_metadata || data;
        
        if (caseMetadata.roaring_data) {
          console.log('✅ Roaring data received!');
          
          // Stoppa polling
          clearInterval(pollingRef.current);
          clearTimeout(timeoutRef.current);
          pollingRef.current = null;
          timeoutRef.current = null;
          
          // Uppdatera state
          setState(prev => ({
            ...prev,
            roaringStatus: 'ready',
            hasRoaringData: true,
            caseMetadata,
            companyName: caseMetadata.company_name,
            orgnr: caseMetadata.orgnr,
          }));
          
          // Cache till localStorage
          localStorage.setItem(
            `case-metadata-${caseId}`,
            JSON.stringify(caseMetadata)
          );
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 2000); // Poll var 2:a sekund
    
    // Timeout efter 30 sekunder
    timeoutRef.current = setTimeout(() => {
      if (pollingRef.current) {
        console.warn('⏱️ Roaring polling timeout');
        clearInterval(pollingRef.current);
        pollingRef.current = null;
        
        setState(prev => {
          if (prev.roaringStatus === 'fetching') {
            return { ...prev, roaringStatus: 'error' };
          }
          return prev;
        });
      }
    }, 30000);
  }, []);

  /**
   * Rensa session (logout)
   */
  const clearSession = useCallback(() => {
    // Stoppa polling
    if (pollingRef.current) clearInterval(pollingRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    // Rensa localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('current_company_id');
    localStorage.removeItem('onboarding_id');
    
    // Reset state
    setState(INITIAL_STATE);
  }, []);

  /**
   * Visa/dölj resume modal
   */
  const setShowResumeModal = useCallback((show) => {
    setState(prev => ({ ...prev, showResumeModal: show }));
  }, []);

  /**
   * Uppdatera listan över pågående onboardings (publik version av checkPendingOnboardings)
   */
  const refreshPendingOnboardings = useCallback(async () => {
    // Skicka med nuvarande company/case så vi inte visar modal om vi redan är i det caset
    await checkPendingOnboardings(state.companyId, state.caseId);
  }, [state.companyId, state.caseId]);

  /**
   * Radera en onboarding
   */
  const deleteOnboarding = useCallback(async (selected) => {
    try {
      const companyIdToDelete = selected.company_id;
      const caseIdToDelete = selected.case_id || selected.onboardingId;
      
      const response = await fetchWithAuth(
        `${API_BASE}/onboarding/delete/${companyIdToDelete}?onboarding_id=${caseIdToDelete}`,
        {
          method: 'DELETE',
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      console.log('✅ Deleted onboarding successfully');
      
      // Uppdatera listan lokalt
      setState(prev => {
        const updated = prev.pendingOnboardings.filter(c => 
          c.company_id !== companyIdToDelete || c.case_id !== caseIdToDelete
        );
        
        // Om inga kvar, stäng modalen
        if (updated.length === 0) {
          return {
            ...prev,
            pendingOnboardings: updated,
            showResumeModal: false,
          };
        }
        
        return {
          ...prev,
          pendingOnboardings: updated,
        };
      });
      
      // Rensa localStorage för detta case
      localStorage.removeItem(`case-metadata-${caseIdToDelete}`);
      
    } catch (err) {
      console.error('Failed to delete onboarding:', err);
    }
  }, []);

  /**
   * Uppdatera efter login
   */
  const handleLogin = useCallback(async () => {
    const userId = getUserIdFromToken();
    const cachedCompanyId = localStorage.getItem('company_id');
    const cachedCaseId = localStorage.getItem('onboarding_id');
    
    setState(prev => ({
      ...prev,
      userId,
      isLoggedIn: true,
    }));
    
    // Kolla om det finns pågående onboardings, men skicka med current case
    await checkPendingOnboardings(cachedCompanyId, cachedCaseId);
  }, []);

  // ============================================================
  // RETURN
  // ============================================================

  return {
    // State
    ...state,
    
    // Actions
    refreshFromServer,
    setActiveCase,
    confirmPaymentAndFetchRoaring,
    clearSession,
    setShowResumeModal,
    refreshPendingOnboardings,
    deleteOnboarding,
    handleLogin,
  };
}

export default useMasterState;
