import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import MyHeader from "."
import { AuthProvider } from "../../context/AuthContext"
import { LibraryProvider } from "../../context/LibraryContext"
import { PomodoroProvider } from "../../context/PomodoroContext"
import { ThemeProvider } from "../../context/ThemeContext"
import { register } from "../../services/authService"

const renderHeader = () =>
    render(
        <ThemeProvider>
        <AuthProvider>
            <LibraryProvider>
                <PomodoroProvider>
                    <MemoryRouter>
                        <MyHeader />
                    </MemoryRouter>
                </PomodoroProvider>
            </LibraryProvider>
        </AuthProvider>
        </ThemeProvider>
    )

describe("MyHeader", () => {
    it("oferece entrar e criar conta para visitantes", () => {
        renderHeader()
        expect(screen.getAllByRole("link", { name: "Entrar", hidden: true }).length).toBeGreaterThan(0)
        expect(screen.queryByRole("link", { name: /minhas leituras/i, hidden: true })).toBeNull()
    })

    it("abre o menu mobile e fecha com Esc devolvendo o foco", async () => {
        renderHeader()
        // O jsdom ignora media queries, então o botão mobile conta como oculto para getByRole.
        const toggle = screen.getByLabelText("Abrir menu")

        await userEvent.click(toggle)
        expect(toggle.getAttribute("aria-expanded")).toBe("true")
        expect(document.activeElement).toBe(screen.getByLabelText("Fechar menu"))
        expect(document.body.style.overflow).toBe("hidden")

        await userEvent.keyboard("{Escape}")
        expect(toggle.getAttribute("aria-expanded")).toBe("false")
        expect(document.activeElement).toBe(toggle)
        expect(document.body.style.overflow).toBe("")
    })

    it("mostra as opções da conta para quem está logado", async () => {
        await register({ username: "leitor", email: "leitor@sab.com", password: "senha-segura" })
        renderHeader()

        await userEvent.click(screen.getByRole("button", { name: "Menu de leitor" }))

        expect(screen.getAllByRole("link", { name: "Meu perfil", hidden: true }).length).toBeGreaterThan(0)
        expect(screen.getAllByRole("link", { name: /minhas leituras/i, hidden: true }).length).toBeGreaterThan(0)
    })
})
