import styled from "styled-components"
import { Black, DarkGray, DarkRed, Gray } from "../../assets/Colors"
import { FaTag } from "react-icons/fa6"
import { NavLink } from "react-router-dom"
import { InputButton, InputCheckBox, InputText } from "../../components/Inputs"

const StyleLogin = styled.main`
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: row;
    flex-grow: 2;
    .container__input {
        width: 50%;
        display: flex;
        padding: 4rem;
        align-items: start;
        flex-direction: column;
        justify-content: center;
        gap: 1rem;
        h1 {
            font-size: 4rem;
        }
        h3 {
            font-size: 2rem;
            color: ${DarkGray};
        }
        .form__login {
            padding: 0.5rem;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            align-items: start;
        }
        p {
            font-size: 0.75rem;
            color: ${Black};
            font-weight: bold;
        }
        .singup {
            color: ${DarkRed};
            text-transform: uppercase;
        }
    }
    .container__drawing {
        display: flex;
        width: 50%;
        justify-content: center;
        align-content: center;
        align-items: center;
        background-color: ${Gray};
        span {
            width: 20rem;
            height: 20rem;
            background-color: ${DarkRed};
            border-radius: 50%;
            animation: rotate-triangle 30s linear infinite;
            box-shadow: 0 0 4rem RGB(0, 0, 0, 0.5);
        }
    }
    @keyframes rotate-triangle {
        0% {
            transform: rotate(0deg);
        }
        50% {
            transform: rotate(180deg);
            border-radius: 0;
        }
        100%{
            transform: rotate(360deg);
        }
    }
`



const Login = () => {
    return (
        <StyleLogin>
            <div className="container__input" onSubmit={e => e.preventDefault()}>
                <h1>Bem-vindo de volta!</h1>
                <h3>Bem-vindo de volta! Coloque suas informações</h3>
                <form className="form__login" >
                    <InputText label={"Email"}/>
                    <InputText label={"Password"}/>
                    <InputCheckBox label={"Lembrar de mim!"}/>
                    <InputButton label={"Entrar"} icon={<FaTag/>}/>
                </form>
                <p>Não possui uma conta ou cadastro? <NavLink className="singup" to="/signup">Cadastre-se</NavLink></p>
            </div>
            <div className="container__drawing">
                <span></span>
            </div>
        </StyleLogin>
    )
}

export default Login