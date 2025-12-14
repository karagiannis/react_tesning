/**
 * slideNavigation.js
 * 
 * Utility-funktioner för slide-navigation och version-konflikthantering.
 * Används av AuthenticatedApp.jsx för att hålla huvudfilen renare.
 * 
 * FACTORY PATTERN: Funktionerna returnerar closures som har tillgång till
 * dependencies via getState/getActions/services.
 */

import { buildConflictInfo } from './conflictDiff';

/**
 * createCheckVersionConflict
 * 
 * Pre-flight check innan slide-push för att upptäcka konflikter.
 * Jämför global server-version mot lokal version.
 * 
 * @returns {Function} async () => boolean - true om konflikt finns
 */
export function createCheckVersionConflict(getState, getActions, services) {
  const { api, storage } = services;
  const { setConflictInfo, setShowConflictModal } = getActions();
  
  return async () => {
    const { activeCase, isDraftMode, user } = getState();
    
    // Skippa check om vi inte har ett aktivt ärende
    if (!activeCase?.company_id || !activeCase?.case_id) {
      console.log('[VERSION-CHECK] Ingen aktiv case, skippar conflict check');
      return false;
    }
    
    // Skippa check om vi är i draft-mode (ingen server-data ännu)
    if (isDraftMode) {
      console.log('[VERSION-CHECK] Draft mode, skippar conflict check');
      return false;
    }
    
    try {
      console.log('[VERSION-CHECK] Kontrollerar server-version...');
      
      // 1. Hämta server metadata
      const serverMeta = await api.fetchMetadata(activeCase.company_id, activeCase.case_id);
      const server_version = serverMeta?.version || 0;
      const serverLastModified = serverMeta?.last_modified;
      const serverModifiedBy = serverMeta?.modified_by || serverMeta?.updated_by || 'Annan användare';
      
      // 2. Hämta local version från localStorage (nya 1:1 strukturen)
      const local_version = storage.getVersion() || 0;
      
      console.log('[VERSION-CHECK] Server version:', server_version, 'Local version:', local_version);
      console.log('[VERSION-CHECK] Server modified_by:', serverModifiedBy, 'Current user:', user?.id);
      
      // 3. Jämför version (Git-liknande)
      // Konflikt uppstår ENDAST om:
      // - Server version > lokal version
      // - OCH någon ANNAN användare gjorde ändringen
      // - OCH innehållet faktiskt skiljer sig (diff > 0)
      if (server_version > local_version) {
        const isSameUser = serverModifiedBy === user?.id;
        
        if (isSameUser) {
          // Samma användare ändrade från annan flik/enhet - uppdatera tyst
          console.log('[VERSION-CHECK] ✅ Samma användare, uppdaterar lokal version tyst');
          storage.setVersion(server_version);
          storage.setModifiedBy(serverModifiedBy);
          return false; // Ingen konflikt
        }
        
        // Hämta data för att jämföra INNEHÅLL (inte bara version)
        const { currentSlideKey, formData } = getState();
        const localSlideData = formData?.[currentSlideKey] || {};
        const serverSlideData = serverMeta?.pages?.[currentSlideKey] || {};
        
        // ═══════════════════════════════════════════════════════════════
        // VIKTIGT: Om innehållet är IDENTISKT = ingen konflikt!
        // Även om annan användare ändrade till samma värde.
        // ═══════════════════════════════════════════════════════════════
        const localStr = JSON.stringify(localSlideData);
        const serverStr = JSON.stringify(serverSlideData);
        
        if (localStr === serverStr) {
          console.log('[VERSION-CHECK] ✅ Samma innehåll (diff=0), uppdaterar version tyst');
          storage.setVersion(server_version);
          storage.setModifiedBy(serverModifiedBy);
          return false; // Ingen konflikt - innehållet är identiskt
        }
        
        console.log('[VERSION-CHECK] ⚠️ KONFLIKT! Server version', server_version, '> Local version', local_version, 'AND different user AND different content');
        
        // Bygg färdigberäknad konflikt-info (modal är DUM - ingen logik där!)
        const conflictData = buildConflictInfo({
          slideKey: currentSlideKey,
          serverData: serverSlideData,
          localData: localSlideData,
          serverVersion: server_version,
          modifiedBy: serverModifiedBy,
          modifiedByEmail: serverMeta?.modified_by_email || serverMeta?.updated_by_email,
          updatedAt: serverLastModified,
          message: `Servern har version ${server_version}, du har version ${local_version}.`
        });
        setConflictInfo(conflictData);
        setShowConflictModal(true);
        
        return true; // Konflikt hittad
      }
      
      console.log('[VERSION-CHECK] ✅ Ingen konflikt');
      return false;
      
    } catch (err) {
      console.error('[VERSION-CHECK] ❌ Fel vid version-check:', err);
      return false; // Vid nätverksfel, fortsätt utan att blockera
    }
  };
}


/**
 * createSaveSlideAndNavigate
 * 
 * Sparar nuvarande slide till server och navigerar till nästa.
 * Används av PROCESSING_NEXT för alla slides utan special-logik.
 * 
 * @returns {Function} async (slideKey, currentIndex) => void
 */
export function createSaveSlideAndNavigate(getState, getActions, services, checkVersionConflict) {
  const { storage, api, navigate, SLIDE_ORDER, AppState } = services;
  const { 
    setIsLoading, setError, setAppState, setSyncStatus,
    setCompletedSlides, setNavigationHistory, setCurrentSlideKey,
    setConflictInfo, setShowConflictModal
  } = getActions();
  
  return async (slideKey, currentIndex) => {
    const { formData, isDraftMode, activeCase, completedSlides, tempCaseId, user } = getState();
    
    setIsLoading(true);
    setSyncStatus('saving');
    setError(null);
    
    try {
      const slideData = formData[slideKey] || {};
      
      // ─────────────────────────────────────────────────────────────────
      // Steg 1: Kolla version conflict (om permanent mode)
      // ─────────────────────────────────────────────────────────────────
      if (!isDraftMode) {
        const hasConflict = await checkVersionConflict();
        if (hasConflict) {
          console.log('[SAVE] ⚠️ Konflikt - blockerar navigation');
          setIsLoading(false);
          setSyncStatus('conflict');
          setAppState(AppState.READY);
          return;
        }
      }
      
      // ─────────────────────────────────────────────────────────────────
      // Steg 2: Push till server (om permanent mode)
      // ─────────────────────────────────────────────────────────────────
      if (!isDraftMode && activeCase?.case_id) {
        console.log(`[SAVE] 📤 Pushing slide data: ${slideKey}`);
        
        // Hämta local version för optimistic locking (nya 1:1 strukturen)
        const expected_version = storage.getVersion() || 0;
        
        const response = await api.post(
          `/onboarding/${activeCase.company_id}/${slideKey}`,
          {
            data: slideData,
            case_id: activeCase.case_id,
            expected_version: expected_version,  // Optimistic locking - server rejects if version mismatch
          }
        );
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          
          if (response.status === 409) {
            console.log('[SAVE] ⚠️ Server returnerade 409 - version conflict');
            setConflictInfo(errorData);
            setShowConflictModal(true);
            setIsLoading(false);
            setSyncStatus('conflict');
            setAppState(AppState.READY);
            return;
          }
          
          throw new Error(errorData.detail || `HTTP ${response.status}`);
        }
        
        const result = await response.json();
        console.log(`[SAVE] ✅ Server saved slide, new version: ${result.version}`);
        
        // Uppdatera lokal metadata (1:1 med server metadata.json)
        storage.setVersion(result.version);
        storage.setUpdatedBy(user?.id);
        storage.setUpdatedAt(new Date().toISOString());
      } else {
        console.log(`[SAVE] 📝 Draft mode - only saving to localStorage`);
      }
      
      setSyncStatus('saved');
      
      // ─────────────────────────────────────────────────────────────────
      // Steg 3: Uppdatera state och navigera
      // ─────────────────────────────────────────────────────────────────
      
      // Markera som klar
      const newCompleted = [...completedSlides, slideKey];
      setCompletedSlides(newCompleted);
      storage.setCompletedSlides(newCompleted);
      
      // Spara formData
      storage.setFormData(formData);
      
      // Navigera till nästa slide
      const nextSlide = SLIDE_ORDER[currentIndex + 1];
      console.log(`[SAVE] ✅ Navigating to: ${nextSlide.key}`);
      
      setNavigationHistory(prev => [...prev, {
        slideKey: nextSlide.key,
        timestamp: Date.now(),
        action: 'next',
        fromSlide: slideKey,
      }]);
      
      // Uppdatera session
      const caseOrOnboardingId = activeCase?.case_id;
      const session_id = isDraftMode
        ? `onboarding::draft::${tempCaseId}::${user?.id}`
        : storage.buildSessionId(activeCase?.company_id, caseOrOnboardingId, user?.id);
      storage.setCurrentTabSession({
        session_id,
        current_slide: nextSlide.key,
      });
      
      setCurrentSlideKey(nextSlide.key);
      navigate(nextSlide.path);
      
      setIsLoading(false);
      setTimeout(() => setSyncStatus('idle'), 1500);
      setAppState(AppState.READY);
      
    } catch (err) {
      console.error('[SAVE] Error:', err);
      setError(`Kunde inte spara: ${err.message}`);
      setSyncStatus('idle');
      setIsLoading(false);
      setAppState(AppState.READY);
    }
  };
}
