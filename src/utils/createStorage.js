/**
 * createStorage.js
 * 
 * Factory för storage-objekt som hanterar localStorage/sessionStorage.
 * 
 * REGEL: Slides får ALDRIG anropa localStorage direkt!
 *        Allt går via detta storage-objekt.
 * 
 * NYCKELFORMAT:
 * - Draft:     onboarding::draft::temp_123::user_456::formData
 * - Permanent: onboarding::556677-8899::case_789::user_456::formData
 */

import StorageKeyBuilder from './StorageKeyBuilder';

/**
 * Factory som skapar storage-objekt med tillgång till aktuell state.
 * 
 * @param {Function} getState - Callback som returnerar { isDraftMode, activeCase, tempCaseId, user }
 * @returns {Object} - Storage-objekt med alla metoder
 */
export function createStorage(getState) {
  const storage = {
    // ─────────────────────────────────────────────────────────────────────
    // HJÄLPFUNKTION: Bygg rätt nyckel baserat på läge
    // ─────────────────────────────────────────────────────────────────────
    _buildKey: (dataType) => {
      const { isDraftMode, activeCase, tempCaseId, user } = getState();
      if (isDraftMode || !activeCase?.company_id) {
        return StorageKeyBuilder.buildDraftKey(tempCaseId, user?.id || 'anonymous', dataType);
      } else {
        return StorageKeyBuilder.buildPermanentKey(
          activeCase.company_id,
          activeCase.case_id,
          user?.id || 'anonymous',
          dataType
        );
      }
    },
    
    // ─────────────────────────────────────────────────────────────────────
    // Token (JWT från login) - GLOBAL, ingen preamble
    // ─────────────────────────────────────────────────────────────────────
    getToken: () => localStorage.getItem('accessToken'),
    setToken: (token) => localStorage.setItem('accessToken', token),
    clearToken: () => localStorage.removeItem('accessToken'),
    
    getRefreshToken: () => localStorage.getItem('refreshToken'),
    setRefreshToken: (token) => localStorage.setItem('refreshToken', token),
    clearRefreshToken: () => localStorage.removeItem('refreshToken'),
    
    // ─────────────────────────────────────────────────────────────────────
    // Temp Case ID
    // ─────────────────────────────────────────────────────────────────────
    getTempCaseId: () => localStorage.getItem('temp_case_id'),
    setTempCaseId: (id) => localStorage.setItem('temp_case_id', id),
    clearTempCaseId: () => localStorage.removeItem('temp_case_id'),
    
    // ─────────────────────────────────────────────────────────────────────
    // Tab Session (sessionStorage - unik per flik)
    // ─────────────────────────────────────────────────────────────────────
    getCurrentTabSession: () => {
      const data = sessionStorage.getItem('current_tab_session');
      console.log('[STORAGE] getCurrentTabSession:', data);
      return data ? JSON.parse(data) : null;
    },
    setCurrentTabSession: (sessionData) => {
      console.log('[STORAGE] setCurrentTabSession:', sessionData);
      sessionStorage.setItem('current_tab_session', JSON.stringify({
        ...sessionData,
        last_activity: new Date().toISOString(),
      }));
    },
    clearCurrentTabSession: () => {
      console.log('[STORAGE] clearCurrentTabSession');
      sessionStorage.removeItem('current_tab_session');
    },
    
    // ─────────────────────────────────────────────────────────────────────
    // Session Data (localStorage)
    // ─────────────────────────────────────────────────────────────────────
    buildSessionId: (company_id, case_id, userId) => `onboarding::${company_id}::${case_id}::${userId}`,
    getSessionData: (sessionId) => {
      const key = `session::${sessionId}`;
      const data = localStorage.getItem(key);
      console.log(`[STORAGE] getSessionData from key: ${key}`);
      return data ? JSON.parse(data) : null;
    },
    setSessionData: (sessionId, sessionData) => {
      const key = `session::${sessionId}`;
      console.log(`[STORAGE] setSessionData to key: ${key}`);
      localStorage.setItem(key, JSON.stringify({ ...sessionData, last_activity: new Date().toISOString() }));
    },
    clearSessionData: (sessionId) => {
      const key = `session::${sessionId}`;
      console.log(`[STORAGE] clearSessionData from key: ${key}`);
      localStorage.removeItem(key);
    },
    
    // ─────────────────────────────────────────────────────────────────────
    // Draft Mode
    // ─────────────────────────────────────────────────────────────────────
    getIsDraftMode: () => {
      const value = localStorage.getItem('is_draft_mode');
      return value === null ? true : value === 'true';
    },
    setIsDraftMode: (isDraft) => localStorage.setItem('is_draft_mode', String(isDraft)),
    
    // ─────────────────────────────────────────────────────────────────────
    // Active Case
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
    // Form Data (DEPRECATED - använd getSlideData/setSlideData)
    // ─────────────────────────────────────────────────────────────────────
    getFormData: () => {
      const key = storage._buildKey('formData');
      const data = localStorage.getItem(key);
      console.log(`[STORAGE] getFormData from key: ${key} (DEPRECATED)`);
      return data ? JSON.parse(data) : {};
    },
    setFormData: (data) => {
      const key = storage._buildKey('formData');
      console.log(`[STORAGE] setFormData to key: ${key} (DEPRECATED)`);
      localStorage.setItem(key, JSON.stringify(data));
    },
    clearFormData: () => {
      const key = storage._buildKey('formData');
      console.log(`[STORAGE] clearFormData from key: ${key}`);
      localStorage.removeItem(key);
    },
    
    // ─────────────────────────────────────────────────────────────────────
    // Per-slide data storage (URL-aware)
    // ─────────────────────────────────────────────────────────────────────
    getSlideData: (slideKey) => {
      const key = storage._buildKey(slideKey);
      const data = localStorage.getItem(key);
      console.log(`[STORAGE] getSlideData(${slideKey}) from key: ${key}`);
      return data ? JSON.parse(data) : null;
    },
    setSlideData: (slideKey, data) => {
      const key = storage._buildKey(slideKey);
      console.log(`[STORAGE] setSlideData(${slideKey}) to key: ${key}`, data);
      localStorage.setItem(key, JSON.stringify(data));
    },
    clearSlideData: (slideKey) => {
      const key = storage._buildKey(slideKey);
      console.log(`[STORAGE] clearSlideData(${slideKey}) from key: ${key}`);
      localStorage.removeItem(key);
    },
    
    getAllSlidesData: () => {
      const { isDraftMode, activeCase, tempCaseId, user } = getState();
      const allSlides = {};
      const prefix = isDraftMode 
        ? `onboarding::draft::${tempCaseId}::${user?.id || 'anonymous'}::`
        : `onboarding::${activeCase?.company_id}::${activeCase?.case_id}::${user?.id || 'anonymous'}::`;
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          const slideKey = key.replace(prefix, '');
          if (!['activeCase', 'completedSlides', 'formData'].includes(slideKey)) {
            try {
              allSlides[slideKey] = JSON.parse(localStorage.getItem(key));
            } catch (e) {
              console.error(`[STORAGE] Failed to parse ${key}:`, e);
            }
          }
        }
      }
      console.log(`[STORAGE] getAllSlidesData:`, Object.keys(allSlides));
      return allSlides;
    },
    
    // ─────────────────────────────────────────────────────────────────────
    // Completed Slides
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
    // Convert Draft to Permanent
    // ─────────────────────────────────────────────────────────────────────
    convertDraftToPermanent: (company_id, case_id, userId) => {
      console.log(`[STORAGE] 🔄 Converting draft to permanent: company=${company_id}, case=${case_id}`);
      
      const currentTempCaseId = storage.getTempCaseId();
      if (!currentTempCaseId) {
        console.warn('[STORAGE] No temp_case_id found, nothing to convert');
        return;
      }
      
      const draftKeys = StorageKeyBuilder.findKeysByTempCaseId(currentTempCaseId);
      console.log(`[STORAGE] Found ${draftKeys.length} draft keys to convert:`, draftKeys);
      
      for (const oldKey of draftKeys) {
        const parsed = StorageKeyBuilder.parseKey(oldKey);
        if (!parsed) continue;
        
        const newKey = StorageKeyBuilder.buildPermanentKey(company_id, case_id, userId, parsed.dataType);
        const data = localStorage.getItem(oldKey);
        if (data) {
          localStorage.setItem(newKey, data);
          console.log(`[STORAGE] Moved: ${oldKey} → ${newKey}`);
        }
        localStorage.removeItem(oldKey);
      }
      
      storage.setIsDraftMode(false);
      console.log('[STORAGE] ✅ Conversion complete, isDraftMode = false');
    },
    
    // ─────────────────────────────────────────────────────────────────────
    // Clear All Draft Data
    // ─────────────────────────────────────────────────────────────────────
    clearAllDraftData: () => {
      console.log('[STORAGE] 🗑️ Clearing all draft data');
      
      const currentTempCaseId = storage.getTempCaseId();
      if (!currentTempCaseId) {
        console.warn('[STORAGE] No temp_case_id found');
        return;
      }
      
      const draftKeys = StorageKeyBuilder.findKeysByTempCaseId(currentTempCaseId);
      for (const key of draftKeys) {
        localStorage.removeItem(key);
        console.log(`[STORAGE] Removed: ${key}`);
      }
      
      storage.clearTempCaseId();
      storage.setIsDraftMode(true);
      console.log('[STORAGE] ✅ All draft data cleared');
    },
  };
  
  return storage;
}
