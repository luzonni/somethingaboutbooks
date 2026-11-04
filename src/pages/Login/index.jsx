import { useState } from "react"
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom"
import styled, { keyframes } from "styled-components"
import { FaTag } from "react-icons/fa6"
import { DarkRed } from "../../assets/Colors"
import AuthLayout from "../../components/AuthLayout"
import { FormError, InputButton, InputCheckBox, InputPassword, InputText } from "../../components/Inputs"
import { useAuth } from "../../context/AuthContext"
import { useDocumentTitle } from "../../hooks/useDocumentTitle"
import { hasErrors, validateEmail } from "../../utils/validation"

const morph = keyframes`
    0% { transform: rotate(0deg); }
    50% { transform: rotate(180deg); border-radius: 0; }
    100% { transform: rotate(360deg); }
`

const Drawing = styled.span`
    width: 20rem;
    height: 20rem;
    background-color: ${DarkRed};
    border-radius: 50%;
    animation: ${morph} 30s linear infinite;
    box-shadow: 0 0 4rem rgba(0, 0, 0, 0.5);
`

const Login = () => {
    const { user, login } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const redirectTo = location.state?.from ?? "/"

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [remember, setRemember] = useState(true)
    const [errors, setErrors] = useState({})
    const [submitting, setSubmitting] = useState(false)

    useDocumentTitle("Entrar")

    if (user && !submitting) return <Navigate to={redirectTo} replace />

    const handleSubmit = async (event) => {
        event.preventDefault()
        const nextErrors = {
            email: validateEmail(email),
            password: password ? "" : "Informe sua senha.",
        }
        setErrors(nextErrors)
        if (hasErrors(nextErrors)) return

        setSubmitting(true)
        try {
            await login({ email, password, remember })
            navigate(redirectTo, { replace: true })
        } catch (error) {
            setErrors({ [error.field ?? "form"]: error.message })
            setSubmitting(false)
        }
    }

    return (
        <AuthLayout title="Bem-vindo de volta!" subtitle="Coloque suas informações" drawing={<Drawing />}>
            <form onSubmit={handleSubmit} noValidate>
                <InputText
                    label="Email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    error={errors.email}
                    onChange={(event) => setEmail(event.target.value)}
                />
                <InputPassword
                    label="Senha"
                    autoComplete="current-password"
                    value={password}
                    error={errors.password}
                    onChange={(event) => setPassword(event.target.value)}
                />
                <InputCheckBox
                    label="Lembrar de mim"
                    checked={remember}
                    onChange={(event) => setRemember(event.target.checked)}
                />
                <FormError message={errors.form} />
                <InputButton label={submitting ? "Entrando..." : "Entrar"} icon={<FaTag aria-hidden="true" />} disabled={submitting} />
            </form>
            <p>
                Não possui uma conta? <Link className="linkTo" to="/signup" state={location.state}>Cadastre-se</Link>
            </p>
        </AuthLayout>
    )
}

export default Login
