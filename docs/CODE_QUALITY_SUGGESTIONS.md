# Code Quality Suggestions

**Date:** 2025-12-13  
**Source:** Code Review Post Tic-Tac-Toe Pattern Verification  
**Status:** 🟡 Optional Improvements (Not Critical)

---

## Overview

After verifying the tic-tac-toe pattern implementation (✅ APPROVED), the automated code review identified 4 minor code quality improvements. These are NOT bugs or pattern violations, but defensive programming enhancements.

**Priority:** Low - Implement during regular maintenance

---

## Suggestions

### 1. Add Error Handling for parseInt in createStorage.js

**File:** `src/utils/createStorage.js`  
**Lines:** 172-177

**Current Code:**
```javascript
getVersion() {
  const versionKey = this._buildKey('metadata::version');
  const stored = localStorage.getItem(versionKey);
  return stored ? parseInt(stored, 10) : 0;
}
```

**Issue:**
If localStorage contains corrupted data (e.g., "abc"), parseInt returns NaN, which breaks version comparisons.

**Suggested Fix:**
```javascript
getVersion() {
  const versionKey = this._buildKey('metadata::version');
  const stored = localStorage.getItem(versionKey);
  if (!stored) return 0;
  
  const version = parseInt(stored, 10);
  if (isNaN(version)) {
    console.warn(`[STORAGE] Invalid version in localStorage: ${stored}, resetting to 0`);
    this.setVersion(0);
    return 0;
  }
  
  return version;
}
```

**Priority:** Low  
**Impact:** Prevents edge case where corrupted localStorage breaks version conflict detection

---

### 2. Add Null Check Before toLowerCase() in useSlideDataLoader.js

**File:** `src/hooks/useSlideDataLoader.js`  
**Lines:** 221-225

**Current Code:**
```javascript
// Om olika användare → KONFLIKT
if (serverModifiedBy && user?.email && serverModifiedBy !== user.email) {
  const emailsMatch = serverModifiedBy.toLowerCase() === user.email.toLowerCase();
  if (!emailsMatch) {
    // Visa konfliktmodal
  }
}
```

**Issue:**
If user.email or serverModifiedBy is null/undefined after the initial check, toLowerCase() throws error.

**Suggested Fix:**
```javascript
// Om olika användare → KONFLIKT
if (serverModifiedBy && user?.email && serverModifiedBy !== user.email) {
  const serverEmail = String(serverModifiedBy || '').toLowerCase();
  const currentEmail = String(user.email || '').toLowerCase();
  
  if (serverEmail !== currentEmail) {
    // Visa konfliktmodal
  }
}
```

**Priority:** Low  
**Impact:** Prevents runtime error in edge case where email is unexpectedly null

---

### 3. Use Storage API Instead of Direct localStorage Access

**File:** `src/stateMachine/handleResumingState.js`  
**Lines:** 217-223

**Current Code:**
```javascript
// 📌 SPARA SERVER VERSION för conflict detection via storage API
const server_version = metadata.version || 0;
const permanentVersionKey = StorageKeyBuilder.buildPermanentKey(
  activeCase.company_id,
  activeCase.case_id,
  user?.id,
  'metadata::version'
);
localStorage.setItem(permanentVersionKey, String(server_version));
```

**Issue:**
Bypasses the storage API abstraction. Inconsistent with rest of codebase that uses `storage.setVersion()`.

**Suggested Fix:**

**Option A:** Add method to storage API:
```javascript
// In createStorage.js
setPermanentVersion(companyId, caseId, version) {
  const key = StorageKeyBuilder.buildPermanentKey(companyId, caseId, this._getState().user?.id, 'metadata::version');
  localStorage.setItem(key, String(version));
}

// In handleResumingState.js
storage.setPermanentVersion(activeCase.company_id, activeCase.case_id, server_version);
```

**Option B:** Keep as is and add comment:
```javascript
// NOTA BENE: Vi använder direct localStorage här eftersom storage.setVersion()
// använder _buildKey() som läser isDraftMode från state, men vi är mitt i
// övergången från draft→permanent så state är inte synkroniserat än.
localStorage.setItem(permanentVersionKey, String(server_version));
```

**Priority:** Very Low (Code works, just consistency improvement)  
**Impact:** Better abstraction consistency

---

### 4. Better Fallback for Date Parsing Error

**File:** `src/components/Modals/MergeConflictModal.jsx`  
**Lines:** 97-104

**Current Code:**
```javascript
const formatDate = (isoString) => {
  if (!isoString) return 'Okänd tid';
  try {
    return new Date(isoString).toLocaleString('sv-SE', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  } catch (e) {
    return isoString; // Falls back to showing raw ISO string
  }
};
```

**Issue:**
On error, returns raw ISO string like "2024-12-13T10:30:00.000Z" which is less user-friendly.

**Suggested Fix:**
```javascript
const formatDate = (isoString) => {
  if (!isoString) return 'Okänd tid';
  try {
    return new Date(isoString).toLocaleString('sv-SE', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  } catch (e) {
    console.warn('[CONFLICT-MODAL] Failed to parse date:', isoString, e);
    return 'Ogiltigt datum';
  }
};
```

**Priority:** Very Low  
**Impact:** Better UX if server sends malformed timestamp

---

## Implementation Notes

**When to implement:**
- During next refactoring session
- When touching related code
- During code quality sprint

**Not critical because:**
- ✅ Tic-tac-toe pattern is correctly implemented
- ✅ State machine works as designed
- ✅ No functional bugs identified
- These are defensive programming improvements

**Testing:**
When implementing these, add unit tests for edge cases:
- Corrupted localStorage version
- Null email in conflict detection
- Malformed server timestamps

---

## Related Documents

- [TIC_TAC_TOE_PATTERN_REVIEW.md](TIC_TAC_TOE_PATTERN_REVIEW.md) - Main review document
- [STATE_MACHINE_OVERVIEW.md](STATE_MACHINE_OVERVIEW.md) - State machine documentation

---

**Status:** 🟢 Code quality is good. These are optional enhancements.
