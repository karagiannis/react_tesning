/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Professional AML/Compliance Green Theme
        brand: {
          50: '#f7f9f8',   // Nästan vit med grön ton (bakgrunder)
          100: '#e8f0ed',  // Mycket ljus grön (hover states)
          200: '#c9ddd5',  // Ljus grågrön
          300: '#9ac2b3',  // Mellanljus grön
          400: '#6ba591',  // Mellangrön
          500: '#4a8870',  // Mellangrön (accent)
          600: '#00704a',  // Primär grön (knappar) - tydlig och professionell
          700: '#005c3d',  // Mörkare grön (hover på knappar)
          800: '#004d32',  // Mörk skogsgrön (header/primär)
          900: '#1a3a2e',  // Mörkaste (text/rubriker)
        },
        // Terracotta accent color (för länkar och sekundära actions)
        terracotta: {
          50: '#fef6f4',   // Mycket ljus terracotta
          100: '#fce8e1',  // Ljus terracotta
          200: '#f9c9bb',  // Mellanljus
          300: '#f4a58e',  // Mellanterracotta
          400: '#ee7d5f',  // Klarare terracotta
          500: '#e65a33',  // Primär terracotta (bas)
          600: '#d4421f',  // Mörkare terracotta (hover)
          700: '#b0351a',  // Mörk terracotta
          800: '#8c2a15',  // Mycket mörk
          900: '#6b1f10',  // Mörkast terracotta
        }
      },
      // CENTRALISERAD TYPOGRAFI - Fortnox-inspirerad professionell design
      fontSize: {
        // Content-slide huvudrubriker (h1) - Fortnox: ~16-18px
        'page-title': ['1.125rem', { lineHeight: '1.75rem', fontWeight: '600' }],  // 18px semibold
        // Sektionsrubriker (h2) - Fortnox kolumnrubriker: ~13px
        'section-title': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '700' }],  // 14px BOLD (ändrat från 600)
        // Underrubriker (h3)
        'subsection-title': ['0.8125rem', { lineHeight: '1.125rem', fontWeight: '500' }],  // 13px medium
        // Statistik/KPI-siffror (får vara lite större än vanlig text)
        'stat-value': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '700' }],  // 20px bold
      },
      borderRadius: {
        'box': '0.5rem',        // 8px - Centraliserad box-radius (lagom professionell)
        'box-sm': '0.375rem',   // 6px - Inputs (mer mjuk än 4px)
        'card': '0.75rem',      // 12px - Större kort/containers
      },
      spacing: {
        // Centraliserade ikonstorlekar
        'icon-sm': '1.25rem',   // 20px (för små ikoner)
        'icon-md': '1.75rem',   // 28px (för rubrikikoner)
        'icon-lg': '2rem',      // 32px (för stora ikoner)
      },
    },
  },
  plugins: [],
}

