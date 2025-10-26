# Business Prohibition API 1.0

**Status:** ⏳ Testing in progress  
**Version:** 1.0  
**Country:** Sweden (SE)  
**Priority:** 🔴 CRITICAL - Automatic rejection if active prohibition found

---

## Overview

Check for active business prohibitions (näringsförbud) against individuals or company representatives. This API provides detailed information on restrictions that prevent a person from engaging in business activities in Sweden.

**Legal basis:** Näringsförbudslagen (1986:436)

---

## Endpoints

### 1. Person Endpoint

**GET** `/se/businessprohibition/1.0/person/{personalNumber}`

Check if a specific individual has an active business prohibition.

**Path Parameters:**
- `personalNumber` (required, string) - Swedish personal number

**Response includes:**
- Court that issued the prohibition (see `SwedishCourts.json`)
- Duration of the prohibition (start/end dates)
- Reason for prohibition
- Case number
- Decision type (see `court_decision_codes.json`)
- Address information (including C/O and foreign addresses)
- Exemption information (if applicable)
- Free text notes

**Sandbox Examples:** See `sandbox_examples.json` → person section
- No prohibition: 198604069883
- With prohibition + temporary: 198503302393
- With exemptions: 192908187541
- With C/O address: 198208272396
- With foreign address: 194812161596

---

### 2. Company Endpoint

**GET** `/se/businessprohibition/1.0/company/{companyId}`

Check if any representatives of a company have had a business prohibition within a configurable timespan.

**Path Parameters:**
- `companyId` (required, string) - Swedish organization number

**Query Parameters:**
- `relationsHistoryYears` (optional, number, default: 2)
  - How many years back to look for related persons
  - Range: 0 to 5 years
  - 0 = only current relations
  - 5 = all prohibitions within last 5 years

**Roles checked:**
- Board members (styrelseledamöter)
- Beneficial owners (verkliga huvudmän)
- Alternative beneficial owners (alternativa verkliga huvudmän)

**Response includes:**
- Personal number of person with prohibition
- Role in company
- Prohibition details
- Relationship timespan

**Sandbox Examples:** See `sandbox_examples.json` → company section
- Company with board member prohibition: 5565002465

---

## Common Use Case

**Risk minimization:** Identify if a potential business partner or company representative has a business prohibition before entering into business relationships.

**Celestial integration:**
- Screen all board members during onboarding
- Screen all beneficial owners (UBO)
- Screen CEO and signatories
- **Action if match:** AUTOMATIC APPLICATION REJECTION

---

## Reference Data

- **SwedishCourts.json** - Complete lookup table of Swedish court codes (147 courts)
- **court_decision_codes.json** - Decision type codes (B = Beslut/Protocol, D = Dom/Judgement)
- **sandbox_examples.json** - Test data for sandbox environment

---

## Files in This Directory

- `README.md` - This file (API overview)
- `openapi.yaml` - OpenAPI specification
- `SwedishCourts.json` - Court codes lookup (147 courts)
- `court_decision_codes.json` - Decision type codes
- `sandbox_examples.json` - Sandbox test data
- `test_business_prohibition.py` - Test script (to be created)

---

## Testing Status

⏳ **Not yet tested** - Next endpoint to test after Establishments API  

## OpenAPI Specification

Se `openapi.yaml` i denna mapp för fullständig API spec.

## Quick Reference

- **Method:** GET
- **Auth:** OAuth2 Bearer token
- **Input:** Swedish personal number (personalNumber)
- **Output:** Prohibition status, period (from-to), reason, case number
- **Viktighet:** 🔴 CRITICAL för Celestial (aktivt näringsförbud = AUTOMATISK AVVISNING)
- **Åtgärd vid träff:** REJECT APPLICATION
- **Legal grund:** Näringsförbudslagen (1986:436)
- **Omfattar:** Person får inte vara styrelseledamot, VD, firmatecknare eller verklig huvudman
