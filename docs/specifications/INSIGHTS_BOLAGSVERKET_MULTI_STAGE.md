# INSIGHT: Bolagsverket Multi-Stage Wizard + Identitetskontroll

**Upptäckt:** 2025-10-24  
**Loop:** LOOP 2 (Backend API Spec)  
**Kräver revidering:** Sektion 2, 2B, och 3 (Identitetskontroll)  
**Blocker:** Måste förstå Bolagsverket v4 API först

---

## Kritisk insikt från användare

### 1. Identitetskontroll ≠ BankID
> "Identitetskontroll" handlar om att ta ett foto på personen där legitimationen hålls upp.

**Vad detta betyder:**
- Sektion 3 är INTE BankID OAuth-flow
- Sektion 3 är fotobaserad legitimationskontroll (selfie + ID-kort)
- BankID kommer SENARE (vid avtals-signering, Sektion 7)

**Typisk flow:**
1. Användare tar selfie med mobilkamera
2. Användare tar foto på pass/körkort/ID-kort
3. Backend skickar till bildanalys-API (t.ex. Onfido, Veriff, eller egenutvecklad AI)
4. API verifierar:
   - Ansiktsmatchning (selfie vs ID-kort foto)
   - ID-kort är äkta (OCR, hologram, säkerhetsfunktioner)
   - Personnummer matchar (OCR från ID-kort vs SPAR-register)

**PTL-relevans:**
- PTL 3 kap 9-11 §§ - Identifiering och verifiering av kund
- PTL 2 kap 4 § - Förstärkt kundkännedom vid distansrelationer
- Länsstyrelsen kräver dokumentation av identifieringsmetod

---

## 2. Riskfrågor är Multi-Stage Wizard

### User's kritiska observation:
> "Riskfrågor är en multistage wizard, där som liga frågar kan föranleda externa api-anrop"

**Vad detta betyder:**
- **INTE** en linjär flow: Steg 1 → Steg 2 → Klar
- **DYNAMISK** flow baserat på svar i tidigare steg
- Vissa svar triggar **omedelbara** externa API-anrop

### Exempel på Multi-Stage Logic:

#### Scenario A: Privatpersoner som kunder
```
Steg 1: "Vilka kundtyper?" → Användare bockar i "Privatpersoner"
↓
TRIGGER: showKontanter = true
↓
Steg 2A visas: "Hur ofta förekommer kontantbetalningar?"
↓
Användare svarar: "Ofta"
↓
OMEDELBART API-ANROP: Roaring PEP-check på VD
↓
Om PEP = true → Steg 2B visas: "PEP-detaljer"
```

#### Scenario B: Utländska partners
```
Steg 1: "Utländska partners?" → Användare skriver "Ja, Nigeria"
↓
TRIGGER: showUtlandska = true
↓
Steg 2A visas: "Vilka länder?"
↓
Användare svarar: "Nigeria"
↓
OMEDELBART API-ANROP: FATF grålistning check (Nigeria = högrisk)
↓
Risk score += 40 poäng
↓
Steg 2B visas: "Förklara affärssyfte med Nigeria"
```

#### Scenario C: SNI-kod trigger
```
Steg 1: Bolagsverket API returnerar SNI-kod: "64191" (Banker)
↓
OMEDELBART: Risk score += 50 (finansiell sektor = högrisk enligt PTL)
↓
Steg 2 visas AUTOMATISKT: "Fördjupade frågor om banklicens"
```

---

## 3. Bolagsverket v4 API - En Endpoint för allt

### Upptäckt från swagger.json:
Bolagsverket v4 har **EN** POST-endpoint som kan returnera ALLA data:

```
POST /organisationer
```

**Request Body:**
```json
{
  "identitetsbeteckning": "556789-1234",
  "organisationInformationsmangd": [
    "ORGANISATIONSADRESSER",
    "FIRMATECKNING",
    "FUNKTIONARER",
    "HEMVISTKOMMUN",
    "RAKENSKAPSAR",
    "ORGANISATIONSDATUM",
    "VERKSAMHETSBESKRIVNING",
    "AKTIEINFORMATION",
    "SAMTLIGA_ORGANISATIONSNAMN",
    "ORGANISATIONSENGAGEMANG",
    "TILLSTAND",
    "OVRIG_ORGANISATIONSINFORMATION",
    "ORGANISATIONSMARKERINGAR",
    "BESTAMMELSER",
    "VAKANSER_OCH_UPPLYSNINGAR",
    "EKONOMISK_PLAN",
    "UTLANDSK_FILIALAGANDE_ORGANISATION",
    "FINANSIELLA_RAPPORTER"
  ]
}
```

**Möjliga informationsmängder:**
- `ORGANISATIONSADRESSER` - Postadress, e-post
- `FIRMATECKNING` - Firmateckningsregler
- `FUNKTIONARER` - Styrelseledamöter, VD, revisorer
- `HEMVISTKOMMUN` - Län, kommun
- `RAKENSKAPSAR` - Räkenskapsår (start/slut)
- `ORGANISATIONSDATUM` - Registreringsdatum, bildatDatum
- `VERKSAMHETSBESKRIVNING` - Fri text om verksamhet
- `AKTIEINFORMATION` - Aktiekapital, aktieslag, kvotvärde
- `SAMTLIGA_ORGANISATIONSNAMN` - Alla företagsnamn inkl. översättningar
- `ORGANISATIONSENGAGEMANG` - Andra företag där funktionärer är aktiva
- `TILLSTAND` - Tillstånd (t.ex. banklicens, försäkring)
- `OVRIG_ORGANISATIONSINFORMATION` - Anteckningar
- `ORGANISATIONSMARKERINGAR` - Markeringar (t.ex. LAGER)
- `BESTAMMELSER` - Bolagsordning-detaljer
- `VAKANSER_OCH_UPPLYSNINGAR` - Vakanser i styrelse
- `EKONOMISK_PLAN` - För BRF
- `UTLANDSK_FILIALAGANDE_ORGANISATION` - För filialer
- `FINANSIELLA_RAPPORTER` - Årsredovisningar

**Historisk data:**
```json
{
  "identitetsbeteckning": "556789-1234",
  "tidpunkt": "2024-01-15T12:00:00"
}
```

**Implication för Loop 4:**
- Ett ENDA API-anrop kan hämta ALLT vi behöver
- Men: Kostar mer att hämta allt vs bara grunddata
- Strategy: 
  * Steg 1: Hämta minimal data (validering)
  * Steg 4 (Jämförelse): Hämta ALLA informationsmängder för visuell jämförelse

---

## 4. Roaring Alternative Beneficial Owner History

### User's discovery:
```
GET /se/company/alt-beneficial-owners/1.0/history/{companyId}?fromDate=2024-01-01&toDate=2025-01-01
```

**Syfte:** Visa historik över VH-ändringar

**PTL-relevans:**
- PTL 4 kap 3 § - Fortlöpande övervakning av kunders transaktioner
- Länsstyrelsen 01FS 2024-20 - Krav på dokumentation av ändringar
- Red flag: Många VH-byten under kort tid = möjlig penningtvätt

**Use case:**
```
Exempel: Företag byter VH 5 gånger på 6 månader
→ Red flag: "Frequent beneficial owner changes"
→ Risk score += 30
→ EDD krävs: "Förklara varför så många VH-byten"
```

---

## Konsekvenser för Loop 2 (Backend API Spec)

### Sektion 2 och 2B måste omarbetas:

#### Problem:
Nuvarande spec beskriver en **linjär** flow:
1. POST /riskfragor/steg1 (spara alla svar)
2. POST /riskfragor/steg2 (spara alla fördjupningsfrågor)

#### Verkligheten: Multi-Stage Wizard
1. POST /riskfragor/steg1 - Grundfrågor
2. **Dynamic triggers** → Vissa svar triggar OMEDELBARA API-anrop
3. GET /riskfragor/next-questions - Hämta nästa frågor baserat på tidigare svar + API-resultat
4. POST /riskfragor/answer - Spara ETT svar i taget
5. Upprepa 3-4 tills inga fler frågor
6. POST /riskfragor/complete - Finalisera riskbedömning

#### Alternativ approach (enklare):
Frontend hanterar multi-stage logiken, men backend behöver:
- POST /riskfragor/steg1 (inkluderar alla externa API-anrop)
- Response inkluderar:
  * triggers (vilka fördjupningsfrågor ska visas)
  * **externalData** (resultat från Bolagsverket, SPAR, Roaring)
  * **riskIndicators** (tidiga varningar baserat på externa data)

---

## Sektion 3: Identitetskontroll - Rätt spec

### INTE BankID (det kommer i Sektion 7)

### Rätt flow:
1. **POST /api/onboarding/{id}/identity/upload-selfie**
   - Request: Multipart form-data med bild
   - Response: Upload success, awaiting ID document

2. **POST /api/onboarding/{id}/identity/upload-id-document**
   - Request: Multipart form-data med pass/körkort foto
   - Response: Upload success, awaiting verification

3. **POST /api/onboarding/{id}/identity/verify**
   - Trigger: Backend skickar båda bilderna till Onfido/Veriff API
   - Response: 
     * `status: "processing"` (väntar på AI-analys, 5-30 sekunder)
     * WebSocket push när klar

4. **GET /api/onboarding/{id}/identity/status**
   - Response:
     ```json
     {
       "status": "verified",
       "faceMatch": {
         "confidence": 0.98,
         "passed": true
       },
       "documentAuthenticity": {
         "isGenuine": true,
         "documentType": "SWEDISH_PASSPORT",
         "expiryDate": "2028-05-15"
       },
       "extractedData": {
         "personnummer": "19850315-1234",
         "namn": "Anna Andersson",
         "address": "Storgatan 1, Stockholm"
       },
       "crossCheck": {
         "matchesSPAR": true,
         "matchesBolagsverket": true
       }
     }
     ```

### Externa API:er för Sektion 3:
- **Onfido** (rekommenderad): Face match + ID verification
- **Veriff**: Alternativ till Onfido
- **AWS Rekognition**: För ansiktsjämförelse (om egenutveckla)
- **Google Cloud Vision**: För OCR av ID-kort
- **Azure Face API**: För face matching

---

## TODO (Loop 2 - Backend API Spec)

### Måste revidera:
- [x] Sektion 2: POST /riskfragor/steg1 ✅ (redan klar)
- [x] Sektion 2B: POST /riskfragor/steg2 ✅ (redan klar)
- [ ] **SKRIVA OM Sektion 3:** Identity verification (foto-baserad)
  * 3 endpoints: upload-selfie, upload-id-document, verify
  * Integration med Onfido/Veriff
  * Cross-check mot SPAR + Bolagsverket
  * PTL 3 kap 9-11 §§ dokumentation

### Måste lägga till i Sektion 2:
- [ ] Bolagsverket v4 `organisationInformationsmangd` array
  * Vilka informationsmängder behöver vi i Steg 1?
  * Svar: `["FUNKTIONARER", "ORGANISATIONSDATUM", "VERKSAMHETSBESKRIVNING"]`
- [ ] Roaring beneficial owner history endpoint
  * När anropa: Om VH-data verkar misstänkt (många ägare, komplexa strukturer)
  * Red flag: >3 VH-byten på 12 månader

### Måste lägga till i Sektion 4 (Jämförelse):
- [ ] Bolagsverket v4 med ALLA informationsmängder
  * Detta är när användaren ser fullständig företagsinformation
  * Visual comparison: Vad användaren angav vs Bolagsverket-data

---

## Multi-Stage Wizard Implementation Strategy

### Option A: Frontend-driven (Rekommenderad för Loop 3+4)
**Flow:**
```
Frontend hanterar wizard-logik
↓
POST /riskfragor/steg1 - Ett API-anrop med ALLA svar från Steg 1
↓
Backend gör ALLA externa API-anrop (Bolagsverket, SPAR, Roaring, PEP, Sanctions)
↓
Backend returnerar triggers + externalData
↓
Frontend visar Steg 2 frågor DYNAMISKT baserat på triggers
↓
POST /riskfragor/steg2 - Ett API-anrop med ALLA svar från Steg 2
↓
Backend beräknar final risk score
```

**Fördelar:**
- Enklare backend (2 endpoints istället för 10+)
- Snabbare (färre roundtrips)
- Lättare att debugga

**Nackdelar:**
- Kan ta 5-10 sekunder att få svar på POST /riskfragor/steg1 (många externa API-anrop)
- Användaren ser laddningsindikator under tiden

### Option B: Backend-driven (Mer komplex)
**Flow:**
```
POST /riskfragor/answer {"question": "kundTyper", "answer": {"privatpersoner": true}}
↓
Backend sparar svar
↓
GET /riskfragor/next-question
↓
Backend returnerar nästa fråga ELLER trigger external API call
↓
Upprepa tills inga fler frågor
```

**Fördelar:**
- Användaren ser snabb respons på varje fråga
- Mer "interaktivt"

**Nackdelar:**
- 10-15 API-anrop istället för 2
- Komplex state management
- Svårare att implementera i Loop 4

---

## Beslut för Loop 2

**PAUSA** arbete på Sektion 3 (Identitetskontroll) tills vi har:
1. ✅ Analyserat Bolagsverket v4 swagger (KLART)
2. ⏳ Bestämt vilken Identity Verification provider (Onfido vs Veriff vs egenbyggd)
3. ⏳ Bestämt Multi-Stage Wizard strategy (Frontend-driven vs Backend-driven)

**FORTSÄTT** med:
- Sektion 4: GET /comparison (visa externa data för användaren)
- Sektion 5: POST /upload-chunk (800 MB fil-uppladdning)
- Sektion 6: GET /analysis-status (Celery progress)
- Sektion 7: GET /decision (PTL-beslut) + BankID-signering

**KOM TILLBAKA** till Sektion 3 när beslut är taget.

---

## Referens

### Bolagsverket v4
- Swagger: `Bolagsverket/Företagsinformation/swagger.json`
- Formaterad: `Bolagsverket/Företagsinformation/swagger_formatted.json`
- Base URL: `https://gw.api.bolagsverket.se/foretagsinformation/v4`
- Auth: OAuth2 client credentials
- Scope: `foretagsinformation:read`

### Roaring.io
- Beneficial Owner: `/se/company/beneficial-owners/2.1/{orgNr}`
- Alternative BO: `/se/company/alternative-beneficial-owner/1.0/{orgNr}`
- **BO History:** `/se/company/alt-beneficial-owners/1.0/history/{companyId}?fromDate=X&toDate=Y`

### Identity Verification Providers
- **Onfido:** https://onfido.com/ (marknadsled, AI-driven)
- **Veriff:** https://www.veriff.com/ (konkurrent till Onfido)
- **AWS Rekognition:** Face matching + ID OCR
- **BankID (för signering):** https://www.bankid.com/ (används i Sektion 7, INTE Sektion 3)

### PTL Referenser
- **PTL 3 kap 9-11 §§:** Identifiering och verifiering av kund
- **PTL 2 kap 4 §:** Förstärkt kundkännedom vid distansrelationer
- **PTL 4 kap 3 §:** Fortlöpande övervakning
- **Länsstyrelsen 01FS 2024-20:** Dokumentationskrav

---

**STATUS:** INSIGHTS parkerad. Väntar på beslut om Identity Verification provider och Multi-Stage Wizard strategy innan Sektion 3 kan specas korrekt.
