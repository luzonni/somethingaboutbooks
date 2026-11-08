import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import styled, { keyframes } from "styled-components"
import { FiBookOpen, FiCalendar, FiExternalLink, FiSearch } from "react-icons/fi"
import { dedupeBooks, getAuthor, getAuthorWorks } from "../../api/openLibrary"
import { Border, BrandText, Cream, DarkGray, DarkRed, Night, Sand, White } from "../../assets/Colors"
import { CardBook } from "../../components/CardBook"
import ExpandableText from "../../components/ExpandableText"
import { EmptyState, ErrorState, Skeleton, Spinner } from "../../components/Feedback"
import Reveal from "../../components/Reveal"
import { useAsync } from "../../hooks/useAsync"
import { useDocumentTitle } from "../../hooks/useDocumentTitle"
import { useOnVisible } from "../../hooks/useOnVisible"
import { asset } from "../../utils/asset"
import { formatLifespan } from "../../utils/text"

const riseIn = keyframes`
    from { opacity: 0; transform: translateY(14px); }
    to { opacity: 1; transform: translateY(0); }
`

const AuthorStyle = styled.article`
    padding-bottom: 3rem;
    background-color: var(--color-surface-soft);
    .author__hero {
        color: ${White};
        background-color: ${Night};
        background-image:
            linear-gradient(100deg, rgba(20, 8, 6, 0.94), rgba(70, 4, 4, 0.82)),
            url("${asset("imgs/hero-books.svg")}");
        background-size: cover;
        background-position: center;
    }
    .author__heroInner {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr);
        align-items: center;
        gap: clamp(1.5rem, 4vw, 3rem);
        max-width: 72rem;
        margin: 0 auto;
        padding: clamp(2rem, 5vw, 3.5rem) 1rem;
    }
    .author__photo {
        width: clamp(8rem, 18vw, 12rem);
        aspect-ratio: 1;
        border: 4px solid rgba(255, 255, 255, 0.85);
        border-radius: 50%;
        object-fit: cover;
        background-color: #2a1712;
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45);
        animation: ${riseIn} 600ms ease both;
    }
    .author__initial {
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${Sand};
        font-size: 3.5rem;
        font-weight: 700;
    }
    .author__info {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
        min-width: 0;
    }
    .author__info > * {
        animation: ${riseIn} 600ms ease both;
    }
    .author__info > :nth-child(2) { animation-delay: 80ms; }
    .author__info > :nth-child(3) { animation-delay: 160ms; }
    .author__info > :nth-child(4) { animation-delay: 240ms; }
    .author__label {
        color: ${Sand};
        font-size: 0.875rem;
        font-weight: 500;
        letter-spacing: 0.08em;
        text-transform: uppercase;
    }
    h1 {
        font-size: clamp(2rem, 5vw, 3.25rem);
        font-weight: 700;
        line-height: 1.1;
    }
    .author__meta {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem 1.25rem;
        color: ${Sand};
    }
    .author__meta span {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
    }
    .author__links {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }
    .author__links a {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        padding: 0.3rem 0.8rem;
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 999px;
        color: ${White};
        font-size: 0.875rem;
        text-decoration: none;
        transition: background-color 150ms ease;
    }
    .author__links a:hover {
        background-color: rgba(255, 255, 255, 0.14);
    }
    .author__body {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
        max-width: 72rem;
        margin: 0 auto;
        padding: 1.5rem 1rem 0;
    }
    .author__card {
        padding: 1.5rem;
        border: 1px solid ${Border};
        border-radius: 14px;
        background-color: var(--color-surface);
        box-shadow: 0 2px 10px var(--shadow-soft);
    }
    .author__card h2 {
        margin-bottom: 0.875rem;
        font-size: 1.25rem;
        font-weight: 700;
    }
    .author__worksHead {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        justify-content: space-between;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }
    .author__worksHead h2 {
        margin: 0;
    }
    .author__worksHead span {
        color: ${DarkGray};
    }
    .author__grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
        gap: 1.5rem 1rem;
    }
    .author__more {
        display: block;
        margin: 1.5rem auto 0;
        padding: 0.6rem 1.75rem;
        border: none;
        border-radius: 999px;
        background-color: ${DarkRed};
        color: ${White};
        font-weight: 500;
    }
    .author__toggle {
        display: block;
        margin: 1.25rem auto 0;
        padding: 0.4rem 1rem;
        border: 1px solid ${Border};
        border-radius: 999px;
        background: none;
        color: ${DarkGray};
        font-size: 0.9375rem;
    }
    .author__toggle:hover {
        color: ${BrandText};
        border-color: currentColor;
    }
    .author__search {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.4rem 0.9rem;
        border-radius: 999px;
        background-color: ${Cream};
        color: ${BrandText};
        font-weight: 500;
        text-decoration: none;
    }
    @media (max-width: 640px) {
        .author__heroInner {
            grid-template-columns: minmax(0, 1fr);
            justify-items: center;
            text-align: center;
        }
        .author__info {
            align-items: center;
        }
        .author__meta, .author__links {
            justify-content: center;
        }
        .author__card {
            padding: 1.125rem;
        }
    }
`

const AuthorWorks = ({ authorId, authorName }) => {
    const [page, setPage] = useState(1)
    const [works, setWorks] = useState({ books: [], total: 0, hasMore: false })
    const [status, setStatus] = useState({ loading: true, error: null })
    const [attempt, setAttempt] = useState(0)

    useEffect(() => {
        const controller = new AbortController()
        setStatus({ loading: true, error: null })
        getAuthorWorks(authorId, { page, signal: controller.signal })
            .then((data) => {
                if (controller.signal.aborted) return
                setWorks((previous) => ({
                    ...data,
                    books: dedupeBooks(page === 1 ? data.books : [...previous.books, ...data.books]),
                }))
                setStatus({ loading: false, error: null })
            })
            .catch((error) => {
                if (!controller.signal.aborted) setStatus({ loading: false, error })
            })
        return () => controller.abort()
    }, [authorId, page, attempt])

    const [showUncovered, setShowUncovered] = useState(false)
    const canLoadMore = works.hasMore && !status.loading && !status.error
    const sentinelRef = useOnVisible(() => setPage((value) => value + 1), { enabled: canLoadMore })

    // Obras sem capa costumam ser edições soltas ou cadastros incompletos: ficam escondidas por padrão.
    const withCover = works.books.filter((book) => book.cover)
    const hiddenCount = works.books.length - withCover.length
    const visible = showUncovered || withCover.length === 0 ? works.books : withCover

    return (
        <section className="author__card" aria-labelledby="works-title">
            <div className="author__worksHead">
                <h2 id="works-title">Obras</h2>
                {works.total > 0 && <span>{works.total.toLocaleString("pt-BR")} na Open Library</span>}
            </div>
            {visible.length > 0 && (
                <div className="author__grid">
                    {visible.map((book) => <CardBook key={book.id} book={book} />)}
                </div>
            )}
            {hiddenCount > 0 && withCover.length > 0 && (
                <button type="button" className="author__toggle" aria-pressed={showUncovered} onClick={() => setShowUncovered(!showUncovered)}>
                    {showUncovered ? "Ocultar obras sem capa" : `Mostrar ${hiddenCount} ${hiddenCount === 1 ? "obra" : "obras"} sem capa`}
                </button>
            )}
            {status.loading && <Spinner label="Carregando obras" />}
            {status.error && <ErrorState message={status.error.message} onRetry={() => setAttempt((value) => value + 1)} />}
            {!status.loading && !status.error && works.books.length === 0 && (
                <EmptyState title="Nenhuma obra encontrada" />
            )}
            {canLoadMore && (
                <button ref={sentinelRef} type="button" className="author__more" onClick={() => setPage((value) => value + 1)}>
                    Carregar mais obras
                </button>
            )}
            {!works.hasMore && works.books.length > 0 && (
                <p style={{ marginTop: "1.25rem" }}>
                    <Link className="author__search" to={`/books?q=${encodeURIComponent(authorName)}`}>
                        <FiSearch aria-hidden="true" /> Buscar mais livros de {authorName}
                    </Link>
                </p>
            )}
        </section>
    )
}

const AuthorProfile = ({ id }) => {
    const { data: author, error, loading, retry } = useAsync((signal) => getAuthor(id, { signal }), [id])

    useDocumentTitle(author?.name ?? "Autor")

    if (loading) {
        return (
            <AuthorStyle>
                <div className="author__hero">
                    <div className="author__heroInner">
                        <Skeleton $width="10rem" $height="10rem" style={{ borderRadius: "50%", opacity: 0.2 }} />
                        <Skeleton $width="16rem" $height="2.5rem" style={{ opacity: 0.2 }} />
                    </div>
                </div>
            </AuthorStyle>
        )
    }
    if (error) {
        return (
            <ErrorState
                message={error.status === 404 ? "Autor não encontrado." : error.message}
                onRetry={error.status === 404 ? undefined : retry}
            />
        )
    }

    const lifespan = formatLifespan(author.birthDate, author.deathDate)
    const links = [
        author.wikipedia && { title: author.wikipedia.includes("wikidata") ? "Wikidata" : "Wikipedia", url: author.wikipedia },
        ...author.links,
        { title: "Open Library", url: author.url },
    ].filter(Boolean)

    return (
        <AuthorStyle>
            <header className="author__hero">
                <div className="author__heroInner">
                    {author.photoLarge ? (
                        <img className="author__photo" src={author.photoLarge} alt={`Foto de ${author.name}`} />
                    ) : (
                        <span className="author__photo author__initial" aria-hidden="true">{author.name[0]}</span>
                    )}
                    <div className="author__info">
                        <span className="author__label">Autor</span>
                        <h1>{author.name}</h1>
                        {(author.fullName || lifespan) && (
                            <div className="author__meta">
                                {author.fullName && <span>{author.fullName}</span>}
                                {lifespan && <span><FiCalendar aria-hidden="true" /> {lifespan}</span>}
                            </div>
                        )}
                        <div className="author__links">
                            {links.map((link) => (
                                <a key={link.url} href={link.url} target="_blank" rel="noreferrer">
                                    {link.title} <FiExternalLink aria-hidden="true" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </header>

            <div className="author__body">
                <Reveal className="author__card">
                    <h2><FiBookOpen aria-hidden="true" /> Biografia</h2>
                    <ExpandableText text={author.bio} emptyText="Esta pessoa ainda não tem biografia na Open Library." />
                </Reveal>
                <AuthorWorks authorId={id} authorName={author.name} />
            </div>
        </AuthorStyle>
    )
}

// A key reinicia a página ao trocar de autor, sem misturar obras de pessoas diferentes.
const AuthorPage = () => {
    const { id } = useParams()
    return <AuthorProfile key={id} id={id} />
}

export default AuthorPage
