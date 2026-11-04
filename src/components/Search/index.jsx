import { useState } from "react"
import styled from "styled-components"
import { FaSearch } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { Border, Coral, Black, Cream } from "../../assets/Colors"

const SearchStyle = styled.form`
    display: flex;
    width: 100%;
    max-width: 40rem;
    margin: 0 auto;
    input {
        flex: 1;
        min-width: 0;
        padding: 0.75rem 1rem;
        background-color: ${Cream};
        border: 2px solid ${Border};
        border-right: none;
        border-radius: 12px 0 0 12px;
        font-size: 1.125rem;
    }
    button {
        display: flex;
        align-items: center;
        padding: 0 1.25rem;
        background-color: ${Coral};
        border: none;
        border-radius: 0 12px 12px 0;
        color: ${Black};
        font-size: 1.25rem;
    }
    button:hover {
        filter: brightness(0.92);
    }
`

const Search = ({ initialValue = "", extraParams = "" }) => {
    const [value, setValue] = useState(initialValue)
    const navigate = useNavigate()

    const handleSubmit = (event) => {
        event.preventDefault()
        const params = new URLSearchParams(extraParams)
        const query = value.trim()
        if (query) params.set("q", query)
        else params.delete("q")
        const search = params.toString()
        navigate(search ? `/books?${search}` : "/books")
    }

    return (
        <SearchStyle role="search" onSubmit={handleSubmit}>
            <input
                type="search"
                aria-label="Buscar livros"
                placeholder="Título, autor ou assunto"
                value={value}
                onChange={(event) => setValue(event.target.value)}
            />
            <button type="submit" aria-label="Buscar">
                <FaSearch aria-hidden="true" />
            </button>
        </SearchStyle>
    )
}

export default Search
