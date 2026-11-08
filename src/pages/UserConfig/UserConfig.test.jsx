import { describe, expect, it } from "vitest"
import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Route, Routes } from "react-router-dom"
import UserConfig from "."
import RequireAuth from "../../components/RequireAuth"
import { createReader, renderWithProviders } from "../../test/renderWithProviders"

const renderSettings = () =>
    renderWithProviders(
        <Routes>
            <Route path="/" element={<h1>Início</h1>} />
            <Route path="/login" element={<h1>Login</h1>} />
            <Route path="/userconfig" element={<RequireAuth><UserConfig /></RequireAuth>} />
        </Routes>,
        { route: "/userconfig" }
    )

describe("UserConfig", () => {
    it("exclui a conta e leva para a página inicial, não para o login", async () => {
        await createReader()
        renderSettings()

        await userEvent.click(screen.getByRole("button", { name: "Excluir conta" }))
        await userEvent.type(screen.getByLabelText("Confirme sua senha"), "senha-segura")
        await userEvent.click(screen.getByRole("button", { name: "Excluir definitivamente" }))

        expect(await screen.findByRole("heading", { name: "Início" })).toBeTruthy()
        expect(localStorage.getItem("sab:accounts")).toBe("[]")
    })

    it("mantém a conta quando a senha está errada", async () => {
        await createReader()
        renderSettings()

        await userEvent.click(screen.getByRole("button", { name: "Excluir conta" }))
        await userEvent.type(screen.getByLabelText("Confirme sua senha"), "senha-errada")
        await userEvent.click(screen.getByRole("button", { name: "Excluir definitivamente" }))

        expect(await screen.findByText("Senha atual incorreta.")).toBeTruthy()
        expect(JSON.parse(localStorage.getItem("sab:accounts"))).toHaveLength(1)
    })
})
