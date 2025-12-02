/**
 * CREATED: 2025-11-23
 * UPDATED: 2025-11-24 - Decision tree med server sync + version control
 * UPDATED: 2025-11-25 - Använder useParams för company_id (multi-tab safe)
 * UPDATED: 2025-11-25 - case_id support + "draft" mode för nya onboardings
 * UPDATED: 2025-11-27 - STATE MACHINE REFACTOR: Behavior driven by metadata.state
 * UPDATED: 2025-11-29 - REMOVED DUPLICATE /resume fetch - use metadata from first call
 * UPDATED: 2025-11-29 - GIT-LIKNANDE VERSIONERING: based_on_version + 409 CONFLICT
 * UPDATED: 2025-11-30 - DEBUG LOGGER: Aktivera med VITE_DEBUG_MODE=true i .env.development
 * UPDATED: 2025-11-30 - NAMESPACED STORAGE KEYS: Använder :: som separator för multi-tab/user
 * UPDATED: 2025-11-30 - RACE CONDITION FIX: Refaktorerad till SLAVE hook
 * PURPOSE: Generic hook for form data persistence with state machine architecture
 * FEATURES: Auto-load, auto-save, multi-tab sync, state-driven behavior, version control
 * REF: CHANGELOG_2025-11-26.md - State Machine Refactor
 * REF: CHANGELOG_2025-11-29.md - Git-liknande Versionering
 * REF: CHANGELOG_2025-11-30.md - Namespaced Storage Keys + MASTER/SLAVE Race Condition Fix
 * 
 * ======================== REFAKTORERAD FÖR RACE CONDITION FIX ========================
 * 
 * TIDIGARE (BUG): 
 *   - Hook hämtade data SJÄLV i useEffect
 *   - formData = {} initialt
 *   - Auto-save triggas av formData change
 *   - Auto-save skriver {} INNAN data laddats = RACE CONDITION
 * 
 * NU (FIXED):
 *   - Tar emot initialData från useSlideStateController (MASTER)
 *   - Sätter formData ENDAST när isReady=true
 *   - Auto-save körs ENDAST om initialDataApplied=true
 *   - Ingen egen laddningslogik
 * 
 * ANVÄNDNING:
 *   const { initialData, isReady, source, metadata } = useSlideStateController(slideKey);
 *   const form = useQuestionnaireForm(slideKey, questionConfig, { 
 *     initialData,          // Data från MASTER
 *     isReady,              // MASTER är klar
 *     source,               // 'server' | 'localStorage' | 'empty'
 *     caseMetadata: metadata 
 *   });
 * 
 * ====================================================================================
 */

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { getStateMachineBehavior, FORM_STATES } from './useOnboardingStateMachine';
import { API_URL as API_BASE } from '../config/api';
import { debugLog } from '../utils/debugLogger';
import { buildStorageKey, parseStorageKey, clearStorageKeys, findStorageKeys } from '../utils/storageKeys';

/**
 * Generic hook för formulärdata med state machine architecture
 * 
 * 🔄 SLAVE HOOK - Tar emot initialData från useSlideStateController (MASTER)
 * 
 * @param {string} slideKey - Unik identifierare för slide (t.ex. "riskfragor_steg2")
 * @param {Object} questionConfig - Config från QUESTIONNAIRE_CONFIG
 * @param {Object} masterData - Data från useSlideStateController (MASTER)
 * @param {Object} masterData.initialData - Initial form data (från server eller localStorage)
 * @param {boolean} masterData.isReady - Om MASTER är klar att leverera data
 * @param {string} masterData.source - Källa: 'server' | 'localStorage' | 'empty'
 * @param {Object} masterData.caseMetadata - Case metadata från server
 * @returns {Object} - { formData, formState, canEdit, updateQuestion, isValid, errors, resetForm, pushToServer }
 */
export const useQuestionnaireForm = (slideKey, questionConfig, masterData = {}) => {
  // Validate inputs
  if (!slideKey || !questionConfig) {
    throw new Error('useQuestionnaireForm requires slideKey and questionConfig');
  }
  
  // 🆕 MASTER/SLAVE: Extrahera data från MASTER hook
  const { 
    initialData = null, 
    isReady = false, 
    source = 'empty',
    caseMetadata: masterMetadata = null 
  } = masterData;
  
  // Get company_id AND case_id from URL params OR localStorage
  // Priority: URL query params > URL path params > localStorage > 'draft'
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
  
  const getEffectiveId = (urlValue, localStorageKey, idType) => {
    if (urlValue) return urlValue;
    const stored = localStorage.getItem(localStorageKey);
    if (stored && stored !== 'null' && stored !== 'undefined') return stored;
    return 'draft';
  };
  
  const effectiveCompanyId = getEffectiveId(urlParams.companyId, 'current_company_id', 'companyId');
  const effectiveCaseId = getCaseId(); // 🆕 Using new getCaseId function
  
  // Extract userId from JWT token  
  const getUserId = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return 'anonymous';
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded.sub || decoded.user_id || decoded.email || 'anonymous';
    } catch (e) {
      console.error('Failed to decode JWT:', e);
      return 'anonymous';
    }
  };
  
  const userId = getUserId();
  
  // Build storage key using effective IDs
  // 🆕 NAMESPACED: Använder :: som separator för att undvika UUID-kollision
  // Format: onboarding_data::{userId}::{companyId}::{caseId}::{slideKey}
  const storageKey = buildStorageKey({
    userId,
    companyId: effectiveCompanyId,
    caseId: effectiveCaseId,
    slideKey,
    type: 'data'
  });
  
  console.log(`🔑 Cache key for ${slideKey}:`, storageKey);
  console.log(`   userId: ${userId}`);
  console.log(`   companyId: ${effectiveCompanyId} (from ${urlParams.companyId ? 'URL' : 'localStorage'})`);
  console.log(`   caseId: ${effectiveCaseId} (from ${urlParams.caseId ? 'URL' : 'localStorage'})`);
  
  // 🆕 RACE CONDITION FIX: Track om initialData har applicerats
  // Auto-save körs ENDAST om denna är true
  const initialDataAppliedRef = useRef(false);
  const [initialDataApplied, setInitialDataApplied] = useState(false);
  
  // State - UTAN initial server fetch (det gör MASTER nu)
  const [formData, setFormData] = useState({});
  
  const [formState, setFormState] = useState('loading'); // State machine state
  const [caseMetadata, setCaseMetadata] = useState(null); // Case metadata from server
  const [isLoading, setIsLoading] = useState(true);
  
  // 🆕 VERSION CONTROL STATE
  const [localVersion, setLocalVersion] = useState(0); // Case-level version
  const [conflictInfo, setConflictInfo] = useState(null); // Conflict data for modal
  const [isSaving, setIsSaving] = useState(false); // Prevent double-saves

  // Helper: Get auth token
  const getToken = () => {
    return localStorage.getItem('accessToken') || 'mock-token';
  };

  // Helper: Läs från localStorage with version
  const readFromStorage = (key) => {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    
    try {
      const parsed = JSON.parse(cached);
      if (parsed.version === undefined) {
        return {
          value: parsed,
          version: 0,
          timestamp: new Date(0).toISOString()
        };
      }
      return parsed;
    } catch (e) {
      console.error(`❌ localStorage parse error for ${key}:`, e);
      return null;
    }
  };

  // Helper: Skriv till localStorage with version
  const writeToStorage = (key, value, version) => {
    const wrapped = {
      value,
      version,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(key, JSON.stringify(wrapped));
  };

  // ======================== MASTER/SLAVE DATA APPLICATION ========================
  // 🆕 RACE CONDITION FIX: Applicera initialData från MASTER när isReady=true
  // Detta ersätter den gamla loadData() useEffect som orsakade race condition
  useEffect(() => {
    // Vänta tills MASTER har levererat data
    if (!isReady) {
      debugLog.thought(slideKey, '⏳ Waiting for MASTER to deliver initialData...', {
        isReady,
        hasInitialData: !!initialData,
        source
      });
      return;
    }
    
    // Förhindra dubbel-applicering
    if (initialDataAppliedRef.current) {
      debugLog.thought(slideKey, '⚠️ InitialData already applied, skipping');
      return;
    }
    
    debugLog.thought(slideKey, '🎯 MASTER is ready! Applying initialData', {
      source,
      hasInitialData: !!initialData,
      initialDataKeys: initialData ? Object.keys(initialData) : []
    });
    
    // Applicera initialData från MASTER
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(initialData);
      debugLog.thought(slideKey, '✅ Form data set from MASTER initialData', initialData);
    } else {
      // Inget data - börja med tomt formulär
      const emptyData = {};
      const questions = questionConfig.questions || questionConfig;
      Object.keys(questions).forEach(qId => {
        emptyData[qId] = null;
      });
      setFormData(emptyData);
      debugLog.thought(slideKey, '📝 No initialData - form starts empty');
    }
    
    // Applicera metadata från MASTER
    if (masterMetadata) {
      setCaseMetadata(masterMetadata);
      if (masterMetadata.version !== undefined) {
        setLocalVersion(masterMetadata.version);
      }
      debugLog.thought(slideKey, '📋 Applied caseMetadata from MASTER', {
        version: masterMetadata.version,
        is_locked: masterMetadata.is_locked
      });
    }
    
    // Markera att initialData är applicerat - KRITISKT för race condition fix
    initialDataAppliedRef.current = true;
    setInitialDataApplied(true);
    setFormState('ready');
    setIsLoading(false);
    
    debugLog.thought(slideKey, '🏁 SLAVE initialization complete!', {
      source,
      initialDataApplied: true,
      formState: 'ready'
    });
    
  }, [isReady, initialData, source, masterMetadata, slideKey, questionConfig]);

  // 🆕 Draft key för localStorage (separerad från permanent cache)
  // Format: onboarding_draft::{userId}::{companyId}::{caseId}::{slideKey}
  const draftKey = buildStorageKey({
    userId,
    companyId: effectiveCompanyId,
    caseId: effectiveCaseId,
    slideKey,
    type: 'draft'
  });

  // Auto-save to localStorage when formData changes (only if editable)
  // 🆕 RACE CONDITION FIX: Kör ENDAST om initialDataApplied=true
  // Detta förhindrar att tom data skrivs innan MASTER levererat data
  const canSaveDraft = formState === 'ready' && initialDataApplied;
  
  useEffect(() => {
    console.log(`🔍 Draft save check for ${slideKey}: formState=${formState}, initialDataApplied=${initialDataApplied}, canSaveDraft=${canSaveDraft}`);
    
    // 🆕 KRITISK: Vänta tills initialData är applicerat
    if (!initialDataApplied) {
      debugLog.thought(slideKey, '⏳ Auto-save blocked - waiting for initialData', {
        initialDataApplied,
        formState
      });
      return;
    }
    
    if (!isLoading && canSaveDraft) {
      // 🧠 THOUGHT: Auto-saving draft
      debugLog.thought(slideKey, '💾 Auto-saving draft to localStorage', {
        basedOnVersion: localVersion,
        formDataKeys: Object.keys(formData || {}),
        initialDataApplied: true  // Bekräfta att vi passerat race condition check
      });
      
      // Spara draft med version info för conflict detection
      const draftData = {
        data: formData,
        basedOnVersion: localVersion,
        savedAt: Date.now(),
        slideKey
      };
      localStorage.setItem(draftKey, JSON.stringify(draftData));
      
      console.log(`💾 Auto-saved ${slideKey} draft (based on v${localVersion})`);
    }
  }, [formData, slideKey, isLoading, canSaveDraft, storageKey, localVersion, draftKey, initialDataApplied]);

  // 🆕 Rensa draft efter lyckad save
  const clearDraft = useCallback(() => {
    localStorage.removeItem(draftKey);
    console.log(`🗑️ Cleared draft for ${slideKey}`);
  }, [draftKey, slideKey]);

  /**
   * Uppdatera en fråga (SIMPLIFIED: no wrapping)
   * @param {string} questionId - Question ID (t.ex. "entireForm")
   * @param {any} value - Data to store directly
   */
  const updateQuestion = (questionId, value) => {
    setFormData(prev => ({
      ...prev,
      [questionId]: value
    }));
    console.log(`✏️ Updated ${questionId}:`, value);
  };

  /**
   * Validera formulär baserat på required-flaggor i config
   * @returns {boolean} - true om alla required frågor är besvarade
   */
  const isValid = () => {
    const questions = questionConfig.questions || questionConfig;
    return Object.entries(questions).every(([qId, qConfig]) => {
      // Skip om ej required
      if (!qConfig.required) return true;
      
      const answer = formData[qId];
      if (!answer) {
        console.log(`❌ Validation failed: ${qId} is required but not answered`);
        return false;
      }
      
      return true;
    });
  };

  /**
   * Samla valideringsfel för varje fråga
   * @returns {Object} - Map av questionId -> error message
   */
  const getErrors = () => {
    const errors = {};
    const questions = questionConfig.questions || questionConfig;
    
    Object.entries(questions).forEach(([qId, qConfig]) => {
      if (qConfig.required && !formData[qId]) {
        errors[qId] = "Detta fält är obligatoriskt";
      }
    });
    
    return errors;
  };

  /**
   * Rensa formulärdata (t.ex. vid ny session)
   */
  const resetForm = () => {
    const initialData = {};
    const questions = questionConfig.questions || questionConfig;
    Object.keys(questions).forEach(qId => {
      initialData[qId] = null;
    });
    setFormData(initialData);
    console.log(`🔄 Reset form data for ${slideKey}`);
  };

  /**
   * Git-liknande "push" till server med version check
   * 
   * VERSION CONTROL:
   * - Skickar based_on_version för conflict detection
   * - Vid 409 CONFLICT: Sätter conflictInfo för modal
   * - Vid success: Uppdaterar localVersion
   * 
   * @param {Object} options - { force: boolean } för att tvinga save
   * @returns {Promise<{success: boolean, conflict?: Object, error?: string}>}
   */
  const pushToServer = useCallback(async (options = {}) => {
    const { force = false } = options;
    
    // Skip if in draft mode (no case created yet)
    if (effectiveCompanyId === 'draft' || effectiveCaseId === 'draft') {
      debugLog.thought(slideKey, '📝 Draft mode - not pushing to server yet');
      console.log(`[${slideKey}] 📝 Draft mode - not pushing to server yet`);
      return { success: true }; // Success (saved locally)
    }
    
    // Check if state allows editing
    if (!canEdit && !force) {
      debugLog.thought(slideKey, `⚠️ Cannot push - form is in ${formState} state (read-only)`);
      console.warn(`[${slideKey}] ⚠️ Cannot push - form is in ${formState} state`);
      return { success: false, error: 'Form is read-only' };
    }
    
    // Prevent double-saves
    if (isSaving) {
      debugLog.thought(slideKey, '⏳ Already saving, skipping duplicate request');
      console.log(`[${slideKey}] ⏳ Already saving, skipping...`);
      return { success: false, error: 'Already saving' };
    }
    
    debugLog.thought(slideKey, '🚀 Starting push to server...', {
      force,
      basedOnVersion: localVersion
    });
    
    setIsSaving(true);
    
    const requestUrl = `${API_BASE}/onboarding/${effectiveCompanyId}/${slideKey}`;
    const requestBody = { 
      data: formData,
      onboarding_id: effectiveCaseId,
      // 🆕 Git-liknande version control
      based_on_version: force ? null : localVersion,
      force: force
    };
    
    // 🆕 DEBUG: Log outgoing request
    debugLog.networkRequest('POST', requestUrl, requestBody, null, null);
    
    try {
      const response = await fetch(
        requestUrl, 
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        }
      );

      // 🆕 409 CONFLICT - Någon annan har sparat under tiden
      if (response.status === 409) {
        const conflict = await response.json();
        debugLog.thought(slideKey, '⚠️ VERSION CONFLICT! Server has newer data', conflict);
        console.warn(`[${slideKey}] ⚠️ Version conflict!`, {
          yourVersion: conflict.your_version,
          serverVersion: conflict.server_version,
          conflictingSlides: conflict.conflicting_slides
        });
        
        // Sätt conflict info för modal
        setConflictInfo({
          ...conflict,
          yourData: formData,
          slideKey,
          onResolve: async (resolution) => {
            if (resolution === 'reload') {
              // Ladda om från server
              window.location.reload();
            } else if (resolution === 'force') {
              // Force push - skriv över servern
              setConflictInfo(null);
              return pushToServer({ force: true });
            } else if (resolution === 'cancel') {
              // Avbryt - behåll lokal data men gör inget
              setConflictInfo(null);
            }
          }
        });
        
        return { success: false, conflict };
      }

      if (response.ok) {
        const json = await response.json();
        
        // 🆕 DEBUG: Log successful response
        debugLog.networkRequest('POST', requestUrl, null, json, response.status);
        debugLog.thought(slideKey, '✅ Successfully pushed to server!', {
          newVersion: json.new_version,
          modifiedBy: json.modified_by
        });
        
        // 🆕 Uppdatera lokal version efter lyckad save
        if (json.new_version !== undefined) {
          setLocalVersion(json.new_version);
          console.log(`[${slideKey}] ✅ Version updated: ${localVersion} → ${json.new_version}`);
        }
        
        // Uppdatera localStorage med ny version
        const localData = readFromStorage(storageKey);
        writeToStorage(storageKey, formData, json.new_version || localVersion + 1);
        
        // 🆕 Rensa draft efter lyckad save
        localStorage.removeItem(draftKey);
        
        console.log(`[${slideKey}] ✅ Pushed to server by ${json.modified_by}`);
        return { success: true, newVersion: json.new_version };
      }
      
      const errorText = await response.text();
      debugLog.thought(slideKey, '❌ Server returned error', { status: response.status, error: errorText });
      console.error(`[${slideKey}] ❌ Failed to push to server:`, response.status, errorText);
      return { success: false, error: `Server error: ${response.status}` };
      
    } catch (e) {
      debugLog.thought(slideKey, '❌ Network error during push', { error: e.message });
      console.error(`[${slideKey}] ❌ Failed to push to server:`, e);
      return { success: false, error: e.message };
    } finally {
      setIsSaving(false);
    }
  }, [effectiveCompanyId, effectiveCaseId, slideKey, formData, formState, localVersion, isSaving, storageKey, draftKey]);

  // Derived state: Determine capabilities based on caseMetadata and formState
  // FIXED: canEdit är ALLTID true (förenklad state machine)
  // canEditOrgnr baseras på is_locked från servern
  const canEdit = formState === 'ready';  // Always editable when ready
  const canEditOrgnr = !caseMetadata?.is_locked;  // Only orgnr is locked when is_locked=true
  const shouldShowLockWarning = caseMetadata?.is_locked === true;
  const shouldShowReadOnlyMessage = false;  // Never read-only in simplified model

  // 🆕 Funktion för att stänga conflict modal
  const dismissConflict = useCallback(() => {
    setConflictInfo(null);
  }, []);

  // 🆕 Funktion för att hämta senaste data från server
  const refetchFromServer = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_BASE}/onboarding/resume/${effectiveCompanyId}?onboarding_id=${effectiveCaseId}`,
        {
          headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.ok) {
        const metadata = await response.json();
        setCaseMetadata(metadata);
        
        // Uppdatera version
        if (metadata.version !== undefined) {
          setLocalVersion(metadata.version);
        }
        
        // Ladda slide-data från services
        const slideData = metadata.services?.[slideKey]?.data || 
                         metadata.data?.[slideKey]?.entireForm || 
                         metadata.data?.[slideKey];
        if (slideData) {
          setFormData(slideData.entireForm || slideData);
          writeToStorage(storageKey, slideData.entireForm || slideData, metadata.version || 0);
        }
        
        console.log(`🔄 Refetched ${slideKey} from server (version ${metadata.version})`);
      }
    } catch (e) {
      console.error('Failed to refetch:', e);
    } finally {
      setIsLoading(false);
      setConflictInfo(null);
    }
  }, [effectiveCompanyId, effectiveCaseId, slideKey, storageKey]);

  return {
    formData,
    formState,  // New: Expose state machine state
    canEdit,    // New: Derived permission (always true when ready)
    canEditOrgnr,  // NEW: Specific for orgnr field (false when is_locked)
    shouldShowLockWarning,  // New: UI hint
    shouldShowReadOnlyMessage,  // New: UI hint
    updateQuestion,
    isValid: isValid(),
    errors: getErrors(),
    resetForm,
    isLoading,
    isSaving,  // 🆕 För UI feedback
    pushToServer,
    caseMetadata,  // New: Full case metadata
    // 🆕 Version control exports
    localVersion,
    conflictInfo,
    dismissConflict,
    refetchFromServer,
    // Export IDs för komponenter som behöver dem
    companyId: effectiveCompanyId,
    caseId: effectiveCaseId,
    userId,
    isDraftMode: effectiveCompanyId === 'draft' || effectiveCaseId === 'draft',
    // 🆕 RACE CONDITION FIX: Indikerar om initialData har applicerats
    initialDataApplied,
    // 🆕 MASTER/SLAVE: Källa för initialData
    dataSource: source
  };
};

export default useQuestionnaireForm;
