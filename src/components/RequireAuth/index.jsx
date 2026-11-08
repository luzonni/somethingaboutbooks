import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const RequireAuth = ({ children }) => {
    const { user, signedOut } = useAuth()
    const location = useLocation()

    // Quem acabou de sair ou excluir a conta vai para o início, não para o login.
    if (!user && signedOut) return <Navigate to="/" replace />
    if (!user) return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />

    return children
}

export default RequireAuth
