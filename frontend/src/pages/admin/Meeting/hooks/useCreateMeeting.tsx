import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { ADMIN_PAGES } from '@/utils/constants/routes'
import { toast } from 'react-toastify'
import { CreateMeetingDTO, createMeetingSchema } from './validation'
import MeetingService from '@/services/meeting.service'

export function useCreateMeeting() {
  const navigate = useNavigate()
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

  const { isSubmitting } = form.formState

  return {
    form,
    isSubmitting,
    handleSubmitForm,
  }
}
