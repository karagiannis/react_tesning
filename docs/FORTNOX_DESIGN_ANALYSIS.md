# Fortnox Design-analys - Professionell Business Software UX

**Datum:** 2025-11-05  
**Syfte:** Dokumentera Fortnox designprinciper för att matcha professionell redovisningssoftware-känsla

---

## 1. TYPOGRAFI - Kompakt och Professionell

### Faktiska storlekar från Fortnox Verifikationslista:

| Element | Storlek | Font-weight | Användning |
|---------|---------|-------------|------------|
| **Huvudrubrik** ("VERIFIKATIONER - LISTA") | 16-18px | bold | Sidrubrik |
| **Kolumnrubriker** (VERIFIKATIONSNUMMER, BOKFÖRINGSDATUM) | 12-13px | 600 (semibold) | Tabellheaders, UPPERCASE |
| **Tabelldata** (A1, "Swedbank bankkostnad") | 13-14px | 400 (regular) | Tabellceller |
| **Sökfält placeholder** | 12-13px | 400 (regular) | Input placeholders |
| **Dropdown options** | 13px | 400 (regular) | Select/dropdown items |
| **Sektionsrubriker** ("Grunduppgifter") | 14px | 600 (semibold) | Collapsible sections |
| **Fält-labels** ("Verifikationsnummer", "Beskrivning") | 12-13px | 400 (regular) | Form labels |

### Jämförelse: VÅR APP vs FORTNOX

| Klass | FÖRE (vår app) | EFTER (Fortnox-stil) | Förändring |
|-------|----------------|----------------------|------------|
| `page-title` | 24px semibold | **18px semibold** | -25% |
| `section-title` | 20px semibold | **14px semibold** | -30% |
| `subsection-title` | 18px medium | **13px medium** | -28% |
| `stat-value` | 24px bold | **20px bold** | -17% |

**Resultat:** Mer kompakt, professionell, Fortnox-liknande känsla

---

## 2. SPACING & LAYOUT - Data Density över Aesthetics

### Principer:

1. **Minimal padding**: 6-8px i tabellceller (inte 16-24px som "moderna" dashboards)
2. **Tight line-height**: 1.3-1.5 (inte 1.75-2.0)
3. **Kompakta gaps**: 8-12px mellan sektioner (inte 24-32px)
4. **Ingen onödig whitespace**: Varje pixel används för att visa data

### Tabellayout:
```
Fortnox tabell:
- Cell padding: 6-8px vertical, 12px horizontal
- Border: 1px solid #e0e0e0 (subtil grå)
- Row hover: ljusgrå bakgrund
- Ingen zebra-striping (ren vit bakgrund)
```

---

## 3. FÄRGSCHEMA - Neutral och Funktionell

### Färganvändning:

**Fortnox:**
- **Huvudfärger**: Vit bakgrund, mörkgrå text (#333-#666)
- **Borders**: Ljusgrå (#e0e0e0, #d0d0d0)
- **Accenter**: Funktionella endast (röd för error, grön för Skapa-knappar)
- **Dropdown färgkodning**: A=grön, B=blå, D=röd, E=orange (funktionell, inte dekorativ)

**Ingen "brand color splash":**
- Inga stora färgglada kort
- Inga gradient-bakgrunder
- Inga decorative ikoner med färgcirklar

**Funktionella färger:**
- ✅ Primär action-knapp: Gul/orange (Fortnox brand)
- ⚠️ Varningar: Subtle orange/yellow
- ❌ Error states: Röd text, inte röd bakgrund
- ℹ️ Info: Blå länkar, inte blå kort

---

## 4. SÖKFUNKTIONALITET - Smart och Kompakt

### Enkel sökning:
```
Input field:
- Placeholder: "Verifikationsnummer, Beskrivning" (multi-field hint)
- Font: 13px regular
- Border: 1px solid #ccc
- Padding: 8px 12px
- X-button: Rensa-funktion (funktionell detalj!)
- "Utökad sökning" länk: Blå, 12px, expanderar avancerade filter
```

### Autocomplete dropdown:
```
Struktur:
┌─────────────────────────────────────────┐
│ 🔍 Verifikationsnummer | Beskrivning    │ ← Headers (12px semibold)
├─────────────────────────────────────────┤
│ A1                     | Swedbank bank... │ ← Results (13px regular)
│ A24                    | Swedbank         │
│ A62                    | Swedbank         │
└─────────────────────────────────────────┘

Design:
- White background
- Subtle shadow (elevation: 2)
- 6-8px padding per rad
- Hover state: ljusgrå bakgrund
- Instant search (söker både nummer OCH beskrivning)
```

---

## 5. AVANCERAD FILTRERING - Progressive Disclosure

### "Utökad sökning" - Collapsible Sections

**Struktur:**
```
▼ Grunduppgifter                        ← Expanderad sektion (14px semibold)
  ┌─────────────────────────────────────┐
  │ Verifikationsnummer: [A57        ] │  ← Text input (13px)
  │ Beskrivning:         [           ] │
  │ Datum fr.o.m: [📅] Datum t.o.m: [📅] │  ← Date pickers med ikoner
  └─────────────────────────────────────┘

▼ Verifikationsinnehåll
  ┌─────────────────────────────────────┐
  │ Kommentar:          [            ] │
  │ Konto fr.o.m: [ ] Konto t.o.m: [ ] │  ← 2-kolumn layout
  │ Belopp: [Debet/Kredit ▼]          │  ← Dropdown
  │ Fr.o.m: [      ] T.o.m: [      ]   │  ← Belopp-range
  │ Transaktionsinfo:   [            ] │
  └─────────────────────────────────────┘

Verifikationsserie
  [A - Redovisning ▼]

                      [Rensa] [Sök]      ← Action-knappar
```

**UX-principer:**
1. **Grupperad logik**: Grunddata separat från innehåll
2. **Expanderbara sektioner**: ▼/▶ chevrons för show/hide
3. **Grid layout**: 2-3 kolumner beroende på fälttyp
4. **Funktionella ikoner**: 📅 för datumväljare (inte dekorativa)
5. **Clear actions**: "Rensa" (grå, sekundär) vs "Sök" (grön/gul, primär)

**Spacing:**
- Section padding: 12px
- Field gaps: 8-12px
- Label-to-input: 4px
- Section margin: 16px mellan sektioner

---

## 6. DROPDOWN-MENYER - Färgkodade men Kompakta

### Verifikationsserier dropdown:

**Struktur:**
```
[A - Redovisning ▼]  ← Selected value (mörkgrå bakgrund när expanderad)

Dropdown items:
  Alla                    ← Hover state: ljusgrå
  A - Redovisning        ← A = grön bokstav
  B - Kundfakturor       ← B = blå bokstav
  C - Inbetalningar      ← C = cyan bokstav
  D - Leverantörsfakturor ← D = röd bokstav
  E - Utbetalningar      ← E = orange bokstav
  F - Kassa
  G - Avskrivning
  H - Periodisering
  I - Bokslut
  J - Kontantfaktura
  K - Kvitto
  L - Lön
  M - Momsrapport
  N - Lager
  S - S
```

**Design-detaljer:**
- Font: 13px regular
- Padding: 6-8px per item
- Färgkodning: Första bokstaven får färg (funktionell identifikation)
- Ingen zebra-striping
- Hover: Ljusgrå bakgrund
- Selected: Mörkgrå bakgrund

---

## 7. TABELLER - Professionell Bokföringspraxis

### Kolumnlayout:
```
| VERIFIKATIONSNUMMER | BOKFÖRINGSDATUM | BESKRIVNING                    | BELOPP ▲ |
|---------------------|-----------------|--------------------------------|----------|
| A1                  | 2019-01-21      | Swedbank bankkostnad          | 750.00   |
| A2                  | 2019-01-28      | Hyr intäkt januari            | 33 150.00|
```

**Kolumntyper:**
1. **ID-kolumner** (verifikationsnummer): Vänsterställda, 60-80px bred
2. **Datum**: Vänsterställda, 100-120px, format: YYYY-MM-DD
3. **Beskrivning**: Vänsterställd, flex-grow (tar upp mest plats)
4. **Belopp**: **HÖGERSTÄLLDA** (bokföringspraxis!), 100-120px, tusentalsavgränsare

**Sortering:**
- Triangel-ikoner (▲▼) i kolumnheader
- Klickbara headers för sortering
- Tydlig visuell indikator för aktiv sortering

**Rad-interaktion:**
- Hover: Ljusgrå bakgrund
- Click: Öppnar verifikation (dubbelklick eller enkelklick beroende på inställning)
- Ikoner: 📎 (bilagor), 🖼️ (bilder), 🔄 (koppling) - funktionella endast

---

## 8. IKONER - Funktionella, Aldrig Dekorativa

### Fortnox ikon-strategi:

**Används:**
- ✅ 📅 Datumväljare (öppnar kalender)
- ✅ 📎 Bilagor (visar att verifikation har attachments)
- ✅ 🖼️ Bilder (visar att verifikation har skannade dokument)
- ✅ 🔄 Kopplingar (visar relationer)
- ✅ ▼/▶ Expandera/kollaps (collapsible sections)
- ✅ ❌ Stäng/rensa (X-knapp i sökfält)

**Används INTE:**
- ❌ Stora dekorativa ikoner i headers
- ❌ Färgglada cirkel-ikoner för kategorier
- ❌ Illustration-stil ikoner
- ❌ Animerade ikoner

**Storlek:**
- Funktionella ikoner: 14-16px
- Inga stora ikoner (28-32px) som "brand-element"

---

## 9. KNAPPAR - Tydlig Hierarki

### Knapp-hierarki:

**Primär action:**
```css
Fortnox "Skapa verifikation":
- Bakgrund: #FFB800 (gul, Fortnox brand)
- Text: Svart/mörkgrå
- Padding: 10px 20px
- Font: 14px semibold
- Border-radius: 4px (subtle rounding)
- Icon: + (prefix)
```

**Sekundär action:**
```css
"Rensa" / "Avbryt":
- Bakgrund: #f5f5f5 (ljusgrå)
- Text: #666
- Border: 1px solid #ddd
- Padding: 10px 20px
- Font: 14px regular
```

**Destructive action:**
```css
"Ta bort":
- Bakgrund: Transparent eller ljusröd
- Text: Röd (#d32f2f)
- Border: 1px solid röd
```

**Storlekar:**
- Standard: 36-40px höjd (medium)
- Kompakt: 32px höjd (för toolbars)
- Inga stora 48-56px knappar

---

## 10. DESIGNFILOSOFI - Sammanfattning

### Fortnox core principles:

1. **Data Density över Aesthetics**
   - Visa så mycket relevant data som möjligt
   - Minimal whitespace
   - Kompakta komponenter

2. **Funktionalitet över Form**
   - Ikoner endast när de tillför funktion
   - Färger används för att kommunicera status, inte för "branding"
   - Ingen dekorativ fluff

3. **Professional над Modern**
   - Små typsnitt (12-14px standard)
   - Neutral färgpalett
   - Tight spacing
   - "Tråkig men pålitlig" över "inspirerande och kreativ"

4. **Progressive Disclosure**
   - Enkel vy först, avancerade funktioner vid behov
   - Collapsible sections
   - Expanderbara filter
   - Inte överväldiga användaren

5. **Bokföringspraxis**
   - Siffror högerställda
   - Tusentalsavgränsare
   - Tydlig kolumnstruktur
   - Datum i ISO-format

---

## 11. IMPLEMENTATIONSSTRATEGI - VÅR APP

### Vad vi har gjort:
✅ Minskat typsnitt: 24px→18px för h1
✅ Skapat centraliserat system i `tailwind.config.js`
✅ Dokumenterat i `typography.md`

### Vad vi bör göra härnäst:

#### Kort sikt (denna session):
1. **Minska statistik-kort höjd** i BokföringsanalysSlide
   - Ändra `p-4` → `p-3` eller `p-2`
   - Eventuellt: Redesigna till kompakt sammanfattningsrad istället för stora kort

2. **Standardisera padding globalt**
   - Skapa spacing-variabler: `card-padding-compact: 0.75rem` (12px)

3. **Verifiera visuell konsistens**
   - Testa alla migrerade sidor
   - Jämför med Fortnox screenshots

#### Medellång sikt (nästa vecka):
1. **Implementera avancerad filtrering**
   - Collapsible "Filtrera verifikationer"-sektion i Steg 1
   - Datum-range, belopp-range, verifikationsserie-filter
   - "Rensa" och "Sök"-knappar

2. **Förbättra tabeller**
   - Högerställda belopp
   - Sorteringsindikatorer
   - Kompakt padding (6-8px)

3. **Migrera fler komponenter**
   - Alla Slides till `text-page-title`
   - Settings-pages
   - Modal-headers

#### Lång sikt (kommande sprints):
1. **Redesign statistik-visualisering**
   - Från stora kort till Fortnox-stil kompakta summaries
   - Eventuellt: inline i tabellheader istället för separata kort

2. **Autocomplete-sök**
   - Implementera Fortnox-stil autocomplete
   - Multi-kolumn dropdown med headers

3. **Unified filter system**
   - Återanvändbar FilterPanel-komponent
   - Samma UX pattern över hela appen

---

## 12. MÄTBARA MÅL

### Success metrics för "Fortnox-liknande professionalism":

| Metric | Target | Motivering |
|--------|--------|------------|
| Genomsnittlig font-size | 13-16px | Matchar Fortnox (inte 18-24px) |
| Card padding | ≤12px | Kompakt, inte luftig |
| Whitespace mellan sektioner | ≤16px | Data density |
| Antal dekorativa ikoner | 0 | Endast funktionella |
| Table row height | 32-40px | Tight som Fortnox |
| Viewport data density | ≥15 rader synliga | Mindre scrolling |

### User perception goals:
- "Ser professionell ut" (inte "ser modern ut")
- "Känns som seriös accounting software"
- "Liknar Fortnox/Visma" (positiv association)
- "Pålitlig och trygg" över "inspirerande och kreativ"

---

## 13. DATE PICKER - Kompakt Kalender

### Fortnox Datumväljare - Detaljerad analys:

**Trigger:**
- 📅 Ikon i input-fält (höger sida)
- **Hover-state**: Ikonen blir GRÖN (#00a65a eller liknande) vid hover
- Klick öppnar kalender-popup

**Kalender popup-struktur:**
```
┌─────────────────────────────────────┐
│  ◄  NOVEMBER 2025  ►               │  ← Header (mörkgrön #004d32)
├─────────────────────────────────────┤
│ V   MÅN TIS ONS TOR FRE LÖR SÖN    │  ← Veckodagars-headers (12px)
├─────────────────────────────────────┤
│ 44          1  2  ånsinfo           │  ← Veckonummer + datum
│ 45   3  4  [5] 6  7  8  9          │  ← [5] = selected (dagens datum)
│ 46  10 11  12 13 14 15 16          │
│ 47  17 18  19 20 21 22 23          │
│ 48  24 25  26 27 28 29 30          │
└─────────────────────────────────────┘
```

**Design-detaljer:**

### Header:
- Bakgrund: Mörkgrön (Fortnox brand, #004d32 liknande)
- Text: Vit, 14px semibold, "NOVEMBER 2025" (uppercase månad)
- Navigation: ◄ ► pilar för månad-byte
- Höjd: ~36-40px

### Veckonummer:
- Vänsterkolumn: "44", "45", "46", "47", "48"
- Font: 11-12px, grå (#999)
- Bakgrund: Ljusare grå (#f5f5f5)
- Funktionellt relevant för bokföring!

### Veckodagar:
- Headers: "V MÅN TIS ONS TOR FRE LÖR SÖN"
- Font: 11-12px, semibold
- Färg: Mörkgrå (#666)
- Compact spacing

### Datum-celler:
- Font: 13px regular
- Padding: 6-8px (tight!)
- Hover: Ljusgrå bakgrund
- **Selected/Today**: Blå markering [5] (dagens datum 2025-11-05)
- Weekend (LÖR/SÖN): Ingen speciell färgning (professionellt!)
- Klickyta: Hela cellen

### Popup-styling:
- Bakgrund: Vit
- Border: 1px solid #ccc
- Shadow: Subtle box-shadow (2-4px blur)
- Z-index: Högt (över allt annat innehåll)
- Position: Absolut, under input-fältet

### Interaktionsdetaljer:

1. **Icon hover-state:**
   ```css
   📅 Normal: #666 (grå)
   📅 Hover:  #00a65a (Fortnox grön) ← Visuell feedback!
   ```

2. **Datum-selection:**
   - Click på datum → input fylls i (YYYY-MM-DD format)
   - Kalender stängs automatiskt
   - Kan navigera månader utan att stänga popup

3. **Keyboard support:**
   - Tab: Navigera mellan datumfält
   - Esc: Stäng kalender
   - Pilknappar: Navigera datum (troligen)

### Jämförelse med "moderna" date pickers:

**Fortnox (professionell):**
- ✅ Veckonummer (bokföringspraxis!)
- ✅ Kompakt layout (tight padding)
- ✅ Neutral färgschema (ingen rainbow-färg)
- ✅ Enkel month-navigation (◄►)
- ✅ Subtil hover-feedback (grön ikon)

**"Modern" (Material UI / Ant Design):**
- ❌ Stora datum-celler (16-20px padding)
- ❌ Färgglada selected states
- ❌ Animerade transitions
- ❌ Inga veckonummer (inte relevant för business)

### Implementation-notes för vår app:

```jsx
// Rekommenderad library: react-datepicker eller egen implementation
// Fortnox-stil konfiguration:

<DatePicker
  dateFormat="yyyy-MM-dd"          // ISO-format
  showWeekNumbers={true}           // Veckonummer (bokföringspraxis!)
  calendarStartDay={1}             // Måndag först (Sverige)
  locale="sv"                      // Svenska namn
  className="fortnox-datepicker"   // Custom styling
  popperPlacement="bottom-start"   // Under input-fältet
/>

// Custom CSS:
.fortnox-datepicker {
  .react-datepicker__header {
    background: #004d32;           // Mörkgrön
    color: white;
    padding: 8px;
  }
  .react-datepicker__day {
    padding: 6px;                  // Tight padding
    font-size: 13px;
  }
  .react-datepicker__week-number {
    color: #999;
    background: #f5f5f5;
    font-size: 11px;
  }
}
```

---

## 14. IKONER - Hover States och Interaktivitet

### Fortnox ikon-interaktion:

**Regel:** Funktionella ikoner får visuell feedback

| Ikon | Hover-state | Syfte |
|------|-------------|-------|
| 📅 Datum | Grå → **Grön** | Visar att kalender kan öppnas |
| 📎 Bilaga | Grå → Blå/hover | Öppnar bilagor |
| 🖼️ Bild | Grå → Blå/hover | Öppnar bildvy |
| ▼ Expand | Statisk (ingen hover-color) | Expand/collapse |

**Färgval för hover:**
- **Grön (#00a65a)**: Primära actions (datum, "skapa")
- **Blå (#0066cc)**: Sekundära actions (länkar, info)
- **Röd (#d32f2f)**: Destructive actions (radera)

### Animationer:
- **Färgövergång**: 0.15s ease (subtil)
- **Ingen scale/transform**: Ikonen ändrar inte storlek
- **Ingen bounce/spring**: Professionellt, inte lekfullt

---

**Dokumenterat av:** GitHub Copilot  
**Baserat på:** Live Fortnox screenshots med date picker (2025-11-05)  
**Status:** Komplett analys av typografi, spacing, färger, sök, filter, tabeller, ikoner, knappar och date picker

---

## 15. BOKFÖRINGSVY - Verifikation med Konteringar

### Fortnox Verifikationsvy (A-6) - Detaljerad analys:

**URL-struktur:** `/voucher/A-6` (verifikationsserie/nummer)

**Sidhuvud:**
```
VERIFIKATION A6
📎 🖼️   [← → |← →|]   [+ Skapa verifikation] [👁️ Visa lista]

Kommentar  Skriv ut  Kopiera
```

**Navigation:**
- **Pilar**: |← → |← →| för att bläddra mellan verifikationer
- **Snabbnavigering**: Första/Föregående/Nästa/Sista
- **"Skapa verifikation"**: Gul primär-knapp (+ icon)
- **"Visa lista"**: Grå sekundär-knapp (ögon-ikon 👁️)

### Verifikationshuvud (Metadata):

**3 kolumner layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ Beskrivning                 Verifikationsserie   Bokföringsdatum │
│ [Levfkt 77 Järntkraft    ] [A - Redovisning  ▼] [2019-01-10  📅] │
│                                                                    │
│ Konteringsmall             Belopp                                │
│ [Kod, Benämning         ] [                 ]                     │
└─────────────────────────────────────────────────────────────────┘
```

**Fältdetaljer:**
- **Beskrivning**: Text input, placeholder: grå italic
- **Verifikationsserie**: Dropdown med A-Redovisning vald
- **Bokföringsdatum**: Date picker (2019-01-10, ISO-format)
- **Konteringsmall**: Text input för snabbval
- **Belopp**: Nummer-input (används ej när konteringar finns)

### Konteringstabell - Huvudstruktur:

**Kolumner:**
```
┌──────┬─────────────────┬──────────────────────────┬───────┬────────┬────────────┐
│KONTO │ BENÄMNING       │ TRANSAKTIONSINFO         │ DEBET │ KREDIT │ KONTOSALDO │
├──────┼─────────────────┼──────────────────────────┼───────┼────────┼────────────┤
│ 2440 │Leverantörsskulder│LevFktnr: 77, Namn: Järnt│       │ 793.00 │ 📎  👤     │
│ 5120 │El för belysning │LevFktnr: 77, Namn: Järnt│793.00 │        │ 📎  👤     │
├──────┴─────────────────┴──────────────────────────┼───────┼────────┼────────────┤
│                                           Summa   │793.00 │ 793.00 │            │
│                                        Differens  │       │   0.00 │            │
└───────────────────────────────────────────────────┴───────┴────────┴────────────┘
```

**Kritiska detaljer:**

1. **KONTO-kolumn**: 
   - Kontonummer (4 siffror): 2440, 5120
   - Font: 13px regular
   - Klickbar (blå länk) → öppnar kontokort
   - Vänsterställd

2. **BENÄMNING**:
   - Kontonamn från kontoplan
   - Font: 13px regular
   - Vänsterställd

3. **TRANSAKTIONSINFO**:
   - Fritext-fält med metadata
   - Visar: "LevFktnr: 77, Namn: Järntkraft" (leverantörsinfo)
   - Kan innehålla projekt, kostnadsställe, etc
   - Font: 13px regular

4. **DEBET/KREDIT**:
   - **HÖGERSTÄLLDA** (bokföringspraxis!)
   - Font: 13px regular
   - Format: 793.00 (tusentalsavgränsare vid >999)
   - Tom cell när 0 (inte "0.00")

5. **KONTOSALDO**:
   - Ikoner: 📎 (bilagor), 👤 (person/leverantör)
   - Funktionella endast
   - Högerställda

### Summerings-section:

```
                                    Summa     793.00    793.00
                                 Differens              0.00
```

**Validering:**
- **Summa Debet = Summa Kredit**: Visar båda summorna
- **Differens**: Måste vara 0.00 (annars fel!)
- Font: 13px semibold
- Högerställda
- Ljusgrå bakgrund på summeringsraden

### Action-knappar (footer):

**Layout:**
```
[Radera]  ...                [Avbryt] [Ändringssverifikation] [Ändra] [Bokför]
```

**Hierarki:**
1. **Radera** (vänster): Ljusgrå, destructive
2. **Avbryt** (höger): Grå sekundär
3. **Ändringssverifikation**: Grön (special action)
4. **Ändra**: Grå/grön (edit mode)
5. **Bokför**: Mörkgrön primär (primary action!)

**Knapp-storlekar:**
- Höjd: 36-40px
- Padding: 12px 24px
- Font: 14px semibold

### Ikoner och indikatorer:

**I sidhuvud:**
- 📎 = Verifikation har bilagor
- 🖼️ = Verifikation har skannade dokument

**I kontosaldo-kolumn:**
- 📎 = Kontering har bilaga
- 👤 = Koppling till person/leverantör
- Dessa är FUNKTIONELLA - kan klickas för att se detaljer

### Gul highlight-area (höger):

**Bilagepanel:**
- Gul bakgrund (#FFD700 liknande)
- Ikon: 🖼️ (stor bild-ikon)
- Syfte: Visa att det finns skannade dokument
- Klickbar: Öppnar bildvy/PDF-viewer

### Typografi-sammanfattning:

| Element | Storlek | Weight | Alignment |
|---------|---------|--------|-----------|
| Sidrubrik "VERIFIKATION A6" | 16-18px | bold | Vänster |
| Fält-labels | 12px | regular | Vänster |
| Input text | 13-14px | regular | Vänster |
| Tabellheaders | 12px | 600 semibold | Vänster (DEBET/KREDIT höger) |
| Kontonummer | 13px | regular (blå=link) | Vänster |
| Belopp | 13px | regular | **HÖGER** |
| Summa | 13px | 600 semibold | **HÖGER** |
| Knappar | 14px | 600 semibold | - |

### Layout-principer:

1. **Kompakt form**: Metadata i 3-kolumn grid upptill
2. **Full-width tabell**: Konteringar tar hela bredden
3. **Summeringsrad integrerad**: Direkt under tabellen, inte separat sektion
4. **Action-knappar i footer**: Tydlig separation från data
5. **Bilagor till höger**: Side-panel istället för inline

### Validerings-regler:

```javascript
// Fortnox validering:
const isValid = (voucher) => {
  const totalDebit = voucher.rows.reduce((sum, row) => sum + row.debit, 0);
  const totalCredit = voucher.rows.reduce((sum, row) => sum + row.credit, 0);
  const diff = Math.abs(totalDebit - totalCredit);
  
  return diff < 0.01; // Accepterar avrundningsdifferenser < 1 öre
};

// Visuell indikator:
if (diff > 0) {
  // Differens visas i rött
  // "Bokför"-knapp disabled
}
```

### Interaktionsmönster:

1. **Tab-navigation**: Mellan fält och celler
2. **Enter i kontonummer**: Autofyll benämning från kontoplan
3. **Belopp i debet**: Automatiskt tomt kredit (vice versa)
4. **Summering**: Real-time uppdatering vid ändring
5. **Bokför**: Sparar och låser verifikation (kan ej ändras utan "Ändringssverifikation")

### Design-insights för vår app:

**Måste-ha:**
- ✅ Högerställda belopp (KRITISKT!)
- ✅ Real-time summa/differens
- ✅ Debet/Kredit kolumner synliga samtidigt
- ✅ Kontonummer klickbara (till kontokort)
- ✅ Validering: Differens måste vara 0.00

**Nice-to-have:**
- ✅ Transaktionsinfo-kolumn (flexibel metadata)
- ✅ Ikoner för bilagor/kopplingar
- ✅ Konteringsmall för snabbval
- ✅ Navigation mellan verifikationer (← →)

**Implementation-exempel:**

```jsx
// Konteringstabell-komponent
<table className="w-full border-collapse">
  <thead>
    <tr className="bg-gray-100 border-b border-gray-300">
      <th className="text-left px-3 py-2 text-xs font-semibold uppercase">Konto</th>
      <th className="text-left px-3 py-2 text-xs font-semibold uppercase">Benämning</th>
      <th className="text-left px-3 py-2 text-xs font-semibold uppercase">Transaktionsinfo</th>
      <th className="text-right px-3 py-2 text-xs font-semibold uppercase">Debet</th>
      <th className="text-right px-3 py-2 text-xs font-semibold uppercase">Kredit</th>
      <th className="text-right px-3 py-2 text-xs font-semibold uppercase">Kontosaldo</th>
    </tr>
  </thead>
  <tbody>
    {rows.map(row => (
      <tr key={row.id} className="border-b border-gray-200 hover:bg-gray-50">
        <td className="px-3 py-2">
          <a href={`/konto/${row.account}`} className="text-blue-600 text-sm">
            {row.account}
          </a>
        </td>
        <td className="px-3 py-2 text-sm">{row.name}</td>
        <td className="px-3 py-2 text-sm text-gray-600">{row.info}</td>
        <td className="px-3 py-2 text-sm text-right">
          {row.debit > 0 ? formatAmount(row.debit) : ''}
        </td>
        <td className="px-3 py-2 text-sm text-right">
          {row.credit > 0 ? formatAmount(row.credit) : ''}
        </td>
        <td className="px-3 py-2 text-right">
          {row.hasAttachment && <span>📎</span>}
          {row.hasPerson && <span>👤</span>}
        </td>
      </tr>
    ))}
  </tbody>
  <tfoot className="bg-gray-50 font-semibold">
    <tr className="border-t-2 border-gray-300">
      <td colSpan="3" className="px-3 py-2 text-sm text-right">Summa</td>
      <td className="px-3 py-2 text-sm text-right">{formatAmount(totalDebit)}</td>
      <td className="px-3 py-2 text-sm text-right">{formatAmount(totalCredit)}</td>
      <td></td>
    </tr>
    <tr>
      <td colSpan="4" className="px-3 py-2 text-sm text-right">Differens</td>
      <td className={`px-3 py-2 text-sm text-right ${diff > 0 ? 'text-red-600' : ''}`}>
        {formatAmount(diff)}
      </td>
      <td></td>
    </tr>
  </tfoot>
</table>
```

---

**Uppdaterat:** 2025-11-05 med komplett bokföringsvy-analys

---

## 16. BOKFÖRINGSVY - EDIT MODE (Ändra/Skapa läge)

### Förändring: View → Edit mode

**Rubrik ändras:**
```
VERIFIKATION A6  →  VERIFIKATION - ÄNDRA A6
```

**Nya funktioner tillgängliga:**

### 1. **KONTOSALDO-kolumn visar LÖPANDE SALDO** ⭐

**Kritisk insight:** Saldot uppdateras rad för rad!

```
Rad 1: 2440 Leverantörsskulder
       Kredit: 793.00  →  Saldo: -6 753.00  (tidigare saldo + denna kredit)
       
Rad 2: 5120 El för belysning  
       Debet: 793.00   →  Saldo: 66 085.00  (tidigare saldo + denna debet)
```

**Logik:**
- Kontosaldo = **Tidigare saldo på kontot + denna rad**
- Negativt saldo för skulder/passiva (kredit ökar skuld)
- Positivt saldo för kostnader/aktiva (debet ökar kostnad)
- Visar ACKUMULERAT saldo efter denna transaktion

**Format:**
- Högerställd
- Font: 13px regular
- Tusentalsavgränsare: 6 753.00, 66 085.00
- Negativt prefix: "-6 753.00"

### 2. **Extra tomma rader för att LÄGGA TILL FLER KONTERINGAR**

**Struktur:**
```
| 2440 | Leverantörsskulder | LevFktnr... |       | 793.00 | -6 753.00 | 📎 👤 🗑️ |
| 5120 | El för belysning   | LevFktnr... | 793.00|        | 66 085.00 | 📎 👤 🗑️ |
├──────┼────────────────────┼─────────────┼───────┼────────┼───────────┼─────────┤
|      |                    |             |       |        |    0.00   | 📎 🗑️ ➕ |
|      |                    |             |       |        |    0.00   | 📎 🗑️ ➕ |
|      |                    |             |       |        |    0.00   | 📎 🗑️ ➕ |
```

**Visuella indikatorer:**
- **Ljusare bakgrund** på tomma rader (grå #f9f9f9)
- **Saldo = 0.00** på tomma rader (placeholder)
- **➕ ikon** längst till höger för att "aktivera" raden

**Interaktion:**
1. Klicka i tomt kontonummer-fält
2. Skriv kontonummer (t.ex. "1930")
3. Tab → Benämning autofylls från kontoplan
4. Skriv belopp i DEBET eller KREDIT
5. Saldo uppdateras automatiskt
6. Summa/Differens uppdateras real-time

### 3. **Action-ikoner per rad**

**Nya ikoner i edit-mode:**

| Ikon | Funktion | Placering |
|------|----------|-----------|
| 📎 | Bifoga dokument till kontering | Kontosaldo-kolumn |
| 👤 | Koppla person/leverantör | Kontosaldo-kolumn |
| 🗑️ | **Radera kontering** | Höger om saldo |
| 💾 | **Kopiera rad** (möjligen) | Vid hover |
| ➕ | **Aktivera tom rad** | Tomma rader |

**Design:**
- Ikoner: 14-16px
- Färg: Grå (#999) default
- Hover: Mörkgrå/färg beroende på typ
- 🗑️ hover: Röd (#d32f2f)

### 4. **Footer-knappar i edit-mode**

**Före (view-mode):**
```
[Radera]  ...  [Avbryt] [Ändringssverifikation] [Ändra] [Bokför]
```

**Efter (edit-mode):**
```
                                        [Avbryt] [Bokför]
```

**Förenklad action:**
- **Avbryt**: Grå sekundär (återgår till view-mode utan att spara)
- **Bokför**: Grön primär (sparar och låser verifikation)

**Validering innan Bokför:**
- Differens måste vara 0.00
- Minst 2 konteringsrader
- Alla rader måste ha kontonummer
- Datum måste vara satt

### 5. **Beskrivnings-dropdown expanderad**

**Observerat:**
```
Beskrivning: [Levfkt 77 Järntkraft ▼]
```

**Detta är en COMBO-BOX:**
- Kan skriva fritt ELLER
- Välja från tidigare beskrivningar
- Autocomplete baserat på historik

**UX-detalj:**
- Sparar tid genom att återanvända vanliga beskrivningar
- Standardiserar formuleringar
- "Levfkt 77 Järntkraft" = mall-text för leverantörsfakturor

### 6. **Kontosaldo-beräkning - Teknisk spec**

**Algoritm:**
```javascript
const calculateRunningBalance = (account, vouchers, currentRow) => {
  // 1. Hämta tidigare saldo för kontot
  const previousBalance = getAccountBalance(account, beforeDate);
  
  // 2. Applicera denna rads transaktion
  let newBalance = previousBalance;
  
  if (account.type === 'ASSET' || account.type === 'EXPENSE') {
    // Tillgångar och kostnader: Debet ökar, Kredit minskar
    newBalance += currentRow.debit;
    newBalance -= currentRow.credit;
  } else {
    // Skulder, eget kapital, intäkter: Kredit ökar, Debet minskar
    newBalance -= currentRow.debit;
    newBalance += currentRow.credit;
  }
  
  return newBalance;
};

// Exempel:
// Konto 2440 (Leverantörsskulder) - SKULDKONTO
// Tidigare saldo: -5 960.00 (negativ = skuld)
// Kredit: +793.00 (ökar skuld)
// Nytt saldo: -6 753.00 ✅

// Konto 5120 (El för belysning) - KOSTNADSKONTO  
// Tidigare saldo: 65 292.00
// Debet: +793.00 (ökar kostnad)
// Nytt saldo: 66 085.00 ✅
```

### 7. **Rad-höjd och spacing i edit-mode**

**Befintliga rader:**
- Height: 40-44px (något högre än view-mode för bättre klickarea)
- Padding: 8-10px vertical

**Tomma rader:**
- Height: 36-40px (något lägre, visuellt "collapsed")
- Bakgrund: Ljusare grå (#f9f9f9)
- Border: Dashed istället för solid? (inte bekräftat)

### 8. **Keyboard shortcuts (förmodade)**

**Typiska genvägar i bokföringssystem:**
- Tab: Nästa fält
- Shift+Tab: Föregående fält
- Enter: Nästa rad (från sista kolumnen)
- Ctrl+S: Spara (Bokför)
- Esc: Avbryt
- F2: Öppna kontoplan-sökning (troligen)

### 9. **Responsiv kolumnbredd**

**Observerade bredder (approximate):**

| Kolumn | Bredd | Motivering |
|--------|-------|------------|
| KONTO | 80px | 4 siffror + lite padding |
| BENÄMNING | 180-200px | Kontobeskrivning |
| TRANSAKTIONSINFO | flex-grow | Tar resterande utrymme |
| DEBET | 100px | Max 9 siffror + decimaler |
| KREDIT | 100px | Max 9 siffror + decimaler |
| KONTOSALDO | 120px | Kan vara större belopp |
| Åtgärder | 80-100px | Ikoner (📎👤🗑️➕) |

**Total minsta bredd:** ~860px (scrollbar vid mindre viewports)

### 10. **Visuell hierarki - Edit vs View**

**View-mode (read-only):**
- Renare layout
- Färre ikoner
- Ingen interaktion i tabell-celler
- Fokus på summering

**Edit-mode (interactive):**
- Fler ikoner (🗑️ ➕)
- Input-fält i alla celler
- Tomma rader synliga
- Fokus på att LÄGGA TILL

**Design-shift:**
```
View:  [Data visualization] → Läsa och förstå
Edit:  [Data entry]        → Skriva och modifiera
```

### 11. **Error states (inte synliga här, men troligen)**

**Förväntade valideringsfel:**
- ❌ **Differens ≠ 0**: Röd text, "Bokför" disabled
- ❌ **Ogiltigt kontonummer**: Röd border på konto-fält
- ❌ **Saknad beskrivning**: Gul varning (ej blockerande?)
- ❌ **Framtida datum**: Varning om datum > idag

### Implementation-exempel för vår app:

```jsx
// EditableVoucherRow.jsx
const EditableVoucherRow = ({ row, index, onUpdate, onDelete }) => {
  const [account, setAccount] = useState(row.account || '');
  const [debit, setDebit] = useState(row.debit || 0);
  const [credit, setCredit] = useState(row.credit || 0);
  
  // Hämta kontonamn från kontoplan
  const accountName = useAccountName(account);
  
  // Beräkna löpande saldo
  const runningBalance = useRunningBalance(account, debit, credit);
  
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="px-3 py-2">
        <input
          type="text"
          value={account}
          onChange={(e) => setAccount(e.target.value)}
          className="w-full text-sm border-0 focus:ring-1 focus:ring-brand-500"
          placeholder="Konto"
          maxLength={4}
        />
      </td>
      <td className="px-3 py-2 text-sm text-gray-600">
        {accountName || <span className="italic text-gray-400">Välj konto</span>}
      </td>
      <td className="px-3 py-2">
        <input
          type="text"
          placeholder="Transaktionsinfo"
          className="w-full text-sm border-0 focus:ring-1 focus:ring-brand-500"
        />
      </td>
      <td className="px-3 py-2">
        <input
          type="number"
          value={debit || ''}
          onChange={(e) => handleDebitChange(e.target.value)}
          className="w-full text-sm text-right border-0 focus:ring-1 focus:ring-brand-500"
          disabled={credit > 0}  // Disable om kredit har värde
        />
      </td>
      <td className="px-3 py-2">
        <input
          type="number"
          value={credit || ''}
          onChange={(e) => handleCreditChange(e.target.value)}
          className="w-full text-sm text-right border-0 focus:ring-1 focus:ring-brand-500"
          disabled={debit > 0}  // Disable om debet har värde
        />
      </td>
      <td className="px-3 py-2 text-right text-sm">
        {formatAmount(runningBalance)}
      </td>
      <td className="px-3 py-2 text-right">
        <button className="text-gray-400 hover:text-gray-600 mr-2">📎</button>
        <button className="text-gray-400 hover:text-gray-600 mr-2">👤</button>
        <button 
          onClick={() => onDelete(index)}
          className="text-gray-400 hover:text-red-600"
        >
          🗑️
        </button>
      </td>
    </tr>
  );
};
```

---

**Uppdaterat:** 2025-11-05 med edit-mode analys och löpande saldo-beräkning

---

## 17. BOKFÖRINGSUNDERLAG - Side-by-Side Layout

### Fortnox Bildvisning - Split-screen Design

**Layout-struktur:**
```
┌─────────────────────────────────────────────────────────────────┐
│ VERIFIKATION - ÄNDRA A6                     [Skapa] [Visa lista] │
├──────────────────────────┬──────────────────────────────────────┤
│                          │ KOPPLADE BILDER 1 (1)                │
│  KONTERINGSTABELL       │ 📷 🔍 🔍+ ⬇️ Ladda ner 📧 📤 [Hantera] │
│  (Vänster 50%)          ├──────────────────────────────────────┤
│                          │                                      │
│  [Beskrivning]          │        FAKTURA-BILD                  │
│  [Verifikationsserie]   │        (Jämtkraft)                   │
│  [Datum]                │                                      │
│                          │   • Järntkraft AB logo              │
│  ┌──────┬────┬────┐     │   • Box 394, 831 25 Östersund       │
│  │KONTO │DEB │KRE │     │   • Kontaktcenter info              │
│  │ 2440 │    │793 │     │   • Faktura heading                 │
│  │ 5120 │793 │    │     │   • Kundnr, OCR, Faktdatum         │
│  └──────┴────┴────┘     │   • ELNÄT table                     │
│                          │   • ELHANDEL table                  │
│  Summa:  793  793       │   • Belopp totalt: 881,23 kr       │
│  Diff:        0.00      │                                      │
│                          │   [Koppla bort] [Koppla fler]      │
│  [Avbryt] [Bokför]      │                                      │
└──────────────────────────┴──────────────────────────────────────┘
     50% width                       50% width
```

### Kritiska design-beslut:

#### 1. **50/50 Split** ⭐
- Vänster: Konteringstabell + formulär
- Höger: Bokföringsunderlag (PDF/bild)
- **Ingen resizable divider** - fast 50/50 proportioner
- Vertikal separator: 1px solid grå linje

#### 2. **Bildpanel header:**
```
KOPPLADE BILDER 1 (1)
📷 Saknas text?  🔍 🔍+ ⬇️ Ladda ner  📧 E-posta bild  📤 Ladda upp  [Hantera i Inkorg]
```

**Toolbar-ikoner:**
| Ikon | Funktion | Storlek |
|------|----------|---------|
| 📷 | OCR/Textigenkänning? | 16px |
| 🔍 | Zoom in | 16px |
| 🔍+ | Zoom ut | 16px |
| ⬇️ | Ladda ner som fil | 16px |
| 📧 | E-posta bilden | 16px |
| 📤 | Ladda upp ny bild | 16px |

**"Hantera i Inkorg"** - Blå länk (höger)

#### 3. **Bildens rendering:**

**Observationer:**
- Full-bleed rendering (kant till kant)
- Bibehållen aspect ratio
- Scrollbar för långa dokument
- Vit bakgrund under bilden
- Skarp rendering (hög kvalitet, inte komprimerad)

**Layout i bildpanel:**
```css
.image-viewer {
  width: 100%;
  height: calc(100vh - 200px);  /* Full höjd minus headers */
  overflow-y: auto;              /* Scrollbar vid behov */
  background: white;
  padding: 16px;                 /* Lite luft runt bilden */
}

.invoice-image {
  width: 100%;
  height: auto;
  display: block;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);  /* Subtil skugga */
}
```

#### 4. **Navigering mellan bilagor:**

**Header indikerar antal:**
```
KOPPLADE BILDER 1 (1)
                  ↑   ↑
          Nuvarande  Totalt
```

**Om fler bilagor:**
```
KOPPLADE BILDER 2 (5)  [← →]  Pilar för att bläddra
```

#### 5. **Footer-knappar i bildpanel:**

```
                [Koppla bort] [Koppla fler]
```

**Funktioner:**
- **Koppla bort**: Ta bort denna bilaga från verifikationen
- **Koppla fler**: Lägg till fler bilagor (öppnar filväljare eller inkorg)

**Styling:**
- Högerställda
- Grå sekundära knappar
- Font: 13-14px semibold
- Padding: 8px 16px

#### 6. **Gul separator/divider:** ⭐ DRAGGABLE!

**Den gula vertikala baren mellan panelerna:**
- Bredd: ~8-12px
- Färg: #FFD700 (gul, Fortnox brand)
- **FUNKTION: RESIZE HANDLE** - Användaren kan dra för att ändra proportioner!
- Cursor: `col-resize` vid hover
- Visuell indikator: Gul färg signalerar "jag är interaktiv"

**Dragging-behavior:**
1. Hover över gul bar → cursor blir `↔` (resize-cursor)
2. Click + drag → ändrar proportionerna dynamiskt
3. Vänster panel (kontering) kan bli 30-70% av bredden
4. Höger panel (bilagor) justeras automatiskt (komplementär bredd)
5. Minimum-bredd troligen satt (ex: 400px per panel)

**Implementation-spec:**
```jsx
const ResizablePanels = () => {
  const [leftWidth, setLeftWidth] = useState(50); // Procent
  const containerRef = useRef(null);
  const isDragging = useRef(false);

  const handleMouseDown = () => {
    isDragging.current = true;
    document.body.style.cursor = 'col-resize';
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const newLeftWidth = ((e.clientX - rect.left) / rect.width) * 100;
    
    // Clamp mellan 30% och 70%
    const clampedWidth = Math.max(30, Math.min(70, newLeftWidth));
    setLeftWidth(clampedWidth);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.body.style.cursor = 'default';
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div ref={containerRef} className="flex h-screen">
      {/* Left panel */}
      <div style={{ width: `${leftWidth}%` }} className="overflow-auto">
        <VoucherForm />
      </div>
      
      {/* Draggable divider */}
      <div
        onMouseDown={handleMouseDown}
        className="w-2 bg-yellow-400 cursor-col-resize hover:bg-yellow-500 transition-colors flex-shrink-0"
        title="Dra för att ändra storlek"
      />
      
      {/* Right panel */}
      <div style={{ width: `${100 - leftWidth}%` }} className="overflow-auto">
        <AttachmentViewer />
      </div>
    </div>
  );
};
```

**CSS för smooth dragging:**
```css
/* Förhindra text-selection vid drag */
.dragging {
  user-select: none;
  -webkit-user-select: none;
}

/* Hover-state på divider */
.divider:hover {
  background: #FFE14D; /* Ljusare gul */
  cursor: col-resize;
}

/* Transition för smooth resize (optional) */
.resizable-panel {
  transition: width 0.1s ease-out;
}
```

**UX-fördelar:**
- ✅ Flexibilitet: Användare kan prioritera kontering ELLER underlag
- ✅ Små skärmar: Kan ge mer plats åt konteringstabell
- ✅ Stora fakturor: Kan expandera bildpanel för bättre läsbarhet
- ✅ Visuell feedback: Gul färg = "jag är interaktiv"

#### 7. **Fakturaspecifika detaljer synliga:**

**Fortnox har parsad informationen:**
- Leverantör: Järntkraft AB
- Adress: Box 394, 831 25 Östersund
- Kontaktinfo: Telefon, Mejl, Hemsida
- Kundinformation: Vinissi Fastighet AB, Liljvekchsgatan 14
- Fakturanummer: 2743217309
- Datum: 2019-01-10
- Abonnemangsnr: 9001011
- **OCR-nummer**: SE656010399301

**Strukturerad data i tabeller:**
- **ELNÄT**: Period 1 nov 2018 - 31 dec 2018, Belopp: 881,23 kr
- **ELHANDEL**: Period 1 nov 2018 - 31 dec 2018, Belopp: 111,41 kr
- Not: "Beloppet dras från Ett autopigiro den 11 feb 2019"

**Detta betyder att Fortnox har:**
- ✅ OCR-skannat fakturan
- ✅ Extraherat leverantörsinformation
- ✅ Parsad tabeller och belopp
- ✅ Kopplat till rätt leverantör (Järntkraft AB)

#### 8. **Handskrift på fakturan:**

**Observerat:**
- Handskrivna noter i övre högra hörnet: "A 6" (verifikationsnummer!)
- Detta visar att bokförare **annoterar** dokumentet
- Fortnox tillåter troligen digital annotation också

#### 9. **Streckkoder synliga:**

**Längst ner på fakturan:**
- OCR-streckkod (för autogiro)
- Bankinformation strukturerad
- Järntkraft Elnät AB (Momsreg.nr SE656010399301)

#### 10. **Bildkvalitet och format:**

**Tekniska observationer:**
- Format: Troligen PDF konverterat till bild, eller högupplöst JPEG
- Upplösning: Hög (text är läsbar även i zoom)
- Färgrymd: RGB, inga kompressionsartefakter
- Filstorlek: Optimerad för web men inte överdriven komprimering

### Jämförelse med vår VoucherDetailPage:

**Vi har redan:**
- ✅ 50/50 split layout
- ✅ PDF-viewer i iframe
- ✅ Konteringstabell på vänster sida

**Vi saknar:**
- ❌ Toolbar med zoom/download/email-funktioner
- ❌ "KOPPLADE BILDER X (Y)" header
- ❌ Koppla bort/Koppla fler-knappar
- ❌ Gul separator (vi har ingen visuell separator)
- ❌ Multiple attachments navigation (← →)

### Implementation-rekommendationer:

```jsx
// AttachmentViewer.jsx
const AttachmentViewer = ({ attachments, currentIndex, onNavigate }) => {
  const current = attachments[currentIndex];
  
  return (
    <div className="flex flex-col h-full bg-white border-l border-gray-200">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold uppercase text-gray-700">
            Kopplade bilder {currentIndex + 1} ({attachments.length})
          </h3>
          
          {/* Navigation */}
          {attachments.length > 1 && (
            <div className="flex gap-2">
              <button 
                onClick={() => onNavigate(currentIndex - 1)}
                disabled={currentIndex === 0}
                className="text-gray-600 hover:text-gray-900 disabled:opacity-30"
              >
                ←
              </button>
              <button 
                onClick={() => onNavigate(currentIndex + 1)}
                disabled={currentIndex === attachments.length - 1}
                className="text-gray-600 hover:text-gray-900 disabled:opacity-30"
              >
                →
              </button>
            </div>
          )}
        </div>
        
        {/* Toolbar */}
        <div className="flex items-center gap-3 text-sm">
          <button className="text-gray-600 hover:text-gray-900">📷 Saknas text?</button>
          <button className="text-gray-600 hover:text-gray-900">🔍</button>
          <button className="text-gray-600 hover:text-gray-900">🔍+</button>
          <button className="text-gray-600 hover:text-gray-900">⬇️ Ladda ner</button>
          <button className="text-gray-600 hover:text-gray-900">📧 E-posta bild</button>
          <button className="text-gray-600 hover:text-gray-900">📤 Ladda upp</button>
          <a href="#" className="text-blue-600 hover:underline ml-auto">
            Hantera i Inkorg
          </a>
        </div>
      </div>
      
      {/* Image/PDF viewer */}
      <div className="flex-1 overflow-auto bg-white p-4">
        {current.type === 'application/pdf' ? (
          <iframe 
            src={current.url} 
            className="w-full h-full border-0"
          />
        ) : (
          <img 
            src={current.url} 
            alt={current.filename}
            className="w-full h-auto shadow-lg"
          />
        )}
      </div>
      
      {/* Footer */}
      <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 flex justify-end gap-2">
        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm font-semibold">
          Koppla bort
        </button>
        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm font-semibold">
          Koppla fler
        </button>
      </div>
    </div>
  );
};
```

### Gul separator-implementation:

```jsx
// VoucherDetailPage.jsx layout
<div className="flex h-screen">
  {/* Left: Accounting entries */}
  <div className="w-1/2 overflow-auto">
    <VoucherForm />
    <AccountingEntriesTable />
  </div>
  
  {/* Yellow divider */}
  <div className="w-2 bg-yellow-400 flex-shrink-0" />
  
  {/* Right: Attachments */}
  <div className="w-1/2">
    <AttachmentViewer />
  </div>
</div>
```

### OCR och automatisk bokföring:

**Fortnox workflow (förmodad):**
1. Faktura skannas/laddas upp
2. OCR extraherar: Leverantör, belopp, datum, OCR-nr
3. System föreslår kontering baserat på:
   - Tidigare bokföringar från samma leverantör
   - Konteringsmallar
   - AI-matchning
4. Bokförare granskar och godkänner

**För vår framtida bokföringsapp:**
- Använd OCR-API (Google Vision, Tesseract, eller Azure Form Recognizer)
- Bygg intelligent matchning: leverantörsnamn → standardkontering
- Spara bokföringsmallar per leverantör
- ML-modell för att lära sig bokföringsmönster

---

**Uppdaterat:** 2025-11-05 med komplett bokföringsunderlag-analys (split-screen, toolbar, OCR-insights)

---

## 18. NAVIGATION SIDEBAR - Hamburger Menu (OVERLAY-STYLE)

### Fortnox Sidebar - NYARE VERSION (2025)

**Trigger:**
- Hamburger-ikon (☰) i övre vänstra hörnet
- "Meny" text bredvid ikonen
- Klick → Sidebar expanderar från vänster

**Layout när expanderad:**
```
┌────────────────────┐
│ ✕ Meny            │  ← Header (mörkgrön)
├────────────────────┤
│ Startsida          │
│ Inkorgen           │
│ Insikter           │
├────────────────────┤
│ Bokföring          │  ← Active (grön bakgrund)
│ Leverantörsfakturor│
│ Anlägningsregister │
│ Klientfakturering  │
│ Enkel Fakturering  │
│ Lön                │
├────────────────────┤
│ 🛒 Köp & Aktivera  │  ← Ikon + text
│ 💳 Finansiering    │
├────────────────────┤
│ 📧 (notification)  │  ← Sticky footer
└────────────────────┘
  220px bredd (approx)
```

**Design-detaljer:**

### Bakgrund och färger:
- Bakgrund: Mörkgrön (#004d32, Fortnox brand)
- Text: Vit (#ffffff)
- Active item: Ljusare grön bakgrund (#006644)
- Hover: Subtil ljusare grön
- Dividers: Ljusare grön linje (1px, rgba(255,255,255,0.1))

### Typografi:
- Font: 14-15px regular
- Active: 14-15px semibold
- Line-height: 2.5-3rem (generös för touch)
- Ikoner: 18-20px (inline med text)

### Overlay-beteende: ⚠️ PROBLEM

**Vad som händer:**
- Sidebar **ÖVERLAPPAR** huvudinnehållet (position: fixed)
- Huvudinnehållet **PUSHAS INTE** åt höger
- Bakgrunden **DIMMAS INTE** (ingen overlay)
- Man måste klicka ✕ eller utanför för att stänga

**Tidigare version (bättre enligt användaren):**
- Sidebar **PUSHADE** innehållet åt höger
- Huvudinnehållet behöll full synlighet
- Layout-shift men inget dolt innehåll

**UX-problem med overlay-stil:**
```
FÖRE (overlay):                EFTER (overlay):
┌────────────────────┐        ┌────────────────────┐
│   HUVUDINNEHÅLL    │        │▓▓▓▓│  UVUDHÅLL     │
│                    │   →    │▓▓▓▓│  (dolt!)      │
│  Verifikation A6   │        │▓▓▓▓│rifikation A6  │
└────────────────────┘        └────────────────────┘
                               ▓▓▓▓ = Sidebar täcker
```

**Problemscenario:**
1. Användare jobbar med verifikation
2. Vill navigera till Leverantörsfakturor
3. Öppnar menu → **Verifikationstabell döljs delvis**
4. Måste stänga menu igen för att se tabell
5. Extra klick = sämre UX

### Implementation-alternativ:

#### Alternativ A: **Push-style** (REKOMMENDERAT)
```jsx
// Layout som PUSHAR innehållet
<div className="flex">
  {/* Sidebar - tar upp faktiskt utrymme */}
  <aside className={`
    transition-all duration-300 
    ${sidebarOpen ? 'w-56' : 'w-0'}
    overflow-hidden
    bg-brand-900
  `}>
    <SidebarContent />
  </aside>
  
  {/* Main content - justeras automatiskt */}
  <main className="flex-1">
    <MainContent />
  </main>
</div>
```

**Fördelar:**
- ✅ Inget innehåll döljs
- ✅ Layout-shift är tydlig och förväntad
- ✅ Användare behåller kontext

**Nackdelar:**
- ❌ Layout hoppar (kan distrahera)
- ❌ Kräver responsive design för små skärmar

#### Alternativ B: **Overlay med dimmed bakgrund** (KOMPROMISS)
```jsx
<div className="relative">
  {/* Dimmed overlay */}
  {sidebarOpen && (
    <div 
      className="fixed inset-0 bg-black bg-opacity-30 z-40"
      onClick={() => setSidebarOpen(false)}
    />
  )}
  
  {/* Sidebar */}
  <aside className={`
    fixed left-0 top-0 h-full
    transform transition-transform duration-300
    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
    w-56 bg-brand-900 z-50
  `}>
    <SidebarContent />
  </aside>
  
  <main>
    <MainContent />
  </main>
</div>
```

**Fördelar:**
- ✅ Inget layout-hopp
- ✅ Fungerar bra på små skärmar
- ✅ Tydlig fokus på navigation

**Nackdelar:**
- ❌ Dimming kan kännas "tungt"
- ❌ Kräver extra klick för att stänga

#### Alternativ C: **Hybrid** (FORTNOX TIDIGARE VERSION)
```jsx
// Desktop: Push-style
// Mobile: Overlay-style

<aside className={`
  ${isMobile 
    ? 'fixed left-0 top-0 h-full z-50' 
    : 'relative'
  }
  ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
  w-56 bg-brand-900
`}>
```

### Vår app - Rekommendation:

**För Administratörspanel:**
1. **Desktop (>1024px)**: Push-style sidebar (permanent eller togglebar)
2. **Tablet (768-1024px)**: Overlay med dimmed bakgrund
3. **Mobile (<768px)**: Full-width overlay

**För Bokföringsvy specifikt:**
- **Alltid push-style** - Användare behöver se både navigation och arbetssytor samtidigt
- **Sticky header** med företagsväljare och användarinfo
- **Minimal sidebar** när kollapsed (bara ikoner, 60px bred)

```jsx
// Minimal collapsed state
<aside className="w-16 bg-brand-900">
  <button>🏠</button>  {/* Startsida */}
  <button>📥</button>  {/* Inkorgen */}
  <button>📊</button>  {/* Bokföring */}
  <button>💰</button>  {/* Fakturering */}
</aside>

// Expanded state (hover eller click)
<aside className="w-56 bg-brand-900">
  <button>🏠 Startsida</button>
  <button>📥 Inkorgen</button>
  <button>📊 Bokföring</button>
  <button>💰 Fakturering</button>
</aside>
```

### Feedback från användaren:

> "Deras nedfällda vänstersidebar är dock inte så lyckad, tycker jag. 
> Den täcker över, det gjorde den inte förut. Detta är en ny uppdatering"

**Analys:**
- Fortnox bytte från push-style till overlay-style
- Troligen för att följa "moderna" UI-trends (Gmail, Slack, etc)
- MEN: Detta passar DÅLIGT för accounting-software där:
  - Användare jobbar med data som kräver bred vy
  - Navigation är HJÄLPFUNKTION, inte huvudfokus
  - Context-switching är dyrare än i kommunikationsappar

**Lesson learned:**
> "Modern" ≠ Alltid bättre. 
> Accounting software behöver **data-first design**, inte **navigation-first design**.

---

**Uppdaterat:** 2025-11-05 med sidebar-analys och UX-feedback

---

## 19. RAPPORTMENY - Modal Dialog med Kategoriserade Rapporter

### Fortnox Rapportväljare (2025 uppdaterad version)

**Trigger:**
- "Rapporter" länk i huvudnavigationen
- Öppnar modal dialog över innehållet

**Modal-struktur:**
```
┌────────────────────────────────────────────────────┐
│ Rapporter                                      [✕] │
│ ───────────────────────────────────────────────── │
│ 📊 Skapa utkäde och mer skräddarsydda rapporter!  │
│    Läs mer om Rapport & Analys ›                  │
├───────────────┬───────────────┬──────────────────┤
│ BOKFÖRING     │ FAKTURERING   │ ANLÄGNINGSREG... │
│               │               │                  │
│ Balansrapport›│ Förfallolista›│ Avskrivningar›   │
│ Borttagna ve..│ Reskontralista│ Avskrivningar(Ny)│
│ Huvudbok›     │ Topplista kund│ Avskrivningar/må │
│ Ingående bal..│ Valutarapport │ Exportera tillg..│
│ Kontoanalys›  │               │ Försäljning och..│
│ Likviditetsra │ REGISTER OCH..│ Kommande avskr.. │
│ Momsrapport›  │ Artikelregist.│ Tillgångsinform..│
│ Periodiseriga │ Artikelstatist│ Tillgångslista›  │
│ Periodisk sam │ Artikelstatist│ Utförda avskriv..│
│ Resultbudget› │     avancerad │                  │
│ Resultatrappo │ Kontoplan›    │ LÖN              │
│ Resultatrappo │ Kundregister› │ Bruttolönelista› │
│    12         │ Kundstatistik›│ Löneartslista›   │
│ Månader›      │ Lagerlista›   │ Lönekartläggning │
│ Resultatrappo │ Leverantörsre │ Lönestatistik›   │
│    avancerad› │ Offert/Order..│ Medelantalet...  │
│ Systemdokumen │ Offert/Order..│ Personallista›   │
│ Verifikations │    summerad›  │ Personkort›      │
│               │               │                  │
│ LEVERANTÖRS...│               │                  │
│ Förfallolista›│               │                  │
│ Leverantörss..│               │                  │
│ Reskontralista│               │                  │
│ Topplista lev.│               │                  │
└───────────────┴───────────────┴──────────────────┘
                     [Stäng]
```

### Design-detaljer:

#### 1. **Modal overlay:**
- Bakgrund: `rgba(0, 0, 0, 0.5)` - dimmed
- Modal bredd: ~900-1000px
- Modal höjd: ~600px (scrollbar vid behov)
- Centrerad på skärmen
- Klick utanför stänger (eller ✕-knapp)

#### 2. **Header-sektion:**
```
Rapporter                                         [✕]
───────────────────────────────────────────────────
📊 Skapa utkäde och mer skräddarsydda rapporter!
   Läs mer om Rapport & Analys ›
```

**Typografi:**
- "Rapporter": 20-22px bold
- Info-text: 14px regular
- "Läs mer"-länk: 14px, blå, grön Fortnox-färg (#00704a)
- 📊 Ikon: 18-20px

#### 3. **3-4 kolumn layout:**

**Kategorier:**
- **BOKFÖRING** (vänster kolumn)
- **FAKTURERING** (mitten kolumn)
- **ANLÄGNINGSREGISTER** (höger kolumn)
- **REGISTER OCH LISTOR** (mitten, andra sektion)
- **LÖN** (höger, andra sektion)
- **LEVERANTÖRSFAKTUROR** (vänster, andra sektion)

**Styling:**
- Kategorirubriker: 13px semibold, UPPERCASE, mörkgrå
- Rapportlänkar: 14px regular, grön Fortnox-färg
- Hover: Underline
- › pilar: Indikerar att rapport öppnas i ny vy

#### 4. **Rapportlista per kategori:**

**BOKFÖRING (mest relevant för oss!):**
```
Balansrapport ›
Borttagna verifikationer ›
Huvudbok ›
Ingående balans ›
Kontoanalys ›
Likviditetsrapport ›
Momsrapport ›
Periodiseringar ›
Periodisk sammanställning ›
Resultbudget ›
Resultatrapport ›
Resultatrapport 12 månader ›
Resultatrapport avancerad ›
Systemdokumentation ›
Verifikationslista ›
```

**FAKTURERING:**
```
Förfallolista ›
Reskontralista ›
Topplista kund ›
Valutarapport kund ›
```

**REGISTER OCH LISTOR:**
```
Artikelregister ›
Artikelstatistik ›
Artikelstatistik avancerad ›
Kontoplan ›
Kundregister ›
Kundstatistik ›
Lagerlista ›
Leverantörsregister ›
Offert/Order/Fakturalista ›
Offert/Order/Fakturalista summerad ›
```

#### 5. **Scroll-beteende:**
- Innehållet scrollar vertikalt
- Header sticky (följer inte med vid scroll)
- Kolumner behåller bredd

#### 6. **Footer:**
```
                    [Stäng]
```
- Centrerad grön primär-knapp
- 14px semibold
- Padding: 12px 32px

### Drill-down navigation flow:

**Steg 1: Välj rapport från modal**
```
Rapporter Modal → Click "Balansrapport ›"
```

**Steg 2: Visa rapport med klickbara konton**
```
Balansrapport
├── Tillgångar
│   ├── 1930 Företagskonto (klickbar) → 125 340 kr
│   ├── 1510 Kundfordringar (klickbar) → 89 220 kr
├── Skulder
│   ├── 2440 Leverantörsskulder (klickbar) → -45 780 kr
```

**Steg 3: Click på kontonummer → Huvudbok**
```
Huvudbok - 1930 Företagskonto
┌────────┬─────────────┬──────┬────────┬────────┐
│ Datum  │ Ver.nr      │ Besk │ Debet  │ Kredit │
├────────┼─────────────┼──────┼────────┼────────┤
│ Jan 10 │ A1 (klick!) │ Swe..│ 750.00 │        │
│ Jan 15 │ A2 (klick!) │ Hyr..│        │ 15k    │
```

**Steg 4: Click på Ver.nr → Verifikation**
```
Verifikation A1 med konteringar + bokföringsunderlag (PDF)
```

### Implementation för Steg 2 - Rapportarkiv:

```jsx
// ReportArchiveModal.jsx
const ReportArchiveModal = ({ isOpen, onClose }) => {
  const reportCategories = {
    bokforing: [
      { name: 'Balansrapport', url: '/rapport/balans' },
      { name: 'Huvudbok', url: '/rapport/huvudbok' },
      { name: 'Resultatrapport', url: '/rapport/resultat' },
      { name: 'Momsrapport', url: '/rapport/moms' },
      { name: 'Verifikationslista', url: '/rapport/verifikationer' },
    ],
    fakturering: [
      { name: 'Förfallolista', url: '/rapport/forfallo' },
      { name: 'Reskontralista', url: '/rapport/reskontra' },
    ],
    register: [
      { name: 'Kontoplan', url: '/rapport/kontoplan' },
      { name: 'Kundregister', url: '/rapport/kunder' },
      { name: 'Leverantörsregister', url: '/rapport/leverantorer' },
    ],
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />
      
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-[900px] max-h-[600px] overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-bold text-gray-900">Rapporter</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            <div className="bg-brand-50 border-l-4 border-brand-600 p-3">
              <p className="text-sm text-gray-700">
                📊 Skapa utkäde och mer skräddarsydda rapporter!
                <a href="#" className="text-brand-600 hover:underline ml-2">
                  Läs mer om Rapport & Analys ›
                </a>
              </p>
            </div>
          </div>
          
          {/* Content - 3 kolumner */}
          <div className="p-6 overflow-y-auto max-h-[400px]">
            <div className="grid grid-cols-3 gap-8">
              {/* Kolumn 1: BOKFÖRING */}
              <div>
                <h3 className="text-xs font-semibold uppercase text-gray-500 mb-3">
                  BOKFÖRING
                </h3>
                <ul className="space-y-2">
                  {reportCategories.bokforing.map(report => (
                    <li key={report.name}>
                      <a 
                        href={report.url}
                        className="text-sm text-brand-600 hover:underline"
                      >
                        {report.name} ›
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Kolumn 2: FAKTURERING */}
              <div>
                <h3 className="text-xs font-semibold uppercase text-gray-500 mb-3">
                  FAKTURERING
                </h3>
                <ul className="space-y-2">
                  {reportCategories.fakturering.map(report => (
                    <li key={report.name}>
                      <a 
                        href={report.url}
                        className="text-sm text-brand-600 hover:underline"
                      >
                        {report.name} ›
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Kolumn 3: REGISTER OCH LISTOR */}
              <div>
                <h3 className="text-xs font-semibold uppercase text-gray-500 mb-3">
                  REGISTER OCH LISTOR
                </h3>
                <ul className="space-y-2">
                  {reportCategories.register.map(report => (
                    <li key={report.name}>
                      <a 
                        href={report.url}
                        className="text-sm text-brand-600 hover:underline"
                      >
                        {report.name} ›
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex justify-center">
            <button 
              onClick={onClose}
              className="px-8 py-2 bg-brand-600 text-white rounded hover:bg-brand-700 font-semibold"
            >
              Stäng
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
```

### För Bokföringsanalys Steg 2:

**Expanderbar trädstruktur istället för modal:**
```
Steg 2: Rapportarkiv per Räkenskapsår

▼ 2023
  ├─ 📊 Balansrapport
  ├─ 📊 Resultatrapport
  ├─ 📊 Huvudbok
  └─ 📊 Verifikationslista
  
▼ 2022
  ├─ 📊 Balansrapport
  ├─ 📊 Resultatrapport
  └─ ...

▶ 2021 (collapsed)
```

**Klick på rapport → window.open() med PDF**

---

## 20. RAPPORT EXPORT DIALOG - Datumväljare & Format

### Print/Export Overlay (Balansrapport exempel)

När användare klickar på en rapport (t.ex. "Balansrapport ›") öppnas en **liten modal overlay** med export-inställningar:

**Dialog-struktur:**
```
┌─────────────────────────────────────┐
│ Datum [2019-01-01] [📅]             │
│                                      │
│ Orientering:                         │
│ ⦿ Stående    ○ Liggande             │
│                                      │
│ □ Kompakt                            │
│                                      │
│ ① [Visa på skärm] [Visa PDF]       │
│    [Visa TXT]      [Avbryt]         │
└─────────────────────────────────────┘
```

### Design-detaljer:

#### 1. **Modal placering:**
- Position: Top-left av viewport (ej centrerad!)
- Bakgrund: Vit med skugga
- Border: 1px solid #ddd
- Border-radius: 4px
- Shadow: `0 2px 8px rgba(0,0,0,0.15)`
- Bredd: ~280-320px
- Höjd: Auto (baserat på innehåll)

#### 2. **Datum-input:**
```
Datum [2019-01-01] [📅]
```

**Komponenter:**
- Label: "Datum" - 13px regular
- Input field: `<input type="text" value="2019-01-01">`
  - Font: Monospace eller regular
  - Size: 13px
  - Padding: 6px 8px
  - Border: 1px solid #ccc
  - Width: ~120px
- Kalender-ikon: 📅 (16px)
  - Klickbar → Öppnar date picker (veckonummer!)
  - Grön hover-effekt (som tidigare dokumenterat)

#### 3. **Orientering - Radio buttons:**
```
Orientering:
⦿ Stående    ○ Liggande
```

**Styling:**
- Label: "Orientering:" - 13px regular
- Radio buttons: Standard HTML radio
- Text: 13px regular
- Spacing: 16px mellan alternativen
- Default: Stående (portrait)

#### 4. **Checkbox:**
```
□ Kompakt
```

**Funktion:**
- Minskar padding/margins i PDF-utskriften
- Får plats mer data per sida
- Typisk "data density"-toggle

#### 5. **Action buttons:**
```
① [Visa på skärm] [Visa PDF]
   [Visa TXT]      [Avbryt]
```

**Layout:**
- 2×2 grid
- Button styling:
  - Border: 1px solid #ccc
  - Background: White (sekundär)
  - Padding: 8px 16px
  - Font: 13px semibold
  - Border-radius: 3px
  - Hover: Light gray background

**Button-hierarki:**
- **Visa på skärm**: Primär action → Öppnar rapport i webb-vy (HTML)
  - *Heritage från Visma Administration: "Skärm" vs "Filutskrift"*
- **Visa PDF**: Genererar PDF → window.open() för utskrift/arkivering
- **Visa TXT**: Export som **tabseparerad textfil (.xls)** → Öppnas i Excel
  - *Tooltip: "Välj att visa denna rapport i TXT om ni kan öppna i Excel, då skapas en tabseparerad textfil"*
  - Format: TSV (Tab-Separated Values), inte CSV
  - Används för vidare bearbetning i Excel/Google Sheets
- **Avbryt**: Stänger dialog

**Notification badge:**
- Blå cirkel "①" vid "Visa på skärm"
- Indikerar: "Rekommenderad action" eller "Nytt/uppdaterat"

**ℹ️ Information icon:**
- Hover → Tooltip förklarar TXT-format
- Visar: "Välj att visa denna rapport i TXT om ni kan öppna i Excel, då skapas en tabseparerad textfil"
- Gul bakgrund, svart text, 14px
- Positioning: Near "Visa TXT" button

### Workflow:

```
1. Click "Balansrapport ›" i Rapporter-menyn
   ↓
2. Print dialog öppnas (top-left overlay)
   ↓
3. User väljer datum: 2019-12-31 (räkenskapsårets slut)
   ↓
4. User väljer orientering: Stående
   ↓
5. User checkar "Kompakt" (optional)
   ↓
6. User klickar "Visa på skärm"
   ↓
7. Rapport öppnas i ny vy med KLICKBARA KONTONUMMER
```

### Implementation för Steg 2:

```jsx
// ReportExportDialog.jsx
const ReportExportDialog = ({ reportType, isOpen, onClose, onGenerate }) => {
  const [date, setDate] = useState('2019-12-31');
  const [orientation, setOrientation] = useState('portrait');
  const [compact, setCompact] = useState(false);

  const handleGenerate = (format) => {
    const options = {
      reportType,
      date,
      orientation,
      compact,
      format, // 'html', 'pdf', 'txt'
    };
    
    onGenerate(options);
    onClose();
  };

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      className="fixed top-20 left-20" // Top-left placering!
    >
      <div className="bg-white rounded shadow-lg p-4 w-80">
        {/* Datum */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Datum</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm font-mono"
            />
            <button className="text-xl hover:text-brand-600">
              📅
            </button>
          </div>
        </div>

        {/* Orientering */}
        <div className="mb-4">
          <label className="block text-sm mb-2">Orientering:</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                checked={orientation === 'portrait'}
                onChange={() => setOrientation('portrait')}
              />
              Stående
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                checked={orientation === 'landscape'}
                onChange={() => setOrientation('landscape')}
              />
              Liggande
            </label>
          </div>
        </div>

        {/* Kompakt */}
        <div className="mb-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={compact}
              onChange={(e) => setCompact(e.target.checked)}
            />
            Kompakt
          </label>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleGenerate('html')}
            className="relative border border-gray-300 bg-white hover:bg-gray-50 px-4 py-2 rounded text-sm font-semibold"
          >
            <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              1
            </span>
            Visa på skärm
          </button>
          <button
            onClick={() => handleGenerate('pdf')}
            className="border border-gray-300 bg-white hover:bg-gray-50 px-4 py-2 rounded text-sm font-semibold"
          >
            Visa PDF
          </button>
          <button
            onClick={() => handleGenerate('txt')}
            className="border border-gray-300 bg-white hover:bg-gray-50 px-4 py-2 rounded text-sm font-semibold"
          >
            Visa TXT
          </button>
          <button
            onClick={onClose}
            className="border border-gray-300 bg-white hover:bg-gray-50 px-4 py-2 rounded text-sm font-semibold"
          >
            Avbryt
          </button>
        </div>
      </div>
    </Dialog>
  );
};
```

### För vår Bokföringsanalys:

**Förenklad version (vi har redan datum från steg 1!):**
```jsx
// I Steg 2 - Rapportarkiv:
const handleReportClick = (reportType) => {
  // Vi använder REDAN valt räkenskapsår från Steg 1
  const startDate = selectedYear.startDate; // 2023-01-01
  const endDate = selectedYear.endDate;     // 2023-12-31
  
  // Generera rapport direkt (skip dialog)
  generateReport({
    type: reportType,
    startDate,
    endDate,
    format: 'html', // Alltid HTML med klickbara konton
  });
  
  // Öppna i samma fönster (inte popup)
  navigate(`/rapport/${reportType}?year=${selectedYear.year}`);
};
```

**Klickbar Balansrapport:**
```jsx
// BalanceReport.jsx
<table>
  <tr>
    <td>
      <a 
        href={`/huvudbok/${account.number}`}
        className="text-brand-600 hover:underline"
      >
        {account.number} {account.name}
      </a>
    </td>
    <td className="text-right font-mono">
      {formatAmount(account.balance)}
    </td>
  </tr>
</table>
```

---

## 21. BALANSRAPPORT - Klickbara Kontonummer (Drill-down Level 1)

### PDF-baserad rapport med interaktiva länkar

**URL-struktur:**
```
/report/report/?fid=215192&type=balance&fromdate=2019-01-01&todate=2019-12-31
&cc=&pfu=&output=pdf&orientation=portrait&ccs=undefined
```

**Rapportstruktur:**
```
Balansrapport ÅRL
Vinissi Fastighet AB
556903-8671
Räkenskapsår 2019-01-01 - 2019-12-31
Period: 2019-01-01 - 2019-12-31

                           Ing balans  Ing saldo  Period    Utg balans
TILLGÅNGAR
Anläggningstillgångar
  Materiella anläggningstillgångar
    1110  Byggnader             1 317 257,00  1 317 257,00   0,00   1 317 257,00
    1119  Ackumulerade avs...    -135 063,00   -135 063,00   0,00    -135 063,00
    1130  Mark                    266 500,00    266 500,00   0,00     266 500,00
    1220  Inventarier och...      49 039,00     49 039,00   0,00      49 039,00
    1229  Ackumulerade avs...     -39 628,00    -39 628,00   0,00     -39 628,00
    ─────────────────────────────────────────────────────────────────
    Summa materiella anl...  1 458 105,00  1 458 105,00   0,00   1 458 105,00

  Summa anläggningstillgångar  1 458 105,00  1 458 105,00   0,00   1 458 105,00

Omsättningstillgångar
  Kortfristiga fordringar
    1613  Övriga förskott          20 000,00     20 000,00   0,00      20 000,00
    1630  Avräkning för ska...     -6 589,00     -6 589,00   2 250,00  -4 339,00
    1640  Skattefordringar         35 274,00     35 274,00  27 528,00  62 802,00
    ─────────────────────────────────────────────────────────────────
    Summa kortfristiga for...    48 685,00     48 685,00  29 778,00  78 463,00

  Kassa och bank
    1930  Företagskonto/che...    143 896,18    143 896,18 -307 537,00 -163 640,82
    ─────────────────────────────────────────────────────────────────
    Summa kassa och bank        143 896,18    143 896,18 -307 537,00 -163 640,82

  Summa omsättningstillgångar   192 581,18    192 581,18 -277 759,00  -85 177,82

SUMMA TILLGÅNGAR             1 650 686,18  1 650 686,18 -277 759,00 1 372 927,18
```

### Design-detaljer:

#### 1. **Klickbara kontonummer:**
- Kontonummer: Blå länkar (Fortnox-grön i HTML, blå i PDF)
- Format: `1930` (4-siffrig kod)
- Hover: Underline
- Click: Navigerar till Huvudbok för det kontot
  - URL: `/report/report/?r=gledger&fromacct=1930&toacct=1930&fromdate=...`

#### 2. **Hierarkisk struktur:**
```
TILLGÅNGAR (Level 1, Bold, UPPERCASE)
├─ Anläggningstillgångar (Level 2, Bold)
│  └─ Materiella anläggningstillgångar (Level 3, Regular)
│     ├─ 1110 Byggnader (Level 4, klickbar)
│     ├─ 1119 Ackumulerade avskrivningar... (Level 4, klickbar)
│     └─ Summa materiella... (Level 3, Bold)
└─ Omsättningstillgångar (Level 2, Bold)
   └─ ...

SUMMA TILLGÅNGAR (Level 1, Bold, UPPERCASE)
```

#### 3. **Kolumner (4st):**
- **Ing balans**: Ingående balans vid periodens start
- **Ing saldo**: Ingående saldo (samma som ing balans för ÅRL)
- **Period**: Förändring under perioden
- **Utg balans**: Utgående balans vid periodens slut
- **Alla belopp högerställda** ✅
- Font: Monospace för siffror (alignment)

#### 4. **Typografi:**
- Rubrik "Balansrapport ÅRL": 18-20px bold
- Företagsinfo: 11-12px regular
- Kategori (TILLGÅNGAR): 14px bold uppercase
- Underkategori: 13px bold
- Kontorad: 12px regular
- Summa-rader: 12px bold
- Belopp: 12px monospace

#### 5. **Summering:**
- Horisontell linje (`─────`) före summa-rader
- "Summa X": Bold text
- Hierarkiska summor (per kategori → per huvudkategori → total)

---

## 22. HUVUDBOK - Transaktioner per Konto (Drill-down Level 2)

### Från Balansrapport → Click på kontonummer → Huvudbok

**URL-struktur:**
```
/report/report/?fid=215192&r=gledger&fromacct=1930&toacct=1930
&fromdate=2019-01-01&todate=2019-12-31&cc=&output=pdf&filter=undefined
```

**URL-parametrar:**
- `r=gledger` → Huvudbok (General Ledger)
- `fromacct=1930&toacct=1930` → Endast konto 1930
- Sessions-ID: `fid=215192` (Fortnox använder sessions + JWT enligt deras dokumentation)

### Huvudbok-struktur:

```
Huvudbok
Vinissi Fastighet AB
556903-8671
Räkenskapsår 2019-01-01 - 2019-12-31
Period 2019-01-01 - 2019-12-31

Konto  Namn              Datum       Text                    Debet     Kredit    Saldo
       Verif nr

1930   Företagskonto/checkkonto/affärskonto
                         Ingående balans                                         143 896,18
                         Ingående saldo                     0,00      0,00      143 896,18
       A 1               2019-01-21  Swedbank bankkosnad                750,00   143 146,18
       A 2               2019-01-28  Hyr måls januari      12 100,00            155 246,18
       A 3               2019-01-28  Hyr måls januari       5 400,00            160 646,18
       A 2               2019-01-28  Hyr måls januari      12 750,00            173 396,18
       A 2               2019-01-28  Hyr måls januari       2 900,00            176 296,18
       A 13              2019-02-11  Lönekörningsjournal nr 14         17 006,00 159 290,18
       A 6               2019-02-11  SKV                                2 294,00 146 996,18
       A 6               2019-02-28  Lönekörningsjournal nr 15         24 865,00 131 131,18
       A 49              2019-02-28  Hyresräster           5 970,00            137 101,18
       ...
```

### Design-detaljer:

#### 1. **KLICKBARA VERIFIKATIONER** (⭐⭐⭐):
- Format: **[Serie] [Nummer]** (t.ex. "A 1", "A 2", "A 13")
- Färg: Blå länkar (Fortnox-grön i HTML)
- Hover: Underline
- Click: Öppnar **bokföringspost med konteringar + underlag**
  - URL: `/bf/voucher/[verifikation-id]`
  - Visar: Split-screen med konteringar (vänster) + PDF/bild (höger)

**Viktig detalj:**
- **Verifikationsserie + Verifikationsnummer = UNIK IDENTIFIERARE**
- Serie: A, B, C, D... (bokföringstyp)
- Nummer: Löpnummer inom serien
- Tillsammans pekar de ut EN specifik bokföringspost

#### 2. **Kolumner:**
- **Konto**: 1930 (visas endast på första raden)
- **Namn**: Kontonamn (visas endast på första raden)
- **Verif nr**: Klickbar verifikation (Serie + Nummer)
- **Datum**: YYYY-MM-DD format
- **Text**: Transaktionsbeskrivning (t.ex. "Swedbank bankkosnad", "Hyr måls januari")
- **Debet**: Debet-belopp (tom om kredit)
- **Kredit**: Kredit-belopp (tom om debet)
- **Saldo**: **LÖPANDE SALDO per rad** ⭐⭐⭐

#### 3. **Löpande saldo-beräkning:**
```javascript
// Exempel från konto 1930 (Bankkonto = TILLGÅNG):
Ingående: 143 896,18
- A 1 (Kredit 750,00):    143 896,18 - 750,00 = 143 146,18
+ A 2 (Debet 12 100,00):  143 146,18 + 12 100 = 155 246,18
+ A 3 (Debet 5 400,00):   155 246,18 + 5 400  = 160 646,18
...
```

**Regel för tillgångskonto (1xxx):**
- Debet ökar saldo
- Kredit minskar saldo

**Regel för skuldkonto (2xxx):**
- Kredit ökar saldo
- Debet minskar saldo

#### 4. **Ingående balans:**
```
                    Ingående balans                           143 896,18
                    Ingående saldo           0,00    0,00     143 896,18
```

- Visas alltid överst
- "Ingående saldo" rad med 0,00 / 0,00 (ingen transaktion)
- Startpunkt för löpande saldo-beräkning

#### 5. **Typografi:**
- Rubrik "Huvudbok": 18px bold
- Kontonamn: 12px regular
- Verifikationsnummer: 12px, blå, underline on hover
- Transaktionstext: 12px regular
- Belopp: 12px monospace, högerställda
- Saldo: 12px monospace, högerställda, **alltid synligt**

#### 6. **Window-läge:**
- **INTE fullscreen!** (viktigt! 🎯)
- Öppnas som separat fönster (window.open)
- Storlek: ~1200×800px (lagom för att se innehåll utan att täcka allt)
- Användare kan ha flera rapportfönster öppna samtidigt
- Möjlighet att jämföra olika konton/perioder

### Implementation för Administratörspanel:

```jsx
// BalanceReport.jsx - Klickbara kontonummer
const BalanceReport = ({ fiscalYear }) => {
  const handleAccountClick = (accountNumber) => {
    const url = `/huvudbok/${accountNumber}?year=${fiscalYear}`;
    
    // Öppna i nytt fönster (INTE fullscreen)
    window.open(url, '_blank', 'width=1200,height=800,scrollbars=yes');
  };

  return (
    <table className="w-full text-sm">
      <tbody>
        <tr>
          <td className="py-1">
            <button
              onClick={() => handleAccountClick('1930')}
              className="text-brand-600 hover:underline font-mono"
            >
              1930
            </button>
            {' '}Företagskonto/checkkonto/affärskonto
          </td>
          <td className="text-right font-mono">143 896,18</td>
          <td className="text-right font-mono">143 896,18</td>
          <td className="text-right font-mono">-307 537,00</td>
          <td className="text-right font-mono">-163 640,82</td>
        </tr>
      </tbody>
    </table>
  );
};

// GeneralLedger.jsx - Klickbara verifikationer
const GeneralLedger = ({ accountNumber, fiscalYear }) => {
  const [transactions, setTransactions] = useState([]);
  const [runningBalance, setRunningBalance] = useState(0);

  useEffect(() => {
    // Hämta transaktioner för konto
    fetchTransactions(accountNumber, fiscalYear).then(data => {
      // Beräkna löpande saldo per rad
      let balance = data.openingBalance;
      const withBalances = data.transactions.map(tx => {
        if (data.accountType === 'ASSET' || data.accountType === 'EXPENSE') {
          balance += tx.debit - tx.credit;
        } else {
          balance -= tx.debit - tx.credit;
        }
        return { ...tx, balance };
      });
      setTransactions(withBalances);
      setRunningBalance(data.openingBalance);
    });
  }, [accountNumber, fiscalYear]);

  const handleVoucherClick = (series, number) => {
    const url = `/verifikation/${series}/${number}`;
    
    // Öppna i nytt fönster (INTE fullscreen)
    window.open(url, '_blank', 'width=1400,height=900,scrollbars=yes');
  };

  return (
    <div className="p-6">
      <h1 className="text-page-title mb-4">Huvudbok</h1>
      <h2 className="text-section-title mb-2">
        {accountNumber} {accountName}
      </h2>

      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Konto</th>
            <th className="text-left">Namn<br/>Verif nr</th>
            <th className="text-left">Datum</th>
            <th className="text-left">Text</th>
            <th className="text-right">Debet</th>
            <th className="text-right">Kredit</th>
            <th className="text-right">Saldo</th>
          </tr>
        </thead>
        <tbody>
          {/* Ingående balans */}
          <tr className="border-b">
            <td rowSpan={2} className="font-mono">{accountNumber}</td>
            <td rowSpan={2}>{accountName}</td>
            <td colSpan={4} className="text-right py-1">
              Ingående balans
            </td>
            <td className="text-right font-mono">{formatAmount(runningBalance)}</td>
          </tr>
          <tr className="border-b">
            <td colSpan={3} className="text-right">Ingående saldo</td>
            <td className="text-right font-mono">0,00</td>
            <td className="text-right font-mono">0,00</td>
            <td className="text-right font-mono">{formatAmount(runningBalance)}</td>
          </tr>

          {/* Transaktioner */}
          {transactions.map((tx, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td></td>
              <td>
                <button
                  onClick={() => handleVoucherClick(tx.series, tx.number)}
                  className="text-brand-600 hover:underline"
                >
                  {tx.series} {tx.number}
                </button>
              </td>
              <td className="font-mono">{tx.date}</td>
              <td>{tx.description}</td>
              <td className="text-right font-mono">
                {tx.debit > 0 ? formatAmount(tx.debit) : ''}
              </td>
              <td className="text-right font-mono">
                {tx.credit > 0 ? formatAmount(tx.credit) : ''}
              </td>
              <td className="text-right font-mono font-semibold">
                {formatAmount(tx.balance)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

### Nästa steg: Verifikation (Drill-down Level 3)

När användare klickar på verifikation (t.ex. **A 1**) öppnas bokföringsposten:
- **Split-screen layout** (50/50 med draggable divider)
- **Vänster:** Konteringstabell med alla berörda konton
- **Höger:** PDF/bild-underlag (Swedbank kvitto, faktura, etc.)
- **Toolbar:** Zoom, Download, Email, OCR

---

## 23. VERIFIKATION - Bokföringspost med Underlagslänk (Drill-down Level 3)

### Från Huvudbok → Click på verifikation → Verifikationsvy

**URL-struktur:**
```
/report/report/?fid=215192&r=voucher&s=A&i=1&output=pdf&filter=undefined
&ccs=undefined&intfrom=undefined&intto=undefined
```

**URL-parametrar:**
- `r=voucher` → Verifikation
- `s=A` → Verifikationsserie (A, B, C, D...)
- `i=1` → Verifikationsnummer (löpnummer inom serien)
- `output=pdf` → PDF-format

### Verifikationsstruktur:

```
Vinissi Fastighet AB                               Verifikation A 1              Utskrivet 2025-11-05 04:38
556903-8671                                                                      Senaste vernr A 162 § 14
Visa verifikatsbild >>

Vernr  Bokföringsdatum  Text                          Debet       Kredit
       Konto            Ks    Benämning

A 1    2019-01-21       Swedbank bankkostnad
       1930                   Företagskonto/checkkonto/affärskonto              750,00
       6570                   Bankkostnader            750,00

────────────────────────────────────────────────────────────────────────────
Antal verifikat: 1                          Omslutning:  750,00     750,00
Antal transaktioner: 2
```

### Design-detaljer:

#### 1. **"Visa verifikatsbild >>" länk** (⭐⭐⭐):
- **Placering:** Uppe till vänster, under företagsnamn/org.nr
- **Färg:** Blå (Fortnox-grön i HTML)
- **Text:** "Visa verifikatsbild >>" (dubbel pil indikerar extern länk)
- **Hover:** Underline
- **Click:** Öppnar bifogad bild/PDF i nytt fönster
  - Troligen: `window.open('/attachment/[attachment-id]')`
  - Kan vara: Direktlänk till fil i Fortnox dokumentarkiv

**Viktigt:**
- Länken visas **endast om verifikation har bifogat underlag**
- Om ingen bilaga → ingen länk
- Detta är KRITISKT för drill-down: Rapport → Huvudbok → Verifikation → **Underlag**

#### 2. **Verifikationshuvud:**
```
Vernr  Bokföringsdatum  Text
A 1    2019-01-21       Swedbank bankkostnad
```

**Fält:**
- **Vernr:** Verifikationsserie + nummer (A 1)
- **Bokföringsdatum:** 2019-01-21 (YYYY-MM-DD)
- **Text:** Beskrivning av hela verifikationen

#### 3. **Konteringstabell:**
```
       Konto  Ks  Benämning                              Debet    Kredit
       1930       Företagskonto/checkkonto/affärskonto            750,00
       6570       Bankkostnader                         750,00
```

**Kolumner:**
- **Konto:** 4-siffrig kontokod (1930, 6570)
- **Ks:** Kostnadsställe (tom i detta exempel)
- **Benämning:** Kontonamn (full text)
- **Debet:** Debet-belopp (högerställt, monospace)
- **Kredit:** Kredit-belopp (högerställt, monospace)

**Indragning:**
- Vernr, Datum, Text på första raden
- Kontorad indragerade (endast Konto, Ks, Benämning, Debet, Kredit)

#### 4. **Footer med metadata:**
```
────────────────────────────────────────────────────────────────
Antal verifikat: 1                   Omslutning:  750,00  750,00
Antal transaktioner: 2
```

**Fält:**
- **Antal verifikat:** Alltid 1 (detta är en enskild verifikation)
- **Antal transaktioner:** Antal konteringsrader (här 2: konto 1930 + 6570)
- **Omslutning:** Summa Debet | Summa Kredit (måste vara lika!)
- **Horisontell linje:** Separator före footer

#### 5. **Bokföringsregler validering:**
- **Debet = Kredit** (750,00 = 750,00) ✅
- Om **Debet ≠ Kredit** → Felmeddelande i röd text
- Detta är FUNDAMENTAL bokföringsprincip (dubbel bokföring)

### Jämförelse med Fortnox webb-interface:

**PDF-version (vad vi ser nu):**
- Enkel konteringstabell
- "Visa verifikatsbild >>" länk → Öppnar underlag separat
- Optimerad för utskrift/arkivering

**Webb-version (från tidigare session):**
- Split-screen layout (50/50)
- Konteringstabell (vänster) + PDF/bild (höger)
- Draggable gul divider (30-70% range)
- Toolbar: Zoom, Download, Email, OCR
- Navigation: ← → om flera bilagor
- Footer: [Koppla bort] [Koppla fler] buttons

### Implementation för Administratörspanel:

**Vi ska använda webb-versionen (split-screen), INTE PDF-versionen!**

```jsx
// VoucherDetailPage.jsx (redan implementerad delvis)
const VoucherDetailPage = () => {
  const { series, number } = useParams(); // A, 1
  const [voucher, setVoucher] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [currentAttachmentIndex, setCurrentAttachmentIndex] = useState(0);
  const [leftWidth, setLeftWidth] = useState(50); // For draggable divider

  useEffect(() => {
    // Hämta verifikation med konteringar
    fetchVoucher(series, number).then(data => {
      setVoucher(data);
      setAttachments(data.attachments || []);
    });
  }, [series, number]);

  // Draggable divider logic (already in documentation Section 17)
  // ...

  return (
    <div className="flex h-screen">
      {/* VÄNSTER: Konteringstabell */}
      <div style={{ width: `${leftWidth}%` }} className="p-6 overflow-y-auto">
        <h1 className="text-page-title mb-4">
          Verifikation {series} {number}
        </h1>

        {/* Metadata */}
        <div className="mb-4 text-sm text-gray-600">
          <p>Bokföringsdatum: {voucher?.date}</p>
          <p>Text: {voucher?.description}</p>
        </div>

        {/* Konteringstabell */}
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Konto</th>
              <th className="text-left">Benämning</th>
              <th className="text-right">Debet</th>
              <th className="text-right">Kredit</th>
            </tr>
          </thead>
          <tbody>
            {voucher?.entries.map((entry, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="font-mono py-2">{entry.account}</td>
                <td>{entry.accountName}</td>
                <td className="text-right font-mono">
                  {entry.debit > 0 ? formatAmount(entry.debit) : ''}
                </td>
                <td className="text-right font-mono">
                  {entry.credit > 0 ? formatAmount(entry.credit) : ''}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 font-bold">
              <td colSpan={2} className="py-2">Omslutning:</td>
              <td className="text-right font-mono">
                {formatAmount(voucher?.totalDebit)}
              </td>
              <td className="text-right font-mono">
                {formatAmount(voucher?.totalCredit)}
              </td>
            </tr>
          </tfoot>
        </table>

        {/* Validation */}
        {voucher?.totalDebit !== voucher?.totalCredit && (
          <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-600 text-red-700">
            ⚠️ VARNING: Verifikationen är inte balanserad!
            Debet ({formatAmount(voucher?.totalDebit)}) ≠ 
            Kredit ({formatAmount(voucher?.totalCredit)})
          </div>
        )}

        {/* Footer metadata */}
        <div className="mt-6 text-sm text-gray-600">
          <p>Antal transaktioner: {voucher?.entries.length}</p>
        </div>
      </div>

      {/* GUL DRAGGABLE DIVIDER */}
      <div
        className="w-1 bg-yellow-400 cursor-col-resize hover:bg-yellow-500"
        onMouseDown={handleMouseDown}
      />

      {/* HÖGER: PDF/Bild-underlag */}
      <div style={{ width: `${100 - leftWidth}%` }} className="bg-gray-100 flex flex-col">
        {attachments.length > 0 ? (
          <>
            {/* Toolbar */}
            <div className="bg-white border-b px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">
                  KOPPLADE BILDER {currentAttachmentIndex + 1} ({attachments.length})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-1 hover:bg-gray-100 rounded">📷 OCR</button>
                <button className="p-1 hover:bg-gray-100 rounded">🔍 Zoom in</button>
                <button className="p-1 hover:bg-gray-100 rounded">🔍 Zoom out</button>
                <button className="p-1 hover:bg-gray-100 rounded">⬇️ Ladda ner</button>
                <button className="p-1 hover:bg-gray-100 rounded">📧 E-post</button>
                <button className="p-1 hover:bg-gray-100 rounded">📤 Ladda upp</button>
              </div>
            </div>

            {/* Image viewer */}
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
              <img
                src={attachments[currentAttachmentIndex].url}
                alt="Verifikatsunderlag"
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Navigation arrows */}
            {attachments.length > 1 && (
              <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 pointer-events-none">
                <button
                  onClick={() => setCurrentAttachmentIndex(i => Math.max(0, i - 1))}
                  disabled={currentAttachmentIndex === 0}
                  className="pointer-events-auto p-2 bg-white rounded-full shadow disabled:opacity-50"
                >
                  ←
                </button>
                <button
                  onClick={() => setCurrentAttachmentIndex(i => Math.min(attachments.length - 1, i + 1))}
                  disabled={currentAttachmentIndex === attachments.length - 1}
                  className="pointer-events-auto p-2 bg-white rounded-full shadow disabled:opacity-50"
                >
                  →
                </button>
              </div>
            )}

            {/* Footer buttons */}
            <div className="bg-white border-t px-4 py-3 flex gap-2 justify-end">
              <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
                Koppla bort
              </button>
              <button className="px-4 py-2 bg-brand-600 text-white rounded hover:bg-brand-700">
                Koppla fler
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <p className="text-lg mb-2">Ingen bilaga kopplad</p>
              <button className="px-4 py-2 bg-brand-600 text-white rounded hover:bg-brand-700">
                Koppla bilaga
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
```

### Drill-down navigation - Komplett flöde:

```
1. Balansrapport (PDF eller HTML)
   ├─ Klick på kontonummer (1930)
   ↓
2. Huvudbok för konto 1930 (PDF eller HTML)
   ├─ Visar alla transaktioner med löpande saldo
   ├─ Klick på verifikation (A 1)
   ↓
3a. Verifikation PDF (enkel vy)
    ├─ Konteringstabell
    ├─ "Visa verifikatsbild >>" länk
    ├─ Klick på länk → Öppnar underlag i nytt fönster
    ↓
3b. Verifikation Webb (split-screen) ← VÅR IMPLEMENTATION
    ├─ Konteringstabell (vänster 50%)
    ├─ PDF/Bild-underlag (höger 50%)
    ├─ Draggable divider (30-70% range)
    ├─ Toolbar med OCR, Zoom, Download, Email
    └─ Navigation om flera bilagor
```

---

**Uppdaterat:** 2025-11-05 med Verifikation drill-down och "Visa verifikatsbild" länk

## 24. KONTOPLAN - Struktur, aktiva/inaktiva och momskods-mapping

### Översikt
Fortnox har en detaljerad kontoplan med 1xxx = Tillgångar, 2xxx = Skulder, 3xxx = Eget kapital, 4xxx-8xxx = Intäkter/Kostnader. Kontoplanen nås via `Register -> Kontoplan` och kan visas filtrerat (`Alla`, `Aktiva`, `Inaktiva`). Varje konto kan ha en **momskod** (Fortnox-specifik), **SRU** och övriga metadata (automatkonto, ingående balans, budget).

### Aktiva vs Inaktiva konton
- Filtren "Aktiva" / "Inaktiva" används för att undvika att användare av misstag bokför på fel konto (ex. 2640 vs 2641). Om ett konto är inaktivt och en användare försöker använda det visas en prompt: "Vill du aktivera kontot?". Detta hindrar oavsiktlig variation mellan två konton som tjänar samma funktion och håller rapporterna rena.

Praktisk rekommendation för integration:
- Visa som default `Aktiva` i dropdowns
- När visa `Alla` i kontoplanen, visa en tydlig badge/kolumn för "Aktiv"/"Inaktiv"

### Momskoder - Fortnox granularity vs Skatteverket / Visma

**Viktigt:** Visma e-Ekonomi använder ENDAST Skatteverkets ruta-nummer (05, 10, 11, 12, etc.). Fortnox använder egna momskoder som är MER GRANULÄRA och sedan mappar till Skatteverkets rutor.

**Format i Fortnox dropdown:**
```
KOD (RUTANUMMER) - Beskrivning

Exempel:
MP1 (05) - Momspliktig försäljning 25%
U1 (10) - Utgående moms 25%
UOS1 (30) - Utgående moms omvänd skattskyldighet 25%
```

**KOMPLETT MAPPNING** (från Skatteverkets officiella källa + Fortnox UI):

#### Block A - Momspliktig försäljning (exkl moms)
```
Fält 05 - Momspliktig försäljning (Sverige):
  MP1 (05) - Momspliktig försäljning 25%
  MP2 (05) - Momspliktig försäljning 12%
  MP3 (05) - Momspliktig försäljning 6%

Fält 06 - Momspliktiga uttag:
  UT (06) - Momspliktig uttag

Fält 07 - Vinstmarginalbeskattning:
  BVMB (07) - Beskattningsunderlag vid vinstmarginalbeskattning

Fält 08 - Hyresinkomster (frivillig skattskyldighet):
  HFS (08) - Hyreslikoster vid frivillig skattskyldighet 25%
```

#### Block B - Utgående moms
```
Fält 10 - Utgående moms 25%:
  U1 (10) - Utgående moms 25%

Fält 11 - Utgående moms 12%:
  U2 (11) - Utgående moms 12%

Fält 12 - Utgående moms 6%:
  U3 (12) - Utgående moms 6%
```

#### Block C - Inköp vid omvänd betalningsskyldighet
```
Fält 20 - Inköp från annat EU-land:
  IVEU (20) - Inköp av varor från annat EG-land

Fält 21 - Inköp av tjänster från EU (huvudregeln):
  ITEU (21) - Inköp av tjänster från annat EG-land

Fält 22 - Inköp av tjänster från land utanför EU:
  ITGLOB (22) - Inköp av tjänster från land utanför EG

Fält 23 - Inköp av varor i Sverige (köparen betalningsskyldig):
  IV (23) - Inköp av varor med omvänd skattskyldighet

Fält 24 - Övriga inköp av tjänster i Sverige (köparen betalningsskyldig):
  IT (24) - Inköp av tjänster med omvänd skattskyldighet
```

#### Block D - Utgående moms på inköp (omvänd betalningsskyldighet)
```
Fält 30 - Utgående moms 25%:
  UOS1 (30) - Utgående moms omvänd skattskyldighet 25%
  UEU1 (30) - Utgående moms från annat EG-land 25%
  UTFU1 (30) - Utgående moms tjänsteförvarv utlandet 25%

Fält 31 - Utgående moms 12%:
  UOS2 (31) - Utgående moms omvänd skattskyldighet 12%
  UEU2 (31) - Utgående moms från annat EG-land 12%
  UTFU2 (31) - Utgående moms tjänsteförvarv utlandet 12%

Fält 32 - Utgående moms 6%:
  UOS3 (32) - Utgående moms omvänd skattskyldighet 6%
  UEU3 (32) - Utgående moms från annat EG-land 6%
  UTFU3 (32) - Utgående moms tjänsteförvarv utlandet 6%
```

#### Block E - Försäljning undantagen från moms
```
Fält 35 - Försäljning till annat EU-land:
  VTEU (35) - Försäljning av varor till annat EG-land

Fält 36 - Export (försäljning utanför EU):
  E (36) - Försäljning av varor utanför EG (export)

Fält 37 - Mellanmans inköp vid trepartshandel:
  3VEU (37) - Mellannmans inköp av varor vid trepartshandel

Fält 38 - Mellanmans försäljning vid trepartshandel:
  3FEU (38) - Mellannmans försäljning av varor vid trepartshandel

Fält 39 - Försäljning av tjänster till EU (huvudregeln):
  F1EU (39) - Försäljning av tjänster när köparen är skattskyldig i annat EG-land

Fält 40 - Övrig försäljning av tjänster utomlands:
  ÖTEU (40) - Övrig försäljning av tjänster omsatta utom landet

Fält 41 - Försäljning när köparen betalningsskyldig i Sverige:
  OTTU (41) - Försäljning när köparen är skattskyldig i Sverige

Fält 42 - Övrig försäljning (momsfri):
  MF (42) - Övrig försäljning utan moms
```

#### Block F - Ingående moms
```
Fält 48 - Ingående moms att dra av:
  I (48) - Ingående moms
```

#### Block G - Avräkning
```
Fält 49 - Moms att betala eller få tillbaka:
  R1 (49) - Moms att betala eller få tillbaka
  R2 (49) - Moms att betala eller få tillbaka
```

#### Block H/I - Import
```
Fält 50 - Beskattningsunderlag vid import:
  BI (30) - Beskattningsunderlag vid import

Fält 60 - Utgående moms 25% vid import:
  UI25 (60) - Utgående moms import av varor 25%

Fält 61 - Utgående moms 12% vid import:
  UI12 (61) - Utgående moms import av varor 12%

Fält 62 - Utgående moms 6% vid import:
  UI6 (62) - Utgående moms import av varor 6%
```

**Källa:** Skatteverket officiell guide (https://www.skatteverket.se/foretag/moms/deklareramoms/fyllaimomsdeklarationen.4.3a2a542410ab40a421c80004214.html)

**Implementationstips för backend:**
Se separat JSON-fil: `src/data/momskod_mapping.json` för komplett maskinläsbar mappning.

### Var i koden detta hör hemma
- Frontend: `src/pages/AccountingReviewPage.jsx` visar rapporter och genererar klickbara länkar till huvudbok/verifikation.
- Rapport-mock: `src/utils/reportGenerator.js` (se funktioner `generateBalanceSheetHTML`, `generateGeneralLedgerHTML`, `generateVoucherHTML`). Här är en lämplig plats att implementera ruta-aggregation i mock/backend.
- Backend: `tic-tac-toe-server/main.py` har API-endpoints för rapporter; faktiska implementationsfiler för produktion bör innehålla `reports/balance_sheet.py` och `reports/general_ledger.py` (se projektets `PROJECT/FUNCTION_MAPPING_MATRIX.md`).

### Kort slutsats
Fortnox granularitet är en fördel när ni vill bygga felkontroller och fina aggregat i rapporter. För export till Skatteverket eller för kompatibilitet med system som förlitar sig på en ruta-kod (Visma, redovisningstjänster) bör backend ha en deterministisk mappning från Fortnox-kod till Skatteverket-ruta.

---

