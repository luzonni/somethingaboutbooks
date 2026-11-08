import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import WeekChart from "."

const minutesAgo = (days, minutes) => {
    const date = new Date()
    date.setDate(date.getDate() - days)
    return { completedAt: date.toISOString(), minutes }
}

describe("WeekChart", () => {
    it("mostra o total da semana e a sequência de dias", () => {
        render(<WeekChart sessions={[minutesAgo(0, 25), minutesAgo(1, 50), minutesAgo(10, 99)]} />)
        expect(screen.getByText("75 minutos de foco nesta semana.")).toBeTruthy()
        expect(screen.getByText(/2 dias seguidos/)).toBeTruthy()
        expect(screen.getByRole("img", { name: /: 25 minutos$/ })).toBeTruthy()
    })

    it("convida a usar o Pomodoro quando não há sessões", () => {
        render(<WeekChart sessions={[]} />)
        expect(screen.getByText(/Use o Pomodoro/)).toBeTruthy()
        expect(screen.queryByText(/seguidos/)).toBeNull()
    })
})
