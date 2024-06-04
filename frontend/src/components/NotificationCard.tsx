import { format } from 'date-fns'
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
      className="bg-muted-foreground my-2 flex w-full items-center justify-between rounded p-6"
      key={notification.id}
    >
      <div className="w-full flex-1">
        <p className="font-bold">Título:</p>
        <p className="font-bold">{notification.title}</p>
        <p>Mensagem:</p>
        <p>{notification.description}</p>
        <p>Data:</p>
        <p>{format(notification.createdAt, 'dd/MM/yyyy')}</p>
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
