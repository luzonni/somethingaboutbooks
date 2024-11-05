import styled from "styled-components"
import { Black } from "../../assets/Colors"
const HomeStyle = styled.main`
    width: 100%;
    background-color: red;
    h1 {
        color: ${Black};
    }
    .backgroundImage {
        width: 100%;
        height: 20rem;
        background-image: url("imgs/background.jpg");
        background-repeat: no-repeat;
        background-size: cover;
    }
`

const Home = () => {
    return (
        <HomeStyle>
            <div className="backgroundImage"></div>
            
        </HomeStyle>
    )
}

export default Home