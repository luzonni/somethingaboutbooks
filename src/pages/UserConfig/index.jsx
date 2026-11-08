import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FormError,
    InputDate,
    InputPassword,
    InputSelect,
    InputText,
    InputTextArea,
} from "../../components/Inputs";
import { useAuth } from "../../context/AuthContext";
import { useLibrary } from "../../context/LibraryContext";
import { useToast } from "../../context/ToastContext";
import { backupFileName, backupSummary, createBackup, parseBackup } from "../../services/backup";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { clearLibrary } from "../../services/library";
import { GENDER_OPTIONS } from "../../utils/profile";
import {
    hasErrors,
    validateBirthday,
    validateEmail,
    validatePassword,
    validatePasswordMatch,
    validateUsername,
} from "../../utils/validation";
import styles from "./UserConfig.module.css";

const profileFields = ({ username, email, bio, location, birthday, gender }) => ({
    username,
    email,
    bio,
    location,
    birthday,
    gender,
});

function ProfileForm() {
    const { user, updateProfile } = useAuth();
    const saved = profileFields(user);
    const [form, setForm] = useState(saved);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState("");

    const isDirty = Object.keys(saved).some((key) => saved[key] !== form[key]);

    const field = (name) => ({
        value: form[name],
        error: errors[name],
        onChange: (event) => {
            setSuccess("");
            setForm({ ...form, [name]: event.target.value });
        },
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSuccess("");
        const nextErrors = {
            username: validateUsername(form.username),
            email: validateEmail(form.email),
            birthday: validateBirthday(form.birthday),
        };
        setErrors(nextErrors);
        if (hasErrors(nextErrors)) return;

        try {
            await updateProfile({
                ...form,
                username: form.username.trim(),
                email: form.email.trim().toLowerCase(),
            });
            setSuccess("Informações salvas.");
        } catch (error) {
            setErrors({ [error.field ?? "form"]: error.message });
        }
    };

    const undo = () => {
        setForm(saved);
        setErrors({});
        setSuccess("");
    };

    return (
        <form className={styles.card} onSubmit={handleSubmit} noValidate>
            <h2 className={styles.sectionTitle}>Informações públicas</h2>
            <InputText label="Nome de usuário" autoComplete="username" {...field("username")} />
            <InputTextArea label="Descrição do perfil" maxLength={300} {...field("bio")} />
            <InputText label="Local" placeholder="Maceió, Alagoas" {...field("location")} />

            <h2 className={styles.sectionTitle}>Informações privadas</h2>
            <p className={styles.hint}>As outras pessoas não podem ver estas informações.</p>
            <InputText label="Email" type="email" autoComplete="email" {...field("email")} />
            <div className={styles.fieldGroup}>
                <InputDate label="Data de nascimento" {...field("birthday")} />
                <InputSelect label="Gênero" list_select={GENDER_OPTIONS} {...field("gender")} />
            </div>

            <FormError message={errors.form} />
            {success && <p className={styles.success} role="status">{success}</p>}
            <div className={styles.buttonGroup}>
                <button type="button" className={styles.btnUndo} onClick={undo} disabled={!isDirty}>Desfazer</button>
                <button type="submit" className={styles.btnEdit} disabled={!isDirty}>Salvar</button>
            </div>
        </form>
    );
}

const EMPTY_PASSWORD_FORM = { current: "", next: "", confirmation: "" };

function PasswordForm() {
    const { changePassword } = useAuth();
    const [form, setForm] = useState(EMPTY_PASSWORD_FORM);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState("");

    const field = (name) => ({
        value: form[name],
        error: errors[name],
        onChange: (event) => {
            setSuccess("");
            setForm({ ...form, [name]: event.target.value });
        },
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSuccess("");
        const nextErrors = {
            current: form.current ? "" : "Informe sua senha atual.",
            next: validatePassword(form.next),
            confirmation: validatePasswordMatch(form.next, form.confirmation),
        };
        setErrors(nextErrors);
        if (hasErrors(nextErrors)) return;

        try {
            await changePassword(form.current, form.next);
            setForm(EMPTY_PASSWORD_FORM);
            setSuccess("Senha alterada.");
        } catch (error) {
            setErrors({ current: error.message });
        }
    };

    return (
        <form className={styles.card} onSubmit={handleSubmit} noValidate>
            <h2 className={styles.sectionTitle}>Alterar senha</h2>
            <InputPassword label="Senha atual" autoComplete="current-password" {...field("current")} />
            <div className={styles.fieldGroup}>
                <InputPassword label="Nova senha" autoComplete="new-password" {...field("next")} />
                <InputPassword label="Repetir nova senha" autoComplete="new-password" {...field("confirmation")} />
            </div>
            {success && <p className={styles.success} role="status">{success}</p>}
            <div className={styles.buttonGroup}>
                <button type="submit" className={styles.btnEdit}>Alterar senha</button>
            </div>
        </form>
    );
}

function DeleteAccount() {
    const { user, deleteAccount } = useAuth();
    const navigate = useNavigate();
    const [confirming, setConfirming] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        const userId = user.id;
        try {
            await deleteAccount(password);
            clearLibrary(userId);
            navigate("/", { replace: true });
        } catch (failure) {
            setError(failure.message);
        }
    };

    return (
        <section className={styles.card}>
            <h2 className={styles.sectionTitle}>Excluir conta</h2>
            <p className={styles.hint}>Isso apaga sua conta, estantes, listas e reviews deste navegador. Não há como desfazer.</p>
            {confirming ? (
                <form className={styles.deleteForm} onSubmit={handleSubmit} noValidate>
                    <InputPassword
                        label="Confirme sua senha"
                        autoComplete="current-password"
                        value={password}
                        error={error}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                    <div className={styles.buttonGroup}>
                        <button type="button" className={styles.btnUndo} onClick={() => setConfirming(false)}>Cancelar</button>
                        <button type="submit" className={styles.btnDanger}>Excluir definitivamente</button>
                    </div>
                </form>
            ) : (
                <div className={styles.buttonGroup}>
                    <button type="button" className={styles.btnDanger} onClick={() => setConfirming(true)}>Excluir conta</button>
                </div>
            )}
        </section>
    );
}

const describe = ({ books, lists, sessions }) =>
    `${books} ${books === 1 ? "livro" : "livros"}, ${lists} ${lists === 1 ? "lista" : "listas"} e ${sessions} ${sessions === 1 ? "sessão" : "sessões"}`;

function DataBackup() {
    const { user } = useAuth();
    const { library, replaceLibrary } = useLibrary();
    const { notify } = useToast();
    const fileRef = useRef(null);
    const [pending, setPending] = useState(null);
    const [error, setError] = useState("");

    const exportData = () => {
        const blob = new Blob([JSON.stringify(createBackup(library), null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = backupFileName(user.username);
        link.click();
        URL.revokeObjectURL(url);
        notify("Backup baixado");
    };

    const readFile = async (event) => {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (!file) return;
        setError("");
        try {
            setPending(parseBackup(await file.text()));
        } catch (failure) {
            setPending(null);
            setError(failure.message);
        }
    };

    const confirmImport = () => {
        replaceLibrary(pending);
        setPending(null);
        notify("Biblioteca restaurada a partir do backup");
    };

    return (
        <section className={styles.card}>
            <h2 className={styles.sectionTitle}>Seus dados</h2>
            <p className={styles.hint}>
                Sua biblioteca fica só neste navegador. Baixe um backup para guardar ou levar para outro aparelho.
            </p>
            <p>Hoje: {describe(backupSummary(library))}.</p>
            {pending ? (
                <div className={styles.confirmBox} role="alert">
                    <p>
                        Substituir a biblioteca atual pelo backup com {describe(backupSummary(pending))}? O que não estiver no
                        backup será perdido.
                    </p>
                    <div className={styles.buttonGroup}>
                        <button type="button" className={styles.btnUndo} onClick={() => setPending(null)}>Cancelar</button>
                        <button type="button" className={styles.btnEdit} onClick={confirmImport}>Substituir</button>
                    </div>
                </div>
            ) : (
                <div className={styles.buttonGroup}>
                    <button type="button" className={styles.btnUndo} onClick={() => fileRef.current?.click()}>Importar backup</button>
                    <button type="button" className={styles.btnEdit} onClick={exportData}>Exportar backup</button>
                </div>
            )}
            {error && <p className={styles.error} role="alert">{error}</p>}
            <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={readFile} />
        </section>
    );
}

function UserConfig() {
    useDocumentTitle("Configurações");

    return (
        <section className={styles.container}>
            <h1 className={styles.title}>Informações da conta</h1>
            <ProfileForm />
            <PasswordForm />
            <DataBackup />
            <DeleteAccount />
        </section>
    );
}

export default UserConfig;
