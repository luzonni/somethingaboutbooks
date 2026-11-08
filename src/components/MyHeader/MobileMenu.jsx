import { useEffect, useRef } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import styled from "styled-components"
import { FiLogOut, FiX } from "react-icons/fi"
import { Black, Border, Cream, DarkRed, White } from "../../assets/Colors"
import { useAuth } from "../../context/AuthContext"
import Search from "../Search"
import ThemeToggle from "../ThemeToggle"
import { accountLinks, visibleNavItems } from "./navItems"

const MobileMenuStyle = styled.div`
    .drawer__backdrop {
        position: fixed;
        inset: 0;
        z-index: 40;
        background-color: rgba(0, 0, 0, 0.5);
        opacity: 0;
        visibility: hidden;
        transition: opacity 200ms ease, visibility 200ms ease;
    }
    .drawer {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        z-index: 50;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: min(20rem, 85vw);
        padding: 1rem;
        overflow-y: auto;
        background-color: ${Cream};
        box-shadow: 4px 0 24px rgba(0, 0, 0, 0.25);
        transform: translateX(-100%);
        visibility: hidden;
        transition: transform 220ms ease, visibility 220ms ease;
    }
    &.is-open .drawer__backdrop {
        opacity: 1;
        visibility: visible;
    }
    &.is-open .drawer {
        transform: translateX(0);
        visibility: visible;
    }
    .drawer__head {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .drawer__tools {
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }
    .drawer__head img {
        display: block;
        width: 4rem;
    }
    .drawer__close {
        display: flex;
        padding: 0.5rem;
        border: none;
        border-radius: 8px;
        background: none;
        color: ${Black};
        font-size: 1.5rem;
    }
    .drawer__links {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }
    .drawer__link {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        width: 100%;
        padding: 0.75rem;
        border: none;
        border-radius: 8px;
        background: none;
        color: ${Black};
        font-size: 1.0625rem;
        font-weight: 500;
        text-align: left;
        text-decoration: none;
    }
    .drawer__link svg {
        flex-shrink: 0;
        font-size: 1.25rem;
    }
    .drawer__link:hover {
        background-color: ${Border};
    }
    .drawer__link.active {
        background-color: ${DarkRed};
        color: ${White};
    }
    .drawer__account {
        margin-top: auto;
        padding-top: 1rem;
        border-top: 1px solid ${Border};
    }
    .drawer__user {
        padding: 0 0.75rem 0.5rem;
        font-weight: 700;
    }
    .drawer__cta {
        display: block;
        padding: 0.75rem;
        border-radius: 999px;
        text-align: center;
        font-weight: 500;
        text-decoration: none;
    }
    .drawer__cta--primary {
        background-image: linear-gradient(135deg, #8a1616, ${DarkRed});
        color: ${White};
        box-shadow: 0 4px 12px rgba(98, 0, 0, 0.3);
    }
    .drawer__cta--secondary {
        margin-top: 0.5rem;
        border: 1.5px solid rgba(98, 0, 0, 0.3);
        color: ${DarkRed};
    }
    @media (min-width: 900px) {
        display: none;
    }
`

const MobileMenu = ({ open, onClose, returnFocusRef }) => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const closeRef = useRef(null)
    const wasOpen = useRef(false)

    useEffect(() => {
        if (open) {
            closeRef.current?.focus()
        } else if (wasOpen.current) {
            returnFocusRef.current?.focus()
        }
        wasOpen.current = open
    }, [open, returnFocusRef])

    useEffect(() => {
        if (!open) return undefined
        const closeOnEscape = (event) => {
            if (event.key === "Escape") onClose()
        }
        const { overflow } = document.body.style
        document.body.style.overflow = "hidden"
        document.addEventListener("keydown", closeOnEscape)
        return () => {
            document.body.style.overflow = overflow
            document.removeEventListener("keydown", closeOnEscape)
        }
    }, [open, onClose])

    const handleLogout = async () => {
        await logout()
        onClose()
        navigate("/")
    }

    return (
        <MobileMenuStyle className={open ? "mobile-menu is-open" : "mobile-menu"}>
            <div className="drawer__backdrop" onClick={onClose} aria-hidden="true" />
            <aside id="mobile-menu" className="drawer" aria-label="Menu" aria-hidden={!open}>
                <div className="drawer__head">
                    <Link to="/" aria-label="Página inicial"><img className="logo-adaptive" src="/imgs/logo.png" alt="SAB" /></Link>
                    <div className="drawer__tools">
                        <ThemeToggle />
                        <button ref={closeRef} type="button" className="drawer__close" aria-label="Fechar menu" onClick={onClose}>
                            <FiX aria-hidden="true" />
                        </button>
                    </div>
                </div>

                <Search compact />

                <nav className="drawer__links" aria-label="Principal">
                    {visibleNavItems(user).map(({ to, label, icon: Icon, end }) => (
                        <NavLink key={to} to={to} end={end} className="drawer__link">
                            <Icon aria-hidden="true" /> {label}
                        </NavLink>
                    ))}
                </nav>

                <div className="drawer__account">
                    {user ? (
                        <>
                            <p className="drawer__user">{user.username}</p>
                            <div className="drawer__links">
                                {accountLinks(user).map((link) => (
                                    <NavLink key={link.to} to={link.to} className="drawer__link">{link.label}</NavLink>
                                ))}
                                <button type="button" className="drawer__link" onClick={handleLogout}>
                                    <FiLogOut aria-hidden="true" /> Sair
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="drawer__cta drawer__cta--primary">Entrar</Link>
                            <Link to="/signup" className="drawer__cta drawer__cta--secondary">Criar conta</Link>
                        </>
                    )}
                </div>
            </aside>
        </MobileMenuStyle>
    )
}

export default MobileMenu
