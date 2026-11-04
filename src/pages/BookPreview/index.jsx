import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaExternalLinkAlt } from "react-icons/fa";
import { getBookDetails } from "../../api/openLibrary";
import BookActions from "../../components/BookActions";
import BookCover from "../../components/BookCover";
import BookReviews from "../../components/BookReviews";
import { ErrorState, Spinner } from "../../components/Feedback";
import Stars from "../../components/Stars";
import { useAsync } from "../../hooks/useAsync";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { formatApiDate, formatLifespan, truncateText } from "../../utils/text";
import styles from "./BookPreview.module.css";

const TABS = [
  { id: "reviews", label: "Reviews" },
  { id: "details", label: "Detalhes" },
  { id: "genres", label: "Gêneros" },
];

const DESCRIPTION_LIMIT = 600;

function Description({ text }) {
  const [expanded, setExpanded] = useState(false);

  if (!text) return <p className={styles.muted}>Este livro ainda não tem sinopse.</p>;

  const isLong = text.length > DESCRIPTION_LIMIT;
  const visible = expanded ? text : truncateText(text, DESCRIPTION_LIMIT);

  return (
    <div className={styles.description}>
      <p>{visible}</p>
      {isLong && (
        <button type="button" className={styles.textButton} onClick={() => setExpanded(!expanded)}>
          {expanded ? "Ler menos" : "Ler mais"}
        </button>
      )}
    </div>
  );
}

function AuthorInfo({ author }) {
  const lifespan = formatLifespan(author.birthDate, author.deathDate);
  return (
    <div className={styles.author}>
      {author.photo && (
        <img src={author.photo} alt={`Foto de ${author.name}`} className={styles.authorPhoto} loading="lazy" />
      )}
      <div>
        <h3>
          <Link to={`/books?q=${encodeURIComponent(author.name)}`}>{author.name}</Link>
        </h3>
        {lifespan && <p className={styles.muted}>{lifespan}</p>}
        <p className={styles.authorBio}>{author.bio || "Biografia não disponível."}</p>
      </div>
    </div>
  );
}

function DetailsTab({ book }) {
  const rows = [
    ["Primeira publicação", formatApiDate(book.firstPublished)],
    ["Lugares", book.places.join(", ")],
    ["Personagens", book.characters.join(", ")],
  ].filter(([, value]) => value);

  return (
    <>
      {rows.length > 0 ? (
        <dl className={styles.detailsList}>
          {rows.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className={styles.muted}>Não há mais detalhes sobre esta obra.</p>
      )}
      <a className={styles.externalLink} href={book.url} target="_blank" rel="noreferrer">
        Ver na Open Library <FaExternalLinkAlt aria-hidden="true" size="0.75em" />
      </a>
    </>
  );
}

function GenresTab({ subjects }) {
  if (subjects.length === 0) return <p className={styles.muted}>Nenhum gênero cadastrado.</p>;
  return (
    <ul className={styles.tags}>
      {subjects.map((subject) => (
        <li key={subject}>
          <Link to={`/books?q=${encodeURIComponent(subject)}`}>{subject}</Link>
        </li>
      ))}
    </ul>
  );
}

function BookPreview() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("reviews");
  const { data: book, error, loading, retry } = useAsync(
    (signal) => getBookDetails(id, { signal }),
    [id]
  );

  useDocumentTitle(book?.title ?? "Livro");

  if (loading) return <Spinner label="Carregando livro" />;
  if (error) {
    return (
      <ErrorState
        message={error.status === 404 ? "Livro não encontrado." : error.message}
        onRetry={error.status === 404 ? undefined : retry}
      />
    );
  }

  const savedBook = { id: book.id, title: book.title, author: book.author, cover: book.coverThumb };

  return (
    <div className={styles.container}>
      <section className={styles.header}>
        <div className={styles.cover}>
          <BookCover src={book.cover} title={book.title} />
        </div>
        <div className={styles.info}>
          <h1>{book.title}</h1>
          <p className={styles.byline}>{book.authors.map((author) => author.name).join(", ") || book.author}</p>
          {book.rating ? (
            <p className={styles.rating}>
              <Stars stars={book.rating} />
              <span>
                {book.rating.toFixed(1)} ({book.ratingCount.toLocaleString("pt-BR")} avaliações)
              </span>
            </p>
          ) : (
            <p className={styles.muted}>Ainda sem avaliações na Open Library.</p>
          )}
          <BookActions book={savedBook} />
          <Description text={book.description} />
        </div>
      </section>

      {book.authors.length > 0 && (
        <section className={styles.section}>
          <h2>Sobre {book.authors.length > 1 ? "os autores" : "o autor"}</h2>
          {book.authors.map((author) => (
            <AuthorInfo key={author.id} author={author} />
          ))}
        </section>
      )}

      <section className={styles.section}>
        <div className={styles.tabs} role="tablist" aria-label="Informações do livro">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              className={activeTab === tab.id ? styles.tabActive : styles.tab}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div role="tabpanel" id={`panel-${activeTab}`} aria-labelledby={`tab-${activeTab}`} className={styles.panel}>
          {activeTab === "reviews" && <BookReviews book={savedBook} />}
          {activeTab === "details" && <DetailsTab book={book} />}
          {activeTab === "genres" && <GenresTab subjects={book.subjects} />}
        </div>
      </section>
    </div>
  );
}

export default BookPreview;
