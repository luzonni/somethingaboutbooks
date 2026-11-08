import styled, { keyframes } from "styled-components"
import { FiWifiOff } from "react-icons/fi"
import { Ink, Sand } from "../../assets/Colors"
import { useOnlineStatus } from "../../hooks/useOnlineStatus"

const slideDown = keyframes`
    from { transform: translateY(-100%); }
`

const BannerStyle = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: ${Ink};
    color: ${Sand};
    font-size: 0.9375rem;
    text-align: center;
    animation: ${slideDown} 250ms ease;
    svg {
        flex-shrink: 0;
    }
`

// Sem internet, a biblioteca e as capas já salvas continuam funcionando; só a busca depende da rede.
const OfflineBanner = () => {
    const online = useOnlineStatus()
    if (online) return null
    return (
        <BannerStyle role="status">
            <FiWifiOff aria-hidden="true" />
            Você está sem internet. Sua biblioteca continua disponível, mas a busca de livros precisa de conexão.
        </BannerStyle>
    )
}

export default OfflineBanner
