import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Reset from "./components/Reset";
import { AuthProvider } from "./context/AuthContext";
import RequireAuth from "./components/RequireAuth";
import { LibraryProvider } from "./context/LibraryContext";
import { PomodoroProvider } from "./context/PomodoroContext";
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
      <AuthProvider>
      <LibraryProvider>
      <PomodoroProvider>
      <Routes>
        <Route path="/" element={<DefaultPage />}>
          <Route index element={<Home />} />
          <Route path="/pomodoro" element={<Pomodoro />} />
          <Route path="/userconfig" element={<RequireAuth><UserConfig /></RequireAuth>} />
          <Route path="/preuserconfigs" element={<RequireAuth><PreConfigs /></RequireAuth>} />
          <Route path="/readinghistorylist" element={<RequireAuth><ReadingHistoryList /></RequireAuth>} /> 
          <Route path="/books" element={<AllBooksPage />} />
          <Route path="/user/:username" element={<UserProfile />} />
          <Route path="/books/:id" element={<BookPreview />} />
          <Route path="/bookpreview" element={<Navigate to="/books" replace />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
      </PomodoroProvider>
      </LibraryProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default AppRoutes;
