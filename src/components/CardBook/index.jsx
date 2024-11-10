import styled from "styled-components"
import Stars from "../Stars";

const CardBookStyle = styled.section`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 12rem;
    img {
        max-width: 12rem;
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
            <img src={thumb} alt={title} />
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
            <img src={thumb} alt={title} />
            <div className="content">
                <h3>{title}</h3>
                <p>{author} - {gener}</p>
                <Stars stars={stars}/>
            </div>
        </RowCardBookStyle>
    )
}