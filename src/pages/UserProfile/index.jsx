import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import styled from "styled-components"
import { MdPlace } from "react-icons/md"
import { Border, Cream, DarkGray, DarkRed, White } from "../../assets/Colors"
import { CardBook } from "../../components/CardBook"
import { EmptyState } from "../../components/Feedback"
import ListCards from "../../components/ListCards"
import RecentReview from "../../components/RecentReview"
import { useAuth } from "../../context/AuthContext"
import { useLibrary } from "../../context/LibraryContext"
import { useDocumentTitle } from "../../hooks/useDocumentTitle"
import { findUserByUsername } from "../../services/authService"
import { byRecent, libraryStats, loadLibrary } from "../../services/library"
import { asset } from "../../utils/asset"

const UserProfileStyle = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    width: 100%;
    max-width: 80rem;
    margin: 0 auto;
    padding: 2rem 1rem 3rem;
    .profile {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        gap: 1.5rem;
    }
    .profile__avatar {
        width: 6rem;
        height: 6rem;
    }
    .profile__content {
        max-width: 28rem;
        h1 {
            font-size: 2rem;
            font-weight: 700;
        }
        p {
            margin-top: 0.25rem;
            font-weight: 300;
        }
    }
    .profile__place {
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }
    .profile__edit {
        display: inline-block;
        padding: 0.5rem 1.25rem;
        border-radius: 8px;
        background-color: ${Cream};
        border: 1px solid ${Border};
        color: inherit;
        font-weight: 500;
        text-decoration: none;
    }
    .profile__values {
        display: flex;
        margin: 0;
    }
    .profile__values__card {
        display: flex;
        flex-direction: column-reverse;
        align-items: center;
        padding: 0.25rem 1.5rem;
        border-right: 2px solid ${Border};
        dd {
            font-size: 1.5rem;
            font-weight: 700;
        }
        dt {
            color: ${DarkGray};
            font-weight: 300;
        }
    }
    .profile__values__card:last-child {
        border-right: none;
    }
    .bar {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 0.25rem;
        padding: 0.25rem;
        border-radius: 12px;
        background-color: ${Cream};
        button {
            padding: 0.5rem 1.5rem;
            border: none;
            border-radius: 8px;
            background: none;
            font-size: 1.0625rem;
        }
        button:hover {
            background-color: ${Border};
        }
        button[aria-selected="true"] {
            background-color: ${DarkRed};
            color: ${White};
        }
    }
    .panel {
        width: 100%;
    }
    .reviews {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        width: 100%;
        max-width: 56rem;
        margin: 0 auto;
    }
`

const TABS = [
    { id: "overview", label: "Visão geral" },
    { id: "reviews", label: "Reviews" },
    { id: "want", label: "Lista de desejos" },
]

const BookRow = ({ title, books, emptyText }) => (
    <ListCards title={title}>
        {books.length > 0
            ? books.map((book) => <CardBook key={book.id} book={book} />)
            : <p>{emptyText}</p>}
    </ListCards>
)

const UserProfile = () => {
    const { username } = useParams()
    const { user } = useAuth()
    const { library: ownLibrary } = useLibrary()
    const [activeTab, setActiveTab] = useState("overview")

    const isOwner = user?.username.toLowerCase() === username.toLowerCase()
    const profile = isOwner ? user : findUserByUsername(username)

    useDocumentTitle(profile?.username ?? "Perfil")

    if (!profile) {
        return (
            <EmptyState
                title="Usuário não encontrado"
                description="Os perfis ficam salvos no navegador em que a conta foi criada."
                actionLabel="Voltar para o início"
                actionTo="/"
            />
        )
    }

    const library = isOwner ? ownLibrary : loadLibrary(profile.id)
    const stats = libraryStats(library)
    const entries = Object.values(library.books)
    const favorites = entries.filter((entry) => entry.favorite).sort(byRecent("updatedAt"))
    const lastRead = entries.filter((entry) => entry.shelf === "read").sort(byRecent("finishedAt"))
    const wishlist = entries.filter((entry) => entry.shelf === "want").sort(byRecent("updatedAt"))
    const reviews = entries.filter((entry) => entry.rating).sort(byRecent("reviewedAt"))

    return (
        <UserProfileStyle>
            <div className="profile">
                <img className="profile__avatar" src={asset("/imgs/user.svg")} alt="" />
                <div className="profile__content">
                    <h1>{profile.username}</h1>
                    {profile.location && <p className="profile__place"><MdPlace aria-hidden="true" /> {profile.location}</p>}
                    {profile.bio && <p>{profile.bio}</p>}
                </div>
                {isOwner && <Link className="profile__edit" to="/userconfig">Editar perfil</Link>}
                <dl className="profile__values">
                    <div className="profile__values__card"><dt>Livros</dt><dd>{stats.read}</dd></div>
                    <div className="profile__values__card"><dt>Este ano</dt><dd>{stats.readThisYear}</dd></div>
                    <div className="profile__values__card"><dt>Listas</dt><dd>{stats.lists}</dd></div>
                </dl>
            </div>

            <div className="bar" role="tablist" aria-label="Seções do perfil">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        id={`profile-tab-${tab.id}`}
                        aria-selected={activeTab === tab.id}
                        aria-controls="profile-panel"
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="panel" id="profile-panel" role="tabpanel" aria-labelledby={`profile-tab-${activeTab}`}>
                {activeTab === "overview" && (
                    <>
                        <BookRow title="Favoritos" books={favorites} emptyText="Nenhum favorito ainda." />
                        <BookRow title="Últimos lidos" books={lastRead} emptyText="Nenhuma leitura concluída ainda." />
                    </>
                )}
                {activeTab === "reviews" && (
                    reviews.length > 0 ? (
                        <div className="reviews">
                            {reviews.map((entry) => (
                                <RecentReview
                                    key={entry.id}
                                    book={entry}
                                    rating={entry.rating}
                                    date={`Avaliado em ${new Date(entry.reviewedAt).toLocaleDateString("pt-BR")}`}
                                >
                                    {entry.review}
                                </RecentReview>
                            ))}
                        </div>
                    ) : (
                        <EmptyState title="Nenhuma review ainda" />
                    )
                )}
                {activeTab === "want" && (
                    wishlist.length > 0 ? (
                        <BookRow title="Lista de desejos" books={wishlist} />
                    ) : (
                        <EmptyState title="A lista de desejos está vazia" />
                    )
                )}
            </div>
        </UserProfileStyle>
    )
}

export default UserProfile
