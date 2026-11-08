import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import styles from "./AllBooksPage.module.css";
import { GENRES, SORT_OPTIONS, getTrendingBooks, searchBooks } from "../../api/openLibrary";
import { CardBook } from "../../components/CardBook";
import { EmptyState, ErrorState, Spinner } from "../../components/Feedback";
import Search from "../../components/Search";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { useOnVisible } from "../../hooks/useOnVisible";

const dedupe = (books) => [...new Map(books.map((book) => [book.id, book])).values()];

const genreLink = (query, slug, sort = "") => {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (slug) params.set("genero", slug);
  if (sort) params.set("ordem", sort);
  const search = params.toString();
  return search ? `/books?${search}` : "/books";
};

function Results({ query, genre, sort }) {
  const isBrowsing = !query && !genre;
  const [page, setPage] = useState(1);
  const [attempt, setAttempt] = useState(0);
  const [results, setResults] = useState({ books: [], total: 0, hasMore: false });
  const [status, setStatus] = useState({ loading: true, error: null });

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    setStatus({ loading: true, error: null });

    const load = isBrowsing
      ? getTrendingBooks({ limit: 24, signal }).then((books) => ({
          books,
          total: books.length,
          hasMore: false,
        }))
      : searchBooks({ query, genre, sort, page, signal });

    load
      .then((data) => {
        if (signal.aborted) return;
        setResults((previous) => ({
          ...data,
          books: dedupe([...(page === 1 ? [] : previous.books), ...data.books]),
        }));
        setStatus({ loading: false, error: null });
      })
      .catch((error) => {
        if (!signal.aborted) setStatus({ loading: false, error });
      });

    return () => controller.abort();
  }, [query, genre, sort, page, isBrowsing, attempt]);

  const { books, total, hasMore } = results;
  const { loading, error } = status;
  const canLoadMore = hasMore && !loading && !error;
  const sentinelRef = useOnVisible(() => setPage((value) => value + 1), { enabled: canLoadMore });

  if (!loading && !error && books.length === 0) {
    return (
      <EmptyState
        title="Nenhum livro encontrado"
        description="Confira a ortografia ou tente buscar pelo nome do autor."
      />
    );
  }

  return (
    <>
      <p className={styles.summary} aria-live="polite">
        {isBrowsing
          ? "Em alta nesta semana"
          : books.length > 0 && `${total.toLocaleString("pt-BR")} resultados`}
      </p>

      {books.length > 0 && (
        <div className={styles.grid}>
          {books.map((book) => (
            <CardBook key={book.id} book={book} />
          ))}
        </div>
      )}

      {loading && <Spinner label="Buscando livros" />}
      {error && (
        <ErrorState message={error.message} onRetry={() => setAttempt((value) => value + 1)} />
      )}

      {canLoadMore && (
        <button
          ref={sentinelRef}
          type="button"
          onClick={() => setPage((value) => value + 1)}
          className={styles.loadMoreButton}
        >
          Carregar mais
        </button>
      )}
    </>
  );
}

function AllBooksPage() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") ?? "").trim();
  const genre = searchParams.get("genero") ?? "";
  const sort = searchParams.get("ordem") ?? "";
  const navigate = useNavigate();
  const genreLabel = GENRES.find((item) => item.slug === genre)?.label;

  useDocumentTitle(query ? `Busca: ${query}` : genreLabel ?? "Livros");

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{genreLabel ?? "Livros"}</h1>

      <Search key={query} initialValue={query} extraParams={genreLink("", genre, sort).split("?")[1] ?? ""} />

      <nav className={styles.genres} aria-label="Filtrar por gênero">
        <Link
          to={genreLink(query, "", sort)}
          className={`${styles.genre} ${!genre ? styles.genreActive : ""}`}
          aria-current={!genre ? "true" : undefined}
        >
          Todos
        </Link>
        {GENRES.map((item) => (
          <Link
            key={item.slug}
            to={genreLink(query, item.slug, sort)}
            className={`${styles.genre} ${genre === item.slug ? styles.genreActive : ""}`}
            aria-current={genre === item.slug ? "true" : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {(query || genre) && (
        <label className={styles.sort}>
          <span>Ordenar por</span>
          <select value={sort} onChange={(event) => navigate(genreLink(query, genre, event.target.value), { replace: true })}>
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
      )}

      <Results key={`${query}|${genre}|${sort}`} query={query} genre={genre} sort={sort} />
    </div>
  );
}

export default AllBooksPage;
