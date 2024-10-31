import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Reset from "./components/Reset"
import NotFound from "./pages/NotFound"
import DefaultPage from "./pages/DefaultPage"
import SignUp from "./pages/SignUp"
import Hub from "./pages/Hub/Hub.jsx"
import Pomodoro from "./pages/Pomodoro/Pomodoro.jsx"

function AppRoutes() {
  return (
    <BrowserRouter>
      <Reset />
      <Routes>
        <Route path="/" element={<DefaultPage />}>
          <Route index element={<Home />}/>
          <Route path="" element/>
          <Route path="/hub" element={<Hub />}/>
          <Route path="/pomodoro" element={<Pomodoro />}/>
          <Route path="*" element={<NotFound />}/>
        </Route>
        <Route path="/login" element={<Login />}/>
        <Route path="/signup" element={<SignUp />}/>

      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
