import { useCallback, useEffect, useState } from 'react'
import AutocompleteService, {
  Autocomplete,
} from '@/services/autocomplete.service'
import { useForm } from 'react-hook-form'
import {
  CreateModulePermission,
  createModulePermissionSchema,
} from '../validation'
import { zodResolver } from '@hookform/resolvers/zod'
import ModuleService from '@/services/module.service'
import { useNavigate } from 'react-router-dom'
import { ADMIN_PAGES } from '@/utils/constants/routes'
import { toast } from 'react-toastify'

export function useModulePermission() {
  const navigate = useNavigate()
  const [users, setUsers] = useState<Autocomplete[]>([])
  const [modules, setModules] = useState<Autocomplete[]>([])

  const form = useForm<CreateModulePermission>({
    resolver: zodResolver(createModulePermissionSchema),
    defaultValues: {
      modules: [],
      users: [],
    },
  })

  const onSubmitForm = useCallback(
    async (data: CreateModulePermission) => {
      const modules = data.modules.map((module) => module.id)
      const users = data.users.map((user) => user.id)
      const response = await ModuleService.createModulePermissions(
        modules,
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
      'modules',
    ])
    setUsers(response.data.users ?? [])
    setModules(response.data.modules ?? [])
  }, [])

  useEffect(() => {
    fetchAutocomplete()
  }, [fetchAutocomplete])

  const { isSubmitting } = form.formState

  return { users, modules, form, isSubmitting, onSubmitForm }
}
