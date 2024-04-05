import AutocompleteService, {
  Autocomplete,
} from '@/services/autocomplete.service'
import React, { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function useCreateEditUserForm() {
  const navigate = useNavigate()
  const [profileOptions, setProfileOptions] = React.useState<Autocomplete[]>([])

  const fetchProfileOptions = useCallback(async () => {
    const response = await AutocompleteService.fetchAutocomplete(['profiles'])
    setProfileOptions(response.data.profiles ?? [])
  }, [])

  const goBack = () => {
    navigate(-1)
  }

  useEffect(() => {
    fetchProfileOptions()
  }, [fetchProfileOptions])

  return {
    profileOptions,
    goBack,
  }
}
