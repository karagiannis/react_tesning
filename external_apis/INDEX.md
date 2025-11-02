# External APIs - HUVUDINDEX

**Princip:** Det som inte finns i detta index FINNS INTE!
**Skapad:** 2025-10-26
**Senast uppdaterad:** 2025-10-26 02:15

---

## Översikt

Denna mapp innehåller all integration med externa API:er som används i Celestial Onboarding App.

**Inkluderade API:er:**
- **Roaring.io** - Komplett KYC/AML-dataplattform (sanctions, UBO, PEP, etc.)
- **Scrive** - E-signering med BankID för avtalshantering
- **Bolagsverket** - Företagsinformation och Värdefulladatamängder
- **SCB** - Statistik, SNI-koder och NIX-reklamspärr
- **Skatteverket** - Skatteuppgifter och bokföringsdata

**Exkluderade:**
- **Fortnox** - Flyttat till `/home/lasse/Documents/Fortnox/` (separat projekt för Fortnox Marketplace-app)
- **Loopia** - Flyttat till [tic-tac-toe-server/server/](../../tic-tac-toe-server/server/) (server setup)

---

## API-översikt

### 1. Roaring.io
**Sökväg:** [roaring/](roaring/)
**Status:** 🟢 Aktiv utveckling
**Dokumentation:** [roaring/INDEX.md](roaring/INDEX.md)

**Syfte:** Primär datakälla för KYC/AML compliance

**Testade endpoints (8 st):**
- ✅ OAuth2 Authentication
- ✅ Sanctions Lists API v3.0
- ✅ Company Documents API v1.0
- ✅ Establishments API v2.0
- ✅ Business Prohibition API v1.0
- ⏳ KYC Q&A API v1.0 (import paths fixade)
- ⏳ Beneficial Owners API v1.0 (script skapat)
- ⏳ PEP Screening API v1.0 (script skapat)

**Viktighet:** 🔴 CRITICAL - Kärnfunktionalitet för Celestial

**Credentials:** `roaring/credentials.ini` (sandbox keys)

**Nästa steg:**
1. Verifiera test_documents.py, test_establishments.py efter migration
2. Testa test_beneficial_owners.py och test_pep.py
3. Beställ production API keys

---

### 2. Scrive (E-Signature & BankID)
**Sökväg:** [scrive/](scrive/)
**Status:** 🟢 Vald leverantör för Agreement Management
**Dokumentation:** [scrive/INDEX.md](scrive/INDEX.md)

**Syfte:** BankID-signering för avtal (trial, subscription, assignment)

**Prissättning:** Pay-as-you-go, ~70 kr/signering

**Varför Scrive?**
- ✅ BankID-integration inkluderad (ingen egen BankID-setup)
- ✅ PDF-generering och lagring (GDPR-compliant)
- ✅ Webhooks för asynkron hantering
- ✅ Billigare än egen BankID-integration (201,000 kr besparing år 1)

**Viktighet:** 🔴 CRITICAL - Krävs för Agreement Management

**Credentials:** TBD (kontakta Scrive sales)

**Nästa steg:**
1. Kontakta Scrive för pay-as-you-go-avtal
2. Få sandbox API-credentials
3. Implementera backend webhook listener
4. Testa med sandbox BankID

---

### 3. SCB (Statistiska Centralbyrån)
**Sökväg:** [SCB/](SCB/)
**Status:** 🟢 Bulkdata nedladdad, scheman skapade
**Dokumentation:** [SCB/INDEX.md](SCB/INDEX.md)

**Syfte:** Företagsstatistik, SNI-koder och NIX-reklamspärr för GDPR compliance

**Undermappar:**
- **Värdefulladatamängder/** - EU-mandated bulk data (scb_bulkfil.zip, 67 MB)
- **Värdefulladatamängder/schemas/** - 7 JSON-scheman för datastruktur

**Huvudfunktioner:**
- SNI-koder (Ng1-Ng5) för näringsverksamhetsklassificering
- NIX-reklamspärr för marknadsföringscompliance
- Juridiska former (35 olika typer)
- Företagsstatus och adressdata

**Viktigt innehåll:**
- `schemas/01_scb_grunddata.json` - Huvudschema (15 fält)
- `schemas/04_juridisk_form.json` - 35 juridiska former
- `schemas/05_sni_koder.json` - SNI 2007-standarden
- `schemas/07_reklamsparre.json` - NIX-registret med legal compliance

**Viktighet:** 🟡 IMPORTANT - Kompletterande statistik och GDPR compliance

**Credentials:** Ingen autentisering krävs (öppna data)

**Data source:** Värdefulladatamängder, uppdateras veckovis (varje måndag)

**Nästa steg:**
1. Implementera parsing av scb_bulkfil.zip
2. NIX-kontroll i marketing workflow
3. SNI-kod lookup funktion

---

### 4. Bolagsverket
**Sökväg:** [Bolagsverket/](Bolagsverket/)
**Status:** 🟡 Testdata samlat, integration pending
**Dokumentation:** [Bolagsverket/INDEX.md](Bolagsverket/INDEX.md) *(ska skapas)*

**Syfte:** Gratis API för företagsinformation från Bolagsverket

**Undermappar:**
- **Företagsinformation/** - API-dokumentation för företagsuppgifter
- **Värdefulladatamängder/** - Gratis API, anslutningsguider och testdata

**Viktigt innehåll:**
- `API_SCHEMAS.md` - API-scheman och endpoints
- `KODLISTOR_BOLAGSVERKET.md` - Kodlistor (bolagsformer, etc.)
- `README.md` - Översikt över Bolagsverket-integration

**Viktighet:** 🟡 IMPORTANT - Kompletterande datakälla (gratis)

**Credentials:** Ingen autentisering krävs (öppet API)

**Nästa steg:**
1. Skapa INDEX.md för Bolagsverket
2. Testa Värdefulladatamängder API
3. Dokumentera endpoints och response structure

---

### 5. Skatteverket
**Sökväg:** [Skatteverket/](Skatteverket/)
**Status:** 🟡 Produktionskrav under utredning
**Dokumentation:** [Skatteverket/INDEX.md](Skatteverket/INDEX.md) *(ska skapas)*

**Syfte:** Skatteuppgifter och bokföringsdata via TLS-certifikatautentisering

**Viktigt innehåll:**
- `KOMPLETT_SETUP_GUIDE.md` - Setup guide för API-åtkomst
- `PROD_KRAV_PROGRAMVARUFÖRETAG.md` - Krav för produktionsnycklar
- `test_tax_*.py` - Testscript för olika endpoints (AGC, CCG, INK2)
- API-specifikationer (AGC.txt, CCG.txt, INK_2-4_API.txt)

**Test-företag:** Celestial AB (org.nr 556903-8671)

**Viktighet:** 🟢 NICE-TO-HAVE - Kompletterande data för bokföringsassistans

**Credentials:** TLS-certifikat krävs (testmiljö: beställd, produktion: ej beställd)

**Status produktionscertifikat:**
- Kräver företagsregistrering (pågående via Verksamt)
- Kontaktperson: Lena på Expisoft

**Nästa steg:**
1. Skapa INDEX.md för Skatteverket
2. Avvakta företagsregistrering
3. Beställ produktionscertifikat när krav uppfyllda
4. Testa production endpoints

---

## Standardstruktur per API

Varje API-mapp ska följa denna struktur (baserat på roaring-modellen):

```
API_NAME/
├── INDEX.md              # Komplett register över allt i mappen (MANDATORY)
├── README.md             # Quick start guide och översikt
├── credentials.ini       # API-nycklar och konfiguration
├── credentials.py        # Helper för att läsa credentials
├── docs/                 # Detaljerad dokumentation per endpoint
│   ├── TESTING_REGISTRY.md
│   └── ENDPOINT_NAME.md
├── specs/                # OpenAPI-specifikationer per endpoint
│   └── 01_endpoint_name/
│       ├── openapi.yaml
│       ├── README.md
│       └── test_endpoint.py
├── examples/             # Exempel-responses och testdata
│   └── response_example.json
└── tests/                # Testscript (legacy structure)
    └── test_*.py
```

**Obligatoriska filer:**
- `INDEX.md` - Principen: "Det som inte finns i INDEX FINNS INTE"
- `README.md` - Snabb översikt för nya utvecklare

**Rekommenderade filer:**
- `credentials.ini` - Om API kräver autentisering
- `docs/TESTING_REGISTRY.md` - Centralt register över testade endpoints

---

## Arbetsflöde för nya API:er

1. **Skapa mappar:** Följ standardstrukturen ovan
2. **Skapa INDEX.md:** Börja med tom INDEX och uppdatera löpande
3. **Lägg till credentials:** Om API kräver nycklar
4. **Testa endpoints:** Ett i taget, dokumentera i INDEX efter varje test
5. **Skapa dokumentation:** Flytta dokumentation till docs/ och specs/
6. **Uppdatera huvudindex:** Lägg till i denna fil

---

## Färgkodning av status

- 🔴 **CRITICAL** - Kärnfunktionalitet, måste fungera
- 🟡 **IMPORTANT** - Kompletterande data, högt värde
- 🟢 **NICE-TO-HAVE** - Extra features, låg prioritet

- ✅ **Komplett** - Testad och dokumenterad
- ⏳ **Pågående** - Under utveckling
- ❌ **Ej påbörjad** - Ej testad/dokumenterad

---

## Integration status

| API | Sandbox | Production Keys | Integration | Riskbedömning | Status |
|-----|---------|----------------|-------------|---------------|--------|
| **Roaring.io** | ✅ Fungerar | ❌ Ej beställda | ❌ Ej påbörjad | ⏳ Under utveckling | 🟢 Sandbox OK |
| **Bolagsverket** | ✅ Gratis API | N/A (öppet) | ❌ Ej påbörjad | ❌ Ej påbörjad | 🟡 Testdata samlat |
| **SCB** | ✅ Bulkdata OK | N/A (öppna data) | ❌ Ej påbörjad | N/A | 🟢 Scheman klara |
| **Skatteverket** | ⏳ Test cert OK | ❌ Väntar företagsreg | ❌ Ej påbörjad | N/A | 🟡 Avvaktar |

---

## Dependencies

**Python:**
- requests
- configparser
- argparse
- json
- pathlib

**API-nycklar:**
- Roaring.io sandbox credentials (finns)
- Skatteverket test-certifikat (finns)
- Bolagsverket ingen auth (öppet API)

---

## Relaterad dokumentation

- [Celestial Docs - API Integration](../docs/API_INTEGRATION/)
- [Celestial Docs - Deployment](../docs/DEPLOYMENT/)
- [Roaring Module INDEX](roaring/INDEX.md)

---

**Slut på HUVUDINDEX. Alla API:er som används i Celestial listas ovan.**
