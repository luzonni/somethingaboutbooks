import styled from "styled-components"
import { FiMoon, FiSun } from "react-icons/fi"
import { Black, Surface } from "../../assets/Colors"
import { useTheme } from "../../context/ThemeContext"

const ToggleStyle = styled.button`
    position: relative;
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    overflow: hidden;
    border: none;
    border-radius: 50%;
    background: none;
    color: ${Black};
    font-size: 1.25rem;
    transition: background-color 150ms ease;
    &:hover {
        background-color: ${Surface};
    }
    svg {
        position: absolute;
        transition: transform 400ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 250ms ease;
    }
    .toggle__sun {
        opacity: ${({ $dark }) => ($dark ? 1 : 0)};
        transform: rotate(${({ $dark }) => ($dark ? "0deg" : "-90deg")}) scale(${({ $dark }) => ($dark ? 1 : 0.4)});
    }
    .toggle__moon {
        opacity: ${({ $dark }) => ($dark ? 0 : 1)};
        transform: rotate(${({ $dark }) => ($dark ? "90deg" : "0deg")}) scale(${({ $dark }) => ($dark ? 0.4 : 1)});
    }
`

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme()
    const isDark = theme === "dark"
    return (
        <ToggleStyle
            type="button"
            $dark={isDark}
            aria-label={isDark ? "Usar tema claro" : "Usar tema escuro"}
            title={isDark ? "Tema claro" : "Tema escuro"}
            onClick={toggleTheme}
        >
            <FiSun className="toggle__sun" aria-hidden="true" />
            <FiMoon className="toggle__moon" aria-hidden="true" />
        </ToggleStyle>
    )
}

export default ThemeToggle
