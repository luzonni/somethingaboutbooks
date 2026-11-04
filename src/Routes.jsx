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

const loadAllBooksPage = () => import("./pages/AllBooksPage");
const AllBooksPage = lazy(loadAllBooksPage);
const loadBookPreview = () => import("./pages/BookPreview");
const BookPreview = lazy(loadBookPreview);
const loadAuthPage = () => import("./pages/Auth");
const AuthPage = lazy(loadAuthPage);
const loadInfo = () => import("./pages/Info");
const Info = lazy(loadInfo);
const loadNotFound = () => import("./pages/NotFound");
const NotFound = lazy(loadNotFound);
const loadPomodoro = () => import("./pages/Pomodoro");
const Pomodoro = lazy(loadPomodoro);
const loadPreConfigs = () => import("./pages/PreConfigs");
const PreConfigs = lazy(loadPreConfigs);
const loadReadingHistoryList = () => import("./pages/ReadingHistoryList");
const ReadingHistoryList = lazy(loadReadingHistoryList);
const loadUserConfig = () => import("./pages/UserConfig");
const UserConfig = lazy(loadUserConfig);
const loadUserProfile = () => import("./pages/UserProfile");
const UserProfile = lazy(loadUserProfile);

// Baixa as outras páginas com o navegador ocioso para a navegação não mostrar carregamento.
const preloadPages = () =>
  [loadAllBooksPage, loadBookPreview, loadPomodoro, loadAuthPage].forEach((load) => load().catch(() => {}));

const schedule = window.requestIdleCallback ?? ((callback) => setTimeout(callback, 1500));
schedule(preloadPages);

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
                <Route path="/login" element={<AuthPage />} />
                <Route path="/signup" element={<AuthPage />} />
              </Routes>
            </Suspense>
          </PomodoroProvider>
        </LibraryProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default AppRoutes;
