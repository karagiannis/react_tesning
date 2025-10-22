# 🚀 Onboarding App - Digital Client Onboarding Platform

> **Modern web application för effektiv kundintroduktion med automatiserad datainsamling från myndighets-API:er**

[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-purple.svg)](https://vitejs.dev/)
[![XState](https://img.shields.io/badge/XState-5.x-orange.svg)](https://xstate.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-teal.svg)](https://tailwindcss.com/)
[![Python](https://img.shields.io/badge/Python-3.x-yellow.svg)](https://python.org/)

---

## 📋 Innehållsförteckning

- [Om Projektet](#-om-projektet)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [API Integrationer](#-api-integrationer)
- [Kom igång](#-kom-igång)
- [Projektstruktur](#-projektstruktur)
- [Dokumentation](#-dokumentation)
- [Utvecklingsstatus](#-utvecklingsstatus)
- [Roadmap](#-roadmap)
- [Licens](#-licens)

---

## 🎯 Om Projektet

**Onboarding App** är en modern webbapplikation utvecklad för att automatisera och effektivisera processen för kundintroduktion (onboarding) för redovisningsbyråer och finansiella tjänster.

### Problemet
Traditionell kundintroduktion är tidskrävande och manuell:
- ❌ Manuell inmatning av företagsuppgifter
- ❌ Upprepade förfrågningar om samma information
- ❌ Risk för felaktig data
- ❌ Lång handläggningstid (dagar/veckor)

### Lösningen
Automatiserad datainsamling via myndighets-API:er:
- ✅ Automatisk hämtning från Bolagsverket
- ✅ Integration med Skatteverket API
- ✅ Guided onboarding flow med XState
- ✅ Real-time validering
- ✅ Modern, responsiv UI

**Resultat:** Snabbare onboarding (minuter istället för dagar), korrekt data, bättre användarupplevelse.

---

## ✨ Features

### Användargränssnitt
- 🎨 **Modern slide-baserad UI** - Intuitivt flöde genom onboarding-processen
- 📱 **Fully responsive** - Fungerar på desktop, tablet och mobil
- ♿ **Accessibility** - WCAG 2.1 kompatibel
- 🌙 **Dark mode support** - Anpassar sig till användarens preferenser

### State Management
- 🤖 **XState state machine** - Robust state management för komplex onboarding-logik
- 🔄 **Automatsparning** - Progress sparas automatiskt
- ↩️ **Undo/redo** - Användare kan navigera fram och tillbaka

### API Integrationer
- 🏢 **Bolagsverket API** - Automatisk hämtning av företagsdata
- 💰 **Skatteverket API** - Skattekontoinformation (test-miljö)
- 🔐 **OAuth2 + Certificate Auth** - Säker autentisering
- ⚡ **Token caching** - Optimerad prestanda

### Datahantering
- ✅ **Real-time validering** - Organisationsnummer, personnummer, email
- 📋 **Stöd för olika företagsformer** - AB, Enskild firma, HB, KB
- 🔄 **Progress tracking** - Visuell progress-bar
- 💾 **Local storage** - Data sparas lokalt under onboarding

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite 5** - Build tool och dev server
- **XState 5** - State machine för komplex business logic
- **Tailwind CSS 3** - Utility-first CSS framework
- **React Hook Form** - Form validation och hantering
- **Lucide React** - Moderna ikoner

### Backend
- **Python 3.x** - Backend runtime
- **Flask/FastAPI** - Web framework (planned)
- **requests-pkcs12** - TLS mutual authentication
- **cryptography** - Certifikat-hantering

### API:er
- **Bolagsverket Värdefulla Datamängder** - Företagsdata (GRATIS)
- **Skatteverket Skattekonto API** - Skatteinformation (TEST)
- **OAuth2 Client Credentials Grant** - Autentisering
- **TLS Mutual Authentication** - Säker kommunikation

### DevOps
- **Git** - Version control
- **GitHub** - Repository hosting
- **ESLint** - Code linting
- **Prettier** - Code formatting (planned)

---

## 🔌 API Integrationer

### ✅ Bolagsverket - Production Ready

**Status:** Fullständigt fungerande i produktionsmiljö

**Tillgänglig data (GRATIS tier):**
- Organisationsnummer
- Företagsnamn
- Adress
- Verksamhetsbeskrivning

**Autentisering:** OAuth2 Client Credentials Grant

📖 **Dokumentation:** [`docs/API_INTEGRATION/Bolagsverket/README.md`](docs/API_INTEGRATION/Bolagsverket/README.md)

### 🧪 Skatteverket - Test Environment

**Status:** Test-miljö fullt fungerande

**Tillgänglig data:**
- Skattekontosaldo
- Transaktionshistorik
- Kundfordringar och leverantörsskulder

**Autentisering:** OAuth2 CCG + TLS Mutual Authentication (Certificate)

**Viktigt:** Kräver .p12 organisationslegitimation från Expisoft (~1800 kr för prod-certifikat)

📖 **Dokumentation:** [`docs/API_INTEGRATION/Skatteverket/KOMPLETT_SETUP_GUIDE.md`](docs/API_INTEGRATION/Skatteverket/KOMPLETT_SETUP_GUIDE.md)

### 📊 API Status

Se [`docs/API_INTEGRATION/API_STATUS.md`](docs/API_INTEGRATION/API_STATUS.md) för fullständig status.

---

## 🚀 Kom igång

### Förutsättningar

- Node.js 18+ och npm
- Python 3.8+
- Git

### Installation

```bash
# 1. Klona repository
git clone https://github.com/karagiannis/onboarding-app.git
cd onboarding-app

# 2. Installera frontend dependencies
npm install

# 3. Installera backend dependencies (Python)
python3 -m venv venv
source venv/bin/activate  # På Windows: venv\Scripts\activate
pip install -r backend/requirements.txt

# 4. Skapa .env fil (mall finns i .env.example)
cp .env.example .env
# Lägg till dina API credentials i .env
```

### Utvecklingsserver

```bash
# Frontend (React/Vite)
npm run dev
# Öppnar http://localhost:5173

# Backend (Python - planned)
cd backend
python main.py
# Startar på http://localhost:5000
```

### Build för produktion

```bash
# Frontend
npm run build
npm run preview  # Testa production build lokalt

# Backend
# Se docs/DEPLOYMENT/DEPLOYMENT_GUIDE.md
```

---

## 📁 Projektstruktur

```
onboarding-app/
│
├── src/                          # Frontend källkod
│   ├── components/               # React komponenter
│   │   ├── Layout/              # Layout komponenter
│   │   ├── Panels/              # Panel komponenter
│   │   ├── Shared/              # Delade komponenter
│   │   └── Slides/              # Slide komponenter
│   ├── machines/                 # XState state machines
│   ├── services/                 # API services
│   ├── data/                     # Mock data
│   ├── assets/                   # Bilder, fonts, etc
│   ├── App.jsx                   # Root component
│   └── main.jsx                  # Entry point
│
├── backend/                      # Backend källkod
│   ├── main.py                   # Flask/FastAPI app
│   ├── requirements.txt          # Python dependencies
│   └── Procfile                  # Deployment config
│
├── docs/                         # Dokumentation
│   ├── API_INTEGRATION/         # API dokumentation
│   │   ├── API_STATUS.md        # Status översikt
│   │   ├── Bolagsverket/        # Bolagsverket docs
│   │   └── Skatteverket/        # Skatteverket docs
│   ├── DEPLOYMENT/              # Deployment guides
│   ├── DESIGN/                  # Design system
│   ├── EMAIL/                   # Email setup
│   ├── FORTNOX/                 # Fortnox integration
│   └── PROJECT/                 # Project management
│
├── latex/                        # LaTeX presentation
│   ├── Onboardin_app_ny.tex     # Huvuddokument
│   └── Onboardin_app_ny.pdf     # Kompilerad PDF
│
├── public/                       # Statiska filer
├── index.html                    # HTML template
├── package.json                  # Node dependencies
├── vite.config.js               # Vite configuration
├── tailwind.config.js           # Tailwind configuration
├── eslint.config.js             # ESLint configuration
├── .gitignore                   # Git ignore rules
└── README.md                    # Denna fil

Note: private/ mappen är gitignored och innehåller credentials och känslig data.
```

---

## 📚 Dokumentation

### API Integration
- **[API Status Översikt](docs/API_INTEGRATION/API_STATUS.md)** - Nuvarande status för alla API-integrationer
- **[Bolagsverket Setup](docs/API_INTEGRATION/Bolagsverket/README.md)** - Komplett guide för Bolagsverket API
- **[Skatteverket Setup](docs/API_INTEGRATION/Skatteverket/KOMPLETT_SETUP_GUIDE.md)** - Komplett guide för Skatteverket API

### Deployment
- **[Deployment Guide](docs/DEPLOYMENT/DEPLOYMENT_GUIDE.md)** - Deploy till production

### Design
- **[Färgguide](docs/DESIGN/FÄRGGUIDE.md)** - Design system och färgpaletter

### Project Management
- **[Development Roadmap](docs/PROJECT/DEVELOPMENT_ROADMAP.md)** - Utvecklingsplan
- **[Status & TODO](docs/PROJECT/STATUS_TODO.md)** - Aktuell status och kommande tasks
- **[GitHub Prep Guide](docs/PROJECT/GITHUB_PREP.md)** - Guide för GitHub organisering

---

## 🔨 Utvecklingsstatus

### Färdigt ✅
- [x] React/Vite frontend setup
- [x] XState state machine implementation
- [x] Tailwind CSS design system
- [x] Slide-baserad onboarding UI (Slides 1-23)
- [x] Bolagsverket API integration (production)
- [x] Skatteverket API integration (test environment)
- [x] OAuth2 authentication flow
- [x] Certificate-based TLS authentication
- [x] Email forwarding setup (Loopia)
- [x] Omfattande dokumentation

### Pågående 🔄
- [ ] Backend API implementation (Flask/FastAPI)
- [ ] Frontend integration med riktiga API:er
- [ ] Remaining slides (24+)
- [ ] Token caching implementation
- [ ] Klarna Kosma utvärdering
- [ ] Expisoft prod-certifikat order

### Planerat 📋
- [ ] Authorization Code Grant (ACG) för BankID
- [ ] Unit tests (Jest/Vitest)
- [ ] E2E tests (Playwright/Cypress)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Docker containerization
- [ ] Deployment till produktion
- [ ] User authentication
- [ ] Database integration
- [ ] Admin dashboard

---

## 🗓️ Roadmap

### v0.1 (MVP - LIA Demo) - Q4 2025
**Mål:** Demonstrera grundläggande onboarding flow med API-integrationer

- ✅ Frontend grundstruktur
- ✅ Bolagsverket API (prod)
- ✅ Skatteverket API (test)
- 🔄 Backend endpoints
- 🔄 Frontend <-> Backend integration
- 📋 Basic error handling

### v0.2 (Prod-Ready) - Q1 2026
**Mål:** Production-ready med säkerhet och prestanda

- 📋 Skatteverket prod-certifikat
- 📋 Skatteverket prod-miljö
- 📋 User authentication
- 📋 Database (PostgreSQL)
- 📋 Proper error handling
- 📋 Logging och monitoring
- 📋 Unit + E2E tests

### v1.0 (First Release) - Q2 2026
**Mål:** Första publika release för riktiga kunder

- 📋 ACG flow med BankID
- 📋 Email notifications
- 📋 PDF-generering (contracts etc)
- 📋 Admin dashboard
- 📋 Customer dashboard
- 📋 Multi-tenant support
- 📋 Full dokumentation

### v2.0 (Extended Features) - Q3 2026+
**Mål:** Utökad funktionalitet

- 📋 Klarna Kosma integration (om relevant)
- 📋 Bankgirot integration
- 📋 Fortnox integration
- 📋 SIE file import/export
- 📋 Analytics dashboard
- 📋 Mobile app?

---

## 🎓 Utvecklat som LIA-projekt

Detta projekt utvecklas som del av LIA-praktik (Lärande i Arbete) inom ramen för Frontend-utveckling med fokus på React och moderna webbteknologier.

**Lärandemål:**
- ✅ Modern React development (hooks, context, state management)
- ✅ XState för komplex state management
- ✅ API integration med OAuth2 och certifikat-autentisering
- ✅ Tailwind CSS och responsive design
- ✅ Git och GitHub workflow
- 🔄 Backend development (Python/Flask)
- 🔄 Full-stack deployment
- 🔄 Testing (unit, integration, E2E)

---

## 🤝 Bidra

Detta är för närvarande ett privat LIA-projekt, men feedback och förslag välkomnas!

För frågor eller diskussioner, kontakta:
- **Email:** lasse@celestial.se
- **GitHub:** [@karagiannis](https://github.com/karagiannis)

---

## 📜 Licens

**[Bestäm licens senare]**

Alternativ:
- MIT License (mest permissiv)
- GPL v3 (open source, kräver open source derivatives)
- Proprietary (closed source, alla rättigheter förbehållna)

---

## 🙏 Tack till

- **Bolagsverket** - För gratis API-tillgång till företagsdata
- **Skatteverket** - För test-miljö och utmärkt API-support (tack Lena!)
- **Expisoft** - För certifikat-support
- **Loopia** - För DNS och email hosting
- **React/Vite/XState communities** - För fantastiska open source tools

---

## 📊 Status Badges

![Development Status](https://img.shields.io/badge/status-active%20development-brightgreen)
![LIA Project](https://img.shields.io/badge/LIA-projekt-blue)
![Version](https://img.shields.io/badge/version-0.1.0-orange)

---

**Utvecklad med ❤️ av Lasse Karagiannis**

*Senast uppdaterad: 2025-10-20*
