import { useState } from "react"
import { Link } from "react-router-dom"
import styled, { keyframes } from "styled-components"
import { Black, Border, BrandText, Cream, DarkGray, DarkRed, Surface } from "../../assets/Colors"
import { media } from "../../assets/breakpoints"
import { GENRES, genreList, topRatedList, trendingList } from "../../api/openLibrary"
import BookCover from "../../components/BookCover"
import BookSection from "../../components/BookSection"
import { CardBook } from "../../components/CardBook"
import ListCards from "../../components/ListCards"
import ProgressBar from "../../components/ProgressBar"
import Search from "../../components/Search"
import { useAuth } from "../../context/AuthContext"
import { useLibrary } from "../../context/LibraryContext"
import { useAsync } from "../../hooks/useAsync"
import { useDocumentTitle } from "../../hooks/useDocumentTitle"
import { byRecent, readingProgress } from "../../services/library"
import { asset } from "../../utils/asset"

const riseIn = keyframes`
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
`

// Só opacidade: as capas do leque já usam transform para a posição e a rotação.
const fadeIn = keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
`

const HomeStyle = styled.div`
    width: 100%;
    padding-bottom: 2rem;

    .container {
        width: 100%;
        max-width: 80rem;
        margin: 0 auto;
        padding: 0 1rem;
    }

    /* Destaque: saudação à esquerda, livro em leitura (ou capas em alta) à direita. */
    .hero {
        display: grid;
        grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
        align-items: center;
        gap: 2.5rem;
        margin-top: 1.5rem;
        padding: 3rem;
        border-radius: 24px;
        background: ${Cream} url("${asset("/imgs/hero-pattern.svg")}") no-repeat right center / cover;
    }
    /* Prateleira de lombadas na base do destaque. Além da identidade do SAB, é uma imagem local que aparece
       junto com o texto: sem ela, o maior elemento da tela no celular seria a primeira capa do "Em alta",
       que depende da API, e o carregamento medido (LCP) ia de 2,4 s para 4,5 s. */
    .hero__shelf {
        grid-column: 1 / -1;
        height: 6rem;
        margin: 0 -3rem -3rem;
        border-radius: 0 0 24px 24px;
        background: url("${asset("/imgs/hero-shelf.svg")}") repeat-x center bottom / auto 100%;
    }
    .hero__text {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        min-width: 0;
        animation: ${riseIn} 600ms ease both;
    }
    .hero__eyebrow {
        color: ${BrandText};
        font-size: 0.8125rem;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
    }
    h1 {
        color: ${Black};
        font-family: var(--font-display);
        font-size: clamp(2rem, 4vw, 3rem);
        font-weight: 700;
        line-height: 1.1;
    }
    .hero__subtitle {
        max-width: 34rem;
        color: ${DarkGray};
        font-size: clamp(1rem, 1.6vw, 1.125rem);
        line-height: 1.5;
    }
    .hero__search {
        /* A animação cria uma camada própria: sem z-index, a lista de sugestões ficaria atrás dos cards. */
        position: relative;
        z-index: 5;
        max-width: 34rem;
    }
    .hero__actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
    }
    .button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 2.75rem;
        padding: 0.625rem 1.25rem;
        border: 1px solid ${Border};
        border-radius: 999px;
        color: ${Black};
        font-weight: 500;
        text-decoration: none;
        transition: background-color 150ms ease, border-color 150ms ease;
    }
    .button:hover {
        border-color: ${DarkRed};
    }
    .button--primary {
        border-color: ${DarkRed};
        background-color: ${DarkRed};
        color: var(--color-on-brand);
    }
    .button--primary:hover {
        background-color: var(--color-brand-hover);
    }

    /* Livro em leitura */
    .reading {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        padding: 1.5rem;
        border-radius: 18px;
        background-color: ${Surface};
        box-shadow: 0 8px 24px rgba(41, 20, 16, 0.08);
        animation: ${riseIn} 600ms ease 120ms both;
    }
    .reading__cover {
        flex-shrink: 0;
        width: 7.5rem;
        border-radius: 6px;
        overflow: hidden;
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.25);
    }
    .reading__info {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        min-width: 0;
    }
    .reading__label {
        color: ${DarkGray};
        font-size: 0.8125rem;
    }
    .reading__title {
        color: ${Black};
        font-family: var(--font-display);
        font-size: 1.25rem;
        font-weight: 700;
        line-height: 1.2;
        text-decoration: none;
    }
    .reading__title:hover {
        color: ${BrandText};
        text-decoration: underline;
    }
    .reading__author,
    .reading__pages {
        color: ${DarkGray};
        font-size: 0.9375rem;
    }
    .reading__hint {
        color: ${DarkGray};
        font-size: 0.875rem;
    }
    .reading__hint a {
        color: ${BrandText};
        text-decoration: underline;
    }

    /* Capas em alta, em leque, para quem não está lendo nada. */
    .fan {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        height: 18rem;
        margin: 0;
    }
    .fan__covers {
        position: relative;
        flex: 1;
    }
    .fan__caption {
        color: ${DarkGray};
        font-size: 0.875rem;
        text-align: center;
    }
    .fan__cover {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 9rem;
        border-radius: 6px;
        overflow: hidden;
        box-shadow: 0 16px 32px rgba(0, 0, 0, 0.28);
        animation: ${fadeIn} 600ms ease both;
    }
    .fan__cover:nth-child(1) {
        transform: translate(-115%, -48%) rotate(-8deg);
        animation-delay: 120ms;
    }
    .fan__cover:nth-child(2) {
        z-index: 1;
        transform: translate(-50%, -55%);
        animation-delay: 200ms;
    }
    .fan__cover:nth-child(3) {
        transform: translate(15%, -48%) rotate(8deg);
        animation-delay: 280ms;
    }

    /* Gêneros em botões, numa fileira só */
    .genres__head {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        padding-top: 1.5rem;
    }
    .genres__head h2 {
        font-family: var(--font-display);
        font-size: clamp(1.25rem, 3vw, 1.75rem);
        font-weight: 700;
    }
    .genres__chips {
        display: flex;
        gap: 0.5rem;
        /* No celular os botões rolam de lado dentro da fileira, sem criar rolagem na página. */
        overflow-x: auto;
        padding-bottom: 0.25rem;
        scrollbar-width: none;
    }
    .genres__chips::-webkit-scrollbar {
        display: none;
    }
    .chip {
        flex-shrink: 0;
        padding: 0.5rem 1rem;
        border: 1px solid ${Border};
        border-radius: 999px;
        background-color: transparent;
        color: ${Black};
        font: inherit;
        font-size: 0.9375rem;
        cursor: pointer;
        transition: background-color 150ms ease, border-color 150ms ease, color 150ms ease;
    }
    .chip:hover {
        border-color: ${DarkRed};
    }
    .chip[aria-pressed="true"] {
        border-color: ${DarkRed};
        background-color: ${DarkRed};
        color: var(--color-on-brand);
    }

    .hero__signup {
        display: none;
    }

    ${media.tablet} {
        .hero__signup {
            display: inline-flex;
        }
        .hero {
            grid-template-columns: 1fr;
            gap: 2rem;
            padding: 2rem 1.5rem;
        }
        .hero__shelf {
            margin: 0 -1.5rem -2rem;
        }
        .fan {
            height: 15rem;
        }
        .fan__cover {
            width: 7.5rem;
        }
    }

    ${media.celular} {
        .hero {
            margin-top: 1rem;
            padding: 1.5rem 1rem;
            border-radius: 18px;
        }
        .hero__shelf {
            height: 6.5rem;
            margin: 0 -1rem -1.5rem;
            border-radius: 0 0 18px 18px;
        }
        .reading {
            gap: 1rem;
            padding: 1rem;
        }
        .reading__cover {
            width: 5.5rem;
        }
        .fan {
            display: none;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .hero__text,
        .reading,
        .fan__cover {
            animation: none;
        }
    }
`

function ReadingCard({ entry }) {
    const progress = readingProgress(entry)
    const total = entry.totalPages || entry.pages
    return (
        <div className="reading">
            <Link to={`/books/${entry.id}`} state={{ book: entry }} className="reading__cover" aria-hidden="true" tabIndex={-1}>
                <BookCover src={entry.cover} title={entry.title} author={entry.author} />
            </Link>
            <div className="reading__info">
                <span className="reading__label">Lendo agora</span>
                <Link to={`/books/${entry.id}`} state={{ book: entry }} className="reading__title">
                    {entry.title}
                </Link>
                <span className="reading__author">{entry.author}</span>
                {progress === null ? (
                    <p className="reading__hint">
                        <Link to={`/pomodoro?livro=${entry.id}`}>Marque a página</Link> em que parou para ver seu progresso.
                    </p>
                ) : (
                    <>
                        <ProgressBar value={progress} label={`Progresso de leitura de ${entry.title}`} />
                        <span className="reading__pages">
                            {entry.currentPage} de {total} páginas
                        </span>
                    </>
                )}
            </div>
        </div>
    )
}

// O leque e a seção "Mais bem avaliados" pedem a mesma lista: os dois aproveitam um carregamento só.
// A requisição não é cancelada quando um deles sai da tela, para não derrubar o outro.
const sharedSource = (source) => {
    let pending
    return {
        peek: source.peek,
        load: () => {
            pending ??= source.load().catch((error) => {
                pending = undefined
                throw error
            })
            return pending
        },
    }
}

const FAN_SIZE = 3
// O carrossel mostra até 7 capas no desktop: com 12, as três do leque ficam fora da tela.
const TOP_RATED_SIZE = 12

// Capas em leque para quem não está lendo nada, sem repetir o que já aparece logo abaixo:
// os próximos livros da lista "Quero ler" ou, sem ela, os últimos da lista de mais bem avaliados,
// que ficam fora da tela no carrossel.
function CoverFan({ wanted, topRated }) {
    const fromList = wanted.length > 0
    const { data } = useAsync(() => (fromList ? Promise.resolve(null) : topRated.load()), [fromList, topRated])
    const covers = fromList
        ? wanted.slice(0, FAN_SIZE)
        : (data ?? topRated.peek() ?? []).filter((book) => book.cover).slice(-FAN_SIZE)
    if (covers.length === 0) return <div className="fan" aria-hidden="true" />
    return (
        <figure className="fan">
            <div className="fan__covers" aria-hidden="true">
                {covers.map((book) => (
                    <div key={book.id} className="fan__cover">
                        <BookCover src={book.cover} title={book.title} author={book.author} />
                    </div>
                ))}
            </div>
            <figcaption className="fan__caption">
                {fromList ? "Na sua lista Quero ler" : "Entre os mais bem avaliados"}
            </figcaption>
        </figure>
    )
}

function Hero({ user, current, wanted, topRated }) {
    const name = user?.username
    const title = name ? `Boa leitura, ${name}!` : "Encontre a sua próxima história!"
    const eyebrow = current ? "Continue de onde parou" : name ? "Que tal um livro novo?" : "Bem-vindo ao SAB"
    const subtitle = current
        ? `Você está lendo ${current.title}. Que tal mais uma sessão de leitura hoje?`
        : "Busque entre milhões de livros, organize suas estantes e crie o hábito de ler."

    return (
        <section className="hero" aria-labelledby="hero-titulo">
            <div className="hero__text">
                <p className="hero__eyebrow">{eyebrow}</p>
                <h1 id="hero-titulo">{title}</h1>
                <p className="hero__subtitle">{subtitle}</p>
                <div className="hero__search">
                    <Search animated />
                </div>
                <div className="hero__actions">
                    {current ? (
                        <>
                            <Link to={`/pomodoro?livro=${current.id}`} className="button button--primary">Continuar lendo</Link>
                            <Link to={`/books/${current.id}`} state={{ book: current }} className="button">Ver livro</Link>
                        </>
                    ) : name ? (
                        <Link to="/books" className="button button--primary">Explorar livros</Link>
                    ) : (
                        <>
                            <Link to="/books" className="button button--primary">Explorar livros</Link>
                            {/* No desktop a barra do topo já tem "Criar conta"; abaixo de 900 px ela só mostra "Entrar". */}
                            <Link to="/signup" className="button hero__signup">Criar conta</Link>
                        </>
                    )}
                </div>
            </div>
            {current ? <ReadingCard entry={current} /> : <CoverFan wanted={wanted} topRated={topRated} />}
            <div className="hero__shelf" aria-hidden="true" />
        </section>
    )
}

// No celular os botões rolam de lado: o escolhido desliza até ficar inteiro na tela.
const revealChip = (button) => {
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    button.scrollIntoView?.({ block: "nearest", inline: "nearest", behavior: reduceMotion ? "auto" : "smooth" })
}

function GenreShelf() {
    const [slug, setSlug] = useState(GENRES[0].slug)
    const genre = GENRES.find((item) => item.slug === slug)
    const choose = (item, event) => {
        setSlug(item.slug)
        revealChip(event.currentTarget)
    }
    return (
        <section className="genres" aria-labelledby="generos-titulo">
            <div className="container genres__head">
                <h2 id="generos-titulo">Explore por gênero</h2>
                <div className="genres__chips" role="group" aria-label="Gêneros">
                    {GENRES.map((item) => (
                        <button
                            key={item.slug}
                            type="button"
                            className="chip"
                            aria-pressed={item.slug === slug}
                            onClick={(event) => choose(item, event)}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>
            <BookSection key={slug} title={genre.label} moreLink={`/books?genero=${slug}`} source={genreList(slug)} />
        </section>
    )
}

const Home = () => {
    const { user } = useAuth()
    const { entries } = useLibrary()
    const reading = entries.filter((entry) => entry.shelf === "reading").sort(byRecent("updatedAt"))
    const [current, ...others] = reading
    const wanted = entries.filter((entry) => entry.shelf === "want" && entry.cover).sort(byRecent("updatedAt"))
    const [trending] = useState(() => trendingList())
    const [topRated] = useState(() => sharedSource(topRatedList({ limit: TOP_RATED_SIZE })))

    useDocumentTitle("")

    return (
        <HomeStyle>
            <div className="container">
                <Hero user={user} current={current} wanted={wanted} topRated={topRated} />
            </div>
            {others.length > 0 && (
                <ListCards title="Também na sua estante Lendo" moreLink="/readinghistorylist">
                    {others.map((book) => <CardBook key={book.id} book={book} />)}
                </ListCards>
            )}
            <BookSection title="Em alta nesta semana" moreLink="/books" source={trending} />
            <GenreShelf />
            <BookSection title="Mais bem avaliados" moreLink="/books?ordem=rating" source={topRated} />
        </HomeStyle>
    )
}

export default Home
