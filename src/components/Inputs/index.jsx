import styled from "styled-components"
import { Black, DarkGray, DarkRed, White } from "../../assets/Colors"

const InputStyle = styled.div`
    width: 100%;
    display: flex;
    gap: 0.5rem;
    flex-direction: column;
    label {
        color: ${DarkGray};
        font-size: 1.25rem;
    }

    .done_button {
        padding: 1rem 0.5rem;
        background-color: ${DarkRed};
        color: ${White};
        font-size: 1.25rem;
        border-radius: 8px;
    }

    .date_input {
        padding: 1rem 1rem;
        font-size: 1.25rem;
    }

    .select_input {
        padding: 1rem 1rem;
        font-size: 1.25rem;
    }

    .linear_content {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }

    .inputText {
        border: 1px solid ${DarkGray};
        border-radius: 6px;
        padding: 1rem;
        font-size: 1.25rem;
        color: ${Black};
    }

    input[type="checkbox"] {
        -webkit-appearance: none;
        appearance: none;
        width: 2rem;
        height: 2rem;
        border: 4px solid ${DarkRed};
        border-radius: 4px;
        cursor: pointer;
        position: relative;
    }

    /* Personaliza o preenchimento da checkbox */
    input[type="checkbox"]::before {
        content: '';
        display: block;
        width: 100%;
        height: 100%;
        background-color: ${White}; /* Cor de fundo quando desmarcada */
    }

    /* Estiliza a checkbox quando marcada */
    input[type="checkbox"]:checked::before {
        background-color: ${DarkRed};
    }

    input[type="checkbox"]:checked::after {
        content: '✕'; /* Adiciona o checkmark */
        font-size: 1.5rem;
        color: ${White};
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
`

export const InputText = ({label, handleChange}) => {
    return(
        <InputStyle>
            <label>{label}</label>
            <input className="inputText" type="text" onChange={() => handleChange()} />
        </InputStyle>
    )
}

export const InputPassword = ({label, handleChange}) => {
    return(
        <InputStyle>
            <label>{label}</label>
            <input className="inputText" type="password" onChange={() => handleChange()} />
        </InputStyle>
    )
}

export const InputSelect = ({label, list_select, handleChange}) => {
    return (
        <InputStyle>
            <label>{label}</label>
            <select className="select_input" name="label" id="label">
                <option></option>
                {list_select.map(item => {
                    return (
                        <option value={"item_"+item}>{item}</option>
                    )
                })}
            </select>
        </InputStyle>
    )
}

export const InputDate = ({label, handleChange}) => {
    return (
        <InputStyle>
            <label>{label}</label>
            <input className="date_input" type="date" />
        </InputStyle>
    )
}

export const InputButton = ({label, icon, handleChange}) => {
    return (
        <InputStyle>
            <button className="done_button">{icon} {label}</button>
        </InputStyle>
    )
}

export const InputCheckBox = ({label, handleChange}) => {
    return(
        <InputStyle>
            <div className="linear_content">
                <input className="InputCheckBox" type="checkbox" />
                <label>{label}</label>
            </div>
        </InputStyle>
    )
}