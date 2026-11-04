import { useState } from "react"
import styled from "styled-components"
import { Cream, DarkGray } from "../../assets/Colors"

const CoverStyle = styled.div`
    width: 100%;
    aspect-ratio: 2 / 3;
    border-radius: 6px;
    overflow: hidden;
    background-color: ${Cream};
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
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

const BookCover = ({ src, title, className }) => {
    const [failedSrc, setFailedSrc] = useState(null)
    const hasImage = src && failedSrc !== src
    return (
        <CoverStyle className={className}>
            {hasImage ? (
                <img src={src} alt={`Capa de ${title}`} loading="lazy" onError={() => setFailedSrc(src)} />
            ) : (
                <div className="cover__fallback">{title}</div>
            )}
        </CoverStyle>
    )
}

export default BookCover
