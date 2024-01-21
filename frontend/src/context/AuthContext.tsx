import { createContext, useState, ReactNode, useEffect } from 'react'
import AuthService from '../services/auth.service'
import { useLocalStorageState } from '../hooks/useLocalStorage'

interface AuthContextType {
  token: string | null
  profile: string | null
  name: string | null
  id: string | null
  login: (email: string, senha: string) => Promise<string>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [token, setToken] = useLocalStorageState('token', null)
  const [profile, setProfile] = useLocalStorageState('profile', null)
  const [name, setName] = useLocalStorageState('name', null)
  const [id, setId] = useLocalStorageState('id', null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  const login = async (email: string, senha: string) => {
    const response = await AuthService.login(email, senha)
    setToken(response.data.token)
    setProfile(response.data.profile)
    setName(response.data.name)
    setId(response.data.id)
    return response.data.profile
  }

  const logout = () => {
    setToken(null)
    setProfile(null)
    setId(null)
    setName(null)
  }
  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <AuthContext.Provider value={{ token, profile, id, name, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
