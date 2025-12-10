/**
 * handleInitializing.js
 * 
 * State Machine Handler: INITIALIZING
 * 
 * NÄR: Direkt efter UNINITIALIZED
 * VAD: 
 *   1. Kolla att token finns (annars ERROR)
 *   2. Hämta/generera tempCaseId för draft-läge
 *   3. Hämta användarinfo
 *   4. Logga inloggning till server
 *   5. Kolla om vi har en pågående session i denna flik
 * 
 * OM PÅGÅENDE SESSION:
 *   → RESTORING_SESSION
 * ANNARS:    
 *   → CHECKING_PENDING
 */

import StorageKeyBuilder from '../utils/StorageKeyBuilder';

/**
 * Factory function som skapar handleInitializing handler.
 * 
 * Använder getter-callback pattern för att alltid hämta aktuella värden
 * av dependencies som ändras under komponentens livstid.
 * 
 * @param {Function} getState - Callback som returnerar aktuellt state
 * @param {Function} getActions - Callback som returnerar setters och actions
 * @param {Object} services - Objekt med api och storage (statiska)
 * @returns {Function} - Handler-funktion som kan anropas av state machine
 */
export function createHandleInitializing(getState, getActions, services) {
  return async function handleInitializing() {
    // Hämta aktuella actions (setters)
    const {
      setIsLoading,
      setError,
      setAppState,
      setTempCaseId,
      setIsDraftMode,
      setUser,
    } = getActions();
    
    const { storage, api, AppState } = services;
    
    setIsLoading(true);
    
    // ─────────────────────────────────────────────────────────────────
    // Steg 1: Verifiera att vi har en token
    // ─────────────────────────────────────────────────────────────────
    const token = storage.getToken();
    if (!token) {
      setError('Ingen token hittad - du måste logga in igen');
      setAppState(AppState.ERROR);
      return; // Avbryt här
    }
    
    // ─────────────────────────────────────────────────────────────────
    // Steg 2: Hantera tempCaseId och draft-läge
    // ─────────────────────────────────────────────────────────────────
    let currentTempCaseId = storage.getTempCaseId();
    const currentIsDraftMode = storage.getIsDraftMode();
    
    if (!currentTempCaseId) {
      // Första gången - generera nytt tempCaseId
      currentTempCaseId = StorageKeyBuilder.generateTempCaseId();
      storage.setTempCaseId(currentTempCaseId);
      console.log(`[INIT] Generated new tempCaseId: ${currentTempCaseId}`);
    } else {
      console.log(`[INIT] Using existing tempCaseId: ${currentTempCaseId}`);
    }
    
    setTempCaseId(currentTempCaseId);
    setIsDraftMode(currentIsDraftMode);
    console.log(`[INIT] isDraftMode: ${currentIsDraftMode}`);
    
    // ─────────────────────────────────────────────────────────────────
    // Steg 3: Hämta användarinfo från /api/me
    // ─────────────────────────────────────────────────────────────────
    let userInfo;
    try {
      userInfo = await api.fetchMe();
      console.log('[INIT] Fetched user info from /api/me:', userInfo);
    } catch (e) {
      console.error('[INIT] Failed to fetch /api/me:', e);
      setError('Kunde inte hämta användarinfo - försök logga in igen');
      setAppState(AppState.ERROR);
      return;
    }
    setUser(userInfo);
    
    // ─────────────────────────────────────────────────────────────────
    // Steg 4: Logga inloggning till server (audit trail)
    // ─────────────────────────────────────────────────────────────────
    await api.log(`Användare ${userInfo.name} är inloggad`, {
      userId: userInfo.id,
      email: userInfo.email,
      role: userInfo.role,
      tempCaseId: currentTempCaseId,
      isDraftMode: currentIsDraftMode,
    });
    
    // Logga också till personlig logg
    await api.logPersonal('Session startad', {
      tempCaseId: currentTempCaseId,
      isDraftMode: currentIsDraftMode,
    });
    
    // ─────────────────────────────────────────────────────────────────
    // Steg 5: Kolla om vi har en AKTIV SESSION i denna flik (page reload)
    // ─────────────────────────────────────────────────────────────────
    const currentTabSession = storage.getCurrentTabSession();
    
    setIsLoading(false);
    
    // ─────────────────────────────────────────────────────────────────
    // VIKTIG VALIDERING: Kontrollera att sessionen tillhör DENNA användare!
    // ─────────────────────────────────────────────────────────────────
    let sessionBelongsToUser = false;
    if (currentTabSession && currentTabSession.sessionId && userInfo?.id) {
      const sessionParts = currentTabSession.sessionId.split('::');
      const sessionUserId = sessionParts[sessionParts.length - 1];
      sessionBelongsToUser = (sessionUserId === userInfo.id);
      
      if (!sessionBelongsToUser) {
        console.warn('[INIT] ⚠️ Session belongs to different user!');
        console.warn(`[INIT]   Session user: ${sessionUserId}`);
        console.warn(`[INIT]   Current user: ${userInfo.id}`);
        console.log('[INIT] Clearing stale tab session...');
        storage.clearCurrentTabSession();
      }
    }
    
    if (currentTabSession && currentTabSession.sessionId && sessionBelongsToUser) {
      // ═══════════════════════════════════════════════════════════════
      // PAGE RELOAD: Användaren var mitt i en session i denna flik
      // ═══════════════════════════════════════════════════════════════
      
      // 🔒 SPECIAL CASE: Om vi är på /payment-success, gå till CHECKING_PENDING
      // så att RESUMING kan hämta activeCase och sedan verifiera betalningen.
      // useEffect i AuthenticatedApp kommer trigga VERIFYING_PAYMENT när vi är READY.
      const isPaymentSuccessPage = window.location.pathname === '/payment-success' ||
                                   window.location.search.includes('session_id');
      if (isPaymentSuccessPage) {
        console.log('[INIT] 💳 On payment-success page - going to CHECKING_PENDING to get activeCase first');
        storage.clearCurrentTabSession();
        setAppState(AppState.CHECKING_PENDING);
        return;
      }
      
      console.log('[INIT] 🔄 Tab session found:', currentTabSession);
      console.log('[INIT] → Going to RESTORING_SESSION (skipping resume modal)');
      setAppState(AppState.RESTORING_SESSION);
    } else {
      // ═══════════════════════════════════════════════════════════════
      // NY LOGIN/NY FLIK: Ingen aktiv session - kolla pending på servern
      // ═══════════════════════════════════════════════════════════════
      console.log('[INIT] No valid tab session found for this user');
      console.log('[INIT] → Going to CHECKING_PENDING');
      setAppState(AppState.CHECKING_PENDING);
    }
  };
}
