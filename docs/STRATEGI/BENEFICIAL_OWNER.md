# Roaring API: Beneficial Owner (Verklig Huvudman)
**Endpoint:** `/beneficial-owner`  
**Dokumenterat:** 2025-10-24  
**Status:** 🚧 Under documentation  

---

## Innehåll
1. [Översikt](#översikt)
2. [PTL-krav och juridisk grund](#ptl-krav-och-juridisk-grund)
3. [Endpoint-detaljer](#endpoint-detaljer)
4. [Response-schema](#response-schema)
5. [Sandbox-testdata](#sandbox-testdata)
6. [Livstester](#livstester)
7. [PTL-användning](#ptl-användning)
8. [Integration med Celestial Engine](#integration-med-celestial-engine)

---

## Översikt

**Beneficial Owner API** identifierar verkliga huvudmän (Ultimate Beneficial Owners - UBO) enligt penningtvättslagen (PTL).

### Varför kritisk för PTL?
- **PTL 3 kap 6 §:** Kräver identifiering av verklig huvudman
- **Länsstyrelsen Stockholm 01FS 2024-20:** Explicit dokumentationskrav
- **Sanktionsrisk:** Att inte identifiera verklig huvudman kan leda till ingripanden från Länsstyrelsen
  - Se: https://www.lansstyrelsen.se/stockholm/samhalle/betalning-ekonomi-och-pengar/forhindra-penningtvatt-och-finansiering-av-terrorism/ingripanden-och-sanktioner-penningtvatt.html

### Vad är en verklig huvudman?
Enligt PTL 1 kap 3 §:
- **Fysisk person** som i sista hand äger eller kontrollerar kunden
- **Ägarandel:** Direkt eller indirekt >25% av rösterna/kapitalet
- **Kontroll:** Utövar bestämmande inflytande på annat sätt

### Alternativ verklig huvudman (PTL 3 kap 8 §)
Om ingen verklig huvudman kan identifieras enligt ovan, ska **högsta befattningshavare** anges som alternativ verklig huvudman.

---

## PTL-krav och juridisk grund

### PTL 3 kap 6 § - Identifiering av verklig huvudman
> *"Verksamhetsutövaren ska vidta åtgärder för att identifiera den verkliga huvudmannen och fastställa dennes identitet."*

**Krav:**
- ✅ Identifiera alla personer med >25% ägande/kontroll
- ✅ Förstå ägarkedjan (direkt och indirekt ägande)
- ✅ Dokumentera kontrollmekanismer
- ✅ Verifiera identitet med samma stringens som för kunden själv

### Länsstyrelsen Stockholm 01FS 2024-20
Från punkt 2 § i föreskrifterna:
> *"När verksamhetsutövaren utser alternativ verklig huvudman enligt 3 kap. 8 § lagen (2017:630) om åtgärder mot penningtvätt och finansiering av terrorism ska det framgå att en verklig huvudman finns inte i Bolagsverkets register över verkliga huvudmän."*

**Praktisk konsekvens:**
- Om Roaring returnerar `null` eller tom lista → Måste dokumentera varför
- Använd alternativ VH (CEO/Högsta befattningshavare)
- Dokumentera i KYC-underlag

### Sanktionspraxis
Länsstyrelsen Stockholm har utdömt sanktionsavgifter för:
- ❌ Bristfällig identifiering av verklig huvudman
- ❌ Otillräcklig dokumentation av ägarkedjan
- ❌ Ingen utredning när register saknar uppgifter

---

## Endpoint-detaljer

### Bas-URL
```
https://api.roaring.io
```

### Endpoint
**GET/POST** `/beneficial-owner`

⚠️ **OBS:** Exakt endpoint-path och parametrar behöver verifieras mot Roaring dokumentation

### Request Parameters (förväntat)

#### Query/Body Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `organizationNumber` | string | ✅ | Organisationsnummer (10 siffror) |
| `includeAlternative` | boolean | - | Inkludera alternativ verklig huvudman om ingen hittas (default: true) |
| `includeOwnershipChain` | boolean | - | Inkludera ägarkedja (default: false) |
| `historyYears` | number | - | Historik i år (0-5, default: 0 = endast aktuell) |

### Request Example
```bash
curl -X GET \
  --header 'Accept: application/json' \
  --header 'Authorization: Bearer {ACCESS_TOKEN}' \
  'https://api.roaring.io/beneficial-owner?organizationNumber=5564881422'
```

---

## Response-schema

### Expected Structure
```json
{
  "organizationNumber": "5564881422",
  "companyName": "PERFECT COMPANY AB",
  "beneficialOwners": [
    {
      "personalNumber": "196304182199",
      "firstName": "Anna",
      "lastName": "Andersson",
      "ownershipPercentage": 50.0,
      "votingRightsPercentage": 50.0,
      "ownershipType": "DIRECT",
      "role": "BENEFICIAL_OWNER",
      "registrationDate": "2020-01-15",
      "verified": true,
      "source": "BOLAGSVERKET_REGISTER"
    },
    {
      "personalNumber": "197506123456",
      "firstName": "Erik",
      "lastName": "Eriksson",
      "ownershipPercentage": 50.0,
      "votingRightsPercentage": 50.0,
      "ownershipType": "DIRECT",
      "role": "BENEFICIAL_OWNER",
      "registrationDate": "2020-01-15",
      "verified": true,
      "source": "BOLAGSVERKET_REGISTER"
    }
  ],
  "alternativeBeneficialOwner": null,
  "ownershipChain": [],
  "totalCoverage": 100.0,
  "status": {
    "code": 200,
    "message": "OK",
    "hasCompleteInformation": true
  }
}
```

### Response Fields

#### Root Level
| Field | Type | Description |
|-------|------|-------------|
| `organizationNumber` | string | Organisationsnummer |
| `companyName` | string | Företagsnamn |
| `beneficialOwners` | array | Lista på verkliga huvudmän (>25%) |
| `alternativeBeneficialOwner` | object \\| null | Alternativ VH om ingen identifierad |
| `ownershipChain` | array | Ägarkedja (om begärd) |
| `totalCoverage` | number | Total ägarandel täckt (%) |
| `status` | object | Statusinformation |

#### BeneficialOwner Object
| Field | Type | Description |
|-------|------|-------------|
| `personalNumber` | string | Personnummer (12 siffror) |
| `firstName` | string | Förnamn |
| `lastName` | string | Efternamn |
| `ownershipPercentage` | number | Ägarandel (%) |
| `votingRightsPercentage` | number | Röstandel (%) |
| `ownershipType` | enum | `DIRECT` \\| `INDIRECT` \\| `COMBINED` |
| `role` | enum | `BENEFICIAL_OWNER` \\| `ALT_BENEFICIAL_OWNER` |
| `registrationDate` | string | Registreringsdatum ISO 8601 |
| `verified` | boolean | Verifierad i Bolagsverkets register |
| `source` | enum | Datakälla (se nedan) |

#### Source Values
- `BOLAGSVERKET_REGISTER` - Från Bolagsverkets verkliga huvudmän-register
- `CALCULATED` - Beräknat från ägarstruktur
- `COMPANY_PROVIDED` - Företaget har själv angett
- `ALTERNATIVE` - Alternativ verklig huvudman (högsta befattningshavare)

#### Status Object
| Field | Type | Description |
|-------|------|-------------|
| `code` | number | HTTP status kod |
| `message` | string | Statusmeddelande |
| `hasCompleteInformation` | boolean | Är informationen komplett? |

---

## Sandbox-testdata

### Testfall 1: Tydlig ägarstruktur (2 ägare, 50/50)
```bash
curl -X GET \
  --header 'Authorization: Bearer {TOKEN}' \
  'https://api.roaring.io/beneficial-owner?organizationNumber=5564881422'
```

**Förväntat resultat:**
- 2 beneficial owners
- Vardera 50% ägande
- Direkt ägande
- Verifierade i register

---

### Testfall 2: Komplex ägarstruktur (indirekt ägande)
```bash
curl -X GET \
  --header 'Authorization: Bearer {TOKEN}' \
  'https://api.roaring.io/beneficial-owner?organizationNumber=5590523865&includeOwnershipChain=true'
```

**Förväntat resultat:**
- Indirekt ägande genom holdingbolag
- Ägarkedja visad
- Beräknat ägarskap

---

### Testfall 3: Ingen identifierbar VH (alternativ används)
```bash
curl -X GET \
  --header 'Authorization: Bearer {TOKEN}' \
  'https://api.roaring.io/beneficial-owner?organizationNumber=XXXXX'
```

**Förväntat resultat:**
- `beneficialOwners`: tom array `[]`
- `alternativeBeneficialOwner`: CEO/VD som alternativ VH
- `totalCoverage`: 0
- `status.hasCompleteInformation`: false

---

### Testfall 4: Många små ägare (ingen >25%)
```bash
curl -X GET \
  --header 'Authorization: Bearer {TOKEN}' \
  'https://api.roaring.io/beneficial-owner?organizationNumber=YYYYY'
```

**Förväntat resultat:**
- Ingen når >25% tröskeln
- Alternativ VH används

---

## Livstester

⚠️ **Väntar på:** Faktiska testresultat från Roaring sandbox/production API

### Test Plan
1. ✅ Perfect Company (5564881422) - Tydlig struktur
2. ⏳ Komplex ägarkedja - Indirekt ägande
3. ⏳ Ingen VH identifierbar - Alternativ används
4. ⏳ Många små ägare - Under 25%-tröskeln
5. ⏳ Utländskt ägande - Cross-border ownership

---

## PTL-användning

### Krav på dokumentation (01FS 2024-20)

För varje identifierad verklig huvudman ska dokumenteras:
- ✅ **Identitet:** Personnummer + namn
- ✅ **Ägarandel:** Procent av röster/kapital
- ✅ **Typ av ägande:** Direkt, indirekt, eller kombinerat
- ✅ **Källa:** Varifrån information hämtats
- ✅ **Datum:** När identifieringen gjordes
- ✅ **Verifiering:** Hur identiteten verifierats

### Om ingen VH identifierbar
**Enligt PTL 3 kap 8 §:**
1. Utse högsta befattningshavare som alternativ VH
2. Dokumentera varför ingen VH identifierats
3. Ange att uppgift saknas i Bolagsverkets register
4. Verifiera alternativ VH:s identitet

**Exempel på dokumentation:**
```
Datum: 2025-10-24
Företag: AB Example (556123-4567)
Verklig huvudman: Ej identifierbar

Utredning:
- Kontrollerat Bolagsverkets register via Roaring API
- Resultat: Ingen person äger/kontrollerar >25%
- Ägarstruktur: 15 aktieägare, störste ägare 18%

Alternativ verklig huvudman:
- Namn: Kalle Karlsson
- Personnummer: 198001011234
- Befattning: VD
- Källa: Bolagsverkets företagsregistrering
- Verifiering: BankID-identifiering utförd

Ansvarig: [Namn], Redovisningskonsult
```

### Flaggor för Celestial Engine

Från Beneficial Owner-data kan följande flaggor genereras:

#### Ägarstruktur-flaggor
| Flagga | Allvarlighetsgrad | Trigger | Poäng |
|--------|------------------|---------|-------|
| **Oklar ägarkedja** | KRITISK | `totalCoverage < 50%` | 50 |
| **Ingen VH identifierbar** | HÖG | `beneficialOwners.length === 0 && alternativeBeneficialOwner !== null` | 30 |
| **Utländskt ägande** | MEDEL | Ägare med utländskt personnummer | 15 |
| **Många ägare** | LÅG | `beneficialOwners.length > 5` | 10 |
| **Oskäligt ägande** | HÖG | Någon ägare >75% | 20 |
| **Komplex ägarkedja** | MEDEL | `ownershipType === 'INDIRECT'` för alla | 15 |

#### PEP/Sanctions Cross-Check
Verkliga huvudmän ska alltid cross-checkas mot:
- 🔴 PEP-register (Politically Exposed Person)
- 🔴 Sanktionslistor (EU/UN/OFAC)
- 🔴 Näringsförbud (Business Prohibition)

**Exempel:**
```javascript
for (const bo of beneficialOwners) {
  // Check PEP status
  const pepCheck = await roaring.checkPEP(bo.personalNumber);
  if (pepCheck.isPEP) {
    flags.push({
      type: 'BENEFICIAL_OWNER_IS_PEP',
      severity: 'CRITICAL',
      person: bo,
      pepDetails: pepCheck
    });
  }
  
  // Check Business Prohibition
  const bpCheck = await roaring.checkBusinessProhibition(bo.personalNumber);
  if (bpCheck.hasProhibition) {
    flags.push({
      type: 'BENEFICIAL_OWNER_HAS_PROHIBITION',
      severity: 'CRITICAL',
      person: bo,
      prohibitionDetails: bpCheck
    });
  }
}
```

---

## Integration med Celestial Engine

### I Ägarstruktur-sidan (UI)

**Visas:**
- Lista på alla verkliga huvudmän
- Ägarandelar (procent)
- Typ av ägande (direkt/indirekt)
- Eventuell alternativ VH
- Total täckning (coverage %)

**Exempel layout:**
```
┌─────────────────────────────────────────┐
│ VERKLIGA HUVUDMÄN                       │
├─────────────────────────────────────────┤
│ Anna Andersson (196304182199)           │
│ ├─ Ägarandel: 50%                       │
│ ├─ Röster: 50%                          │
│ ├─ Typ: Direkt ägande                   │
│ └─ ✅ Verifierad i Bolagsverket         │
│                                         │
│ Erik Eriksson (197506123456)            │
│ ├─ Ägarandel: 50%                       │
│ ├─ Röster: 50%                          │
│ ├─ Typ: Direkt ägande                   │
│ └─ ✅ Verifierad i Bolagsverket         │
├─────────────────────────────────────────┤
│ Total täckning: 100% ✅                 │
└─────────────────────────────────────────┘
```

### Korsvalidering mot kundens svar

**I Riskfrågor-wizarden kan vi fråga:**
> "Är du verklig huvudman (äger/kontrollerar >25%) i företaget?"
> - [ ] Ja
> - [ ] Nej
> - [ ] Osäker

**Validering mot Roaring:**
```javascript
// Customer answered "No"
if (riskQuestionnaireAnswers.isBeneficialOwner === false) {
  // But Roaring shows they ARE beneficial owner
  const customerInBoList = beneficialOwners.find(
    bo => bo.personalNumber === customer.personalNumber
  );
  
  if (customerInBoList) {
    // FLAGGA: Customer lied about beneficial ownership
    flags.push({
      type: 'CUSTOMER_LIED_ABOUT_OWNERSHIP',
      severity: 'CRITICAL',
      userAnswer: 'Not beneficial owner',
      actualData: `Owns ${customerInBoList.ownershipPercentage}%`,
      action: 'REJECT or REQUIRE_EXPLANATION'
    });
  }
}
```

### I Riskindikatorer-sidan

**Visa flaggor:**
- ⚠️ Oklar ägarstruktur (endast 60% täckning)
- 🚨 Verklig huvudman har näringsförbud
- 🚨 Verklig huvudman är PEP
- ⚠️ Komplex ägarkedja (indirekt via 3 bolag)

---

## Nästa steg

### Dokumentation
- [ ] Verifiera exakt endpoint-path från Roaring dokumentation
- [ ] Köra livstester mot sandbox API
- [ ] Dokumentera faktiska response-exempel
- [ ] Testa edge-cases (ingen VH, många ägare, etc.)

### Implementation
- [ ] Skapa Python-klient för Beneficial Owner API
- [ ] Implementera PTL-validering (>25%-tröskel)
- [ ] Bygga UI-komponent för Ägarstruktur-sidan
- [ ] Integrera med PEP/Sanctions screening
- [ ] Implementera korsvalidering mot kundsvar

### Juridisk
- [ ] Granska mot Länsstyrelsen 01FS 2024-20 krav
- [ ] Säkerställa dokumentationsmallar
- [ ] Rutiner för alternativ VH

---

## Referenser

### Lagar och föreskrifter
- **PTL 3 kap 6 §** - Identifiering av verklig huvudman
- **PTL 3 kap 8 §** - Alternativ verklig huvudman
- **PTL 1 kap 3-7 §** - Definition av verklig huvudman
- **Länsstyrelsen Stockholm 01FS 2024-20** - Föreskrifter och allmänna råd

### Externa länkar
- [Länsstyrelsen Stockholms sanktionsbeslut](https://www.lansstyrelsen.se/stockholm/samhalle/betalning-ekonomi-och-pengar/forhindra-penningtvatt-och-finansiering-av-terrorism/ingripanden-och-sanktioner-penningtvatt.html)
- [Bolagsverkets VH-register](https://bolagsverket.se/ff/foretagsformer/aktiebolag/starta/verkligahuvudman)

---

**Senast uppdaterat:** 2025-10-24  
**Nästa: Board Members API** (Styrelseledamöter)
