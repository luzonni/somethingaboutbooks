# 📚 SAB PROJECT (SomethingAboutBooks)
<img width="300" alt="Screen Shot 2024-11-10 at 18 27 25" src="https://github.com/user-attachments/assets/9add98d2-1b72-49ff-838d-cd5a30e8b6f2">

## Projeto de Engenharia de Software desenvolvido pela turma de Ciencia da Computacao da Unima Afya - AL.

---

## 🚀 Como rodar

Requer Node.js 20 ou superior.

```bash
npm install
npm run dev
```

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Inicia o ambiente de desenvolvimento |
| `npm run build` | Gera a versão de produção em `dist/` |
| `npm run preview` | Serve a versão de produção localmente |
| `npm test` | Roda os testes |
| `npm run lint` | Verifica o código com ESLint |

Não é preciso configurar chaves: a API usada é aberta.

Como o site usa rotas no navegador, a hospedagem precisa redirecionar todas as URLs para o `index.html`.

---

## ✨ Funcionalidades

- **Busca de livros** por título, autor ou assunto, com filtro por gênero e URL compartilhável
- **Página do livro** com sinopse, autor, notas e assuntos
- **Estantes**: Lendo, Quero ler e Lido, além de favoritos
- **Listas personalizadas** para organizar os livros
- **Reviews** com nota e comentário
- **Pomodoro** ligado ao livro em leitura, com ciclos, som e tempo acumulado
- **Perfil e conta**: estatísticas, edição de dados, troca de senha e exclusão da conta
- **Layout responsivo**, com navbar para desktop e menu lateral para mobile

---

## 🧱 Arquitetura

| Pasta | Conteúdo |
| --- | --- |
| `src/api` | Cliente da [Open Library](https://openlibrary.org/developers/api), com cache e tratamento de erros |
| `src/services` | Contas, biblioteca e acesso ao `localStorage` |
| `src/context` | Estado global: autenticação, biblioteca e Pomodoro |
| `src/hooks` | Hooks reutilizáveis |
| `src/utils` | Regras puras: validação, timer e formatação de texto |
| `src/components` | Componentes compartilhados |
| `src/pages` | Páginas da aplicação |
| `public/sw.js` | Service worker que guarda as capas no navegador |

### Armazenamento local

Ainda não há back-end: contas, estantes, reviews e sessões ficam no `localStorage` do navegador. Por isso os dados não acompanham o usuário entre aparelhos e as reviews não são compartilhadas com outras pessoas. As senhas são guardadas como hash (PBKDF2), mas isso não substitui uma autenticação real em servidor.

`src/services/authService.js` e `src/services/library.js` concentram esse acesso, para facilitar a troca por um back-end como o Firebase.

---

## 🔍 5H2H

### 1️⃣ What?
- **Site Web Responsivo** focado no compartilhamento e armazenamento de informações sobre livros, funcionando como uma rede social para leitores.

### 2️⃣ Why?
- **Objetivo**: Oferecer aos leitores uma ferramenta para organizar suas listas de leitura de forma personalizada, com recursos para recomendação e descoberta de novos livros.
- **Impacto**: Visa melhorar e criar hábitos de leitura.
- **Justificativa**: Conforme o Doutor Pierluigi Piazzi, a prática da leitura tem diminuído com a modernização. Esse projeto propõe uma solução para enriquecer o hábito cultural e literário.

### 3️⃣ Who?
- **Público-Alvo**: Leitores em geral que querem organizar suas leituras e descobrir novos livros.
- **Equipe Criadora**:
  - 👤 Lucas Zonzini
  - 👤 Caio Renato
  - 👤 Caio Gabriel
  - 👤 Murilo Barros
  - 👤 Francisco

### 4️⃣ Where?
- **Plataforma**: Ambiente Web responsivo (compatível com **iOS**, **Android** e **Desktop**).

### 5️⃣ When?
- **Lançamento Previsto**: Novembro de 2024

---

## 💡 How?

- **Funcionalidades**:
  - Pesquisar livros
  - Criar pastas para organização
  - Compartilhar opiniões com outros usuários (planejado: depende de um back-end)

- **Tecnologias**:
  - **Front-End**: **React** com **Vite**, **React Router** e **styled-components**.
  - **Dados de livros**: **Open Library API**.
  - **Back-End**: planejado com **Firebase**; hoje os dados ficam no navegador.
  - **Testes**: **Vitest** e **Testing Library**.

- **Divisão de Tarefas**:
  - **Front-End**:
    - 👨‍💻 Lucas Zonzini
    - 👨‍💻 Caio Renato
  - **Back-End**:
    - 👨‍💻 Caio Gabriel
    - 👨‍💻 Murilo Barros

### 6️⃣ How Much?
- **Custo**: Gratuito

---

## 👥 Equipe
- 👤 Lucas Zonzini
- 👤 Caio Gabriel
- 👤 Caio Renato
- 👤 Murilo Barros
- 👤 Francisco
