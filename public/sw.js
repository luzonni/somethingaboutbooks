// Guarda as capas no navegador para que não sejam baixadas de novo a cada visita.
const CACHE_NAME = "sab-covers-v1"
const COVERS_HOST = "covers.openlibrary.org"
const MAX_COVERS = 500

self.addEventListener("install", () => self.skipWaiting())

self.addEventListener("activate", (event) => {
    event.waitUntil(
        (async () => {
            const names = await caches.keys()
            await Promise.all(
                names.filter((name) => name.startsWith("sab-covers-") && name !== CACHE_NAME).map((name) => caches.delete(name))
            )
            await self.clients.claim()
        })()
    )
})

const trimCache = async (cache) => {
    const keys = await cache.keys()
    await Promise.all(keys.slice(0, Math.max(keys.length - MAX_COVERS, 0)).map((key) => cache.delete(key)))
}

const coverFirst = async (request) => {
    const cache = await caches.open(CACHE_NAME)
    const cached = await cache.match(request.url)
    if (cached) return cached

    try {
        const response = await fetch(request.url, { mode: "cors" })
        if (response.ok) {
            await cache.put(request.url, response.clone())
            trimCache(cache)
        }
        return response
    } catch {
        return fetch(request)
    }
}

self.addEventListener("fetch", (event) => {
    const { request } = event
    if (request.method === "GET" && new URL(request.url).hostname === COVERS_HOST) {
        event.respondWith(coverFirst(request))
    }
})
