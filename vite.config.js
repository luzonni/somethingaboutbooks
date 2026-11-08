import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Dependências mudam pouco: ficam num arquivo separado que o navegador reaproveita entre deploys.
        manualChunks(id) {
          const path = id.replaceAll('\\', '/')
          if (/node_modules\/(react|react-dom|react-router|react-router-dom|scheduler|styled-components)\//.test(path)) {
            return 'vendor'
          }
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    restoreMocks: true,
    unstubGlobals: true,
    setupFiles: './src/test/setup.js',
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/**/*.test.{js,jsx}', 'src/test/**', 'src/main.jsx'],
      reporter: ['text-summary', 'html'],
    },
  },
})
