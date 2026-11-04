import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { FormError, InputButton, InputDate, InputPassword, InputSelect, InputText } from "../../components/Inputs"
import { useAuth } from "../../context/AuthContext"
import { GENDER_OPTIONS } from "../../utils/profile"
import {
    hasErrors,
    validateBirthday,
    validateEmail,
    validatePassword,
    validatePasswordMatch,
    validateUsername,
} from "../../utils/validation"

const INITIAL_FORM = { username: "", email: "", password: "", confirmation: "", birthday: "", gender: "" }

const SignUp = () => {
    const { register } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const [form, setForm] = useState(INITIAL_FORM)
    const [errors, setErrors] = useState({})
    const [submitting, setSubmitting] = useState(false)

    const field = (name) => ({
        name,
        value: form[name],
        error: errors[name],
        onChange: (event) => setForm({ ...form, [name]: event.target.value }),
    })

    const handleSubmit = async (event) => {
        event.preventDefault()
        const nextErrors = {
            username: validateUsername(form.username),
            email: validateEmail(form.email),
            password: validatePassword(form.password),
            confirmation: validatePasswordMatch(form.password, form.confirmation),
            birthday: validateBirthday(form.birthday),
        }
        setErrors(nextErrors)
        if (hasErrors(nextErrors)) return

        setSubmitting(true)
        try {
            await register(form)
            navigate(location.state?.from ?? "/", { replace: true })
        } catch (error) {
            setErrors({ [error.field ?? "form"]: error.message })
            setSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} noValidate>
            <InputText label="Nome de usuário" autoComplete="username" placeholder="leitor_01" {...field("username")} />
            <InputText label="Email" type="email" autoComplete="email" placeholder="voce@email.com" {...field("email")} />
            <div className="form_group">
                <InputPassword label="Senha" autoComplete="new-password" placeholder="Mín. 8 caracteres" {...field("password")} />
                <InputPassword label="Repetir senha" autoComplete="new-password" placeholder="Digite de novo" {...field("confirmation")} />
            </div>
            <div className="form_group">
                <InputDate label="Nascimento (opcional)" {...field("birthday")} />
                <InputSelect label="Gênero (opcional)" list_select={GENDER_OPTIONS} {...field("gender")} />
            </div>
            <FormError message={errors.form} />
            <InputButton label={submitting ? "Criando conta..." : "Criar conta"} disabled={submitting} />
        </form>
    )
}

export default SignUp
