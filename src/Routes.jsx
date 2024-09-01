import styled from "styled-components"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Reset from "./components/Reset"

function AppRoutes() {
  return (
    <BrowserRouter>
      <Reset />
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="*" element={<Home />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
