/**
 * handleSidebarClick
 * Hanterar klick på sidebar - navigerar till vald slide
 *
 * ANROPAS FRÅN: Sidebar_v2 (SlideButton onClick)
 * EFFEKT: Navigerar till vald slide, loggar i history
 *
 * JÄMFÖR MED TIC-TAC-TOE:
 * I tic-tac-toe har vi history för att "gå tillbaka" till tidigare drag.
 * Här har vi navigationHistory för att se hur användaren navigerade.
 *
 * 🔒 VERSION-CHECK: Kontrollerar server-version INNAN navigation!
 */
export const createHandleSidebarClick = ({
  SLIDE_ORDER,
  checkVersionConflict,
  setNavigationHistory,
  currentSlideKey,
  activeCase,
  isDraftMode,
  tempCaseId,
  user,
  storage,
  setCurrentSlideKey,
  navigate
}) => {
  return async (slideKey) => {
    const slide = SLIDE_ORDER.find(s => s.key === slideKey);
    if (!slide) return;

    // ─────────────────────────────────────────────────────────────────────
    // 🔒 STEG 1: Kolla om server har nyare version
    // ─────────────────────────────────────────────────────────────────────
    const hasConflict = await checkVersionConflict();
    if (hasConflict) {
      console.log('[SIDEBAR] ⚠️ Konflikt - blockerar navigation till', slideKey);
      return; // Modal visas automatiskt av checkVersionConflict
    }

    // ─────────────────────────────────────────────────────────────────────
    // STEG 2: Lägg till i historik (för audit trail och eventuell undo)
    // ─────────────────────────────────────────────────────────────────────
    setNavigationHistory(prev => [...prev, {
      slideKey,
      timestamp: Date.now(),
      action: 'sidebar_click',
      fromSlide: currentSlideKey,
    }]);

    // Uppdatera tab session (för page reload)
    // OBS: activeCase kan ha antingen case_id (från handleConfirmCompanySelection)
    // eller case_id (från handleResumeChoice) - hantera båda!
    const caseOrOnboardingId = activeCase?.case_id || activeCase?.case_id;
    const session_id = isDraftMode
      ? `onboarding::draft::${tempCaseId}::${user?.id}`
      : storage.buildSessionId(activeCase?.company_id, caseOrOnboardingId, user?.id);
    storage.setCurrentTabSession({
      session_id,
      current_slide: slideKey,
    });

    setCurrentSlideKey(slideKey);
    navigate(slide.path);
  };
};
