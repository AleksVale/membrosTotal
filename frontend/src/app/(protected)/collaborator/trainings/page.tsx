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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import http from "@/lib/http";
import { QueryKeys } from "@/shared/constants/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Training {
  id: number;
  title: string;
  description: string;
  status: "COMPLETED" | "IN_PROGRESS" | "NOT_STARTED";
  progress: number;
  coverImage?: string;
}

interface TrainingsResponse {
  data: Training[];
  meta: {
    total: number;
    page: number;
    per_page: number;
    last_page: number;
  };
}

export default function CollaboratorTrainingsPage() {
  const [activeTab, setActiveTab] = useState<string>("all");

  const { data, isLoading, isError } = useQuery<TrainingsResponse>({
    queryKey: QueryKeys.collaborator.trainings.list(activeTab),
    queryFn: async () => {
      const status = activeTab !== "all" ? activeTab : undefined;
      const response = await http.get("/collaborator/training-collaborator", {
        params: { status },
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
          Ocorreu um erro ao carregar os treinamentos.
        </p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Tentar novamente
        </Button>
      </div>
    );
  }

  const trainings = data?.data || [];

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
          <Badge variant="outline">
            <BookOpen className="h-3 w-3 mr-1" />
            Não iniciado
          </Badge>
        );
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Meus Treinamentos</h1>
        <p className="text-muted-foreground">
          Acesse e gerencie seus treinamentos
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="IN_PROGRESS">Em andamento</TabsTrigger>
          <TabsTrigger value="COMPLETED">Concluídos</TabsTrigger>
          <TabsTrigger value="NOT_STARTED">Não iniciados</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {trainings.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-muted-foreground mb-4">
                  Nenhum treinamento encontrado nesta categoria.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {trainings.map((training) => (
                <Card key={training.id} className="overflow-hidden">
                  {training.coverImage && (
                    <div
                      className="h-40 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${training.coverImage})`,
                      }}
                    />
                  )}
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">
                        {training.title}
                      </CardTitle>
                      {getStatusBadge(training.status)}
                    </div>
                    <CardDescription className="line-clamp-2">
                      {training.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="text-xs text-muted-foreground mb-1">
                        Progresso: {training.progress}%
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${training.progress}%` }}
                        />
                      </div>
                    </div>
                    <Button asChild className="w-full">
                      <Link href={`/collaborator/trainings/${training.id}`}>
                        {training.status === "NOT_STARTED"
                          ? "Iniciar"
                          : training.status === "COMPLETED"
                          ? "Revisar"
                          : "Continuar"}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
