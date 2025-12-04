/**
 * useVersionSync.js
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * VERSION SYNC HOOK - Kontrollerar om server-data har ändrats av annan användare
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * MULTI-USER EDITING STRATEGI:
 * 
 * Vid varje slide-navigation:
 *   1. Hämta metadata.version från server
 *   2. Jämför med localStorage localVersion
 *   3. Om server.version > local.version → KONFLIKT
 *   4. Visa MergeConflictModal
 * 
 * VERSION FORMAT:
 *   Server (metadata.json):
 *     { version: 5, last_modified: "2025-12-04T15:30:00Z", modified_by: "user_abc" }
 *   
 *   Local (localStorage):
 *     { timestamp: "2025-12-04T15:28:00Z", formDataHash: "a1b2c3d4" }
 * 
 * KONFLIKT SCENARION:
 *   1. server.last_modified > local.timestamp → Någon annan har sparat
 *   2. server.version !== expected_version → Optimistic locking failed
 * 
 * ANVÄNDNING i AuthenticatedApp:
 *   const { 
 *     hasConflict, 
 *     serverData, 
 *     localData,
 *     resolveConflict,
 *     checkVersion 
 *   } = useVersionSync({ activeCase, storage, api });
 */

import { useState, useCallback } from 'react';

export default function useVersionSync({ activeCase, storage, api }) {
  const [hasConflict, setHasConflict] = useState(false);
  const [serverData, setServerData] = useState(null);
  const [localData, setLocalData] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  // ─────────────────────────────────────────────────────────────────────────
  // Check version - anropas vid slide-navigation
  // ─────────────────────────────────────────────────────────────────────────
  const checkVersion = useCallback(async () => {
    if (!activeCase?.companyId || !activeCase?.caseId) {
      console.log('[VERSION-SYNC] No active case, skipping check');
      return { hasConflict: false };
    }

    setIsChecking(true);

    try {
      // 1. Hämta server version
      const serverMetadata = await api.fetchMetadata(
        activeCase.companyId,
        activeCase.caseId
      );

      // 2. Hämta local version
      const localVersionStr = localStorage.getItem('localVersion');
      const localVersion = localVersionStr ? JSON.parse(localVersionStr) : null;
      
      // 3. Hämta local formData
      const localFormData = storage.getFormData();

      // 4. Jämför timestamps
      const serverLastModified = new Date(serverMetadata.lastModified || serverMetadata.last_modified);
      const localTimestamp = localVersion ? new Date(localVersion.timestamp) : new Date(0);

      console.log('[VERSION-SYNC] Comparing versions:');
      console.log('  Server last_modified:', serverLastModified.toISOString());
      console.log('  Local timestamp:', localTimestamp.toISOString());
      console.log('  Server modified_by:', serverMetadata.modifiedBy || serverMetadata.modified_by);

      // 5. Kolla om server har nyare data
      // Lägg till 5 sekunder marginal för att undvika falska konflikter vid egen save
      const marginMs = 5000;
      if (serverLastModified > new Date(localTimestamp.getTime() + marginMs)) {
        // KONFLIKT! Server har nyare data
        console.log('[VERSION-SYNC] ⚠️ CONFLICT DETECTED!');
        
        setServerData({
          formData: serverMetadata.formData,
          version: serverMetadata.version,
          lastModified: serverLastModified,
          modifiedBy: serverMetadata.modifiedBy || serverMetadata.modified_by,
        });
        
        setLocalData({
          formData: localFormData,
          timestamp: localTimestamp,
        });
        
        setHasConflict(true);
        setIsChecking(false);
        
        return { 
          hasConflict: true, 
          serverData: serverMetadata, 
          localData: localFormData 
        };
      }

      console.log('[VERSION-SYNC] ✅ No conflict - local is up to date');
      setHasConflict(false);
      setIsChecking(false);
      
      return { hasConflict: false };

    } catch (err) {
      console.error('[VERSION-SYNC] ❌ Failed to check version:', err);
      setIsChecking(false);
      // Vid nätverksfel, fortsätt utan konflikt-check
      return { hasConflict: false, error: err };
    }
  }, [activeCase, storage, api]);

  // ─────────────────────────────────────────────────────────────────────────
  // Resolve conflict - användaren har valt hur konflikten ska lösas
  // ─────────────────────────────────────────────────────────────────────────
  const resolveConflict = useCallback((resolution) => {
    /**
     * resolution kan vara:
     *   'keep-local'  → Behåll mina ändringar (ignorera server)
     *   'take-server' → Ta serverns version (förlora mina ändringar)
     *   'merge'       → (Framtida) Visa merge-editor
     */
    
    console.log('[VERSION-SYNC] Resolving conflict with:', resolution);
    
    if (resolution === 'keep-local') {
      // Användaren vill behålla sina ändringar
      // Vi måste nu pusha till server med force (överskriva)
      setHasConflict(false);
      return { action: 'keep-local', data: localData?.formData };
    }
    
    if (resolution === 'take-server') {
      // Användaren accepterar serverns version
      // Uppdatera local storage med serverns data
      if (serverData?.formData) {
        storage.setFormData(serverData.formData);
        localStorage.setItem('localVersion', JSON.stringify({
          timestamp: serverData.lastModified?.toISOString() || new Date().toISOString(),
          formDataHash: 'synced-from-server',
        }));
      }
      setHasConflict(false);
      return { action: 'take-server', data: serverData?.formData };
    }
    
    // Merge-läge (framtida implementation)
    return { action: 'merge', serverData, localData };
    
  }, [serverData, localData, storage]);

  // ─────────────────────────────────────────────────────────────────────────
  // Clear conflict state
  // ─────────────────────────────────────────────────────────────────────────
  const clearConflict = useCallback(() => {
    setHasConflict(false);
    setServerData(null);
    setLocalData(null);
  }, []);

  return {
    hasConflict,
    serverData,
    localData,
    isChecking,
    checkVersion,
    resolveConflict,
    clearConflict,
  };
}
