# SUBSECTION STRUKTUR - STANDARD FÖR ALLA CONTENT SLIDES

**Datum:** 2025-10-24  
**Överenskommelse:** Användare + Agent  
**Gäller för:** API_Endpoints_ContentSlides.tex (alla Sektioner 1-7)

---

## KOMPLETT CHECKLISTA

Varje Section i API_Endpoints_ContentSlides.tex ska följa denna struktur SLAVISKT:

```latex
\section{Sektion [N]: [Slide-namn]}

% ============================================================
% DEL 1: VÅRA ENDPOINTS (Frontend → Backend)
% ============================================================

☐ \subsection{API-endpoints Sammanfattning (Våra endpoints)}
   - Bullet list med alla våra endpoints
   - "Antal anrop vid sidladdning: X"

☐ \subsection{Översikt - När anropas våra endpoints}
   - Prosaisk text: När i användarflödet anropas dessa
   - React route, React komponent, Beamer slide
   - Lista UI-element/frågor om relevant
   - Förklara vad som händer när användaren klickar "Nästa"

% ============================================================
% DEL 2: EXTERNA ENDPOINTS (Backend → Externa API:er)
% ============================================================

☐ \subsection{Externa API-endpoints Sammanfattning}
   - Bullet list med alla externa endpoints
   - "Totalt antal externa anrop: X-Y"

☐ \subsection{Översikt - Varför behövs externa endpoints}
   - PTL-motivering (eller annan lagkrav)
   - Förklara varje extern API:s syfte
   - "Alla externa API-svar sparas i external_api_responses"

% ============================================================
% DEL 3: VÅRA ENDPOINTS - DETALJERAD SPEC
% ============================================================

☐ \subsection{Endpoint 1: [METHOD] /api/[path]}

   ☐ \subsubsection{Beskrivning}
      - En mening om vad endpointen gör

   ☐ \subsubsection{Request}
      - Headers (pseudokod JSON)
      - Body (pseudokod med kommentarer)

   ☐ \subsubsection{Response 200 OK}
      - Success response (huvudvarianten)
      - Om flera success-varianter: 200 OK, 201 Created, 202 Accepted, etc.

   ☐ \subsubsection{Response 200 OK (variant 2)}
      - Om det finns olika 200 OK responses (t.ex. med/utan triggers)

   ☐ \subsubsection{Response 400 Bad Request}
      - Valideringsfel

   ☐ \subsubsection{Response 401 Unauthorized}
      - Om auth krävs och token saknas/ogiltigt

   ☐ \subsubsection{Response 403 Forbidden}
      - Om auktorisering krävs men inte uppfylld

   ☐ \subsubsection{Response 404 Not Found}
      - Om resource inte hittas

   ☐ \subsubsection{Response 500 Internal Server Error}
      - Om relevant (sällan nödvändigt att dokumentera)

   ☐ \subsubsection{Implementation Notes}
      - Flöde (pseudokod med numrerade steg)
      - Valideringsregler (bullet list)
      - Affärslogik/Trigger-logik (bullet list)
      - Kostnad externa API-anrop (om relevant)

☐ \subsection{Endpoint 2: [METHOD] /api/[path]}
   [Upprepa samma struktur som Endpoint 1]

☐ \subsection{Endpoint N: [METHOD] /api/[path]}
   [Osv för varje endpoint...]

% ============================================================
% DEL 4: EXTERNA ENDPOINTS - DETALJERAD SPEC
% ============================================================

☐ \subsection{Extern Endpoint 1: [METHOD] /[path] ([Leverantör])}

   ☐ \subsubsection{Beskrivning}
      - Vad endpointen returnerar
      - Fullständig URL
      - PTL-grund om relevant

   ☐ \subsubsection{Request}
      - Headers (pseudokod)
      - Body (pseudokod om relevant)

   ☐ \subsubsection{Response}
      - Success (200 OK) - olika varianter
      - Error responses om relevanta

   ☐ \subsubsection{Implementation Notes för Response}
      - Hur vi använder responsen (pseudokod)
      - Validering av response
      - Vad händer vid olika outcomes

☐ \subsection{Extern Endpoint 2: [METHOD] /[path] ([Leverantör])}
   [Upprepa samma struktur...]

☐ \subsection{Extern Endpoint N: [METHOD] /[path] ([Leverantör])}
   [Osv för varje extern endpoint...]

% ============================================================
% DEL 5: PERSISTENT LAGRING
% ============================================================

☐ \subsection{Backend Persistent Lagring}
   - SQL schema (CREATE TABLE / ALTER TABLE)
   - Index för performance
   - Update-query (pseudokod)

% ============================================================
% DEL 6: FRONTEND LAGRING
% ============================================================

☐ \subsection{Frontend Datalagring i Browser}

   ☐ \subsubsection{localStorage}
      - Bullet list med varje key
      - Exempel JSON om relevant

   ☐ \subsubsection{Cookies}
      - Bullet list med varje cookie
      - "Inga cookies specifika för denna slide" om ingen

% ============================================================
% DEL 7: GDPR OCH LOGGING
% ============================================================

☐ \subsection{Backend - Behandlingshistorik och GDPR}

   ☐ \subsubsection{Loggade händelser}
      - Bullet list med alla event_types
      - När loggas varje händelse

   ☐ \subsubsection{CSV-filer (Mock Database under utveckling)}
      - Exempel CSV-struktur
      - Vilka filer används

% ============================================================
% DEL 8: DATABASE SCHEMA
% ============================================================

☐ \subsection{Databastabeller (Framtida PostgreSQL)}
   - Hänvisa till "Backend Persistent Lagring" ovan
   - Eller repetera schema om det är komplext
   - Sammanfattning av tabeller och index

% ============================================================
% DEL 9: SCENARIOS (RENODLAT PROSAISK)
% ============================================================

☐ \subsection{Sammanfattning (Prosaisk beskrivning)}

   ☐ \subsubsection{Scenario 1: [Beskrivande titel]}
      - Prosaisk walkthrough av happy path
      - Steg-för-steg vad användaren gör
      - Vad backend gör (med kodexempel inline)
      - Vad frontend visar
      - Outcome

   ☐ \subsubsection{Scenario 2: [Beskrivande titel]}
      - Prosaisk walkthrough av alternativ path
      - T.ex. triggers aktiverade, andra svar

   ☐ \subsubsection{Scenario 3: [Beskrivande titel]}
      - Prosaisk walkthrough av error case
      - T.ex. validering misslyckas

   ☐ \subsubsection{Teknisk sammanfattning}
      - Bullet list: Externa anrop (total)
      - Svarstid
      - Databas-operationer
      - Conditional routing
      - Frontend uppdatering
      - Blockerande fel
      - Icke-blockerande varningar
```

---

## VIKTIGA PRINCIPER

### 1. **Komplett fristående**
Varje Section ska kunna läsas UTAN att ha läst andra Sections. All nödvändig kontext inkluderad.

### 2. **Pseudokod, inte riktig kod**
Alla kodexempel ska vara pseudokod som är lättläst och språkoberoende (förutom SQL som är SQL).

### 3. **Scenarios är prosaiska**
Sista subsection "Sammanfattning" är RENODLAT prosaisk - inga bullet lists, inga tekniska specs. Skriv som en berättelse.

### 4. **Konsekvent namngivning**
- Våra endpoints: "Endpoint 1", "Endpoint 2", etc.
- Externa endpoints: "Extern Endpoint 1", "Extern Endpoint 2", etc.
- Alltid METHOD + path i rubriken

### 5. **PTL-referenser**
Inkludera ALLTID PTL-referenser när externa API:er används för compliance.

### 6. **GDPR-compliance**
Varje Section måste ha "Backend - Behandlingshistorik och GDPR" med loggade händelser.

---

## EXEMPEL PÅ KORREKT STRUKTUR

Se: `API_Endpoints_ContentSlides_SEKTION2A_NY.tex` för fullständigt exempel.

**Kontrollpunkter:**
- ✅ 9 huvudsakliga subsections (DEL 1-9)
- ✅ Varje endpoint har 4 subsubsections (Beskrivning, Request, Response, Implementation Notes)
- ✅ localStorage har bullet list med alla keys
- ✅ Scenarios är prosaiska (3 st + teknisk sammanfattning)
- ✅ Pseudokod används genomgående
- ✅ PTL-referenser finns för externa API:er

---

## AVVIKELSER FRÅN MÖNSTRET

### När kan man hoppa över subsections?

**Endast dessa subsections är OPTIONAL:**

1. **Externa API-endpoints Sammanfattning** - Om inga externa API:er används
2. **Översikt - Varför behövs externa endpoints** - Om inga externa API:er används
3. **DEL 4 (Extern Endpoint 1-N)** - Om inga externa API:er används
4. **Cookies subsubsection** - Om inga cookies används, skriv "Inga cookies specifika för denna slide"

**ALLA andra subsections är OBLIGATORISKA.**

### När kan man lägga till extra subsections?

Endast OM det finns slide-specifik logik som inte passar i befintlig struktur. T.ex:
- **\subsection{localStorage Check och Auth-flöde}** (om det finns komplex auth-logik för denna slide)
- **\subsection{Multi-stage Wizard Logik}** (om det finns komplex wizard-logik)

Lägg till EFTER "Översikt - När anropas våra endpoints" och FÖRE "Externa API-endpoints Sammanfattning".

---

## KVALITETSKONTROLL

Innan du lämnar en Section, kontrollera:

- [ ] Har jag alla 9 huvudsakliga subsections? (minus optionals)
- [ ] Har varje endpoint alla 4 subsubsections?
- [ ] Använder jag pseudokod konsekvent?
- [ ] Är Scenarios prosaiska (inte bullet lists)?
- [ ] Finns PTL-referenser för compliance?
- [ ] Finns GDPR-logging dokumenterad?
- [ ] Är Section komplett fristående?
- [ ] Kan en backend-utvecklare implementera utan att läsa andra Sections?

---

## VERKTYG FÖR VALIDERING

### Snabb-check med grep:

```bash
# Kontrollera att alla obligatoriska subsections finns
grep "\\subsection{API-endpoints Sammanfattning" file.tex
grep "\\subsection{Översikt - När anropas" file.tex
grep "\\subsection{Översikt - Varför behövs" file.tex  # Om externa API:er
grep "\\subsection{Endpoint 1:" file.tex
grep "\\subsection{Backend Persistent Lagring}" file.tex
grep "\\subsection{Frontend Datalagring i Browser}" file.tex
grep "\\subsection{Backend - Behandlingshistorik och GDPR}" file.tex
grep "\\subsection{Databastabeller" file.tex
grep "\\subsection{Sammanfattning" file.tex

# Kontrollera att alla endpoints har subsubsections
grep "\\subsubsection{Beskrivning}" file.tex
grep "\\subsubsection{Request}" file.tex
grep "\\subsubsection{Response 200" file.tex
grep "\\subsubsection{Response 400" file.tex
grep "\\subsubsection{Implementation Notes}" file.tex

# Kontrollera att Scenarios finns
grep "\\subsubsection{Scenario 1:" file.tex
grep "\\subsubsection{Scenario 2:" file.tex
grep "\\subsubsection{Scenario 3:" file.tex
grep "\\subsubsection{Teknisk sammanfattning}" file.tex
```

### Räkna subsections:

```bash
# Ska ge minst 9 (minus optionals)
grep -c "\\subsection{" file.tex
```

---

## UPPDATERINGSHISTORIK

**2025-10-24:** Initial version baserad på överenskommelse med användare.

**Framtida ändringar:** Dokumentera här om vi justerar strukturen.
