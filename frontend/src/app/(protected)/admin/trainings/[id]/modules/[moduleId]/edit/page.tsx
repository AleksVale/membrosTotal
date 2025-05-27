"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import http from "@/lib/http";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/shared/constants/queryKeys";

import { ModuleForm, ModuleFormValues } from "../../components/ModuleForm";

export default function EditModulePage() {
  const params = useParams();
  const trainingId = Number(params.id);
  const moduleId = Number(params.moduleId);

  const router = useRouter();
  const queryClient = useQueryClient();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Buscar dados do módulo
  const { data, isLoading, error } = useQuery({
    queryKey: QueryKeys.modules.detail(moduleId),
    queryFn: async () => {
      const response = await http.get(`/training-modules-admin/${moduleId}`);
      return response.data.module;
    },
    enabled: !!moduleId,
  });

  // Mutação para atualizar módulo
  const updateModuleMutation = useMutation({
    mutationFn: async (data: ModuleFormValues) => {
      return http.patch(`/training-modules-admin/${moduleId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.modules.all,
      });
      queryClient.invalidateQueries({
        queryKey: QueryKeys.modules.detail(moduleId),
      });
    },
  });

  // Mutação para fazer upload da thumbnail
  const uploadThumbnailMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return http.post(`/training-modules-admin/${moduleId}/file`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
  });

  // Handler para envio do formulário
  const handleSubmit = async (values: ModuleFormValues, file?: File) => {
    setIsSubmitting(true);
    try {
      // Atualizar dados do módulo
      await updateModuleMutation.mutateAsync(values);

      // Se tiver arquivo, enviar a thumbnail
      if (file) {
        await uploadThumbnailMutation.mutateAsync(file);
      }

      toast.success("Módulo atualizado com sucesso!");
      router.push(`/admin/trainings/${trainingId}/modules`);
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao atualizar módulo. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando módulo...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-2">Erro ao carregar dados do módulo</p>
        <p className="text-muted-foreground mb-4">
          Tente novamente ou volte para a lista de módulos
        </p>
        <button
          className="text-primary hover:underline"
          onClick={() => router.push(`/admin/trainings/${trainingId}/modules`)}
        >
          Voltar para módulos
        </button>
      </div>
    );
  }

  const initialData = {
    id: data.id,
    title: data.title,
    description: data.description,
    trainingId: data.trainingId,
    order: data.order || 0,
    status: data.status || "PRIVATE",
    thumbnail: data.thumbnail || undefined,
  };

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Editar Módulo</h1>
      <ModuleForm
        initialData={initialData}
        trainingId={trainingId}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
