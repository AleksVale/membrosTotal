import { Autocomplete } from '@/services/autocomplete.service'
import { useState } from 'react'

export function useFormPayment() {
  const [expertOptions] = useState<Autocomplete[]>([])

  return { expertOptions }
}
