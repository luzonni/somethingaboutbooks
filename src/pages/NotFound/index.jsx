import styled from "styled-components"
import { Link } from "react-router-dom"
import { Black, DarkRed, White } from "../../assets/Colors"
import { useDocumentTitle } from "../../hooks/useDocumentTitle"
import { asset } from "../../utils/asset"

const NotFoundStyle = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    width: 100%;
    min-height: 70vh;
    padding: 2rem 1rem;
    text-align: center;
    h1 {
        font-size: clamp(2rem, 6vw, 3.5rem);
        font-weight: 700;
        color: ${Black};
    }
    img {
        width: min(24rem, 80%);
        border-radius: 1.5rem;
    }
    a {
        padding: 0.6rem 1.5rem;
        border-radius: 8px;
        background-color: ${DarkRed};
        color: ${White};
        font-weight: 500;
        text-decoration: none;
    }
`

const NotFound = () => {
    useDocumentTitle("Página não encontrada")
    return (
        <NotFoundStyle>
            <h1>Página não encontrada</h1>
            <img src={asset("/imgs/cao-robo.jpg")} alt="Cão-robô" />
            <p>O endereço que você abriu não existe ou mudou de lugar.</p>
            <Link to="/">Voltar para o início</Link>
        </NotFoundStyle>
    )
}

export default NotFound
