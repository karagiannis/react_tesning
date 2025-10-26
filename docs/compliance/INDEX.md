# Compliance Documentation - INDEX

**Princip:** Det som inte finns i detta index FINNS INTE!
**Skapad:** 2025-10-26
**Senast uppdaterad:** 2025-10-26 01:23

---

## 1. Översikt

**Syfte:** Dokumentation för efterlevnad av svenska penningtvättslagar (PML) och KYC/AML-rutiner

**Målgrupp:** Redovisningsbyråer som använder Celestial Onboarding App

**Lagstiftning:**
- Penningtvättslagen (2017:630)
- Finansinspektionens föreskrifter och allmänna råd (FFFS 2024:20)

---

## 2. Dokument

### `metod_riskbedömning_kund.pdf` (250KB)
- **Titel:** Metod för riskbedömning av kund
- **Syfte:** Guide för hur redovisningsbyråer ska bedöma risk hos nya kunder
- **Innehåll:**
  - Riskfaktorer enligt PML (kap 3)
  - Riskpoängsystem
  - Kategorisering: Låg / Normal / Hög risk
  - Skärpt kundkännedom (Enhanced Due Diligence) för högrisk
- **Relevans för Celestial:** 🔴 CRITICAL - Detta dokument utgör grunden för Celestials riskmotor
- **Status:** ✅ Implementerad i frontend (riskfrågor) och under utveckling i backend
- **Implementation:**
  - Riskfrågor i slides (components/Slides/RiskbedömningSlide.jsx)
  - Risk scoring logic (ska implementeras i backend)

### `rutin_lopande_kyc_ej_bokforingsnara.pdf` (154KB)
- **Titel:** Rutin för löpande kundkännedom (ej bokföringsnära tjänster)
- **Syfte:** Rutiner för kontinuerlig övervakning av befintliga kunder
- **Innehåll:**
  - Årlig översyn av kunddata
  - Triggers för omprövning (väsentliga förändringar)
  - Uppdatering av riskbedömning
  - Dokumentationskrav
- **Relevans för Celestial:** 🟡 IMPORTANT - Framtida feature för löpande KYC
- **Status:** ⏳ Ej implementerad - planerad för v2.0
- **Användningsfall:**
  - Automatiska påminnelser för årlig översyn
  - Detektering av förändringar i Bolagsverket-data (styrelse, UBO, etc.)
  - Re-scoring av risk vid väsentliga förändringar

### `rutin_riskkontroll_bokforingsdata.pdf` (182KB)
- **Titel:** Rutin för riskkontroll av bokföringsdata
- **Syfte:** Rutiner för att identifiera misstänkta transaktioner i bokföringen
- **Innehåll:**
  - Röda flaggor i bokföringsdata
  - Atypiska transaktionsmönster
  - Rapporteringsskyldighet till Finanspolisen
  - Dokumentationskrav
- **Relevans för Celestial:** 🟢 NICE-TO-HAVE - Kompletterande feature för bokföringsassistans
- **Status:** ⏳ Ej implementerad - kräver Skatteverket API-integration
- **Användningsfall:**
  - Automatisk analys av bokförda transaktioner (via Skatteverket API)
  - Flagga misstänkta mönster (stora kontantuttag, utländska transaktioner, etc.)
  - Generera rapporter för manuell granskning

---

## 3. Lagstiftningsreferenser

### Penningtvättslagen (2017:630)

**Relevanta kapitel för Celestial:**

- **Kap 3** - Riskbedömning och kundkännedom
  - § 6: Identifiera verklig huvudman (UBO)
  - § 18: Skärpt kundkännedom för PEP (Politically Exposed Persons)
  - § 19: Skärpt kundkännedom för högrisk

- **Kap 4** - Löpande uppföljning
  - § 1: Kontinuerlig övervakning av kundrelation
  - § 2: Uppdatering av kundkännedom

- **Kap 5** - Förenklad kundkännedom
  - § 1: När förenklad kundkännedom får tillämpas

### FFFS 2024:20 (Finansinspektionens föreskrifter)

**Dokument:** `build/01FS 2024-20.pdf` (132KB) - Finns i [docs/specifications/latex/build/](../specifications/latex/build/)

**Innehåll:**
- Detaljerade krav för verksamhetsutövare
- Riskklassificering
- Dokumentationskrav
- Internkontroll

**Relevans:** 🔴 CRITICAL - Primär regelverk för compliance

---

## 4. Implementation i Celestial

### Färdigimplementerat

✅ **Riskbedömningsfrågor** - Baserat på `metod_riskbedömning_kund.pdf`
- Slides: RiskbedömningSlide.jsx
- Frågor om:
  - Verksamhetsland
  - Bransch (SNI-kod från Bolagsverket)
  - Omsättning
  - Ägarstruktur
  - Internationella transaktioner

✅ **UBO-identifiering** - Enligt PML 3 kap 6 §
- Integration med Roaring.io Beneficial Owners API
- Automatisk identifiering av verkliga huvudmän

✅ **PEP-screening** - Enligt PML 3 kap 18 §
- Integration med Roaring.io PEP Screening API
- Flaggar om kund/UBO är PEP

✅ **Sanktionslistor** - AML compliance
- Integration med Roaring.io Sanctions Lists API
- Kontroll mot EU, OFAC, UN, UK, Swiss listor

✅ **Näringsförbud** - Juridiskt hinder
- Integration med Roaring.io Business Prohibition API
- Automatisk avvisning vid aktivt näringsförbud

### Under utveckling

⏳ **Risk scoring engine** - Backend implementation
- Beräkning av total riskpoäng (0-100)
- Kategorisering: Låg / Normal / Hög
- Automatisk trigger för skärpt KYC vid hög risk

⏳ **Dokumentationsgenerering**
- PDF-rapport med KYC-data
- Lagring av riskbedömning
- Audit trail för compliance

### Planerat (v2.0)

❌ **Löpande kundkännedom** - Baserat på `rutin_lopande_kyc_ej_bokforingsnara.pdf`
- Årliga översyner
- Automatisk detektering av förändringar
- Re-screening mot uppdaterade sanktionslistor

❌ **Bokföringsanalys** - Baserat på `rutin_riskkontroll_bokforingsdata.pdf`
- Integration med Skatteverket API
- Analys av transaktionsmönster
- Flagga misstänkta transaktioner

---

## 5. Dataflöde: Compliance Check

```
1. Användare anger org.nr
   ↓
2. Hämta företagsdata (Bolagsverket/Roaring)
   ↓
3. Hämta UBO (Roaring Beneficial Owners API)
   ↓
4. Screening parallellt:
   - Sanctions (företag + UBO)
   - PEP (UBO)
   - Business Prohibition (styrelse + UBO)
   ↓
5. Riskbedömningsfrågor (manuell input)
   ↓
6. Risk scoring (automatisk beräkning)
   ↓
7. Resultat:
   - ACCEPT (låg/normal risk)
   - ENHANCED (hög risk - skärpt KYC)
   - REJECT (sanctions hit / näringsförbud)
```

---

## 6. Riskpoängsystem

**Baserat på:** `metod_riskbedömning_kund.pdf`

### Riskfaktorer och poäng

| Faktor | Låg risk (0p) | Normal risk (1-2p) | Hög risk (3-5p) |
|--------|--------------|-------------------|----------------|
| **Verksamhetsland** | Sverige, EU | EES, USA | Högriskländer (FATF) |
| **Bransch** | Standard | Kontantintensiv | Crypto, gambling, vapen |
| **Omsättning** | < 1 MSEK | 1-10 MSEK | > 10 MSEK |
| **Ägarstruktur** | Tydlig, svenskt | Komplex, 1-2 lager | > 2 ägarlager, offshore |
| **PEP** | Ingen PEP | - | PEP eller nära släkt (+4p) |
| **Sanctions** | Clean | - | Sanktionsträff (REJECT) |
| **Näringsförbud** | Clean | - | Aktivt förbud (REJECT) |

### Kategorisering

- **0-2 poäng:** Låg risk - Standard KYC
- **3-5 poäng:** Normal risk - Standard KYC + extra dokumentation
- **6+ poäng:** Hög risk - Skärpt KYC (Enhanced Due Diligence)
- **Sanctions/Näringsförbud:** REJECT - Ingen affär

---

## 7. Dokumentationskrav

### Vid onboarding (initial KYC)

**Obligatoriskt:**
- ✅ Företagsuppgifter (org.nr, firma, adress) - Automatiskt från Bolagsverket
- ✅ Styrelseledamöter - Automatiskt från Roaring/Bolagsverket
- ✅ Verkliga huvudmän (UBO) - Automatiskt från Roaring
- ✅ Riskbedömning - Automatisk + manuella frågor
- ✅ PEP-screening - Automatiskt från Roaring
- ✅ Sanktionsscreening - Automatiskt från Roaring
- ✅ Näringsförbudskontroll - Automatiskt från Roaring
- ⏳ Uppdragsavtal - Template finns (docs/specifications/latex/build/uppdragsavtal_exempel.pdf)

**Vid hög risk (Enhanced Due Diligence):**
- ❌ Source of funds verification
- ❌ Enhanced monitoring
- ❌ Senior management approval

### Lagringstid

- **Minimum:** 5 år efter avslutad kundrelation (enligt PML)
- **Recommendation:** 7 år (bokföringslagens krav)

---

## 8. Relaterade dokument

**Specifikationer:**
- [docs/specifications/latex/](../specifications/latex/) - LaTeX-specifikationer för UI/UX
- [docs/specifications/latex/build/uppdragsavtal_exempel.pdf](../specifications/latex/build/uppdragsavtal_exempel.pdf) - Template för uppdragsavtal

**API-integration:**
- [external_apis/roaring/](../../external_apis/roaring/) - Roaring.io KYC/AML APIs
- [external_apis/Bolagsverket/](../../external_apis/Bolagsverket/) - Bolagsverket företagsdata

**Projektdokumentation:**
- [docs/PROJECT/](../PROJECT/) - Roadmap och projektstatus

---

## 9. Nästa steg

1. ✅ **INDEX.md skapad för compliance/**
2. ⏳ **Implementera risk scoring engine** - Backend beräkning av riskpoäng
3. ⏳ **PDF-rapportgenerering** - KYC-rapport för compliance-arkivering
4. ⏳ **Uppdragsavtal-template integration** - Automatisk generering från template
5. ⏳ **Enhanced Due Diligence workflow** - Extra steg för högrisk-kunder
6. ⏳ **Audit trail** - Logga alla KYC-beslut för compliance-granskning

---

**Slut på INDEX. All compliance-dokumentation i projektet är listad ovan.**
