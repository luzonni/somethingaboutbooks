import { describe, expect, it } from "vitest"
import {
    DEFAULT_SETTINGS as settings,
    createTimer,
    cycleProgress,
    formatTime,
    nextMode,
    sanitizeMinutes,
    timerReducer as reduce,
} from "./pomodoro"

const started = (now = 0) => reduce(createTimer(settings), { type: "START", now })

describe("pomodoro", () => {
    it("formata o tempo", () => {
        expect(formatTime(1500)).toBe("25:00")
        expect(formatTime(65)).toBe("01:05")
    })

    it("calcula o tempo pelo relógio e não pela quantidade de ticks", () => {
        const state = reduce(started(), { type: "TICK", settings, now: 600_000 })
        expect(state.remaining).toBe(900)
    })

    it("não altera o estado quando o segundo não mudou", () => {
        const state = reduce(started(), { type: "TICK", settings, now: 1000 })
        expect(reduce(state, { type: "TICK", settings, now: 1200 })).toBe(state)
    })

    it("pausa e retoma de onde parou", () => {
        const paused = reduce(started(), { type: "PAUSE", now: 60_000 })
        expect(paused).toMatchObject({ status: "paused", remaining: 1440, endsAt: null })

        const resumed = reduce(paused, { type: "START", now: 100_000 })
        expect(resumed.endsAt).toBe(100_000 + 1440 * 1000)
    })

    it("ignora ticks fora de execução", () => {
        const idle = createTimer(settings)
        expect(reduce(idle, { type: "TICK", settings, now: 9_999_999 })).toBe(idle)
    })

    it("conta o foco concluído e entra em pausa", () => {
        const state = reduce(started(), { type: "TICK", settings, now: 1500 * 1000 })
        expect(state).toMatchObject({ mode: "short", status: "idle", completedFocus: 1, remaining: 300 })
    })

    it("inicia a próxima etapa sozinho quando configurado", () => {
        const state = reduce(started(), {
            type: "TICK",
            settings: { ...settings, autoStart: true },
            now: 1500 * 1000,
        })
        expect(state).toMatchObject({ mode: "short", status: "running", endsAt: 1500 * 1000 + 300 * 1000 })
    })

    it("alterna pausa longa a cada ciclo", () => {
        expect(nextMode("focus", 1, settings)).toBe("short")
        expect(nextMode("focus", 4, settings)).toBe("long")
        expect(nextMode("short", 1, settings)).toBe("focus")
    })

    it("pular não conta como foco concluído", () => {
        const state = reduce(started(), { type: "SKIP", settings })
        expect(state).toMatchObject({ mode: "short", status: "idle", completedFocus: 0 })
    })

    it("mantém o ciclo cheio durante a pausa longa", () => {
        expect(cycleProgress({ completedFocus: 4, mode: "long" }, settings)).toEqual({ total: 4, done: 4 })
        expect(cycleProgress({ completedFocus: 4, mode: "focus" }, settings)).toEqual({ total: 4, done: 0 })
        expect(cycleProgress({ completedFocus: 5, mode: "short" }, settings)).toEqual({ total: 4, done: 1 })
    })

    it("aplica novas durações somente com o timer parado", () => {
        const custom = { ...settings, focus: 50 }
        expect(reduce(createTimer(settings), { type: "APPLY_SETTINGS", settings: custom }).remaining).toBe(3000)
        expect(reduce(started(), { type: "APPLY_SETTINGS", settings: custom }).remaining).toBe(1500)
    })

    it("limita valores de minutos inválidos", () => {
        expect(sanitizeMinutes("abc", 25)).toBe(25)
        expect(sanitizeMinutes("0", 25)).toBe(25)
        expect(sanitizeMinutes("999", 25)).toBe(180)
        expect(sanitizeMinutes("30", 25)).toBe(30)
    })
})
