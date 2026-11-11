import { beforeEach, describe, expect, it, vi } from "vitest"
import { clearApiCache } from "./openLibrary"
import {
    clearGoogleCache,
    getGoogleWork,
    googleCover,
    hasGoogleBooks,
    isGoogleId,
    searchGoogleBooks,
    suggestGoogleBooks,
} from "./googleBooks"
import { getBookExtras, getWork, searchBooks, suggestBooks } from "./books"

const mockFetch = (handler) => {
    const fetchMock = vi.fn(async (url) => {
        const { status = 200, body = {} } = handler(url.toString())
        return { ok: status < 400, status, json: async () => body }
    })
    vi.stubGlobal("fetch", fetchMock)
    return fetchMock
}

const volume = (id, info) => ({ id, volumeInfo: { language: "pt-BR", authors: ["Rebecca Yarros"], ...info } })
const thumb = (id) => ({ thumbnail: `http://books.google.com/books/content?id=${id}&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api` })

beforeEach(() => {
    clearGoogleCache()
    clearApiCache()
    vi.stubEnv("VITE_GOOGLE_BOOKS_KEY", "chave-de-teste")
})

describe("googleBooks", () => {
    it("usa a chave só quando ela existe", () => {
        expect(hasGoogleBooks()).toBe(true)
        vi.stubEnv("VITE_GOOGLE_BOOKS_KEY", "")
        expect(hasGoogleBooks()).toBe(false)
    })

    it("separa ids do Google dos da Open Library", () => {
        expect(isGoogleId("g-abc")).toBe(true)
        expect(isGoogleId("OL1W")).toBe(false)
    })

    it("troca a capa por https, sem orelha e no tamanho pedido", () => {
        expect(googleCover(thumb("x").thumbnail, 3)).toBe(
            "https://books.google.com/books/content?id=x&printsec=frontcover&img=1&zoom=3&source=gbs_api"
        )
    })

    it("busca, descarta resumos e capítulos extras e prefere a edição brasileira", async () => {
        const fetchMock = mockFetch(() => ({
            body: {
                totalItems: 3,
                items: [
                    volume("pt", { title: "Quarta Asa", language: "pt", imageLinks: thumb("pt") }),
                    volume("br", { title: "Quarta Asa", imageLinks: thumb("br"), pageCount: 818 }),
                    volume("resumo", { title: "Resumo de Quarta Asa", imageLinks: thumb("r") }),
                    volume("extra", { title: "Quarta Asa: Capítulo Extra", imageLinks: thumb("e"), pageCount: 30 }),
                ],
            },
        }))

        const { books } = await searchGoogleBooks({ query: "quarta asa" })

        const url = new URL(fetchMock.mock.calls[0][0])
        expect(url.searchParams.get("q")).toBe("quarta asa")
        expect(url.searchParams.get("key")).toBe("chave-de-teste")
        expect(books.map((book) => book.id)).toEqual(["g-br"])
        expect(books[0]).toMatchObject({ title: "Quarta Asa", author: "Rebecca Yarros", pages: 818 })
    })

    it("busca o título exato quando o melhor resultado vem sem capa", async () => {
        const fetchMock = mockFetch((url) =>
            url.includes("intitle")
                ? { body: { items: [volume("comcapa", { title: "Quarta Asa", imageLinks: thumb("c") })] } }
                : { body: { items: [volume("semcapa", { title: "Quarta asa" }), volume("outro", { title: "Outro", imageLinks: thumb("o") })] } }
        )

        const books = await suggestGoogleBooks({ query: "Quarta Asa" })

        expect(fetchMock).toHaveBeenCalledTimes(2)
        expect(books[0]).toMatchObject({ id: "g-comcapa", title: "Quarta Asa" })
        expect(books[0].cover).toContain("id=c")
    })

    it("abre o livro com sinopse em texto, capa grande e gêneros legíveis", async () => {
        mockFetch(() => ({
            body: volume("abc", {
                title: "Quarta Asa",
                description: "<p>Primeiro parágrafo.</p><p>Segundo<br>com quebra.</p>",
                imageLinks: { ...thumb("abc"), large: "http://books.google.com/large?id=abc&zoom=4" },
                categories: ["Fiction / Fantasy / Romantic"],
                publisher: "Planeta Minotauro",
                pageCount: 818,
            }),
        }))

        const work = await getGoogleWork("g-abc")

        expect(work).toMatchObject({ id: "g-abc", source: "google", title: "Quarta Asa", publisher: "Planeta Minotauro", pages: 818 })
        expect(work.description).toBe("Primeiro parágrafo.\n\nSegundo\ncom quebra.")
        expect(work.cover).toBe("https://books.google.com/large?id=abc&zoom=3")
        expect(work.subjects).toEqual(["Fantasy", "Romantic"])
    })
})

describe("books (escolha da fonte)", () => {
    it("usa o Google na busca com texto e a Open Library nos gêneros", async () => {
        const fetchMock = mockFetch(() => ({ body: { items: [], docs: [], numFound: 0 } }))
        await searchBooks({ query: "quarta asa" })
        await searchBooks({ genre: "fantasy" })
        expect(fetchMock.mock.calls[0][0].toString()).toContain("googleapis.com")
        expect(fetchMock.mock.calls[1][0].toString()).toContain("openlibrary.org")
    })

    it("volta para a Open Library se o Google falhar", async () => {
        mockFetch((url) =>
            url.includes("googleapis")
                ? { status: 429 }
                : { body: { numFound: 1, docs: [{ key: "/works/OL1W", title: "Fourth Wing", author_name: ["Rebecca Yarros"], cover_i: 1 }] } }
        )
        const books = await suggestBooks({ query: "fourth wing" })
        expect(books[0].id).toBe("OL1W")
    })

    it("sem chave, usa só a Open Library", async () => {
        vi.stubEnv("VITE_GOOGLE_BOOKS_KEY", "")
        const fetchMock = mockFetch(() => ({ body: { docs: [], numFound: 0 } }))
        await searchBooks({ query: "quarta asa" })
        expect(fetchMock.mock.calls[0][0].toString()).toContain("openlibrary.org")
    })

    it("abre livros do Google e busca o autor na Open Library pelo nome", async () => {
        mockFetch((url) => {
            if (url.includes("googleapis")) return { body: volume("abc", { title: "Quarta Asa", averageRating: 4.5, ratingsCount: 10, pageCount: 818 }) }
            if (url.includes("/search/authors.json")) return { body: { docs: [{ key: "OL7A", name: "Rebecca Yarros" }] } }
            return { body: { name: "Rebecca Yarros", bio: "Autora." } }
        })

        const work = await getWork("g-abc")
        const extras = await getBookExtras(work)

        expect(extras).toMatchObject({ author: "Rebecca Yarros", rating: 4.5, ratingCount: 10, pages: 818 })
        expect(extras.authors[0]).toMatchObject({ id: "OL7A", name: "Rebecca Yarros" })
    })
})
