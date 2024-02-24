import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import AutocompleteService, {
  Autocomplete,
} from '@/services/autocomplete.service'
import { FilterPayment, filterPaymentchema } from '../validation'

export function useFilterPayment() {
  const navigate = useNavigate()
  const [, setSearchParams] = useSearchParams()
  const [isOpen, setIsOpen] = useState(true)
  const form = useForm<FilterPayment>({
    resolver: zodResolver(filterPaymentchema),
    defaultValues: {
      status: 'ALL',
    },
  })
  const [paymentTypeOptions, setPaymentTypeOptions] = useState<Autocomplete[]>(
    [],
  )

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

  const fetchPaymentTypeOptions = useCallback(async () => {
    const response = await AutocompleteService.fetchAutocomplete([
      'paymentType',
    ])
    setPaymentTypeOptions(response.data.paymentType ?? [])
  }, [])

  const goBack = useCallback(() => {
    navigate(-1)
  }, [navigate])

  useEffect(() => {
    fetchPaymentTypeOptions()
  }, [fetchPaymentTypeOptions])
  return {
    form,
    handleSubmitForm,
    isOpen,
    setIsOpen,
    handleClearFilter,
    paymentTypeOptions,
    goBack,
  }
}
