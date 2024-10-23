import styled from "styled-components"
import { DarkGray, DarkRed, White } from "../../../assets/Colors"

const InputBoxSelectorStyle = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-direction: row;
    
    label {
        color: ${DarkGray};
        font-size: 1.25rem;
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

const InputBoxSelector = ({label}) => {
    return(
        <InputBoxSelectorStyle>
            <input className="inputBoxSelector" type="checkbox" />
            <label>{label}</label>
        </InputBoxSelectorStyle>
    )
}

export default InputBoxSelector