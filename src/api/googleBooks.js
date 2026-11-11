import { ApiError, cleanTags, cleanText, cleanTitle, dedupeBooks, rankBooks } from "./openLibrary"

const BASE_URL = "https://www.googleapis.com/books/v1"
const CACHE_TTL = 5 * 60 * 1000
// A API devolve no máximo 40 livros por chamada.
const MAX_RESULTS = 40

// Livros do Google ganham um prefixo para não se confundirem com as obras da Open Library ("OL123W").
export const GOOGLE_PREFIX = "g-"
export const isGoogleId = (id = "") => id.startsWith(GOOGLE_PREFIX)
const volumeIdOf = (id) => id.slice(GOOGLE_PREFIX.length)

// A chave fica no .env.local (fora do Git). Sem ela, o app usa só a Open Library.
const apiKey = () => import.meta.env.VITE_GOOGLE_BOOKS_KEY ?? ""
export const hasGoogleBooks = () => apiKey().length > 0

const cache = new Map()
export const clearGoogleCache = () => cache.clear()

const request = async (path, { params, signal } = {}) => {
    const url = new URL(`${BASE_URL}${path}`)
    Object.entries(params ?? {}).forEach(([key, value]) => {
        if (value !== undefined && value !== "") url.searchParams.set(key, value)
    })
    const cacheKey = url.toString()
    url.searchParams.set("key", apiKey())

    const cached = cache.get(cacheKey)
    if (cached && Date.now() - cached.savedAt < CACHE_TTL) return cached.data

    let response
    try {
        response = await fetch(url, { signal })
    } catch (error) {
        if (error.name === "AbortError") throw error
        throw new ApiError("Não foi possível conectar ao Google Books. Verifique sua internet.")
    }
    if (response.status === 404) throw new ApiError("Conteúdo não encontrado.", 404)
    if (!response.ok) throw new ApiError("O Google Books está indisponível no momento.", response.status)

    const data = await response.json()
    cache.set(cacheKey, { data, savedAt: Date.now() })
    return data
}

// Capas do Google vêm em http e com a "orelha" dobrada (edge=curl): troca por https e capa lisa.
// O zoom escolhe o tamanho: 1 para cards, 3 para a página do livro.
export const googleCover = (url = "", zoom = 1) =>
    url
        ? url
              .replace(/^http:/, "https:")
              .replace(/&edge=curl/, "")
              .replace(/zoom=\d/, `zoom=${zoom}`)
        : ""

const firstCover = (links = {}) => links.thumbnail || links.smallThumbnail || ""

// Resumos, capítulos extras e guias de estudo aparecem em toda busca, mas não são o livro.
const NOT_A_BOOK = /\b(resumo|resumen|summary|sum[aá]rio|cap[ií]tulo extra|bonus chapter|study guide|guia de estudo|sparknotes|an[aá]lise d[eo]|workbook)\b/i
const SHORT_BOOK = 60

const isRealBook = ({ title = "", pageCount = 0 }) => !NOT_A_BOOK.test(title) && !(pageCount > 0 && pageCount < SHORT_BOOK)

const normalizeVolume = ({ id, volumeInfo: info = {} }) => ({
    id: `${GOOGLE_PREFIX}${id}`,
    title: cleanTitle(info.title ?? ""),
    author: info.authors?.[0] ?? "Autor desconhecido",
    cover: googleCover(firstCover(info.imageLinks)),
    year: info.publishedDate?.match(/\d{4}/)?.[0] ? Number(info.publishedDate.match(/\d{4}/)[0]) : null,
    rating: info.averageRating ?? null,
    ratingCount: info.ratingsCount ?? 0,
    ...(info.pageCount > 0 ? { pages: info.pageCount } : {}),
})

// Edição brasileira vem antes da de Portugal e de outros idiomas, sem passar à frente de livros mais completos.
const languageBonus = (volume) => (volume.volumeInfo?.language === "pt-BR" ? 0 : 1)

const toBooks = (items, query) => {
    const volumes = items
        .filter((item) => item.volumeInfo?.title && isRealBook(item.volumeInfo))
        .map((item, index) => ({ item, index }))
        .sort((a, b) => languageBonus(a.item) - languageBonus(b.item) || a.index - b.index)
        .map(({ item }) => normalizeVolume(item))
    return dedupeBooks(rankBooks(volumes, query))
}

// Às vezes o livro certo vem numa edição sem capa (ex.: a de Portugal) e a edição brasileira, com capa,
// só aparece buscando o título exato. Só faz essa busca extra quando o melhor resultado está sem capa,
// para gastar pouco da cota diária.
const fillMissingCover = async (books, terms, signal) => {
    if (books.length === 0 || books[0].cover) return books
    try {
        const data = await request("/volumes", {
            params: { q: `intitle:"${terms.replace(/"/g, "")}"`, maxResults: 10, printType: "books" },
            signal,
        })
        // dedupeBooks troca a versão sem capa pela com capa, mantendo a posição.
        return dedupeBooks([...books, ...toBooks(data.items ?? [], terms)])
    } catch (error) {
        if (error.name === "AbortError") throw error
        return books
    }
}

export const searchGoogleBooks = async ({ query, page = 1, limit = 24, signal } = {}) => {
    const terms = query.trim()
    const startIndex = (page - 1) * limit
    const data = await request("/volumes", {
        params: { q: terms, startIndex, maxResults: Math.min(limit, MAX_RESULTS), printType: "books" },
        signal,
    })
    const items = data.items ?? []
    const books = toBooks(items, terms)
    // O total do Google é uma estimativa e as páginas podem vir incompletas: para quando vier uma vazia.
    const total = Math.max(data.totalItems ?? 0, startIndex + items.length)
    return {
        books: page === 1 ? await fillMissingCover(books, terms, signal) : books,
        total,
        hasMore: items.length > 0 && startIndex + limit < total,
    }
}

export const suggestGoogleBooks = async ({ query, limit = 5, signal } = {}) => {
    const terms = query.trim()
    const data = await request("/volumes", { params: { q: terms, maxResults: 20, printType: "books" }, signal })
    const books = await fillMissingCover(toBooks(data.items ?? [], terms), terms, signal)
    return books.slice(0, limit)
}

// Livros do mesmo autor, para a seção "Mais de ...".
export const googleAuthorBooksList = (authorName, excludeId, { limit = 12 } = {}) => ({
    peek: () => null,
    load: async (signal) => {
        const name = authorName.replace(/"/g, "")
        const data = await request("/volumes", {
            params: { q: `inauthor:"${name}"`, maxResults: MAX_RESULTS, printType: "books" },
            signal,
        })
        return toBooks(data.items ?? [], name)
            .filter((book) => book.id !== excludeId && book.cover)
            .slice(0, limit)
    },
})

// A sinopse vem em HTML: mantém as quebras de parágrafo antes de limpar as tags.
const htmlToText = (html = "") =>
    cleanText(
        html
            .replace(/<br\s*\/?>/gi, "\n")
            .replace(/<\/p>\s*/gi, "\n\n")
    )

// "Fiction / Romance / Contemporary" vira "Romance" e "Contemporary": a primeira parte é genérica demais.
const categoriesToTags = (categories = []) =>
    cleanTags(
        categories.flatMap((category) => {
            const parts = category.split("/").map((part) => part.trim())
            return parts.length > 1 ? parts.slice(1) : parts
        }),
        12
    )

export const getGoogleWork = async (id, { signal } = {}) => {
    const volume = await request(`/volumes/${encodeURIComponent(volumeIdOf(id))}`, { signal })
    const info = volume.volumeInfo ?? {}
    if (!info.title) throw new ApiError("Conteúdo não encontrado.", 404)
    const links = info.imageLinks ?? {}
    const base = firstCover(links)
    return {
        id: `${GOOGLE_PREFIX}${volume.id ?? volumeIdOf(id)}`,
        source: "google",
        title: cleanTitle(info.title),
        description: htmlToText(info.description),
        cover: googleCover(links.large || links.medium || base, 3),
        coverThumb: googleCover(base),
        firstPublished: info.publishedDate ?? "",
        subjects: categoriesToTags(info.categories),
        places: [],
        characters: [],
        authorIds: [],
        authorNames: info.authors ?? [],
        publisher: info.publisher ?? "",
        pages: info.pageCount > 0 ? info.pageCount : null,
        rating: info.averageRating ?? null,
        ratingCount: info.ratingsCount ?? 0,
        url: info.infoLink || info.canonicalVolumeLink || `https://books.google.com/books?id=${volumeIdOf(id)}`,
    }
}
