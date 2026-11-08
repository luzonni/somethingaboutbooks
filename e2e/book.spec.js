import { clickAndExpectToast, expect, signUp, test } from './fixtures'

test.describe('página do livro e do autor', () => {
  test('mostra detalhes, notas e etiquetas limpas', async ({ page }) => {
    await page.goto('/books/OL1W')
    await expect(page.getByRole('heading', { level: 1, name: 'O Hobbit' })).toBeVisible()
    await expect(page.getByText('1937')).toBeVisible()
    await expect(page.getByText('500 avaliações')).toBeVisible()
    await page.getByRole('tab', { name: 'Gêneros' }).click()
    const panel = page.getByRole('tabpanel')
    await expect(panel.getByRole('link', { name: 'Exemplo' })).toBeVisible()
    await expect(panel.getByText(/series:|Reading Level/)).toHaveCount(0)
  })

  test('visitante é convidado a entrar para salvar', async ({ page }) => {
    await page.goto('/books/OL1W')
    await page.getByRole('link', { name: 'Entrar para salvar' }).click()
    await expect(page).toHaveURL(/\/login$/)
  })

  test('livro inexistente mostra aviso', async ({ page }) => {
    await page.goto('/books/OL999W')
    await expect(page.getByText('Livro não encontrado.')).toBeVisible()
  })

  test('nome do autor leva à página dele com biografia e obras', async ({ page }) => {
    await page.goto('/books/OL1W')
    await page.getByRole('link', { name: 'Ver página do autor' }).click()
    await expect(page).toHaveURL(/\/autores\/OL1A$/)
    await expect(page.getByRole('heading', { level: 1, name: 'J.R.R. Tolkien' })).toBeVisible()
    await expect(page.getByText('Escritor e professor britânico')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'O Silmarillion', exact: true })).toBeVisible()
  })

  test('estante, favorito e review continuam após recarregar', async ({ page }) => {
    await signUp(page)
    await page.goto('/books/OL1W')
    await clickAndExpectToast(page, page.getByRole('button', { name: 'Lendo' }), 'Movido para Lendo')
    await page.getByRole('button', { name: 'Favorito' }).click()
    await page.getByRole('button', { name: '5 estrelas' }).click()
    await page.getByRole('textbox').last().fill('Uma aventura incrível')
    await page.getByRole('button', { name: 'Salvar review' }).click()

    await page.reload()
    await expect(page.getByRole('button', { name: 'Lendo' })).toHaveAttribute('aria-pressed', 'true')
    await expect(page.getByRole('button', { name: 'Favorito' })).toHaveAttribute('aria-pressed', 'true')
    await expect(page.getByText('Uma aventura incrível')).toBeVisible()
  })

  test('compartilhar copia o link quando não há compartilhamento nativo', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.addInitScript(() => delete Navigator.prototype.share)
    await page.goto('/books/OL2W')
    await clickAndExpectToast(page, page.getByRole('button', { name: 'Compartilhar' }), 'Link copiado')
    expect(await page.evaluate(() => navigator.clipboard.readText())).toMatch(/\/books\/OL2W$/)
  })
})
