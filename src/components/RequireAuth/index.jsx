import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const RequireAuth = ({ children }) => {
    const { user } = useAuth()
    const location = useLocation()

    if (!user) return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />

    return children
}

export default RequireAuth
