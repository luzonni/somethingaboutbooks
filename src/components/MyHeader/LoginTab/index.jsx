import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { FiArrowRight, FiChevronDown, FiLogOut } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Black, Border, Cream, DarkRed, Surface, White } from "../../../assets/Colors";
import { useAuth } from "../../../context/AuthContext";
import { accountLinks } from "../navItems";

const LoginTabStyle = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .login__enter, .login__signup {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        height: 2.5rem;
        padding: 0 1.125rem;
        border-radius: 999px;
        font-size: 0.9375rem;
        font-weight: 500;
        text-decoration: none;
        white-space: nowrap;
        transition: background-color 180ms ease, color 180ms ease, border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
    }

    .login__enter svg {
        transition: transform 180ms ease;
    }

    .login__enter {
        border: 1.5px solid rgba(98, 0, 0, 0.3);
        color: ${DarkRed};
    }

    .login__enter:hover {
        border-color: ${DarkRed};
        background-color: ${Surface};
    }

    .login__enter:hover svg {
        transform: translateX(2px);
    }

    .login__signup {
        position: relative;
        overflow: hidden;
        background-image: linear-gradient(135deg, #8a1616, ${DarkRed});
        color: ${White};
        box-shadow: 0 4px 12px rgba(98, 0, 0, 0.3);
    }

    .login__signup::after {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        left: -60%;
        width: 40%;
        background: linear-gradient(100deg, transparent, rgba(255, 255, 255, 0.35), transparent);
        transform: skewX(-20deg);
        transition: left 550ms ease;
    }

    .login__signup:hover {
        box-shadow: 0 6px 18px rgba(98, 0, 0, 0.42);
        transform: translateY(-1px);
    }

    .login__signup:hover::after {
        left: 120%;
    }

    .login__signup:active, .login__enter:active {
        transform: translateY(0) scale(0.97);
    }

    .user__toggle {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.25rem 0.5rem 0.25rem 0.25rem;
        border: none;
        border-radius: 999px;
        background: none;
        color: ${Black};
        font-weight: 500;
    }

    .user__toggle:hover {
        background-color: ${Surface};
    }

    .user__avatar {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2.25rem;
        height: 2.25rem;
        border-radius: 50%;
        background-color: ${DarkRed};
        color: ${White};
        font-weight: 700;
    }

    .user__name {
        max-width: 9rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .user__menu {
        position: absolute;
        top: calc(100% + 0.5rem);
        right: 0;
        z-index: 30;
        min-width: 12rem;
        padding: 0.375rem;
        border: 1px solid ${Border};
        border-radius: 10px;
        background-color: ${Surface};
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }

    .user__menu a, .user__menu button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        width: 100%;
        padding: 0.5rem 0.75rem;
        border: none;
        border-radius: 6px;
        background: none;
        color: ${Black};
        text-align: left;
        text-decoration: none;
    }

    .user__menu a:hover, .user__menu button:hover {
        background-color: ${Cream};
    }

    .user__menu .user__logout {
        margin-top: 0.25rem;
        color: ${DarkRed};
    }

    @media (max-width: 899px) {
        .user__name, .user__chevron, .login__signup {
            display: none;
        }
        .user__toggle {
            padding: 0;
        }
    }
`

const UserMenu = ({ user, onLogout }) => {
    const [open, setOpen] = useState(false)
    const containerRef = useRef(null)
    const location = useLocation()

    useEffect(() => setOpen(false), [location.pathname])

    useEffect(() => {
        if (!open) return undefined
        const closeOutside = (event) => {
            if (!containerRef.current?.contains(event.target)) setOpen(false)
        }
        const closeOnEscape = (event) => {
            if (event.key === "Escape") setOpen(false)
        }
        document.addEventListener("pointerdown", closeOutside)
        document.addEventListener("keydown", closeOnEscape)
        return () => {
            document.removeEventListener("pointerdown", closeOutside)
            document.removeEventListener("keydown", closeOnEscape)
        }
    }, [open])

    return (
        <div ref={containerRef}>
            <button
                type="button"
                className="user__toggle"
                aria-expanded={open}
                aria-label={`Menu de ${user.username}`}
                onClick={() => setOpen(!open)}
            >
                <span className="user__avatar" aria-hidden="true">{user.username[0].toUpperCase()}</span>
                <span className="user__name">{user.username}</span>
                <FiChevronDown className="user__chevron" aria-hidden="true" />
            </button>
            {open && (
                <div className="user__menu">
                    {accountLinks(user).map((link) => (
                        <Link key={link.to} to={link.to}>{link.label}</Link>
                    ))}
                    <button type="button" className="user__logout" onClick={onLogout}>
                        <FiLogOut aria-hidden="true" /> Sair
                    </button>
                </div>
            )}
        </div>
    )
}

const LoginTab = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        await logout()
        navigate("/")
    }

    return (
        <LoginTabStyle>
            {user ? (
                <UserMenu user={user} onLogout={handleLogout} />
            ) : (
                <>
                    <Link to="/login" className="login__enter">
                        Entrar <FiArrowRight aria-hidden="true" />
                    </Link>
                    <Link to="/signup" className="login__signup">Criar conta</Link>
                </>
            )}
        </LoginTabStyle>
    )
}

export default LoginTab
