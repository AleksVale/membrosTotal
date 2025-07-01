"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loading } from "@/components/ui/loading";
import http from "@/lib/http";
import { QueryKeys } from "@/shared/constants/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Clock, Lock } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface Module {
  id: number;
  title: string;
  description: string;
  status: "COMPLETED" | "IN_PROGRESS" | "LOCKED";
  progress: number;
  trainingId: number;
  trainingTitle: string;
}

interface ModulesResponse {
  data: Module[];
  meta: {
    total: number;
    page: number;
    per_page: number;
    last_page: number;
  };
}

export default function CollaboratorModulesPage() {
  const searchParams = useSearchParams();
  const trainingId = searchParams.get("trainingId");

  const { data, isLoading, isError } = useQuery<ModulesResponse>({
    queryKey: QueryKeys.collaborator.modules.list(trainingId || "all"),
    queryFn: async () => {
      const response = await http.get("/collaborator/module-collaborator", {
        params: { trainingId: trainingId || undefined },
      });
      return response.data;
    },
    staleTime: 60000, // 1 minuto
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive mb-4">
          Ocorreu um erro ao carregar os módulos.
        </p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Tentar novamente
        </Button>
      </div>
    );
  }

  const modules = data?.data || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return (
          <Badge
            variant="default"
            className="bg-success text-success-foreground"
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Concluído
          </Badge>
        );
      case "IN_PROGRESS":
        return (
          <Badge
            variant="default"
            className="bg-primary text-primary-foreground"
          >
            <Clock className="h-3 w-3 mr-1" />
            Em andamento
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            <Lock className="h-3 w-3 mr-1" />
            Bloqueado
          </Badge>
        );
    }
  };

  const groupedModules = modules.reduce<Record<number, Module[]>>(
    (acc, module) => {
      const trainingId = module.trainingId;
      if (!acc[trainingId]) {
        acc[trainingId] = [];
      }
      acc[trainingId].push(module);
      return acc;
    },
    {}
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Meus Módulos</h1>
        <p className="text-muted-foreground">
          Acesse os módulos dos seus treinamentos
        </p>
      </div>

      {modules.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground mb-4">
              {trainingId
                ? "Nenhum módulo encontrado para este treinamento."
                : "Nenhum módulo disponível no momento."}
            </p>
            {trainingId && (
              <Button asChild variant="outline">
                <Link href="/collaborator/modules">Ver todos os módulos</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        Object.entries(groupedModules).map(([trainingId, modules]) => (
          <div key={trainingId} className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {modules[0].trainingTitle}
              </h2>
              <Button asChild variant="outline" size="sm">
                <Link href={`/collaborator/trainings/${trainingId}`}>
                  Ver treinamento
                </Link>
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {modules.map((module) => (
                <Card key={module.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{module.title}</CardTitle>
                      {getStatusBadge(module.status)}
                    </div>
                    <CardDescription className="line-clamp-2">
                      {module.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="text-xs text-muted-foreground mb-1">
                        Progresso: {module.progress}%
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${module.progress}%` }}
                        />
                      </div>
                    </div>
                    <Button
                      asChild
                      className="w-full"
                      disabled={module.status === "LOCKED"}
                      variant={
                        module.status === "LOCKED" ? "secondary" : "default"
                      }
                    >
                      <Link href={`/collaborator/modules/${module.id}`}>
                        {module.status === "LOCKED"
                          ? "Bloqueado"
                          : module.status === "COMPLETED"
                          ? "Revisar"
                          : "Continuar"}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
