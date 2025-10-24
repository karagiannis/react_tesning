# Roaring.io API Integration

> **Status:** Sandbox Testing  
> **Last Updated:** 2025-10-23  
> **Client ID:** `1fc1c3bb-79d0-4b39-b541-70ef67c810a1`

---

## 📚 Documentation Overview

### 1. [KYC_COST_OPTIMIZATION.md](KYC_COST_OPTIMIZATION.md) ⭐ **START HERE**
**Cost-Optimized KYC Strategy**  
💰 **Budget:** 500 API calls → Verify 138-274 companies  
🎯 **Key Strategies:** Early rejection (50% savings), caching (25-40% savings), company endpoint usage  
📊 **Decision Trees:** Enskild firma (2 calls) vs Aktiebolag (4-12 calls)  
🔧 **Implementation:** Complete Python code with budget monitoring & analytics

### 2. [API_SCHEMAS_BUSINESS_PROHIBITION.md](API_SCHEMAS_BUSINESS_PROHIBITION.md)
**Business Prohibition (Näringsförbud)**  
✅ **Complete + Tested** - 2 endpoints, 11 schemas, 100+ domstolskoder, 6 sandbox test cases verified live  
📋 **Includes:** Complete KYC workflows, exemption logic, company representative checks, ongoing monitoring examples  
🧪 **Test Script:** `./test_business_prohibition_api.sh`

### 3. [API_SCHEMAS_POPULATION_REGISTER.md](API_SCHEMAS_POPULATION_REGISTER.md)  
**Population Register (SPAR)**  
✅ **Complete** - 2 endpoints, 21 schemas, tested live, 23 test cases

### 4. [KODLISTOR_POPULATION_REGISTER.md](KODLISTOR_POPULATION_REGISTER.md)
**Population Register Code Lists**  
✅ **Complete** - 11 deregistration codes, 3 ID types, 25 counties, residence statuses, 23 test personnummer  
🚩 **Red Flag Rules:** FI/OB/AV = auto-reject, UNKNOWN residence = high risk

### 5. [API_SCHEMAS_COMPANY_INFORMATION.md](API_SCHEMAS_COMPANY_INFORMATION.md)
**Company Information API 2.0 (Företagsinformation)**  
✅ **Complete + Ready to Test** - 3 endpoints, 48 fields in Overview schema, 41 sandbox test cases  
📋 **Includes:** Status codes (50+), Legal Group codes (60+), SNI industry codes, employee intervals, KYC decision trees  
🧪 **Test Script:** `./test_company_information_api.sh` (43 tests: AB, EF, partnerships, associations, history, batch)

### 6. [KODLISTOR_COMPANY_INFORMATION.md](KODLISTOR_COMPANY_INFORMATION.md)
**Company Information Code Lists**  
✅ **Complete** - 50+ status codes (Active/Warning/Inactive/Deregistered), 60+ legal forms (AB/EF/HB/KB/OVR), SNI 2007 industry codes, employee intervals  
🚩 **Red Flag Rules:** Status 200+ = reject, 103/111/118/190 = critical risk, high-risk industries (finance, cash, real estate)

### 7. [BANK_ACCOUNT_API.md](BANK_ACCOUNT_API.md)
**Open Banking / PSD2 Integration**  
⚠️ **In Progress** - 7 endpoints documented, 2 tested, +2600 European banks available  
🧪 **Test Scripts:** `./test_bank_api.sh`, `./test_bank_auth_flow.sh`

### 8. [API_SCHEMAS_ROARING.md](API_SCHEMAS_ROARING.md)
**Roaring.io KYC/AML/Screening APIs - Remaining Endpoints**

Next priority endpoints to document:
- ⏳ Beneficial Owner (PML-kritisk)
- ⏳ Owner Structure
- ⏳ Board Members
- ⏳ Signatories
- ⏳ AML Registry
- ⏳ PEP (Politically Exposed Persons)
- ⏳ Sanctions List
- ⏳ Financial Information
- ⏳ Legal Information
- ⏳ Company Engagements
- ⏳ Risk Indicators
- ⏳ Company Rating
- ⏳ Property Information
- ⏳ Case Register
- ⏳ Establishments

**Status:** 1 of 15+ remaining endpoints documented

---

### 2. [BANK_ACCOUNT_API.md](BANK_ACCOUNT_API.md)
**Open Banking / PSD2 Integration**

Access +2600 European banks for real-time financial data:
- ✅ List available banks
- ✅ OAuth2 authentication flow
- ⏳ Account details
- ⏳ Transaction history
- ⏳ Balance information

**Sandbox Test Results (2025-10-23):**
- ✅ OAuth2 working
- ✅ 4 Swedish business banks available
- ✅ 60+ Swedish personal banks available
- ❌ `/aspsps_statuses` endpoint not in sandbox

**Test Script:** `./test_bank_api.sh`

---

## 🔐 Authentication

**OAuth2 Client Credentials Flow**

```bash
curl -X POST https://api.roaring.io/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials" \
  -d "client_id=1fc1c3bb-79d0-4b39-b541-70ef67c810a1" \
  -d "client_secret=c96cdfe6-84d8-477a-a872-ab93c6e89203"
```

**Response:**
```json
{
  "access_token": "d8ce667a-a0a5-49f6-8df0-b048eba5de6a",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

**Usage:**
```bash
curl -X GET https://api.roaring.io/... \
  -H "Authorization: Bearer {ACCESS_TOKEN}"
```

---

## 🎯 API Categories

### KYC/AML Screening (Background Checks)
- **No user consent required** (public registers)
- **Costs:** 500 API calls purchased
- **Use case:** Verify company officers, check sanctions/PEP, detect red flags

**Base URLs:**
- `/se/businessprohibition/1.0/`
- `/se/ownerstructure/1.0/`
- `/se/beneficialowner/1.0/`
- `/se/boardmembers/1.0/`
- etc.

---

### Bank Account Data (Open Banking)
- **Requires user consent** (PSD2 compliance)
- **Costs:** Separate pricing (TBD)
- **Use case:** Verify account ownership, analyze transactions, check balances

**Base URL:** `https://api.roaring.io/global/bank-account-data/1.0`

---

## 💰 Cost Optimization Strategy

### Current Allocation: 500 API Calls

**Minimum KYC Flow (12 calls per company):**
1. Business Prohibition (company) - 1 call
2. Owner Structure - 1 call
3. Beneficial Owner - 1 call
4. Board Members - 1 call
5. Signatories - 1 call
6. Per person checks (assume 3 persons):
   - Business Prohibition (person) - 3 calls
   - PEP - 3 calls
   - Sanctions - 1 call

**Total:** 12 calls = **~41 companies** with 500 calls

**Extended KYC Flow (20 calls per company):**
Add:
- AML Registry
- Risk Indicators
- Company Activity
- Company Rating
- Financial Information
- Case Register
- Property Information
- Share Facts

**Total:** 20 calls = **25 companies** with 500 calls

**Recommendation:** Start with minimum flow, add extended checks for högrisk companies only.

---

## 🚨 Red Flags (Auto-Reject)

Based on Penningtvättslagen requirements:

### Company Level
- ❌ `pagaendeAvveckling: "KK"` (Konkurs)
- ❌ Business Prohibition active
- ❌ Avregistrerad (unless recent)

### Person Level
- ❌ Näringsförbud active
- ❌ Sanctions list match
- ❌ PEP high-risk (unless proper due diligence)
- ❌ AML registry match

---

## 📁 Test Results

**Location:** `test_results/`

Generated files:
- `banks_business_se.json` - 4 Swedish business banks
- `banks_personal_se.json` - 60+ Swedish personal banks

---

## 🧪 Testing

### Quick Test: List Banks
```bash
./test_bank_api.sh
```

### Full Auth Flow Test (Mock ASPSP)
```bash
# Step 1: Create auth session
./test_bank_auth_flow.sh

# Step 2: Open auth URL in browser, complete authentication
# Copy authCode from redirect URL

# Step 3: Fetch account data
./get_account_data.sh <authCode>
```

### Expected Output
```
✅ OAuth2 Authentication: Working
✅ GET /banks/business: Working (4 banks)
✅ GET /banks/personal: Working (60 banks)
❌ GET /aspsps_statuses: Not Found (404)
⚠️  Account/Transaction endpoints require active session
```

---

## 📋 Next Steps

### Priority 1: Complete KYC Documentation
- [ ] Owner Structure endpoint
- [ ] Beneficial Owner endpoint
- [ ] Board Members endpoint
- [ ] Signatories endpoint
- [ ] Sanctions List endpoint
- [ ] PEP endpoint
- [ ] AML Registry endpoint

### Priority 2: Test KYC Endpoints
- [ ] Create test script with sandbox personnummer
- [ ] Verify response schemas
- [ ] Document sandbox test cases

### Priority 3: Bank API Full Flow
- [ ] Test Mock ASPSP authentication
- [ ] Get account details
- [ ] Get transactions
- [ ] Document actual response structures

### Priority 4: Backend Implementation
- [ ] Create FastAPI proxy layer
- [ ] Implement token caching
- [ ] Add cost tracking
- [ ] Implement red flag detection

---

## 📞 Support

**Sandbox Documentation:** https://docs.roaring.io/sandbox-testing  
**API Documentation:** https://api.roaring.io/docs  

**Issues:** Contact Roaring.io support with Client ID for sandbox questions.

---

## ⚠️ GDPR & Compliance

### KYC/AML APIs (No Consent Required)
- ✅ Public register data
- ✅ Legitimate interest under Penningtvättslagen
- ✅ Data retention: Store only risk assessment result, not raw data

### Bank Account API (Consent Required)
- ✅ Explicit user consent needed before redirect
- ✅ Max 90 days data retention (PSD2)
- ✅ User can revoke access anytime
- ✅ Inform user what data is collected and why

**Consent text template:** See BANK_ACCOUNT_API.md

---

## 📊 Integration Status

| API Category | Endpoints | Documented | Tested | Implemented |
|--------------|-----------|------------|--------|-------------|
| **Population Register (SPAR)** | 2 | ✅ 2/2 | ✅ 2/2 | ❌ 0/2 |
| **Business Prohibition** | 2 | ✅ 2/2 | ✅ 2/2 | ❌ 0/2 |
| **Company Information** | 3 | ✅ 3/3 | ✅ 3/3 | ❌ 0/3 |
| Beneficial Owner | 1 | ❌ 0/1 | ❌ 0/1 | ❌ 0/1 |
| Owner Structure | 1 | ❌ 0/1 | ❌ 0/1 | ❌ 0/1 |
| Board Members | 1 | ❌ 0/1 | ❌ 0/1 | ❌ 0/1 |
| Signatories | 1 | ❌ 0/1 | ❌ 0/1 | ❌ 0/1 |
| AML Registry | 1 | ❌ 0/1 | ❌ 0/1 | ❌ 0/1 |
| PEP | 1 | ❌ 0/1 | ❌ 0/1 | ❌ 0/1 |
| Sanctions | 1 | ❌ 0/1 | ❌ 0/1 | ❌ 0/1 |
| Financial Information | 1 | ❌ 0/1 | ❌ 0/1 | ❌ 0/1 |
| Legal Information | 1 | ❌ 0/1 | ❌ 0/1 | ❌ 0/1 |
| Bank Account | 7 | ✅ 7/7 | ⏳ 2/7 | ❌ 0/7 |
| **TOTAL** | **21+** | **14/21+** | **7/21+** | **0/21+** |

---

**Last Test:** 2025-10-23  
**Test Results:**
- ✅ Population Register: 3 live API calls (Jan Efternamn, Sven Svensson PEP, responseMode=1 fallback)
- ✅ Business Prohibition: 8 live API calls (all 6 sandbox test cases + company check + OAuth2)
  - Verified: Clean person, temporary prohibition, exemption (dispens), C/O address, foreign address
  - Key finding: freeText contains full court decision (200+ chars), exemptions are time-limited and role-specific
- ✅ Company Information: 10 live API calls - **ALL PASSED** (3 endpoints verified)
  - Test categories: AB standard, AB konkurs, EF standard, Inactive company, EF+PEP, Kommanditbolag, Ideell förening, Utländsk filial
  - History endpoint: Verified name changes (2 historical records found)
  - Batch endpoint: Verified batch lookup (2 found, 1 not found as expected)
  - **Key findings:**
    - Status [141] = Fusion avslutad (active company post-merger)
    - Status [291] = Konkurs avslutad (REJECT - deregistered)
    - Status [200] = Inaktivt (REJECT - inactive)
    - Status [100] = Aktivt (APPROVED - standard active)
    - EF with PEP: Marcus sportskola (active, has VAT & F-skatt)
    - Foreign branch: LOAN BANK BELGIUM (active, no VAT/F-skatt)
  - **Test script:** `./test_company_overview_simple.sh`

**Next Milestone:** 
1. Run `./test_company_information_api.sh` to verify all 43 sandbox companies (ETA: 5 min)
2. Document Beneficial Owner API (PML-kritisk för UBO identification)
3. Document Owner Structure + Board Members + Signatories (complete company representatives)
