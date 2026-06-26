import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, User, PlusCircle, LogOut, Sun, Moon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { Button } from "../ui/Button";
import { cn } from "../../lib/utils";

interface LayoutWrapperProps {
  children: ReactNode;
}

export const LayoutWrapper = ({ children }: LayoutWrapperProps) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Post", path: "/create", icon: PlusCircle },
    { name: "Perfil", path: "/profile", icon: User },
  ];

  const ThemeToggle = () => (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={cn(
        "p-2.5 rounded-full transition-all duration-300",
        theme === "dark"
          ? "bg-white/10 hover:bg-white/20 text-yellow-300"
          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
      )}
    >
      {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-sm">A</span>
            </div>
            <span className="font-black text-gray-900 dark:text-white text-lg tracking-tight hidden sm:block">
              Anti<span className="text-indigo-500">Social</span>
            </span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Link to="/login">
              <Button variant="ghost" className="font-semibold dark:text-white dark:hover:bg-white/10 hidden sm:flex">
                Sign in
              </Button>
            </Link>
            <Link to="/register">
              <Button className="font-bold bg-gray-900 hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 rounded-full px-4 sm:px-5 text-sm">
                Sign up
              </Button>
            </Link>
          </div>
        </div>
        <main>{children}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex justify-center transition-colors duration-300">
      <div className="w-full max-w-7xl flex">
        <aside className="hidden sm:flex w-16 lg:w-64 flex-col items-center lg:items-start p-3 lg:p-4 h-screen sticky top-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shrink-0">
          <Link to="/" className="p-3 mb-4 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-black">A</span>
            </div>
          </Link>

          <nav className="flex-1 w-full space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-4 p-3 rounded-full transition-all text-lg",
                    isActive
                      ? "font-bold bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                      : "text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  <Icon className={cn("w-6 h-6 shrink-0", isActive ? "text-indigo-600 dark:text-indigo-400" : "")} />
                  <span className="hidden lg:block">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center justify-center lg:justify-start p-3">
              <ThemeToggle />
            </div>
            <Button
              variant="ghost"
              className="w-full justify-center lg:justify-start rounded-full p-3 lg:px-4 h-auto text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
              onClick={logout}
            >
              <LogOut className="w-5 h-5 lg:mr-3 shrink-0" />
              <span className="hidden lg:block font-semibold">Logout</span>
            </Button>
          </div>
        </aside>

        <main className="flex-1 min-h-screen pb-16 sm:pb-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 min-w-0">
          {children}
        </main>

        <aside className="hidden lg:block w-72 xl:w-80 p-4 xl:p-6 sticky top-0 h-screen overflow-y-auto shrink-0">
          <div className="space-y-4">
            <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-4">
              <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">Trending 🔥</h3>
              <div className="space-y-3">
                {[
                  { tag: "#TP2BackEnd", count: "1,234" },
                  { tag: "#ReactJS", count: "5,432" },
                  { tag: "#UnaHur", count: "892" },
                  { tag: "#AntiSocial", count: "3,120" },
                ].map(({ tag, count }) => (
                  <div key={tag} className="group cursor-pointer">
                    <p className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-500 transition-colors text-sm">{tag}</p>
                    <p className="text-xs text-gray-500">{count} posts</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-4 text-white">
              <h3 className="font-bold text-base mb-1">Invitá amigos 👀</h3>
              <p className="text-sm text-indigo-100 mb-3">
                Compartí Anti-Social Net con tus compañeros
              </p>
              <button className="bg-white text-indigo-600 font-bold text-sm px-4 py-2 rounded-full hover:bg-indigo-50 transition-colors">
                Compartir
              </button>
            </div>
          </div>
        </aside>

        <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 flex justify-around items-center py-2 px-4 z-50">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} className="flex flex-col items-center p-2 gap-0.5">
                <Icon className={cn("w-6 h-6", isActive ? "text-indigo-600" : "text-gray-400 dark:text-gray-500")} />
                <span className={cn("text-xs", isActive ? "text-indigo-600 font-semibold" : "text-gray-400 dark:text-gray-500")}>{item.name}</span>
              </Link>
            );
          })}
          <button onClick={toggleTheme} className="flex flex-col items-center p-2 gap-0.5">
            {theme === "dark"
              ? <Sun className="w-6 h-6 text-yellow-400" />
              : <Moon className="w-6 h-6 text-gray-400" />
            }
            <span className="text-xs text-gray-400 dark:text-gray-500">Tema</span>
          </button>
        </nav>
      </div>
    </div>
  );
};
