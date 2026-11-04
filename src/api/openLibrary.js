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

export const GENRES = [
    { slug: "fantasy", label: "Fantasia" },
    { slug: "romance", label: "Romance" },
    { slug: "science_fiction", label: "Ficção científica" },
    { slug: "horror", label: "Terror" },
    { slug: "mystery", label: "Mistério" },
    { slug: "classics", label: "Clássicos" },
    { slug: "biography", label: "Biografia" },
    { slug: "history", label: "História" },
]

const HTML_ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'" }

const cache = new Map()

export const clearApiCache = () => cache.clear()

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

export const searchBooks = async ({ query = "", genre = "", page = 1, limit = PAGE_SIZE, signal } = {}) => {
    const terms = [query.trim(), genre && `subject_key:${genre}`].filter(Boolean).join(" ")
    const data = await request("/search.json", {
        params: { q: terms, page, limit, lang: "pt", fields: SEARCH_FIELDS },
        signal,
    })
    const books = (data.docs ?? []).map(normalizeSearchDoc)
    const total = data.numFound ?? data.num_found ?? 0
    return { books, total, hasMore: page * limit < total }
}

export const getTrendingBooks = async ({ period = "weekly", limit = 12, signal } = {}) => {
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
}

export const getBooksByGenre = async ({ genre, limit = 12, signal }) => {
    const data = await request(`/subjects/${genre}.json`, { params: { limit }, signal })
    return (data.works ?? []).map((work) =>
        normalizeBook({
            key: work.key,
            title: work.title,
            authors: work.authors?.map((author) => author.name),
            coverId: work.cover_id,
            year: work.first_publish_year,
        })
    )
}

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

export const getBookDetails = async (workId, { signal } = {}) => {
    const work = await request(`/works/${workId}.json`, { signal })
    const authorIds = (work.authors ?? [])
        .map((entry) => idFromKey(entry.author?.key))
        .filter(Boolean)
        .slice(0, 3)

    const [ratings, ...authors] = await Promise.allSettled([
        request(`/works/${workId}/ratings.json`, { signal }),
        ...authorIds.map((authorId) => getAuthor(authorId, { signal })),
    ])

    if (signal?.aborted) throw new DOMException("Aborted", "AbortError")

    const authorList = authors.map(valueOrNull).filter(Boolean)
    const summary = valueOrNull(ratings)?.summary
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
        authors: authorList,
        author: authorList[0]?.name ?? "Autor desconhecido",
        rating: summary?.average ?? null,
        ratingCount: summary?.count ?? 0,
        url: `${BASE_URL}/works/${workId}`,
    }
}
