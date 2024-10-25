import { Outlet } from "react-router-dom";
import MyHeader from "../../components/MyHeader";
import MyFooter from "../../components/MyFooter";
import styled from "styled-components";
import { useState } from "react";
import { DarkRed, Gray } from "../../assets/Colors";
import MyNavLink from "../../components/MyNavLink";

const MenuStyled = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
`

const Menu = styled.aside`
    background-color: ${Gray};
    .menu {
        width: 0;
        transition: 120ms;
    }

    .menu.show {
        width: 10rem;
    }

    .menu ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .menu li {
        text-align: center;
        text-decoration: none;
        padding: 1rem;
    }

    .link:hover {
        color: ${DarkRed};
    }

    .actived {
        border-bottom: 3px solid ${DarkRed};
    }

`

const DefaultPage = () => {
    const [menuOpened, setMenuOpened] = useState(false)
    const handleMenu = () => {
        setMenuOpened(!menuOpened)
        console.log("Click")
    }
    return (
        <main>
            <MyHeader handleMenu={handleMenu} isOpen={menuOpened}/>
            <MenuStyled>
                <Menu>
                    <nav className={`menu ${menuOpened ? "show" : ""}`}>
                        <ul>
                            <li><MyNavLink to={"/"}>Home</MyNavLink></li>
                            <li><MyNavLink to={"/profile"}>Perfil</MyNavLink></li>
                            <li><MyNavLink to={"/searcg"}>Procurar</MyNavLink></li>
                            <li><MyNavLink to={"/teste"}>teste</MyNavLink></li>
                        </ul>
                    </nav>
                </Menu>
                <Outlet />
            </MenuStyled>
            <MyFooter/>
        </main>
    )
}

export default DefaultPage