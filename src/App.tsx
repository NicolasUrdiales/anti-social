import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import { LayoutWrapper } from "./components/layout/LayoutWrapper";
import { ProtectedRoutes } from "./routes/ProtectedRoutes";
import { Home } from "./pages/Home";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import { PostDetail } from "./pages/PostDetail";
import { Profile } from "./pages/Profile";
import { CreatePost } from "./pages/CreatePost";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <LayoutWrapper>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/" element={<Home />} />
                <Route path="/post/:id" element={<PostDetail />} />
                <Route element={<ProtectedRoutes />}>
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/profile/:id" element={<Profile />} />
                  <Route path="/create" element={<CreatePost />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </LayoutWrapper>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;