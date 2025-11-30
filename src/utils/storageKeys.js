/**
 * CREATED: 2025-11-30
 * PURPOSE: Namespaced localStorage key management
 * 
 * PROBLEM: UUID:er innehåller "-" vilket gör det omöjligt att splitta nycklar
 * LÖSNING: Använd "::" som separator mellan delar
 * 
 * FORMAT: onboarding::{userId}::{companyId}::{caseId}::{slideKey}
 * 
 * EXEMPEL:
 *   onboarding::63b3d1dd-a9e8-4bb0-994b-43e5aa0c12e6::5593450193_b001da6f::f847d89c-b172-4d69-a39a-7d7029f6254f::uppdragsval
 */

// Separator som INTE finns i UUID:er eller andra ID:n
const SEPARATOR = '::';

/**
 * Bygger en namespaced localStorage-nyckel
 * @param {Object} params - Nyckelparametrar
 * @param {string} params.userId - User ID från JWT
 * @param {string} params.companyId - Company ID (orgnr_uuid)
 * @param {string} params.caseId - Case/Onboarding ID (UUID)
 * @param {string} params.slideKey - Slide identifierare (t.ex. "uppdragsval")
 * @param {string} [params.type='data'] - Typ: 'data' | 'draft' | 'cache'
 * @returns {string} Namespaced localStorage key
 */
export function buildStorageKey({ userId, companyId, caseId, slideKey, type = 'data' }) {
  if (!userId || !slideKey) {
    console.warn('buildStorageKey: missing required params', { userId, slideKey });
  }
  
  // Använd 'draft' som fallback för nya onboardings utan ID
  const safeUserId = userId || 'anonymous';
  const safeCompanyId = companyId || 'draft';
  const safeCaseId = caseId || 'draft';
  
  return `onboarding_${type}${SEPARATOR}${safeUserId}${SEPARATOR}${safeCompanyId}${SEPARATOR}${safeCaseId}${SEPARATOR}${slideKey}`;
}

/**
 * Parsar en namespaced localStorage-nyckel
 * @param {string} key - Fullständig localStorage-nyckel
 * @returns {Object|null} Parsade delar eller null om ogiltig
 */
export function parseStorageKey(key) {
  if (!key || !key.startsWith('onboarding_')) {
    return null;
  }
  
  const parts = key.split(SEPARATOR);
  
  if (parts.length !== 5) {
    // Gammal nyckelformat - kan inte parsas
    return null;
  }
  
  // Extrahera type från första delen (t.ex. "onboarding_data" -> "data")
  const typeMatch = parts[0].match(/^onboarding_(.+)$/);
  const type = typeMatch ? typeMatch[1] : 'data';
  
  return {
    type,
    userId: parts[1],
    companyId: parts[2],
    caseId: parts[3],
    slideKey: parts[4]
  };
}

/**
 * Hittar alla localStorage-nycklar för en specifik user/case kombination
 * @param {Object} params - Filterparametrar
 * @param {string} [params.userId] - Filtrera på user ID
 * @param {string} [params.companyId] - Filtrera på company ID
 * @param {string} [params.caseId] - Filtrera på case ID
 * @returns {string[]} Array av matchande nycklar
 */
export function findStorageKeys({ userId, companyId, caseId } = {}) {
  const allKeys = Object.keys(localStorage);
  
  return allKeys.filter(key => {
    const parsed = parseStorageKey(key);
    if (!parsed) return false;
    
    if (userId && parsed.userId !== userId) return false;
    if (companyId && parsed.companyId !== companyId) return false;
    if (caseId && parsed.caseId !== caseId) return false;
    
    return true;
  });
}

/**
 * Rensar alla localStorage-nycklar för en specifik user/case
 * @param {Object} params - Filterparametrar
 * @param {string} [params.userId] - Filtrera på user ID
 * @param {string} [params.companyId] - Filtrera på company ID
 * @param {string} [params.caseId] - Filtrera på case ID
 * @returns {number} Antal borttagna nycklar
 */
export function clearStorageKeys({ userId, companyId, caseId } = {}) {
  const keysToRemove = findStorageKeys({ userId, companyId, caseId });
  
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
    console.log(`🗑️ Removed localStorage key: ${key}`);
  });
  
  return keysToRemove.length;
}

/**
 * Migrerar gamla localStorage-nycklar till nytt format
 * Anropas vid app-start för bakåtkompatibilitet
 * @param {string} userId - Nuvarande user ID
 * @returns {Object} Migreringsresultat
 */
export function migrateOldStorageKeys(userId) {
  const allKeys = Object.keys(localStorage);
  const result = {
    migrated: 0,
    removed: 0,
    errors: []
  };
  
  // Mönster för gamla nycklar: onboarding-{userId}-{companyId}-{caseId}-{slideKey}
  // OBS: Dessa använder "-" som separator vilket gör parsing svår
  const oldKeyPattern = /^onboarding-([^-]+-[^-]+-[^-]+-[^-]+-[^-]+)-([^-]+_[^-]+)-([^-]+-[^-]+-[^-]+-[^-]+-[^-]+)-(.+)$/;
  
  allKeys.forEach(key => {
    // Hoppa över nycklar som redan är i nytt format
    if (key.includes(SEPARATOR)) return;
    
    // Hoppa över icke-onboarding nycklar
    if (!key.startsWith('onboarding-') && !key.startsWith('onboarding_draft_')) return;
    
    try {
      // Försök identifiera gamla draft-nycklar
      if (key.startsWith('onboarding_draft_')) {
        // Format: onboarding_draft_{caseId}_{slideKey}
        const match = key.match(/^onboarding_draft_([^_]+(?:_[^_]+)?(?:-[^_]+)*)_([^_]+(?:_[^_]+)*)$/);
        if (match) {
          const [, caseId, slideKey] = match;
          const value = localStorage.getItem(key);
          
          // Skapa ny nyckel med userId
          const newKey = buildStorageKey({
            userId,
            companyId: 'unknown', // Vi vet inte companyId från gamla nycklar
            caseId,
            slideKey,
            type: 'draft'
          });
          
          localStorage.setItem(newKey, value);
          localStorage.removeItem(key);
          result.migrated++;
          console.log(`📦 Migrated: ${key} → ${newKey}`);
        }
        return;
      }
      
      // För gamla format är det svårt att parsa korrekt pga "-" i UUIDs
      // Säkrast att bara ta bort dem om de inte tillhör nuvarande user
      const value = localStorage.getItem(key);
      if (value) {
        try {
          const parsed = JSON.parse(value);
          // Om det finns data, behåll den (användaren kan behöva den)
          // Men logga för debugging
          console.log(`⚠️ Old format key found: ${key}`);
        } catch {
          // Ogiltig JSON - ta bort
          localStorage.removeItem(key);
          result.removed++;
        }
      }
      
    } catch (e) {
      result.errors.push({ key, error: e.message });
    }
  });
  
  console.log(`📊 Migration complete: ${result.migrated} migrated, ${result.removed} removed, ${result.errors.length} errors`);
  return result;
}

/**
 * Rensar ALLA gamla format-nycklar (för fresh start)
 * @returns {number} Antal borttagna nycklar
 */
export function clearAllOldFormatKeys() {
  const allKeys = Object.keys(localStorage);
  let removed = 0;
  
  allKeys.forEach(key => {
    // Behåll nycklar i nytt format (innehåller ::)
    if (key.includes(SEPARATOR)) return;
    
    // Behåll auth-nycklar
    if (key === 'accessToken' || key === 'refreshToken') return;
    
    // Behåll andra viktiga nycklar
    if (key === 'isDemoMode') return;
    
    // Ta bort gamla onboarding-nycklar
    if (key.startsWith('onboarding-') || 
        key.startsWith('onboarding_draft_') ||
        key === 'currentCompanyId' ||
        key === 'currentCompanyName' ||
        key === 'currentOrgnr' ||
        key === 'onboardingId' ||
        key === 'resumeMode' ||
        key === 'activeOnboarding') {
      localStorage.removeItem(key);
      removed++;
      console.log(`🗑️ Removed old format key: ${key}`);
    }
  });
  
  return removed;
}

/**
 * Visar en sammanfattning av alla localStorage-nycklar (för debugging)
 * @returns {Object} Sammanfattning grupperad per user/company/case
 */
export function debugStorageSummary() {
  const allKeys = Object.keys(localStorage);
  const summary = {
    newFormat: [],
    oldFormat: [],
    auth: [],
    other: []
  };
  
  allKeys.forEach(key => {
    if (key.includes(SEPARATOR)) {
      const parsed = parseStorageKey(key);
      summary.newFormat.push({ key, ...parsed });
    } else if (key.startsWith('onboarding')) {
      summary.oldFormat.push(key);
    } else if (key === 'accessToken' || key === 'refreshToken') {
      summary.auth.push(key);
    } else {
      summary.other.push(key);
    }
  });
  
  console.log('📊 localStorage Summary:');
  console.log(`   New format keys: ${summary.newFormat.length}`);
  console.log(`   Old format keys: ${summary.oldFormat.length}`);
  console.log(`   Auth keys: ${summary.auth.length}`);
  console.log(`   Other keys: ${summary.other.length}`);
  
  if (summary.oldFormat.length > 0) {
    console.log('⚠️ Old format keys (should be migrated):');
    summary.oldFormat.forEach(k => console.log(`   - ${k}`));
  }
  
  return summary;
}

export default {
  buildStorageKey,
  parseStorageKey,
  findStorageKeys,
  clearStorageKeys,
  migrateOldStorageKeys,
  clearAllOldFormatKeys,
  debugStorageSummary
};
