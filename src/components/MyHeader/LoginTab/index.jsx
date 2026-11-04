import styled from "styled-components";
import { FaUser } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";
import { Black, DarkRed } from "../../../assets/Colors";
import { useAuth } from "../../../context/AuthContext";

const LoginTabStyle = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75rem;

    .icon {
        flex-shrink: 0;
        color: ${DarkRed};
    }

    .username {
        font-size: 1.125rem;
        font-weight: 500;
        color: ${Black};
        text-decoration: none;
        max-width: 10rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .username:hover {
        color: ${DarkRed};
    }

    .link {
        font-size: 1.125rem;
        text-decoration: none;
        font-weight: bold;
        color: ${DarkRed};
    }

    .logout {
        display: flex;
        padding: 0.25rem;
        color: ${DarkRed};
        font-size: 1.5rem;
    }

    @media (max-width: 480px) {
        .username {
            display: none;
        }
    }
`

const LoginTab = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        await logout()
        navigate("/")
    }

    return (
        <LoginTabStyle>
            <FaUser className="icon" size="1.5rem" aria-hidden="true" />
            {user ? (
                <>
                    <NavLink to={`/user/${user.username}`} className="username">{user.username}</NavLink>
                    <button type="button" className="logout" aria-label="Sair" title="Sair" onClick={handleLogout}>
                        <FiLogOut aria-hidden="true" />
                    </button>
                </>
            ) : (
                <NavLink to="/login" className="link">Entrar</NavLink>
            )}
        </LoginTabStyle>
    )
}

export default LoginTab
