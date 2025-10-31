# Celestial Onboarding App - Dokumentation INDEX

**Princip:** Det som inte finns i detta index FINNS INTE!
**Skapad:** 2025-10-28
**Senast uppdaterad:** 2025-10-28

---

## Översikt

Detta är rot-indexet för all dokumentation i Celestial Onboarding App-projektet.

**Struktur:**
```
docs/
├── INDEX.md (detta dokument)
├── compliance/           # Regelefterlevnad (PTL, 01FS, lagar)
├── PROJECT/              # Projektledning, milestones, beslut
├── RISK_SCORE_ALGORITHM/ # Riskbedömningsalgoritmer
├── specifications/       # Tekniska specifikationer (LaTeX, UI/UX)
└── STRATEGI/             # Strategiska beslut (datakällor, API, affärsmodell)
```

---

## 1. Compliance (`/compliance/`)

**Syfte:** Lagtext, föreskrifter, myndighetsdokumentation

**Dokument:**
- `01FS_2024-20.md` (23KB) - Länsstyrelsens föreskrifter
- `nationell_riskbedomning_2020-2021.pdf` (4.1MB) - Samordningsfunktionens rapport
- `vagledning-till-redovisningskonsulter-och-skatteradgivare.pdf` (28 sid) - Polisens vägledning

**Index:** [`compliance/INDEX.md`](./compliance/INDEX.md)

---

## 2. Projekt (`/PROJECT/`)

**Syfte:** Projektledning, milestones, beslut, arkiverade versioner

**Innehåll:**
- Projektplan och tidslinje
- Beslutsloggar
- Arkiverade dokument

**Index:** [`PROJECT/INDEX.md`](./PROJECT/INDEX.md)

---

## 3. Riskbedömning (`/RISK_SCORE_ALGORITHM/`)

**Syfte:** Celestial Risk Engine - algoritmer för automatisk riskbedömning

**Innehåll:**
- Version 3.0 (current)
- Viktningsfaktorer
- Regelmotor

**Index:** [`RISK_SCORE_ALGORITHM/INDEX.md`](./RISK_SCORE_ALGORITHM/INDEX.md)

---

## 4. Specifikationer (`/specifications/`)

**Syfte:** Tekniska specifikationer, UI/UX-design, API-endpoints, konstruktionsdokumentation

**Dokument:**
- `Onboarding_app_ny.tex` (91KB) - Beamer presentation med alla slides
- `CONFIG_STRUCTURE.md` - JSON-konfiguration för byråer
- `LEGAL_TEXTS_STRUCTURE.md` (12KB) - Centraliserad lagtext-databas ⭐
- `LocalStorage.md` (16KB) - useState → localStorage persistens för wizard ⭐ NYT!
- LaTeX build artifacts (PDFs)

**Index:** [`specifications/INDEX.md`](./specifications/INDEX.md)

---

## 5. Strategi (`/STRATEGI/`)

**Syfte:** Långsiktiga strategiska beslut om teknologi, datakällor, affärsmodell

**Dokument:**
- `DATAKÄLLOR_STRATEGI.md` (23KB) - Jämförelse av datakällor (Bolagsverket, Roaring, etc.)
- `BYOK_API_SPECIFICATION.md` (NY) - Bring Your Own Key för stora byråer
- `BANKGIRO_UPPFÖLJNING_UTKAST.md` - Mejl-uppföljning till Bankgirot

**Index:** [`STRATEGI/INDEX.md`](./STRATEGI/INDEX.md)

---

## Externa API:er (`../external_apis/`)

**Syfte:** Integration med externa datakällor

**Tjänster:**
- Bolagsverket
- Roaring.io
- Skatteverket
- SCB

**Index:** [`../external_apis/INDEX.md`](../external_apis/INDEX.md)

---

## Principer

### Dokumentationsprincip
> **"Det som inte finns i INDEX FINNS INTE"**

Varje mapp ska ha ett `INDEX.md` som listar:
- Alla filer i mappen
- Status (aktiv/arkiverad/föråldrad)
- Senast uppdaterad
- Kort beskrivning

### Versionering
- Dokumentation versionshanterats via Git
- Använd semantisk versionering för major changes
- Arkivera föråldrade dokument i `PROJECT/arkiv/`

### Uppdatering
- Updatera INDEX.md vid varje ny/borttagen fil
- Datumstämpla alla ändringar
- Länka mellan relaterade dokument

---

## Kontakt

**Projekt:** Celestial Onboarding App
**Organisation:** Celestial AB
**Git:** `react_tesning` (karagiannis/react_tesning)

