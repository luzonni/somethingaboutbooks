import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import NotFound from "."

describe("NotFound", () => {
    it("explica o erro e oferece o caminho de volta", () => {
        render(
            <MemoryRouter initialEntries={["/qualquer-coisa"]}>
                <NotFound />
            </MemoryRouter>
        )
        expect(screen.getByRole("heading", { level: 1, name: "Página não encontrada" })).toBeTruthy()
        expect(screen.getByRole("link", { name: "Voltar para o início" }).getAttribute("href")).toBe("/")
    })
})
