import { useEffect, useRef, useState } from "react"
import { CardBook, RowCardBook } from "../CardBook"
import { ErrorState, Skeleton } from "../Feedback"
import ListCards from "../ListCards"
import { useAsync } from "../../hooks/useAsync"

const Placeholders = ({ layout, count }) =>
    Array.from({ length: count }, (_, index) =>
        layout === "grid" ? (
            <Skeleton key={index} $height="9rem" />
        ) : (
            <Skeleton key={index} $ratio="2 / 3" />
        )
    )

const LoadedSection = ({ title, moreLink, loader, layout, skeletons }) => {
    const { data: books, error, loading, retry } = useAsync(loader, [])

    if (error) {
        return (
            <ListCards title={title} layout="grid">
                <ErrorState message={error.message} onRetry={retry} />
            </ListCards>
        )
    }

    const Card = layout === "grid" ? RowCardBook : CardBook

    return (
        <ListCards title={title} moreLink={moreLink} layout={layout}>
            {loading ? (
                <Placeholders layout={layout} count={skeletons} />
            ) : (
                books.map((book) => <Card key={book.id} book={book} />)
            )}
        </ListCards>
    )
}

// Só busca os livros quando a seção está perto de aparecer na tela.
const useNearViewport = () => {
    const ref = useRef(null)
    const [isNear, setIsNear] = useState(() => typeof IntersectionObserver === "undefined")

    useEffect(() => {
        if (isNear || !ref.current) return undefined
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsNear(true)
            },
            { rootMargin: "400px" }
        )
        observer.observe(ref.current)
        return () => observer.disconnect()
    }, [isNear])

    return [ref, isNear]
}

const BookSection = ({ title, moreLink, loader, layout = "carousel", skeletons = 8 }) => {
    const [ref, isNear] = useNearViewport()

    return (
        <div ref={ref}>
            {isNear ? (
                <LoadedSection title={title} moreLink={moreLink} loader={loader} layout={layout} skeletons={skeletons} />
            ) : (
                <ListCards title={title} moreLink={moreLink} layout={layout}>
                    <Placeholders layout={layout} count={skeletons} />
                </ListCards>
            )}
        </div>
    )
}

export default BookSection
