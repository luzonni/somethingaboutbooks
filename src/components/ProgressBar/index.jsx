import styled, { keyframes } from "styled-components"
import { Coral, Cream, DarkGray } from "../../assets/Colors"

const grow = keyframes`
    from { transform: scaleX(0); }
`

const ProgressStyle = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    .progress__track {
        flex: 1;
        height: ${({ $height }) => $height};
        overflow: hidden;
        border-radius: 999px;
        background-color: ${Cream};
    }
    .progress__fill {
        height: 100%;
        border-radius: inherit;
        background-color: ${Coral};
        transform-origin: left;
        animation: ${grow} 700ms cubic-bezier(0.2, 0.8, 0.2, 1);
        transition: width 400ms ease;
    }
    .progress__label {
        flex-shrink: 0;
        color: ${DarkGray};
        font-size: 0.8125rem;
        font-variant-numeric: tabular-nums;
    }
`

const ProgressBar = ({ value, label, showPercent = true, height = "0.375rem", className }) => {
    const percent = Math.round(Math.min(Math.max(value, 0), 1) * 100)
    return (
        <ProgressStyle $height={height} className={className}>
            <div
                className="progress__track"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={percent}
                aria-label={label ?? "Progresso"}
            >
                <div className="progress__fill" style={{ width: `${percent}%` }} />
            </div>
            {showPercent && <span className="progress__label">{percent}%</span>}
        </ProgressStyle>
    )
}

export default ProgressBar
