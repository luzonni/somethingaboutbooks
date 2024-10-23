import { Outlet } from "react-router-dom";
import MyHeader from "../../components/MyHeader";
import MyFooter from "../../components/MyFooter";

const DefaultPage = () => {
    return (
        <main>
            <MyHeader />
            <Outlet />
            <MyFooter/>
        </main>
    )
}

export default DefaultPage