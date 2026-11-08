import { useLayoutEffect, useRef, useState } from "react"
import styled from "styled-components"
import { DarkGray, DarkRed } from "../../assets/Colors"

const ExpandableStyle = styled.div`
    .expandable__content {
        overflow: hidden;
        white-space: pre-line;
        overflow-wrap: anywhere;
        line-height: 1.65;
        transition: max-height 400ms cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    .expandable__content--clamped {
        -webkit-mask-image: linear-gradient(#000 60%, transparent);
        mask-image: linear-gradient(#000 60%, transparent);
    }
    .expandable__button {
        margin-top: 0.5rem;
        padding: 0;
        border: none;
        background: none;
        color: ${DarkRed};
        font-weight: 500;
        text-decoration: underline;
        text-underline-offset: 3px;
    }
    .expandable__empty {
        color: ${DarkGray};
    }
`

// Texto longo recolhido com degradê; o botão só aparece quando o texto realmente passa do limite.
const ExpandableText = ({ text, emptyText, collapsedHeight = "10.5rem" }) => {
    const contentRef = useRef(null)
    const [expanded, setExpanded] = useState(false)
    const [size, setSize] = useState({ full: 0, overflows: false })

    useLayoutEffect(() => {
        const measure = () => {
            const element = contentRef.current
            if (!element) return
            const current = element.style.maxHeight
            element.style.maxHeight = collapsedHeight
            const overflows = element.scrollHeight > element.clientHeight + 2
            const full = element.scrollHeight
            element.style.maxHeight = current
            setSize({ full, overflows })
        }
        measure()
        window.addEventListener("resize", measure)
        return () => window.removeEventListener("resize", measure)
    }, [text, collapsedHeight])

    if (!text) {
        return (
            <ExpandableStyle>
                <p className="expandable__empty">{emptyText}</p>
            </ExpandableStyle>
        )
    }

    const isClamped = size.overflows && !expanded

    return (
        <ExpandableStyle>
            <div
                ref={contentRef}
                className={`expandable__content ${isClamped ? "expandable__content--clamped" : ""}`}
                style={{ maxHeight: expanded ? size.full : collapsedHeight }}
            >
                {text}
            </div>
            {size.overflows && (
                <button
                    type="button"
                    className="expandable__button"
                    aria-expanded={expanded}
                    onClick={() => setExpanded(!expanded)}
                >
                    {expanded ? "Ler menos" : "Ler mais"}
                </button>
            )}
        </ExpandableStyle>
    )
}

export default ExpandableText
