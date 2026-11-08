import { describe, expect, it } from "vitest"
import { dayKey, minutesByDay, readingStreak } from "./readingStats"

const session = (date, minutes = 25) => ({ completedAt: new Date(date).toISOString(), minutes })
const today = new Date("2026-03-10T15:00:00")

describe("minutesByDay", () => {
    it("soma os minutos de cada um dos últimos dias, do mais antigo ao atual", () => {
        const days = minutesByDay(
            [session("2026-03-10T08:00:00"), session("2026-03-10T20:00:00", 50), session("2026-03-08T10:00:00", 15)],
            { days: 3, today }
        )
        expect(days.map(({ minutes }) => minutes)).toEqual([15, 0, 75])
        expect(days.at(-1)).toMatchObject({ key: "2026-03-10", label: "ter" })
    })

    it("ignora sessões fora do período", () => {
        const days = minutesByDay([session("2026-02-01T10:00:00")], { days: 7, today })
        expect(days.every(({ minutes }) => minutes === 0)).toBe(true)
    })
})

describe("readingStreak", () => {
    it("conta dias seguidos até hoje", () => {
        const sessions = ["2026-03-10T09:00:00", "2026-03-09T23:30:00", "2026-03-08T07:00:00"].map((d) => session(d))
        expect(readingStreak(sessions, today)).toBe(3)
    })

    it("mantém a sequência quando ainda não houve leitura hoje", () => {
        const sessions = [session("2026-03-09T10:00:00"), session("2026-03-08T10:00:00")]
        expect(readingStreak(sessions, today)).toBe(2)
    })

    it("zera quando um dia ficou sem leitura", () => {
        expect(readingStreak([session("2026-03-08T10:00:00")], today)).toBe(0)
        expect(readingStreak([], today)).toBe(0)
    })

    it("usa o dia local", () => {
        expect(dayKey(new Date(2026, 0, 5, 23, 59))).toBe("2026-01-05")
    })
})
