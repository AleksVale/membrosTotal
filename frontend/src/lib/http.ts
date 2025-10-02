import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import Cookies from "js-cookie";
import { performLogout } from "./auth";

interface ErrorResponse {
  status: number;
}

// Backend API URL - usa variável de ambiente ou fallback para desenvolvimento
const serverURL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

console.log("API URL:", serverURL);

const http: AxiosInstance = axios.create({
  baseURL: serverURL,
  headers: {
    "Content-type": "application/json",
  },
});

// Response interceptor
http.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      // Token inválido ou expirado - faz logout completo
      await performLogout();
    }
    return Promise.reject(error);
  }
);

// Request interceptor
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig<unknown>) => {
    const token = Cookies.get("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: ErrorResponse) => {
    return Promise.reject(error);
  }
);

export default http;
