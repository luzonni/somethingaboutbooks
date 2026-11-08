import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { readJson, writeJson } from "../services/storage"

export const THEME_KEY = "sab:theme"
const THEME_COLORS = { light: "#620000", dark: "#171312" }

const systemTheme = () => (window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light")

// O index.html já aplica o tema antes do React carregar; aqui só lemos o mesmo valor.
export const initialTheme = () => {
    const saved = readJson(THEME_KEY, null)
    return saved === "light" || saved === "dark" ? saved : systemTheme()
}

const applyTheme = (theme) => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLORS[theme])
}

const ThemeContext = createContext(null)

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(initialTheme)
    const [chosen, setChosen] = useState(() => readJson(THEME_KEY, null) !== null)

    useEffect(() => applyTheme(theme), [theme])

    // Enquanto a pessoa não escolher um tema, acompanha o do sistema.
    useEffect(() => {
        if (chosen) return undefined
        const media = window.matchMedia?.("(prefers-color-scheme: dark)")
        const follow = () => setTheme(systemTheme())
        media?.addEventListener("change", follow)
        return () => media?.removeEventListener("change", follow)
    }, [chosen])

    const toggleTheme = useCallback(() => {
        setTheme((current) => {
            const next = current === "dark" ? "light" : "dark"
            writeJson(THEME_KEY, next)
            return next
        })
        setChosen(true)
    }, [])

    const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
