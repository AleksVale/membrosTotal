import AutocompleteService, {
  Autocomplete,
} from '@/services/autocomplete.service'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function useFormPaymentRequest() {
  const navigation = useNavigate()
  const [paymentRequestTypeOptions, setPaymentRequestTypeOptions] = useState<
    Autocomplete[]
  >([])
  const fetchPaymentTypeOptions = useCallback(async () => {
    const response = await AutocompleteService.fetchAutocomplete([
      'paymentRequest',
    ])
    setPaymentRequestTypeOptions(response.data.paymentRequest ?? [])
  }, [])

  useEffect(() => {
    fetchPaymentTypeOptions()
  }, [fetchPaymentTypeOptions])
  const goBack = () => {
    navigation(-1)
  }
  return { goBack, paymentRequestTypeOptions }
}
