import { defineConfig, devices } from '@playwright/test'

const PORT = 4173
const isCI = Boolean(process.env.CI)

// Testes ponta a ponta na versão de produção. A Open Library é simulada (e2e/fixtures),
// então os testes não dependem da internet nem mudam quando a API muda.
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  // Dois navegadores em paralelo: mais que isso deixa máquinas comuns lentas e os testes instáveis.
  workers: 2,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  reporter: isCI ? [['github'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL: `http://localhost:${PORT}`,
    // No computador local usa o Chrome instalado; no CI usa o Chromium baixado pelo Playwright.
    channel: isCI ? undefined : 'chrome',
    serviceWorkers: 'block',
    locale: 'pt-BR',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } }, testIgnore: /mobile\.spec\.js/ },
    { name: 'mobile', use: { ...devices['Pixel 7'] }, testMatch: /mobile\.spec\.js/ },
  ],
  webServer: {
    command: `npm run build && npm run preview -- --port ${PORT} --strictPort`,
    port: PORT,
    reuseExistingServer: !isCI,
    timeout: 120_000,
  },
})
