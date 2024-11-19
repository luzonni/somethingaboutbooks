import styled from "styled-components"
import { FaSearch } from "react-icons/fa";
import { NavLink } from "react-router-dom";


const SearchStyle = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: row;
    gap: 1rem;
    input {
        padding: 0.5rem 1rem;
        background-color: #F0EEE2;
        border: 2px solid #F0EEE2;
        font-size: 2rem;
        border-radius: 12px;
    }
    button {
        padding: 0.5rem 1rem;
        background-color: #E36065;
        border: none;
        color: #F0EEE2;
        font-size: 2rem;
    }
    
`

const Search = () => {
    return (
        <SearchStyle>
            <NavLink to="/books">
                <input type="text" placeholder="What book do you thinking?"/>
            </NavLink>
            <button><FaSearch/></button>
        </SearchStyle>
    )
}

export default Search