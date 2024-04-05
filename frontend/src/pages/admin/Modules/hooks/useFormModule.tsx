import AutocompleteService, {
  Autocomplete,
} from '@/services/autocomplete.service'
import { useCallback, useEffect, useState } from 'react'

export function useFormModule() {
  const [trainingOptions, setTrainingOptions] = useState<Autocomplete[]>([])
  const getTrainingOptions = useCallback(async () => {
    const response = await AutocompleteService.fetchAutocomplete(['trainings'])
    setTrainingOptions(response.data.trainings ?? [])
  }, [])
  useEffect(() => {
    getTrainingOptions()
  }, [getTrainingOptions])
  return { trainingOptions }
}
