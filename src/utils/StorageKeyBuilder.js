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
 * NYCKELFORMAT:
 * - Draft:     onboarding::draft::temp_abc123::user_456::formData
 * - Permanent: onboarding::556677-8899::case_789::user_456::formData
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
   * Exempel: "onboarding::draft::temp_1701234567890_abc123::user_456::formData"
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
   * Exempel: "onboarding::556677-8899::case_789::user_456::formData"
   *
   * Används EFTER "point of no return" - data är nu kopplad till ett
   * specifikt företag och case på servern.
   */
  buildPermanentKey: (company_id, case_id, userId, dataType) => {
    return `onboarding::${company_id}::${case_id}::${userId}::${dataType}`;
  },
  
  /**
   * Parsa en nyckel för att extrahera komponenter
   * 
   * Input:  "onboarding::draft::temp_123::user_456::formData"
   * Output: { type: 'onboarding', company_id: 'draft', case_id: 'temp_123', 
   *           userId: 'user_456', dataType: 'formData', isDraft: true }
   */
  parseKey: (key) => {
    const parts = key.split('::');
    if (parts.length !== 5 || parts[0] !== 'onboarding') {
      return null;
    }
    return {
      type: parts[0],
      company_id: parts[1],
      case_id: parts[2],
      userId: parts[3],
      dataType: parts[4],
      isDraft: parts[1] === 'draft',
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
