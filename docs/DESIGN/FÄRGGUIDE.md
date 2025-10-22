# 🎨 Färgguide för Onboarding-appen

## Hur Tailwind CSS fungerar

### 1. Traditionell CSS (gammalt sätt)
```css
/* style.css */
.button {
  background-color: #f59e0b;
  padding: 12px 24px;
  border-radius: 8px;
}
```
```jsx
<button className="button">Klicka</button>
```

### 2. Tailwind CSS (vårt sätt)
```jsx
<button className="bg-amber-500 px-6 py-3 rounded-lg">Klicka</button>
```

**Fördelar:**
- ✅ Ingen separat CSS-fil att underhålla
- ✅ Ser direkt vilken styling som appliceras
- ✅ Ändra en färg på ett ställe → ändrar överallt
- ✅ Responsiv design enkelt: `md:text-lg lg:text-xl`

---

## Nuvarande färgpalett (Amber/Orange)

| Färgnamn | Hex-kod | Användning |
|----------|---------|------------|
| `amber-50` | #fffbeb | Ljusaste bakgrund (sidebar) |
| `amber-100` | #fef3c7 | Hover-states, ljusa knappar |
| `amber-800` | #9a3412 | Rubriker |
| `amber-900` | #7c2d12 | Mörkaste text |
| `orange-600` | #ea580c | **Primärfärg** (knappar, header) |
| `orange-700` | #c2410c | Hover-state för knappar |

---

## Byta färgtema (3 alternativ)

### Alternativ A: Använd Tailwinds inbyggda färger
**Snabbast - byt bara amber/orange mot annat**

1. Sök och ersätt i hela projektet (VS Code: Ctrl+Shift+H):
   - `amber-` → `blue-` (blått tema)
   - `amber-` → `green-` (grönt tema)
   - `amber-` → `purple-` (lila tema)
   - `orange-` → `blue-` (eller samma som amber)

**Tailwinds färger:** blue, green, red, purple, pink, indigo, cyan, teal, lime, emerald, sky, violet, fuchsia

### Alternativ B: Definiera egna "brand"-färger (rekommenderat)
**Bäst för företagsprofil**

1. Öppna `tailwind.config.js`
2. Under `colors.brand` - ändra hex-koderna till dina företagsfärger
3. I koden: byt `amber-500` → `brand-500`, `orange-600` → `brand-600`

**Exempel:** Om ditt företag har blå färg `#0066cc`:
```js
brand: {
  50: '#e6f2ff',
  100: '#cce5ff',
  ...
  600: '#0066cc',  // Din primärfärg
  700: '#0052a3',  // Mörkare för hover
  ...
}
```

### Alternativ C: Använd färggenerator
**Enklast för att få harmoniska färger**

1. Gå till: https://uicolors.app/create
2. Ange din primärfärg (t.ex. `#0066cc`)
3. Kopiera genererad färgpalett
4. Klistra in i `tailwind.config.js` under `colors.brand`

---

## Var finns färgerna i koden?

### Komponenter som använder färger:

**Knappar (primärfärg):**
```jsx
// Alla primärknappar
className="bg-orange-600 hover:bg-orange-700 text-white"
```
- Filer: `*Slide.jsx`, `Header.jsx`, `Sidebar.jsx`
- Byt: `orange-600` → din färg

**Sidebar (ljus bakgrund):**
```jsx
className="bg-gradient-to-b from-amber-50 to-orange-50"
```
- Fil: `Sidebar.jsx`
- Byt: `amber-50` och `orange-50`

**Header:**
```jsx
className="bg-white border-b border-amber-200"
```
- Fil: `Header.jsx`
- Byt: `amber-200` → din border-färg

**Aktiv knapp i Sidebar:**
```jsx
className="bg-gradient-to-r from-amber-500 to-orange-500 text-white"
```
- Fil: `Sidebar.jsx`
- Byt: `amber-500` och `orange-500`

---

## Snabbguide: Byt till blått tema (5 minuter)

### Steg 1: Global sök och ersätt
**VS Code:** Tryck `Ctrl+Shift+H` (Windows/Linux) eller `Cmd+Shift+H` (Mac)

Ersätt i mapp: `src/`

| Sök efter | Ersätt med |
|-----------|------------|
| `amber-50` | `blue-50` |
| `amber-100` | `blue-100` |
| `amber-200` | `blue-200` |
| `amber-300` | `blue-300` |
| `amber-500` | `blue-500` |
| `amber-600` | `blue-600` |
| `amber-700` | `blue-700` |
| `amber-800` | `blue-800` |
| `amber-900` | `blue-900` |
| `orange-50` | `blue-50` |
| `orange-100` | `blue-100` |
| `orange-600` | `blue-700` |
| `orange-700` | `blue-800` |

### Steg 2: Spara och se resultatet
Tailwind kompilerar automatiskt → du ser blått tema direkt!

---

## Form och rundning

### Knappar
```jsx
className="rounded-lg"  // 8px rundning (standard)
className="rounded-xl"  // 12px rundning (mer rund)
className="rounded-full" // Helt rund (pillform)
```

### Kort/Cards
```jsx
className="rounded-2xl" // 16px rundning (nuvarande)
className="rounded-3xl" // 24px rundning (mer mjukt)
```

### Shadows (skuggor)
```jsx
className="shadow-md"   // Liten skugga
className="shadow-lg"   // Mellan skugga (nuvarande)
className="shadow-2xl"  // Stor skugga
```

---

## Experiment: Prova olika teman

### Mörkt tema (Dark Mode)
Sök och ersätt:
- `bg-white` → `bg-gray-900`
- `text-amber-900` → `text-white`
- `bg-amber-50` → `bg-gray-800`

### Minimalistiskt tema
- Ta bort alla `shadow-` klasser
- Byt `rounded-2xl` → `rounded-lg`
- Använd endast en färg (t.ex. endast `gray-` och `blue-600`)

### Färgglatt tema
- Använd `bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500`
- Lägg till `animate-pulse` på knappar

---

## Hitta fler Tailwind-klasser

**Officiell dokumentation:** https://tailwindcss.com/docs

**Snabbreferens:**
- Färger: `bg-{color}-{shade}` (t.ex. `bg-blue-500`)
- Text: `text-{color}-{shade}` (t.ex. `text-gray-900`)
- Padding: `p-{size}` (4 = 16px, 6 = 24px, 8 = 32px)
- Margin: `m-{size}`, `mt-{size}` (top), `mb-{size}` (bottom)
- Rundning: `rounded-{size}` (sm, md, lg, xl, 2xl, 3xl, full)
- Skuggor: `shadow-{size}` (sm, md, lg, xl, 2xl)

---

## Tips: Använd Browser DevTools

1. Högerklicka på en knapp → "Inspektera"
2. Se alla Tailwind-klasser som används
3. Dubbelklicka på klassen → ändra live i browsern
4. Testa olika färger → kopiera den du gillar till koden

**Exempel:**
```
className="bg-orange-600"  →  Ändra till "bg-purple-600" i DevTools
→  Ser bra ut? Kopiera tillbaka till koden!
```

---

## Frågor?

**Vill du:**
- Matcha företagets färger? → Använd alternativ B (brand-färger)
- Snabbt testa olika teman? → Använd alternativ A (sök och ersätt)
- Professionell färgharmoni? → Använd alternativ C (färggenerator)

**Nästa steg:**
Berätta vilken färg du vill ha, så hjälper jag dig implementera det! 🎨
