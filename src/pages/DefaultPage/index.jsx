import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import styled from "styled-components";
import ErrorBoundary from "../../components/ErrorBoundary";
import { Spinner } from "../../components/Feedback";
import MyFooter from "../../components/MyFooter";
import MyHeader from "../../components/MyHeader";
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
    main {
        flex: 1;
        width: 100%;
        background-color: var(--color-surface);
    }
`

const DefaultPage = () => {
    const { pathname } = useLocation()

    useShortcut("/", focusSearch)

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname])

    return (
        <LayoutStyle>
            <MyHeader />
            <main>
                <ErrorBoundary key={pathname}>
                    <Suspense fallback={<Spinner label="Carregando página" />}>
                        <Outlet />
                    </Suspense>
                </ErrorBoundary>
            </main>
            <MyFooter />
        </LayoutStyle>
    )
}

export default DefaultPage
