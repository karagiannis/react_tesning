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
import { buildConflictInfo } from '../utils/conflictDiff';

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
      
      // Hämta server-info
      const serverModifiedById = serverMeta?.modified_by || serverMeta?.updated_by;
      const serverModifiedByEmail = serverMeta?.modified_by_email || serverMeta?.updated_by_email;
      
      // Hämta local version från localStorage (ny 1:1 struktur)
      const localVersion = storage.getVersion() || 0;
      const localModifiedBy = storage.getModifiedBy();
      
      console.log(`[SLIDE-LOAD]   Server version: ${serverGlobalVersion}, Local version: ${localVersion}`);
      console.log(`[SLIDE-LOAD]   Server modified by: ${serverModifiedByEmail || serverModifiedById}`);
      console.log(`[SLIDE-LOAD]   Local modified_by: ${localModifiedBy}`);
      console.log(`[SLIDE-LOAD]   Current user ID: ${user?.id}`);
      
      // ═══════════════════════════════════════════════════════════════
      // KONFLIKT-LOGIK:
      // Visa konflikt-modal om:
      // 1. Innehållet skiljer sig (vi har redan passerat detta test ovan)
      // 2. Serverns senaste ändring gjordes av en ANNAN användare (inte mig)
      // 
      // OBS: Vi tittar INTE på versionsnummer här - vi har redan konstaterat
      // att innehållet är olika. Oavsett version vill vi visa konflikten
      // så användaren kan välja vilken version som gäller.
      // ═══════════════════════════════════════════════════════════════
      const serverHasNewerVersion = serverGlobalVersion > localVersion;
      const modifiedByDifferentUser = serverModifiedById && 
                                      user?.id && 
                                      serverModifiedById !== user?.id;
      
      // 🔧 FIX: Visa konflikt när innehållet skiljer sig OCH annan användare
      // (inte kräv serverHasNewerVersion - versionerna kan vara synkade men datan olika)
      const shouldShowConflict = modifiedByDifferentUser;
      
      console.log(`[SLIDE-LOAD]   serverHasNewerVersion: ${serverHasNewerVersion}`);
      console.log(`[SLIDE-LOAD]   modifiedByDifferentUser: ${modifiedByDifferentUser}`);
      console.log(`[SLIDE-LOAD]   shouldShowConflict: ${shouldShowConflict}`);
      
      if (shouldShowConflict) {
        // ═══════════════════════════════════════════════════════════════
        // KONFLIKT! Annan användare har ändrat DENNA slide
        // ═══════════════════════════════════════════════════════════════
        console.log(`[SLIDE-LOAD] 🛑 CONFLICT! User '${serverModifiedByEmail || serverModifiedById}' modified this slide`);
        
        // Bygg färdigberäknad konflikt-info (modal är DUM - ingen logik där!)
        const conflictData = buildConflictInfo({
          slideKey: currentSlideKey,
          serverData: serverSlideData,
          localData: localSlideData,
          serverVersion: serverGlobalVersion,
          modifiedBy: serverModifiedById,
          modifiedByEmail: serverModifiedByEmail,
          updatedAt: serverMeta?.updated_at || serverMeta?.last_modified
        });
        setConflictInfo(conflictData);
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
      
      console.log(`[SLIDE-LOAD]   Local version: ${localVersion}`);
      console.log(`[SLIDE-LOAD]   Server version: ${serverGlobalVersion}`);
      
      if (serverGlobalVersion > localVersion) {
        // Server har nyare data - använd den (även om det är samma user!)
        // Detta händer när user jobbar i annan flik/browser
        console.log(`[SLIDE-LOAD] ✅ Server is NEWER (v${serverGlobalVersion} > v${localVersion}) - using SERVER (multi-tab sync)`);
        setFormData(prev => ({ ...prev, [currentSlideKey]: serverSlideData }));
        
        // 🔄 Uppdatera även localStorage så vi är synkad
        storage.setSlideData(currentSlideKey, serverSlideData);
        
        // 🔄 Uppdatera metadata i localStorage (1:1 med server)
        storage.setVersion(serverGlobalVersion);
        storage.setUpdatedBy(serverModifiedById);
        storage.setUpdatedAt(serverMeta?.updated_at || serverMeta?.last_modified || new Date().toISOString());
        
        console.log(`[SLIDE-LOAD] 🔄 Synced localStorage with server data (v${serverGlobalVersion})`);
      } else {
        // localStorage har lika eller nyare data - använd den (osparade ändringar)
        console.log(`[SLIDE-LOAD] ✅ Local is CURRENT (v${localVersion} >= v${serverGlobalVersion}) - using LOCALSTORAGE (unsaved changes)`);
        setFormData(prev => ({ ...prev, [currentSlideKey]: localSlideData }));
      }
    };
    
    loadSlideData();
  }, [currentSlideKey, activeCase?.company_id, activeCase?.case_id, appState]);
  
  // Hook returnerar inget - den har bara side effects
}
