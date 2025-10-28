# Compliance Documentation - INDEX

**Princip:** Det som inte finns i detta index FINNS INTE!
**Skapad:** 2025-10-26
**Senast uppdaterad:** 2025-10-27

---

## 1. Översikt

**Syfte:** Dokumentation för efterlevnad av svenska penningtvättslagar (PML) och KYC/AML-rutiner

**Målgrupp:** Redovisningsbyråer som använder Celestial Onboarding App

**Lagstiftning:**
- Penningtvättslagen (2017:630)
- Länsstyrelsens föreskrifter (01FS 2024:20)

---

## 2. Dokument

### `01FS_2024-20.md` (23KB, 700 rader)
- **Titel:** Länsstyrelsen i Stockholms läns föreskrifter och allmänna råd om åtgärder mot penningtvätt och finansiering av terrorism
- **Datum:** Beslutad 27 maj 2024, utkom från trycket 5 juni 2024
- **Omfattning:** Stockholm, Södermanland, Gotland, Västmanland, Uppsala, Jämtland, Västernorrland, Västerbotten, Norrbotten
- **Tillsynsmyndighet:** Länsstyrelsen Stockholm (för Sörmland och uppåt)
- **Innehåll:**
  - Tillämpningsområde för verksamhetsutövare (revisor, redovisningskonsult, advokat, m.fl.)
  - Krav på allmän riskbedömning
  - Rutiner för kundkännedom och löpande uppföljning
  - Dokumentationskrav
  - Rapporteringsskyldighet
- **Relevans för Celestial:** 🔴 CRITICAL - Primärt regelverk för compliance
- **Status:** ✅ Referensdokument för implementation
- **Not:** Andra tillsynsmyndigheter är Länsstyrelsen Västra Götaland och Länsstyrelsen Skåne

### `nationell_riskbedomning_2020-2021.pdf` (4.1MB)
- **Titel:** Nationell riskbedömning av penningtvätt och finansiering av terrorism 2020-2021
- **Utgivare:** Samordningsfunktionen för åtgärder mot penningtvätt och finansiering av terrorism
- **Datum:** Publicerad 2021-04-21
- **Samordnade myndigheter:** 17 organisationer (Bolagsverket, Ekobrottsmyndigheten, Finansinspektionen, Polismyndigheten, Skatteverket, m.fl.)
- **Innehåll:**
  - Riskbedömning av 22 sektorer
  - Högriskaktörer: Finansiella institut, bokförings- och revisionstjänster, företagsmäklare, varuhandeln
  - Konkreta exempel på penningtvätt: Sällanköpsvaror (bilar, båtar, konst, smycken), kontantbetalningar
  - Nationella sårbarheter och trender
- **Relevans för Celestial:** 🟡 HIGH - Auktoritativ källa för riskformuleringar och branschspecifika hot
- **Status:** ✅ Nedladdad för referens i frågeformuleringar
- **Användning:** Konkreta exempel på röda flaggor, branschspecifika risker för bokförings-/revisionsbranschen

### `vagledning-till-redovisningskonsulter-och-skatteradgivare.pdf` (28 sidor)
- **Titel:** Vägledning till redovisningskonsulter och skatterådgivare - Penningtvättslagen och tillhörande författningar
- **Utgivare:** Polismyndigheten
- **Datum:** [Kontrollera PDF för exakt datum]
- **Målgrupp:** Redovisningskonsulter och skatterådgivare (PRIMÄR målgrupp för Celestial!)
- **Innehåll:**
  - **Straffansvar för näringspenningtvätt** (Lag 2014:307 om straff för penningtvättsbrott)
    - § 7: Näringspenningtvätt - "medverkar till en åtgärd som skäligen kan antas vara vidtagen i sådant syfte"
    - Straff: Böter eller fängelse upp till 2 år (ringa brott), 6 mån-6 år (grovt brott)
    - **Nyckelformulering:** "Du behöver inte vara medveten om att pengarna kommer från brottslig verksamhet utan det räcker att du **borde ha insett det**"
  - **Finansiering av terrorism** (Terroristbrottslagen 2022:666)
    - Förbjudet att samla in, tillhandahålla eller ta emot pengar/egendom för terrorism
    - Omfattar även indirekt stöd: utbildning, resekostnader, logi, material, utrustning
  - Skyldigheter enligt PTL (2017:630)
  - Praktisk vägledning för övervakning och kontroll av transaktioner
  - Röda flaggor specifika för redovisningsbranschen
- **Relevans för Celestial:** 🔴 CRITICAL - Primär vägledning för vår exakta målgrupp
- **Status:** ✅ Nedladdad 2025-10-28
- **Användning:** 
  - Använd Polisens formuleringar direkt i "Varför frågar vi detta?"-sektioner
  - Referera till straffansvar för att motivera compliance-krav
  - Konkreta exempel på näringspenningtvätt i redovisningsbranschen
- **Nyckelcitat för app:**
  > "Du kan göra dig skyldig till penningtvätt och finansiering av terrorism. Om du som redovisningskonsult eller skatterådgivare medverkar till en åtgärd som kan antas vara vidtagen för att dölja att pengar eller annan egendom härrör från brott eller för att främja (underlätta) för någon att tillgodogöra sig sådan egendom, riskerar du att dömas för ett brott enligt lagen (2014:307) om straff för penningtvättsbrott. Du behöver inte vara medveten om att pengarna eller annan egendom kommer från brottslig verksamhet utan det räcker att du **borde ha insett det**."

**Risk scoring algorithm:**
- Version 1: `metod_riskbedömning_kund.pdf` (RADERAD - obsolet)
- Version 2: Under utveckling
- Version 3 (Current): Se [docs/RISK_SCORE_ALGORITHM/](../RISK_SCORE_ALGORITHM/) - Celestial Risk Engine v3.0

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

### 01FS 2024:20 (Länsstyrelsens föreskrifter)

**Dokument:** `01FS_2024-20.md` (23KB, 700 rader)

**Tillsynsmyndigheter för penningtvättslagen:**
- **Länsstyrelsen Stockholm** - Sörmland och norrut (Stockholm, Södermanland, Gotland, Västmanland, Uppsala, Jämtland, Västernorrland, Västerbotten, Norrbotten)
- **Länsstyrelsen Västra Götaland** - Västsverige
- **Länsstyrelsen Skåne** - Sydsverige

**Innehåll:**
- Detaljerade krav för verksamhetsutövare (revisor, redovisningskonsult, advokat, m.fl.)
- Riskklassificering
- Dokumentationskrav
- Internkontroll
- Rapporteringsrutiner

**Relevans:** 🔴 CRITICAL - Primärt regelverk för compliance

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
- ✅ Riskbedömning - Automatisk + manuella frågor (Celestial Risk Engine v3.0)
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

**Riskbedömning:**
- [docs/RISK_SCORE_ALGORITHM/](../RISK_SCORE_ALGORITHM/) - Celestial Risk Engine v3.0 (latest)
  - metod_riskbedömning_kund_v3.tex (448 rader) - Algoritm som kombinerar:
    - 30% Statisk KYC-data (företagsuppgifter, bransch, land)
    - 30% Korsvalidering (Bolagsverket vs Roaring)
    - 40% Bokföringsdata (transaktionsmönster, avvikelser)

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

1. ✅ **INDEX.md uppdaterad för compliance/** (2025-10-27)
2. ⏳ **Implementera risk scoring engine** - Backend beräkning av riskpoäng (Celestial Risk Engine v3.0)
3. ⏳ **PDF-rapportgenerering** - KYC-rapport för compliance-arkivering
4. ⏳ **Uppdragsavtal-template integration** - Automatisk generering från template
5. ⏳ **Enhanced Due Diligence workflow** - Extra steg för högrisk-kunder
6. ⏳ **Audit trail** - Logga alla KYC-beslut för compliance-granskning

---

**Slut på INDEX. All compliance-dokumentation i projektet är listad ovan.**
