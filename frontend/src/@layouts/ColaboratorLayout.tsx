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
import {
  HandCoins,
  Home,
  Landmark,
  Speech,
  User,
  UserCircle2,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { COLLABORATOR_PAGES } from '@/utils/constants/routes'
import { MenuLink } from '@/components/MenuLink'

export function ColaboratorLayout() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { profile, logout } = useAuth()
  useEffect(() => {
    if (profile !== Profile.EMPLOYEE) navigate('/')
  }, [profile, navigate, pathname])
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r border-r-muted-foreground bg-muted lg:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link className="flex items-center gap-2 font-semibold" to="#">
              <Home className="h-6 w-6" />
              <span className="">Painel do colaborador</span>
            </Link>
            <Button className="ml-auto h-8 w-8" size="icon" variant="outline">
              <BellIcon className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-sm font-medium">
              <MenuLink
                to={COLLABORATOR_PAGES.home}
                icon={<HomeIcon className="h-6 w-6" />}
                label="Home"
              />
              <MenuLink
                to={COLLABORATOR_PAGES.profile}
                icon={<UserCircle2 className="h-6 w-6" />}
                label="Perfil"
              />
              <MenuLink
                to={COLLABORATOR_PAGES.listMeetings}
                icon={<Speech className="h-6 w-6" />}
                label="Reuniões"
              />
              <MenuLink
                to={COLLABORATOR_PAGES.listPayments}
                icon={<Landmark className="h-6 w-6" />}
                label="Pagamentos"
              />
              <MenuLink
                to={COLLABORATOR_PAGES.listPaymentRequest}
                icon={<HandCoins className="h-6 w-6" />}
                label="Solicitação de pagamentos"
              />
            </nav>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 sm:gap-8 border-b bg-muted pl-2">
          <Link className="lg:hidden" to="#">
            <Home className="h-6 w-6" />
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
                className="rounded-full border border-gray-200 w-8 h-8 dark:border-gray-800 mr-6"
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
              <DropdownMenuItem>Support</DropdownMenuItem>
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

function HomeIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}
