import AutocompleteService, {
  Autocomplete,
} from '@/services/autocomplete.service'
import React, { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function useCreateEditMeetingForm() {
  const navigate = useNavigate()
  const [userOptions, setUserOptions] = React.useState<Autocomplete[]>([])

  const fetchUserOptions = useCallback(async () => {
    const response = await AutocompleteService.fetchAutocomplete(['users'])
    setUserOptions(response.data.users ?? [])
  }, [])

  const goBack = () => {
    navigate(-1)
  }

  useEffect(() => {
    fetchUserOptions()
  }, [fetchUserOptions])

  return {
    userOptions,
    goBack,
  }
}
