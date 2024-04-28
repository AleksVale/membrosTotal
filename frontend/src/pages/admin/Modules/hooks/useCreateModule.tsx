import { useForm } from 'react-hook-form'
import { createModule, CreateModuleDTO } from '../validation'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback } from 'react'
import { toast } from 'react-toastify'
import { ADMIN_PAGES } from '@/utils/constants/routes'
import ModuleService from '@/services/module.service'

export function useCreateModule() {
  const navigate = useNavigate()
  const form = useForm<CreateModuleDTO>({
    resolver: zodResolver(createModule),
    defaultValues: {
      description: '',
      title: '',
      order: 0,
    },
  })

  const handleSubmitForm = useCallback(
    async (data: CreateModuleDTO) => {
      const response = await ModuleService.createModule(data)
      if (response.data.id) {
        try {
          const fileResponse = await ModuleService.createPhotoModule(
            data.file[0],
            response.data.id,
          )
          if (fileResponse.data.success) {
            toast.success('Pagamento criado com sucesso')
            navigate(ADMIN_PAGES.listModules)
          }
        } catch (error) {
          toast.error('Erro ao enviar a foto, tente editar mais tarde.')
          navigate(ADMIN_PAGES.listModules)
        }
      }
    },
    [navigate],
  )

  const { isSubmitting } = form.formState
  return { form, isSubmitting, handleSubmitForm }
}
