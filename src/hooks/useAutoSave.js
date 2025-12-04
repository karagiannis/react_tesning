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
 * 3. Uppdaterar localVersion timestamp
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
  const debouncedSave = useCallback((data) => {
    if (!enabled || !storage) return;

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsSaving(true);

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      try {
        // Save formData
        storage.setFormData(data);
        
        // Update local version timestamp
        const now = new Date().toISOString();
        localStorage.setItem('localVersion', JSON.stringify({
          timestamp: now,
          formDataHash: simpleHash(JSON.stringify(data)),
        }));
        
        setLastSaved(now);
        console.log('[AUTO-SAVE] ✅ Saved to localStorage at', now);
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
    debouncedSave(formData);
  }, [formData, debouncedSave]);

  // ─────────────────────────────────────────────────────────────────────────
  // Force save (bypass debounce)
  // ─────────────────────────────────────────────────────────────────────────
  const forceSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (!storage) return;
    
    try {
      storage.setFormData(formData);
      const now = new Date().toISOString();
      localStorage.setItem('localVersion', JSON.stringify({
        timestamp: now,
        formDataHash: simpleHash(JSON.stringify(formData)),
      }));
      setLastSaved(now);
      console.log('[AUTO-SAVE] ✅ Force saved at', now);
    } catch (err) {
      console.error('[AUTO-SAVE] ❌ Force save failed:', err);
    }
  }, [formData, storage]);

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
