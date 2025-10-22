# Färgschema för Resultat-Slides

## 🎨 Nuvarande problem:
Resultat-slidesen använder olika färger inkonsekvent:
- VerksamhetSlide: brand-50, blue-50, green-50
- AgarstrukturSlide: purple-50 + pink-50, blue-50
- StyrelseSlide: blue-50, green-50
- RiskindikatorerSlide: green-50, purple-50, yellow-50, red-50
- OvrigaDataSlide: blue-50, purple-50, indigo-50

## ✅ FÖRSLAG 1: Endast Brand-färg (Ljusgrönt)
```
Alla fält: bg-brand-50 border-brand-200
```

**Fördelar:**
- Superenkelt och konsekvent
- Stark varumärkesidentitet
- Minimalt underhåll

**Nackdelar:**
- Kan bli monotont
- Svårt att skilja olika sektioner åt visuellt
- Risk för "grön-blindhet"

---

## ✅ FÖRSLAG 2: Brand + Vitt (Växlande) ⭐ **REKOMMENDERAT**
```
Fält 1: bg-brand-50 border-brand-200
Fält 2: bg-white border-brand-100
Fält 3: bg-brand-50 border-brand-200
Fält 4: bg-white border-brand-100
...

Varningar/Errors: 
- Röd: bg-red-50 border-red-300 (konkurs, näringsförbud, sanktioner)
- Gul: bg-yellow-50 border-yellow-300 (PEP, riskindikatorer)
- Grön OK: bg-green-50 border-green-300 (clean check, inga varningar)
```

**Fördelar:**
- Tydlig visuell hierarki
- Behåller varumärkesfärg
- Professionell "striped table" känsla
- Bra läsbarhet och kontrast
- Varningar sticker ut (röd/gul)

**Nackdelar:**
- Lite mer kod att ändra

**Exempel VerksamhetSlide:**
```
┌─────────────────────────────────────┐
│ Företagsinformation                 │ ← bg-brand-50 (ljusgrönt)
│ - Företagsnamn: Celestial AB        │
│ - Org.nr: 556500-2465              │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Verksamhet                          │ ← bg-white
│ Redovisningstjänster och...        │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ SNI-klassificering                  │ ← bg-brand-50 (ljusgrönt)
│ 69.20 - Redovisning och bokföring  │
└─────────────────────────────────────┘
```

---

## ✅ FÖRSLAG 3: Brand + Blå accent
```
Huvudfält: bg-brand-50 border-brand-200
Viktiga/Highlighted: bg-blue-50 border-blue-200
Varningar: red-50, yellow-50
```

**Fördelar:**
- Blått + grönt = professionell färgpalett
- Kan markera "viktigaste" fält i blått
- Behåller viss variation

**Nackdelar:**
- Måste definiera vad som är "viktigt"
- Mer arbiträrt än växlande mönster
- Riskerar bli inkonsekvent

---

## 🎯 REKOMMENDATION: **FÖRSLAG 2**

**Implementation:**

### VerksamhetSlide:
1. Företagsinformation: `bg-brand-50 border-brand-200` ✅ (har redan)
2. Verksamhet: `bg-white border-brand-100` (byt från blue-50)
3. SNI-klassificering: `bg-brand-50 border-brand-200` (byt från green-50)

### AgarstrukturSlide:
1. Verklig Huvudman: `bg-brand-50 border-brand-200` (byt från purple-50 + pink-50)
2. Alla ägare: `bg-white border-brand-100` (byt från blue-50)
3. Alternativa huvudmän: `bg-brand-50 border-brand-200` (om finns)

### StyrelseSlide:
1. Styrelse: `bg-brand-50 border-brand-200` (byt från blue-50)
2. Firmatecknare: `bg-white border-brand-100` (byt från green-50)

### RiskindikatorerSlide:
1. Huvudsektion: `bg-brand-50 border-brand-200`
2. Varningar: 
   - Konkurs/Rekonstruktion: `bg-red-50 border-red-300` ✅ (behåll)
   - PEP: `bg-yellow-50 border-yellow-300` ✅ (behåll)
   - Sanktioner: `bg-red-50 border-red-300` ✅ (behåll)
   - Näringsförbud: `bg-red-50 border-red-300` ✅ (behåll)
3. Clean check: `bg-green-50 border-green-300` ✅ (behåll för "inga varningar")

### OvrigaDataSlide:
1. Kontaktinfo: `bg-brand-50 border-brand-200` (byt från blue-50)
2. Adresser: `bg-white border-brand-100` (byt från purple-50)
3. Nyckeltal: `bg-brand-50 border-brand-200` (byt från indigo-50)

---

## 🎨 Färgpalett-sammanfattning:

**Brand (Ljusgrönt) - Primär:**
- `bg-brand-50` (bakgrund)
- `border-brand-200` (kant)
- Används för: Udda fält, huvudsektioner

**Vitt - Sekundär:**
- `bg-white` (bakgrund)
- `border-brand-100` (ljus grön kant)
- Används för: Jämna fält, alternativa sektioner

**Varnings-färger (Behålls för kontext):**
- `bg-red-50 border-red-300` - Error/Danger (konkurs, förbud, sanktioner)
- `bg-yellow-50 border-yellow-300` - Warning (PEP, risker)
- `bg-green-50 border-green-300` - Success (clean check, inga varningar)

---

## ❓ Vill du godkänna detta?

Säg "ja" eller "implementera" så fixar jag alla slides! 🚀

Eller vill du:
- [ ] Förslag 1 istället (bara ljusgrönt)?
- [ ] Förslag 3 istället (grönt + blå accent)?
- [ ] Något annat färgschema?
