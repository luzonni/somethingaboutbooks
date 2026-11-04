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

const BookList = ({ title, moreLink, layout, books }) => {
    const Card = layout === "grid" ? RowCardBook : CardBook
    return (
        <ListCards title={title} moreLink={moreLink} layout={layout}>
            {books.map((book) => <Card key={book.id} book={book} />)}
        </ListCards>
    )
}

const FetchedSection = ({ title, moreLink, source, layout, skeletons }) => {
    const { data: books, error, loading, retry } = useAsync((signal) => source.load(signal), [])

    if (error) {
        return (
            <ListCards title={title} layout="grid">
                <ErrorState message={error.message} onRetry={retry} />
            </ListCards>
        )
    }
    if (loading) {
        return (
            <ListCards title={title} moreLink={moreLink} layout={layout}>
                <Placeholders layout={layout} count={skeletons} />
            </ListCards>
        )
    }
    if (books.length === 0) return null
    return <BookList title={title} moreLink={moreLink} layout={layout} books={books} />
}

// Só busca os livros quando a seção está perto de aparecer na tela.
const useNearViewport = (enabled) => {
    const ref = useRef(null)
    const [isNear, setIsNear] = useState(() => !enabled || typeof IntersectionObserver === "undefined")

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

const BookSection = ({ title, moreLink, source, layout = "carousel", skeletons = 8 }) => {
    // Listas já guardadas aparecem no primeiro render, sem skeleton.
    const [savedBooks] = useState(() => source.peek())
    const [ref, isNear] = useNearViewport(!savedBooks)

    return (
        <div ref={ref}>
            {savedBooks ? (
                <BookList title={title} moreLink={moreLink} layout={layout} books={savedBooks} />
            ) : isNear ? (
                <FetchedSection title={title} moreLink={moreLink} source={source} layout={layout} skeletons={skeletons} />
            ) : (
                <ListCards title={title} moreLink={moreLink} layout={layout}>
                    <Placeholders layout={layout} count={skeletons} />
                </ListCards>
            )}
        </div>
    )
}

export default BookSection
