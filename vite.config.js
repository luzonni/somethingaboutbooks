import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

const base = process.env.BASE_PATH ?? '/'

// Redes sociais só leem a prévia com URL absoluta. O deploy informa o endereço do site em SITE_URL;
// sem ele, o Vite apenas acrescenta o subcaminho do deploy ao caminho da imagem.
const socialMeta = (siteUrl) => ({
  name: 'social-meta',
  transformIndexHtml: {
    order: 'pre',
    handler(html) {
      if (!siteUrl) return html
      const root = `${siteUrl.replace(/\/$/, '')}/`
      return html.replace(
        /<meta property="og:image" content="\/([^"]+)" \/>/,
        (_, path) => `<meta property="og:image" content="${root}${path}" />\n    <meta property="og:url" content="${root}" />`,
      )
    },
  },
})

// https://vitejs.dev/config/
export default defineConfig({
  // No GitHub Pages o site fica em /<repositório>/: o workflow de deploy define BASE_PATH.
  base,
  plugins: [react(), socialMeta(process.env.SITE_URL)],
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
    unstubEnvs: true,
    setupFiles: './src/test/setup.js',
    // O Vite também carrega o .env.local nos testes: sem isto, eles chamariam o Google Books de verdade.
    env: { VITE_GOOGLE_BOOKS_KEY: '' },
    include: ['src/**/*.test.{js,jsx}'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/**/*.test.{js,jsx}', 'src/test/**', 'src/main.jsx'],
      reporter: ['text-summary', 'html', 'json-summary'],
      // Piso abaixo do valor atual: barra quedas grandes sem travar mudanças pequenas.
      thresholds: { lines: 62, statements: 62, functions: 57, branches: 53 },
    },
  },
})
