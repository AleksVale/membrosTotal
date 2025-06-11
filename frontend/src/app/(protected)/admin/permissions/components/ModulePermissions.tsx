"use client";

import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  Eye,
  FileText,
  GraduationCap,
  Settings,
  Shield,
} from "lucide-react";
import { useState } from "react";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import http from "@/lib/http";
import { QueryKeys } from "@/shared/constants/queryKeys";
import {
  useModulePermissions,
  useUpdateModulePermissions,
} from "../hooks/usePermissions";
import { PermissionManager } from "./PermissionManager";

interface ModulePermissionsProps {
  searchTerm: string;
}

interface Module {
  id: number;
  title: string;
  description?: string;
  status: string;
  order: number;
  training: {
    id: number;
    title: string;
    status: string;
  };
  _count?: {
    SubModule: number;
  };
}

interface Training {
  id: number;
  title: string;
}

export function ModulePermissions({ searchTerm }: ModulePermissionsProps) {
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [isManageDialogOpen, setIsManageDialogOpen] = useState(false);
  const [trainingFilter, setTrainingFilter] = useState<string>("all");

  // Fetch modules
  const { data: modules = [], isLoading: isLoadingModules } = useQuery<
    Module[]
  >({
    queryKey: QueryKeys.modules.list("all", searchTerm),
    queryFn: async () => {
      const response = await http.get(
        `/training-modules-admin?title=${searchTerm}&per_page=50`
      );
      return response.data.data || [];
    },
    staleTime: 60000,
  });

  // Fetch trainings for filter
  const { data: trainings = [] } = useQuery<Training[]>({
    queryKey: QueryKeys.trainings.list(),
    queryFn: async () => {
      const response = await http.get("/trainings-admin?per_page=50");
      return response.data.data || [];
    },
    staleTime: 60000,
  });

  // Fetch module permissions
  const { data: permissions = [], isLoading: isLoadingPermissions } =
    useModulePermissions(selectedModuleId || 0);

  const updatePermissions = useUpdateModulePermissions();

  const filteredModules = modules.filter((module) => {
    const trainingMatches =
      trainingFilter === "all" ||
      module.training.id.toString() === trainingFilter;

    const searchMatches =
      searchTerm === "" ||
      module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (module.description?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false) ||
      module.training.title.toLowerCase().includes(searchTerm.toLowerCase());

    return trainingMatches && searchMatches;
  });

  const selectedModule = modules.find((m) => m.id === selectedModuleId);

  const handleManagePermissions = (moduleId: number) => {
    setSelectedModuleId(moduleId);
    setIsManageDialogOpen(true);
  };

  const handleUpdatePermissions = async (data: {
    addedUsers?: number[];
    removedUsers?: number[];
    addRelatives?: boolean;
  }) => {
    if (!selectedModuleId) return;

    await updatePermissions.mutateAsync({
      moduleId: selectedModuleId,
      data,
    });
  };

  if (isLoadingModules) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-6 w-48 bg-muted rounded animate-pulse" />
              <div className="h-4 w-full bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                </div>
                <div className="h-9 w-32 bg-muted rounded animate-pulse" />
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
              <BookOpen className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{filteredModules.length}</p>
                <p className="text-sm text-muted-foreground">Módulos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">
                  {filteredModules.reduce(
                    (acc, m) => acc + (m._count?.SubModule || 0),
                    0
                  )}
                </p>
                <p className="text-sm text-muted-foreground">
                  Submódulos Total
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {[...new Set(modules.map((m) => m.training.id))].length}
                </p>
                <p className="text-sm text-muted-foreground">
                  Treinamentos Únicos
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">
                  {filteredModules.filter((m) => m.status === "ACTIVE").length}
                </p>
                <p className="text-sm text-muted-foreground">Ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Gerenciar Permissões de Módulos
            </CardTitle>

            <div className="mt-2 sm:mt-0">
              <Select value={trainingFilter} onValueChange={setTrainingFilter}>
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Filtrar por treinamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os treinamentos</SelectItem>
                  {trainings.map((training) => (
                    <SelectItem
                      key={training.id}
                      value={training.id.toString()}
                    >
                      {training.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredModules.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <BookOpen className="h-8 w-8 mb-2" />
              <p className="text-sm">
                {searchTerm || trainingFilter !== "all"
                  ? "Nenhum módulo encontrado"
                  : "Nenhum módulo disponível"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredModules.map((module) => (
                <div
                  key={module.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{module.title}</h3>
                      {module.description && (
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {module.description}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <GraduationCap className="h-3 w-3" />
                          <div className="flex items-center">
                            {module.training.title}
                          </div>
                        </div>
                        <Badge
                          variant={
                            module.status === "ACTIVE" ? "default" : "secondary"
                          }
                          className="text-xs"
                        >
                          {module.status === "ACTIVE" ? "Ativo" : "Inativo"}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <FileText className="h-3 w-3" />
                          {module._count?.SubModule || 0} submódulo
                          {(module._count?.SubModule || 0) !== 1 ? "s" : ""}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(`/admin/modules/${module.id}`, "_blank")
                      }
                      className="w-16 sm:w-auto"
                    >
                      <Eye className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Ver</span>
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleManagePermissions(module.id)}
                      className="flex-1 sm:flex-none"
                    >
                      <Settings className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Gerenciar</span>
                      <span className="sm:hidden">Permissões</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Estado Vazio */}
      {filteredModules.length === 0 && !isLoadingModules && (
        <div className="p-8 text-center">
          <div className="flex justify-center">
            <BookOpen className="h-12 w-12 text-muted-foreground opacity-50" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">
            Nenhum módulo encontrado
          </h3>
          <p className="mt-2 text-muted-foreground">
            {searchTerm
              ? "Tente ajustar seus termos de busca ou filtros."
              : "Não há módulos disponíveis para gerenciamento de permissões."}
          </p>
          <Button
            className="mt-4"
            variant="outline"
            onClick={() => {
              setTrainingFilter("all");
              if (searchTerm)
                window.location.href = "/admin/permissions/modules";
            }}
          >
            Limpar Filtros
          </Button>
        </div>
      )}

      {/* Permission Management Dialog */}
      <Dialog open={isManageDialogOpen} onOpenChange={setIsManageDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Gerenciar Permissões - {selectedModule?.title}
            </DialogTitle>
            <DialogDescription>
              Controle quais usuários têm acesso a este módulo e suas entidades
              relacionadas.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-auto">
            {selectedModuleId && (
              <PermissionManager
                title={selectedModule?.title || "Módulo"}
                description={`${selectedModule?.description || ""} (${
                  selectedModule?.training.title
                }
                })`}
                permissions={permissions}
                isLoading={isLoadingPermissions}
                onUpdatePermissions={handleUpdatePermissions}
                isUpdating={updatePermissions.isPending}
                entityType="module"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
