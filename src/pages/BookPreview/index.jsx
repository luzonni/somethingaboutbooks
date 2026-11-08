import { useRef, useState } from "react";
import { Link, Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiCalendar, FiExternalLink } from "react-icons/fi";
import { authorBooksList, getBookExtras, getWork, similarBooksList } from "../../api/openLibrary";
import BookActions from "../../components/BookActions";
import BookCover from "../../components/BookCover";
import BookReviews from "../../components/BookReviews";
import BookSection from "../../components/BookSection";
import ExpandableText from "../../components/ExpandableText";
import { ErrorState, Skeleton, Spinner } from "../../components/Feedback";
import Reveal from "../../components/Reveal";
import ShareButton from "../../components/ShareButton";
import Stars from "../../components/Stars";
import { useLibrary } from "../../context/LibraryContext";
import { useAsync } from "../../hooks/useAsync";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { formatApiDate, formatLifespan } from "../../utils/text";
import styles from "./BookPreview.module.css";

const TABS = [
  { id: "reviews", label: "Reviews" },
  { id: "details", label: "Detalhes" },
  { id: "genres", label: "Gêneros" },
];

const HERO_SKELETON = { backgroundColor: "rgba(255, 255, 255, 0.14)" };
const MAX_HERO_TAGS = 3;
const MAX_TAG_LENGTH = 24;

const searchLink = (term) => `/books?q=${encodeURIComponent(term)}`;
const largerCover = (cover = "") => cover.replace("-M.jpg", "-L.jpg");

function Book3D({ cover, lowRes, title }) {
  const bookRef = useRef(null);

  const handlePointerMove = (event) => {
    if (event.pointerType !== "mouse") return;
    const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - left) / width - 0.5;
    const y = (event.clientY - top) / height - 0.5;
    bookRef.current.style.setProperty("--ry", `${-20 + x * 24}deg`);
    bookRef.current.style.setProperty("--rx", `${-y * 12}deg`);
  };

  const handlePointerLeave = () => {
    bookRef.current.style.removeProperty("--ry");
    bookRef.current.style.removeProperty("--rx");
  };

  return (
    <div className={styles.bookStage} onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
      <div className={styles.bookFloat}>
        <div ref={bookRef} className={styles.book}>
          <div className={styles.bookBack} />
          <div className={styles.bookPages} />
          <div className={styles.bookFront}>
            <BookCover src={cover} lowResSrc={lowRes} title={title} />
          </div>
        </div>
      </div>
    </div>
  );
}

function AuthorCard({ author }) {
  const lifespan = formatLifespan(author.birthDate, author.deathDate);
  return (
    <div className={styles.author}>
      <div className={styles.authorHead}>
        {author.photo ? (
          <img src={author.photo} alt={`Foto de ${author.name}`} className={styles.authorPhoto} loading="lazy" />
        ) : (
          <span className={styles.authorInitial} aria-hidden="true">{author.name[0]}</span>
        )}
        <div className={styles.authorName}>
          <h3><Link to={searchLink(author.name)}>{author.name}</Link></h3>
          {lifespan && <p className={styles.muted}>{lifespan}</p>}
        </div>
      </div>
      <div className={styles.authorText}>
        <ExpandableText text={author.bio} emptyText="Biografia não disponível." collapsedHeight="7.5rem" />
      </div>
    </div>
  );
}

function RatingBreakdown({ rating, count, counts }) {
  const highest = Math.max(1, ...Object.values(counts));
  return (
    <div className={styles.breakdown}>
      <div className={styles.breakdownScore}>
        <strong>{rating.toFixed(1)}</strong>
        <Stars stars={rating} size="1.125rem" />
        <span className={styles.muted}>{count.toLocaleString("pt-BR")} avaliações</span>
      </div>
      <ul className={styles.breakdownBars}>
        {[5, 4, 3, 2, 1].map((star, index) => (
          <li key={star}>
            <span>{star}</span>
            <div className={styles.barTrack}>
              <div
                className={styles.barFill}
                style={{ width: `${((counts[star] ?? 0) / highest) * 100}%`, animationDelay: `${index * 90}ms` }}
              />
            </div>
          </li>
        ))}
      </ul>
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
        Ver na Open Library <FiExternalLink aria-hidden="true" />
      </a>
    </>
  );
}

function GenresTab({ subjects }) {
  if (subjects.length === 0) return <p className={styles.muted}>Nenhum gênero cadastrado.</p>;
  return (
    <ul className={styles.tags}>
      {subjects.map((subject, index) => (
        <li key={subject} style={{ animationDelay: `${index * 35}ms` }}>
          <Link to={searchLink(subject)}>{subject}</Link>
        </li>
      ))}
    </ul>
  );
}

function BookPage({ id }) {
  const location = useLocation();
  const navigate = useNavigate();
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
  const thumb = preview?.cover ?? work?.coverThumb;
  const authors = extras?.authors ?? [];
  const firstAuthor = authors[0]?.name ?? (author !== "Autor desconhecido" ? author : "");
  const year = preview?.year ?? work?.firstPublished.match(/\d{4}/)?.[0];
  const heroTags = (work?.subjects ?? []).filter((subject) => subject.length <= MAX_TAG_LENGTH).slice(0, MAX_HERO_TAGS);
  const similar = work ? similarBooksList(work.subjects, id) : null;
  const canGoBack = location.key !== "default";
  const activeIndex = TABS.findIndex((tab) => tab.id === activeTab);

  useDocumentTitle(title ?? "Livro");

  if (error) {
    return (
      <ErrorState
        message={error.status === 404 ? "Livro não encontrado." : error.message}
        onRetry={error.status === 404 ? undefined : retry}
      />
    );
  }
  if (work && work.id !== id) {
    const movedState = stateBook ? { book: { ...stateBook, id: work.id } } : undefined;
    return <Navigate to={`/books/${work.id}`} replace state={movedState} />;
  }
  if (!title) return <Spinner label="Carregando livro" />;

  const savedBook = { id, title, author, cover: thumb ?? "", pages: extras?.pages || preview?.pages || undefined };

  return (
    <article className={styles.page}>
      <header className={styles.hero}>
        {thumb && <div className={styles.heroBackdrop} style={{ backgroundImage: `url("${thumb}")` }} aria-hidden="true" />}
        <div className={styles.heroInner}>
          <div className={styles.heroTop}>
            {canGoBack ? (
              <button type="button" className={styles.backButton} onClick={() => navigate(-1)}>
                <FiArrowLeft aria-hidden="true" /> Voltar
              </button>
            ) : (
              <span />
            )}
            <ShareButton title={title} text={author ? `${title}, de ${author}` : title} />
          </div>
          <div className={styles.heroGrid}>
            <Book3D cover={cover} lowRes={preview?.cover} title={title} />
            <div className={styles.heroInfo}>
              <h1 className={styles.rise}>{title}</h1>
              <p className={`${styles.byline} ${styles.rise}`}>
                {authors.length > 0 ? (
                  authors.map((item, index) => (
                    <span key={item.id}>
                      {index > 0 && ", "}
                      <Link to={searchLink(item.name)}>{item.name}</Link>
                    </span>
                  ))
                ) : author ? (
                  author
                ) : (
                  <Skeleton as="span" style={{ ...HERO_SKELETON, display: "inline-block" }} $width="10rem" $height="1.25rem" />
                )}
              </p>
              <div className={`${styles.heroMeta} ${styles.rise}`}>
                {extras?.rating ? (
                  <span className={styles.heroRating}>
                    <Stars stars={extras.rating} size="1.25rem" />
                    <strong>{extras.rating.toFixed(1)}</strong>
                  </span>
                ) : loadingExtras ? (
                  <Skeleton style={HERO_SKELETON} $width="9rem" $height="1.5rem" />
                ) : null}
                {year && (
                  <span className={styles.heroYear}>
                    <FiCalendar aria-hidden="true" /> {year}
                  </span>
                )}
              </div>
              {heroTags.length > 0 && (
                <ul className={`${styles.heroTags} ${styles.rise}`}>
                  {heroTags.map((tag) => (
                    <li key={tag}><Link to={searchLink(tag)}>{tag}</Link></li>
                  ))}
                </ul>
              )}
              <div className={`${styles.heroActions} ${styles.rise}`}>
                {author ? <BookActions book={savedBook} /> : <Skeleton style={HERO_SKELETON} $width="20rem" $height="2.5rem" />}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className={styles.body}>
        <div className={styles.main}>
          <Reveal className={styles.card}>
            <h2>Sinopse</h2>
            {loading ? (
              <Skeleton $height="8rem" />
            ) : (
              <ExpandableText text={work.description} emptyText="Este livro ainda não tem sinopse." />
            )}
          </Reveal>

          <Reveal className={styles.card} delay={80}>
            <div className={styles.tabs} role="tablist" aria-label="Informações do livro" style={{ "--active": activeIndex }}>
              <span className={styles.tabIndicator} aria-hidden="true" />
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
            <div
              key={activeTab}
              role="tabpanel"
              id={`panel-${activeTab}`}
              aria-labelledby={`tab-${activeTab}`}
              className={styles.panel}
            >
              {activeTab === "reviews" && author && <BookReviews book={savedBook} />}
              {activeTab !== "reviews" && !work && <Spinner />}
              {activeTab === "details" && work && <DetailsTab work={work} />}
              {activeTab === "genres" && work && <GenresTab subjects={work.subjects} />}
            </div>
          </Reveal>
        </div>

        <aside className={styles.aside}>
          {extras?.rating ? (
            <Reveal className={`${styles.card} ${styles.ratingCard}`}>
              <h2>Avaliações</h2>
              <RatingBreakdown rating={extras.rating} count={extras.ratingCount} counts={extras.ratingCounts} />
            </Reveal>
          ) : null}

          {(loadingExtras || authors.length > 0) && (
            <Reveal className={styles.card} delay={80}>
              <h2>Sobre {authors.length > 1 ? "os autores" : "o autor"}</h2>
              {loadingExtras ? (
                <Skeleton $height="6rem" />
              ) : (
                authors.map((item) => <AuthorCard key={item.id} author={item} />)
              )}
            </Reveal>
          )}
        </aside>
      </div>

      {firstAuthor && (
        <BookSection
          key={`author-${firstAuthor}`}
          title={`Mais de ${firstAuthor}`}
          moreLink={searchLink(firstAuthor)}
          source={authorBooksList(firstAuthor, id)}
        />
      )}
      {similar && <BookSection title="Você também pode gostar" source={similar} />}
    </article>
  );
}

function BookPreview() {
  const { id } = useParams();
  return <BookPage key={id} id={id} />;
}

export default BookPreview;
