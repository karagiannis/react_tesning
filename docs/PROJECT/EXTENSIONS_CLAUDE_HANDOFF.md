# Extensions-Claude Handoff - Bokföringssystem Migration

**Datum:** 2025-11-01  
**Från:** GitHub Copilot (huvudassistent)  
**Till:** Extensions-Claude  
**Rate limit reset:** Bekräftat aktiv igen 2025-11-01 14:47  
**UPPDATERING:** 2025-11-01 18:30 - SIE-spec OCR klar, se docs/SIE_spec_OCR_2025-11-01.md

---

## 🆕 NYA RESURSER (2025-11-01 18:30)

**SIE Specification OCR (37 sidor, Markdown):**
```
/home/lasse/Documents/Onboarding_App/tic-tac-toe-app/docs/SIE_spec_OCR_2025-11-01.md
```

- ✅ Extraherad med olmOCR-2-7B på Google Colab A100 (80GB VRAM)
- ✅ Innehåller **komplett dokumentation** av #DIM, #OBJEKT, #UNDERDIM
- ✅ Exempel på hierarkiska dimensioner (avdelning → underavdelning)
- ✅ Reserverade dimensionsnummer (1=Kostnadsställe, 6=Projekt, 7=Anställd, etc.)
- ✅ Använd denna för att förstå korrekt parsing av Objekt/Dimensioner i SIE4-import

**VARFÖR VIKTIG:** VBA-modulerna hanterar Objekt/Dimensioner inkonsekvent. SIE-spec OCR:n ger dig sanningen för att implementera korrekt Python-parser.

---

## 🆕 BONUS: TypeScript SIE-Parser Referensimplementation (2025-11-01 18:45)

**Bokföringsapp (Fortnox-klon med GPT-o3, sommaren 2024):**
```
/home/lasse/Documents/Onboarding_App/bokforingsapp/
```

**SIE-parsing TypeScript-kod:**
```typescript
// Objekt/Dimensioner parsing
server/src/services/sieImport/importDimensionsAndObjectsFromSIE.ts

// Kontoplan & Balances parsing
server/src/services/sieImport/importKontoplanAndBalancesFromSIE.ts

// Routes
server/src/routes/sieImportRoutes.ts

// Frontend importer (JavaScript)
klient/js/SIE4Importer.js
```

**VARFÖR ANVÄNDBAR:**
- ✅ Modern TypeScript implementation av SIE4-parsing
- ✅ Hanterar #DIM, #UNDERDIM, #OBJEKT korrekt (länkade med superdimensionId)
- ✅ Jämför med VBA-parsing för att hitta gaps
- ✅ Kan användas som referens för Python-implementation

**TODO för Extensions-Claude:**
1. Öppna `importDimensionsAndObjectsFromSIE.ts` (42 rader)
2. Jämför med `ModuleImportSIE4.bas.vba` (836 rader)
3. Identifiera skillnader i parsing-logik
4. Dokumentera i funktionsmatrix

---

## ⚠️ VIKTIGT: Temp backend att IGNORERA och DELETA (2025-11-01 18:50)

**DELETA DENNA MAPP:**
```
/home/lasse/Documents/Onboarding_App/tic-tac-toe-app/backend/
```

**VARFÖR:**
- ❌ Temporär testmapp från tidigare experiment (2025-11-01 15:02-15:45)
- ❌ Fel plats (ligger i frontend-repo, borde vara i tic-tac-toe-server)
- ❌ Ska INTE användas för migration
- ❌ Skapar förvirring

**OFFICIELL BACKEND:**
```
/home/lasse/Documents/Onboarding_App/tic-tac-toe-server/
```

**ACTION REQUIRED:**
```bash
rm -rf /home/lasse/Documents/Onboarding_App/tic-tac-toe-app/backend/
```

Använd VBA-kod + TypeScript-referens + SIE-spec OCR för migration. INTE denna temp-backend!

---

## 👋 Välkommen tillbaka!

Vi har förberett två stora arbetspaket som passar perfekt för din codebase-scanning och systematiska implementation:

1. **VBA → Python Migration** (Excel bokföringsprogram)
2. **Settings Page Implementation** (React frontend, baserad på Volt Pro)

---

## 📦 Paket 1: VBA Migration (Högsta prioritet)

### Vad har hänt?

Vi har extraherat **komplett VBA-kod** och **CSV-data** från ett Excel-baserat bokföringsprogram (Book18.xlsm, utvecklat med ChatGPT GPT-o3 sommaren 2024). Nu ska detta migreras till Python-backend.

### Tillgängliga filer

**VBA-kod (51 moduler, 513 KB):**
```bash
/home/lasse/Documents/Onboarding_App/Excel_bokforingsprogram/vba_extracted/
```

**CSV-data (30 sheets, 720 KB):**
```bash
/home/lasse/Documents/Onboarding_App/Excel_bokforingsprogram/csv_exports/
```

**Dokumentation (245 rader funktionsbeskrivningar):**
```bash
/home/lasse/Documents/Onboarding_App/Excel_bokforingsprogram/csv_exports/Dokumentation.csv
```

**Migrationsplan:**
```bash
/home/lasse/Documents/Onboarding_App/tic-tac-toe-app/docs/PROJECT/MIGRATION_EXCEL_TO_PYTHON.md
```

### Viktiga moduler (IN SCOPE)

✅ **Module1.bas.vba** (483 rader, 22 KB)
- Core bokföringslogik
- `BokforingKnapp_Click()` - Main entry point
- `UppdateraVerifikationslista()` - Update transaction list
- `GetBenamning()` - Get account names from chart

✅ **ModuleImportSIE4.bas.vba** (836 rader, 33 KB)
- SIE4-import parsing
- `ImportKontoplanAndBalancesFromSIE()`
- `ImportTransactionsFromSIE()`
- Handling of #FNAMN, #ORGNR, #FNR, #DIM, #OBJEKT, etc.

✅ **ModuleExportSIE4.bas.vba** (488 rader, 18 KB)
- SIE4-export generation
- `ExportToSIE4()` - Main export function
- CRC checksum calculation

✅ **ModuleGenerateReports.bas.vba** (4507 rader, 204 KB)
- `GenerateResultatrapport()` - Income statement
- `GenerateBalansrapport()` - Balance sheet
- `GenerateMomsrapport()` - VAT report
- `GenerateHuvudbokRapp()` - General ledger

✅ **ModuleCRC.bas.vba** (198 rader, 6 KB)
- CRC32 checksums for SIE integrity

✅ **JsonConverter.bas.vba** (1123 rader, 45 KB)
- JSON serialization/deserialization (might not need to migrate, Python has native JSON)

### Ignorera dessa (OUT OF SCOPE)

❌ **ModuleLagerreskontra.bas.vba** (1018 rader) - Inventory/stock system
❌ **ModuleKundreskontra.bas.vba** (326 rader) - Customer invoicing
❌ **ModuleLeverantörsreskontra.bas.vba** (1 rad) - Supplier invoices
❌ **Sheet12.cls.vba** (235 rader) - Article booking interface

**FOKUS:** Core accounting (SIE import/export, transactions, reports) - NOT inventory/invoicing subsystems.

### Din uppgift

**Fas 1: Funktionsmatris (1-2 timmar)**

1. **Läs Dokumentation.csv:**
   - 245 rader med färdiga funktionsbeskrivningar
   - Alla Sub/Function dokumenterade av GPT-o3
   - Dependencies redan identifierade

2. **Skapa mapping VBA → Python:**
   ```
   VBA Function                     | Python Module  | Function Name              | Priority | Dependencies
   ---------------------------------|----------------|----------------------------|----------|------------------
   BokforingKnapp_Click            | ledger.py      | post_transaction()         | HIGH     | None
   ImportKontoplanAndBalancesFromSIE| sie_parser.py  | import_chart_of_accounts() | HIGH     | File I/O
   ImportTransactionsFromSIE       | sie_parser.py  | import_transactions()      | HIGH     | Kontoplan
   ExportToSIE4                    | sie_exporter.py| export_sie4()              | MEDIUM   | All data
   GenerateResultatrapport         | reports.py     | generate_income_statement()| HIGH     | Transactions
   GenerateBalansrapport           | reports.py     | generate_balance_sheet()   | HIGH     | Transactions
   GenerateMomsrapport             | reports.py     | generate_vat_report()      | HIGH     | VAT codes
   GenerateHuvudbokRapp            | reports.py     | generate_ledger()          | MEDIUM   | Transactions
   ```

3. **Identifiera komplex logik:**
   - SIE-parsing av #DIM, #OBJEKT (project dimensions)
   - Momsberäkningar (MP1=25%, MP2=12%, MP3=6%)
   - Rapport-aggregering (gruppering per konto, period)
   - CRC-checksummor för SIE-integritet

**Fas 2: TDD Implementation (3-5 timmar per modul)**

Vi följer strikt TDD:
1. Skriv test FÖRST (baserat på VBA-logik + Dokumentation.csv)
2. Implementera Python-funktion
3. Kör test
4. Refactor
5. Dokumentera

**Exempel - SIE Import:**
```python
# tests/test_sie_parser.py
def test_import_kontoplan_basic():
    """Test import of simple chart of accounts from SIE4."""
    sie_content = """
    #FLAGGA 0
    #PROGRAM "TestApp" 1.0
    #FORMAT PC8
    #GEN 20250101
    #SIETYP 4
    #FNAMN "Test AB"
    #ORGNR 5569038671
    #KONTO 1910 "Kassa"
    #KONTO 3000 "Försäljning"
    """
    
    parser = SIEParser(sie_content)
    kontoplan = parser.import_chart_of_accounts()
    
    assert len(kontoplan) == 2
    assert kontoplan[1910].name == "Kassa"
    assert kontoplan[3000].name == "Försäljning"

def test_import_transactions_with_vat():
    """Test import of transactions with VAT codes."""
    # Based on VBA logic in ModuleImportSIE4
    # ...
```

**Strukturförslag:**
```
backend/
├── accounting/
│   ├── __init__.py
│   ├── models.py          # Account, Transaction, VAT Code classes
│   ├── sie_parser.py      # SIE4 import (från ModuleImportSIE4.bas)
│   ├── sie_exporter.py    # SIE4 export (från ModuleExportSIE4.bas)
│   ├── ledger.py          # Transaction management (från Module1.bas)
│   ├── reports.py         # All reports (från ModuleGenerateReports.bas)
│   ├── integrity.py       # CRC checksums (från ModuleCRC.bas)
│   └── kontoplan.py       # Chart of accounts helpers
├── tests/
│   ├── test_sie_parser.py
│   ├── test_sie_exporter.py
│   ├── test_ledger.py
│   ├── test_reports.py
│   └── fixtures/
│       ├── example_sie4.se      # Test SIE files
│       └── expected_outputs.json
└── requirements.txt
```

### Testdata tillgängligt

**SIE-gruppens exempelfil:**
```bash
/home/lasse/Documents/Onboarding_App/tic-tac-toe-app/SIE/SIE4 Exempelfil.SE
```

Denna fil har redan **tolkats av VBA-programmet** och resultaten finns i:
- `csv_exports/Kontoplan.csv` (parsed chart of accounts)
- `csv_exports/Verifikationslista2.csv` (parsed transactions)
- `csv_exports/Resultatrapport.csv` (generated income statement)
- `csv_exports/Balansrapport.csv` (generated balance sheet)

**→ Använd dessa som expected outputs i pytest!**

### Prioriterad körplan

**Sprint 1 (Vecka 1):**
1. ✅ SIE Parser (import_chart_of_accounts, import_transactions)
2. ✅ Ledger (post_transaction, update_transaction_list)
3. ✅ Basic models (Account, Transaction, VATCode)

**Sprint 2 (Vecka 2):**
4. ✅ Reports (income_statement, balance_sheet)
5. ✅ VAT calculation logic
6. ✅ SIE Exporter (export_sie4)

**Sprint 3 (Vecka 3):**
7. ✅ CRC integrity checks
8. ✅ Edge case handling (#DIM, #OBJEKT parsing)
9. ✅ Integration tests med full SIE-fil

### Känd problemområde: Objekt/Dimensioner

**Background:**
- SIE4-specen definierar #DIM (dimensions) och #OBJEKT (dimension values)
- Används för projektkoder, kostnadsställen, resultatenheter
- VBA-koden i `ModuleImportSIE4.bas` har parsing för dessa
- Ett Node/Express-projekt försökte implementera detta men behövde gRPC till Python för komplex räknelogik

**Din uppgift:**
1. Granska VBA-implementationen av #DIM/#OBJEKT parsing
2. Jämför med SIE-spec (vi kör OCR på PDF:en just nu, resultat kommer i `~/Documents/Onboarding_App/olmocr/SIE_spec_extracted.txt`)
3. Identifiera gaps/buggar i parsing-logik
4. Implementera robust Python-version med tester för edge cases:
   - Flera dimensioner (projekt + kostnadsställe)
   - Saknade värden
   - Alternativa separatorer

**Todo-lista specifikt för Objekt/Dimensioner:**
- [ ] Locate Node/Express SIE project (user kommer kopiera från Lenovo-laptop)
- [ ] Review VBA vs Node implementation differences
- [ ] Extract #DIM/#OBJEKT parsing logic from ModuleImportSIE4.bas
- [ ] Write pytest for all edge cases
- [ ] Implement robust Python parser
- [ ] Document findings in gap analysis

### Resurser

**SIE-spec OCR (pågår just nu):**
```bash
# Kolla status:
tail -f ~/Documents/Onboarding_App/olmocr/ocr_log.txt

# När klar, läs:
cat ~/Documents/Onboarding_App/olmocr/SIE_spec_extracted.txt
```

**BAS-kontoplan (Swedish standard chart of accounts):**
```bash
/home/lasse/Documents/Onboarding_App/Excel_bokforingsprogram/csv_exports/BAS2024.csv
/home/lasse/Documents/Onboarding_App/Excel_bokforingsprogram/csv_exports/BASKontoplan.csv  # Med Fortnox momskoder
```

**Momskoder (Fortnox-style):**
- MP1 = 25% moms (försäljning, ruta 05 i momsdeklaration)
- MP2 = 12% moms (försäljning, ruta 05)
- MP3 = 6% moms (försäljning, ruta 05)
- MP4 = 0% moms (export, ruta 07)
- Mer i `csv_exports/Momskoder.csv`

---

## 📦 Paket 2: Settings Page Implementation

### Vad har hänt?

Vi har analyserat **Volt Pro** (React dashboard template) och skapat en **komplett specifikation** för Settings-sidan iteration 2 med nya features:

**Volt Pro-analys:**
```bash
/home/lasse/Documents/Onboarding_App/tic-tac-toe-app/docs/DESIGN/VOLT_PRO_USERS_PAGE_ANALYSIS.md
```

**Settings-spec v2:**
```bash
/home/lasse/Documents/Onboarding_App/tic-tac-toe-app/docs/specifications/SettingsPage_v2.md
```
(2300 rader, komplett med alla komponenter)

### Nya features i v2

**Navigation fix:**
- ← Tillbaka till Dashboard button (saknades i v1)

**Ny sektion: Kollega-inlogg**
- Shadow/träningsläge för assistenter
- Tillfällig accesstoken som går ut efter X timmar
- Används för att låta kollega se vad byrån ser utan egen inloggning

**Ny sektion: Prislista**
- Fast prislista med default-priser (årspriser inkl. moms)
- Override-funktion per kund
- Visar i onboarding-UI automatiskt

**Ny sektion: Avtalsmall**
- Upload av LaTeX-template för uppdragsavtal
- Placeholders: `{{kundnamn}}`, `{{orgnr}}`, `{{datum}}`, etc.
- Auto-generering vid onboarding completion

**Ny sektion: Egna frågor**
- Upload av `config.json` med custom KYC-frågor
- Läggs till utöver Roaring.io standard-frågor
- JSON-schema validering

**Ny sektion: Prenumeration (från Volt Pro)**
- Översikt med current plan, renewal date, payment method
- Fakturahistorik (tabell med double-click → modal)
- Download PDF-faktura
- Status badges (betald/obetald/förfallen)

### Din uppgift

**Fas 1: Component scaffolding (1 timme)**

1. Skapa `src/components/Settings/` struktur:
```
Settings/
├── SettingsLayout.jsx      # Main layout med sidebar
├── UsersSection.jsx         # Användare (befintlig, behöver inte ändras)
├── AccessSection.jsx        # Åtkomst (Fjärronboarding + Kollega-inlogg)
├── CompanySection.jsx       # Byråinställningar (kontakt, prislista, mall, frågor)
├── SubscriptionSection.jsx # Prenumeration (översikt + fakturor)
├── DangerZone.jsx          # Radera konto
└── components/
    ├── ColleagueLoginModal.jsx
    ├── PriceListEditor.jsx
    ├── LaTeXTemplateUpload.jsx
    ├── ConfigJsonUpload.jsx
    └── InvoiceModal.jsx
```

2. Implementera navigation:
```jsx
// SettingsLayout.jsx
<nav className="settings-sidebar">
  <Link to="/settings/users">Användare</Link>
  <Link to="/settings/access">Åtkomst</Link>
  <Link to="/settings/company">Byråinställningar</Link>
  <Link to="/settings/subscription">Prenumeration</Link>
  <Link to="/settings/danger">Danger Zone</Link>
</nav>
```

**Fas 2: Implementation baserad på Volt Pro patterns (3-4 timmar per sektion)**

Använd patterns från:
- `volt-pro-react/src/pages/examples/Users.js` (user table, search, bulk actions)
- `volt-pro-react/src/pages/examples/Invoice.js` (invoice display, PDF download)
- `volt-pro-react/src/pages/examples/Billing.js` (subscription overview)

**Exempel - Kollega-inlogg modal:**
```jsx
// Based on Volt Pro SweetAlert2 patterns
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const SwalWithBootstrapButtons = withReactContent(Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-primary me-3',
    cancelButton: 'btn btn-gray'
  },
  buttonsStyling: false
}));

const generateColleagueToken = async (email, hours) => {
  const result = await SwalWithBootstrapButtons.fire({
    title: 'Generera kollega-token',
    html: (
      <div>
        <input 
          id="email" 
          type="email" 
          className="form-control mb-3" 
          placeholder="kollegans@email.se"
          value={email}
        />
        <select id="hours" className="form-select">
          <option value="4">4 timmar</option>
          <option value="8">8 timmar</option>
          <option value="24">24 timmar</option>
        </select>
      </div>
    ),
    confirmButtonText: 'Generera',
    cancelButtonText: 'Avbryt',
    showCancelButton: true
  });
  
  if (result.isConfirmed) {
    // Call API to generate token
    const token = await api.post('/auth/colleague-token', {
      email: document.getElementById('email').value,
      expiresIn: document.getElementById('hours').value + 'h'
    });
    
    // Show copyable link
    SwalWithBootstrapButtons.fire({
      title: 'Token genererad!',
      html: `<code>${window.location.origin}/onboard?colleague=${token}</code>`,
      icon: 'success'
    });
  }
};
```

**Prioriterad körplan:**

**Sprint 1:**
1. ✅ SettingsLayout med navigation
2. ✅ AccessSection med Kollega-inlogg

**Sprint 2:**
3. ✅ CompanySection (prislista, LaTeX upload, config.json)
4. ✅ SubscriptionSection (översikt + fakturahistorik)

**Sprint 3:**
5. ✅ Polish och responsiveness
6. ✅ Integration med backend API
7. ✅ E2E-tester

### Backend API behövs

Du behöver implementera endpoints:
```
POST /api/auth/colleague-token
GET  /api/settings/price-list
PUT  /api/settings/price-list
POST /api/settings/latex-template
POST /api/settings/config-json
GET  /api/billing/subscription
GET  /api/billing/invoices
GET  /api/billing/invoices/:id/pdf
```

---

## 🚀 Nästa steg

**Val 1: Börja med VBA Migration (högsta prioritet)**
- Läs `MIGRATION_EXCEL_TO_PYTHON.md` grundligt
- Granska `Dokumentation.csv` (245 funktionsbeskrivningar)
- Börja med funktionsmatris VBA → Python
- Skriv första pytest för SIE-parser

**Val 2: Implementera Settings Page**
- Läs `SettingsPage_v2.md` (spec är komplett)
- Studera Volt Pro patterns i `VOLT_PRO_USERS_PAGE_ANALYSIS.md`
- Skapa component-struktur
- Börja med SettingsLayout + navigation

**Val 3: Båda parallellt**
- Frontend-arbete (Settings) kan köras samtidigt som backend (VBA migration)
- Settings behöver ändå backend-endpoints som inte finns än

---

## 🔍 Viktiga sökvägar

**VBA/CSV data:**
```bash
/home/lasse/Documents/Onboarding_App/Excel_bokforingsprogram/vba_extracted/
/home/lasse/Documents/Onboarding_App/Excel_bokforingsprogram/csv_exports/
```

**Dokumentation:**
```bash
/home/lasse/Documents/Onboarding_App/tic-tac-toe-app/docs/PROJECT/MIGRATION_EXCEL_TO_PYTHON.md
/home/lasse/Documents/Onboarding_App/tic-tac-toe-app/docs/specifications/SettingsPage_v2.md
/home/lasse/Documents/Onboarding_App/tic-tac-toe-app/docs/DESIGN/VOLT_PRO_USERS_PAGE_ANALYSIS.md
```

**Test-fixtures:**
```bash
/home/lasse/Documents/Onboarding_App/tic-tac-toe-app/SIE/SIE4 Exempelfil.SE
```

**Volt Pro source (för patterns):**
```bash
/home/lasse/Documents/React/volt-pro-react/src/pages/examples/Users.js
/home/lasse/Documents/React/volt-pro-react/src/pages/examples/Invoice.js
/home/lasse/Documents/React/volt-pro-react/src/pages/examples/Billing.js
```

**Backend (Python):**
```bash
/home/lasse/Documents/Onboarding_App/tic-tac-toe-app/backend/
```

**Frontend (React):**
```bash
/home/lasse/Documents/Onboarding_App/tic-tac-toe-app/src/
```

---

## 💬 Kommunikation

Om du behöver klarifikation eller stöter på problem:
1. Dokumentera frågan i relevant fil (MIGRATION_EXCEL_TO_PYTHON.md eller SettingsPage_v2.md)
2. GitHub Copilot (huvudassistent) kan svara snabbt på quick-wins
3. User (Lasse) har djup domänkunskap om bokföring och SIE-spec

---

## ✅ Status idag (2025-11-01)

**Vad är klart:**
- ✅ VBA-kod extraherad (51 moduler, 513 KB)
- ✅ CSV-data extraherad (30 sheets, 720 KB)
- ✅ Scope definierad (core bokföring, inte reskontror)
- ✅ Migrationsplan skapad (TDD-approach)
- ✅ Settings-spec v2 färdig (2300 rader)
- ✅ Volt Pro-analys klar (patterns dokumenterade)
- ✅ SIE-spec OCR pågår (37 sidor, FP8-modell på GPU)

**Vad väntar:**
- ⏳ Node/Express SIE-projekt (user kopierar från Lenovo)
- ⏳ SIE-spec OCR-resultat (ca 10-20 min kvar)
- ❌ Python implementation (väntar på dig!)
- ❌ Settings frontend (väntar på dig!)
- ❌ Backend API endpoints (väntar på dig!)

**Vad Extensions-Claude ska göra nu:**
1. **Läs denna fil grundligt**
2. **Välj startpunkt** (VBA migration ELLER Settings implementation)
3. **Bekräfta förståelse** genom att lista första 3-5 tasks
4. **Börja implementera** enligt TDD/spec

---

## 🎯 Framgångskriterier

**VBA Migration:**
- ✅ 100% pytest-coverage för core functions
- ✅ Kan importera SIE4 Exempelfil.SE utan errors
- ✅ Output matchar VBA-programmets CSV-exports
- ✅ Kan exportera tillbaka till valid SIE4
- ✅ Momsberäkningar exakta (öre-nivå)
- ✅ #DIM/#OBJEKT parsing robust

**Settings Page:**
- ✅ Matchar SettingsPage_v2.md spec 100%
- ✅ Använder Volt Pro patterns för consistency
- ✅ Responsiv (mobile + desktop)
- ✅ Alla nya features implementerade:
  - Kollega-inlogg med token-generator
  - Prislista med override-funktion
  - LaTeX-template upload
  - config.json upload
  - Prenumeration + fakturor med modal
- ✅ Backend API integrerad
- ✅ E2E-tester för alla flows

---

## 📞 Kontakt

**GitHub Copilot:** Huvudassistent, alltid tillgänglig  
**Extensions-Claude:** Du! Specialist på codebase-scanning och systematisk implementation  
**User (Lasse):** Domänexpert, tillgänglig för frågor

**Lycka till! Vi ser fram emot att se din implementation. 🚀**

---

**P.S.** SIE-spec OCR kommer vara klar när du läser detta. Kolla:
```bash
cat ~/Documents/Onboarding_App/olmocr/SIE_spec_extracted.txt
```
