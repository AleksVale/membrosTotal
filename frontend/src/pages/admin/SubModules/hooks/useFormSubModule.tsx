import AutocompleteService, {
  Autocomplete,
} from '@/services/autocomplete.service'
import { useCallback, useEffect, useState } from 'react'

export function useFormSubModule() {
  const [moduleOptions, setModuleOptions] = useState<Autocomplete[]>([])
  const getModuleOptions = useCallback(async () => {
    const response = await AutocompleteService.fetchAutocomplete(['modules'])
    setModuleOptions(response.data.modules ?? [])
  }, [])
  useEffect(() => {
    getModuleOptions()
  }, [getModuleOptions])
  return { moduleOptions }
}
