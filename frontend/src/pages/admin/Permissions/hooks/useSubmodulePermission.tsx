import { useCallback, useEffect, useState } from 'react'
import AutocompleteService, {
  Autocomplete,
} from '@/services/autocomplete.service'
import { useForm } from 'react-hook-form'
import {
  CreatePermission,
  CreateSubmodulePermission,
  createPermissionSchema,
} from '../validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useParams } from 'react-router-dom'
import { ADMIN_PAGES } from '@/utils/constants/routes'
import { toast } from 'react-toastify'
import SubModuleService from '@/services/subModule.service'
import { ISubModule } from '../../SubModules/interfaces'

export function useSubmodulePermission() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [users, setUsers] = useState<Autocomplete[]>([])
  const [submodule, setSubModule] = useState<ISubModule>()
  const [originalUsers, setOriginalUsers] = useState<number[]>([])

  const form = useForm<CreateSubmodulePermission>({
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
      const response = await SubModuleService.createSubmodulePermissions(
        addedUsers,
        removedUsers,
        data.addRelatives,
        id as string,
      )
      if (response.data.success) {
        navigate(ADMIN_PAGES.listSubModules)
        toast.success('Permissões adicionadas!')
      }
    },
    [id, navigate, originalUsers],
  )

  const fetchAutocomplete = useCallback(async () => {
    const response = await AutocompleteService.fetchAutocomplete(['users'])
    setUsers(response.data.users ?? [])
  }, [])

  const fetchSubmodule = useCallback(async () => {
    const submodule = (await SubModuleService.getSubModule(id)).data.submodule
    const users = submodule.PermissionUserSubmodule.map(
      (permission) => permission.userId,
    )
    setOriginalUsers(users)
    reset({ users, addRelatives: false })
    setSubModule(submodule)
  }, [reset, id])

  useEffect(() => {
    fetchAutocomplete()
    fetchSubmodule()
  }, [fetchAutocomplete, fetchSubmodule])

  const { isSubmitting } = form.formState

  return { users, submodule, form, isSubmitting, onSubmitForm }
}
