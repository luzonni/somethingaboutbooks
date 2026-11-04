import styled from "styled-components";
import { Link } from "react-router-dom";
import BookCover from "../BookCover";
import Stars from "../Stars";
import { Black, Cream, DarkGray } from "../../assets/Colors";

const ReviewStyle = styled.article`
    display: grid;
    grid-template-columns: 8rem minmax(0, 1fr);
    gap: 1.5rem;
    @media (max-width: 480px) {
        grid-template-columns: 5rem minmax(0, 1fr);
        gap: 1rem;
    }
    .review__contents {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }
    .review__title {
        font-size: 1.25rem;
        font-weight: 700;
        color: ${Black};
    }
    .review__date {
        color: ${DarkGray};
        font-size: 0.875rem;
    }
    .review__text {
        width: 100%;
        margin-top: 0.5rem;
        padding: 1rem;
        background-color: ${Cream};
        border-radius: 6px;
        white-space: pre-wrap;
    }
`

const RecentReview = ({ book, date, rating, children }) => (
    <ReviewStyle>
        <Link to={`/books/${book.id}`} aria-label={book.title}>
            <BookCover src={book.cover} title={book.title} />
        </Link>
        <div className="review__contents">
            <Link to={`/books/${book.id}`} className="review__title">{book.title}</Link>
            {date && <span className="review__date">{date}</span>}
            {rating ? <Stars stars={rating} /> : null}
            {children && <p className="review__text">{children}</p>}
        </div>
    </ReviewStyle>
)

export default RecentReview
