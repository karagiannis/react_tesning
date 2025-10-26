# Sanctions Lists API v3.0

**Endpoint:** POST /sanctions-lists/v3/search  
**Status:** ✅ Testad och dokumenterad  
**Test script:** `tests/test_sanctions.py`  
**Full dokumentation:** `docs/SANCTIONS_LISTS_V3.md`  
**Exempel data:** `examples/sanctions_ztarz.json`  

## OpenAPI Specification

Se `openapi.yaml` i denna mapp för fullständig API spec.

## Quick Reference

- **Method:** POST
- **Auth:** OAuth2 Bearer token
- **Input:** name, birthDate (optional), country (optional), companyId (optional)
- **Output:** Array of hits from 5 sanctions lists (EU, OFAC, UN, UK, Swiss)
- **Viktighet:** 🔴 MANDATORY för Celestial (AML compliance)
