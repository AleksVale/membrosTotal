import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { ADMIN_PAGES } from '@/utils/constants/routes'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { CreateMeetingDTO, createMeetingSchema } from './validation'
import MeetingService from '@/services/meeting.service'
dayjs.extend(utc)
export function useEditMeeting() {
  const navigate = useNavigate()
  const { id } = useParams()
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

  const { reset } = form

  const handleSubmitForm = useCallback(
    async (data: CreateMeetingDTO) => {
      if (!id) return
      const response = await MeetingService.update(data, id)
      if (response.data.success) {
        toast.success('Reunião editada com sucesso')
        navigate(ADMIN_PAGES.listMeetings)
      }
    },
    [id, navigate],
  )

  const fetchMeeting = useCallback(async () => {
    const { data } = await MeetingService.get(id ?? '0')
    reset({
      description: data.description,
      link: data.link,
      meetingDate: dayjs(data.date).utc(false).toDate(),
      title: data.title,
      users: data.UserMeeting.map((userMeeting) => ({
        id: userMeeting.userId,
        fullName: `${userMeeting.User.firstName} ${userMeeting.User.lastName}`,
      })),
    })
  }, [id, reset])

  useEffect(() => {
    fetchMeeting()
  }, [fetchMeeting])

  const { isSubmitting } = form.formState

  return {
    form,
    isSubmitting,
    handleSubmitForm,
  }
}
