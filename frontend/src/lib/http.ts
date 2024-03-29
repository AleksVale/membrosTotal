import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios'

interface ErrorResponse {
  status: number
}

// Create a custom Axios instance
const serverURL = 'http://localhost:5005/api'
// const serverURL = 'https://membros-api.onrender.com/api'

const http: AxiosInstance = axios.create({
  baseURL: serverURL,
  headers: {
    'Content-type': 'application/json',
  },
})

// Response interceptor
http.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      localStorage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

// Request interceptor
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig<unknown>) => {
    const token = localStorage.getItem('token')
    if (token && token !== 'undefined') {
      config.headers.Authorization = `Bearer ${JSON.parse(token)}`
    }
    return config
  },
  (error: ErrorResponse) => {
    return Promise.reject(error)
  },
)

export default http
