# Company Information API 2.0 - Kodlistor

> **Källa:** Roaring.io Company Overview API Documentation  
> **Uppdaterad:** 2025-10-23  
> **Användning:** Komplett referens för statuskoder, juridiska former, branschkoder och anställningsintervall

---

## 📋 Innehållsförteckning

1. [Status Codes (Statuskoder)](#status-codes-statuskoder)
2. [Legal Group Codes (Juridisk Form)](#legal-group-codes-juridisk-form)
3. [SNI Industry Codes (Branschkoder)](#sni-industry-codes-branschkoder)
4. [Employee Intervals (Anställningsintervall)](#employee-intervals-anställningsintervall)
5. [County and Municipality Codes](#county-and-municipality-codes)

---

## Status Codes (Statuskoder)

### Översikt

Statuskoder indikerar företagets operativa status och är **kritiska för riskvärdering**.

**Kategorier:**
- **100-149:** Aktivt (olika varianter)
- **103-190:** Aktivt med varning (konkurshistorik, vilande, etc.)
- **200-299:** Inaktivt (ej avregistrerat)
- **300-391:** Avregistrerat (konkurs, fusion, delning, etc.)

---

### Kategori 1: Active Status (100-149)

| Kod | Status | Beskrivning | KYC Risk |
|-----|--------|-------------|----------|
| **100** | Aktivt | Normalt aktivt företag | ✅ Low |
| **101** | Lagerbolag | "Shelf company" - nyregistrerat utan verksamhet | ⚠️ Medium - Kräver extra DD |
| **112** | Företrädesrätt beslutad | Företrädesrätt har beviljats efter konkurs/ackord | ⚠️ High - Konkurshistorik |
| **113** | Företrädesrätt | Aktiv företrädesrätt | ⚠️ High |
| **132** | Likvidation pågår | Under likvidation men ej konkurs | ⚠️ High |
| **133** | Likvidation avslutad | Likvidation genomförd | ⚠️ High |
| **140** | Fusion beslutad | Fusionsbeslut fattat men ej genomfört | ⚠️ Medium |
| **141** | Fusion pågår | Fusionsprocess pågår | ⚠️ Medium |
| **142** | Fusion genomförd | Fusion slutförd | ⚠️ Medium |
| **143** | Fusion överlåtande | Överlåtande bolag i fusion | ⚠️ Medium |
| **144** | Fusion övertagande | Övertagande bolag i fusion | ⚠️ Medium |
| **145** | Fusion avbruten | Fusion avbröts | ⚠️ Medium |
| **149** | Fusion pågår | Fusion under genomförande | ⚠️ Medium |

**KYC Beslut för 100-149:**
```python
if status_code in [100]:
    return "APPROVED"  # Standard active company
elif status_code == 101:
    return "MANUAL_REVIEW"  # Lagerbolag - check if operational
elif status_code in [112, 113]:
    return "REJECT"  # Konkurshistorik = auto-reject
elif status_code in [132, 133]:
    return "REJECT"  # Under/avslutad likvidation
elif status_code in [140, 141, 142, 143, 144, 145, 149]:
    return "MANUAL_REVIEW"  # Fusion - assess stability
```

---

### Kategori 2: Active with Warning (103-190)

**KRITISK KATEGORI** - Företaget är tekniskt aktivt men har allvarliga riskindikatorer.

| Kod | Status | Beskrivning | KYC Risk |
|-----|--------|-------------|----------|
| **103** | Konkurshistorik | Tidigare konkurs | 🔴 Critical - Auto-reject |
| **104** | Vilande | Dormant company - ingen aktivitet | 🔴 High - Skalbolag? |
| **111** | Ackordsförhandling | Ackord under förhandling | 🔴 Critical |
| **118** | Konkursansökan | Konkursansökan inlämnad | 🔴 Critical |
| **132** | Likvidation pågår | Frivillig likvidation | 🔴 High |
| **133** | Likvidation avslutad | Likvidation genomförd | 🔴 High |
| **140** | Fusion beslutad | Fusionsbeslut | ⚠️ Medium |
| **141** | Fusion pågår | Fusion under genomförande | ⚠️ Medium |
| **142** | Företag rekonstruktion | Företagsrekonstruktion beslutad | 🔴 Critical |
| **143** | Fusion överlåtande | Överlåtande bolag | ⚠️ Medium |
| **144** | Fusion övertagande | Övertagande bolag | ⚠️ Medium |
| **145** | Fusion avbruten | Fusion avbröts | ⚠️ Medium |
| **180** | Rekonstruktion | Företagsrekonstruktion (§1 lagen) | 🔴 Critical |
| **190** | Konkursbeslut | Konkurs beslutad | 🔴 Critical - Auto-reject |

**KYC Beslut för 103-190:**
```python
# CRITICAL - Automatic rejection
CRITICAL_CODES = [103, 111, 118, 132, 133, 142, 180, 190]

# HIGH RISK - Manual review required
HIGH_RISK_CODES = [104]

# MEDIUM RISK - Enhanced due diligence
MEDIUM_RISK_CODES = [140, 141, 143, 144, 145]

if status_code in CRITICAL_CODES:
    return "REJECT"  # Too risky - no exceptions
elif status_code in HIGH_RISK_CODES:
    return "MANUAL_REVIEW"  # Possible shell company
elif status_code in MEDIUM_RISK_CODES:
    return "ENHANCED_DD"  # Extra checks required
```

---

### Kategori 3: Inactive Status (200-299)

Företaget är **inaktivt** men fortfarande registrerat.

| Kod | Status | Beskrivning | KYC Risk |
|-----|--------|-------------|----------|
| **200** | Inaktivt | Inaktivt företag | 🔴 High - Reject |
| **203** | Vilande | Dormant/inactive | 🔴 High - Reject |
| **231** | Ackord genomfört | Ackord har slutförts | 🔴 Critical - Reject |
| **241** | Konkurs avslutad | Konkurs slutförd | 🔴 Critical - Reject |
| **291** | Rekonstruktion genomförd | Rekonstruktion slutförd | 🔴 High - Manual review |
| **292** | Rekonstruktion inställd | Rekonstruktion avbröts | 🔴 High - Manual review |

**KYC Beslut för 200-299:**
```python
# ALL inactive companies = REJECT
if 200 <= status_code <= 299:
    return "REJECT"  # No business with inactive companies
```

---

### Kategori 4: Deregistered Status (300-391)

Företaget är **avregistrerat** från Bolagsverket.

| Kod | Status | Beskrivning | KYC Risk |
|-----|--------|-------------|----------|
| **300** | Avregistrerat | Generell avregistrering | 🔴 Critical - Reject |
| **303** | Avregistrerad konkursbo | Konkursbo avregistrerat | 🔴 Critical - Reject |
| **310** | Avregistrerat | Avregistrerad från Bolagsverket | 🔴 Critical - Reject |
| **330** | Ackord avslutat - avregistrerat | Ackord slutfört och avregistrerat | 🔴 Critical - Reject |
| **340** | Konkurs avslutad - avregistrerat | Konkurs slutförd och avregistrerat | 🔴 Critical - Reject |
| **350** | Fusion genomförd - avregistrerat | Fusionerat till annat bolag | 🔴 High - Check successor company |
| **360** | Likvidation avslutad - avregistrerat | Likvidation slutförd | 🔴 Critical - Reject |
| **370** | Övrigt avregistrerat | Annat skäl för avregistrering | 🔴 Critical - Reject |
| **377** | Konkurs avskriven - avregistrerat | Konkurs avskriven pga brist på tillgångar | 🔴 Critical - Reject |
| **391** | Delning genomförd - avregistrerat | Företagsdelning genomförd | 🔴 High - Check successor companies |

**KYC Beslut för 300-391:**
```python
# ALL deregistered companies = REJECT (except fusion/delning - manual review)
if status_code in [350, 391]:
    return "MANUAL_REVIEW"  # Check successor company
elif 300 <= status_code <= 399:
    return "REJECT"  # Company no longer exists
```

---

### Status Code Decision Tree

```python
def kyc_decision_from_status(status_code: int, status_text_detailed: str) -> dict:
    """
    Comprehensive KYC decision based on company status
    
    Returns:
        {
            "decision": "APPROVED" | "MANUAL_REVIEW" | "ENHANCED_DD" | "REJECT",
            "reason": str,
            "risk_level": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
        }
    """
    
    # Category 4: Deregistered (300-391) - ALWAYS REJECT
    if 300 <= status_code <= 399:
        if status_code in [350, 391]:  # Fusion/Delning
            return {
                "decision": "MANUAL_REVIEW",
                "reason": f"Company merged/divided - {status_text_detailed}. Check successor.",
                "risk_level": "HIGH"
            }
        else:
            return {
                "decision": "REJECT",
                "reason": f"Company deregistered - {status_text_detailed}",
                "risk_level": "CRITICAL"
            }
    
    # Category 3: Inactive (200-299) - ALWAYS REJECT
    if 200 <= status_code <= 299:
        return {
            "decision": "REJECT",
            "reason": f"Inactive company - {status_text_detailed}",
            "risk_level": "CRITICAL"
        }
    
    # Category 2: Active with Warning (103-190)
    CRITICAL_CODES = [103, 111, 118, 132, 133, 142, 180, 190]
    if status_code in CRITICAL_CODES:
        return {
            "decision": "REJECT",
            "reason": f"Critical risk - {status_text_detailed}",
            "risk_level": "CRITICAL"
        }
    
    if status_code == 104:  # Vilande
        return {
            "decision": "MANUAL_REVIEW",
            "reason": "Dormant company - verify if shell company",
            "risk_level": "HIGH"
        }
    
    if status_code in [140, 141, 143, 144, 145, 149]:  # Fusion
        return {
            "decision": "ENHANCED_DD",
            "reason": f"Company in merger process - {status_text_detailed}",
            "risk_level": "MEDIUM"
        }
    
    # Category 1: Active (100-149)
    if status_code == 100:
        return {
            "decision": "APPROVED",
            "reason": "Active company",
            "risk_level": "LOW"
        }
    
    if status_code == 101:  # Lagerbolag
        return {
            "decision": "MANUAL_REVIEW",
            "reason": "Shelf company - verify operational status",
            "risk_level": "MEDIUM"
        }
    
    if status_code in [112, 113]:  # Företrädesrätt
        return {
            "decision": "REJECT",
            "reason": "Bankruptcy history - preferential right granted",
            "risk_level": "CRITICAL"
        }
    
    # Default: Unknown status code
    return {
        "decision": "MANUAL_REVIEW",
        "reason": f"Unknown status code {status_code} - {status_text_detailed}",
        "risk_level": "MEDIUM"
    }
```

---

## Legal Group Codes (Juridisk Form)

### Översikt

Juridisk form avgör:
- Vilken KYC-process som används (EF vs AB vs Övriga)
- Antal API-anrop som krävs
- Compliance-krav (PML-lagen)
- Risknivå

---

### Kategori 1: AB - Aktiebolag (20+ varianter)

**Aktiebolag** = Begränsat ansvar, minst 1 aktieägare, minst 1 styrelseledamot.

| Kod | Juridisk Form | English | KYC Komplexitet |
|-----|---------------|---------|-----------------|
| **AB** | Privat aktiebolag | Private limited company | Medium (4-8 calls) |
| **AB publik** | Publikt aktiebolag | Public limited company | High (10-15 calls) |
| **AB försäkring** | Försäkringsaktiebolag | Insurance company | High + Regulatory |
| **AB bank** | Bankaktiebolag | Bank | Critical + Regulatory |
| **AB europeiskt** | Europabolag (SE) | European company | High |
| **AB tjänstepension** | Tjänstepensionsbolag | Occupational pension company | High + Regulatory |
| **AB medlemsbank** | Medlemsbank | Member bank | High + Regulatory |
| **AB ömsesidigt** | Ömsesidigt försäkringsbolag | Mutual insurance company | High |

**KYC Requirements för AB:**
```python
def kyc_requirements_ab(legal_group_code: str) -> dict:
    """KYC requirements for Aktiebolag"""
    
    # Standard AB
    if legal_group_code == "AB":
        return {
            "apis_required": [
                "Company Overview",
                "Beneficial Owner",        # UBO identification
                "Board Members",           # Screen all board members
                "Signatories"              # Signing authority
            ],
            "estimated_cost": 4,
            "pml_applicable": True,
            "enhanced_dd": False
        }
    
    # Regulated industries (Bank, Insurance, Pension)
    elif legal_group_code in ["AB bank", "AB försäkring", "AB tjänstepension", "AB medlemsbank"]:
        return {
            "apis_required": [
                "Company Overview",
                "Beneficial Owner",
                "Board Members",
                "Signatories",
                "AML Registry",
                "Sanctions",
                "PEP",
                "Financial Information"
            ],
            "estimated_cost": 10,
            "pml_applicable": True,
            "enhanced_dd": True,
            "reason": "Regulated financial institution - extra scrutiny required"
        }
    
    # Public AB
    elif legal_group_code == "AB publik":
        return {
            "apis_required": [
                "Company Overview",
                "Beneficial Owner",
                "Board Members",
                "Signatories",
                "Owner Structure",
                "Financial Information"
            ],
            "estimated_cost": 8,
            "pml_applicable": True,
            "enhanced_dd": True,
            "reason": "Public company - complex ownership structure"
        }
    
    else:
        return {
            "apis_required": ["Company Overview", "Beneficial Owner", "Board Members"],
            "estimated_cost": 4,
            "pml_applicable": True
        }
```

---

### Kategori 2: EF - Enskild Firma

**Enskild firma** = Enskild näringsidkare, obegränsat personligt ansvar.

| Kod | Juridisk Form | English | KYC Komplexitet |
|-----|---------------|---------|-----------------|
| **EF** | Enskild firma | Sole proprietorship | ✅ Low (2 calls) |

**KYC Requirements för EF:**
```python
def kyc_requirements_ef() -> dict:
    """KYC requirements for Enskild Firma"""
    
    return {
        "apis_required": [
            "Company Overview",         # Get company + companyHolder (personnummer)
            "Population Register"       # Verify owner via SPAR
            # Optional: "Business Prohibition" for owner
        ],
        "estimated_cost": 2,
        "pml_applicable": False,  # PML gäller ej EF (men bör screenas ändå)
        "notes": [
            "companyHolder = owner's personnummer",
            "Use SPAR to verify owner identity",
            "Check näringsförbud for owner",
            "No board members or beneficial owners (owner = 100%)"
        ]
    }
```

**EF Simplicity:**
- ✅ Ägare = companyHolder (personnummer i Overview response)
- ✅ Ingen styrelse att screena
- ✅ Ingen Beneficial Owner lookup (ägare är uppenbar)
- ✅ Inga firmatecknare (ägaren tecknar själv)
- ✅ **Total cost: 2 API calls** (vs 4-12 för AB)

---

### Kategori 3: HB/KB - Handelsbolag och Kommanditbolag

**Partnerships** = Personbolag, minst 2 delägare.

| Kod | Juridisk Form | English | KYC Komplexitet |
|-----|---------------|---------|-----------------|
| **HB** | Handelsbolag | General partnership | Medium (3-6 calls) |
| **KB** | Kommanditbolag | Limited partnership | Medium (3-6 calls) |

**KYC Requirements:**
```python
def kyc_requirements_partnership(legal_code: str) -> dict:
    """KYC for HB/KB"""
    
    return {
        "apis_required": [
            "Company Overview",
            "Board Members",         # List all partners (delägare)
            "Signatories",           # Signing authority
            "Population Register"    # Verify each partner
        ],
        "estimated_cost": 4,
        "pml_applicable": True,
        "notes": [
            "All partners (delägare) have unlimited liability (HB)",
            "Kommanditbolag: Limited + general partners",
            "Screen each partner individually"
        ]
    }
```

---

### Kategori 4: OVR - Övriga Former (40+ varianter)

**Diverse juridiska former** med varierande KYC-krav.

#### A. Föreningar (Associations)

| Kod | Juridisk Form | English | KYC Komplexitet |
|-----|---------------|---------|-----------------|
| **BF** | Bostadsrättsförening | Housing cooperative | Medium |
| **EF** | Ekonomisk förening | Economic association | Medium |
| **IF** | Ideell förening | Non-profit association | Low-Medium |
| **FÖ** | Försäkringsförening | Insurance association | High + Regulatory |
| **UF** | Understödsförening | Benefit association | Medium |
| **AK** | Arbetslöshetskassa | Unemployment fund | High + Regulatory |

**KYC för Föreningar:**
```python
def kyc_requirements_association(legal_code: str) -> dict:
    """KYC for associations"""
    
    # Regulated associations (Insurance, Unemployment fund)
    if legal_code in ["FÖ", "AK"]:
        return {
            "apis_required": [
                "Company Overview",
                "Board Members",
                "AML Registry",
                "Sanctions"
            ],
            "estimated_cost": 5,
            "enhanced_dd": True,
            "reason": "Regulated association"
        }
    
    # Standard associations
    else:
        return {
            "apis_required": [
                "Company Overview",
                "Board Members"
            ],
            "estimated_cost": 2,
            "notes": "No beneficial owners for non-profit associations"
        }
```

#### B. Stiftelser (Foundations)

| Kod | Juridisk Form | English |
|-----|---------------|---------|
| **ST** | Stiftelse | Foundation |
| **SFS** | Stiftelse för förvaltning av samfälligheter | Foundation for common property management |

**KYC för Stiftelser:**
- No beneficial owners (non-profit purpose)
- Screen board members
- Enhanced DD for large foundations

#### C. Offentliga (Public Sector)

| Kod | Juridisk Form | English |
|-----|---------------|---------|
| **KO** | Kommun | Municipality |
| **LK** | Landsting/Region | County council/Region |
| **SB** | Statlig myndighet | Government agency |
| **SVB** | Statligt bolag | State-owned company |

**KYC för Offentliga:**
```python
def kyc_requirements_public(legal_code: str) -> dict:
    """KYC for public sector entities"""
    
    return {
        "apis_required": ["Company Overview"],
        "estimated_cost": 1,
        "auto_approve": True,
        "reason": "Government entities = low risk",
        "notes": "No PML requirements for government entities"
    }
```

#### D. Utländska och Särskilda Former

| Kod | Juridisk Form | English |
|-----|---------------|---------|
| **EU** | Europabolag (SE) | European company |
| **EGTS** | Europeisk gruppering för territoriellt samarbete | European grouping of territorial cooperation |
| **FIL** | Filial utländskt företag | Branch of foreign company |
| **FUB** | Filial utländsk bank | Branch of foreign bank |
| **ODB** | Oskiftat dödsbo | Undivided estate |
| **TSF** | Registrerat trossamfund | Registered religious community |
| **SAM** | Samfällighet | Common property unit |

**KYC för Utländska Filialer:**
```python
def kyc_requirements_foreign_branch() -> dict:
    """KYC for foreign branch (filial)"""
    
    return {
        "apis_required": [
            "Company Overview",     # Swedish registration
            "Board Members",        # Local management
            # PLUS: Parent company KYC in home country
        ],
        "estimated_cost": 3,
        "enhanced_dd": True,
        "additional_checks": [
            "Verify parent company in home country",
            "Check parent company sanctions/PEP",
            "Verify branch authority documentation"
        ]
    }
```

---

### Legal Group Decision Matrix

```python
def determine_kyc_cost(legal_group_code: str) -> dict:
    """
    Determine estimated KYC cost based on legal form
    """
    
    # 1. ENSKILD FIRMA = Simplest
    if legal_group_code == "EF":
        return {
            "form": "Enskild Firma",
            "apis": 2,
            "cost_estimate": "Low",
            "flow": "EF_SIMPLE"
        }
    
    # 2. AKTIEBOLAG = Standard
    elif legal_group_code.startswith("AB"):
        if legal_group_code in ["AB bank", "AB försäkring", "AB tjänstepension"]:
            return {
                "form": "Regulated AB",
                "apis": 10,
                "cost_estimate": "Very High",
                "flow": "AB_REGULATED"
            }
        elif legal_group_code == "AB publik":
            return {
                "form": "Public AB",
                "apis": 8,
                "cost_estimate": "High",
                "flow": "AB_PUBLIC"
            }
        else:
            return {
                "form": "Private AB",
                "apis": 4,
                "cost_estimate": "Medium",
                "flow": "AB_STANDARD"
            }
    
    # 3. PARTNERSHIPS
    elif legal_group_code in ["HB", "KB"]:
        return {
            "form": "Partnership",
            "apis": 4,
            "cost_estimate": "Medium",
            "flow": "PARTNERSHIP"
        }
    
    # 4. PUBLIC SECTOR = Simplest (auto-approve)
    elif legal_group_code in ["KO", "LK", "SB", "SVB"]:
        return {
            "form": "Public Sector",
            "apis": 1,
            "cost_estimate": "Very Low",
            "flow": "PUBLIC_AUTO_APPROVE"
        }
    
    # 5. ASSOCIATIONS
    elif legal_group_code in ["IF", "BF", "EF", "UF"]:
        return {
            "form": "Association",
            "apis": 2,
            "cost_estimate": "Low",
            "flow": "ASSOCIATION"
        }
    
    # 6. REGULATED ASSOCIATIONS
    elif legal_group_code in ["FÖ", "AK"]:
        return {
            "form": "Regulated Association",
            "apis": 5,
            "cost_estimate": "High",
            "flow": "ASSOCIATION_REGULATED"
        }
    
    # 7. FOUNDATIONS
    elif legal_group_code in ["ST", "SFS"]:
        return {
            "form": "Foundation",
            "apis": 2,
            "cost_estimate": "Low",
            "flow": "FOUNDATION"
        }
    
    # 8. FOREIGN BRANCH
    elif legal_group_code in ["FIL", "FUB"]:
        return {
            "form": "Foreign Branch",
            "apis": 3,
            "cost_estimate": "Medium",
            "flow": "FOREIGN_BRANCH",
            "additional": "Parent company KYC required"
        }
    
    # 9. OTHER
    else:
        return {
            "form": "Other/Unknown",
            "apis": 3,
            "cost_estimate": "Medium",
            "flow": "MANUAL_REVIEW"
        }
```

---

## SNI Industry Codes (Branschkoder)

### Översikt

**SNI 2007** = Svensk Näringsgrensindelning 2007
- Baserad på EU:s NACE Rev. 2
- Maintained by SCB (Statistiska centralbyrån)
- 5-siffrig hierarkisk kod

**Struktur:**
```
NN       = Sektion (avdelning)
NN.N     = Division (huvudgrupp)
NN.NN    = Grupp
NN.NNN   = Klass
NN.NNNN  = Underklass (endast Sverige)
```

**Exempel:**
```
62       = Information och kommunikation
62.0     = Dataprogrammering, datakonsultverksamhet och därmed...
62.01    = Dataprogrammering
62.010   = Dataprogrammering
```

### High-Risk Industries för KYC

| SNI Kod | Bransch | Risk Level | Reason |
|---------|---------|------------|--------|
| **64xxx** | Finansiell verksamhet | 🔴 Critical | Money laundering, fraud |
| **66xxx** | Försäkring och pensionsfonder | 🔴 Critical | Regulatory, fraud |
| **47xxx** | Detaljhandel | ⚠️ High | Cash-intensive |
| **56xxx** | Restaurang och catering | ⚠️ High | Cash-intensive |
| **68xxx** | Fastighetsverksamhet | ⚠️ High | Money laundering |
| **77xxx** | Uthyrning och leasing | ⚠️ High | Shell companies |
| **78xxx** | Arbetsförmedling och bemanning | ⚠️ Medium | False invoicing |
| **82xxx** | Kontorsservice och andra företagsstödjande verksamheter | ⚠️ Medium | Shell companies |
| **92xxx** | Spel och vadhållning | 🔴 Critical | Money laundering |
| **93xxx** | Sport, nöje och fritid | ⚠️ Medium | Cash-intensive |

### SNI Risk Check

```python
def assess_industry_risk(industry_code: str, industry_text: str) -> dict:
    """
    Assess KYC risk based on SNI industry code
    """
    
    # Extract 2-digit section code
    section = industry_code[:2] if industry_code else "00"
    
    # CRITICAL RISK INDUSTRIES
    CRITICAL_SNI = {
        "64": "Financial services - Enhanced DD + AML mandatory",
        "66": "Insurance - Enhanced DD + Regulatory checks",
        "92": "Gambling - Enhanced DD + AML mandatory"
    }
    
    if section in CRITICAL_SNI:
        return {
            "risk_level": "CRITICAL",
            "reason": CRITICAL_SNI[section],
            "enhanced_dd": True,
            "additional_apis": ["AML Registry", "Sanctions", "PEP", "Financial Information"],
            "manual_review": True
        }
    
    # HIGH RISK INDUSTRIES (Cash-intensive, real estate)
    HIGH_RISK_SNI = {
        "47": "Retail - Cash handling risk",
        "56": "Food service - Cash handling risk",
        "68": "Real estate - Money laundering risk",
        "77": "Rental - Shell company risk"
    }
    
    if section in HIGH_RISK_SNI:
        return {
            "risk_level": "HIGH",
            "reason": HIGH_RISK_SNI[section],
            "enhanced_dd": True,
            "additional_checks": ["Transaction monitoring", "Source of funds"],
            "manual_review": False
        }
    
    # MEDIUM RISK (Staffing, services)
    MEDIUM_RISK_SNI = {
        "78": "Employment services - False invoicing risk",
        "82": "Business support - Shell company risk",
        "93": "Entertainment - Cash handling risk"
    }
    
    if section in MEDIUM_RISK_SNI:
        return {
            "risk_level": "MEDIUM",
            "reason": MEDIUM_RISK_SNI[section],
            "enhanced_dd": False,
            "additional_checks": ["Business verification"],
            "manual_review": False
        }
    
    # LOW RISK (Standard industries)
    return {
        "risk_level": "LOW",
        "reason": f"Standard industry - {industry_text}",
        "enhanced_dd": False,
        "manual_review": False
    }
```

### SNI Resources

**Official Source:** [SCB SNI 2007 Database](https://www.scb.se/sni)

**Full SNI 2007 Code List:** 700+ codes - too large for this document. Use SCB's online search tool.

---

## Employee Intervals (Anställningsintervall)

### Standard Intervals

Från SCB (Statistiska centralbyrån):

| Interval | Description | Company Size |
|----------|-------------|--------------|
| **0** | Inga anställda | No employees (owner-only) |
| **1-4** | 1-4 anställda | Micro company |
| **5-9** | 5-9 anställda | Small company |
| **10-19** | 10-19 anställda | Small company |
| **20-49** | 20-49 anställda | Medium company |
| **50-99** | 50-99 anställda | Medium company |
| **100-199** | 100-199 anställda | Large company |
| **200-499** | 200-499 anställda | Large company |
| **500+** | 500 eller fler | Very large company |

### KYC Significance

```python
def assess_company_size(employee_interval: str) -> dict:
    """
    Assess company size and KYC implications
    """
    
    if employee_interval in ["0", "1-4"]:
        return {
            "size": "Micro",
            "risk_level": "LOW",
            "kyc_notes": [
                "Small company - likely owner-operated",
                "Lower complexity ownership",
                "Faster onboarding possible"
            ]
        }
    
    elif employee_interval in ["5-9", "10-19"]:
        return {
            "size": "Small",
            "risk_level": "LOW",
            "kyc_notes": [
                "Small business",
                "Standard KYC process"
            ]
        }
    
    elif employee_interval in ["20-49", "50-99"]:
        return {
            "size": "Medium",
            "risk_level": "MEDIUM",
            "kyc_notes": [
                "Established business",
                "May have complex ownership",
                "Check for multiple establishments"
            ]
        }
    
    elif employee_interval in ["100-199", "200-499"]:
        return {
            "size": "Large",
            "risk_level": "MEDIUM",
            "kyc_notes": [
                "Large organization",
                "Likely complex ownership structure",
                "May require enhanced DD",
                "Check for group structure"
            ]
        }
    
    elif employee_interval == "500+":
        return {
            "size": "Very Large",
            "risk_level": "HIGH",
            "kyc_notes": [
                "Major corporation",
                "Complex ownership mandatory check",
                "Likely part of group/koncern",
                "Enhanced DD recommended",
                "Check for public company status"
            ]
        }
    
    else:
        return {
            "size": "Unknown",
            "risk_level": "MEDIUM",
            "kyc_notes": ["No employee data - manual verification needed"]
        }
```

---

## County and Municipality Codes

**Se:** [KODLISTOR_POPULATION_REGISTER.md](./KODLISTOR_POPULATION_REGISTER.md) - Sektion "County Codes (Län)"

**Quick Reference:**
- 4-siffrig kod
- Första 2 siffror = Län (01-25)
- Sista 2 siffror = Kommun (01-99)
- **Exempel:** `0180` = Stockholm (01 = Stockholms län, 80 = Stockholm kommun)

**21 Län:**
- 01 = Stockholms län
- 03 = Uppsala län
- 04 = Södermanlands län
- 05 = Östergötlands län
- ... (se SPAR kodlistor för fullständig lista)

**290 Kommuner** totalt

---

## Summary

**Company Information API Kodlistor:**

✅ **50+ Status Codes**
- 100-149: Active (with variants)
- 103-190: Active with warnings (CRITICAL for risk assessment)
- 200-299: Inactive (auto-reject)
- 300-391: Deregistered (auto-reject, except fusion/delning)

✅ **60+ Legal Group Codes**
- AB: 20+ variants (standard → regulated)
- EF: Simplest (2 API calls)
- HB/KB: Partnerships (medium complexity)
- OVR: 40+ other forms (associations, foundations, public, foreign)

✅ **SNI 2007 Industry Codes**
- 700+ codes from SCB
- High-risk industries: 64xxx (finance), 66xxx (insurance), 47/56xxx (cash), 68xxx (real estate)
- Use for enhanced DD triggers

✅ **Employee Intervals**
- 9 standard intervals (0 → 500+)
- Indicates company size and complexity
- Correlates with KYC effort

✅ **County/Municipality Codes**
- 21 län, 290 kommuner
- Same as SPAR codes (SCB source)

**Next:** [test_company_information_api.sh](./test_company_information_api.sh) för live testning med 41 sandbox företag.
