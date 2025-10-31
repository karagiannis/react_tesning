# API Endpoints - Tillfälliga anteckningar

**Datum:** 2025-10-29  
**Status:** PLANERING - Mockdata-fas

---

## 📋 Utvecklingsplan (Myr-steg)

### **Fas 1: Frontend + Mockdata (PÅGÅENDE)**
- ✅ LaTeX-specifikation (`Onboarding_app_ny.tex`)
- ✅ React-komponenter med mockdata i frontend
- 🔄 "Look n' feel" - användargränssnitt
- **Ingen server-integration ännu**

### **Fas 2: Server med mockade externa API:er**
- Mockdata serveras från `celestial.se` 
- Frontend gör verkliga POST/GET-anrop
- Servern mockar externa API:er (Bolagsverket, Roaring.io, etc.)
- **Validerar att frontend-backend-kommunikation fungerar**

### **Fas 3: Riktiga externa API:er**
- Integrera Bolagsverket, Roaring.io, Skatteverket, etc.
- Affärslogik och riskbedömning
- Produktion

---

## 🏢 Företagsdata för Autocomplete

### **Bolagsverkets "värdefulla datamängder"**

**Status:** ZIP-fil nedladdad, INTE uppackad ännu  
**Plats:** `/home/lasse/Documents/Onboarding_App/tic-tac-toe-server/` (?)

**TODO:**
1. Packa upp ZIP-filen lokalt för granskning
2. SCP till `celestial.se` server
3. Sätt upp cron för **veckovisa uppdateringar** från Bolagsverket
4. Indexera för snabb autocomplete (SQLite eller PostgreSQL med fulltext-sökning)

**Endpoint (framtida):**
```
GET /api/companies/search?q={query}
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Redovisningsbyrån Stockholm AB",
    "orgNr": "556123-4567",
    "stad": "Stockholm",
    "lan": "Stockholms län"
  }
]
```

**Max resultat:** 10 träffar  
**Min query-längd:** 2 tecken  
**Sökfält:** Företagsnamn, organisationsnummer, stad

---

## 🔗 Planerade Endpoints (utkast)

### **Riskfrågor - Steg 1**
```
POST /api/onboarding/{id}/riskfragor/steg1
Body: {
  affarsIde: string,
  foretagsnamn: string,  // Från autocomplete
  orgNr: string,          // Auto-ifylld från autocomplete
  kundTyper: object,
  verksamhetAndrad: boolean,
  personnummer: string,
  arVerkligHuvudman: boolean,
  isPEP: boolean
}
```

### **Företagssökning (autocomplete)**
```
GET /api/companies/search?q={query}
Response: Array<{ id, name, orgNr, stad, lan }>
```

### **Hämta företagsdetaljer**
```
GET /api/companies/{orgNr}
Response: { name, orgNr, stad, lan, sniKod?, registreringsdatum? }
```

---

## 📝 Anteckningar

- **Mock-data skapad:** `/src/data/mockCompanyAutocomplete.js`
- **Fas 1:** Använd mock-data direkt i frontend
- **Fas 2:** Servera samma mock-data från `celestial.se`
- **Fas 3:** Ersätt mock med riktig Bolagsverket-data från lokal databas

---

## ⏭️ Nästa steg

1. ✅ Implementera autocomplete-komponent i RiskFragorSlide.jsx (Steg 1)
2. ⏳ Slutför RiskFragorSteg3Slide.jsx med diskreta info-ikoner
3. ⏳ Uppdatera RiskFragorSteg4Slide.jsx (EDD)
4. ⏳ Packa upp Bolagsverket ZIP-fil
5. ⏳ Planera server-struktur för `celestial.se`

---

**Senast uppdaterad:** 2025-10-29 (GitHub Copilot Claude)
