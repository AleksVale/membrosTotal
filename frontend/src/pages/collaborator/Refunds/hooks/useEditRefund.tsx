import { COLLABORATOR_PAGES } from '@/utils/constants/routes'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { createRefundchema, CreateRefundDTO } from '../validation'
import ColaboratorService from '@/services/colaborator.service'

export function useEditRefund() {
  const { id } = useParams()
  const navigate = useNavigate()
  const form = useForm<CreateRefundDTO>({
    resolver: zodResolver(createRefundchema),
    defaultValues: {
      description: '',
      refundDate: undefined,
      refundTypeId: undefined,
    },
  })

  const { reset } = form

  const fetchRefund = useCallback(async () => {
    const response = await ColaboratorService.getRefund(Number(id))
    reset({
      ...response.data,
      refundDate: response.data.refundDate,
    })
  }, [reset, id])

  useEffect(() => {
    fetchRefund()
  }, [fetchRefund])

  const handleSubmitForm = useCallback(
    async (data: CreateRefundDTO) => {
      const response = await ColaboratorService.createRefund(data)

      if (response.data.id) {
        try {
          toast.success('Reembolso editado com sucesso')
          navigate(COLLABORATOR_PAGES.listPaymentRequest)
        } catch (error) {
          toast.error('Erro ao editar, tente editar mais tarde.')
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
