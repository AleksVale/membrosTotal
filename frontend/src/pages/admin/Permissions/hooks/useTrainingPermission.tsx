import { useCallback, useEffect, useState } from 'react'
import AutocompleteService, {
  Autocomplete,
} from '@/services/autocomplete.service'
import { useForm } from 'react-hook-form'
import { CreatePermission, createPermissionSchema } from '../validation'
import { zodResolver } from '@hookform/resolvers/zod'

export function useTrainingPermission() {
  const [users, setUsers] = useState<Autocomplete[]>([])
  const [trainings, setTrainings] = useState<Autocomplete[]>([])

  const form = useForm<CreatePermission>({
    resolver: zodResolver(createPermissionSchema),
    defaultValues: {
      trainings: [],
      users: [],
    },
  })

  const onSubmitForm = useCallback((data: CreatePermission) => {
    console.log(data)
  }, [])

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
