import styled from "styled-components"
import { ColorTwo } from "../../assets/Colors"

const NavegationStyle = styled.nav`
    display: flex;
    justify-content: space-between;
    padding: 0 2rem;
    background-color: ${ColorTwo};
`

const LogoStyle = styled.div`
    padding: 1rem;
    img {
        width: 3rem;
    }
`

const MyHeader = () => {
    return (
        <NavegationStyle>
            <LogoStyle>
                <img src="/imgs/logo.png" alt="Logo Site" />
            </LogoStyle>
        </NavegationStyle>
    )
}

export default MyHeader