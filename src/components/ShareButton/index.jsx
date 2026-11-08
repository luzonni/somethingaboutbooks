import styled from "styled-components"
import { FiShare2 } from "react-icons/fi"
import { Sand } from "../../assets/Colors"
import { useToast } from "../../context/ToastContext"

const ShareStyle = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.35rem 0.75rem;
    border: 1px solid rgba(255, 255, 255, 0.28);
    border-radius: 999px;
    background: none;
    color: ${Sand};
    font-weight: 500;
    transition: background-color 150ms ease;
    &:hover {
        background-color: rgba(255, 255, 255, 0.12);
    }
`

const copyText = async (text) => {
    if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text)
    throw new Error("Área de transferência indisponível")
}

// Usa o compartilhamento nativo no celular e copia o link no computador.
const ShareButton = ({ title, text }) => {
    const { notify } = useToast()

    const share = async () => {
        const url = window.location.href
        if (navigator.share) {
            try {
                await navigator.share({ title, text, url })
                return
            } catch (error) {
                if (error.name === "AbortError") return
            }
        }
        try {
            await copyText(url)
            notify("Link copiado")
        } catch {
            notify("Não foi possível copiar o link", { tone: "error" })
        }
    }

    return (
        <ShareStyle type="button" onClick={share}>
            <FiShare2 aria-hidden="true" /> Compartilhar
        </ShareStyle>
    )
}

export default ShareButton
