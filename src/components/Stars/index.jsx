import styled from "styled-components";
import { IoIosStar } from "react-icons/io";


const StarsStyle = styled.div`
    position: relative;
    display: inline-block;
    font-size: 24px;
    color: #ccc;
    .stars {
        color: #e36065;
        position: absolute;
        top: 0;
        left: 0;
        white-space: nowrap;
        overflow: hidden;
        width: 100%;
        transition: width 0.3s ease;
    }
`

const Stars = ({stars}) => {
    const maxStars = 5;
    const starPercentage = (stars / maxStars) * 100;
    return (
        <StarsStyle>
            <span className="stars" style={{width:starPercentage}}><IoIosStar/><IoIosStar/><IoIosStar/><IoIosStar/><IoIosStar/></span>
        </StarsStyle>
    )
}

export default Stars