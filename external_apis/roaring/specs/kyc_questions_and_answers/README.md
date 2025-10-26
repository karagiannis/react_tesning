# KYC Q&A API v1.0

**Endpoint:** GET /kyc/questionnaires/v1  
**Status:** ⏳ Script fixat, behöver verifieras  
**Test script:** `tests/test_kyc.py`  
**Full dokumentation:** Ingen (low priority)  
**Exempel data:** Ingen  

## OpenAPI Specification

Se `openapi.yaml` i denna mapp för fullständig API spec.

## Quick Reference

- **Method:** GET
- **Auth:** OAuth2 Bearer token
- **Input:** Ingen (listar tillgängliga frågor)
- **Output:** Array med question_id och question_text
- **Viktighet:** ⚪ LOW för Celestial - Inte relevant (frågor om kryptovaluta, gambling, sanktionsländer)
- **Slutsats:** Vi använder troligen inte denna endpoint i Celestial
