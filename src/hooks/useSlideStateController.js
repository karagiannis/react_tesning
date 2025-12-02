/**
 * CREATED: 2025-11-30
 * PURPOSE: MASTER hook för slide data - bestämmer initial data innan form renderar
 * 
 * ARKITEKTUR:
 * ┌─────────────────────────────────────────────────────────────────┐
 * │  useSlideStateController (MASTER)                                │
 * │  ─────────────────────────────────────                          │
 * │  • Triggas vid sidrender                                        │
 * │  • Hämtar serverdata → lokal variabel                           │
 * │  • Läser localStorage → lokal variabel                          │
 * │  • Jämför och beslutar vilken som ska användas                  │
 * │  • Returnerar: { initialData, isReady, source, metadata }       │
 * └──────────────────────────┬──────────────────────────────────────┘
 *                            │ initialData (när ready)
 *                            ▼
 * ┌─────────────────────────────────────────────────────────────────┐
 * │  useQuestionnaireForm (SLAVE)                                    │
 * │  ─────────────────────────────                                  │
 * │  • Tar emot initialData som parameter                           │
 * │  • Hanterar ENDAST form-state och onChange                      │
 * │  • Auto-save är nu säker (körs bara efter initialData satt)     │
 * └─────────────────────────────────────────────────────────────────┘
 * 
 * VARFÖR DENNA SEPARATION?
 * ─────────────────────────
 * BUG: Auto-save triggades INNAN data laddats från server/localStorage
 * 
 * FÖRE (useQuestionnaireForm ensam):
 *   1. useState({}) → tom formData
 *   2. useEffect för auto-save ser formData ändras → SPARAR TOM DATA! ❌
 *   3. useEffect för load hämtar server data → för sent
 * 
 * EFTER (MASTER/SLAVE):
 *   1. useSlideStateController hämtar allt först
 *   2. Returnerar isReady=true ENDAST när data är klar
 *   3. useQuestionnaireForm får initialData → auto-save är säker ✅
 * 
 * REF: CHANGELOG_2025-11-30.md - Race Condition Bug Discovery
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { API_URL as API_BASE } from '../config/api';
import { debugLog } from '../utils/debugLogger';
import { buildStorageKey } from '../utils/storageKeys';

/**
 * MASTER hook - hämtar och bestämmer initial data för en slide
 * 
 * @param {string} slideKey - Slide identifierare (t.ex. "riskfragor_steg1")
 * @returns {Object} - { initialData, isReady, source, metadata, error, refetch }
 * 
 * @example
 * const { initialData, isReady, source, metadata } = useSlideStateController('riskfragor_steg1');
 * 
 * if (!isReady) {
 *   return <LoadingSpinner />;
 * }
 * 
 * // Nu är initialData garanterat korrekt
 * const { formData, updateQuestion } = useQuestionnaireForm(slideKey, config, initialData);
 */
export const useSlideStateController = (slideKey) => {
  // ══════════════════════════════════════════════════════════════════
  // STATE
  // ══════════════════════════════════════════════════════════════════
  const [isReady, setIsReady] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [source, setSource] = useState(null); // 'server' | 'localStorage' | 'empty'
  const [error, setError] = useState(null);
  
  // Prevent double-fetching (React Strict Mode, etc.)
  const isMounted = useRef(true);
  // 🆕 2025-12-01: Track vilken fetchKey vi senast hämtade för
  const lastFetchKey = useRef(null);
  
  // ══════════════════════════════════════════════════════════════════
  // EXTRACT IDs
  // Priority: 1. URL query param (?case=xxx) 2. URL path param 3. localStorage
  // ══════════════════════════════════════════════════════════════════
  const urlParams = useParams();
  const [searchParams] = useSearchParams();
  
  // 🆕 2025-12-01: Read caseId from URL query parameter first
  const getCaseId = () => {
    // Priority 1: URL query param ?case=xxx
    const queryCase = searchParams.get('case');
    if (queryCase) return queryCase;
    
    // Priority 2: URL path param (for /onboarding/:companyId/:caseId routes)
    if (urlParams.caseId) return urlParams.caseId;
    
    // Priority 3: localStorage (legacy fallback)
    const stored = localStorage.getItem('onboarding_id');
    if (stored && stored !== 'null' && stored !== 'undefined') return stored;
    
    // Priority 4: temp_case_id from login
    const tempCaseId = localStorage.getItem('temp_case_id');
    if (tempCaseId) return tempCaseId;
    
    return 'draft';
  };
  
  const getEffectiveId = (urlValue, localStorageKey) => {
    if (urlValue) return urlValue;
    const stored = localStorage.getItem(localStorageKey);
    if (stored && stored !== 'null' && stored !== 'undefined') return stored;
    return 'draft';
  };
  
  const effectiveCompanyId = getEffectiveId(urlParams.companyId, 'current_company_id');
  const effectiveCaseId = getCaseId(); // 🆕 Using new getCaseId function
  
  // Extract userId from JWT
  const getUserId = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return 'anonymous';
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded.sub || decoded.user_id || decoded.email || 'anonymous';
    } catch {
      return 'anonymous';
    }
  };
  
  const userId = getUserId();
  
  // Build storage key
  const storageKey = buildStorageKey({
    userId,
    companyId: effectiveCompanyId,
    caseId: effectiveCaseId,
    slideKey,
    type: 'data'
  });
  
  // ══════════════════════════════════════════════════════════════════
  // HELPER: Read from localStorage
  // ══════════════════════════════════════════════════════════════════
  const readFromStorage = useCallback((key) => {
    try {
      const cached = localStorage.getItem(key);
      if (!cached) return null;
      
      const parsed = JSON.parse(cached);
      // Handle both old format (raw value) and new format (wrapped with version)
      if (parsed.version !== undefined) {
        return parsed; // New format: { value, version, timestamp }
      }
      return { value: parsed, version: 0, timestamp: null };
    } catch (e) {
      console.error(`❌ localStorage parse error for ${key}:`, e);
      return null;
    }
  }, []);
  
  // ══════════════════════════════════════════════════════════════════
  // HELPER: Get auth token
  // ══════════════════════════════════════════════════════════════════
  const getToken = useCallback(() => {
    return localStorage.getItem('accessToken') || '';
  }, []);
  
  // ══════════════════════════════════════════════════════════════════
  // MAIN EFFECT: Fetch and decide initial data
  // ══════════════════════════════════════════════════════════════════
  
  // 🆕 2025-12-01: Beräkna fetchKey för att förhindra race condition
  // Problemet: useEffect körde fetchAndDecide() parallellt flera gånger 
  const fetchKey = `${slideKey}::${effectiveCompanyId}::${effectiveCaseId}`;
  
  useEffect(() => {
    // Reset isMounted for this effect run
    isMounted.current = true;
    
    // 🆕 KRITISK FIX: Kolla om vi redan har hämtat för denna exakta kombination
    // Om fetchKey inte ändrats, skippa (förhindrar dubbla körningar)
    if (lastFetchKey.current === fetchKey && isReady) {
      debugLog.thought(slideKey, '⏭️ MASTER: Already fetched for this key, skipping', { fetchKey });
      return;
    }
    
    // Reset state on slideKey/case change
    setIsReady(false);
    setInitialData(null);
    setSource(null);
    setError(null);
    
    const fetchAndDecide = async () => {
      // 🆕 Dubbel-check: Om någon annan effect-instans redan startat
      if (lastFetchKey.current === fetchKey) {
        debugLog.thought(slideKey, '⏭️ MASTER: Fetch already in progress, skipping');
        return;
      }
      lastFetchKey.current = fetchKey;
      
      debugLog.thought(slideKey, '🎯 MASTER: Starting fetch and decide sequence', {
        companyId: effectiveCompanyId,
        caseId: effectiveCaseId,
        storageKey
      });
      
      // ════════════════════════════════════════════════════════════
      // CASE 1: Draft mode (no server case yet)
      // ════════════════════════════════════════════════════════════
      if (effectiveCompanyId === 'draft' || effectiveCaseId === 'draft') {
        debugLog.thought(slideKey, '📝 MASTER: Draft mode - using localStorage only');
        
        const localData = readFromStorage(storageKey);
        
        if (localData?.value) {
          debugLog.thought(slideKey, '✅ MASTER: Found draft in localStorage', {
            version: localData.version,
            keys: Object.keys(localData.value)
          });
          setInitialData(localData.value);
          setSource('localStorage');
        } else {
          debugLog.thought(slideKey, '📭 MASTER: No draft found - starting empty');
          setInitialData({});
          setSource('empty');
        }
        
        setIsReady(true);
        return;
      }
      
      // ════════════════════════════════════════════════════════════
      // CASE 2: Has case - fetch from server
      // ════════════════════════════════════════════════════════════
      let serverData = null;
      let serverMetadata = null;
      let serverVersion = 0;
      
      try {
        const resumeUrl = `${API_BASE}/onboarding/resume/${effectiveCompanyId}?onboarding_id=${effectiveCaseId}`;
        
        debugLog.thought(slideKey, '🌐 MASTER: Fetching from server...', { url: resumeUrl });
        
        const response = await fetch(resumeUrl, {
          headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }
        
        serverMetadata = await response.json();
        serverVersion = serverMetadata.version || 0;
        
        debugLog.thought(slideKey, '✅ MASTER: Server responded', {
          version: serverVersion,
          is_locked: serverMetadata.is_locked,
          hasStaticKyc: !!serverMetadata.static_kyc,
          hasData: !!serverMetadata.data
        });
        
        // Extract slide data from server metadata
        // Check multiple locations where data might be
        serverData = 
          serverMetadata.static_kyc?.[slideKey] ||
          serverMetadata.data?.[slideKey] ||
          serverMetadata.services?.[slideKey]?.data ||
          null;
        
        if (serverData) {
          debugLog.thought(slideKey, '📦 MASTER: Found slide data in server response', {
            keys: Object.keys(serverData)
          });
        } else {
          debugLog.thought(slideKey, '📭 MASTER: No slide data in server response');
        }
        
        // Store metadata
        if (isMounted.current) {
          setMetadata(serverMetadata);
        }
        
      } catch (e) {
        debugLog.thought(slideKey, '❌ MASTER: Server fetch failed', { error: e.message });
        setError(e.message);
        // Continue - will fallback to localStorage
      }
      
      // ════════════════════════════════════════════════════════════
      // Read localStorage
      // ════════════════════════════════════════════════════════════
      const localData = readFromStorage(storageKey);
      const localVersion = localData?.version || 0;
      
      if (localData?.value) {
        debugLog.thought(slideKey, '💾 MASTER: Found localStorage data', {
          version: localVersion,
          keys: Object.keys(localData.value)
        });
      } else {
        debugLog.thought(slideKey, '📭 MASTER: No localStorage data found');
      }
      
      // ════════════════════════════════════════════════════════════
      // DECISION: Compare and choose
      // ════════════════════════════════════════════════════════════
      debugLog.thought(slideKey, '🤔 MASTER: Making decision...', {
        serverHasData: !!serverData,
        serverVersion,
        localHasData: !!localData?.value,
        localVersion
      });
      
      let chosenData = null;
      let chosenSource = 'empty';
      
      if (serverData && localData?.value) {
        // Both have data - compare versions
        if (localVersion > serverVersion) {
          // Local is ahead - use local (unsaved changes)
          debugLog.thought(slideKey, '🔄 MASTER: Local version ahead → using localStorage', {
            localVersion,
            serverVersion
          });
          chosenData = localData.value;
          chosenSource = 'localStorage';
        } else {
          // Server is same or ahead - use server
          debugLog.thought(slideKey, '☁️ MASTER: Server version >= local → using server', {
            localVersion,
            serverVersion
          });
          chosenData = serverData;
          chosenSource = 'server';
        }
      } else if (serverData) {
        // Only server has data
        debugLog.thought(slideKey, '☁️ MASTER: Only server has data → using server');
        chosenData = serverData;
        chosenSource = 'server';
      } else if (localData?.value) {
        // Only localStorage has data
        debugLog.thought(slideKey, '💾 MASTER: Only localStorage has data → using localStorage');
        chosenData = localData.value;
        chosenSource = 'localStorage';
      } else {
        // Neither has data - start fresh
        debugLog.thought(slideKey, '✨ MASTER: No data anywhere → starting fresh');
        chosenData = {};
        chosenSource = 'empty';
      }
      
      // ════════════════════════════════════════════════════════════
      // SET FINAL STATE
      // ════════════════════════════════════════════════════════════
      if (isMounted.current) {
        debugLog.thought(slideKey, '🏁 MASTER: Decision complete!', {
          source: chosenSource,
          dataKeys: Object.keys(chosenData || {})
        });
        
        setInitialData(chosenData);
        setSource(chosenSource);
        setIsReady(true);
      }
    };
    
    fetchAndDecide();
    
    // Cleanup
    return () => {
      isMounted.current = false;
    };
  }, [slideKey, effectiveCompanyId, effectiveCaseId, storageKey, getToken, readFromStorage, fetchKey, isReady]);
  
  // ══════════════════════════════════════════════════════════════════
  // REFETCH: Allow manual refetch
  // ══════════════════════════════════════════════════════════════════
  const refetch = useCallback(() => {
    lastFetchKey.current = null; // 🆕 Reset fetch key to allow re-fetch
    setIsReady(false);
    setInitialData(null);
    setSource(null);
    setError(null);
    // Effect will re-run because deps haven't changed, so we force it
    // by updating a dummy state (not ideal but works)
  }, []);
  
  // ══════════════════════════════════════════════════════════════════
  // RETURN
  // ══════════════════════════════════════════════════════════════════
  return {
    // Core data
    initialData,      // The data to use (null until ready)
    isReady,          // true when decision is made
    
    // Context
    source,           // 'server' | 'localStorage' | 'empty'
    metadata,         // Full case metadata from server
    error,            // Error message if fetch failed
    
    // Helpers
    refetch,          // Force refetch
    
    // IDs for debugging
    companyId: effectiveCompanyId,
    caseId: effectiveCaseId,
    userId,
    storageKey
  };
};

export default useSlideStateController;
