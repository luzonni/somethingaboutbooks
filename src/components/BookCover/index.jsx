import { useLayoutEffect, useRef, useState } from "react"
import styled from "styled-components"
import { Cream } from "../../assets/Colors"

const CoverStyle = styled.div`
    position: relative;
    width: 100%;
    aspect-ratio: 2 / 3;
    border-radius: 6px;
    overflow: hidden;
    background-color: ${Cream};
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    container-type: inline-size;
    img {
        position: absolute;
        inset: 0;
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: opacity 250ms ease;
    }
    .cover__image--loading {
        opacity: 0;
    }
`

// Paletas das capas geradas: fundo, tom escuro e cor dos detalhes.
const PALETTES = [
    ["#6b1414", "#4a0c0c", "#e9c46a"],
    ["#1f3a5f", "#142843", "#e0c08a"],
    ["#2f4f3a", "#1f3628", "#e8d9a8"],
    ["#4b2a52", "#331c38", "#f0c6a0"],
    ["#7a4a12", "#55330b", "#f5e1b8"],
    ["#33393f", "#22272b", "#f08a8e"],
]

const hash = (text) => [...text].reduce((value, char) => (value * 31 + char.charCodeAt(0)) >>> 0, 7)

const GeneratedStyle = styled.div`
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 12cqi 10cqi 10cqi 16cqi;
    color: ${({ $accent }) => $accent};
    background:
        radial-gradient(circle at 80% 15%, rgba(255, 255, 255, 0.12), transparent 55%),
        linear-gradient(160deg, ${({ $base }) => $base}, ${({ $dark }) => $dark});
    &::before {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        width: 7cqi;
        background: linear-gradient(90deg, rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.1) 70%, rgba(255, 255, 255, 0.12));
    }
    &::after {
        content: "";
        position: absolute;
        inset: 5cqi 5cqi 5cqi 11cqi;
        border: 1px solid currentColor;
        border-radius: 2px;
        opacity: 0.45;
        pointer-events: none;
    }
    .generated__title {
        display: -webkit-box;
        -webkit-line-clamp: 5;
        -webkit-box-orient: vertical;
        overflow: hidden;
        font-family: Georgia, "Times New Roman", serif;
        font-size: clamp(0.8rem, 11cqi, 1.75rem);
        font-weight: 700;
        line-height: 1.15;
        overflow-wrap: anywhere;
    }
    .generated__ornament {
        width: 30%;
        height: 2px;
        margin-top: 6cqi;
        background-color: currentColor;
        opacity: 0.7;
    }
    .generated__author {
        font-size: clamp(0.55rem, 6.5cqi, 0.95rem);
        font-weight: 500;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        opacity: 0.9;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
`

// Capa desenhada para livros sem imagem: cada título recebe sempre a mesma cor.
export const GeneratedCover = ({ title = "", author }) => {
    const [base, dark, accent] = PALETTES[hash(title) % PALETTES.length]
    return (
        <GeneratedStyle $base={base} $dark={dark} $accent={accent} role="img" aria-label={`Capa de ${title}`}>
            <div>
                <span className="generated__title">{title}</span>
                <div className="generated__ornament" />
            </div>
            {author && author !== "Autor desconhecido" && <span className="generated__author">{author}</span>}
        </GeneratedStyle>
    )
}

// Capas já vistas nesta sessão aparecem na hora, sem esperar o lazy loading nem o fade.
const loadedCovers = new Set()

const CoverImage = ({ src, alt, onError }) => {
    const imageRef = useRef(null)
    const [loaded, setLoaded] = useState(() => loadedCovers.has(src))

    // Imagem que já veio pronta do cache (ex.: depois de recarregar) aparece sem o fade.
    useLayoutEffect(() => {
        const image = imageRef.current
        if (!loaded && image?.complete && image.naturalWidth > 0) {
            loadedCovers.add(src)
            setLoaded(true)
        }
    }, [loaded, src])

    return (
        <img
            ref={imageRef}
            className={loaded ? "" : "cover__image--loading"}
            src={src}
            alt={alt}
            loading={loaded ? "eager" : "lazy"}
            decoding={loaded ? "sync" : "async"}
            onLoad={() => {
                loadedCovers.add(src)
                setLoaded(true)
            }}
            onError={onError}
        />
    )
}

const BookCover = ({ src, lowResSrc, title, author, className }) => {
    const [failedSrc, setFailedSrc] = useState(null)
    const hasImage = src && failedSrc !== src
    const showLowRes = lowResSrc && lowResSrc !== src && loadedCovers.has(lowResSrc)
    return (
        <CoverStyle className={className}>
            {showLowRes && <img src={lowResSrc} alt="" decoding="sync" />}
            {hasImage ? (
                <CoverImage key={src} src={src} alt={`Capa de ${title}`} onError={() => setFailedSrc(src)} />
            ) : (
                !showLowRes && <GeneratedCover title={title} author={author} />
            )}
        </CoverStyle>
    )
}

export default BookCover
