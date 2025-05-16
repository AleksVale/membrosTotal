"use client";

import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import http from "@/lib/http";

interface User {
  id: string;
  name: string;
  email: string;
  profile: string;
  photo?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const response = await http.post("/auth", { email, password });
        const { token, ...userData } = response.data;

        // Salva o token nos cookies
        Cookies.set("auth_token", token, {
          expires: 7, // expira em 7 dias
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });

        // Atualiza o estado do usuário
        setUser(userData);

        // Redireciona baseado no perfil
        if (userData.profile === "admin") {
          router.push("/admin/dashboard");
        } else if (userData.profile === "employee") {
          router.push("/employee/dashboard");
        } else {
          throw new Error("Perfil inválido");
        }
      } catch (error) {
        console.error("Erro no login:", error);
        throw error;
      }
    },
    [router]
  );

  const logout = useCallback(() => {
    Cookies.remove("auth_token");
    setUser(null);
    router.push("/login");
  }, [router]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      login,
      logout,
    }),
    [login, logout, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
