import { test as base, expect } from '@playwright/test'

// PNG 2x3 cor de vinho usado como capa e foto em todos os testes.
const IMAGE = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAIAAAADCAIAAAA2iEnWAAAAEUlEQVR4nGNIYmBIYgBjBAUAGn8CTZCbY/oAAAAASUVORK5CYII=',
  'base64'
)

export const BOOKS = [
  { key: '/works/OL1W', title: 'O Hobbit', author_name: ['J.R.R. Tolkien'], author_key: ['OL1A'], cover_i: 1, first_publish_year: 1937, ratings_average: 4.3, ratings_count: 500, number_of_pages_median: 310 },
  { key: '/works/OL2W', title: 'Duna', author_name: ['Frank Herbert'], author_key: ['OL2A'], cover_i: 2, first_publish_year: 1965, ratings_average: 4.4, ratings_count: 400 },
  { key: '/works/OL3W', title: 'Dom Casmurro', author_name: ['Machado de Assis'], author_key: ['OL3A'], cover_i: 3, first_publish_year: 1899, ratings_average: 4.1, ratings_count: 300 },
  { key: '/works/OL4W', title: 'O Silmarillion', author_name: ['J.R.R. Tolkien'], author_key: ['OL1A'], cover_i: 4, first_publish_year: 1977, ratings_average: 4.0, ratings_count: 200 },
  { key: '/works/OL5W', title: 'Fundação', author_name: ['Isaac Asimov'], author_key: ['OL5A'], cover_i: 5, first_publish_year: 1951, ratings_average: 4.2, ratings_count: 350 },
  { key: '/works/OL6W', title: 'Drácula', author_name: ['Bram Stoker'], author_key: ['OL6A'], cover_i: 6, first_publish_year: 1897, ratings_average: 4.0, ratings_count: 250 },
]

const AUTHORS = {
  OL1A: { name: 'J.R.R. Tolkien', birth_date: '3 January 1892', death_date: '2 September 1973', bio: 'Escritor e professor britânico, autor de O Hobbit.', photos: [7] },
  OL2A: { name: 'Frank Herbert', bio: 'Autor americano de ficção científica.' },
}

const json = (route, body, status = 200) =>
  route.fulfill({ status, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(body) })

const searchResponse = (url) => {
  const q = url.searchParams.get('q') ?? ''
  const page = Number(url.searchParams.get('page') ?? 1)
  const authorKey = q.match(/author_key:(\w+)/)?.[1]
  if (/^key:\/works\//.test(q)) return { numFound: 1, docs: [{ number_of_pages_median: 310 }] }
  let docs = BOOKS
  if (authorKey) docs = BOOKS.filter((book) => book.author_key.includes(authorKey))
  else if (q && !q.includes('subject_key') && !q.includes('ratings_count')) {
    docs = BOOKS.filter((book) => `${book.title} ${book.author_name}`.toLowerCase().includes(q.toLowerCase()))
  }
  // Simula uma segunda página para testar a rolagem infinita.
  if (page > 1) docs = docs.map((book) => ({ ...book, key: `${book.key}P${page}`, title: `${book.title} ${page}` }))
  // Busca por texto finge ter várias páginas; listas fixas têm uma só.
  return { numFound: q && !q.includes('subject_key') ? 100 : docs.length, docs }
}

const handleOpenLibrary = (route) => {
  const url = new URL(route.request().url())
  const { pathname } = url
  if (pathname === '/search.json') return json(route, searchResponse(url))
  if (pathname.startsWith('/trending/')) return json(route, { works: BOOKS })
  if (/^\/works\/\w+\/ratings\.json$/.test(pathname)) {
    return json(route, { summary: { average: 4.3, count: 500 }, counts: { 1: 10, 2: 20, 3: 50, 4: 150, 5: 270 } })
  }
  const work = pathname.match(/^\/works\/(OL\d+W)\.json$/)?.[1]
  if (work) {
    const book = BOOKS.find((item) => item.key === `/works/${work}`)
    if (!book) return json(route, { error: 'notfound' }, 404)
    return json(route, {
      key: book.key,
      title: book.title,
      type: { key: '/type/work' },
      description: `${book.title} é uma história de aventura. `.repeat(30),
      covers: [book.cover_i],
      first_publish_date: String(book.first_publish_year),
      subjects: ['Fantasy', 'series:Exemplo', 'Reading Level-Grade 9', 'Adventure'],
      authors: book.author_key.map((key) => ({ author: { key: `/authors/${key}` } })),
    })
  }
  const author = pathname.match(/^\/authors\/(OL\d+A)\.json$/)?.[1]
  if (author) {
    if (!AUTHORS[author]) return json(route, { error: 'notfound' }, 404)
    return json(route, { key: `/authors/${author}`, type: { key: '/type/author' }, ...AUTHORS[author] })
  }
  return json(route, {}, 404)
}

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route('https://openlibrary.org/**', handleOpenLibrary)
    await page.route('https://covers.openlibrary.org/**', (route) => route.fulfill({ contentType: 'image/png', body: IMAGE }))
    await page.route(/fonts\.(googleapis|gstatic)\.com/, (route) => route.fulfill({ status: 200, body: '' }))
    await use(page)
  },
})

export { expect }

// Clica e espera o aviso ao mesmo tempo: o aviso dura 3,5 s e o clique pode demorar em máquinas lentas.
export const clickAndExpectToast = async (page, button, text) => {
  await Promise.all([page.locator('.toast', { hasText: text }).waitFor(), button.click()])
}

export const signUp = async (page, name = 'leitor') => {
  await page.goto('/signup')
  const form = page.locator('[data-pane="signup"]')
  await form.getByLabel('Nome de usuário').fill(name)
  await form.getByLabel('Email').fill(`${name}@teste.test`)
  await form.getByLabel('Senha', { exact: true }).fill('senha-de-teste-123')
  await form.getByLabel('Repetir senha').fill('senha-de-teste-123')
  await form.getByRole('button', { name: 'Criar conta' }).click()
  await expect(page).toHaveURL('/')
}
