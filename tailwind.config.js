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
        }
      },
    },
  },
  plugins: [],
}

