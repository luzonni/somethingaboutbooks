import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Spinner } from "./components/Feedback";
import RequireAuth from "./components/RequireAuth";
import Reset from "./components/Reset";
import { AuthProvider } from "./context/AuthContext";
import { LibraryProvider } from "./context/LibraryContext";
import { PomodoroProvider } from "./context/PomodoroContext";
import DefaultPage from "./pages/DefaultPage";
import Home from "./pages/Home";

const AllBooksPage = lazy(() => import("./pages/AllBooksPage"));
const BookPreview = lazy(() => import("./pages/BookPreview"));
const Info = lazy(() => import("./pages/Info"));
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Pomodoro = lazy(() => import("./pages/Pomodoro"));
const PreConfigs = lazy(() => import("./pages/PreConfigs"));
const ReadingHistoryList = lazy(() => import("./pages/ReadingHistoryList"));
const SignUp = lazy(() => import("./pages/SignUp"));
const UserConfig = lazy(() => import("./pages/UserConfig"));
const UserProfile = lazy(() => import("./pages/UserProfile"));

const isPrivate = (page) => <RequireAuth>{page}</RequireAuth>;

function AppRoutes() {
  return (
    <BrowserRouter>
      <Reset />
      <AuthProvider>
        <LibraryProvider>
          <PomodoroProvider>
            <Suspense fallback={<Spinner label="Carregando página" />}>
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
            </Suspense>
          </PomodoroProvider>
        </LibraryProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default AppRoutes;
