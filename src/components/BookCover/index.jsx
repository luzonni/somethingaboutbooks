import { useState } from "react"
import styled from "styled-components"
import { Cream, DarkGray } from "../../assets/Colors"

const CoverStyle = styled.div`
    position: relative;
    width: 100%;
    aspect-ratio: 2 / 3;
    border-radius: 6px;
    overflow: hidden;
    background-color: ${Cream};
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
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
    .cover__fallback {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        padding: 0.75rem;
        text-align: center;
        font-size: 0.9rem;
        color: ${DarkGray};
    }
`

// Capas já vistas nesta sessão aparecem na hora, sem esperar o lazy loading nem o fade.
const loadedCovers = new Set()

const CoverImage = ({ src, alt, onError }) => {
    const [loaded, setLoaded] = useState(() => loadedCovers.has(src))
    return (
        <img
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

const BookCover = ({ src, lowResSrc, title, className }) => {
    const [failedSrc, setFailedSrc] = useState(null)
    const hasImage = src && failedSrc !== src
    const showLowRes = lowResSrc && lowResSrc !== src && loadedCovers.has(lowResSrc)
    return (
        <CoverStyle className={className}>
            {showLowRes && <img src={lowResSrc} alt="" decoding="sync" />}
            {hasImage ? (
                <CoverImage key={src} src={src} alt={`Capa de ${title}`} onError={() => setFailedSrc(src)} />
            ) : (
                !showLowRes && <div className="cover__fallback">{title}</div>
            )}
        </CoverStyle>
    )
}

export default BookCover
