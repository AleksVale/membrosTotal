import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import Cookies from 'js-cookie';
import { performLogout } from './auth';

interface ErrorResponse {
  status: number;
}

// Backend API URL
// const serverURL = 'https://api.nohau.agency/api';
const serverURL = 'http://localhost:3000/api';


const http: AxiosInstance = axios.create({
  baseURL: serverURL,
  headers: {
    'Content-type': 'application/json',
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
  },
);

// Request interceptor
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig<unknown>) => {
    const token = Cookies.get('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: ErrorResponse) => {
    return Promise.reject(error);
  },
);

export default http;
