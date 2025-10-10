"use client";

import http from "@/lib/http";
import { QueryKeys } from "@/shared/constants/queryKeys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ArrowLeft,
  Edit,
  FileText,
  Loader2,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

// Componentes
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Tipos
interface Submodule {
  id: number;
  title: string;
  description: string;
  order: number;
  moduleId: number;
  createdAt: string;
  updatedAt: string;
  lessonCount?: number;
}

interface Module {
  id: number;
  title: string;
  description: string;
  trainingId: number;
  training?: {
    title: string;
  };
}

export default function SubmodulesPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const trainingId = Number(params.id);
  const moduleId = Number(params.moduleId);

  // Carregar dados do módulo
  const {
    data: moduleData,
    isLoading: isLoadingModule,
    isError: isErrorModule,
  } = useQuery({
    queryKey: QueryKeys.modules.detail(moduleId),
    queryFn: async () => {
      const response = await http.get(`/training-modules-admin/${moduleId}`);
      return response.data.module as Module;
    },
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });

  // Carregar submódulos
  const {
    data: submodules,
    isLoading: isLoadingSubmodules,
    isError: isErrorSubmodules,
    refetch: refetchSubmodules,
  } = useQuery<Submodule[]>({
    queryKey: QueryKeys.submodules.list(moduleId),
    queryFn: async () => {
      const response = await http.get(`/submodules-admin?moduleId=${moduleId}`);
      return response.data.data as Submodule[];
    },
    staleTime: 60000,
    refetchOnWindowFocus: false,
    enabled: !!moduleId,
  });

  // Mutação para exclusão
  const deleteSubmodule = useMutation({
    mutationFn: async (submoduleId: number) => {
      return http.delete(`/submodules-admin/${submoduleId}`);
    },
    onSuccess: () => {
      toast.success("Submódulo excluído com sucesso");
      queryClient.invalidateQueries({
        queryKey: QueryKeys.submodules.list(moduleId),
      });
    },
    onError: () => {
      toast.error("Erro ao excluir submódulo");
    },
  });

  // Casos de loading e erro
  if (isLoadingModule) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isErrorModule || !moduleData) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-500 mb-4">Erro ao carregar dados do módulo</p>
        <Button variant="outline" onClick={() => router.back()}>
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      {/* Cabeçalho com navegação e ações */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div className="ml-4">
            <h1 className="text-2xl font-bold">{moduleData.title}</h1>
            <p className="text-sm text-muted-foreground">
              {moduleData.training?.title
                ? `Treinamento: ${moduleData.training.title}`
                : null}
            </p>
          </div>
        </div>
        <Button
          onClick={() =>
            router.push(
              `/admin/trainings/${trainingId}/modules/${moduleId}/submodules/new`
            )
          }
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Novo Submódulo
        </Button>
      </div>

      {/* Listagem de submódulos */}
      <Card>
        <CardHeader>
          <CardTitle>Submódulos</CardTitle>
          <CardDescription>
            {submodules?.length || 0} submódulos encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingSubmodules ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : isErrorSubmodules ? (
            <div className="text-center py-8">
              <p className="text-red-500 mb-2">Erro ao carregar submódulos</p>
              <Button variant="outline" onClick={() => refetchSubmodules()}>
                Tentar novamente
              </Button>
            </div>
          ) : submodules && submodules.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Ordem</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Descrição
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Aulas</TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Criado em
                  </TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submodules.map((submodule) => (
                  <TableRow key={submodule.id}>
                    <TableCell>{submodule.order}</TableCell>
                    <TableCell className="font-medium">
                      {submodule.title}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="text-sm line-clamp-1">
                        {submodule.description}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {submodule.lessonCount || 0}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {format(new Date(submodule.createdAt), "dd/MM/yyyy", {
                        locale: ptBR,
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            router.push(
                              `/admin/trainings/${trainingId}/modules/${moduleId}/submodules/${submodule.id}/edit`
                            )
                          }
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            router.push(
                              `/admin/trainings/${trainingId}/modules/${moduleId}/submodules/${submodule.id}/lessons`
                            )
                          }
                          title="Gerenciar Aulas"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                              title="Excluir"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Excluir submódulo
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir este submódulo?
                                Esta ação não pode ser desfeita e também
                                excluirá todas as aulas relacionadas.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  deleteSubmodule.mutate(submodule.id)
                                }
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Confirmar exclusão
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Este módulo não possui submódulos
              </p>
              <Button
                onClick={() =>
                  router.push(
                    `/admin/trainings/${trainingId}/modules/${moduleId}/submodules/new`
                  )
                }
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Criar primeiro submódulo
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
