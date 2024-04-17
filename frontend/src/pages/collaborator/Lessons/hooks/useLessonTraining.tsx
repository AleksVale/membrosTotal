import { ILesson } from '@/pages/admin/Lessons/interfaces'
import ColaboratorService from '@/services/colaborator.service'
import { useState, useEffect, useCallback } from 'react'
import ReactPlayer from 'react-player'
import { useParams, useSearchParams } from 'react-router-dom'

const useListLesson = () => {
  const { submoduleId } = useParams()
  const [searchParams] = useSearchParams()
  const [lessons, setLessons] = useState<ILesson[]>([])
  const [selectedLesson, setSelectedLesson] = useState<ILesson>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [videoError, setVideoError] = useState<string | null>(null)
  const submoduleName = searchParams.get('submoduleName')

  useEffect(() => {
    const fetchLessons = async () => {
      setIsLoading(true)

      try {
        const response = await ColaboratorService.getLessons(submoduleId)
        setSelectedLesson(response.data[0])
        setLessons(response.data)
      } catch (error) {
        setError('Failed to fetch lessons')
      } finally {
        setIsLoading(false)
      }
    }

    fetchLessons()
  }, [submoduleId])

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
      setSelectedLesson(lesson)
    },
    [handleInvalidURL],
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
  }
}

export default useListLesson
