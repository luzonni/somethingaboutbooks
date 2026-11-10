import { beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, useLocation } from "react-router-dom"
import { searchBooks } from "../../api/openLibrary"
import Search from "."

vi.mock("../../api/openLibrary", () => ({ searchBooks: vi.fn() }))

const DUNE = { id: "OL893415W", title: "Duna", author: "Frank Herbert", cover: "https://covers.openlibrary.org/b/id/1-M.jpg" }

const Location = () => {
    const location = useLocation()
    return <output>{`${location.pathname}${location.search}`}</output>
}

const renderSearch = (props) =>
    render(
        <MemoryRouter>
            <Search {...props} />
            <Location />
        </MemoryRouter>
    )

const field = () => screen.getByRole("combobox", { name: "Buscar livros" })

describe("Search", () => {
    beforeEach(() => {
        localStorage.clear()
        searchBooks.mockReset()
        searchBooks.mockResolvedValue({ books: [], total: 0, hasMore: false })
    })

    it("leva a busca para a URL da página de livros", async () => {
        renderSearch()
        await userEvent.type(screen.getByRole("combobox", { name: "Buscar livros" }), "o hobbit{Enter}")
        expect(screen.getByRole("status").textContent).toBe("/books?q=o+hobbit")
    })

    it("mantém o gênero selecionado", async () => {
        renderSearch({ extraParams: "genero=fantasy" })
        await userEvent.type(screen.getByRole("combobox", { name: "Buscar livros" }), "dragão{Enter}")
        expect(screen.getByRole("status").textContent).toContain("genero=fantasy")
        expect(screen.getByRole("status").textContent).toContain("q=drag")
    })

    it("ignora espaços em branco", async () => {
        renderSearch()
        await userEvent.type(screen.getByRole("combobox", { name: "Buscar livros" }), "   {Enter}")
        expect(screen.getByRole("status").textContent).toBe("/books")
    })

    it("sugere buscas recentes ao focar o campo", async () => {
        localStorage.setItem("sab:recent-searches", JSON.stringify(["duna", "o hobbit"]))
        renderSearch()
        await userEvent.click(field())
        expect(field().getAttribute("aria-expanded")).toBe("true")
        expect(screen.getAllByRole("option").map((option) => option.textContent)).toEqual(["duna", "o hobbit"])
    })

    it("filtra as recentes pelo que foi digitado", async () => {
        localStorage.setItem("sab:recent-searches", JSON.stringify(["duna", "o hobbit"]))
        renderSearch()
        await userEvent.type(field(), "hob")
        expect(screen.getAllByRole("option").map((option) => option.textContent)).toEqual(["o hobbit"])
    })

    it("escolhe uma recente com as setas e Enter", async () => {
        localStorage.setItem("sab:recent-searches", JSON.stringify(["duna", "o hobbit"]))
        renderSearch()
        await userEvent.click(field())
        await userEvent.keyboard("{ArrowDown}{ArrowDown}")
        expect(screen.getByRole("option", { name: "o hobbit" }).getAttribute("aria-selected")).toBe("true")
        expect(field().getAttribute("aria-activedescendant")).toBe(screen.getByRole("option", { name: "o hobbit" }).id)
        await userEvent.keyboard("{Enter}")
        expect(screen.getByRole("status").textContent).toBe("/books?q=o+hobbit")
    })

    it("guarda a busca feita no histórico", async () => {
        renderSearch()
        await userEvent.type(field(), "duna{Enter}")
        expect(JSON.parse(localStorage.getItem("sab:recent-searches"))).toEqual(["duna"])
    })

    it("fecha a lista com Esc e limpa o histórico", async () => {
        localStorage.setItem("sab:recent-searches", JSON.stringify(["duna"]))
        renderSearch()
        await userEvent.click(field())
        await userEvent.keyboard("{Escape}")
        expect(field().getAttribute("aria-expanded")).toBe("false")
        await userEvent.keyboard("{ArrowDown}")
        await userEvent.click(screen.getByRole("button", { name: "Limpar histórico" }))
        expect(screen.queryAllByRole("option")).toHaveLength(0)
        expect(localStorage.getItem("sab:recent-searches")).toBeNull()
    })

    it("sugere livros enquanto a pessoa digita", async () => {
        searchBooks.mockResolvedValue({ books: [DUNE], total: 1, hasMore: false })
        renderSearch()
        await userEvent.type(field(), "dun")
        const option = await screen.findByRole("option", { name: /Duna.*Frank Herbert/ })
        expect(searchBooks).toHaveBeenCalledTimes(1)
        expect(searchBooks.mock.calls[0][0]).toMatchObject({ query: "dun", limit: 5 })
        await userEvent.click(option)
        expect(screen.getByRole("status").textContent).toBe("/books/OL893415W")
    })

    it("não busca sugestões com menos de 3 letras", async () => {
        renderSearch()
        await userEvent.type(field(), "du")
        await new Promise((resolve) => setTimeout(resolve, 400))
        expect(searchBooks).not.toHaveBeenCalled()
    })

    it("continua funcionando se as sugestões falharem", async () => {
        searchBooks.mockRejectedValue(new Error("offline"))
        renderSearch()
        await userEvent.type(field(), "duna")
        await waitFor(() => expect(searchBooks).toHaveBeenCalled())
        expect(screen.queryAllByRole("option")).toHaveLength(0)
        await userEvent.keyboard("{Enter}")
        expect(screen.getByRole("status").textContent).toBe("/books?q=duna")
    })
})
