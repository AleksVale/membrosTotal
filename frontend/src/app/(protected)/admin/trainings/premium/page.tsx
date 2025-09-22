"use client";

import { useQuery } from "@tanstack/react-query";
import { Plus, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loading } from "@/components/ui/loading";
import { TreeItem, TreeView } from "@/components/ui/tree-view";
import { toast } from "react-toastify";

import http from "@/lib/http";

// Tipos para o retorno da API
interface ApiTraining {
  id: number;
  title: string;
  description: string;
  tutor: string;
  order: number;
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";
  thumbnail?: string;
  Module: ApiModule[];
}

interface ApiModule {
  id: number;
  title: string;
  description?: string;
  thumbnail?: string;
  order: number;
  submodules: ApiSubmodule[];
}

interface ApiSubmodule {
  id: number;
  title: string;
  description?: string;
  thumbnail?: string;
  order: number;
  lessons: ApiLesson[];
}

interface ApiLesson {
  id: number;
  title: string;
  description?: string;
  content: string;
  thumbnail?: string;
  order: number;
}

export default function TrainingsPremiumPage() {
  const router = useRouter();

  // Buscar dados hierárquicos dos treinamentos
  const {
    data: trainings,
    isLoading,
    isError,
    refetch,
  } = useQuery<ApiTraining[]>({
    queryKey: ["trainings-hierarchy"],
    queryFn: async () => {
      const response = await http.get("/training-admin/hierarchy");
      return response.data;
    },
    staleTime: 300000, // 5 minutos
  });

  // Converter dados da API para o formato do TreeView
  const convertToTreeData = (trainings: ApiTraining[]): TreeItem[] => {
    return trainings
      .sort((a, b) => a.order - b.order)
      .map((training) => ({
        id: training.id,
        title: training.title,
        description: training.description,
        status: training.status,
        order: training.order,
        type: "training" as const,
        metadata: {
          thumbnail: training.thumbnail,
          tutor: training.tutor,
        },
        children: training.Module.sort((a, b) => a.order - b.order).map(
          (module) => ({
            id: module.id,
            title: module.title,
            description: module.description,
            order: module.order,
            type: "module" as const,
            metadata: {
              thumbnail: module.thumbnail,
            },
            children: module.submodules
              .sort((a, b) => a.order - b.order)
              .map((submodule) => ({
                id: submodule.id,
                title: submodule.title,
                description: submodule.description,
                order: submodule.order,
                type: "submodule" as const,
                metadata: {
                  thumbnail: submodule.thumbnail,
                },
                children: submodule.lessons
                  .sort((a, b) => a.order - b.order)
                  .map((lesson) => ({
                    id: lesson.id,
                    title: lesson.title,
                    description: lesson.description,
                    order: lesson.order,
                    type: "lesson" as const,
                    metadata: {
                      thumbnail: lesson.thumbnail,
                      content: lesson.content,
                    },
                  })),
              })),
          })
        ),
      }));
  };

  // Handlers para ações
  const handleAdd = (parentId: number, type: TreeItem["type"]) => {
    toast.info(`Adicionar ${type} em ${parentId} - Em desenvolvimento`);
  };

  const handleEdit = (item: TreeItem) => {
    switch (item.type) {
      case "training":
        router.push(`/admin/trainings/${item.id}/edit`);
        break;
      case "module":
        router.push(`/admin/trainings`);
        break;
      case "submodule":
        router.push(`/admin/submodules/${item.id}/edit`);
        break;
      case "lesson":
        router.push(`/admin/lessons/${item.id}/edit`);
        break;
      default:
        toast.info(`Editar ${item.type}: ${item.title} - Tipo não suportado`);
    }
  };

  const handleDelete = (item: TreeItem) => {
    toast.warn(`Excluir ${item.type}: ${item.title} - Em desenvolvimento`);
  };

  const treeData = trainings ? convertToTreeData(trainings) : [];

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-destructive mb-4">
              Erro ao carregar os treinamentos
            </p>
            <Button onClick={() => refetch()} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Treinamentos Premium
          </h1>
          <p className="text-muted-foreground">
            Visualização hierárquica completa dos treinamentos
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
          <Button onClick={() => handleAdd(0, "training")}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Treinamento
          </Button>
        </div>
      </div>

      {/* Árvore de Treinamentos */}
      <div>
        <TreeView
          data={treeData}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          showActions={true}
        />
      </div>
    </div>
  );
}
