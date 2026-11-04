import { CardBook, RowCardBook } from "../CardBook"
import { ErrorState, Skeleton } from "../Feedback"
import ListCards from "../ListCards"
import { useAsync } from "../../hooks/useAsync"

const BookSection = ({ title, moreLink, loader, deps = [], layout = "carousel", skeletons = 8 }) => {
    const { data: books, error, loading, retry } = useAsync(loader, deps)

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
            {loading
                ? Array.from({ length: skeletons }, (_, index) =>
                      layout === "grid" ? (
                          <Skeleton key={index} $height="9rem" />
                      ) : (
                          <Skeleton key={index} $ratio="2 / 3" />
                      )
                  )
                : books.map((book) => <Card key={book.id} book={book} />)}
        </ListCards>
    )
}

export default BookSection
