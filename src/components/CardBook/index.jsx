import styled from "styled-components"
import Stars from "../Stars";
import { NavLink } from "react-router-dom";

const CardBookStyle = styled.section`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 12rem;
    img {
        max-width: 12rem;
        transition: 500ms;
    }
    img:hover {
        transform: scale(1.05);
    }
    h2 {
        text-align: center;
        padding: 0.5rem;
        width: 100%;
        background-color: #F0EEE2;
        font-size: 1.5rem;
    }
    div {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 0.5rem;
        background-color: #E36065;
    }
`

const RowCardBookStyle = styled.div`
    width: 22rem;
    display: flex;
    flex-direction: row;
    img {
        width: 6rem;
        transition: 500ms;
    }
    img:hover {
        transform: scale(1.25);
    }
    .content {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 100%;
        background-color: #F0EEE2;
        padding: 1rem;
        h3 {
            font-weight: bold;
            font-size: 1.5rem;
        }
        p {
            font-weight: 300;
            font-size: 1rem;
        }
    }
`

export const CardBook = ({thumb, title, content, isNew}) => {
    return (
        <CardBookStyle>
            <NavLink to="/bookpreview">
                <img src={thumb} alt={title} />
            </NavLink>
            <h2>{title}</h2>
            { (content || isNew ) ? 
                <div>
                    <p>{content}</p>
                    <span>{isNew ? "NOVO" : ""}</span>
                </div>
                : <></>
            }
        </CardBookStyle>   
    )
}

export const RowCardBook = ({thumb, title, author, gener, stars}) => { 
    return (
        <RowCardBookStyle>
            <NavLink to="/bookpewview">
                <img src={thumb} alt={title} />
            </NavLink>
            <div className="content">
                <h3>{title}</h3>
                <p>{author} - {gener}</p>
                <Stars stars={stars}/>
            </div>
        </RowCardBookStyle>
    )
}