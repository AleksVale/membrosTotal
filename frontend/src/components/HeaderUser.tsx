import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { ADMIN_PAGES } from '@/utils/constants/routes'
import { UserPlus2 } from 'lucide-react'

interface HeaderUserProps {
  label: string
  showButton?: boolean
}

export function HeaderUser({ label, showButton = false }: HeaderUserProps) {
  return (
    <section className="mb-6 flex justify-between">
      <h1 className="text-3xl">{label}</h1>
      {showButton && (
        <Button asChild variant={'default'}>
          <Link className="flex items-center gap-2" to={ADMIN_PAGES.createUser}>
            Criar usuário <UserPlus2 size={20} />
          </Link>
        </Button>
      )}
    </section>
  )
}
