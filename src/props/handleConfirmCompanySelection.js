/**
 * handleConfirmCompanySelection
 * 
 * 🎯 POINT OF NO RETURN - Bekräftar företagsval och skapar ärende på server
 *
 * ANROPAS FRÅN: UppdragsvalsSlide när användaren klickar "Fortsätt"
 *               efter att ha valt ett företag
 *
 * FLÖDE:
 * 1. Frontend skickar temp_case_id (t.ex. "temp_1701234567890_abc123") till server
 * 2. Server tar bort "temp_" prefix → case_id = "1701234567890_abc123"
 * 3. Server skapar: data/companies/{company_id}/onboarding/case_{case_id}/
 * 4. Server returnerar { case_id, company_id, ... }
 * 5. Frontend konverterar localStorage: draft::temp_xxx → permanent::company::case
 * 6. isDraftMode = false
 *
 * OBS: temp_case_id genereras av FRONTEND vid login.
 *      Servern transformerar det genom att ta bort "temp_" prefix.
 */
export const createHandleConfirmCompanySelection = ({
  tempCaseId,
  formData,
  api,
  storage,
  user,
  setIsLoading,
  setError,
  setIsDraftMode,
  setActiveCase,
  SLIDE_ORDER,
  activeCase,  // Befintligt case vid resume
  // 🆕 Version conflict callbacks
  setShowConflictModal,
  setConflictInfo,
}) => {
  return async (company_id, company_name, orgnr) => {
    // ─────────────────────────────────────────────────────────────────
    // RESUME FIX: Om vi har ett befintligt permanent case_id, använd det!
    // ─────────────────────────────────────────────────────────────────
    const existingCaseId = activeCase?.case_id;
    const existingCompanyId = activeCase?.company_id;  // 🆕 Hämta company_id från activeCase
    const isResumingExistingCase = existingCaseId && !existingCaseId.startsWith('temp_');
    const caseIdToSend = isResumingExistingCase ? existingCaseId : tempCaseId;
    const companyIdToUse = isResumingExistingCase ? (existingCompanyId || company_id || '') : (company_id || '');  // 🆕 Använd activeCase.company_id vid resume
    
    console.log(`[POINT OF NO RETURN] Company selected: ${company_name} (${orgnr})`);
    console.log(`[POINT OF NO RETURN] activeCase.case_id: ${existingCaseId}`);
    console.log(`[POINT OF NO RETURN] activeCase.company_id: ${existingCompanyId}`);  // 🆕 Logga
    console.log(`[POINT OF NO RETURN] isResumingExistingCase: ${isResumingExistingCase}`);
    console.log(`[POINT OF NO RETURN] Sending case_id: ${caseIdToSend}`);
    console.log(`[POINT OF NO RETURN] Sending company_id: ${companyIdToUse}`);  // 🆕 Logga
    
    setIsLoading(true);
    
    try {
      // ─────────────────────────────────────────────────────────────────
      // Steg 1: Skicka till /onboarding/commit
      // ─────────────────────────────────────────────────────────────────
      //
      // Servern förväntar sig:
      // - case_id: "temp_xxx" för ny session ELLER permanent case_id vid resume
      // - company_id: Om känt (kan vara tomt för nya företag)
      // - orgnr: Organisationsnummer
      // - company_name: Företagsnamn
      // - form_data: All formulärdata (opak dict)
      // - expected_version: För optimistic locking (konfliktdetektering)
      //
      
      // Hämta expected_version för befintliga cases
      let expected_version = null;
      if (isResumingExistingCase && companyIdToUse) {  // 🆕 Använd companyIdToUse
        const versionKey = `case_${companyIdToUse}_${existingCaseId}_version`;
        const versionStr = localStorage.getItem(versionKey);
        if (versionStr) {
          try {
            const versionObj = JSON.parse(versionStr);
            expected_version = versionObj.version || 0;
            console.log(`[POINT OF NO RETURN] Sending expected_version: ${expected_version}`);
          } catch (e) {
            console.warn('[POINT OF NO RETURN] Could not parse version from localStorage');
          }
        }
      }
      
      const response = await api.fetch('/onboarding/commit', {
        method: 'POST',
        body: JSON.stringify({
          case_id: caseIdToSend,              // Permanent case_id vid resume, annars temp_xxx
          company_id: companyIdToUse,         // 🆕 Använd companyIdToUse
          orgnr: orgnr,
          company_name: company_name,
          form_data: formData['uppdragsval'] || {},  // Formulärdata från Uppdragsval
          expected_version: expected_version,        // Optimistic locking
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // 🆕 Handle version conflict (409)
        if (response.status === 409) {
          console.log('[POINT OF NO RETURN] ⚠️ VERSION CONFLICT DETECTED!');
          console.log('[POINT OF NO RETURN] Server version:', errorData.server_version);
          console.log('[POINT OF NO RETURN] Modified by:', errorData.modified_by);
          console.log('[POINT OF NO RETURN] setShowConflictModal exists:', !!setShowConflictModal);
          console.log('[POINT OF NO RETURN] setConflictInfo exists:', !!setConflictInfo);
          
          // Hämta lokal data för diff-visning
          const localUppdragsvalData = formData['uppdragsval'] || {};
          console.log('[POINT OF NO RETURN] Local data for comparison:', localUppdragsvalData);
          
          // Visa conflict modal om callbacks finns
          if (setShowConflictModal && setConflictInfo) {
            console.log('[POINT OF NO RETURN] 🎯 CALLING setConflictInfo and setShowConflictModal');
            setConflictInfo({
              ...errorData,
              slide_key: 'uppdragsval',
              // Inkludera lokal data för diff-visning
              localData: {
                selected_services: localUppdragsvalData.selected_services || [],
                other_services: localUppdragsvalData.other_services || '',
              },
            });
            setShowConflictModal(true);
            console.log('[POINT OF NO RETURN] ✅ Modal should be visible now');
          } else {
            console.error('[POINT OF NO RETURN] ❌ Missing callbacks - cannot show modal!');
          }
          
          setIsLoading(false);
          return {
            success: false,
            error: 'Version conflict',
            conflict: true,
            conflictInfo: errorData,
          };
        }
        
        throw new Error(errorData.detail || 'Kunde inte skapa ärende på server');
      }
      
      const result = await response.json();
      
      // Servern returnerar:
      // - case_id: "1701234567890_abc123" (utan "temp_" prefix)
      // - company_id: "5566778899_abc123" (genererat eller befintligt)
      // - was_temp: true (om det var en temp-session)
      
      const serverCaseId = result.case_id || result.case_id;
      const serverCompanyId = result.company_id;
      
      console.log(`[POINT OF NO RETURN] Server created case: ${serverCaseId}`);
      console.log(`[POINT OF NO RETURN] Company ID: ${serverCompanyId}`);
      console.log(`[POINT OF NO RETURN] Was temp: ${result.was_temp}`);
      
      // ─────────────────────────────────────────────────────────────────
      // Steg 2: Konvertera localStorage från draft till permanent
      // ─────────────────────────────────────────────────────────────────
      //
      // Innan: onboarding::draft::temp_xxx::user_456::formData
      // Efter:  onboarding::5566778899_abc::case_xxx::user_456::formData
      //
      storage.convertDraftToPermanent(serverCompanyId, serverCaseId, user.id);
      
      // ─────────────────────────────────────────────────────────────────
      // Steg 3: Uppdatera React state
      // ─────────────────────────────────────────────────────────────────
      setIsDraftMode(false);
      setActiveCase({
        company_id: serverCompanyId,
        case_id: serverCaseId,
        company_name: result.company_name || company_name,
        orgnr: result.orgnr || orgnr,
      });
      
      // ─────────────────────────────────────────────────────────────────
      // Steg 4: Logga för audit trail
      // ─────────────────────────────────────────────────────────────────
      await api.log(`POINT OF NO RETURN: ${user.name} bekräftade företagsval`, {
        company_id: serverCompanyId,
        company_name: result.company_name || company_name,
        orgnr: result.orgnr || orgnr,
        case_id: serverCaseId,
        previousTempCaseId: tempCaseId,
        wasTemp: result.was_temp,
      });
      
      // ─────────────────────────────────────────────────────────────────
      // Steg 5: Navigera till nästa slide (riskfragor)
      // ─────────────────────────────────────────────────────────────────
      // Vi navigerar direkt istället för att anropa handleNext() eftersom
      // handleNext() har en special-case för 'uppdragsval' som returnerar tidigt.
      const currentIndex = SLIDE_ORDER.findIndex(s => s.key === 'uppdragsval');
      const nextSlide = SLIDE_ORDER[currentIndex + 1];
      
      // ✅ RETURNERA INFO - låt AuthenticatedApp hantera routing!
      console.log(`[POINT OF NO RETURN] ✅ Commit successful, returning next slide info`);
      setIsLoading(false);
      
      return {
        success: true,
        company_id: serverCompanyId,
        case_id: serverCaseId,
        nextSlide: nextSlide || null,
      };
      
    } catch (e) {
      console.error('[POINT OF NO RETURN] Error:', e);
      setError(`Kunde inte bekräfta företagsval: ${e.message}`);
      setIsLoading(false);
      return {
        success: false,
        error: e.message,
      };
    }
  };
};
