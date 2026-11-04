const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,20}$/

export const MIN_PASSWORD_LENGTH = 8

export const validateEmail = (email) => {
    if (!email.trim()) return "Informe seu email."
    return EMAIL_PATTERN.test(email.trim()) ? "" : "Informe um email válido."
}

export const validateUsername = (username) => {
    if (!username.trim()) return "Informe um nome de usuário."
    return USERNAME_PATTERN.test(username.trim())
        ? ""
        : "Use de 3 a 20 letras, números ou _."
}

export const validatePassword = (password) => {
    if (!password) return "Informe uma senha."
    return password.length >= MIN_PASSWORD_LENGTH
        ? ""
        : `A senha precisa ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`
}

export const validatePasswordMatch = (password, confirmation) =>
    password === confirmation ? "" : "As senhas não são iguais."

export const validateBirthday = (birthday, today = new Date()) => {
    if (!birthday) return ""
    return new Date(`${birthday}T00:00:00`) > today ? "A data não pode estar no futuro." : ""
}

export const hasErrors = (errors) => Object.values(errors).some(Boolean)
