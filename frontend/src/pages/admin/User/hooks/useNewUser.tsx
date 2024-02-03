import { ProfileOptions } from '@/utils/constants/profiles'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { CreateUserForm, createUserSchema } from '../interfaces'

export function useNewUser() {
  const form = useForm<CreateUserForm>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: '',
      password: '',
      birthDate: '',
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
  const [profileOptions, setProfileOptions] = React.useState<ProfileOptions[]>(
    [],
  )

  const { isSubmitting } = form.formState

  return {
    profileOptions,
    form,
    isSubmitting,
    handleSubmitForm,
  }
}
