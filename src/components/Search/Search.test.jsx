import { beforeEach, describe, expect, it } from "vitest"
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

const field = () => screen.getByRole("combobox", { name: "Buscar livros" })

describe("Search", () => {
    beforeEach(() => localStorage.clear())

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
})
