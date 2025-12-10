/**
 * useAutoSave.js
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * AUTO-SAVE HOOK - Sparar till localStorage vid varje interaktion
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * TIC-TAC-TOE PATTERN:
 * - Denna hook används av AuthenticatedApp (Game-nivå)
 * - Slides anropar INTE denna hook direkt
 * - AuthenticatedApp skickar ner handleFieldChange som anropar denna
 * 
 * FUNKTIONALITET:
 * 1. Lyssnar på formData-ändringar
 * 2. Debounced save till localStorage (300ms)
 * 3. Uppdaterar local_version timestamp
 * 4. Synkar med server periodiskt (optional)
 * 
 * ANVÄNDNING:
 *   const { lastSaved, isSaving, forceSave } = useAutoSave({
 *     formData,
 *     storage,
 *     debounceMs: 300,
 *   });
 */

import { useState, useEffect, useRef, useCallback } from 'react';

export default function useAutoSave({
  formData,
  storage,
  currentSlideKey,  // NY: Vilken slide är vi på? (t.ex. 'uppdragsval', 'riskfragor-steg-1')
  debounceMs = 300,
  enabled = true,
}) {
  const [lastSaved, setLastSaved] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const timeoutRef = useRef(null);
  const previousFormDataRef = useRef(formData);

  // ─────────────────────────────────────────────────────────────────────────
  // Debounced save function
  // ─────────────────────────────────────────────────────────────────────────
  const debouncedSave = useCallback((data, slideKey) => {
    if (!enabled || !storage) return;
    
    // Skippa om ingen slideKey (t.ex. på resultslide)
    if (!slideKey) {
      console.log('[AUTO-SAVE] ⚠️ No slideKey provided, skipping save');
      return;
    }

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsSaving(true);

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      try {
        // NYTT: Spara BARA nuvarande slides data
        const slideData = data[slideKey];
        if (!slideData) {
          console.log(`[AUTO-SAVE] ⚠️ No data for slide '${slideKey}', skipping save`);
          setIsSaving(false);
          return;
        }
        
        storage.setSlideData(slideKey, slideData);
        
        // Update local version timestamp (per slide)
        const now = new Date().toISOString();
        const versionKey = `localVersion_${slideKey}`;
        localStorage.setItem(versionKey, JSON.stringify({
          timestamp: now,
          dataHash: simpleHash(JSON.stringify(slideData)),
        }));
        
        setLastSaved(now);
        console.log(`[AUTO-SAVE] ✅ Saved slide '${slideKey}' to localStorage at`, now);
      } catch (err) {
        console.error('[AUTO-SAVE] ❌ Failed to save:', err);
      } finally {
        setIsSaving(false);
      }
    }, debounceMs);
  }, [enabled, storage, debounceMs]);

  // ─────────────────────────────────────────────────────────────────────────
  // Watch for formData changes
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    // Skip if formData hasn't actually changed (deep compare)
    if (JSON.stringify(formData) === JSON.stringify(previousFormDataRef.current)) {
      return;
    }
    
    previousFormDataRef.current = formData;
    debouncedSave(formData, currentSlideKey);  // Pass currentSlideKey
  }, [formData, currentSlideKey, debouncedSave]);

  // ─────────────────────────────────────────────────────────────────────────
  // Force save (bypass debounce)
  // ─────────────────────────────────────────────────────────────────────────
  const forceSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (!storage || !currentSlideKey) return;
    
    try {
      const slideData = formData[currentSlideKey];
      if (!slideData) {
        console.log(`[AUTO-SAVE] ⚠️ Force save: No data for slide '${currentSlideKey}'`);
        return;
      }
      
      storage.setSlideData(currentSlideKey, slideData);
      const now = new Date().toISOString();
      const versionKey = `localVersion_${currentSlideKey}`;
      localStorage.setItem(versionKey, JSON.stringify({
        timestamp: now,
        dataHash: simpleHash(JSON.stringify(slideData)),
      }));
      setLastSaved(now);
      console.log(`[AUTO-SAVE] ✅ Force saved slide '${currentSlideKey}' at`, now);
    } catch (err) {
      console.error('[AUTO-SAVE] ❌ Force save failed:', err);
    }
  }, [formData, storage, currentSlideKey]);

  // ─────────────────────────────────────────────────────────────────────────
  // Cleanup on unmount
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    lastSaved,
    isSaving,
    forceSave,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Simple hash function for quick comparison
// ─────────────────────────────────────────────────────────────────────────────
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(16);
}
