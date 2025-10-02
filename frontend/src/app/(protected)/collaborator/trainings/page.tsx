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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import http from "@/lib/http";
import { QueryKeys } from "@/shared/constants/queryKeys";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";

interface Training {
  id: number;
  title: string;
  description: string;
  tutor: string;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
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
      console.log("[DEBUG] Frontend: Fetching trainings with status:", status);

      const response = await http.get("/collaborator/training-collaborator", {
        params: { status },
      });

      console.log("[DEBUG] Frontend: API response:", response.data);
      return response.data ?? [];
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

  const trainings = data;

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
          {trainings?.data.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-muted-foreground mb-4">
                  Nenhum treinamento encontrado nesta categoria.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {trainings?.data.map((training) => (
                <Card key={training.id} className="overflow-hidden">
                  {training.thumbnail && (
                    <div
                      className="h-40 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${training.thumbnail})`,
                      }}
                    />
                  )}
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">
                        {training.title}
                      </CardTitle>
                      <div className="text-sm text-muted-foreground">
                        Tutor: {training.tutor}
                      </div>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {training.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full">
                      <Link href={`/collaborator/trainings/${training.id}`}>
                        Acessar Treinamento
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
