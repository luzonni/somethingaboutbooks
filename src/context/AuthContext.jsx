import { createContext, useCallback, useContext, useMemo, useState } from "react"
import * as authService from "../services/authService"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => authService.getSessionUser())
    // Saída voluntária (sair ou excluir a conta): páginas protegidas levam ao início, não ao login.
    const [signedOut, setSignedOut] = useState(false)

    const signOut = useCallback(() => {
        setSignedOut(true)
        setUser(null)
    }, [])

    const acknowledgeSignOut = useCallback(() => setSignedOut(false), [])

    const login = useCallback(async (credentials) => {
        const loggedUser = await authService.login(credentials)
        setUser(loggedUser)
        return loggedUser
    }, [])

    const register = useCallback(async (data) => {
        const createdUser = await authService.register(data)
        setUser(createdUser)
        return createdUser
    }, [])

    const logout = useCallback(async () => {
        await authService.logout()
        signOut()
    }, [signOut])

    const updateProfile = useCallback(
        async (changes) => {
            const updatedUser = await authService.updateProfile(user.id, changes)
            setUser(updatedUser)
            return updatedUser
        },
        [user?.id]
    )

    const changePassword = useCallback(
        (currentPassword, newPassword) => authService.changePassword(user.id, currentPassword, newPassword),
        [user?.id]
    )

    const deleteAccount = useCallback(
        async (password) => {
            await authService.deleteAccount(user.id, password)
            signOut()
        },
        [user?.id, signOut]
    )

    const value = useMemo(
        () => ({ user, signedOut, acknowledgeSignOut, login, register, logout, updateProfile, changePassword, deleteAccount }),
        [user, signedOut, acknowledgeSignOut, login, register, logout, updateProfile, changePassword, deleteAccount]
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
