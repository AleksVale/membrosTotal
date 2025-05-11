'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MeetingForm } from '@/components/meetings/meeting-form'

export default function NewMeetingPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nova Reunião</CardTitle>
      </CardHeader>
      <CardContent>
        <MeetingForm />
      </CardContent>
    </Card>
  )
} 