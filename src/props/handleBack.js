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
      // OBS: activeCase kan ha antingen caseId (från handleConfirmCompanySelection)
      // eller onboardingId (från handleResumeChoice) - hantera båda!
      const caseOrOnboardingId = activeCase?.caseId || activeCase?.onboardingId;
      const sessionId = isDraftMode
        ? `onboarding::draft::${tempCaseId}::${user?.id}`
        : storage.buildSessionId(activeCase?.companyId, caseOrOnboardingId, user?.id);
      storage.setCurrentTabSession({
        sessionId,
        currentSlide: prevSlide.key,
      });

      // Navigera
      setCurrentSlideKey(prevSlide.key);
      navigate(prevSlide.path);
    }
  };
};
