import { useState } from "react"
import styled, { css, keyframes } from "styled-components"
import { FaSearch } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { Border, Coral, Cream, Ink, Surface } from "../../assets/Colors"
import { useTypingPlaceholder } from "../../hooks/useTypingPlaceholder"

// Só opacidade e escala: o navegador anima na GPU, sem repintar a página a cada quadro.
const glow = keyframes`
    0% { opacity: 0.55; transform: scale(1); }
    70%, 100% { opacity: 0; transform: scale(1.04, 1.3); }
`

const animatedStyles = css`
    position: relative;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
    &::before {
        content: "";
        position: absolute;
        inset: 0;
        z-index: -1;
        border-radius: inherit;
        background-color: rgba(227, 96, 101, 0.6);
        animation: ${glow} 3s ease-out 1.5s infinite;
        pointer-events: none;
    }
    &:focus-within {
        transform: translateY(-3px) scale(1.015);
        box-shadow: 0 14px 34px rgba(0, 0, 0, 0.45), 0 0 0 4px rgba(227, 96, 101, 0.55);
    }
    &:focus-within::before {
        animation: none;
        opacity: 0;
    }
`

const SearchStyle = styled.form`
    display: flex;
    width: 100%;
    max-width: ${({ $compact }) => ($compact ? "18rem" : "40rem")};
    margin: 0 auto;
    border-radius: 12px;
    transition: transform 250ms ease, box-shadow 250ms ease;
    ${({ $animated }) => $animated && animatedStyles}
    &:focus-within {
        box-shadow: 0 0 0 3px rgba(227, 96, 101, 0.4);
    }
    input {
        flex: 1;
        min-width: 0;
        padding: ${({ $compact }) => ($compact ? "0.4rem 0.75rem" : "0.75rem 1rem")};
        background-color: ${({ $compact }) => ($compact ? Surface : Cream)};
        border: 2px solid ${Border};
        border-right: none;
        border-radius: 12px 0 0 12px;
        font-size: ${({ $compact }) => ($compact ? "0.9375rem" : "1.125rem")};
    }
    input:focus {
        outline: none;
    }
    button {
        display: flex;
        align-items: center;
        padding: ${({ $compact }) => ($compact ? "0 0.75rem" : "0 1.25rem")};
        background-color: ${Coral};
        border: none;
        border-radius: 0 12px 12px 0;
        color: ${Ink};
        font-size: ${({ $compact }) => ($compact ? "1rem" : "1.25rem")};
        transition: filter 150ms ease;
    }
    button:hover {
        filter: brightness(0.92);
    }
    button svg {
        transition: transform 200ms ease;
    }
    button:hover svg {
        transform: scale(1.2) rotate(-8deg);
    }
    button:active svg {
        transform: scale(0.9);
    }
`

const SUGGESTIONS = ["O Hobbit", "Machado de Assis", "Duna", "Clarice Lispector", "Harry Potter", "ficção científica"]
const DEFAULT_PLACEHOLDER = "Título, autor ou assunto"

const Search = ({ initialValue = "", extraParams = "", compact = false, animated = false }) => {
    const [value, setValue] = useState(initialValue)
    const [focused, setFocused] = useState(false)
    const navigate = useNavigate()
    const placeholder = useTypingPlaceholder(SUGGESTIONS, {
        active: animated && !focused && !value,
        fallback: DEFAULT_PLACEHOLDER,
    })

    const handleSubmit = (event) => {
        event.preventDefault()
        const params = new URLSearchParams(extraParams)
        const query = value.trim()
        if (query) params.set("q", query)
        else params.delete("q")
        const search = params.toString()
        navigate(search ? `/books?${search}` : "/books")
    }

    return (
        <SearchStyle $compact={compact} $animated={animated} role="search" onSubmit={handleSubmit}>
            <input
                type="search"
                aria-keyshortcuts="/"
                title="Atalho: /"
                aria-label="Buscar livros"
                placeholder={placeholder}
                value={value}
                onChange={(event) => setValue(event.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
            />
            <button type="submit" aria-label="Buscar">
                <FaSearch aria-hidden="true" />
            </button>
        </SearchStyle>
    )
}

export default Search
