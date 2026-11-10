import AxeBuilder from '@axe-core/playwright'
import { expect, test } from './fixtures'

const PAGES = ['/', '/books?q=o', '/books/OL1W', '/autores/OL1A', '/pomodoro', '/login', '/signup', '/sobre', '/suporte']

// Falha só em problemas graves ou críticos; os menores ficam no relatório de QA.
const expectNoSeriousViolations = async (page) => {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
  const serious = results.violations
    .filter((violation) => ['serious', 'critical'].includes(violation.impact))
    .map((violation) => `${violation.id}: ${violation.nodes.map((node) => node.target.join(' ')).slice(0, 3).join(' | ')}`)
  expect(serious).toEqual([])
}

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
        await expectNoSeriousViolations(page)
      })
    }

    test('sem problemas graves com as sugestões de busca abertas', async ({ page }) => {
      await page.addInitScript(() => localStorage.setItem('sab:recent-searches', JSON.stringify(['o hobbit'])))
      await page.goto('/')
      await page.locator('main').getByRole('combobox', { name: 'Buscar livros' }).pressSequentially('o h')
      await expect(page.getByRole('option', { name: /Tolkien/ }).first()).toBeVisible()
      await page.keyboard.press('ArrowDown')
      await page.waitForTimeout(900)
      await expectNoSeriousViolations(page)
    })

    test('sem problemas graves no modal de atalhos', async ({ page }) => {
      await page.goto('/sobre')
      await page.keyboard.press('?')
      await expect(page.getByRole('dialog', { name: 'Atalhos de teclado' })).toBeVisible()
      await expectNoSeriousViolations(page)
    })
  })
}
