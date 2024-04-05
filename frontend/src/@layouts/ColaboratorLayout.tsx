import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from '@/components/ui/dropdown-menu'
import { SVGProps, useEffect } from 'react'
import { JSX } from 'react/jsx-runtime'
import { useAuth } from '@/hooks/useAuth'
import { Profile } from '@/utils/constants/profiles'
import { ModeToggle } from '@/components/ui/mode-toggle'
import { BookOpen, DollarSign, Home, User, User2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { COLLABORATOR_PAGES } from '@/utils/constants/routes'
import { MenuLink } from '@/components/MenuLink'
import { SideMenuCollapsible } from '@/components/SideMenuCollapsible'

export function ColaboratorLayout() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { profile, logout } = useAuth()
  useEffect(() => {
    if (profile !== Profile.EMPLOYEE) navigate('/')
  }, [profile, navigate, pathname])
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <div className="border-r-muted-foreground bg-muted hidden border-r lg:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link className="flex items-center gap-2 font-semibold" to="#">
              <Home className="size-6" />
              <span className="">Painel do colaborador</span>
            </Link>
            <Button className="ml-auto size-8" size="icon" variant="outline">
              <BellIcon className="size-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start gap-2 px-4 text-sm font-medium">
              <SideMenuCollapsible title="Perfil" icon={<User2 size={20} />}>
                <MenuLink to={COLLABORATOR_PAGES.profile} label="Informações" />
                <MenuLink
                  to={COLLABORATOR_PAGES.listMeetings}
                  label="Reuniões"
                />
              </SideMenuCollapsible>
              <SideMenuCollapsible
                title="Financeiro"
                icon={<DollarSign size={20} />}
              >
                <MenuLink
                  to={COLLABORATOR_PAGES.listPayments}
                  label="Pagamentos"
                />
                <MenuLink
                  to={COLLABORATOR_PAGES.listPaymentRequest}
                  label="Solicitação de pagamentos"
                />
                <MenuLink
                  to={COLLABORATOR_PAGES.listRefund}
                  label="Reembolsos"
                />
              </SideMenuCollapsible>
              <SideMenuCollapsible
                title="Treinamentos"
                icon={<BookOpen size={20} />}
              >
                <MenuLink
                  to={COLLABORATOR_PAGES.listTrainings}
                  label="Treinamentos"
                />
              </SideMenuCollapsible>
            </nav>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <header className="bg-muted flex h-14 items-center gap-4 border-b pl-2 sm:gap-8 lg:h-[60px]">
          <Link className="lg:hidden" to="#">
            <Home className="size-6" />
            <span className="sr-only">Home</span>
          </Link>
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold">Colaborador</h1>
          </div>
          <div>
            <ModeToggle />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="mr-6 size-8 rounded-full border border-gray-200 dark:border-gray-800"
                size="icon"
                variant="ghost"
              >
                <Avatar>
                  <AvatarImage src="" />
                  <AvatarFallback>
                    {' '}
                    <User />
                  </AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Meu perfil</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to={COLLABORATOR_PAGES.profile}>Perfil</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Suporte</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function BellIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  )
}
