import { useCallback, useEffect } from 'react'
import { useAuth } from './useAuth'
import logo from '../assets/logo.jpg'
import UserService from '@/services/user.service'

export function useProfilePicture() {
  const { photo, updateProfilePhoto } = useAuth()
  const getPicture = useCallback(async () => {
    try {
      if (!photo) {
        const { data } = await UserService.getProfilePicture(1)
        updateProfilePhoto(data.picture ?? logo)
      }
    } catch (error) {
      console.log('Erro ao buscar foto de perfil')
    }
  }, [photo, updateProfilePhoto])

  useEffect(() => {
    getPicture()
  }, [getPicture])

  return { logo }
}
