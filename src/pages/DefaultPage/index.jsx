import { Suspense, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import styled from "styled-components";
import BackToTop from "../../components/BackToTop";
import ErrorBoundary from "../../components/ErrorBoundary";
import { Spinner } from "../../components/Feedback";
import MyFooter from "../../components/MyFooter";
import MyHeader from "../../components/MyHeader";
import OfflineBanner from "../../components/OfflineBanner";
import ShortcutsDialog from "../../components/ShortcutsDialog";
import { useAuth } from "../../context/AuthContext";
import { useShortcut } from "../../hooks/useShortcut";

// Prefere a busca do conteúdo da página; se não houver, usa a da navbar.
const focusSearch = () => {
    const visible = [...document.querySelectorAll('input[type="search"]')].filter((input) => input.offsetParent !== null)
    const target = visible.find((input) => input.closest("main")) ?? visible[0]
    target?.focus()
    target?.select()
}

const LayoutStyle = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    .skip-link {
        position: absolute;
        top: 0.5rem;
        left: 0.5rem;
        z-index: 100;
        padding: 0.625rem 1rem;
        border-radius: 8px;
        background-color: var(--color-brand);
        color: var(--color-on-brand);
        font-weight: 500;
        transform: translateY(-200%);
        transition: transform 150ms ease;
    }
    .skip-link:focus {
        transform: translateY(0);
    }
    main {
        flex: 1;
        width: 100%;
        /* Mantém o rodapé abaixo da dobra enquanto a página carrega: sem isso ele aparecia no meio
           da tela e era empurrado quando o conteúdo chegava (CLS de 0,36 no celular). */
        min-height: 100vh;
        background-color: var(--color-surface);
    }
    main:focus {
        outline: none;
    }
`

const DefaultPage = () => {
    const { pathname } = useLocation()
    const { signedOut, acknowledgeSignOut } = useAuth()

    // Já na página inicial depois de sair: próximas visitas a páginas protegidas pedem login de novo.
    useEffect(() => {
        if (signedOut && pathname === "/") acknowledgeSignOut()
    }, [signedOut, pathname, acknowledgeSignOut])

    const [shortcutsOpen, setShortcutsOpen] = useState(false)

    useShortcut("/", focusSearch)
    useShortcut("?", () => setShortcutsOpen(true))

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname])

    return (
        <LayoutStyle>
            <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
            <OfflineBanner />
            <MyHeader />
            <main id="conteudo" tabIndex={-1}>
                <ErrorBoundary key={pathname}>
                    <Suspense fallback={<Spinner label="Carregando página" />}>
                        <Outlet />
                    </Suspense>
                </ErrorBoundary>
            </main>
            <MyFooter onShowShortcuts={() => setShortcutsOpen(true)} />
            <BackToTop />
            <ShortcutsDialog open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
        </LayoutStyle>
    )
}

export default DefaultPage
