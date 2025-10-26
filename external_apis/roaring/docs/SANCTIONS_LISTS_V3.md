# Roaring.io Sanctions Lists API v3.0 - Komplett Dokumentation

**Status:** ✅ Testad och verifierad 2025-10-25  
**Base URL:** `https://api.roaring.io/global/sanctions-lists/3.0`  
**Auth:** OAuth2 Client Credentials

---

## Översikt

**Syfte:** Kontrollera om person/organisation finns på internationella sanktionslistor.

**KRITISKT för PTL-compliance:**
- Match på sanktionslista = **OMEDELBAR AVVISNING** (lagligt förbjudet att göra affärer)
- Måste screena alla verkliga huvudmän, styrelseledamöter, firmatecknare, VD
- Logga alla sökningar (compliance-krav)

**Listor som kontrolleras:**
1. **EU** - Consolidated Financial Sanctions List
2. **OFAC (USA)** - 8 olika listor (SDN, CSL, FSE, SSI, PLC, CAPTA, NS-MBS, NS-CMIC)
3. **UN** - Security Council Consolidated List
4. **UK** - OFSI Consolidated List
5. **Schweiz (CHSECO)** - SECO Sanctions List

---

## Endpoints

### 1. Search - Sök i sanktionslistor

**GET** `/search`

#### Request Parameters

| Parameter | Type | Required | Beskrivning |
|-----------|------|----------|-------------|
| `name` | string | ✅ **Ja** | Namn att söka efter (person/organisation/fartyg/IMO-nummer) |
| `sanctionOrg` | string | Nej | Filtrera på organisation: `UN`, `UKOFSI`, `CHSECO`, `OFAC`, `EU` |
| `birthDate` | string | Nej | Födelsedatum (ISO format: `YYYY`, `YYYY-MM`, eller `YYYY-MM-DD`) |
| `gender` | string | Nej | Kön: `Male`, `Female`, `Unknown` |
| `country` | string | Nej | Land kopplat till entitet |
| `entityType` | string | Nej | Typ: `PERSON`, `ORGANISATION`, `OTHER` (fartyg) |
| `fuzzy` | string | Nej | `true`/`false` (default: `false`) - Aktivera fuzzy matching |
| `fuzzyDistance` | integer | Nej | `0`, `1`, `2` (default: `AUTO`) - Max antal bokstäver som får skilja sig |
| `separateNameSearch` | string | Nej | `true`/`false` (default: `false`) - Matcha något ord istället för alla |

#### ⚠️ Viktigt om filtrering

> **"Be aware that the underlying data about each target is not always complete. So do not narrow the search more than absolutely necessary."**

**Translation:** Filtrera INTE för mycket! Om du kräver exakt match på alla fält kan du missa träffar där källdata är inkomplett (t.ex. saknas `gender` ofta).

#### Response Structure

```json
{
  "hitCount": 5,
  "hits": [
    {
      "referenceNumber": "EU.1234.12",
      "searchScore": 5.053725,
      "entityType": "PERSON",
      "sanctionsOrganisation": "EU",
      "names": [...],
      "birthDates": [...],
      "genders": [...],
      "countries": [...],
      "additionalReferenceNumbers": [...],
      "sanctionsListsDetails": [...]
    }
  ],
  "metrics": {
    "sanctionsOrganisation": {"EU": 1, "OFAC": 2, "UN": 1, "UKOFSI": 1, "CHSECO": 0},
    "entityType": {"PERSON": 4, "ORGANISATION": 1},
    "gender": {"MALE": 3, "FEMALE": 1, "UNKNOWN": 1},
    "country": {"RU": 4, "DK": 1}
  },
  "next": "string",
  "previous": "string",
  "requestKey": "string"
}
```

#### Response Fields

| Field | Type | Beskrivning |
|-------|------|-------------|
| `hitCount` | integer | Totalt antal träffar |
| `hits[]` | array | Array med matchningar (se SanctionsSearchResult nedan) |
| `metrics` | object | Aggregerad statistik (antal per lista, land, typ, kön) |
| `searchScore` | float | Relevans-poäng (högre = bättre match) |
| `next` | string | Länk till nästa sida (pagination) |
| `previous` | string | Länk till föregående sida |
| `requestKey` | string | Unik nyckel för denna sökning |

---

### 2. Get by Reference - Hämta specifik post

**GET** `/{referenceNumber}`

#### Path Parameters

| Parameter | Type | Required | Beskrivning |
|-----------|------|----------|-------------|
| `referenceNumber` | string | ✅ **Ja** | Referensnummer (t.ex. `EU.1234.12`, `OFAC.88888`, `QDi.555`) |

#### Response Structure

```json
{
  "records": [
    {
      "referenceNumber": "EU.1234.12",
      "entityType": "PERSON",
      "sanctionsOrganisation": "EU",
      "names": [...],
      "birthDates": [...],
      "genders": [...],
      "countries": [...],
      "sanctionsListsDetails": [...]
    }
  ],
  "status": {
    "code": 0,
    "text": "Found"
  }
}
```

#### Status Codes

- `code: 0` - Found (hittad)
- `code: 1` - Not found (ej hittad)

---

## Data Structures

### SanctionsSearchResult / SanctionsListsV3Record

**Gemensam struktur för alla listor:**

```typescript
{
  referenceNumber: string          // Unik ID: "EU.1234.12", "OFAC.88888", "QDi.555"
  searchScore?: float              // Endast i search-response
  entityType: "PERSON" | "ORGANISATION" | "OTHER"
  sanctionsOrganisation: "UN" | "UKOFSI" | "CHSECO" | "OFAC" | "EU"
  
  names: NameV3[]                  // Lista med namn och alias
  birthDates: BirthDateV3[]        // Födelsedatum (kan vara flera)
  genders: GenderV3[]              // Kön (kan vara flera eller UNKNOWN)
  countries: NationalityV3[]       // Länder (nationalitet, adress)
  additionalReferenceNumbers: []   // Externa referenser (pass-nr, etc.)
  
  sanctionsListsDetails: [         // Listspecifika detaljer (3 typer)
    SanctionsListDetails_EU_OFAC_UN |
    SanctionsListsDetailsUk |
    SanctionsListsDetailsCh
  ]
}
```

---

### NameV3 - Namnstruktur

```typescript
{
  nameType: "PRIMARY" | "ALIAS" | "PRIMARY_VARIANT"
  aliasType?: "AKA" | "FKA"        // AKA = Also Known As, FKA = Formerly Known As
  qualityCode?: "STRONG" | "WEAK"  // Kvalitet på namnet (vissa listor)
  title?: string                    // Titel (Dr., Mr., etc.)
  
  nameParts: [{
    name: string                    // Del av namnet
    nameOrder: int                  // Ordning (0, 1, 2...)
    namePartType: "SURNAME" | "NAME" | "FULLNAME" | "GIVEN_NAME" | "MIDDLE_NAME" | "UNDEFINED"
    namePartListSpecificType?: string
    namePartSpellingVariants?: []   // Stavningsvarianter (andra språk/skript)
  }]
}
```

**Exempel:**
```json
{
  "nameType": "ALIAS",
  "aliasType": "AKA",
  "nameParts": [
    {
      "name": "Kalle",
      "nameOrder": 0,
      "namePartType": "GIVEN_NAME"
    },
    {
      "name": "Kallesson",
      "nameOrder": 1,
      "namePartType": "SURNAME"
    }
  ]
}
```

---

### BirthDateV3

```typescript
{
  birthDate: string  // YYYY, YYYY-MM, eller YYYY-MM-DD
}
```

---

### GenderV3

```typescript
{
  gender: "MALE" | "FEMALE" | "UNKNOWN"
}
```

---

### NationalityV3

```typescript
{
  country: string      // Landnamn (engelska)
  countryCode: string  // ISO 3166-1 alpha-2 (t.ex. "SE", "RU", "DK")
}
```

---

### AdditionalReferenceNumberV3

```typescript
{
  additionalReferenceNumber: string        // ID (t.ex. pass-nr, org-nr)
  additionalReferenceNumberType: string    // Typ av ID
}
```

---

## SanctionsListsDetails - De 3 typerna

Response-objektet `sanctionsListsDetails` har **3 olika strukturer** beroende på lista:

### Discriminator: `type` field

| Type | Listor | Schema |
|------|--------|--------|
| `SANCTION_DETAILS_OTHER` | EU, OFAC, UN | SanctionsListDetails_EU_OFAC_UN |
| `SANCTION_DETAILS_UK` | UK OFSI | SanctionsListsDetailsUk |
| `SANCTION_DETAILS_CH` | Schweiz SECO | SanctionsListsDetailsCh |

---

### 1. SanctionsListDetails_EU_OFAC_UN (EU, OFAC, UN)

**Typ:** `SANCTION_DETAILS_OTHER`

**Gemensam struktur för EU, OFAC och UN (bakåtkompatibel med v2.0):**

```typescript
{
  type: "SANCTION_DETAILS_OTHER"
  referenceNumber: string
  entityType: "PERSON" | "ORGANISATION" | "OTHER"
  changeDate?: string              // ISO 8601 datum för senaste ändring
  
  // Huvudfält
  gender?: string                  // "Male", "Female", etc.
  listedDate?: string              // När personen listades
  deListingDate?: string           // När personen avlistades (om tillämpligt)
  comment?: string
  remark?: string
  versionNumber?: int
  sanctionOrganisation?: string    // "EU", "OFAC", "UN"
  
  // Detaljerade arrayer
  names: Name[]                    // Äldre namnformat (firstName, lastName, wholeName)
  aliases: Alias[]                 // Alias med födelsedata
  birthData: BirthData[]           // Födelseinformation
  addresses: Address[]             // Adresser
  citizenData: CitizenData[]       // Medborgarskap
  documentation: Documentation[]   // Pass, ID-handlingar
  designations: Designation[]      // Titlar, positioner
  regulations: Regulation[]        // Lagstiftning, program
  updateHistories: UpdateHistory[] // Ändringshistorik
  
  // För fartyg (OTHER)
  vesselInfo?: VesselInfo          // Fartygsinformation
}
```

#### Name (äldre format)

```typescript
{
  wholeName?: string
  firstName?: string
  lastName?: string
  secondName?: string
  thirdName?: string
  fourthName?: string
  title?: string
  language?: string
  originalScriptName?: string
  programme?: string
  legalBasis?: string
  listedDate?: string
  pdfLink?: string
  remark?: string
}
```

#### Alias

```typescript
{
  name: string
  dateOfBirth?: string
  cityOfBirth?: string
  countryOfBirth?: string
  quality?: string
  note?: string
}
```

#### BirthData

```typescript
{
  date?: string
  place?: string
  city?: string
  country?: string
  stateProvince?: string
  year?: string
  fromYear?: string
  toYear?: string
  typeOfDate?: string
  noteDate?: string
  notePlace?: string
  programme?: string
  legalBasis?: string
  listedDate?: string
  pdfLink?: string
  remark?: string
}
```

#### Address

```typescript
{
  street?: string
  number?: string
  city?: string
  stateProvince?: string
  zipcode?: string
  country?: string
  other?: string
  programme?: string
  legalBasis?: string
  listedDate?: string
  pdfLink?: string
  remark?: string
}
```

#### Documentation

```typescript
{
  passportId?: string
  number?: string
  typeOfDocument?: string
  typeOfDocument2?: string
  issuingCountry?: string
  countryOfIssue?: string
  cityOfIssue?: string
  dateOfIssue?: string
  programme?: string
  legalBasis?: string
  listedDate?: string
  pdfLink?: string
  remark?: string
}
```

#### VesselInfo (för fartyg)

```typescript
{
  vesselType?: string
  vesselFlag?: string
  vesselOwner?: string
  callSign?: string
  tonnage?: int
  grossRegisteredTonnage?: int
}
```

---

### 2. SanctionsListsDetailsUk (UK OFSI)

**Typ:** `SANCTION_DETAILS_UK`

**Modernare struktur med fler detaljer:**

```typescript
{
  type: "SANCTION_DETAILS_UK"
  referenceNumber: string
  entityType: "PERSON" | "ORGANISATION" | "OTHER"
  changeDate?: string
  entityDetailedType?: string      // För "OTHER" (fartyg, etc.)
  listingType?: string             // Källa för listning
  
  // Namnstruktur
  names: UKNameV3[]                // Med spellingVariants
  
  // Personinformation
  birthData: UKBirthDataV3[]
  genders: GenderV3[]
  nationalities: NationalityV3[]
  identificationDocuments: UKIdentificationDocumentsV3[]
  positionInformation: UKPositionInformationV3[]  // Designation/roll
  
  // Kontaktinformation
  contactInformation: UKContactInformationV3[]    // Adress, email, telefon, web
  
  // Fartygsinformation (för OTHER)
  flagCountries: UKCountryInfoV3[]                // Registreringsland
  shipAttributes: UKShipAttributesV3[]            // Längd, tonnage
  
  // Sanktionsinformation
  ukOfsiStatuses: UkOfsiStatusesV3[]              // Typ av sanktion
  regulations: UKRegulationV3[]
  relations: RelationV3[]
  remarks: RemarkV3[]
  additionalReferenceNumbers: AdditionalReferenceNumberV3[]
  entityDescriptions: EntityDescriptionV3[]
}
```

#### UKNameV3

```typescript
{
  nameType: "PRIMARY" | "ALIAS" | "PRIMARY_VARIANT"
  aliasType?: "AKA" | "FKA"
  qualityCode?: "STRONG" | "WEAK"
  title?: string
  
  nameParts: UKNamePart[]
  nameSpellingVariants: SpellingVariantV3[]  // Stavningsvarianter
}
```

#### UKContactInformationV3

```typescript
{
  address1?: string
  address2?: string
  address3?: string
  address4?: string
  address5?: string                // Normally town
  address6?: string                // Normally town, state or region
  zipCode?: string
  country?: string
  countryCode?: string             // ISO 3166-2
  email?: string
  phoneNumber?: string
  webAddress?: string
}
```

#### UKIdentificationDocumentsV3

```typescript
{
  documentNumber: string           // Pass-nr, ID-nr
  documentType: string             // Typ av dokument
  remark?: string
}
```

#### UKPositionInformationV3

```typescript
{
  position: string                 // Designation/roll/position
}
```

#### UkOfsiStatusesV3

```typescript
{
  ukOfsiStatus: string             // UK consolidated list code
  ukOfsiStatusText: string         // Textbeskrivning av sanktionstyp
}
```

#### UKRegulationV3

```typescript
{
  programme: string                // Sanctions program/regime
  designatedDate: string           // När designerad
  listedDate: string               // När tillagd till lista
  lastUpdatedDate: string          // Senaste ändring
}
```

---

### 3. SanctionsListsDetailsCh (Schweiz SECO)

**Typ:** `SANCTION_DETAILS_CH`

**Mest detaljerad struktur med kvalitetsindikatorer:**

```typescript
{
  type: "SANCTION_DETAILS_CH"
  referenceNumber: string
  entityType: "PERSON" | "ORGANISATION" | "OTHER"
  changeDate?: string
  entityDetailedType?: string
  
  // Namnstruktur (med spellingVariants per namePart)
  names: CHNameV3[]
  
  // Personinformation
  birthData: CHBirthDataV3[]       // Med qualityCode
  genders: GenderV3[]
  nationalities: NationalityV3[]
  identificationDocuments: CHIdentificationDocumentV3[]
  
  // Kontaktinformation
  contactInformation: CHContactInformationV3[]  // Med qualityCode
  
  // Sanktionsinformation
  regulations: CHRegulationV3[]
  relations: RelationV3[]
  remarks: RemarkV3[]
  additionalReferenceNumbers: AdditionalReferenceNumberV3[]
  entityDescriptions: EntityDescriptionV3[]
}
```

#### CHNameV3

```typescript
{
  nameType: "PRIMARY" | "ALIAS" | "PRIMARY_VARIANT"
  qualityCode?: "STRONG" | "WEAK"  // Kvalitetsindikator
  nameLanguage?: string            // ISO tre-bokstavskod
  title?: string
  
  nameParts: CHNamePart[]
}
```

#### CHNamePart

```typescript
{
  name: string
  nameOrder: int
  namePartType: "SURNAME" | "NAME" | "FULLNAME" | "GIVEN_NAME" | "MIDDLE_NAME" | "UNDEFINED"
  namePartListSpecificType?: string
  namePartSpellingVariants: CHSpellingVariant[]  // Per namePart!
}
```

#### CHSpellingVariant

```typescript
{
  spellingVariantName: string      // Namn i alternativt språk
  spellingLanguage?: string
  spellingLanguageCode?: string    // ISO 639-2
  spellingScript?: string
  spellingScriptCode?: string      // ISO 15924
  spellingVariantType?: string     // original-name, transliteration, not-defined
}
```

#### CHBirthDataV3

```typescript
{
  birthDates: CHBirthDate[]
  birthPlaces: CHBirthPlace[]
}
```

#### CHBirthDate

```typescript
{
  birthDate: string                // Date of birth, foundation or creation
  calendar?: string                // Kalender använd
  qualityCode?: "STRONG" | "WEAK"
}
```

#### CHBirthPlace

```typescript
{
  city?: string
  cityVariants: CHVariantV3[]
  stateProvince?: string
  stateProvinceVariants: CHVariantV3[]
  country?: string
  countryCode?: string             // ISO 3061
  qualityCode?: "STRONG" | "WEAK"
}
```

#### CHContactInformationV3

```typescript
{
  addressDetails: CHAddressDetail[]
  city?: string
  cityVariants: CHVariantV3[]
  stateProvince?: string
  stateProvinceVariants: CHVariantV3[]
  zipCode?: string
  country?: string
  countryCode?: string             // ISO 3166-2
  co?: string                      // Co-adress
  remark?: string
  current?: boolean
  qualityCode?: "STRONG" | "WEAK"
}
```

#### CHIdentificationDocumentV3

```typescript
{
  documentNumber: string
  documentDescription: string
  issuer: CHIssuer
  issuingDate?: string
  expiryDate?: string
  remark?: string
}
```

#### CHIssuer

```typescript
{
  issuerCode: string               // ISO-3166 eller akronym (EU)
  issuerText: string               // Landnamn på engelska
}
```

#### CHRegulationV3

```typescript
{
  programme: string                // Kort namn
  programmeLong: string            // Fullständigt namn
  sanctionsSet?: string
  origin?: string                  // UN, EU, CH
  listedDate: string
  amendedDates: CHAmendedDate[]
}
```

#### RemarkV3

```typescript
{
  remark: string                   // Anledning för listning eller annan info
  remarkType: "OTHER" | "JUSTIFICATION"
}
```

#### RelationV3

```typescript
{
  relationId: string
  relationName: string
  relationType: string
  relationTypeDescription?: string
}
```

---

## Metrics Object

**Aggregerad statistik för sökningen:**

```typescript
{
  sanctionsOrganisation: {
    "CHSECO": 1,
    "EU": 1,
    "OFAC": 2,
    "UKOFSI": 4,
    "UN": 1
  },
  entityType: {
    "PERSON": 7,
    "ORGANISATION": 2,
    "OTHER": 0
  },
  gender: {
    "MALE": 5,
    "FEMALE": 2,
    "UNKNOWN": 0
  },
  country: {              // ISO 3166-1 alpha-2
    "RU": 7,
    "DK": 2,
    "n/a": 1
  }
}
```

---

## Sandbox Test Examples

**För testning i sandbox-miljön, använd följande exempel:**

| Beskrivning | URL |
|-------------|-----|
| Rent namn (0 träffar) | `/search?entityType=PERSON&name=Lars Andersson` |
| Organisation på alla 5 listor | `/search?name=Ztarz` |
| Person på EU, OFAC, CHSECO, UK | `/search?birthDate=1952&name=Kalle Kallesson` |
| EU-specifik person | `/search?name=Sven Svensson&sanctionOrg=EU&birthDate=1931-02-26` |
| Organisation AL-EVAB (5 listor) | `/search?name=AL-EVAB&entityType=ORGANISATION` |
| Fartyg (OTHER) | `/search?name=RIRI&entityType=OTHER` |
| Fuzzy + Separate Name Search | `/search?sanctionOrg=EU, UN&fuzzy=true&name=Mo Awade Sambad&separateNameSearch=true` |
| Person på alla 5 listor | `/search?name=Manberg` |
| Hämta via referensnummer | `/EU.1234.12` |

---

## Integration med Celestial Risk Engine

### Användning i onboarding-flöde:

**1. Screena alla nyckelpersoner:**
```python
# Lista med personer att screena
persons_to_screen = [
    *beneficial_owners,      # Verkliga huvudmän
    *board_members,          # Styrelseledamöter
    *signatories,            # Firmatecknare
    company.ceo              # VD
]

for person in persons_to_screen:
    result = roaring_sanctions.search(
        name=person.full_name,
        birth_date=person.birth_date,
        entity_type='PERSON'
    )
    
    if result['hitCount'] > 0:
        # CRITICAL: REJECT APPLICATION
        return {
            'status': 'REJECTED',
            'reason': 'SANCTIONS_MATCH',
            'person': person.name,
            'matches': result['hits']
        }
```

**2. Logga alla sökningar (compliance-krav):**
```python
sanctions_log = {
    'timestamp': datetime.now(),
    'client_orgnr': orgnr,
    'search_params': {
        'name': name,
        'birth_date': birth_date
    },
    'hit_count': result['hitCount'],
    'search_score': result['hits'][0]['searchScore'] if result['hits'] else None,
    'result': 'MATCH' if result['hitCount'] > 0 else 'NO_MATCH'
}
```

**3. Hantera fuzzy matches:**
```python
if result['hitCount'] > 0:
    # Kolla search score
    top_hit = result['hits'][0]
    
    if top_hit['searchScore'] > 3.0:
        # Hög confidence - definitivt match
        return 'REJECT'
    elif top_hit['searchScore'] > 1.5:
        # Medium confidence - manuell granskning
        return 'MANUAL_REVIEW'
    else:
        # Låg confidence - troligen falskt positivt
        # Men logga ändå!
        log_potential_false_positive(top_hit)
```

---

## Kostnader & Optimering

### Pris per API-call:
- **Okänt** - kontrollera med Roaring.io
- Troligen debiteras per sökning

### Optimeringsstrategier:

**1. Cachning:**
- Cacha negativa resultat (ingen träff) i 30 dagar
- Cacha positiva resultat (match) permanent
- Uppdatera cache när nya listversioner publiceras

**2. Batch-screening:**
- Samla alla personer för ett företag
- Gör EN sökning per person (inte flera med olika parametrar)

**3. Filtrera försiktigt:**
- Använd INTE alltid alla filter (birthDate, gender, country)
- Källdata kan vara inkomplett
- Börja med bara `name` och `entityType`

**4. Alternativ: Nedladdning av listor**
- EU, UN, OFAC publicerar listorna gratis
- Bygg egen sökmotor (mer jobb, men inga API-kostnader)
- Kräver regelbundna uppdateringar

---

## Error Handling

### HTTP Status Codes:

| Code | Beskrivning |
|------|-------------|
| 200 | OK - Sökning lyckades |
| 400 | Bad Request - Felaktiga parametrar |
| 401 | Unauthorized - Autentisering misslyckades |
| 403 | Forbidden - Ingen behörighet |
| 404 | Not Found - Resursen finns inte |
| 500 | Internal Server Error - Kontakta support |

### Exempel på error handling:

```python
try:
    result = roaring_sanctions.search(name="Test")
    
    if result.get('error'):
        if result['status_code'] == 400:
            # Bad request - validera input
            log_error("Invalid search parameters")
        elif result['status_code'] == 401:
            # Auth failed - refresh token
            refresh_oauth_token()
        elif result['status_code'] == 500:
            # Server error - retry med exponential backoff
            retry_with_backoff()
    else:
        # Success
        process_results(result)
        
except Exception as e:
    # Network error, timeout, etc.
    log_error(f"Sanctions API error: {str(e)}")
    # Fallback: Manual review required
    return 'MANUAL_REVIEW_REQUIRED'
```

---

## Sammanfattning

**Sanctions Lists API är KRITISKT för PTL-compliance:**

✅ **Obligatorisk screening** - Lagkrav enligt PTL  
✅ **5 stora listor** - EU, OFAC, UN, UK, Schweiz  
✅ **Fullständig data** - Namn, alias, födelsedatum, pass-nr, adresser  
✅ **Fuzzy matching** - Hanterar stavfel och varianter  
✅ **3 strukturer** - EU/OFAC/UN, UK, Schweiz med olika detaljer  

⚠️ **Viktigt att komma ihåg:**
- Match = omedelbar avvisning
- Logga alla sökningar (compliance)
- Filtrera försiktigt (källdata kan vara inkomplett)
- Hantera fuzzy matches korrekt (risk för falskt positiva)
- Cacha resultat för att minimera kostnader

---

**Testad:** 2025-10-25  
**Script:** `test_roaring_sanctions.py`  
**Testresultat:** Se `roaring_sanctions_example_ztarz.json`
