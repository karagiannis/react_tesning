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
 *   2. Jämför med localStorage local_version
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
    if (!activeCase?.company_id || !activeCase?.case_id) {
      console.log('[VERSION-SYNC] No active case, skipping check');
      return { hasConflict: false };
    }

    setIsChecking(true);

    try {
      // 1. Hämta server metadata
      const serverMetadata = await api.fetchMetadata(
        activeCase.company_id,
        activeCase.case_id
      );

      // 2. Hämta local version number
      const localVersionStr = localStorage.getItem('local_version');
      const localVersionData = localVersionStr ? JSON.parse(localVersionStr) : null;
      const local_version = localVersionData?.version || 0;
      
      // 3. Hämta server version number
      const server_version = serverMetadata.version || 0;
      
      // 4. Hämta local formData
      const localFormData = storage.getFormData();
      
      // 5. Hämta current user från localStorage/sessionStorage
      const currentUserStr = localStorage.getItem('user') || sessionStorage.getItem('user');
      const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
      const currentUserEmail = currentUser?.email || currentUser?.user_id || currentUser?.sub;
      
      // 6. Hämta vem som senast modifierade på server
      const serverModifiedBy = serverMetadata.modified_by || serverMetadata.modified_by || serverMetadata.updated_by;

      console.log('[VERSION-SYNC] Comparing versions:');
      console.log('  Server version:', server_version);
      console.log('  Local version:', local_version);
      console.log('  Server modified_by:', serverModifiedBy);
      console.log('  Current user:', currentUserEmail);

      // 7. Kolla om server har nyare version
      const serverIsNewer = server_version > local_version;
      
      // 8. CRITICAL: Kolla om det är SAMMA användare
      const sameUser = serverModifiedBy && currentUserEmail && 
                       (serverModifiedBy === currentUserEmail || 
                        serverModifiedBy.includes(currentUserEmail) ||
                        currentUserEmail.includes(serverModifiedBy));
      
      if (serverIsNewer && !sameUser) {
        // KONFLIKT! Någon ANNAN användare har ändrat
        console.log('[VERSION-SYNC] ⚠️ CONFLICT DETECTED - Different user modified!');
        console.log(`  Server version ${server_version} > Local version ${local_version}`);
        
        setServerData({
          formData: serverMetadata.formData,
          version: server_version,
          last_modified: serverMetadata.last_modified || serverMetadata.last_modified,
          modified_by: serverModifiedBy,
        });
        
        setLocalData({
          formData: localFormData,
          version: local_version,
        });
        
        setHasConflict(true);
        setIsChecking(false);
        
        return { 
          hasConflict: true, 
          serverData: serverMetadata, 
          localData: localFormData 
        };
      }
      
      // Om server har nyare version MEN det är samma användare → AUTO-SYNC
      if (serverIsNewer && sameUser) {
        console.log('[VERSION-SYNC] ✅ Server version is newer but SAME USER - Auto-syncing...');
        console.log(`  Server version ${server_version} > Local version ${local_version}`);
        
        // Uppdatera local storage med serverns data (tyst sync)
        if (serverMetadata.formData) {
          storage.setFormData(serverMetadata.formData);
          localStorage.setItem('local_version', JSON.stringify({
            version: server_version,
            timestamp: new Date().toISOString(),
            formDataHash: 'auto-synced',
          }));
        }
        
        setHasConflict(false);
        setIsChecking(false);
        
        return { 
          hasConflict: false, 
          autoSynced: true,
          serverData: serverMetadata 
        };
      }

      console.log('[VERSION-SYNC] ✅ No conflict - local is up to date');
      console.log(`  Server version ${server_version} === Local version ${local_version}`);
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
        localStorage.setItem('local_version', JSON.stringify({
          timestamp: serverData.last_modified?.toISOString() || new Date().toISOString(),
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
