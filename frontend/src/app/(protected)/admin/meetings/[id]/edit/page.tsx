'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MeetingForm } from '@/components/meetings/meeting-form'
import http from '@/lib/http'
import { toast } from 'react-toastify'

interface Meeting {
  id: number
  title: string
  description: string
  link: string
  meetingDate: string
  users: number[]
}

export default function EditMeetingPage() {
  const params = useParams()
  const [meeting, setMeeting] = useState<Meeting | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const response = await http.get(`/meetings/${params.id}`)
        setMeeting(response.data)
      } catch (error) {
        toast.error('Não foi possível carregar os dados da reunião')
      } finally {
        setLoading(false)
      }
    }

    fetchMeeting()
  }, [params.id])

  if (loading) {
    return <div>Carregando...</div>
  }

  if (!meeting) {
    return <div>Reunião não encontrada</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Editar Reunião</CardTitle>
      </CardHeader>
      <CardContent>
        <MeetingForm initialData={meeting} meetingId={meeting.id} />
      </CardContent>
    </Card>
  )
} 