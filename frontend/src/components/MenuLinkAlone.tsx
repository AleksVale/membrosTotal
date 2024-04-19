import { ChevronRight } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
interface MenuLinkAloneProps {
  to: string
  label: string
  icon?: JSX.Element
}
export function MenuLinkAlone({
  to,
  label,
  icon,
}: Readonly<MenuLinkAloneProps>) {
  const { pathname } = useLocation()

  return (
    <Link
      data-active={
        pathname.split('/')[2] === to.split('/')[2].split('?')[0]
          ? 'true'
          : 'false'
      }
      className="hover:bg-primary hover:text-primary-foreground data-[active=true]:bg-primary data-[active=true]:text-primary-foreground flex items-center gap-3 rounded-lg py-2 transition-all"
      to={to}
    >
      {icon ?? <ChevronRight size={14} />}
      {label}
    </Link>
  )
}
