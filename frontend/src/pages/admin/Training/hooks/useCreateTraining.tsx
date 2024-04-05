import { useForm } from 'react-hook-form'
import { createTraining, CreateTrainingDTO } from '../validation'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback } from 'react'
import { toast } from 'react-toastify'
import { ADMIN_PAGES } from '@/utils/constants/routes'
import TrainingService from '@/services/training.service'

export function useCreateTraining() {
  const navigate = useNavigate()
  const form = useForm<CreateTrainingDTO>({
    resolver: zodResolver(createTraining),
    defaultValues: {
      description: '',
      title: '',
      tutor: '',
    },
  })

  const handleSubmitForm = useCallback(
    async (data: CreateTrainingDTO) => {
      const response = await TrainingService.createTraining(data)
      if (response.data.id) {
        try {
          const fileResponse = await TrainingService.createPhotoTraining(
            data.file[0],
            response.data.id,
          )
          if (fileResponse.data.success) {
            toast.success('Pagamento criado com sucesso')
            navigate(ADMIN_PAGES.listTrainings)
          }
        } catch (error) {
          toast.error('Erro ao enviar a foto, tente editar mais tarde.')
          navigate(ADMIN_PAGES.listTrainings)
        }
      }
    },
    [navigate],
  )
  const goBack = () => {
    navigate(-1)
  }
  const { isSubmitting } = form.formState
  return { form, isSubmitting, handleSubmitForm, goBack }
}
