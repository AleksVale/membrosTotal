import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import AutocompleteService, {
  Autocomplete,
} from '@/services/autocomplete.service'
import { FilterRefund, filterRefundchema } from '../validation'

export function useFilterRefund() {
  const navigate = useNavigate()
  const [, setSearchParams] = useSearchParams()
  const [isOpen, setIsOpen] = useState(true)
  const form = useForm<FilterRefund>({
    resolver: zodResolver(filterRefundchema),
  })
  const [refundTypeOptions, setRefundTypeOptions] = useState<Autocomplete[]>([])

  const { reset } = form

  const handleSubmitForm = useCallback(
    async (data: FilterRefund) => {
      setSearchParams((prevParams) => {
        const oldParams = new URLSearchParams(prevParams)
        const newParams = new URLSearchParams()
        newParams.set('page', oldParams.get('page') ?? '1')
        newParams.set('per_page', oldParams.get('per_page') ?? '10')

        Object.keys(data).forEach((key) => {
          const dataKey = key as keyof FilterRefund
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

  const fetchRefundTypeOptions = useCallback(async () => {
    const response = await AutocompleteService.fetchAutocomplete([
      'refundTypes',
    ])
    setRefundTypeOptions(response.data.refundTypes ?? [])
  }, [])

  const goBack = useCallback(() => {
    navigate(-1)
  }, [navigate])

  useEffect(() => {
    fetchRefundTypeOptions()
  }, [fetchRefundTypeOptions])
  return {
    form,
    handleSubmitForm,
    isOpen,
    setIsOpen,
    handleClearFilter,
    refundTypeOptions,
    goBack,
  }
}
