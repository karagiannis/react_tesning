# Roaring.io API - Complete Schema Documentation

> **Källa:** Roaring.io API Documentation  
> **Uppdaterad:** 2025-10-23  
> **Användning:** Kompletta datamodeller för KYC/AML requests och responses

---

## 📋 Innehåll

### Översikt
- [API Information](#api-information)
- [Authentication](#authentication)
- [Rate Limits](#rate-limits)

### Endpoints (18 totalt)
1. [Company Activity](#1-company-activity) - `/company-activity`
2. [Owner Structure](#2-owner-structure) - `/owner-structure`
3. [Beneficial Owner](#3-beneficial-owner) - `/beneficial-owner`
4. [Board Members](#4-board-members) - `/board-members`
5. [Signatories](#5-signatories) - `/signatories`
6. [Business Prohibition](#6-business-prohibition) - `/business-prohibition`
7. [Company Engagements](#7-company-engagements) - `/company-engagements`
8. [Risk Indicators](#8-risk-indicators) - `/risk-indicators`
9. [Company Rating](#9-company-rating) - `/company-rating`
10. [Sanctions List](#10-sanctions-list) - `/sanctions-list`
11. [PEP (Politically Exposed Person)](#11-pep) - `/pep`
12. [AML Registry](#12-aml-registry) - `/aml-registry`
13. [Legal Information](#13-legal-information) - `/legal-information`
14. [Property Information](#14-property-information) - `/property-information`
15. [Company Case Register](#15-company-case-register) - `/company-case-register`
16. [Financial Information](#16-financial-information) - `/financial-information`
17. [Establishments](#17-establishments) - `/establishments`
18. [Share Facts](#18-share-facts) - `/share-facts`

### Error Handling
- [Error Response Schema](#error-response-schema)
- [HTTP Status Codes](#http-status-codes)

---

## API Information

### Base URLs
- **Production:** `https://api.roaring.io/v1`
- **Sandbox:** `https://sandbox-api.roaring.io/v1`

### Authentication
**OAuth2 Client Credentials**

**Sandbox Credentials:**
```
Client ID: 1fc1c3bb-79d0-4b39-b541-70ef67c810a1
Client Secret: c96cdfe6-84d8-477a-a872-ab93c6e89203
```

**Token Request:**
```http
POST https://sandbox-api.roaring.io/oauth2/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials
&client_id=1fc1c3bb-79d0-4b39-b541-70ef67c810a1
&client_secret=c96cdfe6-84d8-477a-a872-ab93c6e89203
```

**API Requests:**
```http
Authorization: Bearer {access_token}
Content-Type: application/json
```

### Request Format
Alla endpoints använder samma grundläggande request-struktur:

```json
{
  "organisationsnummer": "556903-8671",
  "additionalParams": {}
}
```

---

## Rate Limits

**Sandbox:**
- Obegränsade anrop
- Testdata

**Production:**
- 500 anrop köpta (fredag 2025-10-25)
- ~27 företag om alla 18 endpoints används
- Caching rekommenderas

---

## Endpoints

## 1. Company Activity
**GET/POST `/company-activity`**

Hämtar information om företagets verksamhet och aktivitetsstatus.

### Request Schema
*Väntar på detaljer...*

### Response Schema
*Väntar på detaljer...*

### Example
*Väntar på detaljer...*

---

## 2. Owner Structure
**GET/POST `/owner-structure`**

Hämtar ägarstruktur för företaget.

### Request Schema
*Väntar på detaljer...*

### Response Schema
*Väntar på detaljer...*

### Example
*Väntar på detaljer...*

---

## 3. Beneficial Owner
**GET/POST `/beneficial-owner`**

Identifierar verkliga huvudmän (beneficial owners) enligt penningtvättslagen.

### Request Schema
*Väntar på detaljer...*

### Response Schema
*Väntar på detaljer...*

### Example
*Väntar på detaljer...*

---

## 4. Board Members
**GET/POST `/board-members`**

Hämtar information om styrelseledamöter.

### Request Schema
*Väntar på detaljer...*

### Response Schema
*Väntar på detaljer...*

### Example
*Väntar på detaljer...*

---

## 5. Signatories
**GET/POST `/signatories`**

Hämtar firmatecknare för företaget.

### Request Schema
*Väntar på detaljer...*

### Response Schema
*Väntar på detaljer...*

### Example
*Väntar på detaljer...*

---

## 6. Business Prohibition
**GET `/se/businessprohibition/1.0/company/{companyId}`**  
**GET `/se/businessprohibition/1.0/person/{personalNumber}`**

⚠️ **KRITISKT FÖR KYC** - Kontrollerar näringsförbud för personer kopplade till företaget.

Check for active business prohibitions against an individual or representatives of a company. Provides detailed information on restrictions that may prevent a person from engaging in business activities.

### Included Roles (Company Endpoint):
- Board members
- Beneficial owners
- Alternative beneficial owners

### Use Case:
Risk minimization - find out if a potential business partner or company representative has a business prohibition.

---

### Company Endpoint

**GET `/se/businessprohibition/1.0/company/{companyId}`**

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `companyId` | string | ✅ Required | Company registration number (organisationsnummer) |

#### Query Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `relationsHistoryYears` | number | - | 2 | How many years back to look for related persons. Set to 0 for only current relations. Range: 0-5 years |

#### Request Example
```bash
curl -X GET \
  --header 'Accept: application/json' \
  --header 'Authorization: Bearer {ACCESS_TOKEN}' \
  'https://api.roaring.io/se/businessprohibition/1.0/company/5565002465?relationsHistoryYears=2'
```

#### Response Schema
```json
{
  "records": [
    {
      "companyId": "string",
      "personalNumber": "string",
      "role": "string",
      "prohibitionDetails": {}
    }
  ],
  "status": {
    "code": 0,
    "text": "string"
  }
}
```

#### Sandbox Test Data
| Description | Company ID |
|-------------|------------|
| Company with board member with prohibition | `5565002465` |

---

### Person Endpoint

**GET `/se/businessprohibition/1.0/person/{personalNumber}`**

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `personalNumber` | string | ✅ Required | Swedish personal number (personnummer) |

#### Response Details
Returns:
- Which court issued the business prohibition
- Duration of prohibition
- Temporary prohibition status
- Exemption information
- Address information (including C/O and foreign addresses)

#### Request Example
```bash
curl -X GET \
  --header 'Accept: application/json' \
  --header 'Authorization: Bearer {ACCESS_TOKEN}' \
  'https://api.roaring.io/se/businessprohibition/1.0/person/198604069883'
```

#### Response Schema
```json
{
  "records": [
    {
      "personalNumber": "string",
      "name": "string",
      "address": {},
      "prohibition": {
        "swedishCourtCode": 0,
        "decisionType": "string",
        "startDate": "string",
        "endDate": "string",
        "isTemporary": false,
        "exemptions": "string",
        "freeText": "string"
      }
    }
  ],
  "status": {
    "code": 0,
    "text": "string"
  }
}
```

#### Sandbox Test Data
| Description | Personal Number |
|-------------|-----------------|
| Person without business prohibition | `198604069883` |
| Business prohibition incl. temporary prohibition | `198503302393` |
| Jan Efternamn 2584 | `198001139297` |
| Business prohibition with exemption info and free text | `192908187541` |
| Business prohibition decision with C/O address | `198208272396` |
| Business prohibition with foreign address | `194812161596` |

---

### Court Codes
**Swedish court codes used in responses:**

See full table: [Court Codes Reference](#court-codes-reference)

Examples:
- `999` - Supreme Court (Högsta domstolen)
- `144` - Stockholm District Court (Stockholm tingsrätt)
- `888` - Swedish Companies Registration Office (Bolagsverket)
- `777` - A foreign authority (En utländsk myndighet)

### Decision Type Codes
| Code | Description (English) | Description (Swedish) |
|------|----------------------|----------------------|
| `B` | Court decision/protocol | Domstolsbeslut/protokoll |
| `D` | Court judgement | Dom |

---

### HTTP Status Codes
| Status | Description |
|--------|-------------|
| 200 | OK, successful response |
| 400 | Bad request - failed argument validation or arguments missing |
| 404 | Requested resource could not be found |
| 500 | Internal server error |

---

## 7. Company Engagements
**GET/POST `/company-engagements`**

Hämtar alla företagsengagemang för nyckelpersoner.

### Request Schema
*Väntar på detaljer...*

### Response Schema
*Väntar på detaljer...*

### Example
*Väntar på detaljer...*

---

## 8. Risk Indicators
**GET/POST `/risk-indicators`**

⚠️ **KRITISKT FÖR KYC** - Identifierar högriskfaktorer.

### Request Schema
*Väntar på detaljer...*

### Response Schema
*Väntar på detaljer...*

### Example
*Väntar på detaljer...*

---

## 9. Company Rating
**GET/POST `/company-rating`**

Företagets kreditrating och finansiell hälsa.

### Request Schema
*Väntar på detaljer...*

### Response Schema
*Väntar på detaljer...*

### Example
*Väntar på detaljer...*

---

## 10. Sanctions List
**GET/POST `/sanctions-list`**

⚠️ **KRITISKT FÖR KYC** - Kontrollerar mot internationella sanktionslistor.

### Request Schema
*Väntar på detaljer...*

### Response Schema
*Väntar på detaljer...*

### Example
*Väntar på detaljer...*

---

## 11. PEP
**GET/POST `/pep`**

⚠️ **KRITISKT FÖR KYC** - Politiskt exponerade personer (PEP).

### Request Schema
*Väntar på detaljer...*

### Response Schema
*Väntar på detaljer...*

### Example
*Väntar på detaljer...*

---

## 12. AML Registry
**GET/POST `/aml-registry`**

⚠️ **KRITISKT FÖR KYC** - Anti-Money Laundering register.

### Request Schema
*Väntar på detaljer...*

### Response Schema
*Väntar på detaljer...*

### Example
*Väntar på detaljer...*

---

## 13. Legal Information
**GET/POST `/legal-information`**

Juridisk information om företaget.

### Request Schema
*Väntar på detaljer...*

### Response Schema
*Väntar på detaljer...*

### Example
*Väntar på detaljer...*

---

## 14. Property Information
**GET/POST `/property-information`**

Fastighetsinnehav och ägandeuppgifter.

### Request Schema
*Väntar på detaljer...*

### Response Schema
*Väntar på detaljer...*

### Example
*Väntar på detaljer...*

---

## 15. Company Case Register
**GET/POST `/company-case-register`**

Rättsliga ärenden och mål.

### Request Schema
*Väntar på detaljer...*

### Response Schema
*Väntar på detaljer...*

### Example
*Väntar på detaljer...*

---

## 16. Financial Information
**GET/POST `/financial-information`**

Ekonomisk information och nyckeltal.

### Request Schema
*Väntar på detaljer...*

### Response Schema
*Väntar på detaljer...*

### Example
*Väntar på detaljer...*

---

## 17. Establishments
**GET/POST `/establishments`**

Företagets etableringar och kontor.

### Request Schema
*Väntar på detaljer...*

### Response Schema
*Väntar på detaljer...*

### Example
*Väntar på detaljer...*

---

## 18. Share Facts
**GET/POST `/share-facts`**

Aktiekapital och ägarandelar.

### Request Schema
*Väntar på detaljer...*

### Response Schema
*Väntar på detaljer...*

### Example
*Väntar på detaljer...*

---

## Error Response Schema

### Standard Error Format
*Väntar på detaljer...*

---

## HTTP Status Codes

| Status | Beskrivning |
|--------|-------------|
| 200 | OK - Request successful |
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Invalid API key |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

---

## 🔄 Status

**Dokumentation:**
- ⏳ Väntar på API-nycklar till sandbox
- ⏳ Ska gå igenom varje endpoint systematiskt

**Nästa steg:**
1. Få sandbox API-nycklar
2. Testa varje endpoint
3. Dokumentera request/response schemas
4. Identifiera required vs optional fields
5. Dokumentera validation rules

---

## 📝 Notes

### KYC-kritiska endpoints (prioritet 1):
- ⚠️ Risk Indicators
- ⚠️ Sanctions List
- ⚠️ PEP
- ⚠️ AML Registry
- ⚠️ Business Prohibition

### Ägarstruktur (prioritet 2):
- Owner Structure
- Beneficial Owner
- Board Members
- Signatories

### Övrig information (prioritet 3):
- Company Activity
- Company Rating
- Financial Information
- Legal Information
- Company Engagements
- Property Information
- Company Case Register
- Establishments
- Share Facts

