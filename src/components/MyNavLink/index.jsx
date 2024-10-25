import { NavLink, useLocation } from "react-router-dom";
import styled from "styled-components";
import { Black } from "../../assets/Colors";

const NavLinkStyle = styled.div`
    .link {
        text-decoration: none;
        font-weight: bold;
        font-size: 1.25rem;
        color: ${Black};
    }
`

const MyNavLink = ({children, to}) => {
    const currentPath = useLocation();
    return (
        <NavLinkStyle><NavLink className={`link ${currentPath.pathname === to ? "actived" : ""}`} to={to}>{children}</NavLink></NavLinkStyle>
    )
}

export default MyNavLink