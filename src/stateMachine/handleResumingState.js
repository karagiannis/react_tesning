/**
 * handleResumingState.js
 * 
 * STATE: RESUMING
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * ENDA INGÅNG: Från SHOWING_RESUME (användaren klickar "Fortsätt" i modal)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * FLÖDE:
 *   CHECKING_PENDING → SHOWING_RESUME (modal visas)
 *          │
 *          │ Användaren klickar "Fortsätt" på en pending onboarding
 *          ▼
 *   handleResumeChoice(company_id, case_id, name)
 *          │
 *          │ setActiveCase({ company_id, case_id, company_name })
 *          │ setAppState(RESUMING)
 *          ▼
 *       RESUMING (denna handler)
 *          │
 *          │ 1. Hämta metadata från server för activeCase
 *          │ 2. Rensa localStorage för detta case (selektiv rensning)
 *          │ 3. Sätt isDraftMode=false (permanent case)
 *          │ 4. Spara pages till permanent localStorage-nycklar
 *          │ 5. Uppdatera React state med pages data
 *          │ 6. Lås upp roaring data om betalning bekräftad
 *          │ 7. Navigera till rätt slide (metadata.current_slide)
 *          │ 8. Sätt tab session
 *          ▼
 *        READY
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️  VIKTIGT: DETTA STATE PASSERAS *INTE* EFTER STRIPE-BETALNING!
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * NORMALT FLÖDE EFTER STRIPE (lyckad betalning):
 *   Stripe redirect → /payment-success?session_id=xxx
 *          ↓
 *   UNINITIALIZED → INITIALIZING → CHECKING_PENDING → VERIFYING_PAYMENT → READY
 *                                  (detekterar payment-success URL)
 * 
 * SHOWING_RESUME och RESUMING passeras ALDRIG efter Stripe-retur!
 * 
 * Varför?
 *   - handleCheckingPendingState.js kollar `isPaymentSuccessPage` FÖRST
 *   - Om true + pending finns → går direkt till VERIFYING_PAYMENT
 *   - SHOWING_RESUME triggas bara om pending finns OCH vi INTE är på payment-success
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧟 DEAD CODE: comingFromPaymentSuccess (rad ~100 och ~217)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Koden som kollar `comingFromPaymentSuccess` borde ALDRIG köras i normalt flöde
 * eftersom man inte kan nå RESUMING från /payment-success.
 * 
 * Koden behålls som "defense in depth" för edge cases:
 *   - Bug i CHECKING_PENDING som missar payment-success URL
 *   - Manuell URL-navigering till /payment-success efter SHOWING_RESUME
 *   - Race conditions eller oväntade state-övergångar
 * 
 * Om koden aldrig loggar "[RESUMING] 💳 Coming from payment-success" i produktion
 * under en längre tid, kan den tas bort.
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * UTGÅNGAR:
 * ═══════════════════════════════════════════════════════════════════════════
 *   → READY (navigerar till metadata.current_slide)
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

// Guard mot dubbla anrop (React StrictMode kör effects 2 gånger)
let resumingInProgress = false; // Enkel boolean - bara ett resume åt gången

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
      setHasAgreement,
      setCurrentSlideKey,
      setActiveCase,
      setTempCaseId,
    } = getActions();
    
    const { storage, api, navigate, SLIDE_ORDER, AppState } = services;
    
    // 🛡️ GUARD: Förhindra att handleResuming körs flera gånger samtidigt
    // (React StrictMode kör effects 2 gånger)
    if (resumingInProgress) {
      console.log('[RESUMING] ⚠️ Already resuming, skipping duplicate call');
      return;
    }
    resumingInProgress = true;
    
    setIsLoading(true);
    
    // ═══════════════════════════════════════════════════════════════════════
    // 🧟 DEAD CODE WARNING: comingFromPaymentSuccess
    // ═══════════════════════════════════════════════════════════════════════
    // Denna variabel borde ALDRIG vara true i normalt flöde!
    // 
    // Efter Stripe-betalning går flödet:
    //   /payment-success → CHECKING_PENDING → VERIFYING_PAYMENT → READY
    // 
    // RESUMING nås bara från SHOWING_RESUME (modal), som ALDRIG visas på
    // /payment-success eftersom handleCheckingPendingState.js kollar URL först.
    // 
    // Koden behålls som "defense in depth" - om den loggar i produktion
    // har vi en bug i CHECKING_PENDING.
    // ═══════════════════════════════════════════════════════════════════════
    const comingFromPaymentSuccess = window.location.pathname === '/payment-success' || 
        window.location.search.includes('session_id');
    if (comingFromPaymentSuccess) {
      console.warn('[RESUMING] ⚠️ UNEXPECTED: Coming from payment-success! This should go via VERIFYING_PAYMENT instead.');
    }

    // 🧹 RENSA temp_case_id - vi har nu ett permanent case
    
    // Deklarera paymentConfirmed utanför try-blocket så den är tillgänglig senare
    let paymentConfirmed = false;
    if (storage.getTempCaseId()) {
      console.log('[RESUMING] 🧹 Clearing temp_case_id (have permanent case now)');
      storage.clearTempCaseId();
      setTempCaseId(null);  // Clear from React state too
    }
    
    try {
      // Hämta all data från server
      console.log('[RESUMING] 📡 Fetching metadata for:', activeCase);
      const metadata = await api.fetchMetadata(
        activeCase.company_id, 
        activeCase.case_id
      );
      console.log('[RESUMING] ✅ Metadata received:', metadata);
      console.log('[RESUMING]   - version:', metadata.version);
      console.log('[RESUMING]   - last_modified:', metadata.last_modified);
      console.log('[RESUMING]   - modified_by:', metadata.modified_by);
      console.log('[RESUMING]   - pages:', Object.keys(metadata.pages || {}));
      
      // 📦 Extract pages data (alla slides sparas under pages[slideKey])
      const pagesData = { ...(metadata.pages || {}) };
      
      console.log('[RESUMING] 📦 Pages data:', pagesData);
      
      console.log('[RESUMING] 🧹 Clearing localStorage for THIS case only...');
      // Selektiv rensning: endast nycklar för detta specifika case
      const prefix = `onboarding::${activeCase.company_id}::${activeCase.case_id}::${user?.id}::`;
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
      // VIKTIGT: Vi använder StorageKeyBuilder.buildPermanentKey() direkt istället för
      // storage.setSlideData() eftersom React state (isDraftMode, activeCase) inte har
      // uppdaterats synkront ännu och storage._buildKey() skulle läsa gamla värden!
      console.log('[RESUMING] 💾 Saving pages to PERMANENT localStorage keys...');
      Object.entries(pagesData).forEach(([slideKey, slideData]) => {
        const permanentKey = StorageKeyBuilder.buildPermanentKey(
          activeCase.company_id,
          activeCase.case_id,
          user?.id,
          slideKey
        );
        localStorage.setItem(permanentKey, JSON.stringify(slideData));
        console.log(`[RESUMING]   ✓ Saved ${slideKey} to key: ${permanentKey}`);
      });
      
      // Save activeCase and completedSlides
      const permanentCompletedSlidesKey = StorageKeyBuilder.buildPermanentKey(
        activeCase.company_id,
        activeCase.case_id,
        user?.id,
        'completedSlides'
      );
      const permanentActiveCaseKey = StorageKeyBuilder.buildPermanentKey(
        activeCase.company_id,
        activeCase.case_id,
        user?.id,
        'activeCase'
      );
      
      localStorage.setItem(permanentCompletedSlidesKey, JSON.stringify(metadata.completedSlides || []));
      localStorage.setItem(permanentActiveCaseKey, JSON.stringify(activeCase));
      console.log('[RESUMING] ✅ Saved metadata to permanent keys');
      
      // 📌 SPARA SERVER VERSION för conflict detection
      const server_version = metadata.version || 0;
      const versionStorageKey = `case_${activeCase.company_id}_${activeCase.case_id}_version`;
      localStorage.setItem(versionStorageKey, JSON.stringify({
        version: server_version,
        timestamp: metadata.last_modified || new Date().toISOString(),
        syncedFromServer: true
      }));
      console.log('[RESUMING] 📌 Sparade server version:', server_version);
      
      // Uppdatera React state med rätt data
      console.log('[RESUMING] 🔄 Updating React state...');
      setFormData(pagesData);
      setCompletedSlides(metadata.completedSlides || []);
      console.log('[RESUMING] ✅ React state updated with pages data');
      
      // ─────────────────────────────────────────────────────────────────
      // 🔓 BETALNINGSSTATUS - Lås upp företagsdata-slides om betalning är bekräftad
      // ─────────────────────────────────────────────────────────────────
      paymentConfirmed = !!metadata.subscription?.payment_confirmed_at;
      
      if (paymentConfirmed) {
        console.log('[RESUMING] 🔓 Payment confirmed - unlocking företagsdata slides');
        setIsPaymentConfirmed(true);
        setHasAgreement(true);  // 🔓 Låser upp betalvägg för riskfragor-1 → riskfragor-2
      }
      
      // ═══════════════════════════════════════════════════════════════════
      // 🧟 DEAD CODE: comingFromPaymentSuccess fallback
      // ═══════════════════════════════════════════════════════════════════
      // Denna kod borde ALDRIG köras!
      // 
      // I normalt flöde efter Stripe:
      //   /payment-success → CHECKING_PENDING → VERIFYING_PAYMENT → READY
      // 
      // RESUMING nås bara från SHOWING_RESUME modal, som inte visas på
      // /payment-success. Om denna kod körs har vi en bug.
      // 
      // Behålls som "defense in depth" - om loggen syns i produktion,
      // undersök varför CHECKING_PENDING inte fångade payment-success URL.
      // ═══════════════════════════════════════════════════════════════════
      if (comingFromPaymentSuccess) {
        console.error('[RESUMING] 🚨 BUG: Reached RESUMING from payment-success! Should have gone via VERIFYING_PAYMENT.');
        console.error('[RESUMING] 🚨 Payment confirmed:', paymentConfirmed);
        
        // 🔑 KRITISKT: Sätt currentSlideKey så React vet vilken slide som ska renderas
        setCurrentSlideKey('payment-success');
        
        // Sätt tab session men STANNA på payment-success
        const sessionId = storage.buildSessionId(
          activeCase.company_id,
          activeCase.case_id,
          user?.id
        );
        storage.setCurrentTabSession({
          session_id: sessionId,
          current_slide: 'payment-success',
        });
        
        // Gå till READY - PaymentSuccessSlide renderas via Route
        // PaymentSuccessSlide använder paymentVerificationStatus för att visa rätt UI
        resumingInProgress = false;
        setIsLoading(false);
        setAppState(AppState.READY);
        return; // AVBRYT här - navigera INTE bort!
      }
      
      // Navigera till rätt slide (endast om vi INTE kommer från payment-success)
      let targetSlide = metadata.current_slide || 'uppdragsval';
      
      console.log('[RESUMING] 🧭 Navigating to slide:', targetSlide);
      setCurrentSlideKey(targetSlide);
      
      const slide = SLIDE_ORDER.find(s => s.key === targetSlide);
      if (slide) {
        console.log('[RESUMING] 🚀 React Router navigate to:', slide.path, '(replace: true)');
        navigate(slide.path, { replace: true });
      } else {
        console.warn('[RESUMING] ⚠️ Could not find slide in SLIDE_ORDER:', targetSlide);
      }
      
      // Sätt tab session för denna flik
      const sessionId = storage.buildSessionId(
        activeCase.company_id,
        activeCase.case_id,
        user?.id
      );
      storage.setCurrentTabSession({
        session_id: sessionId,
        current_slide: targetSlide,
      });
      
      // Logga för audit trail
      await api.log(`Användare ${user?.name} återupptog onboarding för ${activeCase.company_name}`);
      
    } catch (e) {
      setError(e.message);
      // OBS: Vi går ändå till READY, men visar felmeddelande
    }
    
    // 🛡️ Rensa guard - nu är vi klara
    resumingInProgress = false;
    
    setIsLoading(false);
    
    // ─────────────────────────────────────────────────────────────────
    // AVGÖR NÄSTA STATE
    // ─────────────────────────────────────────────────────────────────
    // OBS: Om vi kom från payment-success har vi redan returnerat ovan (rad ~210)
    // Så här kommer vi bara om det INTE var payment-success
    setAppState(AppState.READY);
  };
}
