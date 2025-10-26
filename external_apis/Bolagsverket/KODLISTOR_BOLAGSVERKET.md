# Kodlistor - Bolagsverket Värdefulla Datamängder API

> **Källa:** Bolagsverket Developer Portal  
> **Uppdaterad:** 2025-10-23  
> **Användning:** Lookup-tabeller för mappning av API-koder till läsbar text

---

## 📋 Innehåll

1. [Avregistreringsorsak](#1-avregistreringsorsak)
2. [Identitetsbeteckningstyp](#2-identitetsbeteckningstyp)
3. [Juridisk form](#3-juridisk-form)
4. [Organisationsform](#4-organisationsform)
5. [Organisationsnamntyp](#5-organisationsnamntyp)
6. [Pågående avvecklings- eller omstruktureringsförfarande](#6-pågående-avvecklings--eller-omstruktureringsförfarande)
7. [SNI-koder](#7-sni-koder)

---

## 1. Avregistreringsorsak
**The reason an organisation was removed from the register**

| Kod | Beskrivning |
|-----|-------------|
| `AKEJH` | Aktiekapitalet inte höjts |
| `ARSEED` | Årsredovisning saknas |
| `AVREG` | Avregistrerad |
| `BABAKEJH` | Ombildat till bankaktiebolag eller aktiekapitalet inte höjts |
| `DELAV` | Delning |
| `DOM` | Beslut av domstol |
| `FUAV` | Fusion |
| `GROMAV` | Gränsöverskridande ombildning |
| `KKAV` | Konkurs |
| `LIAV` | Likvidation |
| `NYINN` | Ny innehavare |
| `OMAV` | Ombildning |
| `OMBAB` | Ombildat till bankaktiebolag |
| `OVERK` | Overksamhet |
| `UTLKKLI` | Det utländska företagets likvidation eller konkurs |
| `VERKUPP` | Verksamheten har upphört |
| `VDSAK` | Verkställande direktör saknas |

---

## 2. Identitetsbeteckningstyp
**Type of identity**

### 2.1 IdentitetsbeteckningstypOrganisation
**Type of identity of a company**

| Kod | Beskrivning |
|-----|-------------|
| `DODSBO` | Dödsbonummer |
| `GDNUMMER` | Identitetsbeteckning person (GD-nummer) |
| `ORGANISATIONSNUMMER` | Organisationsnummer |
| `PERSONNUMMER` | Identitetsbeteckning person (personnummer) |
| `SAMORDNINGSNUMMER` | Identitetsbeteckning person (Samordningsnummer) |
| `UTLANDSK_JURIDISK_IDENTITETSBETECKNING` | Utländsk identitetsbeteckning |

### 2.2 IdentitetsbeteckningstypPerson
**Type of identity of a company officer**

| Kod | Beskrivning |
|-----|-------------|
| `FODELSEDATUM` | Födelsedatum |
| `GDNUMMER` | GD-nummer |
| `PERSONNUMMER` | Personnummer |
| `SAMORDNINGSNUMMER` | Samordningsnummer |

---

## 3. Juridisk form
**Legal form**

> **Källa:** Skatteverket  
> **URL:** https://www.skatteverket.se/foretag/drivaforetag/startaochregistrera/organisationsnummer.4.361dc8c15312eff6fd235d1.html

**OBS:** Se Skatteverkets hemsida för fullständig lista över juridiska former och deras koder.

---

## 4. Organisationsform ⭐
**Form of organisation**

> **VIKTIG:** Detta är den primära kodlistan för företagstyper som behövs för UI-presentation.

| Kod | Beskrivning |
|-----|-------------|
| `AB` | Aktiebolag |
| `BAB` | Bankaktiebolag |
| `BF` | Bostadsförening |
| `BFL` | Utländsk banks filial |
| `BRF` | Bostadsrättsförening |
| `E` | Enskild näringsverksamhet |
| `EB` | Enkla bolag |
| `EEIG` | Europeisk ekonomisk intressegruppering |
| `EGTS` | Europeiska grupperingar för territoriellt samarbete |
| `EK` | Ekonomisk förening |
| `FAB` | Försäkringsaktiebolag |
| `FF` | Försäkringsförmedlare |
| `FL` | Filial |
| `FOF` | Försäkringsförening |
| `HB` | Handelsbolag |
| `I` | Ideell förening som bedriver näringsverksamhet |
| `KB` | Kommanditbolag |
| `KHF` | Kooperativ hyresrättsförening |
| `MB` | Medlemsbank |
| `OFB` | Ömsesidigt försäkringsbolag |
| `OTPB` | Ömsesidigt tjänstepensionsbolag |
| `S` | Stiftelse som bedriver näringsverksamhet |
| `SB` | Sparbank |
| `SCE` | Europakooperativ |
| `SE` | Europabolag |
| `SF` | Sambruksförening |
| `TPAB` | Tjänstepensionsaktiebolag |
| `TPF` | Tjänstepensionsförening |
| `TSF` | Trossamfund som bedriver näringsverksamhet |

### Vanligaste formerna (för KYC-onboarding):
- **AB** - Aktiebolag (mest vanlig)
- **E** - Enskild näringsverksamhet
- **HB** - Handelsbolag
- **KB** - Kommanditbolag
- **EK** - Ekonomisk förening
- **BRF** - Bostadsrättsförening

---

## 5. Organisationsnamntyp
**Type of business name**

| Kod | Beskrivning |
|-----|-------------|
| `FORETAGSNAMN` | Företagsnamn |
| `FORNAMN_FRSPRAK` | Företagsnamn på främmande språk |
| `NAMN` | Namn |
| `SARSKILT_FORETAGSNAMN` | Särskilt företagsnamn |

---

## 6. Pågående avvecklings- eller omstruktureringsförfarande
**Ongoing liquidation or restructuring proceedings**

| Kod | Beskrivning |
|-----|-------------|
| `AC` | Ackordsförhandling |
| `DEOL` | Överlåtande vid delning |
| `DEOT` | Övertagande vid delning |
| `FR` | Företagsrekonstruktion |
| `FUOL` | Överlåtande i fusion |
| `FUOT` | Övertagande i fusion |
| `GROM` | Gränsöverskridande ombildning |
| `KK` | Konkurs |
| `LI` | Likvidation |
| `OM` | Ombildning |
| `RES` | Resolution |

### Högriskstatus (för KYC):
- **KK** - Konkurs ⚠️
- **LI** - Likvidation ⚠️
- **FR** - Företagsrekonstruktion ⚠️
- **AC** - Ackordsförhandling ⚠️

---

## 7. SNI-koder ⭐
**Standard för svensk näringsgrensindelning (SNI codes – Standard for Swedish industry classification)**

> **Källa:** Statistikmyndigheten (SCB)  
> **URL:** https://snisok.scb.se/

**Format:** 5-siffrig kod (t.ex. `62010`)

### Exempel på SNI-koder:

| Kod | Beskrivning |
|-----|-------------|
| `62010` | Programverksamhet |
| `70220` | Konsultverksamhet avseende företags organisation |
| `69201` | Redovisning och bokföring |
| `64190` | Annan bankverksamhet |
| `41200` | Byggnation av bostadshus och andra byggnader |

**OBS:** För fullständig lista med alla ~850 SNI-koder, använd SCB:s sökverktyg: https://snisok.scb.se/

---

## 💾 Användning i Backend

### Python Dictionary Format
```python
# backend/utils/bolagsverket_codes.py

ORGANISATIONSFORM = {
    "AB": "Aktiebolag",
    "BAB": "Bankaktiebolag",
    "BF": "Bostadsförening",
    "BFL": "Utländsk banks filial",
    "BRF": "Bostadsrättsförening",
    "E": "Enskild näringsverksamhet",
    "EB": "Enkla bolag",
    "EEIG": "Europeisk ekonomisk intressegruppering",
    "EGTS": "Europeiska grupperingar för territoriellt samarbete",
    "EK": "Ekonomisk förening",
    "FAB": "Försäkringsaktiebolag",
    "FF": "Försäkringsförmedlare",
    "FL": "Filial",
    "FOF": "Försäkringsförening",
    "HB": "Handelsbolag",
    "I": "Ideell förening som bedriver näringsverksamhet",
    "KB": "Kommanditbolag",
    "KHF": "Kooperativ hyresrättsförening",
    "MB": "Medlemsbank",
    "OFB": "Ömsesidigt försäkringsbolag",
    "OTPB": "Ömsesidigt tjänstepensionsbolag",
    "S": "Stiftelse som bedriver näringsverksamhet",
    "SB": "Sparbank",
    "SCE": "Europakooperativ",
    "SE": "Europabolag",
    "SF": "Sambruksförening",
    "TPAB": "Tjänstepensionsaktiebolag",
    "TPF": "Tjänstepensionsförening",
    "TSF": "Trossamfund som bedriver näringsverksamhet"
}

AVREGISTRERINGSORSAK = {
    "AKEJH": "Aktiekapitalet inte höjts",
    "ARSEED": "Årsredovisning saknas",
    "AVREG": "Avregistrerad",
    "BABAKEJH": "Ombildat till bankaktiebolag eller aktiekapitalet inte höjts",
    "DELAV": "Delning",
    "DOM": "Beslut av domstol",
    "FUAV": "Fusion",
    "GROMAV": "Gränsöverskridande ombildning",
    "KKAV": "Konkurs",
    "LIAV": "Likvidation",
    "NYINN": "Ny innehavare",
    "OMAV": "Ombildning",
    "OMBAB": "Ombildat till bankaktiebolag",
    "OVERK": "Overksamhet",
    "UTLKKLI": "Det utländska företagets likvidation eller konkurs",
    "VERKUPP": "Verksamheten har upphört",
    "VDSAK": "Verkställande direktör saknas"
}

PAGAENDE_AVVECKLING = {
    "AC": "Ackordsförhandling",
    "DEOL": "Överlåtande vid delning",
    "DEOT": "Övertagande vid delning",
    "FR": "Företagsrekonstruktion",
    "FUOL": "Överlåtande i fusion",
    "FUOT": "Övertagande i fusion",
    "GROM": "Gränsöverskridande ombildning",
    "KK": "Konkurs",
    "LI": "Likvidation",
    "OM": "Ombildning",
    "RES": "Resolution"
}

# Högriskfaktorer för KYC
HOGRISK_AVVECKLING = ["KK", "LI", "FR", "AC"]

def get_organisationsform_text(code: str) -> str:
    """Returnerar klartext för organisationsform-kod"""
    return ORGANISATIONSFORM.get(code, f"Okänd ({code})")

def is_hogrisk_status(code: str) -> bool:
    """Kontrollerar om företaget har högriskstatus"""
    return code in HOGRISK_AVVECKLING
```

### JSON Format (för frontend)
```json
{
  "organisationsform": {
    "AB": "Aktiebolag",
    "E": "Enskild näringsverksamhet",
    "HB": "Handelsbolag",
    "KB": "Kommanditbolag",
    "EK": "Ekonomisk förening"
  }
}
```

---

## 8. Filformat för dokument
**File format for documents returned from /dokumentlista**

Baserat på API-specifikationen returneras dokument i följande format:

| Fält | Typ | Beskrivning |
|------|-----|-------------|
| `dokumentId` | string | Unikt ID för dokumentet (används i GET /dokument/{dokumentId}) |
| `filformat` | string | Filformat för dokumentet (t.ex. "ZIP") |
| `rapporteringsperiodTom` | date | Slutdatum för rapporteringsperioden (räkenskapsårets slut) |
| `registreringstidpunkt` | date | När dokumentet registrerades hos Bolagsverket |

### Exempel på response från /dokumentlista:
```json
{
  "dokument": [
    {
      "dokumentId": "ABC123XYZ789",
      "filformat": "ZIP",
      "rapporteringsperiodTom": "2024-12-31",
      "registreringstidpunkt": "2025-04-15"
    },
    {
      "dokumentId": "DEF456UVW012",
      "filformat": "ZIP",
      "rapporteringsperiodTom": "2023-12-31",
      "registreringstidpunkt": "2024-04-20"
    }
  ]
}
```

### Dokumenttyp
**OBS:** API:et returnerar endast **digitalt inlämnade årsredovisningar**. Alla dokument är av typen "Årsredovisning" i ZIP-format.

För att identifiera vilket räkenskapsår dokumentet avser, använd fältet `rapporteringsperiodTom`.

---

## 📝 TODO: SNI-kodlista

För att skapa en komplett SNI-kodlista, behöver vi:

1. **Scrapa från SCB:** https://snisok.scb.se/
2. **Alternativt:** Ladda ner officiell Excel/CSV från SCB
3. **Skapa lookup-tabell:** `backend/data/sni_codes.json` eller `sni_codes.csv`

**Format:**
```json
{
  "62010": "Programverksamhet",
  "62020": "Konsultverksamhet avseende informationsteknologi",
  "69201": "Redovisning och bokföring"
}
```

---

## 🔄 Uppdateringar

- **2025-10-23:** Initial version baserad på Bolagsverket Developer Portal dokumentation
- **Nästa:** Lägg till komplett SNI-kodlista från SCB

