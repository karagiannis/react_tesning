# STRATEGI - INDEX

**Princip:** Det som inte finns i detta index FINNS INTE!
**Skapad:** 2025-10-26
**Senast uppdaterad:** 2025-10-28

---

## Översikt

Denna mapp innehåller strategiska dokument för Celestial Onboarding App - långsiktiga beslut om teknologi, datakällor, arkitektur och affärsmodell.

---

## Strategidokument

### 1. BYOK_API_SPECIFICATION.md

**Skapad:** 2025-10-28
**Status:** SPECIFICATION - Implementation pending
**Prioritet:** 🔴 CRITICAL (Enterprise feature)

**Syfte:**
Tillåt stora redovisningsbyråer (PwC, Ludvig & Co, Grant Thornton) att använda sina egna API-avtal med Bolagsverket och Roaring.io istället för Celestials poolade nycklar.

**Innehåll:**
- **Affärsvärde:** Attraktivt för Enterprise-kunder, behåller kundrelation trots egen API-integration
- **3 Tiers:** Starter (poolade nycklar), Professional (volymrabatt), Enterprise (BYOK)
- **Prissättning:**
  - Bolagsverket: 1000 kr/mån (500 anrop) = 2.50 kr/anrop efter moms
  - Roaring.io: 2295 kr/mån total (1795 bas + 500 AML)
  - Celestial markup: 0-50% beroende på tier
- **Teknisk implementation:**
  - Backend: AES-256 kryptering av credentials
  - API proxy service med automatisk key selection
  - Settings UI för Enterprise-kunder
  - Audit logging och usage tracking
- **Säkerhet:**
  - Frontend ser ALDRIG Client Secret
  - Master key via AWS Secrets Manager
  - Yearly key rotation
- **Migration plan:** Fas 1-3 (Q1-Q3 2026)

**Kostnadsjämförelse stora byråer (1000+ anrop/mån):**
- Celestial Professional: 3500 kr
- Eget avtal (BYOK): 3545 kr → **BYOK REKOMMENDERAT** (full kontroll)

**Nästa steg:**
- [ ] Databas-schema för API credentials
- [ ] Kryptering service
- [ ] Settings UI (React)
- [ ] Test connection endpoint
- [ ] Documentation för Enterprise-kunder

---

### 2. BANKGIRO_UPPFÖLJNING_UTKAST.md

**Skapad:** 2025-10-26
**Status:** UTKAST - Mejl till Bankgirot (väntar på att skickas)

**Bakgrund:**
- 3 mejl skickade till Bankgirot utan svar på prisfrågor
- Första mejlet: ✅ Bekräftelse om bulknedladdning + veckovisa uppdateringar
- Andra mejlet: ❌ Prisfråga (obesvarat)
- Tredje mejlet: ❌ Påminnelse "Du har glömt mig" (obesvarat)

**Innehåll:**
- 3 mejl-utkast med olika toner:
  - **Utkast 1:** Professionell och tålmodig (REKOMMENDERAD)
  - **Utkast 2:** Kort och direkt
  - **Utkast 3:** Diplomatisk avslutning med deadline
- Plan B: Implementera egen Bankgiro-databas om inget svar
- Nästa steg beroende på Bankgirot-svar

**Nästa åtgärd:**
- Välj utkast och skicka uppföljning
- Om inget svar: Implementera egen databas enligt DATAKÄLLOR_STRATEGI.md

---

### 3. DATAKÄLLOR_STRATEGI.md (23K)

**Skapad:** 2025-10-21
**Status:** REFERENSDOKUMENT - Vissa delar föråldrade efter beslut om betallösning

**Innehåll:**
- Jämförelse mellan datakällor för KYC/AML
- Bolagsverket: Gratis API vs FIL-hämtning (600 kr + 900 kr/år)
- Roaring.io kostnadsjämförelse (7 560 kr/år)
- SPAR (make/maka-relationer) strategi
- Bankgiro-databas implementation
- Skatteverket API information
- Layering-analys flöde
- Kostnadsscenarier: MVP (0 kr), v1.0 (900 kr/år), v2.0 (1 400-2 900 kr/år)

**Relevans idag:**
- ✅ Teknisk information om API:er fortfarande giltig
- ✅ Layering-analys flöde relevant
- ⚠️ Kostnadsjämförelser mindre viktiga efter beslut om betallösning
- ⚠️ Användare betalar nu fast låg kostnad + per API-anrop

**Öppna frågor:**
- ❓ Bankgirot svarar inte på prisfrågor (3 mejl skickade, inget svar)
  - Första mejl: Bekräftelse om bulknedladdning + veckovisa uppdateringar
  - Andra mejl: Prisfråga (obesvarat)
  - Tredje mejl: Påminnelse "Du har glömt mig" (obesvarat)
- ❓ Ska vi ge upp Bankgirot och bygga egen databas istället?

**Användning:**
- Referens för tekniska implementationer
- Bakgrund till strategiska beslut
- Kostnadsanalys för framtida förhandlingar

---

### 3. LIVE_TEST_STRATEGIC_INSIGHTS.md (31K)

**Flyttad från:** docs/API_INTEGRATION/Roaring/ (2025-10-26)
**Skapad:** 2025-10-23
**Status:** AKTIV STRATEGI - Påverkar frontend UI-design

**Innehåll:**
- Strategiska insikter från live endpoint-testing av Roaring.io
- Vilka endpoints som fungerar vs ger empty responses
- **Multi-stage wizard discovery** - Behövs för UBO-kedjor
- API cost optimization - Vilka endpoints är nödvändiga
- Frontend UI-impact - Dynamic form fields baserat på API-svar

**Varför kritisk:**
- Endpoint-tester avgör UI-design (därför låg tester i frontend-mappen)
- Upptäckt att UBO-kedjor kan vara 5+ nivåer djupa → Dynamic multi-stage wizard
- Vissa företag saknas i Roaring.io test-data → Error handling i UI

**Användning:**
- Referens för frontend-utveckling
- Guide för vilka Roaring.io endpoints som behövs
- Grund för multi-stage wizard implementation

---

### 4. KYC_COST_OPTIMIZATION.md (32K)

**Flyttad från:** docs/API_INTEGRATION/Roaring/ (2025-10-26)
**Skapad:** 2025-10-23
**Status:** AKTIV STRATEGI - Prismodell för användare

**Innehåll:**
- Kostnadsoptimering för KYC-data-hämtning från Roaring.io
- **Pay-per-use strategi:**
  - RAR 0: Endast direkt motpart (billigast, Bolagsverket)
  - RAR -1: Ett steg bakåt (medel kostnad, Roaring.io)
  - RAR -2: Två steg bakåt (dyrast, full UBO-kedja)
- Vilka endpoints kostar vs är gratis
- Batch vs single requests
- Cache-strategier
- Kostnadskalkyl per onboarding

**Prisexempel:**
- RAR 0: ~0 kr (endast Bolagsverket gratis API)
- RAR -1: ~5-7 kr (Roaring.io grunddata)
- RAR -2: ~15-25 kr (full UBO-kedja + sanctions)

**Användning:**
- Prisberäkning i frontend (visa kostnad innan analys)
- Backend API-selection logik
- Användare väljer själv analysdjup

**Relation:** Se även DATAKÄLLOR_STRATEGI.md för API-jämförelser

---

### 5. RISK_INDICATORS_ANALYSIS.md (147K!)

**Flyttad från:** docs/API_INTEGRATION/Roaring/ (2025-10-26)
**Skapad:** 2025-10-23
**Status:** KÄRNVIKTIG - Grund för risk score-algoritm

**Innehåll:**
- **MASSIV ANALYS** av risk indicators från Roaring.io (4450 rader!)
- PEP (Politically Exposed Person) checks
- Sanktionslistor (terrorism, penningtvätt)
- Business prohibition checks (näringsförbud)
- Ägarstruktur red flags (komplexitet, offshore-bolag)
- Geografisk risk (högriskländer)
- Circular transaction indicators (penningtvätt)
- Integration med metod_riskbedömning_kund_v3.tex

**Risk-faktorer från Roaring.io:**
- SNI-kod kongruens (SCB vs verklig verksamhet)
- Ägarstruktur komplexitet
- PEP/sanktionslistor
- Offshore-bolag i ägarkedjan
- Circular ownership detection

**Användning:**
- Input till risk score-algoritm (metod_riskbedömning_kund_v3.tex)
- Fraud detection-modul
- AML compliance checks

**Relation:**
- [../PENGATVÄTTS_KURSEN/metod_riskbedömning_kund_v3.tex](../PENGATVÄTTS_KURSEN/metod_riskbedömning_kund_v3.tex) - Risk score-algoritm
- [../../tic-tac-toe-server/fraud_detection/](../../tic-tac-toe-server/fraud_detection/) - Implementation

---

### 6. BENEFICIAL_OWNER.md (15K)

**Flyttad från:** docs/API_INTEGRATION/Roaring/ (2025-10-26)
**Skapad:** 2025-10-24
**Status:** AKTIV STRATEGI - UBO implementation

**Innehåll:**
- UBO (Ultimate Beneficial Owner) implementation-strategi
- UBO-chain discovery (rekursiv ägarsökning)
- Circular ownership detection (penningtvätt-indikator)
- PML-krav för UBO (25% ägande-tröskel)
- **Multi-stage wizard strategy** - Dynamisk UI baserat på kedjans längd

**Varför multi-stage wizard:**
- UBO-kedjor kan vara 1-5+ nivåer djupa
- Okänt vid start hur många steg som behövs
- Progress indicator måste uppdateras dynamiskt
- Användare ser endast relevanta frågor

**Frontend impact:**
- Dynamic form generation
- Progress indicator (5 steg vs 10 steg)
- Real-time cost preview (djupare kedja = högre kostnad)
- Error handling (företag saknas i Roaring.io)

**Användning:**
- Frontend multi-stage wizard implementation
- Backend UBO-chain traversal algoritm
- Circular ownership detection

---

## Framtida strategidokument

När nya strategiska beslut tas, dokumentera här:

- **PRISMODELL_STRATEGI.md** (planerad) - Beslut om användare betalar per API-anrop
- **SKALNINGS_STRATEGI.md** (planerad) - Hur vi skalar från 10 → 100 → 1000 kunder
- **DATA_RETENTION_STRATEGI.md** (planerad) - GDPR-compliant datalagring
- **API_PROVIDER_STRATEGI.md** (planerad) - När använda Roaring vs Bolagsverket vs SCB
- **BANKGIRO_STRATEGI.md** (planerad) - Om Bankgirot fortsätter att inte svara

---

## Relaterad dokumentation

- [../compliance/INDEX.md](../compliance/INDEX.md) - KYC/AML compliance krav
- [../specifications/INDEX.md](../specifications/INDEX.md) - Tekniska specifikationer
- [../PROJECT/](../PROJECT/) - Roadmap och projektplanering
- [../../external_apis/INDEX.md](../../external_apis/INDEX.md) - API-integrationer

---

**Det som inte finns i detta index FINNS INTE i STRATEGI-mappen!**
