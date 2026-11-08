import { describe, expect, it, vi } from "vitest"
import { act, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ToastProvider, useToast } from "./ToastContext"

const Trigger = ({ message = "Salvo", tone }) => {
    const { notify } = useToast()
    return <button onClick={() => notify(message, { tone })}>avisar</button>
}

const renderWithToasts = (props) =>
    render(
        <ToastProvider>
            <Trigger {...props} />
        </ToastProvider>
    )

describe("ToastContext", () => {
    it("mostra e some sozinho depois de alguns segundos", () => {
        vi.useFakeTimers()
        renderWithToasts()

        act(() => screen.getByRole("button", { name: "avisar" }).click())
        expect(screen.getByText("Salvo")).toBeTruthy()

        act(() => vi.advanceTimersByTime(4000))
        expect(screen.queryByText("Salvo")).toBeNull()
        vi.useRealTimers()
    })

    it("pode ser fechado pelo botão", async () => {
        renderWithToasts({ message: "Erro", tone: "error" })
        await userEvent.click(screen.getByRole("button", { name: "avisar" }))
        await userEvent.click(screen.getByRole("button", { name: "Fechar aviso" }))
        expect(screen.queryByText("Erro")).toBeNull()
    })

    it("mantém no máximo três avisos", async () => {
        renderWithToasts()
        for (let i = 0; i < 5; i++) await userEvent.click(screen.getByRole("button", { name: "avisar" }))
        expect(screen.getAllByText("Salvo")).toHaveLength(3)
    })

    it("não quebra fora do provider", () => {
        render(<Trigger />)
        expect(() => screen.getByRole("button").click()).not.toThrow()
    })
})
