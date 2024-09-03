import styled from "styled-components"
import { ColorTwo } from "../../assets/Colors"
import { NavLink } from "react-router-dom"

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

const NavStyle = styled.ul`
    display: flex;
    gap: 1rem;
    align-items: center;
`

const MyHeader = () => {
    return (
        <NavegationStyle>
            <LogoStyle>
                <img src="/imgs/logo.png" alt="Logo Site" />
            </LogoStyle>
            <NavStyle>
                <li><NavLink to="/" >Home</NavLink> </li>
                <li><NavLink to="/explorer">Explorer</NavLink></li>
                <li><NavLink to="/mybookcase">My Bookcase</NavLink></li>
                <li><NavLink to="/login">Login</NavLink></li>
            </NavStyle>
        </NavegationStyle>
    )
}

export default MyHeader