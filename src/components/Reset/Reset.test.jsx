import { describe, expect, it } from "vitest"
import * as Colors from "../../assets/Colors"
import source from "./index.jsx?raw"

// Todas as variáveis usadas pela paleta e pelos CSS modules.
const tokens = () => {
    const fromColors = Object.values(Colors)
        .map((value) => value.match(/var\((--[\w-]+)\)/)?.[1])
        .filter(Boolean)
    const fromModules = ["--color-surface-soft", "--color-surface-hover", "--color-border-soft", "--color-brand-hover", "--color-on-brand", "--shadow-soft"]
    return [...new Set([...fromColors, ...fromModules])]
}

// Lê as declarações de um seletor direto do CSS do Reset (sem as interpolações ${...}).
const css = source.replace(/\$\{[^}]*\}/g, "valor")

const declared = (selector) => {
    const blocks = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].filter(([, found]) => found.trim().split("\n").pop().trim() === selector)
    const pairs = blocks.flatMap(([, , body]) => [...body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)])
    return Object.fromEntries(pairs.map(([, name, value]) => [name, value.trim()]))
}

const SELECTORS = { light: ":root", dark: ':root[data-theme="dark"]' }

describe("Reset", () => {
    it.each(["light", "dark"])("define todas as cores no tema %s", (theme) => {
        const values = declared(SELECTORS[theme])
        expect(tokens().filter((token) => !values[token])).toEqual([])
    })

    it("usa cores diferentes em cada tema", () => {
        expect(declared(SELECTORS.dark)["--color-surface"]).not.toBe(declared(SELECTORS.light)["--color-surface"])
    })
})
