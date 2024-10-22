import styled from "styled-components"
import { Gray } from "../../assets/Colors"
import { MdError } from "react-icons/md";


const NotFoundStyle = styled.main`
    background-color: ${Gray};
    display: flex;
    flex-direction: column;
    height: 80vh;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    h1 {
        font-size: 5rem;
        color: ${Gray};
    }
    img {
        width: 30%;
        border-radius: 2rem;
    }
`

const NotFound = () => {
    return (
        <NotFoundStyle>
            <MdError size="5rem"/>
            <h1>Error 404</h1>
            <img src="/imgs/cao-robo.jpg" alt="robot dog" />
        </NotFoundStyle>
    )
}

export default NotFound