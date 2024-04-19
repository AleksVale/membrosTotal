import { useCallback, useEffect, useState } from 'react'
import AutocompleteService, {
  Autocomplete,
} from '@/services/autocomplete.service'
import { useForm } from 'react-hook-form'
import {
  CreateModulePermission,
  CreatePermission,
  createPermissionSchema,
} from '../validation'
import { zodResolver } from '@hookform/resolvers/zod'
import ModuleService from '@/services/module.service'
import { useNavigate, useParams } from 'react-router-dom'
import { ADMIN_PAGES } from '@/utils/constants/routes'
import { toast } from 'react-toastify'
import { IModule } from '../../Modules/interfaces'

export function useModulePermission() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [users, setUsers] = useState<Autocomplete[]>([])
  const [module, setModule] = useState<IModule>()
  const [originalUsers, setOriginalUsers] = useState<number[]>([])

  const form = useForm<CreateModulePermission>({
    resolver: zodResolver(createPermissionSchema),
    defaultValues: {
      users: [],
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
      const response = await ModuleService.createModulePermissions(
        addedUsers,
        removedUsers,
        data.addRelatives,
        id as string,
      )
      if (response.data.success) {
        navigate(ADMIN_PAGES.listModules)
        toast.success('Permissões adicionadas!')
      }
    },
    [id, navigate, originalUsers],
  )

  const fetchAutocomplete = useCallback(async () => {
    const response = await AutocompleteService.fetchAutocomplete(['users'])
    setUsers(response.data.users ?? [])
  }, [])

  const fetchModule = useCallback(async () => {
    const module = (await ModuleService.getModule(id)).data.module
    const users = module.PermissionUserModule.map(
      (permission) => permission.userId,
    )
    setOriginalUsers(users)
    reset({ users, addRelatives: false })
    setModule(module)
  }, [reset, id])

  useEffect(() => {
    fetchAutocomplete()
    fetchModule()
  }, [fetchAutocomplete, fetchModule])

  const { isSubmitting } = form.formState

  return { users, module, form, isSubmitting, onSubmitForm }
}
