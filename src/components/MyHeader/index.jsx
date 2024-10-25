import styled from "styled-components"
import LoginTab from "./LoginTab"
import { Gray } from "../../assets/Colors"
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";



const NavegationStyle = styled.nav`
    display: flex;
    justify-content: space-between;
    padding: 0 2rem;
    background-color: ${Gray};
    align-items: center;
    button {
        background: none;
        border: none;
    }
`

const LogoStyle = styled.div`
    padding: 0.5rem;
    img {
        width: 6rem;
    }
`

const MyHeader = ({handleMenu, isOpen}) => {
    return (
        <NavegationStyle>
            <button onClick={() => {handleMenu()}}>
                {isOpen ? 
                    <IoMdClose size={"3rem"} />
                    :
                    <GiHamburgerMenu size={"3rem"} />
                }
            </button>
            <LogoStyle>
                <img src="/imgs/logo.png" alt="Logo Site" />
            </LogoStyle>
            <LoginTab/>
        </NavegationStyle>
    )
}

export default MyHeader