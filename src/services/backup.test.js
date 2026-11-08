import { describe, expect, it } from "vitest"
import { BackupError, backupFileName, backupSummary, createBackup, parseBackup } from "./backup"
import { EMPTY_LIBRARY, libraryReducer } from "./library"

const library = {
    books: { OL1W: { id: "OL1W", title: "O Hobbit", shelf: "read" } },
    lists: [{ id: "l1", name: "Favoritos", bookIds: ["OL1W"] }],
    sessions: [{ id: "s1", minutes: 25, completedAt: "2026-01-01T10:00:00.000Z" }],
    goals: { 2026: 10 },
}

describe("backup", () => {
    it("ida e volta preservam a biblioteca", () => {
        const text = JSON.stringify(createBackup(library))
        expect(parseBackup(text)).toEqual(library)
    })

    it("completa campos que bibliotecas antigas não tinham", () => {
        const text = JSON.stringify({ app: "sab", version: 1, library: { books: {}, lists: [], sessions: [] } })
        expect(parseBackup(text).goals).toEqual({})
    })

    it("recusa arquivos que não são backups válidos", () => {
        const invalid = [
            "não é json",
            JSON.stringify({ outro: "app" }),
            JSON.stringify({ app: "sab", version: 99, library: {} }),
            JSON.stringify({ app: "sab", version: 1, library: { books: { OL1W: { id: "OUTRO", title: "x" } } } }),
            JSON.stringify({ app: "sab", version: 1, library: { sessions: [{ minutes: "muito" }] } }),
            JSON.stringify({ app: "sab", version: 1, library: { lists: [{ name: "sem livros" }] } }),
        ]
        invalid.forEach((text) => expect(() => parseBackup(text)).toThrow(BackupError))
    })

    it("nomeia o arquivo com o usuário e a data", () => {
        expect(backupFileName("leitor", new Date("2026-05-02T12:00:00Z"))).toBe("sab-leitor-2026-05-02.json")
    })

    it("resume o conteúdo", () => {
        expect(backupSummary(library)).toEqual({ books: 1, lists: 1, sessions: 1 })
    })

    it("substitui a biblioteca inteira ao importar", () => {
        const current = { ...EMPTY_LIBRARY, books: { X: { id: "X", title: "Outro" } } }
        expect(libraryReducer(current, { type: "REPLACE", library })).toEqual({ ...EMPTY_LIBRARY, ...library })
    })
})
