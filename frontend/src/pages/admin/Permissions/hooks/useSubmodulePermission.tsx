import { useCallback, useEffect, useState } from 'react'
import AutocompleteService, {
  Autocomplete,
} from '@/services/autocomplete.service'
import { useForm } from 'react-hook-form'
import {
  CreateSubmodulePermission,
  createSubmodulePermissionSchema,
} from '../validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { ADMIN_PAGES } from '@/utils/constants/routes'
import { toast } from 'react-toastify'
import SubModuleService from '@/services/subModule.service'

export function useSubmodulePermission() {
  const navigate = useNavigate()
  const [users, setUsers] = useState<Autocomplete[]>([])
  const [submodules, setSubmodules] = useState<Autocomplete[]>([])

  const form = useForm<CreateSubmodulePermission>({
    resolver: zodResolver(createSubmodulePermissionSchema),
    defaultValues: {
      submodules: [],
      users: [],
    },
  })

  const onSubmitForm = useCallback(
    async (data: CreateSubmodulePermission) => {
      const submodules = data.submodules.map((submodule) => submodule.id)
      const users = data.users.map((user) => user.id)
      const response = await SubModuleService.createSubmodulePermissions(
        submodules,
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
      'submodules',
    ])
    setUsers(response.data.users ?? [])
    setSubmodules(response.data.submodules ?? [])
  }, [])

  useEffect(() => {
    fetchAutocomplete()
  }, [fetchAutocomplete])

  const { isSubmitting } = form.formState

  return { users, submodules, form, isSubmitting, onSubmitForm }
}