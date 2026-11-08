import { afterEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { THEME_KEY, ThemeProvider, initialTheme, useTheme } from "./ThemeContext"

const mockSystem = (dark) =>
    vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: dark, addEventListener: vi.fn(), removeEventListener: vi.fn() })))

const Toggle = () => {
    const { theme, toggleTheme } = useTheme()
    return <button onClick={toggleTheme}>{theme}</button>
}

describe("ThemeContext", () => {
    afterEach(() => delete document.documentElement.dataset.theme)

    it("segue o tema do sistema quando não há escolha salva", () => {
        mockSystem(true)
        expect(initialTheme()).toBe("dark")
        mockSystem(false)
        expect(initialTheme()).toBe("light")
    })

    it("prefere o tema escolhido pela pessoa", () => {
        mockSystem(true)
        localStorage.setItem(THEME_KEY, JSON.stringify("light"))
        expect(initialTheme()).toBe("light")
    })

    it("alterna, aplica no documento e salva a escolha", async () => {
        mockSystem(false)
        render(
            <ThemeProvider>
                <Toggle />
            </ThemeProvider>
        )
        expect(document.documentElement.dataset.theme).toBe("light")

        await userEvent.click(screen.getByRole("button"))

        expect(screen.getByRole("button").textContent).toBe("dark")
        expect(document.documentElement.dataset.theme).toBe("dark")
        expect(JSON.parse(localStorage.getItem(THEME_KEY))).toBe("dark")
    })
})
