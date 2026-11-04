const MONTHS = {
    january: "janeiro",
    february: "fevereiro",
    march: "março",
    april: "abril",
    may: "maio",
    june: "junho",
    july: "julho",
    august: "agosto",
    september: "setembro",
    october: "outubro",
    november: "novembro",
    december: "dezembro",
}

// A Open Library guarda datas como texto livre: "14 May 1958", "May 14, 1958", "1958"...
export const formatApiDate = (value = "") => {
    const text = value.trim()
    const dayFirst = text.match(/^(\d{1,2})\s+([a-z]+)\.?,?\s+(\d{3,4})$/i)
    const monthFirst = text.match(/^([a-z]+)\.?\s+(\d{1,2}),?\s+(\d{3,4})$/i)
    const monthOnly = text.match(/^([a-z]+)\.?,?\s+(\d{3,4})$/i)

    if (dayFirst && MONTHS[dayFirst[2].toLowerCase()]) {
        return `${Number(dayFirst[1])} de ${MONTHS[dayFirst[2].toLowerCase()]} de ${dayFirst[3]}`
    }
    if (monthFirst && MONTHS[monthFirst[1].toLowerCase()]) {
        return `${Number(monthFirst[2])} de ${MONTHS[monthFirst[1].toLowerCase()]} de ${monthFirst[3]}`
    }
    if (monthOnly && MONTHS[monthOnly[1].toLowerCase()]) {
        return `${MONTHS[monthOnly[1].toLowerCase()]} de ${monthOnly[2]}`
    }
    return text
}

export const formatLifespan = (birthDate, deathDate) => {
    const birth = formatApiDate(birthDate)
    const death = formatApiDate(deathDate)
    if (birth && death) return `${birth} – ${death}`
    if (birth) return `Nascimento: ${birth}`
    return death ? `Falecimento: ${death}` : ""
}
