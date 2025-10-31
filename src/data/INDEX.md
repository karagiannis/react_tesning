# INDEX - /src/data/

**Princip:** Centraliserade data, mock data, constants och konfiguration
**Skapad:** 2025-10-29
**Senast uppdaterad:** 2025-10-29

---

## 📋 Översikt

Denna mapp innehåller all centraliserad data som används i frontend-applikationen:
- **Lagtexter** (PTL, FFS, etc.) för riskfrågor och PDF-generering
- **Mock data** för utveckling (Fas 1: Frontend + mockdata)
- **Constants** och konfiguration
- **Autocomplete data** för företagssökning

---

## 📁 Filer i denna mapp

### `legalTexts.js`
**Syfte:** ⚖️ Centraliserad databas för alla lagtexter (PTL, 01FS 2024:20)  
**Status:** ✅ KOMPLETT (18+ PTL citations)  
**Innehåll:**
- **legalTexts object:** Alla lagtexter med law, shortTitle, fullText
- **riskFragorSteg2:** Mappning av BLOCK A/B/C frågor → lagtextar
- **riskFragorSteg3:** Mappning av betalningsmetoder, kontanter, valuta, etc. → lagtextar
- **riskFragorSteg4:** Mappning av EDD-frågor → lagtextar
- **getLegalTextsForQuestion(step, questionKey):** Helper function för att hämta lagtextar

**Exempel lagtextar:**
- `ptl_2_1` - Allmän riskbedömning (PTL 2 kap. 1 §)
- `ptl_2_3` - Riskbedömning av kunder (PTL 2 kap. 3 §)
- `ptl_2_5` - Geografisk risk (PTL 2 kap. 5 §)
- `ptl_3_1` - Otillräcklig kundkännedom (PTL 3 kap. 1 §)
- `ptl_3_11` - Kontroll högriskländer (PTL 3 kap. 11 §)
- `ptl_3_16` - Skärpta åtgärder (PTL 3 kap. 16 §)
- `ptl_3_17` - Högrisktredjeland (PTL 3 kap. 17 §)
- `ptl_3_19` - PEP åtgärder (PTL 3 kap. 19 §)
- `ptl_4_1` - Övervakningsskyldighet (PTL 4 kap. 1 §)
- `ptl_5_1` - FIU-anmälning (PTL 5 kap. 1 §)

**Används av:**
- `/src/components/Slides/RiskFragorSteg2Slide.jsx` (BLOCK A/B/C)
- `/src/components/Slides/RiskFragorSteg3Slide.jsx` (Betalningsmetoder)
- `/src/components/Slides/RiskFragorSteg4Slide.jsx` (EDD)

**Relaterad dokumentation:**
- `/docs/specifications/LEGAL_TEXT_CORRECTIONS.md` - Dokumenterade lagtextfel och korrigeringar

---

### `mockCompanyAutocomplete.js`
**Syfte:** 🏢 Mock data för företagsnamn autocomplete (Bolagsverket "värdefulla datamängder")  
**Status:** ✅ KOMPLETT (15 sample companies)  
**Innehåll:**
- **mockCompanies:** Array med 15 företag (id, name, orgNr, stad, lan)
- **searchCompanies(query):** Sök företag efter namn/orgNr/stad (max 10 results, min 2 chars)
- **getCompanyByOrgNr(orgNr):** Hämta företagsdetaljer via organisationsnummer

**Exempel företag:**
- IKEA of Sweden AB (556074-7551) - Älmhult, Kronobergs län
- Volvo Personvagnar AB (556074-3089) - Göteborg, Västra Götalands län
- Spotify Technology S.A. (556703-7485) - Stockholm, Stockholms län

**Simulerar endpoint:** `GET /api/companies/search?q={query}`

**Används av:**
- `/src/components/Slides/RiskFragorSlide.jsx` (Steg 1 - företagssökning)

**Development plan:**
- **Fas 1:** Mock data i frontend (PÅGÅR)
- **Fas 2:** Server med lokalt lagrad Bolagsverket ZIP-fil
- **Fas 3:** Real-time Bolagsverket API (om tillgänglig)

**Relaterad dokumentation:**
- `/docs/specifications/API_ENDPOINTS_TEMP_NOTES.md` - 3-fas utvecklingsplan
- `/Bolagsverket/README.md` - Bolagsverket API dokumentation

---

### `mockEconomicData.js`
**Syfte:** 📊 Mock ekonomisk data (budget, prognos, etc.)  
**Status:** ⚠️ OKLAR (behöver granskning)  
**Innehåll:** (Specificera innehåll efter granskning)

---

### `mockRoaringData.js`
**Syfte:** 🦁 Mock data för Roaring.io transaction data  
**Status:** ⚠️ OKLAR (behöver granskning)  
**Innehåll:** (Specificera innehåll efter granskning)  
**Relaterad:** Demo med open payments.io (2025-10-30)

---

## 🚀 Development Phases

### **Fas 1: Frontend + Mockdata** (PÅGÅR)
- All data i frontend-filer (legalTexts.js, mockCompanyAutocomplete.js)
- Ingen backend/server ännu
- Focus: UI/UX och user flow

### **Fas 2: Server + Mock External APIs**
- Bolagsverket data lagrad på server disk (ZIP-fil uppackad)
- Riktig POST/GET från frontend → server
- Focus: API structure och error handling

### **Fas 3: Real External APIs**
- Integration med riktiga externa API:er
- OAuth2, certificates, rate limiting
- Focus: Production-ready integration

---

## 📌 TODO

- [ ] Granska mockEconomicData.js (vad innehåller den?)
- [ ] Granska mockRoaringData.js (vad innehåller den?)
- [ ] Implementera autocomplete i RiskFragorSlide.jsx (Steg 1)
- [ ] Packa upp Bolagsverket ZIP-fil för Fas 2
- [ ] Skapa constants.js för API URLs och config

---

**Senast uppdaterad:** 2025-10-29
