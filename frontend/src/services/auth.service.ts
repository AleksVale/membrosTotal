import http from '@/lib/http'

interface LoginResponse {
  access_token: string
}

const login = async (email: string, password: string) => {
  return http.post<LoginResponse>('/auth/signin', { email, password })
}

const AuthService = {
  login,
}

export default AuthService
