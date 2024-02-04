import { zodResolver } from '@hookform/resolvers/zod'
import React, { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { CreateUserForm, createUserSchema } from '../interfaces'
import AutocompleteService, {
  Autocomplete,
} from '@/services/autocomplete.service'
import UserService from '@/services/user.service'
import { useNavigate } from 'react-router-dom'
import { ADMIN_PAGES } from '@/utils/constants/routes'
import { toast } from 'react-toastify'

export function useNewUser() {
  const navigate = useNavigate()
  const form = useForm<CreateUserForm>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: '',
      password: '',
      birthDate: undefined,
      document: '',
      firstName: '',
      instagram: '',
      lastName: '',
      phone: '',
      pixKey: '',
    },
  })
  const [profileOptions, setProfileOptions] = React.useState<Autocomplete[]>([])

  const handleSubmitForm = useCallback(
    async (data: CreateUserForm) => {
      const response = await UserService.createUser(data)
      if (response.data.success) {
        toast.success('Usuário criado com sucesso')
        navigate(ADMIN_PAGES.listUsers)
      }
    },
    [navigate],
  )
  const fetchProfileOptions = useCallback(async () => {
    const response = await AutocompleteService.fetchAutocomplete(['profiles'])
    setProfileOptions(response.data.profiles ?? [])
  }, [])

  useEffect(() => {
    fetchProfileOptions()
  }, [fetchProfileOptions])

  const { isSubmitting } = form.formState

  return {
    profileOptions,
    form,
    isSubmitting,
    handleSubmitForm,
  }
}
