import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { FilterUserForm, filterUserSchema } from '../interfaces'
import { useCallback, useEffect, useState } from 'react'
import AutocompleteService, {
  Autocomplete,
} from '@/services/autocomplete.service'

export function useFilterUser() {
  const [, setSearchParams] = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)
  const form = useForm<FilterUserForm>({
    resolver: zodResolver(filterUserSchema),
    defaultValues: {
      email: '',
      document: '',
      name: '',
      instagram: '',
      phone: '',
    },
  })
  const [profileOptions, setProfileOptions] = useState<Autocomplete[]>([])

  const { reset } = form

  const handleSubmitForm = useCallback(
    async (data: FilterUserForm) => {
      setSearchParams((prevParams) => {
        const oldParams = new URLSearchParams(prevParams)
        const newParams = new URLSearchParams()
        newParams.set('page', oldParams.get('page') ?? '1')
        newParams.set('per_page', oldParams.get('per_page') ?? '10')

        Object.keys(data).forEach((key) => {
          const dataKey = key as keyof FilterUserForm
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
