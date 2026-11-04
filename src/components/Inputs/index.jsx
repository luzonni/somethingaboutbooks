import { useId, useState } from "react"
import styled from "styled-components"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { Black, Danger, DarkGray, DarkRed, White } from "../../assets/Colors"

const InputStyle = styled.div`
    width: 100%;
    display: flex;
    gap: 0.25rem;
    flex-direction: column;
    label {
        color: ${DarkGray};
        font-size: 1rem;
    }

    .done_button {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.75rem 1rem;
        border: none;
        background-color: ${DarkRed};
        color: ${White};
        font-size: 1.125rem;
        border-radius: 8px;
    }

    .done_button:hover:not(:disabled) {
        background-color: #7a0000;
    }

    .done_button:disabled {
        opacity: 0.7;
    }

    .inputText {
        width: 100%;
        border: 1px solid ${DarkGray};
        border-radius: 6px;
        padding: 0.75rem;
        font-size: 1rem;
        color: ${Black};
        background-color: white;
    }

    .inputText[aria-invalid="true"] {
        border-color: ${Danger};
    }

    .password_field {
        position: relative;
    }

    .password_field .inputText {
        padding-right: 3rem;
    }

    .password_toggle {
        position: absolute;
        top: 0;
        right: 0;
        display: flex;
        align-items: center;
        height: 100%;
        padding: 0 0.875rem;
        border: none;
        background: none;
        color: ${DarkGray};
    }

    .input_error {
        color: ${Danger};
        font-size: 0.875rem;
    }

    .linear_content {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }

    input[type="checkbox"] {
        width: 1.25rem;
        height: 1.25rem;
        accent-color: ${DarkRed};
        cursor: pointer;
    }
`

const FieldError = ({ id, message }) =>
    message ? (
        <span id={id} className="input_error" role="alert">
            {message}
        </span>
    ) : null

const useFieldIds = (error) => {
    const id = useId()
    const errorId = `${id}-error`
    return {
        id,
        errorId,
        describedBy: { "aria-invalid": Boolean(error), "aria-describedby": error ? errorId : undefined },
    }
}

export const InputText = ({ label, error, type = "text", ...props }) => {
    const { id, errorId, describedBy } = useFieldIds(error)
    return (
        <InputStyle>
            <label htmlFor={id}>{label}</label>
            <input id={id} className="inputText" type={type} {...describedBy} {...props} />
            <FieldError id={errorId} message={error} />
        </InputStyle>
    )
}

export const InputPassword = ({ label, error, ...props }) => {
    const { id, errorId, describedBy } = useFieldIds(error)
    const [visible, setVisible] = useState(false)
    return (
        <InputStyle>
            <label htmlFor={id}>{label}</label>
            <div className="password_field">
                <input id={id} className="inputText" type={visible ? "text" : "password"} {...describedBy} {...props} />
                <button
                    type="button"
                    className="password_toggle"
                    aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
                    aria-pressed={visible}
                    onClick={() => setVisible(!visible)}
                >
                    {visible ? <FaEyeSlash aria-hidden="true" /> : <FaEye aria-hidden="true" />}
                </button>
            </div>
            <FieldError id={errorId} message={error} />
        </InputStyle>
    )
}

export const InputTextArea = ({ label, error, rows = 4, ...props }) => {
    const { id, errorId, describedBy } = useFieldIds(error)
    return (
        <InputStyle>
            <label htmlFor={id}>{label}</label>
            <textarea id={id} className="inputText" rows={rows} {...describedBy} {...props} />
            <FieldError id={errorId} message={error} />
        </InputStyle>
    )
}

export const InputSelect = ({ label, list_select, error, ...props }) => {
    const { id, errorId, describedBy } = useFieldIds(error)
    return (
        <InputStyle>
            <label htmlFor={id}>{label}</label>
            <select id={id} className="inputText" {...describedBy} {...props}>
                <option value="">Selecione</option>
                {list_select.map((item) => (
                    <option key={item} value={item}>
                        {item}
                    </option>
                ))}
            </select>
            <FieldError id={errorId} message={error} />
        </InputStyle>
    )
}

export const InputDate = (props) => <InputText type="date" {...props} />

export const InputButton = ({ label, icon, type = "submit", ...props }) => (
    <InputStyle>
        <button className="done_button" type={type} {...props}>
            {icon} {label}
        </button>
    </InputStyle>
)

export const InputCheckBox = ({ label, ...props }) => {
    const id = useId()
    return (
        <InputStyle>
            <div className="linear_content">
                <input id={id} type="checkbox" {...props} />
                <label htmlFor={id}>{label}</label>
            </div>
        </InputStyle>
    )
}

export const FormError = ({ message }) =>
    message ? (
        <InputStyle>
            <span className="input_error" role="alert">
                {message}
            </span>
        </InputStyle>
    ) : null
