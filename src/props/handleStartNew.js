/**
 * handleStartNew
 * Användaren vill börja ny onboarding
 *
 * ANROPAS FRÅN: OnboardingResumeDialog-modalen
 * EFFEKT: Rensar allt och navigerar till första sliden
 */
export const createHandleStartNew = ({
  storage,
  setFormData,
  setActiveCase,
  setCompletedSlides,
  tempCaseId,
  user,
  setCurrentSlideKey,
  navigate,
  setAppState,
  AppState
}) => {
  return () => {
    // 1. Rensa localStorage
    storage.clearFormData();
    storage.clearActiveCase();

    // 2. Rensa React state
    setFormData({});
    setActiveCase(null);
    setCompletedSlides([]);

    // 3. Sätt initial tab session (draft mode)
    const session_id = `onboarding::draft::${tempCaseId}::${user?.id}`;
    storage.setCurrentTabSession({
      session_id,
      current_slide: 'uppdragsval',
    });

    // 4. Navigera till första sliden
    setCurrentSlideKey('uppdragsval');
    navigate('/uppdragsval');

    // 5. Gå till normal drift
    setAppState(AppState.READY);
  };
};
