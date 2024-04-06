import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import AutocompleteService, {
  Autocomplete,
} from '@/services/autocomplete.service'
import { FilterPaymentRequest, filterPaymentRequestchema } from '../validation'

export function useFilterPaymentRequest() {
  const navigate = useNavigate()
  const [, setSearchParams] = useSearchParams()
  const [isOpen, setIsOpen] = useState(true)
  const form = useForm<FilterPaymentRequest>({
    resolver: zodResolver(filterPaymentRequestchema),
  })
  const [paymentRequestTypeOptions, setPaymentRequestTypeOptions] = useState<
    Autocomplete[]
  >([])

  const { reset } = form

  const handleSubmitForm = useCallback(
    async (data: FilterPaymentRequest) => {
      setSearchParams((prevParams) => {
        const oldParams = new URLSearchParams(prevParams)
        const newParams = new URLSearchParams()
        newParams.set('page', oldParams.get('page') ?? '1')
        newParams.set('per_page', oldParams.get('per_page') ?? '10')

        Object.keys(data).forEach((key) => {
          const dataKey = key as keyof FilterPaymentRequest
          if (data[dataKey] === 'ALL') return
          if (data[dataKey]) newParams.set(key, data[dataKey] as string)
        })
        return newParams
      })
    },
    [setSearchParams],
  )

  const handleClearFilter = useCallback(async () => {
    setSearchParams((prevParams) => {
      const oldParams = new URLSearchParams(prevParams)
      const newParams = new URLSearchParams()
      newParams.set('page', oldParams.get('page') ?? '1')
      newParams.set('per_page', oldParams.get('per_page') ?? '10')
      return newParams
    })
    reset()
  }, [reset, setSearchParams])

  const fetchPaymentRequestTypeOptions = useCallback(async () => {
    const response = await AutocompleteService.fetchAutocomplete([
      'paymentRequest',
    ])
    setPaymentRequestTypeOptions(response.data.paymentRequest ?? [])
  }, [])

  const goBack = useCallback(() => {
    navigate(-1)
  }, [navigate])

  useEffect(() => {
    fetchPaymentRequestTypeOptions()
  }, [fetchPaymentRequestTypeOptions])
  return {
    form,
    handleSubmitForm,
    isOpen,
    setIsOpen,
    handleClearFilter,
    paymentRequestTypeOptions,
    goBack,
  }
}
