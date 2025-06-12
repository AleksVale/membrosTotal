"use client";

import { useQuery } from "@tanstack/react-query";
import { BookOpen, Eye, FileText, GraduationCap, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import http from "@/lib/http";
import { QueryKeys } from "@/shared/constants/queryKeys";

interface SubmodulePermissionsProps {
  searchTerm: string;
}

interface Submodule {
  id: number;
  title: string;
  description?: string;
  status: string;
  module: {
    id: number;
    title: string;
    training: {
      id: number;
      title: string;
    };
  };
  _count?: {
    Lesson: number;
  };
}

interface Training {
  id: number;
  title: string;
}

export function SubmodulePermissions({
  searchTerm,
}: SubmodulePermissionsProps) {
  const router = useRouter();
  const [trainingFilter, setTrainingFilter] = React.useState<string>("all");
  const [moduleFilter, setModuleFilter] = React.useState<string>("all");

  // Fetch submodules
  const { data: submodules = [], isLoading: isLoadingSubmodules } = useQuery<
    Submodule[]
  >({
    queryKey: QueryKeys.submodules.list(1, 50, searchTerm),
    queryFn: async () => {
      const response = await http.get(
        `/sub-modules-admin?title=${searchTerm}&per_page=50`
      );
      return response.data.data || [];
    },
    staleTime: 60000,
  });

  // Fetch trainings for filter
  const { data: trainings = [] } = useQuery<Training[]>({
    queryKey: QueryKeys.trainings.list(),
    queryFn: async () => {
      const response = await http.get("/training-admin?per_page=50");
      return response.data.data || [];
    },
    staleTime: 60000,
  });

  // Extract modules from submodules for filtering
  const modules = React.useMemo(() => {
    const uniqueModules = new Map();
    submodules.forEach((submodule) => {
      const moduleId = submodule.module.id;
      if (!uniqueModules.has(moduleId)) {
        uniqueModules.set(moduleId, {
          id: moduleId,
          title: submodule.module.title,
          trainingId: submodule.module.training.id,
        });
      }
    });
    return Array.from(uniqueModules.values());
  }, [submodules]);

  // Filter submodules based on selected filters and search term
  const filteredSubmodules = React.useMemo(() => {
    return submodules.filter((submodule) => {
      const trainingMatches =
        trainingFilter === "all" ||
        submodule.module.training.id.toString() === trainingFilter;

      const moduleMatches =
        moduleFilter === "all" ||
        submodule.module.id.toString() === moduleFilter;

      const searchMatches =
        searchTerm === "" ||
        submodule.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (submodule.description
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ??
          false) ||
        submodule.module.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        submodule.module.training.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      return trainingMatches && moduleMatches && searchMatches;
    });
  }, [submodules, trainingFilter, moduleFilter, searchTerm]);

  if (isLoadingSubmodules) {
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
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">
                  {filteredSubmodules.length}
                </p>
                <p className="text-sm text-muted-foreground">Submódulos</p>
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
                  {filteredSubmodules.reduce(
                    (acc, s) => acc + (s._count?.Lesson || 0),
                    0
                  )}
                </p>
                <p className="text-sm text-muted-foreground">Aulas Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {[...new Set(submodules.map((s) => s.module.id))].length}
                </p>
                <p className="text-sm text-muted-foreground">Módulos Únicos</p>
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
                  {
                    [...new Set(submodules.map((s) => s.module.training.id))]
                      .length
                  }
                </p>
                <p className="text-sm text-muted-foreground">
                  Treinamentos Únicos
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submodules List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Gerenciar Permissões de Submódulos
            </CardTitle>

            <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
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

              <Select value={moduleFilter} onValueChange={setModuleFilter}>
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Filtrar por módulo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os módulos</SelectItem>
                  {modules
                    .filter(
                      (m) =>
                        trainingFilter === "all" ||
                        m.trainingId.toString() === trainingFilter
                    )
                    .map((module) => (
                      <SelectItem key={module.id} value={module.id.toString()}>
                        {module.title}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredSubmodules.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <FileText className="h-8 w-8 mb-2" />
              <p className="text-sm">
                {searchTerm
                  ? "Nenhum submódulo encontrado"
                  : "Nenhum submódulo disponível"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredSubmodules.map((submodule) => (
                <div
                  key={submodule.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{submodule.title}</h3>
                      {submodule.description && (
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {submodule.description}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        <div className="text-xs text-muted-foreground">
                          {submodule.module.training.title} →{" "}
                          {submodule.module.title}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {submodule._count?.Lesson || 0} aula
                          {(submodule._count?.Lesson || 0) !== 1 ? "s" : ""}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(
                          `/admin/submodules/${submodule.id}`,
                          "_blank"
                        )
                      }
                      className="w-16 sm:w-auto"
                    >
                      <Eye className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Ver</span>
                    </Button>
                    <Button
                      size="sm"
                      onClick={() =>
                        router.push(
                          `/admin/permissions/submodule/${submodule.id}`
                        )
                      }
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

      {/* Estado Vazio - quando não há submódulos após filtragem */}
      {filteredSubmodules.length === 0 && !isLoadingSubmodules && (
        <div className="p-8 text-center">
          <div className="flex justify-center">
            <FileText className="h-12 w-12 text-muted-foreground opacity-50" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">
            Nenhum submódulo encontrado
          </h3>
          <p className="mt-2 text-muted-foreground">
            {searchTerm || trainingFilter !== "all" || moduleFilter !== "all"
              ? "Tente ajustar seus termos de busca ou filtros."
              : "Não há submódulos disponíveis para gerenciamento de permissões."}
          </p>
          <Button
            className="mt-4"
            variant="outline"
            onClick={() => {
              setTrainingFilter("all");
              setModuleFilter("all");
              if (searchTerm) router.push("/admin/permissions");
            }}
          >
            Limpar Filtros
          </Button>
        </div>
      )}

      {/* Permissions are now managed on a separate page */}
    </div>
  );
}
