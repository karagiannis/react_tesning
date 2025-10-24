# Bolagsverket API - Komplett Integration Guide

## 📋 Översikt

Bolagsverket tillhandahåller två huvudsakliga API-tjänster:

1. **Värdefulla datamängder** (GRATIS) - Grundläggande företagsinformation
2. **Företagsinformation** (BETALAS) - Utökad information inkl. ägarstruktur & styrelse

**Status för Celestial AB:**
- ✅ Produktions-credentials (live data)
- ✅ Test-credentials (sandbox)
- ✅ Tillgång till "Värdefulla datamängder"
- ❌ Företagsinformation (kostar 5000 kr engångsavgift + 1000 kr/månad)

---

## 🔐 Credentials

### Produktionsmiljö (Live Data)

**OAuth2 Token Endpoint:**
```
https://portal.api.bolagsverket.se/oauth2/token
```

**Credentials lagras i:**
- Fil: `/Bolagsverket/bolagsverket_prod.zip`
- Dekrypteringskod (SMS): `GB!WwKjB+Ub31CwZya7q`

**Efter uppackning:**
- `prod_client_id.txt` - Client ID
- `prod_client_secret.txt` - Client Secret

**Environment variables:**
```bash
BOLAGSVERKET_PROD_CLIENT_ID=<från prod_client_id.txt>
BOLAGSVERKET_PROD_CLIENT_SECRET=<från prod_client_secret.txt>
BOLAGSVERKET_ENV=production
```

---

### Testmiljö (Sandbox)

**OAuth2 Token Endpoint:**
```
https://portal.api.bolagsverket.se/oauth2/token
```

**Credentials lagras i:**
- Fil: `/Bolagsverket/bolagsverket_test.zip`
- Dekrypteringskod (SMS): `26-X7NtSa!fQpDFe!Q2e`

**Efter uppackning:**
- `test_client_id.txt` - Client ID
- `test_client_secret.txt` - Client Secret

**Environment variables:**
```bash
BOLAGSVERKET_TEST_CLIENT_ID=<från test_client_id.txt>
BOLAGSVERKET_TEST_CLIENT_SECRET=<från test_client_secret.txt>
BOLAGSVERKET_ENV=test
```

---

## 🔑 Autentisering (OAuth2 Client Credentials)

### 1. Hämta Access Token

**Request:**
```bash
curl -X POST https://portal.api.bolagsverket.se/oauth2/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET"
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

**Token Lifetime:** 1 timme (3600 sekunder)

---

## 📡 API Endpoints

### ✅ Värdefulla datamängder (GRATIS - Vi har tillgång)

Dessa endpoints är tillgängliga med våra credentials:

#### 1. Företagsinformation (Grunddata)

**Endpoint:**
```
GET /open/v1/companies/{organisationsnummer}
```

**Exempel:**
```bash
curl -X GET "https://portal.api.bolagsverket.se/open/v1/companies/556903-8671" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response:**
```json
{
  "organizationNumber": "556903-8671",
  "companyName": "Celestial Redovisning AB",
  "registeredOffice": "Stockholm",
  "postalAddress": {
    "street": "Kungsgatan 45",
    "postalCode": "111 56",
    "city": "Stockholm",
    "country": "Sverige"
  },
  "businessActivity": "Redovisningstjänster och skatterådgivning",
  "companyForm": "AB",
  "registrationDate": "2015-03-15",
  "status": "Active"
}
```

**Vad vi får:**
- ✅ Organisationsnummer
- ✅ Företagsnamn
- ✅ Postadress
- ✅ Verksamhetsbeskrivning (fritext)
- ✅ Bolagsform (AB, HB, KB, etc)
- ✅ Registreringsdatum
- ✅ Status (Active/Dissolved/Bankruptcy)

**Vad vi INTE får:**
- ❌ SNI-kod (branschkod)
- ❌ Ägarstruktur
- ❌ Styrelseuppgifter
- ❌ Firmatecknare
- ❌ Aktiekapital

---

#### 2. Företagshändelser (Aviseringar)

**Endpoint:**
```
GET /open/v1/companies/{organisationsnummer}/events
```

**Exempel:**
```bash
curl -X GET "https://portal.api.bolagsverket.se/open/v1/companies/556903-8671/events?from=2024-01-01&to=2024-12-31" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response:**
```json
{
  "events": [
    {
      "eventDate": "2024-06-15",
      "eventType": "Styrelsesändring",
      "description": "Ny styrelseledamot registrerad"
    },
    {
      "eventDate": "2024-03-20",
      "eventType": "Adressändring",
      "description": "Postadress ändrad"
    }
  ]
}
```

**Vad vi får:**
- ✅ Datum för händelse
- ✅ Typ av händelse (styrelsesändring, adressändring, etc)
- ✅ Beskrivning

**Användning:**
- Spåra förändringar i företaget över tid
- Flagga nyliga styrelsesändringar (risk)

---

#### 3. SNI-koder (Branschkoder)

**Endpoint:**
```
GET /open/v1/sni-codes
```

**Response:**
```json
{
  "sniCodes": [
    {
      "code": "69.20",
      "description": "Redovisning och bokföring, skatterådgivning"
    },
    {
      "code": "70.22",
      "description": "Konsultverksamhet avseende företags organisation"
    }
  ]
}
```

**OBS:** Detta ger ALLA SNI-koder (referensdatabas), inte specifikt företags koder.

---

### ❌ Företagsinformation (KOSTAR 5000 kr + 1000 kr/mån - Vi har INTE tillgång)

Dessa endpoints kräver betald prenumeration:

#### 1. Ägarstruktur

**Endpoint:**
```
GET /premium/v1/companies/{organisationsnummer}/ownership
```

**Vad det ger:**
- Ägare (namn, personnummer, ägarandel)
- Aktiekapital
- Antal aktier
- Aktieklasser

**Status:** ❌ Inte tillgänglig för oss (använd Roaring.io istället)

---

#### 2. Styrelseuppgifter

**Endpoint:**
```
GET /premium/v1/companies/{organisationsnummer}/board
```

**Vad det ger:**
- Styrelseledamöter (namn, personnummer, roll)
- VD
- Revisor
- Firmatecknare

**Status:** ❌ Inte tillgänglig för oss (använd Roaring.io istället)

---

#### 3. Dagliga uppdateringar

**Endpoint:**
```
GET /premium/v1/companies/{organisationsnummer}/daily-updates
```

**Vad det ger:**
- Realtidsuppdateringar vid ändringar
- Webhook-notifikationer

**Status:** ❌ Inte tillgänglig för oss
**Release date:** Q1 2026 (enligt Bolagsverket)

---

## 📦 Integration i Backend

### Python (FastAPI) Exempel

```python
import os
import httpx
from datetime import datetime, timedelta

class BolagsverketAPI:
    def __init__(self):
        self.client_id = os.getenv("BOLAGSVERKET_CLIENT_ID")
        self.client_secret = os.getenv("BOLAGSVERKET_CLIENT_SECRET")
        self.base_url = "https://portal.api.bolagsverket.se"
        self.access_token = None
        self.token_expires_at = None
    
    async def get_access_token(self):
        """Hämta OAuth2 access token"""
        if self.access_token and self.token_expires_at > datetime.now():
            return self.access_token
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/oauth2/token",
                data={
                    "grant_type": "client_credentials",
                    "client_id": self.client_id,
                    "client_secret": self.client_secret
                }
            )
            data = response.json()
            self.access_token = data["access_token"]
            self.token_expires_at = datetime.now() + timedelta(seconds=data["expires_in"])
            return self.access_token
    
    async def get_company_info(self, org_nr: str):
        """Hämta företagsinformation"""
        token = await self.get_access_token()
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/open/v1/companies/{org_nr}",
                headers={"Authorization": f"Bearer {token}"}
            )
            return response.json()
    
    async def get_company_events(self, org_nr: str, from_date: str, to_date: str):
        """Hämta företagshändelser"""
        token = await self.get_access_token()
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/open/v1/companies/{org_nr}/events",
                headers={"Authorization": f"Bearer {token}"},
                params={"from": from_date, "to": to_date}
            )
            return response.json()

# Användning i API endpoint
@app.post("/api/onboarding/verify-identity")
async def verify_identity(data: CompanyData):
    bv = BolagsverketAPI()
    
    # Hämta grunddata från Bolagsverket
    company_info = await bv.get_company_info(data.org_nr)
    
    # Spara i databas
    save_to_csv("bolagsverket_data.csv", company_info)
    
    return {
        "companyName": company_info["companyName"],
        "address": company_info["postalAddress"],
        "status": company_info["status"]
    }
```

---

## 📊 Vad använder vi Bolagsverket till?

### I Onboarding-appen:

**Steg 1: Företagsidentifikation (Riskfrågor Steg 1/5)**
1. Användaren fyller i organisationsnummer
2. Backend anropar `GET /open/v1/companies/{org_nr}`
3. Autofyll av:
   - Företagsnamn
   - Adress
   - Verksamhetsbeskrivning

**Steg 2: Validering (Riskfrågor Steg 2/5)**
1. Jämför användarens verksamhetsbeskrivning med Bolagsverkets data
2. Flagga avvikelser

**Steg 3: Historikkontroll**
1. Anropa `GET /open/v1/companies/{org_nr}/events`
2. Kontrollera om företaget har:
   - Nyliga styrelsesändringar (risk)
   - Adressändringar (risk om ofta)
   - Konkurs/rekonstruktion (hög risk)

---

## 🔄 Komplettering med Roaring.io

Eftersom Bolagsverket (gratis tier) INTE ger:
- Ägarstruktur
- Styrelseuppgifter
- SNI-koder

...så använder vi **Roaring.io** för dessa data istället.

**Workflow:**
1. **Bolagsverket** (gratis) → Grunddata + Validering
2. **Roaring.io** (500 anrop) → Ägarstruktur, Styrelse, PEP, Sanktioner

---

## 🚨 Rate Limits

**Bolagsverket (gratis tier):**
- 100 requests/minut
- 10 000 requests/dag

**Om överskridet:**
```json
{
  "error": "rate_limit_exceeded",
  "message": "Du har överskridit din rate limit",
  "retryAfter": 60
}
```

---

## 📝 Databas-lagring

**Tabell: bolagsverket_data.csv**

```csv
id,org_nr,company_name,address_street,address_postal_code,address_city,business_activity,company_form,registration_date,status,fetched_at
1,556903-8671,"Celestial Redovisning AB","Kungsgatan 45","111 56","Stockholm","Redovisningstjänster och skatterådgivning","AB","2015-03-15","Active","2025-10-23 14:30:00"
```

**Tabell: bolagsverket_events.csv**

```csv
id,org_nr,event_date,event_type,description,fetched_at
1,556903-8671,"2024-06-15","Styrelsesändring","Ny styrelseledamot registrerad","2025-10-23 14:30:00"
2,556903-8671,"2024-03-20","Adressändring","Postadress ändrad","2025-10-23 14:30:00"
```

---

## 🧪 Testa API:et

### Med curl:

```bash
# 1. Hämta token
TOKEN=$(curl -s -X POST https://portal.api.bolagsverket.se/oauth2/token \
  -d "grant_type=client_credentials" \
  -d "client_id=$BOLAGSVERKET_TEST_CLIENT_ID" \
  -d "client_secret=$BOLAGSVERKET_TEST_CLIENT_SECRET" \
  | jq -r '.access_token')

# 2. Hämta företagsinfo
curl -X GET "https://portal.api.bolagsverket.se/open/v1/companies/556903-8671" \
  -H "Authorization: Bearer $TOKEN" | jq
```

---

## 📚 Dokumentation

**Officiella resurser:**
- Developer Portal: https://portal.api.bolagsverket.se
- Teknisk handledning: `/Bolagsverket/teknisk-handledning.txt`
- Postbeskrivning (aviseringar): `/Bolagsverket/postbeskrivning.txt`

**Support:**
- 📧 Email: api@bolagsverket.se
- 📞 Telefon: 0771-670 670

---

## ⚠️ Säkerhet

**VIKTIGT:**
- ✅ Credentials sparas i `.env` (ALDRIG i Git)
- ✅ Access tokens cachas (undvik onödiga token-anrop)
- ✅ Rate limiting hanteras (retry med exponential backoff)
- ✅ API-anrop görs från backend (ALDRIG från frontend)

**Om credentials komprometteras:**
1. Kontakta api@bolagsverket.se omedelbart
2. Begär nya credentials
3. Uppdatera `.env`-fil

---

## 📈 Nästa steg

**Nu:**
- ✅ Använd gratis tier för grunddata

**Framtid (om budget finns):**
- [ ] Uppgradera till Premium (5000 kr + 1000 kr/mån)
- [ ] Få tillgång till ägarstruktur direkt från Bolagsverket
- [ ] Slippa Roaring.io (spara pengar långsiktigt?)

**Kostnadsjämförelse:**
- Roaring.io: ~1000-2000 kr för 500 anrop (engångskostnad per batch)
- Bolagsverket Premium: 5000 kr engång + 1000 kr/mån = 17 000 kr/år

**Rekommendation:** Använd Roaring.io tills vi har 50+ kunder/månad, då blir Premium mer lönsam.
