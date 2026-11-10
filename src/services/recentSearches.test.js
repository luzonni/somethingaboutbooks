import { beforeEach, describe, expect, it } from "vitest"
import { addRecentSearch, clearRecentSearches, getRecentSearches, MAX_RECENT_SEARCHES } from "./recentSearches"

describe("recentSearches", () => {
    beforeEach(() => localStorage.clear())

    it("guarda a busca mais nova primeiro", () => {
        addRecentSearch("duna")
        addRecentSearch("o hobbit")
        expect(getRecentSearches()).toEqual(["o hobbit", "duna"])
    })

    it("não repete buscas iguais, ignorando maiúsculas e espaços extras", () => {
        addRecentSearch("Duna")
        addRecentSearch("o hobbit")
        addRecentSearch("  duna  ")
        expect(getRecentSearches()).toEqual(["duna", "o hobbit"])
    })

    it("ignora buscas vazias", () => {
        addRecentSearch("   ")
        expect(getRecentSearches()).toEqual([])
    })

    it(`guarda no máximo ${MAX_RECENT_SEARCHES} buscas`, () => {
        for (let i = 0; i < MAX_RECENT_SEARCHES + 3; i++) addRecentSearch(`busca ${i}`)
        expect(getRecentSearches()).toHaveLength(MAX_RECENT_SEARCHES)
        expect(getRecentSearches()[0]).toBe(`busca ${MAX_RECENT_SEARCHES + 2}`)
    })

    it("descarta dados corrompidos", () => {
        localStorage.setItem("sab:recent-searches", JSON.stringify({ nada: true }))
        expect(getRecentSearches()).toEqual([])
        localStorage.setItem("sab:recent-searches", JSON.stringify(["duna", 3, ""]))
        expect(getRecentSearches()).toEqual(["duna"])
    })

    it("limpa o histórico", () => {
        addRecentSearch("duna")
        clearRecentSearches()
        expect(getRecentSearches()).toEqual([])
    })
})
