import { Outlet, useLocation, useNavigate } from 'react-router-dom'
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
import { BookOpen, DollarSign, Home, Settings, User2 } from 'lucide-react'
import { ADMIN_PAGES } from '@/utils/constants/routes'
import { MenuLink } from '@/components/MenuLink'
import { SideMenuCollapsible } from '@/components/SideMenuCollapsible'
import { MenuLinkAlone } from '@/components/MenuLinkAlone'

export function AdminLayout() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { profile, logout } = useAuth()
  useEffect(() => {
    if (profile !== Profile.ADMIN) navigate('/')
  }, [profile, navigate, pathname])
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <div className="bg-muted hidden border-r lg:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6"></div>
          <div className="sidebar flex flex-col items-center justify-center">
            <div className="flex flex-col items-center gap-2 px-6">
              <img
                src="../src/assets/logo.jpg"
                alt="Foto de Perfil"
                className="size-28 rounded-full"
              />
              <p className="text-xs">Administrador</p>
              <Button className="size-8" size="icon" variant="outline">
                <BellIcon className="size-4" />
                <span className="sr-only">Toggle notifications</span>
              </Button>
              <DropdownMenuSeparator />
            </div>
          </div>
          <div className="flex-1 overflow-auto py-5">
            <nav className="grid items-start gap-2 px-4 text-sm font-medium">
              <MenuLinkAlone
                icon={<Home size={20} />}
                to={ADMIN_PAGES.home}
                label="Home"
              />
              <SideMenuCollapsible
                title="Colaboradores"
                icon={<User2 size={20} />}
              >
                <MenuLink to={ADMIN_PAGES.listUsers} label="Usuários" />
                <MenuLink to={ADMIN_PAGES.listMeetings} label="Reuniões" />
                <MenuLink
                  to={ADMIN_PAGES.listExperts}
                  label="Solicitações de Experts"
                />
              </SideMenuCollapsible>
              <SideMenuCollapsible
                title="Solicitações Financeiras"
                icon={<DollarSign size={20} />}
              >
                <MenuLink to={ADMIN_PAGES.listPayments} label="Pagamentos" />
                <MenuLink to={ADMIN_PAGES.listPaymentRequest} label="Compras" />
                <MenuLink to={ADMIN_PAGES.listRefund} label="Reembolsos" />
              </SideMenuCollapsible>
              <SideMenuCollapsible
                title="Treinamentos"
                icon={<BookOpen size={20} />}
              >
                <MenuLink to={ADMIN_PAGES.listTrainings} label="Treinamentos" />
                <MenuLink to={ADMIN_PAGES.listModules} label="Módulos" />
                <MenuLink to={ADMIN_PAGES.listSubModules} label="Submódulos" />
                <MenuLink to={ADMIN_PAGES.listLessons} label="Aulas" />
              </SideMenuCollapsible>
              <SideMenuCollapsible
                title="Configurações"
                icon={<Settings size={20} />}
              >
                <MenuLink to={ADMIN_PAGES.permissions} label="Permissões" />
                <MenuLink
                  to={ADMIN_PAGES.listNotifications}
                  label="Notificações"
                />
                <MenuLink to={ADMIN_PAGES.questionario} label="Vaga vídeo" />
              </SideMenuCollapsible>
              <DropdownMenuSeparator />
            </nav>
          </div>
          <div className="flex h-[60px] items-center px-6">
            <div>
              <ModeToggle />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="" size="icon" variant="ghost">
                  <Settings />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Configurações</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Ajuda</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>Sair...</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <main className="bg-background flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
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
