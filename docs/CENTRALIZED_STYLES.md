# Centraliserade Stilar - Design System

**Uppdaterad:** 2025-11-05  
**Syfte:** Dokumentera återanvändbara stilmönster för konsistens

---

## 🎨 Typografi

### Rubriker
```jsx
// Huvudrubrik (h1) - 18px semibold
<h1 className="text-page-title">Rubrik</h1>

// Sektionsrubrik (h2) - 14px semibold
<h2 className="text-section-title">Sektion</h2>

// Underrubrik (h3) - 13px medium
<h3 className="text-subsection-title">Underrubrik</h3>

// Statistik/KPI - 20px bold
<span className="text-stat-value">123 456 kr</span>
```

### Brödtext
```jsx
// Standard text - 16px (Tailwind default)
<p>Normal text</p>

// Liten text - 14px
<p className="text-sm">Mindre text i formulär</p>

// Extra liten text - 12px
<p className="text-xs">Hjälptext, footnotes</p>
```

---

## 📐 Border-Radius

### Värden
```javascript
'rounded-box-sm': '6px'   // Inputs, små element
'rounded-box':    '8px'   // Boxar, alerts, knappar
'rounded-card':   '12px'  // Stora containers
```

### Användning
```jsx
// Inputs
<input className="... rounded-box-sm" />

// Boxar/Alerts
<div className="... rounded-box">Alert</div>

// Huvudcontainers
<div className="... rounded-card">Container</div>
```

---

## ✅ Checkboxes (Centraliserad Pattern)

### Standard Checkbox
```jsx
<label className="flex items-center gap-2">
  <input 
    type="checkbox"
    className="w-4 h-4 text-brand-600 border-brand-300 rounded focus:ring-brand-500"
  />
  <span className="text-sm">Checkbox-text (14px)</span>
</label>
```

### Förklaring
- **Checkbox**: `w-4 h-4` (16px) - Lagom storlek för att klicka
- **Text**: `text-sm` (14px) - Matchar label-storlek
- **Gap**: `gap-2` (8px) - Standard spacing mellan checkbox och text
- **Border**: `border-brand-300` - Neutral kantfärg
- **Rounded**: `rounded` (4px) - Tailwind default för checkboxes
- **Focus**: `focus:ring-brand-500` - Brand-färgad ring vid fokus

### Varför är checkbox större än text?
✅ **UX Best Practice**: Checkboxar får vara 2px större än texten
- Lättare att träffa med musen
- Bättre för touch-devices
- Standard i de flesta design systems (Material, Bootstrap, etc.)

---

## 📝 Input-fält

### Standard Input/Textarea
```jsx
<input 
  type="text"
  className="w-full px-4 py-2 border border-brand-300 rounded-box-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
/>
```

### Förklaring
- **Padding**: `px-4 py-2` (16px/8px) - Behaglig spacing
- **Border**: `border-brand-300` - Neutral kant
- **Radius**: `rounded-box-sm` (6px) - Mjuk avrundning
- **Focus**: `focus:ring-2 focus:ring-brand-500` - Tydlig fokusindikator
- **Text**: `text-sm` (14px) - Matchar labels

---

## 🔘 Radio Buttons

### Standard Radio (samma som checkbox)
```jsx
<label className="flex items-center gap-2">
  <input 
    type="radio"
    className="w-4 h-4 text-brand-600 border-brand-300 focus:ring-brand-500"
  />
  <span className="text-sm">Radio-text (14px)</span>
</label>
```

---

## 🎯 Labels

### Standard Label
```jsx
<label className="block text-section-title text-brand-800 mb-2">
  Label-text *
</label>
```

### Förklaring
- **Display**: `block` - Egen rad
- **Font**: `text-section-title` (14px semibold)
- **Färg**: `text-brand-800` - Mörk skogsgrön
- **Margin**: `mb-2` (8px) - Space till input

---

## 📦 Boxar & Alerts

### Info Box
```jsx
<div className="bg-brand-50 border-l-4 border-brand-500 p-4 rounded-box">
  <span className="block text-section-title text-brand-900">Rubrik</span>
  <span className="text-xs text-brand-700">Beskrivning</span>
</div>
```

### Warning Box
```jsx
<div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-box">
  <span className="block text-section-title text-yellow-900">Varning</span>
  <span className="text-xs text-yellow-700">Beskrivning</span>
</div>
```

### Error Box
```jsx
<div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-box">
  <span className="block text-section-title text-red-900">Fel</span>
  <span className="text-xs text-red-700">Beskrivning</span>
</div>
```

---

## 🔳 Knappar

### Primary Button
```jsx
<button className="px-4 py-2 bg-brand-600 text-white rounded-box hover:bg-brand-700 transition-colors font-semibold">
  Nästa
</button>
```

### Secondary Button
```jsx
<button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-box hover:bg-gray-300 transition-colors font-medium">
  Tillbaka
</button>
```

### Disabled Button
```jsx
<button 
  disabled
  className="px-4 py-2 bg-gray-300 text-gray-500 rounded-box cursor-not-allowed"
>
  Disabled
</button>
```

---

## 📏 Spacing

### Container Padding
```jsx
// Huvudcontainer
<div className="p-8">...</div>

// Mindre sections
<div className="p-4">...</div>
```

### Element Spacing
```jsx
// Mellan sections
<div className="space-y-8">...</div>

// Mellan inputs/fält
<div className="space-y-4">...</div>

// Mellan labels och input
<label className="... mb-2">...</label>

// Mellan checkbox och text
<label className="flex items-center gap-2">...</label>
```

---

## 🎨 Färger & Bakgrunder

### Brand Primär (Grön)
```
brand-50:  #f7f9f8  (bakgrunder)
brand-100: #e8f0ed  (hover states)
brand-300: #9ac2b3  (borders, placeholders)
brand-600: #00704a  (knappar, primära actions)
brand-800: #004d32  (header, primär text i boxar)
brand-900: #1a3a2e  (rubriker, mörk text)
```

### Terracotta Accent
```
terracotta-500: #e65a33  (länkar, sekundära actions)
terracotta-600: #d4421f  (hover på terracotta)
```

### Bakgrundsfärger - Stilregel

**Info-boxar & Content-containers:**
- ✅ `bg-brand-50` - Standard för alla info-boxar, statistik, AI-analys
- ✅ `text-brand-700/800/900` - Text i brand-boxar

**Interaktiva element:**
- ✅ `bg-white` - Inputs (text, textarea, select), dropdowns
- ✅ `bg-white` - Formulärfält där användaren skriver

**Status-indicators:**
- ⚠️ `bg-yellow-50` + `text-yellow-800` - Varningar
- ❌ `bg-red-50` + `text-red-800` - Fel
- ✅ `bg-green-50` + `text-green-800` - Success-meddelanden

**Exempel:**
```jsx
// ✅ Korrekt: Info-box med brand-färg
<div className="p-6 bg-brand-50 rounded-card border border-brand-200">
  <h3 className="text-brand-900">Nyckeltal</h3>
  <p className="text-brand-700">Data här...</p>
</div>

// ✅ Korrekt: Input-fält alltid vita
<input 
  type="text"
  className="bg-white border border-brand-300 rounded-box-sm"
/>

// ⚠️ Korrekt: Varning med gul bakgrund
<div className="bg-yellow-50 border border-yellow-200 text-yellow-800">
  <p>Observera detta!</p>
</div>
```

---

## 📋 Exempel: Komplett Formulär

```jsx
<div className="max-w-3xl w-full bg-white rounded-card shadow-2xl p-8">
  {/* Huvudrubrik */}
  <h1 className="text-page-title text-brand-900 mb-4">
    Formulärtitel
  </h1>

  <div className="space-y-4">
    {/* Textfält */}
    <div>
      <label className="block text-section-title text-brand-800 mb-2">
        Företagsnamn *
      </label>
      <input 
        type="text"
        className="w-full px-4 py-2 border border-brand-300 rounded-box-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
      />
    </div>

    {/* Textarea */}
    <div>
      <label className="block text-section-title text-brand-800 mb-2">
        Beskrivning
      </label>
      <textarea 
        rows={3}
        className="w-full px-4 py-2 border border-brand-300 rounded-box-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
      />
    </div>

    {/* Checkboxes */}
    <div>
      <label className="block text-section-title text-brand-800 mb-2">
        Välj alternativ
      </label>
      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <input 
            type="checkbox"
            className="w-4 h-4 text-brand-600 border-brand-300 rounded focus:ring-brand-500"
          />
          <span className="text-sm">Alternativ 1</span>
        </label>
        <label className="flex items-center gap-2">
          <input 
            type="checkbox"
            className="w-4 h-4 text-brand-600 border-brand-300 rounded focus:ring-brand-500"
          />
          <span className="text-sm">Alternativ 2</span>
        </label>
      </div>
    </div>

    {/* Info box */}
    <div className="bg-brand-50 border-l-4 border-brand-500 p-4 rounded-box">
      <span className="block text-section-title text-brand-900">
        Viktigt att veta
      </span>
      <span className="text-xs text-brand-700">
        Denna information används för riskbedömning.
      </span>
    </div>

    {/* Knappar */}
    <div className="flex justify-between mt-8">
      <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-box hover:bg-gray-300 transition-colors font-medium">
        Tillbaka
      </button>
      <button className="px-4 py-2 bg-brand-600 text-white rounded-box hover:bg-brand-700 transition-colors font-semibold">
        Nästa
      </button>
    </div>
  </div>
</div>
```

---

## 🔄 Migration Guide

### Från Old → New

```jsx
// OLD
<h1 className="text-2xl font-bold">Rubrik</h1>
→ <h1 className="text-page-title">Rubrik</h1>

// OLD
<label className="text-sm font-medium">Label</label>
→ <label className="text-section-title">Label</label>

// OLD
<input className="rounded-lg" />
→ <input className="rounded-box-sm" />

// OLD
<div className="rounded-2xl">Container</div>
→ <div className="rounded-card">Container</div>

// OLD
<span>Checkbox text</span>
→ <span className="text-sm">Checkbox text</span>
```

---

## ✅ Checklist för Nya Komponenter

- [ ] Huvudrubrik använder `text-page-title`
- [ ] Labels använder `text-section-title`
- [ ] Inputs har `text-sm` + `rounded-box-sm`
- [ ] Checkboxes har `w-4 h-4 text-brand-600 border-brand-300 rounded focus:ring-brand-500`
- [ ] Checkbox-text har `text-sm`
- [ ] Boxar använder `rounded-box`
- [ ] Huvudcontainer använder `rounded-card`
- [ ] Knappar använder `rounded-box`
- [ ] Normal spacing (p-8, mb-4, gap-2, space-y-4)
