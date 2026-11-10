import { useEffect, useRef } from "react"
import styled from "styled-components"
import { IoClose } from "react-icons/io5"
import { Black, Border, Cream, DarkGray, Surface } from "../../assets/Colors"

const SHORTCUT_GROUPS = [
    {
        title: "Em qualquer página",
        items: [
            { keys: ["/"], label: "Ir para a busca" },
            { keys: ["?"], label: "Mostrar esta lista de atalhos" },
        ],
    },
    {
        title: "Na busca",
        items: [
            { keys: ["↑", "↓"], label: "Navegar pelas sugestões" },
            { keys: ["Enter"], label: "Buscar ou abrir a sugestão escolhida" },
            { keys: ["Esc"], label: "Fechar as sugestões" },
        ],
    },
    {
        title: "No Pomodoro",
        items: [
            { keys: ["Espaço"], label: "Iniciar ou pausar" },
            { keys: ["R"], label: "Reiniciar a etapa" },
            { keys: ["P"], label: "Pular para a próxima etapa" },
        ],
    },
]

const DialogStyle = styled.dialog`
    width: min(28rem, calc(100vw - 2rem));
    max-height: calc(100vh - 2rem);
    margin: auto;
    padding: 1.5rem;
    background-color: ${Surface};
    border: 1px solid ${Border};
    border-radius: 16px;
    box-shadow: 0 20px 48px rgba(0, 0, 0, 0.35);
    color: ${Black};
    &::backdrop {
        background-color: rgba(0, 0, 0, 0.55);
    }
    header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1rem;
    }
    h2 {
        font-size: 1.25rem;
        font-weight: 700;
    }
    header button {
        display: flex;
        padding: 0.35rem;
        background: none;
        border: none;
        border-radius: 8px;
        color: ${DarkGray};
        font-size: 1.25rem;
        cursor: pointer;
    }
    header button:hover {
        background-color: ${Cream};
        color: ${Black};
    }
    h3 {
        margin: 1rem 0 0.5rem;
        color: ${DarkGray};
        font-size: 0.8125rem;
        font-weight: 500;
        letter-spacing: 0.04em;
        text-transform: uppercase;
    }
    dl > div {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        padding: 0.4rem 0;
        border-bottom: 1px solid ${Border};
    }
    dl > div:last-child {
        border-bottom: none;
    }
    dd {
        display: flex;
        flex-shrink: 0;
        gap: 0.25rem;
    }
    kbd {
        min-width: 1.75rem;
        padding: 0.15rem 0.45rem;
        background-color: ${Cream};
        border: 1px solid ${Border};
        border-bottom-width: 2px;
        border-radius: 6px;
        font-family: inherit;
        font-size: 0.8125rem;
        text-align: center;
    }
`

// O <dialog> nativo já prende o foco dentro do modal e fecha com Esc.
const ShortcutsDialog = ({ open, onClose }) => {
    const ref = useRef(null)

    useEffect(() => {
        const dialog = ref.current
        if (!dialog) return
        if (open && !dialog.open) dialog.showModal()
        if (!open && dialog.open) dialog.close()
    }, [open])

    // Clique no fundo escurecido fecha: o alvo é o próprio <dialog>, não o conteúdo.
    const handleClick = (event) => {
        if (event.target === ref.current) onClose()
    }

    return (
        <DialogStyle ref={ref} aria-labelledby="atalhos-titulo" onClose={onClose} onClick={handleClick}>
            <header>
                <h2 id="atalhos-titulo">Atalhos de teclado</h2>
                <button type="button" onClick={onClose} aria-label="Fechar">
                    <IoClose aria-hidden="true" />
                </button>
            </header>
            {SHORTCUT_GROUPS.map((group) => (
                <section key={group.title}>
                    <h3>{group.title}</h3>
                    <dl>
                        {group.items.map((item) => (
                            <div key={item.label}>
                                <dt>{item.label}</dt>
                                <dd>
                                    {item.keys.map((key) => (
                                        <kbd key={key}>{key}</kbd>
                                    ))}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </section>
            ))}
        </DialogStyle>
    )
}

export default ShortcutsDialog
