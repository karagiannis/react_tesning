# Roaring.io API Module

**Self-contained module for all Roaring.io integrations**

---

## Quick Start

```bash
# Navigate to module
cd external_apis/roaring

# Run all tests
cd tests
python3 test_sanctions.py --sandbox
python3 test_documents.py --sandbox
python3 test_establishments.py --sandbox
```

---

## Module Contents

### 📁 `tests/`
Test scripts for each Roaring.io endpoint:
- `test_sanctions.py` - Sanctions Lists API v3.0
- `test_documents.py` - Company Documents API v1.0
- `test_establishments.py` - Establishments API v2.0
- `test_kyc.py` - KYC Q&A API v1.0 (not used in Celestial)

### 📁 `docs/`
Complete API documentation:
- `TESTING_REGISTRY.md` - Central index of all tested endpoints
- `SANCTIONS_LISTS_V3.md` - Sanctions screening (MANDATORY for PTL)
- `COMPANY_DOCUMENTS_V1.md` - Official Bolagsverket documents
- `ESTABLISHMENTS_V2.md` - Company workplaces/locations

### 📁 `examples/`
Sample API responses:
- `sanctions_ztarz.json` - Multi-list sanctions hit example
- `documents_annual_report.json` - Document fetch response
- `establishments_multi.json` - Multi-location company
- `annual_report_sample.pdf` - Downloaded PDF example

### 🔐 `credentials.ini`
OAuth2 credentials for Roaring.io API (keep secure!)

### 🐍 `credentials.py`
Helper functions to load credentials

---

## Setup

1. **Get API credentials** from Roaring.io developer portal
2. **Update `credentials.ini`** with your client_id and client_secret
3. **Test authentication:**
   ```bash
   cd tests
   python3 test_sanctions.py --sandbox
   ```

---

## Integration with Celestial

### Critical Endpoints (PTL Compliance)
- ✅ **Sanctions Lists** - MANDATORY screening
- ✅ **Company Documents** - KYC verification
- ✅ **Establishments** - Address validation

### Workflow
1. Customer provides org.nr
2. Screen beneficial owners via Sanctions API
3. Fetch registreringsbevis via Documents API
4. Validate addresses via Establishments API
5. Calculate risk score in Celestial Risk Engine v3.0

---

## Testing Status

See `docs/TESTING_REGISTRY.md` for complete status.

**Summary:**
- ✅ 4 endpoints fully tested
- ✅ Sandbox validation complete
- ✅ Production-ready

---

## Links

- [Roaring.io Developer Portal](https://developer.roaring.io)
- [Testing Registry](docs/TESTING_REGISTRY.md)
- [Celestial Risk Methodology](../../docs/Theory/metod_riskbedömning_kund_v3.tex)

---

**Module Owner:** Celestial Development Team  
**Last Updated:** 2025-10-25  
**Status:** 🟢 Active
