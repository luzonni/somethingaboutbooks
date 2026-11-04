import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', 'styled-components'],
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    restoreMocks: true,
    unstubGlobals: true,
    setupFiles: './src/test/setup.js',
  },
})
