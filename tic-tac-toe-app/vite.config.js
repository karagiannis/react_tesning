import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/tic-tac-toe/',  // ← Detta används vid `npm run build`
  plugins: [react()],
  server: {               // ← Lägg till detta block
    proxy: {
      '/tic-tac-toe-api': {
        target: 'https://celestial.se',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/tic-tac-toe-api/, '/tic-tac-toe-api'),
      },
    },
  },
});