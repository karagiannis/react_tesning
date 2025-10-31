# Guide: PDF-generering med Lagtexter

**Skapad:** 2025-01-29
**Syfte:** Dokumentera hur PDF-rapporter genereras med lagtexter i Appendix

---

## 📋 Översikt

När en presumtiv klient går igenom onboarding-processen ska både **byråchefen** (användaren) och **klienten** få en PDF-rapport med:

1. **Huvuddel:** Alla frågor och svar från onboarding-processen
2. **Appendix:** Fullständig samling av alla lagtexter som åberopats

Detta ger:
- ✅ Kvitto för klienten på vad de gått igenom
- ✅ Intern dokumentation för byråchefen
- ✅ Tillsynsdokumentation för Länsstyrelsen
- ✅ Juridisk transparens (alla lagrum finns samlade)

---

## 🗂️ Struktur

### Huvuddel (Frågor & Svar)

I huvuddelen visas frågor med **kortfattade lagtexter** och en **referens till Appendix**:

```
Fråga: Förekommer kontanttransaktioner?
Svar: Ja, cirka 15% av omsättningen

Lagstöd: Penningtvättslagen (2017:630) 3 kap. 6 § - Kontanter (≥5000 euro per transaktion)
kräver kundkännedom. [PTL_3_6] - Se Appendix för fullständig lagtext
```

### Appendix (Fullständiga Lagtexter)

I Appendix listas **alla lagtexter** som refereras i dokumentet, sorterade efter ID:

```
APPENDIX - Lagtexter och Rättsgrunder

[PTL_3_4] Kontroll av kundens identitet
Lag: 01FS 2024:20, 3 kap. 4 § och Penningtvättslagen (2017:630)

Identitetskontrollen ska göras genom att:
1. Identitetshandlingen granskas avseende giltighet...
[fullständig lagtext här]

---

[PTL_3_6] Kundkännedom vid kontanttransaktioner
Lag: Penningtvättslagen (2017:630) 3 kap. 6 §

Kundkännedom ska inhämtas:
1. När det under en affärsförbindelses gång...
[fullständig lagtext här]

---

[Fortsätter med alla lagtexter...]
```

---

## 💻 Implementation

### 1. Använd `legalTexts.js`

Alla lagtexter finns centraliserat i:
```
/src/data/legalTexts.js
```

Varje lagtext har:
```javascript
{
  id: "PTL_3_6",              // Unik ID för referens
  title: "Titel",             // Kort titel
  law: "Lagnamn § kap",       // Lagnamn och paragraf
  shortText: "Kort text...",  // För inline i formulär
  fullText: "Full text...",   // För Appendix i PDF
  url: "https://..."          // Källa (om tillgänglig)
}
```

### 2. I React-komponenter

**Import:**
```javascript
import { legalTexts } from '../../data/legalTexts';
```

**Visa inline med referens:**
```jsx
<p className="text-sm text-gray-700">
  {legalTexts.kontanttransaktioner.shortText}
</p>
<p className="text-xs text-gray-600 italic">
  Referens: [{legalTexts.kontanttransaktioner.id}] - Se Appendix för fullständig lagtext
</p>
```

### 3. Generera PDF

**Samla användarsvar:**
```javascript
const onboardingData = {
  frågor: [
    {
      id: 1,
      fråga: "Förekommer kontanttransaktioner?",
      svar: "Ja, cirka 15%",
      lagRef: "PTL_3_6"  // Referens till legalTexts
    },
    // ... fler frågor
  ]
};
```

**Generera Appendix:**
```javascript
import { generateLegalAppendix, getLegalText } from '../data/legalTexts';

// Hämta alla använda lagtexter
const usedLegalRefs = new Set(
  onboardingData.frågor
    .map(q => q.lagRef)
    .filter(ref => ref)
);

// Generera Appendix
const appendix = Array.from(usedLegalRefs)
  .map(id => {
    const text = Object.values(legalTexts).find(t => t.id === id);
    return {
      id: text.id,
      title: text.title,
      law: text.law,
      fullText: text.fullText,
      url: text.url
    };
  })
  .sort((a, b) => a.id.localeCompare(b.id));
```

**Rendera PDF med React-PDF eller liknande:**
```javascript
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const PDFDocument = ({ data, appendix }) => (
  <Document>
    {/* Huvuddel - Frågor & Svar */}
    <Page style={styles.page}>
      <Text style={styles.title}>Onboarding-rapport</Text>

      {data.frågor.map(q => (
        <View key={q.id} style={styles.question}>
          <Text style={styles.questionText}>{q.fråga}</Text>
          <Text style={styles.answer}>Svar: {q.svar}</Text>

          {q.lagRef && (
            <Text style={styles.legalRef}>
              Lagstöd: [{q.lagRef}] - Se Appendix för fullständig lagtext
            </Text>
          )}
        </View>
      ))}
    </Page>

    {/* Appendix - Lagtexter */}
    <Page style={styles.page}>
      <Text style={styles.title}>APPENDIX - Lagtexter och Rättsgrunder</Text>

      {appendix.map(legal => (
        <View key={legal.id} style={styles.legalBlock}>
          <Text style={styles.legalId}>[{legal.id}] {legal.title}</Text>
          <Text style={styles.legalLaw}>{legal.law}</Text>
          <Text style={styles.legalFullText}>{legal.fullText}</Text>

          {legal.url && (
            <Text style={styles.legalUrl}>Källa: {legal.url}</Text>
          )}
        </View>
      ))}
    </Page>
  </Document>
);
```

---

## 📄 Exempel: Komplett PDF-struktur

### Sida 1-5: Huvuddel

```
ONBOARDING-RAPPORT
Företag: Example AB (556677-8899)
Datum: 2025-01-29

═══════════════════════════════════════

RISKFRÅGOR - STEG 4: BETALNINGSMETODER

1. Vilka betalningsmetoder används?
   ☑ Banköverföring
   ☑ Kortbetalning
   ☑ Faktura
   ☑ Kontanter (15% av omsättningen)
   ☐ Kryptovaluta

   Lagstöd: Penningtvättslagen (2017:630) 3 kap. 6 § - Kontanter (≥5000 euro
   per transaktion) kräver kundkännedom. [PTL_3_6] - Se Appendix

2. Förekommer transaktioner över 150 000 kr?
   Svar: Ja, ibland (5-10 per år)

   Lagstöd: 01FS 2024:20, 2 kap. 4 § - Stora transaktioner kräver fördjupad
   dokumentation. [01FS_2_4] - Se Appendix

═══════════════════════════════════════

[... fortsätter med alla frågor ...]
```

### Sida 10: Appendix

```
═══════════════════════════════════════
APPENDIX - LAGTEXTER OCH RÄTTSGRUNDER
═══════════════════════════════════════

[01FS_2_4] Riskbedömning av kunder
Lag: 01FS 2024:20, 2 kap. 4 §

Verksamhetsutövaren ska för varje kund bedöma risk för penningtvätt
och finansiering av terrorism baserat på:

1. Kundens verksamhet och bransch
   - Kontantintensiva branscher (högre risk)
   - Kryptovaluta och värdeöverföring (högre risk)
   - Reglerade verksamheter (lägre risk)

[... fullständig lagtext ...]

Källa: https://www.lansstyrelsen.se/stockholm/...

───────────────────────────────────────

[PTL_3_6] Kundkännedom vid kontanttransaktioner
Lag: Penningtvättslagen (2017:630) 3 kap. 6 §

Kundkännedom ska inhämtas:

1. När det under en affärsförbindelses gång står klart att utbetalt
   eller mottaget belopp i kontanter inom ramen för en affärsförbindelse
   uppgår till minst 5000 euro

[... fullständig lagtext ...]

Källa: https://www.riksdagen.se/sv/dokument-och-lagar/...

───────────────────────────────────────

[... alla andra lagtexter ...]
```

---

## 🎯 Fördelar med denna struktur

### För Användaren (Byråchefen):
- ✅ Snabb översikt av svar utan att läsa lagtexter
- ✅ Enkelt att hitta specifika frågor
- ✅ Professionell dokumentation för intern granskning

### För Klienten:
- ✅ Förstår varför varje fråga ställdes
- ✅ Kan själv slå upp fullständiga lagtexter
- ✅ Transparent process

### För Tillsynsmyndigheten (Länsstyrelsen):
- ✅ Alla lagrum är korrekt citerade
- ✅ Lätt att verifiera laglighet
- ✅ Komplett dokumentation

### För Jurister:
- ✅ Alla källor med länkar
- ✅ Fullständiga lagtexter, inte bara paragrafer
- ✅ Versionskontroll möjlig (via git)

---

## 🔄 Uppdatera Lagtexter

När lagar ändras:

1. **Uppdatera `legalTexts.js`**
   ```javascript
   kontanttransaktioner: {
     id: "PTL_3_6",
     // ... uppdatera fullText med ny lagtext
     fullText: `Penningtvättslagen (2017:630) 3 kap. 6 §
                (uppdaterad 2025-06-01 enligt lag 2025:123)...`,
   }
   ```

2. **Alla nya PDF:er använder automatiskt uppdaterad text**
   - Gamla PDF:er är fortfarande korrekta för sin tid
   - Ny lagtext gäller framöver

3. **Git-historik visar ändringar**
   ```bash
   git log src/data/legalTexts.js
   # Visar alla uppdateringar av lagtexter
   ```

---

## 📚 Relaterade Filer

- `/src/data/legalTexts.js` - Centraliserad lagtext-databas
- `/src/components/Slides/RiskFragorSteg4Slide.jsx` - Exempel på användning
- `/src/components/Slides/SkyldigheterSlide.jsx` - Exempel på användning
- `/docs/specifications/Onboarding_app_ny.tex` - LaTeX-spec med alla lagtexter

---

## 🚀 Nästa Steg (TODO)

1. [ ] Implementera PDF-generering med `@react-pdf/renderer`
2. [ ] Skapa PDF-template med Appendix-sektion
3. [ ] Testa PDF-generering med olika kombinationer av frågor
4. [ ] Lägg till möjlighet att välja språk (svenska/engelska)
5. [ ] Integrera med backend för att spara PDF:er
6. [ ] Skapa automatisk email-utskick av PDF till klient

---

**Senast uppdaterad:** 2025-01-29
