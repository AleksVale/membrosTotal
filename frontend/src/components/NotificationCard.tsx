import { Button } from './ui/button'
import { NotificationResponseDTO } from '@/services/home.service'

interface NotificationCardProps {
  notification: NotificationResponseDTO
  readNotification: (id: number) => Promise<void>
}

export function NotificationCard({
  notification,
  readNotification,
}: Readonly<NotificationCardProps>) {
  return (
    <div
      className="bg-muted-foreground my-2 flex w-full items-center justify-between gap-28 rounded p-6"
      key={notification.id}
    >
      <div className="text-muted flex flex-1 justify-between gap-2">
        <div>
          <p>Título:</p>
          <p>{notification.title}</p>
        </div>
        <div>
          <p>Mensagem:</p>
          <p>{notification.description}</p>
        </div>
      </div>
      <Button
        variant={'secondary'}
        onClick={() => {
          readNotification(notification.id)
        }}
      >
        Marcar como vista
      </Button>
    </div>
  )
}
