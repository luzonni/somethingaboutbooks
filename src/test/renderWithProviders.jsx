import { render } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { AuthProvider } from "../context/AuthContext"
import { LibraryProvider } from "../context/LibraryContext"
import { PomodoroProvider } from "../context/PomodoroContext"
import { ThemeProvider } from "../context/ThemeContext"
import { ToastProvider } from "../context/ToastContext"
import { register } from "../services/authService"

export const createReader = () => register({ username: "leitor", email: "leitor@sab.com", password: "senha-segura" })

// Monta a mesma árvore de providers do app para testar componentes que dependem dela.
export const renderWithProviders = (ui, { route = "/" } = {}) =>
    render(
        <ThemeProvider>
            <ToastProvider>
                <AuthProvider>
                    <LibraryProvider>
                        <PomodoroProvider>
                            <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
                        </PomodoroProvider>
                    </LibraryProvider>
                </AuthProvider>
            </ToastProvider>
        </ThemeProvider>
    )
