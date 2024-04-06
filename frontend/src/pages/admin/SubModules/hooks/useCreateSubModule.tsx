import { useForm } from 'react-hook-form'
import { createSubModule, CreateSubModuleDTO } from '../validation'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback } from 'react'
import { toast } from 'react-toastify'
import { ADMIN_PAGES } from '@/utils/constants/routes'
import SubModuleService from '@/services/subModule.service'

export function useCreateSubModule() {
  const navigate = useNavigate()
  const form = useForm<CreateSubModuleDTO>({
    resolver: zodResolver(createSubModule),
    defaultValues: {
      description: '',
      title: '',
    },
  })

  const handleSubmitForm = useCallback(
    async (data: CreateSubModuleDTO) => {
      const response = await SubModuleService.createSubModule(data)
      if (response.data.id) {
        try {
          const fileResponse = await SubModuleService.createPhotoSubModule(
            data.file[0],
            response.data.id,
          )
          if (fileResponse.data.success) {
            toast.success('Submódulo criado com sucesso')
            navigate(ADMIN_PAGES.listSubModules)
          }
        } catch (error) {
          toast.error('Erro ao enviar a foto, tente editar mais tarde.')
          navigate(ADMIN_PAGES.listSubModules)
        }
      }
    },
    [navigate],
  )

  const { isSubmitting } = form.formState
  return { form, isSubmitting, handleSubmitForm }
}
