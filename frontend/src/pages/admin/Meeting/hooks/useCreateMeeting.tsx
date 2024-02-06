import { zodResolver } from '@hookform/resolvers/zod'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import AutocompleteService, {
  Autocomplete,
} from '@/services/autocomplete.service'
import { useNavigate } from 'react-router-dom'
import { ADMIN_PAGES } from '@/utils/constants/routes'
import { toast } from 'react-toastify'
import { CreateMeetingDTO, createMeetingSchema } from './validation'
import MeetingService from '@/services/meeting.service'

export function useCreateMeeting() {
  const navigate = useNavigate()
  const [user, setUser] = useState<Autocomplete[]>([])
  const form = useForm<CreateMeetingDTO>({
    resolver: zodResolver(createMeetingSchema),
    defaultValues: {
      description: '',
      link: '',
      meetingDate: undefined,
      title: '',
      users: [],
    },
  })
  const [userOptions, setUserOptions] = React.useState<Autocomplete[]>([])

  const handleSubmitForm = useCallback(
    async (data: CreateMeetingDTO) => {
      console.log(data)
      const users = data.users?.map((user) => user.id)
      const response = await MeetingService.createMeeting({ ...data, users })
      if (response.data.success) {
        toast.success('Reunião marcada!')
        navigate(ADMIN_PAGES.listUsers)
      }
    },
    [navigate],
  )
  const fetchUserOptions = useCallback(async () => {
    const response = await AutocompleteService.fetchAutocomplete(['users'])
    setUserOptions(response.data.users ?? [])
  }, [])

  const goBack = () => {
    navigate(-1)
  }

  useEffect(() => {
    fetchUserOptions()
  }, [fetchUserOptions])

  const { isSubmitting } = form.formState

  return {
    userOptions,
    form,
    isSubmitting,
    handleSubmitForm,
    goBack,
    user,
    setUser,
  }
}
