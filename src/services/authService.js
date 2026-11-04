import { readJson, removeKey, writeJson } from "./storage"

/*
 * Contas locais: os dados ficam apenas neste navegador, sem servidor.
 * Toda a API deste módulo é assíncrona para que um backend real (ex.: Firebase)
 * possa substituí-lo sem mudar quem o consome.
 */

const ACCOUNTS_KEY = "sab:accounts"
const SESSION_KEY = "sab:session"
const PBKDF2_ITERATIONS = 150000

export class AuthError extends Error {
    constructor(message, field = "form") {
        super(message)
        this.name = "AuthError"
        this.field = field
    }
}

const readAccounts = () => readJson(ACCOUNTS_KEY, [])
const writeAccounts = (accounts) => writeJson(ACCOUNTS_KEY, accounts)

const toHex = (bytes) => [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, "0")).join("")
const fromHex = (hex) => Uint8Array.from(hex.match(/.{2}/g), (pair) => parseInt(pair, 16))

const hashPassword = async (password, salt) => {
    if (!crypto?.subtle) {
        throw new AuthError("Este navegador só permite contas em uma conexão segura (HTTPS).")
    }
    const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"])
    const bits = await crypto.subtle.deriveBits(
        { name: "PBKDF2", hash: "SHA-256", salt: fromHex(salt), iterations: PBKDF2_ITERATIONS },
        key,
        256
    )
    return toHex(bits)
}

const createPasswordFields = async (password) => {
    const salt = toHex(crypto.getRandomValues(new Uint8Array(16)))
    return { salt, passwordHash: await hashPassword(password, salt) }
}

const toPublicUser = ({ passwordHash, salt, ...user }) => user

const sameText = (a, b) => a.trim().toLowerCase() === b.trim().toLowerCase()

const assertAvailable = (accounts, { username, email }, ownId) => {
    const others = accounts.filter((account) => account.id !== ownId)
    if (email && others.some((account) => sameText(account.email, email))) {
        throw new AuthError("Este email já está cadastrado.", "email")
    }
    if (username && others.some((account) => sameText(account.username, username))) {
        throw new AuthError("Este nome de usuário já está em uso.", "username")
    }
}

const startSession = (userId, remember) => {
    clearSession()
    writeJson(SESSION_KEY, userId, remember ? localStorage : sessionStorage)
}

const clearSession = () => {
    removeKey(SESSION_KEY)
    removeKey(SESSION_KEY, sessionStorage)
}

export const getSessionUser = () => {
    const userId = readJson(SESSION_KEY, null, sessionStorage) ?? readJson(SESSION_KEY, null)
    const account = readAccounts().find((item) => item.id === userId)
    return account ? toPublicUser(account) : null
}

export const findUserByUsername = (username) => {
    const account = readAccounts().find((item) => sameText(item.username, username))
    return account ? toPublicUser(account) : null
}

export const register = async ({ username, email, password, birthday = "", gender = "" }) => {
    const accounts = readAccounts()
    assertAvailable(accounts, { username, email })

    const account = {
        id: crypto.randomUUID(),
        username: username.trim(),
        email: email.trim().toLowerCase(),
        birthday,
        gender,
        bio: "",
        location: "",
        createdAt: new Date().toISOString(),
        ...(await createPasswordFields(password)),
    }

    writeAccounts([...accounts, account])
    startSession(account.id, true)
    return toPublicUser(account)
}

export const login = async ({ email, password, remember = false }) => {
    const account = readAccounts().find((item) => sameText(item.email, email))
    const invalid = new AuthError("Email ou senha incorretos.")
    if (!account) throw invalid
    if ((await hashPassword(password, account.salt)) !== account.passwordHash) throw invalid

    startSession(account.id, remember)
    return toPublicUser(account)
}

export const logout = async () => clearSession()

export const updateProfile = async (userId, changes) => {
    const accounts = readAccounts()
    assertAvailable(accounts, changes, userId)

    let updated = null
    writeAccounts(
        accounts.map((account) => {
            if (account.id !== userId) return account
            updated = { ...account, ...changes }
            return updated
        })
    )
    if (!updated) throw new AuthError("Conta não encontrada.")
    return toPublicUser(updated)
}

const assertPassword = async (account, password, field = "currentPassword") => {
    if (!account || (await hashPassword(password, account.salt)) !== account.passwordHash) {
        throw new AuthError("Senha atual incorreta.", field)
    }
}

export const changePassword = async (userId, currentPassword, newPassword) => {
    const accounts = readAccounts()
    await assertPassword(accounts.find((item) => item.id === userId), currentPassword)
    const fields = await createPasswordFields(newPassword)
    writeAccounts(accounts.map((item) => (item.id === userId ? { ...item, ...fields } : item)))
}

export const deleteAccount = async (userId, password) => {
    const accounts = readAccounts()
    await assertPassword(accounts.find((item) => item.id === userId), password, "password")
    writeAccounts(accounts.filter((item) => item.id !== userId))
    clearSession()
}
