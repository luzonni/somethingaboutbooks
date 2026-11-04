const APP_NAME = "SAB"

let pageTitle = ""
let prefix = ""

const render = () => {
    const base = pageTitle ? `${pageTitle} | ${APP_NAME}` : APP_NAME
    document.title = prefix ? `${prefix} · ${base}` : base
}

export const setPageTitle = (title) => {
    pageTitle = title
    render()
}

export const setTitlePrefix = (value) => {
    prefix = value
    render()
}
