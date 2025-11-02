# INDEX - Frontend Structure (tic-tac-toe-frontend)

**Princip:** Detta dokument ger en översikt av hela frontend-projektet
**Skapad:** 2025-10-29
**Senast uppdaterad:** 2025-11-02 20:15

**VIKTIGT:** Backend-koden har flyttats till `tic-tac-toe-server/app/accounting/`

---

## 🆕 SENASTE UPPDATERINGAR (2025-11-01)

**SIE Specification OCR:** `docs/SIE_spec_OCR_2025-11-01.md` (1845 rader)
- Extraherad med olmOCR-2-7B på Google Colab A100
- Komplett SIE4-filformat dokumentation (#DIM, #OBJEKT, hierarkier)
- För Extensions-Claude VBA→Python migration

**Extensions-Claude Handoff:** `docs/PROJECT/EXTENSIONS_CLAUDE_HANDOFF.md` (568 rader)
- VBA→Python migration plan (51 moduler från Excel-bokföringssystem)
- Settings page implementation spec
- Uppdaterad med referens till SIE-spec OCR

**PROJECT INDEX:** `docs/PROJECT/INDEX.md` - Uppdaterat med nya dokument

---

## 📁 Toppnivå struktur

```
tic-tac-toe-app/
├── INDEX.md                    ← DU ÄR HÄR
├── README.md                   ← Projektöversikt, setup-instruktioner
├── package.json                ← Dependencies och scripts
├── vite.config.js              ← Vite build configuration
├── tailwind.config.js          ← Tailwind CSS configuration
├── eslint.config.js            ← Linting rules
├── postcss.config.js           ← PostCSS configuration
├── index.html                  ← Root HTML-fil (Vite entry point)
│
├── src/                        ← Källkod (React-komponenter, state machines)
├── public/                     ← Statiska filer (bilder, fonts)
├── docs/                       ← Projektdokumentation
├── external_apis/              ← API-integration kod (Bolagsverket, Skatteverket)
├── node_modules/               ← NPM dependencies (auto-genererad)
├── venv/                       ← Python virtual environment (backend)
├── __pycache__/                ← Python compiled bytecode (auto-genererad)
└── .git/                       ← Git repository metadata
```

---

## 🎯 Huvudmappar

### `/src/` - Frontend källkod (React)

**Huvudfiler:**
- `main.jsx` - React entry point, render till DOM
- `App.jsx` - Root component, routing setup
- `index.css` - Global CSS (Tailwind imports)
- `style.css` - Projektspecifik CSS
- `test.jsx`, `test2.jsx` - Utvecklingstestfiler

**Undermappar:**
```
src/
├── components/         ← React-komponenter (organiserad i kategorier)
│   ├── Admin/         ← Admin dashboard komponenter
│   ├── Demo/          ← Demo/sandbox komponenter
│   ├── Layout/        ← Layout komponenter (Header, Footer, Navigation)
│   ├── Pages/         ← Full-page komponenter (routes)
│   ├── Panels/        ← Panel/sidebar komponenter
│   ├── Shared/        ← Återanvändbara UI-komponenter (buttons, inputs, etc.)
│   └── Slides/        ← Slide-baserade komponenter (onboarding flow)
│
├── machines/          ← XState state machines (business logic)
│   └── onboardingMachine.js  ← Huvudsaklig onboarding state machine
│
├── services/          ← API services och externa integrationer
│   ├── api.js         ← API client (fetch wrappers)
│   └── validators.js  ← Validation utilities (org.nr, personnr, etc.)
│
├── data/              ← Mock data, constants, config
│   ├── mockData.js              ← Test data för utveckling
│   ├── constants.js             ← Projektconstants (API URLs, etc.)
│   ├── legalTexts.js            ← ⚖️ Centraliserad databas för lagtexter (PTL, 01FS 2024:20)
│   └── mockCompanyAutocomplete.js ← 🏢 Mock Bolagsverket data för företagsnamn autocomplete (15 companies)
│
└── assets/            ← Bilder, ikoner, fonts (importerade i komponenter)
```

---

### `/docs/` - Projektdokumentation

**Struktur:**
```
docs/
├── specifications/              ← Tekniska specifikationer
│   ├── Onboarding_app_ny.tex   ← LaTeX-spec (master specification)
│   ├── RISKFRÅGOR_3STEGS_STRUKTUR.md  ← Riskfrågor reorganisering
│   ├── PDF_GENERATION_GUIDE.md ← 📄 Guide: PDF-generering med lagtexter + Appendix
│   ├── LEGAL_TEXT_CORRECTIONS.md ← ⚖️ Dokumentation av lagtextkorrigeringar
│   ├── API_ENDPOINTS_TEMP_NOTES.md ← 📝 Temporära anteckningar (3-fas utvecklingsplan)
│   └── INDEX.md                ← Index för specifications-mappen
│
├── STRATEGI/                    ← Strategiska beslut
│   ├── INDEX.md                ← Huvudindex (ALLT BÖRJAR HÄR!)
│   ├── BYOK_API_SPECIFICATION.md     ← Bring-Your-Own-Key feature
│   ├── DATAKÄLLOR_STRATEGI.md        ← API kostnadsjämförelse
│   └── BANKGIRO_UPPFÖLJNING_UTKAST.md ← Bankgirot uppföljning
│
├── DEPLOYMENT/                  ← Deployment guides
├── DESIGN/                      ← UI/UX design docs
├── EMAIL/                       ← Email templates
├── FORTNOX/                     ← Fortnox integration docs
└── PROJECT/                     ← Project management docs
```

**Viktiga dokument:**
- `/docs/STRATEGI/INDEX.md` - **HUVUDINDEX** för alla strategidokument
- `/docs/specifications/Onboarding_app_ny.tex` - Master LaTeX-spec
- `/docs/specifications/RISKFRÅGOR_3STEGS_STRUKTUR.md` - Riskfrågor struktur
- `/docs/specifications/PDF_GENERATION_GUIDE.md` - PDF-generering med lagtexter
- `/docs/specifications/LEGAL_TEXT_CORRECTIONS.md` - Dokumenterade lagtextfel och korrigeringar
- `/src/data/legalTexts.js` - **Centraliserad databas för lagtexter**

---

### `/external_apis/` - API-integration kod

**Syfte:** Backend-kod för integration med externa API:er

**Innehåll:**
- Python scripts för Bolagsverket API (filhämtning, parsing)
- Skatteverket OAuth2 + Certificate authentication
- Token caching och error handling
- API test scripts

**Exempel:**
```
external_apis/
├── bolagsverket/
│   ├── fetch_data.py          ← Hämta företagsdata
│   └── parse_xml.py           ← Parsa XML-filer
│
└── skatteverket/
    ├── oauth_client.py        ← OAuth2 autentisering
    ├── skattekonto_api.py     ← Skattekonto API calls
    └── test_connection.py     ← Test API connection
```

---

### `/public/` - Statiska filer

**Innehåll:**
- Favicons (favicon.ico)
- Logo-filer (PNG, SVG)
- Fonts (om inte CDN används)
- robots.txt
- manifest.json (PWA metadata)

**Viktigt:** Filer i `/public/` kopieras direkt till build-output utan processing.

---

## 🚀 NPM Scripts (package.json)

```bash
# Development
npm run dev          # Starta Vite dev server (http://localhost:5173)

# Build
npm run build        # Bygg production bundle (dist/)

# Linting
npm run lint         # Kör ESLint på källkod

# Preview
npm run preview      # Preview production build lokalt

# Mock API (om används)
npm run api          # Starta json-server på port 5000
```

---

## 🎨 Tech Stack Details

### **React 18.3.1**
- Modern React med Hooks (useState, useEffect, useContext)
- React Router DOM 7.9.4 för routing
- Functional components (inga class components)

### **Vite 7.1.7**
- Ultrasnabb dev server med HMR (Hot Module Replacement)
- ES modules-baserad build
- Optimerad production build (code splitting, tree shaking)

### **Tailwind CSS 3.4.18**
- Utility-first CSS framework
- Konfiguration i `tailwind.config.js`
- PurgeCSS aktiverad (tar bort oanvänd CSS i production)

### **Material-UI (MUI) 7.3.4**
- Pre-built React components (buttons, inputs, dialogs)
- Emotion för styled components
- Används selektivt (ej hela appen)

### **XState 5.x** (planerad/pågående)
- State machine för onboarding flow
- Lokaliserad i `/src/machines/`
- Hanterar komplex business logic (steg, validering, villkor)

### **Lucide React 0.546.0**
- Moderna, anpassningsbara ikoner
- Lättare alternativ till Font Awesome
- Tree-shakeable (endast importerade ikoner inkluderas)

### **Recharts 3.3.0**
- React-baserat chart library
- Används för admin dashboard (planerat)
- Visar statistik och metrics

---

## 🗂️ Komponenter struktur (src/components/)

### **Admin/**
Dashboard-komponenter för systemadministratörer:
- Användare management
- API statistics
- System health monitoring

### **Demo/**
Sandbox och demo-komponenter:
- Test interfaces
- API playground
- Exempel-komponenter för utveckling

### **Layout/**
Strukturella komponenter:
- `Header.jsx` - Top navigation bar
- `Footer.jsx` - Footer med länkar
- `Sidebar.jsx` - Sidopanel navigation
- `MainLayout.jsx` - Wrapper för pages

### **Pages/**
Full-page komponenter (mappas till routes):
- `HomePage.jsx` - Landing page
- `OnboardingPage.jsx` - Onboarding wizard
- `DashboardPage.jsx` - User dashboard
- `AdminPage.jsx` - Admin interface
- `NotFoundPage.jsx` - 404 error page

### **Panels/**
Sidopaneler och floating panels:
- `InfoPanel.jsx` - Informationspanel
- `ProgressPanel.jsx` - Progress tracker
- `HelpPanel.jsx` - Hjälpsektion

### **Shared/**
Återanvändbara UI-komponenter:
- `Button.jsx` - Custom button component
- `Input.jsx` - Form input fields
- `Card.jsx` - Card container
- `Modal.jsx` - Modal dialogs
- `Spinner.jsx` - Loading spinners
- `Alert.jsx` - Alert/notification component

### **Slides/**
Slide-baserade komponenter för onboarding flow:
- `IntroSlide.jsx` - Välkomstslide
- `CompanyInfoSlide.jsx` - Företagsinformation
- `RiskAssessmentSlide.jsx` - Riskbedömning
- `IdentityVerificationSlide.jsx` - Identitetskontroll
- `DocumentUploadSlide.jsx` - Dokumentuppladdning
- `SummarySlide.jsx` - Sammanfattning och godkännande

---

## 🔧 State Management Strategi

### **Nuvarande approach:**
- React Context API för global state
- Local component state (useState) för UI state
- Props drilling minimeras genom composition

### **Planerad migration till XState:**
```
src/machines/onboardingMachine.js:
  - States: intro → companyInfo → riskAssessment → identity → documents → summary
  - Guards: Validering per steg
  - Actions: API calls, data persistence
  - Services: Async operations (API fetches)
```

**Fördel med XState:**
- ✅ Synlig state machine (kan visualiseras)
- ✅ Ingen "impossible states" (type-safe transitions)
- ✅ Enklare att testa
- ✅ Bättre debugging (state inspector)

---

## ⚖️ Legal Text Management System (legalTexts.js)

### **Syfte:**
Centraliserad databas för alla lagtexter som refereras i applikationen. Detta säkerställer:
- **Konsekvens:** Samma lagtext används överallt
- **Self-contained:** Varje fråga visar sin egen lagtext (inget "se ovan")
- **PDF-generering:** Automatisk generering av Appendix med fullständiga lagtexter
- **Compliance:** Spårbarhet för Länsstyrelsens tillsyn (01FS 2024:20)

### **Struktur:**
```javascript
export const legalTexts = {
  kontanttransaktioner: {
    id: "PTL_3_6",                    // Unik identifierare för PDF-referens
    title: "Kundkännedom vid kontanttransaktioner",
    law: "Penningtvättslagen (2017:630) 3 kap. 6 §",
    shortText: "...",                  // Kort förklaring för inline visning
    fullText: `...`,                   // Fullständig lagtext för Appendix
    url: "https://www.riksdagen.se/..." // Länk till källan
  },
  hogrisklander: {
    id: "PTL_3_17",
    title: "Skärpta åtgärder vid högriskländer",
    law: "Penningtvättslagen (2017:630) 3 kap. 17 §",
    shortText: "ALLA transaktioner med högriskländer kräver skärpta åtgärder...",
    fullText: `[Fullständig PTL 3 kap. 17 § text]`,
    url: "https://www.riksdagen.se/..."
  }
  // ... fler lagtexter
}
```

### **Användning i komponenter:**
```jsx
import { legalTexts } from '../../data/legalTexts';

// Visa kort lagtext inline
<Alert severity="warning">
  ⚠️ {legalTexts.kontanttransaktioner.law}
  {legalTexts.kontanttransaktioner.shortText}
  Referens: [{legalTexts.kontanttransaktioner.id}] - Se Appendix för fullständig lagtext
</Alert>
```

### **PDF-generering:**
- **Huvuddel:** Korta lagtexter + referenser [PTL_3_6]
- **Appendix:** Fullständiga lagtexter med alla källor
- **Syfte:** Tillsynsdokumentation för Länsstyrelsen Stockholm

**Se:** [docs/specifications/PDF_GENERATION_GUIDE.md](docs/specifications/PDF_GENERATION_GUIDE.md)

### **Korrigerade lagtextfel:**
GitHub Copilot Claude skapade flera felaktiga lagtexter som har korrigerats:
1. ❌ "Kontanthanteringslagen" (lagen finns inte) → ✅ PTL 3 kap. 6 §
2. ❌ "Tillstånd från Skatteverket för kontanter" (felaktigt krav) → ✅ Kundkännedom vid ≥5000 euro
3. ❌ "50%-regel för högriskländer" (ej i PTL) → ✅ ALLA transaktioner kräver skärpta åtgärder

**Se:** [docs/specifications/LEGAL_TEXT_CORRECTIONS.md](docs/specifications/LEGAL_TEXT_CORRECTIONS.md)

---

## 🔐 API Integration Flow

### **Bolagsverket API:**
```
Frontend (React) → Backend (Python Flask/FastAPI) → Bolagsverket API
                                                   ↓
                                              XML Response
                                                   ↓
                                            Parse & Return JSON
                                                   ↓
                                          Frontend renders data
```

**Authentication:** API-nyckel (gratis efter registrering)

### **Skatteverket API:**
```
Frontend (React) → Backend (Python) → OAuth2 Token Service
                                            ↓
                                      Access Token (30 min TTL)
                                            ↓
                                  Skattekonto API (med TLS cert)
                                            ↓
                                      JSON Response
                                            ↓
                                  Frontend renders data
```

**Authentication:** OAuth2 Client Credentials Grant + TLS Mutual Authentication

---

## 📊 Data Flow (Onboarding)

```
1. User Input (organizationsnummer)
         ↓
2. Frontend Validation (format check)
         ↓
3. API Call (Bolagsverket)
         ↓
4. Backend Processing (Python)
         ↓
5. Data Storage (LocalStorage + Backend DB)
         ↓
6. Next Step (XState transition)
         ↓
7. Repeat för varje steg...
         ↓
8. Final Submit (alla data samlas och skickas)
```

---

## 🧪 Testing Strategi (Planerad)

### **Unit Tests:**
- React components (React Testing Library)
- Utility functions (Jest)
- Validators (Jest)

### **Integration Tests:**
- API services (Mock API responses)
- State machine transitions (XState test utilities)

### **E2E Tests:**
- Full onboarding flow (Playwright/Cypress)
- Cross-browser testing

**TODO:** Setup test infrastructure

---

## 🚧 Utvecklingsstatus

### ✅ **KLART:**
- React + Vite project setup
- Tailwind CSS konfiguration
- Basic routing struktur
- Bolagsverket API integration (test)
- Skatteverket OAuth2 authentication (test-miljö)
- LaTeX-specifikation (komplett)
- Dokumentation struktur
- **Centraliserad lagtextdatabas (legalTexts.js)** ✨
- **PDF-generering med Appendix (guide skapad)** 📄
- **Lagtextkorrigeringar (LEGAL_TEXT_CORRECTIONS.md)** ⚖️

### 🔄 **PÅGÅENDE:**
- Slide-baserade onboarding komponenter
- XState state machine implementation
- Admin dashboard
- Real-time validation
- Error handling och retry logic

### 📋 **TODO:**
- **Fix RiskFragorSteg2Slide.jsx:** Ta bort felaktig "50%-regel" för högriskländer ⏳
- **Dynamisk steg 5+ konfiguration:** config.json arkitektur och dokumentation 🔧
- Production deployment
- Byråchef godkännande-flow
- Email notifications (SendGrid)
- GDPR compliance features
- Multi-language support (i18n)
- Comprehensive testing
- Performance optimization

---

## 🎯 Roadmap

### **Q4 2025 (MVP):**
- ✅ Grundläggande onboarding flow
- ✅ Bolagsverket integration
- ✅ Risk assessment (3 steg)
- ⏳ Identity verification
- ⏳ Document upload

### **Q1 2026 (v1.0):**
- Admin dashboard
- Byråchef godkännande
- Email notifications
- Production deployment

### **Q2 2026 (v2.0):**
- BYOK (Bring Your Own Key) för Enterprise
- Roaring.io integration (PEP-screening)
- Advanced reporting
- Multi-tenant support

---

## 📚 Relaterade dokument

**Huvuddokumentation:**
- `/docs/STRATEGI/INDEX.md` - HUVUDINDEX för alla strategidokument
- `/docs/specifications/Onboarding_app_ny.tex` - Master LaTeX-spec
- `README.md` - Projektöversikt och setup

**API-dokumentation:**
- `/docs/API_INTEGRATION/Bolagsverket/` - Bolagsverket docs
- `/docs/API_INTEGRATION/Skatteverket/` - Skatteverket docs

**Strategiska beslut:**
- `/docs/STRATEGI/BYOK_API_SPECIFICATION.md` - Enterprise BYOK feature
- `/docs/STRATEGI/DATAKÄLLOR_STRATEGI.md` - API kostnadsjämförelse
- `/docs/specifications/RISKFRÅGOR_3STEGS_STRUKTUR.md` - Riskfrågor struktur

**Lagtexter och compliance:**
- `/src/data/legalTexts.js` - Centraliserad lagtextdatabas (PTL, 01FS 2024:20)
- `/docs/specifications/PDF_GENERATION_GUIDE.md` - PDF-generering med Appendix
- `/docs/specifications/LEGAL_TEXT_CORRECTIONS.md` - Dokumenterade lagtextfel och fixes

---

## 🔍 Hitta något specifikt?

**Söker efter...**
- **React-komponenter?** → `/src/components/`
- **State machines?** → `/src/machines/`
- **API-kod?** → `/external_apis/` eller `/src/services/`
- **Lagtexter (PTL, 01FS)?** → `/src/data/legalTexts.js` ⚖️
- **Dokumentation?** → `/docs/` (börja med `/docs/STRATEGI/INDEX.md`)
- **Styling?** → `tailwind.config.js` + `/src/index.css`
- **Build config?** → `vite.config.js`, `package.json`
- **LaTeX-spec?** → `/docs/specifications/Onboarding_app_ny.tex`
- **PDF-generering?** → `/docs/specifications/PDF_GENERATION_GUIDE.md` 📄

---

## 💡 Quick Start (för nya utvecklare)

```bash
# 1. Installera dependencies
npm install

# 2. Starta dev server
npm run dev

# 3. Öppna browser
http://localhost:5173

# 4. Läs dokumentation
cat docs/STRATEGI/INDEX.md
cat docs/specifications/RISKFRÅGOR_3STEGS_STRUKTUR.md
```

**Viktiga filer att förstå först:**
1. `src/App.jsx` - Root component och routing
2. `src/machines/onboardingMachine.js` - Business logic
3. `docs/specifications/Onboarding_app_ny.tex` - Komplett spec
4. `package.json` - Dependencies och scripts

---

## 📞 Kontakt och support

**Projektägare:** Lasse (LIA-praktikant, examen December 2025)
**Repository:** GitHub (karagiannis/react_tesning)
**Branch:** main

**Senast uppdaterad:** 2025-01-29

---

## 📝 Ändringslogg (senaste uppdateringar)

**2025-01-29:**
- ✅ Skapade centraliserad lagtextdatabas: `/src/data/legalTexts.js`
- ✅ Fixade "Kontanthanteringslagen"-fel (lagen finns inte) → PTL 3 kap. 6 §
- ✅ Fixade "50%-regel för högriskländer"-fel → PTL 3 kap. 17 § (ALLA transaktioner)
- ✅ Skapade PDF-genereringsguide: `/docs/specifications/PDF_GENERATION_GUIDE.md`
- ✅ Dokumenterade alla lagtextfel: `/docs/specifications/LEGAL_TEXT_CORRECTIONS.md`
- ✅ Uppdaterade komponenter: RiskFragorSteg4Slide.jsx, SkyldigheterSlide.jsx
- ⏳ TODO: Fix RiskFragorSteg2Slide.jsx (50%-regel removal)
- 🔧 TODO: Diskutera config.json arkitektur för dynamisk steg 5+
