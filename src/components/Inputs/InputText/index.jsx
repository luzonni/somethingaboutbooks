import styled from "styled-components"
import { Black, DarkGray, Gray } from "../../../assets/Colors"

const InputTextStyle = styled.div`
    display: flex;
    gap: 0.5rem;
    flex-direction: column;
    label {
        color: ${DarkGray};
    }

    .inputText {
        border: 1px solid ${DarkGray};
        border-radius: 6px;
        padding: 1rem;
        font-size: 1.25rem;
        color: ${Black};
    }
`

const InputText = ({label}) => {
    return(
        <InputTextStyle>
            <label>{label}</label>
            <input className="inputText" type="text" />
        </InputTextStyle>
    )
}

export default InputText