import { MeetingStatus } from '@/services/meeting.service'
import { PaymentLabel, UserStatusLabel } from '@/utils/interfaces/payment'
import { Badge } from './ui/badge'

interface StatusBadgeProps {
  status: MeetingStatus | PaymentLabel | UserStatusLabel
}

export function StatusBadge({ status }: Readonly<StatusBadgeProps>) {
  const statusMap = {
    [MeetingStatus.CANCELED]: 'bg-destructive hover:bg-destructive ',
    [MeetingStatus.DONE]: 'bg-green-500 hover:bg-green-600',
    [MeetingStatus.PENDING]: 'bg-primary hover:bg-primary',
    [PaymentLabel.PAID]: 'bg-green-500 hover:bg-green-600',
    [PaymentLabel.CANCELLED]: 'bg-destructive hover:bg-destructive ',
    [PaymentLabel.APPROVED]: 'bg-green-500 hover:bg-green-600',
    [PaymentLabel.ALL]: 'bg-green-500 hover:bg-green-600',
    [UserStatusLabel.ACTIVE]: 'bg-green-500 hover:bg-green-600',
    [UserStatusLabel.INACTIVE]: 'bg-destructive hover:bg-destructive ',
  }

  return <Badge className={`${statusMap[status]} m-0`}>{status}</Badge>
}
