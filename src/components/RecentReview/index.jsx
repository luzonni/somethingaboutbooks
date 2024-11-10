import styled from "styled-components";
import Stars from "../Stars";

const ReviewStyle = styled.section`
    display: flex;
    flex-direction: column;
    .title__main {
        font-size: 2rem;
        padding: 2rem;
    }
    .container {
        display: flex;
        flex-direction: row;
        justify-content: center;
        gap: 3rem;
    }
    .container img {
        width: 20rem;
    }
    .container .contents {
        width: 50%;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        .title__book {
            font-size: 2.5rem;
        }
        .date {
            margin-top: 1rem;
        }
        p {
            margin-top: 2rem;
            background-color: lightgray;
            padding: 2rem;
        }
        .head__book {
            display: flex;
            gap: 1rem;
            align-items: center;
        }
    }
`

const RecentReviws = ({book, date, children}) => {
    return (
        <ReviewStyle>
            <h1 className="title__main">Review mais recente</h1>
            <div className="container">
                <img src={book.thumb} alt={book.title} />
                <div className="contents">
                    <div className="head__book">
                        <h1 className="title__book">{book.title}</h1>
                        <span className="date">Lido em {date}</span>
                    </div>
                    <Stars stars={4.3}/>
                    <p>{children}</p>
                </div>
            </div>
        </ReviewStyle>
    )
}

export default RecentReviws