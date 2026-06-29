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
  
  // ✅ Build configuration
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // ✅ Separate vendor chunks for better caching
          vendor: ['react', 'react-dom', 'react-router-dom'],
          charts: ['lightweight-charts'],
        },
      },
    },
    // ✅ Reduce chunk size warnings
    chunkSizeWarningLimit: 1000,
  },
  
  // ✅ Resolve aliases for problematic packages
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