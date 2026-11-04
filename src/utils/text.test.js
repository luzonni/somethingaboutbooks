import { describe, expect, it } from "vitest"
import { formatApiDate, formatLifespan, truncateText } from "./text"

describe("formatApiDate", () => {
    it("traduz os formatos usados pela Open Library", () => {
        expect(formatApiDate("14 May 1958")).toBe("14 de maio de 1958")
        expect(formatApiDate("January 3, 1892")).toBe("3 de janeiro de 1892")
        expect(formatApiDate("March 1950")).toBe("março de 1950")
    })

    it("mantém o que não reconhece", () => {
        expect(formatApiDate("1892")).toBe("1892")
        expect(formatApiDate("c. 1564")).toBe("c. 1564")
        expect(formatApiDate("Smarch 1950")).toBe("Smarch 1950")
        expect(formatApiDate()).toBe("")
    })
})

describe("formatLifespan", () => {
    it("deixa claro quando só existe uma das datas", () => {
        expect(formatLifespan("14 May 1958", "")).toBe("Nascimento: 14 de maio de 1958")
        expect(formatLifespan("", "1973")).toBe("Falecimento: 1973")
        expect(formatLifespan("1892", "1973")).toBe("1892 – 1973")
        expect(formatLifespan("", "")).toBe("")
    })
})

describe("truncateText", () => {
    it("não corta no meio da palavra", () => {
        expect(truncateText("Crush Your Enemy Totally", 18)).toBe("Crush Your Enemy…")
    })

    it("remove pontuação antes das reticências", () => {
        expect(truncateText("Primeira frase, segunda frase", 15)).toBe("Primeira frase…")
    })

    it("devolve textos curtos sem alteração", () => {
        expect(truncateText("Curto", 10)).toBe("Curto")
    })

    it("corta palavras sem espaço pelo limite", () => {
        expect(truncateText("abcdefghij", 5)).toBe("abcde…")
    })
})
