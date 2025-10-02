"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";

import http from "@/lib/http";
import { use } from "react";
import { LessonForm, LessonFormData } from "../../components/LessonForm";
import { useLesson, useUpdateLesson } from "../../hooks/useLessonMutations";

interface EditLessonPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditLessonPage({ params }: EditLessonPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const lessonId = Number(id);

  const { data: lesson, isLoading } = useLesson(lessonId);
  const updateLesson = useUpdateLesson();

  const defaultValues = useMemo(() => {
    if (!lesson) return {};

    return {
      title: lesson.title,
      description: lesson.description || "",
      content: lesson.content,
      submoduleId: lesson.submoduleId,
      order: lesson.order,
      thumbnail: lesson.thumbnail,
    };
  }, [lesson]);

  const handleSubmit = async (data: LessonFormData, file?: File) => {
    try {
      await updateLesson.mutateAsync({
        id: lessonId,
        data,
      });

      // Upload thumbnail if provided
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        await http.post(`/lessons-admin/${lessonId}/file`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      router.push(`/admin/lessons/${lessonId}`);
    } catch (error) {
      console.error("Erro ao atualizar aula:", error);
    }
  };

  const handleCancel = () => {
    router.push(`/admin/lessons/${lessonId}`);
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

  if (!lesson) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-destructive">
            Erro ao carregar aula
          </h2>
          <p className="text-muted-foreground mt-2">
            A aula solicitada não foi encontrada.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Editar Aula</h1>
        <p className="text-muted-foreground mt-2">
          Atualize as informações da aula &ldquo;{lesson.title}&rdquo;.
        </p>
      </div>

      <LessonForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        defaultValues={defaultValues}
        isSubmitting={updateLesson.isPending}
        submitText="Atualizar Aula"
      />
    </div>
  );
}
