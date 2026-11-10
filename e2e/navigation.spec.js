import { expect, test } from './fixtures'

test.describe('navegação e busca', () => {
  test('home mostra as listas de livros', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Encontre a sua próxima história!' })).toBeVisible()
    const trending = page.locator('section', { has: page.getByRole('heading', { name: 'Em alta nesta semana' }) })
    await expect(trending.getByRole('heading', { name: 'O Hobbit' })).toBeVisible()
  })

  test('busca leva para a página de livros com a URL compartilhável', async ({ page }) => {
    await page.goto('/')
    await page.locator('main').getByRole('combobox', { name: 'Buscar livros' }).fill('duna')
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/\/books\?q=duna/)
    await expect(page.getByRole('heading', { name: 'Duna', exact: true })).toBeVisible()
  })

  test('sugestões levam ao livro e a busca fica no histórico', async ({ page }) => {
    await page.goto('/')
    const field = page.locator('main').getByRole('combobox', { name: 'Buscar livros' })
    await field.pressSequentially('dun')
    await page.getByRole('option', { name: /Duna/ }).click()
    await expect(page).toHaveURL(/\/books\/OL\w+W$/)
    await expect(page.getByRole('heading', { level: 1, name: 'Duna' })).toBeVisible()

    await page.goto('/books')
    await page.locator('main').getByRole('combobox', { name: 'Buscar livros' }).focus()
    await expect(page.getByRole('option', { name: 'dun' })).toBeVisible()
  })

  test('ordenação vai para a URL e a rolagem carrega mais resultados', async ({ page }) => {
    await page.goto('/books?q=o')
    await page.getByLabel('Ordenar por').selectOption('rating')
    await expect(page).toHaveURL(/ordem=rating/)
    const cards = page.locator('main article')
    await expect(cards.first()).toBeVisible()
    const before = await cards.count()
    await page.mouse.wheel(0, 5000)
    await expect.poll(() => cards.count()).toBeGreaterThan(before)
  })

  test('atalho / foca a busca da página', async ({ page }) => {
    await page.goto('/books')
    await expect(page.locator('main').getByRole('combobox', { name: 'Buscar livros' })).toBeVisible()
    await page.keyboard.press('/')
    await expect(page.locator('main').getByRole('combobox', { name: 'Buscar livros' })).toBeFocused()
  })

  test('? abre a lista de atalhos, que também abre pelo rodapé', async ({ page }) => {
    await page.goto('/')
    const dialog = page.getByRole('dialog', { name: 'Atalhos de teclado' })
    await page.keyboard.press('?')
    await expect(dialog).toBeVisible()
    await expect(dialog.getByText('Ir para a busca')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await page.getByRole('button', { name: 'Atalhos de teclado' }).click()
    await expect(dialog).toBeVisible()
    await dialog.getByRole('button', { name: 'Fechar' }).click()
    await expect(dialog).toBeHidden()
  })

  test('primeiro Tab oferece pular para o conteúdo', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Tab')
    await expect(page.getByRole('link', { name: 'Pular para o conteúdo' })).toBeFocused()
  })

  test('tema escolhido continua depois de recarregar', async ({ page }) => {
    await page.goto('/')
    const html = page.locator('html')
    const initial = await html.getAttribute('data-theme')
    await page.locator('.bar__theme button').click()
    const chosen = initial === 'dark' ? 'light' : 'dark'
    await expect(html).toHaveAttribute('data-theme', chosen)
    await page.reload()
    await expect(html).toHaveAttribute('data-theme', chosen)
  })

  test('rota inexistente mostra a página 404', async ({ page }) => {
    await page.goto('/nao-existe')
    await expect(page.getByRole('heading', { name: 'Página não encontrada' })).toBeVisible()
  })

  test('aviso aparece sem internet', async ({ page, context }) => {
    await page.goto('/')
    await context.setOffline(true)
    await expect(page.getByText(/sem internet/)).toBeVisible()
    await context.setOffline(false)
    await expect(page.getByText(/sem internet/)).toBeHidden()
  })
})
