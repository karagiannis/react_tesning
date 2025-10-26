# NY STRUKTUR FÖR RISKFRÅGOR (Onboardin_app_ny.tex)

## Översikt

Din befintliga React-implementation (`RiskFragorSlide.jsx`) har **alla 8 fält på EN sida**.  
Den nya LaTeX-specen ska matcha detta OCH lägga till **fördjupade multistage-frågor** som visas baserat på svaren.

---

## STEG 1: GRUNDLÄGGANDE INFORMATION (behålls som den är i React)

**Alla fält visas på samma sida** (exakt som i nuvarande RiskFragorSlide.jsx):

1. **Affärsidé** (textarea, required)
2. **Kundtyper** (checkboxes: privatpersoner, företag, offentlig sektor)
3. **Utländska affärspartners/kunder** (textarea: länder eller "Nej")
4. **Största leverantörer** (textarea)
5. **Verksamhet ändrad** (textarea: beskriv eller "Nej")
6. **Organisationsnummer** (input, required, triggers Bolagsverket API)
7. **Personnummer** (input, required ≥12 digits, triggers SPAR API)
8. **PEP** (checkbox med förklaring)

**Knapp:** "Nästa (visa fördjupade frågor)"

---

## STEG 2: FÖRDJUPADE FRÅGOR (conditional rendering baserat på Steg 1)

Dessa visas ENDAST om specifika triggers från Steg 1:

### 2A: UTLÄNDSKA TRANSAKTIONER
**Trigger:** `if (formData.utlandskaPartners !== "Nej" && formData.utlandskaPartners !== "")`

Frågor:
1. Vilka länder? (texta ra)
2. Typ av samarbete (checkboxes: import, export, konsult, licens)
3. Andel av omsättning från utland (dropdown: <5%, 5-20%, 20-50%, 50-80%, >80%)
4. Betalningar i utländsk valuta? (radio + textarea för valutor)
5. Utländska bankkonton? (radio + textarea för länder)

**Risk:** Högriskländer (FATF-listan) flaggas automatiskt

---

### 2B: KONTANTHANTERING (för B2C)
**Trigger:** `if (formData.kundTyper.privatpersoner === true)`

Frågor:
1. Tar ni emot kontanter? (radio: regelbundet, ibland, aldrig)
2. Om ja: Andel kontanter av omsättning (dropdown: <5%, 5-20%, 20-50%, >50%)
3. Hur hanteras kontanter? (checkboxes: bank dagligen, veckovis, kassaskåp, annat)
4. Kontanttransaktioner över 50 000 kr? (radio)
5. Tredjepartsbetalningar? (radio + exempel)

**Lagkrav:** Kontanthantering >20% kräver tillstånd från Skatteverket

---

### 2C: VERKSAMHETSÄNDRING
**Trigger:** `if (formData.verksamhetAndrad !== "Nej" && formData.verksamhetAndrad !== "")`

Frågor:
1. Vad var gamla verksamheten? (textarea)
2. Vad är nya verksamheten? (textarea)
3. Varför ändrades verksamheten? (checkboxes: marknad, nya möjligheter, ekonomiska svårigheter, ägarskifte, annat)
4. Registrerad hos Bolagsverket? (radio: ja, nej, pågår)
5. Personalstyrka/ledning ändrad samtidigt? (radio + textarea)

**Risk:** Både verksamhetsändring OCH ledningsbyte = högrisk

---

### 2D: PEP-DETALJER
**Trigger:** `if (formData.isPEP === true)`

Frågor:
1. Vem är PEP? (Namn + personnummer)
2. Roll i företaget? (checkboxes: VD, styrelseo rdförande, styrelseledamot, ägare >25%, annat)
3. Vilken position innebär PEP-status? (checkboxes: riksdag/minister, diplomat, domare, VD statligt bolag, militär, familjemedlem, medarbetare, annat)
4. Aktiv eller tidigare position? (radio: aktiv, tidigare <18 mån, tidigare >18 mån)
5. Kommer medel från PEP-rollen? (radio + textarea)

**PTL-krav:** PTL 3 kap 10§ kräver skärpt kundkännedom vid PEP

---

## IMPLEMENTATION I REACT

### RiskFragorSlide.jsx (Steg 1)
```jsx
// BEFINTLIG KOD BEHÅLLS!
// Alla 8 fält på samma sida
// När "Nästa" klickas → spara formData och navigera till /riskfragor/fordjupning
```

### RiskFragorFordjupningSlide.jsx (Steg 2) - NY KOMPONENT
```jsx
// Conditional rendering baserat på props från Steg 1:

function RiskFragorFordjupningSlide({ formDataFromStep1, onComplete }) {
  // State för alla fördjupningsfrågor
  const [deepDiveData, setDeepDiveData] = useState({
    utlandska: {},
    kontanter: {},
    verksamhetsandring: {},
    pep: {}
  });

  // Villkorlig rendering
  const showUtlandska = formDataFromStep1.utlandskaPartners !== "Nej" && 
                        formDataFromStep1.utlandskaPartners !== "";
  const showKontanter = formDataFromStep1.kundTyper.privatpersoner === true;
  const showVerksamhet = formDataFromStep1.verksamhetAndrad !== "Nej" && 
                         formDataFromStep1.verksamhetAndrad !== "";
  const showPEP = formDataFromStep1.isPEP === true;

  return (
    <>
      {showUtlandska && <UtlandskaSection data={deepDiveData.utlandska} onChange={...} />}
      {showKontanter && <KontanterSection data={deepDiveData.kontanter} onChange={...} />}
      {showVerksamhet && <VerksamhetSection data={deepDiveData.verksamhetsandring} onChange={...} />}
      {showPEP && <PEPSection data={deepDiveData.pep} onChange={...} />}
      
      <button onClick={() => onComplete({ ...formDataFromStep1, ...deepDiveData })}>
        Gå vidare till Identitetskontroll
      </button>
    </>
  );
}
```

---

## BACKEND API-ENDPOINTS

### POST /api/onboarding/riskfragor/steg1
Sparar grundläggande information från Steg 1

**Request:**
```json
{
  "affarsIdé": "string",
  "kundTyper": {
    "privatpersoner": boolean,
    "foretag": boolean,
    "offentligSektor": boolean
  },
  "utlandskaPartners": "string",
  "storaLeverantorer": "string",
  "verksamhetAndrad": "string",
  "organisationsnummer": "556789-1234",
  "personnummer": "19850315-1234",
  "isPEP": boolean
}
```

**Response:**
```json
{
  "success": true,
  "triggers": {
    "showUtlandska": true,
    "showKontanter": false,
    "showVerksamhet": true,
    "showPEP": false
  },
  "message": "Steg 1 sparat. 2 fördjupningssektioner behövs."
}
```

---

### POST /api/onboarding/riskfragor/steg2
Sparar fördjupade frågor från Steg 2

**Request:**
```json
{
  "steg1Data": { ... },
  "utlandska": {
    "lander": ["Tyskland", "Polen"],
    "typSamarbete": ["import", "export"],
    "andelOmsattning": "20-50%",
    "utlandskValuta": true,
    "valutor": ["EUR", "USD"],
    "utlandskaBankkonton": false
  },
  "kontanter": null,  // Om inte triggad
  "verksamhetsandring": {
    "gamlaVerksamhet": "Bilhandel",
    "nyaVerksamhet": "VVS-konsult",
    "anledning": ["marknad", "ekonomiska svårigheter"],
    "registreradBolagsverket": "ja",
    "personalAndrad": "Ja, VD och 3 anställda byttes ut"
  },
  "pep": null  // Om inte triggad
}
```

**Response:**
```json
{
  "success": true,
  "riskScore": {
    "total": 65,
    "breakdown": {
      "utlandska": 30,
      "verksamhetsandring": 35,
      "kontanter": 0,
      "pep": 0
    },
    "category": "MEDIUM_RISK"
  },
  "flags": [
    "Verksamhetsändring + personaländring = högrisk",
    "Tysk och polsk handel inom EU = OK",
    "Total riskscore: 65/100 (MEDIUM)"
  ]
}
```

---

## LATEX-FIL: TA BORT GAMLA FRAMES

I `Onboardin_app_ny.tex`:

**TA BORT (lines 500-720):**
- `\begin{frame}[label=riskfragor-steg2]` (gamla "Steg 2/5: Verksamhetsbeskrivning")
- `\begin{frame}[label=riskfragor-steg3]` (gamla "Steg 3/5: Kunder & Affärspartners")
- `\begin{frame}[label=riskfragor-steg4]` (gamla "Steg 4/5: Betalningar & Transaktioner")
- `\begin{frame}[label=riskfragor-steg5]` (gamla "Steg 5/5: PEP & Ägande")

**ERSÄTT MED:**
- `\begin{frame}[label=riskfragor-steg2a]` → Fördjupning: Utländska affärspartners
- `\begin{frame}[label=riskfragor-steg2b]` → Fördjupning: Kontanthantering (B2C)
- `\begin{frame}[label=riskfragor-steg2c]` → Fördjupning: Verksamhetsändring
- `\begin{frame}[label=riskfragor-steg2d]` → Fördjupning: PEP-detaljer

**Navigering:**
- Från Steg 1 → Steg 2A (om utländska partners finns)
- Från Steg 2A → Steg 2B (om privatpersoner kund)
- Från Steg 2B → Steg 2C (om verksamhet ändrad)
- Från Steg 2C → Steg 2D (om PEP)
- Från sista triggade steg → Identitetskontroll

---

## SAMMANFATTNING

✅ **Steg 1:** Behåll befintliga RiskFragorSlide.jsx (8 fält, en sida)  
✅ **Steg 2:** Lägg till conditional fördjupning (4 sektioner, visas baserat på triggers)  
✅ **LaTeX:** Uppdatera Onboardin_app_ny.tex för att matcha denna struktur  
✅ **Backend:** 2 endpoints (steg1 + steg2) med trigger-logik och riskscore-beräkning

---

**Vill du att jag:**
1. Skapar den nya `RiskFragorFordjupningSlide.jsx` komponenten?
2. Uppdaterar `Onboardin_app_ny.tex` med nya frames (2A-2D)?
3. Dokumenterar backend-endpoints i `API_Endpoints_Spec.tex`?
