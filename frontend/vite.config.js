// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://ecobackend-two.vercel.app',
        changeOrigin: true,
      }
    }
  },
  // ✅ Alias hatao - dynamic import use kar rahe ho
  optimizeDeps: {
    include: ['lightweight-charts'],
  },
})