import styled from "styled-components"
import { FaSearch } from "react-icons/fa";


const SearchStyle = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    input {
        padding: 0.5rem 1rem;
        background-color: #F0EEE2;
        border: 2px solid #F0EEE2;
        font-size: 2rem;
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
            <input type="text" placeholder="What book do you thinking?"/>
            <button><FaSearch/></button>
        </SearchStyle>
    )
}

export default Search