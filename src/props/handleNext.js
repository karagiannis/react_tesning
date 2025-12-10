/**
 * handleNext
 * Hanterar "Nästa"-knappen - validering, server-push, navigation
 *
 * FLÖDE:
 *   1. Kolla version conflict
 *   2. POST slide-data till server
 *   3. Uppdatera localStorage + state
 *   4. Navigera till nästa slide
 */
export const createHandleNext = ({
  SLIDE_ORDER,
  currentSlideKey,
  isDraftMode,
  checkVersionConflict,
  hasAgreement,
  setShowAgreementModal,
  setIsLoading,
  setSyncStatus,
  setError,
  formData,
  activeCase,
  api,
  setConflictInfo,
  setShowConflictModal,
  storage,
  completedSlides,
  setCompletedSlides,
  tempCaseId,
  user,
  setNavigationHistory,
  setCurrentSlideKey,
  navigate
}) => {
  return async () => {
    const currentIndex = SLIDE_ORDER.findIndex(s => s.key === currentSlideKey);

    // Kolla att det finns en nästa slide
    if (currentIndex >= SLIDE_ORDER.length - 1) return;

    // ─────────────────────────────────────────────────────────────────────
    // 🔒 STEG 0: Kolla om server har nyare version (om inte draft mode)
    // ─────────────────────────────────────────────────────────────────────
    if (!isDraftMode) {
      const hasConflict = await checkVersionConflict();
      if (hasConflict) {
        console.log('[NEXT] ⚠️ Konflikt - blockerar navigation');
        return; // Modal visas automatiskt av checkVersionConflict
      }
    }

    // ─────────────────────────────────────────────────────────────────────
    // 💳 STEG 0.5: Agreement check för riskfragor (Steg 1)
    // ─────────────────────────────────────────────────────────────────────
    //
    // När användaren trycker "Nästa" på riskfragor-1 slide:
    // - Om de inte har betalat (hasAgreement = false), visa AgreementModal
    // - Användaren väljer betalningsmetod → Stripe → callback → fortsätt
    // - Om de HAR betalat (hasAgreement = true), fortsätt normalt
    //
    if (currentSlideKey === 'riskfragor-1' && !hasAgreement && !isDraftMode) {
      console.log('[NEXT] 💳 Riskfrågor-1 utan avtal - visar AgreementModal');
      setShowAgreementModal(true);
      return; // Blockera navigation tills betalning är klar
    }

    // ─────────────────────────────────────────────────────────────────────
    // 📤 STEG 1: PUSH TILL SERVER
    // ─────────────────────────────────────────────────────────────────────
    //
    // Varje slide har sin egen endpoint. AuthenticatedApp vet vilken slide
    // som är aktiv och anropar rätt endpoint.
    //
    setIsLoading(true);
    setSyncStatus('saving');
    setError(null);

    try {
      const slideData = formData[currentSlideKey] || {};

      // ═══════════════════════════════════════════════════════════════════
      // SPECIAL CASE: uppdragsval (POINT OF NO RETURN)
      // ═══════════════════════════════════════════════════════════════════
      if (currentSlideKey === 'uppdragsval') {
        // Detta hanteras av wrappern i Route - den anropar handleConfirmCompanySelection
        // Se Route path="/uppdragsval" nedan
        console.log('[NEXT] uppdragsval - handled by wrapper, should not reach here');
        setIsLoading(false);
        setSyncStatus('idle');
        return;
      }

      // ═══════════════════════════════════════════════════════════════════
      // NORMAL CASE: Alla andra slides
      // ═══════════════════════════════════════════════════════════════════
      //
      // POST /api/onboarding/slide/{slide_key}
      //
      // Body:
      // {
      //   case_id: "uuid",
      //   company_id: "orgnr_prefix",
      //   slide_data: { ... all form data for this slide ... }
      // }
      //
      // Response:
      // {
      //   success: true,
      //   version: 5,  // New server version
      //   slide_key: "riskfragor"
      // }
      //
      if (!isDraftMode && activeCase?.case_id) {
        console.log(`[NEXT] 📤 Pushing slide data: ${currentSlideKey}`);

        const response = await api.fetch(`/onboarding/slide/${currentSlideKey}`, {
          method: 'POST',
          body: JSON.stringify({
            case_id: activeCase.case_id,
            company_id: activeCase.company_id,
            slide_data: slideData,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));

          // Hantera version conflict
          if (response.status === 409) {
            console.log('[NEXT] ⚠️ Server returnerade 409 - version conflict');
            setConflictInfo(errorData);
            setShowConflictModal(true);
            setIsLoading(false);
            setSyncStatus('conflict');
            return;
          }

          throw new Error(errorData.detail || `HTTP ${response.status}`);
        }

        const result = await response.json();
        console.log(`[NEXT] ✅ Server saved slide, new version: ${result.version}`);

        // Uppdatera lokal version
        const versionKey = `case_${activeCase.company_id}_${activeCase.case_id}_version`;
        localStorage.setItem(versionKey, JSON.stringify({
          version: result.version,
          timestamp: new Date().toISOString(),
          current_slide: currentSlideKey,
        }));

      } else {
        // Draft mode - bara spara lokalt
        console.log(`[NEXT] 📝 Draft mode - only saving to localStorage`);
      }

      setSyncStatus('saved');

    } catch (err) {
      console.error('[NEXT] Error pushing to server:', err);
      setError(`Kunde inte spara: ${err.message}`);
      setSyncStatus('idle');
      setIsLoading(false);
      return; // Avbryt navigation vid fel
    }

    // ─────────────────────────────────────────────────────────────────────
    // ✅ STEG 2: Uppdatera state och navigera
    // ─────────────────────────────────────────────────────────────────────

    // 1. Markera nuvarande som klar (immutable update!)
    const newCompleted = [...completedSlides, currentSlideKey];
    setCompletedSlides(newCompleted);
    storage.setCompletedSlides(newCompleted);

    // 2. Spara formData till localStorage
    storage.setFormData(formData);

    // 3. Uppdatera local version timestamp
    localStorage.setItem('local_version', JSON.stringify({
      version: (JSON.parse(localStorage.getItem('local_version') || '{}')?.version || 0) + 1,
      timestamp: new Date().toISOString(),
      current_slide: currentSlideKey
    }));

    // 4. Lägg till i navigation history
    const nextSlide = SLIDE_ORDER[currentIndex + 1];
    setNavigationHistory(prev => [...prev, {
      slideKey: nextSlide.key,
      timestamp: Date.now(),
      action: 'next',
      fromSlide: currentSlideKey,
    }]);

    // 5. Uppdatera tab session (för page reload)
    // OBS: activeCase kan ha antingen case_id (från handleConfirmCompanySelection)
    // eller case_id (från handleResumeChoice) - hantera båda!
    const caseOrOnboardingId = activeCase?.case_id || activeCase?.case_id;
    const sessionId = isDraftMode
      ? `onboarding::draft::${tempCaseId}::${user?.id}`
      : storage.buildSessionId(activeCase?.company_id, caseOrOnboardingId, user?.id);
    storage.setCurrentTabSession({
      sessionId,
      current_slide: nextSlide.key,
    });

    // 6. Navigera
    setCurrentSlideKey(nextSlide.key);
    navigate(nextSlide.path);

    // 7. Reset loading state
    setIsLoading(false);

    // 8. Reset sync status efter kort delay (så användaren ser "Saved")
    setTimeout(() => setSyncStatus('idle'), 1500);
  };
};
