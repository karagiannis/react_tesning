/**
 * useSlideDataLoader.js
 * 
 * Custom hook för att ladda slide-data med konfliktdetektering.
 * 
 * NÄR: Användaren navigerar till en ny slide (currentSlideKey ändras)
 * 
 * LOGIK (prioritetsordning):
 *   1. Hämta server metadata (version, pages, modified_by)
 *   2. Hämta localStorage (version, slideData)
 *   3. JÄMFÖR VERSIONER:
 *      - Om localVersion >= serverVersion → localStorage VINNER
 *        (användaren browsear runt med osparade ändringar)
 *      - Om serverVersion > localVersion OCH annan användare → KONFLIKT MODAL
 *      - Om serverVersion > localVersion OCH samma användare → server VINNER
 *        (användarens egna ändringar från annan session/enhet)
 * 
 * VIKTIGT: Konfliktdetektering sker "need-to-know" basis.
 * Användaren informeras ENDAST om ändringar som påverkar DENNA slide
 * OCH som gjorts av EN ANNAN användare.
 * 
 * STORAGE FORMAT:
 * - Slide data: onboarding::company_id::case_id::user_id::slideKey
 * - Version:    onboarding::company_id::case_id::user_id::metadata::version
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
    // ASYNC: Per-slide konfliktdetektering med version-prioritet
    // ═══════════════════════════════════════════════════════════════════════
    const loadSlideData = async () => {
      console.log(`[SLIDE-LOAD] 🔄 Loading '${currentSlideKey}' (version-based priority)...`);
      
      const caseOrOnboardingId = activeCase?.case_id;
      if (!activeCase?.company_id || !caseOrOnboardingId) {
        console.log(`[SLIDE-LOAD] ⚠️ No active case, skipping`);
        return;
      }
      
      // ─────────────────────────────────────────────────────────────────
      // Steg 1: Hämta localStorage data för DENNA slide + version
      // ─────────────────────────────────────────────────────────────────
      const localSlideData = storage.getSlideData(currentSlideKey);
      const localVersion = storage.getVersion(); // metadata::version
      const hasLocalData = localSlideData && Object.keys(localSlideData).length > 0;
      
      console.log(`[SLIDE-LOAD] localStorage['${currentSlideKey}']: ${hasLocalData ? '✅ HAS DATA' : '❌ NO DATA'}`);
      console.log(`[SLIDE-LOAD] localStorage version: ${localVersion}`);
      if (hasLocalData) {
        console.log(`[SLIDE-LOAD]   Local data keys: ${Object.keys(localSlideData).join(', ')}`);
      }
      
      // ─────────────────────────────────────────────────────────────────
      // Steg 2: Hämta server data för DENNA slide
      // ─────────────────────────────────────────────────────────────────
      let serverMeta = null;
      let serverSlideData = null;
      let serverVersion = 0;
      
      try {
        console.log(`[SLIDE-LOAD] 🌐 Fetching metadata from server...`);
        serverMeta = await api.fetchMetadata(activeCase.company_id, caseOrOnboardingId);
        
        // Backend returnerar pages direkt på roten
        serverSlideData = serverMeta?.pages?.[currentSlideKey];
        serverVersion = serverMeta?.version || 0;
        
        const hasServerData = serverSlideData && Object.keys(serverSlideData).length > 0;
        console.log(`[SLIDE-LOAD] Server['${currentSlideKey}']: ${hasServerData ? '✅ HAS DATA' : '❌ NO DATA'}`);
        console.log(`[SLIDE-LOAD]   Server version: ${serverVersion}`);
        console.log(`[SLIDE-LOAD]   Server modified_by: ${serverMeta?.modified_by || 'N/A'}`);
        console.log(`[SLIDE-LOAD]   Server modified_by_email: ${serverMeta?.modified_by_email || 'N/A'}`);
        
        if (hasServerData) {
          console.log(`[SLIDE-LOAD]   Server data keys: ${Object.keys(serverSlideData).join(', ')}`);
        }
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
      // Steg 3: Hantera basfall (ingen data)
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
        // Bara server har data - använd den och synka till localStorage
        console.log(`[SLIDE-LOAD] ✅ Using server (only source) + syncing to localStorage`);
        setFormData(prev => ({ ...prev, [currentSlideKey]: serverSlideData }));
        storage.setSlideData(currentSlideKey, serverSlideData);
        storage.setVersion(serverVersion); // Synka version också
        return;
      }
      
      // ─────────────────────────────────────────────────────────────────
      // Steg 4: Båda källor har data - JÄMFÖR VERSIONER FÖRST
      // ─────────────────────────────────────────────────────────────────
      console.log(`[SLIDE-LOAD] 📊 Version comparison: local=${localVersion}, server=${serverVersion}`);
      
      if (localVersion >= serverVersion) {
        // ═══════════════════════════════════════════════════════════════
        // localStorage VINNER - användaren browsear med osparade ändringar
        // ═══════════════════════════════════════════════════════════════
        console.log(`[SLIDE-LOAD] ✅ localStorage WINS (version ${localVersion} >= ${serverVersion})`);
        console.log(`[SLIDE-LOAD]   User is browsing with unsaved changes - keeping local data`);
        setFormData(prev => ({ ...prev, [currentSlideKey]: localSlideData }));
        return;
      }
      
      // ─────────────────────────────────────────────────────────────────
      // Steg 5: Server har HÖGRE version - kolla INNEHÅLL och VEM
      // ─────────────────────────────────────────────────────────────────
      const localStr = JSON.stringify(localSlideData);
      const serverStr = JSON.stringify(serverSlideData);
      
      if (localStr === serverStr) {
        // Samma innehåll trots versionsskillnad - synka version
        console.log(`[SLIDE-LOAD] ✅ Same content - syncing version to ${serverVersion}`);
        setFormData(prev => ({ ...prev, [currentSlideKey]: serverSlideData }));
        storage.setVersion(serverVersion);
        return;
      }
      
      // ─────────────────────────────────────────────────────────────────
      // Steg 6: Server har HÖGRE version + OLIKA innehåll - kolla VEM
      // ─────────────────────────────────────────────────────────────────
      console.log(`[SLIDE-LOAD] ⚠️ Server has newer version (${serverVersion}) with different content!`);
      console.log(`[SLIDE-LOAD]   Local:  ${localStr.substring(0, 100)}...`);
      console.log(`[SLIDE-LOAD]   Server: ${serverStr.substring(0, 100)}...`);
      
      // Identifiera server-modifierare
      const serverModifiedByEmail = serverMeta?.modified_by_email;
      const serverModifiedById = serverMeta?.modified_by || serverMeta?.updated_by;
      
      // Identifiera nuvarande användare
      const currentUserEmail = user?.email;
      const currentUserId = user?.user_id || user?.sub || user?.id;
      
      console.log(`[SLIDE-LOAD] Comparing users:`);
      console.log(`[SLIDE-LOAD]   Server user (email): "${serverModifiedByEmail}"`);
      console.log(`[SLIDE-LOAD]   Server user (id): "${serverModifiedById}"`);
      console.log(`[SLIDE-LOAD]   Current user (email): "${currentUserEmail}"`);
      console.log(`[SLIDE-LOAD]   Current user (id): "${currentUserId}"`);
      
      // Avgör om det är en annan användare
      const isDifferentUser = (() => {
        // Prioritera email-jämförelse (mest tillförlitlig)
        if (serverModifiedByEmail && currentUserEmail) {
          const different = serverModifiedByEmail.toLowerCase() !== currentUserEmail.toLowerCase();
          console.log(`[SLIDE-LOAD]   Email comparison: ${different ? 'DIFFERENT' : 'SAME'}`);
          return different;
        }
        // Fallback till user_id
        if (serverModifiedById && currentUserId) {
          const different = serverModifiedById !== currentUserId;
          console.log(`[SLIDE-LOAD]   ID comparison: ${different ? 'DIFFERENT' : 'SAME'}`);
          return different;
        }
        // Kan inte avgöra - logga och fortsätt med server-data
        console.log(`[SLIDE-LOAD]   ⚠️ Cannot determine user - will use server (authoritative)`);
        return false;
      })();
      
      if (isDifferentUser) {
        // ═══════════════════════════════════════════════════════════════
        // KONFLIKT! Server version högre + Annan användare har ändrat
        // Visa modal så användaren kan välja
        // ═══════════════════════════════════════════════════════════════
        const displayName = serverModifiedByEmail || serverModifiedById || 'annan användare';
        console.log(`[SLIDE-LOAD] 🛑 CONFLICT! User '${displayName}' modified this slide (v${serverVersion})`);
        console.log(`[SLIDE-LOAD] 🛑 Showing conflict modal...`);
        
        setConflictInfo({
          slide_key: currentSlideKey,
          your_version: localVersion,
          server_version: serverVersion,
          server_last_modified: serverMeta?.last_modified,
          modified_by: serverModifiedById,
          modified_by_email: serverModifiedByEmail,
          conflicting_slides: [{
            slide_id: currentSlideKey,
            modified_by: displayName,
            modified_at: serverMeta?.last_modified
          }],
          message: `Användare '${displayName}' har uppdaterat sidan '${currentSlideKey}' (version ${serverVersion}).`,
          local_data: localSlideData,
          server_data: serverSlideData
        });
        setShowConflictModal(true);
        
        // Ladda INTE data - vänta på användarens val i modal
        return;
      }
      
      // ═══════════════════════════════════════════════════════════════
      // Steg 7: Server version högre + Samma användare → Server vinner
      // ═══════════════════════════════════════════════════════════════
      // 
      // Användarens egna ändringar från annan session/enhet.
      // Synka localStorage med serverns nyare data.
      //
      console.log(`[SLIDE-LOAD] ✅ Same user - SERVER WINS (newer version ${serverVersion})`);
      console.log(`[SLIDE-LOAD]   Syncing localStorage with server data`);
      
      setFormData(prev => ({ ...prev, [currentSlideKey]: serverSlideData }));
      
      // Synka localStorage med serverns data OCH version
      storage.setSlideData(currentSlideKey, serverSlideData);
      storage.setVersion(serverVersion);
      
      console.log(`[SLIDE-LOAD] 🔄 Synced localStorage with server (version ${serverVersion})`)
    };
    
    loadSlideData();
  }, [currentSlideKey, activeCase?.company_id, activeCase?.case_id, appState]);
  
  // Hook returnerar inget - den har bara side effects
}
