import { HomeService, NotificationResponseDTO } from '@/services/home.service'
import { Meeting } from '@/services/meeting.service'
import NotificationService from '@/services/notification.service'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export function useHome() {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [notifications, setNotifications] = useState<NotificationResponseDTO[]>(
    [],
  )

  const fetchData = useCallback(async () => {
    const response = await HomeService.get()
    setMeetings(response.meetings)
    setNotifications(response.notifications)
  }, [])

  const readNotification = useCallback(async (id: number) => {
    await NotificationService.readNotification(id)
    toast.success('Notificação marcada como lida')
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { meetings, notifications, readNotification }
}
