import http from "@/lib/http";
import { QueryKeys } from "@/shared/constants/queryKeys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface Module {
  id: number;
  title: string;
  description: string;
  thumbnail?: string;
  order: number;
  trainingId: number;
  training?: {
    title: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface UpdateModuleData {
  title: string;
  description: string;
  order: number;
  trainingId: number;
}

// Hook para buscar um module individual
export function useModule(moduleId: number) {
  return useQuery<Module>({
    queryKey: QueryKeys.modules.detail(moduleId),
    queryFn: async () => {
      console.log("Fetching module with ID:", moduleId);
      try {
        const response = await http.get(`/training-modules-admin/${moduleId}`);
        console.log("API Response:", response.data);

        // Verificar se response.data tem a estrutura esperada
        if (!response.data || !response.data.module) {
          throw new Error("Estrutura de resposta inválida da API");
        }

        return response.data.module;
      } catch (error) {
        console.error("Erro ao buscar módulo:", error);
        throw error;
      }
    },
    enabled: !!moduleId && !isNaN(moduleId),
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });
}

// Hook para atualizar um module
export function useUpdateModule() {
  const queryClient = useQueryClient();

  return useMutation<Module, Error, { id: number; data: UpdateModuleData }>({
    mutationFn: async ({ id, data }) => {
      const response = await http.patch(`/training-modules-admin/${id}`, data);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      toast.success("Módulo atualizado com sucesso!");
      queryClient.invalidateQueries({
        queryKey: QueryKeys.modules.all,
      });
      queryClient.invalidateQueries({
        queryKey: QueryKeys.modules.detail(id),
      });
    },
    onError: (error) => {
      console.error("Erro ao atualizar módulo:", error);
      toast.error("Erro ao atualizar módulo. Tente novamente.");
    },
  });
}

// Hook para fazer upload da thumbnail
export function useUploadModuleThumbnail() {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean },
    Error,
    { moduleId: number; file: File }
  >({
    mutationFn: async ({ moduleId, file }) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await http.post(
        `/training-modules-admin/${moduleId}/file`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    },
    onSuccess: (_, { moduleId }) => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.modules.detail(moduleId),
      });
      queryClient.invalidateQueries({
        queryKey: QueryKeys.modules.all,
      });
    },
    onError: (error) => {
      console.error("Erro ao fazer upload da thumbnail:", error);
      toast.error("Erro ao fazer upload da imagem. Tente novamente.");
    },
  });
}
