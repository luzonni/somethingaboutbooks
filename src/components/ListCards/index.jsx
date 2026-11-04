import styled from "styled-components"
import { Link } from "react-router-dom"
import { DarkGray, DarkRed } from "../../assets/Colors"

const ListCardStyle = styled.section`
    width: 100%;
    max-width: 80rem;
    margin: 0 auto;
    padding: 1.5rem 1rem;
    .head {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: 1rem;
        margin-bottom: 1rem;
    }
    h2 {
        font-weight: 700;
        font-size: clamp(1.25rem, 3vw, 1.75rem);
    }
    .link__mais {
        flex-shrink: 0;
        color: ${DarkGray};
        font-size: 1rem;
    }
    .link__mais:hover {
        color: ${DarkRed};
    }
    .list--carousel {
        display: grid;
        grid-auto-flow: column;
        grid-auto-columns: 9.5rem;
        gap: 1rem;
        padding: 0.5rem 0.25rem 1rem;
        overflow-x: auto;
        scroll-snap-type: x proximity;
    }
    .list--carousel > * {
        scroll-snap-align: start;
    }
    .list--grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(min(20rem, 100%), 1fr));
        gap: 1rem;
    }
`

const ListCards = ({ title, moreLink, layout = "carousel", children }) => (
    <ListCardStyle>
        <div className="head">
            <h2>{title}</h2>
            {moreLink && (
                <Link to={moreLink} className="link__mais">
                    Ver mais
                </Link>
            )}
        </div>
        <div className={`list--${layout}`}>{children}</div>
    </ListCardStyle>
)

export default ListCards
