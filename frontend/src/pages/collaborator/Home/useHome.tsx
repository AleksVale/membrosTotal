import { HomeService } from '@/services/home.service'
import { Meeting } from '@/services/meeting.service'
import { useCallback, useEffect, useState } from 'react'

export function useHome() {
  const [meetings, setMeetings] = useState<Meeting[]>([])

  const fetchData = useCallback(async () => {
    const response = await HomeService.get()
    setMeetings(response.meetings)
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { meetings }
}
