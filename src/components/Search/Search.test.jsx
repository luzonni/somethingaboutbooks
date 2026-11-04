import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, useLocation } from "react-router-dom"
import Search from "."

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

describe("Search", () => {
    it("leva a busca para a URL da página de livros", async () => {
        renderSearch()
        await userEvent.type(screen.getByRole("searchbox"), "o hobbit{Enter}")
        expect(screen.getByRole("status").textContent).toBe("/books?q=o+hobbit")
    })

    it("mantém o gênero selecionado", async () => {
        renderSearch({ extraParams: "genero=fantasy" })
        await userEvent.type(screen.getByRole("searchbox"), "dragão{Enter}")
        expect(screen.getByRole("status").textContent).toContain("genero=fantasy")
        expect(screen.getByRole("status").textContent).toContain("q=drag")
    })

    it("ignora espaços em branco", async () => {
        renderSearch()
        await userEvent.type(screen.getByRole("searchbox"), "   {Enter}")
        expect(screen.getByRole("status").textContent).toBe("/books")
    })
})
