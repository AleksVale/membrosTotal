"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowLeft, Edit, FileText, Trash } from "lucide-react";
import { notFound, useRouter } from "next/navigation";
import { use } from "react";

import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getImageUrl } from "@/lib/image-utils";
import Image from "next/image";

import { DeleteSubmoduleAlert } from "../components/DeleteSubmoduleAlert";
import { SubmodulePermissions } from "../components/SubmodulePermissions";
import {
  useDeleteSubmodule,
  useSubmodule,
} from "../hooks/useSubmoduleMutations";

interface SubmoduleDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function SubmoduleDetailPage({
  params,
}: SubmoduleDetailPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const submoduleId = parseInt(resolvedParams.id);

  if (isNaN(submoduleId)) {
    notFound();
  }

  const { data: submodule, isLoading, isError } = useSubmodule(submoduleId);
  const deleteSubmodule = useDeleteSubmodule();

  if (isError) {
    notFound();
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteSubmodule.mutateAsync(id);
      router.push("/admin/submodules");
    } catch {
      // Error handled by mutation
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/admin/submodules")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Submódulos
          </Button>

          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-96"></div>
          </div>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-48"></div>
            </CardHeader>
            <CardContent className="space-y-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!submodule) {
    notFound();
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/admin/submodules")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Submódulos
        </Button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">{submodule.title}</h1>
            <p className="text-muted-foreground">Detalhes do submódulo</p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() =>
                router.push(`/admin/submodules/${submodule.id}/edit`)
              }
            >
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>

            <Button
              variant="outline"
              onClick={() =>
                router.push(
                  `/admin/trainings/${submodule.module.trainingId}/modules/${submodule.moduleId}/submodules/${submodule.id}/lessons`
                )
              }
            >
              <FileText className="mr-2 h-4 w-4" />
              Gerenciar Aulas
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash className="mr-2 h-4 w-4" />
                  Excluir
                </Button>
              </AlertDialogTrigger>
              <DeleteSubmoduleAlert
                submoduleId={submodule.id}
                onDelete={handleDelete}
              />
            </AlertDialog>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Main Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Gerais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {submodule.thumbnail && (
              <div className="relative aspect-video w-full max-w-md rounded-lg overflow-hidden">
                <Image
                  src={getImageUrl(submodule.thumbnail) as string}
                  alt={submodule.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div>
              <h3 className="font-medium text-lg mb-2">Descrição</h3>
              <p className="text-muted-foreground">{submodule.description}</p>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-1">Ordem</h4>
                <Badge variant="secondary">{submodule.order}</Badge>
              </div>

              <div>
                <h4 className="font-medium mb-1">Total de Aulas</h4>
                <Badge variant="outline">
                  {submodule.lessonCount || 0} aula
                  {submodule.lessonCount !== 1 ? "s" : ""}
                </Badge>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <h4 className="font-medium text-foreground mb-1">Criado em</h4>
                {submodule.createdAt &&
                !isNaN(new Date(submodule.createdAt).getTime())
                  ? format(
                      new Date(submodule.createdAt),
                      "dd/MM/yyyy 'às' HH:mm",
                      {
                        locale: ptBR,
                      }
                    )
                  : "Data inválida"}
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-1">
                  Atualizado em
                </h4>
                {submodule.updatedAt &&
                !isNaN(new Date(submodule.updatedAt).getTime())
                  ? format(
                      new Date(submodule.updatedAt),
                      "dd/MM/yyyy 'às' HH:mm",
                      {
                        locale: ptBR,
                      }
                    )
                  : "Data inválida"}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Module Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Módulo e Treinamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Módulo</h4>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{submodule.module.title}</Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    router.push(
                      `/admin/trainings/${submodule.module.trainingId}/modules/${submodule.moduleId}`
                    )
                  }
                >
                  Ver módulo
                </Button>
              </div>
            </div>

            {submodule.module.training && (
              <div>
                <h4 className="font-medium mb-2">Treinamento</h4>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {submodule.module.training.title}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      router.push(
                        `/admin/trainings/${submodule.module.trainingId}`
                      )
                    }
                  >
                    Ver treinamento
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Permissions Management */}
        <SubmodulePermissions
          submoduleId={submodule.id}
          submoduleTitle={submodule.title}
        />
      </div>
    </div>
  );
}
