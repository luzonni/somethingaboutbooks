import styled from "styled-components"
import { ColorFour, ColorTwo } from "../../assets/Colors"
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
    .item__link {
        text-decoration: none;
        font-size: 1.5rem;
        color: ${ColorFour};
    }
`

const MyHeader = () => {
    return (
        <NavegationStyle>
            <LogoStyle>
                <img src="/imgs/logo.png" alt="Logo Site" />
            </LogoStyle>
            <NavStyle>
                <li><NavLink className="item__link" to="/" >Home</NavLink> </li>
                <li><NavLink className="item__link" to="/explorer">Explorer</NavLink></li>
                <li><NavLink className="item__link" to="/mybookcase">My Bookcase</NavLink></li>
                <li><NavLink className="item__link" to="/login">Login</NavLink></li>
            </NavStyle>
        </NavegationStyle>
    )
}

export default MyHeader