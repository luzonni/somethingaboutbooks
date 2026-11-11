import styled from "styled-components"
import { Link } from "react-router-dom"
import BookCover from "../BookCover"
import ProgressBar from "../ProgressBar"
import Stars from "../Stars"
import { Black, BrandText, Coral, Cream, DarkGray, Ink, Surface } from "../../assets/Colors"
import { useLibrary } from "../../context/LibraryContext"
import { SHELVES, readingProgress } from "../../services/library"

const CardBookStyle = styled.article`
    position: relative;
    width: 100%;
    height: 100%;
    /* Sem moldura: a capa com sombra é o destaque, e título e autor ficam logo abaixo. */
    a {
        display: flex;
        flex-direction: column;
        gap: 0.375rem;
        height: 100%;
        border-radius: 8px;
        color: ${Black};
        text-decoration: none;
    }
    a:focus-visible {
        outline: 2px solid ${BrandText};
        outline-offset: 4px;
    }
    .card__cover {
        margin-bottom: 0.375rem;
        box-shadow: 0 6px 14px rgba(41, 20, 16, 0.18);
        transition: transform 250ms ease, box-shadow 250ms ease;
    }
    a:hover .card__cover {
        box-shadow: 0 14px 28px rgba(41, 20, 16, 0.26);
        transform: translateY(-4px);
    }
    h3 {
        font-size: 1rem;
        font-weight: 500;
        line-height: 1.25;
        transition: color 150ms ease;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    a:hover h3 {
        color: ${BrandText};
    }
    p {
        font-size: 0.875rem;
        color: ${DarkGray};
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .card__badge {
        position: absolute;
        top: 0.5rem;
        left: 0.5rem;
        z-index: 1;
        padding: 0.125rem 0.5rem;
        border-radius: 4px;
        background-color: ${Coral};
        color: ${Ink};
        font-size: 0.75rem;
        font-weight: 500;
    }
`

const RowCardBookStyle = styled.article`
    width: 100%;
    a {
        display: flex;
        min-height: 9rem;
        color: ${Black};
        text-decoration: none;
        background-color: ${Cream};
        border-radius: 6px;
        overflow: hidden;
        transition: background-color 200ms ease;
    }
    a:hover {
        background-color: ${Surface};
    }
    .row__cover {
        flex: 0 0 6rem;
        width: 6rem;
        border-radius: 0;
        box-shadow: none;
    }
    .row__content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 0.5rem;
        min-width: 0;
        padding: 1rem;
    }
    h3 {
        font-weight: 700;
        font-size: 1.125rem;
        line-height: 1.25;
    }
    p {
        font-weight: 300;
    }
`

export const CardBook = ({ book }) => {
    const { getEntry } = useLibrary()
    const entry = getEntry(book.id)
    const shelf = entry?.shelf
    const progress = shelf === "reading" ? readingProgress(entry) : null
    return (
        <CardBookStyle>
            <Link to={`/books/${book.id}`} state={{ book }}>
                <BookCover className="card__cover" src={book.cover} title={book.title} author={book.author} />
                {progress !== null && <ProgressBar value={progress} label={`Progresso em ${book.title}`} />}
                <h3>{book.title}</h3>
                <p>{book.author}</p>
            </Link>
            {shelf && <span className="card__badge">{SHELVES[shelf]}</span>}
        </CardBookStyle>
    )
}

export const RowCardBook = ({ book }) => (
    <RowCardBookStyle>
        <Link to={`/books/${book.id}`} state={{ book }}>
            <BookCover className="row__cover" src={book.cover} title={book.title} author={book.author} />
            <div className="row__content">
                <h3>{book.title}</h3>
                <p>{book.year ? `${book.author} - ${book.year}` : book.author}</p>
                {book.rating ? <Stars stars={book.rating} size="1.125rem" /> : null}
            </div>
        </Link>
    </RowCardBookStyle>
)
