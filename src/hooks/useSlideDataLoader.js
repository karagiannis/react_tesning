/**
 * useSlideDataLoader.js
 * 
 * Custom hook för att ladda slide-data med konfliktdetektering.
 * 
 * NÄR: Användaren navigerar till en ny slide (currentSlideKey ändras)
 * 
 * VAD:
 *   1. Hämta localStorage data för DENNA slide
 *   2. Hämta server metadata.pages[slideKey] för DENNA slide  
 *   3. Jämför innehåll (JSON.stringify)
 *      - Om samma innehåll → Ladda tyst
 *      - Om olika innehåll OCH annan användare → Visa konflikt-modal
 *      - Om olika innehåll men samma användare → Använd nyaste version
 * 
 * VIKTIGT: Konfliktdetektering sker "need-to-know" basis.
 * Användaren informeras ENDAST om ändringar som påverkar DENNA slide.
 */

import { useEffect } from 'react';

export function useSlideDataLoader({
  // Dependencies
  appState,
  AppState,
  currentSlideKey,
  isDraftMode,
  activeCase,
  user,
  storage,
  api,
  // Setters
  setFormData,
  setConflictInfo,
  setShowConflictModal,
}) {
  
  useEffect(() => {
    // ═══════════════════════════════════════════════════════════════════════
    // GUARD 1: Skippa under initialisering/resuming 
    // (appState hanterar laddning då)
    // ═══════════════════════════════════════════════════════════════════════
    const isNormalOperation = [
      AppState.READY,
      AppState.PROCESSING_NEXT,
      AppState.PROCESSING_BACK
    ].includes(appState);
    
    if (!isNormalOperation) return;
    
    // ═══════════════════════════════════════════════════════════════════════
    // GUARD 2: Skippa om ingen slide är vald
    // ═══════════════════════════════════════════════════════════════════════
    if (!currentSlideKey) return;
    
    // ═══════════════════════════════════════════════════════════════════════
    // GUARD 3: Draft mode - använd bara localStorage
    // ═══════════════════════════════════════════════════════════════════════
    if (isDraftMode) {
      console.log(`[SLIDE-LOAD] 📝 Draft mode - using localStorage only`);
      const localData = storage.getSlideData(currentSlideKey);
      if (localData && Object.keys(localData).length > 0) {
        setFormData(prev => {
          // Checka om redan satt för att undvika loop
          if (prev[currentSlideKey] && Object.keys(prev[currentSlideKey]).length > 0) {
            return prev; // Data redan där, gör inget
          }
          return { ...prev, [currentSlideKey]: localData };
        });
      }
      return;
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // ASYNC: Per-slide konfliktdetektering
    // ═══════════════════════════════════════════════════════════════════════
    const loadSlideData = async () => {
      console.log(`[SLIDE-LOAD] 🔄 Loading '${currentSlideKey}' (need-to-know check)...`);
      
      const caseOrOnboardingId = activeCase?.case_id;
      if (!activeCase?.company_id || !caseOrOnboardingId) {
        console.log(`[SLIDE-LOAD] ⚠️ No active case, skipping`);
        return;
      }
      
      // ─────────────────────────────────────────────────────────────────
      // Steg 1: Hämta localStorage data för DENNA slide
      // ─────────────────────────────────────────────────────────────────
      const localSlideData = storage.getSlideData(currentSlideKey);
      const hasLocalData = localSlideData && Object.keys(localSlideData).length > 0;
      
      console.log(`[SLIDE-LOAD] localStorage['${currentSlideKey}']: ${hasLocalData ? '✅ HAS DATA' : '❌ NO DATA'}`);
      
      // ─────────────────────────────────────────────────────────────────
      // Steg 2: Hämta server data för DENNA slide
      // ─────────────────────────────────────────────────────────────────
      let serverMeta = null;
      let serverSlideData = null;
      let serverGlobalVersion = 0;
      
      try {
        console.log(`[SLIDE-LOAD] 🌐 Fetching metadata from server...`);
        serverMeta = await api.fetchMetadata(activeCase.company_id, caseOrOnboardingId);
        // 📌 Backend returnerar pages direkt på roten (inte under .metadata)
        serverSlideData = serverMeta?.pages?.[currentSlideKey];
        serverGlobalVersion = serverMeta?.version || 0;
        
        const hasServerData = serverSlideData && Object.keys(serverSlideData).length > 0;
        console.log(`[SLIDE-LOAD] Server['${currentSlideKey}']: ${hasServerData ? '✅ HAS DATA' : '❌ NO DATA'} (global version: ${serverGlobalVersion})`);
      } catch (err) {
        console.warn(`[SLIDE-LOAD] ⚠️ Failed to fetch from server:`, err.message);
        // Om server fetch misslyckas, använd localStorage
        if (hasLocalData) {
          setFormData(prev => ({ ...prev, [currentSlideKey]: localSlideData }));
          console.log(`[SLIDE-LOAD] 🏁 Using localStorage (server unavailable)`);
        }
        return;
      }
      
      // ─────────────────────────────────────────────────────────────────
      // Steg 3: Hantera olika datakällor
      // ─────────────────────────────────────────────────────────────────
      const hasServerData = serverSlideData && Object.keys(serverSlideData).length > 0;
      
      if (!hasServerData && !hasLocalData) {
        // Ingen data finns - init tom
        console.log(`[SLIDE-LOAD] 📝 Initializing empty slide`);
        setFormData(prev => ({ ...prev, [currentSlideKey]: {} }));
        return;
      }
      
      if (!hasServerData && hasLocalData) {
        // Bara localStorage har data - använd den
        console.log(`[SLIDE-LOAD] ✅ Using localStorage (only source)`);
        setFormData(prev => ({ ...prev, [currentSlideKey]: localSlideData }));
        return;
      }
      
      if (hasServerData && !hasLocalData) {
        // Bara server har data - använd den
        console.log(`[SLIDE-LOAD] ✅ Using server (only source)`);
        setFormData(prev => ({ ...prev, [currentSlideKey]: serverSlideData }));
        return;
      }
      
      // ─────────────────────────────────────────────────────────────────
      // Steg 4: Båda källor har data - jämför INNEHÅLL (need-to-know!)
      // ─────────────────────────────────────────────────────────────────
      const localStr = JSON.stringify(localSlideData);
      const serverStr = JSON.stringify(serverSlideData);
      
      if (localStr === serverStr) {
        // ✅ SAMMA INNEHÅLL - ladda tyst (spelar ingen roll om global version skiljer)
        console.log(`[SLIDE-LOAD] ✅ Same content - using SERVER (no conflict, need-to-know: not affected)`);
        setFormData(prev => ({ ...prev, [currentSlideKey]: serverSlideData }));
        return;
      }
      
      // ─────────────────────────────────────────────────────────────────
      // Steg 5: OLIKA INNEHÅLL - kolla vem som ändrade
      // ─────────────────────────────────────────────────────────────────
      console.log(`[SLIDE-LOAD] ⚠️ Different content detected - checking who modified...`);
      
      const serverModifiedBy = serverMeta?.updated_by || serverMeta?.modified_by;
      const currentUserEmail = user?.email;
      
      console.log(`[SLIDE-LOAD]   Server modified by: ${serverModifiedBy}`);
      console.log(`[SLIDE-LOAD]   Current user: ${currentUserEmail}`);
      
      const isDifferentUser = serverModifiedBy && 
                             currentUserEmail && 
                             serverModifiedBy !== currentUserEmail;
      
      if (isDifferentUser) {
        // ═══════════════════════════════════════════════════════════════
        // KONFLIKT! Annan användare har ändrat DENNA slide
        // ═══════════════════════════════════════════════════════════════
        console.log(`[SLIDE-LOAD] 🛑 CONFLICT! User '${serverModifiedBy}' modified this slide`);
        
        // Spara konflikt-info för modal
        setConflictInfo({
          slide_key: currentSlideKey,
          your_version: 0, // Vi har inget per-slide version ännu
          server_version: serverGlobalVersion,
          server_last_modified: serverMeta?.last_modified,
          modified_by: serverModifiedBy,
          conflicting_slides: [{
            slide_id: currentSlideKey,
            modified_by: serverModifiedBy,
            modified_at: serverMeta?.last_modified
          }],
          message: `Användare '${serverModifiedBy}' har uppdaterat sidan '${currentSlideKey}'.`,
          local_data: localSlideData,
          server_data: serverSlideData
        });
        setShowConflictModal(true);
        
        // Ladda INTE data - vänta på användarens val
        console.log(`[SLIDE-LOAD] 🛑 Blocking load - waiting for user decision`);
        return;
      }
      
      // ═══════════════════════════════════════════════════════════════
      // Steg 6: Samma användare - kolla VILKEN data som är nyast
      // ═══════════════════════════════════════════════════════════════
      // 
      // MULTI-TAB/MULTI-BROWSER SCENARIO:
      // User kan ha 2 flikar öppna:
      //   Tab A: Laddade data kl 10:00 (version 5)
      //   Tab B: Jobbade vidare till kl 10:30 (version 12)
      //   Tab A: Återvänder kl 10:31 (har fortfarande version 5 i localStorage)
      // 
      // Regel: Använd NYASTE data (högsta version)
      //
      console.log(`[SLIDE-LOAD] ⚙️ Same user, different content - checking versions...`);
      
      // Hämta local version från localStorage
      const storageKey = `case_${activeCase.company_id}_${activeCase.case_id}_version`;
      const localVersionStr = localStorage.getItem(storageKey);
      const localVersionObj = localVersionStr ? JSON.parse(localVersionStr) : { version: 0 };
      const local_version = localVersionObj.version || 0;
      
      console.log(`[SLIDE-LOAD]   Local version: ${local_version}`);
      console.log(`[SLIDE-LOAD]   Server version: ${serverGlobalVersion}`);
      
      if (serverGlobalVersion > local_version) {
        // Server har nyare data - använd den (även om det är samma user!)
        // Detta händer när user jobbar i annan flik/browser
        console.log(`[SLIDE-LOAD] ✅ Server is NEWER (v${serverGlobalVersion} > v${local_version}) - using SERVER (multi-tab sync)`);
        setFormData(prev => ({ ...prev, [currentSlideKey]: serverSlideData }));
        
        // 🔄 Uppdatera även localStorage så vi är synkad
        storage.setSlideData(currentSlideKey, serverSlideData);
        
        // 🔄 Uppdatera local version till server version
        localStorage.setItem(storageKey, JSON.stringify({
          version: serverGlobalVersion,
          timestamp: new Date().toISOString()
        }));
        
        console.log(`[SLIDE-LOAD] 🔄 Synced localStorage with server data (v${serverGlobalVersion})`);
      } else {
        // localStorage har lika eller nyare data - använd den (osparade ändringar)
        console.log(`[SLIDE-LOAD] ✅ Local is CURRENT (v${local_version} >= v${serverGlobalVersion}) - using LOCALSTORAGE (unsaved changes)`);
        setFormData(prev => ({ ...prev, [currentSlideKey]: localSlideData }));
      }
    };
    
    loadSlideData();
  }, [currentSlideKey, activeCase?.company_id, activeCase?.case_id]);
  
  // Hook returnerar inget - den har bara side effects
}
