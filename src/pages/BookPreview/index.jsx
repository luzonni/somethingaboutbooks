import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./BookPreview.module.css";

function BookPreview() {
  return (
    <div className={`${styles.container}`}>
      {/* Conteúdo Principal */}
      <main className="my-5">
        {/* Detalhes do Livro */}
        <section className="d-flex align-items-start mb-5">
          <img
            src="https://1.bp.blogspot.com/-wg1tQl6DMtU/XPBwbXQ607I/AAAAAAAAIPM/07cHJP6DZ5Qn2HCveiGmNOMgw4aIBezaQCLcBGAs/s1600/91wNn43pJHL.jpg"
            alt="Capa do Livro"
            className="me-4"
          />
          <div className={`${styles.detalhesLivro}`}>
            <h2 className="fw-bold h3 text-decoration-underline">O Hobbit</h2>
            <p>
              <span className="text-warning">★★★★☆</span> | tags: fantasia
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
              interdum, nulla sit amet dictum hendrerit, ex magna malesuada
              lacus, sed ultricies justo eros eget nisl.
            </p>
            <div className="d-flex gap-2">
            <button className={`btn ${styles.botaoComprar}`}>Comprar</button>
              <button className="btn btn-secondary">Estilo Kindle</button>
              <button className="btn btn-light">Lido</button>
            </div>
          </div>
        </section>
        <hr className="divisor" />
        {/* Informações do Autor */}
        <section className={`${styles.informacaoAutor} d-flex align-items-start mb-5`}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/J._R._R._Tolkien%2C_ca._1925.jpg/220px-J._R._R._Tolkien%2C_ca._1925.jpg"
            alt="Foto do Autor"
            className="me-4"
          />
          <div>
            <h2 className="fw-bold h4 text-decoration-underline">Informação do Autor/a</h2>
            <p>
              John Ronald Reuel Tolkien (1892–1973) foi um renomado escritor,
              professor universitário e filólogo britânico, amplamente
              reconhecido como o pai da alta fantasia moderna.
            </p>
          </div>
        </section>

        {/* Abas */}
        <section>
          <ul className="nav nav-tabs mb-3">
            <li className="nav-item">
              <button className="nav-link active">Reviews</button>
            </li>
            <li className="nav-item">
              <button className="nav-link">Detalhes</button>
            </li>
            <li className="nav-item">
              <button className="nav-link">Gêneros</button>
            </li>
          </ul>
          <div className={`${styles.reviews}`}>
            <h4 className="fw-bold">O Hobbit (1937)</h4>
            <p>★★★★★ | Lido em 14 de outubro de 2024</p>
            <p>
              Eu adorei ler O Hobbit. A história é envolvente desde o começo,
              com Bilbo Bolseiro, um hobbit pacato, sendo inesperadamente
              arrastado para uma grande aventura.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default BookPreview;
