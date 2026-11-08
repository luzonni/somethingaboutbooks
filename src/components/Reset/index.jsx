import { createGlobalStyle } from "styled-components";
import { Black, Coral, Cream, DarkRed } from "../../assets/Colors";

const Reset = createGlobalStyle`

:root {
	font-family: "Roboto", sans-serif;
	font-optical-sizing: auto;
	font-weight: 400;
	font-style: normal;
	color: ${Black};
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

@media (prefers-reduced-motion: reduce) {
	*, *::before, *::after {
		animation-duration: 0.01ms !important;
		animation-iteration-count: 1 !important;
		transition-duration: 0.01ms !important;
	}
}
`

export default Reset
