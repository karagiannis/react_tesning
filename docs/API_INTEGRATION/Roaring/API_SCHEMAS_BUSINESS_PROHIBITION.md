# Business Prohibition API - Complete Schema Documentation

> **Base URL:** `https://api.roaring.io/se/businessprohibition/1.0`  
> **Version:** 1.0  
> **Uppdaterad:** 2025-10-23

---

## 📋 Overview

**Description:** Check for active business prohibitions against an individual or representatives of a company. This API provides detailed information on restrictions that may prevent a person from engaging in business activities.

### Use Cases:
- ✅ Verify if a person has näringsförbud before onboarding
- ✅ Check if any board members/beneficial owners have prohibitions
- ✅ Monitor historical relations (up to 5 years back)
- ✅ Identify exemptions (dispens) from prohibitions

---

## 🔐 Authentication

**OAuth2 Client Credentials** (same as other Roaring APIs)

```bash
curl -X POST https://api.roaring.io/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials" \
  -d "client_id=1fc1c3bb-79d0-4b39-b541-70ef67c810a1" \
  -d "client_secret=c96cdfe6-84d8-477a-a872-ab93c6e89203"
```

---

## 🧪 Sandbox Test Values

**For testing in Sandbox environment:**

| Personnummer | Description | Test Case |
|--------------|-------------|-----------|
| **198604069883** | Person without business prohibition | ✅ Clean check - no records |
| **198503302393** | Business prohibition incl. temporary prohibition | ⚠️ Has temporaryProhibitionDecisionDate + temporaryProhibitionMonitoringDate |
| **198001139297** | Jan Efternamn 2584 | 🔍 Standard test person |
| **192908187541** | Business prohibition with exemption info and free text | 📝 Has exemptionFromDate/ToDate + freeText populated |
| **198208272396** | Business prohibition decision with C/O address | 📬 Has coAddress in addressInformation |
| **194812161596** | Business prohibition with foreign address | 🌍 Country != Sverige in addressInformation |

**Usage:**
```bash
# No prohibition (clean)
/se/businessprohibition/1.0/person/198604069883

# With temporary prohibition
/se/businessprohibition/1.0/person/198503302393

# With exemption (dispens)
/se/businessprohibition/1.0/person/192908187541

# Foreign address
/se/businessprohibition/1.0/person/194812161596
```

---

## 🏦 Endpoints

### 1. Get Business Prohibition - Person

**GET** `/person/{personalNumber}`

Check if a specific person has an active business prohibition.

#### Parameters

| Parameter | Location | Type | Required | Description |
|-----------|----------|------|----------|-------------|
| `personalNumber` | path | string | ✅ | Swedish personal identity number (YYYYMMDD-XXXX) |

#### Example Request

```bash
curl -X GET "https://api.roaring.io/se/businessprohibition/1.0/person/198001139297" \
  -H "Authorization: Bearer {ACCESS_TOKEN}" \
  -H "Accept: application/json"
```

#### Response: `BusinessProhibitionResults`

```json
{
  "records": [
    {
      "personId": "198001139297",
      "name": {
        "firstName": "Erik",
        "surName": "Andersson",
        "fullName": "Erik Andersson"
      },
      "addressInformation": {
        "address": "Storgatan 12",
        "zipCode": "11122",
        "city": "Stockholm",
        "coAddress": "c/o Anna Svensson",
        "country": "Sverige",
        "countryCode": "SE"
      },
      "decisionDate": "2020-03-15",
      "decisionTypeCode": "D",
      "courtCode": "0114",
      "validFromDate": "2020-04-01",
      "validToDate": "2025-04-01",
      "temporaryProhibitionDecisionDate": null,
      "temporaryProhibitionMonitoringDate": null,
      "exemptionFromDate": null,
      "exemptionToDate": null,
      "exemptionRevocationDate": null,
      "changeDate": "2020-03-20",
      "freeText": "Additional information",
      "dataSourcing": {
        "caseNumber": "B-1234-20",
        "isCorrection": false
      }
    }
  ],
  "status": {
    "code": 0,
    "text": "Found"
  }
}
```

---

### 2. Get Business Prohibition - Company

**GET** `/company/{companyId}`

Get info if any representatives for a company has business prohibition.

#### Parameters

| Parameter | Location | Type | Required | Default | Description |
|-----------|----------|------|----------|---------|-------------|
| `companyId` | path | string | ✅ | - | Company registration number / organization number |
| `relationsHistoryYears` | query | number | - | `2` | How many years back to look for a person related to the company. Set to 0 to only check current relations. Max: 5 |

#### Example Request

```bash
curl -X GET "https://api.roaring.io/se/businessprohibition/1.0/company/556903-8671?relationsHistoryYears=2" \
  -H "Authorization: Bearer {ACCESS_TOKEN}" \
  -H "Accept: application/json"
```

#### Response: `CompanyBusinessProhibitionResults`

```json
{
  "records": [
    {
      "companyId": "556903-8671",
      "personsWithBusinessProhibition": [
        {
          "personId": "198001139297",
          "relationsToCompany": [
            {
              "relation": "BOARD_MEMBER",
              "isCurrent": true
            },
            {
              "relation": "BENEFICIAL_OWNER",
              "isCurrent": false
            }
          ]
        }
      ]
    }
  ],
  "status": {
    "code": 0,
    "text": "Found"
  }
}
```

---

## 📊 Complete Schema Documentation

### 1. BusinessProhibitionResults

**Description:** Person business prohibition response

| Field | Type | Description |
|-------|------|-------------|
| `records` | `Array<BusinessProhibitionRecord>` | Lista med näringsförbud för personen |
| `status` | `SearchResultStatus` | Sökresultat |

---

### 2. BusinessProhibitionRecord

**Description:** Business prohibition record for a person

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `personId` | `string` | ✅ | Personnummer (YYYYMMDD-XXXX) |
| `name` | `Name of person` | ✅ | Personens namn |
| `addressInformation` | `Address of person` | - | Adressuppgifter |
| `decisionDate` | `string` | ✅ | Beslutsdatum (YYYY-MM-DD) |
| `decisionTypeCode` | `string` | ✅ | Beslutstyp: `B` (protokoll), `D` (dom) |
| `courtCode` | `string` | ✅ | Domstolskod (0001-9999, se kodlista) |
| `validFromDate` | `string` | ✅ | Förbudet gäller från (YYYY-MM-DD) |
| `validToDate` | `string` | ✅ | Förbudet gäller till (YYYY-MM-DD) |
| `temporaryProhibitionDecisionDate` | `string` | - | Beslutsdatum för tillfälligt förbud |
| `temporaryProhibitionMonitoringDate` | `string` | - | Övervakningsdatum för tillfälligt förbud |
| `exemptionFromDate` | `string` | - | Dispens gäller från (YYYY-MM-DD) |
| `exemptionToDate` | `string` | - | Dispens gäller till (YYYY-MM-DD) |
| `exemptionRevocationDate` | `string` | - | Datum då dispens återkallades |
| `changeDate` | `string` | - | Senaste ändringsdatum |
| `freeText` | `string` | - | Fritextinformation om förbudet |
| `dataSourcing` | `DataSourcing` | - | Intern case-information |

---

### 3. Name of person

| Field | Type | Description |
|-------|------|-------------|
| `firstName` | `string` | Förnamn |
| `surName` | `string` | Efternamn |
| `fullName` | `string` | Fullständigt namn |

---

### 4. Address of person

| Field | Type | Description |
|-------|------|-------------|
| `address` | `string` | Gatuadress |
| `zipCode` | `string` | Postnummer |
| `city` | `string` | Postort |
| `coAddress` | `string` | C/o-adress |
| `country` | `string` | Land (namn) |
| `countryCode` | `string` | Landskod (ISO 3166-1 alpha-2) |

---

### 5. DataSourcing

**Description:** Holds internal information about the case number etc

| Field | Type | Description |
|-------|------|-------------|
| `caseNumber` | `string` | Internt ärendenummer |
| `isCorrection` | `boolean` | Flagga som signalerar om detta är en korrigering av tidigare information |

---

### 6. CompanyBusinessProhibitionResults

**Description:** Company business prohibition results

| Field | Type | Description |
|-------|------|-------------|
| `records` | `Array<CompanyBusinessProhibitionRecord>` | Företag med personer som har näringsförbud |
| `status` | `SearchResultStatus` | Sökresultat |

---

### 7. CompanyBusinessProhibitionRecord

**Description:** A company with one or more related persons with business prohibition

| Field | Type | Description |
|-------|------|-------------|
| `companyId` | `string` | Organisationsnummer |
| `personsWithBusinessProhibition` | `Array<CompanyBusinessProhibition>` | Personer med förbud kopplade till företaget |

---

### 8. CompanyBusinessProhibition

**Description:** A person with business prohibition related to the company

| Field | Type | Description |
|-------|------|-------------|
| `personId` | `string` | Personnummer för person med förbud |
| `relationsToCompany` | `Array<CompanyRelation>` | Personens roller i företaget |

---

### 9. CompanyRelation

**Description:** Type of relation to company

| Field | Type | Description | Values |
|-------|------|-------------|--------|
| `relation` | `enum` | Typ av relation | `BOARD_MEMBER`, `BENEFICIAL_OWNER`, `ALT_BENEFICIAL_OWNER` |
| `isCurrent` | `boolean` | Aktuell (true) eller historisk (false) | |

**Relation Types:**
- **`BOARD_MEMBER`** = Styrelseledamot
- **`BENEFICIAL_OWNER`** = Verklig huvudman
- **`ALT_BENEFICIAL_OWNER`** = Alternativ verklig huvudman

---

### 10. SearchResultStatus

| Field | Type | Description | Values |
|-------|------|-------------|--------|
| `code` | `integer` | Sökresultat | `0` = hittad, `1` = ej hittad |
| `text` | `string` | Beskrivning av resultat | |

---

### 11. Error Schemas

#### BadRequest (400)

```json
{
  "error": "BadRequest",
  "message": "Required arguments are missing in the request",
  "attributes": [
    {
      "attribute": "personalNumber",
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

## 📋 Kodlistor

### Decision Type Codes (decisionTypeCode)

| Kod | Svenska | English |
|-----|---------|---------|
| **B** | Protokoll | Protocol (Preliminary decision) |
| **D** | Dom | Judgement (Final court decision) |

**KYC-regel:**
```python
if record.decisionTypeCode == 'D':
    # DOM = Slutligt beslut, högre risk
    risk_level = 'HIGH'
elif record.decisionTypeCode == 'B':
    # PROTOKOLL = Preliminärt beslut, väntar på dom
    risk_level = 'MEDIUM'
```

---

### Court Codes (courtCode)

**Format:** Numeric codes for Swedish courts and institutions

**Fields using this code table:**
- `swedishCourtCode`
- `swedishDistrictCourtCode`  
- `cancelledBySwedishCourtCode`

---

#### Special Institution Codes

| Code | Description (English) | Description (Swedish) |
|------|----------------------|----------------------|
| **999** | Supreme Court | Högsta domstolen |
| **770** | Swedish National Debt Office | Riksgäldskontoret |
| **777** | A foreign authority | En utländsk myndighet |
| **888** | Swedish Companies Registration Office | Bolagsverket |

---

#### Courts of Appeal (Hovrätter)

| Code | Description (English) | Description (Swedish) |
|------|----------------------|----------------------|
| **100** | Svea Court of Appeal | Svea Hovrätt |
| **200** | Göta Court of Appeal | Göta Hovrätt |
| **300** | Scania and Blekinge Court of Appeal | Hovrätten över Skåne och Blekinge |
| **400** | Court of Appeal for Western Sweden | Hovrätten för Västra Sverige |
| **500** | Court of Appeal for Lower Norrland | Hovrätten för Nedre Norrland |
| **600** | Court of Appeal for Upper Norrland | Hovrätten för Övre Norrland |

---

#### District Courts (Tingsrätter) - Stockholm Region (100-series)

| Code | Description (English) | Description (Swedish) |
|------|----------------------|----------------------|
| **140** | Handen District Court | Handens tingsrätt |
| **141** | Norrtälje District Court | Norrtälje tingsrätt |
| **143** | Solna District Court | Solna tingsrätt |
| **144** | Stockholm District Court | Stockholm tingsrätt |
| **147** | Södertälje District Court | Södertälje tingsrätt |
| **149** | Södra Roslagen District Court | Södra Roslags tingsrätt |
| **150** | Huddinge District Court | Huddinge Tingsrätt |
| **151** | Jakobsberg District Court | Jakobsbergs tingsrätt |
| **152** | Nacka District Court | Nacka tingsrätt |
| **181** | Sollentuna District Court | Sollentuna tingsrätt |
| **191** | Attunda District Court | Attunda tingsrätt |
| **192** | Södertörn District Court | Södertörn tingsrätt |

---

#### District Courts - Central Sweden (150-170)

| Code | Description (English) | Description (Swedish) |
|------|----------------------|----------------------|
| **154** | Tierp District Court | Tierps tingsrätt |
| **155** | Enköping District Court | Enköpings tingsrätt |
| **157** | Eskilstuna District Court | Eskilstuna tingsrätt |
| **158** | Katrineholm District Court | Katrineholms tingsrätt |
| **159** | Nyköping District Court | Nyköping tingsrätt |
| **160** | Gotland District Court | Gotland tingsrätt |
| **165** | Västmanland District Court | Västmanlands tingsrätt |
| **167** | Sala District Court | Sala tingsrätt |
| **168** | Västerås District Court | Västerås tingsrätt |
| **171** | Falu District Court | Falu tingsrätt |
| **172** | Hedemora District Court | Hedemora tingsrätt |
| **173** | Ludvika District Court | Ludvika tingsrätt |
| **175** | Mora District Court | Mora tingsrätt |
| **177** | Leksand District Court | Leksands tingsrätt |

---

#### District Courts - Southern Sweden (240-269)

| Code | Description (English) | Description (Swedish) |
|------|----------------------|----------------------|
| **240** | Mjölby District Court | Mjölby tingsrätt |
| **242** | Linköping District Court | Linköping tingsrätt |
| **243** | Motala District Court | Motala tingsrätt |
| **244** | Norrköping District Court | Norrköping tingsrätt |
| **247** | Eksjö District Court | Eksjö tingsrätt |
| **248** | Jönköping District Court | Jönköping tingsrätt |
| **249** | Värnamo District Court | Värnamo tingsrätt |
| **252** | Ljungby District Court | Ljungby tingsrätt |
| **253** | Växjö District Court | Växjö tingsrätt |
| **256** | Kalmar District Court | Kalmar tingsrätt |
| **258** | Oskarshamn District Court | Oskarshamns tingsrätt |
| **259** | Västervik District Court | Västervik tingsrätt |
| **261** | Skaraborg District Court | Skaraborg tingsrätt |
| **262** | Falköping District Court | Falköping tingsrätt |
| **263** | Lidköping District Court | Lidköping tingsrätt |
| **264** | Mariestad District Court | Mariestads tingsrätt |
| **265** | Skövde District Court | Skövde tingsrätt |
| **266** | Hallsberg District Court | Hallsbergs tingsrätt |
| **267** | Karlskoga District Court | Karlskoga tingsrätt |
| **268** | Lindesberg District Court | Lindesberg tingsrätt |
| **269** | Örebro District Court | Örebro tingsrätt |

---

#### District Courts - Skåne and Blekinge (330-360)

| Code | Description (English) | Description (Swedish) |
|------|----------------------|----------------------|
| **330** | Blekinge District Court | Blekinge tingsrätt |
| **340** | Karlshamn District Court | Karlshamn tingsrätt |
| **342** | Karlskrona District Court | Karlskrona tingsrätt |
| **345** | Ronneby District Court | Ronneby tingsrätt |
| **346** | Sölvesborg District Court | Sölvesborgs tingsrätt |
| **347** | Hässleholm District Court | Hässleholm tingsrätt |
| **349** | Kristianstad District Court | Kristianstad tingsrätt |
| **351** | Ängelholm District Court | Ängelholms tingsrätt |
| **352** | Klippan District Court | Klippans tingsrätt |
| **353** | Simrishamn District court | Simrishamn tingsrätt |
| **354** | Eslöv District Court | Eslövs tingsrätt |
| **355** | Helsingborg District Court | Helsingborg tingsrätt |
| **356** | Landskrona District Court | Landskrona tingsrätt |
| **357** | Lund District Court | Lund tingsrätt |
| **358** | Malmö District Court | Malmö tingsrätt |
| **359** | Trelleborg District Court | Trelleborgs tingsrätt |
| **360** | Ystad District Court | Ystads tingsrätt |

---

#### District Courts - Western Sweden (444-469)

| Code | Description (English) | Description (Swedish) |
|------|----------------------|----------------------|
| **444** | Halmstad District Court | Halmstad tingsrätt |
| **445** | Varberg District Court | Varberg tingsrätt |
| **448** | Göteborg District Court | Göteborg tingsrätt |
| **449** | Mölndal District Court | Mölndal tingsrätt |
| **450** | Stenungsund District Court | Stenungsund tingsrätt |
| **451** | Strömstad District Court | Strömstad tingsrätt |
| **453** | Uddevalla District Court | Uddevalla tingsrätt |
| **457** | Alingsås District Court | Alingsås tingsrätt |
| **458** | Borås District Court | Borås tingsrätt |
| **459** | Sjuhäradsbygdens District Court | Sjuhäradsbygdens tingsrätt |
| **460** | Trollhättan District Court | Trollhättans tingsrätt |
| **462** | Vänersborg District Court | Vänersborgs tingsrätt |
| **463** | Åmål District Court | Åmåls tingsrätt |
| **465** | Arvika District Court | Arvika tingsrätt |
| **466** | Karlstad District Court | Karlstads tingsrätt |
| **467** | Kristinehamn District Court | Kristinehamns tingsrätt |
| **468** | Sunne District Court | Sunne tingsrätt |
| **469** | Värmland District Court | Värmlands tingsrätt |

---

#### District Courts - Norrland and Dalarna (541-558)

| Code | Description (English) | Description (Swedish) |
|------|----------------------|----------------------|
| **541** | Bollnäs District Court | Bollnäs tingsrätt |
| **542** | Hudiksvall District Court | Hudiksvalls tingsrätt |
| **544** | Ljusdal District Court | Ljusdals tingsrätt |
| **545** | Ångermanland District Court | Ångermanlands tingsrätt |
| **547** | Härnösand District Court | Härnösands tingsrätt |
| **549** | Sollefteå District Court | Sollefteå tingsrätt |
| **550** | Sundsvall District Court | Sundsvall tingsrätt |
| **551** | Örnsköldsvik District Court | Örnsköldsviks tingsrätt |
| **555** | Sveg District Court | Svegs tingsrätt |
| **556** | Östersund District Court | Östersunds tingsrätt |
| **557** | Gävle District Court | Gävle tingsrätt |
| **558** | Sandviken District Court | Sandvikens tingsrätt |

---

#### District Courts - Northern Sweden (641-651)

| Code | Description (English) | Description (Swedish) |
|------|----------------------|----------------------|
| **641** | Lycksele District Court | Lycksele tingsrätt |
| **642** | Skellefteå District Court | Skellefteå tingsrätt |
| **644** | Umeå District Court | Umeå tingsrätt |
| **647** | Boden District Court | Bodens tingsrätt |
| **648** | Gällivare District Court | Gällivare tingsrätt |
| **649** | Haparanda District Court | Haparanda tingsrätt |
| **650** | Luleå District Court | Luleå tingsrätt |
| **651** | Piteå District Court | Piteå tingsrätt |

---

**KYC Usage:**
- **Hovrätter (100-600)**: Appeal-level decisions → more serious cases, higher risk weight
- **Code 777** (foreign): Requires international verification, may indicate cross-border activity
- **Code 888** (Bolagsverket): Administrative prohibition, different legal process
- **Code 999** (Högsta domstolen): Supreme Court = highest severity, final decision
- **Geographic patterns**: Multiple prohibitions from different regions may indicate systematic fraud

---

## 🧪 Sandbox Test Cases

### Test Personnummer

| Personnummer | Beskrivning | Expected Result |
|--------------|-------------|-----------------|
| `198001139297` | Normal person utan förbud | `status.code: 1` (not found) |
| `193102263153` | Sven, ABO & PEP | Potentiellt näringsförbud |
| `198203249274` | Secrecy | Test sekretess + förbud |
| *(Add more from docs)* | | |

### Test Organisationsnummer

| Orgnr | Beskrivning | Expected Result |
|-------|-------------|-----------------|
| `556903-8671` | Test company | Kontrollera styrelseledamöter |
| `556016-0680` | Skatteverket | Inga förbud förväntat |

---

## 🎯 KYC Use Cases

### 1. Person Onboarding

```python
def check_business_prohibition_person(person_id):
    response = roaring_client.get_business_prohibition_person(person_id)
    
    if response.status.code == 0:  # Förbud hittades
        for record in response.records:
            # Kontrollera om förbudet är aktivt
            if is_active_prohibition(record):
                return {
                    'status': 'REJECT',
                    'reason': f'Aktivt näringsförbud till {record.validToDate}',
                    'severity': 'CRITICAL'
                }
            
            # Kontrollera dispens
            if has_valid_exemption(record):
                return {
                    'status': 'MANUAL_REVIEW',
                    'reason': 'Person har dispens från näringsförbud',
                    'severity': 'MEDIUM'
                }
    
    return {'status': 'APPROVED'}

def is_active_prohibition(record):
    today = date.today()
    valid_from = parse_date(record.validFromDate)
    valid_to = parse_date(record.validToDate)
    
    return valid_from <= today <= valid_to

def has_valid_exemption(record):
    if not record.exemptionFromDate:
        return False
    
    today = date.today()
    exemption_from = parse_date(record.exemptionFromDate)
    exemption_to = parse_date(record.exemptionToDate)
    
    # Kontrollera att dispens inte är återkallad
    if record.exemptionRevocationDate:
        return False
    
    return exemption_from <= today <= exemption_to
```

---

### 2. Company Onboarding

```python
def check_company_representatives(company_id, history_years=2):
    response = roaring_client.get_business_prohibition_company(
        company_id, 
        relationsHistoryYears=history_years
    )
    
    if response.status.code == 0:  # Förbud hittades
        red_flags = []
        
        for company_record in response.records:
            for person in company_record.personsWithBusinessProhibition:
                # Kontrollera varje relation
                current_relations = [
                    r for r in person.relationsToCompany 
                    if r.isCurrent
                ]
                
                if current_relations:
                    # Person har AKTIVT förbud OCH NUVARANDE roll
                    red_flags.append({
                        'personId': person.personId,
                        'relations': [r.relation for r in current_relations],
                        'severity': 'CRITICAL',
                        'reason': 'Näringsförbud hos nuvarande representant'
                    })
                else:
                    # Person hade förbud i historiken
                    red_flags.append({
                        'personId': person.personId,
                        'severity': 'WARNING',
                        'reason': 'Näringsförbud hos tidigare representant'
                    })
        
        return {
            'status': 'REJECT' if red_flags else 'APPROVED',
            'red_flags': red_flags
        }
    
    return {'status': 'APPROVED', 'red_flags': []}
```

---

### 3. Ongoing Monitoring

```python
def monitor_business_prohibitions(company_ids):
    """
    Kör dagligen för att upptäcka nya näringsförbud
    """
    new_prohibitions = []
    
    for company_id in company_ids:
        response = roaring_client.get_business_prohibition_company(
            company_id,
            relationsHistoryYears=0  # Endast nuvarande
        )
        
        if response.status.code == 0:
            # Nytt förbud upptäckt!
            new_prohibitions.append({
                'companyId': company_id,
                'persons': response.records[0].personsWithBusinessProhibition
            })
            
            # Skicka alert
            send_alert_to_compliance_team(company_id, response)
    
    return new_prohibitions
```

---

## ⚠️ Important Notes

### 1. History Years Parameter

```python
relationsHistoryYears = 0  # Endast nuvarande roller
relationsHistoryYears = 2  # Default - 2 år tillbaka
relationsHistoryYears = 5  # Max - 5 år tillbaka
```

**KYC-rekommendation:** Använd minst 2 år för att fånga nyligen avgångna styrelseledamöter.

---

### 2. Exemption (Dispens) Handling

En person kan ha **dispens** från näringsförbudet för specifika verksamheter:

```python
if record.exemptionFromDate and record.exemptionToDate:
    if not record.exemptionRevocationDate:
        # Dispens är aktiv
        require_manual_review = True
```

**Dispens betyder INTE automatiskt godkänt** - kräver manuell granskning av verksamhetstyp.

---

### 3. Temporary vs Permanent Prohibition

```python
if record.temporaryProhibitionDecisionDate:
    # Tillfälligt förbud (preliminärt)
    severity = 'MEDIUM'
else:
    # Permanent förbud (slutgiltigt)
    severity = 'HIGH'
```

---

## 📝 Python Code Examples

### Complete Integration Example

```python
from dataclasses import dataclass
from datetime import date, datetime
from typing import List, Optional

@dataclass
class BusinessProhibitionCheck:
    person_id: str
    has_prohibition: bool
    prohibition_valid_to: Optional[date]
    has_exemption: bool
    risk_level: str
    manual_review_required: bool

def comprehensive_prohibition_check(person_id: str) -> BusinessProhibitionCheck:
    response = roaring_api.get_business_prohibition_person(person_id)
    
    if response.status.code != 0:
        # Inget förbud
        return BusinessProhibitionCheck(
            person_id=person_id,
            has_prohibition=False,
            prohibition_valid_to=None,
            has_exemption=False,
            risk_level='LOW',
            manual_review_required=False
        )
    
    record = response.records[0]
    today = date.today()
    
    # Kontrollera om förbudet är aktivt
    valid_to = datetime.strptime(record.validToDate, '%Y-%m-%d').date()
    is_active = datetime.strptime(record.validFromDate, '%Y-%m-%d').date() <= today <= valid_to
    
    # Kontrollera dispens
    has_exemption = False
    if record.exemptionFromDate and not record.exemptionRevocationDate:
        exemption_to = datetime.strptime(record.exemptionToDate, '%Y-%m-%d').date()
        has_exemption = today <= exemption_to
    
    # Bestäm risknivå
    if is_active and not has_exemption:
        risk_level = 'CRITICAL'
    elif is_active and has_exemption:
        risk_level = 'HIGH'
    elif not is_active and valid_to > today:
        risk_level = 'MEDIUM'
    else:
        risk_level = 'LOW'
    
    return BusinessProhibitionCheck(
        person_id=person_id,
        has_prohibition=is_active,
        prohibition_valid_to=valid_to if is_active else None,
        has_exemption=has_exemption,
        risk_level=risk_level,
        manual_review_required=has_exemption or risk_level in ['HIGH', 'CRITICAL']
    )
```

---

## ✅ Verified Test Results (2025-10-23)

**All 6 sandbox test cases verified with live API calls:**

### Test 1: Clean Person (No Prohibition)
**Personnummer:** 198604069883
```json
{
  "records": [],
  "status": {"code": 1, "text": "records not found"}
}
```
**✅ Verified:** Empty array + status code 1 = no prohibition found

---

### Test 2: Temporary Prohibition
**Personnummer:** 198503302393
```json
{
  "records": [{
    "personId": "198503302393",
    "temporaryProhibitionDecisionDate": "2023-08-10",
    "temporaryProhibitionMonitoringDate": null,
    "validFromDate": "...",
    "validToDate": "..."
  }],
  "status": {"code": 0, "text": "Found"}
}
```
**✅ Verified:** 
- `temporaryProhibitionDecisionDate` populated
- `temporaryProhibitionMonitoringDate` can be null
- **KYC Impact:** Temporary prohibition indicates ongoing legal process, higher risk

---

### Test 3: Exemption (Dispens) with Free Text
**Personnummer:** 192908187541
```json
{
  "records": [{
    "personId": "192908187541",
    "name": {"firstName": "Margareta", "surName": "Bananberg"},
    "exemptionFromDate": "2022-02-02",
    "exemptionToDate": "2022-03-02",
    "exemptionRevocationDate": null,
    "freeText": "Margareta Bananberg berättigas att under en tid av 1 månad från tingsrättens dom, utan att den vunnit laga kraft, vidta åtgärder för att avveckla näringsverksamheten avseende sina kvarvarande kunder på så sätt som åklagaren medgivit. Göteborgs tingsrätt har den 2 februari 2022 beslutat att bevilja Margareta Bananberg undantag från henne meddelat näringsförbud för att verka som styrelseledamot i Stora Bananberget Aktiebolag. Undantagen gäller från och med 2022-02-02 till och med 2022-03-02."
  }]
}
```
**✅ Verified:**
- `exemptionFromDate`/`ToDate` defines time-limited exemption (1 month)
- `exemptionRevocationDate` is null (exemption still valid/not revoked)
- **freeText contains FULL court decision** (200+ characters)
- **KYC Impact:** Exemption allows specific roles (e.g., styrelseledamot) during prohibition
- **Manual review required** to verify exemption is still valid and covers intended role

---

### Test 4: C/O Address
**Personnummer:** 198208272396
```json
{
  "records": [{
    "addressInformation": {
      "address": "Sandlådegatan 41",
      "zipCode": "77440",
      "city": "AVESTA",
      "coAddress": "c/o Bagarbarn"
    }
  }]
}
```
**✅ Verified:** `coAddress` field populated when person lives at someone else's address

---

### Test 5: Foreign Address
**Personnummer:** 194812161596
```json
{
  "records": [{
    "addressInformation": {
      "country": "FRANKRIKE",
      "countryCode": "FR"
    }
  }]
}
```
**✅ Verified:**
- `country` = full country name in Swedish (FRANKRIKE)
- `countryCode` = ISO 2-letter code (FR)
- **KYC Impact:** Person with prohibition living abroad may require additional verification

---

### Test 6: Jan Efternamn 2584
**Personnummer:** 198001139297
```json
{
  "records": [{
    "name": {
      "firstName": "Jan",
      "surName": "Efternamn2584",
      "fullName": "Efternamn2584, Jan"
    }
  }]
}
```
**✅ Verified:** Standard test person with active prohibition

---

### Test 7: Company Check
**Company ID:** 556903-8671, `relationsHistoryYears=2`
```json
{
  "records": [],
  "status": {"code": 1, "text": "records not found"}
}
```
**✅ Verified:** No current or historical (2 years) representatives have business prohibition

---

## 🎯 Practical Usage in Our Onboarding App

### Use Case 1: Person Onboarding - Initial Screening

**Flow:**
1. User enters personnummer
2. Call Population Register API → get person data
3. Call Business Prohibition API → check for förbud
4. **Decision logic:**

```python
def onboard_person(personnummer: str) -> OnboardingDecision:
    # Step 1: Get person data from SPAR
    person = population_register_api.get_current(personnummer)
    
    # Check basic red flags first
    if person.details.deRegistrationReasonCode in ['FI', 'OB']:
        return OnboardingDecision(
            status='REJECT',
            reason='Person has FI (falsk identitet) or OB (försvunnen) - auto-reject'
        )
    
    # Step 2: Check business prohibition
    bp_result = business_prohibition_api.check_person(personnummer)
    
    if not bp_result.records:
        # No prohibition - green light
        return OnboardingDecision(
            status='APPROVED',
            reason='No business prohibition found',
            risk_level='LOW'
        )
    
    # Found prohibition - analyze details
    record = bp_result.records[0]
    today = date.today()
    
    # Check if prohibition is currently active
    valid_from = date.fromisoformat(record.validFromDate)
    valid_to = date.fromisoformat(record.validToDate)
    is_active = valid_from <= today <= valid_to
    
    if not is_active:
        # Historical prohibition (expired)
        return OnboardingDecision(
            status='APPROVED',
            reason=f'Business prohibition expired on {record.validToDate}',
            risk_level='MEDIUM',
            notes=f'Historical prohibition: {record.decisionDate} by court {record.courtCode}'
        )
    
    # Active prohibition found - check for exemption
    if record.exemptionFromDate and not record.exemptionRevocationDate:
        exemption_to = date.fromisoformat(record.exemptionToDate)
        if today <= exemption_to:
            # Valid exemption exists
            return OnboardingDecision(
                status='MANUAL_REVIEW',
                reason='Active business prohibition with valid exemption (dispens)',
                risk_level='HIGH',
                notes=f'Exemption valid until {record.exemptionToDate}. Free text: {record.freeText[:100]}...',
                manual_review_required=True,
                reviewer_instructions='Verify exemption covers intended business role. Check freeText for restrictions.'
            )
    
    # Active prohibition without valid exemption - reject
    decision_type = 'Dom (final)' if record.decisionTypeCode == 'D' else 'Protokoll (preliminary)'
    return OnboardingDecision(
        status='REJECT',
        reason=f'Active business prohibition until {record.validToDate}',
        risk_level='CRITICAL',
        notes=f'Decision: {decision_type}, Court: {record.courtCode}, Date: {record.decisionDate}'
    )
```

---

### Use Case 2: Company Onboarding - Representative Screening

**Flow:**
1. User enters company registration number
2. Call Company API → get all representatives
3. Call Business Prohibition Company endpoint → check all reps at once
4. For each rep with prohibition → get full details from Person endpoint

```python
def onboard_company(company_id: str) -> CompanyOnboardingDecision:
    # Step 1: Check company representatives (current + 2 years history)
    bp_company = business_prohibition_api.check_company(
        company_id=company_id,
        relations_history_years=2
    )
    
    if not bp_company.records:
        # No representatives with prohibition - green light
        return CompanyOnboardingDecision(
            status='APPROVED',
            reason='No business prohibitions found among representatives',
            risk_level='LOW'
        )
    
    # Found representatives with prohibition
    company_record = bp_company.records[0]
    critical_issues = []
    warnings = []
    
    for person_with_bp in company_record.personsWithBusinessProhibition:
        person_id = person_with_bp.personId
        
        # Get full prohibition details
        bp_details = business_prohibition_api.check_person(person_id)
        record = bp_details.records[0]
        
        # Check each relation to company
        for relation in person_with_bp.relationsToCompany:
            if relation.isCurrent:
                # Current representative with prohibition = CRITICAL
                critical_issues.append(
                    f'Current {relation.relation} ({person_id}) has active business prohibition until {record.validToDate}'
                )
            else:
                # Historical representative (departed < 2 years ago) = WARNING
                warnings.append(
                    f'Former {relation.relation} ({person_id}) had business prohibition (departed within 2 years)'
                )
    
    if critical_issues:
        return CompanyOnboardingDecision(
            status='REJECT',
            reason='Current company representative has active business prohibition',
            risk_level='CRITICAL',
            details=critical_issues
        )
    
    if warnings:
        return CompanyOnboardingDecision(
            status='MANUAL_REVIEW',
            reason='Historical representatives had business prohibitions',
            risk_level='MEDIUM',
            details=warnings,
            manual_review_required=True,
            reviewer_instructions='Verify these persons are no longer associated with company. Check Bolagsverket for current roles.'
        )
    
    return CompanyOnboardingDecision(
        status='APPROVED',
        reason='All prohibition issues are historical/resolved',
        risk_level='LOW'
    )
```

---

### Use Case 3: Ongoing Monitoring - Detect New Prohibitions

**Flow:**
1. Daily/weekly job checks all active customers
2. Compare current prohibition status with stored status
3. Alert compliance team if new prohibition detected

```python
def monitor_existing_customers():
    """
    Daily job to detect new business prohibitions among existing customers
    """
    active_customers = db.get_active_customers()
    
    for customer in active_customers:
        # Check person
        bp_result = business_prohibition_api.check_person(customer.personnummer)
        
        current_has_prohibition = len(bp_result.records) > 0
        previous_has_prohibition = customer.last_prohibition_check.has_prohibition
        
        if current_has_prohibition and not previous_has_prohibition:
            # NEW prohibition detected
            record = bp_result.records[0]
            
            alert = ComplianceAlert(
                customer_id=customer.id,
                alert_type='NEW_BUSINESS_PROHIBITION',
                severity='CRITICAL',
                message=f'Customer {customer.personnummer} received business prohibition',
                details={
                    'decision_date': record.decisionDate,
                    'decision_type': record.decisionTypeCode,
                    'court_code': record.courtCode,
                    'valid_from': record.validFromDate,
                    'valid_to': record.validToDate
                },
                action_required='Review customer relationship immediately. Consider account suspension.'
            )
            
            db.save_alert(alert)
            notify_compliance_team(alert)
        
        # Update monitoring status
        db.update_prohibition_check(
            customer_id=customer.id,
            has_prohibition=current_has_prohibition,
            checked_at=datetime.now()
        )
```

---

### Use Case 4: Board Member Change - New Representative Verification

**Flow:**
1. Company notifies of new board member
2. Check if new person has prohibition
3. If prohibition exists → check exemption details

```python
def verify_new_board_member(company_id: str, new_member_personnummer: str) -> VerificationResult:
    """
    Verify new board member before Bolagsverket registration
    """
    # Check if person has prohibition
    bp_result = business_prohibition_api.check_person(new_member_personnummer)
    
    if not bp_result.records:
        return VerificationResult(
            approved=True,
            message='No business prohibition - approved for board membership'
        )
    
    record = bp_result.records[0]
    today = date.today()
    
    # Check if active
    valid_to = date.fromisoformat(record.validToDate)
    if today > valid_to:
        return VerificationResult(
            approved=True,
            message=f'Business prohibition expired on {record.validToDate} - approved'
        )
    
    # Active prohibition - check exemption for board membership
    if record.exemptionFromDate and not record.exemptionRevocationDate:
        exemption_to = date.fromisoformat(record.exemptionToDate)
        if today <= exemption_to:
            # Parse freeText to see if exemption covers board membership
            free_text_lower = record.freeText.lower()
            if 'styrelseledamot' in free_text_lower or 'board' in free_text_lower:
                return VerificationResult(
                    approved=True,
                    message=f'Exemption allows board membership until {record.exemptionToDate}',
                    manual_review_required=True,
                    notes=f'Exemption details: {record.freeText}'
                )
    
    # Active prohibition without valid exemption for board role
    return VerificationResult(
        approved=False,
        message='Active business prohibition prevents board membership',
        details=f'Prohibition valid until {record.validToDate}, court: {record.courtCode}'
    )
```

---

## 🔄 Integration with Other APIs

### Combined Person Check (SPAR + Business Prohibition)

```python
def complete_person_check(personnummer: str) -> CompletePersonProfile:
    """
    Full KYC check combining Population Register and Business Prohibition
    """
    # Get person data from SPAR
    spar_current = population_register_api.get_current(personnummer)
    spar_full = population_register_api.get_full(personnummer)
    
    # Get business prohibition status
    bp_result = business_prohibition_api.check_person(personnummer)
    
    # Compile red flags
    red_flags = []
    
    # SPAR red flags
    if spar_current.details.deRegistrationReasonCode in ['FI', 'OB']:
        red_flags.append({
            'type': 'SPAR_DEREG',
            'severity': 'CRITICAL',
            'description': f'Deregistration reason: {spar_current.details.deRegistrationReasonCode}'
        })
    
    if spar_current.populationRegistration.residenceStatusCode == 'UNKNOWN':
        red_flags.append({
            'type': 'SPAR_UNKNOWN_RESIDENCE',
            'severity': 'HIGH',
            'description': 'Unknown residence status'
        })
    
    # Business prohibition red flags
    if bp_result.records:
        record = bp_result.records[0]
        today = date.today()
        valid_to = date.fromisoformat(record.validToDate)
        
        if today <= valid_to:
            red_flags.append({
                'type': 'BUSINESS_PROHIBITION',
                'severity': 'CRITICAL',
                'description': f'Active prohibition until {record.validToDate}',
                'details': record
            })
    
    # Calculate overall risk score
    risk_score = calculate_risk_score(red_flags)
    
    return CompletePersonProfile(
        personnummer=personnummer,
        spar_data=spar_current,
        spar_history=spar_full,
        business_prohibition=bp_result,
        red_flags=red_flags,
        risk_score=risk_score,
        recommendation='APPROVE' if risk_score < 30 else 'MANUAL_REVIEW' if risk_score < 70 else 'REJECT'
    )
```

---

## 📊 Decision Matrix

| Prohibition Status | Exemption | Decision | Risk Level | Action |
|-------------------|-----------|----------|------------|--------|
| ❌ No records | - | ✅ APPROVE | LOW | Proceed with onboarding |
| ✅ Expired | - | ✅ APPROVE | MEDIUM | Note in profile, proceed |
| ✅ Active | ❌ No exemption | ❌ REJECT | CRITICAL | Cannot onboard |
| ✅ Active | ✅ Valid exemption | ⚠️ MANUAL_REVIEW | HIGH | Verify exemption covers role |
| ✅ Active | ⚠️ Exemption revoked | ❌ REJECT | CRITICAL | Cannot onboard |
| ✅ Temporary | - | ⚠️ MANUAL_REVIEW | HIGH | Ongoing legal process |

---

## 🚨 Important Notes from Live Testing

1. **Status Codes:**
   - `code: 0` = "Found" (records exist)
   - `code: 1` = "records not found" (no prohibition)
   - **Different from SPAR API** where 0 = found, 1 = not found

2. **Free Text Field:**
   - Can be **200+ characters long**
   - Contains full court decision in Swedish
   - Must parse for keywords: "styrelseledamot", "avveckla", "undantag"
   - Essential for understanding exemption scope

3. **Exemption Logic:**
   - Check `exemptionFromDate` AND `exemptionToDate` for validity period
   - **Must verify `exemptionRevocationDate` is null** (if set, exemption is revoked)
   - Time-limited (typically 1-3 months for business wind-down)
   - May be role-specific (e.g., only allows styrelseledamot)

4. **Temporary Prohibition:**
   - `temporaryProhibitionDecisionDate` indicates ongoing legal process
   - `temporaryProhibitionMonitoringDate` can be null
   - Higher risk than final prohibition (legal uncertainty)

5. **Company Endpoint:**
   - `relationsHistoryYears=2` (default) catches recently departed board members
   - Set to `0` to only check current representatives
   - Max value: `5` years
   - Critical for forensic KYC (identify past risky associations)

---

**Related Documentation:**
- [KODLISTOR_POPULATION_REGISTER.md](KODLISTOR_POPULATION_REGISTER.md) - Person data codes
- [API_SCHEMAS_POPULATION_REGISTER.md](API_SCHEMAS_POPULATION_REGISTER.md) - Person API
- [test_business_prohibition_api.sh](test_business_prohibition_api.sh) - Live test script
- [README.md](README.md) - Integration overview
