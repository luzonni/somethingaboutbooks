import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useShortcut } from "./useShortcut"

const Shortcut = ({ handler, enabled, keys = ["r", "R"] }) => {
    useShortcut(keys, handler, { enabled })
    return (
        <>
            <input aria-label="campo" />
            <button>botão</button>
        </>
    )
}

describe("useShortcut", () => {
    it("chama o handler com a tecla configurada", async () => {
        const handler = vi.fn()
        render(<Shortcut handler={handler} />)
        await userEvent.keyboard("r")
        await userEvent.keyboard("x")
        expect(handler).toHaveBeenCalledTimes(1)
    })

    it("ignora a tecla enquanto a pessoa digita", async () => {
        const handler = vi.fn()
        render(<Shortcut handler={handler} />)
        await userEvent.type(screen.getByLabelText("campo"), "r")
        expect(handler).not.toHaveBeenCalled()
    })

    it("não repete o Espaço de um botão focado", async () => {
        const handler = vi.fn()
        render(<Shortcut handler={handler} keys=" " />)
        screen.getByRole("button").focus()
        await userEvent.keyboard(" ")
        expect(handler).not.toHaveBeenCalled()

        screen.getByRole("button").blur()
        await userEvent.keyboard(" ")
        expect(handler).toHaveBeenCalledTimes(1)
    })

    it("ignora combinações com Ctrl e quando desativado", async () => {
        const handler = vi.fn()
        const { rerender } = render(<Shortcut handler={handler} />)
        await userEvent.keyboard("{Control>}r{/Control}")
        rerender(<Shortcut handler={handler} enabled={false} />)
        await userEvent.keyboard("r")
        expect(handler).not.toHaveBeenCalled()
    })
})
