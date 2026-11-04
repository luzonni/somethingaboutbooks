import { describe, expect, it } from "vitest"
import {
    hasErrors,
    validateBirthday,
    validateEmail,
    validatePassword,
    validatePasswordMatch,
    validateUsername,
} from "./validation"

describe("validation", () => {
    it("valida email", () => {
        expect(validateEmail("")).not.toBe("")
        expect(validateEmail("sem-arroba")).not.toBe("")
        expect(validateEmail("leitor@sab.com")).toBe("")
    })

    it("valida nome de usuário", () => {
        expect(validateUsername("ab")).not.toBe("")
        expect(validateUsername("com espaço")).not.toBe("")
        expect(validateUsername("leitor_01")).toBe("")
    })

    it("exige senha com tamanho mínimo", () => {
        expect(validatePassword("")).not.toBe("")
        expect(validatePassword("1234567")).not.toBe("")
        expect(validatePassword("12345678")).toBe("")
    })

    it("compara a confirmação de senha", () => {
        expect(validatePasswordMatch("a", "b")).not.toBe("")
        expect(validatePasswordMatch("a", "a")).toBe("")
    })

    it("rejeita nascimento no futuro", () => {
        const today = new Date("2026-01-10T12:00:00")
        expect(validateBirthday("2026-01-11", today)).not.toBe("")
        expect(validateBirthday("2000-01-01", today)).toBe("")
        expect(validateBirthday("", today)).toBe("")
    })

    it("detecta erros preenchidos", () => {
        expect(hasErrors({ a: "", b: "" })).toBe(false)
        expect(hasErrors({ a: "", b: "erro" })).toBe(true)
    })
})
