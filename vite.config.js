import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // No GitHub Pages o site fica em /<repositório>/: o workflow de deploy define BASE_PATH.
  base: process.env.BASE_PATH ?? '/',
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
    // Testes com a árvore inteira de providers podem passar de 5 s em máquinas de CI mais lentas.
    testTimeout: 15000,
    unstubGlobals: true,
    setupFiles: './src/test/setup.js',
    include: ['src/**/*.test.{js,jsx}'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/**/*.test.{js,jsx}', 'src/test/**', 'src/main.jsx'],
      reporter: ['text-summary', 'html', 'json-summary'],
    },
  },
})
