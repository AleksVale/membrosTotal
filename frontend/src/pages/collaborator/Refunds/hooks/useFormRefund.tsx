import AutocompleteService, {
  Autocomplete,
} from '@/services/autocomplete.service'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function useFormRefund() {
  const navigation = useNavigate()
  const [refundTypeTypeOptions, setRefundTypeOptions] = useState<
    Autocomplete[]
  >([])
  const fetchPaymentTypeOptions = useCallback(async () => {
    const response = await AutocompleteService.fetchAutocomplete([
      'refundTypes',
    ])
    setRefundTypeOptions(response.data.refundTypes ?? [])
  }, [])

  useEffect(() => {
    fetchPaymentTypeOptions()
  }, [fetchPaymentTypeOptions])
  const goBack = () => {
    navigation(-1)
  }
  return { goBack, refundTypeTypeOptions }
}
