import http from "@/lib/http";
import { QueryKeys } from "@/shared/constants/queryKeys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface CreateSubmoduleData {
  title: string;
  description: string;
  moduleId: number;
  order: number;
}

interface UpdateSubmoduleData {
  title: string;
  description: string;
  moduleId: number;
  order: number;
}

interface Submodule {
  id: number;
  title: string;
  description: string;
  thumbnail?: string;
  order: number;
  moduleId: number;
  module: {
    id: number;
    title: string;
    trainingId: number;
    training?: {
      id: number;
      title: string;
    };
  };
  createdAt: string;
  updatedAt: string;
  lessonCount?: number;
}

export function useCreateSubmodule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSubmoduleData) => {
      const response = await http.post("/sub-modules-admin", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.submodules.all,
      });
      toast.success("Submódulo criado com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao criar submódulo:", error);
      toast.error("Erro ao criar submódulo. Tente novamente.");
    },
  });
}

export function useUpdateSubmodule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateSubmoduleData }) => {
      const response = await http.patch(`/sub-modules-admin/${id}`, data);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.submodules.all,
      });
      queryClient.invalidateQueries({
        queryKey: QueryKeys.submodules.detail(id),
      });
      toast.success("Submódulo atualizado com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao atualizar submódulo:", error);
      toast.error("Erro ao atualizar submódulo. Tente novamente.");
    },
  });
}

export function useDeleteSubmodule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await http.delete(`/sub-modules-admin/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.submodules.all,
      });
      toast.success("Submódulo excluído com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao excluir submódulo:", error);
      toast.error("Erro ao excluir submódulo. Tente novamente.");
    },
  });
}

export function useSubmodule(id: number) {
  return useQuery<Submodule>({
    queryKey: QueryKeys.submodules.detail(id),
    queryFn: async () => {
      const response = await http.get(`/sub-modules-admin/${id}`);
      return response.data.submodule; // Extrair apenas o submodule da resposta
    },
    enabled: !!id,
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });
}
