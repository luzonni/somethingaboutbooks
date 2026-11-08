import { Link, useLocation, useNavigate } from "react-router-dom"
import styled, { keyframes } from "styled-components"
import { FiBookmark, FiBookOpen, FiCheck, FiClock } from "react-icons/fi"
import { FaHeart, FaRegHeart } from "react-icons/fa"
import { Coral, Ink, Sand, White } from "../../assets/Colors"
import { useLibrary } from "../../context/LibraryContext"
import { SHELVES } from "../../services/library"

const pop = keyframes`
    0% { transform: scale(1); }
    45% { transform: scale(1.12); }
    100% { transform: scale(1); }
`

const heartBeat = keyframes`
    0% { transform: scale(0.6); }
    55% { transform: scale(1.35); }
    100% { transform: scale(1); }
`

const ActionsStyle = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
    width: 100%;
    .actions__row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.5rem;
    }
    button, .actions__cta {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.45rem;
        padding: 0.6rem 1rem;
        border: 1px solid rgba(255, 255, 255, 0.28);
        border-radius: 10px;
        background-color: rgba(255, 255, 255, 0.1);
        color: ${White};
        font-weight: 500;
        text-decoration: none;
        transition: background-color 180ms ease, border-color 180ms ease, transform 180ms ease;
    }
    button:hover, .actions__cta:hover {
        background-color: rgba(255, 255, 255, 0.2);
        transform: translateY(-2px);
    }
    button:active {
        transform: translateY(0) scale(0.97);
    }
    .actions__shelf[aria-pressed="true"] {
        background-color: ${Sand};
        border-color: ${Sand};
        color: ${Ink};
        animation: ${pop} 300ms ease;
    }
    .actions__favorite svg {
        color: ${Coral};
    }
    .actions__favorite[aria-pressed="true"] svg {
        animation: ${heartBeat} 400ms ease;
    }
    button.actions__primary, .actions__cta {
        background-color: ${Coral};
        border-color: ${Coral};
        color: ${Ink};
        font-weight: 700;
    }
    button.actions__primary:hover, .actions__cta:hover {
        background-color: #ec777b;
    }
    .actions__lists {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.375rem 0.875rem;
        color: ${Sand};
        font-size: 0.9375rem;
    }
    .actions__lists label {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        cursor: pointer;
    }
    .actions__lists input {
        accent-color: ${Coral};
    }
    .actions__hint {
        color: ${Sand};
        font-size: 0.9375rem;
    }
    @media (max-width: 640px) {
        .actions__row {
            justify-content: center;
        }
        .actions__lists, .actions__hint {
            justify-content: center;
            text-align: center;
        }
    }
`

const SHELF_ICONS = { reading: FiBookOpen, want: FiBookmark, read: FiCheck }

const BookActions = ({ book }) => {
    const { canSave, getEntry, setShelf, toggleFavorite, lists, toggleInList } = useLibrary()
    const location = useLocation()
    const navigate = useNavigate()

    if (!canSave) {
        return (
            <ActionsStyle>
                <div className="actions__row">
                    <Link className="actions__cta" to="/login" state={{ from: location.pathname }}>
                        <FiBookmark aria-hidden="true" /> Entrar para salvar
                    </Link>
                    <span className="actions__hint">Monte suas estantes e avalie este livro.</span>
                </div>
            </ActionsStyle>
        )
    }

    const entry = getEntry(book.id)

    const startReading = () => {
        if (entry?.shelf !== "reading" && entry?.shelf !== "read") setShelf(book, "reading")
        navigate(`/pomodoro?livro=${book.id}`)
    }

    return (
        <ActionsStyle>
            <div className="actions__row" role="group" aria-label="Estante">
                {Object.entries(SHELVES).map(([shelf, label]) => {
                    const Icon = SHELF_ICONS[shelf]
                    return (
                        <button
                            key={shelf}
                            type="button"
                            className="actions__shelf"
                            aria-pressed={entry?.shelf === shelf}
                            onClick={() => setShelf(book, shelf)}
                        >
                            <Icon aria-hidden="true" /> {label}
                        </button>
                    )
                })}
                <button
                    type="button"
                    className="actions__favorite"
                    aria-pressed={Boolean(entry?.favorite)}
                    onClick={() => toggleFavorite(book)}
                >
                    {entry?.favorite ? <FaHeart aria-hidden="true" /> : <FaRegHeart aria-hidden="true" />}
                    Favorito
                </button>
                <button type="button" className="actions__primary" onClick={startReading}>
                    <FiClock aria-hidden="true" />
                    Sessão de leitura
                </button>
            </div>
            {lists.length > 0 && (
                <div className="actions__lists">
                    <span>Listas:</span>
                    {lists.map((list) => (
                        <label key={list.id}>
                            <input
                                type="checkbox"
                                checked={list.bookIds.includes(book.id)}
                                onChange={() => toggleInList(list.id, book)}
                            />
                            {list.name}
                        </label>
                    ))}
                </div>
            )}
        </ActionsStyle>
    )
}

export default BookActions
