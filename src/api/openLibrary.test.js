import { beforeEach, describe, expect, it, vi } from "vitest"
import {
    ApiError,
    clearApiCache,
    cleanText,
    coverUrl,
    getBookDetails,
    idFromKey,
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

        const result = await searchBooks({ query: "o hobbit & cia", genre: "fantasy" })

        const url = new URL(fetchMock.mock.calls[0][0])
        expect(url.searchParams.get("q")).toBe("o hobbit & cia subject_key:fantasy")
        expect(result.hasMore).toBe(true)
        expect(result.books[0]).toMatchObject({ id: "OL1W", title: "O Hobbit", author: "J.R.R. Tolkien" })
        expect(result.books[0].cover).toContain("/b/id/2-M.jpg")
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

    it("mantém os detalhes do livro quando autor e notas falham", async () => {
        mockFetch((url) => {
            if (url.includes("/works/OL1W.json")) {
                return {
                    body: {
                        title: "Livro",
                        covers: [-1, 7],
                        authors: [{ author: { key: "/authors/OL9A" } }],
                    },
                }
            }
            return { status: 500 }
        })

        const book = await getBookDetails("OL1W")

        expect(book.title).toBe("Livro")
        expect(book.author).toBe("Autor desconhecido")
        expect(book.rating).toBeNull()
        expect(book.cover).toContain("/b/id/7-L.jpg")
    })
})
