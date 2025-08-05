import Cookies from "js-cookie";
import http from "./http";

/**
 * Função utilitária para fazer logout completo
 * Remove todos os tokens, cookies e dados em cache
 */
export const performLogout = async (): Promise<void> => {
  try {
    // Tenta fazer logout no backend
    await http.post("/auth/logout");
  } catch (error) {
    console.error("Erro ao fazer logout no servidor:", error);
  } finally {
    // Sempre limpa os dados locais, independente do resultado da API
    
    // Remove cookies específicos
    Cookies.remove("auth_token");
    Cookies.remove("auth_token", { path: "/" });
    Cookies.remove("user");
    Cookies.remove("user", { path: "/" });
    
    // Remove todos os cookies da aplicação
    if (typeof document !== 'undefined') {
      document.cookie.split(";").forEach((cookie) => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        // Remove cookie do path atual
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        // Remove cookie do root
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
      });
    }
    
    // Limpa storage local
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
    }
    
    // Força reload da página para limpar estado da aplicação
    window.location.href = "/login";
  }
};

/**
 * Verifica se o usuário está autenticado
 */
export const isAuthenticated = (): boolean => {
  const token = Cookies.get("auth_token");
  return !!token;
};

/**
 * Obtém o token de autenticação
 */
export const getAuthToken = (): string | undefined => {
  return Cookies.get("auth_token");
};