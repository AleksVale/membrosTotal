"use client";

import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  Eye,
  FileText,
  GraduationCap,
  Settings,
  Shield,
  User,
  UserPlus,
} from "lucide-react";
import { useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import http from "@/lib/http";
import { QueryKeys } from "@/shared/constants/queryKeys";

interface UserPermissionsProps {
  searchTerm: string;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  _count?: {
    trainingPermissions: number;
    modulePermissions: number;
    submodulePermissions: number;
  };
}

interface UserPermissionDetail {
  trainings: Array<{
    id: number;
    title: string;
    status: string;
  }>;
  modules: Array<{
    id: number;
    title: string;
    training: {
      id: number;
      title: string;
    };
  }>;
  submodules: Array<{
    id: number;
    title: string;
    module: {
      id: number;
      title: string;
      training: {
        id: number;
        title: string;
      };
    };
  }>;
}

export function UserPermissions({ searchTerm }: UserPermissionsProps) {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const { data: users = [], isLoading: isLoadingUsers } = useQuery<User[]>({
    queryKey: QueryKeys.users.list(searchTerm),
    queryFn: async () => {
      const response = await http.get(`/user?name=${searchTerm}&per_page=50`);
      return response.data.data || [];
    },
    staleTime: 60000,
  });

  const { data: userPermissions, isLoading: isLoadingPermissions } =
    useQuery<UserPermissionDetail>({
      queryKey: ["user-permissions", selectedUserId],
      queryFn: async () => {
        if (!selectedUserId) return null;
        const response = await http.get(`/user/${selectedUserId}/permissions`);
        return response.data;
      },
      enabled: !!selectedUserId,
      staleTime: 60000,
    });

  const selectedUser = users.find((u) => u.id === selectedUserId);

  const handleViewDetails = (userId: number) => {
    setSelectedUserId(userId);
    setIsDetailDialogOpen(true);
  };

  const handleManagePermissions = (userId: number) => {
    // Navigate to user-specific permissions management
    window.location.href = `/admin/users/${userId}/permissions`;
  };

  const getUserInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ""}${
      lastName?.charAt(0) || ""
    }`.toUpperCase();
  };

  const getTotalPermissions = (user: User) => {
    return (
      (user._count?.trainingPermissions || 0) +
      (user._count?.modulePermissions || 0) +
      (user._count?.submodulePermissions || 0)
    );
  };

  if (isLoadingUsers) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-48 bg-muted rounded animate-pulse" />
                  <div className="h-3 w-32 bg-muted rounded animate-pulse" />
                </div>
                <div className="h-8 w-20 bg-muted rounded animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{users.length}</p>
                <p className="text-sm text-muted-foreground">Usuários Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {users.filter((u) => getTotalPermissions(u) > 0).length}
                </p>
                <p className="text-sm text-muted-foreground">Com Permissões</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">
                  {users.filter((u) => u.status === "ACTIVE").length}
                </p>
                <p className="text-sm text-muted-foreground">Usuários Ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">
                  {users.reduce((acc, u) => acc + getTotalPermissions(u), 0)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Permissões Total
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Usuários e Permissões
          </CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <User className="h-8 w-8 mb-2" />
              <p className="text-sm">
                {searchTerm
                  ? "Nenhum usuário encontrado"
                  : "Nenhum usuário disponível"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Status
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Treinamentos
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Módulos
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Submódulos
                    </TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => {
                    const totalPermissions = getTotalPermissions(user);

                    return (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs">
                                {getUserInitials(
                                  user?.firstName || "",
                                  user?.lastName || ""
                                )}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {user?.firstName || ""} {user?.lastName || ""}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge
                            variant={
                              user.status === "ACTIVE" ? "default" : "secondary"
                            }
                          >
                            {user.status === "ACTIVE" ? "Ativo" : "Inativo"}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-1">
                            <GraduationCap className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {user._count?.trainingPermissions || 0}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {user._count?.modulePermissions || 0}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {user._count?.submodulePermissions || 0}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              totalPermissions > 0 ? "default" : "secondary"
                            }
                          >
                            {totalPermissions}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-1 justify-end">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleViewDetails(user.id)}
                              title="Ver Detalhes"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleManagePermissions(user.id)}
                              title="Gerenciar Permissões"
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Detalhes de Permissões - {selectedUser?.firstName}{" "}
              {selectedUser?.lastName}
            </DialogTitle>
            <DialogDescription>
              Visualize todas as permissões concedidas a este usuário.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-auto space-y-6">
            {isLoadingPermissions ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <div className="h-5 w-32 bg-muted rounded animate-pulse" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-20 w-full bg-muted rounded animate-pulse" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : userPermissions ? (
              <>
                {/* Trainings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" />
                      Treinamentos ({userPermissions.trainings?.length || 0})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {userPermissions.trainings?.length > 0 ? (
                      <div className="space-y-2">
                        {userPermissions.trainings.map((training) => (
                          <div
                            key={training.id}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div>
                              <p className="font-medium">{training.title}</p>
                              <Badge
                                variant={
                                  training.status === "ACTIVE"
                                    ? "default"
                                    : "secondary"
                                }
                                className="text-xs"
                              >
                                {training.status === "ACTIVE"
                                  ? "Ativo"
                                  : "Inativo"}
                              </Badge>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                window.open(
                                  `/admin/trainings/${training.id}`,
                                  "_blank"
                                )
                              }
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Nenhum treinamento acessível
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Modules */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Módulos ({userPermissions.modules?.length || 0})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {userPermissions.modules?.length > 0 ? (
                      <div className="space-y-2">
                        {userPermissions.modules.map((module) => (
                          <div
                            key={module.id}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div>
                              <p className="font-medium">{module.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {module.training.title}
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                window.open(
                                  `/admin/modules/${module.id}`,
                                  "_blank"
                                )
                              }
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Nenhum módulo acessível
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Submodules */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Submódulos ({userPermissions.submodules?.length || 0})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {userPermissions.submodules?.length > 0 ? (
                      <div className="space-y-2">
                        {userPermissions.submodules.map((submodule) => (
                          <div
                            key={submodule.id}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div>
                              <p className="font-medium">{submodule.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {submodule.module.training.title} →{" "}
                                {submodule.module.title}
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                window.open(
                                  `/admin/submodules/${submodule.id}`,
                                  "_blank"
                                )
                              }
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Nenhum submódulo acessível
                      </p>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Shield className="h-8 w-8 mx-auto mb-2" />
                <p>Nenhuma permissão encontrada para este usuário</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
