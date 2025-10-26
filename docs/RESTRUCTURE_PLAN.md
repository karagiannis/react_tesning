# Roaring.io Directory Structure Reorganization Plan

**Goal:** Consolidate all Roaring.io related files into a logical, maintainable structure

Date: 2025-10-25  
Status: 📋 Planning Phase

---

## Current Situation Analysis

### Files Scattered Across Multiple Locations

#### Root Directory (`tic-tac-toe-app/`)
```
test_roaring_documents.py          (683 lines)
test_roaring_kyc.py                (~200 lines)
test_roaring_endpoints.py          (689 lines - LEGACY, needs refactor)
test_roaring_establishments.py     (496 lines)
test_roaring_sanctions.py          (668 lines)
roaring_credentials.py             (239 lines)
roaring.ini                        (config file)
roaring_documents_example_annual_report.json
roaring_establishments_example_multi.json
roaring_sanctions_example_ztarz.json
roaring_test_results_20251025_174901.json
sandbox_annual_report_5564779444.pdf
```

#### `docs/API_INTEGRATION/`
```
ROARING_SANCTIONS_LISTS_V3.md      (22KB)
ROARING_COMPANY_DOCUMENTS_V1.md    (26KB)
ROARING_ESTABLISHMENTS_V2.md       (31KB)
ROARING_TESTING_REGISTRY.md        (15KB) ← NEW, central index
```

#### `docs/API_INTEGRATION/Roaring/`
```
API_SCHEMAS_BUSINESS_PROHIBITION.md
API_SCHEMAS_COMPANY_INFORMATION.md
API_SCHEMAS_POPULATION_REGISTER.md
API_SCHEMAS_ROARING.md
BANK_ACCOUNT_API.md
BENEFICIAL_OWNER.md
DATA_UPDATER_WEBHOOK.md
KODLISTOR_COMPANY_INFORMATION.md
KODLISTOR_POPULATION_REGISTER.md
KYC_COST_OPTIMIZATION.md
LIVE_TEST_STRATEGIC_INSIGHTS.md
OAUTH2_SETUP.md
README.md
README_WEBHOOK_TESTING.md
RISK_INDICATORS_ANALYSIS.md
ROARING_IO_API.md

get_access_token.sh
get_account_data.sh
get_roaring_token.py
test_bank_api.sh
test_bank_auth_flow.sh
test_beneficial_owners.py           ← Duplicate with root!
test_business_prohibition_api.sh
test_company_information_api.sh
test_company_overview_simple.sh
test_data_updater.py
test_data_updater_with_oauth.py
test_population_register_api.sh
test_risk_indicators.sh
test_risk_indicators_analysis.md
webhook_receiver.py

test_results/                       (subdirectory)
```

### Problems Identified

1. ❌ **Test scripts split across root and docs/** - confusing
2. ❌ **Duplicate functionality** (`test_roaring_endpoints.py` vs individual scripts)
3. ❌ **Config files in root** (roaring.ini should be in config/)
4. ❌ **Example data mixed with code** (.json files in root)
5. ❌ **Downloaded PDFs in root** (should be in data/examples/)
6. ❌ **Documentation split** (some in Roaring/, some in parent)
7. ❌ **Legacy code not marked** (`test_roaring_endpoints.py` is old approach)

---

## Proposed New Structure

```
tic-tac-toe-app/
├── config/
│   ├── roaring.ini                          # OAuth2 credentials
│   ├── bolagsverket.ini                     # SKTFP credentials
│   ├── skatteverket.ini                     # AGI/INK2 credentials
│   └── README.md                            # Credential setup guide
│
├── scripts/
│   ├── roaring/
│   │   ├── test_sanctions.py                # ← From root
│   │   ├── test_documents.py                # ← From root
│   │   ├── test_establishments.py           # ← From root
│   │   ├── test_kyc.py                      # ← From root (kept for reference)
│   │   ├── test_beneficial_owners.py        # ← From docs/.../Roaring/
│   │   ├── test_business_prohibition.py     # ← From docs/.../Roaring/
│   │   ├── test_company_information.py      # ← From docs/.../Roaring/
│   │   ├── test_population_register.py      # ← From docs/.../Roaring/
│   │   ├── test_bank_account.py             # ← From docs/.../Roaring/
│   │   ├── test_data_updater.py             # ← From docs/.../Roaring/
│   │   └── legacy/
│   │       └── test_roaring_endpoints.py    # ← OLD, mark as deprecated
│   │
│   ├── bolagsverket/
│   │   └── test_sktfp.py                    # Bolagsverket tests
│   │
│   ├── skatteverket/
│   │   ├── test_agi.py                      # AGI tests
│   │   └── test_ink2.py                     # INK2 tests
│   │
│   └── utils/
│       ├── roaring_credentials.py           # ← From root
│       ├── bolagsverket_credentials.py
│       └── skatteverket_credentials.py
│
├── data/
│   ├── examples/
│   │   ├── roaring/
│   │   │   ├── sanctions_ztarz.json         # ← From root
│   │   │   ├── documents_annual_report.json # ← From root
│   │   │   ├── establishments_multi.json    # ← From root
│   │   │   └── annual_report_sample.pdf     # ← From root
│   │   ├── bolagsverket/
│   │   └── skatteverket/
│   │
│   ├── test_results/
│   │   ├── roaring/                         # ← From docs/.../Roaring/test_results/
│   │   ├── bolagsverket/
│   │   └── skatteverket/
│   │
│   └── cache/
│       └── README.md                        # Cache policy documentation
│
├── docs/
│   ├── API_INTEGRATION/
│   │   ├── INDEX.md                         # ← NEW: Master index for all APIs
│   │   │
│   │   ├── Roaring/
│   │   │   ├── README.md                    # Roaring.io overview
│   │   │   ├── TESTING_REGISTRY.md          # ← From parent (renamed)
│   │   │   │
│   │   │   ├── endpoints/
│   │   │   │   ├── SANCTIONS_LISTS_V3.md    # ← From parent
│   │   │   │   ├── COMPANY_DOCUMENTS_V1.md  # ← From parent
│   │   │   │   ├── ESTABLISHMENTS_V2.md     # ← From parent
│   │   │   │   ├── BENEFICIAL_OWNERS_VX.md  # ← To be created
│   │   │   │   ├── BUSINESS_PROHIBITION_VX.md
│   │   │   │   ├── COMPANY_INFORMATION_VX.md
│   │   │   │   └── ...
│   │   │   │
│   │   │   ├── schemas/
│   │   │   │   ├── business_prohibition.md  # ← From current Roaring/
│   │   │   │   ├── company_information.md   # ← From current Roaring/
│   │   │   │   └── population_register.md   # ← From current Roaring/
│   │   │   │
│   │   │   ├── guides/
│   │   │   │   ├── OAUTH2_SETUP.md          # ← From current Roaring/
│   │   │   │   ├── COST_OPTIMIZATION.md     # ← From current Roaring/
│   │   │   │   ├── RISK_INDICATORS.md       # ← From current Roaring/
│   │   │   │   └── WEBHOOKS.md              # ← From current Roaring/
│   │   │   │
│   │   │   └── reference/
│   │   │       ├── KODLISTOR_COMPANY.md     # ← From current Roaring/
│   │   │       └── KODLISTOR_POPULATION.md  # ← From current Roaring/
│   │   │
│   │   ├── Bolagsverket/
│   │   │   ├── README.md
│   │   │   └── SKTFP_API.md
│   │   │
│   │   ├── Skatteverket/
│   │   │   ├── README.md
│   │   │   ├── AGI_API.md
│   │   │   └── INK2_API.md
│   │   │
│   │   └── Fortnox/
│   │       ├── README.md
│   │       └── API_REFERENCE.md
│   │
│   └── Theory/
│       └── metod_riskbedömning_kund_v3.tex
│
├── backend/                                 # Future: Flask/FastAPI application
│   └── (to be created)
│
├── frontend/                                # Future: React application
│   └── (to be created)
│
└── latex/
    └── API_Endpoints_ContentSlides.tex
```

---

## Migration Plan

### Phase 1: Create Directory Structure ✅ DO THIS FIRST

```bash
# Create new directories
mkdir -p config
mkdir -p scripts/roaring/legacy
mkdir -p scripts/bolagsverket
mkdir -p scripts/skatteverket
mkdir -p scripts/utils
mkdir -p data/examples/roaring
mkdir -p data/examples/bolagsverket
mkdir -p data/examples/skatteverket
mkdir -p data/test_results/roaring
mkdir -p data/cache
mkdir -p docs/API_INTEGRATION/Roaring/endpoints
mkdir -p docs/API_INTEGRATION/Roaring/schemas
mkdir -p docs/API_INTEGRATION/Roaring/guides
mkdir -p docs/API_INTEGRATION/Roaring/reference
```

### Phase 2: Move Configuration Files

```bash
# Move credentials and config
mv roaring.ini config/
mv roaring_credentials.py scripts/utils/

# Update import paths in all test scripts:
# FROM: from roaring_credentials import ...
# TO:   from scripts.utils.roaring_credentials import ...
```

### Phase 3: Move Test Scripts

```bash
# Move root test scripts to scripts/roaring/
mv test_roaring_sanctions.py scripts/roaring/test_sanctions.py
mv test_roaring_documents.py scripts/roaring/test_documents.py
mv test_roaring_establishments.py scripts/roaring/test_establishments.py
mv test_roaring_kyc.py scripts/roaring/test_kyc.py

# Move legacy script
mv test_roaring_endpoints.py scripts/roaring/legacy/test_roaring_endpoints.py

# Copy/consolidate from docs/API_INTEGRATION/Roaring/
cp docs/API_INTEGRATION/Roaring/test_beneficial_owners.py scripts/roaring/test_beneficial_owners.py
# ... (review and consolidate other test scripts)
```

### Phase 4: Move Example Data

```bash
# Move JSON examples
mv roaring_sanctions_example_ztarz.json data/examples/roaring/sanctions_ztarz.json
mv roaring_documents_example_annual_report.json data/examples/roaring/documents_annual_report.json
mv roaring_establishments_example_multi.json data/examples/roaring/establishments_multi.json

# Move PDF examples
mv sandbox_annual_report_5564779444.pdf data/examples/roaring/annual_report_sample.pdf

# Move test results
mv roaring_test_results_*.json data/test_results/roaring/
mv docs/API_INTEGRATION/Roaring/test_results/* data/test_results/roaring/
```

### Phase 5: Reorganize Documentation

```bash
# Move endpoint docs to new structure
mv docs/API_INTEGRATION/ROARING_SANCTIONS_LISTS_V3.md \
   docs/API_INTEGRATION/Roaring/endpoints/SANCTIONS_LISTS_V3.md

mv docs/API_INTEGRATION/ROARING_COMPANY_DOCUMENTS_V1.md \
   docs/API_INTEGRATION/Roaring/endpoints/COMPANY_DOCUMENTS_V1.md

mv docs/API_INTEGRATION/ROARING_ESTABLISHMENTS_V2.md \
   docs/API_INTEGRATION/Roaring/endpoints/ESTABLISHMENTS_V2.md

mv docs/API_INTEGRATION/ROARING_TESTING_REGISTRY.md \
   docs/API_INTEGRATION/Roaring/TESTING_REGISTRY.md

# Move guides
mv docs/API_INTEGRATION/Roaring/OAUTH2_SETUP.md \
   docs/API_INTEGRATION/Roaring/guides/OAUTH2_SETUP.md

mv docs/API_INTEGRATION/Roaring/KYC_COST_OPTIMIZATION.md \
   docs/API_INTEGRATION/Roaring/guides/COST_OPTIMIZATION.md

mv docs/API_INTEGRATION/Roaring/RISK_INDICATORS_ANALYSIS.md \
   docs/API_INTEGRATION/Roaring/guides/RISK_INDICATORS.md

# Move schemas
mv docs/API_INTEGRATION/Roaring/API_SCHEMAS_*.md \
   docs/API_INTEGRATION/Roaring/schemas/

# Move reference docs
mv docs/API_INTEGRATION/Roaring/KODLISTOR_*.md \
   docs/API_INTEGRATION/Roaring/reference/
```

### Phase 6: Update Import Paths

Update all test scripts to reflect new locations:

```python
# OLD (in root)
from roaring_credentials import get_oauth2_credentials

# NEW (in scripts/roaring/)
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent / 'utils'))
from roaring_credentials import get_oauth2_credentials
```

OR create a proper package structure:

```python
# scripts/__init__.py
# scripts/utils/__init__.py
# scripts/roaring/__init__.py

# Then in scripts/roaring/test_sanctions.py:
from scripts.utils.roaring_credentials import get_oauth2_credentials
```

### Phase 7: Create Index Files

Create `docs/API_INTEGRATION/INDEX.md`:
```markdown
# API Integration Documentation Index

## Roaring.io
- [Testing Registry](Roaring/TESTING_REGISTRY.md)
- [Endpoints Documentation](Roaring/endpoints/)
- [Setup Guides](Roaring/guides/)

## Bolagsverket
- [SKTFP API](Bolagsverket/SKTFP_API.md)

## Skatteverket
- [AGI API](Skatteverket/AGI_API.md)
- [INK2 API](Skatteverket/INK2_API.md)

## Fortnox
- [API Reference](Fortnox/API_REFERENCE.md)
```

Create `config/README.md` with credential setup instructions.

### Phase 8: Update TESTING_REGISTRY.md

Update paths in the registry to reflect new structure.

---

## Benefits of New Structure

### ✅ Clear Separation of Concerns
- **config/** - All credentials in one place
- **scripts/** - All executable code organized by API provider
- **data/** - All example data and test results
- **docs/** - All documentation hierarchically organized

### ✅ Easier Navigation
- Want to test Roaring sanctions? → `scripts/roaring/test_sanctions.py`
- Need Roaring docs? → `docs/API_INTEGRATION/Roaring/`
- Looking for examples? → `data/examples/roaring/`

### ✅ Better Version Control
- Ignore entire `data/cache/` directory
- Separate config (credentials) from code
- Clear history per component

### ✅ Scalability
- Easy to add new API providers (just create new subdirectory)
- Pattern established for backend/frontend when ready
- Clear place for each type of file

### ✅ Professional Structure
- Follows Python best practices
- Similar to established frameworks (Django, Flask)
- Easy for new developers to understand

---

## Execution Strategy

### Option A: Gradual Migration (Safer)
1. Create new structure alongside old
2. Copy files (don't move yet)
3. Update imports in copied files
4. Test everything works
5. Once validated, delete old files
6. Update all documentation references

### Option B: Atomic Migration (Faster)
1. Create all directories at once
2. Move all files in one session
3. Update all imports
4. Fix any breakage immediately
5. One big commit: "Restructure project directories"

**Recommendation:** Option A (safer, easier to rollback)

---

## Post-Migration Checklist

- [ ] All test scripts run from new locations
- [ ] All imports work correctly
- [ ] Config files loaded from new paths
- [ ] Example data accessible
- [ ] Documentation links updated
- [ ] TESTING_REGISTRY.md paths corrected
- [ ] .gitignore updated (ignore data/cache/, config/*.ini)
- [ ] README.md updated with new structure
- [ ] Create CREDENTIALS_REGISTRY.md in config/

---

## Next Steps After Reorganization

1. **Consolidate Duplicate Tests**
   - Review `scripts/roaring/legacy/test_roaring_endpoints.py`
   - Extract any unique logic not in individual scripts
   - Archive or delete once consolidated

2. **Create Master Test Runner**
   ```bash
   scripts/run_all_tests.sh --provider roaring
   scripts/run_all_tests.sh --endpoint sanctions
   scripts/run_all_tests.sh --full-suite
   ```

3. **Implement Proper Python Package**
   - Add `__init__.py` files
   - Use proper import paths
   - Consider installing as editable package: `pip install -e .`

4. **Create CREDENTIALS_REGISTRY.md**
   - Map all services to credential files
   - Document environment variables
   - Setup instructions per service

---

## Questions for You

Before I start the migration, please confirm:

1. **Credential files:** Should I move `roaring.ini` or keep in root for now?
2. **Backward compatibility:** Do you need old paths to work temporarily?
3. **Git strategy:** One big commit or incremental commits?
4. **Testing:** Should I verify each moved script works before proceeding?
5. **Documentation:** Update all markdown files with new paths immediately?

**Recommendation:** Let's do Phase 1-2 (create structure + move config) first, then pause and verify before continuing.

---

**Document Version:** 1.0  
**Status:** 📋 Planning - Awaiting approval  
**Estimated Time:** 2-3 hours for full migration  
**Risk Level:** Medium (many file moves, import path updates)
