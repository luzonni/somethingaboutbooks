# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Leitores brasileiros casuais: adultos que leem alguns livros por ano e querem ler mais. Usam o SAB para achar um
livro, decidir o que ler em seguida, marcar o que estão lendo e sentar para ler com o Pomodoro. Uso em celular e
desktop, em português.

Público secundário: professores e colegas da turma de Ciência da Computação (Unima Afya) que avaliam o projeto.

## Product Purpose

Ajudar quem lê pouco a criar o hábito de ler. O SAB junta busca de livros, estantes e um Pomodoro ligado ao livro
em leitura, com meta anual, sequência de dias e tempo acumulado. Sucesso é o leitor voltar para ler, não para
rolar um feed.

## Positioning

Hábito de leitura, não rede social. Diferente de Goodreads e Skoob, o centro do produto é o tempo de leitura
(Pomodoro, sequência, meta, progresso por páginas) ligado ao livro atual; as estantes servem ao hábito. Não há
feed, seguidores nem reviews públicas.

## Operating Context

- Fluxo principal: buscar ou explorar a home → abrir a página do livro → pôr na estante (Lendo, Quero ler, Lido)
  → ler com o Pomodoro e marcar a página atual.
- Dados de livros vêm de APIs abertas (Open Library sempre; Google Books quando há chave). A qualidade dos dados é
  irregular: falta edição brasileira, sinopses em inglês, capas ruins ou ausentes.
- PWA instalável, com modo offline e atalhos de teclado (`?` lista todos).

## Capabilities and Constraints

- Sem back-end: contas, estantes, listas, reviews, sessões e metas ficam no `localStorage` do navegador. Não há
  recuperação de senha nem sincronização entre aparelhos.
- Backup e restauração da biblioteca em JSON.
- Tema claro e escuro; layout responsivo para celular e desktop.
- Todo texto de interface em português do Brasil.
- Textos que citam a fonte dos dados (rodapé, Sobre, Termos, Privacidade, Suporte) precisam continuar verdadeiros
  conforme a fonte ativa.
- **Em aberto:** back-end (Firebase está no roadmap, sem decisão) e se reviews algum dia serão visíveis a outras
  pessoas.

## Brand Commitments

- Nome: Something About Books (SAB). Logos em `docs/assets/logo-light.png` e `docs/assets/logo-dark.png`.
- Voz: direta, acolhedora, em português do Brasil, tratando o leitor por "você".
- Gratuito e de código aberto (repositório no GitHub, licença em `LICENSE`).

## Evidence on Hand

- Projeto de turma, sem usuários reais medidos, depoimentos, imprensa ou números de uso. Não inventar nenhum.
- Relatório de QA e riscos conhecidos em `docs/QA.md`; prioridades em `docs/ROADMAP.md`.
- Lighthouse mobile da home ~98 (medido no projeto).

## Product Principles

1. O hábito vem primeiro: toda tela deve levar de volta à leitura do livro atual.
2. Sem pressão social: nada de feed, curtidas ou comparação com outros leitores.
3. Seus dados são seus: privacidade e transparência sobre onde ficam e para onde vão as buscas.
4. Honestidade sobre dados imperfeitos: limpar o que der e não fingir o que a API não tem.
5. Rápido no celular, mesmo em rede lenta.

## Accessibility & Inclusion

Páginas principais verificadas com axe nos dois temas (e2e). Manter contraste em claro e escuro, navegação por
teclado e celular sem rolagem horizontal.
