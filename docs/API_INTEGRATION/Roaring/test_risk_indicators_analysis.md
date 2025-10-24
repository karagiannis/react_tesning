# Roaring Risk Indicators - Test Plan & Analysis

## Test Suite Overview

Detta test-script verifierar vår förståelse av Roarings Risk Indicators API genom att:
1. Lista templates
2. Hämta template-konfigurationer
3. Applicera templates på 5 olika företag med olika risk-profiler
4. Jämföra resultaten mot våra förutsägelser

## Test Coverage

### Templates (2 st)
- **Weaker Template** (`a0b55461-b2c3-409e-871b-3083ab5779fb`)
  - Högre thresholds
  - Lägre weights
  - Mer förlåtande

- **Full Template** (`4ecbaaaa-139f-4196-b365-477c87878919`)
  - Lägre thresholds
  - Högre weights
  - Strängare bedömning

### Companies (5 st)

| CompanyId | Risk Profile | Key Characteristics | Expected Score Range |
|-----------|-------------|---------------------|---------------------|
| 5564881422 | LOW | Perfect stability, growth, no issues | 0-5 points |
| 5567164818 | LOW-MEDIUM | New company (1.5 years), no history | 10-20 points |
| 5560572850 | HIGH/REJECT | Liquidation (status 352), 7 bankruptcies | 55-100 points |
| 5564866803 | MEDIUM-HIGH | No tax registrations, missing auditor | 25-50 points |
| 5564779444 | MEDIUM | 2 PEPs, 1 bankruptcy, but growth | 20-35 points |

### Test Matrix (10 kombinationer)

| Company | Template | Expected Decision | Expected Score | Key Alarms |
|---------|----------|------------------|----------------|------------|
| 5564881422 | Weaker | APPROVED | ~0 | None |
| 5564881422 | Full | APPROVED | ~0 | None |
| 5567164818 | Weaker | APPROVED_WITH_UNCERTAINTY | ~11 | Company age < 2 years |
| 5567164818 | Full | APPROVED_WITH_UNCERTAINTY | ~15 | Company age < 2 years, missing auditor |
| 5560572850 | Weaker | HIGH_RISK | ~55 | Bankruptcies, board changes, declining revenue |
| 5560572850 | Full | REJECT | 100 | Status 352 (auto-reject) |
| 5564866803 | Weaker | MANUAL_REVIEW | ~28 | All tax regs missing (need all 3) |
| 5564866803 | Full | ENHANCED_DD | ~48 | Each tax reg missing triggers |
| 5564779444 | Weaker | MANUAL_REVIEW | ~18 | 2 PEPs (threshold 3 för Weaker) |
| 5564779444 | Full | ENHANCED_DD | ~32 | 2 PEPs (threshold 1 för Full) |

## Förväntade Alarm-Triggers per Company

### 5564881422 (Perfect Company)
**Weaker Template:**
- ✅ Inga alarms

**Full Template:**
- ✅ Inga alarms

**Reasoning:** Perfekt företag - 0 konkurser, stabilt, tillväxt, inga tvister

---

### 5567164818 (New Company)
**Weaker Template:**
```json
{
  "alarms": [
    {
      "indicator": "registrationDate",
      "reason": "Company age < 2 years",
      "weight": 5
    }
  ]
}
```

**Full Template:**
```json
{
  "alarms": [
    {
      "indicator": "registrationDate",
      "reason": "Company age < 2 years",
      "weight": 5
    },
    {
      "indicator": "missingAuditor",
      "reason": "No auditor (but acceptable for small company)",
      "weight": 3
    }
  ]
}
```

**Reasoning:** Nytt företag med begränsad historik, men inga röda flaggor

---

### 5560572850 (Liquidation Company)
**Weaker Template:**
```json
{
  "alarms": [
    {
      "indicator": "connectedBankruptcyCompanies",
      "value": 7,
      "threshold": 7,
      "reason": "7 connected bankruptcies (threshold met)",
      "weight": 15
    },
    {
      "indicator": "bankruptciesPerReference",
      "value": 10,
      "threshold": 7,
      "reason": "10 personal bankruptcies (exceeds threshold)",
      "weight": 12
    },
    {
      "indicator": "boardChangeCount",
      "value": 8,
      "threshold": 5,
      "period": "6months",
      "reason": "8 board changes in 7 months",
      "weight": 10
    },
    {
      "indicator": "industryCodeChanges",
      "value": 2,
      "threshold": 1,
      "reason": "Multiple industry changes",
      "weight": 5
    },
    {
      "indicator": "revenueByEmployee",
      "trend": -60,
      "threshold": -60,
      "reason": "Revenue declining by 60%",
      "weight": 6
    },
    {
      "indicator": "orgStatusChanges",
      "value": 352,
      "threshold": 300,
      "reason": "Company in liquidation",
      "weight": 50
    }
  ]
}
```

**Full Template:**
```json
{
  "alarms": [
    {
      "indicator": "orgStatusChanges",
      "value": 352,
      "threshold": 300,
      "reason": "Company in liquidation - AUTO-REJECT",
      "weight": 100
    }
  ]
}
```

**Reasoning:** 
- Weaker: Alla indikatorer triggar men inte auto-reject
- Full: Status 352 = omedelbar reject (andra indikatorer irrelevanta)

---

### 5564866803 (No Registrations)
**Weaker Template:**
```json
{
  "alarms": [
    {
      "indicator": "regulatoryCompliance",
      "reason": "All tax registrations missing (vatReg=false, fTaxReg=false, arbAvgReg=false)",
      "context": "age > 5 AND all_three_missing",
      "weight": 20
    },
    {
      "indicator": "revenueByEmployee",
      "trend": -58,
      "threshold": -60,
      "reason": "Revenue declining by 58% (just under threshold)",
      "weight": 0
    },
    {
      "indicator": "missingAuditor",
      "value": true,
      "context": "age > 10",
      "reason": "15-year-old company without auditor",
      "weight": 8
    }
  ]
}
```

**Full Template:**
```json
{
  "alarms": [
    {
      "indicator": "vatReg",
      "value": false,
      "context": "age > 5",
      "reason": "VAT registration missing for established company",
      "weight": 15
    },
    {
      "indicator": "fTaxReg",
      "value": false,
      "context": "age > 5",
      "reason": "F-tax registration missing",
      "weight": 15
    },
    {
      "indicator": "arbAvgReg",
      "value": false,
      "context": "age > 5",
      "reason": "Employer registration missing",
      "weight": 10
    },
    {
      "indicator": "missingAuditor",
      "value": true,
      "context": "age > 10",
      "reason": "Established company without auditor",
      "weight": 12
    },
    {
      "indicator": "revenueByEmployee",
      "trend": -58,
      "threshold": -40,
      "reason": "Revenue declining by 58%",
      "weight": 12
    }
  ]
}
```

**Reasoning:**
- Weaker: Kräver ALLA tre registreringar saknas för att trigga (kombinerad regel)
- Full: Varje saknad registrering triggar separat alarm

---

### 5564779444 (Growth + PEP)
**Weaker Template:**
```json
{
  "alarms": [
    {
      "indicator": "connectedBankruptcyCompanies",
      "value": 1,
      "threshold": 1,
      "reason": "1 connected bankruptcy (minor concern)",
      "weight": 5
    },
    {
      "indicator": "boardChangeCount",
      "value": 5,
      "threshold": 5,
      "period": "16months",
      "reason": "5 board changes in 16 months",
      "weight": 5
    },
    {
      "indicator": "legalCount",
      "value": 2,
      "threshold": 2,
      "reason": "2 legal documents",
      "weight": 2
    }
  ]
}
```
**Note:** PEP threshold för Weaker är 3, så 2 PEPs triggar INTE alarm

**Full Template:**
```json
{
  "alarms": [
    {
      "indicator": "pepCount",
      "value": 2,
      "threshold": 1,
      "reason": "2 PEPs detected - Enhanced DD required",
      "weight": 16
    },
    {
      "indicator": "connectedBankruptcyCompanies",
      "value": 1,
      "threshold": 1,
      "reason": "1 connected bankruptcy",
      "weight": 5
    },
    {
      "indicator": "bankruptciesPerReference",
      "value": 1,
      "threshold": 1,
      "reason": "1 personal bankruptcy",
      "weight": 3
    },
    {
      "indicator": "boardChangeCount",
      "value": 5,
      "threshold": 3,
      "period": "16months",
      "reason": "5 board changes (somewhat unstable)",
      "weight": 8
    }
  ]
}
```

**Reasoning:**
- Weaker: PEP threshold 3 → 2 PEPs inte tillräckligt
- Full: PEP threshold 1 → 2 PEPs triggar omedelbart Enhanced DD

---

## Expected vs Actual Results - Validation Checklist

När vi kör testerna, verifiera följande:

### ✅ Response Structure
- [ ] `companyId` matchar request
- [ ] `indicators[]` array finns
- [ ] Varje indicator har `name`, `value`, `alarm`, `message`
- [ ] `status` object med `code` och `text`

### ✅ Template Differences
- [ ] Weaker template har FÄRRE alarms än Full för samma företag
- [ ] Score för Weaker < Score för Full (samma företag)
- [ ] Decision för Weaker är mer förlåtande än Full

### ✅ Decision Logic
- [ ] Status 352 (Liquidation) → REJECT för Full template
- [ ] PEP ≥ 1 → Enhanced DD för Full template
- [ ] PEP ≥ 3 → Enhanced DD för Weaker template
- [ ] Triple non-compliance (no VAT + F-tax + employer) → alarm för båda templates

### ✅ Context Rules
- [ ] Missing auditor för nytt företag (< 2 år) → låg vikt
- [ ] Missing auditor för gammalt företag (> 10 år) → hög vikt
- [ ] No tax registrations för nytt företag → låg/ingen alarm
- [ ] No tax registrations för gammalt företag → hög alarm

### ✅ Trend Analysis
- [ ] Revenue declining -60% → alarm för båda (olika thresholds)
- [ ] Revenue growing +28% → ingen alarm (positivt)
- [ ] Board changes trend detekteras korrekt

---

## Vad VI lär oss från test-resultaten

Efter att ha kört testerna, analysera:

1. **Exakta threshold-värden:**
   ```python
   # Dokumentera faktiska thresholds vi ser:
   THRESHOLDS = {
       "weaker": {
           "bankruptcies": ?,
           "pep": ?,
           "board_changes": ?,
           # etc
       },
       "full": {
           "bankruptcies": ?,
           "pep": ?,
           # etc
       }
   }
   ```

2. **Weight-värden per indikator:**
   ```python
   WEIGHTS = {
       "weaker": {
           "bankruptcies": ?,
           "pep": ?,
           # etc
       },
       "full": {
           "bankruptcies": ?,
           "pep": ?,
           # etc
       }
   }
   ```

3. **Decision boundaries:**
   ```python
   DECISION_SCORES = {
       "approved": 0-19,
       "manual_review": 20-39,
       "enhanced_dd": 40-59,
       "reject": 60+
   }
   # Verifiera om detta stämmer!
   ```

4. **Context rule syntax:**
   ```python
   # Hur skriver Roaring context-villkor?
   # "age > 5"
   # "age > 5 AND all_regs_false"
   # "industry IN ['47', '56']"
   # etc
   ```

5. **Alarm messages:**
   - Vilka messages använder Roaring?
   - Kan vi göra bättre (mer specifika)?
   - Ska vi inkludera lagtext-hänvisningar?

---

## Nästa steg efter testning

1. **Dokumentera faktiska resultat** i ny fil `test_results.md`
2. **Uppdatera vår threshold-tabell** med exakta värden
3. **Identifiera gaps** - vad kan VI göra bättre?
4. **Planera VÅR implementation** baserat på insights
5. **Fortsätt med Beneficial Owner API** (nästa PML-kritiska endpoint)

---

## Körning

```bash
# Sätt access token (hämta från Roaring Portal)
export ROARING_ACCESS_TOKEN='your-token-here'

# Gör scriptet körbart
chmod +x test_risk_indicators.sh

# Kör testerna
./test_risk_indicators.sh

# Spara output för analys
./test_risk_indicators.sh > test_results_$(date +%Y%m%d_%H%M%S).json
```

---

## VÅR Competitive Advantage (påminnelse)

Efter testerna, kom ihåg:

**Roaring kan:**
- ✅ Evaluera 13 public indicators
- ✅ Två fördefinierade templates
- ✅ Context-aware rules

**VI kan OCKSÅ:**
- ✅ Evaluera samma 13 public indicators (via Roaring API)
- ✅ Obegränsat antal templates
- ✅ Context-aware rules

**Bara VI kan:**
- ✅ 22 bokförings-specifika flaggor (från SIE-filer)
- ✅ 10 cross-validation regler (Roaring + bokföring)
- ✅ Real-time detection (vid bokföringstillfälle, inte daglig batch)
- ✅ VISMA-facit validation (customer trust)
- ✅ AI-assistent med PML-kunskap

**Result:**
```
Roaring: 13 regler → Score 48 → "ENHANCED_DD"
Celestial: 45 regler → Score 72 → "REJECT" (caught fraud!)
```

🎯
