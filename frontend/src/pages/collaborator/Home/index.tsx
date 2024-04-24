import { BaseHeader } from '@/components/BaseHeader'
import { useHome } from './useHome'
import { MeetingCard } from '@/components/MeetingCard'

export default function CollaboratorHome() {
  const { meetings } = useHome()
  return (
    <div>
      <BaseHeader label="Bem vindo" />
      <h1>Suas próximas reuniões</h1>
      {meetings.map((meeting) => (
        <MeetingCard meeting={meeting} key={meeting.id} />
      ))}
      <h1>Seus avisos</h1>
    </div>
  )
}
