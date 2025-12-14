/**
 * StorageKeyBuilder
 * 
 * 🔑 Bygger localStorage-nycklar för onboarding-data
 *
 * ============================================================================
 * VIKTIGT: temp_case_id sparas ALDRIG på servern!
 * ============================================================================
 * 
 * FLÖDE:
 * 1. Login → Frontend genererar temp_case_id (t.ex. "temp_1701234567890_abc123")
 * 2. Användaren fyller i UppdragsvalsSlide → Data sparas i localStorage med draft-nyckel
 * 3. Användaren klickar "Fortsätt" → POINT OF NO RETURN
 *    a) Frontend skickar temp_case_id till server (/onboarding/commit)
 *    b) Server tar bort "temp_" prefix och skapar riktigt case_id
 *    c) Server skapar: data/companies/{company_id}/onboarding/case_{case_id}/
 *    d) Frontend konverterar localStorage från draft → permanent nyckel
 * 4. Om användaren loggar ut INNAN "Fortsätt":
 *    - "Logga ut" → localStorage rensas, ingenting sparas (temp försvinner)
 *    - Nästa login → Nytt temp_case_id genereras
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

const StorageKeyBuilder = {
  /**
   * Generera temporärt case_id
   * 
   * Format: "temp_" + timestamp + "_" + random suffix
   * Exempel: "temp_1701234567890_abc123"
   *
   * OBS: "temp_" prefix är signifikant! Servern använder det för att:
   * - Identifiera nya sessions
   * - Ta bort prefixet när riktigt case skapas
   */
  generateTempCaseId: () => {
    return `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  },
  
  /**
   * Bygg draft-nyckel (innan företag valts)
   * 
   * Exempel: "onboarding::draft::temp_1701234567890_abc123::user_456::pages::uppdragsval"
   *
   * Används för att spara data INNAN användaren har valt företag.
   * Denna data försvinner om användaren loggar ut utan att klicka "Fortsätt".
   */
  buildDraftKey: (tempCaseId, userId, dataType) => {
    return `onboarding::draft::${tempCaseId}::${userId}::${dataType}`;
  },
  
  /**
   * Bygg permanent nyckel (efter företag valts)
   * 
   * Exempel: "onboarding::5566778899_abc::abc123-def456::user_456::version"
   *
   * OBS: case_id är UUID utan "case_" prefix!
   * Servern lägger till "case_" i mappnamnet.
   *
   * Används EFTER "point of no return" - data är nu kopplad till ett
   * specifikt företag och case på servern.
   */
  buildPermanentKey: (company_id, case_id, userId, dataType) => {
    return `onboarding::${company_id}::${case_id}::${userId}::${dataType}`;
  },
  
  /**
   * Bygg nyckel för slide-data (med ::pages:: prefix)
   * 
   * Exempel: "onboarding::5566778899_abc::abc123-def456::user_456::pages::uppdragsval"
   * 
   * OBS: case_id är UUID utan "case_" prefix!
   */
  buildSlideKey: (company_id, case_id, userId, slideKey) => {
    return `onboarding::${company_id}::${case_id}::${userId}::pages::${slideKey}`;
  },
  
  /**
   * Bygg draft slide-nyckel (med ::pages:: prefix)
   */
  buildDraftSlideKey: (tempCaseId, userId, slideKey) => {
    return `onboarding::draft::${tempCaseId}::${userId}::pages::${slideKey}`;
  },
  
  /**
   * Bygg nyckel för version metadata
   */
  buildVersionKey: (company_id, case_id, userId) => {
    return `onboarding::${company_id}::${case_id}::${userId}::version`;
  },
  
  /**
   * Bygg nyckel för updated_by metadata
   */
  buildUpdatedByKey: (company_id, case_id, userId) => {
    return `onboarding::${company_id}::${case_id}::${userId}::updated_by`;
  },
  
  /**
   * Bygg nyckel för updated_at metadata
   */
  buildUpdatedAtKey: (company_id, case_id, userId) => {
    return `onboarding::${company_id}::${case_id}::${userId}::updated_at`;
  },
  
  /**
   * Parsa en nyckel för att extrahera komponenter
   * 
   * Input:  "onboarding::draft::temp_123::user_456::pages::uppdragsval"
   * Output: { type: 'onboarding', company_id: 'draft', case_id: 'temp_123', 
   *           userId: 'user_456', dataType: 'pages::uppdragsval', isDraft: true, isPageKey: true, slideKey: 'uppdragsval' }
   *
   * Input:  "onboarding::5566778899_abc::abc123-def456::user_456::version"
   * Output: { type: 'onboarding', company_id: '5566778899_abc', case_id: 'abc123-def456',
   *           userId: 'user_456', dataType: 'version', isDraft: false, isPageKey: false }
   * 
   * OBS: case_id i localStorage är UUID utan "case_" prefix!
   */
  parseKey: (key) => {
    const parts = key.split('::');
    if (parts.length < 5 || parts[0] !== 'onboarding') {
      return null;
    }
    
    // Kolla om det är en pages-nyckel (minst 6 delar: onboarding::X::X::X::pages::slideKey)
    const isPageKey = parts.length >= 6 && parts[4] === 'pages';
    
    return {
      type: parts[0],
      company_id: parts[1],
      case_id: parts[2],
      userId: parts[3],
      dataType: isPageKey ? parts.slice(4).join('::') : parts[4],
      isDraft: parts[1] === 'draft',
      isPageKey,
      slideKey: isPageKey ? parts[5] : null,
    };
  },
  
  /**
   * Hitta alla draft-nycklar för en användare
   */
  findDraftKeys: (userId) => {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`onboarding::draft::`) && key.includes(`::${userId}::`)) {
        keys.push(key);
      }
    }
    return keys;
  },
  
  /**
   * Hitta alla nycklar för ett specifikt temp_case_id
   */
  findKeysByTempCaseId: (tempCaseId) => {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes(`::${tempCaseId}::`)) {
        keys.push(key);
      }
    }
    return keys;
  },
};

export default StorageKeyBuilder;
