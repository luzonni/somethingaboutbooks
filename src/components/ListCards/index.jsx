import styled from "styled-components"
import { Link } from "react-router-dom"

const ListCardStyle = styled.section`
    width: 100%;
    padding: 0 10%;
    box-sizing: border-box;
    h1 {
        padding: 2rem 2rem 0 2rem;
        font-weight: bold;
        font-size: 2rem;
    }
    .head {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        align-content: center;
        padding: 0 2rem;
    }
    .link__mais {
        color: gray;
        font-size: 2rem;
    }
    .list {
        display: flex;
        padding: 2rem 0;
        flex-direction: row;
        justify-content: space-around;
        gap: 1rem;
    }
`

const ListCards = ({title, children}) => {
    return (
        <ListCardStyle>
            <div className="head">
                <h1>{title}</h1>
                <Link to={"/books"} className="link__mais" style={{fontSize:"1.5rem"}}>Ver mais</Link>
            </div>
            <div className="list">
                {children}
            </div>
        </ListCardStyle>   
    )
}

export default ListCards