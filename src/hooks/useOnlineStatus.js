import { useEffect, useState } from "react"

export const useOnlineStatus = () => {
    const [online, setOnline] = useState(() => navigator.onLine ?? true)

    useEffect(() => {
        const goOnline = () => setOnline(true)
        const goOffline = () => setOnline(false)
        window.addEventListener("online", goOnline)
        window.addEventListener("offline", goOffline)
        return () => {
            window.removeEventListener("online", goOnline)
            window.removeEventListener("offline", goOffline)
        }
    }, [])

    return online
}
