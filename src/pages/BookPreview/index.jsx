import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { FaExternalLinkAlt } from "react-icons/fa";
import { getBookExtras, getWork } from "../../api/openLibrary";
import BookActions from "../../components/BookActions";
import BookCover from "../../components/BookCover";
import BookReviews from "../../components/BookReviews";
import { ErrorState, Skeleton, Spinner } from "../../components/Feedback";
import Stars from "../../components/Stars";
import { useLibrary } from "../../context/LibraryContext";
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
const BIO_LIMIT = 400;

function ExpandableText({ text, limit, emptyText }) {
  const [expanded, setExpanded] = useState(false);

  if (!text) return <p className={styles.muted}>{emptyText}</p>;

  return (
    <div className={styles.description}>
      <p>{expanded ? text : truncateText(text, limit)}</p>
      {text.length > limit && (
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
      <div className={styles.authorText}>
        <h3>
          <Link to={`/books?q=${encodeURIComponent(author.name)}`}>{author.name}</Link>
        </h3>
        {lifespan && <p className={styles.muted}>{lifespan}</p>}
        <ExpandableText text={author.bio} limit={BIO_LIMIT} emptyText="Biografia não disponível." />
      </div>
    </div>
  );
}

function DetailsTab({ work }) {
  const rows = [
    ["Primeira publicação", formatApiDate(work.firstPublished)],
    ["Lugares", work.places.join(", ")],
    ["Personagens", work.characters.join(", ")],
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
      <a className={styles.externalLink} href={work.url} target="_blank" rel="noreferrer">
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

const largerCover = (cover = "") => cover.replace("-M.jpg", "-L.jpg");

function BookPreview() {
  const { id } = useParams();
  const location = useLocation();
  const { getEntry } = useLibrary();
  const [activeTab, setActiveTab] = useState("reviews");

  // O card ou a estante já sabem título, autor e capa: a página aparece antes da resposta da API.
  const stateBook = location.state?.book;
  const preview = stateBook?.id === id ? stateBook : getEntry(id);

  const { data: work, error, loading, retry } = useAsync((signal) => getWork(id, { signal }), [id]);
  const { data: extras, loading: loadingExtras } = useAsync(
    (signal) => (work ? getBookExtras(work, { signal }) : Promise.resolve(null)),
    [work]
  );

  const title = preview?.title ?? work?.title;
  const author = preview?.author ?? extras?.author;
  const cover = preview?.cover ? largerCover(preview.cover) : work?.cover;
  const authors = extras?.authors ?? [];

  useDocumentTitle(title ?? "Livro");

  if (error) {
    return (
      <ErrorState
        message={error.status === 404 ? "Livro não encontrado." : error.message}
        onRetry={error.status === 404 ? undefined : retry}
      />
    );
  }
  if (!title) return <Spinner label="Carregando livro" />;

  const savedBook = { id, title, author, cover: preview?.cover ?? work?.coverThumb ?? "" };

  return (
    <div className={styles.container}>
      <section className={styles.header}>
        <div className={styles.cover}>
          <BookCover src={cover} title={title} />
        </div>
        <div className={styles.info}>
          <h1>{title}</h1>
          <p className={styles.byline}>
            {authors.map((item) => item.name).join(", ") || author || <Skeleton as="span" className={styles.skeletonLine} $width="10rem" $height="1.25rem" />}
          </p>
          {extras?.rating ? (
            <p className={styles.rating}>
              <Stars stars={extras.rating} />
              <span>
                {extras.rating.toFixed(1)} ({extras.ratingCount.toLocaleString("pt-BR")} avaliações)
              </span>
            </p>
          ) : loadingExtras ? (
            <Skeleton $width="14rem" $height="1.5rem" />
          ) : (
            <p className={styles.muted}>Ainda sem avaliações na Open Library.</p>
          )}
          {author ? <BookActions book={savedBook} /> : <Skeleton $width="20rem" $height="2.5rem" />}
          {loading ? (
            <Skeleton $height="8rem" />
          ) : (
            <ExpandableText text={work.description} limit={DESCRIPTION_LIMIT} emptyText="Este livro ainda não tem sinopse." />
          )}
        </div>
      </section>

      {(loadingExtras || authors.length > 0) && (
        <section className={styles.section}>
          <h2>Sobre {authors.length > 1 ? "os autores" : "o autor"}</h2>
          {loadingExtras ? (
            <Skeleton $height="6rem" />
          ) : (
            authors.map((item) => <AuthorInfo key={item.id} author={item} />)
          )}
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
          {activeTab === "reviews" && author && <BookReviews book={savedBook} />}
          {activeTab !== "reviews" && !work && <Spinner />}
          {activeTab === "details" && work && <DetailsTab work={work} />}
          {activeTab === "genres" && work && <GenresTab subjects={work.subjects} />}
        </div>
      </section>
    </div>
  );
}

export default BookPreview;
