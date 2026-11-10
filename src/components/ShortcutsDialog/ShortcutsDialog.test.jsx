import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import ShortcutsDialog from "."

describe("ShortcutsDialog", () => {
    it("abre como modal e lista os atalhos", () => {
        render(<ShortcutsDialog open onClose={() => {}} />)
        const dialog = screen.getByRole("dialog", { name: "Atalhos de teclado" })
        expect(dialog.open).toBe(true)
        expect(screen.getByText("Ir para a busca")).toBeTruthy()
        expect(screen.getByText("Iniciar ou pausar")).toBeTruthy()
    })

    it("fica fechado quando open é falso", () => {
        render(<ShortcutsDialog open={false} onClose={() => {}} />)
        expect(screen.queryByRole("dialog")).toBeNull()
    })

    it("fecha pelo botão", async () => {
        const onClose = vi.fn()
        render(<ShortcutsDialog open onClose={onClose} />)
        await userEvent.click(screen.getByRole("button", { name: "Fechar" }))
        expect(onClose).toHaveBeenCalled()
    })
})
