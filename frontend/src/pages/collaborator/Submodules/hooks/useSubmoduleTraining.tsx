import { ISubModule } from '@/pages/admin/SubModules/interfaces'
import ColaboratorService from '@/services/colaborator.service'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

const useListSubmodule = () => {
  const { moduleId, id } = useParams()
  const [submodules, setSubmodules] = useState<ISubModule[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSubmodules = async () => {
      setIsLoading(true)

      try {
        const response = await ColaboratorService.getSubmodules(moduleId)

        setSubmodules(response.data)
      } catch (error) {
        setError('Failed to fetch submodules')
      } finally {
        setIsLoading(false)
      }
    }

    fetchSubmodules()
  }, [moduleId])

  return { submodules, isLoading, error, id, moduleId }
}

export default useListSubmodule
