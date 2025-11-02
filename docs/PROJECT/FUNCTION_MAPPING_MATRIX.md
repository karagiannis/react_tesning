# VBA → Python Function Mapping Matrix

**Generated:** 2025-11-01
**Purpose:** Complete mapping of VBA functions to Python implementation for bokföringssystem migration

## Priority Legend

- **CRITICAL** - Core functionality, must be implemented first
- **HIGH** - Important features, implement in Sprint 1-2
- **MEDIUM** - Secondary features, implement in Sprint 2-3
- **LOW** - Nice-to-have, implement if time permits

---

## 1. Core Models (Foundation)

| VBA Structure | Python Module | Python Class/Function | Priority | Dependencies | Notes |
|--------------|---------------|----------------------|----------|--------------|-------|
| ColumnNumbers enum | `models.py` | `Account` class | CRITICAL | None | Account model with kontonummer, benämning, momskod, saldo |
| - | `models.py` | `Transaction` class | CRITICAL | Account | Transaction with konto, debet, kredit, datum, text, etc. |
| - | `models.py` | `VATCode` class | CRITICAL | None | VAT code with ruta (box), procent, Fortnox mnemonik |
| - | `models.py` | `Dimension` class | CRITICAL | None | SIE #DIM support |
| - | `models.py` | `DimensionObject` class | CRITICAL | Dimension | SIE #OBJEKT support |
| - | `models.py` | `Verification` class | HIGH | Transaction | Gruppering av transaktioner |

---

## 2. SIE Parser (ModuleImportSIE4.bas.vba → sie_parser.py)

| VBA Function | Python Function | Priority | Dependencies | Line Ref | Notes |
|-------------|-----------------|----------|--------------|----------|-------|
| `InitializeKontoplanAndBalancesFromSIE` | `import_chart_of_accounts()` | CRITICAL | File I/O | 7-48 | Main entry point for kontoplan import |
| `ImportKontoplanAndBalancesFromSIE` | `_parse_kontoplan_from_sie()` | CRITICAL | File I/O | Internal | Parse #KONTO, #KTYP, #SRU tags |
| `GetBenämning` | N/A (built into parser) | CRITICAL | - | 51 | Extract account name from #KONTO line |
| `UpdateBalances` | `_update_balances()` | CRITICAL | Account model | 52 | Parse #IB (ingående balans), #UB (utgående balans) |
| `AddDynamicHeaders` | N/A (Python dataclasses) | MEDIUM | - | 53 | Support multiple fiscal years |
| `ImportTransactionsFromSIE` | `import_transactions()` | CRITICAL | Kontoplan | 49-100 | Main entry point for transaction import |
| `ImportVerifikationslistaSIE` | `_parse_verifications()` | CRITICAL | ParseVerifikationsHeaderSIE | Internal | Parse #VER blocks |
| `ParseVerifikationsHeaderSIE` | `_parse_verification_header()` | CRITICAL | Date parsing | 57 | Parse #VER header (serie, nummer, datum, text, regdat) |
| `ParseTransLineSIE` | `_parse_transaction_line()` | CRITICAL | ParseObjektlistaSIE | 475-525 | Parse #TRANS, #BTRANS, #RTRANS |
| `ParseObjektlistaSIE` | `_parse_object_list()` | CRITICAL | Dimension model | 583-605 | **KNOWN BUG:** Current VBA assumes fixed order {kostnadsställe kostnadsbärare projekt}. Python must parse properly: {dim_id obj_id} according to SIE4 spec! |
| `IsValidDateYYYYMMDDSIE` | `_validate_date()` | HIGH | - | 607-612 | Validate YYYYMMDD format |
| `ConvertToDateYYYYMMDDSIE` | `_convert_date_to_iso()` | HIGH | - | 614-617 | Convert YYYYMMDD → YYYY-MM-DD |
| `UpdateKontoplanWithVATCodes` | `update_vat_codes()` | HIGH | BASKontoplan | 629-660 | Map VAT codes from BAS chart |
| `UpdateVerifikationsListaWithVATCodes` | `update_transaction_vat_codes()` | HIGH | Kontoplan | 55 | Propagate VAT codes to transactions |
| `FyllI_TotaltAntalRader` | `_calculate_row_counts()` | MEDIUM | - | 64 | Calculate total rows per verification |

**Test Data Available:**
- Input: `/home/lasse/Documents/Onboarding_App/tic-tac-toe-app/SIE/SIE4 Exempelfil.SE`
- Expected kontoplan: `csv_exports/Kontoplan.csv`
- Expected transactions: `csv_exports/Verifikationslista2.csv`

---

## 3. SIE Exporter (ModuleExportSIE4.bas.vba → sie_exporter.py)

| VBA Function | Python Function | Priority | Dependencies | Line Ref | Notes |
|-------------|-----------------|----------|--------------|----------|-------|
| `ExportToSIE4` | `export_sie4()` | HIGH | All export sub-functions | 105 | Main orchestrator |
| `WriteLineWithEncoding` | `_write_line_cp437()` | HIGH | None | 7-37 | **CRITICAL:** Must use CP437 (IBM PC-8) encoding! |
| `ExportFöretagsinformation` | `export_company_info()` | HIGH | Company model | 38-69 | Export #FNAMN, #ORGNR, #ADRESS, #FNR, etc. |
| `ExportKontoplan` | `export_chart_of_accounts()` | HIGH | Account model | 71-100 | Export #KONTO, #KTYP, #SRU |
| `GetAccountType` | `_determine_account_type()` | MEDIUM | - | 91 | Determine T/S/K/I based on kontonummer range |
| `ExportDimensioner` | `export_dimensions()` | MEDIUM | Dimension model | 92 | Export #DIM tags |
| `ExportObjekt` | `export_objects()` | MEDIUM | DimensionObject model | 93 | Export #OBJEKT tags |
| `ExportIngåendeUtgåendeBalanserOchResultaträkning` | `export_balances()` | HIGH | Account model | 94 | Export #IB, #UB, #RES, #PBUDGET |
| `ExportVerifikationslista` | `export_verifications()` | HIGH | Transaction model | 96 | Export #VER blocks with #TRANS lines |
| `AddToDictionary` | N/A (Python dict) | - | - | 97 | Group verifications by serie+nummer |
| `ExportVerifikation` | `_export_verification()` | HIGH | Transaction model | 98 | Export single #VER block |
| `FormatDate` | `_format_date_yyyymmdd()` | HIGH | - | 99 | Format date to YYYYMMDD |
| `GetBelopp` | `_get_amount()` | HIGH | - | 100 | Get debet or kredit amount |
| `SkrivTransaktionsrad` | `_write_transaction_line()` | HIGH | - | 101 | Write #TRANS/#BTRANS/#RTRANS |
| `ByggObjektLista` | `_build_object_list()` | MEDIUM | DimensionObject | 102 | Build {dim_id obj_id} format |
| `GetTransPrefix` | `_get_trans_prefix()` | HIGH | - | 103 | Determine #TRANS vs #BTRANS vs #RTRANS |
| `Nz` | N/A (use Python `or ""`) | - | - | 95 | Null-safe value extraction |

---

## 4. CRC Integrity (ModuleCRC.bas.vba → integrity.py)

| VBA Function | Python Function | Priority | Dependencies | Line Ref | Notes |
|-------------|-----------------|----------|--------------|----------|-------|
| `CRC_skapa_tabell_horisontal` | `create_crc32_table()` | HIGH | None | 14-29 | Build CRC32 lookup table |
| `CRC_start_horisontal` | `crc32_init()` | HIGH | None | 36-39 | Initialize with 0xFFFFFFFF |
| `CRC_ackumulera_horisontal` | `crc32_update()` | HIGH | None | 41-54 | Accumulate bytes into CRC |
| `CRC_retur_horisontal` | `crc32_finalize()` | HIGH | None | 31-34 | XOR with 0xFFFFFFFF and return |
| `CalculateAllChecksums` | `calculate_checksums()` | HIGH | All CRC functions | 56-73 | Calculate for all rows |
| `CalculateChecksumForRow` | `calculate_row_checksum()` | HIGH | CRC functions | 75-92 | Calculate for single row |
| `CalculateHorizontalChecksumsForVerifikationslista` | `calculate_verification_checksums()` | HIGH | CRC functions | 124-143 | Calculate after import |

**Implementation Note:**
- Polynomial: `0xEDB88320` (standard CRC32 reversed/reflected)
- Python can use `zlib.crc32()` but verify it matches VBA output byte-for-byte

---

## 5. Ledger Management (Module1.bas.vba → ledger.py)

| VBA Function | Python Function | Priority | Dependencies | Line Ref | Notes |
|-------------|-----------------|----------|--------------|----------|-------|
| `BokforingKnapp_Click` | `post_transaction()` | CRITICAL | KontrolleraKrav, CRC | 12-72 | Main entry point for posting |
| `KontrolleraKrav` | `validate_transaction()` | CRITICAL | None | 20 | Validate before posting |
| `UppdateraVerifikationslista` | `update_verification_list()` | CRITICAL | Transaction model | 12 | Append to verification list |
| `SkrivDataTillRad` | `_write_transaction_row()` | HIGH | - | 13 | Write single row |
| `RensaBokföringsblad` | `clear_posting_sheet()` | HIGH | - | 14 | Clear temporary posting area |
| `DeleteRow` | `delete_transaction()` | MEDIUM | - | 15 | Mark row as deleted |
| `UpdateDiff` | `calculate_balance_diff()` | HIGH | - | 16 | Debet - Kredit difference |
| `UpdateSaldoForCurrentAndFollowingRows` | `update_balances()` | HIGH | Account model | 17 | Cascade balance updates |
| `KopieraGemensammaPoster` | `copy_common_fields()` | MEDIUM | - | 21 | Copy ver_serie, ver_nr, datum, text to all rows |
| `KopieraHyperlänk` | N/A (not needed in backend) | LOW | - | 22 | Excel-specific |
| `ConfirmVerSerieNumber` | `update_verification_series()` | MEDIUM | Settings | 23 | Update last used ver_nr |
| `GetBenamning` | `get_account_name()` | HIGH | Account model | 5 | Fetch account name from chart |
| `GetMomskod` | `get_vat_code()` | HIGH | Account model | 6 | Fetch VAT code for account |
| `Nz` | N/A (use Python `or 0`) | - | - | 9 | Null-safe numeric |

---

## 6. Reports (ModuleGenerateReports.bas.vba → reports.py)

**NOTE:** This module is HUGE (4507 lines, 204 KB). Breaking down by report type.

### 6.1 Report Infrastructure

| VBA Function | Python Function | Priority | Dependencies | Line Ref | Notes |
|-------------|-----------------|----------|--------------|----------|-------|
| `CreateReportSheet` | N/A (backend API) | LOW | - | 122 | Excel-specific UI |
| `MainReportFunction` | `generate_report()` | HIGH | All report functions | 123 | Orchestrator |
| `GetOutputFormat` | N/A (API parameter) | - | - | 124 | Format selection |
| `GetFirstDayOfFiscalYear` | `get_fiscal_year_start()` | HIGH | Settings | 132 | From fiscal year config |
| `GetLastDayOfFiscalYear` | `get_fiscal_year_end()` | HIGH | Settings | 135 | From fiscal year config |
| `GetCompanyInfo` | `get_company_info()` | HIGH | Company model | 137 | Fetch company metadata |

### 6.2 General Ledger (Huvudbok)

| VBA Function | Python Function | Priority | Dependencies | Line Ref | Notes |
|-------------|-----------------|----------|--------------|----------|-------|
| `GenerateHuvudbokRapp` | `generate_general_ledger()` | HIGH | Transactions | 125 | Main function |
| `AddAccountRangeToHuvudbokRapp` | `_add_account_transactions()` | HIGH | - | 128 | Add transactions for konto range |
| `AddTransactionToHuvudbokRapp` | `_add_transaction()` | HIGH | - | 129 | Add single transaction |
| `CalculateSaldoTillDatum` | `calculate_balance_to_date()` | HIGH | Transactions | 133 | Cumulative balance calculation |
| `GeneratePreamble` | `_generate_ledger_preamble()` | MEDIUM | Company info | 134 | Report header |

### 6.3 Balance Sheet (Balansrapport)

| VBA Function | Python Function | Priority | Dependencies | Line Ref | Notes |
|-------------|-----------------|----------|--------------|----------|-------|
| `GenerateBalansrapport` | `generate_balance_sheet()` | HIGH | Kontoplan, Transactions | 126 | Main function |
| `InitializeJsonStructure` | `_init_balance_structure()` | HIGH | - | 140 | Create nested JSON/dict structure |
| `InitializeSummaNode` | `_init_sum_node()` | HIGH | - | 141 | Initialize sum node with zeros |
| `AddAccountToJson` | `_add_account_to_balance()` | HIGH | - | 142 | Add account and update sums |
| `UpdateSumma` | `_update_sum()` | HIGH | - | 143 | Update sum node |
| `UpdateBeraknatResultatSumma` | `_update_calculated_result()` | HIGH | - | 149 | Beräknat resultat = Tillgångar - EK - Skulder |
| `FindNestedKey` | `_find_nested_key()` | MEDIUM | - | 145 | Recursive search in nested dict |
| `WriteJsonToExcel` | N/A (API returns JSON) | - | - | 144 | Excel export |
| `GeneratePreambleB` | `_generate_balance_preamble()` | MEDIUM | Company info | 136 | Report header |
| `CalculateDebetKredit2` | `calculate_debet_credit_sums()` | HIGH | Transactions | 127 | Sum debet/kredit for konto |

**Balance Sheet Structure (JSON):**
```python
{
  "Tillgångar": {
    "Anläggningstillgångar": {...},
    "Omsättningstillgångar": {...},
    "Summa_tillgångar": {...}
  },
  "Eget_kapital_och_skulder": {
    "Eget_kapital": {...},
    "Skulder": {...},
    "Beräknat_resultat": {...},
    "Summa_eget_kapital_och_skulder": {...}
  }
}
```

### 6.4 Income Statement (Resultatrapport)

| VBA Function | Python Function | Priority | Dependencies | Line Ref | Notes |
|-------------|-----------------|----------|--------------|----------|-------|
| `GenerateResultatrapport` | `generate_income_statement()` | HIGH | Kontoplan, Transactions | 159 | Main function |
| `InitializeJsonStructureResultat` | `_init_income_structure()` | HIGH | - | 150 | Create nested structure |
| `InitializeSummaNodeResultat` | `_init_sum_node_income()` | HIGH | - | 151 | Initialize sum node |
| `AddAccountToJsonResultat` | `_add_account_to_income()` | HIGH | - | 152 | Add account and update sums |
| `UpdateSummaResultat` | `_update_sum_income()` | HIGH | - | 153 | Update sum node |
| `UpdateSpecialNodes` | `_update_special_nodes()` | HIGH | - | 154 | Update bruttovinst, rörelseresultat, resultat_efter_fin |
| `WriteJsonObjToExcelResultat` | N/A (API returns JSON) | - | - | 155 | Excel export |
| `ProcessNettoomsattning` | `_process_net_sales()` | HIGH | - | 168 | Process nettoomsättning section |
| `ProcessOvrigaRorelseintakter` | `_process_other_income()` | HIGH | - | 169 | Process övriga rörelseintäkter |
| `ProcessRavarorOchFornodenheter` | `_process_materials()` | HIGH | - | 170 | Process råvaror |
| `ProcessOvrigaExternaKostnader` | `_process_external_costs()` | HIGH | - | 171 | Process externa kostnader |
| `ProcessPersonalkostnader` | `_process_personnel_costs()` | HIGH | - | 172 | Process personalkostnader |
| `ProcessAvskrivningar` | `_process_depreciation()` | HIGH | - | 173 | Process avskrivningar |
| `ProcessOvrigaRorelsekostnader` | `_process_other_operating_costs()` | HIGH | - | 174 | Process övr. rörelsekostnader |
| `ProcessFinansiellaIntakter` | `_process_financial_income()` | HIGH | - | 175 | Process finansiella intäkter |
| `ProcessFinansiellaKostnader` | `_process_financial_costs()` | HIGH | - | 176 | Process finansiella kostnader |
| `ProcessBokslutsdispositioner` | `_process_appropriations()` | MEDIUM | - | 182 | Process bokslutsdispositioner |
| `ProcessSkattPaAretsResultat` | `_process_tax()` | HIGH | - | 183 | Process skatt |
| `ProcessBruttovinst` | `_process_gross_profit()` | HIGH | - | 184 | Bruttovinst calculation |
| `ProcessRorelsensResultat` | `_process_operating_result()` | HIGH | - | 185 | Rörelseresultat calculation |
| `ProcessResultatEfterFinansiella` | `_process_result_after_financial()` | HIGH | - | 186 | Resultat efter finansiella poster |
| `ProcessResultatForeSkatt` | `_process_result_before_tax()` | HIGH | - | 187 | Resultat före skatt |
| `ProcessBeraknatResultat` | `_process_calculated_result()` | HIGH | - | 188 | Årets resultat |
| `GeneratePreambleR` | `_generate_income_preamble()` | MEDIUM | Company info | 163 | Report header |
| `GetHuvudbokLink` | N/A (API link) | LOW | - | 165 | Hyperlink to ledger |

**Income Statement Structure (JSON):**
```python
{
  "Nettoomsättning": {...},
  "Övriga_rörelseintäkter": {...},
  "Råvaror_och_förnödenheter": {...},
  "Övriga_externa_kostnader": {...},
  "Personalkostnader": {...},
  "Avskrivningar": {...},
  "Övriga_rörelsekostnader": {...},
  "Finansiella_intäkter": {...},
  "Finansiella_kostnader": {...},
  "Bokslutsdispositioner": {...},
  "Skatt_på_årets_resultat": {...},
  "Bruttovinst": {...},
  "Rörelseresultat": {...},
  "Resultat_efter_finansiella_poster": {...},
  "Resultat_före_skatt": {...},
  "Årets_resultat": {...}
}
```

### 6.5 VAT Report (Momsrapport)

| VBA Function | Python Function | Priority | Dependencies | Line Ref | Notes |
|-------------|-----------------|----------|--------------|----------|-------|
| `GenerateMomsrapport` | `generate_vat_report()` | HIGH | VATCode, Transactions | 196 | Main function |
| `InitializeJsonMoms` | `_init_vat_structure()` | HIGH | - | 195 | Create structure for SKV 2000 boxes |
| `AddAccountToJsonMoms` | `_add_account_to_vat()` | HIGH | - | 197 | Add account to VAT box |
| `GetBlockKey` | `_get_vat_block_key()` | HIGH | - | 201 | Map ruta (box) to block (försäljning/inköp/etc.) |
| `GetCellAddress` | `_get_cell_address()` | LOW | - | 202 | Excel cell reference |
| `GenerateMomsVerifikation` | `generate_vat_verification()` | MEDIUM | - | 203 | Auto-generate VAT posting |
| `GetMaxVerifikationsNr` | `get_max_verification_nr()` | MEDIUM | - | 204 | Get highest ver_nr for serie |
| `GenerateXMLFromJson` | `export_vat_xml()` | MEDIUM | - | 205 | Export to Skatteverket XML format |
| `GetCellValueByHeader` | `_get_value_by_header()` | LOW | - | 206 | Helper for Excel export |
| `PostprocessJsonMoms` | `_postprocess_vat_report()` | HIGH | - | 207 | Calculate saldo, avrundning |
| `GetFortnoxMnemonic` | `_get_fortnox_code()` | MEDIUM | - | 208 | Map ruta → Fortnox VAT code |
| `WriteMomsRappToExcel` | N/A (API returns JSON) | - | - | 209 | Excel export |
| `UpdateMomskoderBAS2024` | `update_bas_vat_codes()` | LOW | - | 210 | Update BAS chart VAT codes |
| `TranslateRutaToFortNox` | `translate_box_to_fortnox()` | MEDIUM | - | 211 | Ruta → Fortnox mapping |
| `UpdateMomskoderKontoplan` | `update_chart_vat_codes()` | HIGH | - | 212 | Update kontoplan VAT codes |
| `GeneratePreambleM` | `_generate_vat_preamble()` | MEDIUM | Company info | 200 | Report header |

**VAT Report Structure (JSON):**
```python
{
  "Försäljning": {
    "05": {"summa": 0, "moms": 0, "konton": []},  # Försäljning 25%/12%/6%
    "06": {...},  # Försäljning 0%
    "07": {...},  # Export
    # ...
  },
  "Inköp": {
    "10": {...},  # Inköp med avdragsrätt 25%/12%/6%
    "11": {...},  # Inköp med avdragsrätt 0%
    # ...
  },
  "Import_EU": {
    "20": {...},  # Import varor EU
    "21": {...},  # Import tjänster EU
    # ...
  },
  "Beräkning": {
    "30": {...},  # Utgående moms
    "31": {...},  # Ingående moms
    "32": {...},  # Att betala/få tillbaka
  }
}
```

**VAT Codes (Fortnox Style):**
- `MP1` = 25% moms försäljning (ruta 05)
- `MP2` = 12% moms försäljning (ruta 05)
- `MP3` = 6% moms försäljning (ruta 05)
- `MP4` = 0% moms export (ruta 07)
- More in `csv_exports/Momskoder.csv`

### 6.6 Filtered Verification List

| VBA Function | Python Function | Priority | Dependencies | Line Ref | Notes |
|-------------|-----------------|----------|--------------|----------|-------|
| `GenerateFiltreradVerLista` | `generate_filtered_verifications()` | MEDIUM | Transactions | 191 | Filter by date, konto, etc. |
| `SaveOrDisplayReport` | N/A (API response) | - | - | 192 | Format selection |
| `ConvertToDate` | `_convert_to_date()` | MEDIUM | - | 193 | yyyymmdd → date object |
| `UpdateVerifikationslistanWithMomskoder` | `update_verification_vat_codes()` | HIGH | - | 194 | Propagate VAT codes |

---

## 7. Helper Functions

| VBA Function | Python Function | Priority | Dependencies | Notes |
|-------------|-----------------|----------|--------------|-------|
| `Nz(value)` | `value or default` | - | - | Python idiom |
| `IsEmptyJsonObjectSection` | `_is_empty_section()` | MEDIUM | - | Check if report section is empty |
| `IsEmptyJsonObjectSectionBalans` | `_is_empty_balance_section()` | MEDIUM | - | Balance sheet specific |
| `LogToFile` | `logging.info()` | LOW | - | Use Python logging module |
| `GetLink` | N/A (API link) | LOW | - | Hyperlink generation |

---

## 8. OUT OF SCOPE (Will NOT be migrated)

| VBA Module/Function | Reason |
|---------------------|--------|
| ModuleLagerreskontra | Inventory/stock system - separate feature |
| ModuleKundreskontra | Customer invoicing - separate feature |
| ModuleLeverantörsreskontra | Supplier invoices - separate feature |
| Sheet12 (Artikelbokföring) | Article booking - part of inventory |
| ModuleCreateDocuments | LaTeX/PDF generation - not needed in backend |
| ModuleGenerateAndLinkPDFs | PDF linking - Excel-specific |
| JsonConverter.bas | VBA JSON library - Python has native JSON |
| Sheet handlers (Worksheet_Change, etc.) | Excel UI logic - backend is API-based |

---

## 9. Implementation Priority Order

### Sprint 1 (Week 1) - Foundation

1. **Models** (`models.py`)
   - Account, Transaction, VATCode, Dimension, DimensionObject, Verification

2. **CRC Integrity** (`integrity.py`)
   - CRC32 functions (verify against VBA output)

3. **SIE Parser - Kontoplan** (`sie_parser.py`)
   - `import_chart_of_accounts()`
   - Parse #KONTO, #KTYP, #SRU, #IB, #UB

4. **SIE Parser - Transactions** (`sie_parser.py`)
   - `import_transactions()`
   - Parse #VER, #TRANS, #BTRANS, #RTRANS
   - **FIX:** ParseObjektlistaSIE to properly parse {dim_id obj_id}

5. **Ledger** (`ledger.py`)
   - `post_transaction()`
   - `validate_transaction()`
   - `update_verification_list()`

### Sprint 2 (Week 2) - Reports & Export

6. **Reports - General Ledger** (`reports.py`)
   - `generate_general_ledger()`
   - `calculate_balance_to_date()`

7. **Reports - Balance Sheet** (`reports.py`)
   - `generate_balance_sheet()`
   - JSON structure initialization
   - Account-to-balance mapping

8. **Reports - Income Statement** (`reports.py`)
   - `generate_income_statement()`
   - JSON structure initialization
   - Special nodes (bruttovinst, rörelseresultat, etc.)

9. **Reports - VAT** (`reports.py`)
   - `generate_vat_report()`
   - SKV 2000 box mapping
   - Fortnox VAT code translation

10. **SIE Exporter** (`sie_exporter.py`)
    - `export_sie4()`
    - CP437 encoding
    - Export all tags (#KONTO, #VER, #TRANS, etc.)

### Sprint 3 (Week 3) - Edge Cases & Integration

11. **Dimension/Object Handling**
    - Robust #DIM/#OBJEKT parsing
    - Multiple dimensions support
    - Edge case testing

12. **VAT Calculation**
    - Verify öre-level precision
    - Test all VAT codes (MP1, MP2, MP3, etc.)
    - Avrundning (rounding) logic

13. **Integration Tests**
    - Full SIE import → process → export cycle
    - Verify output matches VBA CSV exports
    - CRC checksum validation

14. **API Endpoints**
    - POST /api/accounting/import-sie
    - POST /api/accounting/post-transaction
    - GET /api/accounting/reports/balance-sheet
    - GET /api/accounting/reports/income-statement
    - GET /api/accounting/reports/vat
    - GET /api/accounting/reports/general-ledger
    - POST /api/accounting/export-sie

---

## 10. Known Issues / Gaps to Fix

| Issue | VBA Behavior | Python Fix |
|-------|--------------|------------|
| **#DIM/#OBJEKT Parsing** | Assumes fixed order: {kostnadsställe kostnadsbärare projekt övrigt} | Parse according to SIE4 spec: {dim_id obj_id} with proper #DIM lookup |
| **Encoding** | Uses CP437 (IBM PC-8) with manual character replacement (Ã– → Ö) | Use proper CP437 codec in Python |
| **Date Formats** | Inconsistent YYYY-MM-DD vs YYYYMMDD | Standardize on ISO 8601 (YYYY-MM-DD) internally, YYYYMMDD for SIE |
| **Null Handling** | Uses `Nz()` function everywhere | Use Python `or` idiom: `value or default` |
| **Excel Dependencies** | Hard-coded sheet names, cell references | Abstract to config/database |
| **CRC Implementation** | Custom VBA implementation | Verify Python `zlib.crc32()` matches OR implement identical algorithm |

---

## 11. Test Coverage Requirements

Each function must have:
1. **Unit test** with typical input → expected output
2. **Edge case tests**:
   - Empty input
   - Invalid format
   - Missing required fields
   - Special characters (ÅÄÖ)
   - Multiple dimensions/objects
3. **Integration test** using SIE4 Exempelfil.SE
4. **Comparison test** against VBA CSV exports (byte-for-byte where applicable)

---

## 12. Success Criteria

- ✅ Can import `SIE4 Exempelfil.SE` without errors
- ✅ Kontoplan matches `csv_exports/Kontoplan.csv`
- ✅ Transactions match `csv_exports/Verifikationslista2.csv`
- ✅ Balance sheet matches `csv_exports/Balansrapport.csv`
- ✅ Income statement matches `csv_exports/Resultatrapport.csv`
- ✅ VAT calculations exact to öre-level
- ✅ Can export back to valid SIE4 format
- ✅ CRC checksums match VBA output
- ✅ #DIM/#OBJEKT parsing robust and spec-compliant
- ✅ 100% pytest coverage for all CRITICAL and HIGH priority functions

---

**Next Step:** Set up Python project structure and begin TDD with SIE parser tests.
