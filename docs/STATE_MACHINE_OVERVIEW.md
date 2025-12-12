# State Machine Overview

> 📚 Pedagogisk dokumentation av AuthenticatedApp state machine
> 
> Skapad: 2025-12-11
> Uppdaterad: 2025-12-12

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
│   ├── handleInitializingState.js      ✅ Extern handler                    │
│   ├── handleCheckingPendingState.js   ✅ Extern handler                    │
│   ├── handleResumingState.js          ✅ Extern handler                    │
│   ├── handleRestoringSessionState.js  ✅ Extern handler                    │
│   ├── handleInitiatingPaymentState.js ✅ Extern handler                    │
│   ├── handleVerifyingPaymentState.js  ✅ Extern handler                    │
│   └── index.js                   ← Exports                                 │
│                                                                             │
│   States utan handler-fil (hanteras inline eller via callbacks):           │
│   ├── UNINITIALIZED     → Inline: setAppState(INITIALIZING)                │
│   ├── SHOWING_RESUME    → Inline: console.log + JSX-callback (modal)       │
│   ├── READY             → Inline: console.log (väntar på användaraction)   │
│   ├── PROCESSING_NEXT   → Inline: switch(currentSlideKey) med logik        │
│   ├── PROCESSING_BACK   → Inline: navigera till föregående slide           │
│   └── ERROR             → Inline: console.error (visa felmeddelande)       │
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
              │ (första besök)   │        │ (F5/sidomladdning│
              └────────┬─────────┘        │  med tabSession) │
                       │                  └────────┬─────────┘
         ┌─────────────┼─────────────┐             │
         │             │             │             │
         ▼             ▼             ▼             │
┌─────────────┐ ┌─────────────┐ ┌─────────┐       │
│ VERIFYING_  │ │ SHOWING_    │ │  READY  │◄──────┘
│ PAYMENT     │ │ RESUME      │ │ (inga   │
│ (från       │ │ (pending    │ │ pending)│
│ Stripe)     │ │ hittades)   │ └────┬────┘
└──────┬──────┘ └──────┬──────┘      │
       │               │             │
       │        ┌──────┴──────┐      │
       │        │             │      │
       │        ▼             │      │
       │   ┌─────────┐        │      │
       │   │RESUMING │        │      │
       │   │(väljer  │        │      │
       │   │fortsätt)│        │      │
       │   └────┬────┘        │      │
       │        │             │      │
       │        │  ┌──────────┘      │
       │        │  │ (väljer         │
       │        │  │  starta ny)     │
       │        ▼  ▼                 │
       │   ┌─────────────┐           │
       └──►│    READY    │◄──────────┘
           │             │
           │ isDraftMode │◄────────┐
           │ true/false  │         │
           └──────┬──────┘         │
                  │                │
                  │ (Next-klick)   │
                  ▼                │
           ┌─────────────────┐     │
           │ PROCESSING_NEXT │     │
           │                 │     │
           └────────┬────────┘     │
                    │              │
                    └──────────────┘
                    (tillbaka till READY)
```

### Förklaring av flödet:

| Scenario | Flöde |
|----------|-------|
| **Ny användare** (inga pending) | INITIALIZING → CHECKING_PENDING → READY |
| **Återvändande användare** (har pending) | INITIALIZING → CHECKING_PENDING → SHOWING_RESUME → (väljer) |
| **Sidomladdning (F5)** med tabSession | INITIALIZING → RESTORING_SESSION → READY |
| **Återvänder från Stripe** | INITIALIZING → CHECKING_PENDING → VERIFYING_PAYMENT → READY |
| **I SHOWING_RESUME väljer "Fortsätt"** | SHOWING_RESUME → RESUMING → READY |
| **I SHOWING_RESUME väljer "Starta ny"** | SHOWING_RESUME → READY (direkt) |

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

## 3️⃣ SHOWING_RESUME (Inline + JSX-callback)

**STATE:** `SHOWING_RESUME`

**NÄR:** Efter CHECKING_PENDING (pending onboardings hittades, EJ payment-success)

**UPPGIFT:** Visa OnboardingResumeDialog modal och vänta på användarval

### ⚠️ OBS: Ingen handler-fil!

Detta state hanteras **inline** i switch-case + via **JSX-callback**:

```javascript
// I processState() switch-case:
case AppState.SHOWING_RESUME:
  console.log('[SHOWING_RESUME] 🎭 Waiting for user choice...');
  break;  // GÖR INGET - väntar på callback från modal

// I JSX:
{appState === AppState.SHOWING_RESUME && (
  <OnboardingResumeDialog
    pendingOnboardings={pendingOnboardings}
    onResume={handleResumeChoice}   // → RESUMING
    onDelete={handleDeleteOnboarding}
    onStartNew={handleStartNew}     // → READY
  />
)}
```

### Flödesschema

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        SHOWING_RESUME (Inline)                              │
│                                                                             │
│  STATE: SHOWING_RESUME                                                      │
│  NÄR: Efter CHECKING_PENDING (pending finns, EJ payment-success page)       │
│                                                                             │
│  ⚠️  INGEN HANDLER-FIL - Hanteras via inline switch-case + JSX-callback     │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ ENTRY: Handler gör INGENTING!                                       │   │
│  │                                                                     │   │
│  │   console.log('[SHOWING_RESUME] 🎭 State entered!');                │   │
│  │   console.log('pendingOnboardings:', pendingOnboardings);           │   │
│  │                                                                     │   │
│  │   // Ingen logik här - modal renderas via JSX                       │   │
│  │   // baserat på appState === SHOWING_RESUME                         │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ JSX RENDERING (i AuthenticatedApp.jsx):                             │   │
│  │                                                                     │   │
│  │   {appState === AppState.SHOWING_RESUME && (                        │   │
│  │     <OnboardingResumeDialog                                         │   │
│  │       pendingOnboardings={pendingOnboardings}                       │   │
│  │       onResume={handleResumeChoice}      ← Callback 1               │   │
│  │       onDelete={handleDeleteOnboarding}  ← Callback 2               │   │
│  │       onStartNew={handleStartNew}        ← Callback 3               │   │
│  │     />                                                              │   │
│  │   )}                                                                │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ CALLBACK 1: onResume (handleResumeChoice)                           │   │
│  │                                                                     │   │
│  │   function handleResumeChoice(company_id, case_id, company_name) {  │   │
│  │     setActiveCase({ company_id, case_id, company_name });           │   │
│  │     setAppState(AppState.RESUMING);  ─────────────────────────────► │   │
│  │   }                                    UTGÅNG 1: RESUMING           │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ CALLBACK 2: onDelete (handleDeleteOnboarding)                       │   │
│  │                                                                     │   │
│  │   async function handleDeleteOnboarding(company_id, case_id) {      │   │
│  │     await api.delete(`/onboarding/${company_id}?case_id=${case_id}`)│   │
│  │                                                                     │   │
│  │     setPendingOnboardings(prev =>                                   │   │
│  │       prev.filter(o => o.case_id !== case_id)                       │   │
│  │     );                                                              │   │
│  │                                                                     │   │
│  │     if (pendingOnboardings.length === 1) {                          │   │
│  │       handleStartNew();  // Enda kvar - gå till READY               │   │
│  │     }                                                               │   │
│  │     // Annars: Modal uppdateras med kortare lista (stannar i state) │   │
│  │   }                                                                 │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ CALLBACK 3: onStartNew (handleStartNew)                             │   │
│  │                                                                     │   │
│  │   function handleStartNew() {                                       │   │
│  │     setActiveCase(null);                                            │   │
│  │     setFormData({});                                                │   │
│  │     setPendingOnboardings([]);                                      │   │
│  │     setAppState(AppState.READY);  ────────────────────────────────► │   │
│  │   }                                 UTGÅNG 2: READY                 │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ SAMMANFATTNING UTGÅNGAR:                                                    │
│                                                                             │
│   1. RESUMING  - Användaren klickade "Fortsätt" på en onboarding            │
│   2. READY     - Användaren klickade "Starta ny" (eller raderade alla)      │
│                                                                             │
│ OBS: State kan "stanna kvar" om användaren raderar - listan uppdateras      │
│      via setPendingOnboardings() och modal re-renderas med ny data.         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### OnboardingResumeDialog Modal

Modal-komponenten (`src/components/Modals/OnboardingResumeDialog.jsx`) är en **slav-komponent** 
enligt tic-tac-toe-mönstret:

| Prop | Typ | Beskrivning |
|------|-----|-------------|
| `pendingOnboardings` | Array | Lista av pågående onboardings |
| `onResume` | Function | Callback: (company_id, case_id, company_name) → RESUMING |
| `onDelete` | Function | Callback: (company_id, case_id) → API delete + uppdatera lista |
| `onStartNew` | Function | Callback: () → READY |

**Varje onboarding-objekt innehåller:**
- `company_id`, `case_id`, `company_name`, `orgnr_formatted`
- `last_modified` (ISO timestamp)
- `current_step` (t.ex. "riskfragor")
- `progress` (0-100)
- `is_locked` (true = point of no return passerat)
- `is_completed` (true = avtal signerat, kan ej raderas)

---

## 4️⃣ handleResumingState.js

**STATE:** `RESUMING`

**NÄR:** Användaren klickade "Fortsätt" i OnboardingResumeDialog

**UPPGIFT:** Hämta data från server, hydrera localStorage, navigera till rätt slide

### ⚠️ VIKTIGT: Passeras ALDRIG efter Stripe-betalning!

```
Efter Stripe: /payment-success → CHECKING_PENDING → VERIFYING_PAYMENT → READY
                                 (detekterar URL)

RESUMING nås ENDAST från: SHOWING_RESUME → klick "Fortsätt" → RESUMING
```

### Flödesschema

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          handleResumingState.js                             │
│                                                                             │
│  STATE: RESUMING                                                            │
│  NÄR: Från SHOWING_RESUME (användaren klickade "Fortsätt" på en onboarding) │
│                                                                             │
│  FÖRUTSÄTTNING: activeCase redan satt av handleResumeChoice()               │
│    activeCase = { company_id, case_id, company_name }                       │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ STEG 1: Guard mot dubbla anrop (StrictMode)                         │   │
│  │                                                                     │   │
│  │   if (resumingInProgress) {                                         │   │
│  │     console.log('⚠️ Already resuming, skipping');                   │   │
│  │     return;                                                         │   │
│  │   }                                                                 │   │
│  │   resumingInProgress = true;                                        │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                  │                                                         │
│                  ▼                                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ STEG 2: Rensa temp_case_id                                          │   │
│  │                                                                     │   │
│  │   if (storage.getTempCaseId()) {                                    │   │
│  │     storage.clearTempCaseId();  ← Vi har nu permanent case          │   │
│  │   }                                                                 │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                  │                                                         │
│                  ▼                                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ STEG 3: Hämta metadata från server                                  │   │
│  │                                                                     │   │
│  │   const metadata = await api.fetchMetadata(                         │   │
│  │     activeCase.company_id,                                          │   │
│  │     activeCase.case_id                                              │   │
│  │   );                                                                │   │
│  │                                                                     │   │
│  │   // metadata = {                                                   │   │
│  │   //   version: 5,                                                  │   │
│  │   //   last_modified: "2025-12-11T14:30:00Z",                       │   │
│  │   //   modified_by: "user@example.com",                             │   │
│  │   //   current_slide: "verksamhet",                                 │   │
│  │   //   completedSlides: ["uppdragsval", "riskfragor-1"],            │   │
│  │   //   pages: { "uppdragsval": {...}, "riskfragor-1": {...} },      │   │
│  │   //   subscription: { payment_confirmed_at: "..." }                │   │
│  │   // }                                                              │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                  │                                                          │
│                  ▼                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ STEG 4: Selektiv rensning av localStorage                           │   │
│  │                                                                     │   │
│  │   const prefix = `onboarding::${company_id}::${case_id}::${userId}::`;│  │
│  │                                                                     │   │
│  │   Object.keys(localStorage).forEach(key => {                        │   │
│  │     if (key.startsWith(prefix)) {                                   │   │
│  │       localStorage.removeItem(key);  ← Ta bort gammal lokal data    │   │
│  │     }                                                               │   │
│  │   });                                                               │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                  │                                                         │
│                  ▼                                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ STEG 5: Sätt permanent mode                                         │   │
│  │                                                                     │   │
│  │   setIsDraftMode(false);                                            │   │
│  │   storage.setIsDraftMode(false);                                    │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                  │                                                         │
│                  ▼                                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ STEG 6: Spara pages till PERMANENTA localStorage-nycklar            │   │
│  │                                                                     │   │
│  │   Object.entries(metadata.pages).forEach(([slideKey, data]) => {    │   │
│  │     const key = StorageKeyBuilder.buildPermanentKey(                │   │
│  │       company_id, case_id, userId, slideKey                         │   │
│  │     );                                                              │   │
│  │     localStorage.setItem(key, JSON.stringify(data));                │   │
│  │   });                                                               │   │
│  │                                                                     │   │
│  │   // Nyckelformat: onboarding::556677-8899::case_123::user_1::verksamhet│ │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                  │                                                         │
│                  ▼                                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ STEG 7: Uppdatera React state                                       │   │
│  │                                                                     │   │
│  │   setFormData(metadata.pages);                                      │   │
│  │   setCompletedSlides(metadata.completedSlides || []);               │   │
│  │   setActiveCase(activeCase);                                        │   │
│  │                                                                     │   │
│  │   // Spara server version för conflict detection                    │   │
│  │   localStorage.setItem(`case_${company_id}_${case_id}_version`,     │   │
│  │     JSON.stringify({ version: metadata.version, ... })              │   │
│  │   );                                                                │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                  │                                                         │
│                  ▼                                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ STEG 8: Kolla betalningsstatus                                      │   │
│  │                                                                     │   │
│  │   const paymentConfirmed = !!metadata.subscription?.payment_confirmed_at;│
│  │                                                                     │   │
│  │   if (paymentConfirmed) {                                           │   │
│  │     setIsPaymentConfirmed(true);  ← Låser upp företagsdata-slides   │   │
│  │   }                                                                 │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                  │                                                          │
│                  ▼                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ STEG 9: Navigera till rätt slide                                    │   │
│  │                                                                     │   │
│  │   const targetSlide = metadata.current_slide || 'uppdragsval';      │   │
│  │   setCurrentSlideKey(targetSlide);                                  │   │
│  │                                                                     │   │
│  │   const slide = SLIDE_ORDER.find(s => s.key === targetSlide);       │   │
│  │   navigate(slide.path, { replace: true });                          │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                  │                                                          │
│                  ▼                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ STEG 10: Sätt tab session                                           │   │
│  │                                                                     │   │
│  │   storage.setCurrentTabSession({                                    │   │
│  │     session_id: `onboarding::${company_id}::${case_id}::${userId}`, │   │
│  │     current_slide: targetSlide,                                     │   │
│  │   });                                                               │   │
│  │                                                                     │   │
│  │   resumingInProgress = false;                                       │   │
│  │   setAppState(AppState.READY);  ───────────────────────────────────►│   │
│  │                                   UTGÅNG: READY                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ SAMMANFATTNING:                                                             │
│                                                                             │
│   INGÅNG:  Endast från SHOWING_RESUME (klick "Fortsätt")                    │
│   UTGÅNG:  READY (navigerad till metadata.current_slide)                    │
│                                                                             │
│   DEAD CODE: comingFromPaymentSuccess-logiken körs aldrig i normalt flöde   │
│              Behålls som "defense in depth" - loggar console.error om den   │
│              körs (indikerar bug i CHECKING_PENDING).                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Nyckelkoncept

| Koncept | Förklaring |
|---------|------------|
| `resumingInProgress` | Modul-variabel som skyddar mot dubbelkörning (StrictMode) |
| `StorageKeyBuilder` | Utility för att bygga permanenta localStorage-nycklar |
| `metadata.pages` | Objekt med all slide-data från servern |
| `metadata.current_slide` | Vilken slide användaren var på senast |
| `payment_confirmed_at` | Om satt → betalning bekräftad → lås upp företagsdata |

### 🧟 Dead Code: `comingFromPaymentSuccess` i handleResumingState.js

> **Bakgrund (2025-12-12):** Under utvecklingen uppstod förvirring kring betalningsflödet.
> Vi trodde först att RESUMING kunde passeras efter Stripe-betalning.

**Faktiskt flöde efter Stripe-betalning:**
```
Stripe redirect → /payment-success?session_id=xxx
       ↓
UNINITIALIZED → INITIALIZING → CHECKING_PENDING → VERIFYING_PAYMENT → READY
                               ↑
                               └── Detekterar payment-success URL FÖRST!
```

**Varför RESUMING aldrig passeras:**
1. `handleCheckingPendingState.js` kollar `isPaymentSuccessPage` INNAN den kollar pending onboardings
2. Om `isPaymentSuccessPage === true` → går direkt till `VERIFYING_PAYMENT`
3. `SHOWING_RESUME` modal visas ALDRIG på `/payment-success` sidan
4. Därför kan användaren aldrig klicka "Fortsätt" → `RESUMING` nås aldrig

**Koden som aldrig körs (rad ~112 och ~238 i handleResumingState.js):**
```javascript
// 🧟 DEAD CODE - borde aldrig vara true!
const comingFromPaymentSuccess = window.location.pathname === '/payment-success' || 
    window.location.search.includes('session_id');

if (comingFromPaymentSuccess) {
  console.error('[RESUMING] 🚨 BUG: Reached RESUMING from payment-success!');
  // ... fallback-logik som aldrig körs ...
}
```

**Varför vi behåller koden:**
- "Defense in depth" - om det finns en bug i CHECKING_PENDING fångar denna kod det
- `console.error` hjälper oss att upptäcka buggen snabbt
- Koden gör ingen skada - den bara loggar och hanterar edge case

**Om loggen `[RESUMING] 🚨 BUG:` dyker upp i produktion:**
1. Undersök varför CHECKING_PENDING inte fångade payment-success URL
2. Kolla om `isPaymentSuccessPage`-logiken i handleCheckingPendingState.js är trasig
3. Verifiera att URL:en faktiskt matchar `/payment-success` eller har `session_id` param

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

**STATE:** `VERIFYING_PAYMENT`

**NÄR:** Användaren återvänder från Stripe Checkout till `/payment-success`

**UPPGIFT:** Polla backend tills webhook har bekräftat betalningen

### Var kommer `/payment-success` URL:en ifrån?

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     STRIPE CHECKOUT REDIRECT URL                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. Frontend anropar backend:                                               │
│     POST /api/stripe/create-checkout-session                                │
│     Body: { company_id, case_id, ... }                                      │
│                                                                             │
│  2. Backend skapar Stripe Checkout Session:                                 │
│     stripe.checkout.sessions.create({                                       │
│       success_url: "https://app.example.com/payment-success?session_id={CHECKOUT_SESSION_ID}",
│       cancel_url: "https://app.example.com/riskfragor",                     │
│       ...                                                                   │
│     })                                                                      │
│                                                                             │
│  3. Backend returnerar checkout URL till frontend                           │
│                                                                             │
│  4. Frontend gör: window.location.href = checkout.url                       │
│     → Användaren skickas till Stripe Checkout                               │
│                                                                             │
│  5. Efter betalning: Stripe redirectar till success_url                     │
│     → https://app.example.com/payment-success?session_id=cs_test_xxx        │
│                                                                             │
│  6. React-appen startar om (full page load)                                 │
│     → UNINITIALIZED → INITIALIZING → CHECKING_PENDING                       │
│                                                                             │
│  7. CHECKING_PENDING kollar URL:                                            │
│     const isPaymentSuccessPage =                                            │
│       window.location.pathname === '/payment-success' ||                    │
│       window.location.search.includes('session_id');                        │
│     → true! → VERIFYING_PAYMENT                                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Så svaret är:** `success_url` definieras i **backend** när Stripe Checkout Session skapas.

### Flödesschema

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      handleVerifyingPaymentState.js                         │
│                                                                             │
│  STATE: VERIFYING_PAYMENT                                                   │
│  NÄR: Från CHECKING_PENDING (URL = /payment-success)                        │
│                                                                             │
│  FÖRUTSÄTTNING: activeCase redan satt av CHECKING_PENDING                   │
│    activeCase = onboardings[0]  (pending case som väntar på betalning)      │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ GUARD: Måste ha activeCase                                          │   │
│  │                                                                     │   │
│  │   if (!activeCase?.company_id || !activeCase?.case_id) {            │   │
│  │     setError('Saknar case-information');                            │   │
│  │     setAppState(AppState.ERROR);  ─────────────────────────────────►│   │
│  │     return;                         UTGÅNG 1: ERROR                 │   │
│  │   }                                                                 │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                  │                                                          │
│                  ▼                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ STEG 1: Visa "Verifierar..." i PaymentSuccessSlide                  │   │
│  │                                                                     │   │
│  │   setPaymentVerificationStatus('verifying');                        │   │
│  │   setPaymentVerificationMessage('Verifierar betalning...');         │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                  │                                                          │
│                  ▼                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ STEG 2: POLLING LOOP                                                │   │
│  │                                                                     │   │
│  │   const POLL_INTERVAL_MS = 2000;   // 2 sekunder                    │   │
│  │   const MAX_POLL_TIME_MS = 30000;  // Max 30 sekunder               │   │
│  │                                                                     │   │
│  │   while (!confirmed && elapsed < 30s) {                             │   │
│  │     status = await api.getSubscriptionStatus(company_id, case_id);  │   │
│  │                                                                     │   │
│  │     if (status.confirmed) {                                         │   │
│  │       confirmed = true;                                             │   │
│  │       break;                                                        │   │
│  │     }                                                               │   │
│  │                                                                     │   │
│  │     await sleep(2000ms);  // Vänta innan nästa poll                 │   │
│  │   }                                                                 │   │
│  │                                                                     │   │
│  │   // Max 15 polls (30s / 2s)                                        │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                  │                                                          │
│                  ├─── confirmed === true                                    │
│                  │         │                                                │
│                  │         │ setPaymentVerificationStatus('success')        │
│                  │         │ setIsPaymentConfirmed(true)                    │
│                  │         │ api.logPersonal('Payment confirmed')           │
│                  │         ▼                                                │
│                  │      READY (🎉 Betalning bekräftad!)                     │
│                  │                                                          │
│                  └─── timeout (30s utan webhook)                            │
│                            │                                                │
│                            │ setPaymentVerificationStatus('timeout')        │
│                            │ Visar: "Betalningen behandlas..."              │
│                            │ [Försök igen]-knapp                            │
│                            ▼                                                │
│                         READY (⏱️ Timeout - retry tillgänglig)              │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ SAMMANFATTNING:                                                             │
│                                                                             │
│   INGÅNG:  Från CHECKING_PENDING (URL = /payment-success)                   │
│   UTGÅNGAR:                                                                 │
│     → ERROR (saknar activeCase)                                             │
│     → READY (confirmed = true, betalning OK)                                │
│     → READY (timeout, retry-knapp visas)                                    │
│                                                                             │
│   WEBHOOK: Stripe → POST /stripe-webhook → sätter payment_confirmed_at      │
│   POLLING: Frontend → GET /subscription/status → kollar confirmed           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Nyckelkoncept

| Koncept | Förklaring |
|---------|------------|
| `success_url` | Definieras i backend vid `stripe.checkout.sessions.create()` |
| `session_id` | Stripe lägger till detta som query-param vid redirect |
| Polling | Frontend pollar backend, backend pollar INTE Stripe |
| Webhook | Stripe → Backend (asynkront, oftast snabbare än polling) |
| 30 sekunder | Max poll-tid (15 polls à 2 sek) |
| Retry-knapp | `window.location.reload()` → kör CHECKING_PENDING igen |

### 🔧 Lokal utveckling: Stripe CLI Webhook Forwarding

I produktion skickar Stripe webhooks direkt till din server. Men lokalt kan inte Stripe
nå `localhost:8000`. Lösningen är **Stripe CLI** som agerar mellanhand:

```bash
stripe listen --forward-to localhost:8000/api/stripe-webhook
```

**Hur det fungerar:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    STRIPE CLI WEBHOOK TUNNEL                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. DIN MASKIN                          2. STRIPE CLI                       │
│     ┌─────────────┐                        ┌─────────────┐                  │
│     │ stripe      │  ══════════════════►   │ Stripe      │                  │
│     │ listen      │  WebSocket-anslutning  │ Servrar     │                  │
│     │ (process)   │  (långlivad, alltid    │ (molnet)    │                  │
│     └─────────────┘   öppen, utgående)     └─────────────┘                  │
│                                                                             │
│  När du kör `stripe listen`:                                                │
│  • CLI öppnar en WebSocket till Stripe (utgående trafik = inga brandväggs-  │
│    problem)                                                                 │
│  • CLI registrerar sig som "webhook endpoint" hos Stripe                    │
│  • Stripe vet nu: "skicka webhooks till denna WebSocket istället"           │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  3. NÄR BETALNING SKER:                                                     │
│                                                                             │
│     Stripe ───webhook──► WebSocket ──► stripe listen ──► localhost:8000    │
│     (moln)                (tunnel)      (din maskin)      (uvicorn)         │
│                                                                             │
│  • Stripe skickar webhook via WebSocket-tunneln                             │
│  • stripe listen tar emot och gör HTTP POST till localhost:8000             │
│  • Uvicorn får webhoken som om den kom från internet                        │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  VARFÖR DET FUNGERAR:                                                       │
│                                                                             │
│  • Utgående WebSocket = ingen NAT/brandväggsproblem                         │
│  • Stripe CLI autentiserar sig med din Stripe API-nyckel                    │
│  • Webhooks når localhost trots att Stripe inte kan nå din IP               │
│                                                                             │
│  KOMMANDO:                                                                  │
│  stripe listen --forward-to localhost:8000/api/stripe-webhook               │
│                                                                             │
│  OUTPUT visar signing secret som backend måste använda:                     │
│  > Ready! Your webhook signing secret is whsec_xxxxx                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Tre terminaler för lokal betalningstest:**

```bash
# Terminal 1: Stripe CLI (webhook tunnel)
stripe listen --forward-to localhost:8000/api/stripe-webhook

# Terminal 2: Backend
cd tic-tac-toe-server && source venv/bin/activate && uvicorn main:app --reload

# Terminal 3: Frontend
cd tic-tac-toe-frontend && npm run dev
```

---

## 1️⃣1️⃣ ERROR (Inline + JSX + Props Callback)

**STATE:** `ERROR`

**NÄR:** Ett fel uppstod någonstans i state machine

**UPPGIFT:** Visa felmeddelande och vänta på att användaren stänger det

### ⚠️ OBS: Ingen handler-fil!

ERROR hanteras med samma mönster som SHOWING_RESUME:
- **Inline switch-case** → `console.error()` + break
- **JSX rendering** → Error toast i nedre högra hörnet
- **Props callback** → `handleClearError` (i `props/handleClearError.js`)

### Flödesschema

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ERROR (Inline + Props)                            │
│                                                                             │
│  STATE: ERROR                                                               │
│  NÄR: setAppState(AppState.ERROR) anropas efter ett fel                     │
│                                                                             │
│  ⚠️  INGEN HANDLER-FIL - Hanteras via inline + JSX + props callback         │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ INLINE SWITCH-CASE (i processState):                                │   │
│  │                                                                     │   │
│  │   case AppState.ERROR:                                              │   │
│  │     console.error('[ERROR] ❌ App is in ERROR state');              │   │
│  │     console.error('[ERROR] Error message:', error);                 │   │
│  │     break;  // GÖR INGET MER - toast renderas via JSX               │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ JSX RENDERING (i AuthenticatedApp.jsx):                             │   │
│  │                                                                     │   │
│  │   {error && (                                                       │   │
│  │     <div className="fixed bottom-4 right-4 bg-red-100...">         │   │
│  │       <span>{error}</span>                                          │   │
│  │       <button onClick={handleClearError}>✕</button>                 │   │
│  │     </div>                  ↑                                       │   │
│  │   )}                        └── Props callback                      │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ PROPS CALLBACK: handleClearError (props/handleClearError.js)        │   │
│  │                                                                     │   │
│  │   export const createHandleClearError = ({                          │   │
│  │     setError, appState, AppState, setAppState                       │   │
│  │   }) => {                                                           │   │
│  │     return () => {                                                  │   │
│  │       setError(null);                     ← Rensa felmeddelande     │   │
│  │       if (appState === AppState.ERROR) {                            │   │
│  │         setAppState(AppState.READY);  ──────────────────────────►   │   │
│  │       }                                   UTGÅNG: READY             │   │
│  │     };                                                              │   │
│  │   };                                                                │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ SAMMANFATTNING:                                                             │
│                                                                             │
│   INGÅNG:  Från valfritt state där fel uppstår (via setAppState(ERROR))     │
│   UTGÅNG:  READY (via handleClearError callback)                            │
│                                                                             │
│   MÖNSTER: Samma som SHOWING_RESUME - inline + JSX + props callback         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Jämförelse: States utan handler-fil

| State | Inline | JSX | Props Callback |
|-------|--------|-----|----------------|
| SHOWING_RESUME | `console.log` | `<OnboardingResumeDialog>` | handleResumeChoice, handleStartNew, handleDeleteOnboarding |
| ERROR | `console.error` | `{error && <div>...}` | handleClearError |
| READY | `console.log` | - | - |
| PROCESSING_BACK | Full logik | - | - |

---

## 📋 Changelog

| Datum | Händelse |
|-------|----------|
| 2025-12-11 | Skapade dokument med INITIALIZING och CHECKING_PENDING |
| | Bröt ut inline CHECKING_PENDING-kod till handleCheckingPendingState.js |
| | Tog bort orphaned handleCheckingPendingState_orphaned.js |
| 2025-12-12 | Lade till SHOWING_RESUME och RESUMING flödesscheman |
| | Dokumenterade OnboardingResumeDialog modal och callbacks |
| | Förtydligade att RESUMING aldrig passeras efter Stripe-betalning |
| | 🧹 Städning: Tog bort 5 oanvända handler-filer |
| | - handleShowingResumeState.js (inline + callback) |
| | - handleReadyState.js (inline) |
| | - handleProcessingNextState.js (inline) |
| | - handleProcessingBackState.js (inline) |
| | - handleErrorState.js (inline) |
| | Uppdaterade arkitekturdiagram med inline vs extern handler |
| | Lade till ERROR state dokumentation (inline + props callback mönster) |

---

## 🍽️ Smaklig måltid!
