import { COLLABORATOR_PAGES } from '@/utils/constants/routes'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { createRefundchema, CreateRefundDTO } from '../validation'
import ColaboratorService from '@/services/colaborator.service'

export function useCreateRefund() {
  const navigate = useNavigate()
  const form = useForm<CreateRefundDTO>({
    resolver: zodResolver(createRefundchema),
    defaultValues: {
      description: '',
      value: 0,
    },
  })

  const handleSubmitForm = useCallback(
    async (data: CreateRefundDTO) => {
      const response = await ColaboratorService.createRefund(data)

      if (response.data.id && data.file[0]) {
        try {
          const fileResponse = await ColaboratorService.createPhotoRefund(
            data.file[0],
            response.data.id,
          )
          if (fileResponse.data.success) {
            toast.success('Reembolso criado com sucesso')
            navigate(COLLABORATOR_PAGES.listRefund)
            return
          }
        } catch (error) {
          toast.error('Erro ao enviar a foto, tente editar mais tarde.')
          navigate(COLLABORATOR_PAGES.listRefund)
        }
      }
      toast.success('Pagamento criado com sucesso')
      navigate(COLLABORATOR_PAGES.listPayments)
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
