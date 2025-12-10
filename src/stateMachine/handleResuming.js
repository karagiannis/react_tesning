/**
 * handleResuming.js
 * 
 * State Machine Handler: RESUMING
 * 
 * NÄR: Användaren klickade "Fortsätt" i resume-modal (ny login, har pending onboarding)
 * VAD:
 *   1. Hämta metadata från server för activeCase
 *   2. Rensa localStorage för detta case (selektiv rensning)
 *   3. Sätt isDraftMode=false (permanent case)
 *   4. Spara pages till permanent localStorage-nycklar
 *   5. Uppdatera React state med pages data
 *   6. Lås upp roaring data om det finns
 *   7. Navigera till senaste slide
 *   8. Sätt tab session
 * 
 * → READY
 */

import StorageKeyBuilder from '../utils/StorageKeyBuilder';

/**
 * Factory function som skapar handleResuming handler.
 * 
 * @param {Function} getState - Callback som returnerar aktuellt state
 * @param {Function} getActions - Callback som returnerar setters och actions
 * @param {Object} services - Objekt med api, storage, navigate, SLIDE_ORDER, AppState
 * @returns {Function} - Handler-funktion som kan anropas av state machine
 */
export function createHandleResuming(getState, getActions, services) {
  return async function handleResuming() {
    const { activeCase, user } = getState();
    
    const {
      setIsLoading,
      setError,
      setAppState,
      setIsDraftMode,
      setFormData,
      setCompletedSlides,
      setIsPaymentConfirmed,
      setCurrentSlideKey,
      setActiveCase,
    } = getActions();
    
    const { storage, api, navigate, SLIDE_ORDER, AppState } = services;
    
    setIsLoading(true);
    
    try {
      // Hämta all data från server
      console.log('[RESUMING] 📡 Fetching metadata for:', activeCase);
      const metadata = await api.fetchMetadata(
        activeCase.companyId, 
        activeCase.onboardingId
      );
      console.log('[RESUMING] ✅ Metadata received:', metadata);
      console.log('[RESUMING]   - version:', metadata.version);
      console.log('[RESUMING]   - lastModified:', metadata.lastModified);
      console.log('[RESUMING]   - modifiedBy:', metadata.modifiedBy);
      console.log('[RESUMING]   - pages:', Object.keys(metadata.pages || {}));
      
      // 📦 Extract pages data (alla slides sparas under pages[slideKey])
      const pagesData = { ...(metadata.pages || {}) };
      
      console.log('[RESUMING] 📦 Pages data:', pagesData);
      
      console.log('[RESUMING] 🧹 Clearing localStorage for THIS case only...');
      // Selektiv rensning: endast nycklar för detta specifika case
      const prefix = `onboarding::${activeCase.companyId}::${activeCase.onboardingId}::${user?.id}::`;
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(prefix)) {
          console.log(`[RESUMING]   🗑️ Removing: ${key}`);
          localStorage.removeItem(key);
        }
      });
      
      console.log('[RESUMING] 🔄 Setting isDraftMode=false (permanent case)');
      setIsDraftMode(false);
      storage.setIsDraftMode(false);
      
      // 🔑 KRITISKT: Sätt activeCase i React state så att slides kan ladda data
      console.log('[RESUMING] 📌 Setting activeCase in React state:', activeCase);
      setActiveCase(activeCase);
      
      // 🆕 NEW: Save each page SEPARATELY to PERMANENT localStorage keys
      console.log('[RESUMING] 💾 Saving pages to PERMANENT localStorage keys...');
      Object.entries(pagesData).forEach(([slideKey, slideData]) => {
        storage.setSlideData(slideKey, slideData);
        console.log(`[RESUMING]   ✓ Saved ${slideKey}:`, slideData);
      });
      
      // Save activeCase and completedSlides
      const permanentCompletedSlidesKey = StorageKeyBuilder.buildPermanentKey(
        activeCase.companyId,
        activeCase.onboardingId,
        user?.id,
        'completedSlides'
      );
      const permanentActiveCaseKey = StorageKeyBuilder.buildPermanentKey(
        activeCase.companyId,
        activeCase.onboardingId,
        user?.id,
        'activeCase'
      );
      
      localStorage.setItem(permanentCompletedSlidesKey, JSON.stringify(metadata.completedSlides || []));
      localStorage.setItem(permanentActiveCaseKey, JSON.stringify(activeCase));
      console.log('[RESUMING] ✅ Saved metadata to permanent keys');
      
      // 📌 SPARA SERVER VERSION för conflict detection
      const serverVersion = metadata.version || 0;
      const versionStorageKey = `case_${activeCase.companyId}_${activeCase.onboardingId}_version`;
      localStorage.setItem(versionStorageKey, JSON.stringify({
        version: serverVersion,
        timestamp: metadata.lastModified || new Date().toISOString(),
        syncedFromServer: true
      }));
      console.log('[RESUMING] 📌 Sparade server version:', serverVersion);
      
      // Uppdatera React state med rätt data
      console.log('[RESUMING] 🔄 Updating React state...');
      setFormData(pagesData);
      setCompletedSlides(metadata.completedSlides || []);
      console.log('[RESUMING] ✅ React state updated with pages data');
      
      // ─────────────────────────────────────────────────────────────────
      // 🔓 BETALNINGSSTATUS - Lås upp företagsdata-slides om betalning är bekräftad
      // ─────────────────────────────────────────────────────────────────
      const paymentConfirmed = metadata.subscription?.payment_confirmed_at;
      
      if (paymentConfirmed) {
        console.log('[RESUMING] 🔓 Payment confirmed - unlocking företagsdata slides');
        setIsPaymentConfirmed(true);
      }
      
      // Navigera till där användaren var senast
      const lastSlide = metadata.current_slide || metadata.lastSlide || 'uppdragsval';
      console.log('[RESUMING] 🧭 Navigating to slide:', lastSlide);
      setCurrentSlideKey(lastSlide);
      
      const slide = SLIDE_ORDER.find(s => s.key === lastSlide);
      if (slide) {
        navigate(slide.path);
      }
      
      // Sätt tab session för denna flik
      const caseOrOnboardingId = activeCase.caseId || activeCase.onboardingId;
      const sessionId = storage.buildSessionId(
        activeCase.companyId,
        caseOrOnboardingId,
        user?.id
      );
      storage.setCurrentTabSession({
        sessionId,
        currentSlide: lastSlide,
      });
      
      // Logga för audit trail
      await api.log(`Användare ${user?.name} återupptog onboarding för ${activeCase.companyName}`);
      
    } catch (e) {
      setError(e.message);
      // OBS: Vi går ändå till READY, men visar felmeddelande
    }
    
    setIsLoading(false);
    setAppState(AppState.READY);
  };
}
