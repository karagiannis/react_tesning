# State Machine Overview

> 📚 Pedagogisk dokumentation av AuthenticatedApp state machine
> 
> Skapad: 2025-12-11
> Uppdaterad: 2025-12-11

---

## 🎯 Översikt

AuthenticatedApp använder en **state machine** (switch-case) för att styra applikationens flöde.
Varje state har en dedikerad handler-fil i `src/stateMachine/`.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         STATE MACHINE ARKITEKTUR                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   AuthenticatedApp.jsx                                                      │
│   ├── useState(appState)         ← Nuvarande state                         │
│   ├── useEffect([appState])      ← Triggar processState() vid ändring      │
│   └── processState()             ← switch-case som delegerar till handlers │
│                                                                             │
│   stateMachine/                                                             │
│   ├── AppState.js                ← Enum med alla states                    │
│   ├── handleInitializingState.js                                           │
│   ├── handleCheckingPendingState.js                                        │
│   ├── handleShowingResumeState.js                                          │
│   ├── handleResumingState.js                                               │
│   ├── handleRestoringSessionState.js                                       │
│   ├── handleReadyState.js                                                  │
│   ├── handleProcessingNextState.js                                         │
│   ├── handleProcessingBackState.js                                         │
│   ├── handleInitiatingPaymentState.js                                      │
│   ├── handleVerifyingPaymentState.js                                       │
│   └── handleErrorState.js                                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Komplett State Flow

```
                              ┌─────────────────┐
                              │  UNINITIALIZED  │
                              │   (startvärde)  │
                              └────────┬────────┘
                                       │
                                       ▼
                              ┌─────────────────┐
                              │  INITIALIZING   │ ← handleInitializingState.js
                              │                 │
                              └────────┬────────┘
                                       │
                         ┌─────────────┴─────────────┐
                         │                           │
                         ▼                           ▼
              ┌──────────────────┐        ┌──────────────────┐
              │ CHECKING_PENDING │        │ RESTORING_SESSION│
              │                  │        │                  │
              └────────┬─────────┘        └────────┬─────────┘
                       │                           │
         ┌─────────────┼─────────────┐             │
         │             │             │             │
         ▼             ▼             ▼             │
┌─────────────┐ ┌─────────────┐ ┌─────────┐       │
│ VERIFYING_  │ │ SHOWING_    │ │  READY  │◄──────┘
│ PAYMENT     │ │ RESUME      │ │         │
└──────┬──────┘ └──────┬──────┘ └────┬────┘
       │               │             │
       │               │             ▼
       │               │      ┌─────────────────┐
       │               │      │ PROCESSING_NEXT │◄──┐
       │               │      └────────┬────────┘   │
       │               │               │            │
       │               ▼               │            │
       │        ┌─────────────┐        │            │
       │        │  RESUMING   │        │            │
       │        └──────┬──────┘        │            │
       │               │               │            │
       └───────────────┴───────────────┘            │
                       │                            │
                       ▼                            │
                ┌─────────────┐                     │
                │    READY    │─────────────────────┘
                └─────────────┘
```

---

## 1️⃣ handleInitializingState.js

**STATE:** `INITIALIZING`

**NÄR:** Direkt efter att `UNINITIALIZED` sätts om (första useEffect-körning)

**UPPGIFT:** Verifiera token, hämta användarinfo, sätta upp session

### Flödesschema

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        handleInitializingState.js                           │
│                                                                             │
│  STATE: INITIALIZING                                                        │
│  NÄR: Direkt efter UNINITIALIZED → INITIALIZING transition                  │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ STEG 1: Verifiera token                                             │   │
│  │                                                                     │   │
│  │   const token = storage.getToken();                                 │   │
│  │                                                                     │   │
│  │   if (!token) ──────────────────────────────────► navigate('/login')│   │
│  │               │                                   return (EXIT)     │   │
│  │               │                                                     │   │
│  │               ▼ (token finns)                                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                  │                                                          │
│                  ▼                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ STEG 2: Hantera tempCaseId                                          │   │
│  │                                                                     │   │
│  │   let tempId = storage.getTempCaseId();                             │   │
│  │                                                                     │   │
│  │   if (!tempId) {                                                    │   │
│  │     tempId = `temp_${Date.now()}_${random}`;   ← Generera nytt      │   │
│  │     storage.setTempCaseId(tempId);             ← Spara i localStorage│  │
│  │   }                                                                 │   │
│  │                                                                     │   │
│  │   setTempCaseId(tempId);                       ← React state        │   │
│  │   setIsDraftMode(true);                        ← Vi är i draft-läge │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                  │                                                          │
│                  ▼                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ STEG 3: Hämta användarinfo från servern                             │   │
│  │                                                                     │   │
│  │   const user = await api.fetchCurrentUser();   ← GET /api/me        │   │
│  │   setUser(user);                               ← { id, name, email }│   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                  │                                                          │
│                  ▼                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ STEG 4: Audit logging (två loggar!)                                 │   │
│  │                                                                     │   │
│  │   await api.log('Användare initierade app');   ← Central systemlogg │   │
│  │   await api.logPersonal('App initierad', {     ← Personlig logg     │   │
│  │     tempCaseId,                                                     │   │
│  │     pathname: window.location.pathname,                             │   │
│  │   });                                                               │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                  │                                                          │
│                  ▼                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ STEG 5: Kolla sessionStorage för tab-session                        │   │
│  │                                                                     │   │
│  │   const tabSession = storage.getCurrentTabSession();                │   │
│  │                                                                     │   │
│  │   // sessionStorage = per-tab, försvinner vid tab-stängning         │   │
│  │   // Innehåller: { sessionId, current_slide }                       │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                  │                                                          │
│                  ▼                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ STEG 6: SPECIAL CASE - Payment Success Page                         │   │
│  │                                                                     │   │
│  │   if (pathname === '/payment-success' || has session_id param) {    │   │
│  │     storage.clearCurrentTabSession();          ← Rensa gammal       │   │
│  │     setAppState(CHECKING_PENDING); ─────────────────────────────►   │   │
│  │   }                                                                 │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                  │                                                          │
│                  ▼ (inte payment-success)                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ STEG 7: Beslut baserat på tabSession                                │   │
│  │                                                                     │   │
│  │   if (tabSession && tabSession.sessionId) {                         │   │
│  │     // Validera att sessionen tillhör denna användare               │   │
│  │     const sessionBelongsToUser = checkSessionOwnership(tabSession); │   │
│  │                                                                     │   │
│  │     if (sessionBelongsToUser) {                                     │   │
│  │       ┌─────────────────────────────────────────────────────────┐   │   │
│  │       │ UTGÅNG 1: RESTORING_SESSION                             │   │   │
│  │       │                                                         │   │   │
│  │       │ • Användaren har en pågående tab-session                │   │   │
│  │       │ • Vi kan återställa slide-position från sessionStorage  │   │   │
│  │       │ • Snabbaste vägen tillbaka - ingen server-round-trip    │   │   │
│  │       │                                                         │   │   │
│  │       │ setAppState(RESTORING_SESSION) ─────────────────────►   │   │   │
│  │       └─────────────────────────────────────────────────────────┘   │   │
│  │     }                                                               │   │
│  │   }                                                                 │   │
│  │                                                                     │   │
│  │   // Ingen giltig tab-session                                       │   │
│  │   ┌─────────────────────────────────────────────────────────────┐   │   │
│  │   │ UTGÅNG 2: CHECKING_PENDING                                  │   │   │
│  │   │                                                             │   │   │
│  │   │ • Ingen tab-session, eller session tillhör annan användare  │   │   │
│  │   │ • Måste fråga servern om det finns pending onboardings      │   │   │
│  │   │ • Server-round-trip krävs                                   │   │   │
│  │   │                                                             │   │   │
│  │   │ setAppState(CHECKING_PENDING) ──────────────────────────►   │   │   │
│  │   └─────────────────────────────────────────────────────────────┘   │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ SAMMANFATTNING UTGÅNGAR:                                                    │
│                                                                             │
│   1. navigate('/login')      - Om ingen token (ej inloggad)                 │
│   2. RESTORING_SESSION       - Om giltig tab-session finns                  │
│   3. CHECKING_PENDING        - Annars (fråga servern)                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Nyckelkoncept

| Koncept | Förklaring |
|---------|------------|
| `tempCaseId` | Temporärt ID innan företag valts. Format: `temp_1733900000000_abc123` |
| `isDraftMode` | `true` = inget företag valt ännu, `false` = företag valt |
| `tabSession` | sessionStorage-data för denna tab (slide-position) |
| Dubbel-loggning | Både central systemlogg OCH personlig användarlogg |

---

## 2️⃣ handleCheckingPendingState.js

**STATE:** `CHECKING_PENDING`

**NÄR:** Efter INITIALIZING (användaren är autentiserad)

**UPPGIFT:** Fråga servern om det finns påbörjade men ej avslutade onboardings

### Flödesschema

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       handleCheckingPendingState.js                         │
│                                                                             │
│  STATE: CHECKING_PENDING                                                    │
│  NÄR: Efter INITIALIZING (användaren är autentiserad)                       │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ STEG 1: Kolla om vi är på payment-success sidan                     │   │
│  │                                                                     │   │
│  │   const isPaymentSuccessPage =                                      │   │
│  │     window.location.pathname === '/payment-success' ||              │   │
│  │     window.location.search.includes('session_id');                  │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                  │                                                          │
│                  ▼                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ STEG 2: Hämta pending onboardings från API                          │   │
│  │                                                                     │   │
│  │   const onboardings = await api.fetchPendingOnboardings();          │   │
│  │                                                                     │   │
│  │   // Returnerar array av: { id, case_id, company_name, status, ... }│   │
│  │   // status = 'pending_payment' eller liknande                      │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                  │                                                          │
│                  ▼                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ STEG 3: SPECIAL CASE - Payment Success Page                         │   │
│  │                                                                     │   │
│  │   if (isPaymentSuccessPage && onboardings.length > 0) {             │   │
│  │     ┌─────────────────────────────────────────────────────────┐     │   │
│  │     │ UTGÅNG 1: VERIFYING_PAYMENT                             │     │   │
│  │     │                                                         │     │   │
│  │     │ • Användaren kommer tillbaka från Stripe                │     │   │
│  │     │ • Har pending onboarding som väntar på betalverifiering │     │   │
│  │     │ • Sätt activeCase från onboardings[0]                   │     │   │
│  │     │                                                         │     │   │
│  │     │ setActiveCase(onboardings[0]);                          │     │   │
│  │     │ setPendingOnboardings(onboardings);                     │     │   │
│  │     │ setAppState(VERIFYING_PAYMENT) ─────────────────────►   │     │   │
│  │     └─────────────────────────────────────────────────────────┘     │   │
│  │   }                                                                 │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                  │                                                          │
│                  ▼ (inte payment-success)                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ STEG 4: Beslut baserat på pending onboardings                       │   │
│  │                                                                     │   │
│  │   if (onboardings.length > 0) {                                     │   │
│  │     ┌─────────────────────────────────────────────────────────┐     │   │
│  │     │ UTGÅNG 2: SHOWING_RESUME                                │     │   │
│  │     │                                                         │     │   │
│  │     │ • Användaren har påbörjade onboardings                  │     │   │
│  │     │ • Visa modal så de kan välja att fortsätta eller radera │     │   │
│  │     │                                                         │     │   │
│  │     │ 🔥 KRITISKT: Sätt data INNAN state-övergång!            │     │   │
│  │     │ setPendingOnboardings(onboardings);                     │     │   │
│  │     │                                                         │     │   │
│  │     │ await api.logPersonal('Pending onboardings funna');     │     │   │
│  │     │ setAppState(SHOWING_RESUME) ────────────────────────►   │     │   │
│  │     └─────────────────────────────────────────────────────────┘     │   │
│  │                                                                     │   │
│  │   } else {                                                          │   │
│  │     ┌─────────────────────────────────────────────────────────┐     │   │
│  │     │ UTGÅNG 3: READY                                         │     │   │
│  │     │                                                         │     │   │
│  │     │ • Inga pending onboardings - starta ny session          │     │   │
│  │     │ • Sätt initial tab session i sessionStorage             │     │   │
│  │     │                                                         │     │   │
│  │     │ const sessionId = `onboarding::draft::${tempCaseId}...`;│     │   │
│  │     │ storage.setCurrentTabSession({                          │     │   │
│  │     │   sessionId,                                            │     │   │
│  │     │   current_slide: 'uppdragsval',                         │     │   │
│  │     │ });                                                     │     │   │
│  │     │                                                         │     │   │
│  │     │ await api.logPersonal('Startar ny onboarding-session'); │     │   │
│  │     │ setAppState(READY) ─────────────────────────────────►   │     │   │
│  │     └─────────────────────────────────────────────────────────┘     │   │
│  │   }                                                                 │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ SAMMANFATTNING UTGÅNGAR:                                                    │
│                                                                             │
│   1. VERIFYING_PAYMENT  - Om på /payment-success + har pending              │
│   2. SHOWING_RESUME     - Om pending onboardings finns (visa modal)         │
│   3. READY              - Om inga pending (starta ny session)               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Nyckelkoncept

| Koncept | Förklaring |
|---------|------------|
| `fetchPendingOnboardings()` | API-anrop som returnerar array av påbörjade onboardings |
| `isPaymentSuccessPage` | Detekterar om vi kommer tillbaka från Stripe |
| `pendingOnboardings` | Array som måste sättas INNAN state-övergång |
| `current_slide: 'uppdragsval'` | Ny session startar alltid på första sliden |

---

## 3️⃣ handleShowingResumeState.js

> ⏳ Ännu ej analyserad

---

## 4️⃣ handleResumingState.js

> ⏳ Ännu ej analyserad

---

## 5️⃣ handleRestoringSessionState.js

> ⏳ Ännu ej analyserad

---

## 6️⃣ handleReadyState.js

> ⏳ Ännu ej analyserad

---

## 7️⃣ handleProcessingNextState.js

> ⏳ Ännu ej analyserad

---

## 8️⃣ handleProcessingBackState.js

> ⏳ Ännu ej analyserad

---

## 9️⃣ handleInitiatingPaymentState.js

> ⏳ Ännu ej analyserad

---

## 🔟 handleVerifyingPaymentState.js

> ⏳ Ännu ej analyserad

---

## 1️⃣1️⃣ handleErrorState.js

> ⏳ Ännu ej analyserad

---

## 📋 Changelog

| Datum | Händelse |
|-------|----------|
| 2025-12-11 | Skapade dokument med INITIALIZING och CHECKING_PENDING |
| | Bröt ut inline CHECKING_PENDING-kod till handleCheckingPendingState.js |
| | Tog bort orphaned handleCheckingPendingState_orphaned.js |

---

## 🍽️ Smaklig måltid!

Vi fortsätter med handleShowingResumeState.js när du är tillbaka.
