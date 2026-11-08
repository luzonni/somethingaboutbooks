import { expect, test } from './fixtures'

test.describe('celular', () => {
  test('menu lateral abre, navega e fecha', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Abrir menu' }).click()
    const drawer = page.locator('#mobile-menu')
    await expect(drawer).toBeVisible()
    await drawer.getByRole('link', { name: 'Pomodoro' }).click()
    await expect(page).toHaveURL(/\/pomodoro$/)
    await expect(drawer).toBeHidden()
  })

  test('nenhuma página principal tem rolagem horizontal', async ({ page }) => {
    for (const path of ['/', '/books?q=o', '/books/OL1W', '/autores/OL1A', '/pomodoro', '/login', '/sobre']) {
      await page.goto(path)
      await page.waitForLoadState('networkidle')
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
      expect(overflow, `rolagem horizontal em ${path}`).toBeLessThanOrEqual(0)
    }
  })
})
