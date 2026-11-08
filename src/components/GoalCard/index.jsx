import { useState } from "react"
import styled, { keyframes } from "styled-components"
import { FiEdit2, FiTarget } from "react-icons/fi"
import { Border, BrandText, Coral, Cream, DarkGray, DarkRed, Surface, White } from "../../assets/Colors"
import { useLibrary } from "../../context/LibraryContext"
import { useToast } from "../../context/ToastContext"
import { MAX_GOAL, libraryStats } from "../../services/library"

const RADIUS = 42
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

const fill = keyframes`
    from { stroke-dashoffset: ${CIRCUMFERENCE}; }
`

const GoalStyle = styled.section`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1.25rem;
    padding: 1.25rem;
    border: 1px solid ${Border};
    border-radius: 14px;
    background-color: var(--color-surface-soft);
    .goal__ring {
        position: relative;
        flex-shrink: 0;
        width: 6.5rem;
        height: 6.5rem;
    }
    .goal__ring svg {
        width: 100%;
        height: 100%;
        transform: rotate(-90deg);
    }
    .goal__ring circle {
        fill: none;
        stroke-width: 9;
    }
    .goal__track {
        stroke: ${Cream};
    }
    .goal__value {
        stroke: ${Coral};
        stroke-linecap: round;
        animation: ${fill} 900ms cubic-bezier(0.2, 0.8, 0.2, 1);
        transition: stroke-dashoffset 500ms ease;
    }
    .goal__count {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        line-height: 1.1;
    }
    .goal__count strong {
        font-size: 1.5rem;
        font-weight: 700;
    }
    .goal__count span {
        color: ${DarkGray};
        font-size: 0.8125rem;
    }
    .goal__text {
        display: flex;
        flex: 1;
        flex-direction: column;
        gap: 0.375rem;
        min-width: 12rem;
    }
    .goal__text h2 {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        font-size: 1.125rem;
        font-weight: 700;
    }
    .goal__text p {
        color: ${DarkGray};
    }
    form {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-top: 0.25rem;
    }
    input {
        width: 6rem;
        padding: 0.4rem 0.6rem;
        border: 1px solid ${Border};
        border-radius: 8px;
        background-color: ${Surface};
    }
    button {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        padding: 0.4rem 1rem;
        border: none;
        border-radius: 8px;
        background-color: ${DarkRed};
        color: ${White};
        font-weight: 500;
    }
    .goal__edit {
        align-self: flex-start;
        padding: 0;
        background: none;
        color: ${BrandText};
    }
`

const goalMessage = (read, goal, year) => {
    if (read >= goal) return `Meta de ${year} concluída! Que tal aumentar o desafio?`
    const missing = goal - read
    return `Faltam ${missing} ${missing === 1 ? "livro" : "livros"} para a meta de ${year}.`
}

const GoalCard = () => {
    const { library, setGoal } = useLibrary()
    const { notify } = useToast()
    const year = new Date().getFullYear()
    const { readThisYear, goal } = libraryStats(library, year)
    const [editing, setEditing] = useState(false)
    const [value, setValue] = useState(goal ?? 12)

    const handleSubmit = (event) => {
        event.preventDefault()
        setGoal(year, value)
        setEditing(false)
        notify(Number(value) > 0 ? `Meta de ${year} definida` : `Meta de ${year} removida`, { tone: "info" })
    }

    const progress = goal ? Math.min(readThisYear / goal, 1) : 0

    return (
        <GoalStyle aria-labelledby="goal-title">
            <div className="goal__ring">
                <svg viewBox="0 0 100 100" aria-hidden="true">
                    <circle className="goal__track" cx="50" cy="50" r={RADIUS} />
                    <circle
                        className="goal__value"
                        cx="50"
                        cy="50"
                        r={RADIUS}
                        strokeDasharray={CIRCUMFERENCE}
                        strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
                    />
                </svg>
                <div className="goal__count">
                    <strong>{readThisYear}</strong>
                    <span>{goal ? `de ${goal}` : "lidos"}</span>
                </div>
            </div>
            <div className="goal__text">
                <h2 id="goal-title"><FiTarget aria-hidden="true" /> Meta de leitura {year}</h2>
                {editing || !goal ? (
                    <form onSubmit={handleSubmit}>
                        <input
                            type="number"
                            min="0"
                            max={MAX_GOAL}
                            aria-label="Livros que quero ler neste ano"
                            value={value}
                            onChange={(event) => setValue(event.target.value)}
                        />
                        <button type="submit">{goal ? "Salvar" : "Definir meta"}</button>
                    </form>
                ) : (
                    <>
                        <p>{goalMessage(readThisYear, goal, year)}</p>
                        <button type="button" className="goal__edit" onClick={() => setEditing(true)}>
                            <FiEdit2 aria-hidden="true" /> Alterar meta
                        </button>
                    </>
                )}
            </div>
        </GoalStyle>
    )
}

export default GoalCard
