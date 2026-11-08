import { describe, expect, it } from "vitest"
import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import GoalCard from "."
import { createReader, renderWithProviders } from "../../test/renderWithProviders"

describe("GoalCard", () => {
    it("define a meta, mostra quanto falta e permite alterar", async () => {
        await createReader()
        renderWithProviders(<GoalCard />)

        const input = screen.getByLabelText("Livros que quero ler neste ano")
        await userEvent.clear(input)
        await userEvent.type(input, "5")
        await userEvent.click(screen.getByRole("button", { name: "Definir meta" }))

        expect(screen.getByText(/Faltam 5 livros/)).toBeTruthy()
        expect(screen.getByText("de 5")).toBeTruthy()
        expect(screen.getByText(/Meta de \d{4} definida/)).toBeTruthy()

        await userEvent.click(screen.getByRole("button", { name: /Alterar meta/ }))
        expect(screen.getByRole("button", { name: "Salvar" })).toBeTruthy()
    })
})
