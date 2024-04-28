import { ADMIN_PAGES } from '@/utils/constants/routes'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { createNotificationchema, CreateNotificationDTO } from '../validation'
import NotificationService from '@/services/notification.service'
import AutocompleteService, {
  Autocomplete,
} from '@/services/autocomplete.service'

export function useCreateNotification() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [userOptions, setUserOptions] = useState<Autocomplete[]>([])
  const form = useForm<CreateNotificationDTO>({
    resolver: zodResolver(createNotificationchema),
    defaultValues: {
      description: '',
      title: '',
      users: [],
    },
  })

  const { reset } = form

  const handleSubmitForm = useCallback(
    async (data: CreateNotificationDTO) => {
      const payload = {
        ...data,
        users: data.users.map((user) => user.id),
      }
      const response = await NotificationService.createNotification(payload)
      if (response.data) {
        toast.success('Notificação criada com sucesso')
        navigate(ADMIN_PAGES.listNotifications)
      }
    },
    [navigate],
  )

  const fetchUsers = useCallback(async () => {
    const response = await AutocompleteService.fetchAutocomplete(['users'])
    const userParam = searchParams.get('user')
    if (userParam) {
      const user = response.data.users?.find(
        (user) => user.fullName === userParam,
      )
      if (user) {
        reset({
          users: [user],
        })
      }
    }
    setUserOptions(response.data.users ?? [])
  }, [reset, searchParams])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const { isSubmitting } = form.formState

  return {
    form,
    isSubmitting,
    handleSubmitForm,
    userOptions,
  }
}
