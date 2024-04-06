import { ITraining } from '@/pages/admin/Training/interfaces'
import ColaboratorService from '@/services/colaborator.service'
import { useState, useEffect } from 'react'

const useListTraining = () => {
  const [trainings, setTrainings] = useState<ITraining[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTrainings = async () => {
      setIsLoading(true)

      try {
        const response = await ColaboratorService.getTrainings()

        setTrainings(response.data)
      } catch (error) {
        setError('Failed to fetch trainings')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTrainings()
  }, [])

  return { trainings, isLoading, error }
}

export default useListTraining
