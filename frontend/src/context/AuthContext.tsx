import useLocalStorage from '@/hooks/useLocalStorage'
import AuthService, { LoginResponse } from '@/services/auth.service'
import {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useMemo,
  useCallback,
} from 'react'

interface AuthContextType {
  token: string | null
  profile: string | null
  login: (email: string, senha: string) => Promise<LoginResponse>
  logout: () => void
  updateProfilePhoto: (photo: string) => void
  photo: string | null
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [token, setToken] = useLocalStorage<string | null>('token', null)
  const [profile, setProfile] = useLocalStorage<string | null>('profile', null)
  const [loading, setLoading] = useState<boolean>(true)
  const [photo, setPhoto] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token && token !== 'undefined') {
      setToken(JSON.parse(token))
    } else {
      setToken(null)
    }
    setLoading(false)
  }, [setToken])

  const login = useCallback(
    async (email: string, senha: string) => {
      const token = await AuthService.login(email, senha)

      setToken(token.data.token)
      setProfile(token.data.profile)
      setPhoto(token.data.photo)
      return token.data
    },
    [setProfile, setToken],
  )

  const updateProfilePhoto = useCallback((photo: string) => {
    setPhoto(photo)
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setProfile(null)
  }, [setProfile, setToken])

  const value = useMemo(
    () => ({ token, login, logout, profile, photo, updateProfilePhoto }),
    [token, login, logout, profile, photo, updateProfilePhoto],
  )

  if (loading) {
    return <div>Loading...</div>
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
