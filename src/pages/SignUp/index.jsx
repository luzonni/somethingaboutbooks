import styled from "styled-components"
import { Black, DarkGray, DarkRed, Gray } from "../../assets/Colors"
import { NavLink } from "react-router-dom"
import { FaTag } from "react-icons/fa6"
import { useState } from "react"
import { InputButton, InputDate, InputPassword, InputSelect, InputText } from "../../components/Inputs"

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
        .linkTo {
            color: ${DarkRed};
            text-transform: uppercase;
        }
        .form_group {
            display: flex;
            gap: 1rem;
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
    const [userName, setUserName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [birthday, setBirthday] = useState("")
    const [gender, setGender] = useState("")

    return (
        <StyleSignUp>
            <div className="container__drawing">
                <span/>
            </div>
            <div className="container__input">
                <h1>Seja bem-vindo!</h1>
                <h3>Preencha suas informações abaixo:</h3>
                <form className="form__login" onSubmit={e => e.preventDefault()}>
                    <div className="form_group">
                        <InputText label={"Username"}/>
                        <InputText label={"Email"}/>
                    </div>
                    <div className="form_group">
                        <InputPassword label={"Senha"}/>
                        <InputPassword label={"Repetir senha"}/>
                    </div>
                    <InputDate label={"Nascimento"} />
                    <InputSelect label={"sexo"} list_select={["Masculino", "Feminino", "Helicopiteru"]} />
                    <InputButton label={"Cadastrar"} icon={<FaTag/>}/>
                </form>
                <p>Já possui cadastro? <NavLink className="linkTo" to="/login">Entre</NavLink></p>
            </div>
        </StyleSignUp>
    )
}

export default SignUp