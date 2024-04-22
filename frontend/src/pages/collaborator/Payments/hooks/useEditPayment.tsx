import { COLLABORATOR_PAGES } from '@/utils/constants/routes'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { CreatePaymentDTO, createPaymentchema } from '../validation'
import ColaboratorService from '@/services/colaborator.service'
import { isAxiosError } from 'axios'

export function useEditPayment() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const form = useForm<CreatePaymentDTO>({
    resolver: zodResolver(createPaymentchema),
    defaultValues: {
      description: '',
      value: 0,
    },
  })

  const { reset } = form

  const fetchPayment = useCallback(async () => {
    try {
      setLoading(true)
      const response = await ColaboratorService.getPayment(id as string)
      console.log(response)
      reset({
        ...response.data,
        paymentTypeId: response.data.paymentTypeId ?? undefined,
      })
    } catch (error) {
      toast.error(
        isAxiosError(error) ? error.message : 'Erro ao buscar pagamento',
      )
      navigate(COLLABORATOR_PAGES.listPayments)
    } finally {
      setLoading(false)
    }
  }, [reset, id, navigate])

  useEffect(() => {
    fetchPayment()
  }, [fetchPayment])

  const handleSubmitForm = useCallback(
    async (data: CreatePaymentDTO) => {
      try {
        const response = await ColaboratorService.updatePayment(
          id as string,
          data,
        )

        if (response.data.success) {
          toast.success('Pagamento criado com sucesso')
          navigate(COLLABORATOR_PAGES.listPayments)
        }
      } catch (error) {
        toast.error(
          isAxiosError(error) ? error.message : 'Erro ao criar pagamento',
        )
        navigate(COLLABORATOR_PAGES.listPayments)
      }
    },
    [id, navigate],
  )

  const { isSubmitting } = form.formState

  return {
    form,
    isSubmitting,
    handleSubmitForm,
    loading,
  }
}
