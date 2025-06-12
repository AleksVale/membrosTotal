"use client";

import { useQuery } from "@tanstack/react-query";
import { BookOpen, Eye, GraduationCap, Settings, Shield } from "lucide-react";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import http from "@/lib/http";
import { QueryKeys } from "@/shared/constants/queryKeys";

interface TrainingPermissionsProps {
  searchTerm: string;
}

interface Training {
  id: number;
  title: string;
  description?: string;
  status: string;
  _count?: {
    Module: number;
  };
}

export function TrainingPermissions({ searchTerm }: TrainingPermissionsProps) {
  const router = useRouter();
  const { data: trainings = [], isLoading: isLoadingTrainings } = useQuery<
    Training[]
  >({
    queryKey: QueryKeys.trainings.list(searchTerm),
    queryFn: async () => {
      const response = await http.get(
        `/training-admin?title=${searchTerm}&per_page=50`
      );
      return response.data.data || [];
    },
    staleTime: 60000,
  });

  if (isLoadingTrainings) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-9 w-32" />
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{trainings.length}</p>
                <p className="text-sm text-muted-foreground">Treinamentos</p>
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
                  {trainings.reduce(
                    (acc, t) => acc + (t._count?.Module || 0),
                    0
                  )}
                </p>
                <p className="text-sm text-muted-foreground">Módulos Total</p>
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
                  {trainings.filter((t) => t.status === "ACTIVE").length}
                </p>
                <p className="text-sm text-muted-foreground">Ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trainings List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Gerenciar Permissões de Treinamentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {trainings.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <GraduationCap className="h-8 w-8 mb-2" />
              <p className="text-sm">
                {searchTerm
                  ? "Nenhum treinamento encontrado"
                  : "Nenhum treinamento disponível"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {trainings.map((training) => (
                <div
                  key={training.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                      <GraduationCap className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{training.title}</h3>
                      {training.description && (
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {training.description}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        <Badge
                          variant={
                            training.status === "ACTIVE"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {training.status === "ACTIVE" ? "Ativo" : "Inativo"}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <BookOpen className="h-3 w-3" />
                          {training._count?.Module || 0} módulo
                          {(training._count?.Module || 0) !== 1 ? "s" : ""}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(`/admin/trainings/${training.id}`, "_blank")
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
                          `/admin/permissions/training/${training.id}`
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
    </div>
  );
}
