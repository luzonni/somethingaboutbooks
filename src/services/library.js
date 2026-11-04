import { readJson, removeKey, writeJson } from "./storage"

export const SHELVES = {
    reading: "Lendo",
    want: "Quero ler",
    read: "Lido",
}

export const EMPTY_LIBRARY = { books: {}, lists: [], sessions: [] }

const storageKey = (userId) => `sab:library:${userId}`

export const loadLibrary = (userId) => ({ ...EMPTY_LIBRARY, ...readJson(storageKey(userId), EMPTY_LIBRARY) })
export const saveLibrary = (userId, library) => writeJson(storageKey(userId), library)
export const clearLibrary = (userId) => removeKey(storageKey(userId))

const snapshot = ({ id, title, author, cover }) => ({ id, title, author, cover })

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
            return withEntry(state, entry, { currentPage: action.currentPage }, now)
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
    }
}

export const byRecent = (field) => (a, b) => new Date(b[field] ?? 0) - new Date(a[field] ?? 0)
