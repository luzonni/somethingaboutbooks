import { beforeEach, describe, expect, it, vi } from "vitest"
import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Route, Routes, useLocation } from "react-router-dom"
import { getTrendingBooks, searchBooks } from "../../api/openLibrary"
import { renderWithProviders } from "../../test/renderWithProviders"
import AllBooksPage from "."

vi.mock("../../api/openLibrary", async (importOriginal) => ({
    ...(await importOriginal()),
    searchBooks: vi.fn(),
    getTrendingBooks: vi.fn(),
}))

const book = (id, title, author = "Autor") => ({ id, title, author, cover: "", year: 2000, rating: null, ratingCount: 0 })

const Location = () => {
    const location = useLocation()
    return <output data-testid="local">{`${location.pathname}${location.search}`}</output>
}

const renderPage = (route) =>
    renderWithProviders(
        <Routes>
            <Route
                path="/books"
                element={
                    <>
                        <AllBooksPage />
                        <Location />
                    </>
                }
            />
        </Routes>,
        { route }
    )

describe("AllBooksPage", () => {
    beforeEach(() => {
        searchBooks.mockReset()
        getTrendingBooks.mockReset()
    })

    it("sem busca mostra os livros em alta", async () => {
        getTrendingBooks.mockResolvedValue([book("OL1W", "O Hobbit")])
        renderPage("/books")
        expect(await screen.findByRole("heading", { name: "O Hobbit" })).toBeTruthy()
        expect(screen.getByText("Em alta nesta semana")).toBeTruthy()
        expect(searchBooks).not.toHaveBeenCalled()
        expect(screen.queryByLabelText("Ordenar por")).toBeNull()
    })

    it("busca pelo texto da URL e mostra o total de resultados", async () => {
        searchBooks.mockResolvedValue({ books: [book("OL2W", "Duna")], total: 1234, hasMore: false })
        renderPage("/books?q=duna")
        expect(await screen.findByRole("heading", { name: "Duna" })).toBeTruthy()
        expect(screen.getByText("1.234 resultados")).toBeTruthy()
        expect(searchBooks.mock.calls[0][0]).toMatchObject({ query: "duna", genre: "", sort: "", page: 1 })
        expect(document.title).toContain("Busca: duna")
    })

    it("remove livros repetidos ao carregar mais páginas", async () => {
        searchBooks
            .mockResolvedValueOnce({ books: [book("OL1W", "Duna"), book("OL2W", "Messias de Duna")], total: 3, hasMore: true })
            .mockResolvedValueOnce({ books: [book("OL2W", "Messias de Duna"), book("OL3W", "Filhos de Duna")], total: 3, hasMore: false })
        renderPage("/books?q=duna")
        await userEvent.click(await screen.findByRole("button", { name: "Carregar mais" }))
        expect(await screen.findByRole("heading", { name: "Filhos de Duna" })).toBeTruthy()
        expect(screen.getAllByRole("heading", { name: "Messias de Duna" })).toHaveLength(1)
        expect(searchBooks.mock.calls[1][0]).toMatchObject({ page: 2 })
        expect(screen.queryByRole("button", { name: "Carregar mais" })).toBeNull()
    })

    it("mostra o gênero no título e marca o filtro ativo", async () => {
        searchBooks.mockResolvedValue({ books: [book("OL4W", "Drácula")], total: 1, hasMore: false })
        renderPage("/books?genero=horror")
        expect(screen.getByRole("heading", { level: 1, name: "Terror" })).toBeTruthy()
        expect(screen.getByRole("link", { name: "Terror" }).getAttribute("aria-current")).toBe("true")
        expect(screen.getByRole("link", { name: "Todos" }).getAttribute("aria-current")).toBeNull()
        await screen.findByRole("heading", { name: "Drácula" })
    })

    it("ordenação muda a URL mantendo busca e gênero", async () => {
        searchBooks.mockResolvedValue({ books: [book("OL2W", "Duna")], total: 1, hasMore: false })
        renderPage("/books?q=duna&genero=science_fiction")
        await userEvent.selectOptions(screen.getByLabelText("Ordenar por"), "rating")
        expect(screen.getByTestId("local").textContent).toBe("/books?q=duna&genero=science_fiction&ordem=rating")
        await screen.findByRole("heading", { name: "Duna" })
        expect(searchBooks).toHaveBeenLastCalledWith(expect.objectContaining({ sort: "rating" }))
    })

    it("avisa quando não encontra nada", async () => {
        searchBooks.mockResolvedValue({ books: [], total: 0, hasMore: false })
        renderPage("/books?q=xyzxyz")
        expect(await screen.findByText("Nenhum livro encontrado")).toBeTruthy()
    })

    it("mostra o erro e tenta de novo", async () => {
        searchBooks
            .mockRejectedValueOnce(new Error("A Open Library está indisponível no momento."))
            .mockResolvedValueOnce({ books: [book("OL2W", "Duna")], total: 1, hasMore: false })
        renderPage("/books?q=duna")
        expect((await screen.findByRole("alert")).textContent).toContain("indisponível")
        await userEvent.click(screen.getByRole("button", { name: /tentar/i }))
        expect(await screen.findByRole("heading", { name: "Duna" })).toBeTruthy()
        expect(searchBooks).toHaveBeenCalledTimes(2)
    })
})
