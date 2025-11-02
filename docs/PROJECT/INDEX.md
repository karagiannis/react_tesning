# PROJECT - INDEX

**Princip:** Det som inte finns i detta index FINNS INTE!
**Skapad:** 2025-10-26
**Senast uppdaterad:** 2025-11-01 18:35

---

## 🆕 NYA DOKUMENT (2025-11-01)

### SIE_spec_OCR_2025-11-01.md (1845 rader, ~85K)
**Skapad:** 2025-11-01 18:30
**Syfte:** OCR-extraherad SIE-specification ver 4B (37 sidor)
**Plats:** `../SIE_spec_OCR_2025-11-01.md`
**Innehåll:**
- Komplett SIE4-filformat dokumentation
- #DIM, #OBJEKT, #UNDERDIM syntax och exempel
- Hierarkiska dimensioner (avdelning → underavdelning)
- Reserverade dimensionsnummer (1-19)
- Använd för korrekt SIE-parsing i VBA→Python migration

**Teknisk info:**
- Extraherad med olmOCR-2-7B på Google Colab Pro A100 (80GB VRAM)
- ~10 minuter processing-tid
- Markdown-formaterad för AI-konsumtion

### EXTENSIONS_CLAUDE_HANDOFF.md (568 rader, ~27K)
**Skapad:** 2025-11-01 14:47
**Uppdaterad:** 2025-11-01 18:35
**Syfte:** Handoff-dokument för Extensions-Claude migration work
**Plats:** `./EXTENSIONS_CLAUDE_HANDOFF.md`
**Innehåll:**
- VBA→Python migration plan (51 moduler, 513 KB)
- Settings Page implementation spec
- Funktionsmatrix template
- TDD approach och test data
- Referens till SIE_spec_OCR_2025-11-01.md

### EXTENSIONS_CLAUDE_QUICK_START.md (50 rader, ~2K)
**Skapad:** 2025-11-01 14:47
**Syfte:** Entry point för Extensions-Claude
**Plats:** `./EXTENSIONS_CLAUDE_QUICK_START.md`

---

## Översikt

Projektplanering, roadmap och status för Celestial Onboarding App.

---

## Strategidokument

### AFFÄRSSTRATEGI_DUBBEL_VERKSAMHET.md (25K)
**Skapad:** 2025-10-23
**Syfte:** Affärsstrategi för dubbel verksamhet (Onboarding + Fortnox-wrapper)
**Innehåll:** Business case och intäktsmodeller

---

## Compliance

### 01FS_2024-20.md (23K)
**Syfte:** FFFS 2024:20 - Finansinspektionens föreskrifter
**Innehåll:** Regulatoriska krav för penningtvättslagen
**Relation:** Se även `../compliance/` för fler compliance-dokument

---

## API-integration status

### API_STATUS.md (7.7K)
**Skapad:** 2025-10-20
**Flyttad hit:** 2025-10-26
**Syfte:** Spårning av API-integration status och tidslinjer
**Innehåll:**
- Bolagsverket: ✅ PROD KLART (gratis API)
- Skatteverket: ✅ Fullständigt fungerande (test-miljö, 2025-10-20)
- Bankgirot: ⏳ Väntar på svar
- Klarna Open Banking: ❌ Avvisad (kräver PSP-licens)
- Kontakter, nästa steg, tidsplan
- Lessons learned från API-integrationer

### OPEN_BANKING_COMPARISON.md (7.3K)
**Skapad:** 2025-10-20
**Flyttad hit:** 2025-10-26
**Syfte:** Jämförelse av Open Banking-leverantörer
**Innehåll:**
- Open Payments "Build" plan (100 free transactions!)
- Noda (nordisk fokus)
- Tink (enterprise, för dyrt)
- Klarna Open Banking (konsument-fokus)
- Bedömningskriterier och beslutskriterier
- Rekommendation: Fokusera på Bolagsverket + Skatteverket för MVP

---

## Projektplanering

### DEVELOPMENT_ROADMAP.md (5.0K)
**Skapad:** 2025-10-23
**Syfte:** Development roadmap - vad ska implementeras när
**Innehåll:**
- MVP features
- v1.0 features
- v2.0 features
- Tidsestimering

### STATUS_TODO.md (6.9K)
**Skapad:** 2025-10-23
**Syfte:** Aktuell status och todo-lista
**Status:** Kan vara föråldrad - uppdatera regelbundet

### ONBOARDING_UI_CHECKLIST.md (13K)
**Skapad:** 2025-10-21
**Flyttad hit:** 2025-10-26
**Syfte:** Checklist för implementerade UI-komponenter
**Status:** 97% av frontend klart!

---

## Git & GitHub

### GITHUB_PREP.md (11K)
**Skapad:** 2025-10-23
**Syfte:** Förberedelser för GitHub-publicering
**Innehåll:**
- .gitignore setup
- Secrets management
- README struktur
- Licensing

---

## Nästa steg

**Projektplanering:**
1. [ ] Uppdatera STATUS_TODO.md med aktuell status
2. [ ] Granska DEVELOPMENT_ROADMAP.md - stämmer den?
3. [ ] Planera backend-implementation (3% kvar av frontend)

**GitHub:**
1. [ ] Följ GITHUB_PREP.md innan publicering
2. [ ] Säkerställ att .gitignore täcker alla känsliga filer
3. [ ] Skapa public README

---

## Relaterad dokumentation

- [../compliance/INDEX.md](../compliance/INDEX.md) - Compliance dokument
- [../STRATEGI/](../STRATEGI/) - Strategidokument (datakällor, priser)
- [../specifications/](../specifications/) - Tekniska specifikationer

---

**Det som inte finns i detta index FINNS INTE i PROJECT-mappen!**
