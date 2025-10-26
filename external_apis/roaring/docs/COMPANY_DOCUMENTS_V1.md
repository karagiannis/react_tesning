# Roaring.io Company Documents API v1.0

**Complete Reference Documentation for Celestial Integration**

Base URL: `https://api.roaring.io/se/company/document/1.0`  
Authentication: OAuth2 Client Credentials  
Country: Sweden (SE)  
Status: ✅ Tested and validated in sandbox

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Document Types](#document-types)
4. [Endpoints](#endpoints)
5. [Data Structures](#data-structures)
6. [Sandbox Testing](#sandbox-testing)
7. [Integration Guide for Celestial](#integration-guide-for-celestial)
8. [Error Handling](#error-handling)
9. [Cost Optimization](#cost-optimization)

---

## Overview

The Company Documents API provides access to official company documents from Bolagsverket (Swedish Companies Registration Office). This is a **critical KYC component** for Celestial's onboarding process, enabling:

- **Verification of company information** (registreringsbevis)
- **Financial due diligence** (årsredovisningar)
- **Corporate governance validation** (bolagsordning, stämmoprotokoll)
- **Capitalization verification** (finansieringsplan)

### Key Features

- Access to 7 types of official Bolagsverket documents
- Temporary download URLs (no need to store large PDFs)
- Status indicators (available vs. secrecy/confidential)
- Filter by document type
- Document metadata (date, file type, ID)

### PTL Compliance Context

Under 2 kap. 3-5 § PTL (Penningtvättslag), accountants must assess customer risk profiles. The Company Documents API supports this by providing:

- **Cross-validation** of self-reported company data
- **Financial health indicators** from annual reports
- **Ownership structure** from registration certifications
- **Governance red flags** from meeting minutes

---

## Authentication

Uses **OAuth2 Client Credentials** flow (same as other Roaring.io APIs).

### Request Token

```bash
POST https://api.roaring.io/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&client_id={YOUR_CLIENT_ID}&client_secret={YOUR_CLIENT_SECRET}
```

### Response

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

### Using the Token

```bash
GET https://api.roaring.io/se/company/document/1.0/{companyId}
Authorization: Bearer {access_token}
Accept: application/json
```

**Token Validity:** 3600 seconds (1 hour). Implement token refresh logic.

---

## Document Types

| Document Type | Swedish Name | Description | Common Use Case |
|--------------|--------------|-------------|----------------|
| `REGISTRATION_CERTIFICATION` | Registreringsbevis | Official company registration certificate | Verify legal existence, ownership, board |
| `ANNUAL_REPORT` | Årsredovisning | Annual financial report | Financial due diligence, revenue verification |
| `INTERIM_REPORT` | Delårsrapport | Interim financial report | Recent financial performance |
| `MEETING_MINUTES` | Stämmoprotokoll | Shareholder meeting minutes | Governance decisions, ownership changes |
| `ARTICLES_OF_ASSOCIATION` | Bolagsordning (AB) | Articles for limited companies | Corporate structure, share classes |
| `ARTICLES_OF_ASSOCIATION_NONLIMITED` | Stadgar (ej AB) | Articles for non-limited companies | Structure for HB, KB, etc. |
| `FINANCIAL_PLAN` | Finansieringsplan | Financial plan (required for AB) | Capitalization verification |

### Document Status Codes

- **`available`**: Document can be fetched ✅
- **`secrecy`**: Document is confidential (cannot be fetched) 🔒

---

## Endpoints

### 1. List Documents

**GET** `/{companyId}`

Lists all available documents for a company. Optionally filter by document type.

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `companyId` | string | path | Yes | Swedish organization number (e.g., "5564779444") |
| `documentType` | array[string] | query | No | Filter by document types (can specify multiple) |

#### Query Examples

```bash
# List all documents
GET /5564779444

# List only annual reports
GET /5564779444?documentType=ANNUAL_REPORT

# List annual reports and registration certification
GET /5564779444?documentType=ANNUAL_REPORT&documentType=REGISTRATION_CERTIFICATION
```

#### Response: ListDocumentResult

```json
{
  "records": [
    {
      "companyId": "5564779444",
      "companyName": "Example AB",
      "documents": [
        {
          "id": "e3NyYzpTYW5kYm94LGlkOjEwMDF9Cg",
          "documentType": "ANNUAL_REPORT",
          "date": "2024-06-30",
          "status": "available",
          "fileType": "pdf"
        },
        {
          "id": "ZXhhbXBsZS1kb2MtaWQtMjAyMw",
          "documentType": "ARTICLES_OF_ASSOCIATION",
          "date": "2023-01-15",
          "status": "secrecy",
          "fileType": "pdf"
        }
      ]
    }
  ],
  "status": {
    "code": 0,
    "text": "document found"
  }
}
```

**Status Codes:**
- `code: 0` - Documents found
- `code: 1` - No documents found

#### Use Case

**Step 1 in Celestial flow:** List available documents to determine what can be fetched.

---

### 2. Fetch Registration Certification

**GET** `/{companyId}/registration_certification`

Fetches the company's registration certification (registreringsbevis) - the most comprehensive official document.

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `companyId` | string | path | Yes | Swedish organization number |

#### Response: OrderDocumentResult

```json
{
  "records": [
    {
      "companyId": "5564779444",
      "companyName": "Example AB",
      "documents": [
        {
          "id": "cmVnY2VydC1kb2MtaWQ",
          "documentType": "REGISTRATION_CERTIFICATION",
          "date": "2025-10-25",
          "downloadLink": {
            "url": "https://assets.roaring.io/production/company-documents/cmVnY2VydC1kb2MtaWQ/5564779444_registration_2025-10-25.pdf",
            "type": "pdf"
          }
        }
      ]
    }
  ],
  "status": {
    "code": 0,
    "text": "document found"
  }
}
```

**Download URL:** Temporary link to PDF file. Download within reasonable timeframe (likely 15-60 minutes, test in production).

#### Use Case

**Critical for KYC:** Registration certification contains:
- Complete ownership structure
- Board members with personal numbers
- Signatory rules (firmatecknare)
- Registered business activities (SNI codes)
- Share capital and classes

---

### 3. Fetch Annual Report

**GET** `/{companyId}/annual_report/{documentId}`

Fetches a specific annual report (årsredovisning).

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `companyId` | string | path | Yes | Swedish organization number |
| `documentId` | string | path | Yes | Document ID from `list_documents()` |

#### Example

```bash
# Step 1: List annual reports
GET /5564779444?documentType=ANNUAL_REPORT

# Response shows document ID
{
  "records": [{
    "documents": [{
      "id": "e3NyYzpTYW5kYm94LGlkOjEwMDF9Cg",
      "documentType": "ANNUAL_REPORT",
      "date": "2024-06-30",
      "status": "available"
    }]
  }]
}

# Step 2: Fetch the document
GET /5564779444/annual_report/e3NyYzpTYW5kYm94LGlkOjEwMDF9Cg

# Response includes downloadLink
{
  "records": [{
    "documents": [{
      "id": "e3NyYzpTYW5kYm94LGlkOjEwMDF9Cg",
      "date": "2024-06-30",
      "downloadLink": {
        "url": "https://assets.roaring.io/sandbox/company-documents/e3NyYzpTYW5kYm94LGlkOjEwMDF9Cg/5564779444_annual_report_2024-06-30.pdf",
        "type": "pdf"
      }
    }]
  }]
}
```

#### Response: OrderDocumentResult

Same structure as registration certification, with `documentType: "ANNUAL_REPORT"`.

#### Use Case

**Financial due diligence:**
- Verify reported revenue in onboarding questionnaire
- Check profit/loss trends
- Identify red flags (negative equity, going concern warnings)
- Compare to Fortnox bookkeeping data

---

### 4. Fetch Interim Report

**GET** `/{companyId}/interim_report/{documentId}`

Fetches interim financial report (delårsrapport). Same pattern as annual report.

#### Use Case

**Recent financial performance:** For companies with interim reports, provides more current data than last year's annual report.

---

### 5. Fetch Meeting Minutes

**GET** `/{companyId}/meeting_minutes/{documentId}`

Fetches shareholder meeting minutes (stämmoprotokoll).

#### Use Case

**Governance review:**
- Major decisions (new shares, ownership transfers)
- Board elections
- Dividend distributions
- Potential red flags for money laundering (unusual transactions)

---

### 6. Fetch Articles of Association (Limited Companies)

**GET** `/{companyId}/articles_of_association/{documentId}`

Fetches bolagsordning for aktiebolag (AB).

#### Use Case

**Corporate structure verification:**
- Share classes and voting rights
- Transfer restrictions (hembudsförbehåll)
- Special governance provisions

---

### 7. Fetch Articles of Association (Non-Limited)

**GET** `/{companyId}/articles_of_association_nonlimited/{documentId}`

Fetches stadgar for handelsbolag (HB), kommanditbolag (KB), etc.

#### Use Case

**Non-AB entity structure:** Verify governance for partnerships.

---

### 8. Fetch Financial Plan

**GET** `/{companyId}/financial_plan/{documentId}`

Fetches finansieringsplan (required for AB formation, shows capitalization).

#### Use Case

**Startup verification:** For new companies, confirms initial capital contributions and sources.

---

## Data Structures

### ListDocumentResult

Response for `GET /{companyId}` (list documents).

```typescript
interface ListDocumentResult {
  records: ListDocumentRecord[];
  status: SearchResultStatus;
}

interface ListDocumentRecord {
  companyId: string;        // Organization number
  companyName?: string;     // Company name (may be null in sandbox)
  documents: Document[];
}

interface Document {
  id: string;               // Base64-encoded document ID
  documentType: DocumentType;
  date: string;             // Document date (ISO format YYYY-MM-DD)
  status: "available" | "secrecy";
  fileType: string;         // e.g., "pdf"
}

type DocumentType = 
  | "ANNUAL_REPORT"
  | "INTERIM_REPORT"
  | "MEETING_MINUTES"
  | "REGISTRATION_CERTIFICATION"
  | "ARTICLES_OF_ASSOCIATION"
  | "ARTICLES_OF_ASSOCIATION_NONLIMITED"
  | "FINANCIAL_PLAN";
```

### OrderDocumentResult

Response for fetch endpoints (with download link).

```typescript
interface OrderDocumentResult {
  records: OrderDocumentRecord[];
  status: SearchResultStatus;
}

interface OrderDocumentRecord {
  companyId: string;
  companyName?: string;
  documents: OrderDocument[];
}

interface OrderDocument {
  id: string;
  documentType: DocumentType;
  date: string;
  downloadLink: DownloadLink;  // ⚠️ Only present if status was "available"
}

interface DownloadLink {
  url: string;     // Temporary URL to PDF file
  type: string;    // "pdf"
}
```

### SearchResultStatus

```typescript
interface SearchResultStatus {
  code: number;    // 0 = found, 1 = not found
  text: string;    // Human-readable description
}
```

### Error Responses

#### 400 Bad Request

```typescript
interface BadRequest {
  error: "BadRequest";
  message: "Required arguments are missing in the request";
  attributes?: RequestAttribute[];
}

interface RequestAttribute {
  attribute: string;   // Parameter name
  value: string;       // Invalid value
}
```

#### 404 Not Found

No body, just status code 404.

#### 500 Internal Server Error

```typescript
interface ServerError {
  error: "InternalServerError";
  message: "An internal server error occurred, please contact the system administrator with information on the error";
}
```

---

## Sandbox Testing

### Test Credentials

Use your `roaring.ini` OAuth2 credentials (same as for Sanctions Lists API).

### Sandbox Company

**Company ID:** `5564779444`

Available documents in sandbox (as of 2025-10-25):
- ✅ 1 × ANNUAL_REPORT (2024-06-30)
- ❌ No registration certification
- ❌ No other document types

### Running Tests

```bash
# Full sandbox test suite
python3 test_roaring_documents.py --sandbox

# List documents for specific company
python3 test_roaring_documents.py --list --company-id 5564779444

# List only annual reports
python3 test_roaring_documents.py --list --company-id 5564779444 --filter ANNUAL_REPORT

# Fetch registration certification
python3 test_roaring_documents.py --cert --company-id 5564779444

# Fetch annual report (get documentId from list first)
python3 test_roaring_documents.py --annual-report --company-id 5564779444 --doc-id e3NyYzpTYW5kYm94LGlkOjEwMDF9Cg
```

### Sandbox Test Results

✅ **Authentication:** OAuth2 working perfectly  
✅ **List documents:** Returns 1 annual report  
✅ **Filter by type:** Correctly filters to ANNUAL_REPORT only  
✅ **Fetch annual report:** Returns download URL  
❌ **Registration certification:** Not available in sandbox (code 1)  
❌ **Other documents:** Not present in test data

### Example Response (Sandbox)

See `roaring_documents_example_annual_report.json` for complete structure.

**Key observations:**
- `companyName` is `null` in sandbox
- Document IDs are base64-encoded
- Download URLs point to `assets.roaring.io/sandbox/company-documents/`
- Status code 0 = success, 1 = not found

---

## Integration Guide for Celestial

### Workflow in Customer Onboarding

#### Step 1: Basic Company Data Collection

Customer provides organization number → Celestial fetches from Bolagsverket API (SKTFP).

#### Step 2: Document Discovery

```python
# List available documents
result = roaring_api.list_documents(company_id=customer_org_nr)

documents = result['records'][0]['documents']
annual_reports = [d for d in documents if d['documentType'] == 'ANNUAL_REPORT']
registration_cert = [d for d in documents if d['documentType'] == 'REGISTRATION_CERTIFICATION']
```

#### Step 3: Priority Fetching

**High Priority (always fetch if available):**
1. **Registration Certification** - Complete ownership/board data
2. **Latest Annual Report** - Financial verification

**Medium Priority (fetch if needed for risk assessment):**
3. **Articles of Association** - For complex ownership structures
4. **Meeting Minutes** - If governance concerns flagged

**Low Priority (optional):**
5. **Financial Plan** - Only for very new companies
6. **Interim Reports** - If annual report is outdated

#### Step 4: Fetch and Store

```python
# Fetch registration certification
reg_cert_result = roaring_api.fetch_registration_certification(company_id)
download_url = reg_cert_result['records'][0]['documents'][0]['downloadLink']['url']

# Download PDF
pdf_response = requests.get(download_url)
pdf_bytes = pdf_response.content

# Store in Celestial database or cloud storage
store_document(
    customer_id=customer.id,
    document_type='REGISTRATION_CERTIFICATION',
    file_data=pdf_bytes,
    document_date=reg_cert_result['records'][0]['documents'][0]['date']
)
```

#### Step 5: Cross-Validation

Compare fetched documents with customer-provided data:

- **Revenue verification:** Annual report revenue vs. questionnaire
- **Board members:** Registration cert vs. declared signatories
- **Ownership structure:** Registration cert vs. beneficial owners
- **SNI codes:** Registration cert vs. business description

**Red flags triggering manual review:**
- Revenue mismatch > 20%
- Undeclared beneficial owners
- Board members not in SPAR/PEP databases
- Recent ownership changes (< 6 months)

### Error Handling Strategy

```python
def fetch_document_safely(company_id, doc_type, doc_id=None):
    """
    Wrapper with error handling for document fetching
    """
    try:
        if doc_type == 'REGISTRATION_CERTIFICATION':
            result = roaring_api.fetch_registration_certification(company_id)
        else:
            result = roaring_api.fetch_annual_report(company_id, doc_id)
        
        status_code = result['status']['code']
        
        if status_code == 0:
            # Success - document available
            return {
                'success': True,
                'download_url': result['records'][0]['documents'][0]['downloadLink']['url'],
                'document_date': result['records'][0]['documents'][0]['date']
            }
        elif status_code == 1:
            # Document not found
            return {
                'success': False,
                'reason': 'not_found',
                'fallback': 'Manual document upload required'
            }
        else:
            # Unknown status
            return {
                'success': False,
                'reason': 'unknown_status',
                'status_code': status_code
            }
    
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 404:
            return {'success': False, 'reason': 'company_not_found'}
        elif e.response.status_code == 403:
            return {'success': False, 'reason': 'secrecy'}  # Confidential
        else:
            return {'success': False, 'reason': 'http_error', 'status': e.response.status_code}
    
    except Exception as e:
        logger.error(f"Document fetch error: {e}")
        return {'success': False, 'reason': 'exception', 'error': str(e)}
```

### Handling "Secrecy" Status

When document status is `"secrecy"`:

1. **Log the restriction:** Record that document is confidential
2. **Request manual upload:** Ask customer to provide document directly
3. **Increase risk score:** Inability to verify = higher risk
4. **Document rationale:** PTL compliance requires attempted verification

```python
if document['status'] == 'secrecy':
    # Cannot fetch - request from customer
    send_document_request_email(
        customer_email=customer.email,
        document_type=document['documentType'],
        reason='Bolagsverket has marked this document as confidential'
    )
    
    # Adjust risk assessment
    risk_assessment.add_note(
        'Unable to verify via Roaring.io (secrecy status)',
        impact='crossValidation -5 points'
    )
```

### Cost Optimization

**API calls are likely priced per fetch.** Optimize:

1. **Cache documents:** Store in database, don't re-fetch for 30 days
2. **List before fetch:** Always call `list_documents()` first to check availability
3. **Prioritize:** Fetch only high-priority documents initially
4. **Batch processing:** For existing customers, update documents during off-hours

```python
# Check if we already have a recent copy
last_fetch = db.get_last_document_fetch(customer.id, 'ANNUAL_REPORT')

if last_fetch and (datetime.now() - last_fetch.timestamp).days < 30:
    # Use cached version
    document = db.get_cached_document(customer.id, 'ANNUAL_REPORT')
else:
    # Fetch new version
    document = roaring_api.fetch_annual_report(customer.org_nr, doc_id)
    db.cache_document(customer.id, 'ANNUAL_REPORT', document)
```

### PTL Compliance Documentation

**For auditors, document:**

1. **Verification attempts:** Log all `list_documents()` and fetch calls
2. **Results:** What was available, what was fetched, what was confidential
3. **Cross-validation findings:** Matches vs. discrepancies
4. **Fallback procedures:** When manual upload was required

```python
compliance_log.record(
    customer_id=customer.id,
    action='DOCUMENT_VERIFICATION',
    timestamp=datetime.now(),
    data={
        'available_documents': [d['documentType'] for d in documents],
        'fetched_documents': ['REGISTRATION_CERTIFICATION', 'ANNUAL_REPORT'],
        'cross_validation_result': 'PASSED',
        'discrepancies': []
    }
)
```

---

## Error Handling

### HTTP Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Process response |
| 400 | Bad Request | Check parameters (invalid org number, missing documentId) |
| 401 | Unauthorized | Refresh OAuth2 token |
| 404 | Not Found | Company or document doesn't exist |
| 500 | Server Error | Retry with exponential backoff, contact Roaring support |

### Application-Level Status

Even with HTTP 200, check `status.code`:

- **0**: Document found ✅
- **1**: Document not found ❌

```python
if response.status_code == 200:
    data = response.json()
    if data['status']['code'] == 0:
        # Success
        download_url = data['records'][0]['documents'][0]['downloadLink']['url']
    else:
        # Not found (but valid request)
        print(f"Document not available: {data['status']['text']}")
```

### Retry Logic

```python
import time

def fetch_with_retry(func, max_retries=3):
    """Exponential backoff retry"""
    for attempt in range(max_retries):
        try:
            return func()
        except requests.exceptions.RequestException as e:
            if attempt == max_retries - 1:
                raise
            wait_time = 2 ** attempt  # 1s, 2s, 4s
            time.sleep(wait_time)
```

### Token Expiration

```python
class RoaringDocumentsAPI:
    def __init__(self):
        self.access_token = None
        self.token_expires_at = None
    
    def ensure_authenticated(self):
        """Re-authenticate if token expired"""
        if not self.access_token or datetime.now() >= self.token_expires_at:
            self.authenticate()
    
    def authenticate(self):
        """Get new OAuth2 token"""
        response = requests.post(...)  # OAuth2 flow
        token_data = response.json()
        self.access_token = token_data['access_token']
        self.token_expires_at = datetime.now() + timedelta(seconds=token_data['expires_in'] - 60)
```

---

## Cost Optimization

### Pricing Model (Estimate)

Roaring.io likely charges per API call:
- **List documents:** Low cost (metadata only)
- **Fetch document:** Higher cost (generates download link)
- **Download:** Bandwidth charges possible

**Optimization strategies:**

### 1. Cache Aggressively

```python
# Database schema
documents_cache = {
    'customer_id': str,
    'document_type': str,
    'document_id': str,
    'file_data': bytes,  # PDF content
    'document_date': date,
    'fetched_at': datetime,
    'expires_at': datetime  # fetched_at + 30 days
}

def get_document(customer_id, doc_type):
    """Get from cache if fresh, else fetch"""
    cached = db.query(documents_cache).filter(
        customer_id=customer_id,
        document_type=doc_type,
        expires_at > datetime.now()
    ).first()
    
    if cached:
        return cached.file_data
    else:
        # Fetch from Roaring.io
        return fetch_and_cache(customer_id, doc_type)
```

### 2. List Before Fetch

Always call `list_documents()` first to:
- Check if document exists
- Verify it's not under secrecy
- Get the correct document ID

This avoids wasted fetch calls for unavailable documents.

### 3. Batch Processing

For periodic updates of existing customers:

```python
def update_annual_reports_batch():
    """Nightly job to refresh annual reports"""
    customers = db.get_customers_needing_document_refresh()
    
    for customer in customers:
        try:
            # Check if new annual report available
            docs = roaring_api.list_documents(customer.org_nr)
            latest_report = get_latest_annual_report(docs)
            
            if latest_report and latest_report['date'] > customer.last_annual_report_date:
                # New report available - fetch it
                fetch_and_store(customer, latest_report)
        except Exception as e:
            logger.error(f"Batch update failed for {customer.org_nr}: {e}")
            continue
```

### 4. Progressive Fetching

Don't fetch all document types upfront:

**Phase 1 (automatic):**
- Registration certification
- Latest annual report

**Phase 2 (if risk assessment flags concerns):**
- Articles of association
- Meeting minutes

**Phase 3 (manual review):**
- Interim reports
- Financial plans

### 5. Monitor API Usage

```python
api_usage_log = {
    'date': date,
    'endpoint': str,
    'company_id': str,
    'customer_id': str,
    'response_time': float,
    'success': bool
}

def track_api_call(func):
    """Decorator to log API usage"""
    def wrapper(*args, **kwargs):
        start_time = time.time()
        try:
            result = func(*args, **kwargs)
            success = True
        except Exception as e:
            success = False
            raise
        finally:
            db.log_api_usage(
                endpoint=func.__name__,
                response_time=time.time() - start_time,
                success=success
            )
        return result
    return wrapper
```

---

## Appendix: Document ID Format

Document IDs appear to be **base64-encoded** metadata:

```python
import base64

doc_id = "e3NyYzpTYW5kYm94LGlkOjEwMDF9Cg"
decoded = base64.b64decode(doc_id).decode('utf-8')
print(decoded)  # {src:Sandbox,id:1001}
```

**Do not attempt to construct document IDs manually.** Always get them from `list_documents()` response.

---

## Summary

The Company Documents API is **essential for Celestial's KYC compliance** under PTL. It provides:

✅ **Automated verification** of company data (vs. manual document requests)  
✅ **Cross-validation** capabilities (self-reported vs. official data)  
✅ **Financial due diligence** (annual reports for revenue verification)  
✅ **Governance oversight** (ownership, board, signatories)

**Integration Priority:** HIGH - implement after Sanctions Lists API.

**Next Steps:**
1. Test in production with real company IDs
2. Implement caching layer
3. Build cross-validation logic
4. Create fallback for "secrecy" documents (manual upload)
5. Integrate with Risk Engine v3.0 (crossValidation component)

**Related Documentation:**
- `ROARING_SANCTIONS_LISTS_V3.md` (sanctions screening)
- `metod_riskbedömning_kund_v3.tex` (risk methodology)
- `API_Endpoints_ContentSlides.tex` (full Celestial API spec)

---

**Document Version:** 1.0  
**Last Updated:** 2025-10-25  
**Test Status:** ✅ Sandbox validated  
**Production Status:** ⏳ Pending production credentials
