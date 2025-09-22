"use client";

import { useQuery } from "@tanstack/react-query";
import { Plus, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
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
  const [searchTerm, setSearchTerm] = useState("");

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

  // Filtrar dados baseado na busca
  const filterTreeData = (data: TreeItem[], search: string): TreeItem[] => {
    if (!search.trim()) return data;

    const searchLower = search.toLowerCase();

    const filterRecursive = (items: TreeItem[]): TreeItem[] => {
      return items
        .map((item) => {
          const matchesTitle = item.title.toLowerCase().includes(searchLower);
          const matchesDescription = item.description
            ?.toLowerCase()
            .includes(searchLower);
          const matchesTutor = item.metadata?.tutor
            ?.toLowerCase()
            .includes(searchLower);

          const filteredChildren = item.children
            ? filterRecursive(item.children)
            : [];
          const hasMatchingChildren = filteredChildren.length > 0;

          if (
            matchesTitle ||
            matchesDescription ||
            matchesTutor ||
            hasMatchingChildren
          ) {
            return {
              ...item,
              children: filteredChildren,
            };
          }

          return null;
        })
        .filter(Boolean) as TreeItem[];
    };

    return filterRecursive(data);
  };

  // Handlers para ações
  const handleAdd = (parentId: number, type: TreeItem["type"]) => {
    toast.info(
      `Funcionalidade de adicionar ${type} será implementada em breve`
    );
    // TODO: Implementar navegação para forms de criação
  };

  const handleEdit = (item: TreeItem) => {
    toast.info(
      `Funcionalidade de editar ${item.type} será implementada em breve`
    );
    // TODO: Implementar navegação para forms de edição
  };

  const handleDelete = (item: TreeItem) => {
    toast.info(
      `Funcionalidade de excluir ${item.type} será implementada em breve`
    );
    // TODO: Implementar confirmação e exclusão
  };

  // Preparar dados
  const treeData = trainings ? convertToTreeData(trainings) : [];
  const filteredData = filterTreeData(treeData, searchTerm);

  // Calcular estatísticas
  const stats = {
    totalTrainings: treeData.length,
    totalModules: treeData.reduce(
      (acc, t) => acc + (t.children?.length || 0),
      0
    ),
    totalSubmodules: treeData.reduce(
      (acc, t) =>
        acc +
        (t.children?.reduce((acc2, m) => acc2 + (m.children?.length || 0), 0) ||
          0),
      0
    ),
    totalLessons: treeData.reduce(
      (acc, t) =>
        acc +
        (t.children?.reduce(
          (acc2, m) =>
            acc2 +
            (m.children?.reduce(
              (acc3, s) => acc3 + (s.children?.length || 0),
              0
            ) || 0),
          0
        ) || 0),
      0
    ),
  };

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
            Visualização hierárquica completa dos treinamentos estilo
            Kiwify/Hotmart
          </p>
        </div>
        <Button onClick={() => handleAdd(0, "training")}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Treinamento
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Treinamentos
            </CardTitle>
            <div className="text-2xl font-bold">{stats.totalTrainings}</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Módulos
            </CardTitle>
            <div className="text-2xl font-bold">{stats.totalModules}</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Submódulos
            </CardTitle>
            <div className="text-2xl font-bold">{stats.totalSubmodules}</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Aulas
            </CardTitle>
            <div className="text-2xl font-bold">{stats.totalLessons}</div>
          </CardHeader>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Busque por treinamentos, módulos, submódulos ou aulas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por título, descrição ou tutor..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Atualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Árvore de Treinamentos */}
      <div>
        <TreeView
          data={filteredData}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          showActions={true}
        />
      </div>
    </div>
  );
}
