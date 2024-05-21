import { COLLABORATOR_PAGES } from '@/utils/constants/routes'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  createPaymentRequestschema,
  CreatePaymentRequestDTO,
} from '../validation'
import ColaboratorService from '@/services/colaborator.service'

export function useCreatePaymentRequest() {
  const navigate = useNavigate()
  const form = useForm<CreatePaymentRequestDTO>({
    resolver: zodResolver(createPaymentRequestschema),
    defaultValues: {
      description: '',
      value: 0,
    },
  })

  const handleSubmitForm = useCallback(
    async (data: CreatePaymentRequestDTO) => {
      const response = await ColaboratorService.createPaymentRequest(data)

      if (response.data.id && data.file[0]) {
        try {
          const fileResponse =
            await ColaboratorService.createPhotoPaymentRequest(
              data.file[0],
              response.data.id,
            )
          if (fileResponse.data.success) {
            toast.success('Pagamento criado com sucesso')
            navigate(COLLABORATOR_PAGES.listPaymentRequest)
          }
        } catch (error) {
          toast.error('Erro ao enviar a foto, tente editar mais tarde.')
          navigate(COLLABORATOR_PAGES.listPaymentRequest)
        }
      }
    },
    [navigate],
  )

  const { isSubmitting } = form.formState

  return {
    form,
    isSubmitting,
    handleSubmitForm,
  }
}
