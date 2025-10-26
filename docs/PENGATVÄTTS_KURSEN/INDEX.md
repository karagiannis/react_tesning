# Penningtvättskursen - INDEX

**Princip:** Det som inte finns i detta index FINNS INTE!
**Skapad:** 2025-10-26
**Senast uppdaterad:** 2025-10-26 23:04

---

## ⚠️ VIKTIGT - Risk Score Development

Denna mapp innehåller **AKTIV UTVECKLING** av risk score-algoritmen för KYC/AML compliance.

**Iterativ utveckling:**
- v1: metod_riskbedömning_kund.tex
- v2: metod_riskbedömning_kund_v2.tex/pdf
- v3: metod_riskbedömning_kund_v3.tex/pdf (AKTIV)

---

## Dokumentation och PDFer

### Metod riskbedömning (v1)
- `metod_riskbedömning_kund.pdf` (245K) - Version 1
- Baserat på: "Nationell riskbedömning... penningtvätt.pdf"

### Metod riskbedömning (v2)
- `metod_riskbedömning_kund_v2.tex` (25K)
- `metod_riskbedömning_kund_v2.pdf` (342K)
- LaTeX build artifacts: .aux, .log, .out, .toc

### Metod riskbedömning (v3) - AKTIV VERSION
- `metod_riskbedömning_kund_v3.tex` (16K) - **AKTIV UTVECKLING**
- `metod_riskbedömning_kund_v3.pdf` (201K)
- LaTeX build artifacts: .aux, .log, .out, .toc
- **OBS:** v3 finns även i `../Theory/` (duplicate)

### Rutiner (PDFer)
- `rutin_lopande_kyc_ej_bokforingsnara.pdf` (151K) - Löpande KYC-rutiner
- `rutin_riskkontroll_bokforingsdata.pdf` (179K) - Riskkontroll av bokföringsdata

### Integration
- `INTEGRATION_ROARING_OCH_PML_METODIK.md` (28K) - Hur Roaring.io integreras med PML-metodik

---

## SNI-kod data

### SNI 2025-struktur
- `sni-2025-struktur.xlsx` (126K) - SNI-kodlista
- `read_sni.py` (1.4K) - Python-script för att läsa SNI-data
- `read_sni_debug.py` (471B) - Debug-version

**Användning:** För verksamhetskongruens-kontroller i fraud detection

---

## Python virtual environment

### .venv/
**Syfte:** Python virtual environment för SNI-scripts
**OBS:** Bör ligga i .gitignore

---

## 🚨 Duplikationer som behöver städas

### metod_riskbedömning_kund_utanför_mapp.tex
- Duplicate fil (16K)
- Ska troligen raderas

### Zone.Identifier-filer
- Windows-metadata filer från download
- Kan raderas:
  - `*.pdf:Zone.Identifier`
  - `*.tex:Zone.Identifier`
  - `*.xlsx:Zone.Identifier`

### Duplicate i Theory/
- `metod_riskbedömning_kund_v3.tex/pdf/aux/log/out/toc` finns i BÅDE PENGATVÄTTS_KURSEN och Theory
- **Beslut behövs:** Vilken version ska behållas?

---

## Relation till compliance/

**Skillnad:**
- `docs/compliance/` = Färdiga compliance-dokument (PDF:er som lämnats in)
- `docs/PENGATVÄTTS_KURSEN/` = AKTIV UTVECKLING av risk score-algoritm

**Efter v3 är klar:** Flytta färdig PDF till compliance/, behåll .tex här för framtida ändringar

---

## Nästa steg

1. [ ] Radera Zone.Identifier-filer
2. [ ] Radera metod_riskbedömning_kund_utanför_mapp.tex (duplicate)
3. [ ] Besluta: Behåll v3 här ELLER i Theory/ (ej båda)
4. [ ] Flytta .venv/ till .gitignore
5. [ ] När v3 är klar: Flytta PDF till compliance/
6. [ ] Samla SNI-scripts i egen mapp eller flytta till fraud_detection/

---

## Relaterad dokumentation

- [../compliance/INDEX.md](../compliance/INDEX.md) - Färdiga compliance-dokument
- [../Theory/](../Theory/) - Duplicate av v3 (behöver städas)
- [../../tic-tac-toe-server/fraud_detection/](../../tic-tac-toe-server/fraud_detection/) - Fraud detection algoritmer

---

**Det som inte finns i detta index FINNS INTE i PENGATVÄTTS_KURSEN-mappen!**
