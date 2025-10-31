# Riskfrågor - 3-stegs struktur (Omorganisering 2025-10-29)

## Bakgrund

Ursprunglig struktur hade **4 steg med duplicering och otydlig progression**:
- Steg 1: Grundläggande information (VD, verklig huvudman, PEP)
- Steg 2: Utländska transaktioner (blandade frågor)
- Steg 3: Kunder & Affärspartners (delvis duplicering från Steg 2)
- Steg 4: Betalningar & Transaktioner (blandade frågor)

**Problem:**
- Duplicering: Frågor om leverantörer/kunder i både Steg 2 och Steg 3
- Duplicering: Frågor om utländska bankkonton i både Steg 2 och Steg 4
- Otydlig tematik: Geografisk risk blandades med betalningsmetoder
- Svag pedagogisk progression: Ingen klar logik från bred → specifik

---

## Ny 3-stegs struktur (Implementerad)

### **🎯 STEG 1: Grundläggande information** (oförändrat)
**Tema:** Vem är kunden?

**Frågor (7 st):**
1. Vad är företagets huvudsakliga affärsidé?
2. Vilket företag representerar du? (autocomplete)
3. Vilka typer av kunder har företaget?
4. Har verksamheten ändrats under senaste 12 månaderna?
5. Personnummer (VD/Firmatecknare)
6. Är det du som är verklig huvudman?
7. Är någon nyckelperson PEP?

**Lagstöd:** 
- 3 kap. 4-13 §§ PTL (kundkännedom)
- 01FS 2024:20 (identifiering och kontroll)

**Progress:** [●○○] Steg 1/3

---

### **🌍 STEG 2: Geografisk risk & Affärsrelationer** (NY STRUKTUR)
**Tema:** Var gör ni affärer och med vem?

**BLOCK A: Allmän geografisk exponering**
1. **Har företaget utländska kunder?** (Ja/Nej + länder)
2. **Ungefär hur stor andel av omsättningen från utländska kunder?** (< 10% / 10-30% / 30-50% / > 50%)
3. **Typ av internationellt samarbete** (Import/Export/Konsult/Licens)

**BLOCK B: Konkreta affärspartners (Progressiv verifikation)**
4. **Vilka är företagets tre största leverantörer?** (Namn + land)
5. **Vilka är företagets tre största kunder?** (om B2B) (Namn + land)

**BLOCK C: Gränsöverskridande transaktioner**
6. **Förekommer överföringar till/från utländska bankkonton?** (Ja regelbundet/Ja ibland/Nej + länder)

**Pedagogisk logik:**
1. Börja brett: "Har ni utländska kunder?" (Ja/Nej)
2. Kvantifiera: "Hur stor andel?" (Ger kontext)
3. Kategorisera: "Vilken typ av samarbete?" (Import/Export etc)
4. **Progressiv verifikation:** "Namnge de tre största" (Konsistenskontroll!)
5. Konkretisera flöden: "Utländska bankkonton?" (Specifik transaktionsrisk)

**Lagstöd:**
- 2 kap. 1 §, 2 kap. 4-5 §§ PTL (geografiska riskfaktorer)
- 3 kap. 11 § PTL (högriskländer)
- 3 kap. 12 § PTL (affärsförbindelsens syfte och art)
- 3 kap. 16-17 §§ PTL (skärpta åtgärder)
- EU-kommissionens högrisklista

**Progress:** [●●○] Steg 2/3

---

### **💰 STEG 3: Betalningsflöden & Transaktionsmönster** (NY STRUKTUR)
**Tema:** Hur hanterar ni betalningar?

**Frågor (5 st):**
1. **Hur tar företaget betalt från kunder?** (Banköverföring/Swish/Kort/Faktura/Kontant/Krypto)
2. **Om kontanter: Ungefär hur stor andel av omsättningen?** (< 5% / 5-20% / 20-50% / > 50%)
3. **Tar företaget emot betalningar i utländsk valuta?** (Ja/Nej + vilka valutor?)
4. **Förekommer transaktioner över 150 000 kr?** (Ja/Nej/Ibland)
5. **Tar företaget emot betalningar från tredje part?** (Ja/Nej + exempel)

**Pedagogisk logik:**
- Börja med grundmetod: "Hur tar ni betalt?"
- Identifiera högrisk: "Kontanter?" (2 kap. 5 § punkt 2)
- Komplettera med valutarisk
- Storleksrisk: 150k SEK ≈ 15 000 euro (3 kap. 4 §)
- Strukturrisk: Tredjepartsbetalningar (3 kap. 7-8 §§)

**Lagstöd:**
- 2 kap. 3 § PTL (riskbedömning av kunder)
- 3 kap. 4 § PTL (15 000 euro threshold)
- 3 kap. 6 § PTL (5 000 euro threshold för kontanter)
- 3 kap. 31-32 §§ PTL (elektroniska pengar)
- 4 kap. 1 § PTL (övervakningsskyldighet)

**Progress:** [●●●] Steg 3/3

**Navigation:** Slutför & Nästa → Identitetskontroll

---

### **🎯 STEG 4: Fördjupad riskbedömning** (KONDITIONELL - inte implementerad än)
**Visas ENDAST om högrisk flaggats i steg 1-3**

**Triggers:**
- Högriskland identifierat (EU-kommissionens lista)
- >30% omsättning från utlandet
- Kontanter >20% av omsättning
- Kryptovaluta används
- Tredjepartsbetalningar förekommer
- PEP identifierad
- Verksamhetsändring senaste 12 månader + högrisk

**Potentiella frågor (EDD - Enhanced Due Diligence):**
- Beskriv affärsförbindelsens syfte mer detaljerat
- Varifrån kommer ert startkapital?
- Dokumentation av affärsrelationer (kontrakt, avtal)
- Förklaring av ovanliga transaktionsmönster
- Ytterligare information om verkliga huvudmän
- Ursprung för stora inbetalningar

**Lagstöd:**
- 3 kap. 16 § PTL (skärpta åtgärder vid hög risk)
- 3 kap. 19 § PTL (åtgärder vid PEP)
- 01FS 2024:20, 3 kap. 8 § (skärpta kundkännedomsåtgärder)

**Backend trigger:** 
```javascript
GET /api/onboarding/{id}/risk-assessment
Returns: { riskScore: 0-100, requiresEDD: boolean }
```

---

## Teknisk implementation

### **Frontend (React):**
```jsx
// Steg 1: /riskfragor/steg1
<RiskFragorSteg1 /> // Grundläggande info (7 frågor)

// Steg 2: /riskfragor/steg2
<RiskFragorSteg2 /> // Geografisk risk & Affärsrelationer (6 frågor, 3 block)

// Steg 3: /riskfragor/steg3
<RiskFragorSteg3 /> // Betalningsflöden (5 frågor)

// Konditionellt Steg 4: /riskfragor/enhanced
<RiskFragorEnhanced /> // Endast om backend returnerar requiresEDD: true
```

### **Backend endpoints:**
```
POST /api/onboarding/{id}/riskfragor/steg1
POST /api/onboarding/{id}/riskfragor/steg2
POST /api/onboarding/{id}/riskfragor/steg3
GET  /api/onboarding/{id}/risk-assessment
POST /api/onboarding/{id}/riskfragor/enhanced
```

### **Risk scoring algorithm (INTERN DOKUMENTATION - visas EJ för klient):**

**⚠️ VIKTIGT:** Denna algoritm och tröskelvärden (>30%, >20%, etc.) är **intern affärslogik** 
för byråer att förstå systemets EDD-triggers. Dessa värden ska **ALDRIG** visas i 
användargränssnittet vid genomgång med presumtiv klient, utan endast i separat 
"Dokumentation"-flik för byråpersonal.

```python
def calculate_risk_score(data):
    """
    Beräknar riskscore 0-100 baserat på svar i steg 1-3.
    Används för att avgöra om Enhanced Due Diligence (EDD) ska triggras.
    
    INTERN LOGIK - visas inte för klienten under onboarding.
    """
    score = 0
    
    # Geografisk risk (max 30 poäng)
    if data.has_foreign_customers:
        score += 10
    if data.foreign_revenue_percentage > 30:  # INTERN TRÖSKEL
        score += 10
    if data.has_high_risk_country:
        score += 10
    
    # Betalningsmetod risk (max 40 poäng)
    if 'kontanter' in data.payment_methods:
        score += 15
    if data.cash_percentage > 20:  # INTERN TRÖSKEL
        score += 10
    if 'kryptovaluta' in data.payment_methods:
        score += 10
    if data.third_party_payments:
        score += 5
    
    # Strukturell risk (max 30 poäng)
    if data.pep_identified:
        score += 15
    if data.business_changed_recently:
        score += 10
    if data.ownership_structure_complex:
        score += 5
    
    return {
        'riskScore': score,
        'requiresEDD': score >= 40,  # INTERN TRÖSKEL för EDD-trigger
        'riskLevel': 'high' if score >= 60 else 'medium' if score >= 30 else 'low'
    }
```

**Synlighet:**
- ✅ **Byråpersonal:** Ser algoritm och tröskelvärden i "Dokumentation"-flik
- ❌ **Klient:** Ser ENDAST frågorna, INTE varför vissa frågor kan trigga EDD

---

## Fördelar med ny struktur

✅ **Ingen duplicering** - Varje fråga finns på EN plats

✅ **Tydliga teman:**
- Steg 2 = **VAR** (Geografisk risk)
- Steg 3 = **HUR** (Betalningsmetoder/transaktionsmönster)

✅ **Pedagogisk progression:**
- Steg 2: Bred geografisk kartläggning → Specificera partners → Konkretisera transaktioner
- Steg 3: Betalningsmetoder (oberoende av geografi)

✅ **Stödjer riskbaserat tillvägagångssätt:**
- Lågriskkunder: 3 steg (18 frågor totalt)
- Högriskunder: 4 steg (18 + extra EDD-frågor)

✅ **Progressiv verifikation:**
- Steg 2 Block A: Bred kartläggning ("Har ni utländska kunder?")
- Steg 2 Block B: Konkret verifikation ("Namnge de tre största")
- Backend kan jämföra allmänna svar med specifika svar → flagga inkonsistenser

✅ **Bättre användarupplevelse:**
- Kortare standardflöde (3 steg vs 4 steg)
- Tydligare navigation (progress bar [●●○] istället för [●●○○])
- Fokuserade teman per steg (lättare att förstå varför frågorna ställs)

---

## Migration och testning

### **Databas migration:**
```sql
-- Gamla kolumner från Steg 3 flyttas till Steg 2
ALTER TABLE onboarding_responses 
  RENAME COLUMN step3_largest_suppliers TO step2_largest_suppliers;
  
ALTER TABLE onboarding_responses 
  RENAME COLUMN step3_largest_customers TO step2_largest_customers;

-- Gamla Steg 4 blir nya Steg 3
ALTER TABLE onboarding_responses 
  RENAME COLUMN step4_payment_methods TO step3_payment_methods;
```

### **Frontend routing:**
```jsx
// routes.jsx (uppdaterat)
<Route path="/onboarding/:id">
  <Route path="steg1" element={<RiskFragorSteg1 />} />
  <Route path="steg2" element={<RiskFragorSteg2 />} /> {/* Ny struktur */}
  <Route path="steg3" element={<RiskFragorSteg3 />} /> {/* Flyttad från gamla steg 4 */}
  <Route path="enhanced" element={<RiskFragorEnhanced />} /> {/* Konditionell */}
</Route>
```

### **Testfall:**
1. **Lågriskkund** (Svensk B2B, inga kontanter, inga utländska kunder)
   - Ska se 3 steg
   - Ska inte trigga EDD
   - Risk score: ~10-20

2. **Mediumriskkund** (Import/Export inom EU, banköverföringar)
   - Ska se 3 steg
   - Risk score: ~30-40
   - Kan trigga EDD beroende på omsättningsandel

3. **Högriskund** (Högriskland, kontanter >20%, krypto)
   - Ska se 4 steg (EDD triggas)
   - Risk score: 60+
   - Kräver byråchef godkännande

---

## Status och TODO

### ✅ **KLART:**
- LaTeX-specifikation uppdaterad (Onboarding_app_ny.tex)
- Steg 2: Ny struktur med 3 block (Geografisk exponering, Affärspartners, Transaktioner)
- Steg 3: Ny struktur med betalningsflöden (5 frågor)
- Progress indicators uppdaterade (3 steg istället för 4)
- Backend API-dokumentation uppdaterad
- Placeholders för lagtexter tillagda

### 🔄 **PÅGÅENDE:**
- Fylla på fullständiga lagtexter i alla placeholders
- Backend risk scoring algorithm (konditionell EDD-trigger)
- Frontend React-komponenter (RiskFragorSteg2, RiskFragorSteg3)

### 📋 **TODO:**
- Implementera konditionellt Steg 4 (Enhanced Due Diligence)
- Databas migration script
- Frontend routing uppdatering
- Testfall för risk scoring
- UX-testning av ny flöde

---

## Kontakt och frågor

**Dokumentägare:** Lasse (LIA-praktikant, examen December 2025)  
**Senast uppdaterad:** 2025-10-29  
**Relaterade dokument:**
- `/docs/specifications/Onboarding_app_ny.tex` (LaTeX-specifikation)
- `/docs/STRATEGI/BYOK_API_SPECIFICATION.md` (BYOK för Enterprise kunder)
- `/docs/compliance/RISK_FORMULATIONS_FROM_NRB.md` (TODO - väntar på OCR)

