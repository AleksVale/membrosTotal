import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { CreateUserForm, createUserSchema } from '../interfaces'
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

  const { isSubmitting } = form.formState

  return {
    form,
    isSubmitting,
    handleSubmitForm,
  }
}
