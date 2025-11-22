# LocalStorage Implementation - Onboarding Wizard

## Översikt

Detta dokument beskriver implementationen av localStorage för att bevara formulärdata i onboarding-guiden mellan navigeringar och sessioner.

**Datum skapad:** 2025-10-31  
**Senast uppdaterad:** 2025-11-22 (Arkitektonisk omdesign)  
**Status:** ✅ Implementerad (Steg 1-3 färdiga, Steg 4 EDD återstår)

---

## 🔄 ARKITEKTONISK UPPDATERING (2025-11-22)

### Backend som Source of Truth

**Nytt koncept (från 2025-11-22):**
- ✅ Backend lagrar ALL persistent onboarding-data i `data/{user_id}/{orgnr}/`
- ✅ localStorage används som **cache/draft buffer** (INTE source of truth)
- ✅ Vid login: Frontend anropar `GET /api/onboarding/list` → Resume-dialog om företag finns
- ✅ Vid resume: Frontend anropar `GET /api/onboarding/resume/{orgnr}` → Populerar localStorage från backend
- ✅ Multi-device support: Användare kan börja på mobil, fortsätta på desktop

**localStorage's nya roll:**
1. **Performance cache:** Snabbare laddning (ingen network delay vid navigation mellan slides)
2. **Draft buffer:** Temporära ändringar innan "Nästa"-knapp klickas (POST till backend)
3. **User-scoped keys:** Format `onboarding-{userId}-{key}` för att isolera användare
4. **Session tokens:** JWT `accessToken` och `refreshToken` för authentication

**Dataflöde (ny arkitektur):**
```
1. USER LOGIN
   └─→ GET /api/onboarding/list → Backend: ["Övningsbolag1 AB", "Övningsbolag2 AB"]

2. USER KLICKAR "Fortsätt med Övningsbolag1 AB"
   └─→ GET /api/onboarding/resume/5569038671
       Backend returnerar: { uppdrag, riskfragor_steg1, riskfragor_extended }
   
3. FRONTEND POPULERAR localStorage (CACHE)
   └─→ localStorage.setItem('onboarding-user@example.com-orgnr', '556903-8671')
   └─→ localStorage.setItem('onboarding-user@example.com-companyName', 'Övningsbolag1 AB')
   └─→ localStorage.setItem('onboarding-wizard-steg1', JSON.stringify(riskfragor_steg1))
       ✅ ANVÄNDARE KAN NU NAVIGERA MELLAN SLIDES (data i localStorage)

4. USER KLICKAR SIDEBAR: "Riskfrågor Steg 3"
   └─→ React läser från localStorage (INTE backend)
   └─→ Formulär förifylls från cache
       ⚡ SNABBT (ingen network delay)

5. USER ÄNDRAR DATA
   └─→ onChange: Uppdaterar localStorage (draft)
   └─→ Klickar "Nästa": POST till backend → Backend sparar permanent → Draft rensas

6. USER LOGGAR UT
   └─→ localStorage: tokens behålls, draft kan finnas kvar
   └─→ Backend: All företagsdata finns kvar i data/{user_id}/{orgnr}/
```

Se **[CHANGELOG_2025-11-22.md](../../../tic-tac-toe-server/docs/CHANGELOG_2025-11-22.md)** för fullständig dokumentation av Session Management.

---

## Problembeskrivning

**Ursprungligt problem:**
- Formulärdata försvann när användare navigerade mellan wizard-steg
- Ingen persistens vid siduppdatering eller om användare stängde webbläsaren
- Dålig användarupplevelse - användare måste fylla i allt från början vid varje återbesök

**Krav:**
- Automatisk sparning av formulärdata vid varje ändring
- Automatisk laddning av data vid komponentens mount
- Data ska bevaras mellan sessioner (över webbläsarstängning)
- Varje wizard-steg ska ha sin egen isolerade localStorage-key
- Möjlighet att rensa all wizard-data vid behov (t.ex. logout)

---

## Arkitektur

### Custom Hook: `useLocalStorage`

**Fil:** `src/hooks/useLocalStorage.js`

```javascript
import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  // State initialiseras med värde från localStorage eller initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  // Uppdatera localStorage när state ändras
  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  };

  // Synka mellan tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue) {
        setStoredValue(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}

// Utility för att rensa all wizard-data
export function clearWizardData() {
  localStorage.removeItem('onboarding-wizard-steg1');
  localStorage.removeItem('onboarding-wizard-steg2');
  localStorage.removeItem('onboarding-wizard-steg3');
  localStorage.removeItem('onboarding-wizard-steg4');
}
```

### Funktionalitet

1. **Auto-load:** Data laddas automatiskt från localStorage vid komponentens mount
2. **Auto-save:** Data sparas automatiskt vid varje state-uppdatering
3. **Cross-tab sync:** Ändringar i en flik synkas till andra öppna flikar
4. **Error handling:** Graceful fallback till initialValue vid localStorage-fel
5. **JSON serialization:** Automatisk JSON.stringify/parse för objekt

---

## LocalStorage Keys (Uppdaterad 2025-11-22)

### Session Management (Nya keys)

| Key | Syfte | Livslängd | User-scoped? |
|-----|-------|-----------|--------------|
| `accessToken` | JWT authentication | Tills logout | Nej (global) |
| `refreshToken` | Token refresh | Tills logout | Nej (global) |
| `onboarding-{userId}-orgnr` | Nuvarande företags orgnr | Tills "Avsluta (rensar)" | ✅ Ja |
| `onboarding-{userId}-companyName` | Nuvarande företagsnamn | Tills "Avsluta (rensar)" | ✅ Ja |
| `onboarding-{userId}-uppdragsval` | Cachad uppdragsval-data | Tills ny session | ✅ Ja |
| `onboarding-{userId}-draft-steg2` | Draft-ändringar i Steg 2 | Tills "Spara" klickas | ✅ Ja |

**User-scoped keys format:** `onboarding-{userId}-{key}`
- `userId` extraheras från JWT token payload (decoded från accessToken)
- Isolerar användare: test1@example.com och test2@example.com ser inte varandras data
- Supports konsult-scenario: Jobba med flera företag samtidigt

### Wizard Data (Befintliga keys)

Varje wizard-steg har sin egen unika key (oförändrad från tidigare):

| Steg | Key | Status |
|------|-----|--------|
| Steg 1 - Grundläggande info | `onboarding-wizard-steg1` | ✅ Implementerad |
| Steg 2 - Geografisk risk | `onboarding-wizard-steg2` | ✅ Implementerad |
| Steg 3 - Betalningsflöden | `onboarding-wizard-steg3` | ✅ Implementerad |
| Steg 4 - EDD (Enhanced Due Diligence) | `onboarding-wizard-steg4` | ⏳ Planerad |

**OBS:** Dessa keys är EJ user-scoped i nuvarande implementation (kan uppdateras i framtiden).

---

## Implementation per Steg

### Steg 1: Grundläggande Information
**Fil:** `src/components/Slides/RiskFragorSlide.jsx`

```javascript
import { useLocalStorage } from '../../hooks/useLocalStorage';

export default function RiskFragorSlide({ onNext }) {
  const [formData, setFormData] = useLocalStorage('onboarding-wizard-steg1', {
    foretag: '',
    orgnummer: '',
    vd: '',
    vdPersonnummer: '',
    verkligHuvudman: '',
    verkligHuvudmanPersonnummer: '',
    pep: '',
    pepRelation: '',
  });
  
  // Använd formData och setFormData som vanlig useState
  // ...
}
```

**Dataobjekt:**
- `foretag`: Företagsnamn (autocomplete från Bolagsverket)
- `orgnummer`: Organisationsnummer
- `vd`: VD:s namn
- `vdPersonnummer`: VD:s personnummer
- `verkligHuvudman`: Verklig huvudman
- `verkligHuvudmanPersonnummer`: Personnummer verklig huvudman
- `pep`: Politiskt exponerad person (ja/nej)
- `pepRelation`: Befattning/relation om PEP

---

### Steg 2: Geografisk Risk & Affärsrelationer
**Fil:** `src/components/Slides/RiskFragorSteg2Slide.jsx`

```javascript
const [formData, setFormData] = useLocalStorage('onboarding-wizard-steg2', {
  blockA_question1: '',
  blockA_question2: '',
  blockA_question3: '',
  blockB_question4: '',
  blockC_question5: '',
  blockC_question6: '',
});
```

**Struktur:**
- **BLOCK A:** Geografisk exponering
  - `blockA_question1`: Utländska kunder (ja/nej/vet-ej)
  - `blockA_question2`: Omsättningsandel utland (<10%, 10-30%, >30%)
  - `blockA_question3`: Typ av samarbete (dropdown)
- **BLOCK B:** Leverantörer
  - `blockB_question4`: Leverantörer utomlands (ja/nej/vet-ej)
- **BLOCK C:** Kunder & bankkonton
  - `blockC_question5`: Kunder (endast-sverige/blandad/huvudsakligen-utland)
  - `blockC_question6`: Utländska bankkonton (ja/nej)

**Info buttons:**
- Alla 6 frågor har info-knappar (absolute top-4 right-4)
- Expandable inline med `getLegalTextsForQuestion('steg2', 'blockX_questionY')`

---

### Steg 3: Betalningsflöden & Transaktionsmönster
**Fil:** `src/components/Slides/RiskFragorSteg3Slide.jsx`

```javascript
const [formData, setFormData] = useLocalStorage('onboarding-wizard-steg3', {
  betalmetoder: {
    bankoverföring: false,
    kortbetalning: false,
    faktura: false,
    kontanter: false,
    kryptovaluta: false,
  },
  kontanterAndel: '',
  kontanthanteringstillstand: '',
  storaTransaktioner: '',
  tredjepartsbetalningar: '',
  utlandskaOverforingar: '',
  utlandskaLander: '',
});
```

**Struktur:**
- **Question 1:** Betalningsmetoder (checkboxes för multiple selection)
- **Question 2:** Kontanterandel (conditional - visas endast om kontanter vald)
  - Dropdown: <5%, 5-20%, 20-50%, >50%
  - Varning visas om ≥20%
- **Question 3:** Stora transaktioner >150k kr (ja/ibland/nej)
- **Question 4:** Tredjepartsbetalningar (ja/nej)
- **Question 5:** Utländska överföringar (ja-regelbundet/ja-ibland/nej)
  - Text input för länder (conditional)

**Riskbedömning:**
- 🔴 Hög risk: Kontanter, kryptovaluta, tredjepartsbetalningar
- 🟡 Medel risk: Kontanter 20-50%
- ⚠️ Automatisk flaggning vid högrisk-alternativ

**Info buttons:**
- Alla 5 frågor har info-knappar (absolute top-4 right-4)
- Expandable inline med `getLegalTextsForQuestion('steg3', 'question1-5')`

---

### Steg 4: Enhanced Due Diligence (EDD)
**Fil:** `src/components/Slides/RiskFragorSteg4Slide.jsx`

**Status:** ⏳ Planerad (ännu ej implementerad)

**Planerad struktur:**
```javascript
const [formData, setFormData] = useLocalStorage('onboarding-wizard-steg4', {
  affarsforbindelse: '',
  startkapital: '',
  dokumentation: '',
  transaktionsmönster: '',
  verkligaHuvudman: '',
  storaInbetalningar: '',
});
```

**6 EDD-frågor (från Onboarding_app_ny.tex rad 2016-2108):**
1. Affärsförbindelsens syfte (textarea)
2. Startkapital och finansiering (textarea)
3. Dokumentation av affärsrelationer (textarea)
4. Ovanliga transaktionsmönster (textarea)
5. Verkliga huvudmän fördjupad (textarea)
6. Stora inbetalningar (textarea)

**Conditional rendering:**
- Visas endast om `requiresEDD: true` från backend
- Triggers: Högriskland, >30% utlandsomsättning, kontanter >20%, krypto, tredjepartsbetalningar, PEP

---

## UI Pattern: Info Buttons

**Konsekvent pattern för alla frågor (Steg 2-3):**

```jsx
<div className="p-4 bg-gray-50 rounded-lg border border-gray-200 relative">
  {/* Info button - absolute positioned */}
  <button
    onClick={() => toggleInfo('questionId')}
    className="absolute top-4 right-4 text-brand-600 hover:text-brand-700 transition-colors"
    aria-label="Visa lagtext"
  >
    <Info className="w-5 h-5" />
  </button>

  {/* Question content */}
  <label className="block text-sm font-medium text-brand-800 mb-2">
    Fråga text här
  </label>
  
  {/* Input fields */}
  {/* ... */}

  {/* Expandable lagtext */}
  {expandedInfo.questionId && (
    <div className="mt-4 p-3 bg-white border border-brand-300 rounded-lg text-xs space-y-2">
      {getLegalTextsForQuestion('stegX', 'questionY').map((lagtext, idx) => (
        <div key={idx}>
          <p className="font-semibold text-brand-900">{lagtext.law}</p>
          <p className="text-gray-700 mt-1">{lagtext.shortText}</p>
          <p className="text-gray-500 italic mt-1">Referens: [{lagtext.id}]</p>
        </div>
      ))}
    </div>
  )}
</div>
```

**Required state:**
```javascript
const [expandedInfo, setExpandedInfo] = useState({});

const toggleInfo = (questionId) => {
  setExpandedInfo(prev => ({
    ...prev,
    [questionId]: !prev[questionId]
  }));
};
```

---

## Data Lifecycle (Uppdaterad 2025-11-22)

### Scenario 1: Ny Onboarding (från scratch)

```
1. USER LOGIN
   └─→ GET /api/onboarding/list → Backend: { companies: [] } (tom)
   └─→ Navigerar till /uppdragsval (ingen resume-dialog)

2. USER FYLLER I UPPDRAGSVAL
   └─→ onChange: localStorage.setItem('onboarding-{userId}-draft-uppdragsval', ...)
   └─→ Klickar "Nästa": POST /api/onboarding/uppdrag
       Backend: Skapar data/{user_id}/{orgnr}/metadata.json
       localStorage: Draft rensas, sparar orgnr + companyName

3. USER NAVIGERAR TILL RISKFRÅGOR STEG 1
   └─→ React läser från localStorage: orgnr + companyName (förifyllt, read-only)
   └─→ User fyller i övriga fält → Draft sparas i localStorage
   └─→ Klickar "Nästa": POST /api/onboarding/risk-assessment
       Backend: Skapar företagsinfo1_static_KYC.json

4. USER NAVIGERAR MELLAN SLIDES
   └─→ Sidebar: Användare hoppar till Steg 3
   └─→ React läser från localStorage (cache) → Snabb laddning
   └─→ Formulär förifyllt från tidigare POST-svar
```

### Scenario 2: Resume Onboarding (återuppta)

```
1. USER LOGIN (har pågående onboarding)
   └─→ GET /api/onboarding/list → Backend: ["Övningsbolag1 AB", "Övningsbolag2 AB"]
   └─→ Resume-dialog visas

2. USER KLICKAR "Fortsätt med Övningsbolag1 AB"
   └─→ GET /api/onboarding/resume/5569038671
       Backend returnerar:
       {
         uppdrag: { companyName, orgnr, services, ... },
         riskfragor_steg1: { foretagsnamn, orgnr, affarsIde, ... },
         riskfragor_extended: { kundkannedom, transaktioner, ... }
       }

3. FRONTEND POPULERAR localStorage (VIKTIGT!)
   └─→ localStorage.setItem('onboarding-{userId}-orgnr', '556903-8671')
   └─→ localStorage.setItem('onboarding-{userId}-companyName', 'Övningsbolag1 AB')
   └─→ localStorage.setItem('onboarding-wizard-steg1', JSON.stringify(riskfragor_steg1))
   └─→ localStorage.setItem('onboarding-wizard-steg2', JSON.stringify(riskfragor_extended.steg2))
   └─→ localStorage.setItem('onboarding-wizard-steg3', JSON.stringify(riskfragor_extended.steg3))
       ✅ ANVÄNDARE KAN NU NAVIGERA MELLAN SLIDES

4. USER NAVIGERAR MELLAN SLIDES
   └─→ React läser från localStorage (EJ backend)
   └─→ Formulär förifylls från cache
   └─→ onChange: Uppdaterar localStorage (draft)
   └─→ Klickar "Nästa": POST/PATCH till backend (permanent save)

5. USER LOGGAR UT
   └─→ localStorage: tokens + draft behålls
   └─→ Backend: All data finns kvar i data/{user_id}/{orgnr}/

6. USER LOGGAR IN IGEN
   └─→ GET /api/onboarding/list → Backend: ["Övningsbolag1 AB"]
   └─→ Resume-dialog visas igen
   └─→ Samma flöde upprepas
```

### Scenario 3: Multi-Device Support

```
1. USER BÖRJAR PÅ MOBIL
   └─→ Login → Fyller i Uppdragsval → POST till backend
   └─→ Backend: Skapar data/{user_id}/5569038671/metadata.json

2. USER LOGGAR IN PÅ DESKTOP
   └─→ GET /api/onboarding/list → Backend: ["Övningsbolag1 AB"]
   └─→ Resume-dialog visas (samma data från backend!)
   └─→ Klickar "Fortsätt" → GET /resume/{orgnr}
   └─→ localStorage på DESKTOP populeras från backend
       ✅ SYNKRONISERAT MELLAN ENHETER
```

**Key Insight:**
- **Backend äger data** → localStorage är endast cache
- **Vid resume:** Backend → localStorage (populering)
- **Vid save:** localStorage (draft) → Backend (permanent)
- **Vid navigation:** localStorage → React (snabb laddning)

---

## Data Rensning (Uppdaterad 2025-11-22)

### Manuell rensning (Användare-initierad)

#### 1. "Avsluta (rensar)"-knapp (Header dropdown)
```javascript
// I Header.jsx profil-dropdown
const handleClearAll = async () => {
  if (confirm('Är du säker? Detta raderar ALLA pågående onboardings.')) {
    const token = localStorage.getItem('accessToken');
    
    // Hämta alla företag
    const response = await fetch('/api/onboarding/list', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const { companies } = await response.json();
    
    // Radera alla från backend
    for (const company of companies) {
      await fetch(`/api/onboarding/delete/${company.orgnr}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    
    // Rensa localStorage
    localStorage.clear();
    
    // Logga ut
    navigate('/login');
  }
};
```

#### 2. "Radera"-knapp i Resume-dialog
```javascript
// I OnboardingResumeDialog.jsx
const handleDelete = async (orgnr) => {
  const token = localStorage.getItem('accessToken');
  await fetch(`/api/onboarding/delete/${orgnr}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  
  // Ta bort från lista (React state)
  setCompanies(prev => prev.filter(c => c.orgnr !== orgnr));
  
  // Rensa localStorage för detta företag (om det är aktivt)
  const currentOrgnr = localStorage.getItem(getStorageKey('orgnr'));
  if (currentOrgnr === orgnr) {
    localStorage.removeItem(getStorageKey('orgnr'));
    localStorage.removeItem(getStorageKey('companyName'));
    localStorage.removeItem('onboarding-wizard-steg1');
    localStorage.removeItem('onboarding-wizard-steg2');
    localStorage.removeItem('onboarding-wizard-steg3');
  }
};
```

### Automatisk rensning (System-initierad)

**Planerade triggers:**
- ✅ Vid framgångsrik slutförande av onboarding (POST till backend lyckades → Backend markerar `completed: true`)
- ✅ Vid "Radera"-knapp i Resume-dialog (se ovan)
- ✅ Vid "Avsluta (rensar)"-knapp (se ovan)
- ⏳ Vid sessionsutgång (JWT token expiration → 60 min TTL)
- ⏳ Backend cleanup job: Radera abandoned onboardings efter 30 dagar

### clearWizardData() helper (uppdaterad)

```javascript
// src/hooks/useLocalStorage.js
export function clearWizardData(userId = null) {
  // Om userId anges, rensa user-scoped keys
  if (userId) {
    const prefix = `onboarding-${userId}-`;
    Object.keys(localStorage)
      .filter(key => key.startsWith(prefix))
      .forEach(key => localStorage.removeItem(key));
  }
  
  // Rensa wizard-steg (global keys)
  localStorage.removeItem('onboarding-wizard-steg1');
  localStorage.removeItem('onboarding-wizard-steg2');
  localStorage.removeItem('onboarding-wizard-steg3');
  localStorage.removeItem('onboarding-wizard-steg4');
}

// Rensa ALL localStorage (används vid logout)
export function clearAllOnboardingData() {
  Object.keys(localStorage)
    .filter(key => key.startsWith('onboarding-'))
    .forEach(key => localStorage.removeItem(key));
}
```

---

## Säkerhetshänsyn (Uppdaterad 2025-11-22)

### Vad sparas (Uppdaterad policy)

✅ **SÄKERT att spara i localStorage:**
- **Session tokens:** `accessToken`, `refreshToken` (JWT - industry standard)
- **User-scoped keys:** `onboarding-{userId}-orgnr`, `onboarding-{userId}-companyName`
- **Draft changes:** Temporära formulärändringar innan POST till backend
- **UI preferences:** `sidebar-collapsed`, `theme`, `language`
- **Performance cache:** Kopia av backend-data med kort TTL (5-10 min)

⚠️ **MED FÖRSIKTIGHET:**
- Företagsnamn, organisationsnummer (offentlig data från Bolagsverket)
- VD:s namn, personnummer (endast som cache efter backend-validering)
- Verklig huvudmans namn, personnummer (endast cache)
- Svarsalternativ från formulär (ja/nej, dropdowns)

❌ **FÅR INTE sparas:**
- Lösenord eller credentials (plain text)
- API-tokens utöver JWT (secret keys, API keys)
- Känslig bankkontosinformation (kontonummer, BIC/IBAN)
- Kreditkortsnummer eller betalningsdata
- Okrypterad PII utöver vad backend redan godkänt

### localStorage vs sessionStorage vs Backend

| Storage | Livslängd | Use Case | Säkerhet |
|---------|-----------|----------|----------|
| **localStorage** | Permanent (tills cleared) | Session tokens, Draft changes, UI prefs | ⚠️ Medel (XSS-risk) |
| **sessionStorage** | Tills tab stängs | Temporära wizard-drafts | ⚠️ Medel (XSS-risk) |
| **Backend (JSON)** | Permanent (tills deleted) | Source of truth, PII, företagsdata | ✅ Hög (server-side) |
| **Backend (PostgreSQL)** | Permanent (production) | Long-term storage, audit trail | ✅ Hög (encrypted) |

**Valt:** `localStorage` + Backend combo
- localStorage: Performance cache + draft buffer
- Backend: Source of truth + persistent storage

### XSS (Cross-Site Scripting) Protection

**Risker med localStorage:**
- Sårbar för XSS-attacker (JavaScript kan läsa localStorage)
- Ingen HttpOnly-protection (till skillnad från cookies)

**Mitigations:**
- ✅ Content Security Policy (CSP) headers
- ✅ Sanitera all user input (React gör detta automatiskt via JSX)
- ✅ HTTPS-only (SSL/TLS kryptering)
- ✅ JWT tokens har kort TTL (60 min) → begränsar skadeperiod
- ⏳ Planerad: JWT refresh tokens med rotation (Phase 2)

### GDPR Compliance

**Personuppgifter i localStorage:**
- Personnummer, namn, företagsinfo = Personuppgifter enligt GDPR
- Användare har rätt att radera ("rätt att bli glömd")

**Compliance-åtgärder:**
- ✅ "Avsluta (rensar)"-knapp raderar ALL localStorage
- ✅ Backend DELETE endpoint raderar även server-side data
- ✅ Transparent information om vilken data som sparas (denna dokumentation)
- ⏳ Planerad: Auto-cleanup efter 30 dagar inaktivitet

---

## Testing

### Manuella tester
- [x] Fyll i Steg 1 → navigera till Steg 2 → tillbaka till Steg 1 → data finns kvar
- [x] Fyll i formulär → stäng webbläsare → öppna igen → data finns kvar
- [x] Öppna två flikar → ändra i ena → data synkas till andra
- [x] Testa alla wizard-steg (Steg 1-3 testade)
- [ ] Testa clearWizardData() funktionalitet

### Edge cases
- [x] Tom initialValue → formulär startar tomt
- [x] localStorage fullt/blockerat → fallback till initialValue
- [x] Korrupt JSON i localStorage → error handling fångar upp
- [x] Ändra initialValue-struktur → gammal data överskrids

---

## Framtida Förbättringar

### Prioritet 1 (Phase 1.5 - NÄSTA ITERATION)
- [x] **User-scoped localStorage keys** (IMPLEMENTERAT 2025-11-22)
  - Format: `onboarding-{userId}-{key}`
  - Extrahera userId från JWT token payload
- [ ] **Session Resume functionality** (PLANERAT 2025-11-22)
  - GET /api/onboarding/list → Resume-dialog
  - GET /api/onboarding/resume/{orgnr} → Populera localStorage från backend
  - OnboardingResumeDialog.jsx komponent
- [ ] Implementera Steg 4 EDD med localStorage
- [ ] Lägg till `clearWizardData()` vid framgångsrik submission
- [ ] Auto-save indikator i UI (tex "Sparad ✓")

### Prioritet 2 (Phase 2 - PROPER SOLUTION)
- [ ] **JWT token refresh mechanism** (3-4h)
  - Refresh token rotation
  - Silent refresh innan expiration
  - Hantera refresh failure → logout med meddelande
- [ ] **Bolagsverket autocomplete** (2-3h)
  - Ersätter manuell orgnr-input i UppdragsvalsSlide
  - Mocka 100+ företag för testning
- [ ] **"Parkera och Avsluta"-knapp** (2-3h)
  - Sparar currentStep automatiskt
  - Navigerar tillbaka till Uppdragsval
  - Multi-company support (konsult-scenario)
- [ ] Versionshantering av localStorage-schema
  - Ex: `{ version: 2, data: {...} }`
  - Migrationsstrategi vid strukturändringar
- [ ] TTL (Time To Live) för localStorage-data
  - Ex: radera cache äldre än 10 minuter
  - Auto-refresh från backend om expired

### Prioritet 3 (FRAMTIDA - PRODUKTION)
- [ ] **Database migration** (Backend)
  - JSON-filer → PostgreSQL för skalning
  - Migration script: JSON → Database loader
- [ ] **Kryptering av PII** (Backend)
  - AES-256 encryption för personnummer
  - Key management: AWS KMS eller Azure Key Vault
- [ ] **Audit trail** (Backend)
  - Logga alla API-calls (vem, vad, när)
  - forensic/audit_trail/user_actions.log
- [ ] Kompression för stora datamängder i localStorage
- [ ] localStorage quota monitoring (5-10 MB limit)
- [ ] Exportera/importera wizard-data (JSON-fil backup)
- [ ] Multi-language support för lagrade frågor

### Prioritet 4 (NICE TO HAVE)
- [ ] Undo/Redo funktionalitet med localStorage history
- [ ] Offline mode med service worker + localStorage fallback
- [ ] Real-time collaboration (multi-user editing med WebSockets)

---

## Relaterade Dokument

- **[CHANGELOG_2025-11-22.md](../../../tic-tac-toe-server/docs/CHANGELOG_2025-11-22.md)** - Session Management & Backend Source of Truth
- **[CHANGELOG_2025-11-21.md](../../../tic-tac-toe-server/docs/CHANGELOG_2025-11-21.md)** - Quick Fix Phase 1 (JWT TTL + orgnr move)
- [CONFIG_STRUCTURE.md](./CONFIG_STRUCTURE.md) - Konfigurationsstruktur
- [VALIDATION_TESTS.md](./VALIDATION_TESTS.md) - Valideringstester
- [Onboarding_app_ny.tex](../specifications/Onboarding_app_ny.tex) - Fullständig UI spec
- [legalTexts.js](../../src/data/legalTexts.js) - Lagtext-mappningar

---

## Changelog

| Datum | Version | Beskrivning |
|-------|---------|-------------|
| 2025-10-31 | 1.0 | Initial implementation - useLocalStorage hook skapad |
| 2025-10-31 | 1.1 | Steg 1 implementerad med localStorage |
| 2025-10-31 | 1.2 | Steg 2 implementerad med localStorage + info buttons |
| 2025-10-31 | 1.3 | Steg 3 implementerad med localStorage + info buttons |
| 2025-11-22 | 2.0 | **ARKITEKTONISK OMDESIGN:** Backend som Source of Truth |
|  |  | - User-scoped localStorage keys (`onboarding-{userId}-{key}`) |
|  |  | - localStorage = cache/draft buffer (EJ source of truth) |
|  |  | - Session Resume functionality dokumenterad |
|  |  | - Multi-device support via backend sync |
|  |  | - "Avsluta (rensar)"-funktionalitet |
|  |  | - GDPR compliance åtgärder |
| TBD | 2.1 | Steg 4 EDD implementation (planerad) |
| TBD | 3.0 | JWT token refresh + Bolagsverket autocomplete (Phase 2) |

---

## Kontakt & Support

**Utvecklare:** Claude + Lasse  
**Projekt:** Celestial Onboarding App  
**Repository:** `karagiannis/react_tesning` (frontend), `karagiannis/tic-tac-toe-server` (backend)  
**Branch:** `main`  
**Senaste uppdatering:** 2025-11-22 (Arkitektonisk omdesign dokumenterad)
