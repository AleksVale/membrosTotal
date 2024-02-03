import http from '@/lib/http'

interface LoginResponse {
  token: string
  id: number
  profile: string
  name: string
  email: string
}

const login = async (email: string, password: string) => {
  return http.post<LoginResponse>('/auth', { email, password })
}

const AuthService = {
  login,
}

export default AuthService
