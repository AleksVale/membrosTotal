import { Meeting, MeetingStatus } from '@/services/meeting.service'
import { Button } from './ui/button'
import { StatusBadge } from './StatusBadge'
import { Link } from 'react-router-dom'

interface MeetingCardProps {
  meeting: Meeting
}

export function MeetingCard({ meeting }: Readonly<MeetingCardProps>) {
  return (
    <div
      className="bg-secondary my-2 flex w-full items-center justify-between gap-28 rounded p-6"
      key={meeting.id}
    >
      <div className="flex flex-1 justify-between gap-2">
        <div>
          <p>Título:</p>
          <p>{meeting.title}</p>
        </div>
        <p>
          <p>Data:</p>
          <p>{meeting.title}</p>
        </p>
        <div>
          <p>Status:</p>
          <StatusBadge status={MeetingStatus[meeting.status]} />
        </div>
      </div>
      <Button asChild>
        <Link to={meeting.link} target="_blank" rel="noopener noreferrer">
          Acessar reunião
        </Link>
      </Button>
    </div>
  )
}
