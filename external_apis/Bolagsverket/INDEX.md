# Bolagsverket Module - INDEX

**Princip:** Det som inte finns i detta index FINNS INTE!
**Skapad:** 2025-10-26
**Senast uppdaterad:** 2025-10-26 01:56 (Bulk data nedladdad: 298 MB)

---

## 1. Översikt

**API-leverantör:** Bolagsverket (Swedish Companies Registration Office)
**Typ:** Gratis öppet API
**Syfte:** Hämta företagsinformation från svenska Bolagsverket
**Autentisering:** Ingen (öppet API)
**Dokumentation:** https://www.bolagsverket.se/om/oppnadata/api

---

## 2. API-kategorier

Bolagsverket erbjuder två huvudsakliga API:er:

### A. Företagsinformation API
**Bas-URL:** https://api.bolagsverket.se/info/v1
**Syfte:** Grundläggande företagsuppgifter
**Status:** ⏳ Specs hämtade, ej testad

### B. Värdefulladatamängder API
**Bas-URL:** https://api.bolagsverket.se/vdm/v1 (antas)
**Syfte:** Utökad företagsinformation (gratis version av premium-data)
**Status:** ⏳ Dokumentation samlad, ej testad

---

## 3. Företagsinformation API

### Sökväg: `Företagsinformation/`

**Filer:**
- `swagger.json` (80KB) - OpenAPI specification
- `swagger_formatted.json` (174KB) - Formaterad OpenAPI spec (lättare att läsa)

**Tillgängliga endpoints (från OpenAPI spec):**
*(Behöver extraheras och dokumenteras)*

**Exempel-användning:**
```bash
# Hämta företagsinfo via org.nr
curl https://api.bolagsverket.se/info/v1/company/{organisationsnummer}

# Exempel:
curl https://api.bolagsverket.se/info/v1/company/5564866803
```

**Status:** ❌ Ej testad
**Prioritet:** 🟡 IMPORTANT - Kompletterande datakälla till Roaring.io

**Nästa steg:**
1. Extrahera endpoints från swagger.json
2. Skapa test script (test_company_info.py)
3. Testa med sandbox org.nr (5564866803 - Ztarz Kebab AB)
4. Dokumentera response structure

---

## 4. Värdefulladatamängder API

### Sökväg: `Värdefulladatamängder/`

**Dokumentation:**
- `anslutningsanvisning-for-atkomst-till-vardefulla-datamangder-test-och-produktion.pdf` (252KB, Svenska)
- `connection-establishment-guide-for-vardefulla-datamangder-test-and-production.pdf` (264KB, English)
- `Testdata API Vardefulla datamangder.xlsx` (29KB) - Excel med testdata
- `Vardefulla_datamangder_9999999999_vardefulla_datamangder_-_test.zip` (227 bytes) - Test API credentials ZIP

**Bulk Data (Nedladdad 2025-10-26):**
- `bolagsverket_bulkfil.zip` (231 MB) - Grunddata om företag från Bolagsverket
- `scb_bulkfil.zip` (67 MB) - Grunddata om företag från SCB
- **Uppdateras:** Veckovis (varje måndag)
- **Nästa uppdatering:** Se UPDATE_SCHEDULE.md

**Innehåll (från dokumentation):**
- Test- och produktionsmiljöer
- API-endpoints och autentisering
- Testdata (org.nr, personnummer, etc.)

**Vad är "Värdefulladatamängder"?**
Bolagsverkets gratis API för utökad företagsinformation som tidigare bara fanns via betaltjänster. Innehåller:
- Styrelseledamöter
- Verkliga huvudmän (UBO)
- Historiska uppgifter
- Bolagsordningar
- Årsredovisningar (?)

**Status:** ❌ Ej testad
**Prioritet:** 🟢 NICE-TO-HAVE - Kan komplettera eller ersätta Roaring.io för vissa uppgifter (gratis!)

**Test credentials:**
- `Vardefulla_datamangder_9999999999_vardefulla_datamangder_-_test.zip` innehåller troligen API-nycklar eller certifikat för testmiljön
- Behöver extraheras och konfigureras för testning

**Nästa steg:**
1. Extrahera och inspektera ZIP-filen (test credentials)
2. Läs igenom PDF-guiderna (svenska/engelska)
3. Identifiera relevanta endpoints för Celestial
4. Extrahera testdata från Excel
5. Konfigurera test credentials
6. Skapa test script
7. Jämför data quality med Roaring.io

---

## 5. Dokumentation

### `API_SCHEMAS.md` (22KB)
- **Innehåll:** API-scheman och endpoints (behöver verifieras)
- **Status:** ⏳ Gammal dokumentation, kan behöva uppdateras

### `KODLISTOR_BOLAGSVERKET.md` (10KB)
- **Innehåll:** Kodlistor för Bolagsverket-data
- **Kodsystem:**
  - Bolagsformer (AB, HB, KB, etc.)
  - SNI-koder (branschklassificering)
  - Juridiska former
  - Registreringsstatus
- **Användning:** Översätt koder från API-responses till läsbar text
- **Status:** ✅ Dokumenterad

### `README.md` (2.2KB)
- **Innehåll:** Översikt över Bolagsverket-integration
- **Status:** ✅ Översikt finns

### `CREDENTIALS_STATUS.md` (1.4KB)
- **Innehåll:** Status för API-credentials (om några krävs)
- **Status:** ⏳ Behöver verifieras (troligen N/A för öppet API)

### `API_TEST_RESULTS.md` (1.4KB)
- **Innehåll:** Testresultat (om några test körts)
- **Status:** ⏳ Behöver verifieras

---

## 6. Struktur som ska skapas

För att matcha roaring-strukturen bör följande skapas:

```
Bolagsverket/
├── INDEX.md                    # ✅ Denna fil
├── README.md                   # ✅ Finns redan
├── docs/                       # ❌ Ska skapas
│   ├── TESTING_REGISTRY.md     # Register över testade endpoints
│   ├── COMPANY_INFO_API.md     # Guide för Företagsinformation API
│   └── VDM_API.md              # Guide för Värdefulladatamängder API
├── specs/                      # ❌ Ska skapas
│   ├── 01_company_info/
│   │   ├── openapi.yaml
│   │   ├── README.md
│   │   └── test_company_info.py
│   └── 02_vdm/
│       ├── README.md
│       └── test_vdm.py
├── examples/                   # ❌ Ska skapas
│   └── company_response.json
└── tests/                      # ❌ Ska skapas
    ├── test_company_info.py
    └── test_vdm.py
```

---

## 7. Jämförelse med Roaring.io

| Feature | Roaring.io | Bolagsverket |
|---------|-----------|--------------|
| **Pris** | Betaltjänst | Gratis |
| **Företagsinfo** | ✅ Komplett | ✅ Grundläggande |
| **UBO (Verkliga huvudmän)** | ✅ API v1.0 | ✅ Värdefulladatamängder |
| **Sanctions/PEP** | ✅ Dedikerade APIs | ❌ Ingen |
| **Credit info** | ✅ Kreditvärdighet | ❌ Ingen |
| **Årsredovisningar** | ✅ PDF download | ⏳ Oklart |
| **Riskbedömning** | ✅ Automatisk | ❌ Manuell |
| **Real-time updates** | ✅ Ja | ⏳ Oklart |
| **API design** | Modern (OpenAPI 3.0) | ⏳ Oklart |

**Slutsats:**
- **Roaring.io** - Primär källa för KYC/AML (sanctions, PEP, credit, risk scoring)
- **Bolagsverket** - Kompletterande gratis källa för grunddata och verifiering

---

## 8. Integration med Celestial

### Användningsfall

**Primär användning:**
1. **Gratis datakälla för sandbox/demo** - Testa Celestial utan Roaring.io-kostnader
2. **Dataverifiering** - Korsvalidera Roaring.io-data mot Bolagsverket
3. **Fallback** - Om Roaring.io är nere eller har rate limits

**Potentiell användning:**
- Hämta grundläggande företagsinfo (firma, adress, org.nr)
- Verifiera styrelseledamöter
- Hämta UBO-data (om tillgängligt via Värdefulladatamängder)

### Integrationsstrategi

```python
# Pseudo-kod för Celestial integration
async def get_company_data(org_nr):
    # Primär källa: Roaring.io (betald, komplett data)
    roaring_data = await roaring_api.get_company(org_nr)

    # Kompletterande: Bolagsverket (gratis, verifiering)
    bv_data = await bolagsverket_api.get_company(org_nr)

    # Korsvalidera kritiska fält
    validate_company_name(roaring_data, bv_data)
    validate_org_number(roaring_data, bv_data)

    # Använd Roaring för risk scoring
    risk_score = calculate_risk(roaring_data)

    return {
        "company": roaring_data,
        "verification": bv_data,
        "risk_score": risk_score
    }
```

---

## 9. Nästa steg (prioriterat)

1. ✅ **INDEX.md skapad**
2. ⏳ **Läs Värdefulladatamängder-guiderna** - Förstå vad API:et erbjuder
3. ⏳ **Extrahera testdata från Excel** - Skapa examples/
4. ⏳ **Testa Företagsinformation API** - Första endpoint-test
5. ⏳ **Testa Värdefulladatamängder API** - Andra endpoint-test
6. ⏳ **Skapa docs/TESTING_REGISTRY.md** - Register över testade endpoints
7. ⏳ **Jämför med Roaring.io** - Data quality, completeness, performance
8. ⏳ **Beslut: Integration strategy** - Hur ska Bolagsverket användas i Celestial?

---

## 10. Teknisk information

### Base URLs (antaganden - verifieras vid test)
- Företagsinformation: `https://api.bolagsverket.se/info/v1`
- Värdefulladatamängder: `https://api.bolagsverket.se/vdm/v1` (?)

### Autentisering
- **Företagsinformation:** Ingen (öppet API)
- **Värdefulladatamängder:** Behöver verifieras (troligen API-nyckel eller öppet)

### Rate Limits
- Oklart - dokumenteras vid testning

### Response Format
- JSON (antas - verifieras vid test)

### Test org.nr
- 5564866803 (Ztarz Kebab AB - samma som Roaring.io tests)
- Ytterligare från `Testdata API Vardefulla datamangder.xlsx`

---

**Slut på INDEX. Allt som finns i Bolagsverket-modulen är listat ovan.**
