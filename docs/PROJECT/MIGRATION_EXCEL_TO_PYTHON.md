# Migration: Excel VBA Bokföringsprogram → Python Backend

**Datum:** 2025-10-31  
**Status:** 📋 Planering - Väntar på Extensions-Claude  
**Källa:** Book19.xlsm (skapad december 2024)

---

## Översikt

Vi har ett fungerande Excel-baserat bokföringsprogram (Book19.xlsm) utvecklat med ChatGPT sommaren 2024. Detta ska migreras till Python-backend för Celestial Onboarding App.

**Mål:** Extrahera och översätta VBA-logik till Python med pytest-tester, sedan integrera i backend.

---

## Källfiler

### 1. Book18.xlsm
**Sökväg:** `/home/lasse/Documents/Onboarding_App/Excel_bokforingsprogram/Book18.xlsm`  
**Storlek:** 1.0 MB  
**Skapad:** December 2024  
**Utvecklingspartner:** ChatGPT GPT-o3 (sommaren 2024)

**⚠️ VIKTIGT: Scope för migrering**

**INKLUDERA ENDAST dessa flikar/moduler:**

✅ **Företagsinformation** - Parsas från SIE-filens header (#FNAMN, #ORGNR, #FNR, etc.)

✅ **Konteringsinfo2** - Projekt och kostnadsställen/resultatenheter från SIE (#DIM, #OBJEKT)

✅ **Verifikationslista2** - Resultat av SIE-import (SIE-gruppens exempelfil)
- Verifikationslista3 är samma som Verifikationslista2 (kan ignoreras)

✅ **Bokföring** - Användarinterface med samma kolumner som Verifikationslista
- Vid `BokföringKnapp_Click`: Rader kopieras till Verifikationslista från rad 2
- Headers kopieras från Bokföring-fliken till Verifikationslista

✅ **Inställningar** - Verifikationsseriens symboler och senaste nummer
- Exempel: A=59 → nästa bokföring med serie A får Ver_nr=60 → räknas upp i Inställningar

✅ **Momskoder** - Svenska momskoder Fortnox-style:
- MP1 = Momspliktig försäljning exkl. moms 25% (ruta 05 momsdeklaration)
- MP2 = Momspliktig försäljning exkl. moms 12% (ruta 05)
- MP3 = 6% (ruta 05), etc.

✅ **BAS2024** - BAS-kontoplanen som hämtad från BAS (utan modifikationer)

✅ **BASKontoplan** - BAS2024 med Fortnox momskoder ifyllda i kolumn "Moms"

✅ **Kontoplan** - Resultat av programmets parsning av SIE-filen (SIE-gruppens exempelfil)

✅ **Resultatrapport** - Genererad från SIE-gruppens exempelfil

✅ **Balansrapport** - Genererad från parsning av samma fil från SIE-gruppen

✅ **Huvudbok** - Genererad från parsning av SIE-gruppens exempelfil

✅ **Momsrapport** - Genererad från parsning av SIE-gruppens exempelfil

✅ **Rapporter** - Interface där användaren sätter kryss i matris för önskade rapporter

**❌ IGNORERA (EJ I SCOPE):**

❌ **Artikelbokföring** - Lagerreskontra-system (Sheet12, ModuleLagerreskontra, 1018 rader)

❌ **Kundreskontra** - Fakturabokföring (ModuleKundreskontra, 326 rader, KundfakturaVerlista)

❌ **Leverantörsreskontra** - Leverantörsfakturor (ModuleLeverantörsreskontra, 1 rad)

❌ **Objekt och Dimensioner** - Halvfärdigt försök att vidareutveckla Konteringsinfo2

❌ **Artikelrelaterade flikar:**
- ArtikelkontoplanArtikelregister
- ArtikelkontoplanLeverantörer  
- Artikelverifikationslista
- FakturaKundbokforing / FakturaKundbokföring
- Leverantörsbokföring

**FOKUS:** Core bokföringssystem (SIE import/export, verifikationer, rapporter) - INTE reskontrasystem.

**Funktionalitet (in scope):**
- **SIE-import:** Läser SIE4-filer och importerar verifikationer
- **SIE-export:** Exporterar bokföringsdata till SIE4-format
- **Resultatrapport:** Bygger resultatrapport från bokföringsdata
- **Balansrapport:** Bygger balansrapport
- **Huvudbok:** Genererar huvudbok per konto
- **Momsrapport:** Beräknar och presenterar momsdata
- **Bokföringsinterface:** 
  - Flik med kolumner för bokföringsposter
  - "Bokför"-knapp som lägger poster i "Verifikationslista"
  - Kryssrutor för att välja vilka rapporter som ska genereras

**Teknisk struktur:**
- `.xlsm` = Excel Macro-enabled Workbook
- Innehåller VBA-makron (51 moduler totalt, men ~15 moduler in scope)
- Flera Excel-ark (30 sheets totalt, men ~12 sheets in scope)

### 2. Node/Express SIE-projekt
**Sökväg:** ??? (behöver lokaliseras)  
**Utvecklad:** 2024 (eller tidigare)  
**Utvecklingspartner:** O3

**Funktionalitet:**
- SIE-import och parsing
- Kontrollräkning av bokföringsposter
- Anropar Python via gRPC för komplex räknelogik

**Problem:** Behövde gRPC-anrop till Python för korrekt räkning (komplexitet i räknelogik).

---

## VBA-kod Extrahering

### ✅ Status: KOMPLETT

VBA-makron och CSV-data har extraherats från Book18.xlsm:

**📂 CSV-data (30 filer, 720 KB):**
```bash
/home/lasse/Documents/Onboarding_App/Excel_bokforingsprogram/csv_exports/
```

**📂 VBA-moduler (51 filer, 513 KB):**
```bash
/home/lasse/Documents/Onboarding_App/Excel_bokforingsprogram/vba_extracted/
```

**Viktiga moduler (in scope):**
- `Module1.bas.vba` (483 rader, 22 KB) - Core bokföringslogik
- `ModuleImportSIE4.bas.vba` (836 rader, 33 KB) - SIE4-import
- `ModuleExportSIE4.bas.vba` (488 rader, 18 KB) - SIE4-export
- `ModuleGenerateReports.bas.vba` (4507 rader, 204 KB) - Alla rapporter
- `ModuleCRC.bas.vba` (198 rader, 6 KB) - CRC-checksummor
- `Module2.bas.vba` (179 rader, 7 KB) - Initieringar
- `JsonConverter.bas.vba` (1123 rader, 45 KB) - JSON-hantering

**Ignorera (out of scope):**
- `ModuleLagerreskontra.bas.vba` (1018 rader) - ❌ Lagerreskontra
- `ModuleKundreskontra.bas.vba` (326 rader) - ❌ Kundreskontra
- `ModuleLeverantörsreskontra.bas.vba` (1 rad) - ❌ Leverantörsreskontra
- `Sheet12.cls.vba` (235 rader) - ❌ Artikelbokföring

**📄 Dokumentation:**
```bash
/home/lasse/Documents/Onboarding_App/Excel_bokforingsprogram/csv_exports/Dokumentation.csv
```
245 rader med komplett funktionsdokumentation (skriven med ChatGPT GPT-o3).

### Extraktionsscript

**extract_sheets_to_csv.py** (✅ kördes 2025-10-31)
```python
import openpyxl
import csv
import os

def extract_all_sheets_to_csv(xlsm_file, output_dir='csv_exports'):
    workbook = openpyxl.load_workbook(xlsm_file, data_only=True)
    os.makedirs(output_dir, exist_ok=True)
    
    for sheet_name in workbook.sheetnames:
        sheet = workbook[sheet_name]
        csv_filename = os.path.join(output_dir, f"{sheet_name}.csv")
        
        with open(csv_filename, 'w', newline='', encoding='utf-8') as csvfile:
            csv_writer = csv.writer(csvfile)
            for row in sheet.iter_rows(values_only=True):
                if any(cell is not None for cell in row):
                    csv_writer.writerow(row)
```

**extract_vba_macros.py** (✅ kördes 2025-10-31)
```python
from oletools.olevba import VBA_Parser
import os

def extract_vba_macros(xlsm_file, output_dir='vba_extracted'):
    os.makedirs(output_dir, exist_ok=True)
    vba_parser = VBA_Parser(xlsm_file)
    
    if not vba_parser.detect_vba_macros():
        print("❌ No VBA macros found!")
        return
    
    for (filename, stream_path, vba_filename, vba_code) in vba_parser.extract_macros():
        safe_filename = vba_filename.replace('/', '_').replace('\\', '_')
        output_file = os.path.join(output_dir, f"{safe_filename}.vba")
        
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(f"' Source: {filename}\n")
            f.write(f"' Stream: {stream_path}\n")
            f.write(f"' Module: {vba_filename}\n\n")
            f.write(vba_code)
```

### Metod 1: Manuell extraktion (inte längre nödvändig)
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(vba_code)
            print(f"Extracted: {output_file}")
    else:
        print("No VBA macros found")
    
    vba.close()

if __name__ == '__main__':
    xlsm_file = sys.argv[1] if len(sys.argv) > 1 else 'Book19.xlsm'
    extract_vba_from_xlsm(xlsm_file)
```

---

## Migrations-plan (TDD-approach)

### Fas 0: Förberedelser (KOMPLETT ✅)
**Tid:** 1 timme  
**Utfört:** 2025-10-31

1. ✅ **Extraherade VBA-kod** från Book18.xlsm (51 moduler, 513 KB)
2. ✅ **Extraherade CSV-data** från Book18.xlsm (30 sheets, 720 KB)
3. ✅ **Dokumentation tillgänglig** i `Dokumentation.csv` (245 rader)
4. ✅ **Scope definierad** (core bokföring, INTE reskontror)
5. ✅ **Migrationsplan skapad** (detta dokument)

**Nästa:** Väntar på Extensions-Claude (rate limit reset ~01:00 svensk tid)

### Fas 1: Kodgranskning och dokumentation (Extensions-Claude)
**Tid:** 1-2 timmar

1. ✅ **Extrahera VBA-kod** från Book18.xlsm (KLART)
2. **Läs Dokumentation.csv:**
   - 245 rader med funktionsbeskrivningar
   - Alla Sub/Function redan dokumenterade
   - Dependencies identifierade
3. **Skapa funktionsmatris:**
   ```
   VBA Function (Module)                    | Python Equivalent                  | Dependencies           | Priority | Status
   -----------------------------------------|------------------------------------|------------------------|----------|--------
   BokforingKnapp_Click (Module1)          | ledger.post_transaction()          | None                   | HIGH     | TODO
   ImportKontoplanAndBalancesFromSIE (*)   | sie_parser.import_chart_of_accounts() | File parsing        | HIGH     | TODO
   ImportTransactionsFromSIE (*)           | sie_parser.import_transactions()   | Kontoplan              | HIGH     | TODO
   ExportToSIE4 (ModuleExportSIE4)         | sie_exporter.export_sie4()         | All data               | MEDIUM   | TODO
   GenerateResultatrapport (**)            | reports.generate_income_statement() | Verifikationslista    | HIGH     | TODO
   GenerateBalansrapport (**)              | reports.generate_balance_sheet()   | Verifikationslista    | HIGH     | TODO
   GenerateMomsrapport (**)                | reports.generate_vat_report()      | Verifikationslista    | HIGH     | TODO
   GenerateHuvudbokRapp (**)               | reports.generate_ledger()          | Verifikationslista    | MEDIUM   | TODO
   CalculateAllChecksums (ModuleCRC)       | integrity.calculate_crc32()        | Row data               | LOW      | TODO
   GetBenamning (multiple)                 | kontoplan.get_account_name()       | Kontoplan              | HIGH     | TODO
   UppdateraVerifikationslista (Module1)   | ledger.update_transaction_list()   | Bokföring sheet        | HIGH     | TODO
   
   (*) ModuleImportSIE4
   (**) ModuleGenerateReports
   ```

4. **IGNORERA dessa moduler:**
   - ❌ ModuleLagerreskontra (1018 rader) - Lagerreskontra
   - ❌ ModuleKundreskontra (326 rader) - Kundreskontra  
   - ❌ ModuleLeverantörsreskontra (1 rad) - Leverantörsreskontra
   - ❌ Sheet12 Artikelbokföring (235 rader)
   - ❌ Alla artikelrelaterade funktioner i Dokumentation.csv

5. **Granska Node/Express-kod:**
   - Lokalisera projektet (om det finns)
   - Identifiera SIE-parsing logik
   - Identifiera gRPC-anrop till Python
   - Dokumentera räknelogik som redan finns i Python

### Fas 2: Test-driven Development (Extensions-Claude)
**Tid:** 3-5 timmar

**Princip:** Skriv tester FÖRST, sedan implementation.

**Mapstruktur:**
```
tic-tac-toe-server/
├── sie/
│   ├── __init__.py
│   ├── parser.py              # SIE4-parsing
│   ├── exporter.py            # SIE4-export
│   ├── validator.py           # Verifikation validation
│   └── models.py              # Data models (Verifikation, Account, etc.)
├── reports/
│   ├── __init__.py
│   ├── result_report.py       # Resultatrapport
│   ├── balance_sheet.py       # Balansrapport
│   ├── general_ledger.py      # Huvudbok
│   └── vat_report.py          # Momsrapport
├── ledger/
│   ├── __init__.py
│   ├── transaction.py         # Bokföringspost-hantering
│   └── posting.py             # Post till verifikationslista
├── tests/
│   ├── test_sie_parser.py
│   ├── test_sie_exporter.py
│   ├── test_result_report.py
│   ├── test_balance_sheet.py
│   ├── test_general_ledger.py
│   ├── test_vat_report.py
│   ├── test_transaction.py
│   └── fixtures/
│       ├── sample_sie.se       # Mock SIE4-fil
│       └── expected_output.json
└── requirements.txt
```

**Test-exempel (test_sie_parser.py):**
```python
import pytest
from sie.parser import SIEParser
from sie.models import Verifikation, Account

def test_parse_sie4_basic():
    """Test parsing av grundläggande SIE4-fil"""
    parser = SIEParser()
    data = parser.parse_file('tests/fixtures/sample_sie.se')
    
    assert data.company_name == "Test AB"
    assert data.org_nr == "556123-4567"
    assert len(data.verifications) > 0

def test_parse_verification():
    """Test parsing av enskild verifikation"""
    parser = SIEParser()
    ver = parser.parse_verification("#VER A 1 20240115 'Konsultkostnad'")
    
    assert ver.series == "A"
    assert ver.number == 1
    assert ver.date == "2024-01-15"
    assert ver.description == "Konsultkostnad"

def test_debit_credit_balance():
    """Test att debet = kredit för varje verifikation"""
    parser = SIEParser()
    data = parser.parse_file('tests/fixtures/sample_sie.se')
    
    for ver in data.verifications:
        total_debit = sum(row.debit for row in ver.rows)
        total_credit = sum(row.credit for row in ver.rows)
        assert total_debit == total_credit, f"Ver {ver.number}: Debet {total_debit} != Kredit {total_credit}"

@pytest.mark.parametrize("account,expected_type", [
    ("1510", "asset"),
    ("2440", "liability"),
    ("3000", "equity"),
    ("4000", "revenue"),
    ("6000", "expense"),
])
def test_account_classification(account, expected_type):
    """Test kontoklassificering enligt BAS"""
    from sie.models import classify_account
    assert classify_account(account) == expected_type
```

**Körning:**
```bash
cd tic-tac-toe-server
pytest tests/ -v
pytest tests/test_sie_parser.py -v
pytest tests/ --cov=sie --cov-report=html
```

### Fas 3: Implementation (Extensions-Claude)
**Tid:** 5-8 timmar

**Arbetsgång:**
1. **En funktion i taget:**
   - Skriv test (RÖTT)
   - Implementera funktionen (GRÖNT)
   - Refaktorera (CLEAN)
2. **Använd befintlig Python-kod:**
   - Om gRPC-räknelogik finns → Återanvänd
   - Om Node/Express-parsing finns → Översätt till Python
3. **Mock externa beroenden:**
   - Använd `pytest-mock` för API-anrop
   - Använd fixtures för testdata

**Prioritetsordning:**
1. **SIE-parsing** (kritiskt för allt annat)
2. **Verifikationsvalidering** (debet=kredit, kontokontroll)
3. **Resultatrapport** (enklaste rapporten)
4. **Balansrapport**
5. **Huvudbok**
6. **Momsrapport**
7. **SIE-export** (sist)

### Fas 4: API-integration (Extensions-Claude)
**Tid:** 2-3 timmar

**Endpoints att skapa:**
```python
# main.py (FastAPI eller Flask)
from fastapi import FastAPI, UploadFile, File
from sie.parser import SIEParser
from reports.result_report import generate_result_report

app = FastAPI()

@app.post("/api/sie/upload")
async def upload_sie(file: UploadFile = File(...)):
    """Ladda upp och parsa SIE-fil"""
    content = await file.read()
    parser = SIEParser()
    data = parser.parse_bytes(content)
    return {"status": "success", "verifications": len(data.verifications)}

@app.get("/api/reports/result/{company_id}")
async def get_result_report(company_id: str, year: int = 2024):
    """Hämta resultatrapport"""
    report = generate_result_report(company_id, year)
    return report.to_dict()

@app.get("/api/reports/balance/{company_id}")
async def get_balance_sheet(company_id: str, date: str = None):
    """Hämta balansrapport"""
    from reports.balance_sheet import generate_balance_sheet
    report = generate_balance_sheet(company_id, date)
    return report.to_dict()

@app.get("/api/ledger/{company_id}/{account}")
async def get_general_ledger(company_id: str, account: str):
    """Hämta huvudbok för konto"""
    from reports.general_ledger import generate_ledger
    ledger = generate_ledger(company_id, account)
    return ledger.to_dict()

@app.post("/api/transactions/post")
async def post_transaction(transaction: dict):
    """Bokför ny verifikation"""
    from ledger.posting import post_to_ledger
    result = post_to_ledger(transaction)
    return {"status": "posted", "verification_id": result.id}
```

**Frontend-integration:**
```javascript
// BokforingDataSlide.jsx
const handleSIEUpload = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('http://localhost:8000/api/sie/upload', {
    method: 'POST',
    body: formData,
  });
  
  const data = await response.json();
  console.log(`Imported ${data.verifications} verifications`);
};
```

### Fas 5: Deployment och dokumentation (Extensions-Claude)
**Tid:** 1-2 timmar

1. **requirements.txt:**
   ```
   fastapi==0.104.1
   uvicorn[standard]==0.24.0
   pytest==7.4.3
   pytest-cov==4.1.0
   pytest-mock==3.12.0
   python-multipart==0.0.6
   pydantic==2.5.0
   ```

2. **README i backend:**
   ```markdown
   # SIE Bokföringssystem - Python Backend
   
   ## Installation
   pip install -r requirements.txt
   
   ## Köra tester
   pytest tests/ -v
   
   ## Starta server
   uvicorn main:app --reload --port 8000
   
   ## API Dokumentation
   http://localhost:8000/docs
   ```

3. **Commit-meddelande:**
   ```
   feat(backend): Migrate Excel VBA accounting to Python
   
   - Extracted and translated VBA code from Book19.xlsm
   - Implemented SIE4 parser with full test coverage
   - Created report generators (result, balance, ledger, VAT)
   - Built FastAPI endpoints for frontend integration
   - All functions have pytest unit tests (95% coverage)
   - Reused gRPC calculation logic from previous Node project
   
   Migrated functionality:
   - SIE import/export
   - Resultatrapport, Balansrapport, Huvudbok, Momsrapport
   - Transaction posting and validation
   ```

---

## Node/Express-projekt Lokalisering

**TODO:** Hitta och dokumentera Node/Express-projektet med SIE-import och gRPC-anrop.

**Möjliga platser:**
- `/home/lasse/Documents/Onboarding_App/` (sökväg?)
- Annan workspace?

**Vad vi behöver från Node-projektet:**
- SIE-parsing logik (översätt till Python)
- Kontrollräkning av bokföringsposter
- Python gRPC-server kod (räknelogik)
- Test-fixtures och exempel-SIE-filer

---

## Risker och utmaningar

### 1. VBA → Python översättning
**Risk:** Subtila skillnader i räknelogik  
**Mitigering:** Omfattande tester med samma testdata i både Excel och Python

### 2. SIE4-format komplexitet
**Risk:** Edge cases i SIE-parsing  
**Mitigering:** Använd verkliga SIE-filer från Fortnox/Visma som testdata

### 3. Momsberäkning precision
**Risk:** Avrundningsfel i momsberäkningar  
**Mitigering:** Använd `decimal.Decimal` istället för `float` i Python

### 4. Performance på stora SIE-filer
**Risk:** Långsam parsing av 10,000+ verifikationer  
**Mitigering:** Profilera och optimera, överväg streaming parser

---

## Framtida förbättringar

1. **Batch-import av SIE-filer** (flera företag samtidigt)
2. **Automatisk kontoplan-mappning** (BAS → K2/K3)
3. **AI-validering av verifikationer** (flagga misstänkta poster)
4. **Excel-export av rapporter** (för backup/arkivering)
5. **WebSocket-notiser** för långvariga operationer

---

## Referenser

- **SIE4-specifikation:** https://www.sie.se/
- **BAS-kontoplan:** https://www.bas.se/
- **pytest dokumentation:** https://docs.pytest.org/
- **FastAPI dokumentation:** https://fastapi.tiangolo.com/

---

## Nästa steg för Extensions-Claude

1. ✅ Läs denna dokumentation noggrant
2. ⏳ Extrahera VBA-kod från Book19.xlsm
3. ⏳ Skapa funktionsmatris (VBA → Python mapping)
4. ⏳ Lokalisera Node/Express-projekt med gRPC-kod
5. ⏳ Skriv pytest-tester för SIE-parser (TDD)
6. ⏳ Implementera SIE-parser
7. ⏳ Fortsätt med rapportgenerering...

---

**Status:** 📋 Dokumentation klar - Väntar på Extensions-Claude återkomst (ca 01:00 svensk tid 2025-11-01)
