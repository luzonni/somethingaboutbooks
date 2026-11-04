import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { FormError, InputButton, InputCheckBox, InputPassword, InputText } from "../../components/Inputs"
import { useAuth } from "../../context/AuthContext"
import { hasErrors, validateEmail } from "../../utils/validation"

const Login = () => {
    const { login } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [remember, setRemember] = useState(true)
    const [errors, setErrors] = useState({})
    const [submitting, setSubmitting] = useState(false)

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
            navigate(location.state?.from ?? "/", { replace: true })
        } catch (error) {
            setErrors({ [error.field ?? "form"]: error.message })
            setSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} noValidate>
            <InputText
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="voce@email.com"
                value={email}
                error={errors.email}
                onChange={(event) => setEmail(event.target.value)}
            />
            <InputPassword
                label="Senha"
                autoComplete="current-password"
                placeholder="Sua senha"
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
            <InputButton label={submitting ? "Entrando..." : "Entrar"} disabled={submitting} />
        </form>
    )
}

export default Login
