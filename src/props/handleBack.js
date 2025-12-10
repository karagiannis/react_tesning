/**
 * handleBack
 * Navigerar tillbaka till föregående slide
 *
 * ANROPAS FRÅN: Varje slide's "Tillbaka"-knapp
 * EFFEKT: Navigerar bakåt (ändrar INTE completedSlides)
 */
export const createHandleBack = ({
  SLIDE_ORDER,
  currentSlideKey,
  setNavigationHistory,
  activeCase,
  isDraftMode,
  tempCaseId,
  user,
  storage,
  setCurrentSlideKey,
  navigate
}) => {
  return () => {
    const currentIndex = SLIDE_ORDER.findIndex(s => s.key === currentSlideKey);

    // Kolla att det finns en föregående slide
    if (currentIndex > 0) {
      const prevSlide = SLIDE_ORDER[currentIndex - 1];

      // Lägg till i history
      setNavigationHistory(prev => [...prev, {
        slideKey: prevSlide.key,
        timestamp: Date.now(),
        action: 'back',
        fromSlide: currentSlideKey,
      }]);

      // Uppdatera tab session (för page reload)
      // OBS: activeCase kan ha antingen case_id (från handleConfirmCompanySelection)
      // eller case_id (från handleResumeChoice) - hantera båda!
      const caseOrOnboardingId = activeCase?.case_id || activeCase?.case_id;
      const sessionId = isDraftMode
        ? `onboarding::draft::${tempCaseId}::${user?.id}`
        : storage.buildSessionId(activeCase?.company_id, caseOrOnboardingId, user?.id);
      storage.setCurrentTabSession({
        sessionId,
        current_slide: prevSlide.key,
      });

      // Navigera
      setCurrentSlideKey(prevSlide.key);
      navigate(prevSlide.path);
    }
  };
};
