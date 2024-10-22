import styled from "styled-components"
import { Gray } from "../../assets/Colors"

const HomeStyle = styled.main`
    background-color: ${Gray};
    padding: 3rem;
    h1 {
        color: ${Gray};
    }
`

const Home = () => {
    return (
        <HomeStyle>
            <h1>home</h1>
        </HomeStyle>
    )
}

export default Home