import { BaseHeader } from '@/components/BaseHeader'
import { useHome } from './useHome'

export default function CollaboratorHome() {
  const { meetings } = useHome()
  return (
    <div>
      <BaseHeader label="Home" />
      <h1>Suas próximas reuniões</h1>
      {meetings.map((meeting) => (
        <div
          className="bg-secondary m-2 flex w-full gap-2 rounded p-6"
          key={meeting.id}
        >
          <p>{meeting.title}</p>
          <p>{meeting.date}</p>
          <p>{meeting.link}</p>
        </div>
      ))}
    </div>
  )
}
