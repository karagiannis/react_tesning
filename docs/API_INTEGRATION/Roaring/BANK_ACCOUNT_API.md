# Roaring.io Global Bank Account Information API (1.0)

> **Typ:** Open Banking / PSD2 Compliance  
> **Uppdaterad:** 2025-10-23  
> **Användning:** Real-time bankkontoverifiering och transaktionsanalys

---

## 📋 Overview

Access **+2600 European banks** with one single entry point via Open Banking/PSD2.

### What This API Does:
- ✅ Real-time bank account balances
- ✅ Transaction history (90 days typically)
- ✅ Verify account details and ownership
- ✅ Enhance customer financial behavior insights
- ✅ PSD2/Open Banking compliant

### Use Case for KYC:
A financial lender uses the API to securely access a customer's bank transaction history and balance, improving the accuracy of loan eligibility assessments while maintaining compliance with financial regulations.

**For our KYC app:** Verify that the company representative is authorized on the company's bank account + analyze transaction patterns for suspicious activity.

---

## 🔐 Authentication

**OAuth2 Client Credentials (same as other Roaring.io APIs)**

```
Client ID: 1fc1c3bb-79d0-4b39-b541-70ef67c810a1
Client Secret: c96cdfe6-84d8-477a-a872-ab93c6e89203
Base URL (Sandbox): https://api.roaring.io/global/bank-account-data/1.0
```

---

## 🏦 Endpoints

### 1. Get Available Banks
**GET `/banks/{psuType}`**

Fetch list of available banks for a specific PSU (Payment Service User) type.

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `psuType` | string | ✅ | PSU type (e.g., "business", "personal") |

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `countryCode` | string | - | Country code (e.g., "SE" for Sweden) |

#### Example Request
```bash
curl -X GET \
  --header 'Accept: application/json' \
  --header 'Authorization: Bearer {ACCESS_TOKEN}' \
  'https://api.roaring.io/global/bank-account-data/1.0/banks/business?countryCode=SE'
```

---

### 2. Get Auth URL
**POST `/auth/url/{country}/{bankName}`**

Generate authorization URL for bank authentication flow.

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `country` | string | ✅ | Bank's country code (e.g., "SE") |
| `bankName` | string | ✅ | Bank name (e.g., "Swedbank") |

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `redirectUrl` | string | ✅ | URL to redirect after successful auth |
| `language` | string | - | ISO 639-1 language code (defaults to bank's country language) |

#### Request Body
```json
{
  "type": "business",
  "authOption": "string",
  "userId": "string",
  "password": "string",
  "companyId": "string",
  "personalCode": "string",
  "email": "string",
  "phoneNumber": "string",
  "iban": "string",
  "cardNumber": "string",
  "currencyCode": "string"
}
```

#### Type Options
| Value | Description |
|-------|-------------|
| `business` | Business/company account |
| `personal` | Personal account |

---

### 3. Get Auth Session
**GET `/auth/session`**

Retrieve authentication session details.

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `authCode` | string | - | Authorization code from bank redirect |

---

### 4. Delete Session
**DELETE `/session/{sessionId}`**

Delete an active session.

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `sessionId` | string | ✅ | Session ID to delete |

---

### 5. Get Account Details
**GET `/account/details/{accountId}`**

Fetch detailed information about a specific bank account.

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `accountId` | string | ✅ | Account ID from session |

#### Response Schema
```json
{
  "type": "object"
}
```

**Note:** OpenAPI spec defines response as generic object. Actual structure depends on bank/PSD2 provider.

---

### 6. Get Account Transactions
**GET `/account/{accountId}/transactions`**

Retrieve transaction history for an account.

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `accountId` | string | ✅ | Account ID |

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `fromDate` | string | - | Start date (YYYY-MM-DD) |
| `toDate` | string | - | End date (YYYY-MM-DD) |

#### Example Request
```bash
curl -X GET \
  --header 'Accept: application/json' \
  --header 'Authorization: Bearer {ACCESS_TOKEN}' \
  'https://api.roaring.io/global/bank-account-data/1.0/account/abc123/transactions?fromDate=2024-10-01&toDate=2025-01-23'
```

#### Response Schema
```json
{
  "type": "object"
}
```

**Note:** Generic object response. Actual transaction structure varies by bank.

**Expected fields (based on PSD2 standard):**
- `transactionId`: Unique transaction identifier
- `bookingDate`: Date transaction was booked (YYYY-MM-DD)
- `valueDate`: Value date for interest calculation
- `amount`: Transaction amount and currency
- `creditorName`: Recipient name (for outgoing)
- `debtorName`: Sender name (for incoming)
- `remittanceInformation`: Payment reference/description

---

### 7. Get ASPSPs Statuses
**GET `/aspsps_statuses`**

Get status of Account Servicing Payment Service Providers (banks).

---

## 📊 Response Schemas (från OpenAPI)

### Success Response (Generic)
All successful responses return:
```json
{
  "type": "object"
}
```

### Error Schemas

#### BadRequest (400)
```json
{
  "error": "string",
  "message": "string",
  "attributes": [
    {
      "attribute": "string",
      "value": "string"
    }
  ]
}
```

**Description:** Returned when something is wrong in the request, e.g. failed argument validation or missing arguments.

#### Forbidden (403)
```json
{
  "error": "string",
  "message": "string"
}
```

**Description:** Returned when authentication credentials are insufficient to grant access.

#### ServerError (500)
```json
{
  "error": "string",
  "message": "string"
}
```

**Description:** Internal server error occurred.

---

## 🏦 Verified Banks (Sandbox Test)

### Swedish Business Banks (4 total)
| Bank | Auth Methods | Required Credentials |
|------|-------------|---------------------|
| **Nordea Corporate** | MTA (Redirect) | Agreement number for Nordea Corporate Netbank |
| **Handelsbanken** | BANKID (Decoupled), REDIRECT | User ID (YYYYMMDDXXXX) + Company ID (10 digits) |
| **Mock ASPSP** | REDIRECT | No credentials (test bank) |
| **Nordea First Card** | REDIRECT | - |

### Swedish Personal Banks (60+ sparbanker)
Includes Swedbank, Nordea, Handelsbanken + 57 regional sparbanker.

**Examples:**
- Swedbank
- Sparbanken Skåne
- Sparbanken Västra Mälardalen
- Handelsbanken (with BankID support)

**Full list:** Run `test_bank_api.sh` or check `test_results/banks_personal_se.json`

---

## 📊 Code Tables

### Account Type Codes
| Code | Description |
|------|-------------|
| `CACC` | Current Account - Account used to post debits and credits when no specific account has been nominated |
| `CARD` | Card Account - Account used for card payments only |
| `CASH` | Cash Account - Account used for the payment of cash |
| `LOAN` | Loan Account - Account used for loans |
| `OTHR` | Other Account - Account not otherwise specified |
| `SVGS` | Savings Account - Account used for savings |

### Balance Type Codes
| Code | Description |
|------|-------------|
| `CLAV` | Closing Available Balance |
| `CLBD` | Closing Booked Balance - Accounting Balance |
| `FWAV` | Forward Available Balance - Balance that is at the disposal of account holders on the date specified |
| `INFO` | Information Balance - Balance for informational purposes |
| `ITAV` | Interim Available Balance - Available balance calculated in the course of the day |
| `ITBD` | Interim Booked Balance - Booked balance calculated in the course of the day |
| `OPAV` | Opening Available Balance - Opening balance at the disposal of account holders at the beginning of the date |
| `OPBD` | Opening Booked Balance - Book balance at the beginning of the reporting period |
| `OTHR` | Other Balance |
| `PRCD` | Previous Closing Balance - Balance of the account at the end of the previous reporting period |
| `VALU` | Value-Date Balance |
| `XPCD` | Expected Balance - Instant Balance |

---

## 🔄 Integration Flow (För KYC)

### Steg 1: Initiera bankautentisering
```javascript
// Frontend initierar bankval
const response = await fetch('/api/bank-auth/init', {
  method: 'POST',
  body: JSON.stringify({
    orgNr: '556903-8671',
    bankName: 'Swedbank',
    country: 'SE',
    type: 'business'
  })
});

const { authUrl, sessionId } = await response.json();

// Redirect användaren till bankens inloggning
window.location.href = authUrl;
```

### Steg 2: Hantera callback från bank
```javascript
// Backend endpoint: /api/bank-auth/callback
// Query params: ?authCode=abc123&sessionId=xyz789

// Hämta session
const session = await roaringClient.getAuthSession(authCode);

// Hämta kontouppgifter
const accounts = await roaringClient.getAccountDetails(session.accountId);

// Verifiera kontobehörighet
if (accounts.accountHolder.personalNumber !== expectedSSN) {
  throw new Error('Person ej kontobehörig');
}
```

### Steg 3: Analysera transaktioner
```javascript
// Hämta 90 dagars transaktioner
const transactions = await roaringClient.getTransactions(
  accountId,
  { fromDate: '2024-10-23', toDate: '2025-01-23' }
);

// Analysera misstänkta mönster
const analysis = analyzeTransactions(transactions);

// Red flags:
// - Stora kontantuttag
// - Transaktioner till högriskländer
// - Ovanliga belopp eller frekvens
// - Cirkulära transaktioner
```

---

## 💰 Kostnad

**Detta API är SEPARAT från vanliga Roaring.io-anrop.**

Pricing är troligen per:
- Session (bankautentisering)
- Konto-access
- Transaktionshämtning

**TODO:** Kolla prissättning med Roaring.io

---

## 🚨 KYC Use Cases

### 1. Kontobehörighetsverifiering
**Scenario:** VD säger sig representera företaget  
**Åtgärd:** Be VD logga in på företagskontot via BankID  
**Resultat:** Verifiera att VD faktiskt är firmatecknare/kontobehörig

### 2. Transaktionsmönster-analys
**Scenario:** Misstänkt penningtvätt  
**Åtgärd:** Analysera 90 dagars transaktioner  
**Red flags:**
- Stora kontantuttag (>50 000 SEK)
- Transaktioner till FATF-högriskländer
- Cirkulära betalningar (in → ut samma dag)
- Ovanligt stora belopp jämfört med omsättning

### 3. Ekonomisk Hälsa
**Scenario:** Kreditbedömning  
**Åtgärd:** Kontrollera saldo + kassaflöde  
**Resultat:** Verifiera att företaget har ekonomi att betala tjänster

---

## ⚠️ GDPR & Compliance

**Viktigt:**
- ✅ Kräver **explicit användargodkännande**
- ✅ Data sparas max **90 dagar** (PSD2-krav)
- ✅ Användaren kan **återkalla åtkomst** när som helst
- ✅ Logga alla åtkomster (audit trail)
- ✅ Informera användaren om **vad data används till**

**Consent-text exempel:**
```
"För att slutföra KYC-processen behöver vi verifiera att du är 
behörig att representera företaget. Vi kommer att:

1. Be dig logga in på företagets bankkonto via BankID
2. Hämta kontouppgifter för att verifiera behörighet
3. Analysera transaktionshistorik (90 dagar) för riskbedömning

Data raderas automatiskt efter 90 dagar. Du kan återkalla åtkomst 
när som helst via inställningar."
```

---

## 🧪 Testing (Sandbox)

### Test Script
```bash
./docs/API_INTEGRATION/Roaring/test_bank_api.sh
```

### Test Results (2025-10-23)
| Endpoint | Status | Result |
|----------|--------|--------|
| `POST /token` | ✅ Working | OAuth2 token retrieved successfully |
| `GET /banks/business` | ✅ Working | 4 Swedish business banks found |
| `GET /banks/personal` | ✅ Working | 60+ personal banks available |
| `POST /auth/url/{country}/{bank}` | ✅ Working | Mock ASPSP auth URL generated |
| `GET /aspsps_statuses` | ❌ 404 | Not available in sandbox |
| `GET /account/details/{id}` | ⏳ Untested | Requires completed auth session |
| `GET /account/{id}/transactions` | ⏳ Untested | Requires completed auth session |

**Auth URL Example (Mock ASPSP):**
```
https://tilisy-sandbox.enablebanking.com/ais/start?sessionid=bb822db8-29c2-4d2f-a6ba-b5e3db472679&locale=SV
```

**Allowed Redirect URLs:**
- `https://app.roaring.io/`
- `https://app.test.roaring.io/v2/enable-banking/authorization`
- `https://app.test.roaring.io/v2/open-banking/authorization`
- `https://app.roaring.io/v2/open-banking/authorization`
- `https://localhost:3000/v2/open-banking/authorization`

### Available Test Banks
- **Mock ASPSP** (SE) - Sandbox test bank, no real credentials needed
- **Nordea Corporate** (SE) - Requires agreement number
- **Handelsbanken** (SE) - Supports BankID authentication

### Sandbox Test Credentials

#### Swedish Banks (via EnableBanking sandbox)

| Bank | Credentials | IBAN/Account |
|------|-------------|--------------|
| **Mock ASPSP** | ❌ None needed | Configure via Roaring.io control panel |
| **Handelsbanken** | ❌ None needed | Auto-generated in sandbox |
| **Nordea** | ❌ None needed | Auto-generated in sandbox |
| **Nordea Corporate** | Username: `130474822427` | Auto-generated |
| **Nordea First Card** | ❌ None needed | Auto-generated |
| **Swedbank** | Username: `19901111-1111` | Auto-generated |

**Source:** [EnableBanking Sandbox Docs](https://enablebanking.com/docs/api/sandbox/)

#### Mock ASPSP Custom Data
You can create custom test accounts via:
- [Tilisy.com](https://tilisy.com/) - Export real bank data as JSON (code: `FREEEXPORT`)
- [Sample synthetic data](https://enablebanking.com/sample-data/DK-Danske_Bank-synthetic-1.json)

Upload to Roaring.io control panel for Mock ASPSP testing.

---

## 📝 TODO

- [x] Verifiera OAuth2 authentication (DONE - 2025-10-23)
- [x] Lista tillgängliga banker (DONE - 4 business, multiple personal)
- [x] Dokumentera error schemas från OpenAPI (DONE)
- [x] Skapa test script (DONE - test_bank_api.sh)
- [ ] Testa Mock ASPSP full flow
- [ ] Verifiera account details response structure
- [ ] Verifiera transactions response structure
- [ ] Skapa consent-flow i frontend
- [ ] Implementera transaktionsanalys-algoritmer
- [ ] Definiera red-flag tresholds (belopp, länder, etc.)
- [ ] GDPR-compliance dokumentation
- [ ] Session-timeout hantering

---

## 🔄 Status

- ✅ Credentials mottagna (sandbox)
- ⏳ Behöver testa live integration
- ⏳ Behöver response schemas från sandbox

