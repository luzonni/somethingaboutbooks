import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import styled from "styled-components"
import { IoIosStar } from "react-icons/io"
import { Border, BrandText, Coral, Cream, Danger, DarkGray, DarkRed, Gray, Surface, White } from "../../assets/Colors"
import { useLibrary } from "../../context/LibraryContext"
import { useToast } from "../../context/ToastContext"
import Stars from "../Stars"

const ReviewsStyle = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 44rem;
    form {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }
    fieldset legend {
        margin-bottom: 0.25rem;
        color: ${DarkGray};
    }
    .rating__options {
        display: flex;
    }
    .rating__star {
        display: flex;
        padding: 0.125rem;
        border: none;
        background: none;
        font-size: 2rem;
        color: ${Gray};
        transition: color 150ms ease, transform 150ms ease;
    }
    .rating__star:hover {
        transform: scale(1.2);
    }
    .rating__star--on {
        color: ${Coral};
    }
    .reviews__empty {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        padding: 1.25rem;
        border-radius: 12px;
        background-color: ${Cream};
    }
    .reviews__empty a {
        padding: 0.5rem 1.25rem;
        border-radius: 8px;
        background-color: ${DarkRed};
        color: ${White};
        text-decoration: none;
    }
    textarea {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid ${Border};
        border-radius: 8px;
        resize: vertical;
    }
    .reviews__error {
        color: ${Danger};
        font-size: 0.875rem;
    }
    .reviews__actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }
    .reviews__primary, .reviews__secondary {
        padding: 0.5rem 1.25rem;
        border-radius: 8px;
        font-weight: 500;
    }
    .reviews__primary {
        border: none;
        background-color: ${DarkRed};
        color: ${White};
    }
    .reviews__secondary {
        border: 1px solid ${Border};
        background-color: ${Surface};
    }
    .reviews__card {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 1rem;
        border-radius: 8px;
        background-color: ${Cream};
    }
    .reviews__text {
        white-space: pre-wrap;
    }
    .reviews__meta {
        color: ${DarkGray};
        font-size: 0.875rem;
    }
    a {
        color: ${BrandText};
        font-weight: 500;
    }
`

const RatingInput = ({ value, onChange }) => {
    const [hovered, setHovered] = useState(0)
    const shown = hovered || value
    return (
        <fieldset>
            <legend>Sua nota</legend>
            <div className="rating__options" onMouseLeave={() => setHovered(0)}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        className={`rating__star ${star <= shown ? "rating__star--on" : ""}`}
                        aria-label={`${star} ${star === 1 ? "estrela" : "estrelas"}`}
                        aria-pressed={star === value}
                        onMouseEnter={() => setHovered(star)}
                        onClick={() => onChange(star)}
                    >
                        <IoIosStar aria-hidden="true" />
                    </button>
                ))}
            </div>
        </fieldset>
    )
}

const ReviewForm = ({ book, entry, onDone }) => {
    const { saveReview } = useLibrary()
    const { notify } = useToast()
    const [rating, setRating] = useState(entry?.rating ?? 0)
    const [review, setReview] = useState(entry?.review ?? "")
    const [error, setError] = useState("")

    const handleSubmit = (event) => {
        event.preventDefault()
        if (!rating) {
            setError("Escolha uma nota de 1 a 5 estrelas.")
            return
        }
        saveReview(book, rating, review)
        notify("Review salva")
        onDone()
    }

    return (
        <form onSubmit={handleSubmit}>
            <RatingInput value={rating} onChange={(value) => { setRating(value); setError("") }} />
            <label>
                <span className="reviews__meta">O que você achou? (opcional)</span>
                <textarea
                    rows={5}
                    maxLength={2000}
                    value={review}
                    onChange={(event) => setReview(event.target.value)}
                />
            </label>
            {error && <span className="reviews__error" role="alert">{error}</span>}
            <div className="reviews__actions">
                <button type="submit" className="reviews__primary">Salvar review</button>
                {entry?.rating ? (
                    <button type="button" className="reviews__secondary" onClick={onDone}>Cancelar</button>
                ) : null}
            </div>
        </form>
    )
}

const BookReviews = ({ book }) => {
    const { canSave, getEntry, deleteReview } = useLibrary()
    const { notify } = useToast()
    const location = useLocation()
    const [editing, setEditing] = useState(false)

    if (!canSave) {
        return (
            <ReviewsStyle>
                <div className="reviews__empty">
                    <span>Já leu este livro? Conte o que achou.</span>
                    <Link to="/login" state={{ from: location.pathname }}>Entrar para avaliar</Link>
                </div>
            </ReviewsStyle>
        )
    }

    const entry = getEntry(book.id)
    const hasReview = Boolean(entry?.rating)

    return (
        <ReviewsStyle>
            {hasReview && !editing ? (
                <div className="reviews__card">
                    <Stars stars={entry.rating} />
                    {entry.review && <p className="reviews__text">{entry.review}</p>}
                    <span className="reviews__meta">
                        Sua review de {new Date(entry.reviewedAt).toLocaleDateString("pt-BR")}
                    </span>
                    <div className="reviews__actions">
                        <button type="button" className="reviews__secondary" onClick={() => setEditing(true)}>Editar</button>
                        <button type="button" className="reviews__secondary" onClick={() => {
                            deleteReview(book.id)
                            notify("Review excluída", { tone: "info" })
                        }}>Excluir</button>
                    </div>
                </div>
            ) : (
                <ReviewForm book={book} entry={entry} onDone={() => setEditing(false)} />
            )}
        </ReviewsStyle>
    )
}

export default BookReviews
