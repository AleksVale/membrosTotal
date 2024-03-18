import { Autocomplete } from '@/services/autocomplete.service'
import { useState } from 'react'

export function useFormPayment() {
  const [expertOption] = useState<Autocomplete[]>([])

  return { expertOption }
}
