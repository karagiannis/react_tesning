# Celestial Onboarding App - Dokumentation INDEX

**Princip:** Det som inte finns i detta index FINNS INTE!
**Skapad:** 2025-10-28
**Senast uppdaterad:** 2025-12-13

---

## Översikt

Detta är rot-indexet för all dokumentation i Celestial Onboarding App-projektet.

**Struktur:**
```
docs/
├── INDEX.md (detta dokument)
├── compliance/           # Regelefterlevnad (PTL, 01FS, lagar)
├── PROJECT/              # Projektledning, milestones, beslut
├── RISK_SCORE_ALGORITHM/ # Riskbedömningsalgoritmer
├── specifications/       # Tekniska specifikationer (LaTeX, UI/UX)
├── STRATEGI/             # Strategiska beslut (datakällor, API, affärsmodell)
└── [Root Documentation] # Arkitektur, kod-recensioner, teknisk design
```

---

## 🆕 Senaste Uppdateringar (2025-12-13)

**Tic-Tac-Toe Pattern Review:**
- ✅ `REVIEW_SUMMARY.md` (7KB) - Snabb sammanfattning av kodgranskning
- ✅ `TIC_TAC_TOE_PATTERN_REVIEW.md` (17KB) - Omfattande analys av arkitektur
- ✅ `CODE_QUALITY_SUGGESTIONS.md` (5KB) - Valfria förbättringar

**Status:** Koden följer strikt tic-tac-toe-mönstret från React.dev tutorial ✅

---

## 1. Compliance (`/compliance/`)

**Syfte:** Lagtext, föreskrifter, myndighetsdokumentation

**Dokument:**
- `01FS_2024-20.md` (23KB) - Länsstyrelsens föreskrifter
- `nationell_riskbedomning_2020-2021.pdf` (4.1MB) - Samordningsfunktionens rapport
- `vagledning-till-redovisningskonsulter-och-skatteradgivare.pdf` (28 sid) - Polisens vägledning

**Index:** [`compliance/INDEX.md`](./compliance/INDEX.md)

---

## 2. Projekt (`/PROJECT/`)

**Syfte:** Projektledning, milestones, beslut, arkiverade versioner

**Innehåll:**
- Projektplan och tidslinje
- Beslutsloggar
- Arkiverade dokument

**Index:** [`PROJECT/INDEX.md`](./PROJECT/INDEX.md)

---

## 3. Riskbedömning (`/RISK_SCORE_ALGORITHM/`)

**Syfte:** Celestial Risk Engine - algoritmer för automatisk riskbedömning

**Innehåll:**
- Version 3.0 (current)
- Viktningsfaktorer
- Regelmotor

**Index:** [`RISK_SCORE_ALGORITHM/INDEX.md`](./RISK_SCORE_ALGORITHM/INDEX.md)

---

## 0. Rot-Dokumentation (Code Reviews & Architecture)

**Syfte:** Arkitektur-dokumentation, kodgranskningar, state machine

**Dokument:**
- `REVIEW_SUMMARY.md` (7KB) - **START HÄR** - Snabb sammanfattning av tic-tac-toe pattern review
- `TIC_TAC_TOE_PATTERN_REVIEW.md` (17KB) - Omfattande analys av arkitektur mot React.dev tutorial
- `CODE_QUALITY_SUGGESTIONS.md` (5KB) - Valfria defensive programming-förbättringar
- `STATE_MACHINE_OVERVIEW.md` (91KB) - Komplett dokumentation av state machine med flödesscheman
- `MULTI_USER_EDITING.md` (7KB) - Version conflict detection och merge strategies
- `CENTRALIZED_STYLES.md` (10KB) - CSS/Tailwind stilguide
- `COMPACT_SPACING_MIGRATION.md` (13KB) - UI spacing guidelines
- `FORTNOX_DESIGN_ANALYSIS.md` (107KB) - Fortnox UI/UX analys för design-inspiration

**Viktigt:**
- ✅ **REVIEW_SUMMARY.md** - Börja här för översikt av kodgranskning
- ✅ **TIC_TAC_TOE_PATTERN_REVIEW.md** - Djupdykning i arkitektur
- ✅ **STATE_MACHINE_OVERVIEW.md** - Komplett state machine referens

---

## 3. Teknisk Specifikation (`/specifications/`)

**Syfte:** Tekniska specifikationer för UI/UX, API-endpoints, databas

**Huvuddokument:**
- `Onboarding_app_ny.tex` (91KB) - Komplett UI/UX-spec för onboarding-flödet (Beamer)
- `API_Endpoints_ContentSlides.tex` (83KB) - API-spec för content/slides endpoints (Beamer)
- `Admin_Dashboard_Spec.tex` (31KB) - Admin dashboard spec (Beamer)
- `LocalStorage.md` (16KB) - Konstruktionsdokument för localStorage i wizard
- `SettingsPage.md` (24KB) - Konstruktionsdokument för Settings-sidan med fjärronboarding

**Index:** [`specifications/INDEX.md`](./specifications/INDEX.md)

---

---

## 5. Strategi (`/STRATEGI/`)

**Syfte:** Långsiktiga strategiska beslut om teknologi, datakällor, affärsmodell

**Dokument:**
- `DATAKÄLLOR_STRATEGI.md` (23KB) - Jämförelse av datakällor (Bolagsverket, Roaring, etc.)
- `BYOK_API_SPECIFICATION.md` (NY) - Bring Your Own Key för stora byråer
- `BANKGIRO_UPPFÖLJNING_UTKAST.md` - Mejl-uppföljning till Bankgirot

**Index:** [`STRATEGI/INDEX.md`](./STRATEGI/INDEX.md)

---

## Externa API:er (`../external_apis/`)

**Syfte:** Integration med externa datakällor

**Tjänster:**
- Bolagsverket
- Roaring.io
- Skatteverket
- SCB

**Index:** [`../external_apis/INDEX.md`](../external_apis/INDEX.md)

---

## Principer

### Dokumentationsprincip
> **"Det som inte finns i INDEX FINNS INTE"**

Varje mapp ska ha ett `INDEX.md` som listar:
- Alla filer i mappen
- Status (aktiv/arkiverad/föråldrad)
- Senast uppdaterad
- Kort beskrivning

### Versionering
- Dokumentation versionshanterats via Git
- Använd semantisk versionering för major changes
- Arkivera föråldrade dokument i `PROJECT/arkiv/`

### Uppdatering
- Updatera INDEX.md vid varje ny/borttagen fil
- Datumstämpla alla ändringar
- Länka mellan relaterade dokument

---

## Kontakt

**Projekt:** Celestial Onboarding App
**Organisation:** Celestial AB
**Git:** `react_tesning` (karagiannis/react_tesning)

