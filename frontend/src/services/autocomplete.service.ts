import http from '@/lib/http'

export interface Autocomplete {
  id: number
  name: string
  fullname: string
  label: string
}

interface AutocompleteResponse {
  profiles?: Autocomplete[]
  users?: Autocomplete[]
}

const fetchAutocomplete = async (fields: string[]) => {
  return http.get<AutocompleteResponse>(
    `/autocomplete?fields=${fields.join(',')}`,
  )
}

const AutocompleteService = {
  fetchAutocomplete,
}

export default AutocompleteService
