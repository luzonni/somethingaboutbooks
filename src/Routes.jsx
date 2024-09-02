import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Reset from "./components/Reset"
import MyHeader from "./components/MyHeader"

function AppRoutes() {
  return (
    <BrowserRouter>
      <Reset />
      <MyHeader />
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="*" element={<Home />}/>
      </Routes>
      {/* Footer */}
    </BrowserRouter>
  )
}

export default AppRoutes
