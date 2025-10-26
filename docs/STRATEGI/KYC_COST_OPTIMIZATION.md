# KYC Cost Optimization Strategy

> **Budget:** 500 Roaring.io API calls  
> **Goal:** Maximize number of customers verified while maintaining compliance  
> **Last Updated:** 2025-10-23

---

## 💰 Executive Summary

**Current Budget:** 500 API calls purchased

**Optimization Results:**
- ✅ **Enskild firma:** 2 calls per company → **250 companies max**
- ✅ **Aktiebolag (simple):** 4 calls per company → **125 companies max**
- ⚠️ **Aktiebolag (complex):** 8-12 calls per company → **41-62 companies**
- 🎯 **Average mix:** ~6 calls per company → **~83 companies**

**Key Strategy:** Early rejection + caching + company endpoint usage

---

## 🎯 Optimized Decision Tree

```
┌─────────────────────────────────────────────────────────────────┐
│ INPUT: Personnummer + Company Type (Enskild Firma/Aktiebolag)  │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ CALL 1: Population Register - Person Check                     │
│ GET /person/2.0/current/{personnummer}                         │
│ Cost: 1 call                                                    │
└─────────────────────────────────────────────────────────────────┘
                            ↓
        Check CRITICAL Red Flags (STOP EARLY):
        • deRegistrationReasonCode == 'FI' (falsk identitet)
        • deRegistrationReasonCode == 'OB' (försvunnen)
        • deRegistrationReasonCode == 'AV' (avliden)
        • residenceStatusCode == 'UNKNOWN'
                            ↓
                    ┌───────┴───────┐
                    │  Critical?    │
                    └───────┬───────┘
                         YES│    NO
                            ↓      ↓
                      ❌ REJECT  Continue
                      Cost: 1    Cost: 1
                                   ↓
┌─────────────────────────────────────────────────────────────────┐
│ CALL 2: Business Prohibition - Person Check                    │
│ GET /se/businessprohibition/1.0/person/{personnummer}          │
│ Cost: 1 call (total: 2)                                        │
└─────────────────────────────────────────────────────────────────┘
                            ↓
        Check Näringsförbud:
        • records.length > 0 AND active AND no exemption
                            ↓
                    ┌───────┴───────┐
                    │  Prohibition? │
                    └───────┬───────┘
                         YES│    NO
                            ↓      ↓
                      ❌ REJECT  Continue
                      Cost: 2    Cost: 2
                                   ↓
        ┌───────────────────────────────────────────┐
        │ Company Type?                              │
        └───────────────────────────────────────────┘
                ↓                          ↓
        ┌───────┴─────────┐       ┌────────┴─────────┐
        │ ENSKILD FIRMA   │       │   AKTIEBOLAG     │
        └─────────────────┘       └──────────────────┘
                ↓                          ↓
        ✅ APPROVE                ┌────────────────────────┐
        Cost: 2                   │ CALL 3: BP Company     │
        🎯 STOP HERE              │ GET /company/{orgnr}   │
                                  │ Cost: 1 (total: 3)     │
                                  └────────────────────────┘
                                           ↓
                        Check ALL representatives at once:
                        FOR EACH person.relationsToCompany:
                          IF relation.isCurrent AND has_prohibition:
                            → CRITICAL
                                           ↓
                                  ┌────────┴────────┐
                                  │ Current Rep     │
                                  │ with Förbud?    │
                                  └────────┬────────┘
                                       YES│    NO
                                          ↓      ↓
                                    ❌ REJECT  Continue
                                    Cost: 3    Cost: 3
                                                 ↓
                        ┌────────────────────────────────────┐
                        │ CALL 4: Beneficial Owner           │
                        │ GET /beneficialowner/1.0/{orgnr}   │
                        │ Cost: 1 (total: 4)                 │
                        └────────────────────────────────────┘
                                     ↓
                        FOR EACH beneficial_owner:
                          IF personnummer NOT in cache:
                            CALL 5-6: SPAR + BP (+2 calls)
                                     ↓
                                ┌────┴────┐
                                │ BO has  │
                                │ flags?  │
                                └────┬────┘
                                 YES│  NO
                                    ↓    ↓
                              ❌ REJECT ✅ APPROVE
                              Cost: 6   Cost: 4-6
```

---

## 📋 Cost Analysis per Company Type

### 1️⃣ Enskild Firma (Sole Proprietorship)

**Minimum Cost:** 2 calls  
**Maximum Companies:** 500 ÷ 2 = **250 companies** ✅

```python
def check_enskild_firma(personnummer: str) -> Decision:
    """
    Enskild firma = 1 person = minimal checks
    Total cost: 2 API calls
    """
    call_count = 0
    
    # CALL 1: Population Register
    spar = population_register_api.get_current(personnummer)
    call_count += 1
    
    # EARLY REJECTION - Save 1 call!
    if spar.details.deRegistrationReasonCode in ['FI', 'OB', 'AV']:
        return Decision(
            status='REJECT',
            reason='Person has critical SPAR flag (FI/OB/AV)',
            cost=call_count,
            savings=1  # Saved BP call
        )
    
    # CALL 2: Business Prohibition
    bp = business_prohibition_api.check_person(personnummer)
    call_count += 1
    
    # Check for active prohibition
    if bp.records:
        record = bp.records[0]
        if is_active_prohibition(record) and not has_valid_exemption(record):
            return Decision(
                status='REJECT',
                reason='Active näringsförbud without exemption',
                cost=call_count
            )
    
    # All checks passed
    return Decision(
        status='APPROVE',
        reason='No red flags found',
        cost=call_count
    )
```

**API Calls:**
1. `GET /person/2.0/current/{personnummer}` = 1 call
2. `GET /se/businessprohibition/1.0/person/{personnummer}` = 1 call

**Total: 2 calls** ✅

**Early Rejection Savings:**
- If SPAR flag found → Reject at call 1 → **Save 1 call** (50% savings!)

---

### 2️⃣ Aktiebolag - Simple Structure (Representative = Owner)

**Minimum Cost:** 4 calls  
**Maximum Companies:** 500 ÷ 4 = **125 companies** ✅

```python
def check_aktiebolag_simple(orgnr: str, representative_personnummer: str) -> Decision:
    """
    Aktiebolag där representant = beneficial owner (vanligt i små bolag)
    Total cost: 4 API calls (best case with caching)
    """
    call_count = 0
    person_cache = {}
    
    # CALL 1-2: Check Representative (SPAR + BP)
    rep_check = check_person_with_cache(representative_personnummer, person_cache)
    call_count += 2
    
    # EARLY REJECTION
    if rep_check.has_critical_flag:
        return Decision(
            status='REJECT',
            reason=f'Representative has red flag: {rep_check.flag_reason}',
            cost=call_count,
            savings=2  # Saved company BP + beneficial owner calls
        )
    
    # CALL 3: Business Prohibition Company Check
    # 🎯 KEY OPTIMIZATION: This checks ALL representatives at once!
    bp_company = business_prohibition_api.check_company(
        company_id=orgnr,
        relations_history_years=2  # Default - catches recent departures
    )
    call_count += 1
    
    # EARLY REJECTION - Current rep with prohibition
    if bp_company.records:
        for person_with_bp in bp_company.records[0].personsWithBusinessProhibition:
            for relation in person_with_bp.relationsToCompany:
                if relation.isCurrent:  # Current representative has förbud
                    return Decision(
                        status='REJECT',
                        reason=f'Current {relation.relation} has näringsförbud',
                        cost=call_count,
                        savings=1  # Saved beneficial owner call
                    )
    
    # CALL 4: Beneficial Owner (PML compliance)
    beneficial_owners = beneficial_owner_api.get(orgnr)
    call_count += 1
    
    # Check each beneficial owner
    for bo in beneficial_owners.persons:
        # 🎯 CACHE HIT - Representative is also BO (common case!)
        if bo.personId == representative_personnummer:
            # Use cached data - NO ADDITIONAL CALLS!
            continue
        
        # New person - need to check
        bo_check = check_person_with_cache(bo.personId, person_cache)
        call_count += 2  # SPAR + BP
        
        # EARLY REJECTION
        if bo_check.has_critical_flag:
            return Decision(
                status='REJECT',
                reason=f'Beneficial owner has red flag: {bo_check.flag_reason}',
                cost=call_count
            )
    
    # All checks passed
    return Decision(
        status='APPROVE',
        reason='No red flags found',
        cost=call_count
    )
```

**API Calls (Best Case - Rep = BO):**
1. `GET /person/2.0/current/{personnummer}` = 1 call
2. `GET /se/businessprohibition/1.0/person/{personnummer}` = 1 call
3. `GET /se/businessprohibition/1.0/company/{orgnr}?relationsHistoryYears=2` = 1 call
4. `GET /se/beneficialowner/1.0/{orgnr}` = 1 call
5. Beneficial owner check → **Cache hit!** = 0 calls

**Total: 4 calls** ✅

**Early Rejection Savings:**
- If rep has SPAR flag → Reject at call 2 → **Save 2 calls** (50% savings!)
- If current rep has BP → Reject at call 3 → **Save 1 call** (25% savings!)

---

### 3️⃣ Aktiebolag - Complex Structure (Multiple Owners)

**Average Cost:** 8 calls  
**Maximum Companies:** 500 ÷ 8 = **62 companies** ⚠️

```python
def check_aktiebolag_complex(orgnr: str, representative_personnummer: str) -> Decision:
    """
    Aktiebolag med flera beneficial owners (typ 3 unika personer)
    Total cost: 8 API calls (realistic case)
    """
    call_count = 0
    person_cache = {}
    
    # CALL 1-2: Check Representative
    rep_check = check_person_with_cache(representative_personnummer, person_cache)
    call_count += 2
    
    if rep_check.has_critical_flag:
        return Decision('REJECT', cost=call_count, savings=6)
    
    # CALL 3: BP Company
    bp_company = business_prohibition_api.check_company(orgnr, relations_history_years=2)
    call_count += 1
    
    if has_current_rep_with_prohibition(bp_company):
        return Decision('REJECT', cost=call_count, savings=5)
    
    # CALL 4: Beneficial Owner
    beneficial_owners = beneficial_owner_api.get(orgnr)
    call_count += 1
    
    # Scenario: 3 beneficial owners (rep + 2 others)
    for bo in beneficial_owners.persons:
        if bo.personId not in person_cache:
            # CALL 5-6: BO #1 (SPAR + BP)
            # CALL 7-8: BO #2 (SPAR + BP)
            bo_check = check_person_with_cache(bo.personId, person_cache)
            call_count += 2
            
            if bo_check.has_critical_flag:
                return Decision('REJECT', cost=call_count, savings=(8 - call_count))
    
    return Decision('APPROVE', cost=call_count)
```

**API Calls (Complex Case):**
1-2. Representative: SPAR + BP = 2 calls
3. Company BP check = 1 call
4. Beneficial Owner API = 1 call
5-6. BO #1 (if different person): SPAR + BP = 2 calls
7-8. BO #2 (if different person): SPAR + BP = 2 calls

**Total: 8 calls** ⚠️

**Worst Case (5 beneficial owners):** 4 + (4 × 2) = **12 calls** 🚨

---

### 4️⃣ Aktiebolag - Enhanced Due Diligence

**Cost:** 10-15 calls  
**Use only for:** High-risk industries, large transactions, PEP connections

```python
def check_aktiebolag_enhanced(orgnr: str, representative_personnummer: str) -> Decision:
    """
    Enhanced Due Diligence för high-risk cases
    Total cost: 10-15 API calls
    """
    # Run basic checks first (4-8 calls)
    basic_decision = check_aktiebolag_complex(orgnr, representative_personnummer)
    call_count = basic_decision.cost
    
    if basic_decision.status == 'REJECT':
        return basic_decision
    
    # ADDITIONAL CHECKS (only if basic checks pass)
    
    # CALL +1: Board Members
    board_members = board_members_api.get(orgnr)
    call_count += 1
    
    # Check each board member not already in cache
    for member in board_members.persons:
        if member.personId not in person_cache:
            member_check = check_person_with_cache(member.personId, person_cache)
            call_count += 2  # SPAR + BP
    
    # CALL +1: Signatories (Firmatecknare)
    signatories = signatories_api.get(orgnr)
    call_count += 1
    
    # Check each signatory
    for signatory in signatories.persons:
        if signatory.personId not in person_cache:
            sig_check = check_person_with_cache(signatory.personId, person_cache)
            call_count += 2  # SPAR + BP
    
    return Decision('APPROVE', cost=call_count)
```

**Only use Enhanced DD when:**
- ✅ High-risk industry (finans, krypto, värdetransport, fastigheter)
- ✅ Large transaction (>500k SEK)
- ✅ PEP connection detected
- ✅ Multiple red flags requiring deeper investigation

---

## 🔍 Key Optimization Techniques

### 1. Early Rejection Pattern

**Stop processing as soon as critical flag found:**

```python
# Priority 1: SPAR Critical Flags (after call 1)
if deRegistrationReasonCode in ['FI', 'OB', 'AV']:
    return Decision('REJECT', cost=1, savings=1-11)  # Save remaining calls!

# Priority 2: Active Näringsförbud (after call 2)
if has_active_prohibition_without_exemption:
    return Decision('REJECT', cost=2, savings=2-10)

# Priority 3: Current Rep with Prohibition (after call 3)
if current_representative_has_prohibition:
    return Decision('REJECT', cost=3, savings=1-9)

# Priority 4: Beneficial Owner Red Flag (after calls 4-6)
if beneficial_owner_has_critical_flag:
    return Decision('REJECT', cost=4-6, savings=0-6)
```

**Impact:**
- Early rejection at call 1 → **Save 50-92% of costs!**
- Average rejection happens at call 2-3 → **Save 25-75% of costs**

---

### 2. Caching Strategy

**Avoid duplicate checks for same person:**

```python
# Global cache for person checks
person_cache = {}

def check_person_with_cache(personnummer: str, cache: dict) -> PersonCheck:
    """
    Check person data with caching
    Returns cached result if available, otherwise performs API calls
    """
    # Cache hit - no API calls needed!
    if personnummer in cache:
        return cache[personnummer]  # Cost: 0 calls ✅
    
    # Cache miss - perform checks
    spar = population_register_api.get_current(personnummer)  # +1 call
    bp = business_prohibition_api.check_person(personnummer)  # +1 call
    
    # Analyze results
    result = PersonCheck(
        personnummer=personnummer,
        spar_data=spar,
        bp_data=bp,
        has_critical_flag=analyze_flags(spar, bp)
    )
    
    # Store in cache for future use
    cache[personnummer] = result
    
    return result  # Cost: 2 calls
```

**Common Cache Hits:**
- Representative = Beneficial Owner (very common in small companies)
- Board Member = Beneficial Owner
- Representative = Signatory

**Impact:**
- Each cache hit → **Save 2 calls** (SPAR + BP)
- Average 1-2 cache hits per company → **Save 2-4 calls (25-50%)**

---

### 3. Company Endpoint Usage

**Use `/company` endpoint instead of individual checks:**

```python
# ❌ INEFFICIENT: Check each representative individually
board_members = get_board_members(orgnr)  # 1 call
for member in board_members:
    bp = check_person(member.personnummer)  # 1 call per person
# Total: 1 + N calls

# ✅ EFFICIENT: Use company endpoint
bp_company = business_prohibition_api.check_company(
    orgnr,
    relations_history_years=2
)  # 1 call - checks ALL representatives at once!
```

**Impact:**
- Company with 5 board members: **Save 4 calls** (5 individual → 1 company call)
- Company endpoint returns only persons **with** prohibition → pre-filtered results

---

### 4. Conditional Enhanced DD

**Only run expensive checks when necessary:**

```python
def should_run_enhanced_dd(company: Company, transaction: Transaction) -> bool:
    """
    Decide if enhanced due diligence is needed
    """
    # High-risk industry
    high_risk_industries = [
        'FINANS', 'KRYPTO', 'VÄRDETRANSPORT', 'FASTIGHETER',
        'SPELVERKSAMHET', 'KONST_HANDEL', 'SMYCKEN'
    ]
    if company.industry in high_risk_industries:
        return True
    
    # Large transaction
    if transaction.amount > 500_000:  # SEK
        return True
    
    # PEP connection detected in basic checks
    if company.has_pep_connection:
        return True
    
    # Multiple medium-risk flags
    if company.risk_flags_count >= 3:
        return True
    
    return False

# Use conditional DD
if should_run_enhanced_dd(company, transaction):
    result = check_aktiebolag_enhanced(orgnr, personnummer)  # 10-15 calls
else:
    result = check_aktiebolag_simple(orgnr, personnummer)     # 4-8 calls
```

**Impact:**
- Run enhanced DD on only ~20% of companies
- Average cost reduced from 12 → 6 calls
- **Save 50% of budget!**

---

## 📊 Budget Planning

### Scenario 1: Mixed Portfolio (Realistic)

**Assumptions:**
- 40% Enskild firma (2 calls each)
- 40% Aktiebolag simple (4 calls each)
- 15% Aktiebolag complex (8 calls each)
- 5% Enhanced DD (12 calls each)
- 30% early rejection rate (saves 50% on rejected)

**Calculation:**
```
Enskild firma: 0.40 × 2 calls × 0.70 (no early reject) = 0.56 calls
               + 0.40 × 1 calls × 0.30 (early reject) = 0.12 calls
Aktiebolag simple: 0.40 × 4 calls × 0.70 = 1.12 calls
                   + 0.40 × 2 calls × 0.30 = 0.24 calls
Aktiebolag complex: 0.15 × 8 calls × 0.70 = 0.84 calls
                    + 0.15 × 3 calls × 0.30 = 0.135 calls
Enhanced DD: 0.05 × 12 calls = 0.60 calls

Average per company: 0.56 + 0.12 + 1.12 + 0.24 + 0.84 + 0.135 + 0.60 = 3.615 calls

Budget: 500 calls ÷ 3.615 = ~138 companies ✅
```

---

### Scenario 2: Startup Focus (Mostly Enskild Firma)

**Assumptions:**
- 70% Enskild firma (2 calls)
- 30% Aktiebolag simple (4 calls)
- 30% early rejection

**Calculation:**
```
Enskild firma: 0.70 × 1.4 calls (adjusted for early reject) = 0.98 calls
Aktiebolag: 0.30 × 2.8 calls = 0.84 calls

Average: 1.82 calls per company

Budget: 500 calls ÷ 1.82 = ~274 companies ✅✅
```

---

### Scenario 3: Enterprise Focus (Mostly Complex AB)

**Assumptions:**
- 10% Enskild firma
- 30% Aktiebolag simple
- 50% Aktiebolag complex
- 10% Enhanced DD

**Calculation:**
```
Average: (0.10 × 2) + (0.30 × 4) + (0.50 × 8) + (0.10 × 12) = 7.4 calls

Budget: 500 calls ÷ 7.4 = ~67 companies ⚠️
```

---

## 🎯 Recommended Implementation

```python
class KYCCostOptimizer:
    """
    Main class for cost-optimized KYC checks
    """
    
    def __init__(self, budget: int = 500):
        self.budget = budget
        self.calls_used = 0
        self.person_cache = {}
        self.companies_checked = 0
    
    def check_company(
        self,
        company_type: str,
        personnummer: str,
        orgnr: str = None,
        transaction_amount: float = 0
    ) -> Decision:
        """
        Main entry point for company checks
        """
        # Check budget
        if self.calls_used >= self.budget:
            raise BudgetExceededError(f'API call budget exceeded: {self.calls_used}/{self.budget}')
        
        # Route to appropriate checker based on company type
        if company_type == 'ENSKILD_FIRMA':
            result = self._check_enskild_firma(personnummer)
        
        elif company_type == 'AKTIEBOLAG':
            # Decide if enhanced DD needed
            if self._should_enhance_dd(orgnr, transaction_amount):
                result = self._check_aktiebolag_enhanced(orgnr, personnummer)
            else:
                result = self._check_aktiebolag(orgnr, personnummer)
        
        else:
            raise ValueError(f'Unknown company type: {company_type}')
        
        # Update statistics
        self.calls_used += result.cost
        self.companies_checked += 1
        
        # Log remaining budget
        remaining = self.budget - self.calls_used
        logger.info(f'Company checked. Cost: {result.cost} calls. Remaining budget: {remaining}/{self.budget}')
        
        return result
    
    def _check_enskild_firma(self, personnummer: str) -> Decision:
        """Check enskild firma (2 calls)"""
        call_count = 0
        
        # SPAR check
        spar = population_register_api.get_current(personnummer)
        call_count += 1
        
        if spar.details.deRegistrationReasonCode in ['FI', 'OB', 'AV']:
            return Decision('REJECT', cost=call_count)
        
        # BP check
        bp = business_prohibition_api.check_person(personnummer)
        call_count += 1
        
        if self._has_active_prohibition(bp):
            return Decision('REJECT', cost=call_count)
        
        return Decision('APPROVE', cost=call_count)
    
    def _check_aktiebolag(self, orgnr: str, rep_personnummer: str) -> Decision:
        """Check aktiebolag (4-10 calls depending on structure)"""
        call_count = 0
        
        # Check representative
        rep_check = self._check_person_cached(rep_personnummer)
        call_count += 2
        
        if rep_check.has_critical_flag:
            return Decision('REJECT', cost=call_count)
        
        # Company BP check
        bp_company = business_prohibition_api.check_company(orgnr, relations_history_years=2)
        call_count += 1
        
        if self._has_current_rep_prohibition(bp_company):
            return Decision('REJECT', cost=call_count)
        
        # Beneficial owner check
        beneficial_owners = beneficial_owner_api.get(orgnr)
        call_count += 1
        
        for bo in beneficial_owners.persons:
            if bo.personId not in self.person_cache:
                bo_check = self._check_person_cached(bo.personId)
                call_count += 2
                
                if bo_check.has_critical_flag:
                    return Decision('REJECT', cost=call_count)
        
        return Decision('APPROVE', cost=call_count)
    
    def _check_person_cached(self, personnummer: str) -> PersonCheck:
        """Check person with caching"""
        if personnummer in self.person_cache:
            return self.person_cache[personnummer]
        
        spar = population_register_api.get_current(personnummer)
        bp = business_prohibition_api.check_person(personnummer)
        
        result = PersonCheck(
            personnummer=personnummer,
            spar_data=spar,
            bp_data=bp,
            has_critical_flag=self._analyze_flags(spar, bp)
        )
        
        self.person_cache[personnummer] = result
        return result
    
    def get_remaining_capacity(self) -> dict:
        """Calculate remaining capacity"""
        remaining_calls = self.budget - self.calls_used
        
        return {
            'remaining_calls': remaining_calls,
            'enskild_firma_capacity': remaining_calls // 2,
            'aktiebolag_simple_capacity': remaining_calls // 4,
            'aktiebolag_complex_capacity': remaining_calls // 8,
            'companies_checked': self.companies_checked,
            'average_cost': self.calls_used / self.companies_checked if self.companies_checked > 0 else 0
        }
```

---

## 📈 Monitoring & Analytics

### Track Key Metrics

```python
class KYCAnalytics:
    """
    Track KYC performance and costs
    """
    
    def __init__(self):
        self.metrics = {
            'total_checks': 0,
            'total_calls': 0,
            'approvals': 0,
            'rejections': 0,
            'manual_reviews': 0,
            'early_rejections': 0,
            'cache_hits': 0,
            'by_company_type': {},
            'by_rejection_reason': {},
            'cost_savings': 0
        }
    
    def record_check(self, decision: Decision):
        """Record a completed check"""
        self.metrics['total_checks'] += 1
        self.metrics['total_calls'] += decision.cost
        
        if decision.status == 'APPROVE':
            self.metrics['approvals'] += 1
        elif decision.status == 'REJECT':
            self.metrics['rejections'] += 1
            if decision.cost <= 3:
                self.metrics['early_rejections'] += 1
            self.metrics['by_rejection_reason'][decision.reason] = \
                self.metrics['by_rejection_reason'].get(decision.reason, 0) + 1
        elif decision.status == 'MANUAL_REVIEW':
            self.metrics['manual_reviews'] += 1
        
        if hasattr(decision, 'savings'):
            self.metrics['cost_savings'] += decision.savings
    
    def get_report(self) -> dict:
        """Generate analytics report"""
        avg_cost = self.metrics['total_calls'] / self.metrics['total_checks'] if self.metrics['total_checks'] > 0 else 0
        approval_rate = self.metrics['approvals'] / self.metrics['total_checks'] if self.metrics['total_checks'] > 0 else 0
        early_rejection_rate = self.metrics['early_rejections'] / self.metrics['rejections'] if self.metrics['rejections'] > 0 else 0
        
        return {
            'summary': {
                'total_checks': self.metrics['total_checks'],
                'total_api_calls': self.metrics['total_calls'],
                'average_cost_per_check': round(avg_cost, 2),
                'approval_rate': f'{approval_rate:.1%}',
                'rejection_rate': f'{(1 - approval_rate):.1%}',
                'early_rejection_rate': f'{early_rejection_rate:.1%}',
                'total_cost_savings': self.metrics['cost_savings']
            },
            'outcomes': {
                'approved': self.metrics['approvals'],
                'rejected': self.metrics['rejections'],
                'manual_review': self.metrics['manual_reviews']
            },
            'rejection_reasons': self.metrics['by_rejection_reason'],
            'efficiency': {
                'cache_hits': self.metrics['cache_hits'],
                'early_rejections': self.metrics['early_rejections'],
                'savings_percentage': f'{(self.metrics["cost_savings"] / self.metrics["total_calls"] * 100):.1f}%'
            }
        }
```

---

## 🚨 Budget Alerts

```python
class BudgetMonitor:
    """
    Monitor API budget and send alerts
    """
    
    def __init__(self, budget: int = 500):
        self.budget = budget
        self.alert_thresholds = [0.5, 0.75, 0.9, 0.95]  # 50%, 75%, 90%, 95%
        self.alerts_sent = set()
    
    def check_budget(self, calls_used: int):
        """Check if budget thresholds reached"""
        usage_percentage = calls_used / self.budget
        
        for threshold in self.alert_thresholds:
            if usage_percentage >= threshold and threshold not in self.alerts_sent:
                self._send_alert(threshold, calls_used)
                self.alerts_sent.add(threshold)
    
    def _send_alert(self, threshold: float, calls_used: int):
        """Send budget alert"""
        remaining = self.budget - calls_used
        
        alert = {
            'level': 'WARNING' if threshold < 0.9 else 'CRITICAL',
            'message': f'API budget {threshold:.0%} consumed',
            'calls_used': calls_used,
            'calls_remaining': remaining,
            'budget': self.budget,
            'estimated_capacity': {
                'enskild_firma': remaining // 2,
                'aktiebolag_simple': remaining // 4,
                'aktiebolag_complex': remaining // 8
            }
        }
        
        # Send to monitoring system
        logger.warning(f"Budget Alert: {alert}")
        
        # Send email/Slack notification
        if threshold >= 0.95:
            notify_admin(alert)
```

---

## ✅ Best Practices Summary

### DO ✅

1. **Implement early rejection** - Stop processing as soon as critical flag found
2. **Use caching** - Store person checks to avoid duplicates
3. **Leverage company endpoint** - Use `/company` endpoint instead of individual checks
4. **Conditional enhanced DD** - Only run expensive checks when necessary
5. **Monitor budget** - Track usage and set alerts at 50%, 75%, 90%, 95%
6. **Cache hits** - Representative = BO is very common in small companies
7. **Start with cheap checks** - SPAR before BP, person before company

### DON'T ❌

1. **Don't check all board members individually** - Use company endpoint
2. **Don't run enhanced DD on all companies** - Reserve for high-risk cases
3. **Don't ignore cache** - Check if person already verified
4. **Don't continue after critical flag** - Reject immediately and save calls
5. **Don't forget to track costs** - Monitor actual vs estimated costs
6. **Don't check beneficial owners before company BP** - Company endpoint might already flag them

---

## 🎯 Expected Outcomes

**With Optimization:**
- ✅ **138-274 companies** verified with 500 API calls (depending on mix)
- ✅ **30-50% cost savings** through early rejection
- ✅ **25-40% savings** through caching
- ✅ **Compliance maintained** - all PML requirements met

**Without Optimization:**
- ❌ **~41-62 companies** verified (worst case)
- ❌ No early stopping = wasted calls on clear rejects
- ❌ No caching = duplicate checks
- ❌ Enhanced DD on all = budget exhausted quickly

---

## 📚 Related Documentation

- [API_SCHEMAS_POPULATION_REGISTER.md](API_SCHEMAS_POPULATION_REGISTER.md) - SPAR API
- [API_SCHEMAS_BUSINESS_PROHIBITION.md](API_SCHEMAS_BUSINESS_PROHIBITION.md) - Näringsförbud API
- [README.md](README.md) - Integration overview
- [test_business_prohibition_api.sh](test_business_prohibition_api.sh) - Live tests

---

**Last Updated:** 2025-10-23  
**Version:** 1.0  
**Status:** Ready for implementation ✅
