# API Data Source Mapping - KYC Onboarding

> **Syfte:** Definiera vilken datakälla som ska användas för varje typ av information  
> **Uppdaterad:** 2025-10-23  
> **Användning:** Lookup-tabell för backend-implementation

---

## 📋 Quick Reference

| Data Category | Bolagsverket | Roaring.io | Roaring.io Bank API | Priority | Notes |
|---------------|--------------|------------|---------------------|----------|-------|
| **Företagsidentitet** | ✅ Primary | ❌ | ❌ | 1 | Orgnr, namn, adress |
| **Företagsstatus** | ✅ Primary | ❌ | ❌ | 1 | Aktivt, konkurs, likvidation |
| **Årsdokument** | ✅ Primary | ❌ | ❌ | 2 | Årsredovisningar (ZIP) |
| **Styrelseledamöter** | ❌ | ✅ Primary | ❌ | 1 | Namn, personnummer, roller |
| **Verkliga huvudmän** | ❌ | ✅ Primary | ❌ | 1 | Beneficial owners |
| **Näringsförbud** | ❌ | ✅ Primary | ❌ | 1 | Kritiskt för KYC |
| **PEP-screening** | ❌ | ✅ Primary | ❌ | 1 | Politiskt exponerade |
| **Sanktionslistor** | ❌ | ✅ Primary | ❌ | 1 | EU/UN sanctions |
| **AML-register** | ❌ | ✅ Primary | ❌ | 1 | Anti-money laundering |
| **Riskbedömning** | ❌ | ✅ Primary | ❌ | 2 | Risk indicators |
| **Företagsengagemang** | ❌ | ✅ Primary | ❌ | 2 | Andra företag för nyckelpersoner |
| **Ekonomisk info** | ❌ | ✅ Primary | ❌ | 2 | Nyckeltal, rating |
| **⭐ Bankkontoverifiering** | ❌ | ❌ | ✅ Primary | 1 | Real-time kontosaldo via Open Banking |
| **⭐ Transaktionshistorik** | ❌ | ❌ | ✅ Primary | 1 | 90 dagar transaktioner för riskanalys |
| **⭐ Kontobehörigad** | ❌ | ❌ | ✅ Primary | 1 | Verifiera att personen är kontobehörig |

---

## 🔍 Detaljerad Mappning

### 1. Företagsgrunddata

| Information | API | Endpoint | Method | Response Field | Required | Priority |
|-------------|-----|----------|--------|----------------|----------|----------|
| Organisationsnummer | Bolagsverket | `/organisationer` | POST | `organisationsidentitet.identitetsbeteckning` | ✅ | 1 |
| Företagsnamn | Bolagsverket | `/organisationer` | POST | `organisationsnamn.organisationsnamnLista[0].namn` | ✅ | 1 |
| Organisationsform | Bolagsverket | `/organisationer` | POST | `organisationsform.kod` + `.klartext` | ✅ | 1 |
| Juridisk form | Bolagsverket | `/organisationer` | POST | `juridiskForm.kod` + `.klartext` | ✅ | 1 |
| Postadress | Bolagsverket | `/organisationer` | POST | `postadressOrganisation.postadress` | ✅ | 1 |
| Registreringsdatum | Bolagsverket | `/organisationer` | POST | `organisationsdatum.registreringsdatum` | ✅ | 1 |
| SNI-kod (verksamhet) | Bolagsverket | `/organisationer` | POST | `naringsgrenOrganisation.sni[0]` | ✅ | 1 |
| Verksamhetsbeskrivning | Bolagsverket | `/organisationer` | POST | `verksamhetsbeskrivning.beskrivning` | - | 2 |

---

### 2. Företagsstatus (Högriskfaktorer)

| Information | API | Endpoint | Method | Response Field | Required | Priority |
|-------------|-----|----------|--------|----------------|----------|----------|
| Aktivt/verksamt | Bolagsverket | `/organisationer` | POST | `verksamOrganisation.kod` ("JA"/"NEJ") | ✅ | 1 |
| Avregistrerat | Bolagsverket | `/organisationer` | POST | `avregistreradOrganisation.avregistreringsdatum` | ✅ | 1 |
| Avregistreringsorsak | Bolagsverket | `/organisationer` | POST | `avregistreringsorsak.kod` + `.klartext` | ✅ | 1 |
| Pågående konkurs/likvidation | Bolagsverket | `/organisationer` | POST | `pagaendeAvvecklingsEllerOmstruktureringsforfarande` | ✅ | 1 |

**Högrisk-koder:**
- `KK` - Konkurs 🚨
- `LI` - Likvidation ⚠️
- `FR` - Företagsrekonstruktion ⚠️
- `AC` - Ackordsförhandling ⚠️

---

### 3. Dokument (Årsredovisningar)

| Information | API | Endpoint | Method | Response Field | Required | Priority |
|-------------|-----|----------|--------|----------------|----------|----------|
| Lista årsredovisningar | Bolagsverket | `/dokumentlista` | POST | `dokument[]` | - | 2 |
| Dokument-ID | Bolagsverket | `/dokumentlista` | POST | `dokument[].dokumentId` | - | 2 |
| Räkenskapsår | Bolagsverket | `/dokumentlista` | POST | `dokument[].rapporteringsperiodTom` | - | 2 |
| Ladda ner årsredovisning | Bolagsverket | `/dokument/{dokumentId}` | GET | Binary ZIP | - | 3 |

---

### 4. Personinformation (KYC-kritiskt)

| Information | API | Endpoint | Method | Response Field | Required | Priority |
|-------------|-----|----------|--------|----------------|----------|----------|
| Styrelseledamöter | Roaring.io | `/board-members` | GET | `records[]` | ✅ | 1 |
| Verkliga huvudmän | Roaring.io | `/beneficial-owner` | GET | `records[]` | ✅ | 1 |
| Firmatecknare | Roaring.io | `/signatories` | GET | `records[]` | ✅ | 1 |
| Ägarstruktur | Roaring.io | `/owner-structure` | GET | `records[]` | ✅ | 1 |

---

### 5. KYC-Screening (Kritiskt)

| Information | API | Endpoint | Method | Response Field | Required | Priority |
|-------------|-----|----------|--------|----------------|----------|----------|
| Näringsförbud (företag) | Roaring.io | `/se/businessprohibition/1.0/company/{companyId}` | GET | `records[]` | ✅ | 1 |
| Näringsförbud (person) | Roaring.io | `/se/businessprohibition/1.0/person/{personalNumber}` | GET | `records[]` | ✅ | 1 |
| PEP-screening | Roaring.io | `/pep` | GET | `records[]` | ✅ | 1 |
| Sanktionslistor | Roaring.io | `/sanctions-list` | GET | `records[]` | ✅ | 1 |
| AML-register | Roaring.io | `/aml-registry` | GET | `records[]` | ✅ | 1 |
| Riskindikatorer | Roaring.io | `/risk-indicators` | GET | `records[]` | ✅ | 1 |

---

### 6. Övrig Information

| Information | API | Endpoint | Method | Response Field | Required | Priority |
|-------------|-----|----------|--------|----------------|----------|----------|
| Företagsengagemang | Roaring.io | `/company-engagements` | GET | `records[]` | - | 2 |
| Företagsrating | Roaring.io | `/company-rating` | GET | `rating` | - | 2 |
| Ekonomisk info | Roaring.io | `/financial-information` | GET | `records[]` | - | 2 |
| Juridisk info | Roaring.io | `/legal-information` | GET | `records[]` | - | 2 |
| Fastighetsinnehav | Roaring.io | `/property-information` | GET | `records[]` | - | 3 |
| Rättsliga ärenden | Roaring.io | `/company-case-register` | GET | `records[]` | - | 3 |
| Etableringar | Roaring.io | `/establishments` | GET | `records[]` | - | 3 |
| Aktiekapital | Roaring.io | `/share-facts` | GET | `records[]` | - | 3 |

---

## 🔄 Anropsordning (Recommended Flow)

### **Steg 1: Grunddata (Bolagsverket)** ⚡ Snabbt & gratis
```
1. POST /organisationer → Företagsinfo + status
2. POST /dokumentlista → Lista årsredovisningar (optional)
```

**Output:** Företagets grunduppgifter + eventuella direkta röda flaggor (konkurs, likvidation)

---

### **Steg 2: Personidentifiering (Roaring.io)** 💰 Kostar 4 anrop
```
3. GET /board-members → Styrelse
4. GET /beneficial-owner → Verkliga huvudmän
5. GET /signatories → Firmatecknare
6. GET /owner-structure → Ägarstruktur
```

**Output:** Lista med personnummer för alla nyckelpersoner

---

### **Steg 3: KYC-Screening (Roaring.io)** 💰 Kostar 5 anrop + N personer
```
7. GET /business-prohibition (företag) → Näringsförbud för företagets personer
8. GET /sanctions-list → Sanktionslistor
9. GET /pep → PEP-screening
10. GET /aml-registry → AML-register
11. GET /risk-indicators → Övergripande risker

För varje nyckelperson:
12. GET /business-prohibition (person) → Individuell näringsförbud-koll
```

**Output:** KYC-godkänt eller avslag med motivering

---

### **Steg 4: Fördjupad analys (Optional)** 💰 Kostar 5+ anrop
```
13. GET /company-rating → Kreditrating
14. GET /financial-information → Ekonomiska nyckeltal
15. GET /company-engagements → Andra företag för nyckelpersoner
16. GET /legal-information → Juridisk info
17. GET /company-case-register → Rättsliga ärenden
```

**Output:** Fördjupad riskbedömning

---

## 💰 Kostnadskalkyl (per företag)

### **Minimum KYC (12 anrop Roaring.io):**
```
Steg 1: 0 kr (Bolagsverket gratis)
Steg 2: 4 anrop (personidentifiering)
Steg 3: 8 anrop (5 företag + 3 personer genomsnitt)
Total: 12 Roaring.io-anrop
```

**Med 500 anrop:** ~41 företag (minimum KYC)

### **Komplett KYC (20 anrop Roaring.io):**
```
Steg 1: 0 kr
Steg 2: 4 anrop
Steg 3: 11 anrop (5 företag + 6 personer genomsnitt)
Steg 4: 5 anrop (fördjupad analys)
Total: 20 Roaring.io-anrop
```

**Med 500 anrop:** ~25 företag (komplett KYC)

---

## 🎯 Implementeringsstrategi

### **Backend Proxy Pattern:**
```python
# Endpoint: POST /api/kyc/company
# Input: { "organisationsnummer": "556903-8671" }
# Output: Komplett KYC-rapport

async def perform_kyc_check(org_nr: str):
    # Steg 1: Bolagsverket (gratis)
    company_info = await bolagsverket_client.get_organisation(org_nr)
    documents = await bolagsverket_client.get_dokumentlista(org_nr)
    
    # Steg 2: Roaring.io - Personer
    board_members = await roaring_client.get_board_members(org_nr)
    beneficial_owners = await roaring_client.get_beneficial_owners(org_nr)
    signatories = await roaring_client.get_signatories(org_nr)
    
    # Steg 3: Roaring.io - Screening
    company_prohibition = await roaring_client.check_business_prohibition_company(org_nr)
    sanctions = await roaring_client.check_sanctions(org_nr)
    pep = await roaring_client.check_pep(org_nr)
    aml = await roaring_client.check_aml(org_nr)
    
    # För varje nyckelperson
    for person in all_key_persons:
        person_prohibition = await roaring_client.check_business_prohibition_person(person.ssn)
    
    # Bygg rapport
    return {
        "company": company_info,
        "kyc_status": calculate_kyc_status(...),
        "red_flags": identify_red_flags(...),
        "risk_level": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
    }
```

---

## 🚨 Röda Flaggor (Auto-reject)

| Källa | Flagga | Åtgärd |
|-------|--------|--------|
| Bolagsverket | `verksamOrganisation.kod = "NEJ"` | ❌ Reject - Ej verksamt |
| Bolagsverket | `pagaendeAvvecklingsEllerOmstruktureringsforfarande.kod = "KK"` | ❌ Reject - Konkurs |
| Bolagsverket | `avregistreringsorsak.kod = "KKAV"` | ❌ Reject - Konkurs tidigare |
| Roaring.io | Näringsförbud styrelseordförande | ❌ Reject - Kritiskt |
| Roaring.io | Sanktionslista match | ❌ Reject - Compliance |
| Roaring.io | PEP utan fördjupad granskning | ⚠️ Manual review |
| Roaring.io | AML-register match | ❌ Reject - Penningtvätt |

---

## 📝 TODO

- [ ] Verifiera exakta endpoint-paths för Roaring.io (alla 18)
- [ ] Dokumentera response schemas för varje endpoint
- [ ] Skapa Python lookup-dictionary för mapping
- [ ] Implementera caching-strategi (undvik dubbelanrop)
- [ ] Definiera timeout-strategier per API
- [ ] Skapa retry-logic för failed requests
- [ ] Implementera rate-limiting på backend

---

## 🔄 Uppdateringar

- **2025-10-23:** Initial version skapad
- **Nästa:** Fylla på med exakta response fields från Roaring.io

