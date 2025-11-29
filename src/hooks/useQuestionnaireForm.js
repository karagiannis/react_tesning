/**
 * CREATED: 2025-11-23
 * UPDATED: 2025-11-24 - Decision tree med server sync + version control
 * UPDATED: 2025-11-25 - Använder useParams för company_id (multi-tab safe)
 * UPDATED: 2025-11-25 - case_id support + "draft" mode för nya onboardings
 * UPDATED: 2025-11-27 - STATE MACHINE REFACTOR: Behavior driven by metadata.state
 * UPDATED: 2025-11-29 - REMOVED DUPLICATE /resume fetch - use metadata from first call
 * UPDATED: 2025-11-29 - GIT-LIKNANDE VERSIONERING: based_on_version + 409 CONFLICT
 * PURPOSE: Generic hook for form data persistence with state machine architecture
 * FEATURES: Auto-load, auto-save, multi-tab sync, state-driven behavior, version control
 * REF: CHANGELOG_2025-11-26.md - State Machine Refactor
 * REF: CHANGELOG_2025-11-29.md - Git-liknande Versionering
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getStateMachineBehavior, STATES } from './useOnboardingStateMachine';
import { API_URL as API_BASE } from '../config/api';

/**
 * Generic hook för formulärdata med state machine architecture
 * @param {string} slideKey - Unik identifierare för slide (t.ex. "riskfragor_steg2")
 * @param {Object} questionConfig - Config från QUESTIONNAIRE_CONFIG
 * @returns {Object} - { formData, formState, canEdit, updateQuestion, isValid, errors, resetForm, pushToServer }
 */
export const useQuestionnaireForm = (slideKey, questionConfig) => {
  // Validate inputs
  if (!slideKey || !questionConfig) {
    throw new Error('useQuestionnaireForm requires slideKey and questionConfig');
  }
  
  // Get company_id AND case_id from URL params OR localStorage
  // Priority: URL params > localStorage > 'draft'
  const urlParams = useParams();
  
  const getEffectiveId = (urlValue, localStorageKey, idType) => {
    if (urlValue) return urlValue;
    const stored = localStorage.getItem(localStorageKey);
    if (stored && stored !== 'null' && stored !== 'undefined') return stored;
    return 'draft';
  };
  
  const effectiveCompanyId = getEffectiveId(urlParams.companyId, 'currentCompanyId', 'companyId');
  const effectiveCaseId = getEffectiveId(urlParams.caseId, 'onboardingId', 'caseId');
  
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
  // Priority: URL params > localStorage > 'draft'
  const storageKey = `onboarding-${userId}-${effectiveCompanyId}-${effectiveCaseId}-${slideKey}`;
  
  console.log(`🔑 Cache key for ${slideKey}:`, storageKey);
  console.log(`   companyId: ${effectiveCompanyId} (from ${urlParams.companyId ? 'URL' : 'localStorage'})`);
  console.log(`   caseId: ${effectiveCaseId} (from ${urlParams.caseId ? 'URL' : 'localStorage'})`);
  
  // State
  const [formData, setFormData] = useState(() => {
    // Default: alla frågor har null value (no wrapping)
    const initialData = {};
    const questions = questionConfig.questions || questionConfig;
    Object.keys(questions).forEach(qId => {
      initialData[qId] = null;
    });
    return initialData;
  });
  
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

  // STATE MACHINE: Initial load - fetch case metadata and determine state
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setFormState('loading');

      // If no case created yet (draft mode), use localStorage only
      if (effectiveCompanyId === 'draft' || effectiveCaseId === 'draft') {
        const localData = readFromStorage(storageKey);
        if (localData) {
          setFormData(localData.value);
          setFormState('draft-offline');
        } else {
          setFormState('new');
        }
        setIsLoading(false);
        return;
      }

      // Fetch case metadata to determine state
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

        if (!response.ok) {
          throw new Error(`Resume failed: ${response.status}`);
        }

        const metadata = await response.json();
        setCaseMetadata(metadata);
        
        // 🆕 Spara case-level version för conflict detection
        if (metadata.version !== undefined) {
          setLocalVersion(metadata.version);
          console.log(`📊 Case version: ${metadata.version}`);
        }

        // NEW STATE MACHINE: Use centralized state machine logic
        const behavior = getStateMachineBehavior(metadata, slideKey);
        console.log(`🎰 State Machine: ${behavior.state} - ${behavior.message}`);
        
        let loadedData = null;
        
        // ✅ CHECK RESUME MODE: Load from Resume endpoint data (already fetched above!)
        const isResumeMode = localStorage.getItem('resumeMode') === 'true';
        
        if (isResumeMode) {
          console.log('🔄 Resume mode detected - using already-fetched metadata');
          
          // Use metadata from first fetch - NO DUPLICATE REQUEST!
          // Cache ALL slides from the metadata we already have
          if (metadata.static_kyc) {
            Object.entries(metadata.static_kyc).forEach(([key, value]) => {
              const cacheKey = `onboarding-${userId}-${effectiveCompanyId}-${effectiveCaseId}-${key}`;
              writeToStorage(cacheKey, { entireForm: value }, 0);
              console.log(`✅ Cached ${key} from Resume metadata`);
            });
          }
          
          // Also check legacy data format
          if (metadata.data) {
            Object.entries(metadata.data).forEach(([key, value]) => {
              const cacheKey = `onboarding-${userId}-${effectiveCompanyId}-${effectiveCaseId}-${key}`;
              writeToStorage(cacheKey, value, 0);
              console.log(`✅ Cached ${key} from Resume data`);
            });
          }
          
          // Load data for current slide from static_kyc or data
          const slideData = metadata.static_kyc?.[slideKey] || metadata.data?.[slideKey];
          if (slideData) {
            // Wrap in entireForm if it's raw data
            loadedData = slideData.entireForm ? slideData : { entireForm: slideData };
            console.log(`📥 Loaded ${slideKey} from Resume metadata`);
          }
          
          // Clear resume flag after successful load
          localStorage.removeItem('resumeMode');
        }
        
        // Load from cache if not already loaded from Resume
        if (!loadedData && behavior.shouldLoadFromCache) {
          const cached = readFromStorage(storageKey);
          if (cached) {
            loadedData = cached.value;
            console.log(`📦 Loaded from cache for slide: ${slideKey}`);
          }
        }
        
        // Load from server if no cache or server has priority
        if (!loadedData && behavior.shouldLoadFromServer) {
          const serverData = metadata.data?.[slideKey];
          if (serverData) {
            loadedData = serverData;
            console.log(`☁️ Loaded from server for slide: ${slideKey}`);
            // Cache server data for offline access
            if (behavior.canEdit) {
              writeToStorage(storageKey, serverData, 0);
            }
          }
        }
        
        // Set form data
        if (loadedData) {
          setFormData(loadedData);
        }
        
        // Set form state based on state machine
        setFormState(behavior.state);

      } catch (error) {
        console.error('Failed to load case metadata:', error);
        // Fallback to localStorage
        const localData = readFromStorage(storageKey);
        if (localData) {
          setFormData(localData.value);
          setFormState('draft-offline');
        } else {
          setFormState('new');
        }
      }

      setIsLoading(false);
    };

    loadData();
  }, [slideKey, effectiveCompanyId, effectiveCaseId, storageKey]);

  // 🆕 Draft key för localStorage (separerad från permanent cache)
  const draftKey = `onboarding_draft_${effectiveCaseId}_${slideKey}`;

  // Auto-save to localStorage when formData changes (only if editable)
  // Sparar som "draft" för conflict detection vid page load
  useEffect(() => {
    if (!isLoading && [STATES.NEW, STATES.DRAFT].includes(formState)) {
      // Spara draft med version info för conflict detection
      const draftData = {
        data: formData,
        basedOnVersion: localVersion,
        savedAt: Date.now(),
        slideKey
      };
      localStorage.setItem(draftKey, JSON.stringify(draftData));
      
      // Behåll även i permanent cache
      const localData = readFromStorage(storageKey);
      writeToStorage(storageKey, formData, localVersion);
      
      console.log(`💾 Auto-saved ${slideKey} draft (based on v${localVersion})`);
    }
  }, [formData, slideKey, isLoading, formState, storageKey, localVersion, draftKey]);

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
      console.log(`[${slideKey}] 📝 Draft mode - not pushing to server yet`);
      return { success: true }; // Success (saved locally)
    }
    
    // Check if state allows editing
    if (!canEdit && !force) {
      console.warn(`[${slideKey}] ⚠️ Cannot push - form is in ${formState} state`);
      return { success: false, error: 'Form is read-only' };
    }
    
    // Prevent double-saves
    if (isSaving) {
      console.log(`[${slideKey}] ⏳ Already saving, skipping...`);
      return { success: false, error: 'Already saving' };
    }
    
    setIsSaving(true);
    
    try {
      const response = await fetch(
        `${API_BASE}/onboarding/${effectiveCompanyId}/${slideKey}`, 
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            data: formData,
            onboarding_id: effectiveCaseId,
            // 🆕 Git-liknande version control
            based_on_version: force ? null : localVersion,
            force: force
          })
        }
      );

      // 🆕 409 CONFLICT - Någon annan har sparat under tiden
      if (response.status === 409) {
        const conflict = await response.json();
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
      console.error(`[${slideKey}] ❌ Failed to push to server:`, response.status, errorText);
      return { success: false, error: `Server error: ${response.status}` };
      
    } catch (e) {
      console.error(`[${slideKey}] ❌ Failed to push to server:`, e);
      return { success: false, error: e.message };
    } finally {
      setIsSaving(false);
    }
  }, [effectiveCompanyId, effectiveCaseId, slideKey, formData, formState, localVersion, isSaving, canEdit, storageKey, draftKey]);

  // Derived state: Determine capabilities based on formState
  const canEdit = ['draft-offline', 'draft-synced', 'new'].includes(formState);
  const shouldShowLockWarning = formState === 'locked';
  const shouldShowReadOnlyMessage = formState === 'submitted-readonly' || formState === 'completed-archived';

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
    canEdit,    // New: Derived permission
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
    isDraftMode: effectiveCompanyId === 'draft' || effectiveCaseId === 'draft'
  };
};

export default useQuestionnaireForm;
