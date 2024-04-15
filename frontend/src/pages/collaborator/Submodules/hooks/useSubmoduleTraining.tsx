import { ISubModule } from '@/pages/admin/SubModules/interfaces'
import ColaboratorService from '@/services/colaborator.service'
import { useState, useEffect } from 'react'

const useListSubmodule = () => {
  const [submodules, setSubmodules] = useState<ISubModule[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSubmodules = async () => {
      setIsLoading(true)

      try {
        const response = await ColaboratorService.getSubmodules()

        setSubmodules(response.data)
      } catch (error) {
        setError('Failed to fetch submodules')
      } finally {
        setIsLoading(false)
      }
    }

    fetchSubmodules()
  }, [])

  return { submodules, isLoading, error }
}

export default useListSubmodule
