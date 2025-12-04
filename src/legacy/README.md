# Legacy-filer

Denna mapp innehåller gamla versioner av filer som inte längre används i produktion.
De sparas för referens och om vi behöver återställa något.

## Flyttade 2024-12-04

### App-filer
- `App.jsx` - Gammal monolitisk version med all logik i en fil
- `App_v2.jsx` - MasterStateProvider + AuthenticatedApp_v2
- `App_tic_tac_toe.jsx` - Tutorial-fil från tic-tac-toe övningen
- `AuthenticatedApp_v2.jsx` - Äldre version med MasterStateContext

### Context/Hooks
- `context/MasterStateContext_v2.jsx` - Äldre context-baserad state
- `hooks/useMasterState.js` - Original hook
- `hooks/useMasterState_v2.js` - V2 hook

### Komponenter
- `components/Layout/Sidebar.jsx` - Original sidebar
- `components/Layout/Sidebar_v2.jsx` - V2 sidebar (ej explicit)
- `components/Modals/OnboardingResumeDialog.jsx` - Original dialog (gör egen fetch)

### Test-filer
- `test.jsx`, `test2.jsx` - Tomma/oanvända testfiler

---

## Nuvarande arkitektur (v3)

```
src/
├── main.jsx              ← Entry point
├── App.jsx               ← Gatekeeper (pre-auth vs post-auth)
├── AuthenticatedApp.jsx  ← State machine + alla post-auth slides
└── components/
    ├── Layout/
    │   └── Sidebar.jsx   ← Explicit slide-knappar (tic-tac-toe pattern)
    └── Modals/
        └── OnboardingResumeDialog.jsx  ← Slave-pattern (props only)
```
