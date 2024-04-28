import { useForm } from 'react-hook-form'
import { createTraining, CreateTrainingDTO } from '../validation'
import { useNavigate, useParams } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect } from 'react'
import { toast } from 'react-toastify'
import { ADMIN_PAGES } from '@/utils/constants/routes'
import TrainingService from '@/services/training.service'

export function useEditTraining() {
  const navigate = useNavigate()
  const { id } = useParams()
  const form = useForm<CreateTrainingDTO>({
    resolver: zodResolver(createTraining),
    defaultValues: {
      description: '',
      title: '',
      tutor: '',
      order: 0,
    },
  })

  const { reset } = form

  const getTraining = useCallback(async () => {
    const training = await TrainingService.getTraining(id)

    reset({ ...training.data.training, file: [training.data.stream] })
  }, [id, reset])

  useEffect(() => {
    getTraining()
  }, [getTraining])

  const handleSubmitForm = useCallback(
    async (data: CreateTrainingDTO) => {
      if (!id) {
        navigate(ADMIN_PAGES.listTrainings)
        return
      }
      const response = await TrainingService.update(data, id)
      if (response.data.id) {
        try {
          // const fileResponse = await TrainingService.createPhotoTraining(
          //   data.file[0],
          //   response.data.id,
          // )
          if (response.data.id) {
            toast.success('Treinamento editado com sucesso')
            navigate(ADMIN_PAGES.listTrainings)
          }
        } catch (error) {
          toast.error('Erro ao enviar a foto, tente editar mais tarde.')
          navigate(ADMIN_PAGES.listTrainings)
        }
      }
    },
    [id, navigate],
  )

  const { isSubmitting } = form.formState
  return { form, isSubmitting, handleSubmitForm }
}
