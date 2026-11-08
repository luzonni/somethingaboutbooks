import { Link } from "react-router-dom";
import styled from "styled-components";
import { Coral, Ink, White } from "../../assets/Colors";

const MyFooterStyle = styled.footer`
    padding: 2.5rem 1rem 1.5rem;
    background-color: ${Ink};
    color: #dddddd;
    .footer__content {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 1.5rem 3rem;
        max-width: 80rem;
        margin: 0 auto;
    }
    .footer__brand {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    .footer__brand img {
        display: block;
        width: 4.5rem;
        filter: brightness(0) invert(1);
    }
    .footer__brand p {
        max-width: 18rem;
        font-size: 0.9375rem;
        font-weight: 300;
    }
    .footer__links {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem 1.75rem;
    }
    a {
        color: #dddddd;
        text-decoration: none;
        transition: color 150ms ease;
    }
    a:hover {
        color: ${White};
        text-decoration: underline;
        text-decoration-color: ${Coral};
        text-underline-offset: 4px;
    }
    .footer__bottom {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 0.25rem 2rem;
        max-width: 80rem;
        margin: 1.5rem auto 0;
        padding-top: 1rem;
        border-top: 1px solid rgba(255, 255, 255, 0.15);
        font-size: 0.875rem;
        font-weight: 300;
    }
    .footer__bottom a {
        text-decoration: underline;
    }
`

const LINKS = [
    { to: "/sobre", label: "Sobre Nós" },
    { to: "/termos", label: "Termos de Uso" },
    { to: "/privacidade", label: "Política de Privacidade" },
    { to: "/suporte", label: "Suporte" },
]

const MyFooter = () => (
    <MyFooterStyle>
        <div className="footer__content">
            <div className="footer__brand">
                <img src="/imgs/logo.png" alt="SAB" />
                <p>Organize suas leituras e descubra sua próxima história.</p>
            </div>
            <nav className="footer__links" aria-label="Institucional">
                {LINKS.map((link) => (
                    <Link key={link.to} to={link.to}>{link.label}</Link>
                ))}
            </nav>
        </div>
        <div className="footer__bottom">
            <p>© {new Date().getFullYear()} SAB. Todos os direitos reservados.</p>
            <p>
                Dados e capas de livros: <a href="https://openlibrary.org" target="_blank" rel="noreferrer">Open Library</a>
            </p>
        </div>
    </MyFooterStyle>
)

export default MyFooter
