import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import AutocompleteService, {
  Autocomplete,
} from '@/services/autocomplete.service'
import { FilterMeeting, filterMeetingSchema } from './validation'
import { format } from 'date-fns'

export function useFilterMeeting() {
  const [, setSearchParams] = useSearchParams()
  const [isOpen, setIsOpen] = useState(true)
  const form = useForm<FilterMeeting>({
    resolver: zodResolver(filterMeetingSchema),
    defaultValues: {
      title: '',
      date: undefined,
      status: 'ALL',
    },
  })
  const [profileOptions, setProfileOptions] = useState<Autocomplete[]>([])

  const { reset } = form

  const handleSubmitForm = useCallback(
    async (data: FilterMeeting) => {
      setSearchParams((prevParams) => {
        const oldParams = new URLSearchParams(prevParams)
        const newParams = new URLSearchParams()
        newParams.set('page', oldParams.get('page') ?? '1')
        newParams.set('per_page', oldParams.get('per_page') ?? '10')

        Object.keys(data).forEach((key) => {
          const dataKey = key as keyof FilterMeeting
          if (data[dataKey] === 'ALL') return
          if (key === 'date' && data[dataKey]) {
            const value = data[dataKey] as Date
            newParams.set(key, format(value, 'yyyy-MM-dd'))
            return
          }
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

  const fetchProfileOptions = useCallback(async () => {
    const response = await AutocompleteService.fetchAutocomplete(['profiles'])
    setProfileOptions(response.data.profiles ?? [])
  }, [])

  useEffect(() => {
    fetchProfileOptions()
  }, [fetchProfileOptions])
  return {
    form,
    handleSubmitForm,
    isOpen,
    setIsOpen,
    handleClearFilter,
    profileOptions,
  }
}
