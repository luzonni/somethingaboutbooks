import { useEffect, useState } from "react"
import styled from "styled-components"
import { FiArrowUp } from "react-icons/fi"
import { Coral, Ink } from "../../assets/Colors"

const SHOW_AFTER = 700

const BackToTopStyle = styled.button`
    position: fixed;
    right: 1.25rem;
    bottom: 1.25rem;
    z-index: 30;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    height: 3rem;
    border: none;
    border-radius: 50%;
    background-color: ${Coral};
    color: ${Ink};
    font-size: 1.375rem;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
    opacity: ${({ $visible }) => ($visible ? 1 : 0)};
    visibility: ${({ $visible }) => ($visible ? "visible" : "hidden")};
    transform: translateY(${({ $visible }) => ($visible ? "0" : "1rem")});
    transition: opacity 200ms ease, transform 200ms ease, visibility 200ms;
    &:hover svg {
        transform: translateY(-2px);
    }
    svg {
        transition: transform 150ms ease;
    }
`

const BackToTop = () => {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const update = () => setVisible(window.scrollY > SHOW_AFTER)
        update()
        window.addEventListener("scroll", update, { passive: true })
        return () => window.removeEventListener("scroll", update)
    }, [])

    return (
        <BackToTopStyle
            type="button"
            $visible={visible}
            aria-label="Voltar ao topo"
            tabIndex={visible ? 0 : -1}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
            <FiArrowUp aria-hidden="true" />
        </BackToTopStyle>
    )
}

export default BackToTop
