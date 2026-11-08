import { createContext, useContext, useEffect, useMemo, useReducer, useRef } from "react"
import { useAuth } from "./AuthContext"
import { EMPTY_LIBRARY, libraryReducer, loadLibrary, saveLibrary } from "../services/library"

const LibraryContext = createContext(null)

const LibraryStore = ({ userId, children }) => {
    const [library, dispatch] = useReducer(libraryReducer, userId, (id) => (id ? loadLibrary(id) : EMPTY_LIBRARY))
    const isFirstRender = useRef(true)

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            return
        }
        if (userId) saveLibrary(userId, library)
    }, [userId, library])

    const value = useMemo(() => {
        const entries = Object.values(library.books)
        return {
            canSave: Boolean(userId),
            library,
            entries,
            lists: library.lists,
            sessions: library.sessions,
            getEntry: (bookId) => library.books[bookId] ?? null,
            setShelf: (book, shelf) => dispatch({ type: "SET_SHELF", book, shelf }),
            toggleFavorite: (book) => dispatch({ type: "TOGGLE_FAVORITE", book }),
            saveReview: (book, rating, review) => dispatch({ type: "SAVE_REVIEW", book, rating, review }),
            deleteReview: (bookId) => dispatch({ type: "DELETE_REVIEW", bookId }),
            setProgress: (bookId, currentPage) => dispatch({ type: "SET_PROGRESS", bookId, currentPage }),
            setTotalPages: (bookId, currentPage, totalPages) =>
                dispatch({ type: "SET_PROGRESS", bookId, currentPage, totalPages }),
            removeBook: (bookId) => dispatch({ type: "REMOVE_BOOK", bookId }),
            createList: (name) => dispatch({ type: "CREATE_LIST", id: crypto.randomUUID(), name }),
            deleteList: (listId) => dispatch({ type: "DELETE_LIST", listId }),
            toggleInList: (listId, book) => dispatch({ type: "TOGGLE_IN_LIST", listId, book }),
            logSession: (session) => dispatch({ type: "LOG_SESSION", session }),
        }
    }, [library, userId])

    return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
}

export const LibraryProvider = ({ children }) => {
    const { user } = useAuth()
    return (
        <LibraryStore key={user?.id ?? "anonymous"} userId={user?.id}>
            {children}
        </LibraryStore>
    )
}

export const useLibrary = () => useContext(LibraryContext)
