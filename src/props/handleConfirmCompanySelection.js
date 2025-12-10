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
}) => {
  return async (company_id, company_name, orgnr) => {
    console.log(`[POINT OF NO RETURN] Company selected: ${company_name} (${orgnr})`);
    console.log(`[POINT OF NO RETURN] Sending temp_case_id: ${tempCaseId}`);
    
    setIsLoading(true);
    
    try {
      // ─────────────────────────────────────────────────────────────────
      // Steg 1: Skicka till /onboarding/commit
      // ─────────────────────────────────────────────────────────────────
      //
      // Servern förväntar sig:
      // - case_id: "temp_xxx" (vi skickar vårt temp_case_id)
      // - company_id: Om känt (kan vara tomt för nya företag)
      // - orgnr: Organisationsnummer
      // - company_name: Företagsnamn
      // - form_data: All formulärdata (opak dict)
      //
      const response = await api.fetch('/onboarding/commit', {
        method: 'POST',
        body: JSON.stringify({
          case_id: tempCaseId,           // "temp_1701234567890_abc123"
          company_id: company_id || '',    // Om vi redan har company_id
          orgnr: orgnr,
          company_name: company_name,
          form_data: formData['uppdragsval'] || {},  // Formulärdata från Uppdragsval
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
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
