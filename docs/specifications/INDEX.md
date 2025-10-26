# Technical Specifications - INDEX

**Princip:** Det som inte finns i detta index FINNS INTE!
**Skapad:** 2025-10-26
**Senast uppdaterad:** 2025-10-26 03:05

---

## 1. Översikt

**Syfte:** Tekniska specifikationer för Celestial Onboarding App

**Innehåll:**
- LaTeX-specifikationer (Beamer presentations för UI/UX)
- Arkitekturdesign och implementation notes
- Databas-scheman och API-design

---

## 2. LaTeX Specifications

### Sökväg: `latex/`

**Struktur:**
```
latex/
├── *.tex              # LaTeX source files
├── *.md               # Documentation och implementation notes
└── build/             # Compiled PDFs och build artifacts
    ├── *.pdf          # Generated specifications
    ├── *.aux          # LaTeX auxiliary files
    ├── *.log          # Build logs
    ├── *.out          # Hyperref output
    └── *.toc          # Table of contents
```

---

## 3. Specifikationsdokument

### A. Onboarding Flow Specifications (Beamer)

#### `Onboardin_app_ny.tex` (92KB)
- **Format:** Beamer presentation (LaTeX slideshow)
- **Syfte:** Komplett UI/UX-specifikation för onboarding-flödet
- **Innehåll:**
  - Alla slides/sidor i onboarding-processen
  - Layout och designelement
  - Formulärfält och valideringsregler
  - Användarflöde och navigering
  - Visuella mockups
- **Byggt PDF:** `build/Onboardin_app_ny.pdf` (259KB)
- **Status:** ✅ Huvudspecifikation
- **Senast uppdaterad:** 2025-10-25

#### `onboarding_app.tex` (31KB)
- **Format:** Beamer presentation
- **Syfte:** Tidigare version av onboarding spec
- **Byggt PDF:** `build/onboarding_app.pdf` (246KB)
- **Status:** ⏳ Legacy - ersatt av Onboardin_app_ny.tex

### B. API Endpoint Specifications

#### `API_Endpoints_Auth.tex` (165KB)
- **Syfte:** Specifikation för autentiserings-endpoints
- **Innehåll:**
  - OAuth2-flow
  - JWT token management
  - User registration/login
  - Email confirmation
- **Status:** ⏳ Under utveckling
- **Byggt PDF:** Ej kompilerad än

#### `API_Endpoints_ContentSlides.tex` (85KB)
- **Syfte:** Specifikation för content-relaterade endpoints
- **Innehåll:**
  - CRUD för slides
  - Content management
  - Onboarding flow API
- **Byggt PDF:** `build/API_Endpoints_ContentSlides.pdf` (526KB)
- **Status:** ✅ Kompilerad 2025-10-25
- **Senast uppdaterad:** 2025-10-25 04:00

#### `API_Endpoints_ContentSlides_SEKTION2A_NY.tex` (40KB)
- **Syfte:** Sektion 2A - ny struktur för content slides
- **Status:** ⏳ Work in progress
- **Byggt PDF:** Ej kompilerad än

#### `API_Endpoints_Spec.pdf` (336KB)
- **Syfte:** Tidigare API-specifikation (komplett)
- **Status:** ⏳ Legacy spec - används som referens

### C. Admin Dashboard Specification

#### `Admin_Dashboard_Spec.tex` (31KB)
- **Format:** Beamer presentation
- **Syfte:** Admin dashboard UI/UX-specifikation
- **Innehåll:**
  - Dashboard layout
  - User management
  - Analytics och rapporter
  - System settings
- **Byggt PDF:** `build/Admin_Dashboard_Spec.pdf` (170KB)
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
- **Byggt PDF:** `build/uppdragsavtal_exempel.pdf` (102KB)
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
- Refererar till slides 28-30 i Onboardin_app_ny.tex
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

#### `POSTGRES_UUID_ARKITEKTUR.md` (13KB)
- **Syfte:** Databasdesign med PostgreSQL och UUID-nycklar
- **Innehåll:**
  - ER-diagram
  - Table schemas
  - Foreign key relationships
  - UUID vs auto-increment rationale
- **Status:** ✅ Arkitekturdesign klar
- **Implementation:** ⏳ Ej påbörjad (SQLite används för prototyp)

#### `ARBETSSCHEMA_SINGLE_LOOP.md` (13KB)
- **Syfte:** Arbetsflöde för development - single loop iteration
- **Innehåll:**
  - Iterativ utvecklingsprocess
  - Task breakdown
  - Testing workflow
- **Status:** ✅ Development workflow dokumenterad

### Slide Structure och Organization

#### `STRUCTURE_PATTERN_CONTENT_SLIDES.md` (12KB)
- **Syfte:** Standardiserat strukturmönster för content slides
- **Innehåll:**
  - Naming conventions
  - File organization
  - Component structure patterns
- **Status:** ✅ Pattern dokumenterat
- **Senast uppdaterad:** 2025-10-24

#### `SUBSECTION_STRUCTURE_STANDARD.md` (11KB)
- **Syfte:** Standardstruktur för subsections i Beamer
- **Innehåll:**
  - LaTeX subsection patterns
  - Hierarchy rules
  - Cross-references
- **Status:** ✅ Standard etablerad
- **Senast uppdaterad:** 2025-10-25

#### `SLIDE_NUMBERING_SYNC.md` (8KB)
- **Syfte:** Synkronisering av slide-numrering mellan spec och implementation
- **Innehåll:**
  - Numbering scheme
  - Sync-process
  - Troubleshooting
- **Status:** ✅ Dokumenterat

### Risk Assessment och KYC

#### `RISKFRAGOR_NY_STRUKTUR.md` (8KB)
- **Syfte:** Ny struktur för riskbedömningsfrågor
- **Innehåll:**
  - Question flow
  - Risk scoring logic
  - Branching rules
- **Status:** ✅ Struktur etablerad
- **Senast uppdaterad:** 2025-10-24

#### `BEAMER_RISKFRAGOR_STADNING.md` (5KB)
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

---

## 5. Build Artifacts

### Sökväg: `latex/build/`

**Compiled PDFs:**
- `Onboardin_app_ny.pdf` (259KB) - Huvudspec för onboarding
- `onboarding_app.pdf` (246KB) - Legacy onboarding spec
- `API_Endpoints_ContentSlides.pdf` (526KB) - API content endpoints
- `API_Endpoints_Spec.pdf` (336KB) - Legacy API spec
- `Admin_Dashboard_Spec.pdf` (170KB) - Admin dashboard spec
- `uppdragsavtal_exempel.pdf` (102KB) - Uppdragsavtal template
- `01FS 2024-20.pdf` (132KB) - FFFS compliance document

**Build files (LaTeX artifacts):**
- `*.aux` - Auxiliary files
- `*.log` - Build logs
- `*.out` - Hyperref output
- `*.toc` - Table of contents
- `*.backup` - Backup files

---

## 6. Status per dokument

| Document | Source (LaTeX) | PDF | Status | Senast uppdaterad |
|----------|---------------|-----|--------|-------------------|
| **Onboarding spec** | Onboardin_app_ny.tex (92KB) | ✅ 259KB | ✅ Current | 2025-10-25 |
| **API Content** | API_Endpoints_ContentSlides.tex (85KB) | ✅ 526KB | ✅ Current | 2025-10-25 04:00 |
| **Admin Dashboard** | Admin_Dashboard_Spec.tex (31KB) | ✅ 170KB | ✅ Complete | - |
| **Uppdragsavtal** | uppdragsavtal_exempel.tex (6KB) | ✅ 102KB | ✅ Template | - |
| **API Auth** | API_Endpoints_Auth.tex (165KB) | ❌ | ⏳ Draft | 2025-10-24 |
| **API Sektion 2A** | ...SEKTION2A_NY.tex (40KB) | ❌ | ⏳ Draft | 2025-10-25 |
| **Legacy Onboarding** | onboarding_app.tex (31KB) | ✅ 246KB | ⏳ Legacy | - |
| **Legacy API** | - | ✅ 336KB | ⏳ Legacy | - |

---

## 7. Build Process

### Kompilera LaTeX till PDF

```bash
cd tic-tac-toe-app/docs/specifications/latex

# Kompilera en specifik .tex-fil
pdflatex Onboardin_app_ny.tex

# Full build (3 passes för references)
pdflatex Onboardin_app_ny.tex
pdflatex Onboardin_app_ny.tex
pdflatex Onboardin_app_ny.tex

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

## 8. Relation till Implementation

### UI Components → LaTeX Specs

**Mapping mellan slides i LaTeX och React komponenter:**

| LaTeX Slide | React Component | Status |
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

## 9. Nästa steg

1. ✅ **INDEX.md skapad för specifications/**
2. ⏳ **Kompilera API_Endpoints_Auth.tex** - Färdigställ auth spec
3. ⏳ **Kompilera API_Endpoints_ContentSlides_SEKTION2A_NY.tex** - Färdigställ sektion 2A
4. ⏳ **Cleanup riskfrågor** - Följ BEAMER_RISKFRAGOR_STADNING.md
5. ⏳ **Synkronisera slide numbering** - Verifiera SLIDE_NUMBERING_SYNC.md
6. ⏳ **Implementera PostgreSQL schema** - Enligt POSTGRES_UUID_ARKITEKTUR.md
7. ⏳ **Generera uppdragsavtal** - Automatisk PDF-generering från template

---

## 10. Relaterade dokument

**Compliance:**
- [docs/compliance/](../compliance/) - KYC/AML compliance documentation

**API Integration:**
- [external_apis/roaring/](../../external_apis/roaring/) - Roaring.io integration specs
- [external_apis/Bolagsverket/](../../external_apis/Bolagsverket/) - Bolagsverket integration

**Project Management:**
- [docs/PROJECT/](../PROJECT/) - Project roadmap och status

---

**Slut på INDEX. Alla tekniska specifikationer i projektet är listade ovan.**
