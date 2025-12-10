// ===========================================================================
// STATE MACHINE HANDLERS - Utbrutna funktioner för varje state
// ===========================================================================
//
// SYFTE: Gör state machine-logiken läsbar och testbar
//
// MÖNSTER:
//   Varje handler är en funktion som:
//   1. Tar emot nödvändig context (deps)
//   2. Utför state-specifik logik
//   3. Returnerar nästa state (eller null om ingen ändring)
//
// ANVÄNDNING I AuthenticatedApp:
//   case AppState.RESUMING:
//     await handleResuming(deps);
//     break;
//

/**
 * RESUMING - Användaren valde att återuppta en pågående onboarding
 * 
 * STEG:
 * 1. Hämta metadata från server
 * 2. Spara pages till localStorage (PERMANENT keys)
 * 3. Uppdatera React state (formData, completedSlides)
 * 4. Navigera till senaste slide
 * 5. → READY
 */
export async function handleResumingState({
  activeCase,
  user,
  api,
  storage,
  setIsLoading,
  setIsDraftMode,
  setFormData,
  setCompletedSlides,
  setRoaringData,
  setCurrentSlideKey,
  setError,
  navigate,
  SLIDE_ORDER,
  StorageKeyBuilder,
}) {
  console.log('[RESUMING] 🔄 Starting resume process...');
  setIsLoading(true);
  
  try {
    // ─────────────────────────────────────────────────────────────────
    // Steg 1: Hämta metadata från server
    // ─────────────────────────────────────────────────────────────────
    console.log('[RESUMING] 📡 Fetching metadata for:', activeCase);
    const metadata = await api.fetchMetadata(
      activeCase.companyId, 
      activeCase.onboardingId
    );
    console.log('[RESUMING] ✅ Metadata received:', metadata);
    console.log('[RESUMING]   - pages:', Object.keys(metadata.pages || {}));
    
    const pagesData = metadata.pages || {};
    
    // ─────────────────────────────────────────────────────────────────
    // Steg 2: Rensa gamla localStorage keys för detta case
    // ─────────────────────────────────────────────────────────────────
    console.log('[RESUMING] 🧹 Clearing old localStorage keys...');
    const prefix = `onboarding::${activeCase.companyId}::${activeCase.onboardingId}::${user?.id}::`;
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(prefix)) {
        localStorage.removeItem(key);
      }
    });
    
    // ─────────────────────────────────────────────────────────────────
    // Steg 3: Sätt permanent mode och spara pages
    // ─────────────────────────────────────────────────────────────────
    setIsDraftMode(false);
    storage.setIsDraftMode(false);
    
    // Spara varje page SEPARAT till localStorage
    Object.entries(pagesData).forEach(([slideKey, slideData]) => {
      storage.setSlideData(slideKey, slideData);
      console.log(`[RESUMING]   ✓ Saved ${slideKey}`);
    });
    
    // Spara version för conflict detection
    const serverVersion = metadata.version || 0;
    const versionKey = `case_${activeCase.companyId}_${activeCase.onboardingId}_version`;
    localStorage.setItem(versionKey, JSON.stringify({
      version: serverVersion,
      timestamp: metadata.lastModified || new Date().toISOString(),
      syncedFromServer: true
    }));
    
    // ─────────────────────────────────────────────────────────────────
    // Steg 4: Uppdatera React state
    // ─────────────────────────────────────────────────────────────────
    setFormData(pagesData);
    setCompletedSlides(metadata.completedSlides || []);
    
    // Kolla om Roaring-data finns
    const resultSlides = ['verksamhet', 'agarstruktur', 'styrelse', 'ovriga-data'];
    if (resultSlides.some(key => pagesData[key])) {
      setRoaringData({ _unlocked: true });
    }
    
    // ─────────────────────────────────────────────────────────────────
    // Steg 5: Navigera till senaste slide
    // ─────────────────────────────────────────────────────────────────
    const lastSlide = metadata.current_slide || metadata.lastSlide || 'uppdragsval';
    console.log('[RESUMING] 🧭 Navigating to:', lastSlide);
    setCurrentSlideKey(lastSlide);
    
    const slide = SLIDE_ORDER.find(s => s.key === lastSlide);
    if (slide) {
      navigate(slide.path);
    }
    
    // Sätt tab session
    const caseId = activeCase.caseId || activeCase.onboardingId;
    storage.setCurrentTabSession({
      sessionId: storage.buildSessionId(activeCase.companyId, caseId, user?.id),
      currentSlide: lastSlide,
    });
    
    await api.log(`Användare ${user?.name} återupptog onboarding för ${activeCase.companyName}`);
    
  } catch (e) {
    console.error('[RESUMING] ❌ Error:', e);
    setError(e.message);
  }
  
  setIsLoading(false);
  return 'READY';
}


/**
 * PROCESSING_NEXT - Användaren klickade "Nästa"
 * 
 * Detta är en DISPATCHER - den avgör VAD som ska hända baserat på vilken slide.
 * 
 * RETURNERAR: Objekt med { nextState, actions } eller null
 */
export function getNextSlideAction(currentSlideKey, SLIDE_ORDER) {
  const currentIndex = SLIDE_ORDER.findIndex(s => s.key === currentSlideKey);
  
  if (currentIndex >= SLIDE_ORDER.length - 1) {
    return { isLastSlide: true };
  }
  
  const nextSlide = SLIDE_ORDER[currentIndex + 1];
  return { 
    isLastSlide: false, 
    nextSlide,
    currentIndex 
  };
}


/**
 * PROCESSING_BACK - Användaren klickade "Tillbaka"
 * 
 * Enkel logik: Gå till föregående slide utan server-save
 */
export function getPreviousSlideAction(currentSlideKey, SLIDE_ORDER) {
  const currentIndex = SLIDE_ORDER.findIndex(s => s.key === currentSlideKey);
  
  if (currentIndex <= 0) {
    return { isFirstSlide: true };
  }
  
  const prevSlide = SLIDE_ORDER[currentIndex - 1];
  return {
    isFirstSlide: false,
    prevSlide,
    currentIndex
  };
}


/**
 * Hjälpfunktion: Spara slide-data och navigera till nästa
 * 
 * Används av de flesta slides som inte har special-logik
 */
export async function saveSlideAndNavigate({
  slideKey,
  currentIndex,
  formData,
  activeCase,
  storage,
  api,
  user,
  setCompletedSlides,
  setCurrentSlideKey,
  setNavigationHistory,
  navigate,
  SLIDE_ORDER,
}) {
  console.log(`[SAVE-AND-NAV] Saving ${slideKey} and navigating to next...`);
  
  const slideData = formData[slideKey] || {};
  const nextSlide = SLIDE_ORDER[currentIndex + 1];
  
  if (!nextSlide) {
    console.error('[SAVE-AND-NAV] No next slide found!');
    return false;
  }
  
  try {
    // 1. Spara till localStorage
    storage.setSlideData(slideKey, slideData);
    
    // 2. Markera som completed
    setCompletedSlides(prev => {
      if (!prev.includes(slideKey)) {
        return [...prev, slideKey];
      }
      return prev;
    });
    
    // 3. Om vi har ett permanent case, synka till server
    if (activeCase?.companyId && activeCase?.caseId) {
      // Hämta current version
      const versionKey = `case_${activeCase.companyId}_${activeCase.caseId}_version`;
      const versionStr = localStorage.getItem(versionKey);
      const versionObj = versionStr ? JSON.parse(versionStr) : { version: 0 };
      
      const response = await api.post(
        `/onboarding/${activeCase.companyId}/${activeCase.caseId}/metadata`,
        {
          pages: { [slideKey]: slideData },
          current_slide: nextSlide.key,
          expected_version: versionObj.version,
        }
      );
      
      if (!response.ok) {
        if (response.status === 409) {
          console.warn('[SAVE-AND-NAV] Version conflict!');
          return { conflict: true };
        }
        throw new Error(`Server error: ${response.status}`);
      }
      
      // Uppdatera local version
      const data = await response.json();
      if (data.version) {
        localStorage.setItem(versionKey, JSON.stringify({
          version: data.version,
          timestamp: new Date().toISOString()
        }));
      }
    }
    
    // 4. Navigera
    console.log(`[SAVE-AND-NAV] ✅ Navigating to ${nextSlide.key}`);
    setCurrentSlideKey(nextSlide.key);
    navigate(nextSlide.path);
    
    // 5. Logga navigation
    setNavigationHistory(prev => [...prev, {
      slideKey: nextSlide.key,
      timestamp: Date.now(),
      action: 'next',
      fromSlide: slideKey,
    }]);
    
    return { success: true };
    
  } catch (err) {
    console.error('[SAVE-AND-NAV] ❌ Error:', err);
    return { error: err.message };
  }
}


/**
 * loadSlideFromStorage - Ladda en slides data från localStorage/server
 * 
 * ANVÄNDS AV: SLIDE-LOAD useEffect (nu refaktorerad hit)
 */
export async function loadSlideData({
  slideKey,
  isDraftMode,
  activeCase,
  user,
  storage,
  api,
  setFormData,
  setConflictInfo,
  setShowConflictModal,
}) {
  console.log(`[LOAD-SLIDE] Loading '${slideKey}'...`);
  
  // ─────────────────────────────────────────────────────────────────
  // DRAFT MODE: Endast localStorage
  // ─────────────────────────────────────────────────────────────────
  if (isDraftMode) {
    console.log(`[LOAD-SLIDE] 📝 Draft mode - localStorage only`);
    const localData = storage.getSlideData(slideKey);
    if (localData && Object.keys(localData).length > 0) {
      setFormData(prev => {
        if (prev[slideKey] && Object.keys(prev[slideKey]).length > 0) {
          return prev; // Already loaded
        }
        return { ...prev, [slideKey]: localData };
      });
    }
    return { source: 'localStorage', data: localData };
  }
  
  // ─────────────────────────────────────────────────────────────────
  // PERMANENT MODE: Jämför localStorage vs Server
  // ─────────────────────────────────────────────────────────────────
  if (!activeCase?.companyId || !activeCase?.caseId) {
    console.log(`[LOAD-SLIDE] ⚠️ No active case`);
    return { source: 'none' };
  }
  
  const localData = storage.getSlideData(slideKey);
  const hasLocalData = localData && Object.keys(localData).length > 0;
  
  // Hämta från server
  let serverMeta = null;
  let serverSlideData = null;
  
  try {
    serverMeta = await api.fetchMetadata(activeCase.companyId, activeCase.caseId);
    serverSlideData = serverMeta?.metadata?.pages?.[slideKey];
  } catch (err) {
    console.warn(`[LOAD-SLIDE] Server fetch failed:`, err.message);
    if (hasLocalData) {
      setFormData(prev => ({ ...prev, [slideKey]: localData }));
      return { source: 'localStorage-fallback', data: localData };
    }
    return { source: 'error', error: err.message };
  }
  
  const hasServerData = serverSlideData && Object.keys(serverSlideData).length > 0;
  
  // Besluta vilken källa som ska användas
  if (!hasServerData && !hasLocalData) {
    setFormData(prev => ({ ...prev, [slideKey]: {} }));
    return { source: 'empty' };
  }
  
  if (!hasServerData && hasLocalData) {
    setFormData(prev => ({ ...prev, [slideKey]: localData }));
    return { source: 'localStorage', data: localData };
  }
  
  if (hasServerData && !hasLocalData) {
    setFormData(prev => ({ ...prev, [slideKey]: serverSlideData }));
    return { source: 'server', data: serverSlideData };
  }
  
  // Båda har data - jämför innehåll
  const localStr = JSON.stringify(localData);
  const serverStr = JSON.stringify(serverSlideData);
  
  if (localStr === serverStr) {
    setFormData(prev => ({ ...prev, [slideKey]: serverSlideData }));
    return { source: 'server', data: serverSlideData, note: 'identical' };
  }
  
  // Olika innehåll - kolla vem som ändrade
  const serverModifiedBy = serverMeta?.metadata?.updated_by;
  const currentUserEmail = user?.email;
  
  if (serverModifiedBy && currentUserEmail && serverModifiedBy !== currentUserEmail) {
    // Annan användare - visa konflikt-modal
    setConflictInfo({
      slide_key: slideKey,
      modified_by: serverModifiedBy,
      server_version: serverMeta?.metadata?.version || 0,
      local_data: localData,
      server_data: serverSlideData,
    });
    setShowConflictModal(true);
    return { source: 'conflict', modifiedBy: serverModifiedBy };
  }
  
  // Samma användare - använd nyaste (baserat på version)
  const serverVersion = serverMeta?.metadata?.version || 0;
  const versionKey = `case_${activeCase.companyId}_${activeCase.caseId}_version`;
  const localVersionStr = localStorage.getItem(versionKey);
  const localVersion = localVersionStr ? JSON.parse(localVersionStr).version : 0;
  
  if (serverVersion > localVersion) {
    // Server är nyare
    setFormData(prev => ({ ...prev, [slideKey]: serverSlideData }));
    storage.setSlideData(slideKey, serverSlideData);
    return { source: 'server', data: serverSlideData, note: 'newer' };
  } else {
    // Local är nyare (osparade ändringar)
    setFormData(prev => ({ ...prev, [slideKey]: localData }));
    return { source: 'localStorage', data: localData, note: 'unsaved' };
  }
}
