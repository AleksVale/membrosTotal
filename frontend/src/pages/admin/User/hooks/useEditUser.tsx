import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { CreateUserForm, createUserSchema } from '../interfaces'
import UserService from '@/services/user.service'
import { useNavigate, useParams } from 'react-router-dom'
import { ADMIN_PAGES } from '@/utils/constants/routes'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)
export function useEditUser() {
  const navigate = useNavigate()
  const { id } = useParams()
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

  const { reset } = form

  const handleSubmitForm = useCallback(
    async (data: CreateUserForm) => {
      if (!id) return
      const response = await UserService.update(data, id)
      if (response.data.success) {
        toast.success('Usuário editado com sucesso')
        navigate(ADMIN_PAGES.listUsers)
      }
    },
    [id, navigate],
  )

  const fetchUser = useCallback(async () => {
    const { data } = await UserService.getUser(id)
    reset({
      email: data.email,
      phone: data.phone,
      profileId: data.Profile.id,
      firstName: data.firstName,
      lastName: data.lastName,
      document: data.document,
      birthDate: dayjs(data.birthDate, 'YYYY-MM-DD')
        .utc(false)
        .format('YYYY/MM/DD'),
      instagram: data.instagram,
      pixKey: data.pixKey,
    })
  }, [id, reset])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const { isSubmitting } = form.formState

  return {
    form,
    isSubmitting,
    handleSubmitForm,
  }
}
