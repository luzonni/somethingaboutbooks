import { useState } from "react"
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom"
import styled, { keyframes } from "styled-components"
import { FaTag } from "react-icons/fa6"
import { DarkRed } from "../../assets/Colors"
import AuthLayout from "../../components/AuthLayout"
import { FormError, InputButton, InputDate, InputPassword, InputSelect, InputText } from "../../components/Inputs"
import { useAuth } from "../../context/AuthContext"
import { useDocumentTitle } from "../../hooks/useDocumentTitle"
import { GENDER_OPTIONS } from "../../utils/profile"
import {
    hasErrors,
    validateBirthday,
    validateEmail,
    validatePassword,
    validatePasswordMatch,
    validateUsername,
} from "../../utils/validation"

const rotate = keyframes`
    0% { transform: rotate(0deg); }
    50% {
        transform: rotate(180deg);
        border-left-width: 2rem;
        border-right-width: 2rem;
        border-bottom-width: 3rem;
    }
    100% { transform: rotate(360deg); }
`

const Drawing = styled.span`
    width: 0;
    height: 0;
    border-left: 10rem solid transparent;
    border-right: 10rem solid transparent;
    border-bottom: 17rem solid ${DarkRed};
    filter: drop-shadow(0 0 4rem rgba(0, 0, 0, 0.5));
    animation: ${rotate} 10s linear infinite;
    transform-origin: 50% 65%;
`

const INITIAL_FORM = { username: "", email: "", password: "", confirmation: "", birthday: "", gender: "" }

const SignUp = () => {
    const { user, register } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const redirectTo = location.state?.from ?? "/"

    const [form, setForm] = useState(INITIAL_FORM)
    const [errors, setErrors] = useState({})
    const [submitting, setSubmitting] = useState(false)

    useDocumentTitle("Cadastro")

    if (user && !submitting) return <Navigate to={redirectTo} replace />

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
            navigate(redirectTo, { replace: true })
        } catch (error) {
            setErrors({ [error.field ?? "form"]: error.message })
            setSubmitting(false)
        }
    }

    return (
        <AuthLayout title="Seja bem-vindo!" subtitle="Preencha suas informações abaixo" drawing={<Drawing />} reverse>
            <form onSubmit={handleSubmit} noValidate>
                <div className="form_group">
                    <InputText label="Nome de usuário" autoComplete="username" {...field("username")} />
                    <InputText label="Email" type="email" autoComplete="email" {...field("email")} />
                </div>
                <div className="form_group">
                    <InputPassword label="Senha" autoComplete="new-password" {...field("password")} />
                    <InputPassword label="Repetir senha" autoComplete="new-password" {...field("confirmation")} />
                </div>
                <div className="form_group">
                    <InputDate label="Nascimento (opcional)" {...field("birthday")} />
                    <InputSelect label="Gênero (opcional)" list_select={GENDER_OPTIONS} {...field("gender")} />
                </div>
                <FormError message={errors.form} />
                <InputButton label={submitting ? "Cadastrando..." : "Cadastrar"} icon={<FaTag aria-hidden="true" />} disabled={submitting} />
            </form>
            <p>
                Já possui cadastro? <Link className="linkTo" to="/login" state={location.state}>Entre</Link>
            </p>
        </AuthLayout>
    )
}

export default SignUp
