# Roaring.io Establishments API v2.0

**Complete Reference Documentation for Celestial Integration**

Base URL: `https://api.roaring.io/se/company/establishment/2.0`  
Authentication: OAuth2 Client Credentials  
Country: Sweden (SE)  
Status: ✅ Tested and validated in sandbox

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Endpoint](#endpoint)
4. [Data Structures](#data-structures)
5. [Sandbox Testing](#sandbox-testing)
6. [Integration Guide for Celestial](#integration-guide-for-celestial)
7. [Error Handling](#error-handling)
8. [Cost Optimization](#cost-optimization)

---

## Overview

The Establishments API provides information about a company's **workplaces (Local Units)** across different geographical locations. Each establishment represents a physical location where the company conducts business.

### Key Information Retrieved

- **CFAR Number** (Company Establishment Number) - unique workplace identifier
- **Office Name** - workplace designation
- **Office Type** - Huvudkontor (head office) or Filial (branch)
- **Postal Address** - official mailing address
- **Visit Address** - physical location address
- **Contact Information** - phone, fax, email
- **Industry Code** - SNI/NACE code per establishment
- **Employee Count** - number of employees (interval)
- **Commercial Preferences** - marketing/advertising opt-in status

### PTL Compliance Context

Under 2 kap. 3-5 § PTL (Penningtvättslag), accountants must assess customer risk profiles. The Establishments API supports this by:

- **Address Verification**: Cross-validate against SPAR/Bolagsverket
- **Distance Relationship Detection**: Postal ≠ visit address = higher risk (PTL 2 kap. 5 §)
- **Business Complexity**: Multiple establishments = larger operations
- **CFAR Linkage**: Connect to Skatteverket F-skattsedel and VAT registrations
- **Geographic Risk**: Establishments in high-risk regions

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
GET https://api.roaring.io/se/company/establishment/2.0/{companyId}
Authorization: Bearer {access_token}
Accept: application/json
```

---

## Endpoint

### Get Establishments

**GET** `/{companyId}`

Retrieves all establishments (workplaces) for a company.

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `companyId` | string | path | Yes | Swedish organization number (e.g., "5564866803") |

#### Request Example

```bash
GET /5564866803
Authorization: Bearer {access_token}
Accept: application/json
```

#### Response: EstablishmentsResult

```json
{
  "changeDate": "2016-12-10",
  "companyId": "5564866803",
  "establishments": [
    {
      "companyEstablishmentNumber": "32083297",
      "officeName": "Aronfors Bygg och Teknik Aktiebolag",
      "officeType": "Huvudkontor",
      "numberEmployeesInterval": "0 anställda",
      "commercialBlockText": "Tar emot reklam",
      "industry": {
        "code": "41200",
        "text": "Byggentreprenör"
      },
      "address": {
        "address": "Box 49",
        "zipCode": "45521",
        "town": "Munkedal",
        "commune": "Munkedal",
        "communeCode": "30",
        "region": "Västra Götaland",
        "regionCode": "14"
      },
      "visitAddress": {
        "address": "Hededalsvägen 20",
        "zipCode": "45534",
        "town": "Munkedal",
        "commune": "Munkedal",
        "communeCode": "30",
        "region": "Västra Götaland",
        "regionCode": "14"
      },
      "contact": {
        "phoneNumber": "0524-12500"
      }
    }
  ],
  "status": {
    "code": 0,
    "text": "records found"
  }
}
```

**Status Codes:**
- `code: 0` - Establishments found
- `code: 1` - No establishments found

#### Use Cases

1. **Address Verification**: Compare API data with customer-provided addresses
2. **Multi-Location Tracking**: Identify all operational sites
3. **Contact Validation**: Verify phone numbers and email addresses
4. **Distance Relationship Detection**: Flag when postal ≠ visit address
5. **SNI Code Verification**: Cross-check industry classification

---

## Data Structures

### EstablishmentsResult

Top-level response object.

```typescript
interface EstablishmentsResult {
  changeDate: string;                // Date of last change (YYYY-MM-DD)
  companyId: string;                 // Organization number
  establishments: Establishment[];   // Array of establishments
  status: SearchResultStatus;        // Result status
}
```

### Establishment

Individual workplace record.

```typescript
interface Establishment {
  companyEstablishmentNumber: string;  // CFAR number (unique workplace ID)
  officeName: string;                  // Workplace name
  officeType: string;                  // "Huvudkontor" or "Filial"
  numberEmployeesInterval?: string;    // e.g., "0 anställda", "10-19 anställda", "50-99 anställda"
  commercialBlockText?: string;        // Marketing preferences
  industry?: Industry;                 // SNI/NACE code
  address?: Address;                   // Postal address
  visitAddress?: Address;              // Visit/delivery address
  contact?: Contact;                   // Contact information
}
```

### Industry

SNI/NACE industry classification.

```typescript
interface Industry {
  code: string;    // SNI code (e.g., "41200", "56100")
  text: string;    // Description (e.g., "Byggentreprenör", "Restaurang")
}
```

**Common SNI Codes:**
- `41200` - Byggentreprenör (construction)
- `42990` - Anläggningsarbete, övrigt (civil engineering)
- `56100` - Restaurang (restaurant)
- `64993` - Värdepapper, sluten förvaltning (securities management)
- `68204` - Bostadsrättsförening (tenant-owner association)

### Address

Structured address information.

```typescript
interface Address {
  coAddress?: string;       // C/O address
  address?: string;         // Street address or P.O. Box
  zipCode?: string;         // Postal code (e.g., "45521")
  town?: string;            // Town/city
  commune?: string;         // Municipality name
  communeCode?: string;     // Municipality code
  region?: string;          // County/region name
  regionCode?: string;      // County/region code
}
```

**Swedish Region Codes:**
- `1` - Stockholm
- `12` - Skåne
- `14` - Västra Götaland
- `80` - Multiple communes

### Contact

Contact information for establishment.

```typescript
interface Contact {
  phoneNumber?: string;   // Phone number
  faxNumber?: string;     // Fax number (rare)
  email?: string;         // Email address
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
  error: string;
  message: string;
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
  message: string;
}
```

---

## Sandbox Testing

### Test Credentials

Use your `roaring.ini` OAuth2 credentials (same as for other APIs).

### Sandbox Companies

| Company ID | Description | Establishments |
|------------|-------------|----------------|
| `5564866803` | Limited liability company (active, tax registered) | 1 |
| `9697715770` | Trading partnership (active) | 1 |
| `8394004322` | Non-profit association | 1 |
| `5592554108` | Limited liability company | **2** (head office + branch) |
| `5569994600` | Limited liability company (head office) | 1 |
| `7696053631` | Tenant-owner association | 1 |

### Running Tests

```bash
# Full sandbox test suite
python3 test_roaring_establishments.py --sandbox

# Get establishments for specific company
python3 test_roaring_establishments.py --company-id 5564866803

# Verbose output with raw JSON
python3 test_roaring_establishments.py --company-id 5564866803 --verbose

# Compare postal vs visit addresses
python3 test_roaring_establishments.py --company-id 5564866803 --compare-addresses
```

### Sandbox Test Results

✅ **Authentication:** OAuth2 working perfectly  
✅ **Single establishment:** Returns head office with complete data  
✅ **Multiple establishments:** Company 5592554108 has 2 (Huvudkontor + Filial)  
✅ **Address variations:** Postal ≠ visit in some cases  
✅ **Contact info:** Phone numbers present, email rarely populated  
✅ **Industry codes:** SNI codes consistent with business type  
✅ **Employee intervals:** Ranges like "0 anställda", "10-19 anställda", "50-99 anställda"

### Key Observations from Sandbox

1. **Office Types:**
   - `Huvudkontor` = Head office (always present)
   - `Filial` = Branch/subsidiary location

2. **Address Differences:**
   - Postal address often P.O. Box (`Box 49`)
   - Visit address physical location (`Hededalsvägen 20`)
   - **Risk indicator**: When postal ≠ visit (PTL 2 kap. 5 § distance relationship)

3. **C/O Addresses:**
   - Common for associations/small companies
   - Example: `C/O: Ingegärd Rayman` or `C/O: Fastighetsägarna Stockholm Ab`
   - May indicate **no physical office** (operated from accountant's address)

4. **Employee Intervals:**
   - `0 anställda` - No employees (owner-operated)
   - `1-4 anställda` - Micro business
   - `10-19 anställda` - Small business
   - `20-49 anställda` - Medium business
   - `50-99 anställda` - Larger business

5. **Commercial Block Text:**
   - `Tar emot reklam` - Accepts marketing
   - `Tar emot reklam, ej telefonnummerspärrat` - Accepts marketing, no phone block

6. **Visit Address Edge Cases:**
   - Some have incomplete visit addresses (only town, no street)
   - Example: `None Stockholm` indicates data quality issues

---

## Integration Guide for Celestial

### Workflow in Customer Onboarding

#### Step 1: Basic Company Data

Customer provides organization number → Celestial fetches from Bolagsverket API (SKTFP).

#### Step 2: Fetch Establishments

```python
# Fetch all establishments
result = roaring_api.get_establishments(customer_org_nr)

establishments = result['establishments']
head_office = [e for e in establishments if e['officeType'] == 'Huvudkontor'][0]
branches = [e for e in establishments if e['officeType'] == 'Filial']
```

#### Step 3: Cross-Validation

**Verify against customer-provided data:**

```python
def validate_addresses(establishments, customer_data):
    """
    Cross-validate establishment addresses with customer-provided data
    """
    head_office = establishments[0]  # Assuming first is head office
    
    postal_api = head_office['address']
    postal_customer = customer_data['postal_address']
    
    # Compare street
    if postal_api['address'] != postal_customer['street']:
        return {
            'valid': False,
            'reason': 'postal_address_mismatch',
            'api_value': postal_api['address'],
            'customer_value': postal_customer['street']
        }
    
    # Compare postal code
    if postal_api['zipCode'] != postal_customer['zip_code']:
        return {
            'valid': False,
            'reason': 'zip_code_mismatch',
            'api_value': postal_api['zipCode'],
            'customer_value': postal_customer['zip_code']
        }
    
    return {'valid': True}
```

#### Step 4: Risk Assessment

**Calculate risk factors from establishment data:**

```python
def assess_establishment_risk(establishments):
    """
    Analyze establishments for risk indicators
    """
    risk_factors = []
    
    for est in establishments:
        # Factor 1: Distance relationship (postal ≠ visit)
        postal = est.get('address', {})
        visit = est.get('visitAddress', {})
        
        if postal.get('address') and visit.get('address'):
            if postal['address'] != visit['address']:
                risk_factors.append({
                    'type': 'distance_relationship',
                    'severity': 'medium',
                    'cfar': est['companyEstablishmentNumber'],
                    'detail': 'Postal and visit addresses differ'
                })
        
        # Factor 2: C/O address (no physical office)
        if postal.get('coAddress'):
            risk_factors.append({
                'type': 'co_address',
                'severity': 'low',
                'cfar': est['companyEstablishmentNumber'],
                'detail': f"C/O address: {postal['coAddress']}"
            })
        
        # Factor 3: No contact information
        contact = est.get('contact', {})
        if not contact.get('phoneNumber') and not contact.get('email'):
            risk_factors.append({
                'type': 'no_contact',
                'severity': 'medium',
                'cfar': est['companyEstablishmentNumber'],
                'detail': 'No phone or email provided'
            })
        
        # Factor 4: Incomplete visit address
        if not visit.get('address') or visit.get('address') == 'None':
            risk_factors.append({
                'type': 'incomplete_data',
                'severity': 'low',
                'cfar': est['companyEstablishmentNumber'],
                'detail': 'Visit address missing or incomplete'
            })
    
    return risk_factors
```

#### Step 5: Adjust Risk Score

```python
def adjust_risk_score_establishments(base_score, establishments):
    """
    Adjust Celestial risk score based on establishment data
    """
    risk_factors = assess_establishment_risk(establishments)
    
    # Apply penalties
    penalty = 0
    
    for factor in risk_factors:
        if factor['type'] == 'distance_relationship':
            penalty += 5  # PTL 2 kap. 5 § indicator
        elif factor['type'] == 'co_address':
            penalty += 2  # Possible virtual office
        elif factor['type'] == 'no_contact':
            penalty += 3  # Difficult to reach
        elif factor['type'] == 'incomplete_data':
            penalty += 1  # Data quality issue
    
    # Multiple establishments = larger business (lower risk)
    if len(establishments) > 1:
        penalty -= 5  # Established multi-location business
    
    return base_score + penalty, risk_factors
```

### Use Case Examples

#### Example 1: Standard Single-Location Business

```json
{
  "establishments": [
    {
      "companyEstablishmentNumber": "32083297",
      "officeType": "Huvudkontor",
      "address": {"address": "Hededalsvägen 20", "zipCode": "45534"},
      "visitAddress": {"address": "Hededalsvägen 20", "zipCode": "45534"}
    }
  ]
}
```

**Analysis:** ✅ Low risk - postal = visit, single location, complete data.

#### Example 2: Virtual Office / C/O Address

```json
{
  "establishments": [
    {
      "companyEstablishmentNumber": "44204402",
      "officeType": "Huvudkontor",
      "address": {
        "coAddress": "Fastighetsägarna Stockholm Ab",
        "address": "Box 12871"
      },
      "visitAddress": {"town": "Stockholm"}
    }
  ]
}
```

**Analysis:** ⚠️ Medium risk - C/O address (possibly virtual office), incomplete visit address, operated through management company.

#### Example 3: Multi-Location Restaurant Chain

```json
{
  "establishments": [
    {
      "companyEstablishmentNumber": "66028226",
      "officeType": "Huvudkontor",
      "officeName": "Flippin' Burgers AB"
    },
    {
      "companyEstablishmentNumber": "54863584",
      "officeType": "Filial",
      "officeName": "Flipp side"
    }
  ]
}
```

**Analysis:** ✅ Lower risk - established business with multiple locations, indicative of growth and stability.

### Integration with Risk Engine v3.0

Add establishment risk factors to **crossValidation** component:

```python
# In Celestial Risk Engine
crossValidation = 0

# Base cross-validation (Bolagsverket vs. customer data)
if addresses_match:
    crossValidation += 10
if sni_codes_match:
    crossValidation += 10
if board_members_match:
    crossValidation += 10

# Establishment-specific adjustments
establishments = roaring_api.get_establishments(org_nr)
establishment_penalty, risk_factors = adjust_risk_score_establishments(0, establishments)

crossValidation -= establishment_penalty  # Apply penalty to cross-validation score

# Document in audit log
log_risk_assessment(
    component='crossValidation',
    source='Roaring Establishments API',
    risk_factors=risk_factors,
    adjustment=establishment_penalty
)
```

---

## Error Handling

### HTTP Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Process response |
| 400 | Bad Request | Check parameters (invalid org number) |
| 401 | Unauthorized | Refresh OAuth2 token |
| 404 | Not Found | Company doesn't exist |
| 500 | Server Error | Retry with exponential backoff |

### Application-Level Status

Check `status.code` even with HTTP 200:

```python
if response.status_code == 200:
    data = response.json()
    if data['status']['code'] == 0:
        # Establishments found
        establishments = data['establishments']
    else:
        # No establishments found (but valid company)
        print(f"No establishments: {data['status']['text']}")
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

---

## Cost Optimization

### Pricing Model (Estimate)

Roaring.io likely charges per API call. Optimize by:

### 1. Cache Aggressively

Establishment data changes infrequently (company moves, opens branches).

```python
# Cache for 90 days
establishments_cache = {
    'customer_id': str,
    'org_nr': str,
    'establishments_data': dict,
    'fetched_at': datetime,
    'expires_at': datetime  # fetched_at + 90 days
}
```

### 2. Trigger-Based Updates

Don't fetch on every login - only when:
- Initial onboarding
- Customer reports address change
- Annual review
- Risk re-assessment triggered by other factors

### 3. Batch Processing

Update existing customers during off-hours:

```python
def nightly_establishment_refresh():
    """
    Refresh establishments for customers with stale data
    """
    customers = db.query(Customer).filter(
        Customer.establishments_last_fetched < datetime.now() - timedelta(days=90)
    ).all()
    
    for customer in customers:
        try:
            establishments = roaring_api.get_establishments(customer.org_nr)
            db.update_establishments_cache(customer.id, establishments)
        except Exception as e:
            logger.error(f"Failed to refresh {customer.org_nr}: {e}")
```

### 4. Delta Detection

Compare new data with cached data to detect changes:

```python
def detect_establishment_changes(old_data, new_data):
    """
    Identify what changed since last fetch
    """
    changes = []
    
    old_cfars = {e['companyEstablishmentNumber'] for e in old_data['establishments']}
    new_cfars = {e['companyEstablishmentNumber'] for e in new_data['establishments']}
    
    # New establishments
    added = new_cfars - old_cfars
    if added:
        changes.append({
            'type': 'establishment_added',
            'cfars': list(added),
            'risk_impact': 'review_required'
        })
    
    # Closed establishments
    removed = old_cfars - new_cfars
    if removed:
        changes.append({
            'type': 'establishment_closed',
            'cfars': list(removed),
            'risk_impact': 'review_required'
        })
    
    # Address changes
    for old_est, new_est in zip(old_data['establishments'], new_data['establishments']):
        if old_est['address'] != new_est['address']:
            changes.append({
                'type': 'address_changed',
                'cfar': old_est['companyEstablishmentNumber'],
                'risk_impact': 'high'  # Address change = KYC update required
            })
    
    return changes
```

---

## PTL Compliance Documentation

### For Auditors

**Document the following:**

1. **Verification Attempts:**
   - Log all API calls with timestamps
   - Record which establishments were fetched

2. **Cross-Validation Results:**
   - Matches vs. discrepancies with customer data
   - Risk factors identified

3. **Address Analysis:**
   - Postal vs. visit address comparisons
   - C/O address implications

4. **Change Detection:**
   - When establishments added/removed
   - Address changes over time

```python
compliance_log.record(
    customer_id=customer.id,
    action='ESTABLISHMENTS_VERIFICATION',
    timestamp=datetime.now(),
    data={
        'establishments_count': len(establishments),
        'cfar_numbers': [e['companyEstablishmentNumber'] for e in establishments],
        'address_validation': 'PASSED',
        'risk_factors': risk_factors,
        'cross_validation_adjustment': adjustment
    }
)
```

---

## Summary

The Establishments API is **important for Celestial's KYC verification**:

✅ **Address Verification** - Cross-validate customer-provided data  
✅ **Distance Relationship Detection** - PTL 2 kap. 5 § risk indicator  
✅ **Business Complexity** - Multi-location tracking  
✅ **Contact Validation** - Phone/email verification  
✅ **CFAR Linkage** - Connect to Skatteverket systems

**Integration Priority:** MEDIUM - implement after Documents API, before PEP/Beneficial Owners.

**Next Steps:**
1. Test in production with real company IDs
2. Implement caching layer (90-day refresh cycle)
3. Build address comparison logic
4. Integrate with Risk Engine v3.0 (crossValidation component)
5. Create change detection monitoring

**Related Documentation:**
- `ROARING_SANCTIONS_LISTS_V3.md` (sanctions screening)
- `ROARING_COMPANY_DOCUMENTS_V1.md` (document verification)
- `metod_riskbedömning_kund_v3.tex` (risk methodology)

---

**Document Version:** 1.0  
**Last Updated:** 2025-10-25  
**Test Status:** ✅ Sandbox validated  
**Production Status:** ⏳ Pending production credentials
