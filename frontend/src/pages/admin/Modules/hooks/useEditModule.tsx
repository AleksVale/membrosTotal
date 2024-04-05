import { useForm } from 'react-hook-form'
import { createModule, CreateModuleDTO } from '../validation'
import { useNavigate, useParams } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect } from 'react'
import { toast } from 'react-toastify'
import { ADMIN_PAGES } from '@/utils/constants/routes'
import ModuleService from '@/services/module.service'

export function useEditModule() {
  const navigate = useNavigate()
  const { id } = useParams()
  const form = useForm<CreateModuleDTO>({
    resolver: zodResolver(createModule),
    defaultValues: {
      description: '',
      title: '',
    },
  })

  const { reset } = form

  const getModule = useCallback(async () => {
    const module = await ModuleService.getModule(id)

    reset({ ...module.data.module, file: [module.data.stream] })
  }, [id, reset])

  useEffect(() => {
    getModule()
  }, [getModule])

  const handleSubmitForm = useCallback(
    async (data: CreateModuleDTO) => {
      if (!id) {
        navigate(ADMIN_PAGES.listModules)
        return
      }
      const response = await ModuleService.update(data, id)
      if (response.data.id) {
        try {
          // const fileResponse = await ModuleService.createPhotoModule(
          //   data.file[0],
          //   response.data.id,
          // )
          if (response.data.id) {
            toast.success('Pagamento criado com sucesso')
            navigate(ADMIN_PAGES.listModules)
          }
        } catch (error) {
          toast.error('Erro ao enviar a foto, tente editar mais tarde.')
          navigate(ADMIN_PAGES.listModules)
        }
      }
    },
    [id, navigate],
  )

  const { isSubmitting } = form.formState
  return { form, isSubmitting, handleSubmitForm }
}
