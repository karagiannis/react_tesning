# Population Register API (SPAR) - Schema Documentation

> **Version:** 2.0  
> **Base URL:** `https://api.roaring.io/person/2.0`  
> **Schema Version:** 2021.1 (API), 2019.1 (Webhooks)  
> **Uppdaterad:** 2025-10-23

---

## 📋 Endpoints Overview

| Endpoint | Method | Description | History |
|----------|--------|-------------|---------|
| `/current/{personId}` | GET | Aktuell personinformation (ingen historik) | ❌ Nej |
| `/full/{personId}` | GET | Fullständig personinformation (inkl. historik) | ✅ Ja |

**Båda endpoints returnerar samma schema (`PersonResults`), men `/full/` inkluderar historiska poster.**

---

## 🔐 Authentication

**OAuth2 Client Credentials**

```bash
curl -X POST https://api.roaring.io/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET"
```

---

## 📊 Complete Schema Documentation

### 1. PersonResults (Root Response)

```json
{
  "records": [Person],
  "status": SearchResultStatus
}
```

| Field | Type | Description |
|-------|------|-------------|
| `records` | `Array<Person>` | Lista med funna personer (vanligtvis 1 post) |
| `status` | `SearchResultStatus` | Sökresultat och datakälla-information |

---

### 2. Person (Main Object)

```json
{
  "personId": "198001139297",
  "personIdType": "PERSONNUMMER",
  "nationalRegistryChangeDate": "2024-03-15",
  "protectedRegistration": false,
  "protectedRegistrationDate": null,
  "secrecy": {...},
  "secrecyDate": null,
  "aggregatedIncome": "450000",
  "incomeYear": "2023",
  "name": [...],
  "details": [...],
  "populationRegistration": [...],
  "populationRegistrationAddress": [...],
  "contactAddress": [...],
  "specialPostalAddress": [...],
  "foreignAddress": [...],
  "relation": [...],
  "realEstate": [...]
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `personId` | `string` | ✅ | Personnummer (YYYYMMDD-XXXX) |
| `personIdType` | `string` | ✅ | `PERSONNUMMER`, `SAMORDNINGSNUMMER`, `IMMUNITETSNUMMER` |
| `nationalRegistryChangeDate` | `string` | - | Senaste ändringsdatum i SPAR (YYYY-MM-DD) |
| `protectedRegistration` | `boolean` | ✅ | Skyddad folkbokföring (true = adressen döljs) |
| `protectedRegistrationDate` | `string` | - | Datum för skyddad folkbokföring |
| `secrecy` | `Secrecy` | - | Sekretessmarkering |
| `secrecyDate` | `string` | - | Datum när sekretess sattes |
| `aggregatedIncome` | `string` | - | Sammanlagd inkomst (SEK) |
| `incomeYear` | `string` | - | År för inkomstdata |
| `name` | `Array<PersonName>` | ✅ | Namnuppgifter (historik om `/full/`) |
| `details` | `Array<PersonDetails>` | ✅ | Persondetaljer (historik om `/full/`) |
| `populationRegistration` | `Array<PopulationRegistration>` | ✅ | Folkbokföringsdata |
| `populationRegistrationAddress` | `Array<PopulationRegistrationAddress>` | ✅ | Folkbokföringsadress |
| `contactAddress` | `Array<ContactAddress>` | - | Kontaktadress |
| `specialPostalAddress` | `Array<SpecialPostalAddress>` | - | Särskild postadress |
| `foreignAddress` | `Array<ForeignAddress>` | - | Utlandsadress |
| `relation` | `Array<Relation>` | - | Relationer (make/maka, vårdnadshavare) |
| `realEstate` | `Array<RealEstate>` | - | Fastighetsinnehav |

---

### 3. PersonName

```json
{
  "dateFrom": "1980-01-13",
  "dateTo": "9999-12-31",
  "firstName": "Erik Johan",
  "middleName": "",
  "surName": "Andersson",
  "givenNameCode": 1,
  "shortenedName": "Andersson Erik Johan"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `dateFrom` | `string` | Giltig från datum (YYYY-MM-DD) |
| `dateTo` | `string` | Giltig till datum (`9999-12-31` = aktuellt) |
| `firstName` | `string` | Alla förnamn, separerade med mellanslag |
| `middleName` | `string` | Mellannamn (ofta före giftermål) |
| `surName` | `string` | Efternamn |
| `givenNameCode` | `integer` | Vilket förnamn personen använder (1-baserat index) |
| `shortenedName` | `string` | Efternamn + alla förnamn tillsammans |

**Exempel givenNameCode:**
- `firstName: "Erik Johan"`, `givenNameCode: 2` → Personen kallas "Johan"

---

### 4. PersonDetails

```json
{
  "dateFrom": "1980-01-13",
  "dateTo": "9999-12-31",
  "gender": "MALE",
  "birth": {...},
  "death": null,
  "deRegistrationDate": null,
  "deRegistrationReasonCode": null,
  "protectedRegistration": false,
  "secrecy": {...},
  "swedishCitizen": true,
  "coordinationNumberInformation": null,
  "personIdChangeInformation": []
}
```

| Field | Type | Description | Values |
|-------|------|-------------|--------|
| `dateFrom` | `string` | Giltig från | YYYY-MM-DD |
| `dateTo` | `string` | Giltig till | `9999-12-31` = aktuellt |
| `gender` | `enum` | Kön | `MALE`, `FEMALE` |
| `birth` | `Birth` | Födelsedata | Se Birth-schema |
| `death` | `Death` | Dödsfall | Se Death-schema |
| `deRegistrationDate` | `string` | Avregistreringsdatum | YYYY-MM-DD |
| `deRegistrationReasonCode` | `string` | Avregistreringsorsak | Se KODLISTOR (AV, UV, FI, OB, etc.) |
| `protectedRegistration` | `boolean` | Skyddad folkbokföring | true/false |
| `secrecy` | `Secrecy` | Sekretess | Se Secrecy-schema |
| `swedishCitizen` | `boolean` | Svenskt medborgarskap | true/false (endast för myndigheter) |
| `coordinationNumberInformation` | `CoordinationNumberInformation` | Samordningsnummer-info | Se schema nedan |
| `personIdChangeInformation` | `Array<PersonIdChangeInformation>` | Personnummerbyte | Se schema nedan |

---

### 5. Birth

```json
{
  "birthDate": "1980-01-13",
  "birthCountyCode": "01",
  "birthCongregation": "Stockholm"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `birthDate` | `string` | Födelsedatum (YYYY-MM-DD) |
| `birthCountyCode` | `string` | Län där personen föddes (01-25) |
| `birthCongregation` | `string` | Församling där personen föddes |

---

### 6. Death

```json
{
  "deathDate": "2024-03-15",
  "foundDeadDate": "2024-03-16"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `deathDate` | `string` | Dödsdatum (YYYY-MM-DD eller ofullständigt) |
| `foundDeadDate` | `string` | Datum när personen hittades död |

---

### 7. PopulationRegistration

```json
{
  "dateFrom": "2020-06-01",
  "dateTo": "9999-12-31",
  "countyCode": "01",
  "municipalityCode": "0180",
  "districtCode": "0180A",
  "populationRegistrationDate": "2020-06-01",
  "residenceStatusCode": "RESIDENTIAL"
}
```

| Field | Type | Description | Values |
|-------|------|-------------|--------|
| `dateFrom` | `string` | Giltig från | YYYY-MM-DD |
| `dateTo` | `string` | Giltig till | `9999-12-31` = aktuellt |
| `countyCode` | `string` | Länkod | 01-25 (se KODLISTOR) |
| `municipalityCode` | `string` | Kommunkod | XXYY (XX=län, YY=kommun) |
| `districtCode` | `string` | Distriktskod | Endast efter 2016-01-01 |
| `populationRegistrationDate` | `string` | Folkbokföringsdatum | YYYY-MM-DD |
| `residenceStatusCode` | `enum` | Bostadsstatus | `RESIDENTIAL`, `MUNICIPAL`, `UNKNOWN` |

---

### 8. PopulationRegistrationAddress

```json
{
  "dateFrom": "2020-06-01",
  "dateTo": "9999-12-31",
  "swedishAddress": {
    "coAddress": "c/o Anna Svensson",
    "deliveryAddress1": "",
    "deliveryAddress2": "Storgatan 12 A",
    "zipCode": "11122",
    "city": "Stockholm"
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `dateFrom` | `string` | Giltig från (YYYY-MM-DD) |
| `dateTo` | `string` | Giltig till (`9999-12-31` = aktuellt) |
| `swedishAddress` | `SwedishAddress` | Svensk adress |

---

### 9. SwedishAddress

```json
{
  "coAddress": "c/o Anna Svensson",
  "deliveryAddress1": "",
  "deliveryAddress2": "Storgatan 12 A",
  "zipCode": "11122",
  "city": "Stockholm"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `coAddress` | `string` | C/o-adress |
| `deliveryAddress1` | `string` | Leveransadress rad 1 (används vid långa adresser) |
| `deliveryAddress2` | `string` | Leveransadress rad 2 (primärt val) |
| `zipCode` | `string` | Postnummer (5 siffror) |
| `city` | `string` | Postort |

---

### 10. ContactAddress

```json
{
  "dateFrom": "2023-01-01",
  "dateTo": "9999-12-31",
  "swedishAddress": {...},
  "internationalAddress": null
}
```

| Field | Type | Description |
|-------|------|-------------|
| `dateFrom` | `string` | Giltig från |
| `dateTo` | `string` | Giltig till |
| `swedishAddress` | `SwedishAddress` | Svensk kontaktadress |
| `internationalAddress` | `InternationalAddress` | Utlandsk kontaktadress |

**OBS:** Kontaktadress finns EJ i cached version (FALLBACK/ALWAYS mode).

---

### 11. SpecialPostalAddress

```json
{
  "dateFrom": "2023-01-01",
  "dateTo": "9999-12-31",
  "swedishAddress": {...},
  "internationalAddress": null
}
```

Samma struktur som ContactAddress. Används för särskild postadress (box, etc.).

---

### 12. ForeignAddress

```json
{
  "dateFrom": "2022-01-01",
  "dateTo": "2023-12-31",
  "internationalAddress": {
    "country": "Norge",
    "deliveryAddress1": "Storgata 10",
    "deliveryAddress2": "Oslo",
    "deliveryAddress3": "0150"
  }
}
```

---

### 13. InternationalAddress

```json
{
  "country": "Norge",
  "deliveryAddress1": "Storgata 10",
  "deliveryAddress2": "Oslo", 
  "deliveryAddress3": "0150"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `country` | `string` | Landets namn (enligt Skatteverkets kodtabell) |
| `deliveryAddress1` | `string` | Adressrad 1 |
| `deliveryAddress2` | `string` | Adressrad 2 |
| `deliveryAddress3` | `string` | Adressrad 3 |

---

### 14. Relation

```json
{
  "relationType": "SPOUSE_OR_PARTNER",
  "personId": "197505121234",
  "firstName": "Anna",
  "middleName": "",
  "surName": "Svensson",
  "birthDate": null,
  "dateFrom": "2010-06-15",
  "dateTo": "9999-12-31",
  "deathDate": null,
  "deRegistrationDate": null,
  "deRegistrationReasonCode": null
}
```

| Field | Type | Description | Values |
|-------|------|-------------|--------|
| `relationType` | `enum` | Typ av relation | `SPOUSE_OR_PARTNER`, `GUARDIAN` |
| `personId` | `string` | Relaterad persons personnummer | |
| `firstName` | `string` | Förnamn (om inget personnummer) | |
| `middleName` | `string` | Mellannamn | |
| `surName` | `string` | Efternamn | |
| `birthDate` | `string` | Födelsedatum (om inget personnummer) | |
| `dateFrom` | `string` | Giltig från | |
| `dateTo` | `string` | Giltig till | `9999-12-31` = aktuellt |
| `deathDate` | `string` | Dödsdatum (ofullständigt möjligt) | |
| `deRegistrationDate` | `string` | Avregistreringsdatum | |
| `deRegistrationReasonCode` | `string` | Avregistreringsorsak | Se KODLISTOR |

**Användning:**
- `SPOUSE_OR_PARTNER` → Identifiera make/maka för beneficial ownership
- `GUARDIAN` → Identifiera vårdnadshavare (minderåriga)

---

### 15. CoordinationNumberInformation

```json
{
  "status": "CLOSED",
  "attributionDate": "2018-03-15",
  "renewalDate": "2020-03-15",
  "inactivationDate": "2024-01-01",
  "inactivationReason": "DECEASED",
  "expectedInactivationDate": null,
  "deathDate": "2023-12-28"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `status` | `string` | Status (t.ex. `CLOSED` om inaktiverat) |
| `attributionDate` | `string` | Datum då samordningsnummer tilldelades (kan vara ofullständigt) |
| `renewalDate` | `string` | Datum då samordningsnummer förnyades |
| `inactivationDate` | `string` | Inaktiveringsdatum |
| `inactivationReason` | `string` | Inaktiveringsorsak (t.ex. `DECEASED`) |
| `expectedInactivationDate` | `string` | Förväntat inaktiveringsdatum |
| `deathDate` | `string` | Dödsdatum (om inactivationReason = DECEASED) |

**OBS:** Samordningsnummer finns EJ i cached version.

---

### 16. PersonIdChangeInformation

```json
{
  "referenceType": "TO",
  "referencePersonId": "198001139297"
}
```

| Field | Type | Description | Values |
|-------|------|-------------|--------|
| `referenceType` | `enum` | Riktning på referens | `FROM` (gammalt nr), `TO` (nytt nr) |
| `referencePersonId` | `string` | Refererat personnummer | |

**Exempel:**
- Person `199101112390` har bytt till `198001139297`
- I `199101112390`'s record: `referenceType: "TO"`, `referencePersonId: "198001139297"`
- I `198001139297`'s record: `referenceType: "FROM"`, `referencePersonId: "199101112390"`

---

### 17. RealEstate

```json
{
  "taxationYear": "2023",
  "taxationValue": "3500000",
  "taxationUnitIdentificationNumber": "012345-6789",
  "realEstateTypeCode": "210",
  "countyCode": "01",
  "municipalityCode": "0180",
  "realEstatePart": [
    {
      "identification": "STOCKHOLM SÖDERMALM 1:1",
      "name": "Lägenheten på Storgatan",
      "shareNumerator": 1,
      "shareDenominator": 1
    }
  ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `taxationYear` | `string` | År för senaste taxering |
| `taxationValue` | `string` | Taxeringsvärde (SEK) |
| `taxationUnitIdentificationNumber` | `string` | Taxeringsenhetens ID |
| `realEstateTypeCode` | `string` | Fastighetstypkod |
| `countyCode` | `string` | Län där fastigheten ligger (01-25) |
| `municipalityCode` | `string` | Kommun (XXYY) |
| `realEstatePart` | `Array<RealEstatePart>` | Andel av fastigheten |

**OBS:** Fastighetsdata finns EJ i cached version.

---

### 18. RealEstatePart

```json
{
  "identification": "STOCKHOLM SÖDERMALM 1:1",
  "name": "Lägenheten på Storgatan",
  "shareNumerator": 1,
  "shareDenominator": 2
}
```

| Field | Type | Description |
|-------|------|-------------|
| `identification` | `string` | Fastighetsbeteckning |
| `name` | `string` | Namn på fastigheten/delen |
| `shareNumerator` | `integer` | Ägarandel - täljare (1 av 2 = 1/2) |
| `shareDenominator` | `integer` | Ägarandel - nämnare (1 av 2 = 1/2) |

---

### 19. Secrecy

```json
{
  "secrecy": true,
  "secrecySetBySpar": false
}
```

| Field | Type | Description |
|-------|------|-------------|
| `secrecy` | `boolean` | Sekretessmarkering aktiv |
| `secrecySetBySpar` | `boolean` | `true` om SPAR satte sekretessen pga "Skyddad folkbokföring" |

**KYC-hantering:**
```python
if person.secrecy.secrecy:
    # Sekretess aktiv - vissa uppgifter döljs
    if person.secrecy.secrecySetBySpar:
        # SPAR-sekretess = Skyddad folkbokföring
        # Ingen adress tillgänglig
        require_manual_verification = True
```

---

### 20. SearchResultStatus

```json
{
  "code": 0,
  "responseMode": 1,
  "text": "Person found"
}
```

| Field | Type | Description | Values |
|-------|------|-------------|--------|
| `code` | `integer` | Sökresultat | `0` = hittad, `1` = ej hittad |
| `responseMode` | `integer` | Datakälla | `0` = DIRECT (SPAR), `1` = FALLBACK, `2` = CACHED (ALWAYS) |
| `text` | `string` | Beskrivning av resultat | |

**responseMode mapping:**
- `0` → **DIRECT** - Data från Skatteverkets SPAR-API (fullständig)
- `1` → **FALLBACK** - Cached data pga error/timeout från SPAR
- `2` → **CACHED** - Cached data (ALWAYS mode konfigurerat)

---

### 21. Error Schemas

#### BadRequest (400)

```json
{
  "error": "BadRequest",
  "message": "Required arguments are missing in the request",
  "attributes": [
    {
      "attribute": "personId",
      "value": "invalid-format"
    }
  ]
}
```

#### ServerError (500)

```json
{
  "error": "InternalServerError",
  "message": "An internal server error occurred"
}
```

---

## 🧪 Example Requests

### Get Current Person Info

```bash
curl -X GET "https://api.roaring.io/person/2.0/current/198001139297" \
  -H "Authorization: Bearer {ACCESS_TOKEN}" \
  -H "Accept: application/json"
```

### Get Full Person Info (with history)

```bash
curl -X GET "https://api.roaring.io/person/2.0/full/198001139297" \
  -H "Authorization: Bearer {ACCESS_TOKEN}" \
  -H "Accept: application/json"
```

---

## 📝 Complete Response Example

```json
{
  "records": [
    {
      "personId": "198001139297",
      "personIdType": "PERSONNUMMER",
      "nationalRegistryChangeDate": "2024-03-15",
      "protectedRegistration": false,
      "secrecy": {
        "secrecy": false,
        "secrecySetBySpar": false
      },
      "name": [
        {
          "dateFrom": "1980-01-13",
          "dateTo": "9999-12-31",
          "firstName": "Erik Johan",
          "surName": "Andersson",
          "givenNameCode": 1
        }
      ],
      "details": [
        {
          "dateFrom": "1980-01-13",
          "dateTo": "9999-12-31",
          "gender": "MALE",
          "birth": {
            "birthDate": "1980-01-13",
            "birthCountyCode": "01",
            "birthCongregation": "Stockholm"
          },
          "swedishCitizen": true
        }
      ],
      "populationRegistration": [
        {
          "dateFrom": "2020-06-01",
          "dateTo": "9999-12-31",
          "countyCode": "01",
          "municipalityCode": "0180",
          "populationRegistrationDate": "2020-06-01",
          "residenceStatusCode": "RESIDENTIAL"
        }
      ],
      "populationRegistrationAddress": [
        {
          "dateFrom": "2020-06-01",
          "dateTo": "9999-12-31",
          "swedishAddress": {
            "deliveryAddress2": "Storgatan 12 A",
            "zipCode": "11122",
            "city": "Stockholm"
          }
        }
      ]
    }
  ],
  "status": {
    "code": 0,
    "responseMode": 0,
    "text": "Person found"
  }
}
```

---

**Next:** Se `KODLISTOR_POPULATION_REGISTER.md` för alla kodlistor och `test_population_register_api.sh` för live testing.
