/**
 * CREATED: 2025-11-23
 * PURPOSE: Generic hook for form data persistence with localStorage
 * FEATURES: Auto-load, auto-save, multi-tab sync, validation
 * REF: CHANGELOG_2025-11-23.md - Problem 5
 */

import { useState, useEffect } from 'react';

/**
 * Generic hook för formulärdata med localStorage-persistens
 * @param {string} slideKey - Unik identifierare för slide (t.ex. "riskfragor_steg2")
 * @param {Object} questionConfig - Config från QUESTIONNAIRE_CONFIG
 * @param {string} orgnr - Aktivt företags organisationsnummer
 * @param {string} userId - Användar-ID
 * @returns {Object} - { formData, updateQuestion, isValid, errors, resetForm }
 */
export const useQuestionnaireForm = (slideKey, questionConfig, orgnr, userId) => {
  // Build storage key with user+orgnr scoping
  const storageKey = `onboarding-${userId}-${orgnr}-${slideKey}`;
  
  // Initialisera formData från localStorage eller default-värden
  const [formData, setFormData] = useState(() => {
    const cached = localStorage.getItem(storageKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        console.log(`📂 Loaded cached data for ${slideKey}:`, parsed);
        return parsed;
      } catch (e) {
        console.error(`❌ Failed to parse cached data for ${slideKey}:`, e);
      }
    }
    
    // Default: alla frågor har null selected och null expansion
    const initialData = {};
    Object.keys(questionConfig.questions).forEach(qId => {
      initialData[qId] = {
        selected: null,
        expansion: null
      };
    });
    console.log(`✨ Initialized default data for ${slideKey}:`, initialData);
    return initialData;
  });

  // Auto-spara till localStorage vid varje ändring
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(formData));
    console.log(`💾 Auto-saved ${slideKey} to localStorage`);
  }, [formData, storageKey, slideKey]);

  // Lyssna på ändringar från andra flikar (multi-tab sync)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === storageKey && e.newValue) {
        try {
          const newData = JSON.parse(e.newValue);
          console.log(`🔄 Storage event detected for ${slideKey} - syncing from other tab`);
          setFormData(newData);
        } catch (err) {
          console.error(`❌ Failed to sync data from storage event:`, err);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [storageKey, slideKey]);

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

  return {
    formData,
    updateQuestion,
    isValid: isValid(),
    errors: getErrors(),
    resetForm
  };
};

export default useQuestionnaireForm;
