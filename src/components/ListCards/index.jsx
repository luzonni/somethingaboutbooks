import { useCallback, useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { Link } from "react-router-dom"
import { FiArrowRight, FiChevronLeft, FiChevronRight } from "react-icons/fi"
import { Border, BrandText, Cream, DarkRed, White } from "../../assets/Colors"

const ListCardStyle = styled.section`
    width: 100%;
    max-width: 80rem;
    margin: 0 auto;
    padding: 1.5rem 1rem;
    .head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
    }
    h2 {
        font-weight: 700;
        font-size: clamp(1.25rem, 3vw, 1.75rem);
    }
    .head__actions {
        display: flex;
        flex-shrink: 0;
        align-items: center;
        gap: 1.25rem;
    }
    .head__arrows {
        display: flex;
        gap: 0.5rem;
    }
    .link__mais {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        padding: 0.4rem 0.6rem 0.4rem 0.9rem;
        border: 1px solid ${Border};
        border-radius: 999px;
        color: ${BrandText};
        font-size: 0.9375rem;
        font-weight: 500;
        text-decoration: none;
        white-space: nowrap;
        transition: background-color 150ms ease, color 150ms ease, border-color 150ms ease;
    }
    .link__mais svg {
        transition: transform 180ms ease;
    }
    .link__mais:hover {
        border-color: ${DarkRed};
        background-color: ${DarkRed};
        color: ${White};
    }
    .link__mais:hover svg {
        transform: translateX(3px);
    }
    .carousel__arrow {
        display: none;
        align-items: center;
        justify-content: center;
        width: 2.25rem;
        height: 2.25rem;
        border: 1px solid ${Border};
        border-radius: 50%;
        background-color: ${Cream};
        color: ${BrandText};
        font-size: 1.25rem;
        transition: background-color 150ms ease, color 150ms ease;
    }
    .carousel__arrow:hover:not(:disabled) {
        background-color: ${DarkRed};
        color: ${White};
    }
    .carousel__arrow:disabled {
        opacity: 0.4;
    }
    @media (hover: hover) and (pointer: fine) {
        .carousel__arrow {
            display: flex;
        }
    }
    .list--carousel {
        display: grid;
        grid-auto-flow: column;
        grid-auto-columns: 10.5rem;
        gap: 1rem;
        padding: 0.5rem 0.25rem 1.25rem;
        overflow-x: auto;
        /* Sem scroll-behavior: smooth aqui. Com o snap, o navegador reajusta a posição com rolagem
           suave quando os livros substituem os skeletons, e o Chrome para de medir o LCP da página. */
        scroll-snap-type: x proximity;
        scrollbar-width: none;
    }
    .list--carousel::-webkit-scrollbar {
        display: none;
    }
    .list--carousel > * {
        scroll-snap-align: start;
    }
    .list--grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(min(20rem, 100%), 1fr));
        gap: 1rem;
    }
`

const useCarousel = () => {
    const listRef = useRef(null)
    const [position, setPosition] = useState({ canPrev: false, canNext: false })

    const update = useCallback(() => {
        const list = listRef.current
        if (!list) return
        const canPrev = list.scrollLeft > 1
        const canNext = list.scrollLeft + list.clientWidth < list.scrollWidth - 1
        setPosition((current) =>
            current.canPrev === canPrev && current.canNext === canNext ? current : { canPrev, canNext }
        )
    }, [])

    useEffect(() => {
        const list = listRef.current
        if (!list) return undefined
        list.addEventListener("scroll", update, { passive: true })
        window.addEventListener("resize", update)
        return () => {
            list.removeEventListener("scroll", update)
            window.removeEventListener("resize", update)
        }
    }, [update])

    // O conteúdo chega depois (skeleton > livros), então recalcula a cada render.
    useEffect(update)

    const scroll = (direction) => {
        const list = listRef.current
        const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
        list?.scrollBy({ left: direction * list.clientWidth * 0.8, behavior: reduceMotion ? "auto" : "smooth" })
    }

    return { listRef, scroll, ...position }
}

const ListCards = ({ title, moreLink, layout = "carousel", children }) => {
    const { listRef, scroll, canPrev, canNext } = useCarousel()
    const isCarousel = layout === "carousel"

    return (
        <ListCardStyle>
            <div className="head">
                <h2>{title}</h2>
                <div className="head__actions">
                    {moreLink && (
                        <Link to={moreLink} className="link__mais" aria-label={`Ver mais: ${title}`}>
                            Ver mais <FiArrowRight aria-hidden="true" />
                        </Link>
                    )}
                    {isCarousel && (canPrev || canNext) && (
                        <div className="head__arrows">
                            <button
                                type="button"
                                className="carousel__arrow"
                                aria-label={`Voltar em ${title}`}
                                disabled={!canPrev}
                                onClick={() => scroll(-1)}
                            >
                                <FiChevronLeft aria-hidden="true" />
                            </button>
                            <button
                                type="button"
                                className="carousel__arrow"
                                aria-label={`Avançar em ${title}`}
                                disabled={!canNext}
                                onClick={() => scroll(1)}
                            >
                                <FiChevronRight aria-hidden="true" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div ref={listRef} className={`list--${layout}`}>{children}</div>
        </ListCardStyle>
    )
}

export default ListCards
