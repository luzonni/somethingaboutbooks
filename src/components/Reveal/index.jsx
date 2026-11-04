import { useEffect, useRef, useState } from "react"
import styled from "styled-components"

const RevealStyle = styled.div`
    opacity: ${({ $visible }) => ($visible ? 1 : 0)};
    transform: translateY(${({ $visible }) => ($visible ? "0" : "24px")});
    transition: opacity 600ms ease ${({ $delay }) => $delay}ms, transform 600ms cubic-bezier(0.2, 0.8, 0.2, 1) ${({ $delay }) => $delay}ms;
`

// Mostra o conteúdo com uma animação quando ele entra na tela. A classe "is-visible" libera animações internas.
const Reveal = ({ children, delay = 0, className = "" }) => {
    const ref = useRef(null)
    const [visible, setVisible] = useState(() => typeof IntersectionObserver === "undefined")

    useEffect(() => {
        if (visible || !ref.current) return undefined
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setVisible(true)
            },
            { threshold: 0.08 }
        )
        observer.observe(ref.current)
        return () => observer.disconnect()
    }, [visible])

    return (
        <RevealStyle ref={ref} $visible={visible} $delay={delay} className={`${className} ${visible ? "is-visible" : ""}`}>
            {children}
        </RevealStyle>
    )
}

export default Reveal
