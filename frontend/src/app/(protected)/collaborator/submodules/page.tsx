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
import { ArrowLeft, CheckCircle, Clock, Lock } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface Submodule {
  id: number;
  title: string;
  description: string;
  status: "COMPLETED" | "IN_PROGRESS" | "LOCKED";
  progress: number;
  moduleId: number;
  moduleTitle: string;
}

interface SubmodulesResponse {
  data: Submodule[];
  meta: {
    total: number;
    page: number;
    per_page: number;
    last_page: number;
  };
}

export default function CollaboratorSubmodulesPage() {
  const searchParams = useSearchParams();
  const moduleId = searchParams.get("moduleId");

  const { data, isLoading, isError } = useQuery<SubmodulesResponse>({
    queryKey: QueryKeys.collaborator.submodules.list(moduleId || "all"),
    queryFn: async () => {
      const response = await http.get("/collaborator/submodules-collaborator", {
        params: { moduleId: moduleId || undefined },
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
          Ocorreu um erro ao carregar os submódulos.
        </p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Tentar novamente
        </Button>
      </div>
    );
  }

  const submodules = data?.data || [];

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

  const groupedSubmodules = submodules.reduce<Record<number, Submodule[]>>(
    (acc, submodule) => {
      const moduleId = submodule.moduleId;
      if (!acc[moduleId]) {
        acc[moduleId] = [];
      }
      acc[moduleId].push(submodule);
      return acc;
    },
    {}
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meus Submódulos</h1>
          <p className="text-muted-foreground">
            Acesse os submódulos dos seus módulos
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/collaborator/modules">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Módulos
          </Link>
        </Button>
      </div>

      {submodules.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground mb-4">
              {moduleId
                ? "Nenhum submódulo encontrado para este módulo."
                : "Nenhum submódulo disponível no momento."}
            </p>
            {moduleId && (
              <Button asChild variant="outline">
                <Link href="/collaborator/submodules">
                  Ver todos os submódulos
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        Object.entries(groupedSubmodules).map(([moduleId, submodules]) => (
          <div key={moduleId} className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {submodules[0].moduleTitle}
              </h2>
              <Button asChild variant="outline" size="sm">
                <Link href={`/collaborator/modules/${moduleId}`}>
                  Ver módulo
                </Link>
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {submodules.map((submodule) => (
                <Card key={submodule.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">
                        {submodule.title}
                      </CardTitle>
                      {getStatusBadge(submodule.status)}
                    </div>
                    <CardDescription className="line-clamp-2">
                      {submodule.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="text-xs text-muted-foreground mb-1">
                        Progresso: {submodule.progress}%
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${submodule.progress}%` }}
                        />
                      </div>
                    </div>
                    <Button
                      asChild
                      className="w-full"
                      disabled={submodule.status === "LOCKED"}
                      variant={
                        submodule.status === "LOCKED" ? "secondary" : "default"
                      }
                    >
                      <Link href={`/collaborator/submodules/${submodule.id}`}>
                        {submodule.status === "LOCKED"
                          ? "Bloqueado"
                          : submodule.status === "COMPLETED"
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
