import AxeBuilder from '@axe-core/playwright'
import { expect, test } from './fixtures'

const PAGES = ['/', '/books?q=o', '/books/OL1W', '/autores/OL1A', '/pomodoro', '/login', '/signup', '/sobre', '/suporte']

// Falha só em problemas graves ou críticos; os menores ficam no relatório de QA.
for (const theme of ['light', 'dark']) {
  test.describe(`acessibilidade (tema ${theme === 'light' ? 'claro' : 'escuro'})`, () => {
    test.use({ colorScheme: theme })
    // O axe analisa a página inteira e pode demorar com vários navegadores em paralelo.
    test.describe.configure({ timeout: 90_000 })

    for (const path of PAGES) {
      test(`sem problemas graves em ${path}`, async ({ page }) => {
        await page.goto(path)
        await page.waitForLoadState('networkidle')
        // Espera as animações de entrada terminarem para medir o contraste final.
        await page.waitForTimeout(900)
        const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
        const serious = results.violations
          .filter((violation) => ['serious', 'critical'].includes(violation.impact))
          .map((violation) => `${violation.id}: ${violation.nodes.map((node) => node.target.join(' ')).slice(0, 3).join(' | ')}`)
        expect(serious).toEqual([])
      })
    }
  })
}
