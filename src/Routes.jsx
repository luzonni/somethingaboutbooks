import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Reset from "./components/Reset"
import MyHeader from "./components/MyHeader"
import NotFound from "./pages/NotFound"

function AppRoutes() {
  return (
    <BrowserRouter>
      <Reset />
      <MyHeader />
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="*" element={<NotFound />}/>
      </Routes>
      {/* Footer */}
    </BrowserRouter>
  )
}

export default AppRoutes
