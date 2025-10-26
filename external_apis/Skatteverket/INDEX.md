# Skatteverket Module - INDEX

**Princip:** Det som inte finns i detta index FINNS INTE!
**Skapad:** 2025-10-26
**Senast uppdaterad:** 2025-10-26 01:15

---

## 1. Översikt

**API-leverantör:** Skatteverket (Swedish Tax Agency)
**Typ:** Myndighets-API med TLS-certifikatautentisering
**Syfte:** Skatteuppgifter och bokföringsdata för svenska företag
**Autentisering:** TLS-klientcertifikat (kräver företagsregistrering)
**Dokumentation:** https://www.skatteverket.se/omoss/varverksamhet/digitalisering/apitjanster/utvecklarportalen.html

---

## 2. Tillgängliga API:er

### A. AGC (Accounting General Categories)
**Endpoint:** Oklart - behöver verifieras
**Syfte:** Bokföringsdata kategoriserad
**Status:** ⏳ Spec finns (AGC.txt), ej testad i produktion

### B. CCG (Company Credit Guarantee / Företagets skatteuppgifter)
**Endpoint:** Oklart - behöver verifieras
**Syfte:** Skatteuppgifter för företag
**Status:** ⏳ Spec finns (CCG.txt), ej testad i produktion

### C. INK2 (Inkomstuppgifter)
**Endpoint:** Oklart - behöver verifieras
**Syfte:** Hämta inkomstuppgifter
**Status:** ⏳ Spec finns (INK2_*.txt, INK_2-4_API.txt), ej testad

### D. Persondata / SPAR
**Endpoint:** Oklart - behöver verifieras
**Syfte:** Folkbokföringsuppgifter
**Status:** ⏳ Spec finns (Persondata_Skatteverket_och_SPAR.txt), ej testad

---

## 3. Dokumentation

### Setup och produktionskrav

#### `KOMPLETT_SETUP_GUIDE.md` (13KB)
- **Innehåll:** Komplett guide för att komma igång med Skatteverkets API:er
- **Steg:** Installation, certifikat, testmiljö, endpoints
- **Status:** ✅ Komplett guide

#### `PROD_KRAV_PROGRAMVARUFÖRETAG.md` (18KB)
- **Innehåll:** Krav för att få produktionsnycklar som programvaruföretag
- **Viktiga krav:**
  - Registrerat företag i Sverige
  - F-skatt och Momsregistrering
  - Godkänd verksamhetsbeskrivning
  - GDPR-compliance
  - Säkerhetsåtgärder (TLS 1.2+, certifikathantering)
- **Status:** ✅ Dokumenterat, ⏳ Celestial AB uppfyller EJ alla krav ännu

#### `ANSÖK_PROD_NYCKLAR.md` (6KB)
- **Innehåll:** Ansökningsprocess för produktionsnycklar
- **Status:** ✅ Guide finns

#### `BESTÄLL_PROD_CERTIFIKAT.md` (3KB)
- **Innehåll:** Guide för att beställa produktionscertifikat
- **Status:** ✅ Guide finns

### Kommunikation med Skatteverket

#### `EMAIL_TILL_SKATTEVERKET_PROD_CERT.md` (4KB)
- **Innehåll:** Utkast till e-post för certifikatbeställning
- **Mottagare:** Skatteverkets utvecklarportal
- **Status:** ✅ Utkast klart

#### `LENA_SVAR_PROD_KRAV_2025-10-20.md` (8KB)
- **Datum:** 2025-10-20
- **Innehåll:** Svar från Lena (Expisoft?) om produktionskrav
- **Status:** ✅ Mottaget

#### `LENA_UPPDATERING_2025-10-20.md` (7KB)
- **Datum:** 2025-10-20
- **Innehåll:** Uppdatering från Lena angående status
- **Status:** ✅ Mottaget

#### `EXPISOFT_STATUS.md` (10KB)
- **Innehåll:** Status på Expisoft-integration (tredjepartstjänst?)
- **Status:** ⏳ Behöver granskas

### Företagsregistrering (Celestial AB)

#### `ENSKILD_FIRMA_GUIDE.md` (6KB)
- **Innehåll:** Guide för att registrera enskild firma
- **Status:** ✅ Guide finns

#### `ENSKILD_FIRMA_ANSOKAN_CHECKLISTA.md` (11KB)
- **Innehåll:** Checklista för företagsregistrering
- **Status:** ✅ Checklista klar

#### `VERKSAMT_BESKRIV_FORETAGET.md` (6KB)
- **Innehåll:** Verksamhetsbeskrivning för Verksamt.se
- **Status:** ✅ Beskrivning klar

#### `VERKSAMT_SPARADE_UPPGIFTER_2025-10-20.md` (4KB)
- **Datum:** 2025-10-20
- **Innehåll:** Sparade uppgifter från Verksamt.se-ansökan
- **Status:** ✅ Uppgifter sparade

---

## 4. API-specifikationer

### `AGC.txt` (13KB)
- **API:** Accounting General Categories
- **Format:** Text-spec (troligen från utvecklarportalen)
- **Status:** ⏳ Spec finns, behöver parsas

### `CCG.txt` (19KB)
- **API:** Company Credit Guarantee / Skatteuppgifter
- **Format:** Text-spec
- **Status:** ⏳ Spec finns, behöver parsas

### `INK2_Hämta_api.txt` (8KB)
- **API:** INK2 - Hämta inkomstuppgifter
- **Format:** Text-spec
- **Status:** ⏳ Spec finns, behöver parsas

### `INK2_api.txt` (8KB)
- **API:** INK2 (alternativ spec?)
- **Format:** Text-spec
- **Status:** ⏳ Spec finns, behöver parsas

### `INK_2-4_API.txt` (14KB)
- **API:** INK2-4 (komplett spec?)
- **Format:** Text-spec
- **Status:** ⏳ Spec finns, behöver parsas

### `Persondata_Skatteverket_och_SPAR.txt` (22KB)
- **API:** Persondata / SPAR folkbokföring
- **Format:** Text-spec
- **Status:** ⏳ Spec finns, behöver parsas

### `SKATTEVERKET_API_INFO.txt` (207KB)
- **Innehåll:** Omfattande API-information (troligen från utvecklarportalen)
- **Status:** ⏳ Behöver granskas

### `Utvecklarportalen_fullständig_listning.txt` (45KB)
- **Innehåll:** Fullständig listning från Skatteverkets utvecklarportal
- **Status:** ⏳ Behöver granskas

---

## 5. Test Scripts

### `test_tax_ccg_FIXED.py` (6KB)
- **API:** CCG (Skatteuppgifter)
- **Status:** ⏳ Fixad version, behöver verifieras
- **Test-företag:** Troligen Celestial AB (556903-8671)

### `test_tax_ccg_utpekad_org.py` (6KB)
- **API:** CCG - Specifikt org.nr
- **Status:** ⏳ Behöver verifieras

### `test_tax_ccg_valfri_org.py` (5KB)
- **API:** CCG - Valfritt org.nr (med argument)
- **Status:** ⏳ Behöver verifieras

---

## 6. Test Data

### `Bokförda transaktioner 556903-8671 Alla typer 2018-01-01--2025-10-20.csv` (11KB)
- **Företag:** Celestial AB (org.nr 556903-8671)
- **Period:** 2018-01-01 till 2025-10-20
- **Innehåll:** Bokförda transaktioner (alla typer)
- **Användning:** Referensdata för att verifiera API-responses
- **Status:** ✅ Testdata finns

---

## 7. Test Results

### `TEST_RESULTAT_2025-10-20.md` (5KB)
- **Datum:** 2025-10-20
- **Innehåll:** Testresultat från API-anrop
- **Status:** ✅ Resultat dokumenterade

---

## 8. Produktionsstatus

### Certifikat
- ✅ **Testcertifikat:** Beställt och mottaget
- ❌ **Produktionscertifikat:** EJ beställt (väntar på företagsregistrering)

### Företagsregistrering (Celestial AB)
- ⏳ **Org.nr:** 556903-8671 (registrerat?)
- ⏳ **F-skatt:** Behöver verifieras
- ⏳ **Momsregistrering:** Behöver verifieras
- ⏳ **Verksamhetsbeskrivning:** Klar (VERKSAMT_BESKRIV_FORETAGET.md)

### API-åtkomst
- ✅ **Testmiljö:** Tillgång finns
- ❌ **Produktion:** Väntar på certifikat och företagsregistrering

---

## 9. Struktur som ska skapas

För att matcha roaring/Bolagsverket-strukturen bör följande skapas:

```
Skatteverket/
├── INDEX.md                        # ✅ Denna fil
├── README.md                       # ❌ Ska skapas
├── credentials/                    # ❌ Ska skapas
│   ├── test_certificate.pem        # TLS-certifikat för testmiljö
│   ├── prod_certificate.pem        # TLS-certifikat för produktion
│   └── README.md                   # Guide för certifikathantering
├── docs/                           # ❌ Ska skapas
│   ├── TESTING_REGISTRY.md         # Register över testade endpoints
│   ├── AGC_API.md                  # Guide för AGC API
│   ├── CCG_API.md                  # Guide för CCG API
│   ├── INK2_API.md                 # Guide för INK2 API
│   └── PERSONDATA_API.md           # Guide för Persondata API
├── specs/                          # ❌ Ska skapas
│   ├── 01_agc/
│   │   ├── README.md
│   │   ├── spec.txt (från AGC.txt)
│   │   └── test_agc.py
│   ├── 02_ccg/
│   │   ├── README.md
│   │   ├── spec.txt (från CCG.txt)
│   │   └── test_ccg.py
│   ├── 03_ink2/
│   │   └── ...
│   └── 04_persondata/
│       └── ...
├── examples/                       # ❌ Ska skapas
│   ├── agc_response.json
│   ├── ccg_response.json
│   └── transactions_sample.csv (från bokförda transaktioner)
└── tests/                          # ⏳ Migreras från root
    ├── test_tax_ccg_FIXED.py       # ✅ Finns
    ├── test_tax_ccg_utpekad_org.py # ✅ Finns
    └── test_tax_ccg_valfri_org.py  # ✅ Finns
```

---

## 10. Integration med Celestial

### Användningsfall

**Primär användning:**
1. **Bokföringsassistans** - Hämta bokförda transaktioner för automatisk kategorisering
2. **Skatteuppgifter** - Verifiera momsregistrering, F-skatt
3. **Inkomstuppgifter** - KYC för enskilda firmor (kontrollera income)

**Potentiell användning:**
- Persondata/SPAR för identitetsverifiering (UBO)
- Skatteuppgifter för riskbedömning (skatteskuld indikerar risk)

### Integrationsstrategi

**OBS:** Skatteverket API är INTE primär källa för KYC/AML i Celestial. Det är kompletterande för bokföringsassistans.

```python
# Pseudo-kod
async def get_company_tax_data(org_nr):
    # Kräver TLS-certifikat
    async with TLSSession(cert_path) as session:
        # Hämta skatteuppgifter
        ccg_data = await skatteverket_api.get_ccg(org_nr, session)

        # Hämta bokförda transaktioner
        transactions = await skatteverket_api.get_transactions(org_nr, session)

        return {
            "tax_info": ccg_data,
            "transactions": transactions
        }
```

### Prioritet för Celestial

**KYC/Onboarding:** 🟢 NICE-TO-HAVE (ej kritiskt)
**Bokföringsassistans:** 🟡 IMPORTANT (för framtida feature)

---

## 11. Säkerhet och Compliance

### TLS-certifikat
- **Förvaring:** Säker lagring (ej i git!)
- **Rotation:** Följ Skatteverkets policy
- **Åtkomst:** Endast serverapplikation (ej frontend)

### GDPR
- Persondata från SPAR-API kräver extra skydd
- Logging av API-anrop (audit trail)
- Dataminimering (hämta bara nödvändig data)

### Rate Limits
- Oklart - dokumenteras vid testning
- Implementera retry-logik med exponential backoff

---

## 12. Nästa steg (prioriterat)

1. ✅ **INDEX.md skapad**
2. ⏳ **Avvakta företagsregistrering** - Celestial AB måste vara fullt registrerat
3. ⏳ **Beställ produktionscertifikat** - När företag godkänt
4. ⏳ **Skapa README.md** - Quick start guide
5. ⏳ **Flytta test scripts till tests/** - Organisera testfiler
6. ⏳ **Parsa API-specifikationer** - Skapa docs/ för varje API
7. ⏳ **Testa produktion** - Verifiera CCG, AGC, INK2 endpoints
8. ⏳ **Skapa docs/TESTING_REGISTRY.md** - Register över testade endpoints
9. ⏳ **Jämför med Roaring.io** - Identifiera överlapp och unika datapunkter
10. ⏳ **Beslut: Integration strategy** - Hur används Skatteverket i Celestial?

---

## 13. Kontakter

### Skatteverket
- **Utvecklarportal:** https://www.skatteverket.se/.../utvecklarportalen.html
- **Support:** Via utvecklarportalen

### Tredjepartsleverantörer
- **Expisoft:** Lena (kontaktperson för certifikat/registrering)

### Testmiljö
- **Företag:** Celestial AB
- **Org.nr:** 556903-8671
- **Testperiod:** 2018-01-01 till 2025-10-20 (bokförda transaktioner)

---

## 14. Teknisk information

### Autentisering
- **Typ:** Mutual TLS (mTLS) med klientcertifikat
- **Certifikattyp:** X.509 från godkänd utfärdare
- **TLS-version:** Minimum TLS 1.2

### Base URLs (antaganden - verifieras vid test)
- **Test:** https://api.test.skatteverket.se (?)
- **Produktion:** https://api.skatteverket.se (?)

### Response Format
- Troligen JSON eller XML (verifieras från spec)

### Dependencies
- Python requests med TLS-certifikat
- Certifikathantering (secure storage)

---

**Slut på INDEX. Allt som finns i Skatteverket-modulen är listat ovan.**
