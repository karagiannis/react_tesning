# Arbetsschema: Single Loop Focus Method

**Skapad:** 2025-10-24  
**Princip:** EN loop åt gången - INGEN context-switching  
**Mål:** Bli en maskin som går framåt metodiskt, inte beroende av smarthet

---

## 🎯 Core Principle

> **"Vi arbetar i EN loop tills den är KLAR. Då går vi till nästa loop."**

**INTE:**
- ❌ Hoppa mellan frontend och backend
- ❌ Uppdatera 4 dokument samtidigt
- ❌ Context-switcha när vi hittar något intressant
- ❌ "Känna" vad som är trevligast just nu

**UTAN:**
- ✅ Följ loop-ordningen slaviskt
- ✅ Slutför current loop innan nästa
- ✅ Parkera insights i INSIGHTS_*.md
- ✅ Metodiskt framåt som en maskin

---

## 📋 Loop-Ordning (Följ slaviskt)

```
┌─────────────────────────────────────────────────────┐
│ LOOP 1: LaTeX UI/UX Spec (Beamer)                  │
│                                                     │
│ Fil: Onboardin_app_ny.tex                          │
│ Format: Beamer presentation                        │
│ Focus: Användarupplevelse, flöde, slides           │
│ Output: Vad användaren SER och GÖR                 │
│ Verktyg: pdflatex                                  │
│                                                     │
│ Checklist:                                         │
│ [ ] Slide 1: Uppdragsval (KLAR ✅)                 │
│ [ ] Slide 2: Riskfrågor Steg 1                    │
│ [ ] Slide 3: Riskfrågor Steg 2                    │
│ [ ] Slide 4: Identitetskontroll (BankID)          │
│ [ ] Slide 5: Jämförelse externa register          │
│ [ ] Slide 6: Företagsdokumentation                │
│ [ ] Slide 7: Djupgranskning och avtal             │
└─────────────────────────────────────────────────────┘
         ↓ (Alla slides klara? → Nästa loop)
         
┌─────────────────────────────────────────────────────┐
│ LOOP 2: LaTeX Backend API Spec (Article)           │
│                                                     │
│ Fil: API_Endpoints_ContentSlides.tex               │
│ Format: Article (code-friendly)                    │
│ Focus: API kontrakt, Request/Response, PTL-logik   │
│ Output: Backend-specifikation                      │
│ Verktyg: pdflatex + lstlisting                    │
│                                                     │
│ Checklist:                                         │
│ [ ] Sektion 1: POST /uppdrag (KLAR ✅)             │
│ [ ] Sektion 2: POST /riskfragor/steg1 (ONGOING)   │
│ [ ] Sektion 2B: POST /riskfragor/steg2            │
│ [ ] Sektion 3: POST /identitet                    │
│ [ ] Sektion 4: GET /comparison                    │
│ [ ] Sektion 5: POST /upload-chunk                 │
│ [ ] Sektion 6: GET /analysis-status               │
│ [ ] Sektion 7: GET /decision                      │
└─────────────────────────────────────────────────────┘
         ↓ (Alla sektioner klara? → Nästa loop)
         
┌─────────────────────────────────────────────────────┐
│ LOOP 3: React Frontend Implementation              │
│                                                     │
│ Fil: src/components/Slides/*.jsx                   │
│ Format: React components                           │
│ Focus: Implementera enligt Loop 1 spec             │
│ Output: Fungerande UI i webbläsare                 │
│ Verktyg: npm run dev                               │
│                                                     │
│ Checklist:                                         │
│ [ ] UppdragsvalsSlide.jsx (KLAR ✅)                │
│ [ ] RiskFragorSteg1Slide.jsx                      │
│ [ ] RiskFragorSteg2Slide.jsx                      │
│ [ ] IdentitetskontrollSlide.jsx                   │
│ [ ] JamforelseSlide.jsx                           │
│ [ ] DokumentationSlide.jsx                        │
│ [ ] DjupgranskningSlide.jsx                       │
└─────────────────────────────────────────────────────┘
         ↓ (Alla komponenter klara? → Nästa loop)
         
┌─────────────────────────────────────────────────────┐
│ LOOP 4: Python Backend Implementation              │
│                                                     │
│ Fil: backend/main.py                               │
│ Format: FastAPI endpoints                          │
│ Focus: Implementera enligt Loop 2 spec             │
│ Output: Fungerande API                             │
│ Verktyg: python main.py                            │
│                                                     │
│ Checklist:                                         │
│ [ ] POST /api/onboarding/uppdrag                  │
│ [ ] POST /api/onboarding/{id}/riskfragor/steg1   │
│ [ ] POST /api/onboarding/{id}/riskfragor/steg2   │
│ [ ] POST /api/onboarding/{id}/identitet           │
│ [ ] GET /api/onboarding/{id}/comparison           │
│ [ ] POST /api/onboarding/{id}/upload-chunk        │
│ [ ] GET /api/onboarding/{id}/analysis-status      │
│ [ ] GET /api/onboarding/{id}/decision             │
└─────────────────────────────────────────────────────┘
         ↓ (Alla endpoints klara? → Integration testing)
```

---

## 🗂️ Insights Parking Lot System

### Problem
När vi arbetar i en loop och upptäcker något viktigt (t.ex. Roaring's Beneficial Owner-logik), **vill vi inte context-switcha**.

### Lösning
**Skapa INSIGHTS_*.md fil i latex/ mappen**

### Format
```markdown
# INSIGHT: [Titel]

**Upptäckt:** YYYY-MM-DD
**Loop:** [Vilken loop vi var i]
**Relaterar till:** [Sektion/Slide]

## Vad vi upptäckte
[Beskriv upptäckten]

## Varför viktigt
[PTL-relevans, algoritmisk betydelse]

## Algoritm/Pseudokod
```python
# Kod här
```

## TODO (Loop X)
- [ ] Action item 1
- [ ] Action item 2

## Referens
- Länk till dokument/test
```

### Exempel på INSIGHTS-filer
- `INSIGHTS_BENEFICIAL_OWNER.md` - Roaring's två endpoints
- `INSIGHTS_PTL_ALGORITM.md` - Beslutslogik för verklig huvudman
- `INSIGHTS_CELERY_ARCHITECTURE.md` - Långvariga AI-processer
- `INSIGHTS_RED_FLAGS.md` - Flaggor från externa API:er

---

## 📍 Nuvarande Status (2025-10-24)

**Aktiv Loop:** LOOP 2 (Backend API Spec)  
**Fil:** API_Endpoints_ContentSlides.tex  
**Sektion:** 2 - POST /riskfragor/steg1  
**Progress:** 2/7 sektioner klara

### Vad vi GÖR nu:
✅ Dokumentera Roaring Beneficial Owner-anrop  
✅ Business logic för primary vs fallback  
✅ PTL-referens (3 kap 6 § och 8 §)  
✅ Request/Response schemas  

### Vad vi INTE GÖR nu:
❌ Skriva Python-kod  
❌ Uppdatera React-komponenter  
❌ Testa mot live Roaring API  
❌ Hoppa till Loop 3 eller 4  

---

## 🚦 Decision Rules

### När ska jag gå till nästa loop?
**Regel:** När ALLA checkboxes i current loop är ✅

**Exempel:**
- Loop 1: Alla 7 slides beskrivna i Beamer → Gå till Loop 2
- Loop 2: Alla 7 API-sektioner dokumenterade → Gå till Loop 3
- Loop 3: Alla 7 React-komponenter implementerade → Gå till Loop 4
- Loop 4: Alla 7 backend-endpoints implementerade → Integration testing

### När ska jag skapa INSIGHTS-fil?
**Regel:** När du upptäcker något viktigt som:
1. Påverkar algoritm/business logic
2. Kräver implementation i en ANNAN loop
3. Har PTL-relevans
4. Inte passar i current loop's dokument

**Skapa INTE INSIGHTS för:**
- Triviala syntax-fixes
- Typos
- Små justeringar i current loop

### När får jag context-switcha?
**Regel:** ALDRIG inom en loop.

**Undantag:** 
- Om current loop är helt blockerad (t.ex. väntar på extern info)
- Då: Markera som BLOCKED och gå till nästa oberoende loop
- Kom tillbaka till blocked loop när blocker är löst

---

## 📊 Progress Tracking

### Loop 1 Status
| Slide | Beskriven | Klart |
|-------|-----------|-------|
| 1. Uppdragsval | ✅ | ✅ |
| 2. Riskfrågor Steg 1 | ⏳ | - |
| 3. Riskfrågor Steg 2 | ⏳ | - |
| 4. Identitetskontroll | ⏳ | - |
| 5. Jämförelse | ⏳ | - |
| 6. Dokumentation | ⏳ | - |
| 7. Djupgranskning | ⏳ | - |
| **TOTAL** | **1/7** | **14%** |

### Loop 2 Status
| Sektion | Dokumenterad | Klart |
|---------|--------------|-------|
| 1. POST /uppdrag | ✅ | ✅ |
| 2. POST /riskfragor/steg1 | ✅ | ✅ |
| 2B. POST /riskfragor/steg2 | ✅ | ✅ |
| 3. POST /identitet | ⏳ | - |
| 4. GET /comparison | ⏳ | - |
| 5. POST /upload-chunk | ⏳ | - |
| 6. GET /analysis-status | ⏳ | - |
| 7. GET /decision | ⏳ | - |
| **TOTAL** | **3/7** | **43%** |

### Loop 3 Status
| Komponent | Implementerad | Klart |
|-----------|---------------|-------|
| UppdragsvalsSlide.jsx | ✅ | ✅ |
| RiskFragorSteg1Slide.jsx | ⏳ | - |
| RiskFragorSteg2Slide.jsx | ⏳ | - |
| IdentitetskontrollSlide.jsx | ⏳ | - |
| JamforelseSlide.jsx | ⏳ | - |
| DokumentationSlide.jsx | ⏳ | - |
| DjupgranskningSlide.jsx | ⏳ | - |
| **TOTAL** | **1/7** | **14%** |

### Loop 4 Status
| Endpoint | Implementerad | Klart |
|----------|---------------|-------|
| POST /uppdrag | ⏳ | - |
| POST /riskfragor/steg1 | ⏳ | - |
| POST /riskfragor/steg2 | ⏳ | - |
| POST /identitet | ⏳ | - |
| GET /comparison | ⏳ | - |
| POST /upload-chunk | ⏳ | - |
| GET /analysis-status | ⏳ | - |
| GET /decision | ⏳ | - |
| **TOTAL** | **0/7** | **0%** |

---

## 🔧 Verktyg för varje loop

### Loop 1 (LaTeX UI/UX)
```bash
cd /home/lasse/Documents/Onboarding_App/tic-tac-toe-app/latex
pdflatex Onboardin_app_ny.tex
# Öppna PDF och granska slides
```

### Loop 2 (LaTeX Backend API)
```bash
cd /home/lasse/Documents/Onboarding_App/tic-tac-toe-app/latex
pdflatex API_Endpoints_ContentSlides.tex
# Öppna PDF och granska API-spec
```

### Loop 3 (React Frontend)
```bash
cd /home/lasse/Documents/Onboarding_App/tic-tac-toe-app
npm run dev
# Öppna http://localhost:5173
```

### Loop 4 (Python Backend)
```bash
cd /home/lasse/Documents/Onboarding_App/tic-tac-toe-app/backend
python main.py
# Testa med curl eller Postman
```

---

## 🎓 Lärdom: Varför detta fungerar

### Problem med ad-hoc approach:
1. **Mental overhead** - Hålla 4 kontexter samtidigt
2. **Synkroniseringsproblem** - Kod matchar inte spec
3. **Ofullständig implementation** - Hoppar mellan saker
4. **Utmattning** - Känner "vad som är trevligast"

### Fördelar med Single Loop:
1. **En kontext** - Mindre mental belastning
2. **Fullständighet** - Alla delar blir klara
3. **Tydlig spec** - Kod följer dokumentation
4. **Maskinlik framgång** - Metod > Smarthet
5. **Progress-tracking** - Vet exakt var vi är

---

## 📋 Daily Workflow

### Start of Day
1. Läs `ARBETSSCHEMA_SINGLE_LOOP.md`
2. Kolla Progress Tracking - vilken loop är aktiv?
3. Öppna korrekt fil för current loop
4. Fortsätt där vi slutade

### During Work
1. Stanna i current loop
2. När upptäckt → Skapa INSIGHTS_*.md
3. Uppdatera Progress Tracking när klart
4. Commit changes regelbundet

### End of Day
1. Uppdatera Progress Tracking i detta dokument
2. Commit alla ändringar
3. Anteckna: "Nästa gång: Loop X, Sektion Y"

---

## 🚀 Exempel: Dagens Session (2025-10-24)

**Start:**
- Loop: 2 (Backend API Spec)
- Fil: API_Endpoints_ContentSlides.tex
- Sektion: 2 (POST /riskfragor/steg1)
- Status: 50% klar

**Upptäckt:**
- Roaring har två Beneficial Owner endpoints
- Primary (>25%) + Fallback (CEO)
- PTL 3 kap 6 § och 8 §

**Action:**
1. ✅ Skapa INSIGHTS_BENEFICIAL_OWNER.md
2. 🚧 Dokumentera båda endpoints i Sektion 2
3. 🚧 Business logic för primary vs fallback
4. ⏳ Testa schema med pdflatex

**Nästa:**
- Slutför Sektion 2
- Gå till Sektion 2B (Riskfrågor Steg 2)
- Fortsätt Loop 2 tills alla 7 sektioner klara

---

## 🎯 Success Metrics

**Vi lyckas när:**
- ✅ Alla 4 loopar är 100% klara
- ✅ 0 context-switches under arbete
- ✅ Alla INSIGHTS-filer adresserade
- ✅ Integration testing passar
- ✅ UI matchar Loop 1 spec
- ✅ API matchar Loop 2 spec
- ✅ Frontend fungerar enligt Loop 3
- ✅ Backend fungerar enligt Loop 4

**Målet:**
> **"En maskin som bara går framåt, som når målet i styrka av metoden - inte på grund av smartheten."**

---

## 📞 Quick Reference

**Vilken loop är jag i?**
→ Kolla "Nuvarande Status" ovan

**Kan jag hoppa till annan loop?**
→ NEJ (om inte blocked)

**Hittar något intressant?**
→ Skapa INSIGHTS_*.md, fortsätt current loop

**När går jag till nästa loop?**
→ När alla checkboxes i current loop är ✅

**Hur håller jag fokus?**
→ Läs detta dokument varje dag

---

**FÖLJ SCHEMAT SLAVISKT. BLI EN MASKIN. NÅ MÅLET.**
