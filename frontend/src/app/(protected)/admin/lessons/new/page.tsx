"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

import http from "@/lib/http";
import { LessonForm, LessonFormData } from "../components/LessonForm";
import { useCreateLesson } from "../hooks/useLessonMutations";

export default function NewLessonPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const submoduleId = searchParams.get("submoduleId");

  const createLesson = useCreateLesson();

  const defaultValues = useMemo(
    () => ({
      submoduleId: submoduleId ? Number(submoduleId) : undefined,
      order: 1,
    }),
    [submoduleId]
  );

  const handleSubmit = async (data: LessonFormData, file?: File) => {
    try {
      const response = await createLesson.mutateAsync(data);

      // Upload thumbnail if provided
      if (file && response?.id) {
        const formData = new FormData();
        formData.append("file", file);

        await http.post(`/lessons-admin/${response.id}/file`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      router.push("/admin/lessons");
    } catch (error) {
      console.error("Erro ao criar aula:", error);
    }
  };

  const handleCancel = () => {
    router.push("/admin/lessons");
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Nova Aula</h1>
        <p className="text-muted-foreground mt-2">
          Preencha as informações para criar uma nova aula.
        </p>
      </div>

      <LessonForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        defaultValues={defaultValues}
        isSubmitting={createLesson.isPending}
        submitText="Criar Aula"
      />
    </div>
  );
}
