"use client";

import { useRouter } from "next/navigation";
import { Plus, Loader2, UsersRound } from "lucide-react";

// API e Hooks
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "@/shared/constants/queryKeys";
import http from "@/lib/http";

// Componentes
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Module {
  id: number;
  title: string;
  description: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
  trainingId: number;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface TrainingTabsProps {
  trainingId: number;
  activeTab: string;
  onChangeTab: (tab: string) => void;
}

export function TrainingTabs({
  trainingId,
  activeTab,
  onChangeTab,
}: TrainingTabsProps) {
  const router = useRouter();

  // Buscar módulos deste treinamento
  const {
    data: modules,
    isLoading: isLoadingModules,
    isError: isErrorModules,
    refetch: refetchModules,
  } = useQuery({
    queryKey: QueryKeys.modules.list(trainingId),
    queryFn: async () => {
      const response = await http.get(
        `/training-modules-admin?trainingId=${trainingId}`
      );
      return response.data.data as Module[];
    },
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });

  // Buscar usuários com permissão para este treinamento
  const {
    data: users,
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: QueryKeys.trainings.permissions(trainingId),
    queryFn: async () => {
      const response = await http.get(
        `/training-admin/permissions/${trainingId}`
      );
      return response.data as User[];
    },
    staleTime: 60000,
    refetchOnWindowFocus: false,
    enabled: activeTab === "permissions",
  });

  return (
    <Tabs defaultValue={activeTab} onValueChange={onChangeTab}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="modules">Módulos</TabsTrigger>
        <TabsTrigger value="permissions">Permissões</TabsTrigger>
      </TabsList>

      <TabsContent value="modules">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Módulos do Treinamento</h2>
            <Button
              onClick={() =>
                router.push(`/admin/modules/new?trainingId=${trainingId}`)
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Módulo
            </Button>
          </div>

          {isLoadingModules ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : isErrorModules ? (
            <div className="text-center py-8">
              <p className="text-red-500 mb-2">Erro ao carregar módulos</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetchModules()}
              >
                Tentar novamente
              </Button>
            </div>
          ) : modules && modules.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ordem</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Descrição
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Criado em
                  </TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modules.map((module) => (
                  <TableRow key={module.id}>
                    <TableCell>{module.order}</TableCell>
                    <TableCell className="font-medium">
                      {module.title}
                    </TableCell>
                    <TableCell className="hidden md:table-cell line-clamp-1">
                      {module.description}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {format(new Date(module.createdAt), "dd/MM/yyyy", {
                        locale: ptBR,
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          router.push(`/admin/modules/${module.id}`)
                        }
                      >
                        Gerenciar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Este treinamento não possui módulos
              </p>
              <Button
                onClick={() =>
                  router.push(`/admin/trainings/${trainingId}/modules/new`)
                }
              >
                Criar primeiro módulo
              </Button>
            </div>
          )}
        </CardContent>
      </TabsContent>

      <TabsContent value="permissions">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Usuários com Acesso</h2>
            <Button
              onClick={() =>
                router.push(`/admin/permissions/training/${trainingId}`)
              }
            >
              <UsersRound className="h-4 w-4 mr-2" />
              Gerenciar Permissões
            </Button>
          </div>

          {isLoadingUsers ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : isErrorUsers ? (
            <div className="text-center py-8">
              <p className="text-red-500 mb-2">Erro ao carregar usuários</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetchUsers()}
              >
                Tentar novamente
              </Button>
            </div>
          ) : users && users.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Perfil</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{`${user.firstName} ${user.lastName}`}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.role === "admin" ? "default" : "secondary"
                        }
                      >
                        {user.role === "admin"
                          ? "Administrador"
                          : "Colaborador"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Nenhum usuário com acesso a este treinamento
              </p>
              <Button
                onClick={() =>
                  router.push(`/admin/permissions/training/${trainingId}`)
                }
              >
                Adicionar permissões
              </Button>
            </div>
          )}
        </CardContent>
      </TabsContent>
    </Tabs>
  );
}
