import styled from "styled-components"
import { Link } from "react-router-dom"
import { Black, DarkGray, DarkRed, Gray } from "../../assets/Colors"

const StyleAuth = styled.main`
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: ${({ $reverse }) => ($reverse ? "row-reverse" : "row")};
    .container__input {
        width: 50%;
        display: flex;
        padding: 2rem clamp(1.5rem, 5vw, 4rem);
        align-items: center;
        justify-content: center;
    }
    .container__content {
        width: 100%;
        max-width: 32rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    .auth__logo {
        width: 5rem;
    }
    h1 {
        font-size: clamp(2rem, 4vw, 3rem);
        font-weight: 700;
        line-height: 1.15;
    }
    h2 {
        font-size: 1.25rem;
        color: ${DarkGray};
    }
    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    .form_group {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(13rem, 100%), 1fr));
        gap: 1rem;
    }
    p {
        font-size: 0.9375rem;
        color: ${Black};
    }
    .linkTo {
        color: ${DarkRed};
        font-weight: 700;
    }
    .container__drawing {
        display: flex;
        width: 50%;
        justify-content: center;
        align-items: center;
        background-color: ${Gray};
        overflow: hidden;
    }
    @media (max-width: 860px) {
        .container__input {
            width: 100%;
        }
        .container__drawing {
            display: none;
        }
    }
`

const AuthLayout = ({ title, subtitle, drawing, reverse = false, children }) => (
    <StyleAuth $reverse={reverse}>
        <div className="container__input">
            <div className="container__content">
                <Link to="/" aria-label="Voltar para a página inicial">
                    <img className="auth__logo" src="/imgs/logo.png" alt="SAB" />
                </Link>
                <h1>{title}</h1>
                <h2>{subtitle}</h2>
                {children}
            </div>
        </div>
        <div className="container__drawing" aria-hidden="true">
            {drawing}
        </div>
    </StyleAuth>
)

export default AuthLayout
