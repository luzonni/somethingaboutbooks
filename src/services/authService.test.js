import { describe, expect, it } from "vitest"
import {
    changePassword,
    deleteAccount,
    findUserByUsername,
    getSessionUser,
    login,
    logout,
    register,
    updateProfile,
} from "./authService"

const credentials = { username: "leitor", email: "Leitor@SAB.com", password: "senha-segura" }

describe("authService", () => {
    it("cria a conta sem expor nem guardar a senha em texto puro", async () => {
        const user = await register(credentials)

        expect(user.email).toBe("leitor@sab.com")
        expect(user.passwordHash).toBeUndefined()
        expect(localStorage.getItem("sab:accounts")).not.toContain(credentials.password)
        expect(getSessionUser().id).toBe(user.id)
    })

    it("recusa email e usuário repetidos", async () => {
        await register(credentials)
        await expect(register({ ...credentials, username: "outro" })).rejects.toMatchObject({ field: "email" })
        await expect(register({ ...credentials, email: "o@sab.com" })).rejects.toMatchObject({ field: "username" })
    })

    it("autentica somente com a senha correta", async () => {
        await register(credentials)
        await logout()
        expect(getSessionUser()).toBeNull()

        await expect(login({ email: credentials.email, password: "errada-123" })).rejects.toThrow("incorretos")
        await expect(login({ email: "nao@existe.com", password: "x" })).rejects.toThrow("incorretos")

        const user = await login({ email: "leitor@sab.com", password: credentials.password })
        expect(user.username).toBe("leitor")
    })

    it("mantém a sessão só nesta aba quando não pedem para lembrar", async () => {
        await register(credentials)
        await login({ email: credentials.email, password: credentials.password, remember: false })
        expect(localStorage.getItem("sab:session")).toBeNull()
        expect(sessionStorage.getItem("sab:session")).not.toBeNull()
    })

    it("atualiza o perfil respeitando nomes únicos", async () => {
        await register({ ...credentials, username: "ocupado", email: "o@sab.com" })
        const user = await register(credentials)

        await expect(updateProfile(user.id, { username: "ocupado" })).rejects.toMatchObject({ field: "username" })

        const updated = await updateProfile(user.id, { bio: "Amo fantasia" })
        expect(updated.bio).toBe("Amo fantasia")
        expect(findUserByUsername("LEITOR").bio).toBe("Amo fantasia")
    })

    it("troca a senha exigindo a senha atual", async () => {
        const user = await register(credentials)
        await expect(changePassword(user.id, "errada-123", "nova-senha-1")).rejects.toMatchObject({
            field: "currentPassword",
        })

        await changePassword(user.id, credentials.password, "nova-senha-1")
        await expect(login({ email: credentials.email, password: credentials.password })).rejects.toThrow()
        await expect(login({ email: credentials.email, password: "nova-senha-1" })).resolves.toBeTruthy()
    })

    it("exclui a conta e encerra a sessão", async () => {
        const user = await register(credentials)
        await expect(deleteAccount(user.id, "errada-123")).rejects.toThrow()

        await deleteAccount(user.id, credentials.password)
        expect(getSessionUser()).toBeNull()
        expect(findUserByUsername("leitor")).toBeNull()
    })
})
