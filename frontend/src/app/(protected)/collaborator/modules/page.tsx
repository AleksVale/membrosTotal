"use client";

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

import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface Module {
  id: number;
  title: string;
  description?: string;
  thumbnail?: string;
  order: number;
  trainingId: number;
  createdAt: string;
  updatedAt: string;
}

export default function CollaboratorModulesPage() {
  const searchParams = useSearchParams();
  const trainingId = searchParams.get("trainingId");

  const { data, isLoading, isError } = useQuery<Module[]>({
    queryKey: QueryKeys.collaborator.modules.list(trainingId || "all"),
    queryFn: async () => {
      console.log(
        "[DEBUG] Frontend: Fetching modules with trainingId:",
        trainingId
      );

      const response = await http.get("/collaborator/module-collaborator", {
        params: { trainingId: trainingId || undefined },
      });

      console.log("[DEBUG] Frontend: Modules API response:", response.data);
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

  const modules = data || [];

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
                Treinamento #{trainingId}
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
                    </div>
                    {module.description && (
                      <CardDescription className="line-clamp-2">
                        {module.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full">
                      <Link href={`/collaborator/modules/${module.id}`}>
                        Acessar Módulo
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
