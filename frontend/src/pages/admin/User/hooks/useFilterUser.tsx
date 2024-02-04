import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { FilterUserForm, filterUserSchema } from '../interfaces'
import { useCallback, useState } from 'react'

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
  return {
    form,
    handleSubmitForm,
    isOpen,
    setIsOpen,
    handleClearFilter,
  }
}
