# MASTER/SLAVE Hook Pattern - Usage Guide

## 📋 Background: Race Condition Fix

**Problem (BUG):** Auto-save was triggering BEFORE data was loaded from server.

```
Timeline (BUG):
1. Component mounts
2. useQuestionnaireForm runs
3. formData = {} (empty) initially
4. auto-save useEffect sees formData change
5. auto-save writes {} to localStorage ❌ BAD!
6. Meanwhile, server fetch is still in progress...
7. Server data arrives (too late, empty data already saved)
```

**Solution:** MASTER/SLAVE separation.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  useSlideStateController (MASTER)                               │
│  - Fetches data from server                                     │
│  - Reads localStorage                                           │
│  - Compares versions, decides winner                            │
│  - Returns { initialData, isReady, source }                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  useQuestionnaireForm (SLAVE)                                   │
│  - Receives initialData from MASTER                             │
│  - Sets formData ONLY when isReady=true                         │
│  - Auto-save runs ONLY after initialData is applied             │
│  - No race condition! ✅                                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔧 Usage

### BEFORE (Old Pattern - Has Race Condition Bug)

```jsx
import useQuestionnaireForm from '../../hooks/useQuestionnaireForm';

function MySlide() {
  const { formData, updateQuestion, pushToServer } = useQuestionnaireForm(
    'my_slide_key',
    QUESTIONS_CONFIG
  );
  
  // ❌ Race condition: auto-save may write {} before data loads
  return <form>...</form>;
}
```

### AFTER (New Pattern - Race Condition Fixed)

```jsx
import useSlideStateController from '../../hooks/useSlideStateController';
import useQuestionnaireForm from '../../hooks/useQuestionnaireForm';

function MySlide() {
  // 1. MASTER fetches and decides
  const { 
    initialData, 
    isReady, 
    source, 
    metadata,
    error 
  } = useSlideStateController('my_slide_key');
  
  // 2. SLAVE receives data - auto-save blocked until isReady=true
  const { 
    formData, 
    updateQuestion, 
    pushToServer,
    initialDataApplied  // Confirms race condition protection is active
  } = useQuestionnaireForm('my_slide_key', QUESTIONS_CONFIG, {
    initialData,
    isReady,
    source,
    caseMetadata: metadata
  });
  
  // 3. Show loading while MASTER works
  if (!isReady) {
    return <LoadingSpinner />;
  }
  
  // 4. Safe to render - data is loaded
  return <form>...</form>;
}
```

---

## 📊 MASTER Return Values

```javascript
const {
  initialData,   // Object: Data to pass to SLAVE (may be null if no data)
  isReady,       // Boolean: true when decision is complete
  source,        // 'server' | 'localStorage' | 'empty' - where data came from
  metadata,      // Object: Case metadata from server (version, is_locked, etc.)
  error,         // String | null: Error message if fetch failed
  refetch        // Function: Force re-fetch from server
} = useSlideStateController(slideKey);
```

---

## 📊 SLAVE Return Values (Extended)

```javascript
const {
  formData,              // Current form data
  updateQuestion,        // Function to update a question
  pushToServer,          // Function to save to server
  isLoading,             // Boolean
  isSaving,              // Boolean
  canEdit,               // Boolean
  initialDataApplied,    // 🆕 Boolean: Race condition protection active
  dataSource,            // 🆕 String: 'server' | 'localStorage' | 'empty'
  // ... other existing fields
} = useQuestionnaireForm(slideKey, config, masterData);
```

---

## ⚠️ Important Notes

1. **Always use MASTER first** - SLAVE depends on MASTER's data
2. **Pass all four fields** to SLAVE: `{ initialData, isReady, source, caseMetadata }`
3. **Show loading state** while `!isReady`
4. **Check `initialDataApplied`** if debugging auto-save issues

---

## 🧪 Debug Tips

Enable debug mode to see the MASTER/SLAVE workflow:

**Option 1: .env.development (recommended)**
```bash
# In .env.development file:
VITE_DEBUG_MODE=true
# Then restart dev server
```

**Option 2: Vite CLI**
```bash
VITE_DEBUG_MODE=true npm run dev
```

Then check console for:
- `🎯 MASTER is ready! Applying initialData`
- `✅ SLAVE initialization complete!`
- `💾 Auto-saving draft to localStorage` (should only appear AFTER initialData applied)

---

## 📁 Files

- `/src/hooks/useSlideStateController.js` - MASTER hook
- `/src/hooks/useQuestionnaireForm.js` - SLAVE hook (refactored)
- `/src/hooks/USAGE_MASTER_SLAVE.md` - This documentation
