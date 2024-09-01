import styled from "styled-components"
import { ColorOne, White } from "../../assets/Colors"

const HomeStyle = styled.main`
    background-color: ${ColorOne};
    width: 100vw;
    height: 100vh;
    h1 {
        color: ${White};
    }
`

const Home = () => {
    return (
        <HomeStyle>
            <h1>Ola! teste</h1>
        </HomeStyle>
    )
}

export default Home