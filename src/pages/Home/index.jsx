import styled from "styled-components"
import { Black } from "../../assets/Colors"
import Search from "../../components/Search"
import ListCards from "../../components/ListCards"
import { CardBook, RowCardBook } from "../../components/CardBook"
import books from "../../assets/books.json"
import { NavLink } from "react-router-dom"

const HomeStyle = styled.main`
    width: 100%;
    h1 {
        color: ${Black};
    }
    .title {
        text-align: center;
        font-size: 3rem;
        padding: 2rem;
    }
    .backgroundImage {
        width: 100%;
        height: 20rem;
        background-image: url("imgs/background.jpg");
        background-repeat: no-repeat;
        background-size: cover;
    }
`

const Home = () => {
    return (
        <HomeStyle>
            <div className="backgroundImage"></div>
            <h1 className="title">Encontre o sua proxima historia!</h1>
            <NavLink to="/books">
                <Search/>
            </NavLink>
            <ListCards title="Ultimas atualizações">
                {books.map((card, index) => {
                    return <CardBook key={index} {...card}/>
                })}
            </ListCards>
            <ListCards title="Mais Vistos">
                {books.filter((book, index) => index < 3).map((card, index) => {
                    return <RowCardBook key={index} {...card}/>
                })}
            </ListCards>
            <ListCards title="Concluidos"> 
                {books.map((book, index) => {
                    return <CardBook key={index} {...book}/>
                })}
            </ListCards>
        </HomeStyle>
    )
}

export default Home