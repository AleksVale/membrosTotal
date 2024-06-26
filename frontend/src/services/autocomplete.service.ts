import http from '@/lib/http'

export interface Autocomplete {
  id: number
  name?: string
  fullName?: string
  label?: string
}

interface AutocompleteResponse {
  profiles?: Autocomplete[]
  users?: Autocomplete[]
  paymentTypes?: Autocomplete[]
  experts?: Autocomplete[]
  paymentRequest?: Autocomplete[]
  refundTypes?: Autocomplete[]
  trainings?: Autocomplete[]
  modules?: Autocomplete[]
  submodules?: Autocomplete[]
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
