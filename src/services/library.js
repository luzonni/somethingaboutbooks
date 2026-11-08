import { readJson, removeKey, writeJson } from "./storage"

export const SHELVES = {
    reading: "Lendo",
    want: "Quero ler",
    read: "Lido",
}

export const EMPTY_LIBRARY = { books: {}, lists: [], sessions: [], goals: {} }

export const MAX_GOAL = 365

const storageKey = (userId) => `sab:library:${userId}`

export const loadLibrary = (userId) => ({ ...EMPTY_LIBRARY, ...readJson(storageKey(userId), EMPTY_LIBRARY) })
export const saveLibrary = (userId, library) => writeJson(storageKey(userId), library)
export const clearLibrary = (userId) => removeKey(storageKey(userId))

// Guarda só o essencial do livro; campos ausentes não apagam o que já estava salvo.
const snapshot = ({ id, title, author, cover, pages }) =>
    Object.fromEntries(Object.entries({ id, title, author, cover, pages }).filter(([, value]) => value !== undefined))

const toPage = (value) => {
    if (value === "" || value === null || value === undefined) return null
    const page = Math.floor(Number(value))
    return Number.isFinite(page) && page >= 0 ? Math.min(page, 100000) : null
}

const isEmptyEntry = (entry, lists) =>
    !entry.shelf &&
    !entry.favorite &&
    !entry.rating &&
    !entry.review &&
    !lists.some((list) => list.bookIds.includes(entry.id))

const withEntry = (state, book, changes, now) => {
    const current = state.books[book.id] ?? { ...snapshot(book), shelf: null, addedAt: now }
    return {
        ...state,
        books: { ...state.books, [book.id]: { ...current, ...snapshot({ ...current, ...book }), ...changes, updatedAt: now } },
    }
}

const prune = (state, bookId) => {
    const entry = state.books[bookId]
    if (!entry || !isEmptyEntry(entry, state.lists)) return state
    const books = { ...state.books }
    delete books[bookId]
    return { ...state, books }
}

const shelfDates = (entry, shelf, now) => ({
    startedAt: shelf === "reading" ? entry?.startedAt ?? now : entry?.startedAt ?? null,
    finishedAt: shelf === "read" ? now : null,
})

export const libraryReducer = (state, action) => {
    const { type, book, bookId, now = new Date().toISOString() } = action

    switch (type) {
        case "SET_SHELF": {
            const entry = state.books[book.id]
            const shelf = entry?.shelf === action.shelf ? null : action.shelf
            return prune(withEntry(state, book, { shelf, ...shelfDates(entry, shelf, now) }, now), book.id)
        }
        case "TOGGLE_FAVORITE": {
            const favorite = !state.books[book.id]?.favorite
            return prune(withEntry(state, book, { favorite }, now), book.id)
        }
        case "SAVE_REVIEW":
            return withEntry(state, book, { rating: action.rating, review: action.review.trim(), reviewedAt: now }, now)
        case "DELETE_REVIEW": {
            const entry = state.books[bookId]
            if (!entry) return state
            return prune(withEntry(state, entry, { rating: null, review: "", reviewedAt: null }, now), bookId)
        }
        case "SET_PROGRESS": {
            const entry = state.books[bookId]
            if (!entry) return state
            const changes = { currentPage: toPage(action.currentPage) }
            if ("totalPages" in action) changes.totalPages = toPage(action.totalPages) || null
            return withEntry(state, entry, changes, now)
        }
        case "REMOVE_BOOK": {
            const books = { ...state.books }
            delete books[bookId]
            return {
                ...state,
                books,
                lists: state.lists.map((list) => ({
                    ...list,
                    bookIds: list.bookIds.filter((id) => id !== bookId),
                })),
            }
        }
        case "CREATE_LIST":
            return {
                ...state,
                lists: [...state.lists, { id: action.id, name: action.name.trim(), bookIds: [], createdAt: now }],
            }
        case "RENAME_LIST": {
            const name = action.name.trim()
            if (!name) return state
            return {
                ...state,
                lists: state.lists.map((list) => (list.id === action.listId ? { ...list, name } : list)),
            }
        }
        case "DELETE_LIST": {
            const removed = state.lists.find((list) => list.id === action.listId)
            const next = { ...state, lists: state.lists.filter((list) => list.id !== action.listId) }
            return (removed?.bookIds ?? []).reduce(prune, next)
        }
        case "TOGGLE_IN_LIST": {
            const lists = state.lists.map((list) => {
                if (list.id !== action.listId) return list
                const has = list.bookIds.includes(book.id)
                return { ...list, bookIds: has ? list.bookIds.filter((id) => id !== book.id) : [...list.bookIds, book.id] }
            })
            return prune(withEntry({ ...state, lists }, book, {}, now), book.id)
        }
        case "SET_GOAL": {
            const goals = { ...state.goals }
            const books = Math.floor(Number(action.books))
            if (Number.isFinite(books) && books > 0) goals[action.year] = Math.min(books, MAX_GOAL)
            else delete goals[action.year]
            return { ...state, goals }
        }
        case "LOG_SESSION":
            return { ...state, sessions: [...state.sessions, action.session] }
        default:
            return state
    }
}

const isSameDay = (a, b) => new Date(a).toDateString() === new Date(b).toDateString()

export const sumMinutes = (sessions) => sessions.reduce((total, session) => total + session.minutes, 0)

export const sessionsOnDay = (sessions, day = new Date()) =>
    sessions.filter((session) => isSameDay(session.completedAt, day))

export const libraryStats = (library, year = new Date().getFullYear()) => {
    const entries = Object.values(library.books)
    const read = entries.filter((entry) => entry.shelf === "read")
    return {
        read: read.length,
        readThisYear: read.filter((entry) => new Date(entry.finishedAt).getFullYear() === year).length,
        lists: library.lists.length,
        minutes: sumMinutes(library.sessions),
        goal: library.goals?.[year] ?? null,
    }
}

// Fração lida (0 a 1), usando o total informado pela pessoa ou o da Open Library.
export const readingProgress = (entry) => {
    const total = entry?.totalPages || entry?.pages
    if (!total || entry.currentPage === null || entry.currentPage === undefined) return null
    return Math.min(entry.currentPage / total, 1)
}

export const byRecent = (field) => (a, b) => new Date(b[field] ?? 0) - new Date(a[field] ?? 0)
