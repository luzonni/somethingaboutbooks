import { useCallback, useEffect, useState } from "react"

const LOADING = { data: null, error: null, loading: true }

export const useAsync = (loader, deps) => {
    const [state, setState] = useState(LOADING)
    const [attempt, setAttempt] = useState(0)

    useEffect(() => {
        const controller = new AbortController()
        setState(LOADING)
        loader(controller.signal)
            .then((data) => {
                if (!controller.signal.aborted) setState({ data, error: null, loading: false })
            })
            .catch((error) => {
                if (!controller.signal.aborted) setState({ data: null, error, loading: false })
            })
        return () => controller.abort()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps, attempt])

    const retry = useCallback(() => setAttempt((value) => value + 1), [])

    return { ...state, retry }
}
