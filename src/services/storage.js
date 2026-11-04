export const readJson = (key, fallback, store = localStorage) => {
    try {
        const raw = store.getItem(key)
        return raw === null ? fallback : JSON.parse(raw)
    } catch {
        return fallback
    }
}

export const writeJson = (key, value, store = localStorage) => {
    try {
        store.setItem(key, JSON.stringify(value))
        return true
    } catch {
        return false
    }
}

export const removeKey = (key, store = localStorage) => {
    try {
        store.removeItem(key)
    } catch {
        // Armazenamento bloqueado pelo navegador: não há o que limpar.
    }
}
