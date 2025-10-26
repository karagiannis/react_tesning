# LaTeX Dokumentstruktur för Onboarding-systemet

Datum: 2025-10-24

## Översikt

Projektets LaTeX-dokumentation är uppdelad i **tre separata dokument** för tydlighet och underhållbarhet:

## 📄 Dokumentfiler

### 1. **Onboardin_app_ny.tex** (Beamer Presentation)
- **Format:** Beamer (slideshow)
- **Storlek:** ~91 KB
- **Syfte:** UI/UX-specifikation för onboarding-flödet
- **Innehåll:**
  - Alla slides/sidor i onboarding-processen
  - Layout och designelement
  - Formulärfält och valideringsregler
  - Användarflöde och navigering
  - Visuella mockups
- **Målgrupp:** Designers, frontend-utvecklare, produktägare
- **Kompilering:** `pdflatex Onboardin_app_ny.tex`

**API-referenser:** Korta kommentarer som hänvisar till API_Endpoints_ContentSlides.tex

### 2. **API_Endpoints_ContentSlides.tex** (Article)
- **Format:** Article (dokumentation)
- **Storlek:** ~15 KB (under utveckling)
- **Syfte:** Backend API-specifikation för content slides (med sidebar)
- **Innehåll:**
  - Alla endpoints för onboarding-flödet efter inloggning
  - Request/Response-format (JSON)
  - Business logic och valideringar
  - Externa integrationer (Bolagsverket, SPAR, Roaring.io, BankID)
  - Databastabeller och SQL-queries
  - Error handling och edge cases
- **Sektioner:**
  1. Uppdragsval och introduktion
  2. Riskbedömning (Steg 1 + 2)
  3. Identitetskontroll
  4. Jämförelse mot externa register
  5. Företagsdokumentation
  6. Ekonomisk analys
  7. Djupgranskning och avtal
- **Målgrupp:** Backend-utvecklare, API-designers, integrationsteam
- **Kompilering:** `pdflatex API_Endpoints_ContentSlides.tex`

### 3. **API_Endpoints_Auth.tex** (Article)
- **Format:** Article (dokumentation)
- **Storlek:** ~162 KB
- **Syfte:** Backend API-specifikation för autentiseringssidor (utan sidebar)
- **Innehåll:**
  - Alla endpoints för login/registrering/verifiering
  - Request/Response-format (JSON)
  - JWT token-hantering
  - E-postverifiering
  - Lösenordsåterställning
  - BankID-integration för inloggning
  - Session management
- **Sektioner:**
  1. Hero/Landing page (/)
  2. Registrering (/register)
  3. E-postverifiering (/verify)
  4. Inloggning (/login)
  5. Lösenordsåterställning (/forgot-password, /reset-password)
- **Målgrupp:** Backend-utvecklare, säkerhetsteam, integrationsteam
- **Kompilering:** `pdflatex API_Endpoints_Auth.tex`

## 🔗 Relation mellan dokumenten

```
┌─────────────────────────────┐
│  Onboardin_app_ny.tex       │
│  (Beamer - UI Spec)         │
│                             │
│  ┌───────────────────────┐  │
│  │ Slide: Uppdragsval   │  │─────┐
│  │ [checkboxar, layout] │  │     │
│  └───────────────────────┘  │     │
│                             │     │
│  ┌───────────────────────┐  │     │
│  │ Slide: Riskfrågor    │  │─────┤
│  │ [formulär, fält]     │  │     │
│  └───────────────────────┘  │     │
│                             │     │
│  // API ref kommentarer     │     │
└─────────────────────────────┘     │
                                    │
                                    ▼
         ┌──────────────────────────────────────┐
         │  API_Endpoints_ContentSlides.tex     │
         │  (Article - Backend Spec)            │
         │                                      │
         │  \section{Uppdragsval}              │
         │    \subsubsection{POST /uppdrag}   │
         │      - Request/Response JSON        │
         │      - Business logic               │
         │      - DB queries                   │
         │                                      │
         │  \section{Riskbedömning}            │
         │    \subsubsection{POST /steg1}     │
         │      - Bolagsverket integration     │
         │      - SPAR integration             │
         │      - Triggers beräkning           │
         └──────────────────────────────────────┘

┌─────────────────────────────┐
│  Onboardin_app_ny.tex       │
│  (Beamer - Auth Slides)     │
│                             │
│  ┌───────────────────────┐  │
│  │ Hero: Landing page   │  │─────┐
│  └───────────────────────┘  │     │
│  ┌───────────────────────┐  │     │
│  │ Login: Form          │  │─────┤
│  └───────────────────────┘  │     │
│  ┌───────────────────────┐  │     │
│  │ Register: Form       │  │─────┤
│  └───────────────────────┘  │     │
└─────────────────────────────┘     │
                                    │
                                    ▼
         ┌──────────────────────────────────────┐
         │  API_Endpoints_Auth.tex              │
         │  (Article - Auth Backend Spec)       │
         │                                      │
         │  \section{Registrering}             │
         │    \subsubsection{POST /register}   │
         │      - Email validation              │
         │      - Password hashing              │
         │      - Send verification email       │
         │                                      │
         │  \section{Inloggning}               │
         │    \subsubsection{POST /login}      │
         │      - JWT token generation          │
         │      - Refresh token handling        │
         └──────────────────────────────────────┘
```

## 📝 Dokumentationsmall

Varje API endpoint dokumenteras enligt följande mall:

```latex
\subsubsection{POST /api/endpoint/path}

\textbf{Beskrivning:}\\
En kort beskrivning av vad endpointen gör.

\textbf{Request Headers:}
\begin{lstlisting}[language=json]
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
\end{lstlisting}

\textbf{Request Body:}
\begin{lstlisting}[language=json]
{
  "field1": "value",
  "field2": 123
}
\end{lstlisting}

\textbf{Response (200 OK):}
\begin{lstlisting}[language=json]
{
  "success": true,
  "data": {...}
}
\end{lstlisting}

\textbf{Response (400 Bad Request):}
\begin{lstlisting}[language=json]
{
  "success": false,
  "error": "Felmeddelande",
  "code": "ERROR_CODE"
}
\end{lstlisting}

\textbf{Business Logic:}
\begin{enumerate}[noitemsep]
  \item Validera input
  \item Anropa externa API:er
  \item Beräkna resultat
  \item Spara i databas
  \item Returnera response
\end{enumerate}

\textbf{Databas:}
\begin{lstlisting}[language=sql]
INSERT INTO table_name (...) VALUES (...);
\end{lstlisting}

\textbf{Externa integrationer:}
\begin{itemize}[noitemsep]
  \item API-namn: Endpoint, Auth-metod, Response-format
\end{itemize}
```

## 🔄 Arbetsflöde

1. **Designer/PO:** Arbetar i `Onboardin_app_ny.tex` (Beamer)
   - Designar UI/UX
   - Definierar formulärfält
   - Skapar användarflöde

2. **Backend-utvecklare:** Arbetar i API-dokumenten
   - Läser UI-spec från Beamer
   - Implementerar endpoints i `API_Endpoints_ContentSlides.tex`
   - Dokumenterar Request/Response/Business Logic

3. **Frontend-utvecklare:** Läser båda
   - UI-spec från Beamer för layout
   - API-spec för integration
   - Implementerar React-komponenter

## 🚀 Kompilering

```bash
# Kompilera alla dokument
cd /home/lasse/Documents/Onboarding_App/tic-tac-toe-app/latex

# UI-specifikation (Beamer)
pdflatex Onboardin_app_ny.tex

# Backend API-spec (Content Slides)
pdflatex API_Endpoints_ContentSlides.tex

# Backend API-spec (Auth)
pdflatex API_Endpoints_Auth.tex
```

## 📊 Status

| Dokument | Status | Sektioner klara | TODO |
|----------|--------|-----------------|------|
| **Onboardin_app_ny.tex** | ✅ Komplett struktur | Alla | Finputsning av design |
| **API_Endpoints_ContentSlides.tex** | 🟡 Under utveckling | 2/7 | Sektion 3-7 |
| **API_Endpoints_Auth.tex** | ✅ Komplett | 5/5 | - |

## 📌 Konventioner

- **Sections** (`\section{}`): Huvudsektioner (t.ex. "Riskbedömning", "Identitetskontroll")
- **Subsections** (`\subsection{}`): API-endpoints för en specifik slide
- **Subsubsections** (`\subsubsection{}`): Individuella endpoints (POST, GET, etc.)
- **Kodblock:** Använd `lstlisting` med `language=json` eller `language=sql`
- **Listor:** Använd `enumerate` för steg, `itemize` för punktlistor
- **Färger:** Brand green (#00704A) för länkar och rubriker

## 🔗 Relaterade dokument

- `RISKFRAGOR_NY_STRUKTUR.md` - Specifikation för ny riskfrågestruktur
- `../docs/CONFIG_STRUCTURE.md` - Config.json-struktur
- `../docs/FORTNOX/` - Fortnox API-integration
- `../docs/API_INTEGRATION/Roaring/` - Roaring.io dokumentation

---

**Senast uppdaterad:** 2025-10-24  
**Ansvarig:** Celestial AB Development Team
