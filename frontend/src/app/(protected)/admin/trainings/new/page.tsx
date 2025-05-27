"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import http from "@/lib/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/shared/constants/queryKeys";

import { TrainingForm, TrainingFormValues } from "../components/TrainingForm";

export default function NewTrainingPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createTrainingMutation = useMutation({
    mutationFn: async (data: TrainingFormValues) => {
      const response = await http.post("/training-admin", data);
      return response.data;
    },
  });

  const uploadThumbnailMutation = useMutation({
    mutationFn: async ({ id, file }: { id: number; file: File }) => {
      const formData = new FormData();
      formData.append("file", file);

      await http.post(`/training-admin/${id}/file`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
  });

  const handleSubmit = async (values: TrainingFormValues, file?: File) => {
    try {
      setIsSubmitting(true);

      // Primeiro criar o treinamento
      const result = await createTrainingMutation.mutateAsync(values);
      const trainingId = result.id;

      // Se tiver arquivo, faz o upload
      if (file) {
        await uploadThumbnailMutation.mutateAsync({
          id: trainingId,
          file,
        });
      }

      // Invalidar queries para atualizar listas
      queryClient.invalidateQueries({ queryKey: QueryKeys.trainings.all });

      toast.success("Treinamento criado com sucesso!");
      router.push("/admin/trainings");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar treinamento. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Novo Treinamento</h1>
      <TrainingForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
