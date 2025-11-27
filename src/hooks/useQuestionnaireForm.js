/**
 * CREATED: 2025-11-23
 * UPDATED: 2025-11-24 - Decision tree med server sync + version control
 * UPDATED: 2025-11-25 - Använder useParams för company_id (multi-tab safe)
 * UPDATED: 2025-11-25 - case_id support + "draft" mode för nya onboardings
 * UPDATED: 2025-11-27 - STATE MACHINE REFACTOR: Behavior driven by metadata.state
 * PURPOSE: Generic hook for form data persistence with state machine architecture
 * FEATURES: Auto-load, auto-save, multi-tab sync, state-driven behavior
 * REF: CHANGELOG_2025-11-26.md - State Machine Refactor
 */

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

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
          `/api/onboarding/resume/${effectiveCompanyId}?onboarding_id=${effectiveCaseId}`,
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

        // STATE MACHINE: Determine behavior based on metadata.state
        const serverState = metadata.state || 'draft';

        switch (serverState) {
          case 'draft': {
            // Draft mode - localStorage has priority (offline-first)
            const localDraft = readFromStorage(storageKey);
            if (localDraft) {
              setFormData(localDraft.value);
              setFormState('draft-offline');
            } else {
              // No local draft, read from metadata.json
              const serverDraft = metadata.data?.[slideKey];
              if (serverDraft) {
                setFormData(serverDraft);
                writeToStorage(storageKey, serverDraft, 0);
              }
              setFormState('draft-synced');
            }
            break;
          }

          case 'submitted': {
            // Submitted - server is source of truth (read-only)
            const submittedData = metadata.data?.[slideKey];
            if (submittedData) {
              setFormData(submittedData);
            }
            setFormState('submitted-readonly');
            break;
          }

          case 'locked': {
            // Locked by another user
            const lockedData = metadata.data?.[slideKey];
            if (lockedData) {
              setFormData(lockedData);
            }
            setFormState('locked');
            console.warn(`⚠️ Case is locked by ${metadata.locked_by || 'another user'}`);
            break;
          }

          case 'completed': {
            // Entire case completed
            const completedData = metadata.data?.[slideKey];
            if (completedData) {
              setFormData(completedData);
            }
            setFormState('completed-archived');
            break;
          }

          default: {
            // New slide, no data
            setFormState('new');
          }
        }

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

  // Auto-save to localStorage when formData changes (only in draft states)
  useEffect(() => {
    if (!isLoading && ['draft-offline', 'draft-synced', 'new'].includes(formState)) {
      const localData = readFromStorage(storageKey);
      writeToStorage(storageKey, formData, localData?.version || 0);
      console.log(`💾 Auto-saved ${slideKey} to localStorage (state: ${formState})`);
    }
  }, [formData, slideKey, isLoading, formState, storageKey]);

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
   * @returns {Promise<boolean>} - true om lyckades, false om conflict eller error
   */
  const pushToServer = async () => {
    // Skip if in draft mode (no case created yet)
    if (effectiveCompanyId === 'draft' || effectiveCaseId === 'draft') {
      console.log(`[${slideKey}] 📝 Draft mode - not pushing to server yet`);
      return true; // Success (saved locally)
    }
    
    // Check if state allows editing
    if (!canEdit) {
      console.warn(`[${slideKey}] ⚠️ Cannot push - form is in ${formState} state`);
      return false;
    }
    
    const localData = readFromStorage(storageKey);
    
    try {
      const response = await fetch(
        `/api/onboarding/${effectiveCompanyId}/${slideKey}`, 
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            data: formData,
            onboarding_id: effectiveCaseId,
            expected_version: localData?.version || 0
          })
        }
      );

      if (response.status === 409) {
        const conflict = await response.json();
        console.error(`[${slideKey}] ⚠️ Version conflict: expected ${localData?.version}, but server has ${conflict.current_version}`);
        alert('⚠️ Någon annan har uppdaterat denna sida. Hämtar senaste versionen...');
        window.location.reload();
        return false;
      }

      if (response.ok) {
        const json = await response.json();
        writeToStorage(storageKey, formData, json.version || 1);
        console.log(`[${slideKey}] ✅ Pushad till server: v${localData?.version} → v${json.version || 1}`);
        return true;
      }
      
      console.error(`[${slideKey}] ❌ Failed to push to server:`, response.status);
      return false;
    } catch (e) {
      console.error(`[${slideKey}] ❌ Failed to push to server:`, e);
      return false;
    }
  };

  // Derived state: Determine capabilities based on formState
  const canEdit = ['draft-offline', 'draft-synced', 'new'].includes(formState);
  const shouldShowLockWarning = formState === 'locked';
  const shouldShowReadOnlyMessage = formState === 'submitted-readonly' || formState === 'completed-archived';

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
    pushToServer,
    caseMetadata,  // New: Full case metadata
    // Export IDs för komponenter som behöver dem
    companyId: effectiveCompanyId,
    caseId: effectiveCaseId,
    userId,
    isDraftMode: effectiveCompanyId === 'draft' || effectiveCaseId === 'draft'
  };
};

export default useQuestionnaireForm;
