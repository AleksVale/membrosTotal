"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Clock,
  Book,
  Users,
  Award,
  Loader2,
} from "lucide-react";

// Hooks e API
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "@/shared/constants/queryKeys";
import http from "@/lib/http";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Componentes
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { TrainingTabs } from "../components/TrainingTabs";
import { Separator } from "@/components/ui/separator";

interface Training {
  id: number;
  title: string;
  description: string;
  tutor: string;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
  status?: string;
  order: number;
}

export default function TrainingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("modules");

  const trainingId = Number(params.id);

  const {
    data: training,
    isLoading,
    isError,
  } = useQuery({
    queryKey: QueryKeys.trainings.detail(trainingId),
    queryFn: async () => {
      const response = await http.get(`/training-admin/${trainingId}`);
      return response.data.training as Training;
    },
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });

  // Stats dinâmicos para este treinamento
  const { data: stats } = useQuery({
    queryKey: QueryKeys.trainings.stats(trainingId),
    queryFn: async () => {
      const response = await http.get(`/training-admin/${trainingId}/stats`);
      return response.data;
    },
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !training) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-red-500 mb-4">Erro ao carregar o treinamento</p>
        <Button variant="outline" onClick={() => router.back()}>
          Voltar
        </Button>
      </div>
    );
  }

  // Retorna o status visual
  const getStatusBadge = () => {
    switch (training.status) {
      case "ACTIVE":
        return <Badge className="ml-2">Ativo</Badge>;
      case "DRAFT":
        return (
          <Badge variant="outline" className="ml-2">
            Rascunho
          </Badge>
        );
      case "ARCHIVED":
        return (
          <Badge variant="secondary" className="ml-2">
            Arquivado
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* Cabeçalho com navegação e ações */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <Button
          onClick={() => router.push(`/admin/trainings/${training.id}/edit`)}
        >
          <Edit className="h-4 w-4 mr-2" />
          Editar Treinamento
        </Button>
      </div>

      {/* Detalhes do treinamento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Coluna da esquerda com imagem */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-0 relative aspect-video">
              {training.thumbnail ? (
                <Image
                  src={training.thumbnail}
                  alt={training.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover rounded-t-md"
                />
              ) : (
                <div className="bg-muted/30 h-full w-full flex items-center justify-center">
                  <p className="text-muted-foreground">Sem imagem</p>
                </div>
              )}
            </CardContent>
            <CardContent className="p-6">
              <div className="flex flex-col gap-3">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">
                    Criado em{" "}
                    {format(
                      new Date(training.createdAt),
                      "dd 'de' MMMM 'de' yyyy",
                      { locale: ptBR }
                    )}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">
                    Atualizado em{" "}
                    {format(
                      new Date(training.updatedAt),
                      "dd 'de' MMMM 'de' yyyy",
                      { locale: ptBR }
                    )}
                  </span>
                </div>
                <div className="flex items-center">
                  <Book className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">
                    {stats?.modules || 0} módulo
                    {stats?.modules !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">
                    {stats?.students || 0} aluno
                    {stats?.students !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex items-center">
                  <Award className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">
                    {stats?.completions || 0} conclus
                    {stats?.completions !== 1 ? "ões" : "ão"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coluna da direita com info e abas */}
        <div className="md:col-span-2">
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center mb-2">
                <h1 className="text-2xl font-bold">{training.title}</h1>
                {getStatusBadge()}
              </div>
              <p className="text-muted-foreground mb-4">
                {training.description}
              </p>
              <Separator className="my-4" />
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Professor</p>
                  <p className="font-medium">{training.tutor}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Ordem de exibição
                  </p>
                  <p className="font-medium">{training.order}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Abas para módulos e permissões */}
          <Card>
            <TrainingTabs
              trainingId={trainingId}
              activeTab={activeTab}
              onChangeTab={setActiveTab}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
