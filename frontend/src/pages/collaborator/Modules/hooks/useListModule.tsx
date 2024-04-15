import { IModule } from '@/pages/admin/Modules/interfaces'
import ColaboratorService from '@/services/colaborator.service'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

const useListModule = () => {
  const { id } = useParams()
  const [modules, setModules] = useState<IModule[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchModules = async () => {
      setIsLoading(true)

      try {
        console.log('aqui')
        const response = await ColaboratorService.getModules(id)

        setModules(response.data)
      } catch (error) {
        setError('Failed to fetch submodules')
      } finally {
        setIsLoading(false)
      }
    }

    fetchModules()
  }, [id])

  return { modules, isLoading, error, id }
}

export default useListModule
