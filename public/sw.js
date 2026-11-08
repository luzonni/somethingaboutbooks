// Service worker do SAB: guarda as capas e os arquivos do site para abrir rápido e funcionar sem internet.
const COVERS_CACHE = "sab-covers-v1"
const APP_CACHE = "sab-app-v1"
const CURRENT_CACHES = [COVERS_CACHE, APP_CACHE]
const COVERS_HOST = "covers.openlibrary.org"
const MAX_COVERS = 500
// Raiz do site, que pode ser um subcaminho (ex.: /somethingaboutbooks/ no GitHub Pages).
const SCOPE = new URL(self.registration.scope).pathname

self.addEventListener("install", (event) => {
    event.waitUntil(caches.open(APP_CACHE).then((cache) => cache.add(SCOPE)).catch(() => {}))
    self.skipWaiting()
})

self.addEventListener("activate", (event) => {
    event.waitUntil(
        (async () => {
            const names = await caches.keys()
            await Promise.all(
                names.filter((name) => name.startsWith("sab-") && !CURRENT_CACHES.includes(name)).map((name) => caches.delete(name))
            )
            await self.clients.claim()
        })()
    )
})

const trimCache = async (cache, max) => {
    const keys = await cache.keys()
    await Promise.all(keys.slice(0, Math.max(keys.length - max, 0)).map((key) => cache.delete(key)))
}

const coverFirst = async (request) => {
    const cache = await caches.open(COVERS_CACHE)
    const cached = await cache.match(request.url)
    if (cached) return cached

    try {
        const response = await fetch(request.url, { mode: "cors" })
        if (response.ok) {
            await cache.put(request.url, response.clone())
            trimCache(cache, MAX_COVERS)
        }
        return response
    } catch {
        return fetch(request)
    }
}

// Páginas: tenta a rede para ter a versão mais nova; sem internet, abre a última guardada.
const pageNetworkFirst = async (request) => {
    const cache = await caches.open(APP_CACHE)
    try {
        const response = await fetch(request)
        if (response.ok) cache.put(SCOPE, response.clone())
        return response
    } catch {
        return (await cache.match(SCOPE)) ?? Response.error()
    }
}

// Arquivos do build têm hash no nome: a versão guardada nunca fica desatualizada.
const assetCacheFirst = async (request) => {
    const cache = await caches.open(APP_CACHE)
    const cached = await cache.match(request)
    if (cached) return cached
    const response = await fetch(request)
    if (response.ok) cache.put(request, response.clone())
    return response
}

self.addEventListener("fetch", (event) => {
    const { request } = event
    if (request.method !== "GET") return
    const url = new URL(request.url)

    if (url.hostname === COVERS_HOST) {
        event.respondWith(coverFirst(request))
    } else if (url.origin === self.location.origin) {
        if (request.mode === "navigate") event.respondWith(pageNetworkFirst(request))
        else if (/^(assets|icons|imgs)\//.test(url.pathname.slice(SCOPE.length))) event.respondWith(assetCacheFirst(request))
    }
})
