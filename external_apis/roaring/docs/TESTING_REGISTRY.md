# Roaring.io API Testing Registry

**Central register för alla Roaring.io endpoints testade i Celestial-projektet**

Last Updated: 2025-10-25  
Environment: Sandbox  
Status: 🟢 Active Testing

---

## Översikt

Detta dokument är det **centrala registret** för alla Roaring.io API-tester. Använd detta som first stop för att se:
- Vilka endpoints som testats
- Testresultat och status
- Var dokumentation finns
- Vilka testskript som finns
- Nästa steg

---

## Testing Status Summary

| Status | Count | Description |
|--------|-------|-------------|
| ✅ Complete | 4 | Fully tested, documented, sandbox validated |
| ⏳ In Progress | 1 | Testing started, pending documentation |
| 📋 Planned | ~24 | Not yet tested |

---

## Tested Endpoints

### ✅ 1. Authentication (OAuth2)

**Status:** ✅ Complete  
**API Version:** N/A  
**Base URL:** `https://api.roaring.io/token`  
**Test Script:** All `test_roaring_*.py` files  
**Documentation:** Included in each endpoint doc  
**Sandbox Test:** ✅ Working (3600s token expiry)

**Key Findings:**
- OAuth2 Client Credentials flow working perfectly
- Token expires in 1 hour (3600s)
- Same credentials work for all endpoints
- No refresh token needed (request new token when expired)

**Integration Notes:**
- Implement token caching with expiry tracking
- Re-authenticate automatically when token expires
- Single credentials file: `roaring.ini`

---

### ✅ 2. KYC Questions & Answers API v1.0

**Status:** ✅ Complete (determined NOT RELEVANT for Celestial)  
**API Version:** 1.0  
**Base URL:** `https://api.roaring.io/global/kyc/1.0`  
**Test Script:** `test_roaring_kyc.py`  
**Documentation:** Inline in test script (no markdown - not relevant)  
**Sandbox Test:** ✅ Working (empty responses expected)

**Endpoints Tested:**
- `GET /company/templates` - List company KYC templates
- `GET /company/questions` - Get company KYC questions
- `GET /person/templates` - List person KYC templates
- `GET /person/questions` - Get person KYC questions

**Key Findings:**
- Purpose: Compliance training platform (PTL 2 kap. 14 § fortlöpande utbildning)
- Use case: PWC/KPMG creating internal staff training quizzes
- Sandbox returns empty responses (customers create their own content)
- **Conclusion:** NOT needed for Celestial customer onboarding

**Integration Notes:**
- Skip this endpoint - not relevant for our use case
- Keep test script for reference only

---

### ✅ 3. Sanctions Lists API v3.0

**Status:** ✅ Complete  
**API Version:** 3.0  
**Base URL:** `https://api.roaring.io/global/sanctions-lists/3.0`  
**Test Script:** `test_roaring_sanctions.py`  
**Documentation:** `docs/API_INTEGRATION/ROARING_SANCTIONS_LISTS_V3.md` (22KB)  
**Sandbox Test:** ✅ Fully validated

**Endpoints Tested:**
- `POST /search` - Search sanctions lists
- `GET /{referenceNumber}` - Get specific sanction record

**Key Findings:**
- **MANDATORY** for PTL compliance
- Screens 5 lists: EU, OFAC (USA), UN, UK OFSI, Swiss SECO
- 3 discriminated response types (EU/OFAC/UN, UK, Swiss)
- Fuzzy matching with configurable distance
- Search by: name, birthDate, gender, country, entityType
- Sandbox test data: "Ztarz" (5 hits), "Kalle Kallesson" (4 hits), "Lars Andersson" (0 hits)

**Integration Priority:** 🔴 **CRITICAL**  
Must screen: beneficial owners, board members, signatories, CEO  
Match = immediate rejection (legally prohibited)

**Sandbox Examples:**
- `roaring_sanctions_example_ztarz.json` (23KB)

---

### ✅ 4. Company Documents API v1.0

**Status:** ✅ Complete  
**API Version:** 1.0  
**Base URL:** `https://api.roaring.io/se/company/document/1.0`  
**Test Script:** `test_roaring_documents.py`  
**Documentation:** `docs/API_INTEGRATION/ROARING_COMPANY_DOCUMENTS_V1.md` (26KB)  
**Sandbox Test:** ✅ Fully validated

**Endpoints Tested:**
- `GET /{companyId}` - List available documents
- `GET /{companyId}/registration_certification` - Fetch registreringsbevis
- `GET /{companyId}/annual_report/{documentId}` - Fetch årsredovisning
- `GET /{companyId}/interim_report/{documentId}` - Fetch delårsrapport
- `GET /{companyId}/meeting_minutes/{documentId}` - Fetch stämmoprotokoll
- `GET /{companyId}/articles_of_association/{documentId}` - Fetch bolagsordning
- `GET /{companyId}/articles_of_association_nonlimited/{documentId}` - Fetch stadgar
- `GET /{companyId}/financial_plan/{documentId}` - Fetch finansieringsplan

**Key Findings:**
- Documents NOT returned as bytes - get temporary download URL instead
- Two-step process: list → fetch → download PDF
- Status codes: "available" (can fetch) vs "secrecy" (confidential)
- Document types: 7 official Bolagsverket documents
- Successfully downloaded PDF from sandbox (36KB test document)

**Integration Priority:** 🔴 **CRITICAL**  
Essential for KYC: registreringsbevis, årsredovisning  
Cross-validate revenue, ownership, board composition

**Sandbox Examples:**
- `sandbox_annual_report_5564779444.pdf` (36KB)
- `roaring_documents_example_annual_report.json`

---

### ✅ 5. Establishments API v2.0

**Status:** ✅ Complete  
**API Version:** 2.0  
**Base URL:** `https://api.roaring.io/se/company/establishment/2.0`  
**Test Script:** `test_roaring_establishments.py`  
**Documentation:** `docs/API_INTEGRATION/ROARING_ESTABLISHMENTS_V2.md` (31KB)  
**Sandbox Test:** ✅ Fully validated (6 test companies)

**Endpoints Tested:**
- `GET /{companyId}` - Get all establishments (workplaces)

**Key Findings:**
- CFAR number (Company establishment number) per workplace
- Huvudkontor (head office) vs Filial (branch)
- Postal address ≠ visit address = PTL risk indicator
- C/O addresses indicate virtual office
- SNI codes per establishment
- Employee count intervals
- Contact info (phone, fax, email)
- Multiple test cases: 1-6 establishments tested

**Integration Priority:** 🟡 **IMPORTANT**  
Address verification, distance relationship detection, CFAR linkage to Skatteverket

**Sandbox Examples:**
- `roaring_establishments_example_multi.json` (2 establishments)

---

### ⏳ 6. Beneficial Owners API

**Status:** ⏳ In Progress (tested via `test_roaring_endpoints.py`, needs dedicated test script)  
**API Version:** Unknown  
**Base URL:** Unknown  
**Test Script:** `test_roaring_endpoints.py` (line 22: `--endpoint beneficial_owners`)  
**Documentation:** ❌ Not yet created  
**Sandbox Test:** ⏳ Partially tested

**Key Information Needed:**
- Exact endpoint URL
- Request/response schemas
- Sandbox test data availability
- Version number

**Integration Priority:** 🔴 **CRITICAL**  
4 kap. PTL requirement - must identify verkliga huvudmän

**Next Steps:**
1. Extract beneficial owners logic from `test_roaring_endpoints.py`
2. Review existing test results
3. Get OpenAPI spec
4. Create dedicated test script
5. Write comprehensive markdown documentation

---

## Planned Endpoints (Not Yet Tested)

### High Priority (PTL Compliance)

| Endpoint | Priority | PTL Requirement | Status |
|----------|----------|-----------------|--------|
| **PEP Screening** | 🔴 Critical | 2 kap. 5 § | 📋 Planned |
| **Beneficial Owners** | 🔴 Critical | 4 kap. | ⏳ In Progress |
| **Business Prohibition** | 🔴 Critical | Automatic reject | 📋 Planned |

### Medium Priority (Risk Assessment)

| Endpoint | Priority | Use Case | Status |
|----------|----------|----------|--------|
| **Company Information** | 🟡 Important | Basic verification | 📋 Planned |
| **Board Members** | 🟡 Important | Governance | 📋 Planned |
| **Signatories** | 🟡 Important | Authorization | 📋 Planned |
| **Credit Information** | 🟡 Important | Financial stability | 📋 Planned |
| **Financial Data** | 🟡 Important | Revenue verification | 📋 Planned |

### Low Priority (Nice to Have)

| Endpoint | Priority | Use Case | Status |
|----------|----------|----------|--------|
| **Company Relations** | 🟢 Optional | Ownership structure | 📋 Planned |
| **Industry Classification** | 🟢 Optional | SNI validation | 📋 Planned |
| **Historical Data** | 🟢 Optional | Trends | 📋 Planned |

---

## Test Scripts Inventory

| Script | Purpose | Lines | Status |
|--------|---------|-------|--------|
| `test_roaring_kyc.py` | KYC Q&A API | ~200 | ✅ Complete |
| `test_roaring_sanctions.py` | Sanctions Lists | ~668 | ✅ Complete |
| `test_roaring_documents.py` | Company Documents | ~683 | ✅ Complete |
| `test_roaring_establishments.py` | Establishments | ~496 | ✅ Complete |
| `test_roaring_endpoints.py` | Multi-endpoint suite | ~689 | ⏳ Legacy (needs refactor) |

**Total:** 5 test scripts, ~2,736 lines of test code

---

## Documentation Inventory

| Document | Size | Last Updated | Completeness |
|----------|------|--------------|--------------|
| `ROARING_SANCTIONS_LISTS_V3.md` | 22KB | 2025-10-25 | ✅ Complete |
| `ROARING_COMPANY_DOCUMENTS_V1.md` | 26KB | 2025-10-25 | ✅ Complete |
| `ROARING_ESTABLISHMENTS_V2.md` | 31KB | 2025-10-25 | ✅ Complete |
| `ROARING_TESTING_REGISTRY.md` (this file) | ~15KB | 2025-10-25 | ✅ Complete |

**Total:** 4 markdown documents, ~94KB of documentation

---

## Sandbox Test Data

### Available Companies

| Company ID | Description | Used For |
|------------|-------------|----------|
| `5564779444` | Limited liability company | Documents (1 annual report) |
| `5564866803` | AB, active, tax registered | Establishments (1 location) |
| `9697715770` | Trading partnership | Establishments (1 location) |
| `8394004322` | Non-profit association | Establishments (1 location) |
| `5592554108` | AB with multiple locations | Establishments (2 locations) |
| `5569994600` | AB, head office | Establishments (1 location) |
| `7696053631` | Tenant-owner association | Establishments (1 location) |

### Sandbox Persons (for testing)

| Name | Birth Date | Expected Result |
|------|------------|-----------------|
| Ztarz | N/A | 5 sanctions hits (all lists) |
| Kalle Kallesson | 1952 | 4 sanctions hits (EU, OFAC, CHSECO, UKOFSI) |
| Lars Andersson | N/A | 0 sanctions hits (clean) |
| Sven Svensson | 1931-02-26 | 1 sanctions hit (EU) |

---

## Integration Roadmap for Celestial

### Phase 1: Core KYC (Current)
- ✅ Sanctions screening
- ✅ Document verification
- ✅ Address validation
- ⏳ Beneficial owners identification

### Phase 2: Risk Assessment
- 📋 PEP screening
- 📋 Business prohibition check
- 📋 Credit information
- 📋 Board member verification

### Phase 3: Enhanced Due Diligence
- 📋 Company relations mapping
- 📋 Historical financial data
- 📋 Industry benchmarking

---

## Common Patterns Across APIs

### Authentication
All endpoints use OAuth2 Client Credentials:
```python
client_id, client_secret, token_url = get_oauth2_credentials()
# Token expires in 3600s (1 hour)
```

### Response Structure
Consistent pattern:
```json
{
  "records": [...],
  "status": {
    "code": 0,  // 0 = found, 1 = not found
    "text": "description"
  }
}
```

### Error Handling
Standard HTTP codes:
- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized (token expired)
- `404` - Not Found
- `500` - Server Error

---

## Cost Optimization Strategy

### Caching Recommendations

| Endpoint | Cache Duration | Rationale |
|----------|----------------|-----------|
| Sanctions Lists | Real-time | Lists updated daily, must be current |
| Company Documents | 30 days | Documents change infrequently |
| Establishments | 90 days | Locations rarely change |
| Beneficial Owners | 30 days | Ownership changes require KYC update |
| PEP Status | 7 days | Political positions change |

### API Call Priorities

1. **Always call:**
   - Sanctions screening (legal requirement)
   - Beneficial owners (PTL 4 kap.)

2. **Call on onboarding:**
   - Registration certification
   - Latest annual report
   - Establishments

3. **Call on demand:**
   - Other documents (meeting minutes, etc.)
   - Historical data

---

## Next Steps

### Immediate (This Week)
1. ✅ Create this registry document
2. 🔄 Extract beneficial owners logic from `test_roaring_endpoints.py`
3. 📋 Get beneficial owners OpenAPI spec
4. 📋 Create dedicated beneficial owners test script
5. 📋 Document beneficial owners API

### Short-Term (Next 2 Weeks)
1. 📋 Test PEP screening API
2. 📋 Test business prohibition API
3. 📋 Test company information API
4. 📋 Create consolidated Roaring.io integration module

### Long-Term (Next Month)
1. 📋 Complete all high-priority endpoints
2. 📋 Build unified Roaring.io wrapper class
3. 📋 Implement caching layer
4. 📋 Integration with Celestial Risk Engine v3.0

---

## Related Documentation

### Internal Docs
- `docs/Theory/metod_riskbedömning_kund_v3.tex` - Risk methodology
- `latex/API_Endpoints_ContentSlides.tex` - Celestial API spec
- `docs/API_INTEGRATION/API_STATUS.md` - Overall API status

### External Docs
- Roaring.io Developer Portal: https://developer.roaring.io
- PTL (Penningtvättslag): https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/penningtvattslag-2017630_sfs-2017-630/

---

## Lessons Learned

### What Worked Well
1. ✅ Methodical approach: documentation → spec → test → markdown
2. ✅ Comprehensive test scripts with sandbox validation
3. ✅ Detailed markdown documentation with integration guides
4. ✅ Parallel testing of multiple sandbox companies
5. ✅ Real PDF download validation

### Areas for Improvement
1. ⚠️ Need central registry earlier (this document should have been first)
2. ⚠️ `test_roaring_endpoints.py` became too large (needs refactor)
3. ⚠️ Should track API versions more explicitly
4. ⚠️ Need automated test suite runner for all endpoints

### Best Practices Established
1. ✅ Always get OpenAPI spec before writing test code
2. ✅ Create dedicated test script per endpoint group
3. ✅ Include CLI with extensive options
4. ✅ Save example responses as JSON files
5. ✅ Document PTL compliance context in each doc

---

**Document Owner:** Celestial Development Team  
**Review Frequency:** Updated after each new endpoint test  
**Version:** 1.0
