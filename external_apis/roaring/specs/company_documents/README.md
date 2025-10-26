# Company Documents API v1.0

**Endpoint:** GET /company-documents/v1/se/{companyId}  
**Status:** ✅ Testad och dokumenterad  
**Test script:** `tests/test_documents.py`  
**Full dokumentation:** `docs/COMPANY_DOCUMENTS_V1.md`  
**Exempel data:** `examples/documents_annual_report.json`, `examples/annual_report_sample.pdf`  

## OpenAPI Specification

Se `openapi.yaml` i denna mapp för fullständig API spec.

## Quick Reference

- **Method:** GET
- **Auth:** OAuth2 Bearer token
- **Input:** Swedish organization number (companyId)
- **Output:** Array of documents with downloadUrl
- **Document types:** 7 types (årsredovisning, registreringsbevis, bolagsordning, etc.)
- **Viktighet:** 🔴 CRITICAL för Celestial (KYC data source)
