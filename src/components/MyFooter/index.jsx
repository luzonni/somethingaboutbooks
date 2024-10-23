import styled from "styled-components";
import { Gray } from "../../assets/Colors";

const MyFooterSyle = styled.footer`
    padding: 4rem;
    background-color: ${Gray};
`

const MyFooter = () => {
    return (
        <MyFooterSyle>
            <h1>Footer</h1>
        </MyFooterSyle>
    )
}

export default MyFooter