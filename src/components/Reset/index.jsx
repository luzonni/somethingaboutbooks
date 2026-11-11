import { createGlobalStyle } from "styled-components";
import { Black, Coral, Cream, DarkRed } from "../../assets/Colors";

const Reset = createGlobalStyle`

:root {
	--color-surface: #ffffff;
	--color-surface-soft: #faf9f4;
	--color-surface-muted: #f0eee2;
	--color-surface-hover: #e5e2d2;
	--color-border: #d9d5c7;
	--color-border-soft: #ebe8dc;
	--color-text: #292929;
	--color-text-muted: #6b6b6b;
	--color-gray: #dddddd;
	--color-brand: #620000;
	--color-brand-hover: #7a0000;
	--color-link: #620000;
	--color-on-brand: #f5f5f5;
	--color-danger: #b3261e;
	--color-success: #2e7d4f;
	--shadow-soft: rgba(41, 20, 16, 0.05);
	color-scheme: light;

	font-family: "Roboto", sans-serif;
	font-optical-sizing: auto;
	font-weight: 400;
	font-style: normal;
	color: ${Black};
}

:root[data-theme="dark"] {
	--color-surface: #171312;
	--color-surface-soft: #1e1917;
	--color-surface-muted: #2a2321;
	--color-surface-hover: #362d2a;
	--color-border: #3d3431;
	--color-border-soft: #2f2826;
	--color-text: #ece7e2;
	--color-text-muted: #a9a19b;
	--color-gray: #4a4240;
	--color-brand: #c2454b;
	--color-brand-hover: #d4565c;
	--color-link: #f0898d;
	--color-on-brand: #f5f5f5;
	--color-danger: #f2786f;
	--color-success: #5cc48a;
	--shadow-soft: rgba(0, 0, 0, 0.35);
	color-scheme: dark;
}

/* O logo é preto: no tema escuro ele é invertido para continuar visível. */
:root[data-theme="dark"] .logo-adaptive {
	filter: invert(1);
}

body {
	transition: background-color 250ms ease, color 250ms ease;
}

*, *::before, *::after {
	box-sizing: border-box;
}

html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
	margin: 0;
	padding: 0;
	border: 0;
	font-size: 100%;
	font: inherit;
	vertical-align: baseline;
}

article, aside, details, figcaption, figure,
footer, header, hgroup, menu, nav, section {
	display: block;
}

body {
	line-height: 1.5;
	background-color: var(--color-surface);
	overflow-wrap: break-word;
}

img {
	max-width: 100%;
}

button, input, select, textarea {
	font: inherit;
	color: inherit;
}

button {
	cursor: pointer;
}

button:disabled {
	cursor: not-allowed;
}

:focus-visible {
	outline: 3px solid ${Coral};
	outline-offset: 2px;
}

ol, ul {
	list-style: none;
}

blockquote, q {
	quotes: none;
}

blockquote:before, blockquote:after,
q:before, q:after {
	content: '';
	content: none;
}

table {
	border-collapse: collapse;
	border-spacing: 0;
}

::-webkit-scrollbar {
	width: 10px;
	height: 10px;
}

::-webkit-scrollbar-track {
	background: ${Cream};
}

::-webkit-scrollbar-thumb {
	background: ${Coral};
	border: 2px solid ${Cream};
	border-radius: 999px;
}

::-webkit-scrollbar-thumb:hover {
	background: ${DarkRed};
}

::-webkit-scrollbar-corner {
	background: ${Cream};
}

@supports not selector(::-webkit-scrollbar) {
	* {
		scrollbar-color: ${Coral} ${Cream};
		scrollbar-width: thin;
	}
}

/* Rolagem suave da página para links internos e para o "voltar ao topo". Vale só para a janela:
   os carrosséis não usam, porque com o snap o navegador reajusta a posição e o Chrome deixava de medir o LCP.
   A troca de página usa behavior: "instant" no DefaultPage. */
@media (prefers-reduced-motion: no-preference) {
	html {
		scroll-behavior: smooth;
	}
}

@media (prefers-reduced-motion: reduce) {
	*, *::before, *::after {
		animation-duration: 0.01ms !important;
		animation-iteration-count: 1 !important;
		transition-duration: 0.01ms !important;
	}
}
`

export default Reset
