import { Link, useLocation, useNavigate } from "react-router-dom"
import styled from "styled-components"
import { FaHeart, FaRegClock, FaRegHeart } from "react-icons/fa"
import { Border, Coral, Cream, DarkGray, DarkRed, White } from "../../assets/Colors"
import { useLibrary } from "../../context/LibraryContext"
import { SHELVES } from "../../services/library"

const ActionsStyle = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    width: 100%;
    .actions__row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.5rem;
    }
    button, .actions__link {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.5rem 1rem;
        border: 1px solid ${Border};
        border-radius: 8px;
        background-color: ${Cream};
        color: inherit;
        font-weight: 500;
        text-decoration: none;
    }
    button:hover, .actions__link:hover {
        filter: brightness(0.96);
    }
    button[aria-pressed="true"] {
        background-color: ${DarkRed};
        border-color: ${DarkRed};
        color: ${White};
    }
    .actions__favorite[aria-pressed="true"] {
        background-color: ${Cream};
        border-color: ${Border};
        color: ${DarkRed};
    }
    .actions__favorite svg {
        color: ${Coral};
    }
    .actions__lists {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.5rem;
        color: ${DarkGray};
    }
    .actions__lists label {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        cursor: pointer;
    }
    .actions__login a {
        color: ${DarkRed};
        font-weight: 500;
    }
`

const BookActions = ({ book }) => {
    const { canSave, getEntry, setShelf, toggleFavorite, lists, toggleInList } = useLibrary()
    const location = useLocation()
    const navigate = useNavigate()

    if (!canSave) {
        return (
            <ActionsStyle>
                <p className="actions__login">
                    <Link to="/login" state={{ from: location.pathname }}>Entre</Link> para salvar este livro nas suas estantes.
                </p>
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
                {Object.entries(SHELVES).map(([shelf, label]) => (
                    <button
                        key={shelf}
                        type="button"
                        aria-pressed={entry?.shelf === shelf}
                        onClick={() => setShelf(book, shelf)}
                    >
                        {label}
                    </button>
                ))}
                <button
                    type="button"
                    className="actions__favorite"
                    aria-pressed={Boolean(entry?.favorite)}
                    onClick={() => toggleFavorite(book)}
                >
                    {entry?.favorite ? <FaHeart aria-hidden="true" /> : <FaRegHeart aria-hidden="true" />}
                    Favorito
                </button>
                <button type="button" onClick={startReading}>
                    <FaRegClock aria-hidden="true" />
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
