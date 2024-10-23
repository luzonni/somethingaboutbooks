import styled from "styled-components";
import { DarkRed, White } from "../../../assets/Colors";

const InputButtonStyle = styled.div`
    width: 100%;
    button {
        width: 100%;
        background-color: ${DarkRed};
        color: ${White};
        font-size: 1.25rem;
        padding: 1rem 2rem;
        border-radius: 2px;
    }
`

const InputButton = ({label, icon}) => {
    return (
        <InputButtonStyle>
            <button>{icon} {label}</button>
        </InputButtonStyle>
    )
}

export default InputButton