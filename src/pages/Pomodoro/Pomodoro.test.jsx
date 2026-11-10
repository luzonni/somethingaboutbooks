import { describe, expect, it } from "vitest"
import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { saveLibrary } from "../../services/library"
import { createReader, renderWithProviders } from "../../test/renderWithProviders"
import Pomodoro from "."

const timer = () => screen.getByRole("timer")

const withReadingBook = async () => {
    const user = await createReader()
    const now = new Date().toISOString()
    saveLibrary(user.id, {
        books: {
            OL1W: { id: "OL1W", title: "O Hobbit", author: "J.R.R. Tolkien", cover: "", shelf: "reading", addedAt: now, updatedAt: now },
        },
        lists: [],
        sessions: [],
        goals: {},
    })
}

describe("Pomodoro", () => {
    it("começa no foco com o tempo padrão", () => {
        renderWithProviders(<Pomodoro />, { route: "/pomodoro" })
        expect(timer().textContent).toBe("25:00")
        expect(screen.getByRole("button", { name: "Foco" }).getAttribute("aria-pressed")).toBe("true")
        expect(document.title).toContain("Pomodoro")
    })

    it("troca de etapa pelos botões", async () => {
        renderWithProviders(<Pomodoro />, { route: "/pomodoro" })
        await userEvent.click(screen.getByRole("button", { name: "Pausa curta" }))
        expect(timer().textContent).toBe("05:00")
        expect(screen.getByRole("button", { name: "Pausa curta" }).getAttribute("aria-pressed")).toBe("true")
        await userEvent.click(screen.getByRole("button", { name: "Pausa longa" }))
        expect(timer().textContent).toBe("15:00")
    })

    it("inicia, pausa e continua", async () => {
        renderWithProviders(<Pomodoro />, { route: "/pomodoro" })
        await userEvent.click(screen.getByRole("button", { name: "Iniciar" }))
        await userEvent.click(screen.getByRole("button", { name: "Pausar" }))
        expect(screen.getByRole("button", { name: "Continuar" })).toBeTruthy()
        await userEvent.click(screen.getByRole("button", { name: "Reiniciar" }))
        expect(screen.getByRole("button", { name: "Iniciar" })).toBeTruthy()
        expect(timer().textContent).toBe("25:00")
    })

    it("atalhos de teclado controlam o timer", async () => {
        renderWithProviders(<Pomodoro />, { route: "/pomodoro" })
        await userEvent.keyboard(" ")
        expect(screen.getByRole("button", { name: "Pausar" })).toBeTruthy()
        await userEvent.keyboard(" ")
        expect(screen.getByRole("button", { name: "Continuar" })).toBeTruthy()
        await userEvent.keyboard("p")
        expect(timer().textContent).toBe("05:00")
    })

    it("muda a duração do foco nas configurações", async () => {
        renderWithProviders(<Pomodoro />, { route: "/pomodoro" })
        await userEvent.click(screen.getByText("Configurações"))
        const field = screen.getByRole("spinbutton", { name: "Foco" })
        await userEvent.clear(field)
        await userEvent.type(field, "50")
        await userEvent.tab()
        expect(timer().textContent).toBe("50:00")
    })

    it("convida visitantes a entrar para vincular um livro", () => {
        renderWithProviders(<Pomodoro />, { route: "/pomodoro" })
        expect(screen.getByRole("link", { name: "Entre" }).getAttribute("href")).toBe("/login")
        expect(screen.queryByText(/Hoje:/)).toBeNull()
    })

    it("vincula a sessão a um livro da estante", async () => {
        await withReadingBook()
        renderWithProviders(<Pomodoro />, { route: "/pomodoro" })
        expect(screen.getByText(/Hoje: 0 sessões/)).toBeTruthy()
        await userEvent.selectOptions(screen.getByLabelText("Escolha um livro"), "OL1W")
        expect(screen.getByRole("link", { name: "O Hobbit" }).getAttribute("href")).toBe("/books/OL1W")
    })

    it("aceita o livro pela URL, vindo da página do livro", async () => {
        await withReadingBook()
        renderWithProviders(<Pomodoro />, { route: "/pomodoro?livro=OL1W" })
        expect((await screen.findByLabelText("Escolha um livro")).value).toBe("OL1W")
    })
})
