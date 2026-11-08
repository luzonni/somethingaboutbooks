import styled, { keyframes } from "styled-components"
import { FiZap } from "react-icons/fi"
import { Border, BrandText, Coral, Cream, DarkGray } from "../../assets/Colors"
import { minutesByDay, readingStreak } from "../../utils/readingStats"

const rise = keyframes`
    from { transform: scaleY(0); }
`

const ChartStyle = styled.section`
    padding: 1.25rem;
    border: 1px solid ${Border};
    border-radius: 14px;
    background-color: var(--color-surface-soft);
    .chart__head {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }
    h2 {
        font-size: 1.125rem;
        font-weight: 700;
    }
    .chart__streak {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        padding: 0.25rem 0.75rem;
        border-radius: 999px;
        background-color: ${Cream};
        color: ${BrandText};
        font-size: 0.875rem;
        font-weight: 500;
    }
    .chart__bars {
        display: grid;
        grid-template-columns: repeat(7, minmax(0, 1fr));
        align-items: end;
        gap: 0.5rem;
        height: 8rem;
    }
    .chart__day {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;
        gap: 0.375rem;
        height: 100%;
    }
    .chart__bar {
        width: 100%;
        max-width: 2.25rem;
        min-height: 4px;
        border-radius: 6px 6px 3px 3px;
        background-color: ${Cream};
        transform-origin: bottom;
        animation: ${rise} 700ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
    }
    .chart__bar--active {
        background-color: ${Coral};
    }
    .chart__label {
        color: ${DarkGray};
        font-size: 0.75rem;
    }
    .chart__today {
        color: inherit;
        font-weight: 700;
    }
    .chart__total {
        margin-top: 0.75rem;
        color: ${DarkGray};
        font-size: 0.875rem;
    }
`

const WeekChart = ({ sessions }) => {
    const days = minutesByDay(sessions)
    const highest = Math.max(...days.map(({ minutes }) => minutes), 1)
    const total = days.reduce((sum, { minutes }) => sum + minutes, 0)
    const streak = readingStreak(sessions)

    return (
        <ChartStyle aria-labelledby="week-title">
            <div className="chart__head">
                <h2 id="week-title">Últimos 7 dias</h2>
                {streak > 0 && (
                    <span className="chart__streak">
                        <FiZap aria-hidden="true" /> {streak} {streak === 1 ? "dia" : "dias"} seguidos
                    </span>
                )}
            </div>
            <div className="chart__bars">
                {days.map((day, index) => (
                    <div key={day.key} className="chart__day" title={`${day.minutes} min`}>
                        <div
                            className={`chart__bar ${day.minutes > 0 ? "chart__bar--active" : ""}`}
                            style={{ height: `${(day.minutes / highest) * 100}%`, animationDelay: `${index * 60}ms` }}
                            role="img"
                            aria-label={`${day.label}: ${day.minutes} minutos`}
                        />
                        <span className={`chart__label ${index === days.length - 1 ? "chart__today" : ""}`}>
                            {index === days.length - 1 ? "hoje" : day.label}
                        </span>
                    </div>
                ))}
            </div>
            <p className="chart__total">
                {total > 0 ? `${total} minutos de foco nesta semana.` : "Use o Pomodoro para registrar seu tempo de leitura."}
            </p>
        </ChartStyle>
    )
}

export default WeekChart
