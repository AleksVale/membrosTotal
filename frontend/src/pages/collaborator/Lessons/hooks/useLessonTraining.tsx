import { ILesson } from '@/pages/admin/Lessons/interfaces'
import ColaboratorService from '@/services/colaborator.service'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

const useListLesson = () => {
  const { moduleId, id } = useParams()
  const [lessons, setLessons] = useState<ILesson[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLessons = async () => {
      setIsLoading(true)

      try {
        const response = await ColaboratorService.getLessons(moduleId)

        setLessons(response.data)
      } catch (error) {
        setError('Failed to fetch lessons')
      } finally {
        setIsLoading(false)
      }
    }

    fetchLessons()
  }, [moduleId])

  return { lessons, isLoading, error, id, moduleId }
}

export default useListLesson
