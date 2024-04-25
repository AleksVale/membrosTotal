import { HomeService, NotificationResponseDTO } from '@/services/home.service'
import { Meeting } from '@/services/meeting.service'
import { useCallback, useEffect, useState } from 'react'

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

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { meetings, notifications }
}
