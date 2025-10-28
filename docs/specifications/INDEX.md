# Technical Specifications - INDEX

**Princip:** Det som inte finns i detta index FINNS INTE!
**Skapad:** 2025-10-26
**Senast uppdaterad:** 2025-10-27

---

## 1. Översikt

**Syfte:** Tekniska specifikationer för Celestial Onboarding App

**Innehåll:**
- LaTeX-specifikationer (Beamer presentations för UI/UX och API endpoints)
- Implementation notes och arkitekturdesign
- Databas-scheman och konfigurationsstrukturer

---

## 2. Struktur

**Sökväg:** `docs/specifications/`

```
specifications/
├── *.tex              # LaTeX source files (Beamer presentations)
├── *.md               # Documentation och implementation notes
└── build/             # Compiled PDFs och build artifacts
    ├── *.pdf          # Generated specifications
    ├── *.aux          # LaTeX auxiliary files
    ├── *.log          # Build logs
    ├── *.out          # Hyperref output
    └── *.toc          # Table of contents
```

---

## 3. LaTeX Specifikationer

### A. Onboarding Flow Specification (Beamer)

#### `Onboarding_app_ny.tex` (91KB)
- **Format:** Beamer presentation (LaTeX slideshow)
- **Syfte:** Komplett UI/UX-specifikation för onboarding-flödet
- **Innehåll:**
  - Alla slides/sidor i onboarding-processen (30+ slides)
  - Layout och designelement
  - Formulärfält och valideringsregler
  - Användarflöde och navigering
  - Visuella mockups
  - Backend-integration notes (OAuth, API-calls, etc.)
- **Byggt PDF:** `build/Onboarding_app_ny.pdf` (253KB)
- **Status:** ✅ Huvudspecifikation
- **Senast uppdaterad:** 2025-10-25
- **Not:** Innehåller även backend-detaljer som egentligen inte är nödvändiga för frontend

**Legacy version:**
- `onboarding_app.tex` (31KB) - Flyttad till ~/Documents/PENGATVÄTTS_KURSEN/ (2025-10-27)
- `build/onboarding_app.pdf` (240KB) - Legacy PDF, kan raderas

### B. API Endpoint Specifications (Beamer)

**Not:** Dessa specifikationer innehåller både frontend interface OCH backend implementation detaljer (OAuth-flows, Google Auth server calls, etc.). Egentligen borde de endast specificera det interface frontend behöver känna till.

#### `API_Endpoints_Auth.tex` (162KB)
- **Format:** Beamer presentation
- **Syfte:** Specifikation för autentiserings-endpoints
- **Innehåll:**
  - OAuth2-flow (inklusive backend implementation mot Google Auth)
  - JWT token management
  - User registration/login
  - Email confirmation
  - Backend-detaljer (serverside OAuth-hantering)
- **Status:** ⏳ Under utveckling
- **Byggt PDF:** Ej kompilerad än
- **Senast uppdaterad:** 2025-10-24

#### `API_Endpoints_ContentSlides.tex` (83KB)
- **Format:** Beamer presentation
- **Syfte:** Specifikation för content-relaterade endpoints
- **Innehåll:**
  - CRUD för slides
  - Content management
  - Onboarding flow API
  - Backend implementation notes
- **Byggt PDF:** `build/API_Endpoints_ContentSlides.pdf` (514KB)
- **Status:** ✅ Kompilerad
- **Senast uppdaterad:** 2025-10-25 04:00

#### `API_Endpoints_ContentSlides_SEKTION2A_NY.tex` (40KB)
- **Syfte:** Sektion 2A - ny struktur för content slides
- **Status:** ⏳ Work in progress
- **Byggt PDF:** Ej kompilerad än
- **Senast uppdaterad:** 2025-10-25

**Legacy API spec:**
- `build/API_Endpoints_Spec.pdf` (328KB) - Tidigare API-specifikation, används som referens

### C. Admin Dashboard Specification (Beamer)

#### `Admin_Dashboard_Spec.tex` (31KB)
- **Format:** Beamer presentation
- **Syfte:** Admin dashboard UI/UX-specifikation
- **Innehåll:**
  - Dashboard layout
  - User management
  - Analytics och rapporter
  - System settings
- **Byggt PDF:** `build/Admin_Dashboard_Spec.pdf` (166KB)
- **Status:** ✅ Komplett specifikation

### D. Uppdragsavtal (Client Agreement)

#### `uppdragsavtal_exempel.tex` (6KB)
- **Format:** Standard LaTeX document
- **Syfte:** Template för uppdragsavtal mellan redovisningsbyrå och kund
- **Innehåll:**
  - Avtalsvillkor
  - Tjänstebeskrivning
  - Prissättning
  - GDPR-information
- **Byggt PDF:** `build/uppdragsavtal_exempel.pdf` (100KB)
- **Status:** ✅ Template klart
- **Användning:** Genereras automatiskt vid onboarding (planerad feature)

---

## 4. Configuration Specifications

### CONFIG_STRUCTURE.md (5KB)

**Skapad:** 2025-10-20
**Status:** ✅ Aktiv specifikation - planerad utökning

**Innehåll:**
- Firm-wide configuration API (`/api/settings/firm-config`)
- Datastruktur för bokföringsbyråns kontaktinformation
- Integration med WelcomeSlide (Slide 28) och SupportSlide (Slide 30)
- Security considerations och caching-strategi

**Planerade utökningar:**
- ✅ **Prislista (default pricing)** - För automatisk prisberäkning med override-möjlighet
- ✅ **Multi-stage wizard KYC-frågor** - Utökade KYC-frågor enligt Onboardin_app_ny.tex
- ✅ **Konfigurerbara formulärfält** - Byrå-specifika input-fält

**Användning:**
- Backend: `GET/PUT /api/settings/firm-config`
- Frontend: WelcomeSlide.jsx, SupportSlide.jsx
- Mock data: `/src/data/mockFirmConfig.js`

**Relation till LaTeX-specs:**
- Refererar till slides 28-30 i Onboarding_app_ny.tex
- KYC-frågor definierade i RISKFRAGOR_NY_STRUKTUR.md
- API-endpoints specificerade i API_Endpoints_ContentSlides.tex

---

## 5. Implementation Notes (Markdown)

### Arkitektur och Design

#### `LATEX_STRUKTUR.md` (10KB)
- **Syfte:** Översikt över LaTeX-dokumentstrukturen
- **Innehåll:**
  - De tre huvuddokumenten (Onboarding, API, Admin)
  - Build-process
  - Underhållsinstruktioner
- **Status:** ✅ Uppdaterad 2025-10-24

#### `POSTGRES_UUID_ARKITEKTUR.md` (14KB)
- **Syfte:** Databasdesign med PostgreSQL och UUID-nycklar
- **Innehåll:**
  - ER-diagram
  - Table schemas
  - Foreign key relationships
  - UUID vs auto-increment rationale
- **Status:** ✅ Arkitekturdesign klar
- **Implementation:** ⏳ Ej påbörjad (SQLite används för prototyp)

#### `ARBETSSCHEMA_SINGLE_LOOP.md` (14KB)
- **Syfte:** Arbetsflöde för development - single loop iteration
- **Innehåll:**
  - Iterativ utvecklingsprocess
  - Task breakdown
  - Testing workflow
- **Status:** ✅ Development workflow dokumenterad

### Slide Structure och Organization
- **Syfte:** Cleanup notes för riskfrågor i Beamer
- **Innehåll:**
  - Duplicates att ta bort
  - Refactoring notes
- **Status:** ⏳ Cleanup pending
- **Senast uppdaterad:** 2025-10-25

### API Integration Insights

#### `INSIGHTS_BENEFICIAL_OWNER.md` (9KB)
- **Syfte:** Insikter från Roaring Beneficial Owners API
- **Innehåll:**
  - UBO identification logic
  - Edge cases
  - PML compliance notes
- **Status:** ✅ Insights dokumenterade
- **Senast uppdaterad:** 2025-10-24

#### `INSIGHTS_BOLAGSVERKET_MULTI_STAGE.md` (12KB)
- **Syfte:** Multi-stage integration med Bolagsverket API
- **Innehåll:**
  - Sequential API calls
  - Error handling
  - Fallback strategies
- **Status:** ✅ Insights dokumenterade
- **Senast uppdaterad:** 2025-10-24

#### `BEAMER_RISKFRAGOR_STADNING.md` (5KB)
- **Syfte:** Cleanup notes för riskfrågor i Beamer
- **Innehåll:**
  - Duplicates att ta bort
  - Refactoring notes
- **Status:** ⏳ Cleanup pending
- **Senast uppdaterad:** 2025-10-25

**Riskfrågor wizard-struktur:**
- **Steg 1-4:** ALLTID visas (statiska steg)
  - Steg 1: Grundläggande information (implementerad i RiskFragorSlide.jsx)
  - Steg 2: Utländska transaktioner (behöver implementeras)
  - Steg 3: Kunder & Affärspartners (behöver implementeras)
  - Steg 4: Betalningar & Transaktioner (behöver implementeras)
- **Steg 5+:** Konfigurerbara via config.json (byrå-specifika frågor, framtida feature)

**Raderade filer:**
- `RISKFRAGOR_NY_STRUKTUR.md` - Raderad 2025-10-27 (beskrev conditional rendering som inte längre används)

---

## 6. Build Artifacts

### Sökväg: `build/`

**Compiled PDFs:**
- `Onboarding_app_ny.pdf` (253KB) - Huvudspec för onboarding ✅ CURRENT
- `API_Endpoints_ContentSlides.pdf` (514KB) - API content endpoints ✅ CURRENT
- `Admin_Dashboard_Spec.pdf` (166KB) - Admin dashboard spec ✅ CURRENT
- `uppdragsavtal_exempel.pdf` (100KB) - Uppdragsavtal template ✅ CURRENT

**Legacy PDFs (kan raderas):**
- `onboarding_app.pdf` (240KB) - Legacy onboarding spec
- `API_Endpoints_Spec.pdf` (328KB) - Legacy API spec
- `01FS 2024-20.pdf` (130KB) - DUPLIKAT (finns i docs/compliance/01FS_2024-20.md)

**Build files (LaTeX artifacts):**
- `*.aux` - Auxiliary files
- `*.log` - Build logs
- `*.out` - Hyperref output
- `*.toc` - Table of contents
- `*.backup` - Backup files (kan raderas)

---

## 7. Status per dokument

| Document | Source (LaTeX) | PDF | Status | Senast uppdaterad |
|----------|---------------|-----|--------|-------------------|
| **Onboarding spec** | Onboarding_app_ny.tex (91KB) | ✅ 253KB | ✅ Current | 2025-10-25 |
| **API Content** | API_Endpoints_ContentSlides.tex (83KB) | ✅ 514KB | ✅ Current | 2025-10-25 04:00 |
| **Admin Dashboard** | Admin_Dashboard_Spec.tex (31KB) | ✅ 166KB | ✅ Complete | - |
| **Uppdragsavtal** | uppdragsavtal_exempel.tex (6KB) | ✅ 100KB | ✅ Template | - |
| **API Auth** | API_Endpoints_Auth.tex (162KB) | ❌ | ⏳ Draft | 2025-10-24 |
| **API Sektion 2A** | ...SEKTION2A_NY.tex (40KB) | ❌ | ⏳ Draft | 2025-10-25 |

**Flyttade/raderade:**
- `onboarding_app.tex` → Flyttad till ~/Documents/PENGATVÄTTS_KURSEN/ (2025-10-27)
- `latex/` folder → Innehåll flyttat till specifications/ (2025-10-27)

---

## 8. Build Process

### Kompilera LaTeX till PDF

```bash
cd tic-tac-toe-app/docs/specifications

# Kompilera en specifik .tex-fil
pdflatex Onboarding_app_ny.tex

# Full build (3 passes för references)
pdflatex Onboarding_app_ny.tex
pdflatex Onboarding_app_ny.tex
pdflatex Onboarding_app_ny.tex

# Flytta PDF till build/
mv *.pdf build/

# Städa auxiliary files
mv *.aux *.log *.out *.toc build/
```

### Dependencies

- LaTeX distribution (TeX Live, MiKTeX, etc.)
- Beamer package
- Hyperref package
- Standard LaTeX packages

---

## 9. Relation till Implementation

### UI Components → LaTeX Specs

**Mapping mellan slides i LaTeX och React komponenter:**

| LaTeX Slide (Onboarding_app_ny.tex) | React Component | Status |
|------------|----------------|--------|
| Hero Slide | HeroSlide.jsx | ✅ Implementerad |
| Login Slide | LoginSlide.jsx | ✅ Implementerad |
| Företagssökning | FöretagssökningSlide.jsx | ✅ Implementerad |
| Riskbedömning | RiskbedömningSlide.jsx | ✅ Implementerad |
| Resultat | ResultSlides/*.jsx | ✅ Implementerade |
| ... | ... | ... |

**Total:** 30+ slides definierade i LaTeX → 30+ React komponenter

### API Specs → Backend Endpoints

**Mapping mellan LaTeX API specs och FastAPI endpoints:**

| LaTeX Spec | FastAPI Endpoint | Status |
|-----------|-----------------|--------|
| Auth - Register | POST /register | ✅ Implementerad |
| Auth - Login | POST /login | ✅ Implementerad |
| Auth - Confirm Email | GET /confirm-email | ✅ Implementerad |
| Content - Save Form | POST /save-form-data | ⏳ Under utveckling |
| Content - Get Results | GET /results/{user_id} | ⏳ Under utveckling |

---

## 10. Nästa steg

1. ✅ **INDEX.md uppdaterad för specifications/** (2025-10-27)
2. ✅ **latex/ mapp avskaffad** - Innehåll flyttat till specifications/ (2025-10-27)
3. ✅ **Filnamn korrigerat** - Onboardin_app_ny.tex → Onboarding_app_ny.tex (2025-10-27)
4. ⏳ **Radera legacy PDFs i build/** - onboarding_app.pdf, API_Endpoints_Spec.pdf, 01FS 2024-20.pdf
5. ⏳ **Kompilera API_Endpoints_Auth.tex** - Färdigställ auth spec
6. ⏳ **Kompilera API_Endpoints_ContentSlides_SEKTION2A_NY.tex** - Färdigställ sektion 2A
7. ⏳ **Cleanup riskfrågor** - Följ BEAMER_RISKFRAGOR_STADNING.md
8. ⏳ **Synkronisera slide numbering** - Verifiera SLIDE_NUMBERING_SYNC.md
9. ⏳ **Implementera PostgreSQL schema** - Enligt POSTGRES_UUID_ARKITEKTUR.md
10. ⏳ **Generera uppdragsavtal** - Automatisk PDF-generering från template

---

## 11. Relaterade dokument

**Compliance:**
- [docs/compliance/](../compliance/) - KYC/AML compliance documentation

**API Integration:**
- [external_apis/roaring/](../../external_apis/roaring/) - Roaring.io integration specs
- [external_apis/Bolagsverket/](../../external_apis/Bolagsverket/) - Bolagsverket integration

**Project Management:**
- [docs/PROJECT/](../PROJECT/) - Project roadmap och status

---

**Slut på INDEX. Alla tekniska specifikationer i projektet är listade ovan.**
