import { readJson, removeKey, writeJson } from "./storage"

const KEY = "sab:recent-searches"
export const MAX_RECENT_SEARCHES = 6

export const getRecentSearches = () => {
    const saved = readJson(KEY, [])
    return Array.isArray(saved) ? saved.filter((item) => typeof item === "string" && item.trim()) : []
}

// A busca mais nova vai para o topo; repetir uma busca antiga só a traz de volta para cima.
export const addRecentSearch = (query) => {
    const text = query.trim().replace(/\s+/g, " ")
    if (!text) return getRecentSearches()
    const key = text.toLowerCase()
    const next = [text, ...getRecentSearches().filter((item) => item.toLowerCase() !== key)].slice(
        0,
        MAX_RECENT_SEARCHES
    )
    writeJson(KEY, next)
    return next
}

export const clearRecentSearches = () => removeKey(KEY)
