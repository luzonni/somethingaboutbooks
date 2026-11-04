import { Component } from "react"
import { ErrorState } from "../Feedback"

class ErrorBoundary extends Component {
    state = { hasError: false }

    static getDerivedStateFromError() {
        return { hasError: true }
    }

    componentDidCatch(error, info) {
        console.error("Erro ao renderizar a página:", error, info.componentStack)
    }

    render() {
        if (this.state.hasError) {
            return (
                <ErrorState
                    message="Algo deu errado ao abrir esta página."
                    onRetry={() => this.setState({ hasError: false })}
                />
            )
        }
        return this.props.children
    }
}

export default ErrorBoundary
