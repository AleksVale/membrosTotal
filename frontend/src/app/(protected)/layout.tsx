"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { ScrollArea } from "@/components/ui/scroll-area";
import http from "@/lib/http";
import { cn } from "@/lib/utils";
import { QueryKeys } from "@/shared/constants/queryKeys";
import { useQuery } from "@tanstack/react-query";
import {
  Bell,
  BookOpen,
  Calendar,
  DollarSign,
  FileText,
  Home,
  LogOut,
  Menu,
  Settings,
  User,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Tipos de usuário
type UserRole = "admin" | "employee" | "student";

interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  // Buscar perfil do usuário
  const { data: userProfile, isLoading } = useQuery<UserProfile>({
    queryKey: QueryKeys.users.profile,
    queryFn: async () => {
      try {
        const response = await http.get("/auth/me");
        return response.data;
      } catch (error) {
        console.error("Erro ao buscar perfil:", error);
        // Redirecionar para login se não autenticado
        router.push("/login");
        return null;
      }
    },
    staleTime: 300000, // 5 minutos
    refetchOnWindowFocus: false,
  });

  // Definir role do usuário quando os dados forem carregados
  useEffect(() => {
    if (userProfile) {
      setUserRole(userProfile.role);
    }
  }, [userProfile]);

  // Função para fazer logout
  const handleLogout = async () => {
    try {
      await http.post("/auth/logout");
      router.push("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  // Determinar se é admin ou colaborador baseado na URL
  const isAdminSection = pathname.startsWith("/admin");
  const isCollaboratorSection = pathname.startsWith("/collaborator");

  // Redirecionar para a seção correta baseado no perfil do usuário
  useEffect(() => {
    if (userProfile) {
      if (
        userProfile.role === "admin" &&
        !isAdminSection &&
        !pathname.startsWith("/profile") &&
        !pathname.startsWith("/settings")
      ) {
        router.push("/admin/dashboard");
      } else if (
        userProfile.role === "employee" &&
        !isCollaboratorSection &&
        !pathname.startsWith("/profile") &&
        !pathname.startsWith("/settings")
      ) {
        router.push("/collaborator/dashboard");
      }
    }
  }, [userProfile, isAdminSection, isCollaboratorSection, pathname, router]);

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
                {/* Menu para Administradores */}
                {userRole === "admin" && (
                  <>
                    <SidebarItem
                      href="/admin/dashboard"
                      icon={<Home size={20} />}
                      label="Dashboard"
                      active={pathname === "/admin/dashboard"}
                    />

                    <SidebarGroup label="Colaboradores">
                      <SidebarItem
                        href="/admin/users"
                        icon={<Users size={20} />}
                        label="Usuários"
                        active={pathname.startsWith("/admin/users")}
                      />
                      <SidebarItem
                        href="/admin/meetings"
                        icon={<Calendar size={20} />}
                        label="Reuniões"
                        active={pathname.startsWith("/admin/meetings")}
                      />
                      <SidebarItem
                        href="/admin/experts"
                        icon={<User size={20} />}
                        label="Experts"
                        active={pathname.startsWith("/admin/experts")}
                      />
                    </SidebarGroup>

                    <SidebarGroup label="Financeiro">
                      <SidebarItem
                        href="/admin/payments"
                        icon={<DollarSign size={20} />}
                        label="Pagamentos"
                        active={pathname.startsWith("/admin/payments")}
                      />
                      <SidebarItem
                        href="/admin/payment-requests"
                        icon={<DollarSign size={20} />}
                        label="Compras"
                        active={pathname.startsWith("/admin/payment-requests")}
                      />
                      <SidebarItem
                        href="/admin/refunds"
                        icon={<DollarSign size={20} />}
                        label="Reembolsos"
                        active={pathname.startsWith("/admin/refunds")}
                      />
                    </SidebarGroup>

                    <SidebarGroup label="Treinamentos">
                      <SidebarItem
                        href="/admin/trainings"
                        icon={<BookOpen size={20} />}
                        label="Treinamentos"
                        active={pathname.startsWith("/admin/trainings")}
                      />
                      <SidebarItem
                        href="/admin/modules"
                        icon={<BookOpen size={20} />}
                        label="Módulos"
                        active={pathname.startsWith("/admin/modules")}
                      />
                      <SidebarItem
                        href="/admin/submodules"
                        icon={<BookOpen size={20} />}
                        label="Submódulos"
                        active={pathname.startsWith("/admin/submodules")}
                      />
                      <SidebarItem
                        href="/admin/lessons"
                        icon={<BookOpen size={20} />}
                        label="Aulas"
                        active={pathname.startsWith("/admin/lessons")}
                      />
                    </SidebarGroup>

                    <SidebarGroup label="Configurações">
                      <SidebarItem
                        href="/admin/permissions"
                        icon={<Settings size={20} />}
                        label="Permissões"
                        active={pathname.startsWith("/admin/permissions")}
                      />
                      <SidebarItem
                        href="/admin/notifications"
                        icon={<Bell size={20} />}
                        label="Notificações"
                        active={pathname.startsWith("/admin/notifications")}
                      />
                    </SidebarGroup>
                  </>
                )}

                {/* Menu para Colaboradores */}
                {userRole === "employee" && (
                  <>
                    <SidebarItem
                      href="/collaborator/dashboard"
                      icon={<Home size={20} />}
                      label="Dashboard"
                      active={pathname === "/collaborator/dashboard"}
                    />

                    <SidebarGroup label="Treinamentos">
                      <SidebarItem
                        href="/collaborator/trainings"
                        icon={<BookOpen size={20} />}
                        label="Meus Treinamentos"
                        active={pathname.startsWith("/collaborator/trainings")}
                      />
                      <SidebarItem
                        href="/collaborator/modules"
                        icon={<FileText size={20} />}
                        label="Módulos"
                        active={pathname.startsWith("/collaborator/modules")}
                      />
                    </SidebarGroup>

                    <SidebarGroup label="Financeiro">
                      <SidebarItem
                        href="/collaborator/payment-requests"
                        icon={<DollarSign size={20} />}
                        label="Solicitações de Pagamento"
                        active={pathname.startsWith(
                          "/collaborator/payment-requests"
                        )}
                      />
                    </SidebarGroup>

                    <SidebarGroup label="Agenda">
                      <SidebarItem
                        href="/collaborator/meetings"
                        icon={<Calendar size={20} />}
                        label="Minhas Reuniões"
                        active={pathname.startsWith("/collaborator/meetings")}
                      />
                    </SidebarGroup>
                  </>
                )}
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
                        <AvatarImage
                          src={userProfile?.avatar || "/placeholder-user.jpg"}
                          alt={userProfile?.firstName || "User"}
                        />
                        <AvatarFallback>
                          {userProfile
                            ? `${userProfile.firstName.charAt(
                                0
                              )}${userProfile.lastName.charAt(0)}`
                            : "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {userProfile
                            ? `${userProfile.firstName} ${userProfile.lastName}`
                            : "Carregando..."}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {userProfile?.email || ""}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <User className="mr-2 h-4 w-4" />
                        <span>Perfil</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Configurações</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-destructive"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sair</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-foreground">
                  {userProfile?.firstName || "Usuário"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {userRole === "admin"
                    ? "Administrador"
                    : userRole === "employee"
                    ? "Colaborador"
                    : userRole === "student"
                    ? "Aluno"
                    : "Carregando..."}
                </p>
              </div>
              <ModeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className="md:hidden">
        <div className="fixed inset-0 z-40 flex">
          <div
            className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ease-linear duration-300 ${
              sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setSidebarOpen(false)}
          />

          <div
            className={`relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-card transition ease-in-out duration-300 transform ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <Menu className="h-6 w-6 text-white" />
              </button>
            </div>

            <div className="flex-shrink-0 flex items-center px-4">
              <Image
                src="/logo.png"
                alt="MembrosTotal Logo"
                width={32}
                height={32}
              />
              <span className="ml-2 font-bold text-xl">MembrosTotal</span>
            </div>
            <div className="mt-5 flex-1 h-0 overflow-y-auto">
              <nav className="px-2 space-y-1">
                {/* Conteúdo do menu mobile - similar ao desktop */}
                {/* Será renderizado baseado no userRole */}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 flex-shrink-0 h-16 bg-card border-b flex">
          <button
            type="button"
            className="md:hidden px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex"></div>
          </div>
        </div>

        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
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
