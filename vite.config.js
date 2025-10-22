import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',  // ← Viktigt: servas från roten
  plugins: [react()],
  server: {
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