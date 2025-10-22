# Utvecklingsplan - Lasse's Coding Journey

## 🎯 Fas 1: Onboarding-app (PÅGÅENDE - Deadline: Nov 2025)
**Mål:** Imponera på Fortnox, få API-access

### MVP Features:
- [x] Hero-sektion (mobilanpassad)
- [x] Demo-knapp
- [x] Sidebar med navigation
- [x] Backend med mock Fortnox endpoints
- [ ] 5 huvudslides med content (Marie Wallin-citat, lagparagrafer)
- [ ] Expanderbara info-popups
- [ ] Riskbedömning (baserat på PDF-algoritm)
- [ ] Integration med Bolagsverket filhämtning
- [ ] (Optional) Roaring.io för bankdata

### Deployment:
- Frontend: celestial.se (GitHub Actions) ✅
- Backend: FastAPI på Digital Ocean ✅

---

## 🚀 Fas 2: Bokföringsassistent för Fredrik (Dec 2025 - Jan 2026)
**Mål:** Praktisk lösning för LIA-handledaren

### Quick & Dirty version:
```
Bokföringsunderlag → LLM (via MCP) → Bokföringsposter → Godkänn → Fortnox
```

### Features:
- [ ] Hämta bokföringsunderlag från Fortnox (SIE-export)
- [ ] LLM-integration (OpenAI/Claude via MCP server)
- [ ] Generera bokföringsposter automatiskt
- [ ] Enkel UI för granskning
- [ ] "Godkänn"-knapp → Upload till Fortnox (SIE-import)
- [ ] Loggning av alla AI-genererade poster

### Tech Stack:
- Backend: FastAPI + MCP Server
- LLM: OpenAI API / Anthropic Claude
- Frontend: React (basic, ej fancy)
- Fortnox: Live API-nycklar (privat användning)

### Tidslinje:
- 2 veckor utveckling
- 1 vecka testning med Fredrik
- Iterera baserat på feedback

---

## 📚 Fas 3: Lära dig programmera ordentligt (Feb - Jun 2026)
**Mål:** Från wannabe till riktig utvecklare

### Projekt för inlärning:
1. **Tic-Tac-Toe** (React.org tutorial utvidgad)
   - Multiplayer
   - AI-motståndare (minimax algoritm)
   - Online med WebSockets
   - Tournament mode

2. **Minesweeper**
   - Classic gameplay
   - Different difficulty levels
   - Timer & high scores
   - Mobile touch support

3. **Sudoku**
   - Puzzle generator
   - Solver algorithm
   - Hint system
   - Daily challenges

### Lärandemål per projekt:
- **JavaScript fundamentals**: Closure, async/await, promises
- **React patterns**: Hooks, Context, Custom hooks
- **State management**: Zustand eller Redux
- **Algorithm & Data Structures**: Recursion, graphs, search
- **Testing**: Jest, React Testing Library
- **CSS mastery**: Animations, responsive design
- **Performance**: Memoization, lazy loading

---

## 🏆 Fas 4: Fullskalig Bokföringsapp (Jul 2026 - Dec 2026)
**Mål:** Professionell produkt

### Efter grundläggande kodkunskap:
- Rebuilda Fredrik's quick solution med clean code
- Proper UI/UX design
- Robust error handling
- Security best practices
- Comprehensive testing
- Documentation
- Skalbar arkitektur

### Advanced Features:
- Multi-user support
- Revision history
- AI-driven insights
- Rapportgenerering
- Integration med flera bokföringssystem
- Mobile app (React Native?)

---

## 💡 Viktig insikt från dig:
> "Jag är en programmerare wannabee - inte affärsman"

**Detta är PERFEKT attityd!** 🎓

### Varför detta är bra:
1. **Lär dig fundamentals först** → Bygger solid grund
2. **Små projekt** → Snabba wins, motivation
3. **Gradvis komplexitet** → Tic-tac-toe → Bokföringsapp
4. **Passion för kod** → Inte bara "tjäna pengar"

### Din styrka:
- Du HAR domänkunskap (redovisning, penningtvätt)
- Du VET vad byråer behöver
- Du kan koda + förstå business = Perfekt kombination!

---

## 📅 Konkret tidsplan (Närmaste 6 månader):

### November 2025:
- Vecka 1-2: Färdigställ Onboarding MVP
- Vecka 3: Fortnox API-access
- Vecka 4: Demo för potentiella användare

### December 2025:
- Vecka 1-2: Quick bokföringsassistent för Fredrik
- Vecka 3: Testing & bugfixes
- Vecka 4: Jul 🎄

### Januari 2026:
- Iterera bokföringsassistent med Fredrik
- Samtidigt: Börja Tic-Tac-Toe tutorial

### Februari - April 2026:
- Tic-Tac-Toe → Minesweeper → Sudoku
- En månad per projekt
- Lär dig en ny koncept varje vecka

### Maj - Juni 2026:
- Review och fördjupning
- Advanced React patterns
- Backend-arkitektur

### Juli - December 2026:
- Professionell Bokföringsapp
- Portfolio showcase
- Sök junior developer jobb?

---

## 🎓 Rekommenderade resurser:

### Gratis:
- React.org tutorials (official docs)
- JavaScript.info (complete guide)
- freeCodeCamp (projects)
- Exercism.io (coding exercises)

### Betalt (värt det):
- Frontend Masters (Josh Comeau's courses)
- Wes Bos (React courses)
- Kent C. Dodds (Testing JavaScript)

---

## ✅ Success Metrics:

### Efter 6 månader:
- [ ] Kan bygga en React app från scratch
- [ ] Förstår async JavaScript
- [ ] Kan läsa och debugga andras kod
- [ ] Skriver tester för din kod
- [ ] Förstår Git flow
- [ ] Känner dig bekväm med TypeScript

### Efter 12 månader:
- [ ] Junior developer-nivå
- [ ] Portfolio med 5+ projekt
- [ ] Kan ta freelance uppdrag
- [ ] Förstår system design
- [ ] Kan intervjua för developer-jobb

---

**Viktigt: Fokusera på LÄRANDE, inte resultat!** 🚀

Njut av resan från wannabe till developer! 💪
