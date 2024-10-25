import styled from "styled-components";
import { FaUser } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { Black, DarkRed } from "../../../assets/Colors";

const LoginTabStyle = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;

    .img__profile {
        width: 3rem;
        border-radius: 50%;
        border: 4px solid ${DarkRed};
    }

    .icon {
        color: ${DarkRed};
    }
    
    .username {
        font-size: 1.25rem;
        color: ${Black};
    }
    .link {
        font-size: 1.25rem;
        text-decoration: none;
        font-weight: bold;
        color: ${DarkRed};
    }
`

const LoginTab = () => {
    const img = true ? null : "https://media.licdn.com/dms/image/C5603AQHImDsc3u3XBw/profile-displayphoto-shrink_200_200/0/1627577751068?e=2147483647&v=beta&t=EUIf54ZoIz_r87-4EZM4b8TRUbVX_yYtA8aPXYhEiCo"
    const username = true ? null : "Lucas"
    return (
        <LoginTabStyle>
            {img ? 
                <img className="img__profile" src={img} alt="Profile Image"/>
                :
                <FaUser className="icon" size={"2rem"}/>
            }
            {username ?
                <h2 className="username">{username}</h2>
                :
                <NavLink to={"/login"} className="link">Login</NavLink>
            }
        </LoginTabStyle>
    )
}

export default LoginTab