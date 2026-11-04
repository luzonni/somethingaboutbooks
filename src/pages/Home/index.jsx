import styled from "styled-components"
import { Cream, White } from "../../assets/Colors"
import Search from "../../components/Search"
import BookSection from "../../components/BookSection"
import { CardBook } from "../../components/CardBook"
import ListCards from "../../components/ListCards"
import { genreList, topRatedList, trendingList } from "../../api/openLibrary"
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
        gap: 1.25rem;
        min-height: 26rem;
        padding: 3rem 1rem;
        background-color: #1d0f0c;
        background-image:
            radial-gradient(ellipse at center, rgba(29, 8, 6, 0.93) 0%, rgba(29, 8, 6, 0.8) 42%, rgba(29, 8, 6, 0.42) 100%),
            url("/imgs/hero-books.svg");
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
    }
    h1 {
        text-align: center;
        color: ${White};
        font-size: clamp(2rem, 5vw, 3.25rem);
        font-weight: 700;
        line-height: 1.15;
    }
    .hero__subtitle {
        max-width: 36rem;
        margin: 0 auto;
        text-align: center;
        color: ${Cream};
        font-size: clamp(1rem, 2vw, 1.25rem);
        font-weight: 300;
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
                <p className="hero__subtitle">Busque entre milhões de livros, organize suas estantes e crie o hábito de ler.</p>
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
                source={trendingList()}
            />
            <BookSection
                title="Mais bem avaliados"
                layout="grid"
                skeletons={3}
                source={topRatedList()}
            />
            <BookSection
                title="Fantasia"
                moreLink="/books?genero=fantasy"
                source={genreList("fantasy")}
            />
            <BookSection
                title="Ficção científica"
                moreLink="/books?genero=science_fiction"
                source={genreList("science_fiction")}
            />
            <BookSection
                title="Terror"
                moreLink="/books?genero=horror"
                source={genreList("horror")}
            />
        </HomeStyle>
    )
}

export default Home
