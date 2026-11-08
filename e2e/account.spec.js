import { readFile } from 'node:fs/promises'
import { clickAndExpectToast, expect, signUp, test } from './fixtures'

test.describe('conta, biblioteca e Pomodoro', () => {
  test('páginas da conta exigem login e voltam para onde a pessoa queria ir', async ({ page }) => {
    await page.goto('/readinghistorylist')
    await expect(page).toHaveURL(/\/login$/)
    await page.getByRole('link', { name: 'Criar conta' }).first().click()
    const form = page.locator('[data-pane="signup"]')
    await form.getByLabel('Nome de usuário').fill('volta')
    await form.getByLabel('Email').fill('volta@teste.test')
    await form.getByLabel('Senha', { exact: true }).fill('senha-de-teste-123')
    await form.getByLabel('Repetir senha').fill('senha-de-teste-123')
    await form.getByRole('button', { name: 'Criar conta' }).click()
    await expect(page).toHaveURL(/\/readinghistorylist$/)
  })

  test('cadastro valida campos e login recusa senha errada', async ({ page }) => {
    await page.goto('/signup')
    await page.locator('[data-pane="signup"]').getByRole('button', { name: 'Criar conta' }).click()
    await expect(page.getByText('Informe um nome de usuário.')).toBeVisible()

    await signUp(page, 'senha')
    await page.getByRole('button', { name: /Menu de senha/ }).click()
    await page.getByRole('button', { name: 'Sair' }).click()
    await page.goto('/login')
    const form = page.locator('[data-pane="login"]')
    await form.getByLabel('Email').fill('senha@teste.test')
    await form.getByLabel('Senha', { exact: true }).fill('senha-errada-000')
    await form.getByRole('button', { name: 'Entrar' }).click()
    await expect(page.getByText('Email ou senha incorretos.')).toBeVisible()
  })

  test('Pomodoro com livro, progresso e atalhos de teclado', async ({ page }) => {
    await signUp(page)
    await page.goto('/books/OL1W')
    await page.getByRole('button', { name: 'Sessão de leitura' }).click()
    await expect(page).toHaveURL(/\/pomodoro$/)
    await page.getByLabel('Página atual').fill('155')
    await page.getByLabel('Total').fill('310')
    await expect(page.getByRole('progressbar').first()).toHaveAttribute('aria-valuenow', '50')

    await page.locator('body').click({ position: { x: 5, y: 300 } })
    await page.keyboard.press('Space')
    await expect(page.getByRole('timer')).not.toHaveText('25:00', { timeout: 3000 })
    await page.keyboard.press('Space')
    await page.keyboard.press('r')
    await expect(page.getByRole('timer')).toHaveText('25:00')
  })

  test('histórico com meta anual, gráfico e listas renomeáveis', async ({ page }) => {
    await signUp(page)
    await page.goto('/readinghistorylist')
    await page.getByLabel('Livros que quero ler neste ano').fill('12')
    await page.getByRole('button', { name: 'Definir meta' }).click()
    await expect(page.getByText(/Faltam 12 livros/)).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Últimos 7 dias' })).toBeVisible()

    await page.getByLabel('Nome da nova lista').fill('Clássicos')
    await page.getByRole('button', { name: 'Criar', exact: true }).click()
    await page.getByRole('button', { name: 'Renomear a lista Clássicos' }).click()
    await page.getByLabel('Novo nome da lista').fill('Para reler')
    await page.keyboard.press('Enter')
    await expect(page.getByRole('heading', { name: /Para reler/ })).toBeVisible()
  })

  test('backup exporta, recusa arquivo inválido e restaura', async ({ page }) => {
    await signUp(page)
    await page.goto('/books/OL2W')
    await page.getByRole('button', { name: 'Quero ler' }).click()
    await page.goto('/userconfig')

    const downloadPromise = page.waitForEvent('download')
    await page.getByRole('button', { name: 'Exportar backup' }).click()
    const download = await downloadPromise
    expect(download.suggestedFilename()).toMatch(/^sab-leitor-\d{4}-\d{2}-\d{2}\.json$/)
    const backup = JSON.parse(await readFile(await download.path(), 'utf8'))
    expect(Object.keys(backup.library.books)).toEqual(['OL2W'])

    const input = page.locator('input[type=file]')
    await input.setInputFiles({ name: 'x.json', mimeType: 'application/json', buffer: Buffer.from('{"x":1}') })
    await expect(page.getByText('Este arquivo não é um backup do SAB.')).toBeVisible()

    await input.setInputFiles(await download.path())
    await clickAndExpectToast(page, page.getByRole('button', { name: 'Substituir' }), 'Biblioteca restaurada')
  })
})
