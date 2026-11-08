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
    "number_of_pages_median",
    "editions",
    "editions.title",
    "editions.language",
    "editions.cover_i",
].join(",")

export const PAGE_SIZE = 24

export const SORT_OPTIONS = [
    { value: "", label: "Relevância" },
    { value: "readinglog", label: "Mais lidos" },
    { value: "rating", label: "Melhor avaliados" },
    { value: "new", label: "Mais recentes" },
]
const SORT_VALUES = new Set(SORT_OPTIONS.map(({ value }) => value))

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
const listSource = (key, loader) => {
    const storageKey = `sab:cache:${key}`
    const peek = () => {
        const saved = readJson(storageKey, null)
        return saved && Date.now() - saved.savedAt < LIST_CACHE_TTL ? saved.books : null
    }
    const load = async (signal) => {
        const saved = peek()
        if (saved) return saved
        const books = await loader(signal)
        if (books.length > 0) writeJson(storageKey, { books, savedAt: Date.now() })
        return books
    }
    return { peek, load }
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

// Obras e autores duplicados viram redirecionamentos dentro do próprio JSON, com status 200.
const requestRecord = async (path, options, depth = 0) => {
    const data = await request(path, options)
    const type = data.type?.key
    if (type === "/type/redirect" && data.location && depth < 3) {
        return requestRecord(`${data.location}.json`, options, depth + 1)
    }
    if (type === "/type/redirect" || type === "/type/delete") {
        throw new ApiError("Conteúdo não encontrado.", 404)
    }
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

// Etiquetas de catalogação que não dizem nada ao leitor.
const INTERNAL_TAG = /^(accessible book|protected daisy|in library|lending library|large type books|internet archive wishlist|overdrive|open library staff picks|open[ _]syllabus[ _]project|translations? (into|from) .*|[a-z ]* ?translations?|general|reading level.*|long now manual.*|nyt[ :-].*)$/i

// Transforma "series:Harry_Potter" em "Harry Potter" e descarta etiquetas técnicas como "nyt:fiction=2008".
export const cleanTags = (tags = [], limit = tags.length) => {
    const seen = new Set()
    return tags
        .map((tag) => {
            const value = String(tag).trim()
            const series = value.match(/^series:(.+)$/i)
            if (!series && /^[a-z_-]+[:=]\S/i.test(value)) return ""
            return (series ? series[1] : value).replace(/_/g, " ").replace(/\s+/g, " ").trim()
        })
        .filter((tag) => {
            const key = tag.toLowerCase()
            if (!tag || INTERNAL_TAG.test(tag) || seen.has(key)) return false
            seen.add(key)
            return true
        })
        .slice(0, limit)
}

// Remove anotações de catálogo: "... Título", "Título [12 stories]", "Título [collection/set]".
export const cleanTitle = (title = "") =>
    title
        .replace(/^[\s.…]+/, "")
        .replace(/\s*\[[^\]]*\]\s*$/, "")
        .trim() || title

const normalizeBook = ({ key, title, authors, coverId, year, rating, ratingCount, pages }) => ({
    id: idFromKey(key),
    title: cleanTitle(title),
    author: authors?.[0] ?? "Autor desconhecido",
    cover: coverUrl(coverId),
    year: year ?? null,
    rating: rating ?? null,
    ratingCount: ratingCount ?? 0,
    ...(pages > 0 ? { pages } : {}),
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
        pages: doc.number_of_pages_median,
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

export const searchBooks = async ({ query = "", genre = "", sort = "", page = 1, limit = PAGE_SIZE, signal } = {}) => {
    const text = query.trim()
    const terms = [text, genre && genreQuery(genre)].filter(Boolean).join(" ")
    const { books, total } = await runSearch({
        terms,
        // Sem texto digitado não há relevância para ordenar: mostra primeiro os mais lidos.
        sort: (SORT_VALUES.has(sort) && sort) || (text ? undefined : "readinglog"),
        page,
        limit,
        signal,
    })
    return {
        books: text || sort ? books : curateBooks(books, { maxPerAuthor: 3 }),
        total,
        hasMore: page * limit < total,
    }
}

export const trendingList = ({ period = "weekly", limit = 12 } = {}) =>
    listSource(`trending:${period}:${limit}`, async (signal) => {
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

export const genreList = (genre, { limit = 12 } = {}) =>
    listSource(`genre:${genre}:${limit}`, async (signal) => {
        const { books } = await runSearch({ terms: genreQuery(genre), sort: "readinglog", limit: limit * 3, signal })
        return curateBooks(books, { limit })
    })

export const topRatedList = ({ limit = 3 } = {}) =>
    listSource(`top-rated:${limit}`, async (signal) => {
        const { books } = await runSearch({ terms: TOP_RATED_QUERY, sort: "rating", limit: limit * 5, signal })
        return curateBooks(books, { maxPerAuthor: 1, limit })
    })

// Listas ligadas a um livro: ficam só no cache em memória para não encher o armazenamento do navegador.
const relatedSource = (terms, excludeId, curation) => ({
    peek: () => null,
    load: async (signal) => {
        const { books } = await runSearch({ terms, sort: "readinglog", limit: curation.limit * 2, signal })
        return curateBooks(books.filter((book) => book.id !== excludeId), curation)
    },
})

export const authorBooksList = (authorName, excludeId, { limit = 12 } = {}) =>
    relatedSource(`author:"${authorName.replace(/"/g, "")}"`, excludeId, { limit, maxPerAuthor: limit })

const GENRE_HINTS = [
    ["science fiction", "science_fiction"],
    ["fantasy", "fantasy"],
    ["horror", "horror"],
    ["romance", "romance"],
    ["love stories", "romance"],
    ["detective", "mystery"],
    ["mystery", "mystery"],
    ["biograph", "biography"],
    ["history", "history"],
]

export const similarBooksList = (subjects, excludeId, { limit = 12 } = {}) => {
    if (subjects.length === 0) return null
    const text = subjects.join(" | ").toLowerCase()
    const genre = GENRE_HINTS.find(([hint]) => text.includes(hint))?.[1]
    const terms = genre ? genreQuery(genre) : `subject:"${subjects[0].replace(/"/g, "")}"`
    return relatedSource(terms, excludeId, { limit, maxPerAuthor: 2 })
}

export const getTrendingBooks = ({ signal, ...options } = {}) => trendingList(options).load(signal)

export const getAuthor = async (authorId, { signal } = {}) => {
    const data = await requestRecord(`/authors/${authorId}.json`, { signal })
    return {
        id: authorId,
        name: data.name ?? data.personal_name ?? "Autor desconhecido",
        bio: cleanText(data.bio),
        birthDate: data.birth_date ?? "",
        deathDate: data.death_date ?? "",
        photo: authorPhotoUrl(data.photos?.find((photo) => photo > 0)),
        photoLarge: authorPhotoUrl(data.photos?.find((photo) => photo > 0), "L"),
        fullName: data.fuller_name && data.fuller_name !== data.name ? data.fuller_name : "",
        links: (data.links ?? [])
            .filter((link) => /^https?:\/\//.test(link.url ?? ""))
            .slice(0, 5)
            .map(({ title, url }) => ({ title: title || new URL(url).hostname, url })),
        wikipedia: data.wikipedia || (data.remote_ids?.wikidata ? `https://www.wikidata.org/wiki/${data.remote_ids.wikidata}` : ""),
        url: `${BASE_URL}/authors/${authorId}`,
    }
}

// Obras do autor, das mais lidas para as menos lidas.
export const getAuthorWorks = async (authorId, { page = 1, limit = PAGE_SIZE, signal } = {}) => {
    const { books, total } = await runSearch({ terms: `author_key:${authorId}`, sort: "readinglog", page, limit, signal })
    return { books: books.filter((book) => book.title), total, hasMore: page * limit < total }
}

const valueOrNull = (result) => (result.status === "fulfilled" ? result.value : null)

export const getWork = async (workId, { signal } = {}) => {
    const work = await requestRecord(`/works/${workId}.json`, { signal })
    if (!work.title) throw new ApiError("Conteúdo não encontrado.", 404)
    const coverId = work.covers?.find((cover) => cover > 0)
    return {
        id: idFromKey(work.key) || workId,
        title: cleanTitle(work.title),
        description: cleanText(work.description),
        cover: coverUrl(coverId, "L"),
        coverThumb: coverUrl(coverId),
        firstPublished: work.first_publish_date ?? "",
        subjects: cleanTags(work.subjects, 12),
        places: cleanTags(work.subject_places, 6),
        characters: cleanTags(work.subject_people, 6),
        authorIds: (work.authors ?? [])
            .map((entry) => idFromKey(entry.author?.key))
            .filter(Boolean)
            .slice(0, 3),
        url: `${BASE_URL}${work.key ?? `/works/${workId}`}`,
    }
}

// Autores e notas chegam depois da obra e, se falharem, não impedem de mostrar o livro.
export const getBookExtras = async ({ id, authorIds }, { signal } = {}) => {
    const [ratings, edition, ...authors] = await Promise.allSettled([
        request(`/works/${id}/ratings.json`, { signal }),
        // O número de páginas fica nas edições: a busca devolve a mediana entre elas.
        request("/search.json", { params: { q: `key:/works/${id}`, fields: "number_of_pages_median" }, signal }),
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
        ratingCounts: valueOrNull(ratings)?.counts ?? {},
        pages: valueOrNull(edition)?.docs?.[0]?.number_of_pages_median ?? null,
    }
}
