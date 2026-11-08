import { useCallback, useEffect, useRef, useState } from "react"
import { Link, NavLink, useLocation } from "react-router-dom"
import styled from "styled-components"
import { FiClock, FiMenu } from "react-icons/fi"
import { Black, Border, Cream, DarkRed, Surface, White } from "../../assets/Colors"
import { useAuth } from "../../context/AuthContext"
import { usePomodoro } from "../../context/PomodoroContext"
import { formatTime } from "../../utils/pomodoro"
import Search from "../Search"
import ThemeToggle from "../ThemeToggle"
import LoginTab from "./LoginTab"
import MobileMenu from "./MobileMenu"
import { visibleNavItems } from "./navItems"
import { asset } from "../../utils/asset"

const HeaderStyle = styled.header`
    position: sticky;
    top: 0;
    z-index: 20;
    background-color: ${Cream};
    border-bottom: 1px solid ${Border};
    box-shadow: ${({ $scrolled }) => ($scrolled ? "0 6px 20px rgba(0, 0, 0, 0.12)" : "0 1px 0 rgba(0, 0, 0, 0.02)")};
    transition: box-shadow 200ms ease, background-color 200ms ease;
    /* Vidro fosco: quase opaco, mas deixa perceber o conteúdo passando por baixo. */
    @supports (backdrop-filter: blur(1px)) {
        background-color: color-mix(in srgb, var(--color-surface-muted) 90%, transparent);
        backdrop-filter: saturate(1.4) blur(14px);
    }
    .bar {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        max-width: 80rem;
        height: 4.25rem;
        margin: 0 auto;
        padding: 0 1rem;
    }
    .bar__logo img {
        display: block;
        width: 4rem;
    }
    .bar__links {
        display: flex;
        align-items: stretch;
        align-self: stretch;
        gap: 0.25rem;
    }
    .bar__link {
        position: relative;
        display: flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0 0.75rem;
        color: ${Black};
        font-weight: 500;
        text-decoration: none;
        white-space: nowrap;
        transition: color 150ms ease;
    }
    .bar__link::after {
        content: "";
        position: absolute;
        right: 0.75rem;
        bottom: 0;
        left: 0.75rem;
        height: 3px;
        border-radius: 3px 3px 0 0;
        background-color: ${DarkRed};
        transform: scaleX(0);
        transition: transform 180ms ease;
    }
    .bar__link:hover, .bar__link.active {
        color: ${DarkRed};
    }
    .bar__link:hover::after, .bar__link.active::after {
        transform: scaleX(1);
    }
    .bar__end {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 0.75rem;
        flex: 1;
        min-width: 0;
    }
    .bar__search {
        flex: 1;
        min-width: 0;
        max-width: 18rem;
    }
    .bar__menu {
        display: none;
        padding: 0.5rem;
        border: none;
        border-radius: 8px;
        background: none;
        color: ${Black};
        font-size: 1.75rem;
        line-height: 0;
    }
    .bar__menu:hover {
        background-color: ${Surface};
    }
    .bar__timer {
        display: flex;
        align-items: center;
        gap: 0.35rem;
        padding: 0.25rem 0.625rem;
        border-radius: 999px;
        background-color: ${DarkRed};
        color: ${White};
        font-size: 0.875rem;
        font-variant-numeric: tabular-nums;
        font-weight: 500;
        text-decoration: none;
    }
    @media (max-width: 1080px) {
        .bar__link svg {
            display: none;
        }
    }
    @media (max-width: 899px) {
        .bar {
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            gap: 0.5rem;
            height: 3.75rem;
        }
        .bar__menu {
            display: block;
            justify-self: start;
        }
        .bar__links, .bar__search, .bar__theme {
            display: none;
        }
    }
`

const PomodoroPill = () => {
    const { timer } = usePomodoro()
    if (timer.status === "idle") return null
    return (
        <Link to="/pomodoro" className="bar__timer" aria-label={`Pomodoro: ${formatTime(timer.remaining)} restantes`}>
            <FiClock aria-hidden="true" /> {formatTime(timer.remaining)}
        </Link>
    )
}

const PAGES_WITH_SEARCH = ["/", "/books"]

const MyHeader = () => {
    const { user } = useAuth()
    const location = useLocation()
    const [menuOpen, setMenuOpen] = useState(false)
    const menuButtonRef = useRef(null)

    const closeMenu = useCallback(() => setMenuOpen(false), [])

    useEffect(closeMenu, [location.pathname, location.search, closeMenu])

    const [scrolled, setScrolled] = useState(false)
    useEffect(() => {
        const update = () => setScrolled(window.scrollY > 8)
        update()
        window.addEventListener("scroll", update, { passive: true })
        return () => window.removeEventListener("scroll", update)
    }, [])

    useEffect(() => {
        const desktop = window.matchMedia?.("(min-width: 900px)")
        desktop?.addEventListener("change", closeMenu)
        return () => desktop?.removeEventListener("change", closeMenu)
    }, [closeMenu])

    return (
        <HeaderStyle $scrolled={scrolled}>
            <div className="bar">
                <button
                    ref={menuButtonRef}
                    type="button"
                    className="bar__menu"
                    aria-label="Abrir menu"
                    aria-expanded={menuOpen}
                    aria-controls="mobile-menu"
                    onClick={() => setMenuOpen(true)}
                >
                    <FiMenu aria-hidden="true" />
                </button>

                <Link to="/" className="bar__logo" aria-label="Página inicial">
                    <img className="logo-adaptive" src={asset("/imgs/logo.png")} alt="SAB" />
                </Link>

                <nav className="bar__links" aria-label="Principal">
                    {visibleNavItems(user).map(({ to, label, icon: Icon, end }) => (
                        <NavLink key={to} to={to} end={end} className="bar__link">
                            <Icon aria-hidden="true" /> {label}
                        </NavLink>
                    ))}
                </nav>

                <div className="bar__end">
                    {!PAGES_WITH_SEARCH.includes(location.pathname) && (
                        <div className="bar__search">
                            <Search compact />
                        </div>
                    )}
                    <PomodoroPill />
                    <div className="bar__theme">
                        <ThemeToggle />
                    </div>
                    <LoginTab />
                </div>
            </div>
            <MobileMenu open={menuOpen} onClose={closeMenu} returnFocusRef={menuButtonRef} />
        </HeaderStyle>
    )
}

export default MyHeader
