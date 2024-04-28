import { ILesson } from '@/pages/admin/Lessons/interfaces'
import ColaboratorService from '@/services/colaborator.service'
import { isAxiosError } from 'axios'
import { useState, useEffect, useCallback } from 'react'
import ReactPlayer from 'react-player'
import { useParams, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'

const useListLesson = () => {
  const { submoduleId } = useParams()
  const [searchParams] = useSearchParams()
  const [lessons, setLessons] = useState<ILesson[]>([])
  const [selectedLesson, setSelectedLesson] = useState<ILesson>()
  const [sawLesson, setSawLesson] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [videoError, setVideoError] = useState<string | null>(null)
  const submoduleName = searchParams.get('submoduleName')

  const fetchLessons = useCallback(async () => {
    setIsLoading(true)

    try {
      const response = await ColaboratorService.getLessons(submoduleId)
      setSelectedLesson(response.data[0])
      setSawLesson(
        response.data[0].UserViewLesson.some(
          (view) => view.lessonId === response.data[0].id,
        ),
      )
      setLessons(response.data)
    } catch (error) {
      setError('Failed to fetch lessons')
    } finally {
      setIsLoading(false)
    }
  }, [submoduleId])
  useEffect(() => {
    fetchLessons()
  }, [fetchLessons, submoduleId])

  const handleInvalidURL = useCallback(() => {
    setVideoError('Video não encontrado, entre em contato com um administrador')
  }, [])

  const handleChangeLesson = useCallback(
    (lesson: ILesson) => {
      if (!ReactPlayer.canPlay(lesson.content)) {
        handleInvalidURL()
      } else {
        setVideoError(null)
      }
      setSawLesson(
        lesson.UserViewLesson.some((view) => view.lessonId === lesson.id),
      )
      setSelectedLesson(lesson)
    },
    [handleInvalidURL],
  )

  const handleViewLesson = useCallback(
    async (id?: number) => {
      try {
        await ColaboratorService.viewLesson(id)
        fetchLessons()
      } catch (error) {
        toast.error(
          isAxiosError(error)
            ? error.response?.data.message
            : 'Erro ao marcar aula como vista',
        )
      }
    },
    [fetchLessons],
  )

  return {
    lessons,
    isLoading,
    error,
    submoduleId,
    selectedLesson,
    handleChangeLesson,
    videoError,
    handleInvalidURL,
    submoduleName,
    handleViewLesson,
    sawLesson,
  }
}

export default useListLesson
