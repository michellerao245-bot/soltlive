import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  // ✅ Server configuration
  server: {
    proxy: {
      '/api': {
        target: 'https://ecobackend-two.vercel.app',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  
  // ✅ Build configuration (remove manualChunks)
  build: {
    chunkSizeWarningLimit: 1000,
  },
  
  // ✅ Resolve aliases
  resolve: {
    alias: {
      // ✅ Fix for lightweight-charts build issue
      'lightweight-charts': 'lightweight-charts/dist/lightweight-charts.esm.js',
    },
  },
  
  // ✅ Optimize dependencies
  optimizeDeps: {
    include: ['lightweight-charts'],
  },
})