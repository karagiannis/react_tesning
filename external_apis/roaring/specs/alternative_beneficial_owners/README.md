# Beneficial Owners API v1.0

**Endpoint:** GET /beneficial-owners/v1/se/{companyId}  
**Status:** ⏳ Script skapat, ej testat än  
**Test script:** `tests/test_beneficial_owners.py`  
**Full dokumentation:** Behöver skapas efter första test  
**Exempel data:** Skapas vid första test  

## OpenAPI Specification

Se `openapi.yaml` i denna mapp för fullständig API spec.

## Quick Reference

- **Method:** GET
- **Auth:** OAuth2 Bearer token
- **Input:** Swedish organization number (companyId)
- **Output:** Array of beneficial owners (UBO) with ownership %, control type, layers
- **Viktighet:** 🔴 CRITICAL för Celestial (PML-krav 3 kap 6 § - identifiera verklig huvudman)
- **Riskpoäng:**
  - Inga UBO hittade: +10 poäng
  - >2 ägarlager: +2 poäng per owner
  - <50% ägarandel men kontroll: +1 poäng
