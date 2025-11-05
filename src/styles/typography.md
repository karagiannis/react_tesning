# Centraliserad Typografi - Användningsguide

## ✅ Vad har migrerats

**Färdiga sidor:**
- ✅ `AccountingAnalysisWizard.jsx` - Alla 5 wizard-steg
- ✅ `VoucherDetailPage.jsx` - Huvud- och felrubriker
- ✅ `AccountingReviewPage.jsx` - Huvudrubrik

**Återstår:**
- ⏳ `src/components/Slides/` - 70+ onboarding-slides (IntroSlide, RegisterSlide etc)
- ⏳ `src/components/Pages/` - Settings, Errors, Unauthorized pages
- ⏳ `src/components/Modals/` - AgreementModal och andra modaler

## Varför centraliserad styling?

Istället för att ändra `text-2xl`, `font-semibold`, `w-7 h-7` på 100+ ställen kan du nu ändra **en rad** i `tailwind.config.js` så uppdateras alla migrerade komponenter.

## Typografi-klasser (definierade i tailwind.config.js)

### Rubriker

```jsx
// H1 - Huvudrubrik på content-slides (24px semibold)
<h1 className="text-page-title text-brand-900 mb-2 flex items-center gap-3">
  <svg className="w-icon-md h-icon-md text-brand-600">...</svg>
  Bokföringsanalys
</h1>

// H2 - Sektionsrubriker (20px semibold)
<h2 className="text-section-title text-brand-900 mb-4">
  Flaggade Verifikationer
</h2>

// H3 - Underrubriker (18px medium)
<h3 className="text-subsection-title text-brand-800">
  Detaljer
</h3>

// KPI/Stats - Dashboard-nummer (24px bold)
<div className="text-stat-value text-red-600">{summary.errors}</div>
```

### Ikonstorlekar

```jsx
// Små ikoner (20px) - för knappar
<svg className="w-icon-sm h-icon-sm">...</svg>

// Medium ikoner (28px) - för rubriker
<svg className="w-icon-md h-icon-md">...</svg>

// Stora ikoner (32px) - för hero sections
<svg className="w-icon-lg h-icon-lg">...</svg>
```

## Hur man ändrar globalt

### Exempel: Göra alla rubriker större

I `tailwind.config.js`, ändra:
```javascript
fontSize: {
  'page-title': ['1.75rem', { ... }],  // 24px → 28px
}
```

**Resultat:** Alla h1-rubriker i migrerade komponenter blir större!

### Exempel: Ändra font-weight

```javascript
'page-title': ['1.5rem', { lineHeight: '2rem', fontWeight: '700' }],  // 600 → 700 (bold)
```

### Exempel: Ändra alla ikonstorlekar

```javascript
spacing: {
  'icon-md': '2rem',  // 28px → 32px
}
```

## Migreringsexempel

### FÖRE (hårdkodade värden):
```jsx
<h1 className="text-2xl font-semibold text-brand-900">
  <svg className="w-7 h-7">...</svg>
  Titel
</h1>
```

### EFTER (centraliserade klasser):
```jsx
<h1 className="text-page-title text-brand-900">
  <svg className="w-icon-md h-icon-md">...</svg>
  Titel
</h1>
```

**Fördelar:**
- Ändra **en rad** i config istället för 100+ komponenter
- Konsistent design automatiskt
- Tydligare semantic naming (`page-title` > `text-2xl`)
- Enklare för framtida designers att förstå hierarkin

## Framtida migration

För Slides och andra komponenter som inte migrerats än, använd find-replace:

```bash
# Exempel för att migrera en komponent:
# 1. Öppna filen
# 2. Sök: text-2xl font-semibold
# 3. Ersätt: text-page-title
# 4. Sök: w-7 h-7
# 5. Ersätt: w-icon-md h-icon-md
```

Eller gör det gradvis när du jobbar med varje komponent.
