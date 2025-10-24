# Roaring.io API - Komplett Integration Guide

## 📋 Översikt

Roaring.io är en tjänst för KYC (Know Your Customer), AML (Anti Money Laundering) och compliance-kontroller. De aggregerar data från:

- Bolagsverket
- Skatteverket
- UC (Upplysningscentralen)
- SPAR (Statens Personadressregister)
- EU/UN/OFAC sanktionslistor
- PEP-databaser (Politiskt utsatta personer)
- Fastighetsregistret

**Status för Celestial AB:**
- ✅ Sandbox-credentials (test-miljö)
- ⏳ Produktions-credentials (köps fredag - 500 anrop för ~1000-2000 kr)

---

## 🔐 Credentials

### Sandbox (Testmiljö)

**Base URL:**
```
https://sandbox.roaring.io/api/v1
```

**Authentication:**
```
API Key: X-API-Key header
```

**Environment variables:**
```bash
ROARING_API_KEY_SANDBOX=<sandbox_key_här>
ROARING_ENV=sandbox
```

---

### Production (Live Data - Köps fredag)

**Base URL:**
```
https://api.roaring.io/api/v1
```

**Authentication:**
```
API Key: X-API-Key header
```

**Environment variables:**
```bash
ROARING_API_KEY_PROD=<prod_key_här>
ROARING_ENV=production
```

**Pricing:**
- 500 anrop ≈ 1000-2000 kr (engångskostnad)
- Anrop räknas per endpoint-anrop (inte per företag)
- Exempel: 1 företag med 5 endpoints = 5 anrop förbrukade

---

## 📡 API Endpoints

Roaring.io har **18 endpoints** som vi använder i onboarding-appen:

---

### 1. Company Activity (Verksamhet)

**Endpoint:**
```
GET /companies/{org_nr}/activity
```

**Request:**
```bash
curl -X GET "https://api.roaring.io/api/v1/companies/556500-2465/activity" \
  -H "X-API-Key: YOUR_API_KEY"
```

**Response:**
```json
{
  "organizationNumber": "556500-2465",
  "companyName": "Celestial Redovisning AB",
  "description": "Redovisningstjänster och skatterådgivning för små och medelstora företag",
  "sniCodes": [
    {
      "code": "69.20",
      "description": "Redovisning och bokföring, skatterådgivning"
    },
    {
      "code": "70.22",
      "description": "Konsultverksamhet avseende företags organisation"
    }
  ],
  "secondaryNames": [],
  "registrationDate": "2015-03-15",
  "status": "Active"
}
```

**Vad vi får:**
- ✅ SNI-koder (branschkoder) - DETTA HAR INTE BOLAGSVERKET!
- ✅ Detaljerad verksamhetsbeskrivning
- ✅ Sekundära namn (tidigare namn, varumärken)

**Används i:** Riskfrågor Steg 2 - Jämför med klientens beskrivning

---

### 2. Owner Structure (Ägarstruktur)

**Endpoint:**
```
GET /companies/{org_nr}/ownership
```

**Request:**
```bash
curl -X GET "https://api.roaring.io/api/v1/companies/556500-2465/ownership" \
  -H "X-API-Key: YOUR_API_KEY"
```

**Response:**
```json
{
  "owners": [
    {
      "name": "Anna Svensson",
      "personalNumber": "19800515-****",
      "ownershipPercent": 60.0,
      "type": "Individual"
    },
    {
      "name": "Erik Johansson",
      "personalNumber": "19750822-****",
      "ownershipPercent": 40.0,
      "type": "Individual"
    }
  ],
  "totalShares": 50000,
  "shareCapital": 500000
}
```

**Vad vi får:**
- ✅ Ägare (namn, personnummer, ägarandel)
- ✅ Aktiekapital
- ✅ Antal aktier
- ✅ Ägartyp (Individual/Corporation)

**Används i:** Riskfrågor Steg 5 - Jämför med klientens uppgifter

---

### 3. Beneficial Owner (Verkliga huvudmän)

**Endpoint:**
```
GET /companies/{org_nr}/beneficial-owner
```

**Response:**
```json
{
  "beneficialOwners": [
    {
      "name": "Anna Svensson",
      "personalNumber": "19800515-****",
      "ownershipPercent": 60.0,
      "controlType": "Direct ownership"
    }
  ],
  "alternativeBeneficialOwners": [
    {
      "name": "Erik Johansson",
      "personalNumber": "19750822-****",
      "role": "CEO and Board Member",
      "reason": "Controlling influence through position"
    }
  ]
}
```

**Vad vi får:**
- ✅ Verkliga huvudmän (>25% ägande eller kontrollerande inflytande)
- ✅ Alternativa huvudmän (VD, styrelseordförande)
- ✅ Kontrolltyp (direkt/indirekt ägande, position)

**Används i:** ResultSlides - Ägarstruktur

---

### 4. Board Members (Styrelse)

**Endpoint:**
```
GET /companies/{org_nr}/board
```

**Response:**
```json
{
  "board": [
    {
      "name": "Anna Svensson",
      "personalNumber": "19800515-****",
      "role": "Styrelseordförande",
      "appointedDate": "2015-03-15",
      "status": "Active"
    },
    {
      "name": "Erik Johansson",
      "personalNumber": "19750822-****",
      "role": "Styrelseledamot",
      "appointedDate": "2015-03-15",
      "status": "Active"
    }
  ],
  "ceo": {
    "name": "Erik Johansson",
    "personalNumber": "19750822-****",
    "appointedDate": "2015-03-15"
  },
  "auditor": {
    "name": "PwC Öhrlings AB",
    "organizationNumber": "556029-6740",
    "auditorType": "Registered firm"
  }
}
```

**Vad vi får:**
- ✅ Styrelseledamöter (namn, personnummer, roll, tillträdesdatum)
- ✅ VD
- ✅ Revisor
- ✅ Status (Active/Resigned)

**Används i:** ResultSlides - Styrelse

---

### 5. Signatories (Firmatecknare)

**Endpoint:**
```
GET /companies/{org_nr}/signatories
```

**Response:**
```json
{
  "signingRules": "Styrelsen",
  "authorizedSignatories": [
    {
      "name": "Anna Svensson",
      "personalNumber": "19800515-****",
      "signingRight": "Two to sign"
    },
    {
      "name": "Erik Johansson",
      "personalNumber": "19750822-****",
      "signingRight": "Two to sign"
    }
  ],
  "signingCombinations": [
    "Anna Svensson + Erik Johansson",
    "Anna Svensson + Maria Andersson"
  ]
}
```

**Vad vi får:**
- ✅ Firmateckningsrätt
- ✅ Firmatecknare
- ✅ Giltiga kombinationer

**Används i:** ResultSlides - Övriga data

---

### 6. Business Prohibition (Näringsförbud)

**Endpoint:**
```
GET /companies/{org_nr}/business-prohibition
```

**Response:**
```json
{
  "records": [],
  "status": {
    "code": 0,
    "text": "No business prohibitions found"
  }
}
```

**Om näringsförbud finns:**
```json
{
  "records": [
    {
      "person": "John Doe",
      "personalNumber": "19700101-****",
      "prohibitionFrom": "2020-01-01",
      "prohibitionTo": "2025-01-01",
      "reason": "Grov skattebrott"
    }
  ],
  "status": {
    "code": 1,
    "text": "Active business prohibition found"
  }
}
```

**Vad vi får:**
- ✅ Näringsförbud (om finns)
- ✅ Person, period, anledning
- 🚨 **KRITISK RISK** - Avvisa klient omedelbart!

**Används i:** ResultSlides - Riskindikatorer

---

### 7. Company Engagements (Styrelseuppdrag)

**Endpoint:**
```
GET /persons/{personnummer}/engagements
```

**Response:**
```json
{
  "currentEngagements": 3,
  "historicalEngagements": 7,
  "engagements": [
    {
      "companyName": "Celestial Redovisning AB",
      "organizationNumber": "556500-2465",
      "role": "Styrelseordförande",
      "from": "2015-03-15",
      "to": null,
      "status": "Active"
    },
    {
      "companyName": "Tech Startup AB",
      "organizationNumber": "559123-4567",
      "role": "Styrelseledamot",
      "from": "2018-01-10",
      "to": null,
      "status": "Active"
    }
  ]
}
```

**Vad vi får:**
- ✅ Alla styrelseuppdrag (nuvarande + historiska)
- ✅ Per person (VD, styrelseledamöter)

**Risk-analys:**
- Många samtidiga uppdrag = möjligen överbelastad
- Många avslutade uppdrag = instabila företag?

**Används i:** ResultSlides - Styrelse

---

### 8. Risk Indicators (Riskindikatorer)

**Endpoint:**
```
GET /companies/{org_nr}/risk-indicators
```

**Response:**
```json
{
  "overallRiskScore": 12,
  "riskLevel": "Low",
  "indicators": [
    {
      "category": "Financial",
      "score": 3,
      "status": "Green"
    },
    {
      "category": "Legal",
      "score": 0,
      "status": "Green"
    },
    {
      "category": "Ownership",
      "score": 2,
      "status": "Green"
    },
    {
      "category": "Business Activity",
      "score": 7,
      "status": "Yellow"
    }
  ],
  "alerts": [
    {
      "type": "Info",
      "message": "Company has been active for less than 10 years",
      "severity": "Low"
    }
  ]
}
```

**Riskpoäng:**
- 0-20: Låg risk (Grön)
- 21-50: Medel risk (Gul)
- 51-100: Hög risk (Röd)

**Används i:** ResultSlides - Riskindikatorer

---

### 9. Company Rating (Kreditbetyg)

**Endpoint:**
```
GET /companies/{org_nr}/rating
```

**Response:**
```json
{
  "creditRating": "AAA",
  "creditScore": 92,
  "paymentRemarks": 0,
  "creditLimit": 500000,
  "ratingDate": "2024-12-01"
}
```

**Kreditbetyg:**
- AAA: Utmärkt
- AA: Mycket bra
- A: Bra
- BBB: Godtagbar
- BB/B: Svag
- CCC/CC/C: Mycket svag
- D: Default (konkurs)

**Används i:** ResultSlides - Övriga data

---

### 10. Sanctions List (Sanktionslistor)

**Endpoint:**
```
GET /companies/{org_nr}/sanctions
```

**Response:**
```json
{
  "euSanctions": { "found": false, "matches": [] },
  "unSanctions": { "found": false, "matches": [] },
  "ofacSanctions": { "found": false, "matches": [] },
  "ukSanctions": { "found": false, "matches": [] },
  "status": {
    "code": 0,
    "text": "No sanctions found"
  }
}
```

**Om sanktion finns:**
```json
{
  "euSanctions": {
    "found": true,
    "matches": [
      {
        "name": "Company Name Ltd",
        "country": "Russia",
        "sanctionDate": "2022-03-01",
        "reason": "Support for Russian military operations"
      }
    ]
  }
}
```

**Kontrollerar:**
- ✅ EU-sanktionslistor
- ✅ FN-sanktionslistor
- ✅ OFAC (USA)
- ✅ UK-sanktionslistor

**Används i:** ResultSlides - Riskindikatorer

---

### 11. PEP (Politically Exposed Person)

**Endpoint:**
```
GET /persons/{personnummer}/pep
```

**Response:**
```json
{
  "isPEP": false,
  "matches": [],
  "boardMemberChecks": [
    {
      "name": "Anna Svensson",
      "isPEP": false
    },
    {
      "name": "Erik Johansson",
      "isPEP": false
    }
  ],
  "status": {
    "code": 0,
    "text": "No PEP matches found"
  }
}
```

**Om PEP finns:**
```json
{
  "isPEP": true,
  "matches": [
    {
      "name": "Anna Svensson",
      "position": "Riksdagsledamot",
      "country": "Sweden",
      "from": "2018-09-24",
      "to": "2022-09-26"
    }
  ]
}
```

**PEP-kategorier:**
- Riksdagsledamot
- Minister
- Generaldirektör
- Domare i högre instans
- Militär ledning
- Diplomat
- Familjemedlem till ovanstående

**Används i:** ResultSlides - Riskindikatorer

---

### 12. AML Registry (Penningtvättsregister)

**Endpoint:**
```
GET /companies/{org_nr}/aml-registry
```

**Response:**
```json
{
  "found": false,
  "status": {
    "code": 0,
    "text": "No entries in AML registry"
  }
}
```

**Kontrollerar:**
- Finns företaget/personer i Finanspolisens register?
- Tidigare penningtvättsutredningar?

**Används i:** ResultSlides - Riskindikatorer

---

### 13. Legal Information (Rättsinformation)

**Endpoint:**
```
GET /companies/{org_nr}/legal
```

**Response:**
```json
{
  "courtCases": [],
  "legalRemarks": 0,
  "bankruptcies": 0,
  "status": "Clean record"
}
```

**Om rättsfall finns:**
```json
{
  "courtCases": [
    {
      "caseNumber": "T 1234-21",
      "court": "Stockholms tingsrätt",
      "caseType": "Tvistemål",
      "status": "Pågående",
      "filedDate": "2021-03-15"
    }
  ],
  "legalRemarks": 1,
  "bankruptcies": 0,
  "status": "Active legal proceedings"
}
```

**Används i:** ResultSlides - Riskindikatorer

---

### 14. Property Information (Fastigheter)

**Endpoint:**
```
GET /companies/{org_nr}/properties
```

**Response:**
```json
{
  "properties": [
    {
      "propertyId": "STOCKHOLM NORRMALM 1:234",
      "address": "Kungsgatan 45, 111 56 Stockholm",
      "taxAssessedValue": 8500000,
      "ownershipPercent": 100,
      "acquisitionDate": "2018-06-15"
    }
  ],
  "totalTaxAssessedValue": 8500000
}
```

**Vad vi får:**
- ✅ Fastighetsinnehav
- ✅ Taxeringsvärde
- ✅ Ägarandel

**Används i:** ResultSlides - Övriga data

---

### 15. Company Case Register (Ärenden hos Bolagsverket)

**Endpoint:**
```
GET /companies/{org_nr}/cases
```

**Response:**
```json
{
  "openCases": 0,
  "closedCases": 3,
  "cases": [
    {
      "caseNumber": "12345-2015",
      "caseType": "Bolagsbildning",
      "status": "Closed",
      "registrationDate": "2015-03-15",
      "closedDate": "2015-03-20"
    }
  ]
}
```

**Används in:** ResultSlides - Övriga data

---

### 16. Financial Information (Ekonomisk info)

**Endpoint:**
```
GET /companies/{org_nr}/financials
```

**Response:**
```json
{
  "latestYear": 2023,
  "currency": "SEK",
  "revenue": 4500000,
  "operatingProfit": 850000,
  "profitAfterTax": 650000,
  "totalAssets": 2100000,
  "equity": 1200000,
  "numberOfEmployees": 8,
  "profitMargin": 18.9,
  "equityRatio": 57.1,
  "returnOnEquity": 54.2
}
```

**Används i:** ResultSlides - Övriga data (om vi vill visa ekonomiska nyckeltal)

---

### 17. Establishments (Arbetsställen)

**Endpoint:**
```
GET /companies/{org_nr}/establishments
```

**Response:**
```json
{
  "establishments": [
    {
      "establishmentNumber": "16000001",
      "name": "Huvudkontor",
      "address": {
        "street": "Kungsgatan 45",
        "postalCode": "111 56",
        "city": "Stockholm"
      },
      "numberOfEmployees": 8,
      "establishmentType": "Head office"
    }
  ]
}
```

**Används in:** ResultSlides - Övriga data

---

### 18. Share Facts (Aktieuppgifter)

**Endpoint:**
```
GET /companies/{org_nr}/shares
```

**Response:**
```json
{
  "shareCapital": 500000,
  "numberOfShares": 50000,
  "shareValue": 10,
  "shareClasses": [
    {
      "class": "A",
      "shares": 50000,
      "votesPerShare": 1
    }
  ],
  "newIssues": []
}
```

**Används in:** ResultSlides - Ägarstruktur

---

## 📦 Integration i Backend

### Python (FastAPI) Exempel

```python
import os
import httpx
from typing import Optional

class RoaringAPI:
    def __init__(self):
        self.api_key = os.getenv("ROARING_API_KEY")
        self.base_url = "https://api.roaring.io/api/v1"
        if os.getenv("ROARING_ENV") == "sandbox":
            self.base_url = "https://sandbox.roaring.io/api/v1"
    
    async def get_company_activity(self, org_nr: str):
        """Hämta verksamhetsinformation"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/companies/{org_nr}/activity",
                headers={"X-API-Key": self.api_key}
            )
            return response.json()
    
    async def get_ownership(self, org_nr: str):
        """Hämta ägarstruktur"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/companies/{org_nr}/ownership",
                headers={"X-API-Key": self.api_key}
            )
            return response.json()
    
    async def get_board(self, org_nr: str):
        """Hämta styrelseuppgifter"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/companies/{org_nr}/board",
                headers={"X-API-Key": self.api_key}
            )
            return response.json()
    
    async def get_pep_check(self, personnummer: str):
        """PEP-kontroll"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/persons/{personnummer}/pep",
                headers={"X-API-Key": self.api_key}
            )
            return response.json()
    
    async def get_sanctions(self, org_nr: str):
        """Sanktionslistkontroll"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/companies/{org_nr}/sanctions",
                headers={"X-API-Key": self.api_key}
            )
            return response.json()
    
    async def get_risk_indicators(self, org_nr: str):
        """Riskindikatorer"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/companies/{org_nr}/risk-indicators",
                headers={"X-API-Key": self.api_key}
            )
            return response.json()

# Användning i API endpoint
@app.post("/api/onboarding/fetch-roaring-data")
async def fetch_roaring_data(data: CompanyData):
    roaring = RoaringAPI()
    
    # Anropa alla endpoints parallellt (spara anrop-tid)
    results = await asyncio.gather(
        roaring.get_company_activity(data.org_nr),
        roaring.get_ownership(data.org_nr),
        roaring.get_board(data.org_nr),
        roaring.get_sanctions(data.org_nr),
        roaring.get_risk_indicators(data.org_nr)
    )
    
    # Spara i databas
    save_to_csv("roaring_data.csv", {
        "activity": results[0],
        "ownership": results[1],
        "board": results[2],
        "sanctions": results[3],
        "risk": results[4]
    })
    
    return {
        "success": True,
        "data": {
            "activity": results[0],
            "ownership": results[1],
            "board": results[2],
            "sanctions": results[3],
            "risk": results[4]
        }
    }
```

---

## 📊 När anropas Roaring.io?

### Trigger: Riskfrågor Steg 1 (Företagsidentifikation)

När användaren fyller i **organisationsnummer** och **personnummer**:

1. Frontend validerar format
2. Backend anropar Roaring.io (18 endpoints parallellt)
3. Data sparas i `roaring_data.csv`
4. ResultSlides låses upp i sidebar

**Anropsräknare:**
- 1 företag med alla endpoints = 18 anrop förbrukade
- 500 anrop = ~27 företag (om alla endpoints används)

---

## 🚨 Rate Limits

**Roaring.io:**
- Inga rate limits (du betalar per anrop)
- Men: Undvik duplicerade anrop (cacha data)

**Error handling:**
```json
{
  "error": "quota_exceeded",
  "message": "Du har använt alla dina 500 anrop",
  "remainingCalls": 0
}
```

---

## 📝 Databas-lagring

**Tabell: roaring_data.csv**

```csv
id,org_nr,activity_json,ownership_json,board_json,sanctions_json,pep_json,risk_json,fetched_at
1,556500-2465,"{...}","{...}","{...}","{...}","{...}","{...}","2025-10-23 14:30:00"
```

---

## 🧪 Testa API:et

### Med curl:

```bash
# Sandbox (gratis test)
curl -X GET "https://sandbox.roaring.io/api/v1/companies/556500-2465/activity" \
  -H "X-API-Key: $ROARING_API_KEY_SANDBOX" | jq

# Production (kostar 1 anrop)
curl -X GET "https://api.roaring.io/api/v1/companies/556500-2465/ownership" \
  -H "X-API-Key: $ROARING_API_KEY_PROD" | jq
```

---

## 📚 Dokumentation

**Officiella resurser:**
- Website: https://roaring.io
- API Docs: https://docs.roaring.io
- Support: support@roaring.io

---

## ⚠️ Säkerhet

**VIKTIGT:**
- ✅ API-nyckel sparas i `.env` (ALDRIG i Git)
- ✅ API-anrop görs från backend (ALDRIG från frontend)
- ✅ Cacha data (undvik duplicerade anrop = slösa pengar)

---

## 💰 Kostnadsoptimering

**Tips:**
1. **Cacha data** - Spara Roaring.io-svar i databas (giltigt i 30 dagar)
2. **Conditional fetching** - Anropa bara endpoints du verkligen behöver
3. **Batch processing** - Onboarda flera klienter samtidigt

**Exempel:**
- Om du bara behöver ägarstruktur: 1 anrop istället för 18
- Om data är yngre än 30 dagar: 0 anrop (använd cachad data)

---

## 📈 Nästa steg

**Nu (sandbox):**
- ✅ Testa alla endpoints
- ✅ Verifiera att data matchar mockRoaringData.js

**Fredag (köp 500 anrop):**
- [ ] Få produktions-API-nyckel
- [ ] Uppdatera `.env` med prod-key
- [ ] Testa med riktiga org.nr
- [ ] Implementera caching (undvik slösa anrop)

**Framtid:**
- [ ] Köp fler anrop vid behov
- [ ] Överväg månadsprenumeration om >50 klienter/månad
