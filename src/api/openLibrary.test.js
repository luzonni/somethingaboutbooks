import { beforeEach, describe, expect, it, vi } from "vitest"
import {
    ApiError,
    clearApiCache,
    cleanTags,
    cleanText,
    cleanTitle,
    coverUrl,
    curateBooks,
    dedupeBooks,
    getAuthor,
    getAuthorWorks,
    getBookExtras,
    genreList,
    getTrendingBooks,
    getWork,
    trendingList,
    authorBooksList,
    idFromKey,
    similarBooksList,
    searchBooks,
} from "./openLibrary"

const mockFetch = (handler) => {
    const fetchMock = vi.fn(async (url) => {
        const { status = 200, body = {} } = handler(url.toString())
        return { ok: status < 400, status, json: async () => body }
    })
    vi.stubGlobal("fetch", fetchMock)
    return fetchMock
}

describe("openLibrary", () => {
    beforeEach(() => clearApiCache())

    it("extrai o id da chave", () => {
        expect(idFromKey("/works/OL27482W")).toBe("OL27482W")
    })

    it("ignora capas inválidas", () => {
        expect(coverUrl(-1)).toBe("")
        expect(coverUrl(123, "L")).toBe("https://covers.openlibrary.org/b/id/123-L.jpg")
    })

    it("limpa links e referências de descrições", () => {
        const raw = "Veja [o livro](https://x.com) e [outro][1].\r\n\r\n----------\r\nRodapé\r\n[1]: https://y.com"
        expect(cleanText({ value: raw })).toBe("Veja o livro e outro.")
    })

    it("remove Markdown, HTML e a linha de fonte das biografias", () => {
        const raw =
            'Autor de *The 48 Laws of Power*, **Mastery** e 2 * 3 livros.\r\n\r\n**Source**: <a href="https://w.org" target="blanck">Robert</a> on Wikipedia'
        expect(cleanText(raw)).toBe("Autor de The 48 Laws of Power, Mastery e 2 * 3 livros.")
    })

    it("remove referências indentadas e créditos da Wikipedia", () => {
        const raw = "Autor famoso.\r\n- Wikipedia\r\n\r\n([Source][1])\r\n\r\n\r\n  [1]: http://en.wikipedia.org/wiki/Autor"
        expect(cleanText({ value: raw })).toBe("Autor famoso.")
    })

    it("mantém o texto de tags HTML e decodifica entidades", () => {
        expect(cleanText('Veja <a href="x">este link</a> &amp; <em>mais</em>')).toBe("Veja este link & mais")
    })

    it("codifica a busca e prefere a edição em português", async () => {
        const fetchMock = mockFetch(() => ({
            body: {
                numFound: 30,
                docs: [
                    {
                        key: "/works/OL1W",
                        title: "The Hobbit",
                        author_name: ["J.R.R. Tolkien"],
                        cover_i: 1,
                        editions: { docs: [{ title: "O Hobbit", language: ["por"], cover_i: 2 }] },
                    },
                ],
            },
        }))

        const result = await searchBooks({ query: "o hobbit & cia" })

        const url = new URL(fetchMock.mock.calls[0][0])
        expect(url.searchParams.get("q")).toBe("o hobbit & cia")
        expect(url.searchParams.get("sort")).toBeNull()
        expect(result.hasMore).toBe(true)
        expect(result.books[0]).toMatchObject({ id: "OL1W", title: "O Hobbit", author: "J.R.R. Tolkien" })
        expect(result.books[0].cover).toContain("/b/id/2-M.jpg")
    })

    it("aplica só ordenações conhecidas", async () => {
        const fetchMock = mockFetch(() => ({ body: { numFound: 0, docs: [] } }))
        await searchBooks({ query: "x", sort: "rating" })
        await searchBooks({ query: "x", sort: "hackeado" })
        const sortOf = (call) => new URL(fetchMock.mock.calls[call][0]).searchParams.get("sort")
        expect(sortOf(0)).toBe("rating")
        expect(sortOf(1)).toBeNull()
    })

    it("informa que não há mais páginas", async () => {
        mockFetch(() => ({ body: { numFound: 24, docs: [] } }))
        const result = await searchBooks({ query: "x", page: 1, limit: 24 })
        expect(result.hasMore).toBe(false)
    })

    it("usa o cache em buscas repetidas", async () => {
        const fetchMock = mockFetch(() => ({ body: { numFound: 0, docs: [] } }))
        await searchBooks({ query: "x" })
        await searchBooks({ query: "x" })
        expect(fetchMock).toHaveBeenCalledTimes(1)
    })

    it("lança ApiError quando a API falha", async () => {
        mockFetch(() => ({ status: 503 }))
        await expect(searchBooks({ query: "x" })).rejects.toBeInstanceOf(ApiError)
    })

    it("traduz falha de rede em ApiError", async () => {
        vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("offline")))
        await expect(searchBooks({ query: "x" })).rejects.toThrow("Não foi possível conectar")
    })

    it("carrega a obra sem depender de autor e notas", async () => {
        mockFetch(() => ({
            body: { title: "Livro", covers: [-1, 7], authors: [{ author: { key: "/authors/OL9A" } }] },
        }))

        const work = await getWork("OL1W")

        expect(work).toMatchObject({ title: "Livro", authorIds: ["OL9A"] })
        expect(work.cover).toContain("/b/id/7-L.jpg")
    })

    it("segue obras redirecionadas até a obra final", async () => {
        mockFetch((url) =>
            url.includes("/works/OLvelhaW.json")
                ? { body: { type: { key: "/type/redirect" }, location: "/works/OLnovaW" } }
                : { body: { key: "/works/OLnovaW", title: "Obra final", type: { key: "/type/work" } } }
        )

        const work = await getWork("OLvelhaW")

        expect(work).toMatchObject({ id: "OLnovaW", title: "Obra final" })
        expect(work.url).toContain("/works/OLnovaW")
    })

    it("trata obras excluídas ou sem título como não encontradas", async () => {
        mockFetch((url) => ({ body: url.includes("OLapagadaW") ? { type: { key: "/type/delete" } } : { key: "/works/OLvaziaW" } }))

        await expect(getWork("OLapagadaW")).rejects.toMatchObject({ status: 404 })
        await expect(getWork("OLvaziaW")).rejects.toMatchObject({ status: 404 })
    })

    it("não entra em laço com redirecionamentos circulares", async () => {
        mockFetch(() => ({ body: { type: { key: "/type/redirect" }, location: "/works/OLcicloW" } }))
        await expect(getWork("OLcicloW")).rejects.toMatchObject({ status: 404 })
    })

    it("traz o número de páginas das edições", async () => {
        mockFetch((url) =>
            url.includes("/search.json") ? { body: { docs: [{ number_of_pages_median: 310 }] } } : { body: {} }
        )
        const extras = await getBookExtras({ id: "OL1W", authorIds: [] })
        expect(extras.pages).toBe(310)
    })

    it("não falha quando autor e notas estão indisponíveis", async () => {
        mockFetch(() => ({ status: 500 }))

        const extras = await getBookExtras({ id: "OL1W", authorIds: ["OL9A"] })

        expect(extras).toEqual({ authors: [], author: "Autor desconhecido", rating: null, ratingCount: 0, ratingCounts: {}, pages: null })
    })

    it("busca gêneros por etiquetas precisas e mais lidos", async () => {
        const fetchMock = mockFetch(() => ({ body: { numFound: 0, docs: [] } }))

        await genreList("fantasy").load()

        const url = new URL(fetchMock.mock.calls[0][0])
        expect(url.pathname).toBe("/search.json")
        expect(url.searchParams.get("q")).toContain("subject_key:fantasy_fiction")
        expect(url.searchParams.get("q")).toContain("-subject_key:science_fiction")
        expect(url.searchParams.get("sort")).toBe("readinglog")
    })

    it("mantém a ordem por relevância quando há texto na busca do gênero", async () => {
        const fetchMock = mockFetch(() => ({ body: { numFound: 0, docs: [] } }))

        await searchBooks({ query: "dragão", genre: "fantasy" })

        const url = new URL(fetchMock.mock.calls[0][0])
        expect(url.searchParams.get("q")).toMatch(/^dragão subject_key:fantasy_fiction/)
        expect(url.searchParams.get("sort")).toBeNull()
    })

    it("guarda as listas no navegador entre visitas", async () => {
        const works = [{ key: "/works/OL1W", title: "Livro", author_name: ["A"], cover_i: 1 }]
        const fetchMock = mockFetch(() => ({ body: { works } }))

        await getTrendingBooks()
        clearApiCache()
        const books = await getTrendingBooks()

        expect(fetchMock).toHaveBeenCalledTimes(1)
        expect(books[0].id).toBe("OL1W")
    })

    it("permite ler a lista guardada sem esperar a rede", async () => {
        mockFetch(() => ({ body: { works: [{ key: "/works/OL1W", title: "Livro" }] } }))
        const list = genreList("x")
        expect(list.peek()).toBeNull()

        const trending = trendingList()
        expect(trending.peek()).toBeNull()
        await trending.load()
        expect(trending.peek()[0].id).toBe("OL1W")
    })

    it("lista outros livros do autor sem repetir o atual", async () => {
        const docs = [
            { key: "/works/OL1W", title: "Atual", author_name: ["Ana"], cover_i: 1 },
            { key: "/works/OL2W", title: "Outro", author_name: ["Ana"], cover_i: 2 },
        ]
        const fetchMock = mockFetch(() => ({ body: { numFound: 2, docs } }))

        const books = await authorBooksList('Ana "A" Lima', "OL1W").load()

        expect(new URL(fetchMock.mock.calls[0][0]).searchParams.get("q")).toBe('author:"Ana A Lima"')
        expect(books.map(({ id }) => id)).toEqual(["OL2W"])
    })

    it("usa o gênero do livro para sugerir parecidos", async () => {
        const fetchMock = mockFetch(() => ({ body: { numFound: 0, docs: [] } }))

        await similarBooksList(["Dragons", "Fantasy fiction"], "OL1W").load()
        expect(new URL(fetchMock.mock.calls[0][0]).searchParams.get("q")).toContain("subject_key:fantasy_fiction")

        await similarBooksList(["Power"], "OL1W").load()
        expect(new URL(fetchMock.mock.calls[1][0]).searchParams.get("q")).toBe('subject:"Power"')

        expect(similarBooksList([], "OL1W")).toBeNull()
    })

    it("não guarda listas vazias", async () => {
        const fetchMock = mockFetch(() => ({ body: { works: [] } }))

        await getTrendingBooks()
        clearApiCache()
        await getTrendingBooks()

        expect(fetchMock).toHaveBeenCalledTimes(2)
    })
})

describe("autor", () => {
    beforeEach(() => clearApiCache())

    it("traz links seguros e o Wikidata como alternativa", async () => {
        mockFetch(() => ({
            body: {
                name: "Ana",
                fuller_name: "Ana Maria",
                links: [{ title: "Site", url: "https://ana.com" }, { title: "Ruim", url: "javascript:alert(1)" }],
                remote_ids: { wikidata: "Q1" },
            },
        }))
        const author = await getAuthor("OL1A")
        expect(author).toMatchObject({ name: "Ana", fullName: "Ana Maria", wikipedia: "https://www.wikidata.org/wiki/Q1" })
        expect(author.links).toEqual([{ title: "Site", url: "https://ana.com" }])
    })

    it("busca as obras do autor pelas mais lidas e pagina", async () => {
        const fetchMock = mockFetch(() => ({ body: { numFound: 30, docs: [{ key: "/works/OL1W", title: "Obra" }] } }))
        const result = await getAuthorWorks("OL1A")
        const url = new URL(fetchMock.mock.calls[0][0])
        expect(url.searchParams.get("q")).toBe("author_key:OL1A")
        expect(url.searchParams.get("sort")).toBe("readinglog")
        expect(result).toMatchObject({ total: 30, hasMore: true })
    })
})

describe("cleanTags", () => {
    it("deixa legíveis as etiquetas de série", () => {
        expect(cleanTags(["series:Harry_Potter", "Ghosts"])).toEqual(["Harry Potter", "Ghosts"])
    })

    it("descarta etiquetas técnicas e de catalogação", () => {
        const tags = [
            "nyt:hardcover-fiction=2008-01-01",
            "award:hugo=1990",
            "open_syllabus_project",
            "Open Library Staff Picks",
            "Reading Level-Grade 9",
            "Translations into Marathi",
            "English Translations",
            "Accessible book",
            "Fantasy",
        ]
        expect(cleanTags(tags)).toEqual(["Fantasy"])
    })

    it("mantém assuntos normais com dois-pontos e remove repetidos", () => {
        const history = "Modern history: c 1700 to c 1900"
        expect(cleanTags([history, "Magic", "magic"])).toEqual([history, "Magic"])
    })

    it("aplica o limite depois da limpeza", () => {
        expect(cleanTags(["Accessible book", "A", "B", "C"], 2)).toEqual(["A", "B"])
        expect(cleanTags(undefined, 2)).toEqual([])
    })
})

describe("cleanTitle", () => {
    it("remove anotações de catálogo", () => {
        expect(cleanTitle("The Adventures of Sherlock Holmes [12 stories]")).toBe("The Adventures of Sherlock Holmes")
        expect(cleanTitle("... Trotzdem Ja zum Leben sagen")).toBe("Trotzdem Ja zum Leben sagen")
    })

    it("mantém títulos normais", () => {
        expect(cleanTitle("1984")).toBe("1984")
        expect(cleanTitle("O Hobbit (edição de bolso)")).toBe("O Hobbit (edição de bolso)")
    })
})

describe("dedupeBooks", () => {
    const book = (id, title, cover = "", author = "James Clear") => ({ id, title, cover, author })

    it("junta títulos iguais ignorando acentos, caixa e pontuação", () => {
        const books = [book("1", "Hábitos Atômicos", "a.jpg"), book("2", "habitos atomicos!"), book("3", "Outro livro")]
        expect(dedupeBooks(books).map(({ id }) => id)).toEqual(["1", "3"])
    })

    it("troca a versão sem capa pela que tem capa, mantendo a posição", () => {
        const books = [book("1", "Duna"), book("2", "Fundação", "f.jpg"), book("3", "DUNA", "d.jpg")]
        expect(dedupeBooks(books).map(({ id }) => id)).toEqual(["3", "2"])
    })

    it("mantém títulos iguais de autores diferentes e remove ids repetidos", () => {
        const books = [book("1", "Poemas", "", "A"), book("2", "Poemas", "", "B"), book("1", "Poemas", "", "A")]
        expect(dedupeBooks(books).map(({ id }) => id)).toEqual(["1", "2"])
    })
})

describe("curateBooks", () => {
    const book = (id, author, title = "Título", cover = "c.jpg") => ({ id, author, title, cover })

    it("limita livros por autor para variar a lista", () => {
        const books = [book("1", "A"), book("2", "A"), book("3", "A"), book("4", "B")]
        expect(curateBooks(books).map(({ id }) => id)).toEqual(["1", "2", "4"])
    })

    it("remove livros sem capa e títulos em alfabetos não latinos", () => {
        const books = [book("1", "A", "Преступление"), book("2", "B", "海辺のカフカ"), book("3", "C", "O Hobbit", ""), book("4", "D", "Coração: 1984!")]
        expect(curateBooks(books).map(({ id }) => id)).toEqual(["4"])
    })

    it("respeita o limite", () => {
        const books = [book("1", "A"), book("2", "B"), book("3", "C")]
        expect(curateBooks(books, { limit: 2 })).toHaveLength(2)
    })
})
