import styled from "styled-components";
import { IoIosStar } from "react-icons/io";
import { Coral, Gray } from "../../assets/Colors";

const MAX_STARS = 5;

const StarsStyle = styled.span`
    position: relative;
    display: inline-flex;
    font-size: ${({ $size }) => $size};
    line-height: 1;
    color: ${Gray};
    vertical-align: middle;
    .stars__fill {
        display: inline-flex;
        color: ${Coral};
        position: absolute;
        top: 0;
        left: 0;
        white-space: nowrap;
        overflow: hidden;
        transition: width 0.3s ease;
    }
    svg {
        flex-shrink: 0;
    }
`

const StarIcons = () => Array.from({ length: MAX_STARS }, (_, index) => <IoIosStar key={index} />)

const Stars = ({ stars = 0, size = "1.5rem" }) => {
    const value = Math.min(Math.max(Number(stars) || 0, 0), MAX_STARS)
    const percentage = (value / MAX_STARS) * 100
    return (
        <StarsStyle $size={size} role="img" aria-label={`${value.toFixed(1)} de ${MAX_STARS} estrelas`}>
            <StarIcons />
            <span className="stars__fill" style={{ width: `${percentage}%` }}>
                <StarIcons />
            </span>
        </StarsStyle>
    )
}

export default Stars
