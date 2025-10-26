# Establishments API v2.0

**Endpoint:** GET /establishments/v2/se/{companyId}  
**Status:** ✅ Testad och dokumenterad  
**Test script:** `tests/test_establishments.py`  
**Full dokumentation:** `docs/ESTABLISHMENTS_V2.md`  
**Exempel data:** `examples/establishments_multi.json`  

## OpenAPI Specification

Se `openapi.yaml` i denna mapp för fullständig API spec.

## Quick Reference

- **Method:** GET
- **Auth:** OAuth2 Bearer token
- **Input:** Swedish organization number (companyId)
- **Output:** Array of establishments with CFAR numbers, addresses, SNI codes
- **Viktighet:** 🟡 IMPORTANT för Celestial (address verification, industry analysis)
