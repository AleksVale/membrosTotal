import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios'

interface ErrorResponse {
  status: number
}

const serverURL = 'https://api.nohau.agency/api'

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
      window.location.href = '/'
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
