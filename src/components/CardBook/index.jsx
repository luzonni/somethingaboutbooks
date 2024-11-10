import styled from "styled-components"
import { IoIosStar } from "react-icons/io";

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
        .star-rating {
            position: relative;
            display: inline-block;
            font-size: 24px;
            color: #ccc;
        }
        .stars {
            color: #e36065;
            position: absolute;
            top: 0;
            left: 0;
            white-space: nowrap;
            overflow: hidden;
            width: 100%;
            transition: width 0.3s ease;
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
    const maxStars = 5;
    const starPercentage = (stars / maxStars) * 100;
    return (
        <RowCardBookStyle>
            <img src={thumb} alt={title} />
            <div className="content">
                <h3>{title}</h3>
                <p>{author} - {gener}</p>
                <div className="star-rating">
                    <span className="stars" style={{width:starPercentage}}><IoIosStar/><IoIosStar/><IoIosStar/><IoIosStar/><IoIosStar/></span>
                </div>
            </div>
        </RowCardBookStyle>
    )
}