import { describe, expect, it } from "vitest"
import {
    EMPTY_LIBRARY,
    libraryReducer as reduce,
    libraryStats,
    readingProgress,
    loadLibrary,
    saveLibrary,
    sessionsOnDay,
    sumMinutes,
} from "./library"

const book = { id: "OL1W", title: "O Hobbit", author: "Tolkien", cover: "c.jpg", description: "não salvar" }

const apply = (...actions) => actions.reduce(reduce, EMPTY_LIBRARY)

describe("libraryReducer", () => {
    it("guarda só o essencial do livro", () => {
        const state = apply({ type: "SET_SHELF", book, shelf: "want" })
        expect(state.books.OL1W.shelf).toBe("want")
        expect(state.books.OL1W.description).toBeUndefined()
    })

    it("tira da estante ao repetir a mesma opção", () => {
        const state = apply(
            { type: "SET_SHELF", book, shelf: "want" },
            { type: "SET_SHELF", book, shelf: "want" }
        )
        expect(state.books.OL1W).toBeUndefined()
    })

    it("registra início e fim da leitura", () => {
        const state = apply(
            { type: "SET_SHELF", book, shelf: "reading", now: "2026-01-01T10:00:00.000Z" },
            { type: "SET_SHELF", book, shelf: "read", now: "2026-02-01T10:00:00.000Z" }
        )
        expect(state.books.OL1W.startedAt).toBe("2026-01-01T10:00:00.000Z")
        expect(state.books.OL1W.finishedAt).toBe("2026-02-01T10:00:00.000Z")
    })

    it("limpa a data de conclusão ao voltar para lendo", () => {
        const state = apply(
            { type: "SET_SHELF", book, shelf: "read" },
            { type: "SET_SHELF", book, shelf: "reading" }
        )
        expect(state.books.OL1W.finishedAt).toBeNull()
    })

    it("mantém o livro com review mesmo fora das estantes", () => {
        const state = apply(
            { type: "SET_SHELF", book, shelf: "want" },
            { type: "SAVE_REVIEW", book, rating: 5, review: "  Ótimo  " },
            { type: "SET_SHELF", book, shelf: "want" }
        )
        expect(state.books.OL1W).toMatchObject({ shelf: null, rating: 5, review: "Ótimo" })
    })

    it("apaga a review e remove o que ficou vazio", () => {
        const state = apply(
            { type: "SAVE_REVIEW", book, rating: 3, review: "ok" },
            { type: "DELETE_REVIEW", bookId: book.id }
        )
        expect(state.books.OL1W).toBeUndefined()
    })

    it("alterna favorito", () => {
        expect(apply({ type: "TOGGLE_FAVORITE", book }).books.OL1W.favorite).toBe(true)
        expect(
            apply({ type: "TOGGLE_FAVORITE", book }, { type: "TOGGLE_FAVORITE", book }).books.OL1W
        ).toBeUndefined()
    })

    it("organiza livros em listas", () => {
        const created = apply(
            { type: "CREATE_LIST", id: "l1", name: " Clássicos " },
            { type: "TOGGLE_IN_LIST", listId: "l1", book }
        )
        expect(created.lists[0]).toMatchObject({ name: "Clássicos", bookIds: ["OL1W"] })
        expect(created.books.OL1W).toBeTruthy()

        const removed = reduce(created, { type: "TOGGLE_IN_LIST", listId: "l1", book })
        expect(removed.lists[0].bookIds).toEqual([])
        expect(removed.books.OL1W).toBeUndefined()
    })

    it("remove da biblioteca os livros que só estavam na lista excluída", () => {
        const state = apply(
            { type: "CREATE_LIST", id: "l1", name: "Lista" },
            { type: "TOGGLE_IN_LIST", listId: "l1", book },
            { type: "DELETE_LIST", listId: "l1" }
        )
        expect(state.lists).toEqual([])
        expect(state.books.OL1W).toBeUndefined()
    })

    it("remove o livro de todas as listas", () => {
        const state = apply(
            { type: "CREATE_LIST", id: "l1", name: "Lista" },
            { type: "TOGGLE_IN_LIST", listId: "l1", book },
            { type: "REMOVE_BOOK", bookId: book.id }
        )
        expect(state.books.OL1W).toBeUndefined()
        expect(state.lists[0].bookIds).toEqual([])
    })
})

describe("progresso de leitura", () => {
    const reading = (state) => state.books.OL1W

    it("guarda páginas como números válidos", () => {
        const state = apply(
            { type: "SET_SHELF", book: { ...book, pages: 300 }, shelf: "reading" },
            { type: "SET_PROGRESS", bookId: book.id, currentPage: "75.8" }
        )
        expect(reading(state).currentPage).toBe(75)
        expect(readingProgress(reading(state))).toBe(0.25)
    })

    it("prefere o total informado pela pessoa", () => {
        const state = apply(
            { type: "SET_SHELF", book: { ...book, pages: 300 }, shelf: "reading" },
            { type: "SET_PROGRESS", bookId: book.id, currentPage: 50, totalPages: "100" }
        )
        expect(readingProgress(reading(state))).toBe(0.5)
    })

    it("ignora valores inválidos e limita a 100%", () => {
        const state = apply(
            { type: "SET_SHELF", book: { ...book, pages: 100 }, shelf: "reading" },
            { type: "SET_PROGRESS", bookId: book.id, currentPage: "-3" }
        )
        expect(reading(state).currentPage).toBeNull()
        expect(readingProgress(reading(state))).toBeNull()
        expect(readingProgress({ currentPage: 500, pages: 100 })).toBe(1)
        expect(readingProgress({ currentPage: 10 })).toBeNull()
    })

    it("não perde o total de páginas ao salvar o livro sem esse dado", () => {
        const state = apply(
            { type: "SET_SHELF", book: { ...book, pages: 310 }, shelf: "reading" },
            { type: "TOGGLE_FAVORITE", book }
        )
        expect(reading(state).pages).toBe(310)
    })
})

describe("estatísticas", () => {
    it("conta leituras do ano", () => {
        const state = apply(
            { type: "SET_SHELF", book, shelf: "read", now: "2026-03-01T12:00:00.000Z" },
            { type: "SET_SHELF", book: { ...book, id: "OL2W" }, shelf: "read", now: "2025-03-01T12:00:00.000Z" },
            { type: "SET_SHELF", book: { ...book, id: "OL3W" }, shelf: "want" }
        )
        expect(libraryStats(state, 2026)).toMatchObject({ read: 2, readThisYear: 1 })
    })

    it("soma os minutos do dia", () => {
        const sessions = [
            { minutes: 25, completedAt: "2026-03-01T12:00:00" },
            { minutes: 25, completedAt: "2026-03-01T15:00:00" },
            { minutes: 50, completedAt: "2026-02-01T12:00:00" },
        ]
        expect(sumMinutes(sessionsOnDay(sessions, new Date("2026-03-01T20:00:00")))).toBe(50)
    })
})

describe("persistência", () => {
    it("separa as bibliotecas por usuário", () => {
        saveLibrary("a", apply({ type: "SET_SHELF", book, shelf: "read" }))
        expect(loadLibrary("a").books.OL1W.shelf).toBe("read")
        expect(loadLibrary("b").books).toEqual({})
    })

    it("sobrevive a dados corrompidos", () => {
        localStorage.setItem("sab:library:a", "{quebrado")
        expect(loadLibrary("a")).toEqual(EMPTY_LIBRARY)
    })
})
