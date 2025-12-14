/**
 * createStorage.js
 * 
 * Factory för storage-objekt som hanterar localStorage/sessionStorage.
 * 
 * REGEL: Slides får ALDRIG anropa localStorage direkt!
 *        Allt går via detta storage-objekt.
 * 
 * ============================================================================
 * NYCKELFORMAT (1:1 med server metadata.json):
 * ============================================================================
 * 
 * Server metadata.json:
 *   { version: 5, updated_by: "uuid", updated_at: "...", pages: { uppdragsval: {...} } }
 * 
 * localStorage:
 *   onboarding::{company_id}::{case_id}::{user_id}::version = 5
 *   onboarding::{company_id}::{case_id}::{user_id}::updated_by = "uuid"
 *   onboarding::{company_id}::{case_id}::{user_id}::updated_at = "..."
 *   onboarding::{company_id}::{case_id}::{user_id}::pages::uppdragsval = {...}
 *   onboarding::{company_id}::{case_id}::{user_id}::pages::riskfragor-1 = {...}
 * 
 * Draft-nycklar:
 *   onboarding::draft::{temp_case_id}::{user_id}::pages::uppdragsval = {...}
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
    
    // HJÄLPFUNKTION: Bygg slide-nyckel med ::pages:: prefix
    _buildSlideKey: (slideKey) => {
      const { isDraftMode, activeCase, tempCaseId, user } = getState();
      if (isDraftMode || !activeCase?.company_id) {
        return StorageKeyBuilder.buildDraftSlideKey(tempCaseId, user?.id || 'anonymous', slideKey);
      } else {
        return StorageKeyBuilder.buildSlideKey(
          activeCase.company_id,
          activeCase.case_id,
          user?.id || 'anonymous',
          slideKey
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
    // Per-slide data storage (URL-aware) - USES ::pages:: PREFIX
    // ─────────────────────────────────────────────────────────────────────
    getSlideData: (slideKey) => {
      const key = storage._buildSlideKey(slideKey);
      const data = localStorage.getItem(key);
      console.log(`[STORAGE] getSlideData(${slideKey}) from key: ${key}`);
      return data ? JSON.parse(data) : null;
    },
    setSlideData: (slideKey, data) => {
      const key = storage._buildSlideKey(slideKey);
      console.log(`[STORAGE] setSlideData(${slideKey}) to key: ${key}`, data);
      localStorage.setItem(key, JSON.stringify(data));
    },
    clearSlideData: (slideKey) => {
      const key = storage._buildSlideKey(slideKey);
      console.log(`[STORAGE] clearSlideData(${slideKey}) from key: ${key}`);
      localStorage.removeItem(key);
    },
    
    // ─────────────────────────────────────────────────────────────────────
    // Metadata storage (version, updated_by, updated_at) - 1:1 med server
    // ─────────────────────────────────────────────────────────────────────
    getVersion: () => {
      const key = storage._buildKey('version');
      const data = localStorage.getItem(key);
      console.log(`[STORAGE] getVersion from key: ${key}`, data);
      return data ? parseInt(data, 10) : null;
    },
    setVersion: (version) => {
      const key = storage._buildKey('version');
      console.log(`[STORAGE] setVersion(${version}) to key: ${key}`);
      localStorage.setItem(key, String(version));
    },
    
    getModifiedBy: () => {
      const key = storage._buildKey('modified_by');
      const data = localStorage.getItem(key);
      console.log(`[STORAGE] getModifiedBy from key: ${key}`, data);
      return data || null;
    },
    setModifiedBy: (userId) => {
      const key = storage._buildKey('modified_by');
      console.log(`[STORAGE] setModifiedBy(${userId}) to key: ${key}`);
      localStorage.setItem(key, userId);
    },
    
    // Alias för bakåtkompatibilitet
    getUpdatedBy: () => storage.getModifiedBy(),
    setUpdatedBy: (userId) => storage.setModifiedBy(userId),
    
    getUpdatedAt: () => {
      const key = storage._buildKey('updated_at');
      const data = localStorage.getItem(key);
      console.log(`[STORAGE] getUpdatedAt from key: ${key}`, data);
      return data || null;
    },
    setUpdatedAt: (timestamp) => {
      const key = storage._buildKey('updated_at');
      console.log(`[STORAGE] setUpdatedAt(${timestamp}) to key: ${key}`);
      localStorage.setItem(key, timestamp);
    },
    
    getAllSlidesData: () => {
      const { isDraftMode, activeCase, tempCaseId, user } = getState();
      const allSlides = {};
      // Nytt: Sök efter ::pages:: prefix
      const pagesPrefix = isDraftMode 
        ? `onboarding::draft::${tempCaseId}::${user?.id || 'anonymous'}::pages::`
        : `onboarding::${activeCase?.company_id}::${activeCase?.case_id}::${user?.id || 'anonymous'}::pages::`;
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(pagesPrefix)) {
          // Extrahera slideKey från pages::slideKey
          const slideKey = key.replace(pagesPrefix, '');
          try {
            allSlides[slideKey] = JSON.parse(localStorage.getItem(key));
          } catch (e) {
            console.error(`[STORAGE] Failed to parse ${key}:`, e);
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
    convertDraftToPermanent: (company_id, case_id, userId, tempCaseIdParam = null) => {
      console.log(`[STORAGE] 🔄 Converting draft to permanent: company=${company_id}, case=${case_id}`);
      
      // Använd parameter om den skickas, annars fall back till localStorage
      const currentTempCaseId = tempCaseIdParam || storage.getTempCaseId();
      if (!currentTempCaseId) {
        console.warn('[STORAGE] No temp_case_id found (neither param nor localStorage), nothing to convert');
        return;
      }
      console.log(`[STORAGE] Using temp_case_id: ${currentTempCaseId}`);
      
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
      
      // 🧹 Rensa temp_case_id från localStorage efter lyckad konvertering
      storage.clearTempCaseId();
      
      storage.setIsDraftMode(false);
      console.log('[STORAGE] ✅ Conversion complete, isDraftMode = false, temp_case_id cleared');
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
