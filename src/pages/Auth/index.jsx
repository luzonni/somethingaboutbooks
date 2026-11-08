import { Link, Navigate, useLocation } from "react-router-dom"
import styled from "styled-components"
import { Black, Border, Cream, DarkGray, DarkRed, Sand, Surface, White } from "../../assets/Colors"
import { useAuth } from "../../context/AuthContext"
import { useDocumentTitle } from "../../hooks/useDocumentTitle"
import Login from "../Login"
import SignUp from "../SignUp"

const SLIDE = "700ms cubic-bezier(0.7, 0, 0.25, 1)"

const AuthStyle = styled.main`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    min-height: 100vh;
    padding: 1.5rem 1rem;
    background-color: ${Cream};

    .auth__logo-mobile {
        display: none;
    }
    .auth__logo-mobile img {
        display: block;
        width: 4.5rem;
    }
    .auth__card {
        position: relative;
        width: min(64rem, 100%);
        border-radius: 20px;
        overflow: hidden;
        background-color: ${Surface};
        box-shadow: 0 20px 50px rgba(41, 20, 16, 0.18);
    }
    .auth__panes {
        position: relative;
        display: grid;
        grid-template-columns: 1fr 1fr;
    }

    /* Formulários */
    .auth__pane {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 1.25rem;
        min-width: 0;
        padding: 2.5rem 3rem;
        transition: opacity 350ms ease 200ms, transform ${SLIDE}, visibility 0s linear 0s;
    }
    &[data-mode="login"] [data-pane="signup"],
    &[data-mode="signup"] [data-pane="login"] {
        opacity: 0;
        visibility: hidden;
        transition: opacity 200ms ease, transform ${SLIDE}, visibility 0s linear 300ms;
    }
    &[data-mode="login"] [data-pane="signup"] {
        transform: translateX(-3rem);
    }
    &[data-mode="signup"] [data-pane="login"] {
        transform: translateX(3rem);
    }
    .auth__heading h1 {
        font-size: 1.875rem;
        font-weight: 700;
        line-height: 1.2;
    }
    .auth__heading p {
        margin-top: 0.25rem;
        color: ${DarkGray};
    }
    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    .form_group {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 1rem;
    }

    /* Painel que desliza */
    .auth__art {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        z-index: 2;
        display: flex;
        flex-direction: column;
        width: 50%;
        padding: 2.5rem;
        color: ${White};
        background-color: #1d0f0c;
        background-image:
            linear-gradient(rgba(70, 4, 4, 0.82), rgba(29, 8, 6, 0.92)),
            url("/imgs/hero-books.svg");
        background-size: cover;
        background-position: center;
        transition: transform ${SLIDE};
    }
    &[data-mode="login"] .auth__art {
        transform: translateX(100%);
    }
    .auth__art-logo {
        align-self: flex-start;
    }
    .auth__art-logo img {
        display: block;
        width: 5rem;
        filter: brightness(0) invert(1);
    }
    .auth__messages {
        display: grid;
        flex: 1;
        align-items: center;
    }
    .auth__message {
        grid-area: 1 / 1;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
        transition: opacity 350ms ease 250ms, transform ${SLIDE}, visibility 0s linear 0s;
    }
    &[data-mode="login"] [data-message="signup"],
    &[data-mode="signup"] [data-message="login"] {
        opacity: 0;
        visibility: hidden;
        transform: translateY(0.75rem);
        transition: opacity 150ms ease, transform ${SLIDE}, visibility 0s linear 150ms;
    }
    .auth__message h2 {
        font-size: 2rem;
        font-weight: 700;
        line-height: 1.2;
    }
    .auth__message p {
        color: ${Sand};
        font-weight: 300;
    }
    .auth__cta {
        padding: 0.625rem 1.75rem;
        border: 2px solid ${White};
        border-radius: 999px;
        color: ${White};
        font-weight: 500;
        text-decoration: none;
        transition: background-color 150ms ease, color 150ms ease;
    }
    .auth__cta:hover {
        background-color: ${White};
        color: ${DarkRed};
    }

    /* Alternador do mobile */
    .auth__switch {
        display: none;
        position: relative;
        grid-template-columns: 1fr 1fr;
        margin: 1.25rem 1.25rem 0;
        padding: 0.25rem;
        border: 1px solid ${Border};
        border-radius: 12px;
        background-color: ${Cream};
    }
    .auth__switch-pill {
        position: absolute;
        top: 0.25rem;
        bottom: 0.25rem;
        left: 0.25rem;
        width: calc(50% - 0.25rem);
        border-radius: 9px;
        background-color: ${DarkRed};
        transition: transform 350ms cubic-bezier(0.7, 0, 0.25, 1);
    }
    &[data-mode="signup"] .auth__switch-pill {
        transform: translateX(100%);
    }
    .auth__switch a {
        position: relative;
        padding: 0.5rem;
        border-radius: 9px;
        color: ${Black};
        font-weight: 500;
        text-align: center;
        text-decoration: none;
        transition: color 250ms ease;
    }
    .auth__switch a[aria-current="page"] {
        color: ${White};
    }

    @media (max-width: 860px) {
        .auth__logo-mobile {
            display: block;
        }
        .auth__card {
            max-width: 30rem;
        }
        .auth__switch {
            display: grid;
        }
        .auth__art {
            display: none;
        }
        .auth__panes {
            grid-template-columns: minmax(0, 1fr);
            overflow: hidden;
        }
        .auth__pane {
            padding: 1.5rem 1.25rem 2rem;
            transition: opacity 250ms ease 100ms, transform 400ms ease;
        }
        &[data-mode="login"] [data-pane="signup"],
        &[data-mode="signup"] [data-pane="login"] {
            position: absolute;
            top: 0;
            right: 0;
            left: 0;
            transition: opacity 120ms ease, transform 400ms ease, visibility 0s linear 200ms;
        }
        &[data-mode="login"] [data-pane="signup"] {
            transform: translateX(2rem);
        }
        &[data-mode="signup"] [data-pane="login"] {
            transform: translateX(-2rem);
        }
    }

    @media (max-width: 420px) {
        .form_group {
            grid-template-columns: minmax(0, 1fr);
        }
    }
`

const AuthPage = () => {
    const { user } = useAuth()
    const location = useLocation()
    const mode = location.pathname === "/signup" ? "signup" : "login"
    const { state } = location

    useDocumentTitle(mode === "login" ? "Entrar" : "Criar conta")

    if (user) return <Navigate to={state?.from ?? "/"} replace />

    return (
        <AuthStyle data-mode={mode}>
            <Link to="/" className="auth__logo-mobile" aria-label="Voltar para a página inicial">
                <img className="logo-adaptive" src="/imgs/logo.png" alt="SAB" />
            </Link>

            <div className="auth__card">
                <nav className="auth__switch" aria-label="Entrar ou criar conta">
                    <span className="auth__switch-pill" aria-hidden="true" />
                    <Link to="/login" state={state} replace aria-current={mode === "login" ? "page" : undefined}>Entrar</Link>
                    <Link to="/signup" state={state} replace aria-current={mode === "signup" ? "page" : undefined}>Criar conta</Link>
                </nav>

                <div className="auth__panes">
                    <section className="auth__pane" data-pane="login">
                        <div className="auth__heading">
                            <h1>Bem-vindo de volta!</h1>
                            <p>Entre para continuar suas leituras.</p>
                        </div>
                        <Login />
                    </section>
                    <section className="auth__pane" data-pane="signup">
                        <div className="auth__heading">
                            <h1>Crie sua conta</h1>
                            <p>É rápido e gratuito.</p>
                        </div>
                        <SignUp />
                    </section>
                </div>

                <aside className="auth__art">
                    <Link to="/" className="auth__art-logo" aria-label="Voltar para a página inicial">
                        <img src="/imgs/logo.png" alt="SAB" />
                    </Link>
                    <div className="auth__messages">
                        <div className="auth__message" data-message="login">
                            <h2>Novo por aqui?</h2>
                            <p>Monte suas estantes, avalie livros e acompanhe seu tempo de leitura.</p>
                            <Link to="/signup" state={state} replace className="auth__cta">Criar conta</Link>
                        </div>
                        <div className="auth__message" data-message="signup">
                            <h2>Já tem uma conta?</h2>
                            <p>Entre para voltar às suas estantes e continuar de onde parou.</p>
                            <Link to="/login" state={state} replace className="auth__cta">Entrar</Link>
                        </div>
                    </div>
                </aside>
            </div>
        </AuthStyle>
    )
}

export default AuthPage
