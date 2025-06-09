import http from "@/lib/http";
import { QueryKeys } from "@/shared/constants/queryKeys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface CreateLessonData {
  title: string;
  description?: string;
  content: string;
  submoduleId: number;
  order: number;
}

interface UpdateLessonData {
  title: string;
  description?: string;
  content: string;
  submoduleId: number;
  order: number;
}

interface Lesson {
  id: number;
  title: string;
  description?: string;
  content: string;
  thumbnail?: string;
  order: number;
  submoduleId: number;
  submodule: {
    id: number;
    title: string;
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
  };
  createdAt: string;
  updatedAt: string;
}

export function useCreateLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateLessonData) => {
      const response = await http.post("/lessons-admin", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.lessons.all,
      });
      toast.success("Aula criada com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao criar aula:", error);
      toast.error("Erro ao criar aula. Tente novamente.");
    },
  });
}

export function useUpdateLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateLessonData }) => {
      const response = await http.patch(`/lessons-admin/${id}`, data);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.lessons.all,
      });
      queryClient.invalidateQueries({
        queryKey: QueryKeys.lessons.detail(id),
      });
      toast.success("Aula atualizada com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao atualizar aula:", error);
      toast.error("Erro ao atualizar aula. Tente novamente.");
    },
  });
}

export function useDeleteLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await http.delete(`/lessons-admin/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.lessons.all,
      });
      toast.success("Aula excluída com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao excluir aula:", error);
      toast.error("Erro ao excluir aula. Tente novamente.");
    },
  });
}

export function useLesson(id: number) {
  return useQuery<Lesson>({
    queryKey: QueryKeys.lessons.detail(id),
    queryFn: async () => {
      const response = await http.get(`/lessons-admin/${id}`);
      return response.data.lesson; // Assuming similar structure to submodules
    },
    enabled: !!id,
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });
}
