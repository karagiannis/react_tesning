# INSIGHT: Beneficial Owner - Två Endpoints (Roaring.io)

**Upptäckt:** 2025-10-24  
**Loop:** LOOP 2 (Backend API Spec)  
**Relaterar till:** Sektion 2 - POST /riskfragor/steg1  
**Fil:** API_Endpoints_ContentSlides.tex

---

## Vad vi upptäckte

Roaring.io har **två separata endpoints** för Beneficial Owner (Verklig Huvudman):

### 1. Primary Endpoint: Beneficial Owners 2.1
```
GET /se/company/beneficial-owners/2.1/{orgNr}
```

**Syfte:** Hämtar registrerade verkliga huvudmän från Bolagsverkets register

**Returnerar:** Personer med >25% ägande/kontroll

### 2. Fallback Endpoint: Alternative Beneficial Owner 1.0
```
GET /se/company/alternative-beneficial-owner/1.0/{orgNr}
GET /se/alternative-beneficial-owner/1.0/{orgNr}
```

**Syfte:** Används när ingen person äger >25%

**Returnerar:** Högsta befattningshavare (CEO/VD) som alternativ VH

---

## PTL-relevans

### PTL 3 kap 6 § - Verklig huvudman
> *"Verksamhetsutövaren ska vidta åtgärder för att identifiera den verkliga huvudmannen och fastställa dennes identitet."*

**Krav:**
- Fysisk person som äger/kontrollerar >25% av röster/kapital
- Direkt eller indirekt ägande
- Bestämmande inflytande på annat sätt

### PTL 3 kap 8 § - Alternativ verklig huvudman
> *"Om ingen verklig huvudman kan identifieras enligt 6 §, ska högsta befattningshavare anges som alternativ verklig huvudman."*

**Krav:**
- Dokumentera VARFÖR ingen VH identifierats
- Ange att uppgift saknas i Bolagsverkets register
- Verifiera alternativ VH:s identitet lika stringent

### Länsstyrelsen Stockholm 01FS 2024-20
> *"När verksamhetsutövaren utser alternativ verklig huvudman enligt 3 kap. 8 § lagen (2017:630) om åtgärder mot penningtvätt och finansiering av terrorism ska det framgå att en verklig huvudman finns inte i Bolagsverkets register över verkliga huvudmän."*

**Praktisk konsekvens:**
- Om Roaring returnerar tom array → Måste dokumentera varför
- Använd alternativ VH (CEO)
- Spara i KYC-underlag för Länsstyrelsen

---

## Algoritm (Pseudokod)

```python
async def get_beneficial_owners(org_nr: str, access_token: str):
    """
    Hämta verkliga huvudmän enligt PTL 3 kap 6-8 §
    
    Returns:
        - beneficialOwners: List[Person] (>25% ägande)
        - alternativeBeneficialOwner: Person | None (CEO/VD)
        - reason: str (varför alternativ används)
        - ptl_compliance: bool
    """
    
    # STEG 1: Försök hämta registrerade VH (>25%)
    try:
        primary_response = await roaring.get(
            f"/se/company/beneficial-owners/2.1/{org_nr}",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        
        if primary_response.beneficialOwners and len(primary_response.beneficialOwners) > 0:
            # SUCCESS: Har identifierat verklig huvudman
            return {
                "beneficialOwners": primary_response.beneficialOwners,
                "alternativeBeneficialOwner": None,
                "reason": None,
                "ptl_reference": "PTL 3 kap 6 §",
                "totalCoverage": primary_response.totalCoverage,
                "ptl_compliance": True
            }
    except Exception as e:
        # Log error but continue to fallback
        logger.error(f"Primary beneficial owner API failed: {e}")
    
    # STEG 2: Ingen VH >25%, hämta alternativ (CEO)
    try:
        alt_response = await roaring.get(
            f"/se/company/alternative-beneficial-owner/1.0/{org_nr}",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        
        # VIKTIGT: Dokumentera VARFÖR alternativ används
        reason = "Ingen person äger eller kontrollerar >25% av rösterna/kapitalet. "
        reason += "Enligt PTL 3 kap 8 § används högsta befattningshavare som alternativ verklig huvudman."
        
        return {
            "beneficialOwners": [],
            "alternativeBeneficialOwner": alt_response.ceo,
            "reason": reason,
            "ptl_reference": "PTL 3 kap 8 §",
            "totalCoverage": 0,
            "ptl_compliance": True,
            "lansstyrelsen_note": "Uppgift om verklig huvudman saknas i Bolagsverkets register"
        }
    except Exception as e:
        # CRITICAL: Kunde inte identifiera vare sig VH eller alternativ
        logger.critical(f"Alternative beneficial owner API failed: {e}")
        
        return {
            "beneficialOwners": [],
            "alternativeBeneficialOwner": None,
            "reason": "Kunde inte identifiera verklig huvudman eller alternativ",
            "ptl_reference": "PTL 3 kap 6-8 §",
            "totalCoverage": 0,
            "ptl_compliance": False,  # REJECT THIS ONBOARDING
            "error": str(e)
        }
```

---

## Response Schema (Combined)

```json
{
  "organizationNumber": "5564881422",
  "companyName": "PERFECT COMPANY AB",
  "beneficialOwners": [
    {
      "personalNumber": "196304182199",
      "firstName": "Anna",
      "lastName": "Andersson",
      "ownershipPercentage": 50.0,
      "votingRightsPercentage": 50.0,
      "ownershipType": "DIRECT",
      "source": "BOLAGSVERKET_REGISTER",
      "verified": true
    }
  ],
  "alternativeBeneficialOwner": null,
  "reason": null,
  "ptl_reference": "PTL 3 kap 6 §",
  "totalCoverage": 100.0,
  "ptl_compliance": true
}
```

**Eller (fallback):**
```json
{
  "organizationNumber": "5565002465",
  "companyName": "MANY OWNERS AB",
  "beneficialOwners": [],
  "alternativeBeneficialOwner": {
    "personalNumber": "198001011234",
    "firstName": "Kalle",
    "lastName": "Karlsson",
    "role": "CEO",
    "source": "ALTERNATIVE"
  },
  "reason": "Ingen person äger eller kontrollerar >25% av rösterna/kapitalet. Enligt PTL 3 kap 8 § används högsta befattningshavare som alternativ verklig huvudman.",
  "ptl_reference": "PTL 3 kap 8 §",
  "totalCoverage": 0,
  "ptl_compliance": true,
  "lansstyrelsen_note": "Uppgift om verklig huvudman saknas i Bolagsverkets register"
}
```

---

## Red Flags att kontrollera

### Cross-check verklig huvudman mot:
1. **PEP-register** (Politically Exposed Person)
   - Endpoint: `/se/pep/1.0/{personnummer}`
   - Risk: KRITISK om PEP = true

2. **Sanktionslistor** (EU/UN/OFAC)
   - Endpoint: `/se/sanctions/1.0/{personnummer}`
   - Risk: KRITISK om sanktionerad

3. **Näringsförbud** (Business Prohibition)
   - Endpoint: `/se/businessprohibition/1.0/person/{personnummer}`
   - Risk: KRITISK om aktivt förbud

4. **Komplex ägarstruktur**
   - Risk: MEDEL om `ownershipType === 'INDIRECT'` för alla
   - Risk: HÖG om `totalCoverage < 50%`

5. **Utländskt ägande**
   - Risk: MEDEL om personnummer utländskt format
   - Kräv fördjupad due diligence

---

## Kostnad (Roaring API Calls)

### Best Case (Direct Ownership)
- 1 anrop: `/beneficial-owners/2.1/{orgNr}`
- **Total:** 1 anrop per företag

### Worst Case (No VH >25%)
- 1 anrop: `/beneficial-owners/2.1/{orgNr}` (returnerar tom array)
- 1 anrop: `/alternative-beneficial-owner/1.0/{orgNr}` (fallback)
- **Total:** 2 anrop per företag

### Med PEP/Sanctions/BP checks (per VH)
- +1 anrop per VH: PEP check
- +1 anrop per VH: Sanctions check
- +1 anrop per VH: Business Prohibition check
- **Total:** +3 anrop per verklig huvudman

**Exempel:**
- 2 VH identifierade → 1 + (2 × 3) = **7 anrop total**
- 1 alternativ VH → 2 + (1 × 3) = **5 anrop total**

---

## TODO (Loop 4 - Backend Implementation)

### Implementation Tasks
- [ ] Implementera båda API-anrop (primary + fallback)
- [ ] Kombinera resultat enligt algoritm ovan
- [ ] Spara i `onboarding_processes.beneficial_owners_data` (JSONB)
- [ ] Dokumentera reason om alternativ används
- [ ] Cross-check mot PEP/Sanctions/BP
- [ ] Generera red flags om kritiska fynd
- [ ] Uppdatera `ptl_compliance` status
- [ ] Spara API-svar för audit trail

### Database Schema Update
```sql
ALTER TABLE onboarding_processes
ADD COLUMN beneficial_owners_data JSONB,
ADD COLUMN beneficial_owners_checked_at TIMESTAMP,
ADD COLUMN beneficial_owners_compliance BOOLEAN DEFAULT TRUE;
```

### Testing
- [ ] Test med org.nr som har 2 VH (50/50)
- [ ] Test med org.nr som har 0 VH (många små ägare)
- [ ] Test med org.nr där VH är PEP
- [ ] Test med org.nr där VH har näringsförbud
- [ ] Test med utländsk ägare

---

## Dokumentation Status

- [x] Upptäckt dokumenterad i INSIGHTS
- [ ] Sektion 2 uppdaterad i API_Endpoints_ContentSlides.tex
- [ ] Business logic dokumenterad
- [ ] Request/Response schemas kompletta
- [ ] Externa integrationer listade
- [ ] Red flags definierade

---

## Referens

### Roaring Dokumentation
- `docs/API_INTEGRATION/Roaring/BENEFICIAL_OWNER.md`
- `docs/API_INTEGRATION/Roaring/test_beneficial_owners.py`
- `docs/API_INTEGRATION/Roaring/API_SCHEMAS_ROARING.md`

### PTL-lagar
- **PTL 3 kap 6 §:** Identifiering av verklig huvudman
- **PTL 3 kap 8 §:** Alternativ verklig huvudman
- **Länsstyrelsen Stockholm 01FS 2024-20:** Dokumentationskrav

### Bolagsverket
- Verkliga huvudmän-register: https://bolagsverket.se/verkligahuvudman

---

**NÄSTA:** Uppdatera API_Endpoints_ContentSlides.tex Sektion 2 med denna information
