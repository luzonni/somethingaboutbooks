// Escolhe de onde vêm os livros.
// Com a chave do Google Books (VITE_GOOGLE_BOOKS_KEY no .env.local), a busca e a página do livro usam o
// Google, que tem as edições brasileiras com capa e sinopse em português. A home, os gêneros e os autores
// continuam na Open Library. Sem chave, ou se o Google falhar (cota do dia esgotada, por exemplo), tudo
// volta para a Open Library.
import * as openLibrary from "./openLibrary"
import {
    getGoogleWork,
    googleAuthorBooksList,
    hasGoogleBooks,
    isGoogleId,
    searchGoogleBooks,
    suggestGoogleBooks,
} from "./googleBooks"

export { isGoogleId }

const isAbort = (error) => error?.name === "AbortError"

// Gêneros e ordenações por popularidade e nota só existem na Open Library.
const GOOGLE_SORTS = new Set(["", "new"])
const usesGoogleSearch = ({ query = "", genre = "", sort = "" }) =>
    hasGoogleBooks() && query.trim() !== "" && !genre && GOOGLE_SORTS.has(sort)

const withFallback = async (google, fallback) => {
    try {
        return await google()
    } catch (error) {
        if (isAbort(error)) throw error
        return fallback()
    }
}

export const searchBooks = (options = {}) =>
    usesGoogleSearch(options)
        ? withFallback(
              () => searchGoogleBooks(options),
              () => openLibrary.searchBooks(options)
          )
        : openLibrary.searchBooks(options)

export const suggestBooks = (options = {}) =>
    hasGoogleBooks()
        ? withFallback(
              () => suggestGoogleBooks(options),
              () => openLibrary.suggestBooks(options)
          )
        : openLibrary.suggestBooks(options)

export const getWork = (id, options) => (isGoogleId(id) ? getGoogleWork(id, options) : openLibrary.getWork(id, options))

const valueOrNull = (result) => (result.status === "fulfilled" ? result.value : null)

export const getBookExtras = async (work, { signal } = {}) => {
    if (work.source !== "google") return openLibrary.getBookExtras(work, { signal })

    // Nota e páginas já vêm no livro do Google; autor, foto e biografia vêm da Open Library, quando existirem.
    const authors = await Promise.allSettled(
        work.authorNames.slice(0, 3).map((name) => openLibrary.findAuthorByName(name, { signal }))
    )
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError")
    const authorList = authors.map(valueOrNull).filter(Boolean)
    return {
        authors: authorList,
        author: work.authorNames[0] ?? authorList[0]?.name ?? "Autor desconhecido",
        rating: work.rating,
        ratingCount: work.ratingCount,
        ratingCounts: {},
        pages: work.pages,
    }
}

export const authorBooksList = (authorName, excludeId, options) =>
    isGoogleId(excludeId) && hasGoogleBooks()
        ? googleAuthorBooksList(authorName, excludeId, options)
        : openLibrary.authorBooksList(authorName, excludeId, options)
