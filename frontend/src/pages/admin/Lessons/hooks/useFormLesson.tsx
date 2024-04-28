import AutocompleteService, {
  Autocomplete,
} from '@/services/autocomplete.service'
import { useCallback, useEffect, useState } from 'react'

export function useFormLesson() {
  const [subModules, setSubModules] = useState<Autocomplete[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const getSubModules = useCallback(async () => {
    setLoading(true)
    const response = await AutocompleteService.fetchAutocomplete(['submodules'])
    setSubModules(response.data.submodules ?? [])
    setLoading(false)
  }, [])
  useEffect(() => {
    getSubModules()
  }, [getSubModules])
  return { subModules, loading }
}
