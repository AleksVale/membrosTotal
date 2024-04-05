import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { ADMIN_PAGES } from '@/utils/constants/routes'
import { CalendarPlus } from 'lucide-react'

interface HeaderMeetingProps {
  label: string
  showButton?: boolean
}

export function HeaderMeeting({
  label,
  showButton = false,
}: Readonly<HeaderMeetingProps>) {
  return (
    <section className="mb-6 flex justify-between">
      <h1 className="text-3xl">{label}</h1>
      {showButton && (
        <Button asChild variant={'default'}>
          <Link
            className="flex items-center gap-2"
            to={ADMIN_PAGES.createMeeting}
          >
            Criar reunião <CalendarPlus size={20} />
          </Link>
        </Button>
      )}
    </section>
  )
}
