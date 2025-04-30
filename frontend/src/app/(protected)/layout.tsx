"use client";

import { Suspense, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  BookOpen,
  DollarSign,
  Home,
  LogOut,
  Menu,
  Settings,
  User,
  Users,
  Calendar,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-1 min-h-0 bg-card border-r">
          <div className="flex items-center h-16 px-4 border-b bg-card">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="MembrosTotal Logo"
                width={32}
                height={32}
              />
              <span className="font-bold text-xl text-foreground">
                MembrosTotal
              </span>
            </div>
          </div>
          <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
            <ScrollArea className="flex-1 px-3">
              <nav className="flex-1 space-y-1">
                <SidebarItem
                  href="/dashboard"
                  icon={<Home size={20} />}
                  label="Dashboard"
                  active={pathname === "/dashboard"}
                />

                <SidebarGroup label="Colaboradores">
                  <SidebarItem
                    href="/users"
                    icon={<Users size={20} />}
                    label="Usuários"
                    active={pathname.startsWith("/users")}
                  />
                  <SidebarItem
                    href="/meetings"
                    icon={<Calendar size={20} />}
                    label="Reuniões"
                    active={pathname.startsWith("/meetings")}
                  />
                  <SidebarItem
                    href="/experts"
                    icon={<User size={20} />}
                    label="Experts"
                    active={pathname.startsWith("/experts")}
                  />
                </SidebarGroup>

                <SidebarGroup label="Financeiro">
                  <SidebarItem
                    href="/payments"
                    icon={<DollarSign size={20} />}
                    label="Pagamentos"
                    active={pathname.startsWith("/payments")}
                  />
                  <SidebarItem
                    href="/payment-requests"
                    icon={<DollarSign size={20} />}
                    label="Compras"
                    active={pathname.startsWith("/payment-requests")}
                  />
                  <SidebarItem
                    href="/refunds"
                    icon={<DollarSign size={20} />}
                    label="Reembolsos"
                    active={pathname.startsWith("/refunds")}
                  />
                </SidebarGroup>

                <SidebarGroup label="Treinamentos">
                  <SidebarItem
                    href="/trainings"
                    icon={<BookOpen size={20} />}
                    label="Treinamentos"
                    active={pathname.startsWith("/trainings")}
                  />
                  <SidebarItem
                    href="/modules"
                    icon={<BookOpen size={20} />}
                    label="Módulos"
                    active={pathname.startsWith("/modules")}
                  />
                  <SidebarItem
                    href="/submodules"
                    icon={<BookOpen size={20} />}
                    label="Submódulos"
                    active={pathname.startsWith("/submodules")}
                  />
                  <SidebarItem
                    href="/lessons"
                    icon={<BookOpen size={20} />}
                    label="Aulas"
                    active={pathname.startsWith("/lessons")}
                  />
                </SidebarGroup>

                <SidebarGroup label="Configurações">
                  <SidebarItem
                    href="/permissions"
                    icon={<Settings size={20} />}
                    label="Permissões"
                    active={pathname.startsWith("/permissions")}
                  />
                  <SidebarItem
                    href="/notifications"
                    icon={<Bell size={20} />}
                    label="Notificações"
                    active={pathname.startsWith("/notifications")}
                  />
                </SidebarGroup>
              </nav>
            </ScrollArea>
          </div>
          <div className="flex flex-shrink-0 p-4 border-t">
            <div className="flex items-center w-full">
              <div className="flex-shrink-0">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/placeholder-user.jpg" alt="User" />
                        <AvatarFallback>AD</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Administrador
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          admin@exemplo.com
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Perfil</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Configurações</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sair</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-foreground">Admin</p>
                <p className="text-xs text-muted-foreground">Administrador</p>
              </div>
              <ModeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 flex h-16 items-center justify-between border-b bg-card px-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <img src="/logo.png" alt="MembrosTotal Logo" className="h-8 w-8" />
          <span className="font-bold text-xl text-foreground">
            MembrosTotal
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile sidebar (off-canvas) */}
      <div
        className={cn(
          "fixed inset-0 z-40 md:hidden",
          sidebarOpen ? "block" : "hidden"
        )}
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar */}
        <div className="fixed inset-y-0 left-0 w-3/4 max-w-xs bg-card overflow-y-auto border-r">
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <div className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="MembrosTotal Logo"
                className="h-8 w-8"
              />
              <span className="font-bold text-xl text-foreground">
                MembrosTotal
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              &times;
            </Button>
          </div>
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="flex-1 space-y-1">
              <SidebarItem
                href="/dashboard"
                icon={<Home size={20} />}
                label="Dashboard"
                active={pathname === "/dashboard"}
              />

              <SidebarGroup label="Colaboradores">
                <SidebarItem
                  href="/users"
                  icon={<Users size={20} />}
                  label="Usuários"
                  active={pathname.startsWith("/users")}
                />
                <SidebarItem
                  href="/meetings"
                  icon={<Calendar size={20} />}
                  label="Reuniões"
                  active={pathname.startsWith("/meetings")}
                />
                <SidebarItem
                  href="/experts"
                  icon={<User size={20} />}
                  label="Experts"
                  active={pathname.startsWith("/experts")}
                />
              </SidebarGroup>

              <SidebarGroup label="Financeiro">
                <SidebarItem
                  href="/payments"
                  icon={<DollarSign size={20} />}
                  label="Pagamentos"
                  active={pathname.startsWith("/payments")}
                />
                <SidebarItem
                  href="/payment-requests"
                  icon={<DollarSign size={20} />}
                  label="Compras"
                  active={pathname.startsWith("/payment-requests")}
                />
                <SidebarItem
                  href="/refunds"
                  icon={<DollarSign size={20} />}
                  label="Reembolsos"
                  active={pathname.startsWith("/refunds")}
                />
              </SidebarGroup>

              <SidebarGroup label="Treinamentos">
                <SidebarItem
                  href="/trainings"
                  icon={<BookOpen size={20} />}
                  label="Treinamentos"
                  active={pathname.startsWith("/trainings")}
                />
                <SidebarItem
                  href="/modules"
                  icon={<BookOpen size={20} />}
                  label="Módulos"
                  active={pathname.startsWith("/modules")}
                />
                <SidebarItem
                  href="/submodules"
                  icon={<BookOpen size={20} />}
                  label="Submódulos"
                  active={pathname.startsWith("/submodules")}
                />
                <SidebarItem
                  href="/lessons"
                  icon={<BookOpen size={20} />}
                  label="Aulas"
                  active={pathname.startsWith("/lessons")}
                />
              </SidebarGroup>

              <SidebarGroup label="Configurações">
                <SidebarItem
                  href="/permissions"
                  icon={<Settings size={20} />}
                  label="Permissões"
                  active={pathname.startsWith("/permissions")}
                />
                <SidebarItem
                  href="/notifications"
                  icon={<Bell size={20} />}
                  label="Notificações"
                  active={pathname.startsWith("/notifications")}
                />
              </SidebarGroup>
            </nav>
          </ScrollArea>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col md:pl-64">
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto mt-16 md:mt-0">
          <Suspense fallback={<div>Carregando...</div>}>{children}</Suspense>
        </main>
      </div>
    </div>
  );
}

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

function SidebarItem({ href, icon, label, active }: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center px-3 py-2 text-sm font-medium rounded-md group",
        active
          ? "bg-primary text-primary-foreground"
          : "text-foreground hover:bg-muted"
      )}
    >
      <span className="mr-3">{icon}</span>
      {label}
    </Link>
  );
}

interface SidebarGroupProps {
  label: string;
  children: React.ReactNode;
}

function SidebarGroup({ label, children }: SidebarGroupProps) {
  return (
    <div className="space-y-1 py-2">
      <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {label}
      </h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
}
