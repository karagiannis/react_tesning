/**
 * CREATED: 2025-11-23
 * UPDATED: 2025-11-24 - Decision tree med server sync + version control
 * UPDATED: 2025-11-25 - Använder useParams för company_id (multi-tab safe)
 * UPDATED: 2025-11-25 - case_id support + "draft" mode för nya onboardings
 * PURPOSE: Generic hook for form data persistence with localStorage + server sync
 * FEATURES: Auto-load, auto-save, multi-tab sync, validation, git-like version control
 * REF: CHANGELOG_2025-11-25.md - Smart Case Sharing Strategy
 */

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

/**
 * Generic hook för formulärdata med localStorage + server sync
 * @param {string} slideKey - Unik identifierare för slide (t.ex. "riskfragor_steg2")
 * @param {Object} questionConfig - Config från QUESTIONNAIRE_CONFIG
 * @returns {Object} - { formData, updateQuestion, isValid, errors, resetForm, isLoading, syncStatus, pushToServer }
 */
export const useQuestionnaireForm = (slideKey, questionConfig) => {
  // Get company_id AND case_id from URL (source of truth for multi-tab isolation)
  const { companyId, caseId } = useParams();
  
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
  
  // Use "draft" as placeholder if companyId or caseId missing (new onboarding)
  const effectiveCompanyId = companyId || 'draft';
  const effectiveCaseId = caseId || 'draft';
  
  // Build storage key: onboarding-{userId}-{companyId}-{caseId}-{slideKey}
  // This supports:
  // - Multi-user in same browser (different tabs, different accounts)
  // - Multi-tab (same user, multiple cases)
  // - Multi-case collaboration (different users, same case)
  // IMPORTANT: useMemo stabilizes storageKey to prevent infinite re-render in useEffect
  // Without useMemo, storageKey would be recreated on every render → useEffect triggers → re-render → loop
  const storageKey = useMemo(
    () => `onboarding-${userId}-${effectiveCompanyId}-${effectiveCaseId}-${slideKey}`,
    [userId, effectiveCompanyId, effectiveCaseId, slideKey]
  );
  
  // State
  const [formData, setFormData] = useState(() => {
    // Default: alla frågor har null selected och null expansion
    const initialData = {};
    const questions = questionConfig.questions || questionConfig;
    Object.keys(questions).forEach(qId => {
      initialData[qId] = {
        selected: null,
        expansion: null
      };
    });
    return initialData;
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState('checking'); // checking | synced | conflict | offline | new

  // Helper: Läs från localStorage med version + timestamp
  const readFromStorage = (key) => {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    
    try {
      const parsed = JSON.parse(cached);
      // Backward compatibility: Om gamla formatet (direkt value), konvertera
      if (parsed.version === undefined) {
        return {
          value: parsed,
          version: 0,  // Default version för gamla data
          timestamp: new Date(0).toISOString() // Epoch = äldsta möjliga
        };
      }
      return parsed;
    } catch (e) {
      console.error(`❌ localStorage parse error for ${key}:`, e);
      return null;
    }
  };

  // Helper: Skriv till localStorage med version + timestamp
  const writeToStorage = (key, value, version) => {
    const wrapped = {
      value,
      version,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(key, JSON.stringify(wrapped));
  };

  // Helper: Get auth token (TODO: replace with actual auth implementation)
  const getToken = () => {
    return localStorage.getItem('accessToken') || 'mock-token';
  };

  // DECISION TREE: Initial load från server + localStorage (syncData)
  useEffect(() => {
    const syncData = async () => {
      setIsLoading(true);
      setSyncStatus('checking');

      // 1. Hämta från localStorage
      const localData = readFromStorage(storageKey);
      
      // 2. Hämta från server (ALWAYS - server is source of truth)
      // Skip server fetch if we're in "draft" mode (no case created yet)
      let serverData = null;
      
      if (effectiveCompanyId !== 'draft' && effectiveCaseId !== 'draft') {
        try {
          const response = await fetch(
            `/api/companies/${effectiveCompanyId}/cases/${effectiveCaseId}/slides/${slideKey}`, 
            {
              headers: { 
                'Authorization': `Bearer ${getToken()}`,
                'Content-Type': 'application/json'
              }
            }
          );
          
          if (response.ok) {
            const json = await response.json();
            serverData = {
              value: json.data,
              version: json.version,      // Backend returnerar version number
              timestamp: json.updated_at  // Backend returnerar timestamp
            };
          } else if (response.status === 404) {
            // Slide finns inte på server - helt ny
            serverData = null;
          }
        } catch (e) {
          console.warn(`⚠️ Server fetch failed for ${slideKey}, using localStorage only:`, e);
        }
      } else {
        console.log(`[${slideKey}] 📝 Draft mode - skipping server fetch`);
      }

      // 3. DECISION TREE
      let finalData = {};
      Object.keys(questionConfig.questions).forEach(qId => {
        finalData[qId] = { selected: null, expansion: null };
      });
      let finalVersion = 0;
      let status = 'synced';
      
      if (!localData && !serverData) {
        // ════════════════════════════════════════════════════════
        // Case A: Första gången någonsin - TOM SLIDE
        // ════════════════════════════════════════════════════════
        status = 'new';
        console.log(`[${slideKey}] 🆕 Case A: Ny slide - blank form`);
        
      } else if (!serverData) {
        // ════════════════════════════════════════════════════════
        // Case B: Endast localStorage finns (offline/ny onboarding)
        // ════════════════════════════════════════════════════════
        finalData = localData.value;
        finalVersion = localData.version;
        status = 'offline';
        console.log(`[${slideKey}] 📴 Case B: Offline - använder localStorage v${localData.version}`);
        
      } else if (!localData) {
        // ════════════════════════════════════════════════════════
        // Case C: Endast server finns (rensad cache/ny browser)
        // ════════════════════════════════════════════════════════
        finalData = serverData.value;
        finalVersion = serverData.version;
        status = 'restored';
        
        // Synka till localStorage
        writeToStorage(storageKey, serverData.value, serverData.version);
        console.log(`[${slideKey}] ♻️ Case C: Återställd från server v${serverData.version}`);
        
      } else {
        // ════════════════════════════════════════════════════════
        // Case D: Båda finns - JÄMFÖR VERSION
        // ════════════════════════════════════════════════════════
        
        if (serverData.version > localData.version) {
          // D1: Server är nyare - någon annan har sparat
          finalData = serverData.value;
          finalVersion = serverData.version;
          status = 'conflict_resolved';
          
          // Synka till localStorage
          writeToStorage(storageKey, serverData.value, serverData.version);
          
          console.warn(
            `[${slideKey}] ⚠️ Case D1: Version conflict - server nyare\n` +
            `  Local: v${localData.version} @ ${localData.timestamp}\n` +
            `  Server: v${serverData.version} @ ${serverData.timestamp}\n` +
            `  → Använder server (dina lokala ändringar förlorade)`
          );
          
          // Visa varning till användare (optional - kan ta bort om för invasivt)
          // alert(
          //   `⚠️ Data har uppdaterats av någon annan\n\n` +
          //   `Din version: v${localData.version}\n` +
          //   `Server version: v${serverData.version}\n\n` +
          //   `Dina osparade ändringar har förlorats.`
          // );
          
        } else if (serverData.version === localData.version) {
          // D2: Samma version - använd localStorage (kan ha nyare draft)
          finalData = localData.value;
          finalVersion = localData.version;
          status = 'synced';
          
          console.log(
            `[${slideKey}] ✅ Case D2: Version match v${localData.version}\n` +
            `  → Använder localStorage (kan ha nyare draft)`
          );
          
        } else {
          // D3: localStorage har högre version?!
          // Detta SKA INTE hända (server vinner alltid vid POST)
          // Fallback: använd server
          finalData = serverData.value;
          finalVersion = serverData.version;
          status = 'inconsistent';
          
          // Synka till localStorage
          writeToStorage(storageKey, serverData.value, serverData.version);
          
          console.error(
            `[${slideKey}] 🚨 Case D3: Inkonsistent state!\n` +
            `  Local: v${localData.version}\n` +
            `  Server: v${serverData.version}\n` +
            `  → Fallback till server`
          );
        }
      }
      
      setFormData(finalData);
      setSyncStatus(status);
      setIsLoading(false);
    };
    
    syncData();
  }, [slideKey, effectiveCompanyId, effectiveCaseId, userId, storageKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-save till localStorage när formData ändras (men INTE till server)
  useEffect(() => {
    if (!isLoading) {
      const localData = readFromStorage(storageKey);
      // Behåll samma version - ökar endast vid server POST
      writeToStorage(storageKey, formData, localData?.version || 0);
      console.log(`💾 Auto-saved ${slideKey} to localStorage (v${localData?.version || 0})`);
    }
  }, [formData, storageKey, slideKey, isLoading]);

  /**
   * Uppdatera en fråga
   * @param {string} questionId - Question ID (t.ex. "q6")
   * @param {string} selected - Valt alternativ (t.ex. "ja_regelbundet")
   * @param {Object|null} expansion - Expansion data om hasExpansion är true
   */
  const updateQuestion = (questionId, selected, expansion = null) => {
    setFormData(prev => ({
      ...prev,
      [questionId]: {
        selected,
        expansion
      }
    }));
    console.log(`✏️ Updated ${questionId}:`, { selected, expansion });
  };

  /**
   * Validera formulär baserat på required-flaggor i config
   * @returns {boolean} - true om alla required frågor är besvarade
   */
  const isValid = () => {
    return Object.entries(questionConfig.questions).every(([qId, qConfig]) => {
      // Skip om ej required
      if (!qConfig.required) return true;
      
      const answer = formData[qId];
      if (!answer || !answer.selected) {
        console.log(`❌ Validation failed: ${qId} is required but not answered`);
        return false;
      }
      
      // Kontrollera expansion om det krävs
      const option = qConfig.options.find(opt => opt.value === answer.selected);
      if (option?.hasExpansion && option.expansionConfig?.required) {
        const hasExpansionData = answer.expansion && 
          Object.keys(answer.expansion).length > 0 &&
          Object.values(answer.expansion).some(val => 
            Array.isArray(val) ? val.length > 0 : val
          );
        
        if (!hasExpansionData) {
          console.log(`❌ Validation failed: ${qId} requires expansion data`);
          return false;
        }
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
    
    Object.entries(questionConfig.questions).forEach(([qId, qConfig]) => {
      if (qConfig.required && (!formData[qId] || !formData[qId].selected)) {
        errors[qId] = "Detta fält är obligatoriskt";
      }
      
      // Kontrollera expansion-fel
      const answer = formData[qId];
      if (answer?.selected) {
        const option = qConfig.options.find(opt => opt.value === answer.selected);
        if (option?.hasExpansion && option.expansionConfig?.required) {
          const hasExpansionData = answer.expansion && 
            Object.keys(answer.expansion).length > 0 &&
            Object.values(answer.expansion).some(val => 
              Array.isArray(val) ? val.length > 0 : val
            );
          
          if (!hasExpansionData) {
            errors[qId] = `${option.expansionConfig.label || 'Expansion field'} är obligatoriskt`;
          }
        }
      }
    });
    
    return errors;
  };

  /**
   * Rensa formulärdata (t.ex. vid ny session)
   */
  const resetForm = () => {
    const initialData = {};
    Object.keys(questionConfig.questions).forEach(qId => {
      initialData[qId] = {
        selected: null,
        expansion: null
      };
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
      setSyncStatus('draft');
      return true; // Success (saved locally)
    }
    
    const localData = readFromStorage(storageKey);
    
    try {
      const response = await fetch(
        `/api/companies/${effectiveCompanyId}/cases/${effectiveCaseId}/slides/${slideKey}`, 
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            data: formData,
            expected_version: localData?.version || 0  // Git-liknande: måste ha rätt base version
          })
        }
      );

      if (response.status === 409) {
        // Version conflict - någon annan har pushat
        const conflict = await response.json();
        console.error(`[${slideKey}] ⚠️ Version conflict: expected ${localData?.version}, but server has ${conflict.current_version}`);
        
        // Force "git pull" - hämta från server igen
        alert('⚠️ Någon annan har uppdaterat denna sida. Hämtar senaste versionen...');
        window.location.reload(); // Enklaste: reload page
        
        setSyncStatus('conflict');
        return false;
      }

      if (response.ok) {
        const json = await response.json();
        // Uppdatera localStorage med ny version från server
        writeToStorage(storageKey, formData, json.version);
        setSyncStatus('synced');
        console.log(`[${slideKey}] ✅ Pushad till server: v${localData?.version} → v${json.version}`);
        return true;
      }
      
      console.error(`[${slideKey}] ❌ Failed to push to server:`, response.status);
      return false;
    } catch (e) {
      console.error(`[${slideKey}] ❌ Failed to push to server:`, e);
      setSyncStatus('offline');
      return false;
    }
  };

  return {
    formData,
    updateQuestion,
    isValid: isValid(),
    errors: getErrors(),
    resetForm,
    isLoading,
    syncStatus,
    pushToServer,
    // 🆕 Export IDs för komponenter som behöver dem
    companyId: effectiveCompanyId,
    caseId: effectiveCaseId,
    userId,
    isDraftMode: effectiveCompanyId === 'draft' || effectiveCaseId === 'draft'
  };
};

export default useQuestionnaireForm;
