"use client";

import { format, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowLeft, Calendar, Edit, Hash, Link, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getImageUrl } from "@/lib/image-utils";
import { DeleteLessonAlert } from "../components/DeleteLessonAlert";
import { useDeleteLesson, useLesson } from "../hooks/useLessonMutations";

interface LessonDetailPageProps {
  params: {
    id: string;
  };
}

export default function LessonDetailPage({ params }: LessonDetailPageProps) {
  const router = useRouter();
  const lessonId = Number(params.id);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: lesson, isLoading, error } = useLesson(lessonId);
  const deleteLesson = useDeleteLesson();

  const handleEdit = () => {
    router.push(`/admin/lessons/${lessonId}/edit`);
  };

  const handleBack = () => {
    router.push("/admin/lessons");
  };

  const handleDelete = async () => {
    try {
      await deleteLesson.mutateAsync(lessonId);
      router.push("/admin/lessons");
    } catch (error) {
      console.error("Erro ao deletar aula:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-destructive">
                Erro ao carregar aula
              </h2>
              <p className="text-muted-foreground mt-2">
                A aula solicitada não foi encontrada ou ocorreu um erro.
              </p>
              <Button onClick={handleBack} className="mt-4">
                Voltar para listagem
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (!isValid(date) || isNaN(date.getTime())) {
      return "Data inválida";
    }
    return format(date, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
  };

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <Button variant="outline" onClick={handleBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold text-foreground">{lesson.title}</h1>
          <p className="text-muted-foreground mt-2">
            Aula #{lesson.order} do submódulo &ldquo;{lesson.submodule.title}
            &rdquo;
          </p>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
            disabled={deleteLesson.isPending}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Thumbnail */}
          {lesson.thumbnail && (
            <Card>
              <CardHeader>
                <CardTitle>Thumbnail</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={getImageUrl(lesson.thumbnail) || "/placeholder.jpg"}
                    alt={`Thumbnail de ${lesson.title}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Description */}
          {lesson.description && (
            <Card>
              <CardHeader>
                <CardTitle>Descrição</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {lesson.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Content URL */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="h-5 w-5" />
                Conteúdo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-2 bg-muted rounded text-sm">
                  {lesson.content}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(lesson.content, "_blank")}
                >
                  Abrir
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Ordem:</span>
                <Badge variant="secondary">{lesson.order}</Badge>
              </div>

              <Separator />

              <div>
                <span className="text-sm font-medium">Submódulo</span>
                <p className="text-sm text-muted-foreground mt-1">
                  {lesson.submodule.title}
                </p>
              </div>

              <div>
                <span className="text-sm font-medium">Módulo</span>
                <p className="text-sm text-muted-foreground mt-1">
                  {lesson.submodule.module.title}
                </p>
              </div>

              {lesson.submodule.module.training && (
                <div>
                  <span className="text-sm font-medium">Treinamento</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    {lesson.submodule.module.training.title}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Datas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-sm font-medium">Criado em</span>
                <p className="text-sm text-muted-foreground mt-1">
                  {formatDate(lesson.createdAt)}
                </p>
              </div>

              <div>
                <span className="text-sm font-medium">Atualizado em</span>
                <p className="text-sm text-muted-foreground mt-1">
                  {formatDate(lesson.updatedAt)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteLessonAlert
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        isDeleting={deleteLesson.isPending}
        lessonTitle={lesson.title}
      />
    </div>
  );
}
