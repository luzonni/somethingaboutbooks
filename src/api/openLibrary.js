import { readJson, writeJson } from "../services/storage"

const BASE_URL = "https://openlibrary.org"
const COVERS_URL = "https://covers.openlibrary.org"
const CACHE_TTL = 5 * 60 * 1000
const SEARCH_FIELDS = [
    "key",
    "title",
    "author_name",
    "cover_i",
    "first_publish_year",
    "ratings_average",
    "ratings_count",
    "editions",
    "editions.title",
    "editions.language",
    "editions.cover_i",
].join(",")

export const PAGE_SIZE = 24

// As etiquetas da Open Library são ruidosas: uma etiqueta só traz muito livro fora do gênero.
// Por isso cada gênero combina as etiquetas mais confiáveis e exclui as que costumam confundir.
export const GENRES = [
    {
        slug: "fantasy",
        label: "Fantasia",
        query: "subject_key:fantasy_fiction (subject_key:magic OR subject_key:dragons OR subject_key:wizards OR subject_key:epic_fantasy OR subject_key:fantasy_fiction_english) -subject_key:science_fiction -subject_key:classic_literature",
    },
    {
        slug: "romance",
        label: "Romance",
        query: "subject_key:romance_fiction -subject_key:fantasy_fiction -subject_key:science_fiction -subject_key:classic_literature",
    },
    {
        slug: "science_fiction",
        label: "Ficção científica",
        query: "subject_key:science_fiction -subject_key:fantasy_fiction -subject_key:fantasy -subject_key:love_stories -subject_key:horror_stories",
    },
    {
        slug: "horror",
        label: "Terror",
        query: "subject_key:horror_fiction -subject_key:love_stories -subject_key:romance_fiction -subject_key:fantasy_fiction",
    },
    {
        slug: "mystery",
        label: "Mistério",
        query: "subject_key:detective_and_mystery_stories -subject_key:classic_literature -subject_key:fantasy_fiction",
    },
    { slug: "classics", label: "Clássicos", query: "subject_key:classic_literature subject_key:fiction" },
    {
        slug: "biography",
        label: "Biografia",
        query: "subject_key:autobiography subject_key:biography -subject_key:fiction -subject_key:national_socialism",
    },
    { slug: "history", label: "História", query: "subject_key:civilization -subject_key:fiction" },
]

const TOP_RATED_QUERY = "subject_key:fiction ratings_count:[300 TO *]"
const LATIN_TITLE = /^[\p{Script=Latin}\p{N}\p{P}\p{S}\s]+$/u
const LIST_CACHE_TTL = 12 * 60 * 60 * 1000

const HTML_ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'" }

const cache = new Map()

export const clearApiCache = () => cache.clear()

// Listas da home quase não mudam: guardá-las no navegador deixa as próximas visitas instantâneas.
const cachedList = async (key, loader) => {
    const storageKey = `sab:cache:${key}`
    const saved = readJson(storageKey, null)
    if (saved && Date.now() - saved.savedAt < LIST_CACHE_TTL) return saved.books

    const books = await loader()
    if (books.length > 0) writeJson(storageKey, { books, savedAt: Date.now() })
    return books
}

export const curateBooks = (books, { maxPerAuthor = 2, limit = books.length } = {}) => {
    const perAuthor = new Map()
    return books
        .filter((book) => book.cover && LATIN_TITLE.test(book.title))
        .filter((book) => {
            const count = (perAuthor.get(book.author) ?? 0) + 1
            perAuthor.set(book.author, count)
            return count <= maxPerAuthor
        })
        .slice(0, limit)
}

export class ApiError extends Error {
    constructor(message, status) {
        super(message)
        this.name = "ApiError"
        this.status = status
    }
}

const request = async (path, { params, signal } = {}) => {
    const url = new URL(path, BASE_URL)
    Object.entries(params ?? {}).forEach(([key, value]) => {
        if (value !== undefined && value !== "") url.searchParams.set(key, value)
    })

    const cacheKey = url.toString()
    const cached = cache.get(cacheKey)
    if (cached && Date.now() - cached.savedAt < CACHE_TTL) return cached.data

    let response
    try {
        response = await fetch(url, { signal })
    } catch (error) {
        if (error.name === "AbortError") throw error
        throw new ApiError("Não foi possível conectar à Open Library. Verifique sua internet.")
    }

    if (response.status === 404) throw new ApiError("Conteúdo não encontrado.", 404)
    if (!response.ok) throw new ApiError("A Open Library está indisponível no momento.", response.status)

    const data = await response.json()
    cache.set(cacheKey, { data, savedAt: Date.now() })
    return data
}

export const idFromKey = (key = "") => key.split("/").pop()

export const coverUrl = (coverId, size = "M") =>
    coverId > 0 ? `${COVERS_URL}/b/id/${coverId}-${size}.jpg` : ""

export const authorPhotoUrl = (photoId, size = "M") =>
    photoId > 0 ? `${COVERS_URL}/a/id/${photoId}-${size}.jpg` : ""

export const cleanText = (value) => {
    const text = typeof value === "string" ? value : value?.value ?? ""
    return text
        .replace(/\r/g, "")
        .split(/\n-{3,}\s*\n/)[0]
        .replace(/^[ \t]*\[\d+\]:.*$/gm, "")
        .replace(/^\W*(?:source|fonte)\W*:.*$/gim, "")
        .replace(/\(\s*\[?source\]?(?:\[\d+\]|\([^)]*\))?\s*\)/gi, "")
        .replace(/[ \t]*[-–—][ \t]*(?:from[ \t]+)?wikipedia\.?[ \t]*$/gim, "")
        .replace(/\[([^\]]+)\]\((?:[^)]+)\)/g, "$1")
        .replace(/\[([^\]]+)\]\[\d+\]/g, "$1")
        .replace(/<\/?[a-z][^>]*>/gi, "")
        .replace(/(\*\*|__)(.+?)\1/g, "$2")
        .replace(/(^|[\s("])\*(\S(?:.*?\S)?)\*/gm, "$1$2")
        .replace(/&(amp|lt|gt|quot|#39);/g, (_, entity) => HTML_ENTITIES[entity])
        .replace(/[ \t]+$/gm, "")
        .replace(/\n{3,}/g, "\n\n")
        .trim()
}

const normalizeBook = ({ key, title, authors, coverId, year, rating, ratingCount }) => ({
    id: idFromKey(key),
    title,
    author: authors?.[0] ?? "Autor desconhecido",
    cover: coverUrl(coverId),
    year: year ?? null,
    rating: rating ?? null,
    ratingCount: ratingCount ?? 0,
})

const normalizeSearchDoc = (doc) => {
    const edition = doc.editions?.docs?.[0]
    const isPortuguese = edition?.language?.includes("por")
    return normalizeBook({
        key: doc.key,
        title: (isPortuguese && edition.title) || doc.title,
        authors: doc.author_name,
        coverId: (isPortuguese && edition.cover_i) || doc.cover_i,
        year: doc.first_publish_year,
        rating: doc.ratings_average,
        ratingCount: doc.ratings_count,
    })
}

const genreQuery = (slug) => GENRES.find((genre) => genre.slug === slug)?.query ?? `subject_key:${slug}`

const runSearch = async ({ terms, sort, page = 1, limit, signal }) => {
    const data = await request("/search.json", {
        params: { q: terms, sort, page, limit, lang: "pt", fields: SEARCH_FIELDS },
        signal,
    })
    return {
        books: (data.docs ?? []).map(normalizeSearchDoc),
        total: data.numFound ?? data.num_found ?? 0,
    }
}

export const searchBooks = async ({ query = "", genre = "", page = 1, limit = PAGE_SIZE, signal } = {}) => {
    const text = query.trim()
    const terms = [text, genre && genreQuery(genre)].filter(Boolean).join(" ")
    const { books, total } = await runSearch({
        terms,
        // Sem texto digitado não há relevância para ordenar: mostra primeiro os mais lidos.
        sort: text ? undefined : "readinglog",
        page,
        limit,
        signal,
    })
    return {
        books: text ? books : curateBooks(books, { maxPerAuthor: 3 }),
        total,
        hasMore: page * limit < total,
    }
}

export const getTrendingBooks = ({ period = "weekly", limit = 12, signal } = {}) =>
    cachedList(`trending:${period}:${limit}`, async () => {
        const data = await request(`/trending/${period}.json`, { params: { limit }, signal })
        return (data.works ?? []).map((work) =>
            normalizeBook({
                key: work.key,
                title: work.title,
                authors: work.author_name,
                coverId: work.cover_i,
                year: work.first_publish_year,
            })
        )
    })

export const getBooksByGenre = ({ genre, limit = 12, signal }) =>
    cachedList(`genre:${genre}:${limit}`, async () => {
        const { books } = await runSearch({ terms: genreQuery(genre), sort: "readinglog", limit: limit * 3, signal })
        return curateBooks(books, { limit })
    })

export const getTopRatedBooks = ({ limit = 3, signal } = {}) =>
    cachedList(`top-rated:${limit}`, async () => {
        const { books } = await runSearch({ terms: TOP_RATED_QUERY, sort: "rating", limit: limit * 5, signal })
        return curateBooks(books, { maxPerAuthor: 1, limit })
    })

export const getAuthor = async (authorId, { signal } = {}) => {
    const data = await request(`/authors/${authorId}.json`, { signal })
    return {
        id: authorId,
        name: data.name ?? data.personal_name ?? "Autor desconhecido",
        bio: cleanText(data.bio),
        birthDate: data.birth_date ?? "",
        deathDate: data.death_date ?? "",
        photo: authorPhotoUrl(data.photos?.find((photo) => photo > 0)),
    }
}

const valueOrNull = (result) => (result.status === "fulfilled" ? result.value : null)

export const getWork = async (workId, { signal } = {}) => {
    const work = await request(`/works/${workId}.json`, { signal })
    const coverId = work.covers?.find((cover) => cover > 0)
    return {
        id: workId,
        title: work.title,
        description: cleanText(work.description),
        cover: coverUrl(coverId, "L"),
        coverThumb: coverUrl(coverId),
        firstPublished: work.first_publish_date ?? "",
        subjects: (work.subjects ?? []).slice(0, 12),
        places: (work.subject_places ?? []).slice(0, 6),
        characters: (work.subject_people ?? []).slice(0, 6),
        authorIds: (work.authors ?? [])
            .map((entry) => idFromKey(entry.author?.key))
            .filter(Boolean)
            .slice(0, 3),
        url: `${BASE_URL}/works/${workId}`,
    }
}

// Autores e notas chegam depois da obra e, se falharem, não impedem de mostrar o livro.
export const getBookExtras = async ({ id, authorIds }, { signal } = {}) => {
    const [ratings, ...authors] = await Promise.allSettled([
        request(`/works/${id}/ratings.json`, { signal }),
        ...authorIds.map((authorId) => getAuthor(authorId, { signal })),
    ])

    if (signal?.aborted) throw new DOMException("Aborted", "AbortError")

    const authorList = authors.map(valueOrNull).filter(Boolean)
    const summary = valueOrNull(ratings)?.summary

    return {
        authors: authorList,
        author: authorList[0]?.name ?? "Autor desconhecido",
        rating: summary?.average ?? null,
        ratingCount: summary?.count ?? 0,
    }
}
