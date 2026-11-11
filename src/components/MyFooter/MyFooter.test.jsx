import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import MyFooter from "."

const renderFooter = () =>
    render(
        <MemoryRouter>
            <MyFooter />
        </MemoryRouter>
    )

describe("MyFooter", () => {
    it("credita só a Open Library quando o Google Books está desligado", () => {
        renderFooter()
        expect(screen.getByRole("link", { name: "Open Library" })).toBeTruthy()
        expect(screen.queryByRole("link", { name: "Google Books" })).toBeNull()
    })

    it("credita também o Google Books quando há chave", () => {
        vi.stubEnv("VITE_GOOGLE_BOOKS_KEY", "chave-de-teste")
        renderFooter()
        expect(screen.getByRole("link", { name: "Google Books" })).toBeTruthy()
        expect(screen.getByRole("link", { name: "Open Library" })).toBeTruthy()
    })
})
