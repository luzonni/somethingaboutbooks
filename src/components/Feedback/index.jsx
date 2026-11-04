import styled, { keyframes } from "styled-components"
import { Link } from "react-router-dom"
import { MdErrorOutline, MdOutlineMenuBook } from "react-icons/md"
import { Coral, Cream, DarkGray, DarkRed, Gray, White } from "../../assets/Colors"

const spin = keyframes`
    to { transform: rotate(360deg); }
`

const pulse = keyframes`
    50% { opacity: 0.5; }
`

const SpinnerStyle = styled.div`
    width: 2.5rem;
    height: 2.5rem;
    margin: 2rem auto;
    border: 4px solid ${Gray};
    border-top-color: ${Coral};
    border-radius: 50%;
    animation: ${spin} 1s linear infinite;
`

export const Spinner = ({ label = "Carregando" }) => <SpinnerStyle role="status" aria-label={label} />

const MessageStyle = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    padding: 2.5rem 1rem;
    text-align: center;
    color: ${DarkGray};
    svg {
        font-size: 3rem;
        color: ${DarkRed};
    }
    h3 {
        font-size: 1.25rem;
        font-weight: 500;
        color: inherit;
    }
    .message__action {
        padding: 0.6rem 1.5rem;
        border: none;
        border-radius: 8px;
        background-color: ${DarkRed};
        color: ${White};
        font-weight: 500;
        text-decoration: none;
    }
`

export const ErrorState = ({ message = "Algo deu errado.", onRetry }) => (
    <MessageStyle role="alert">
        <MdErrorOutline aria-hidden="true" />
        <h3>{message}</h3>
        {onRetry && (
            <button type="button" className="message__action" onClick={onRetry}>
                Tentar novamente
            </button>
        )}
    </MessageStyle>
)

export const EmptyState = ({ title, description, actionLabel, actionTo }) => (
    <MessageStyle>
        <MdOutlineMenuBook aria-hidden="true" />
        <h3>{title}</h3>
        {description && <p>{description}</p>}
        {actionTo && (
            <Link className="message__action" to={actionTo}>
                {actionLabel}
            </Link>
        )}
    </MessageStyle>
)

export const Skeleton = styled.div`
    aspect-ratio: ${({ $ratio }) => $ratio ?? "auto"};
    width: ${({ $width }) => $width ?? "100%"};
    height: ${({ $height }) => $height ?? "auto"};
    border-radius: 6px;
    background-color: ${Cream};
    animation: ${pulse} 1.5s ease-in-out infinite;
`
