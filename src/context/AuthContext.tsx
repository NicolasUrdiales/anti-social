import {
  createContext,
  useState
} from "react";

import type { User } from "../types/user";

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const Auth=AuthContext;



export function AuthProvider({
  children
}: {
  children: React.ReactNode;
}) {

  const [user, setUser] = useState<User | null>(() => {

   const storedUser =
      localStorage.getItem("user");

   return storedUser
      ? JSON.parse(storedUser)
      : null;
});

  function login(userData: User) {
    setUser(userData);

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );
  }

  function logout() {
    setUser(null);

    localStorage.removeItem("user");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
