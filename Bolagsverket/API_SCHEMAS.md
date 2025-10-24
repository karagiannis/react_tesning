# Bolagsverket Värdefulla Datamängder - API Schemas

> **Källa:** Bolagsverket Developer Portal - OpenAPI/Swagger Specification  
> **Uppdaterad:** 2025-10-23  
> **Användning:** Kompletta datamodeller för request/response objekt

---

## 📋 Innehåll

### Request Schemas
1. [OrganisationerBegaran](#organisationerbegaran) - Request för /organisationer
2. [DokumentlistaBegaran](#dokumentlistabegaran) - Request för /dokumentlista

### Response Schemas
3. [OrganisationerSvar](#organisationersvar) - Response från /organisationer
4. [DokumentlistaSvar](#dokumentlistasvar) - Response från /dokumentlista

### Nested/Component Schemas
5. [Organisation](#organisation) - En organisation
6. [Identitetsbeteckning](#identitetsbeteckning) - Identifikation
7. [Organisationsnamn](#organisationsnamn) - Namn
8. [KodKlartext](#kodklartext) - Kod + text
9. [Fel](#fel) - Felstruktur (nested i response-objekt)
10. [ApiError](#apierror) - Top-level API error (RFC 7807)
11. [... och fler](#) - Kompletteras efter hand

---

## Request Schemas

### OrganisationerBegaran
**Request body för POST /organisationer**

An object to specify identitetsbeteckning (company registration number).

#### Properties

| Fält | Typ | Required | Beskrivning |
|------|-----|----------|-------------|
| `identitetsbeteckning` | string | ✅ Required | Organisationsnummer, personnummer, samordningsnummer eller GD-nummer |

#### Example
```json
{
  "identitetsbeteckning": "556903-8671"
}
```

---

### DokumentlistaBegaran
**Request body för POST /dokumentlista**

An object to specify identitetsbeteckning (company registration number) used to retrieve a list of annual reports.

**OBS:** Identisk struktur som [OrganisationerBegaran](#organisationerbegaran).

#### Properties

| Fält | Typ | Required | Beskrivning |
|------|-----|----------|-------------|
| `identitetsbeteckning` | string | ✅ Required | Organisationsnummer, personnummer, samordningsnummer eller GD-nummer |

#### Example
```json
{
  "identitetsbeteckning": "556903-8671"
}
```

---

## Response Schemas

### OrganisationerSvar
**Response från POST /organisationer**

The response with requested organisation data as a list.

#### Properties

| Fält | Typ | Required | Beskrivning |
|------|-----|----------|-------------|
| `organisationer` | array[[Organisation](#organisation)] | ✅ | Lista med organisationer (oftast en) |

#### Structure Overview
```
OrganisationerSvar
└── organisationer: array
    └── Organisation
        ├── organisationsidentitet: Identitetsbeteckning
        ├── namnskyddslopnummer: integer
        ├── organisationsnamn: Organisationsnamn
        ├── registreringsland: KodKlartext
        ├── reklamsparr: Reklamsparr
        ├── organisationsform: Organisationsform
        ├── avregistreradOrganisation: AvregistreradOrganisation
        ├── avregistreringsorsak: Avregistreringsorsak
        ├── pagaendeAvvecklingsEllerOmstruktureringsforfarande: PagaendeAvvecklingsEllerOmstruktureringsforfarande
        ├── juridiskForm: JuridiskForm
        ├── verksamOrganisation: VerksamOrganisation
        ├── organisationsdatum: Organisationsdatum
        ├── verksamhetsbeskrivning: Verksamhetsbeskrivning
        ├── naringsgrenOrganisation: NaringsgrenOrganisation
        └── postadressOrganisation: PostadressOrganisation
```

---

### DokumentlistaSvar
**Response från POST /dokumentlista**

A list of available annual reports.

#### Properties

| Fält | Typ | Required | Beskrivning |
|------|-----|----------|-------------|
| `dokument` | array[[Dokument](#dokument-object)] | ✅ | Lista med dokument-metadata |

#### Dokument Object

| Fält | Typ | Required | Beskrivning | Format |
|------|-----|----------|-------------|--------|
| `dokumentId` | string | ✅ | Unikt ID för dokumentet (används i GET /dokument/{dokumentId}) | - |
| `filformat` | string | ✅ | Filformat | Vanligtvis "ZIP" |
| `rapporteringsperiodTom` | string (date) | ✅ | Slutdatum för rapporteringsperioden (räkenskapsårets slut) | YYYY-MM-DD |
| `registreringstidpunkt` | string (date) | ✅ | När dokumentet registrerades hos Bolagsverket | YYYY-MM-DD |

#### Example
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

#### Notes
- Alla dokument är **digitalt inlämnade årsredovisningar**
- Använd `rapporteringsperiodTom` för att identifiera vilket räkenskapsår dokumentet avser
- Dokumenten returneras som ZIP-filer (vanligtvis innehåller XBRL/iXBRL + PDF)

---

## Nested/Component Schemas

### Organisation
**Organisation information including the identitetsbeteckning specified in the request, and a series of elements holding the high-value datasets.**

#### Properties

| Fält | Typ | Beskrivning | Example |
|------|-----|-------------|---------|
| `organisationsidentitet` | [Identitetsbeteckning](#identitetsbeteckning) | Unikt ID för organisationen | Se nedan |
| `namnskyddslopnummer` | integer (int32) | Används för att separera företag vid samma orgnr (t.ex. enskild firma). Range: 1-999 | `1` |
| `organisationsnamn` | [Organisationsnamn](#organisationsnamn) | Företagsnamn | Se nedan |
| `registreringsland` | [KodKlartext](#kodklartext) | Land där företaget är registrerat | `{"kod":"SE","klartext":"Sverige"}` |
| `reklamsparr` | [Reklamsparr](#reklamsparr) | Om företaget spärrat reklam | `{"kod":"JA"}` |
| `organisationsform` | [Organisationsform](#organisationsform) | Företagsform (AB, HB, etc.) | `{"kod":"AB","klartext":"Aktiebolag"}` |
| `avregistreradOrganisation` | [AvregistreradOrganisation](#avregistreradorganisation) | Datum för avregistrering | `{"avregistreringsdatum":"2023-05-05T00:00:00.000+00:00"}` |
| `avregistreringsorsak` | [Avregistreringsorsak](#avregistreringsorsak) | Orsak till avregistrering | `{"kod":"LIAV","klartext":"Likvidation"}` |
| `pagaendeAvvecklingsEllerOmstruktureringsforfarande` | [PagaendeAvvecklingsEllerOmstruktureringsforfarande](#pagaendeavvecklingelleromstruktureringsforfarande) | Pågående konkurs, likvidation, etc. | Se nedan |
| `juridiskForm` | [JuridiskForm](#juridiskform) | Juridisk form från Skatteverket | `{"kod":"49","klartext":"Övriga aktiebolag"}` |
| `verksamOrganisation` | [VerksamOrganisation](#verksamorganisation) | Om organisationen är aktiv | `{"kod":"JA"}` |
| `organisationsdatum` | [Organisationsdatum](#organisationsdatum) | Registreringsdatum | `{"registreringsdatum":"2000-01-23","infortHosScb":"2000-02-03"}` |
| `verksamhetsbeskrivning` | [Verksamhetsbeskrivning](#verksamhetsbeskrivning) | Textbeskrivning av verksamhet | `{"beskrivning":"Handel med skor"}` |
| `naringsgrenOrganisation` | [NaringsgrenOrganisation](#naringsgrenorganisation) | SNI-koder | `{"sni":"kod = 01120, klartext = Odling av ris"}` |
| `postadressOrganisation` | [PostadressOrganisation](#postadressorganisation) | Postadress | Se nedan |

---

### Identitetsbeteckning
**Unique identification of an organisation.**

A unique set of characters used to identify the registered organisation.

#### Identitetsbeteckningstyper:
- **Organisationsnummer** (company registration number): 10 digits
- **Personnummer** (personal identity number): 12 digits (YYYYMMDDXXXX)
- **Samordningsnummer**: 12 digits (YYYYMMDDXXXX, där DD = födelsedag + 60)
- **GD-nummer**: 10 digits (302XXXXXXX)

#### Properties

| Fält | Typ | Required | Beskrivning | Validation |
|------|-----|----------|-------------|------------|
| `identitetsbeteckning` | string | ✅ Required | Själva numret | Regex: `^(19\|20)?\d{2}(0[1-9]\|1[0-2])((0\|6)[1-9]\|(1\|2\|7\|8)[0-9]\|(3\|9)[0\|1])\d{4}$\|\^\d{6}\d{4}$\|^302\d{8}$` |
| `typ` | [KodKlartext](#kodklartext) | ✅ Required | Typ av identitetsbeteckning | - |

#### Example
```json
{
  "identitetsbeteckning": "5299999994",
  "typ": {
    "kod": "ORGANISATIONSNUMMER",
    "klartext": "Organisationsnummer"
  }
}
```

---

### Organisationsnamn
**The business names associated with the organisation.**

#### Properties

| Fält | Typ | Required | Beskrivning |
|------|-----|----------|-------------|
| `organisationsnamnLista` | array[[Namn](#namn)] | - | Lista med namn (kan vara flera) |
| `dataproducent` | string (enum) | - | Källa: "Bolagsverket" eller "SCB" |
| `fel` | [Fel](#fel) | - | Eventuellt fel |

#### Namn Object

| Fält | Typ | Required | Beskrivning |
|------|-----|----------|-------------|
| `namn` | string | - | Företagsnamnet |
| `registreringsdatum` | string (date) | - | När namnet registrerades (format: YYYY-MM-DD) |
| `organisationsnamntyp` | [KodKlartext](#kodklartext) | - | Typ av namn (FORETAGSNAMN, SARSKILT_FORETAGSNAMN, etc.) |
| `verksamhetsbeskrivningSarskiltForetagsnamn` | string | - | Verksamhetsbeskrivning för särskilt företagsnamn |

#### Example
```json
{
  "organisationsnamnLista": [
    {
      "namn": "Cykelbolaget AB",
      "registreringsdatum": "2024-03-15",
      "organisationsnamntyp": {
        "kod": "FORETAGSNAMN",
        "klartext": "Företagsnamn"
      },
      "verksamhetsbeskrivningSarskiltForetagsnamn": "Att bedriva handel med mopeder."
    }
  ],
  "dataproducent": "Bolagsverket",
  "fel": null
}
```

---

### KodKlartext
**Standard struktur för kod + beskrivning**

Used throughout the API for code-text pairs.

#### Properties

| Fält | Typ | Required | Beskrivning |
|------|-----|----------|-------------|
| `kod` | string | ✅ Required | Koden (t.ex. "AB", "LIAV", "JA") |
| `klartext` | string | ✅ Required | Läsbar text (t.ex. "Aktiebolag", "Likvidation", "Ja") |

#### Example
```json
{
  "kod": "AB",
  "klartext": "Aktiebolag"
}
```

---

### PagaendeAvvecklingsEllerOmstruktureringsforfarande
**Indicates ongoing liquidation or restructuring proceedings.**

#### Properties

| Fält | Typ | Beskrivning |
|------|-----|-------------|
| `pagaendeAvvecklingsEllerOmstruktureringsforfarandeLista` | array[object] | Lista med pågående förfaranden |
| `fel` | [Fel](#fel) | Eventuellt fel |
| `dataproducent` | string | Källa |

#### Förfarande Object

| Fält | Typ | Beskrivning |
|------|-----|-------------|
| `kod` | string | Typ av förfarande (KK, LI, FR, etc.) |
| `klartext` | string | Läsbar text |
| `fromDatum` | string (date-time) | Startdatum för förfarandet |

#### Example
```json
{
  "pagaendeAvvecklingsEllerOmstruktureringsforfarandeLista": [
    {
      "kod": "KK",
      "klartext": "Konkurs",
      "fromDatum": "2024-01-26T00:00:00.000+00:00"
    }
  ],
  "fel": null,
  "dataproducent": "Bolagsverket"
}
```

---

### Reklamsparr
**Indicates if the organisation is blocked from receiving advertisement.**

#### Properties

| Fält | Typ | Required | Beskrivning | Allowed Values |
|------|-----|----------|-------------|----------------|
| `kod` | string | ✅ Required | Reklamsparr aktiv eller ej | "JA", "NEJ" |
| `dataproducent` | string (enum) | - | Källa | "Bolagsverket", "SCB" |
| `fel` | [Fel](#fel) | - | Eventuellt fel | - |

#### Example
```json
{
  "kod": "JA",
  "dataproducent": "Bolagsverket",
  "fel": null
}
```

**OBS:** Om objektet är `null`, har Bolagsverket svarat med information om postadress och ingen reklamsparr är registrerad.

---

### Organisationsform
**Indicates the administrative form in which an organisation conducts its activities.**

#### Properties

| Fält | Typ | Required | Beskrivning | Validation |
|------|-----|----------|-------------|------------|
| `kod` | string | ✅ Required | Organisationsform-kod (AB, E, HB, KB, etc.) | 1-4 characters |
| `klartext` | string | ✅ Required | Läsbar text | - |
| `dataproducent` | string (enum) | - | Källa | "Bolagsverket", "SCB" |
| `fel` | [Fel](#fel) | - | Eventuellt fel | - |

#### Example
```json
{
  "kod": "AB",
  "klartext": "Aktiebolag",
  "dataproducent": "Bolagsverket",
  "fel": null
}
```

Se [KODLISTOR_BOLAGSVERKET.md](./KODLISTOR_BOLAGSVERKET.md#4-organisationsform-) för alla 29 koder.

---

### AvregistreradOrganisation
**The date an organisation was removed from the register.**

#### Properties

| Fält | Typ | Beskrivning |
|------|-----|-------------|
| `avregistreringsdatum` | string (date-time) | Datum för avregistrering |
| `fel` | [Fel](#fel) | Eventuellt fel |
| `dataproducent` | string | Källa |

#### Example
```json
{
  "avregistreringsdatum": "2023-05-05T00:00:00.000+00:00",
  "fel": null,
  "dataproducent": "Bolagsverket"
}
```

---

### Avregistreringsorsak
**The reason an organisation was removed from the register.**

#### Properties

| Fält | Typ | Beskrivning |
|------|-----|-------------|
| `kod` | string | Orsak-kod (LIAV, KKAV, FUAV, etc.) |
| `klartext` | string | Läsbar text |
| `fel` | [Fel](#fel) | Eventuellt fel |
| `dataproducent` | string | Källa |

#### Example
```json
{
  "kod": "LIAV",
  "klartext": "Likvidation",
  "fel": null,
  "dataproducent": "Bolagsverket"
}
```

Se [KODLISTOR_BOLAGSVERKET.md](./KODLISTOR_BOLAGSVERKET.md#1-avregistreringsorsak) för alla koder.

---

### JuridiskForm
**Legal form registered at the Swedish Tax Agency.**

#### Properties

| Fält | Typ | Required | Beskrivning | Validation |
|------|-----|----------|-------------|------------|
| `kod` | string | ✅ Required | Juridisk form-kod från Skatteverket | 1-4 characters |
| `klartext` | string | ✅ Required | Läsbar text | - |
| `dataproducent` | string (enum) | - | Källa | "Bolagsverket", "SCB" |
| `fel` | [Fel](#fel) | - | Eventuellt fel | - |

#### Example
```json
{
  "kod": "49",
  "klartext": "Övriga aktiebolag",
  "dataproducent": "Bolagsverket",
  "fel": null
}
```

**OBS:** Se Skatteverkets hemsida för fullständig lista: https://www.skatteverket.se/foretag/drivaforetag/startaochregistrera/organisationsnummer.4.361dc8c15312eff6fd235d1.html

---

### VerksamOrganisation
**Indicates if the organisation is active.**

#### Properties

| Fält | Typ | Required | Beskrivning | Allowed Values |
|------|-----|----------|-------------|----------------|
| `kod` | string | ✅ Required | Om organisationen är aktiv | "JA", "NEJ" |
| `dataproducent` | string (enum) | - | Källa | "Bolagsverket", "SCB" |
| `fel` | [Fel](#fel) | - | Eventuellt fel | - |

#### Example
```json
{
  "kod": "JA",
  "dataproducent": "Bolagsverket",
  "fel": null
}
```

---

### Organisationsdatum
**Specifies the date an organisation was registered.**

#### Properties

| Fält | Typ | Required | Beskrivning | Format |
|------|-----|----------|-------------|--------|
| `registreringsdatum` | string (date) | ✅ Required | Datum när företaget registrerades | YYYY-MM-DD |
| `infortHosScb` | string (date) | - | Datum när införd hos SCB | YYYY-MM-DD |
| `dataproducent` | string (enum) | - | Källa | "Bolagsverket", "SCB" |
| `fel` | [Fel](#fel) | - | Eventuellt fel | - |

#### Example
```json
{
  "registreringsdatum": "2000-01-23",
  "infortHosScb": "2000-02-03",
  "dataproducent": "Bolagsverket",
  "fel": null
}
```

---

### Verksamhetsbeskrivning
**Description of the business activities. Can be a lot of text in some cases.**

#### Properties

| Fält | Typ | Required | Beskrivning |
|------|-----|----------|-------------|
| `beskrivning` | string | ✅ Required | Fritextbeskrivning av verksamhet |
| `dataproducent` | string (enum) | - | Källa: "Bolagsverket" eller "SCB" |
| `fel` | [Fel](#fel) | - | Eventuellt fel |

#### Example
```json
{
  "beskrivning": "Handel med skor",
  "dataproducent": "Bolagsverket",
  "fel": null
}
```

---

### NaringsgrenOrganisation
**A code that indicates an organisations main business activities.**

#### Properties

| Fält | Typ | Required | Beskrivning |
|------|-----|----------|-------------|
| `sni` | array[[KodKlartext](#kodklartext)] | ✅ Required | SNI-koder (kan vara flera) |
| `dataproducent` | string (enum) | - | Källa: "Bolagsverket" eller "SCB" |
| `fel` | [Fel](#fel) | - | Eventuellt fel |

#### Example (från dokumentation)
```json
{
  "sni": "kod = 01120, klartext = Odling av ris",
  "dataproducent": "Bolagsverket",
  "fel": null
}
```

#### Example (korrekt struktur - array)
```json
{
  "sni": [
    {
      "kod": "01120",
      "klartext": "Odling av ris"
    }
  ],
  "dataproducent": "Bolagsverket",
  "fel": null
}
```

**OBS:** 
- SNI-koder är 5-siffriga
- Ett företag kan ha flera SNI-koder
- Se SCB:s söktjänst: https://snisok.scb.se/

---

### PostadressOrganisation
**Registered postal address.**

#### Properties

| Fält | Typ | Required | Beskrivning |
|------|-----|----------|-------------|
| `postadress` | [Postadress](#postadress) | ✅ Required | Adressobjekt |
| `dataproducent` | string (enum) | - | Källa: "Bolagsverket" eller "SCB" |
| `fel` | [Fel](#fel) | - | Eventuellt fel |

#### Postadress Object

| Fält | Typ | Required | Beskrivning |
|------|-----|----------|-------------|
| `postnummer` | string | ✅ Required | Postnummer |
| `utdelningsadress` | string | - | Gatuadress |
| `postort` | string | - | Postort |
| `land` | string | - | Land |
| `coAdress` | string | - | C/O-adress |

#### Example
```json
{
  "postadress": {
    "postnummer": "12345",
    "utdelningsadress": "Jobbstigen 2",
    "postort": "Grönköping",
    "land": "Sverige",
    "coAdress": "C/o Annat företag"
  },
  "dataproducent": "Bolagsverket",
  "fel": null
}
```

---

### Fel
**Error structure used throughout the API (nested in response objects).**

An error (fel) is primarily defined by its type (feltyp). To describe the nature of the fault and error, description (felbeskrivning) is used.

**OBS:** Detta är det interna fel-objektet. För top-level API errors, se [ApiError](#apierror).

#### Properties

| Fält | Typ | Required | Beskrivning |
|------|-----|----------|-------------|
| `typ` | string (enum) | ✅ Required | Feltyp |
| `felBeskrivning` | string | - | Beskrivning av felet |

#### Feltyper (enum)

| Kod | Beskrivning |
|-----|-------------|
| `ORGANISATION_FINNS_EJ` | Organisation finns inte i registret |
| `OGILTIG_BEGARAN` | Ogiltig request (t.ex. felaktig identitetsbeteckning) |
| `OTILLGANGLIG_UPPGIFTSKALLA` | Datakällan är inte tillgänglig |
| `TIMEOUT` | Timeout vid anrop |

#### Example
```json
{
  "typ": "OGILTIG_BEGARAN",
  "felBeskrivning": "Identitetsbeteckning saknas"
}
```

---

### ApiError
**Top-level error information returned by the API. Based on RFC 7807.**

This is the error structure returned as HTTP response body when the API call itself fails (e.g., validation error, authentication error, network error).

#### Properties

| Fält | Typ | Required | Beskrivning | Format |
|------|-----|----------|-------------|--------|
| `type` | string (enum) | ✅ Required | Error type URI | See enum below |
| `instance` | string | ✅ Required | Unique error instance identifier | E.g., "validation.client" |
| `status` | integer | ✅ Required | HTTP status code | E.g., 400, 401, 403, 500 |
| `timestamp` | string (date-time) | - | Error timestamp | ISO 8601: YYYY-MM-DDTHH:MM:SSZ |
| `requestId` | string | - | X-Request-Id from request header | UUID format |
| `title` | string | ✅ Required | Short error description | E.g., "Bad Request" |
| `detail` | string | - | Detailed error description | E.g., "JSON parse error" |

#### Type URIs (enum)

| Type | Beskrivning |
|------|-------------|
| `about:blank` | Generic error without specific type |
| `urn:bolagsverket:error:auth` | Authentication/authorization error |
| `urn:bolagsverket:error:network` | Network-related error |
| `urn:bolagsverket:error:validation` | Validation error in request |

#### Instance Values

A certain value on `instance` is a unique type of error but also associated with a `type`. One value on `instance` shall only occur with one value on `type`.

**Examples:**
- `validation.client` → Associated with `urn:bolagsverket:error:validation`
- `auth.token_expired` → Associated with `urn:bolagsverket:error:auth`

#### Example (400 Validation Error)
```json
{
  "type": "urn:bolagsverket:error:validation",
  "instance": "validation.client",
  "status": 400,
  "timestamp": "2024-09-18T09:32:24Z",
  "requestId": "d120654c-0d09-481a-8956-940a76474e6b",
  "title": "Bad Request",
  "detail": "JSON parse error"
}
```

#### Example (401 Auth Error)
```json
{
  "type": "urn:bolagsverket:error:auth",
  "instance": "auth.token_expired",
  "status": 401,
  "timestamp": "2024-09-18T10:15:30Z",
  "requestId": "f628a504-4631-4c04-8358-f17fc370ac79",
  "title": "Unauthorized",
  "detail": "Access token has expired"
}
```

#### HTTP Status Codes

| Status | Title | Vanlig anledning |
|--------|-------|------------------|
| 400 | Bad Request | Ogiltig JSON, saknade fält |
| 401 | Unauthorized | Ogiltig/utgången token |
| 403 | Forbidden | Saknar behörighet |
| 404 | Not Found | Organisation/dokument finns ej |
| 500 | Internal Server Error | Serverfel |



## 📝 Status

**Schemas mottagna:**
- ✅ OrganisationerBegaran (Request)
- ✅ OrganisationerSvar (Response - komplett med alla sub-schemas)
- ✅ DokumentlistaBegaran (Request)
- ✅ DokumentlistaSvar (Response - komplett)
- ✅ Organisation (Komplett med alla properties och validation rules)
- ✅ ApiError (RFC 7807 error response)
- ✅ Fel (Internal error object)
- ✅ Alla nested schemas (Identitetsbeteckning, Organisationsnamn, KodKlartext, Reklamsparr, Organisationsform, AvregistreradOrganisation, Avregistreringsorsak, PagaendeAvvecklingsEllerOmstruktureringsforfarande, JuridiskForm, VerksamOrganisation, Organisationsdatum, Verksamhetsbeskrivning, NaringsgrenOrganisation, PostadressOrganisation)

**Nästa:** Fortsätt pejsta om det finns fler schemas!

---

## 🔄 Uppdateringar

- **2025-10-23 15:00:** Initial version med OrganisationerBegaran och grundstruktur
- **2025-10-23 15:15:** Lade till OrganisationerSvar + alla sub-schemas från första schemat

