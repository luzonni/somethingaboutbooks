import styled from "styled-components"
import { DarkRed, Gray } from "../../assets/Colors"
import InputBoxSelector from "../../components/Inputs/InputBoxSelector"
import InputText from "../../components/Inputs/InputText"

const StyleLogin = styled.main`
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-grow: 2;
    .container__input {
        width: 50%;
        display: flex;
        padding: 4rem;
        align-items: start;
        flex-direction: column;
        justify-content: end;
        gap: 1rem;
        h1 {
            font-size: 4rem;
        }
        h3 {
            font-size: 2rem;
            color: ${Gray};
        }
        .form__login {
            padding: 0.5rem;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            align-items: start;
        }
    }
    .container__drawing {
        display: flex;
        width: 50%;
        justify-content: center;
        align-content: center;
        background-color: ${Gray};
        span {
            width: 20rem;
            height: 20rem;
            background-color: ${DarkRed};
            border-radius: 50%;
            box-shadow: 10px 10px 5px RGB(0, 0, 0, 0.3);
        }
    }
`



const Login = () => {
    return (
        <StyleLogin>
            <div className="container__input">
                <h1>Bem-vindo de volta!</h1>
                <h3>Bem-vindo de volta! Coloque suas informações</h3>
                <form className="form__login">
                    <InputText label={"Email"}/>
                    <InputText label={"Password"}/>
                    <InputBoxSelector label={"Lembrar de mim!"}/>
                </form>
            </div>
            <div className="container__drawing">
                <span></span>
            </div>
        </StyleLogin>
    )
}

export default Login