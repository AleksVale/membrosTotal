"use client";

import { performLogout } from "@/lib/auth";
import http from "@/lib/http";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

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
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
          router.push("/collaborator/dashboard");
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

  const logout = useCallback(async () => {
    setUser(null);
    await performLogout();
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      const token = Cookies.get("auth_token");
      if (token) {
        const response = await http.get("/auth/profile");
        setUser(response.data);
      }
    } catch {
      Cookies.remove("auth_token");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
    }),
    [login, logout, user, isLoading]
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
