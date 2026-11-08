const DAY = 24 * 60 * 60 * 1000
const WEEKDAYS = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"]

// Chave do dia no fuso local, para que sessões de madrugada não caiam no dia errado.
export const dayKey = (value) => {
    const date = new Date(value)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

const startOfDay = (value) => {
    const date = new Date(value)
    date.setHours(0, 0, 0, 0)
    return date
}

const minutesPerDay = (sessions) =>
    sessions.reduce((totals, session) => {
        const key = dayKey(session.completedAt)
        totals.set(key, (totals.get(key) ?? 0) + session.minutes)
        return totals
    }, new Map())

export const minutesByDay = (sessions, { days = 7, today = new Date() } = {}) => {
    const totals = minutesPerDay(sessions)
    const end = startOfDay(today)
    return Array.from({ length: days }, (_, index) => {
        const date = new Date(end.getTime() - (days - 1 - index) * DAY)
        return { key: dayKey(date), label: WEEKDAYS[date.getDay()], minutes: totals.get(dayKey(date)) ?? 0 }
    })
}

// Dias seguidos com leitura. Hoje ainda sem sessão não quebra a sequência: ela vale até o fim do dia.
export const readingStreak = (sessions, today = new Date()) => {
    const days = new Set(sessions.map((session) => dayKey(session.completedAt)))
    let cursor = startOfDay(today)
    if (!days.has(dayKey(cursor))) cursor = new Date(cursor.getTime() - DAY)

    let streak = 0
    while (days.has(dayKey(cursor))) {
        streak += 1
        cursor = new Date(cursor.getTime() - DAY)
    }
    return streak
}
