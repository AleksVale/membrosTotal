import { zodResolver } from '@hookform/resolvers/zod'
import React, { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { CreateUserForm, createUserSchema } from '../interfaces'
import AutocompleteService, {
  Autocomplete,
} from '@/services/autocomplete.service'

export function useNewUser() {
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

  const handleSubmitForm = (data: CreateUserForm) => {
    console.log(data)
  }
  const [profileOptions, setProfileOptions] = React.useState<Autocomplete[]>([])
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
