import { useCallback, useEffect, useState } from 'react'
import AutocompleteService, {
  Autocomplete,
} from '@/services/autocomplete.service'
import { useForm } from 'react-hook-form'
import { CreatePermission, createPermissionSchema } from '../validation'
import { zodResolver } from '@hookform/resolvers/zod'
import TrainingService from '@/services/training.service'
import { useNavigate } from 'react-router-dom'
import { ADMIN_PAGES } from '@/utils/constants/routes'
import { toast } from 'react-toastify'

export function useTrainingPermission() {
  const navigate = useNavigate()
  const [users, setUsers] = useState<Autocomplete[]>([])
  const [trainings, setTrainings] = useState<Autocomplete[]>([])

  const form = useForm<CreatePermission>({
    resolver: zodResolver(createPermissionSchema),
    defaultValues: {
      trainings: [],
      users: [],
    },
  })

  const onSubmitForm = useCallback(
    async (data: CreatePermission) => {
      const trainings = data.trainings.map((training) => training.id)
      const users = data.users.map((user) => user.id)
      const response = await TrainingService.createTrainingPermissions(
        trainings,
        users,
      )
      if (response.data.success) {
        navigate(ADMIN_PAGES.permissions)
        toast.success('Permissões adicionadas!')
      }
    },
    [navigate],
  )

  const fetchAutocomplete = useCallback(async () => {
    const response = await AutocompleteService.fetchAutocomplete([
      'users',
      'trainings',
    ])
    setUsers(response.data.users ?? [])
    setTrainings(response.data.trainings ?? [])
  }, [])

  useEffect(() => {
    fetchAutocomplete()
  }, [fetchAutocomplete])

  const { isSubmitting } = form.formState

  return { users, trainings, form, isSubmitting, onSubmitForm }
}
