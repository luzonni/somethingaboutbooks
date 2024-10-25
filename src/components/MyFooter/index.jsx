import styled from "styled-components";
import { Black, Gray, White } from "../../assets/Colors";
import Logo from "/public/imgs/logo.png"

const MyFooterSyle = styled.footer`
    padding: 2rem;
    background-color: ${Black};
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    img {
        width: 5rem;
    }
    .links {
        display: flex;
        flex-direction: row;
        gap: 3rem;
    }
    .link {
        color: ${Gray};
    }
    p {
        color: ${Gray};
    }
`

const MyFooter = () => {
    return (
        <MyFooterSyle>
            <img src={Logo} alt="Logo" />
            <div className="links">
                <a className="link" href="">Sobre Nós</a>
                <a className="link" href="">Termos de Uso</a>
                <a className="link" href="">Política de Privacidade</a>
                <a className="link" href="">Suporte</a>
            </div>
            <p>SAB ©️2024 - Todos os direitos reservados</p>
        </MyFooterSyle>
    )
}

export default MyFooter