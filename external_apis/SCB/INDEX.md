# SCB (Statistiska Centralbyrån) - INDEX

**Senast uppdaterad:** 2025-10-26
**Status:** AKTIV - Bulkdata nedladdad, scheman skapade
**Typ:** Statlig datakälla (FREE)

---

## Översikt

SCB (Statistics Sweden) är Sveriges officiella statistikmyndighet. För Celestial Onboarding App används SCB:s data för:

- **Företagsstatistik** - Kompletterande data om företag
- **Näringsgrensindelning** - SNI-koder för verksamhetsklassificering
- **Reklamspärr (NIX)** - Compliance-kontroll för direktmarknadsföring
- **Adressdata** - Validering och komplettering av företagsadresser

---

## Värdefulladatamängder (EU High-Value Datasets)

SCB tillhandahåller **Värdefulladatamängder** enligt EU-direktivet om öppna data.

### Bulkdata

| Filnamn | Storlek | Uppdatering | Status |
|---------|---------|-------------|--------|
| `scb_bulkfil.zip` | 67 MB | Veckovis (måndag) | NEDLADDAD 2025-10-26 |

**Uppdateringsschema:** Se `Värdefulladatamängder/UPDATE_SCHEDULE.md` (synkroniserad med Bolagsverket)

**Källa:** https://bolagsverket.se/foretag/oppnadata/nedladdningsbara-filer

---

## Datastruktur - JSON Schemas

Alla fält i SCB-bulkdata dokumenterade med JSON Schema (draft-07):

| Schema | Beskrivning | Antal koder/fält |
|--------|-------------|------------------|
| [01_scb_grunddata.json](Värdefulladatamängder/schemas/01_scb_grunddata.json) | Huvudschema - alla fält | 15 fält |
| [02_foretagsstatus.json](Värdefulladatamängder/schemas/02_foretagsstatus.json) | Företagsstatus (Ftgstat) | 3 koder |
| [03_juridisk_enhet_status.json](Värdefulladatamängder/schemas/03_juridisk_enhet_status.json) | Juridisk enhet status (Jestat) | 3 koder |
| [04_juridisk_form.json](Värdefulladatamängder/schemas/04_juridisk_form.json) | Juridiska former (jurform) | 35 former |
| [05_sni_koder.json](Värdefulladatamängder/schemas/05_sni_koder.json) | SNI 2007 näringsindelning (Ng1-Ng5) | SNI-standard |
| [06_adressfalt.json](Värdefulladatamängder/schemas/06_adressfalt.json) | Adressfält (Gatuadress, Postnummer, etc.) | 4 fält |
| [07_reklamsparre.json](Värdefulladatamängder/schemas/07_reklamsparre.json) | NIX-reklamspärr (Reklam) | 2 koder + legal info |

**Schema-standard:** JSON Schema draft-07
**Exempel på användning:** Validering, dokumentation, automatisk parsing

---

## Huvudfält i SCB-data

### Identifiering
- **PeOrgNr** - 12-siffrig identitet (19/20 = fysisk person, 16 = juridisk person)
- **Namn** - Registrerat namn
- **Foretagsnamn** - Företagsnamn för enskilda näringsidkare

### Status
- **Ftgstat** - Företagsstatus (verksamt/ej verksamt)
- **Jestat** - Juridisk enhet status
- **RegDatKtid** - Registreringsdatum

### Klassificering
- **jurform** - Juridisk form (35 olika former)
- **Ng1-Ng5** - SNI-koder (upp till 5 per företag)

### Kontaktinformation
- **Gatuadress** - Gatu- eller boxadress
- **COadress** - C/O-adress (valfri)
- **Postnummer** - 5-siffrig postnummer
- **PostOrt** - Postort

### Compliance
- **Reklam** - NIX-reklamspärr (KRITISK för GDPR compliance)

---

## Integration med Celestial Onboarding

### Användningsområden

1. **KYC/AML Enrichment**
   - Komplettera Bolagsverket-data med SCB-statistik
   - Verifiera näringsverksamhet (SNI-koder)
   - Validera företagsstatus

2. **GDPR/Marketing Compliance**
   - Kontrollera NIX-reklamspärr innan direktmarknadsföring
   - Dokumentera laglig grund för kontakt
   - Undvik sanktioner enligt Marknadsföringslagen

3. **Datavalidering**
   - Cross-check organisationsnummer mellan källor
   - Verifiera adressuppgifter
   - Identifiera diskrepanser

4. **Business Intelligence**
   - SNI-kod-analys för branschsegmentering
   - Företagsstatistik och trender
   - Riskbedömning baserad på näringsgren

---

## API-integrations (Framtida)

### Planerade integrations

| API | Typ | Status | Användning |
|-----|-----|--------|------------|
| SCB Business Statistics API | REST | PLANERAD | Nyckeltal för företag |
| SCB Classification API | REST | PLANERAD | SNI-kod lookup |
| Företagsdatabasen | Bulk | AKTIV | Grunddata (nuvarande) |

**OBS:** Endast bulkdata implementerad just nu. API-integrations planeras senare.

---

## Datakvalitet och begränsningar

### Styrkor
- Officiell svensk statistik
- Veckovis uppdatering
- Omfattande klassificeringssystem (SNI)
- NIX-reklamspärr för compliance

### Begränsningar
- Mindre detaljrik än Bolagsverket för bolagsspecifika uppgifter
- Ingen historik eller ägarinformation
- Ingen finansiell data
- Bulk download kräver lokal parsing

### Rekommenderad användning
- **Primär källa:** Bolagsverket eller Roaring.io
- **Sekundär källa:** SCB för statistik och SNI-koder
- **Compliance:** NIX-registret via SCB

---

## Filer och Mappar

```
SCB/
├── INDEX.md (denna fil)
└── Värdefulladatamängder/
    ├── UPDATE_SCHEDULE.md (delad med Bolagsverket)
    ├── scb_bulkfil.zip (67 MB)
    └── schemas/
        ├── 01_scb_grunddata.json
        ├── 02_foretagsstatus.json
        ├── 03_juridisk_enhet_status.json
        ├── 04_juridisk_form.json
        ├── 05_sni_koder.json
        ├── 06_adressfalt.json
        └── 07_reklamsparre.json
```

---

## Legal och Compliance

### NIX-registret (Reklamspärr)
- **Operator:** Driva Mera i Sverige AB
- **Lagstöd:** Marknadsföringslagen (2008:486) 19 §
- **GDPR:** Artikel 6 (lawfulness), Artikel 21 (right to object)
- **Sanktion:** Böter vid överträdelse

### VIKTIGT - Marknadsföringskontroll
```
OM Reklam = "1" → SKICKA INTE direktreklam (LAGBROTT!)
OM Reklam = "2" → Direktreklam tillåten MEN kontrollera GDPR compliance
```

Se [07_reklamsparre.json](Värdefulladatamängder/schemas/07_reklamsparre.json) för fullständig legal information.

---

## Nästa steg

- [ ] Implementera parsing av scb_bulkfil.zip
- [ ] Skapa databas-schema för import
- [ ] Integration med backend API
- [ ] NIX-kontroll i marketing workflow
- [ ] SNI-kod lookup funktion
- [ ] Automatisk veckovis uppdatering (cron/GitHub Actions)

---

## Referenser

- **SCB Webbplats:** https://www.scb.se/
- **SNI 2007-standarden:** https://www.scb.se/vara-tjanster/klassificeringar-och-standarder/standard-for-svensk-naringsgrensindelning-sni/
- **NIX-registret:** https://www.nixregistret.se/
- **Värdefulladatamängder:** https://bolagsverket.se/foretag/oppnadata/nedladdningsbara-filer
- **EU Open Data Directive:** https://data.europa.eu/en/highlights/eu-open-data-directive

---

**Det som inte finns i detta index FINNS INTE i SCB-modulen!**