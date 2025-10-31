# LEGAL_TEXTS_STRUCTURE.md

**Typ:** Konstruktionsdokument  
**Syfte:** Dokumentera strukturen för centraliserad lagtext-databas (`legalTexts.js`)  
**Skapad:** 2025-10-31  
**Senast uppdaterad:** 2025-10-31

---

## 📋 Översikt

Detta dokument beskriver hur lagtexterna är strukturerade och organiserade i `/src/data/legalTexts.js` för att undvika hårdkodning och "avrundningsfel" (verbatim errors) i React-komponenter.

---

## 🏗️ Filstruktur

### **Huvudfil:** `/src/data/legalTexts.js`

**Tre huvuddelar:**

1. **`legalTexts` objekt** - Centraliserad databas med alla lagtexter
2. **Steg-mappningar** - Mappning av frågor till relevanta lagtexter (per steg)
3. **Helper function** - `getLegalTextsForQuestion(step, questionKey)`

---

## 📦 1. legalTexts Object

Centraliserad databas med ALLA lagtexter som används i applikationen.

### **Struktur:**

```javascript
export const legalTexts = {
  // Unik nyckel (ID för mappning)
  ptl_2_1: {
    id: "PTL_2_1",                    // Referens-ID för PDF Appendix
    title: "Allmän riskbedömning",     // Kort titel
    law: "2 kap. 1 § PTL",             // Lagnamn och paragraf
    shortText: "Kort sammanfattning...", // För inline-visning
    fullText: "Fullständig lagtext...",  // För Appendix i PDF
    url: "https://..."                   // Länk till källa (optional)
  },
  
  ptl_2_3: {
    id: "PTL_2_3",
    title: "Riskbedömning av kunder",
    law: "2 kap. 3 § PTL",
    shortText: "...",
    fullText: "...",
    url: "..."
  }
  // ... fler lagtexter
}
```

### **Namnkonvention för nycklar:**

| Mönster | Exempel | Betydelse |
|---------|---------|-----------|
| `ptl_X_Y` | `ptl_2_1` | Penningtvättslagen kap X § Y |
| `ptl_X_Y_Z` | `ptl_3_7_8` | PTL kap X § Y-Z (flera paragrafer) |
| `ptl_X_Y_special` | `ptl_3_6_vhm` | PTL kap X § Y + specifikation (t.ex. "verkliga huvudmän") |
| `lansstyrelsen_X_Y` | `lansstyrelsen_3_8` | 01FS 2024:20 kap X § Y |

---

## 🔗 2. Steg-mappningar

Mappar varje fråga i onboarding-flödet till relevanta lagtexter.

### **Struktur:**

```javascript
export const riskFragorSteg2 = {
  // Fråge-nyckel (används i React)
  blockA_question1: {
    title: "Utländska kunder",           // Frågans titel
    legalTexts: [                        // Array av lagtext-IDs
      'ptl_2_1',                         // Referens till legalTexts objekt
      'ptl_3_11', 
      'ptl_3_12', 
      'ptl_3_17'
    ]
  },
  
  blockA_question2: {
    title: "Omsättningsandel utland",
    legalTexts: ['ptl_2_3', 'ptl_3_12', 'ptl_3_16']
  }
  // ... fler frågor
}
```

### **Befintliga steg-mappningar:**

- `riskFragorSteg2` - Steg 2: Geografisk risk & Affärsrelationer (6 frågor)
- `riskFragorSteg3` - Steg 3: Betalningsmetoder (5 frågor)
- `riskFragorSteg4` - Steg 4: EDD-frågor (6 frågor)

### **Namnkonvention för fråge-nycklar:**

| Mönster | Exempel | Beskrivning |
|---------|---------|-------------|
| `blockX_questionY` | `blockA_question1` | Steg 2: BLOCK A-C struktur |
| `questionX` | `question1` | Steg 3-4: Enkel numrering |

---

## 🛠️ 3. Helper Function

### **`getLegalTextsForQuestion(step, questionKey)`**

**Syfte:** Hämta alla lagtexter för en specifik fråga

**Parametrar:**
- `step` (string): `'steg2'`, `'steg3'`, eller `'steg4'`
- `questionKey` (string): Fråge-nyckel (t.ex. `'blockA_question1'`)

**Returnerar:** Array av lagtext-objekt från `legalTexts`

**Exempel:**

```javascript
// I React-komponent:
import { getLegalTextsForQuestion } from '../../data/legalTexts';

const texts = getLegalTextsForQuestion('steg2', 'blockA_question1');
// Returnerar: [
//   { id: "PTL_2_1", law: "2 kap. 1 § PTL", fullText: "...", ... },
//   { id: "PTL_3_11", law: "3 kap. 11 § PTL", fullText: "...", ... },
//   { id: "PTL_3_12", law: "3 kap. 12 § PTL", fullText: "...", ... },
//   { id: "PTL_3_17", law: "3 kap. 17 § PTL", fullText: "...", ... }
// ]

// Visa i UI:
texts.map((legal, idx) => (
  <div key={idx}>
    <p className="font-semibold">{legal.law}</p>
    <p>{legal.fullText}</p>
  </div>
))
```

---

## 📝 Användning i React-komponenter

### **Pattern 1: Info-knapp med expanderbar lagtext**

```jsx
import { useState } from 'react';
import { Info } from 'lucide-react';
import { getLegalTextsForQuestion } from '../../data/legalTexts';

function RiskFragorSteg2Slide() {
  const [expandedInfo, setExpandedInfo] = useState({});
  
  const toggleInfo = (key) => {
    setExpandedInfo(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg relative">
      {/* Info-knapp - övre höger */}
      <button
        onClick={() => toggleInfo('blockA_question1')}
        className="absolute top-4 right-4 text-brand-600"
      >
        <Info className="w-5 h-5" />
      </button>

      <label className="block text-sm font-medium mb-2 pr-8">
        1. Har företaget utländska kunder? *
      </label>
      
      {/* Formulärfält här... */}
      
      {/* Expandable info */}
      {expandedInfo.blockA_question1 && (
        <div className="mt-4 p-3 bg-white border border-brand-300 rounded-lg">
          <p className="text-xs text-brand-700 mb-2">
            För att bedöma geografisk risk enligt PTL 2 kap...
          </p>
          {getLegalTextsForQuestion('steg2', 'blockA_question1').map((legal, idx) => (
            <div key={idx} className="mt-2 text-xs">
              <p className="font-semibold text-brand-800">{legal.law}</p>
              <p className="text-brand-600 mt-1">{legal.fullText}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### **Pattern 2: Varning med lagtext-referens**

```jsx
import { legalTexts } from '../../data/legalTexts';

function WarningBox() {
  return (
    <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
      <p className="text-sm text-yellow-800 font-medium mb-2">
        ⚠️ {legalTexts.kontanttransaktioner.law}
      </p>
      <p className="text-xs text-yellow-700 mb-2">
        {legalTexts.kontanttransaktioner.shortText}
      </p>
      <p className="text-xs text-yellow-600 italic">
        Referens: [{legalTexts.kontanttransaktioner.id}] - Se Appendix för fullständig lagtext
      </p>
    </div>
  );
}
```

---

## ➕ Lägga till nya lagtexter

### **Steg 1: Lägg till i `legalTexts` objekt**

```javascript
export const legalTexts = {
  // ... befintliga lagtexter
  
  ptl_5_2: {                              // Ny nyckel
    id: "PTL_5_2",
    title: "Anmälningsskyldighet",
    law: "5 kap. 2 § PTL",
    shortText: "Kort sammanfattning här...",
    fullText: `Fullständig lagtext här...
    
    Lag (2017:630) om åtgärder mot penningtvätt...`,
    url: "https://www.riksdagen.se/sv/dokument-lagar/dokument/svensk-forfattningssamling/..."
  }
}
```

### **Steg 2: Lägg till i relevant steg-mappning**

```javascript
export const riskFragorSteg3 = {
  // ... befintliga frågor
  
  question6: {                            // Ny fråga
    title: "Misstänkta transaktioner",
    legalTexts: ['ptl_5_1', 'ptl_5_2']    // Inkludera ny lagtext
  }
}
```

### **Steg 3: Använd i React-komponent**

```jsx
{getLegalTextsForQuestion('steg3', 'question6').map((legal, idx) => (
  <div key={idx}>
    <p>{legal.law}</p>
    <p>{legal.fullText}</p>
  </div>
))}
```

---

## 🎯 Fördelar med denna struktur

1. **Centraliserad sanning** - Alla lagtexter på ETT ställe
2. **Undvik avrundningsfel** - Ingen hårdkodad text i komponenter
3. **Enkel uppdatering** - Ändra lagtext på ett ställe → propagerar överallt
4. **PDF-generering** - `id` och `fullText` används för Appendix
5. **Skalbar** - Lätt att lägga till nya frågor och lagtexter
6. **Type-safe** - Tydlig struktur med hjälpfunktioner

---

## 📚 Relaterade filer

### **Kärnfiler:**
- `/src/data/legalTexts.js` - Lagtext-databas
- `/src/components/Slides/RiskFragorSteg2Slide.jsx` - Exempel på användning
- `/src/components/Slides/RiskFragorSteg3Slide.jsx` - Exempel på användning
- `/src/components/Slides/RiskFragorSteg4Slide.jsx` - Exempel på användning

### **Dokumentation:**
- `/docs/specifications/Onboarding_app_ny.tex` - UI-specifikation (användarfokus)
- `/docs/specifications/LEGAL_TEXT_CORRECTIONS.md` - Historik av lagtextfel och korrigeringar
- `/docs/specifications/LEGAL_TEXTS_STRUCTURE.md` - Detta dokument (konstruktionsfokus)

### **Källor:**
- Länsstyrelsen Stockholm: 01FS 2024:20 - https://www.lansstyrelsen.se/stockholm/...
- Penningtvättslagen (2017:630) - https://www.riksdagen.se/sv/dokument-lagar/...

---

## 🔍 Exempel: Komplett mappning för Steg 2, Fråga 1

```javascript
// 1. Definiera lagtexterna
export const legalTexts = {
  ptl_2_1: {
    id: "PTL_2_1",
    title: "Allmän riskbedömning",
    law: "2 kap. 1 § PTL",
    shortText: "Verksamhetsutövare ska göra en allmän riskbedömning...",
    fullText: "2 kap. 1 § En verksamhetsutövare ska göra och dokumentera en..."
  },
  ptl_3_11: {
    id: "PTL_3_11",
    title: "Kontroll av högriskländer",
    law: "3 kap. 11 § PTL",
    shortText: "Särskilda åtgärder krävs vid affärer med högriskländer...",
    fullText: "3 kap. 11 § När kunden eller den verkliga huvudmannen..."
  }
  // ... fler lagtexter
}

// 2. Mappa fråga till lagtexter
export const riskFragorSteg2 = {
  blockA_question1: {
    title: "Utländska kunder",
    legalTexts: ['ptl_2_1', 'ptl_3_11', 'ptl_3_12', 'ptl_3_17']
  }
}

// 3. Hämta i React
const texts = getLegalTextsForQuestion('steg2', 'blockA_question1');
// Returnerar: Array med 4 lagtext-objekt (ptl_2_1, ptl_3_11, ptl_3_12, ptl_3_17)
```

---

## ⚠️ Viktiga konventioner

### **DO:**
✅ Använd `getLegalTextsForQuestion()` för att hämta lagtexter  
✅ Lägg till nya lagtexter i `legalTexts` objekt först  
✅ Använd konsekventa nyckelnamn (`ptl_X_Y`, `lansstyrelsen_X_Y`)  
✅ Inkludera både `shortText` (UI) och `fullText` (PDF Appendix)  
✅ Dokumentera ändringar i `LEGAL_TEXT_CORRECTIONS.md`

### **DON'T:**
❌ Hårdkoda lagtexter direkt i React-komponenter  
❌ Duplicera lagtexter mellan komponenter  
❌ Ändra lagtext utan att uppdatera `LEGAL_TEXT_CORRECTIONS.md`  
❌ Glöm att lägga till `id` för PDF-generering  
❌ Blanda strukturella element (border, headers) med semantiska färger (yellow warnings)

---

**Senast uppdaterad:** 2025-10-31  
**Författare:** GitHub-Claude + Lasse Karagiannis
