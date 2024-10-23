import styled from "styled-components"
import { Black, DarkGray, DarkRed, Gray } from "../../assets/Colors"
import InputText from "../../components/Inputs/InputText"
import InputBoxSelector from "../../components/Inputs/InputBoxSelector"
import InputButton from "../../components/Inputs/InputButton"
import { NavLink } from "react-router-dom"
import { FaTag } from "react-icons/fa6"

const StyleSignUp = styled.main`
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
            width: 0; 
            height: 0; 
            border-left: 10rem solid RGB(0, 0, 0, 0);
            border-right: 10rem solid RGB(0, 0, 0, 0);
            border-bottom: 17rem solid ${DarkRed};
            filter: drop-shadow(0 0 4rem RGB(0, 0, 0, 0.5));
            animation: rotate-triangle 10s linear infinite;
            transform-origin: 50% 65%;
        }
    }
    @keyframes rotate-triangle {
        0% {
            transform: rotate(0deg);
        }
        50% {
            transform: rotate(180deg);
            border-left: 2rem solid RGB(0, 0, 0, 0);
            border-right: 2rem solid RGB(0, 0, 0, 0);
            border-bottom: 3rem solid ${DarkRed};
        }
        100%{
            transform: rotate(360deg);
        }
    }
`



const SignUp = () => {
    return (
        <StyleSignUp>
            <div className="container__drawing">
                <span></span>
            </div>
            <div className="container__input">
                <h1>Bem-vindo de volta!</h1>
                <h3>Bem-vindo de volta! Coloque suas informações</h3>
                <form className="form__login">
                    <InputText label={"Email"}/>
                    <InputText label={"Password"}/>
                    <InputBoxSelector label={"Lembrar de mim!"}/>
                    <InputButton label={"Entrar"} icon={<FaTag/>}/>
                </form>
                <p>Não possui uma conta ou cadastro? <NavLink className="singup" to="/signup">Cadastre-se</NavLink></p>
            </div>
        </StyleSignUp>
    )
}

export default SignUp