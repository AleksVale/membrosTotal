import { BaseHeader } from '@/components/BaseHeader'
import { useHome } from './useHome'
import { MeetingCard } from '@/components/MeetingCard'
import { NotificationCard } from '@/components/NotificationCard'

export default function CollaboratorHome() {
  const { meetings, notifications, readNotification } = useHome()
  return (
    <div>
      <BaseHeader label="Bem vindo" />
      <h1>Suas próximas reuniões</h1>
      {meetings.map((meeting) => (
        <MeetingCard meeting={meeting} key={meeting.id} />
      ))}
      <h1>Seus avisos</h1>
      {notifications.map((notification) => (
        <NotificationCard
          notification={notification}
          readNotification={readNotification}
          key={notification.id}
        />
      ))}
    </div>
  )
}
