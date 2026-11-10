import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import Info from "."

const PAGES = [
    ["about", "/sobre", "Sobre Nós"],
    ["terms", "/termos", "Termos de Uso"],
    ["privacy", "/privacidade", "Política de Privacidade"],
    ["support", "/suporte", "Suporte"],
]

const renderInfo = (route) =>
    render(
        <MemoryRouter initialEntries={[route]}>
            <Routes>
                {PAGES.map(([page, path]) => (
                    <Route key={page} path={path} element={<Info page={page} />} />
                ))}
            </Routes>
        </MemoryRouter>
    )

describe("Info", () => {
    it.each(PAGES)("a página %s mostra o título e marca o link atual", (_, path, title) => {
        renderInfo(path)
        expect(screen.getByRole("heading", { level: 1, name: title })).toBeTruthy()
        const nav = screen.getByRole("navigation", { name: "Páginas institucionais" })
        const current = nav.querySelector('[aria-current="page"]')
        expect(current.getAttribute("href")).toBe(path)
        expect(document.title).toContain(title)
    })

    it("navega entre as páginas pelo menu lateral", async () => {
        renderInfo("/sobre")
        await userEvent.click(screen.getByRole("link", { name: /Termos de Uso/ }))
        expect(screen.getByRole("heading", { level: 1, name: "Termos de Uso" })).toBeTruthy()
    })
})
