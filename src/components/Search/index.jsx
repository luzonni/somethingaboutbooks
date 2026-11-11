import { useEffect, useId, useState } from "react"
import styled, { css, keyframes } from "styled-components"
import { FaHistory, FaSearch } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { Black, Border, BrandText, Coral, Cream, DarkGray, Ink, Surface } from "../../assets/Colors"
import { suggestBooks } from "../../api/books"
import { useDebouncedValue } from "../../hooks/useDebouncedValue"
import { useTypingPlaceholder } from "../../hooks/useTypingPlaceholder"
import { addRecentSearch, clearRecentSearches, getRecentSearches } from "../../services/recentSearches"

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
    position: relative;
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
    > button {
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
    > button:hover {
        filter: brightness(0.92);
    }
    > button svg {
        transition: transform 200ms ease;
    }
    > button:hover svg {
        transform: scale(1.2) rotate(-8deg);
    }
    > button:active svg {
        transform: scale(0.9);
    }
`

const Popup = styled.div`
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    right: 0;
    z-index: 20;
    max-height: min(24rem, 70vh);
    overflow-y: auto;
    padding: 0.35rem 0;
    background-color: ${Surface};
    border: 1px solid ${Border};
    border-radius: 12px;
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.25);
    text-align: left;
`

const GroupLabel = styled.div`
    padding: 0.35rem 0.85rem;
    color: ${DarkGray};
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.04em;
    text-transform: uppercase;
`

const ClearButton = styled.button`
    display: block;
    margin: 0.25rem 0.85rem 0.2rem auto;
    padding: 0.15rem 0.35rem;
    background: none;
    border: none;
    border-radius: 6px;
    color: ${BrandText};
    font-size: 0.8125rem;
    cursor: pointer;
    &:hover {
        text-decoration: underline;
    }
`

const Option = styled.div`
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.45rem 0.85rem;
    color: ${Black};
    font-size: 0.9375rem;
    cursor: pointer;
    &[aria-selected="true"],
    &:hover {
        background-color: ${Cream};
    }
    > svg {
        flex-shrink: 0;
        color: ${DarkGray};
    }
`

const BookOption = styled(Option)`
    img,
    .sem-capa {
        flex-shrink: 0;
        width: 28px;
        height: 42px;
        object-fit: cover;
        border-radius: 3px;
        background-color: ${Cream};
    }
    span {
        display: flex;
        flex-direction: column;
        min-width: 0;
    }
    strong,
    small {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    strong {
        font-weight: 500;
    }
    small {
        color: ${DarkGray};
        font-size: 0.8125rem;
    }
`

const SUGGESTION_MIN_LENGTH = 3
const SUGGESTION_LIMIT = 5

const SUGGESTIONS = ["O Hobbit", "Machado de Assis", "Duna", "Clarice Lispector", "Harry Potter", "ficção científica"]
const DEFAULT_PLACEHOLDER = "Título, autor ou assunto"

const Search = ({ initialValue = "", extraParams = "", compact = false, animated = false }) => {
    const [value, setValue] = useState(initialValue)
    const [focused, setFocused] = useState(false)
    const [open, setOpen] = useState(false)
    const [active, setActive] = useState(-1)
    const [recent, setRecent] = useState(getRecentSearches)
    const navigate = useNavigate()
    const id = useId()
    const listId = `${id}-lista`
    const placeholder = useTypingPlaceholder(SUGGESTIONS, {
        active: animated && !focused && !value,
        fallback: DEFAULT_PLACEHOLDER,
    })

    const query = value.trim()
    const debouncedQuery = useDebouncedValue(query, 300)
    const [books, setBooks] = useState({ query: "", items: [] })

    useEffect(() => {
        if (!focused || debouncedQuery.length < SUGGESTION_MIN_LENGTH) return undefined
        const controller = new AbortController()
        suggestBooks({ query: debouncedQuery, limit: SUGGESTION_LIMIT, signal: controller.signal })
            .then((items) => setBooks({ query: debouncedQuery, items }))
            // Sugestão é um extra: sem internet ou com a API fora, a busca normal continua funcionando.
            .catch(() => {})
        return () => controller.abort()
    }, [debouncedQuery, focused])

    const typed = query.toLowerCase()
    const recentOptions = recent
        .filter((item) => item.toLowerCase().includes(typed) && item.toLowerCase() !== typed)
        .map((item, index) => ({ id: `${id}-recente-${index}`, label: item, run: () => go(item) }))
    const bookOptions =
        query.length >= SUGGESTION_MIN_LENGTH && books.query === query
            ? books.items.map((book, index) => ({
                  id: `${id}-livro-${index}`,
                  book,
                  run: () => openBook(book),
              }))
            : []
    const options = [...recentOptions, ...bookOptions]
    const expanded = open && options.length > 0
    const activeOption = expanded ? options[active] : undefined

    const close = () => {
        setOpen(false)
        setActive(-1)
    }

    function go(text) {
        const params = new URLSearchParams(extraParams)
        const query = text.trim()
        if (query) {
            params.set("q", query)
            setRecent(addRecentSearch(query))
        } else params.delete("q")
        setValue(query)
        close()
        const search = params.toString()
        navigate(search ? `/books?${search}` : "/books")
    }

    function openBook(book) {
        setRecent(addRecentSearch(query))
        close()
        navigate(`/books/${book.id}`, { state: { book } })
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        if (activeOption) activeOption.run()
        else go(value)
    }

    const handleKeyDown = (event) => {
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault()
            setOpen(true)
            if (options.length === 0) return
            const step = event.key === "ArrowDown" ? 1 : -1
            // Depois da última opção volta ao texto digitado (-1), como nos buscadores.
            setActive((current) => {
                const next = current + step
                if (next >= options.length) return -1
                return next < -1 ? options.length - 1 : next
            })
        } else if (event.key === "Escape" && expanded) {
            event.preventDefault()
            close()
        }
    }

    const clearHistory = () => {
        clearRecentSearches()
        setRecent([])
        setActive(-1)
    }

    // Clicar numa opção não pode tirar o foco do campo antes do clique valer.
    const keepFocus = (event) => event.preventDefault()

    return (
        <SearchStyle $compact={compact} $animated={animated} role="search" onSubmit={handleSubmit}>
            <input
                type="search"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={expanded}
                aria-controls={listId}
                aria-activedescendant={activeOption?.id}
                aria-keyshortcuts="/"
                title="Atalho: /"
                aria-label="Buscar livros"
                autoComplete="off"
                placeholder={placeholder}
                value={value}
                onChange={(event) => {
                    setValue(event.target.value)
                    setOpen(true)
                    setActive(-1)
                }}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                    setFocused(true)
                    setRecent(getRecentSearches())
                    setOpen(true)
                }}
                onBlur={() => {
                    setFocused(false)
                    close()
                }}
            />
            <button type="submit" aria-label="Buscar">
                <FaSearch aria-hidden="true" />
            </button>
            <Popup hidden={!expanded}>
                <div id={listId} role="listbox" aria-label="Sugestões de busca">
                    {recentOptions.length > 0 && (
                        <div role="group" aria-labelledby={`${id}-recentes`}>
                            <GroupLabel id={`${id}-recentes`}>Buscas recentes</GroupLabel>
                            {recentOptions.map((option) => (
                                <Option
                                    key={option.id}
                                    id={option.id}
                                    role="option"
                                    aria-selected={option === activeOption}
                                    onMouseDown={keepFocus}
                                    onClick={option.run}
                                >
                                    <FaHistory aria-hidden="true" />
                                    {option.label}
                                </Option>
                            ))}
                        </div>
                    )}
                    {bookOptions.length > 0 && (
                        <div role="group" aria-labelledby={`${id}-livros`}>
                            <GroupLabel id={`${id}-livros`}>Livros</GroupLabel>
                            {bookOptions.map((option) => (
                                <BookOption
                                    key={option.id}
                                    id={option.id}
                                    role="option"
                                    aria-selected={option === activeOption}
                                    onMouseDown={keepFocus}
                                    onClick={option.run}
                                >
                                    {option.book.cover ? (
                                        <img src={option.book.cover.replace("-M.jpg", "-S.jpg")} alt="" loading="lazy" />
                                    ) : (
                                        <div className="sem-capa" aria-hidden="true" />
                                    )}
                                    <span>
                                        <strong>{option.book.title}</strong>
                                        <small>{option.book.author}</small>
                                    </span>
                                </BookOption>
                            ))}
                        </div>
                    )}
                </div>
                {recentOptions.length > 0 && (
                    <ClearButton type="button" tabIndex={-1} onMouseDown={keepFocus} onClick={clearHistory}>
                        Limpar histórico
                    </ClearButton>
                )}
            </Popup>
        </SearchStyle>
    )
}

export default Search
