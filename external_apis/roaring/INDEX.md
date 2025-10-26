# Roaring.io Module - INDEX

**Princip:** Det som inte finns i detta index FINNS INTE!  
**Skapad:** 2025-10-25  
**Senast uppdaterad:** 2025-10-25 21:15 (Business Prohibition testad och dokumenterad, specs/ struktur etablerad)

---

## 1. Credentials (BÖRJA HÄR)

### `credentials.ini`
- **Sökväg:** `external_apis/roaring/credentials.ini`
- **Innehåll:** OAuth2 client_id, client_secret, token_url
- **Format:** INI-fil med [oauth2] sektion
- **Status:** ✅ Fungerar
- **Används av:** Alla test scripts via credentials.py

### `credentials.py`
- **Sökväg:** `external_apis/roaring/credentials.py`
- **Funktioner:** `get_oauth2_credentials()`, `get_config_path()`
- **Returnerar:** Dict med access_token, token_type, expires_in
- **Token giltighetstid:** 3600 sekunder (1 timme)
- **Status:** ✅ Fungerar (testad 2025-10-25)

---

## 2. Test Scripts (`tests/`)

### `test_sanctions.py`
- **Sökväg:** `external_apis/roaring/tests/test_sanctions.py`
- **Endpoint:** Sanctions Lists API v3.0 - POST /sanctions-lists/v3/search
- **Testat:** 2025-10-25
- **Input:** Person/företagsnamn (--name) eller org.nr (--company-id)
- **Output:** Terminal - JSON response med hits från EU/OFAC/UN/UK/Swiss listor
- **Exempel körning:** `python3 test_sanctions.py --name "Lars Andersson"`
- **Resultat senaste test:** 0 hits för "Lars Andersson" (förväntat, ingen träff)
- **Dokumentation:** `docs/SANCTIONS_LISTS_V3.md`
- **Exempel data:** `examples/sanctions_ztarz.json`
- **Status:** ✅ Fungerar perfekt i ny struktur

### `test_documents.py`
- **Sökväg:** `external_apis/roaring/tests/test_documents.py`
- **Endpoint:** Company Documents API v1.0 - GET /company-documents/v1/se/{companyId}
- **Testat:** 2025-10-24 (import paths fixade 2025-10-25)
- **Input:** Svenskt org.nr (--company-id), optional --download för att ladda ner PDF
- **Output:** Terminal - lista dokument med ID, typ, datum, download URLs
- **Exempel körning:** `python3 test_documents.py --company-id 5564779444`
- **Resultat senaste test:** [BEHÖVER VERIFIERAS EFTER MIGRATION]
- **Dokumenttyper:** Årsredovisning, registreringsbevis, bolagsordning, m.m. (7 typer)
- **Dokumentation:** `docs/COMPANY_DOCUMENTS_V1.md`
- **Exempel data:** `examples/documents_annual_report.json`, `examples/annual_report_sample.pdf`
- **Status:** ⏳ Import paths fixade, behöver verifieras

### `test_establishments.py`
- **Sökväg:** `external_apis/roaring/tests/test_establishments.py`
- **Endpoint:** Establishments API v2.0 - GET /establishments/v2/se/{companyId}
- **Testat:** 2025-10-24 (import paths fixade 2025-10-25)
- **Input:** Svenskt org.nr (--company-id)
- **Output:** Terminal - CFAR-nummer, adresser, SNI-koder för alla verksamhetsställen
- **Exempel körning:** `python3 test_establishments.py --company-id 5564866803`
- **Resultat senaste test:** [BEHÖVER VERIFIERAS EFTER MIGRATION]
- **Dokumentation:** `docs/ESTABLISHMENTS_V2.md`
- **Exempel data:** `examples/establishments_multi.json` (Ztarz Kebab AB med 2 verksamhetsställen)
- **Status:** ⏳ Import paths fixade, behöver verifieras

### `test_kyc.py`
- **Sökväg:** `external_apis/roaring/tests/test_kyc.py`
- **Endpoint:** KYC Q&A API v1.0 - GET /kyc/questionnaires/v1
- **Testat:** 2025-10-23 (import paths fixade 2025-10-25)
- **Input:** Inget (visar tillgängliga frågor)
- **Output:** Terminal - lista med question_id och question_text
- **Exempel körning:** `python3 test_kyc.py`
- **Resultat senaste test:** [BEHÖVER VERIFIERAS EFTER MIGRATION]
- **Slutsats från tidigare test:** Inte relevant för Celestial (frågor om kryptovaluta, gambling, sanktionsländer)
- **Dokumentation:** Ingen dedikerad doc (low priority)
- **Status:** ⏳ Import paths fixade, behöver verifieras

### `test_beneficial_owners.py`
- **Sökväg:** `external_apis/roaring/tests/test_beneficial_owners.py`
- **Endpoint:** Beneficial Owners API v1.0 - GET /beneficial-owners/v1/se/{companyId}
- **Testat:** EJ TESTAT ÄN (skapad 2025-10-25)
- **Input:** Svenskt org.nr (--company-id)
- **Output:** Terminal - Lista verkliga huvudmän (UBO) med namn, personnummer, ägandeandelar, kontrolltyp, ägarlager
- **Exempel körning:** `python3 test_beneficial_owners.py --company-id 5564866803`
- **Resultat senaste test:** [BEHÖVER TESTAS]
- **Viktighet:** 🔴 CRITICAL för Celestial (PML-krav 3 kap 6 § - identifiera verklig huvudman)
- **Riskpoäng:** 
  - Inga UBO hittade: +10 poäng
  - >2 ägarlager: +2 poäng per owner
  - <50% ägarandel men kontroll: +1 poäng
- **Dokumentation:** Ingen dedikerad doc ännu (behöver skapas)
- **Exempel data:** Ingen ännu (skapas vid första test)
- **Status:** ⏳ Script skapat, behöver testas

### `test_pep.py`
- **Sökväg:** `external_apis/roaring/tests/test_pep.py`
- **Endpoint:** PEP Screening API v1.0 - POST /pep-screening/v1
- **Testat:** EJ TESTAT ÄN (skapad 2025-10-25)
- **Input:** Personnamn (--name), optional födelsedatum (--birth-date)
- **Output:** Terminal - PEP status, position, kategori, land
- **Exempel körning:** `python3 test_pep.py --name "Lars Andersson"`
- **Resultat senaste test:** [BEHÖVER TESTAS]
- **Viktighet:** 🔴 CRITICAL för Celestial (PML-krav 3 kap 18 § - skärpt KYC för PEP)
- **Riskpoäng:** PEP träff = +4 poäng, kräver skärpt KYC
- **Åtgärder vid träff:**
  - Enhanced due diligence
  - Source of funds verification
  - Ongoing monitoring
  - Senior management approval
- **Dokumentation:** Ingen dedikerad doc ännu (behöver skapas)
- **Exempel data:** Ingen ännu (skapas vid första test)
- **Status:** ⏳ Script skapat, behöver testas

### `test_business_prohibition.py`
- **Sökväg:** `external_apis/roaring/specs/01_business_prohibition/test_business_prohibition.py`
- **Endpoint:** Business Prohibition API v1.0
  - GET /se/businessprohibition/1.0/person/{personalNumber}
  - GET /se/businessprohibition/1.0/company/{companyId}
- **Testat:** ✅ 2025-10-25 (BÅDA endpoints verifierade)
- **Input:** 
  - Person: `--person 198503302393` (personnummer)
  - Företag: `--company 5565002465` (org.nr) + optional `--history-years 0-5` (default 2)
- **Output:** Terminal - JSON response + analys med domstolsnamn, besluttyp, giltighetsperiod, roller
- **Exempel körning:** 
  - `python3 test_business_prohibition.py --person 198503302393 --save`
  - `python3 test_business_prohibition.py --company 5565002465 --history-years 2 --save`
- **Resultat senaste test:**
  - Person 198503302393: Näringsförbud 2024-02-08 till 2033-08-09, Svea Hovrätt (Dom)
  - Company 5565002465: Styrelseledamot 194812161596 med aktivt näringsförbud
  - Court lookup: Fungerar perfekt med SwedishCourts.json (147 domstolar)
- **Viktighet:** 🔴 CRITICAL för Celestial (aktivt näringsförbud = AUTOMATISK AVVISNING)
- **Åtgärd vid träff:** REJECT APPLICATION - person får inte vara styrelseledamot, VD, firmatecknare eller verklig huvudman
- **Legal grund:** Näringsförbudslagen (1986:436)
- **Roller som kollas:** Board members, beneficial owners, alternative beneficial owners
- **Dokumentation:** `specs/01_business_prohibition/README.md` (komplett guide)
- **OpenAPI spec:** `specs/01_business_prohibition/openapi.yaml`
- **Reference data:** 
  - `SwedishCourts.json` (147 domstolar med svenska/engelska namn)
  - `court_decision_codes.json` (B=Beslut, D=Dom)
  - `sandbox_examples.json` (6 person + 1 företag testfall)
- **Test results:** 
  - `result_person_198503302393_*.json`
  - `result_company_5565002465_*.json`
- **Status:** ✅ Komplett testad och dokumenterad

---

## 3. Dokumentation (`docs/`)

### `TESTING_REGISTRY.md`
- **Sökväg:** `external_apis/roaring/docs/TESTING_REGISTRY.md`
- **Storlek:** 15KB
- **Syfte:** Centralt register över alla testade Roaring endpoints
- **Innehåll:** Status (✅ Testad / ⏳ Pågående / ❌ Ej testad), testdatum, viktighet för Celestial
- **Endpoints dokumenterade:** 5 av ~30 (OAuth2, KYC, Sanctions, Documents, Establishments)
- **Uppdateras:** Efter varje nytt endpoint-test
- **Status:** ✅ Komplett för testade endpoints (behöver sync med verifierade test results)

### `SANCTIONS_LISTS_V3.md`
- **Sökväg:** `external_apis/roaring/docs/SANCTIONS_LISTS_V3.md`
- **Storlek:** 22KB
- **Endpoint:** POST /sanctions-lists/v3/search
- **Innehåll:** 
  - API spec (request/response format)
  - 5 sanktionslistor (EU, OFAC, UN, UK, Swiss)
  - Sökparametrar (name, birthDate, country, companyId)
  - Integration guide för Celestial
  - Riskpoängsystem (0-100)
- **Exempel:** Ztarz Kebab AB (träff på alla 5 listor)
- **Viktighet:** 🔴 MANDATORY för Celestial (AML compliance)
- **Status:** ✅ Komplett dokumentation

### `COMPANY_DOCUMENTS_V1.md`
- **Sökväg:** `external_apis/roaring/docs/COMPANY_DOCUMENTS_V1.md`
- **Storlek:** 26KB
- **Endpoint:** GET /company-documents/v1/se/{companyId}
- **Innehåll:**
  - API spec (request/response format)
  - 7 dokumenttyper (årsredovisning, registreringsbevis, bolagsordning, etc.)
  - Download workflow (GET URL med OAuth2 token)
  - Integration guide för Celestial
  - OCR parsing strategi (olmOCR-2 7B)
- **Exempel:** Årsredovisning för org.nr 5564779444 (sandbox)
- **Viktighet:** 🔴 CRITICAL för Celestial (KYC data source)
- **Status:** ✅ Komplett dokumentation

### `ESTABLISHMENTS_V2.md`
- **Sökväg:** `external_apis/roaring/docs/ESTABLISHMENTS_V2.md`
- **Storlek:** 31KB
- **Endpoint:** GET /establishments/v2/se/{companyId}
- **Innehåll:**
  - API spec (request/response format)
  - CFAR-nummer (verksamhetsställe ID)
  - SNI-koder (branschklassificering)
  - Address validation
  - Integration guide för Celestial
- **Exempel:** Ztarz Kebab AB med 2 verksamhetsställen
- **Viktighet:** 🟡 IMPORTANT för Celestial (adressverifiering, branschanalys)
- **Status:** ✅ Komplett dokumentation

---

## 4. OpenAPI Specifications & Tests (`specs/`)

Varje endpoint har sin egen undermapp med OpenAPI spec, README, test script och reference data.  
**Numrering:** Mappar numreras enligt Roarings filtrerade API-lista (Sverige + Global).

### `specs/01_business_prohibition/`
- **openapi.yaml** (14KB) - OpenAPI spec för Business Prohibition API v1.0
- **README.md** (4KB) - Komplett guide: endpoints, parametrar, response structure, use cases
- **test_business_prohibition.py** (470 lines) - Test script för person + company endpoints
- **SwedishCourts.json** (18KB) - 147 svenska domstolar med namn (sv/en) och typ
- **court_decision_codes.json** (554 bytes) - Besluttyper (B=Beslut, D=Dom)
- **sandbox_examples.json** (2.1KB) - 6 person + 1 företag testfall
- **result_person_*.json** - Sparade testresultat person endpoint
- **result_company_*.json** - Sparade testresultat company endpoint
- **Status:** ✅ Komplett testad 2025-10-25

### `specs/sanctions/`
- **openapi.yaml** - OpenAPI spec för Sanctions Lists API v3.0
- **README.md** - Quick reference guide
- **Status:** ⏳ Spec kan klistras in, test ska migreras från tests/

### `specs/company_documents/`
- **openapi.yaml** - OpenAPI spec för Company Documents API v1.0
- **README.md** - Quick reference guide
- **Status:** ⏳ Spec kan klistras in, test ska migreras från tests/

### `specs/establishments/`
- **openapi.yaml** - OpenAPI spec för Establishments API v2.0
- **README.md** - Quick reference guide
- **Status:** ⏳ Spec kan klistras in, test ska migreras från tests/

### `specs/beneficial_owners/`
- **openapi.yaml** - OpenAPI spec för Beneficial Owners API v1.0
- **README.md** - Quick reference guide
- **Status:** ⏳ Spec kan klistras in

### `specs/pep/`
- **openapi.yaml** - OpenAPI spec för PEP Screening API v1.0
- **README.md** - Quick reference guide
- **Status:** ⏳ Spec kan klistras in

### `specs/kyc/`
- **openapi.yaml** - OpenAPI spec för KYC Q&A API v1.0
- **README.md** - Quick reference guide
- **Status:** ⏳ Spec kan klistras in, test ska migreras från tests/

---

## 5. Exempel Data (`examples/`)

### `sanctions_ztarz.json`
- **Sökväg:** `external_apis/roaring/examples/sanctions_ztarz.json`
- **Storlek:** 23KB
- **Från:** test_sanctions.py med org.nr 5564866803 (Ztarz Kebab AB)
- **Innehåll:** Multi-list hit response (EU, OFAC, UN, UK, Swiss)
- **Användning:** Referens för hit response structure
- **Noterbara detaljer:** 
  - 5 list hits med olika matchScore
  - Person information (namn, födelsedatum, nationalitet)
  - Sanktionsdetaljer (program, listade datum)

### `documents_annual_report.json`
- **Sökväg:** `external_apis/roaring/examples/documents_annual_report.json`
- **Storlek:** 516 bytes
- **Från:** test_documents.py med org.nr 5564779444
- **Innehåll:** Document fetch response med download URL
- **Användning:** Referens för document response structure
- **Noterbara detaljer:**
  - documentId, type, filingDate
  - downloadUrl (giltig i 1 timme)

### `establishments_multi.json`
- **Sökväg:** `external_apis/roaring/examples/establishments_multi.json`
- **Storlek:** 1.6KB
- **Från:** test_establishments.py med org.nr 5564866803 (Ztarz Kebab AB)
- **Innehåll:** 2 verksamhetsställen med CFAR, adresser, SNI
- **Användning:** Referens för establishments response structure
- **Noterbara detaljer:**
  - Huvudkontor vs filial
  - SNI-koder (56103 - Restauranger)
  - Fullständiga adresser med postnummer

### `annual_report_sample.pdf`
- **Sökväg:** `external_apis/roaring/examples/annual_report_sample.pdf`
- **Storlek:** 36KB
- **Från:** Downloaded via Company Documents API (org.nr 5564779444)
- **Innehåll:** Sandbox årsredovisning
- **Användning:** Test data för OCR/parsing development (olmOCR-2 7B)
- **Format:** Standard svensk årsredovisning enligt ÅRL

---

## 6. Endpoints Ej Testade Ännu

**Totalt:** ~23 endpoint groups kvar att testa

**Högprioriterade för Celestial:**
- Company Information API (grundläggande bolagsdata)
- Credit Information (kreditvärdighet)
- Financial Statements API (årsredovisningar, nyckeltal)
- Auditor Information (revisorer)
- Board Members (styrelseledamöter)
- Signatories (firmatecknare)
- AML Registry (penningtvättsregister)

**Mediumprioriterade:**
- Litigation History (rättsprocesser)
- Tax Debt Information (skatteskulder)
- Real Estate Information (fastighetsinnehav)
- Vehicle Registry (fordonsregister)
- Employment Statistics (anställningsstatistik)

**Lågprioriterade / Oklara:**
- (övriga endpoints i Roaring.io OpenAPI spec)

---

## 7. Teknisk Information

### Import Pattern
Alla test scripts använder följande pattern för att importera credentials:

```python
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))
from credentials import get_oauth2_credentials
```

### Körning från terminalen
```bash
cd external_apis/roaring/tests

# Existerande testade endpoints:
python3 test_sanctions.py --name "Lars Andersson"
python3 test_documents.py --company-id 5564779444
python3 test_establishments.py --company-id 5564866803
python3 test_kyc.py

# Nya endpoints (ej testade än):
python3 test_beneficial_owners.py --company-id 5564866803
python3 test_pep.py --name "Lars Andersson"
python3 test_business_prohibition.py --personal-number 198001011234
```

### Dependencies
- Python 3.x
- requests library
- configparser (stdlib)
- argparse (stdlib)

---

## 8. Integration med Celestial

### Aktuell status
- **Sandbox testing:** Pågående
- **Production keys:** Ej beställda än
- **Integration kod:** Ej påbörjad

### Nästa steg
1. Verifiera alla test scripts fungerar efter migration
2. Fortsätt testa återstående endpoints
3. Beställ production API keys från Roaring.io
4. Implementera Roaring integration i Celestial backend
5. Bygg data pipeline: Roaring → Celestial DB → Risk Engine

---

**Slut på INDEX. Allt som finns i Roaring-modulen är listat ovan.**
