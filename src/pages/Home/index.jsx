import styled from "styled-components"
import { White } from "../../assets/Colors"
import Search from "../../components/Search"
import BookSection from "../../components/BookSection"
import { CardBook } from "../../components/CardBook"
import ListCards from "../../components/ListCards"
import { getBooksByGenre, getTrendingBooks } from "../../api/openLibrary"
import { useLibrary } from "../../context/LibraryContext"
import { useDocumentTitle } from "../../hooks/useDocumentTitle"
import { byRecent } from "../../services/library"

const HomeStyle = styled.div`
    width: 100%;
    padding-bottom: 2rem;
    .hero {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 1.5rem;
        min-height: 24rem;
        padding: 2rem 1rem;
        background-image: linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)), url("/imgs/background.jpg");
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
    }
    h1 {
        text-align: center;
        color: ${White};
        font-size: clamp(1.75rem, 5vw, 3rem);
        font-weight: 700;
    }
`

const Home = () => {
    const { entries } = useLibrary()
    const reading = entries.filter((entry) => entry.shelf === "reading").sort(byRecent("updatedAt"))

    useDocumentTitle("")

    return (
        <HomeStyle>
            <div className="hero">
                <h1>Encontre a sua próxima história!</h1>
                <Search />
            </div>
            {reading.length > 0 && (
                <ListCards title="Continue lendo" moreLink="/readinghistorylist">
                    {reading.map((book) => <CardBook key={book.id} book={book} />)}
                </ListCards>
            )}
            <BookSection
                title="Em alta nesta semana"
                moreLink="/books"
                loader={(signal) => getTrendingBooks({ signal })}
            />
            <BookSection
                title="Mais lidos hoje"
                layout="grid"
                skeletons={3}
                loader={(signal) => getTrendingBooks({ period: "daily", limit: 3, signal })}
            />
            <BookSection
                title="Fantasia"
                moreLink="/books?genero=fantasy"
                loader={(signal) => getBooksByGenre({ genre: "fantasy", signal })}
            />
            <BookSection
                title="Ficção científica"
                moreLink="/books?genero=science_fiction"
                loader={(signal) => getBooksByGenre({ genre: "science_fiction", signal })}
            />
        </HomeStyle>
    )
}

export default Home
