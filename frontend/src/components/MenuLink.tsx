import { Link, useLocation } from 'react-router-dom'
interface MenuLinkProps {
  to: string
  icon: JSX.Element
  label: string
}
export function MenuLink({ to, icon, label }: Readonly<MenuLinkProps>) {
  const { pathname } = useLocation()
  return (
    <Link
      data-active={pathname === to ? 'true' : 'false'}
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary data-[active=true]:text-primary"
      to={to}
    >
      {icon}
      {label}
    </Link>
  )
}
