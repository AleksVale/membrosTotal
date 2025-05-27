"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import http from "@/lib/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/shared/constants/queryKeys";

import { ModuleForm, ModuleFormValues } from "../components/ModuleForm";

export default function NewModulePage() {
  const params = useParams();
  const trainingId = Number(params.id);
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mutação para criar módulo
  const createModuleMutation = useMutation({
    mutationFn: async (data: ModuleFormValues) => {
      const response = await http.post("/training-modules-admin", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.modules.all,
      });
      queryClient.invalidateQueries({
        queryKey: QueryKeys.trainings.detail(trainingId),
      });
    },
  });

  // Mutação para fazer upload da thumbnail
  const uploadThumbnailMutation = useMutation({
    mutationFn: async ({ id, file }: { id: number; file: File }) => {
      const formData = new FormData();
      formData.append("file", file);
      return http.post(`/training-modules-admin/${id}/file`, formData, {
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
      // Primeiro, criar o módulo
      const result = await createModuleMutation.mutateAsync(values);
      const moduleId = result.data.id;

      // Se tiver arquivo, enviar a thumbnail
      if (file) {
        await uploadThumbnailMutation.mutateAsync({
          id: moduleId,
          file,
        });
      }

      toast.success("Módulo criado com sucesso!");
      router.push(`/admin/trainings/${trainingId}/modules`);
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao criar módulo. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Novo Módulo</h1>
      <ModuleForm
        trainingId={trainingId}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
