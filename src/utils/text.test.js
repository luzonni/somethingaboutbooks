import { describe, expect, it } from "vitest"
import { formatApiDate, formatLifespan } from "./text"

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
