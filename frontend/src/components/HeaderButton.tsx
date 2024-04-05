import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { Plus } from 'lucide-react'

interface HeaderbuttonProps {
  label: string
  showButton?: boolean
  navigateTo?: string
  labelButton?: string
}

export function Headerbutton({
  label,
  navigateTo,
  labelButton,
  showButton = false,
}: Readonly<HeaderbuttonProps>) {
  return (
    <section className="mb-6 flex justify-between">
      <h1 className="text-3xl">{label}</h1>
      {showButton && navigateTo && (
        <Button asChild variant={'default'}>
          <Link className="flex items-center gap-2" to={navigateTo}>
            {labelButton} <Plus size={20} />
          </Link>
        </Button>
      )}
    </section>
  )
}
