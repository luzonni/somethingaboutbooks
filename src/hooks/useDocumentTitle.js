import { useEffect } from "react"
import { setPageTitle } from "../utils/documentTitle"

export const useDocumentTitle = (title) => {
    useEffect(() => {
        setPageTitle(title)
        return () => setPageTitle("")
    }, [title])
}
