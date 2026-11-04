import { describe, expect, it } from "vitest"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import AuthPage from "."
import { AuthProvider } from "../../context/AuthContext"
import { register } from "../../services/authService"

const renderAuth = (entry = "/login") =>
    render(
        <AuthProvider>
            <MemoryRouter initialEntries={[entry]}>
                <Routes>
                    <Route path="/" element={<h1>Início</h1>} />
                    <Route path="/login" element={<AuthPage />} />
                    <Route path="/signup" element={<AuthPage />} />
                </Routes>
            </MemoryRouter>
        </AuthProvider>
    )

const page = () => document.querySelector("[data-mode]")
const pane = (name) => within(document.querySelector(`[data-pane="${name}"]`))

describe("AuthPage", () => {
    it("escolhe o modo pela rota", () => {
        renderAuth("/signup")
        expect(page().dataset.mode).toBe("signup")
    })

    it("alterna sem recriar a tela, para a animação acontecer", async () => {
        renderAuth()
        const element = page()
        await userEvent.type(pane("login").getByLabelText("Email"), "leitor@sab.com")

        await userEvent.click(screen.getByText("Criar conta", { selector: ".auth__cta" }))
        expect(page()).toBe(element)
        expect(element.dataset.mode).toBe("signup")

        await userEvent.click(screen.getByText("Entrar", { selector: ".auth__cta" }))
        expect(element.dataset.mode).toBe("login")
        expect(pane("login").getByLabelText("Email").value).toBe("leitor@sab.com")
    })

    it("redireciona quem já está logado", async () => {
        await register({ username: "leitor", email: "leitor@sab.com", password: "senha-segura" })
        renderAuth()
        expect(screen.getByRole("heading", { name: "Início" })).toBeTruthy()
    })
})
