import { EMPTY_LIBRARY } from "./library"

export const BACKUP_VERSION = 1
const MAX_BACKUP_SIZE = 5 * 1024 * 1024

export class BackupError extends Error {
    constructor(message) {
        super(message)
        this.name = "BackupError"
    }
}

const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value)

export const createBackup = (library, now = new Date()) => ({
    app: "sab",
    version: BACKUP_VERSION,
    exportedAt: now.toISOString(),
    library: { ...EMPTY_LIBRARY, ...library },
})

export const backupFileName = (username, now = new Date()) =>
    `sab-${username}-${now.toISOString().slice(0, 10)}.json`

// Confere a estrutura antes de substituir a biblioteca: um arquivo errado não pode apagar os dados.
export const parseBackup = (text) => {
    if (text.length > MAX_BACKUP_SIZE) throw new BackupError("O arquivo é grande demais para ser um backup do SAB.")

    let data
    try {
        data = JSON.parse(text)
    } catch {
        throw new BackupError("O arquivo não é um JSON válido.")
    }

    if (!isObject(data) || data.app !== "sab" || !isObject(data.library)) {
        throw new BackupError("Este arquivo não é um backup do SAB.")
    }
    if (data.version > BACKUP_VERSION) {
        throw new BackupError("Este backup foi feito por uma versão mais nova do SAB.")
    }

    const { books = {}, lists = [], sessions = [], goals = {} } = data.library
    const validBooks =
        isObject(books) && Object.entries(books).every(([id, book]) => isObject(book) && book.id === id && typeof book.title === "string")
    const validLists = Array.isArray(lists) && lists.every((list) => isObject(list) && Array.isArray(list.bookIds))
    const validSessions = Array.isArray(sessions) && sessions.every((session) => isObject(session) && Number.isFinite(session.minutes))

    if (!validBooks || !validLists || !validSessions || !isObject(goals)) {
        throw new BackupError("O backup está incompleto ou corrompido.")
    }

    return { books, lists, sessions, goals }
}

export const backupSummary = (library) => ({
    books: Object.keys(library.books).length,
    lists: library.lists.length,
    sessions: library.sessions.length,
})
