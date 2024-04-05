import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import AutocompleteService, {
  Autocomplete,
} from '@/services/autocomplete.service'
import { FilterPayment, filterPaymentchema } from '../validation'

export function useFilterPaymentRequest() {
  const [, setSearchParams] = useSearchParams()
  const [isOpen, setIsOpen] = useState(true)
  const form = useForm<FilterPayment>({
    resolver: zodResolver(filterPaymentchema),
    defaultValues: {
      paymentRequestTypeId: '0',
    },
  })
  const [paymentRequestTypeOptions, setPaymentRequestTypeOptions] = useState<
    Autocomplete[]
  >([])

  const { reset } = form

  const handleSubmitForm = useCallback(
    async (data: FilterPayment) => {
      setSearchParams((prevParams) => {
        const oldParams = new URLSearchParams(prevParams)
        const newParams = new URLSearchParams()
        newParams.set('page', oldParams.get('page') ?? '1')
        newParams.set('per_page', oldParams.get('per_page') ?? '10')

        Object.keys(data).forEach((key) => {
          const dataKey = key as keyof FilterPayment
          if (data[dataKey] === '0') return
          if (data[dataKey]) newParams.set(key, data[dataKey])
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

  const fetchPaymentTypeOptions = useCallback(async () => {
    const response = await AutocompleteService.fetchAutocomplete([
      'paymentRequest',
    ])
    setPaymentRequestTypeOptions(
      response.data.paymentRequest
        ? [{ id: 0, label: 'Todos' }, ...response.data.paymentRequest]
        : [],
    )
    reset({
      paymentRequestTypeId: '0',
    })
  }, [reset])

  useEffect(() => {
    fetchPaymentTypeOptions()
  }, [fetchPaymentTypeOptions])
  return {
    form,
    handleSubmitForm,
    isOpen,
    setIsOpen,
    handleClearFilter,
    paymentRequestTypeOptions,
  }
}
