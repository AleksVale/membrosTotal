import { useCallback, useEffect, useState } from 'react'
import AutocompleteService, {
  Autocomplete,
} from '@/services/autocomplete.service'
import { useForm } from 'react-hook-form'
import { CreatePermission, createPermissionSchema } from '../validation'
import { zodResolver } from '@hookform/resolvers/zod'
import TrainingService from '@/services/training.service'
import { useNavigate, useParams } from 'react-router-dom'
import { ITraining } from '../../Training/interfaces'
import { ADMIN_PAGES } from '@/utils/constants/routes'
import { toast } from 'react-toastify'

export function useTrainingPermission() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [users, setUsers] = useState<Autocomplete[]>([])
  const [training, setTraining] = useState<ITraining>()
  const [originalUsers, setOriginalUsers] = useState<number[]>([])

  const form = useForm<CreatePermission>({
    resolver: zodResolver(createPermissionSchema),
    defaultValues: {
      users: [],
      addRelatives: false,
    },
  })

  const { reset } = form
  const onSubmitForm = useCallback(
    async (data: CreatePermission) => {
      const addedUsers = data.users.filter(
        (user) => !originalUsers.includes(user),
      )
      const removedUsers = originalUsers.filter(
        (user) => !data.users.includes(user),
      )
      const response = await TrainingService.createTrainingPermissions(
        addedUsers,
        removedUsers,
        data.addRelatives,
        id as string,
      )
      if (response.data.success) {
        navigate(ADMIN_PAGES.listTrainings)
        toast.success('Permissões adicionadas!')
      }
    },
    [id, navigate, originalUsers],
  )

  const fetchAutocomplete = useCallback(async () => {
    const response = await AutocompleteService.fetchAutocomplete(['users'])
    setUsers(response.data.users ?? [])
  }, [])

  const fetchTraining = useCallback(async () => {
    const training = (await TrainingService.getTraining(id)).data.training
    const users = training.PermissionUserTraining.map(
      (permission) => permission.userId,
    )
    setOriginalUsers(users)
    reset({ users, addRelatives: false })
    setTraining(training)
  }, [reset, id])

  useEffect(() => {
    fetchAutocomplete()
    fetchTraining()
  }, [fetchAutocomplete, fetchTraining])

  const { isSubmitting } = form.formState

  return { users, form, isSubmitting, onSubmitForm, training }
}
