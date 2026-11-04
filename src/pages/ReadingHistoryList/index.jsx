import { useState } from "react";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { CardBook } from "../../components/CardBook";
import { EmptyState } from "../../components/Feedback";
import { useLibrary } from "../../context/LibraryContext";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { SHELVES, byRecent, libraryStats } from "../../services/library";
import styles from "./ReadingHistoryList.module.css";

const FILTERS = { all: "Todos", ...SHELVES };

const formatDate = (value) => (value ? new Date(value).toLocaleDateString("pt-BR") : "");

const entryDate = (entry) => {
  if (entry.shelf === "read" && entry.finishedAt) return `Concluído em ${formatDate(entry.finishedAt)}`;
  if (entry.shelf === "reading" && entry.startedAt) return `Iniciado em ${formatDate(entry.startedAt)}`;
  return `Adicionado em ${formatDate(entry.addedAt)}`;
};

const formatMinutes = (minutes) => {
  if (minutes < 60) return `${minutes} min`;
  return `${Math.floor(minutes / 60)} h ${minutes % 60} min`;
};

function Lists() {
  const { lists, createList, deleteList, getEntry } = useLibrary();
  const [name, setName] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name.trim()) return;
    createList(name);
    setName("");
  };

  return (
    <section className={styles.section} aria-labelledby="lists-title">
      <h2 id="lists-title" className={styles.subtitle}>Minhas listas</h2>
      <form className={styles.listForm} onSubmit={handleSubmit}>
        <input
          aria-label="Nome da nova lista"
          placeholder="Nome da nova lista"
          maxLength={40}
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <button type="submit" className={styles.primaryButton}>Criar</button>
      </form>

      {lists.length === 0 && (
        <p className={styles.muted}>Crie uma lista e adicione livros a ela pela página de cada livro.</p>
      )}

      {lists.map((list) => {
        const books = list.bookIds.map(getEntry).filter(Boolean);
        return (
          <div key={list.id} className={styles.list}>
            <div className={styles.listHead}>
              <h3>{list.name} <span className={styles.muted}>({books.length})</span></h3>
              <button
                type="button"
                className={styles.iconButton}
                aria-label={`Excluir a lista ${list.name}`}
                onClick={() => deleteList(list.id)}
              >
                <FaTrash aria-hidden="true" />
              </button>
            </div>
            {books.length > 0 ? (
              <div className={styles.listBooks}>
                {books.map((book) => <CardBook key={book.id} book={book} />)}
              </div>
            ) : (
              <p className={styles.muted}>Lista vazia.</p>
            )}
          </div>
        );
      })}
    </section>
  );
}

const ReadingHistoryList = () => {
  const { entries, library, removeBook } = useLibrary();
  const [filter, setFilter] = useState("all");
  const stats = libraryStats(library);

  useDocumentTitle("Minhas leituras");

  const shelved = entries.filter((entry) => entry.shelf);
  const visible = shelved
    .filter((entry) => filter === "all" || entry.shelf === filter)
    .sort(byRecent("updatedAt"));

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>Minhas leituras</h1>

      <dl className={styles.stats}>
        <div><dt>Lidos</dt><dd>{stats.read}</dd></div>
        <div><dt>Neste ano</dt><dd>{stats.readThisYear}</dd></div>
        <div><dt>Tempo de leitura</dt><dd>{formatMinutes(stats.minutes)}</dd></div>
      </dl>

      <div className={styles.filters} role="group" aria-label="Filtrar por estante">
        {Object.entries(FILTERS).map(([key, label]) => (
          <button
            key={key}
            type="button"
            aria-pressed={filter === key}
            className={filter === key ? styles.filterActive : styles.filter}
            onClick={() => setFilter(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState
          title={filter === "all" ? "Sua estante está vazia" : "Nenhum livro nesta estante"}
          description="Busque um livro e escolha em qual estante ele fica."
          actionLabel="Procurar livros"
          actionTo="/books"
        />
      ) : (
        <ul className={styles.readingList}>
          {visible.map((entry) => (
            <li key={entry.id} className={styles.listItem}>
              <Link to={`/books/${entry.id}`} className={styles.itemLink}>
                {entry.cover ? <img src={entry.cover} alt="" loading="lazy" /> : <span className={styles.noCover} />}
                <span>
                  <strong>{entry.title}</strong>
                  <span className={styles.muted}>{entry.author}</span>
                  <span className={styles.muted}>{SHELVES[entry.shelf]} · {entryDate(entry)}</span>
                </span>
              </Link>
              <button
                type="button"
                className={styles.iconButton}
                aria-label={`Remover ${entry.title}`}
                onClick={() => removeBook(entry.id)}
              >
                <FaTrash aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Lists />
    </div>
  );
};

export default ReadingHistoryList;
