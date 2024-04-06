import { useForm } from 'react-hook-form'
import { createLesson, CreateLessonDTO } from '../validation'
import { useNavigate, useParams } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect } from 'react'
import { toast } from 'react-toastify'
import { ADMIN_PAGES } from '@/utils/constants/routes'
import LessonService from '@/services/lesson.service'

export function useEditLesson() {
  const navigate = useNavigate()
  const { id } = useParams()
  const form = useForm<CreateLessonDTO>({
    resolver: zodResolver(createLesson),
    defaultValues: {
      description: '',
      title: '',
      content: '',
    },
  })

  const { reset } = form

  const getLesson = useCallback(async () => {
    const response = await LessonService.getLesson(id)
    reset({ ...response.data.lesson, file: [response.data.stream] })
  }, [id, reset])

  useEffect(() => {
    getLesson()
  }, [getLesson])

  const handleSubmitForm = useCallback(
    async (data: CreateLessonDTO) => {
      if (!id) {
        navigate(ADMIN_PAGES.listLessons)
        return
      }
      const response = await LessonService.update(data, id)
      if (response.data.id) {
        try {
          // const fileResponse = await ModuleService.createPhotoModule(
          //   data.file[0],
          //   response.data.id,
          // )
          if (response.data.id) {
            toast.success('Aula editada com sucesso')
            navigate(ADMIN_PAGES.listLessons)
          }
        } catch (error) {
          toast.error('Erro ao enviar a foto, tente editar mais tarde.')
          navigate(ADMIN_PAGES.listLessons)
        }
      }
    },
    [id, navigate],
  )

  const { isSubmitting } = form.formState
  return { form, isSubmitting, handleSubmitForm }
}
