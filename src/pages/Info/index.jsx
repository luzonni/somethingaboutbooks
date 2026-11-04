import styled from "styled-components"
import { DarkRed } from "../../assets/Colors"
import { useDocumentTitle } from "../../hooks/useDocumentTitle"

const InfoStyle = styled.article`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    max-width: 44rem;
    margin: 0 auto;
    padding: 2.5rem 1rem 3.5rem;
    h1 {
        font-size: clamp(1.75rem, 4vw, 2.25rem);
        font-weight: 700;
    }
    h2 {
        margin-top: 0.5rem;
        font-size: 1.25rem;
        font-weight: 700;
    }
    a {
        color: ${DarkRed};
        font-weight: 500;
    }
`

const REPOSITORY_URL = "https://github.com/luzonni/somethingaboutbooks"

const PAGES = {
    about: {
        title: "Sobre Nós",
        content: (
            <>
                <p>
                    O SAB (Something About Books) é um projeto de Engenharia de Software da turma de
                    Ciência da Computação da Unima Afya - AL. A ideia é ajudar leitores a organizar suas
                    leituras, descobrir novos livros e criar o hábito de ler.
                </p>
                <p>
                    As informações e capas dos livros vêm da <a href="https://openlibrary.org" target="_blank" rel="noreferrer">Open Library</a>,
                    um catálogo aberto mantido pelo Internet Archive.
                </p>
            </>
        ),
    },
    terms: {
        title: "Termos de Uso",
        content: (
            <>
                <p>O SAB é um projeto acadêmico gratuito, oferecido como está e sem garantia de disponibilidade.</p>
                <h2>Suas reviews</h2>
                <p>Você é responsável pelo que escreve nas suas reviews e listas.</p>
                <h2>Dados dos livros</h2>
                <p>Títulos, sinopses e capas são fornecidos pela Open Library e podem conter erros ou estar incompletos.</p>
            </>
        ),
    },
    privacy: {
        title: "Política de Privacidade",
        content: (
            <>
                <h2>Onde seus dados ficam</h2>
                <p>
                    Sua conta, estantes, listas, reviews e sessões de leitura ficam salvas apenas neste navegador.
                    Nada disso é enviado para um servidor do SAB. Sua senha é guardada como um hash, nunca em texto puro.
                </p>
                <h2>Serviços externos</h2>
                <p>
                    Para mostrar os livros, o navegador faz requisições à Open Library, incluindo os termos que você busca.
                </p>
                <h2>Como apagar seus dados</h2>
                <p>
                    Você pode excluir sua conta em Configurações ou limpar os dados deste site no navegador.
                    Limpar os dados também apaga sua conta, sem possibilidade de recuperação.
                </p>
            </>
        ),
    },
    support: {
        title: "Suporte",
        content: (
            <>
                <p>
                    Encontrou um problema ou tem uma sugestão? Abra uma issue
                    no <a href={`${REPOSITORY_URL}/issues`} target="_blank" rel="noreferrer">repositório do projeto</a>.
                </p>
                <h2>Esqueci minha senha</h2>
                <p>
                    Como as contas ficam apenas neste navegador, não existe recuperação de senha. Nesse caso, será
                    preciso criar uma nova conta.
                </p>
                <h2>Meus livros sumiram</h2>
                <p>Seus dados não acompanham você entre navegadores ou aparelhos, e são apagados ao limpar os dados do site.</p>
            </>
        ),
    },
}

const Info = ({ page }) => {
    const { title, content } = PAGES[page]
    useDocumentTitle(title)
    return (
        <InfoStyle>
            <h1>{title}</h1>
            {content}
        </InfoStyle>
    )
}

export default Info
