import { NavLink } from "react-router-dom"
import styled, { keyframes } from "styled-components"
import {
    FiAlertCircle,
    FiBookOpen,
    FiChevronDown,
    FiClock,
    FiDatabase,
    FiEdit3,
    FiExternalLink,
    FiFileText,
    FiGlobe,
    FiHelpCircle,
    FiInfo,
    FiLock,
    FiSearch,
    FiShield,
    FiStar,
    FiTrash2,
} from "react-icons/fi"
import { Border, Cream, DarkGray, DarkRed, White } from "../../assets/Colors"
import { useDocumentTitle } from "../../hooks/useDocumentTitle"

const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
`

const InfoStyle = styled.div`
    .info__banner {
        padding: clamp(2.5rem, 6vw, 4rem) 1rem;
        color: ${White};
        text-align: center;
        background-color: #1d0f0c;
        background-image:
            linear-gradient(rgba(70, 4, 4, 0.85), rgba(29, 8, 6, 0.93)),
            url("/imgs/hero-books.svg");
        background-size: cover;
        background-position: center;
    }
    .info__banner h1 {
        font-size: clamp(1.875rem, 4.5vw, 2.75rem);
        font-weight: 700;
        line-height: 1.15;
    }
    .info__banner p {
        max-width: 38rem;
        margin: 0.5rem auto 0;
        color: ${Cream};
        font-size: 1.0625rem;
        font-weight: 300;
    }
    .info__layout {
        display: grid;
        grid-template-columns: 15rem minmax(0, 1fr);
        align-items: start;
        gap: 2.5rem;
        max-width: 68rem;
        margin: 0 auto;
        padding: 2.5rem 1rem 4rem;
    }
    .info__nav {
        position: sticky;
        top: 5.5rem;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }
    .info__nav a {
        display: flex;
        align-items: center;
        gap: 0.625rem;
        padding: 0.625rem 0.875rem;
        border-radius: 8px;
        color: inherit;
        font-weight: 500;
        text-decoration: none;
        white-space: nowrap;
        transition: background-color 150ms ease, color 150ms ease;
    }
    .info__nav a:hover {
        background-color: ${Cream};
    }
    .info__nav a.active {
        background-color: ${DarkRed};
        color: ${White};
    }
    .info__content {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        min-width: 0;
        animation: ${fadeIn} 350ms ease both;
    }
    .info__lead {
        font-size: 1.125rem;
        line-height: 1.6;
    }
    .info__section h2 {
        margin-bottom: 0.875rem;
        font-size: 1.375rem;
        font-weight: 700;
    }
    .info__cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(18rem, 100%), 1fr));
        gap: 1rem;
    }
    .info__card {
        display: flex;
        gap: 0.875rem;
        padding: 1.125rem;
        border: 1px solid ${Border};
        border-radius: 12px;
        background-color: #fbfaf5;
    }
    .info__card h3 {
        font-weight: 700;
    }
    .info__card p {
        margin-top: 0.25rem;
        color: ${DarkGray};
        font-size: 0.9375rem;
    }
    .info__icon {
        display: flex;
        flex-shrink: 0;
        align-items: center;
        justify-content: center;
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 10px;
        background-color: ${Cream};
        color: ${DarkRed};
        font-size: 1.25rem;
    }
    .info__team {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }
    .info__team li {
        padding: 0.375rem 0.875rem;
        border-radius: 999px;
        background-color: ${Cream};
        font-weight: 500;
    }
    .info__notice {
        padding: 1rem 1.25rem;
        border-left: 4px solid ${DarkRed};
        border-radius: 0 8px 8px 0;
        background-color: ${Cream};
    }
    .info__faq {
        display: flex;
        flex-direction: column;
        gap: 0.625rem;
    }
    .info__faq details {
        border: 1px solid ${Border};
        border-radius: 10px;
        background-color: #fbfaf5;
    }
    .info__faq summary {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        padding: 0.875rem 1.125rem;
        font-weight: 500;
        cursor: pointer;
        list-style: none;
    }
    .info__faq summary::-webkit-details-marker {
        display: none;
    }
    .info__faq summary svg {
        flex-shrink: 0;
        transition: transform 200ms ease;
    }
    .info__faq details[open] summary svg {
        transform: rotate(180deg);
    }
    .info__faq details p {
        padding: 0 1.125rem 1rem;
        color: ${DarkGray};
    }
    a.info__button {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        margin-top: 0.875rem;
        padding: 0.625rem 1.25rem;
        border-radius: 8px;
        background-color: ${DarkRed};
        color: ${White};
        font-weight: 500;
        text-decoration: none;
    }
    a.info__button:hover {
        background-color: #7a0000;
    }
    .info__content a:not(.info__button) {
        color: ${DarkRed};
        font-weight: 500;
    }

    @media (max-width: 800px) {
        .info__layout {
            grid-template-columns: minmax(0, 1fr);
            gap: 1.5rem;
            padding-top: 1rem;
        }
        .info__nav {
            position: static;
            flex-direction: row;
            overflow-x: auto;
            padding-bottom: 0.25rem;
            scrollbar-width: none;
        }
        .info__nav::-webkit-scrollbar {
            display: none;
        }
    }
`

const REPOSITORY_URL = "https://github.com/luzonni/somethingaboutbooks"
const TEAM = ["Lucas Zonzini", "Caio Renato", "Caio Gabriel", "Murilo Barros", "Francisco"]

const Card = ({ icon: Icon, title, children }) => (
    <div className="info__card">
        <span className="info__icon" aria-hidden="true"><Icon /></span>
        <div>
            <h3>{title}</h3>
            <p>{children}</p>
        </div>
    </div>
)

const Faq = ({ question, children }) => (
    <details>
        <summary>
            {question}
            <FiChevronDown aria-hidden="true" />
        </summary>
        <p>{children}</p>
    </details>
)

const PAGES = {
    about: {
        path: "/sobre",
        icon: FiInfo,
        title: "Sobre Nós",
        subtitle: "Um projeto para ajudar leitores a organizar suas leituras e criar o hábito de ler.",
        content: (
            <>
                <p className="info__lead">
                    O SAB (Something About Books) nasceu como projeto de Engenharia de Software da turma de
                    Ciência da Computação da Unima Afya - AL.
                </p>
                <section className="info__section">
                    <h2>O que você pode fazer</h2>
                    <div className="info__cards">
                        <Card icon={FiSearch} title="Descobrir livros">Busque por título, autor ou gênero em um catálogo aberto.</Card>
                        <Card icon={FiBookOpen} title="Organizar estantes">Separe o que está lendo, o que já leu e o que quer ler.</Card>
                        <Card icon={FiStar} title="Avaliar">Dê notas e escreva reviews dos seus livros.</Card>
                        <Card icon={FiClock} title="Ler com foco">Use o Pomodoro e acompanhe seu tempo de leitura.</Card>
                    </div>
                </section>
                <section className="info__section">
                    <h2>Equipe</h2>
                    <ul className="info__team">
                        {TEAM.map((name) => <li key={name}>{name}</li>)}
                    </ul>
                </section>
                <section className="info__section">
                    <h2>De onde vêm os livros</h2>
                    <p>
                        As informações e capas vêm da <a href="https://openlibrary.org" target="_blank" rel="noreferrer">Open Library</a>,
                        um catálogo aberto mantido pelo Internet Archive.
                    </p>
                </section>
            </>
        ),
    },
    terms: {
        path: "/termos",
        icon: FiFileText,
        title: "Termos de Uso",
        subtitle: "As regras simples para usar o SAB.",
        content: (
            <section className="info__section">
                <div className="info__cards">
                    <Card icon={FiInfo} title="Projeto acadêmico">O SAB é gratuito e oferecido como está, sem garantia de disponibilidade.</Card>
                    <Card icon={FiEdit3} title="Suas reviews">Você é responsável pelo que escreve nas suas reviews e listas.</Card>
                    <Card icon={FiDatabase} title="Dados dos livros">Títulos, sinopses e capas vêm da Open Library e podem conter erros ou estar incompletos.</Card>
                </div>
            </section>
        ),
    },
    privacy: {
        path: "/privacidade",
        icon: FiShield,
        title: "Política de Privacidade",
        subtitle: "Seus dados ficam com você, neste navegador.",
        content: (
            <>
                <p className="info__notice">
                    Sua conta, estantes, listas, reviews e sessões de leitura não são enviadas para um servidor do SAB.
                </p>
                <section className="info__section">
                    <div className="info__cards">
                        <Card icon={FiLock} title="Senha protegida">Sua senha é guardada como um hash, nunca em texto puro.</Card>
                        <Card icon={FiGlobe} title="Serviços externos">Para mostrar os livros, o navegador consulta a Open Library, incluindo os termos que você busca.</Card>
                        <Card icon={FiDatabase} title="Cache local">Listas e capas ficam guardadas no navegador para o site carregar mais rápido.</Card>
                        <Card icon={FiTrash2} title="Apagar seus dados">Exclua sua conta em Configurações ou limpe os dados deste site no navegador. Não há como recuperá-los depois.</Card>
                    </div>
                </section>
            </>
        ),
    },
    support: {
        path: "/suporte",
        icon: FiHelpCircle,
        title: "Suporte",
        subtitle: "Dúvidas frequentes e como falar com a equipe.",
        content: (
            <>
                <section className="info__section">
                    <h2>Perguntas frequentes</h2>
                    <div className="info__faq">
                        <Faq question="Esqueci minha senha. E agora?">
                            Como as contas ficam apenas neste navegador, não existe recuperação de senha. Nesse caso, será preciso criar uma nova conta.
                        </Faq>
                        <Faq question="Meus livros sumiram. O que aconteceu?">
                            Seus dados não acompanham você entre navegadores ou aparelhos, e são apagados ao limpar os dados do site.
                        </Faq>
                        <Faq question="Por que algumas sinopses estão em inglês?">
                            Os textos vêm da Open Library, que nem sempre tem a versão em português.
                        </Faq>
                    </div>
                </section>
                <section className="info__section">
                    <h2>Encontrou um problema?</h2>
                    <p>Conte para a equipe abrindo uma issue no repositório do projeto.</p>
                    <a className="info__button" href={`${REPOSITORY_URL}/issues`} target="_blank" rel="noreferrer">
                        <FiAlertCircle aria-hidden="true" /> Abrir uma issue <FiExternalLink aria-hidden="true" />
                    </a>
                </section>
            </>
        ),
    },
}

const Info = ({ page }) => {
    const { title, subtitle, content } = PAGES[page]
    useDocumentTitle(title)

    return (
        <InfoStyle>
            <header className="info__banner">
                <h1>{title}</h1>
                <p>{subtitle}</p>
            </header>
            <div className="info__layout">
                <nav className="info__nav" aria-label="Páginas institucionais">
                    {Object.values(PAGES).map(({ path, icon: Icon, title: label }) => (
                        <NavLink key={path} to={path}>
                            <Icon aria-hidden="true" /> {label}
                        </NavLink>
                    ))}
                </nav>
                <div className="info__content" key={page}>
                    {content}
                </div>
            </div>
        </InfoStyle>
    )
}

export default Info
