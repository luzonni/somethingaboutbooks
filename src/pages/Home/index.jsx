import styled from "styled-components"
import { ColorFour, ColorOne} from "../../assets/Colors"

const HomeStyle = styled.main`
    background-color: ${ColorOne};
    padding: 3rem;
    h1 {
        color: ${ColorFour};
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