import { beforeEach, describe, expect, it, vi } from "vitest"
import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { genreList, topRatedList, trendingList } from "../../api/openLibrary"
import { saveLibrary } from "../../services/library"
import { createReader, renderWithProviders } from "../../test/renderWithProviders"
import Home from "."

const TRENDING = [
    { id: "OL1W", title: "Hábitos Atômicos", author: "James Clear", cover: "https://covers.openlibrary.org/b/id/1-M.jpg" },
    { id: "OL2W", title: "Pai Rico, Pai Pobre", author: "Robert Kiyosaki", cover: "https://covers.openlibrary.org/b/id/2-M.jpg" },
]

vi.mock("../../api/openLibrary", async (importOriginal) => {
    const list = (books = []) => ({ peek: () => null, load: async () => books })
    return {
        ...(await importOriginal()),
        trendingList: vi.fn(() => list([])),
        topRatedList: vi.fn(() => list()),
        genreList: vi.fn(() => list()),
    }
})

const withReadingBook = async (book) => {
    const user = await createReader()
    const now = new Date().toISOString()
    saveLibrary(user.id, {
        books: { [book.id]: { shelf: "reading", addedAt: now, updatedAt: now, ...book } },
        lists: [],
        sessions: [],
        goals: {},
    })
}

describe("Home", () => {
    beforeEach(() => {
        trendingList.mockImplementation(() => ({ peek: () => null, load: async () => TRENDING }))
    })

    it("convida o visitante a buscar e explorar, sem repetir o Criar conta da barra no desktop", async () => {
        renderWithProviders(<Home />)
        expect(screen.getByRole("heading", { level: 1, name: "Encontre a sua próxima história!" })).toBeTruthy()
        expect(screen.getByRole("link", { name: "Explorar livros" }).getAttribute("href")).toBe("/books")
        expect(screen.getByRole("combobox", { name: "Buscar livros" })).toBeTruthy()
        // Fora de telas pequenas o botão fica escondido: a barra do topo já oferece "Criar conta".
        expect(screen.queryByRole("link", { name: "Criar conta" })).toBeNull()
        expect(document.querySelector('main a[href="/signup"], a.hero__signup')?.textContent).toBe("Criar conta")
    })

    it("cumprimenta quem entrou e ainda não está lendo nada", async () => {
        await createReader()
        renderWithProviders(<Home />)
        expect(await screen.findByRole("heading", { level: 1, name: "Boa leitura, leitor!" })).toBeTruthy()
        expect(screen.getByRole("link", { name: "Explorar livros" }).getAttribute("href")).toBe("/books")
        expect(screen.queryByRole("link", { name: "Continuar lendo" })).toBeNull()
    })

    it("mostra o livro em leitura com o progresso e o atalho para o Pomodoro", async () => {
        await withReadingBook({ id: "OL9W", title: "Quarta Asa", author: "Rebecca Yarros", cover: "", pages: 800, currentPage: 200 })
        renderWithProviders(<Home />)

        expect(await screen.findByRole("heading", { level: 1, name: "Boa leitura, leitor!" })).toBeTruthy()
        expect(screen.getByRole("link", { name: "Continuar lendo" }).getAttribute("href")).toBe("/pomodoro?livro=OL9W")
        expect(screen.getByRole("progressbar", { name: "Progresso de leitura de Quarta Asa" }).getAttribute("aria-valuenow")).toBe("25")
        expect(screen.getByText("200 de 800 páginas")).toBeTruthy()
    })

    it("pede a página atual quando o progresso ainda não foi marcado", async () => {
        await withReadingBook({ id: "OL9W", title: "Quarta Asa", author: "Rebecca Yarros", cover: "" })
        renderWithProviders(<Home />)
        const link = await screen.findByRole("link", { name: "Marque a página" })
        expect(link.getAttribute("href")).toBe("/pomodoro?livro=OL9W")
        expect(screen.queryByRole("progressbar")).toBeNull()
    })

    it("troca os livros do gênero pelos botões", async () => {
        genreList.mockImplementation((slug) => ({
            peek: () => null,
            load: async () => [{ id: `OL-${slug}`, title: `Livro de ${slug}`, author: "Autor", cover: "https://covers.openlibrary.org/b/id/3-M.jpg" }],
        }))
        renderWithProviders(<Home />)
        const fantasy = screen.getByRole("button", { name: "Fantasia" })
        const horror = screen.getByRole("button", { name: "Terror" })
        expect(fantasy.getAttribute("aria-pressed")).toBe("true")
        expect(genreList).toHaveBeenLastCalledWith("fantasy")

        await userEvent.click(horror)

        expect(horror.getAttribute("aria-pressed")).toBe("true")
        expect(fantasy.getAttribute("aria-pressed")).toBe("false")
        expect(genreList).toHaveBeenLastCalledWith("horror")
        expect(await screen.findByText("Livro de horror")).toBeTruthy()
        expect(screen.getByRole("link", { name: "Ver mais: Terror" }).getAttribute("href")).toBe("/books?genero=horror")
    })

    it("mostra as seções na ordem: em alta, gêneros e mais bem avaliados", () => {
        renderWithProviders(<Home />)
        const titles = screen.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent)
        const order = ["Em alta nesta semana", "Explore por gênero", "Mais bem avaliados"].map((title) => titles.indexOf(title))
        expect(order.every((index) => index >= 0)).toBe(true)
        expect([...order].sort((a, b) => a - b)).toEqual(order)
    })

    it("leque usa o fim dos mais bem avaliados e carrega a lista uma vez só", async () => {
        const books = Array.from({ length: 12 }, (_, index) => ({
            id: `OL${index}W`,
            title: `Clássico ${index}`,
            author: `Autor ${index}`,
            cover: `https://covers.openlibrary.org/b/id/${index}-M.jpg`,
        }))
        const load = vi.fn(async () => books)
        topRatedList.mockImplementation(() => ({ peek: () => null, load }))
        renderWithProviders(<Home />)

        expect(await screen.findByText("Entre os mais bem avaliados")).toBeTruthy()
        expect(topRatedList).toHaveBeenCalledWith({ limit: 12 })
        expect(load).toHaveBeenCalledTimes(1)
    })

    it("leque mostra os livros da lista Quero ler de quem entrou", async () => {
        const user = await createReader()
        const now = new Date().toISOString()
        saveLibrary(user.id, {
            books: {
                OL5W: { id: "OL5W", title: "Duna", author: "Frank Herbert", cover: "https://covers.openlibrary.org/b/id/5-M.jpg", shelf: "want", addedAt: now, updatedAt: now },
            },
            lists: [],
            sessions: [],
            goals: {},
        })
        const load = vi.fn(async () => [])
        topRatedList.mockImplementation(() => ({ peek: () => null, load }))
        renderWithProviders(<Home />)

        expect(await screen.findByText("Na sua lista Quero ler")).toBeTruthy()
        expect(load).toHaveBeenCalledTimes(1)
    })
})
