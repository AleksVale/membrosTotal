import { useForm } from 'react-hook-form'
import { createLesson, CreateLessonDTO } from '../validation'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback } from 'react'
import { toast } from 'react-toastify'
import { ADMIN_PAGES } from '@/utils/constants/routes'
import LessonService from '@/services/lesson.service'

export function useCreateLesson() {
  const navigate = useNavigate()
  const form = useForm<CreateLessonDTO>({
    resolver: zodResolver(createLesson),
    defaultValues: {
      description: '',
      title: '',
      content: '',
      order: 0,
    },
  })

  const handleSubmitForm = useCallback(
    async (data: CreateLessonDTO) => {
      try {
        const response = await LessonService.createLesson(data)
        if (response.data.id) {
          toast.success('Aula criado com sucesso')
          navigate(ADMIN_PAGES.listLessons)
        }
      } catch (error) {
        toast.error('Erro ao criar a aula, tente novamente mais tarde')
        navigate(ADMIN_PAGES.listLessons)
      }
    },
    [navigate],
  )

  const { isSubmitting } = form.formState
  return { form, isSubmitting, handleSubmitForm }
}
