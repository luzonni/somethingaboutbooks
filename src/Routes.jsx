import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import RequireAuth from "./components/RequireAuth";
import Reset from "./components/Reset";
import { AuthProvider } from "./context/AuthContext";
import { LibraryProvider } from "./context/LibraryContext";
import { PomodoroProvider } from "./context/PomodoroContext";
import DefaultPage from "./pages/DefaultPage";
import Home from "./pages/Home";

import AllBooksPage from "./pages/AllBooksPage";
import BookPreview from "./pages/BookPreview";
import Info from "./pages/Info";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Pomodoro from "./pages/Pomodoro";
import PreConfigs from "./pages/PreConfigs";
import ReadingHistoryList from "./pages/ReadingHistoryList";
import SignUp from "./pages/SignUp";
import UserConfig from "./pages/UserConfig";
import UserProfile from "./pages/UserProfile";

const isPrivate = (page) => <RequireAuth>{page}</RequireAuth>;

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
                  <Route path="books" element={<AllBooksPage />} />
                  <Route path="books/:id" element={<BookPreview />} />
                  <Route path="pomodoro" element={<Pomodoro />} />
                  <Route path="user/:username" element={<UserProfile />} />
                  <Route path="userconfig" element={isPrivate(<UserConfig />)} />
                  <Route path="preuserconfigs" element={isPrivate(<PreConfigs />)} />
                  <Route path="readinghistorylist" element={isPrivate(<ReadingHistoryList />)} />
                  <Route path="sobre" element={<Info page="about" />} />
                  <Route path="termos" element={<Info page="terms" />} />
                  <Route path="privacidade" element={<Info page="privacy" />} />
                  <Route path="suporte" element={<Info page="support" />} />
                  <Route path="bookpreview" element={<Navigate to="/books" replace />} />
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
