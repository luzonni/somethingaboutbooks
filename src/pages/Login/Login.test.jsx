import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import Login from "."
import { AuthProvider } from "../../context/AuthContext"
import { logout, register } from "../../services/authService"

const renderLogin = () =>
    render(
        <AuthProvider>
            <MemoryRouter initialEntries={[{ pathname: "/login", state: { from: "/destino" } }]}>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/destino" element={<h1>Página protegida</h1>} />
                </Routes>
            </MemoryRouter>
        </AuthProvider>
    )

const typeCredentials = async (email, password) => {
    await userEvent.type(screen.getByLabelText("Email"), email)
    await userEvent.type(screen.getByLabelText("Senha"), password)
    await userEvent.click(screen.getByRole("button", { name: /entrar/i }))
}

describe("Login", () => {
    it("valida os campos antes de enviar", async () => {
        renderLogin()
        await userEvent.click(screen.getByRole("button", { name: /entrar/i }))
        expect(screen.getByText("Informe seu email.")).toBeTruthy()
        expect(screen.getByText("Informe sua senha.")).toBeTruthy()
    })

    it("mostra erro com credenciais incorretas", async () => {
        renderLogin()
        await typeCredentials("nao@existe.com", "qualquer-senha")
        expect(await screen.findByText("Email ou senha incorretos.")).toBeTruthy()
    })

    it("entra e volta para a página de origem", async () => {
        await register({ username: "leitor", email: "leitor@sab.com", password: "senha-segura" })
        await logout()

        renderLogin()
        await typeCredentials("leitor@sab.com", "senha-segura")

        expect(await screen.findByRole("heading", { name: "Página protegida" })).toBeTruthy()
    })
})
