# Structure Pattern för Content Slides Endpoints

**Upptäckt:** 2025-10-24  
**Problem:** API_Endpoints_ContentSlides.tex är "all over the place" - saknar disciplinerad struktur  
**Lösning:** Använd SAMMA mönster som API_Endpoints_Auth.tex

---

## Det KORREKTA mönstret (från API_Endpoints_Auth.tex)

### För varje SECTION (t.ex. Landing Page, Riskfrågor Steg 1, etc.):

```latex
\section{[SLIDE-NAMN] (t.ex. Riskfrågor Steg 1)}

\subsection{API-endpoints Sammanfattning}
\begin{itemize}[noitemsep]
  \item \texttt{POST /api/onboarding/\{id\}/riskfragor/steg1} — Beskrivning
  \item \texttt{POST /api/onboarding/\{id\}/riskfragor/steg2} — Beskrivning
  \item \textbf{Antal anrop vid sidladdning:} X
\end{itemize}

\subsection{Översikt}
[Prosaisk beskrivning av vad denna slide gör i onboarding-flödet]

\subsection{Funktionalitet}
\begin{itemize}[noitemsep]
  \item Punkt 1: Vad händer på denna slide
  \item Punkt 2: Vilka UI-element finns
  \item Punkt 3: Villkor/triggers
\end{itemize}

\subsection{localStorage Check och Auth-flöde}
[Om relevant - hur localStorage används på denna slide]

\subsection{Endpoint 1: POST /api/onboarding/\{id\}/riskfragor/steg1}

\subsubsection{Beskrivning}
[En mening om vad endpointen gör]

\subsubsection{Request}
\textbf{Headers:}
\begin{lstlisting}[language=json]
{
  "Authorization": "Bearer <access_token>",
  "Content-Type": "application/json"
}
\end{lstlisting}

\textbf{Body:}
\begin{lstlisting}[language=json]
{
  "field1": "value1",
  "field2": "value2"
}
\end{lstlisting}

\subsubsection{Response - Success (200 OK)}
\begin{lstlisting}[language=json]
{
  "success": true,
  "data": { ... }
}
\end{lstlisting}

\subsubsection{Response - Error (400 Bad Request)}
\begin{lstlisting}[language=json]
{
  "success": false,
  "error": "validation_error",
  "details": { ... }
}
\end{lstlisting}

\subsubsection{Response - Error (401 Unauthorized)}
\begin{lstlisting}[language=json]
{
  "success": false,
  "error": "unauthorized"
}
\end{lstlisting}

\subsubsection{Response - Error (403 Forbidden)}
\begin{lstlisting}[language=json]
{
  "success": false,
  "error": "forbidden",
  "message": "Not your onboarding process"
}
\end{lstlisting}

\subsubsection{Response - Error (404 Not Found)}
\begin{lstlisting}[language=json]
{
  "success": false,
  "error": "not_found"
}
\end{lstlisting}

\subsubsection{Implementation Notes}
\begin{itemize}[noitemsep]
  \item Business logic punkt 1
  \item Validering punkt 2
  \item Externa API-anrop punkt 3
  \item Databas-operationer punkt 4
\end{itemize}

\subsection{Endpoint 2: [NÄSTA ENDPOINT]}
[Samma struktur som Endpoint 1]

\subsection{Frontend Datalagring i Browser}

\subsubsection{localStorage}
\begin{itemize}[noitemsep]
  \item \texttt{onboardingId} - UUID för processen
  \item \texttt{currentStep} - Vilket steg användaren är på
  \item \texttt{riskfragorSteg1} - Sparade svar från Steg 1
\end{itemize}

\subsubsection{Cookies}
[Om relevanta cookies används]

\subsection{Backend - Behandlingshistorik och GDPR}

\subsubsection{Loggade händelser}
\begin{itemize}[noitemsep]
  \item \texttt{riskfragor\_steg1\_submitted} - När användaren skickar in
  \item \texttt{external\_api\_called} - Bolagsverket/SPAR/Roaring anrop
  \item \texttt{triggers\_calculated} - Vilka fördjupningsfrågor triggades
\end{itemize}

\subsubsection{CSV-filer (Mock Database)}
[Under utveckling - hur data sparas i CSV]

\subsection{Databastabeller (Framtida PostgreSQL)}

\textbf{onboarding\_processes:}
\begin{lstlisting}[language=sql]
CREATE TABLE onboarding_processes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  riskfragor_steg1 JSONB,
  riskfragor_steg2 JSONB,
  triggers JSONB,
  current_step INTEGER,
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
\end{lstlisting}

\textbf{external\_api\_responses:}
\begin{lstlisting}[language=sql]
CREATE TABLE external_api_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  onboarding_id UUID NOT NULL REFERENCES onboarding_processes(id),
  api_name VARCHAR(100),
  endpoint VARCHAR(255),
  request_data JSONB,
  response_data JSONB,
  response_code INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
\end{lstlisting}

\subsection{Sammanfattning (Prosatisk beskrivning)}

\subsubsection{Scenario 1: Första gången på Riskfrågor Steg 1}
[Detaljerad beskrivning av flödet]

\subsubsection{Scenario 2: Återkommer till Steg 1 (edit mode)}
[Detaljerad beskrivning av flödet]

\subsubsection{Scenario 3: Triggers aktiverade - går vidare till Steg 2}
[Detaljerad beskrivning av flödet]

\subsubsection{Teknisk Sammanfattning}
[Sammanfattning av tekniska detaljer]
```

---

## Problemet med nuvarande ContentSlides.tex

### ❌ Vad som är fel:

1. **Ingen API-endpoints Sammanfattning** - Vi börjar direkt med \subsubsection{POST /...}
2. **Ingen Översikt** - Ingen prosaisk intro till vad sliden gör
3. **Ingen Funktionalitet-sektion** - Ingen lista över UI-funktioner
4. **Ingen localStorage-sektion** - Hur frontend sparar data
5. **Ingen Backend GDPR/Logging** - Vilka händelser loggas
6. **Ingen Databastabeller-sektion** - Schema saknas
7. **Ingen Sammanfattning med Scenarios** - Ingen walkthrough av faktiska flöden
8. **Business Logic blandad med Response** - Svårt att följa

### Nuvarande struktur (FELAKTIG):
```
\section{Sektion 2: Riskbedömning}
  \subsection{Översikt - Riskfrågor och triggers}
  \subsection{Riskfrågor - Steg 1 (8 grundfrågor)}
  \subsection{API-endpoints för Riskfrågor Steg 1}  ← HÄR BÖRJAR DET
    \subsubsection{POST /api/.../steg1}
      Request Headers, Body, Response...
      Business Logic (mitt i!)
      Databas (mitt i!)
      Externa integrationer (mitt i!)
```

Detta hoppar rakt in i tekniska detaljer utan att sätta context.

---

## KORREKT struktur (SKA VARA):

```
\section{Sektion 2A: Riskfrågor Steg 1}

% ======== ÖVERSIKT ========
\subsection{API-endpoints Sammanfattning}
• POST /api/onboarding/{id}/riskfragor/steg1
• Antal anrop vid sidladdning: 0 (data skickas när användaren klickar "Nästa")

\subsection{Översikt}
[Prosaisk beskrivning av vad Steg 1 gör i onboarding-flödet]

\subsection{Funktionalitet}
• 8 grundfrågor
• Validering av org.nr och personnr
• Automatisk validering mot Bolagsverket, SPAR, Roaring
• Beräkning av triggers för Steg 2
• Conditional routing baserat på triggers

\subsection{localStorage Check och Auth-flöde}
När användaren kommer till denna slide:
1. Kolla om onboardingId finns i localStorage
2. Om JA: Ladda befintligt utkast (optional GET endpoint)
3. Om NEJ: Skapa nytt (kommer från POST /uppdrag)

% ======== ENDPOINTS ========
\subsection{Endpoint 1: POST /api/onboarding/\{onboardingId\}/riskfragor/steg1}

\subsubsection{Beskrivning}
Sparar grundläggande riskfrågor (8 st.), validerar org.nr/personnr mot 
externa API:er, beräknar triggers för fördjupningsfrågor (Steg 2).

\subsubsection{Request}
[Headers + Body]

\subsubsection{Response - Success (200 OK)}
[JSON exempel]

\subsubsection{Response - Error (400 Bad Request)}
[JSON exempel]

\subsubsection{Response - Error (403 Forbidden)}
[JSON exempel - t.ex. personnummer inte VD/firmatecknare]

\subsubsection{Response - Error (404 Not Found)}
[JSON exempel]

\subsubsection{Implementation Notes}
Business logic:
1. Hämta user_id från JWT och verifiera ägarskap
2. Validera org.nr format (XXXXXX-XXXX)
3. Validera personnr format (YYYYMMDD-XXXX)
4. Anropa Bolagsverket API
5. Anropa SPAR
6. Anropa Roaring Beneficial Owner (primary + fallback)
7. Anropa Roaring PEP/Sanctions/Business Prohibition
8. Beräkna triggers för Steg 2
9. Uppdatera onboarding_processes tabell
10. Spara externa API-svar i external_api_responses

Externa API-anrop:
• Bolagsverket: POST /organisationer
• SPAR: POST /personnummer
• Roaring: GET /beneficial-owners/2.1/{orgNr}
• Roaring: GET /alternative-beneficial-owner/1.0/{orgNr}
• Roaring: GET /pep/1.0/{personnr}
• Roaring: GET /sanctions/1.0/{personnr}
• Roaring: GET /businessprohibition/1.0/person/{personnr}

% ======== FRONTEND STORAGE ========
\subsection{Frontend Datalagring i Browser}

\subsubsection{localStorage}
• onboardingId (UUID)
• riskfragorSteg1Draft (autosave medan användaren fyller i)
• currentStep: 2

\subsubsection{Cookies}
Inga specifika cookies för denna slide.

% ======== BACKEND LOGGING ========
\subsection{Backend - Behandlingshistorik och GDPR}

\subsubsection{Loggade händelser}
• riskfragor_steg1_submitted
• bolagsverket_api_called
• spar_api_called
• roaring_beneficial_owner_checked
• roaring_pep_checked
• triggers_calculated

\subsubsection{CSV-filer (Mock Database)}
Under utveckling:
• onboarding_processes.csv
• external_api_log.csv

% ======== DATABASE SCHEMA ========
\subsection{Databastabeller (Framtida PostgreSQL)}

\textbf{onboarding_processes:}
[CREATE TABLE statement]

\textbf{external_api_responses:}
[CREATE TABLE statement]

\textbf{Index:}
[CREATE INDEX statements]

% ======== SCENARIOS ========
\subsection{Sammanfattning (Prosatisk beskrivning)}

\subsubsection{Scenario 1: Första gången - Inga triggers}
1. Användaren kommer från Uppdragsval-sliden
2. localStorage innehåller onboardingId
3. Användaren fyller i 8 frågor
4. Klickar "Nästa"
5. POST /riskfragor/steg1 anropas
6. Backend:
   - Validerar mot Bolagsverket: ✓
   - Validerar mot SPAR: ✓
   - Hämtar VH från Roaring: 2 st. direktägare
   - Checkar PEP: Ingen VH är PEP
   - Beräknar triggers: Alla false
7. Response: nextStep = "/identitetskontroll"
8. Frontend navigerar direkt till Identitetskontroll (hoppar över Steg 2)

\subsubsection{Scenario 2: Triggers aktiverade - Går till Steg 2}
1. Samma som ovan, MEN:
2. Användaren svarar:
   - utlandskaPartners: "Ja, Nigeria"
   - kundTyper.privatpersoner: true
3. Backend beräknar:
   - showUtlandska: true
   - showKontanter: true
4. Response: nextStep = "/riskfragor/steg2"
5. Frontend navigerar till Steg 2 med triggers

\subsubsection{Scenario 3: Validering misslyckas}
1. Användaren anger personnummer som INTE är VD/firmatecknare
2. Backend checkar Bolagsverket:
   - VD: "Erik Eriksson" (196501011234)
   - Användaren angav: "Anna Andersson" (198001011234)
3. Response: 403 Forbidden
4. Frontend visar error: "Du måste vara VD eller firmatecknare"

\subsubsection{Teknisk Sammanfattning}
• Ett enda POST endpoint sparar alla 8 frågor
• Backend gör 7 externa API-anrop (Bolagsverket, SPAR, Roaring x5)
• Svarstid: 3-5 sekunder (många externa anrop)
• Frontend visar loading spinner under tiden
• Triggers beräknas automatiskt baserat på svar
• Conditional routing till antingen Steg 2 eller Identitetskontroll
```

---

## Action Plan för API_Endpoints_ContentSlides.tex

### OMSTRUKTURERA varje Section enligt mönstret:

**Section 1: Uppdragsval** ✅ (redan OK?)
**Section 2A: Riskfrågor Steg 1** ❌ MÅSTE OMARBETAS
**Section 2B: Riskfrågor Steg 2** ❌ MÅSTE OMARBETAS
**Section 3: Identitetskontroll** ⏳ (blockad - väntar på beslut)
**Section 4: Jämförelse** ⏳ (ej påbörjad)
**Section 5: Dokumentation** ⏳ (ej påbörjad)
**Section 6: Ekonomisk analys** ⏳ (ej påbörjad)
**Section 7: Djupgranskning** ⏳ (ej påbörjad)

---

## Varför denna struktur fungerar

### 1. **Progressiv disclosure**
- Börjar med high-level (Sammanfattning, Översikt)
- Går till detaljer (Endpoints med Request/Response)
- Avslutar med implementation (Database, Scenarios)

### 2. **Lätt att navigera**
- Tydliga subsections med konsekventa namn
- En nybörjare kan hitta "Response - Error (400)" direkt
- Kan hoppa till "Scenario 1" för att förstå helheten

### 3. **Komplett dokumentation**
- ALLA aspekter täcks: API, Frontend, Backend, Database, GDPR
- Inget "glöms bort" eftersom strukturen tvingar alla sections

### 4. **Pedagogisk**
- Översikt → Funktionalitet → Teknisk spec → Scenarios
- Teori → Praktik
- "Vad" → "Hur" → "Varför"

---

## BESLUT

**PAUSA Loop 2 arbete på ContentSlides** tills vi omstrukturerat enligt detta mönster.

**Nästa steg:**
1. Användaren godkänner strukturen
2. Vi omarbetar Section 2A (Riskfrågor Steg 1) enligt mönstret
3. Vi fortsätter med Section 2B, 4, 5, 6, 7
4. Vi kommer tillbaka till Section 3 när beslut är tagna

**Eller:** Vi fortsätter med Section 4-7 men med KORREKT struktur från början.

Vad säger användaren?
