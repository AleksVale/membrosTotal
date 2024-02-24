import { ADMIN_PAGES } from '@/utils/constants/routes'
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
      if (response.data.success) {
        toast.success('Usuário criado com sucesso')
        navigate(ADMIN_PAGES.listUsers)
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
