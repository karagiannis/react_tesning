# Multi-User Editing - Version Conflict Detection

## Översikt

Detta dokument beskriver hur vi hanterar scenariot där **flera användare redigerar samma ärende samtidigt**.

## Problem

```
┌──────────────┐                    ┌──────────────┐
│   User A     │                    │   User B     │
│   (Browser)  │                    │   (Browser)  │
└──────┬───────┘                    └──────┬───────┘
       │                                   │
       │ Öppnar ärende (v1)               │ Öppnar ärende (v1)
       │◄─────────────────────────────────►│
       │                                   │
       │ Ändrar fält X                     │
       ▼                                   │
       │ Sparar (v2) ──────────────────────│
       │                                   │
       │                                   │ Ändrar fält Y
       │                                   ▼
       │                   ❌ KONFLIKT!    │
       │                   User B har v1   │
       │                   Server har v2   │
```

## Lösning

### 1. Auto-Save till localStorage

```javascript
// useAutoSave.js
// Sparar till localStorage med debounce (300ms)
// Uppdaterar localVersion timestamp vid varje sparning
```

Vid varje formData-ändring:
1. Debounce 300ms (undvik för många skrivningar)
2. Spara formData till localStorage
3. Uppdatera `localVersion.timestamp`

```javascript
localStorage.setItem('localVersion', JSON.stringify({
  timestamp: new Date().toISOString(),
  formDataHash: 'a1b2c3d4',
}));
```

### 2. Version Check vid Navigation

```javascript
// I AuthenticatedApp.jsx
// handleSidebarClick och handleNext anropar checkVersionConflict()
```

Vid varje slide-navigation:
1. Hämta `metadata.last_modified` från server
2. Jämför med `localStorage.localVersion.timestamp`
3. Om server är nyare → Visa MergeConflictModal

```javascript
const checkVersionConflict = async () => {
  const serverMeta = await api.fetchMetadata(companyId, caseId);
  const localVersion = JSON.parse(localStorage.getItem('localVersion'));
  
  if (serverMeta.last_modified > localVersion.timestamp + 5000) {
    // KONFLIKT! Visa modal
    setShowConflictModal(true);
    return true;
  }
  return false;
};
```

### 3. MergeConflictModal

![Modal mockup](./modal-mockup.png)

**Tre alternativ:**

| Knapp | Effekt |
|-------|--------|
| **Ladda om från server** | Förlorar lokala ändringar, hämtar senaste version |
| **Skriv över server** | Behåller lokala ändringar, överskriver server (force) |
| **Avbryt** | Stänger modal, gör ingenting |

### 4. Dataflöde

```
┌────────────────────────────────────────────────────────────────────────┐
│                        AuthenticatedApp                                │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────┐     ┌──────────────┐     ┌─────────────────────┐     │
│  │  formData   │────▶│  useAutoSave │────▶│  localStorage       │     │
│  │  (state)    │     │  (debounce)  │     │  localVersion       │     │
│  └─────────────┘     └──────────────┘     └─────────────────────┘     │
│         ▲                                          │                   │
│         │                                          │                   │
│         │                                          ▼                   │
│  ┌──────────────┐    ┌──────────────────┐   ┌─────────────────────┐  │
│  │  handleNext  │───▶│checkVersionConflict│──▶│ server metadata   │  │
│  │  handleClick │    │     (async)       │   │ (API /resume)     │  │
│  └──────────────┘    └──────────────────┘   └─────────────────────┘  │
│                              │                                        │
│                              ▼                                        │
│                       ┌──────────────────┐                            │
│                       │MergeConflictModal│                            │
│                       └──────────────────┘                            │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘
```

## Implementation

### Filer

| Fil | Syfte |
|-----|-------|
| `hooks/useAutoSave.js` | Debounced sparning till localStorage |
| `hooks/useVersionSync.js` | Version-jämförelse och konfliktdetektion |
| `components/MergeConflictModal.jsx` | UI för konflikthantering |
| `AuthenticatedApp.jsx` | Integrerar allt |

### API Endpoint

```python
# /onboarding/resume/{company_id}
# Returnerar:
{
    "form_data": {...},
    "completed_slides": [...],
    "metadata": {
        "version": 5,
        "last_modified": "2025-12-04T15:30:00Z",
        "modified_by": "user_abc@example.com"
    },
    "roaring_data": {...}
}
```

## Framtida Förbättringar

### 1. Real-time Sync (WebSocket)
Istället för att kolla vid navigation, push-notifikation vid ändringar.

### 2. Merge Editor
Visa diff-vy där användaren kan välja per fält.

### 3. Optimistic Locking
Skicka version med varje save, server returnerar 409 om mismatch.

```python
# Server-side
if request.version != current_version:
    return JSONResponse(
        status_code=409,
        content={
            "error": "conflict",
            "your_version": request.version,
            "server_version": current_version
        }
    )
```

## Testning

### Manuell test:
1. Öppna samma ärende i två browsers
2. Gör ändringar i Browser A, spara
3. Navigera till nästa slide i Browser B
4. MergeConflictModal ska visas

### E2E test:
```javascript
// TODO: Implementera Playwright-test
test('shows conflict modal when server has newer version', async () => {
  // 1. Öppna ärende
  // 2. Mocka server response med nyare timestamp
  // 3. Navigera
  // 4. Verifiera att MergeConflictModal visas
});
```

---

*Senast uppdaterad: 2025-12-04*
