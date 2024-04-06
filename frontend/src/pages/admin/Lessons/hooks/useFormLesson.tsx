import AutocompleteService, {
  Autocomplete,
} from '@/services/autocomplete.service'
import { useCallback, useEffect, useState } from 'react'

export function useFormLesson() {
  const [subModules, setSubModules] = useState<Autocomplete[]>([])
  const getSubModules = useCallback(async () => {
    const response = await AutocompleteService.fetchAutocomplete(['submodules'])
    setSubModules(response.data.submodules ?? [])
  }, [])
  useEffect(() => {
    getSubModules()
  }, [getSubModules])
  return { subModules }
}
