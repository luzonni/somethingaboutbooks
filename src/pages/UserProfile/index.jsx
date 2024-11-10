import { useParams } from "react-router-dom"
import styled from "styled-components"
import { MdPlace } from "react-icons/md"
import ListCards from "../../components/ListCards"
import books from "../../assets/books.json"
import { CardBook } from "../../components/CardBook"
import RecentReviws from "../../components/RecentReview"

const UserProfileStyle = styled.main`
    background-color: white;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    .profile {
        padding: 1rem;
        display: flex;
        align-items: center;
        gap: 2rem;
        border-radius: 12px;
    }

    .profile__content {
        h1 {
            font-size: 2rem;
        }
        p {
            margin-top: 1rem;
            font-weight: 300;
            font-size: 1.25rem;
        }
    }
    .profile__configs {
        display: flex;
        gap: 1rem;
        button {
            padding: 1rem 2rem;
            border-radius: 12px;
            border: none;
            font-weight: bold;
            font-size: 1.25rem;
            color: #a8a8a8;
        }
    }
    .profile__values {
        margin-left: 4rem;
        display: flex;
        gap: 1rem;
        
    }
    .profile__values__card {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        font-size: 1.25rem;
        padding: 1rem 2rem;
        border-right: 4px solid #a8a8a8;
        h3 {
            font-weight: bold;
        }
        p {
            font-weight: 300;
        }
    }
    .bar {
        padding: 1rem;
        border-radius: 40px;
        -webkit-box-shadow: 0px 0px 84px -22px rgba(0,0,0,0.51);
        -moz-box-shadow: 0px 0px 84px -22px rgba(0,0,0,0.51);
        box-shadow: 0px 0px 84px -22px rgba(0,0,0,0.51);
        display: flex;
        button {
            padding: 1rem 4rem;
            background: none;
            border: none;
            font-size: 1.5rem;
        }
        button:hover {
            background-color: lightgray;
        }
        span {
            width: 4px;
            background-color: lightgray;
        }
    }
`

const UserProfile = () => {
    const params = useParams()
    const username = params.username
    return (
        <UserProfileStyle>
            <div className="profile">
                <img src="/imgs/user.svg" alt="" />
                <div className="profile__content">
                    <h1>{username}</h1>
                    <p><MdPlace/> Maceió, Alagoas</p>
                </div>
                <div className="profile__configs">
                    <button>Editar Perfil</button>
                    <button>...</button>
                </div>
                <div className="profile__values">
                    <div className="profile__values__card">
                        <h3>23</h3>
                        <p>Livros</p>
                    </div>
                    <div className="profile__values__card">
                        <h3>7</h3>
                        <p>Este ano</p>
                    </div>
                    <div className="profile__values__card">
                        <h3>1</h3>
                        <p>Lista</p>
                    </div>
                </div>
            </div>
            <div className="bar">
                <button>Reviews</button>
                <span></span>
                <button>Diario</button>
                <span></span>
                <button>Lista de Desejos</button>
            </div>
            <ListCards title="Favoritos">
                {books.filter((book, index) => index % 3 !== 0).map((book, index) => {
                    return <CardBook key={index} {...book}/>
                })}
            </ListCards>
            <ListCards title="Ultimos Lidos">
                {books.filter((book, index) => index % 3 !== 0).map((book, index) => {
                    return <CardBook key={index} {...book}/>
                })}
            </ListCards>
            <ListCards title="Lista de Desejos">
                {books.filter((book, index) => index % 3 !== 0).map((book, index) => {
                    return <CardBook key={index} {...book}/>
                })}
            </ListCards>
            <RecentReviws book={books[2]} date={"14 de outubro de 2024"}>
                Eu adorei ler O Hobbit. A história é envolvente desde o começo, com Bilbo Bolseiro, um hobbit pacato, sendo inesperadamente arrastado para uma grande aventura ao lado de anões em busca de um tesouro guardado pelo dragão Smaug. A narrativa tem uma mistura perfeita de fantasia, humor e momentos de tensão. A jornada de Bilbo não é apenas física, mas também uma transformação pessoal. Ele vai de um hobbit comum a um verdadeiro herói, o que é muito inspirador. Os cenários descritos por Tolkien são tão detalhados que é fácil se perder no mundo da Terra-média. Além disso, os personagens, especialmente Gandalf e Gollum, são fascinantes. O livro é leve, divertido e cheio de lições sobre coragem, amizade e o valor de sair da zona de conforto.
            </RecentReviws>
        </UserProfileStyle>
    )
}

export default UserProfile