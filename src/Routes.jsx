import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Reset from "./components/Reset";
import NotFound from "./pages/NotFound";
import DefaultPage from "./pages/DefaultPage";
import SignUp from "./pages/SignUp";
import Pomodoro from "./pages/Pomodoro";
import UserConfig from "./pages/UserConfig";
import PreConfigs from "./pages/PreConfigs";
import ReadingHistoryList from "./pages/ReadingHistoryList";
import AllBooksPage from "./pages/AllBooksPage";
import UserProfile from "./pages/UserProfile";
import BookPreview from "./pages/BookPreview";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Reset />
      <Routes>
        <Route path="/" element={<DefaultPage />}>
          <Route index element={<Home />} />
          <Route path="/pomodoro" element={<Pomodoro />} />
          <Route path="/userconfig" element={<UserConfig />} />
          <Route path="/preuserconfigs" element={<PreConfigs />} />
          <Route path="/readinghistorylist" element={<ReadingHistoryList />} /> 
          <Route path="/books" element={<AllBooksPage />} />
          <Route path="/user/:username" element={<UserProfile />} />
          <Route path="/bookpreview" element={<BookPreview />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
