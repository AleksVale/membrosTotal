"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import http from "@/lib/http";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/shared/constants/queryKeys";

import {
  TrainingForm,
  TrainingFormValues,
} from "../../components/TrainingForm";

export default function EditTrainingPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const trainingId = Number(params.id);

  const {
    data: training,
    isLoading,
    isError,
  } = useQuery({
    queryKey: QueryKeys.trainings.detail(trainingId),
    queryFn: async () => {
      const response = await http.get(`/training-admin/${trainingId}`);
      return response.data.training;
    },
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });

  const updateTrainingMutation = useMutation({
    mutationFn: async (data: TrainingFormValues) => {
      const response = await http.patch(`/training-admin/${trainingId}`, data);
      return response.data;
    },
  });

  const uploadThumbnailMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      await http.post(`/training-admin/${trainingId}/file`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
  });

  const handleSubmit = async (values: TrainingFormValues, file?: File) => {
    try {
      setIsSubmitting(true);

      // Atualizar o treinamento
      await updateTrainingMutation.mutateAsync(values);

      // Se tiver arquivo, faz o upload
      if (file) {
        await uploadThumbnailMutation.mutateAsync(file);
      }

      // Invalidar queries para atualizar dados
      queryClient.invalidateQueries({ queryKey: QueryKeys.trainings.all });
      queryClient.invalidateQueries({
        queryKey: QueryKeys.trainings.detail(trainingId),
      });

      toast.success("Treinamento atualizado com sucesso!");
      router.push(`/admin/trainings/${trainingId}`);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar treinamento. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !training) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-red-500 mb-4">Erro ao carregar o treinamento</p>
        <button className="btn btn-outline" onClick={() => router.back()}>
          Voltar
        </button>
      </div>
    );
  }

  const initialData: TrainingFormValues & { id: number; thumbnail?: string } = {
    id: training.id,
    title: training.title,
    description: training.description,
    tutor: training.tutor,
    order: training.order || 0,
    status: training.status || "DRAFT",
    thumbnail: training.thumbnail || undefined,
  };

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Editar Treinamento</h1>
      <TrainingForm
        initialData={initialData}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
