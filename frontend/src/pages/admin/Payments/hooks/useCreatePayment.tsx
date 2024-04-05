import { COLLABORATOR_PAGES } from '@/utils/constants/routes'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { CreatePaymentDTO, createPaymentchema } from '../validation'
import ColaboratorService from '@/services/colaborator.service'

export function useCreatePayment() {
  const navigate = useNavigate()
  const form = useForm<CreatePaymentDTO>({
    resolver: zodResolver(createPaymentchema),
    defaultValues: {
      description: '',
      value: 0,
    },
  })

  const handleSubmitForm = useCallback(
    async (data: CreatePaymentDTO) => {
      const response = await ColaboratorService.createPayment(data)
      if (response.data.id) {
        try {
          const fileResponse = await ColaboratorService.createPhotoPayment(
            data.file[0],
            response.data.id,
          )
          if (fileResponse.data.success) {
            toast.success('Pagamento criado com sucesso')
            navigate(COLLABORATOR_PAGES.listPayments)
          }
        } catch (error) {
          toast.error('Erro ao enviar a foto, tente editar mais tarde.')
          navigate(COLLABORATOR_PAGES.listPayments)
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
