/**
 * handleProcessingBackState.js
 * 
 * STATE: PROCESSING_BACK
 * 
 * ANSVAR: Hantera "Tillbaka"-klick - navigera till föregående slide
 * 
 * INGÅNG: Användaren klickade "Tillbaka"
 * 
 * UTGÅNGAR:
 *   → READY  (alltid - efter navigation)
 * 
 * OBS: Ingen server-save vid bakåt-navigation
 */

import AppState from './AppState';

export function createHandleProcessingBackState(getState, getActions, services) {
  return async function handleProcessingBackState() {
    const { SLIDE_ORDER, navigate } = services;
    const { currentSlideKey } = getState();
    const { 
      setCurrentSlideKey, 
      setNavigationHistory, 
      setAppState 
    } = getActions();

    console.log(`[PROCESSING_BACK] Processing Back from slide: ${currentSlideKey}`);

    // ─────────────────────────────────────────────────────────────────
    // Steg 1: Hitta föregående slide
    // ─────────────────────────────────────────────────────────────────
    const currentIndex = SLIDE_ORDER.findIndex(s => s.key === currentSlideKey);
    
    if (currentIndex <= 0) {
      console.log('[PROCESSING_BACK] Already at first slide');
      setAppState(AppState.READY);
      return;
    }

    const prevSlide = SLIDE_ORDER[currentIndex - 1];

    // ─────────────────────────────────────────────────────────────────
    // Steg 2: Navigera bakåt (ingen server-save)
    // ─────────────────────────────────────────────────────────────────
    console.log(`[PROCESSING_BACK] Navigating back to: ${prevSlide.key}`);
    setCurrentSlideKey(prevSlide.key);
    navigate(prevSlide.path);

    // ─────────────────────────────────────────────────────────────────
    // Steg 3: Logga navigation history
    // ─────────────────────────────────────────────────────────────────
    setNavigationHistory(prev => [...prev, {
      slideKey: prevSlide.key,
      timestamp: Date.now(),
      action: 'back',
      fromSlide: currentSlideKey,
    }]);

    // ─────────────────────────────────────────────────────────────────
    // UTGÅNG: READY
    // ─────────────────────────────────────────────────────────────────
    setAppState(AppState.READY);
  };
}
