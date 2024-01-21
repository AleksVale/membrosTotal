import http from '../utils/http.common'

interface loginResponse {
  token: string
  id: string
  profile: string
  name: string
  email: string
}

const login = async (email: string, password: string) => {
  return http.post<loginResponse>('/auth', { email, password })
}

const AuthService = {
  login,
}

export default AuthService
