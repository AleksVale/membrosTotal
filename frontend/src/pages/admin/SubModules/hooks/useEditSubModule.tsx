import { useForm } from 'react-hook-form'
import { createSubModule, CreateSubModuleDTO } from '../validation'
import { useNavigate, useParams } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect } from 'react'
import { toast } from 'react-toastify'
import { ADMIN_PAGES } from '@/utils/constants/routes'
import SubModuleService from '@/services/subModule.service'

export function useEditSubModule() {
  const navigate = useNavigate()
  const { id } = useParams()
  const form = useForm<CreateSubModuleDTO>({
    resolver: zodResolver(createSubModule),
    defaultValues: {
      description: '',
      title: '',
    },
  })

  const { reset } = form

  const getSubModule = useCallback(async () => {
    const response = await SubModuleService.getSubModule(id)
    reset({ ...response.data.submodule, file: [response.data.stream] })
  }, [id, reset])

  useEffect(() => {
    getSubModule()
  }, [getSubModule])

  const handleSubmitForm = useCallback(
    async (data: CreateSubModuleDTO) => {
      if (!id) {
        navigate(ADMIN_PAGES.listSubModules)
        return
      }
      const response = await SubModuleService.update(data, id)
      if (response.data.id) {
        try {
          // const fileResponse = await ModuleService.createPhotoModule(
          //   data.file[0],
          //   response.data.id,
          // )
          if (response.data.id) {
            toast.success('Pagamento criado com sucesso')
            navigate(ADMIN_PAGES.listSubModules)
          }
        } catch (error) {
          toast.error('Erro ao enviar a foto, tente editar mais tarde.')
          navigate(ADMIN_PAGES.listSubModules)
        }
      }
    },
    [id, navigate],
  )

  const { isSubmitting } = form.formState
  return { form, isSubmitting, handleSubmitForm }
}
