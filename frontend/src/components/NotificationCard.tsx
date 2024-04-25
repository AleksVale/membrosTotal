import { Button } from './ui/button'
import { NotificationResponseDTO } from '@/services/home.service'

interface NotificationCardProps {
  notification: NotificationResponseDTO
}

export function NotificationCard({
  notification,
}: Readonly<NotificationCardProps>) {
  return (
    <div
      className="bg-secondary my-2 flex w-full items-center justify-between gap-28 rounded p-6"
      key={notification.id}
    >
      <div className="flex flex-1 justify-between gap-2">
        <div>
          <p>Título:</p>
          <p>{notification.title}</p>
        </div>
        <div>
          <p>Mensagem:</p>
          <p>{notification.message}</p>
        </div>
      </div>
      <Button>Marcar como vista</Button>
    </div>
  )
}
