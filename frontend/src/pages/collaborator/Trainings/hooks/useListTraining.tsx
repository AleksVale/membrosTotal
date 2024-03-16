import { useState, useEffect } from 'react'

interface Training {
  id: number
  title: string
  description: string
  tutor: string
  thumbnail?: string
  createdAt: Date
  updatedAt: Date
}

const useListTraining = () => {
  const [trainings, setTrainings] = useState<Training[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTrainings = async () => {
      setIsLoading(true)

      try {
        // Replace this with your actual API call to fetch the training list
        const response = await fetch('/api/trainings')
        const data = await response.json()

        setTrainings(data)
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
