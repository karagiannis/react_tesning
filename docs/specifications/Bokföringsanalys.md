# Bokföringsanalys - Multi-stage Wizard

## Översikt
Bokföringsanalysen är en 5-stegs wizard som validerar och jämför bokföring från SIE-filer mot företagets inlämnade rapporter till Skatteverket och Bolagsverket.

---

## Steg 1: Automatisk Flaggning (Forensisk Analys)

**Syfte:** Identifiera och flagga problematiska bokföringsposter från alla räkenskapsår.

### Innehåll
- **Statistik-panel:**
  - Antal granskade verifikationer (t.ex. "1 247 verifikationer granskade")
  - Antal flaggade problem (t.ex. "3 problem identifierade")
  - Räkenskapsår som omfattas (t.ex. "2022-2023, 2023-2024, 2024-2025")

- **Flaggade poster (tabell):**

| Vernr | Datum | Räkenskapsår | Problemtyp | Beskrivning | Åtgärd |
|-------|-------|--------------|------------|-------------|--------|
| A308 | 2025-03-15 | 2024-2025 | Privata inköp | 2 motorcykeldäck (10 090 SEK) i aggregerad post | [Visa post] |
| B156 | 2024-11-20 | 2024-2025 | Aggregering | 23 affärshändelser i samma verifikation | [Visa post] |
| C87 | 2023-05-12 | 2023-2024 | Motkonto saknas | Direktbokning mot resultatkonto utan moms | [Visa post] |

### Interaktion
- **Klick på [Visa post]:** Öppnar verifikationsvy med underlagspanel (se nedan)

### Verifikationsvy med Underlagspanel

```
┌────────────────────────────────────────────────────────────────────┐
│ Verifikation A308 • 2025-03-15 • Varor och material Q1            │
│ ⚠️ FLAGGAT: Privata inköp detekterade (2 motorcykeldäck)          │
├─────────────────────────────────┬──────────────────────────────────┤
│ Konto │ Benämning      │ Debet  │ Kredit │ 📎 │ Underlag (49 dok) │
│ 5410  │ Varor o mat    │ 47 823 │        │ [+]│                   │
│ 2640  │ Ingående moms  │ 11 957 │        │    │  ┌─────────────┐  │
│ 1930  │ Företagskonto  │        │ 59 780 │    │  │ 📄 PDF      │  │
│                                  │        │    │  │ Preview     │  │
│                                  │        │    │  │             │  │
│ [Dela upp automatiskt]           │        │    │  │ michelin.pdf│  │
│                                  │        │    │  └─────────────┘  │
│                                  │        │    │                   │
│                                  │        │    │  🚨 FLAGGAD:     │
│                                  │        │    │  Motorcykeldäck  │
│                                  │        │    │  5 200 SEK       │
│                                  │        │    │                   │
│                                  │        │    │  [📁 Välj fil]   │
│                                  │        │    │  [Dra & släpp]   │
│                                  │        │    │  [✓ Koppla]      │
└─────────────────────────────────┴──────────────────────────────────┘
```

**Beteende:**
- Klick på 📎-ikonen → Högermenyn expanderar från höger
- Bokföringskolumner förskjuts åt vänster för att ge plats
- PDF/bilder visas direkt i panelen (preview)
- Drag & drop-yta för att ladda upp nya underlag
- [✓ Koppla]-knapp för att associera underlag med verifikationen
- Vyn **persistent**: Stänger man inte panelen med nytt klick på 📎, så ligger den kvar när man navigerar tillbaka

---

## Steg 2: Rapportarkiv per Räkenskapsår

**Syfte:** Ge tillgång till standardrapporter (Balans, Resultat, Huvudbok, Verifikationslista) för varje räkenskapsår.

### Layout (2 räkenskapsår)

```
┌─────────────────────────────────────────────┐
│ Rapportarkiv                                │
├─────────────────────────────────────────────┤
│                                             │
│ 📁 Räkenskapsår 2024-2025                   │
│    📄 Balansrapport                         │
│    📊 Resultatrapport                       │
│    📖 Huvudbok                              │
│    📋 Verifikationslista                    │
│                                             │
│ 📁 Räkenskapsår 2023-2024                   │
│    📄 Balansrapport                         │
│    📊 Resultatrapport                       │
│    📖 Huvudbok                              │
│    📋 Verifikationslista                    │
└─────────────────────────────────────────────┘
```

### Layout (3+ räkenskapsår, expanderbar trädstruktur)

```
┌─────────────────────────────────────────────┐
│ Rapportarkiv                                │
├─────────────────────────────────────────────┤
│                                             │
│ ▼ 📁 Räkenskapsår 2024-2025                 │
│      📄 Balansrapport                       │
│      📊 Resultatrapport                     │
│      📖 Huvudbok                            │
│      📋 Verifikationslista                  │
│                                             │
│ ▶ 📁 Räkenskapsår 2023-2024                 │
│                                             │
│ ▶ 📁 Räkenskapsår 2022-2023                 │
└─────────────────────────────────────────────┘
```

### Interaktion
- **Klick på rapport:** Öppnas i **fristående webbfönster** (PDF-format)
- **Expandering:** Klick på mapp-rad expanderar/kollapserar submeny
- **Endast PDF:** "Visa på skärm" (HTML) lämnas till framtida bokföringsapp

---

## Steg 3: Momsrapporter - Jämförelse

**Syfte:** Jämföra våra framräknade momsrapporter (från SIE) med företagets inlämnade rapporter (från Skatteverket API).

### Layout

```
┌───────────────────────────────────────────────────────────────────┐
│ Momsrapporter - Avstämning                                        │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│ 📊 Sammanfattning Avvikelser:                                     │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ Räkenskapsår 2024-2025: 3 avvikelser (totalt 4 500 SEK)     │ │
│ │ • Januari: -1 200 SEK                                        │ │
│ │ • Mars: +2 800 SEK                                           │ │
│ │ • Juni: +2 900 SEK                                           │ │
│ │                                                              │ │
│ │ Räkenskapsår 2023-2024: Inga avvikelser ✓                   │ │
│ └──────────────────────────────────────────────────────────────┘ │
│                                                                   │
│ ▼ 📁 Våra framräknade                                             │
│    ▼ 📁 2024-2025                                                 │
│       📄 Momsrapport januari 2025     [Öppna]                     │
│       📄 Momsrapport februari 2025    [Öppna]                     │
│       📄 Momsrapport mars 2025        [Öppna]                     │
│       ...                                                         │
│    ▶ 📁 2023-2024                                                 │
│                                                                   │
│ ▼ 📁 Företagets inlämnade                                         │
│    ▼ 📁 2024-2025                                                 │
│       📄 Momsrapport januari 2025     [Öppna]                     │
│       📄 Momsrapport februari 2025    [Öppna]                     │
│       📄 Momsrapport mars 2025        [Öppna]                     │
│       ...                                                         │
│    ▶ 📁 2023-2024                                                 │
└───────────────────────────────────────────────────────────────────┘
```

### Interaktion
- **[Öppna]-knapp:** Öppnar momsrapporten i **fristående webbfönster** (PDF)
- **Användningsfall:** Öppna både "Vår framräknade januari" och "Deras januari" samtidigt i två fönster för side-by-side jämförelse
- **Avvikelser:** Highlightade i sammanfattningen om differens >1000 SEK eller >2%

---

## Steg 4: Inkomstdeklarationer - Jämförelse

**Syfte:** Jämföra våra framräknade inkomstdeklarationer (från SIE + SRU-mappning) med företagets inlämnade INK2 (från Skatteverket API).

### Layout

```
┌───────────────────────────────────────────────────────────────────┐
│ Inkomstdeklarationer - Avstämning                                 │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│ 📋 Sammanfattning Avvikelser:                                     │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ 2024: Resultat före skatt differens -17 000 SEK ❌           │ │
│ │   • SRU 2110 (Huvudintäkt): 0 SEK                           │ │
│ │   • SRU 3110 (Avskrivningar): +12 000 SEK                   │ │
│ │   • SRU 7518 (Skattepliktigt resultat): -17 000 SEK         │ │
│ │                                                              │ │
│ │ 2023: Fullständig överensstämmelse ✓                        │ │
│ └──────────────────────────────────────────────────────────────┘ │
│                                                                   │
│ ▼ 📁 Våra framräknade                                             │
│    📄 Inkomstdeklaration 2024 (INK2)    [Öppna]                   │
│    📄 Inkomstdeklaration 2023 (INK2)    [Öppna]                   │
│    📄 Inkomstdeklaration 2022 (INK2)    [Öppna]                   │
│                                                                   │
│ ▼ 📁 Företagets inlämnade                                         │
│    📄 Inkomstdeklaration 2024           [Öppna]                   │
│    📄 Inkomstdeklaration 2023           [Öppna]                   │
│    📄 Inkomstdeklaration 2022           [Öppna]                   │
└───────────────────────────────────────────────────────────────────┘
```

### Interaktion
- **[Öppna]-knapp:** Öppnar deklarationen i **fristående webbfönster** (PDF)
- **SRU-mappning:** Våra framräknade baseras på BAS-konton → SRU-koder (automatisk)
- **Användningsfall:** Öppna både "Vår 2024" och "Deras 2024" i två fönster för side-by-side jämförelse

---

## Steg 5: Årsredovisningar/Årsbokslut - Jämförelse

**Syfte:** Jämföra våra framräknade balans-/resultatrapporter med företagets officiella årsredovisning från Bolagsverket.

### Layout

```
┌───────────────────────────────────────────────────────────────────┐
│ Årsredovisningar - Avstämning                                     │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│ 📊 Sammanfattning Avvikelser:                                     │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ 2024: Balansomslutning stämmer ✓                            │ │
│ │       Årets resultat: -3 500 SEK differens ⚠️                │ │
│ │                                                              │ │
│ │ 2023: Fullständig överensstämmelse ✓                        │ │
│ └──────────────────────────────────────────────────────────────┘ │
│                                                                   │
│ ▼ 📁 Våra framräknade (från SIE)                                  │
│    📄 Balans + Resultat 2024           [Öppna]                    │
│    📄 Balans + Resultat 2023           [Öppna]                    │
│    📄 Balans + Resultat 2022           [Öppna]                    │
│                                                                   │
│ ▼ 📁 Företagets årsredovisningar                                  │
│    📄 Årsredovisning 2024 (Bolagsverket)  [Öppna]                 │
│    📄 Årsredovisning 2023 (Bolagsverket)  [Öppna]                 │
│    📄 Årsredovisning 2022 (Bolagsverket)  [Öppna]                 │
└───────────────────────────────────────────────────────────────────┘
```

### Interaktion
- **[Öppna] (Våra framräknade):** Öppnar PDF med aggregerade kontogrupper enligt SRU-standard
- **[Öppna] (Deras årsredovisning):** Öppnar **hela årsredovisningen** från Bolagsverket (inkl. noter, underskrifter)
- **Aggregering:** Våra rapporter visar inga kontonummer, bara aggregerade SRU-grupper (t.ex. "Varulager" = BAS 1400-1499)

---

## Teknisk Implementation

### Filstruktur
```
src/
├── pages/
│   ├── AccountingAnalysisWizard.jsx     # Huvudwizard (5 steg)
│   ├── Step1_FraudDetection.jsx          # Forensisk analys
│   ├── Step2_ReportArchive.jsx           # Rapportarkiv
│   ├── Step3_VATComparison.jsx           # Momsavstämning
│   ├── Step4_TaxComparison.jsx           # Deklarationsavstämning
│   ├── Step5_AnnualReportComparison.jsx  # Årsredovisning
│   └── VoucherDetailView.jsx             # Verifikation med underlagspanel
├── utils/
│   ├── sruMapper.js                      # BAS → SRU mappning
│   ├── vatCalculator.js                  # Beräkna moms från SIE
│   ├── taxCalculator.js                  # Generera INK2 från SIE
│   └── windowManager.js                  # window.open() för fristående fönster
└── data/
    ├── mockVoucherAttachments.js         # Mock underlag (PDFs, bilder)
    ├── mockVATReports.js                 # Mock momsrapporter
    ├── mockTaxReturns.js                 # Mock deklarationer
    └── mockAnnualReports.js              # Mock årsredovisningar
```

### Fristående Webbfönster
```javascript
// windowManager.js
export function openReportWindow(url, title) {
  const width = 900;
  const height = 1200;
  const left = (screen.width - width) / 2;
  const top = (screen.height - height) / 2;
  
  window.open(
    url,
    title,
    `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
  );
}
```

### Underlagspanel Beteende
```javascript
// VoucherDetailView.jsx
const [attachmentPanelOpen, setAttachmentPanelOpen] = useState(false);
const [persistAttachmentPanel, setPersistAttachmentPanel] = useState(false);

// När användaren klickar 📎
const toggleAttachmentPanel = () => {
  setAttachmentPanelOpen(!attachmentPanelOpen);
  setPersistAttachmentPanel(true); // Panelen förblir öppen vid navigation
};

// Återställ endast om användaren explicit stänger
const closeAttachmentPanel = () => {
  setAttachmentPanelOpen(false);
  setPersistAttachmentPanel(false);
};
```

---

## Mock Data-struktur

### Bokföringsunderlag (Steg 1)
```javascript
export const mockVoucherA308Attachments = [
  {
    id: 1,
    filename: 'faktura_motorcykeldack_michelin.pdf',
    type: 'application/pdf',
    size: 234000,
    uploadDate: '2025-03-02',
    ocrAmount: 5200,
    ocrSupplier: 'MC-Däck Sverige AB',
    matchConfidence: 0.95,
    flagged: true,
    flagReason: 'Privat inköp misstänks (motorcykeldäck)',
    previewUrl: '/mock-attachments/michelin.pdf',
    thumbnailUrl: '/mock-attachments/thumbs/michelin.jpg'
  },
  // ... + 48 more attachments
];
```

### Momsrapporter (Steg 3)
```javascript
export const mockVATReports = {
  calculated: {
    '2024-2025': [
      {
        period: '2025-01',
        outputVAT: 45600,
        inputVAT: 12300,
        netVAT: 33300,
        pdfUrl: '/mock-vat/calculated/2025-01.pdf'
      },
      // ... fler månader
    ]
  },
  submitted: {
    '2024-2025': [
      {
        period: '2025-01',
        outputVAT: 46800, // Avvikelse!
        inputVAT: 12300,
        netVAT: 34500,
        pdfUrl: '/mock-vat/submitted/2025-01.pdf'
      }
    ]
  }
};
```

### Inkomstdeklarationer (Steg 4)
```javascript
export const mockTaxReturns = {
  calculated: [
    {
      year: 2024,
      sruValues: {
        2110: 2450000, // Huvudintäkt
        3110: 125000,  // Avskrivningar
        7518: -108000  // Skattepliktigt resultat
      },
      pdfUrl: '/mock-tax/calculated/ink2_2024.pdf'
    }
  ],
  submitted: [
    {
      year: 2024,
      sruValues: {
        2110: 2450000,
        3110: 137000, // Avvikelse: 12 000 SEK mer
        7518: -125000 // Avvikelse: -17 000 SEK
      },
      pdfUrl: '/mock-tax/submitted/ink2_2024.pdf'
    }
  ]
};
```

---

## Navigation och Flöde

### Wizard Stepper (högst upp på varje steg)
```
[1. Flaggning] → [2. Rapporter] → [3. Moms] → [4. Deklaration] → [5. Årsredovisning]
   ✓ Klar        ← Här nu        Ej besökt    Ej besökt         Ej besökt
```

### Återgång från Contentslide
- Contentslide **Bokföringsanalys** → Startar wizard på Steg 1
- Wizard sparar progress i `localStorage` (besökta steg, expanderade mappar)
- "Tillbaka till Dashboard"-knapp längst ner i varje steg

---

## Prioriterad Utvecklingsordning

1. **Steg 1:** Forensisk analys med flaggningstabell ✅ (redan delvis implementerat)
2. **Underlagspanel:** Expanderbar högervy med PDF/bild-preview
3. **Steg 2:** Rapportarkiv med expanderbar trädstruktur
4. **Fristående fönster:** `window.open()` för PDF-rapporter
5. **Steg 3:** Momsavstämning med avvikelsetabell
6. **Steg 4:** Deklarationsjämförelse med SRU-diff
7. **Steg 5:** Årsredovisningsjämförelse med Bolagsverket-PDFs

---

## Referens till LaTeX-dokumentation
Denna specifikation refereras från:
```latex
% I Onboarding_app_ny.tex
\section{Bokföringsanalys}
\begin{frame}
  \frametitle{Bokföringsanalys — Multi-stage Wizard}
  Fullständig specifikation finns i:
  \texttt{docs/specifications/Bokföringsanalys.md}
\end{frame}
```

---

**Datum:** 2025-11-03  
**Version:** 1.0  
**Status:** Specifikation godkänd för implementation
