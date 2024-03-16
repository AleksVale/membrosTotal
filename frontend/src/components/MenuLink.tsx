import { Dot } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
interface MenuLinkProps {
  to: string
  label: string
  icon?: JSX.Element
}
export function MenuLink({ to, label, icon }: Readonly<MenuLinkProps>) {
  const { pathname } = useLocation()
  return (
    <Link
      data-active={pathname === to.split('?')[0] ? 'true' : 'false'}
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-primary hover:text-primary-foreground data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
      to={to}
    >
      {icon ?? <Dot size={24} />}
      {label}
    </Link>
  )
}
